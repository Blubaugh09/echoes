const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { verseReference, question } = body;

    // Handle verse summary request
    if (verseReference && !question) {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 500,
        temperature: 0.7,
        system: "You are a biblical scholar helping to explain the context and significance of Bible verses. Focus on explaining why this verse is important in its section, what it contributes to the narrative or teaching, and how it connects to the surrounding content. Be concise but informative.",
        messages: [{
          role: 'user',
          content: `Explain the context and significance of this verse in its section: ${verseReference}`
        }]
      });

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
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 500,
        temperature: 0.7,
        system: "You are a biblical scholar helping to answer questions about Bible verses. Provide clear, accurate, and concise answers based on the verse's context and meaning.",
        messages: [{
          role: 'user',
          content: `Verse: ${verseReference}\nQuestion: ${question}`
        }]
      });

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