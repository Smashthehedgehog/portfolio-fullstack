import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COVERS_DIR = join(__dirname, '../game-covers');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PUPPETEER_LAUNCH_OPTS = { args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] };

const BACKLOGGD_PLAYING_URL = 'https://backloggd.com/u/BigMike62/games/added/type:playing/';
const BACKLOGGD_PLAYED_URL  = 'https://backloggd.com/u/BigMike62/games/added/type:played/';

// Backloggd sits behind Anubis, a proof-of-work bot challenge that only
// resolves once its JS runs in a real browser engine, so a plain fetch()
// just gets served the challenge page. Puppeteer lets the challenge solve
// itself like it would in any other browser.
const scrape = async (browser, url) => {
    const page = await browser.newPage();
    try {
        await page.setUserAgent(USER_AGENT);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        // Anubis's proof-of-work runs in a Web Worker with no network activity,
        // so networkidle0 can resolve while still on the challenge page; once
        // the worker finishes it redirects to the real page. That redirect can
        // land at any moment, including mid-read, which destroys the page's JS
        // execution context — so retry until we read a stable, non-challenge page.
        let html;
        for (let attempt = 1; ; attempt++) {
            try {
                html = await page.content();
                if (!html.includes('Making sure you')) break;
            } catch (err) {
                if (!err.message.includes('Execution context was destroyed')) throw err;
            }
            if (attempt >= 6) throw new Error(`Anubis challenge never settled for ${url}`);
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
        }
        const $ = load(html);
        return $('img.card-img')
            .map((_, el) => $(el).attr('src'))
            .get()
            .filter(src => src && !src.includes('no_avatar'));
    } finally {
        await page.close();
    }
};

// Download a cover image to disk, keyed by its unique CDN filename, and
// return the local path the backend will serve it from.
const downloadCover = async (url) => {
    const filename = basename(new URL(url).pathname);
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    writeFileSync(join(COVERS_DIR, filename), Buffer.from(await res.arrayBuffer()));
    return `/game-covers/${filename}`;
};

// Scraped sequentially, not in parallel: two pages racing the Anubis
// challenge cookie in the same browser context intermittently caused one
// of them to come back empty.
const browser = await puppeteer.launch(PUPPETEER_LAUNCH_OPTS);
let completedUrls, playingUrls;
try {
    completedUrls = await scrape(browser, BACKLOGGD_PLAYED_URL);
    playingUrls = await scrape(browser, BACKLOGGD_PLAYING_URL);
} finally {
    await browser.close();
}

mkdirSync(COVERS_DIR, { recursive: true });

const uniqueUrls = [...new Set([...completedUrls, ...playingUrls])];
const urlToPath = {};
await Promise.all(uniqueUrls.map(async (url) => {
    urlToPath[url] = await downloadCover(url);
}));

// Prune covers for games that dropped off either list.
const keepFilenames = new Set(Object.values(urlToPath).map(path => basename(path)));
for (const file of readdirSync(COVERS_DIR)) {
    if (!keepFilenames.has(file)) unlinkSync(join(COVERS_DIR, file));
}

const completed = completedUrls.map(url => urlToPath[url]);
const playing = playingUrls.map(url => urlToPath[url]);

const out = { completed, playing, updatedAt: new Date().toISOString() };
writeFileSync(join(__dirname, '../games.json'), JSON.stringify(out, null, 2));
console.log(`Wrote ${completed.length} completed, ${playing.length} playing (${uniqueUrls.length} covers downloaded) → backend/games.json`);
