const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize Anthropic client outside the handler for better performance
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

exports.handler = async (event, context) => {
  // Set function timeout to 25 seconds (slightly less than the 30s limit)
  context.callbackWaitsForEmptyEventLoop = false;
  
  console.log('Received request:', {
    method: event.httpMethod,
    body: event.body
  });

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    console.log('Parsed request:', data);

    if (event.httpMethod === 'POST') {
      if (data.verseReference) {
        console.log('Fetching verse summary for:', data.verseReference);
        try {
          // Use a more focused prompt to get faster responses
          const response = await anthropic.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 200, // Reduced from 300 to improve response time
            temperature: 0.7,
            messages: [{
              role: 'user',
              content: `Briefly explain the key meaning of ${data.verseReference} in its biblical context.`
            }]
          });
          console.log('Received response from Anthropic API');
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ summary: response.content[0].text })
          };
        } catch (apiError) {
          console.error('Anthropic API error:', apiError);
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              error: 'Failed to get verse summary from AI',
              details: apiError.message
            })
          };
        }
      } else if (data.question) {
        console.log('Processing question:', data.question);
        try {
          const response = await anthropic.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 200, // Reduced from 300 to improve response time
            temperature: 0.7,
            messages: [{
              role: 'user',
              content: data.question
            }]
          });
          console.log('Received response from Anthropic API for question');
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ answer: response.content[0].text })
          };
        } catch (apiError) {
          console.error('Anthropic API error for question:', apiError);
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              error: 'Failed to get answer from AI',
              details: apiError.message
            })
          };
        }
      }
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      })
    };
  }
}; 