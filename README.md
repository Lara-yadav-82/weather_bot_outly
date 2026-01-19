# Weather Chat AI 🌦️🤖

A next-generation weather dashboard that combines real-time forecasts with an intelligent AI assistant to provide personalized outdoor activity recommendations.
## ✨ Features

- **Real-time Weather:** Accurate current conditions and 5-day forecasts via OpenWeatherMap.
- **AI-Powered Advice:** Chat with a smart assistant (powered by Llama-3 on Groq) that knows the weather context. Ask "Can I go running?" and it knows if it's raining!
- **Voice Interaction:** Speak naturally to the assistant using built-in speech recognition.
- **Activities Dashboard:** Instant suggestions for activities (Gym, Hiking, Beach) based on live conditions.
- **Bilingual:** Full support for English (EN) and Japanese other (JA).
- **Themes:** Beautiful Light and Dark modes.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Provider:** Groq (Llama-3.3-70b)
- **Weather API:** OpenWeatherMap

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/weather-chat.git
   cd weather-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Get this from https://openweathermap.org/api
   WEATHER_API_KEY=your_weather_api_key_here
   
   # Get this from https://console.groq.com
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open standard browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `src/app/page.tsx`: Main dashboard and state logic.
- `src/app/api/`: Server-side API routes (hides API keys).
- `src/components/`: Reusable UI components.
- `src/utils/`: Helper functions for API calls.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
