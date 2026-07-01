import puppeteer from 'puppeteer';
import fs from 'fs';

const PLAYING_URL = 'https://backloggd.com/u/BigMike62/games/added/type:playing/';
const PLAYED_URL  = 'https://backloggd.com/u/BigMike62/games/added/type:played/';

async function dumpPage(url, outFile) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Dump full HTML
    const html = await page.content();
    fs.writeFileSync(outFile + '.html', html);

    // Also try to extract all img srcs and any elements with 'cover' or 'game' in class
    const imgData = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
            src: img.src,
            dataSrc: img.getAttribute('data-src'),
            className: img.className,
            alt: img.alt,
            parentClass: img.parentElement ? img.parentElement.className : ''
        }));
    });

    fs.writeFileSync(outFile + '_imgs.json', JSON.stringify(imgData, null, 2));

    // Log a snippet of the game list area
    const gameSection = await page.evaluate(() => {
        const candidates = document.querySelectorAll('[class*="game"], [class*="cover"], [class*="card"], [class*="grid"]');
        return Array.from(candidates).slice(0, 5).map(el => ({
            tag: el.tagName,
            className: el.className,
            innerHTML: el.innerHTML.slice(0, 500)
        }));
    });

    fs.writeFileSync(outFile + '_sections.json', JSON.stringify(gameSection, null, 2));

    console.log(`Dumped ${url} → ${outFile}.html, ${outFile}_imgs.json, ${outFile}_sections.json`);
    await browser.close();
}

(async () => {
    const scratchpad = 'C:/Users/User/AppData/Local/Temp/claude/c--Users-User-Documents-GitHub-portfolio-fullstack/49f67102-48fb-45c2-99b1-848056e2bfa3/scratchpad';
    await dumpPage(PLAYING_URL, `${scratchpad}/backloggd_playing`);
    await dumpPage(PLAYED_URL,  `${scratchpad}/backloggd_played`);
    console.log('Done.');
})();
