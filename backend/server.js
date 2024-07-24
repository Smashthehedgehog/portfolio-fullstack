// Import the required libraries
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

require('dotenv').config();

// Initialize the Express application
const app = express();

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Iniitialize the openai
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define a POST route for the chatbot
app.post('/chat', async (req, res) => {
    const { message } = req.body; // Extract the message from the request body

    try {
        // Send the message to OpenAI and get the response
        const response = await client.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ],
            model: "gpt-4o",
        });

        console.log(response.choices[0]);
        // Send the chatbot's reply back to the client
        res.json({ reply: response.choices[0] });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});