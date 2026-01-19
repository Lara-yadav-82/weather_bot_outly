/**
 * Main Dashboard Page
 * 
 * This component serves as the entry point and state manager for the application.
 * It orchestrates the data flow between weather fetching, user interaction,
 * and the AI chatbot.
 * 
 * Key Features:
 * - Real-time weather data fetching (OpenWeatherMap)
 * - AI integration for outdoor advice (Groq/Llama-3)
 * - State management for chat history and preferences
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { getWeather } from "@/utils/weather";
import { generateResponse } from "@/utils/ai";
import Header from "@/components/Header";
import ActivityInput from "@/components/ActivityInput";
import WeatherSummary from "@/components/WeatherSummary";
import ActivitiesGrid from "@/components/ActivitiesGrid";
import ForecastRow from "@/components/ForecastRow";
import ChatArea from "@/components/ChatArea";
import { Message, Activity, WeatherData, ForecastData } from "@/types";
import { getActivities } from "@/constants/activities";
import { UI_TEXT } from "@/constants/ui";
import { FaRobot, FaArrowLeft } from "react-icons/fa";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ja'>('ja');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // Load preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('weather-chat-lang');
    const savedDark = localStorage.getItem('weather-chat-dark');
    if (savedLang) setLanguage(savedLang as any);
    if (savedDark) setDarkMode(savedDark === 'true');
  }, []);

  const isMounted = useRef(false);

  // Save preferences
  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem('weather-chat-lang', language);
      localStorage.setItem('weather-chat-dark', String(darkMode));
    } else {
      isMounted.current = true;
    }
  }, [language, darkMode]);

  // Refresh activity suggestions when language changes
  useEffect(() => {
    if (weather) {
      const suggestions = getStaticSuggestions(weather);
      setActivities(suggestions);
    }
  }, [language, weather]);

  const getStaticSuggestions = (currentWeather: WeatherData): Activity[] => {
    return getActivities(
      currentWeather.weather[0].main,
      currentWeather.main.temp,
      currentWeather.wind.speed,
      language
    );
  };

  const fetchSuggestions = (currentWeather: WeatherData) => {
    setIsSuggestionLoading(true);
    const suggestions = getStaticSuggestions(currentWeather);
    setActivities(suggestions);
    setIsSuggestionLoading(false);
  };

  const fetchWeatherData = async (lat?: number, lon?: number, location?: string) => {
    try {
      let weatherUrlEn = '', weatherUrlJp = '', forecastUrl = '';

      if (lat && lon) {
        weatherUrlEn = `/api/weather?lat=${lat}&lon=${lon}&lang=en`;
        weatherUrlJp = `/api/weather?lat=${lat}&lon=${lon}&lang=ja`;
        forecastUrl = `/api/forecast?lat=${lat}&lon=${lon}&lang=${language}`;
      } else if (location) {
        weatherUrlEn = `/api/weather?location=${encodeURIComponent(location)}&lang=en`;
        weatherUrlJp = `/api/weather?location=${encodeURIComponent(location)}&lang=ja`;
        forecastUrl = `/api/forecast?location=${encodeURIComponent(location)}&lang=${language}`;
      }

      // TODO: Maybe migrate this to React Query later?
      // For now, Promise.all helps fetch everything in parallel to avoid waterfalls.
      // Trigger loading state
      setIsDashboardLoading(true);

      // Artificial delay for dashboard loading feel
      await new Promise(resolve => setTimeout(resolve, 1500));

      const [dataEn, dataJp, forecastData] = await Promise.all([
        fetch(weatherUrlEn).then(r => r.json()),
        fetch(weatherUrlJp).then(r => r.json()),
        fetch(forecastUrl).then(r => r.json())
      ]);

      if (dataEn && !dataEn.error) {
        const fullWeather = { ...dataEn, descriptionJp: dataJp?.weather?.[0]?.description };
        setWeather(fullWeather);
        if (lat && lon) setLocationInput(dataEn.name);

        // Trigger background suggestion fetch
        fetchSuggestions(fullWeather);
      }
      if (forecastData && !forecastData.error) {
        setForecast(forecastData);
      }
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation && useCurrentLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      }, () => {
        // Fallback
        fetchWeatherData(undefined, undefined, "Tokyo");
      });
    } else if (!weather) {
      fetchWeatherData(undefined, undefined, "Tokyo");
    }
  }, []); // Run once on mount

  const handleStartChat = () => {
    setShowChatModal(true);
    setMessages([]); // Clear previous messages
  };

  const handleActivityClick = async (activity: Activity) => {
    if (!weather) return;

    // Open chat modal
    setShowChatModal(true);
    setMessages([]); // Clear previous messages
    setIsProcessing(true);

    // Generate prompt for the activity
    const prompt = language === 'en'
      ? `I want to do "${activity.name}" today. The weather is ${weather.weather[0].description} with ${Math.round(weather.main.temp)}°C. Please provide:
1. What should I bring/prepare?
2. Any tips or recommendations?
3. Should I need further assistance?`
      : `今日「${activity.name}」をしたいです。天気は${weather.weather[0].description}で${Math.round(weather.main.temp)}°Cです。以下を教えてください：
1. 何を持っていくべきですか？
2. アドバイスや推奨事項はありますか？
3. さらにサポートが必要ですか？`;

    // Get AI response without adding user message to visible chat
    const response = await generateResponse(prompt, weather, [], language);

    // Only show the assistant's response (hide the initial question)
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.reply
    };

    setMessages([assistantMessage]);
    setIsProcessing(false);
  };

  const handleActivityAnalysis = async (activityText: string, isFollowUp: boolean = false) => {
    if (!activityText.trim() || !weather) return;

    setIsProcessing(true);

    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: activityText
    };

    const updatedMessages = isFollowUp ? [...messages, userMessage] : [userMessage];
    setMessages(updatedMessages);

    // For follow-up messages, send conversation history
    const conversationHistory = isFollowUp ? messages : [];

    let prompt = activityText;

    // Only add context for first message
    if (!isFollowUp) {
      prompt = `User is asking about weather and outdoor activities in ${weather.name}.

Current weather:
- Temp: ${Math.round(weather.main.temp)}°C (Feels: ${Math.round(weather.main.feels_like)}°C)
- Condition: ${weather.weather[0].description}
- Wind: ${weather.wind.speed} m/s

User question: "${activityText}"

Provide a helpful and friendly response in ${language === 'en' ? 'English' : 'Japanese'} about weather-related activities, recommendations, or any weather information they need.`;
    }

    const response = await generateResponse(prompt, weather, conversationHistory, language);

    const assistantMessage: Message = {
      role: 'assistant',
      content: response.reply
    };

    // Artificial delay for bot response feel
    setTimeout(() => {
      setMessages([...updatedMessages, assistantMessage]);
      setIsProcessing(false);
    }, 1000);

    // Clear text input after sending
    if (isFollowUp) {
      setTextInput('');
    }
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    await fetchWeatherData(undefined, undefined, locationInput);
    setUseCurrentLocation(false);
  };

  const handleUseCurrentLocation = () => {
    setUseCurrentLocation(true);
    setLocationInput('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  return (
    <div className={`flex min-h-screen w-screen overflow-hidden transition-colors duration-300 font-sans ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f7fa]'}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
      />

      <div className="flex flex-col md:flex-row mt-[60px] w-full min-h-[calc(100vh-60px)] md:h-[calc(100vh-60px)]">
        <ActivityInput
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          handleLocationSearch={handleLocationSearch}
          handleUseCurrentLocation={handleUseCurrentLocation}
          onStartChat={handleStartChat}
          weather={weather}
          language={language}
          darkMode={darkMode}
        />

        <div className={`flex-1 p-8 overflow-y-auto ${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f7fa]'}`}>
          {!showChatModal ? (
            <>
              <>
                <h2 className={`m-0 mb-5 text-xl font-semibold transition-opacity duration-300 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'} ${isDashboardLoading ? 'opacity-50' : 'opacity-100'}`}>
                  {UI_TEXT[language].dashboardTitle}
                </h2>

                <div className={`transition-all duration-300 ${isDashboardLoading ? 'opacity-50 scale-[0.99] grayscale' : 'opacity-100 scale-100'}`}>
                  <WeatherSummary weather={weather} language={language} darkMode={darkMode} />

                  <ForecastRow forecast={forecast} language={language} darkMode={darkMode} />

                  <ActivitiesGrid
                    activities={activities}
                    isProcessing={isSuggestionLoading}
                    language={language}
                    darkMode={darkMode}
                    onActivityClick={handleActivityClick}
                  />
                </div>
              </>
            </>
          ) : (
            <div className="h-full flex flex-col">
              {/* Chat Header with Back Button */}
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={() => setShowChatModal(false)}
                  className={`px-4 py-2 rounded-lg border-none cursor-pointer transition-colors flex items-center gap-2 ${darkMode ? 'bg-[#3d3d3d] text-white hover:bg-[#4d4d4d]' : 'bg-white text-[#1a1a1a] hover:bg-gray-100 shadow-sm'}`}
                >
                  <FaArrowLeft /> {UI_TEXT[language].backToDashboard}
                </button>
                <h2 className={`m-0 text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  <FaRobot /> {UI_TEXT[language].chatBotTitle}
                </h2>
              </div>

              {/* Chat Area - Full Dashboard */}
              <div className="flex-1 flex flex-col min-h-0">
                <ChatArea
                  messages={messages}
                  isProcessing={isProcessing}
                  darkMode={darkMode}
                  language={language}
                  onSendMessage={(msg) => handleActivityAnalysis(msg, true)}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  onVoiceInput={(text) => {
                    // Directly send voice input instead of just setting text
                    handleActivityAnalysis(text, true);
                  }}
                  onLanguageToggle={() => setLanguage(language === 'en' ? 'ja' : 'en')}
                  onClearChat={() => {
                    setMessages([]);
                    setTextInput('');
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
