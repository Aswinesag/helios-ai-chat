// Vercel serverless function for secure OpenRouter API calls

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, messages } = req.body;

    // Validate required fields
    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing required fields: model and messages' });
    }

    // Get API key from server-side environment variable (no VITE_ prefix)
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured on server' });
    }

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'Helios Chat App'
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: `API Error: ${response.status} - ${errorData.error?.message || response.statusText}` 
      });
    }

    const data = await response.json();
    
    // Return the response
    res.status(200).json({ 
      content: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get response from API' 
    });
  }
}
