import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
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
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Healthcare QA Agent',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        stream: true, // 👈 important!
      }),
    });

    if (!response.ok || !response.body) {
      const err = await response.json();
      console.error('OpenRouter error:', err);
      return new Response(JSON.stringify({ error: 'OpenRouter error' }), { status: 500 });
    }

    // 👇 stream the response to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
