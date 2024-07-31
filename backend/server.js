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

fs.readFile('mike_prompt.txt', async (err, data) => {
    if (err)
        throw err;
    const mike_prompt = data.toString();
    conversations['user'].push({ role: 'system', content: mike_prompt });

    await initializeWebsiteContent();
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

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});