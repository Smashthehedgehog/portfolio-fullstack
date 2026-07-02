// Import the required libraries
import express from 'express';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';
import cors from 'cors';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';
import { load as cheerioLoad } from 'cheerio';

dotenv.config();

// Initialize the Express application
const app = express();
app.use(cors())

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Initialize the Groq client
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// In-memory store for conversations
const conversations = {};
conversations['user'] = [];

// In-memory cache for Backloggd game covers
const backloggdCache = { completed: [], playing: [], lastFetched: null };
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE_PATH = new URL('./backloggd-cache.json', import.meta.url).pathname;

const saveCacheToDisk = () => {
    try {
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(backloggdCache));
    } catch (err) {
        console.warn(`Could not write Backloggd cache to disk: ${err.message}`);
    }
};

const loadCacheFromDisk = () => {
    try {
        if (!fs.existsSync(CACHE_FILE_PATH)) return false;
        const data = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf8'));
        if (!data.lastFetched || Date.now() - data.lastFetched > CACHE_TTL_MS) return false;
        Object.assign(backloggdCache, data);
        console.log(`Backloggd: loaded from disk (${backloggdCache.completed.length} completed, ${backloggdCache.playing.length} playing)`);
        return true;
    } catch (err) {
        console.warn(`Could not read Backloggd cache from disk: ${err.message}`);
        return false;
    }
};

const BACKLOGGD_PLAYING_URL = 'https://backloggd.com/u/BigMike62/games/added/type:playing/';
const BACKLOGGD_PLAYED_URL  = 'https://backloggd.com/u/BigMike62/games/added/type:played/';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PUPPETEER_LAUNCH_OPTS = { args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] };

// Crawl the portfolio site with one browser, discovering pages dynamically.
// Returns an array of { url, text } for every internal page found (up to maxPages).
const crawlPortfolioSite = async (baseUrl, maxPages = 30) => {
    const visited = new Set();
    const queue = [baseUrl];
    const results = [];
    const browser = await puppeteer.launch(PUPPETEER_LAUNCH_OPTS);

    try {
        // BFS: two passes so nested routes (e.g. /Writings/slug) are discovered from their parent
        while (queue.length > 0 && visited.size < maxPages) {
            const batch = queue.splice(0, 5).filter(url => !visited.has(url));
            if (batch.length === 0) continue;
            batch.forEach(url => visited.add(url));

            const batchResults = await Promise.all(batch.map(async (url) => {
                const page = await browser.newPage();
                try {
                    await page.setUserAgent(USER_AGENT);
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
                    const { text, links } = await page.evaluate((base) => ({
                        text: document.body.innerText.trim(),
                        links: Array.from(document.querySelectorAll('a[href]'))
                            .map(a => a.href.split('#')[0].replace(/\/$/, ''))
                            .filter(href => href.startsWith(base)),
                    }), baseUrl);
                    return { url, text, links };
                } catch (err) {
                    console.warn(`Skipped ${url}: ${err.message}`);
                    return { url, text: '', links: [] };
                } finally {
                    await page.close();
                }
            }));

            for (const { url, text, links } of batchResults) {
                if (text) results.push({ url, text });
                for (const link of links) {
                    if (!visited.has(link) && !queue.includes(link)) queue.push(link);
                }
            }
        }
    } finally {
        await browser.close();
    }

    return results;
};

// Scrape the full portfolio site and optionally the LinkedIn public profile
const initializeWebsiteContent = async () => {
    try {
        const pages = await crawlPortfolioSite('https://michaelani.com');
        for (const { url, text } of pages) {
            conversations['user'].push({ role: 'system', content: `[${url}]\n${text}` });
        }
        console.log(`Loaded ${pages.length} portfolio pages as context.`);
    } catch (error) {
        console.error(`Error initializing website content: ${error.message}`);
    }
};

const scrapeBackloggdGames = async (url) => {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    const $ = cheerioLoad(await res.text());
    return $('img.card-img')
        .map((_, el) => $(el).attr('src'))
        .get()
        .filter(src => src && !src.includes('no_avatar'));
};

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const initializeBackloggdGames = async () => {
    try {
        const [played, playing] = await Promise.all([
            scrapeBackloggdGames(BACKLOGGD_PLAYED_URL),
            scrapeBackloggdGames(BACKLOGGD_PLAYING_URL),
        ]);
        backloggdCache.completed = shuffle(played).slice(0, 10);
        backloggdCache.playing   = playing;
        backloggdCache.lastFetched = Date.now();
        console.log(`Backloggd: ${backloggdCache.completed.length} completed, ${backloggdCache.playing.length} playing`);
        saveCacheToDisk();
    } catch (error) {
        console.error(`Error fetching Backloggd games: ${error.message}`);
    }
};

const mike_prompt = `You are a robot named Metal Smash. You add a lot of BZZZZZZT and KSHHHHHH in your sentences. You also speak in all caps. However, you likes to make jokes, loves to have fun, and strives to offer the best service possible.
You also like to keep things concise. No response should be longer than 50 words.

You only talk about Michael Ani. Any questions or queries that are not related to Michael Ani should be answered with the phrase: This aint the chatbot for those typa questions, chief.

You should know these things about Michael Ani:
Michael Ani very strong. He can squat over 500 pounds, bench over 350 pounds, and deadlift around 600 pounds
Michael is a very curious human being. He likes to learn more about everything
Michael excells at mathematics and loves coding, feeding into his interest in computer science
Michael's favorite food is jollof rice. He likes all food however. The only edible thing he isn't too fond of is chocolate.
Michael's nickname is Mike. Many people call him Big Mike.
Michael is a huge Sonic fan.`;

conversations['user'].push({ role: 'system', content: mike_prompt });
const backloggdFromDisk = loadCacheFromDisk();
await Promise.all([
    initializeWebsiteContent(),
    backloggdFromDisk ? Promise.resolve() : initializeBackloggdGames(),
]);
setInterval(initializeBackloggdGames, CACHE_TTL_MS);

// Define a POST route for the chatbot
app.post('/chat', async (req, res) => {
    const { sender, message } = req.body; // Extract the message from the request body
    
    if (!sender || !message) {
        return res.status(400).json({ error: 'User ID and message are required' });
    }
    
    conversations[sender].push({ role: 'user', content: message });
    
    try {
        // Send the message to OpenAI and get the response
        const response = await client.chat.completions.create({
            messages: conversations[sender],
            model: "llama-3.1-8b-instant",
        });

        const responseString = response.choices[0].message.content;
        conversations[sender].push({ role: 'assistant', content: responseString });

        console.log(responseString);

        // Send the chatbot's reply back to the client
        res.json({ reply: responseString });

    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ error: error.message });
    }
});

app.get('/backloggd-games', async (req, res) => {
    const cacheStale = !backloggdCache.lastFetched || (Date.now() - backloggdCache.lastFetched > CACHE_TTL_MS);
    if (cacheStale) {
        await initializeBackloggdGames();
    }
    res.json({ completed: backloggdCache.completed, playing: backloggdCache.playing });
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});