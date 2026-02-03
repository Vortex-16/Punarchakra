import { NextResponse } from 'next/server';

export const maxDuration = 60; // Set timeout to 60 seconds
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { image } = await request.json().catch(e => {
        console.error("Failed to parse request body:", e);
        throw new Error("Invalid JSON body");
    });
    console.log("Received image for analysis"); 

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Call Groq API with Llama 4 Vision
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this e-waste item. Return ONLY a valid JSON object with the following fields: 'item' (short name), 'category' (one of: electronic, battery, plastic, other), 'confidence' (number between 0-1), 'value' (estimated value in USD as a number), and 'message' (short explanation of why you detected this). Do not include markdown formatting or backticks."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 300,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No analysis result' }, { status: 500 });
    }

    try {
      // Clean content if it contains markdown code blocks
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanContent);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Content:', content);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

  } catch (error) {
    console.error('Handler Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
