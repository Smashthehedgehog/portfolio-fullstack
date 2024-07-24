// Import the required libraries
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors')



require('dotenv').config();

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

// Define a POST route for the chatbot
app.post('/chat', async (req, res) => {
    const { sender, message } = req.body; // Extract the message from the request body
    
    if (!sender || !message) {
        return res.status(400).json({ error: 'User ID and message are required' });
    }

    if (!conversations[sender]) {
        conversations[sender] = [];
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