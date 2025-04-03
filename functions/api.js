const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize Anthropic client outside the handler for better performance
let anthropicClient = null;

exports.handler = async function(event, context) {
  // Log the incoming request
  console.log('Received request:', {
    method: event.httpMethod,
    body: event.body
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Initialize Anthropic client if not already done
    if (!anthropicClient) {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.error('Missing ANTHROPIC_API_KEY');
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Server configuration error',
            details: 'Missing API key'
          })
        };
      }
      anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }

    const body = JSON.parse(event.body);
    const { verseReference, question } = body;

    // Log the parsed request
    console.log('Parsed request:', { verseReference, question });

    // Handle verse summary request
    if (verseReference && !question) {
      console.log('Fetching verse summary for:', verseReference);
      const message = await anthropicClient.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 300, // Reduced from 500 to improve response time
        temperature: 0.7,
        system: "You are a biblical scholar helping to explain the context and significance of Bible verses. Focus on explaining why this verse is important in its section, what it contributes to the narrative or teaching, and how it connects to the surrounding content. Be concise but informative.",
        messages: [{
          role: 'user',
          content: `Explain the context and significance of this verse in its section: ${verseReference}`
        }]
      });

      console.log('Received response from Claude');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ summary: message.content[0].text })
      };
    }

    // Handle verse question request
    if (verseReference && question) {
      console.log('Processing question for verse:', verseReference);
      const message = await anthropicClient.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 300, // Reduced from 500 to improve response time
        temperature: 0.7,
        system: "You are a biblical scholar helping to answer questions about Bible verses. Provide clear, accurate, and concise answers based on the verse's context and meaning.",
        messages: [{
          role: 'user',
          content: `Verse: ${verseReference}\nQuestion: ${question}`
        }]
      });

      console.log('Received response from Claude');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answer: message.content[0].text })
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request parameters' })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 