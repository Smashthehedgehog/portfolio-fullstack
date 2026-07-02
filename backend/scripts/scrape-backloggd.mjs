import { load } from 'cheerio';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const BACKLOGGD_PLAYING_URL = 'https://backloggd.com/u/BigMike62/games/added/type:playing/';
const BACKLOGGD_PLAYED_URL  = 'https://backloggd.com/u/BigMike62/games/added/type:played/';

const scrape = async (url) => {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const $ = load(await res.text());
    return $('img.card-img')
        .map((_, el) => $(el).attr('src'))
        .get()
        .filter(src => src && !src.includes('no_avatar'));
};

const [completed, playing] = await Promise.all([
    scrape(BACKLOGGD_PLAYED_URL),
    scrape(BACKLOGGD_PLAYING_URL),
]);

const out = { completed, playing, updatedAt: new Date().toISOString() };
writeFileSync(join(__dirname, '../games.json'), JSON.stringify(out, null, 2));
console.log(`Wrote ${completed.length} completed, ${playing.length} playing → backend/games.json`);
