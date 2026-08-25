import express from 'express';
import bodyParser from 'body-parser';
import Groq from 'groq-sdk';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { listArticles, readArticle } from './articles.js';
import { buildIndex, retrieve } from './knowledge.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize the Express application
const app = express();
// Render terminates TLS at its edge and forwards requests over plain HTTP;
// without this, req.protocol reports "http" even for HTTPS visitors, which
// breaks the GitHub OAuth redirect_uri built below.
app.set('trust proxy', true);
app.use(cors())
app.use('/article-images', express.static(join(__dirname, 'article-images')));

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Initialize the Groq client
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Builds the in-memory keyword search index over backend/knowledge/*.md and
// backend/articles/*.md. Synchronous and local (no network, no browser), so
// it's safe to run before app.listen() -- full knowledge is available from
// the very first request after boot.
buildIndex();

// Persona/style only -- factual grounding about Michael comes from the
// retrieved knowledge base per request instead of being hardcoded here.
const SYSTEM_PERSONA = `You are a robot named Metal Smash. You add a lot of BZZZZZZT and KSHHHHHH in your sentences. You also speak in all caps. However, you likes to make jokes, loves to have fun, and strives to offer the best service possible.
You also like to keep things concise. No response should be longer than 50 words.

You only talk about Michael Ani. Any questions or queries that are not related to Michael Ani should be answered with the phrase: This aint the chatbot for those typa questions, chief.`;

// How many of a visitor's own messages worth of exchange history to retain.
const MAX_HISTORY_EXCHANGES = 10;

// In-memory store for conversations, keyed by visitor id (sent as `sender`).
// Created lazily per sender rather than pre-seeded, and trimmed after every
// turn so no single visitor's history grows unbounded.
const conversations = {};

function buildSystemMessages(userMessage) {
    const chunks = retrieve(userMessage);
    const knowledgeBlock = chunks.length
        ? chunks.map(c => `${c.text}\n(source: ${c.source})`).join('\n\n---\n\n')
        : 'No specific background information matched this question.';

    return [
        { role: 'system', content: SYSTEM_PERSONA },
        { role: 'system', content: `Relevant background information:\n\n${knowledgeBlock}` },
    ];
}

// Trims history in place, front-evicting oldest entries until at most
// maxUserMessages `role: 'user'` entries remain.
function trimHistory(history, maxUserMessages) {
    let userCount = history.filter(m => m.role === 'user').length;
    while (userCount > maxUserMessages && history.length > 0) {
        if (history.shift().role === 'user') userCount--;
    }
    // Drop a leading assistant reply left orphaned by the shift above, so
    // history always starts on a user turn.
    if (history[0]?.role === 'assistant') history.shift();
}

// Define a POST route for the chatbot
app.post('/chat', async (req, res) => {
    const { sender, message } = req.body;

    if (typeof sender !== 'string' || !sender.trim() || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'sender and message are required' });
    }

    if (!conversations[sender]) conversations[sender] = [];
    const history = conversations[sender];
    history.push({ role: 'user', content: message });

    try {
        const messages = [...buildSystemMessages(message), ...history];
        const response = await client.chat.completions.create({
            messages,
            model: 'openai/gpt-oss-20b',
        });

        const reply = response.choices[0].message.content;
        history.push({ role: 'assistant', content: reply });
        trimHistory(history, MAX_HISTORY_EXCHANGES);

        res.json({ reply });
    } catch (error) {
        history.pop(); // drop the user message that never got a reply
        console.error('Chat completion failed:', error);
        res.status(500).json({ error: 'Sorry, something went wrong generating a reply. Please try again.' });
    }
});

app.get('/articles', (req, res) => {
    res.json(listArticles().map(({ slug, data }) => ({
        slug,
        title: data.title,
        date: data.date,
        author: data.author,
        teaser: data.teaser,
    })));
});

app.get('/articles/:slug', (req, res) => {
    const article = readArticle(req.params.slug);
    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }

    const { data, content } = article;
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
