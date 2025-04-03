const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept']
}));

// Body parser middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Check for required environment variables
if (!process.env.VITE_ANTHROPIC_API_KEY) {
  console.error('Error: VITE_ANTHROPIC_API_KEY is not set in environment variables');
  process.exit(1);
}

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.post('/api/verse-summary', async (req, res) => {
  try {
    const { verseReference } = req.body;
    if (!verseReference) {
      return res.status(400).json({ error: 'Verse reference is required' });
    }

    console.log('Fetching summary for verse:', verseReference);
    console.log('Request body:', req.body);
    
    try {
      const message = await client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 500,
        temperature: 0.7,
        system: "You are a biblical scholar helping to explain the context and significance of Bible verses. Focus on explaining why this verse is important in its section, what it contributes to the narrative or teaching, and how it connects to the surrounding content. Be concise but informative.",
        messages: [{
          role: 'user',
          content: `Explain the context and significance of this verse in its section: ${verseReference}`
        }]
      });

      console.log('Raw Claude response:', message);
      console.log('Response type:', typeof message);
      console.log('Response keys:', Object.keys(message));
      
      if (!message || !message.content || !message.content[0] || !message.content[0].text) {
        console.error('Invalid response structure:', JSON.stringify(message, null, 2));
        throw new Error('Invalid response format from Claude API');
      }

      res.json({ summary: message.content[0].text });
    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      console.error('Error details:', {
        name: claudeError.name,
        message: claudeError.message,
        stack: claudeError.stack,
        response: claudeError.response
      });
      throw claudeError;
    }
  } catch (error) {
    console.error('Error in verse-summary endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch verse summary', 
      details: error.message
    });
  }
});

app.post('/api/verse-question', async (req, res) => {
  try {
    const { verseReference, question } = req.body;
    if (!verseReference || !question) {
      return res.status(400).json({ error: 'Verse reference and question are required' });
    }

    console.log('Processing question for verse:', verseReference);
    console.log('Request body:', req.body);
    
    try {
      const message = await client.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 150,
        temperature: 0.7,
        system: "You are a biblical scholar assistant. Provide clear, concise answers to questions about Bible verses.",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: `Regarding ${verseReference}: ${question}`
          }]
        }]
      });

      console.log('Raw Claude response:', message);
      console.log('Response type:', typeof message);
      console.log('Response keys:', Object.keys(message));
      
      if (!message || !message.content || !message.content[0] || !message.content[0].text) {
        console.error('Invalid response structure:', JSON.stringify(message, null, 2));
        throw new Error('Invalid response format from Claude API');
      }

      res.json({ response: message.content[0].text });
    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      console.error('Error details:', {
        name: claudeError.name,
        message: claudeError.message,
        stack: claudeError.stack,
        response: claudeError.response
      });
      throw claudeError;
    }
  } catch (error) {
    console.error('Error in verse-question endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response', 
      details: error.message
    });
  }
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  console.log('404 for API route:', req.method, req.path);
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API endpoints available:');
  console.log('- GET /api/health');
  console.log('- POST /api/verse-summary');
  console.log('- POST /api/verse-question');
}); 