export async function generateResponse(message: string, weather: any, history?: any[], language: 'en' | 'ja' = 'en') {
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, weather, history, language }),
        });

        if (!res.ok) {
            throw new Error('Failed to fetch AI response');
        }

        const data = await res.json();
        return {
            reply: data.reply
        };
    } catch (error) {
        console.error(error);
        return {
            reply: language === 'ja' ? "申し訳ありません。エラーが発生しました。" : "Sorry, an error occurred."
        };
    }
}
