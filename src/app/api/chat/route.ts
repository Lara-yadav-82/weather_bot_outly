/**
 * Chat API Route
 * 
 * This server-side endpoint handles communication with the Groq AI API (Llama-3).
 * It acts as a secure proxy to hide API keys from the client and implements
 * rate limiting to prevent abuse.
 * 
 * Features:
 * - In-memory rate limiting (20 req/min)
 * - System prompt injection with live weather context
 * - Multilingual support (English/Japanese)
 */
import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

// Rate limiting configuration
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// In-memory store for rate limiting (use Redis for production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: Request): string {
    // Use IP address or a combination of headers for identification
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetTime) {
        // New window or expired window
        const resetTime = now + RATE_WINDOW;
        requestCounts.set(key, { count: 1, resetTime });
        return { allowed: true, remaining: RATE_LIMIT - 1, resetTime };
    }

    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT - record.count, resetTime: record.resetTime };
}

export async function POST(request: Request) {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey);

    if (!allowed) {
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
        return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': RATE_LIMIT.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': resetTime.toString(),
                    'Retry-After': retryAfter.toString()
                }
            }
        );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    try {
        const { message, weather, history, language = 'en' } = await request.json();

        const groq = new Groq({ apiKey });

        const weatherContext = weather && weather.weather && weather.weather[0]
            ? `Current weather: ${weather.weather[0].description}, Temp: ${weather.main.temp}°C, Location: ${weather.name}.`
            : "Weather data unavailable.";

        // Determine language for response
        const responseLang = language === 'ja' ? 'Japanese' : 'English';

        // Build messages array with system prompt and history
        const messages: any[] =[
                            {
                                role: "system",
                                content: `
                        You are **"Outly"**, a friendly, knowledgeable outdoor activity guide.

                        Current Weather Context:
                            ${weatherContext}

                        GOAL:
                            Help users plan safe and enjoyable outdoor activities using real-time weather data.

                         RULES:
                            1. **Tone:** Warm, enthusiastic, and practical.
                            2. **Weather-Based Reasoning:** ALWAYS justify suggestions using temperature, wind, and conditions.
                            3. **Safety First:** If weather is dangerous (storms, high wind, extreme heat/cold), clearly warn the user.
                            4. **Scope Control:** Only discuss weather, travel, and outdoor activities. Politely redirect other topics.
                            5. **Length:**  
                            - Normal responses: **max 5 lines**  
                            - Suggestion tasks: **3–4 bullet points**, concise but helpful
                            - make engaging conversation
                            6. **Language:** Respond ONLY in **${responseLang}**

                            Do NOT:
                            - Invent weather data
                            - Give medical or unrelated advice
                            - Exceed the response length limits
                            `
                            }
                        ];


        // Add conversation history if exists
        if (history && Array.isArray(history)) {
            history.forEach((msg: any) => {
                messages.push({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                });
            });
        }

        // Add current user message
        messages.push({
            role: "user",
            content: message
        });

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return NextResponse.json(
            { reply: reply },
            {
                headers: {
                    'X-RateLimit-Limit': RATE_LIMIT.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': resetTime.toString()
                }
            }
        );
    } catch (error: any) {
        console.error('Groq API Error:', error);
        const errorMessage = error?.message || 'Failed to generate response';
        return NextResponse.json({
            error: errorMessage,
            details: error?.toString()
        }, { status: 500 });
    }
}
