import express from 'express';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';
import cors from 'cors';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize the Express application
const app = express();
app.use(cors())
app.use('/game-covers', express.static(join(__dirname, 'game-covers')));
app.use('/article-images', express.static(join(__dirname, 'article-images')));

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Initialize the Groq client
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// In-memory store for conversations
const conversations = {};
conversations['user'] = [];

// Load Backloggd game covers from committed games.json (updated by GitHub Actions daily)
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const gamesData = JSON.parse(fs.readFileSync(join(__dirname, 'games.json'), 'utf8'));
const backloggdGames = {
    completed: shuffle(gamesData.completed).slice(0, 10),
    playing: gamesData.playing,
};
console.log(`Backloggd: ${backloggdGames.completed.length} completed, ${backloggdGames.playing.length} playing (from games.json)`);

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
await initializeWebsiteContent();

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

app.get('/backloggd-games', (req, res) => {
    res.json(backloggdGames);
});

// Articles are markdown files with frontmatter, committed to backend/articles/
// (edited via the Decap CMS admin at /admin, which commits straight to this repo).
const ARTICLES_DIR = join(__dirname, 'articles');

app.get('/articles', (req, res) => {
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    const articles = files.map(file => {
        const { data } = matter(fs.readFileSync(join(ARTICLES_DIR, file), 'utf8'));
        return {
            slug: file.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
            author: data.author,
            teaser: data.teaser,
        };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(articles);
});

app.get('/articles/:slug', (req, res) => {
    const filePath = join(ARTICLES_DIR, `${req.params.slug}.md`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Article not found' });
    }

    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    res.json({
        title: data.title,
        date: data.date,
        author: data.author,
        body: content,
    });
});

// Decap CMS GitHub OAuth provider, so the /admin editor at the frontend can
// authenticate with GitHub and commit article changes directly to this repo.
// See: https://decapcms.org/docs/external-oauth-clients/
const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;

app.get('/auth', (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const params = new URLSearchParams({
        client_id: GITHUB_OAUTH_CLIENT_ID,
        scope: 'repo',
        redirect_uri: redirectUri,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                client_id: GITHUB_OAUTH_CLIENT_ID,
                client_secret: GITHUB_OAUTH_CLIENT_SECRET,
                code,
            }),
        });
        const { access_token, error } = await tokenResponse.json();

        if (error || !access_token) {
            return res.status(400).send(`OAuth error: ${error || 'no access_token returned'}`);
        }

        const message = JSON.stringify({ token: access_token, provider: 'github' });
        res.send(`
            <script>
                (function() {
                    function receiveMessage(e) {
                        window.opener.postMessage(
                            'authorization:github:success:${message}',
                            e.origin
                        );
                        window.removeEventListener('message', receiveMessage, false);
                    }
                    window.addEventListener('message', receiveMessage, false);
                    window.opener.postMessage('authorizing:github', '*');
                })();
            </script>
        `);
    } catch (err) {
        res.status(500).send(`OAuth error: ${err.message}`);
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
