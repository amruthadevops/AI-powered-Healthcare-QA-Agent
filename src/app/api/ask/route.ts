export async function POST(req: Request) {
  try {
    const { formText, question } = await req.json();

    if (!formText || !question) {
      return new Response(JSON.stringify({ error: 'Missing inputs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
You are an AI assistant trained to help users understand US healthcare documents.

Document:
${formText}

User Question:
${question}

Answer in simple, clear language. If the answer is not in the document, say so.
    `.trim();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream', // ✅ Required for OpenRouter streaming
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://ai-powered-healthcare-qa-agent-dkg5.vercel.app', // ✅ Update this!
        'X-Title': 'Healthcare QA Agent',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        stream: true,
      }),
    });

    // ✅ Stream response back to client
    if (!response.ok || !response.body) {
      console.error('OpenRouter response error', await response.text());
      return new Response(JSON.stringify({ error: 'OpenRouter request failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('Server error:', err.message || err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}