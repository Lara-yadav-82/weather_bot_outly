export async function getWeather(location?: string, lat?: number, lon?: number) {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (lat) params.append('lat', lat.toString());
    if (lon) params.append('lon', lon.toString());

    try {
        const res = await fetch(`/api/weather?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch weather');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
