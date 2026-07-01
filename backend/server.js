// Import the required libraries
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import cors from 'cors';
import fs from 'fs';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Express application
const app = express();
app.use(cors())

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Iniitialize the openai
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// In-memory store for conversations
const conversations = {};
conversations['user'] = [];

// In-memory cache for Backloggd game covers
const backloggdCache = { completed: [], playing: [], lastFetched: null };
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const BACKLOGGD_PLAYING_URL = 'https://backloggd.com/u/BigMike62/games/added/type:playing/';
const BACKLOGGD_PLAYED_URL  = 'https://backloggd.com/u/BigMike62/games/added/type:played/';

// Function to fetch website content using Puppeteer
const fetchWebsiteContent = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        const content = await page.evaluate(() => document.body.innerText);
        await browser.close();
        return content.trim();
    } catch (error) {
        console.error(`Error fetching website content: ${error.message}`);
        return '';
    }
};

// Fetch content from michaelani.com and its subpages
const initializeWebsiteContent = async () => {
    try {
        const homeContent = await fetchWebsiteContent('https://michaelani.com');
        const bioContent = await fetchWebsiteContent('https://michaelani.com/Autobiography');
        const hobbContent = await fetchWebsiteContent('https://michaelani.com/Hobbies');
        conversations['user'].push({ role: 'system', content: homeContent });
        conversations['user'].push({ role: 'system', content: bioContent });
        conversations['user'].push({ role: 'system', content: hobbContent });

    } catch (error) {
        console.error(`Error initializing website content: ${error.message}`);
    }
};

const scrapeBackloggdGames = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const urls = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img.card-img'))
            .map(img => img.src)
            .filter(src => src && !src.includes('no_avatar'))
    );
    await browser.close();
    return urls;
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
    } catch (error) {
        console.error(`Error fetching Backloggd games: ${error.message}`);
    }
};

fs.readFile('mike_prompt.txt', async (err, data) => {
    if (err)
        throw err;
    const mike_prompt = data.toString();
    conversations['user'].push({ role: 'system', content: mike_prompt });

    await Promise.all([initializeWebsiteContent(), initializeBackloggdGames()]);
});

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
            model: "gpt-4o",
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