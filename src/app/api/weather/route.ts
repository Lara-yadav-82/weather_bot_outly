import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const lang = searchParams.get('lang') || 'en'; // Default to English

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
    }

    try {
        let url = '';
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`;
        } else if (location) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=${lang}`;
        } else {
            return NextResponse.json({ error: 'Location parameters missing' }, { status: 400 });
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Weather API error');
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
