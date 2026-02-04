"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function detectWaste(imageBase64: string) {
    if (!imageBase64) {
        return { error: "No image provided" };
    }

    try {
        // Ensure base64 string is properly formatted (remove data URL prefix if present for some APIs, 
        // but Groq/OpenAI usually expect the full URL or just the base64 part depending on implementation.
        // For vision, we usually pass the data URL directly in the content block).

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this image. Is it ELECTRONIC WASTE (e-waste)? Return ONLY a JSON: { \"label\": \"Item Name\", \"material\": \"Material\", \"recyclable\": true/false, \"sustainability_score\": 1-10, \"estimated_credit\": 10-100, \"reasoning\": \"Why it is/isn't e-waste\" }. Set 'recyclable': true ONLY if it is e-waste (electronics, cables, circuit boards). Set 'recyclable': false for plastic bottles, paper, food, or general trash."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageBase64,
                            },
                        },
                    ],
                },
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0.1,
            max_tokens: 300,
            top_p: 1,
            stop: null,
            stream: false,
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content received from AI");
        }

        // Clean up any potential markdown code blocks if the model adds them despite instructions
        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const data = JSON.parse(cleanContent);
            return { success: true, data };
        } catch (e) {
            console.error("JSON Parse Error:", e, "Content:", content);
            return { error: "Failed to parse AI response", raw: content };
        }

    } catch (error: any) {
        console.error("Groq API Error:", error);
        return { error: error.message || "Failed to analyze image" };
    }
}
