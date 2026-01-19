import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { UI_TEXT } from "@/constants/ui";

interface ActivityInputProps {
    locationInput: string;
    setLocationInput: (val: string) => void;
    handleLocationSearch: (e: React.FormEvent) => void;
    handleUseCurrentLocation: () => void;
    onStartChat: () => void;
    weather: WeatherData | null;
    language: 'en' | 'ja';
    darkMode: boolean;
}

export default function ActivityInput({
    locationInput,
    setLocationInput,
    handleLocationSearch,
    handleUseCurrentLocation,
    onStartChat,
    weather,
    language,
    darkMode
}: ActivityInputProps) {
    const [currentTime, setCurrentTime] = useState<string>('');

    // Get current date and time in display format
    const getCurrentDateTime = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return now.toLocaleString(language === 'en' ? 'en-US' : 'ja-JP', options);
    };

    // Update current time every minute
    useEffect(() => {
        // Set initial time
        setCurrentTime(getCurrentDateTime());

        // Update every minute (60000ms)
        const interval = setInterval(() => {
            setCurrentTime(getCurrentDateTime());
        }, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [language]);

    return (
        <div className={`w-full md:w-[350px] shadow-lg p-5 md:p-8 overflow-y-auto flex-shrink-0 transition-colors duration-300 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            <h2 className={`m-0 mb-1 text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {UI_TEXT[language].weatherChatTitle}
            </h2>
            <p className={`text-xs mb-5 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {UI_TEXT[language].tagline}
            </p>

            {/* Location */}
            <div className="mb-6">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    🌍 {UI_TEXT[language].cityLabel}
                </label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder={UI_TEXT[language].cityPlaceholder}
                        className={`flex-1 p-3 rounded-lg border text-sm outline-none transition-colors
                            ${darkMode
                                ? 'bg-[#3d3d3d] border-[#4d4d4d] text-white placeholder-gray-500'
                                : 'bg-[#f9f9f9] border-gray-200 text-black placeholder-gray-400'}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch(e)}
                    />
                    <button
                        onClick={handleLocationSearch}
                        className="px-4 rounded-lg border-none bg-[#0066db] text-white cursor-pointer hover:bg-[#0052b3] transition-colors text-lg"
                    >
                        🔍
                    </button>
                </div>
                <button
                    onClick={handleUseCurrentLocation}
                    className={`w-full p-3 rounded-lg border text-sm cursor-pointer transition-colors font-medium
                        ${darkMode
                            ? 'bg-[#3d3d3d] border-[#4d4d4d] text-gray-300 hover:bg-[#4d4d4d]'
                            : 'bg-[#f9f9f9] border-gray-200 text-gray-700 hover:bg-[#eeeeee]'}`}
                >
                    📍 {UI_TEXT[language].useMyLocation}
                </button>
            </div>

            {/* Date and Time Display */}
            <div className="mb-6">
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    📅 {UI_TEXT[language].dateTimeLabel}
                </label>
                <div className={`w-full p-3 rounded-lg border text-sm ${darkMode
                    ? 'bg-[#3d3d3d] border-[#4d4d4d] text-white'
                    : 'bg-[#f9f9f9] border-gray-200 text-black'}`}>
                    {currentTime}
                </div>
            </div>

            {/* Weather Info Display */}
            {weather && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-[#3d3d3d]' : 'bg-[#f0f7ff]'}`}>
                    <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {UI_TEXT[language].currentWeather}
                    </div>
                    <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                        {weather.name}
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0066db]'}`}>
                        {Math.round(weather.main.temp)}°C
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {weather.weather[0].description}
                    </div>
                </div>
            )}

            {/* Start Chat Button */}
            <button
                onClick={onStartChat}
                disabled={!weather}
                className={`w-full p-4 rounded-lg border-none text-base font-bold cursor-pointer transition-all shadow-md
                    ${!weather
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-[#0066db] text-white hover:bg-[#0052b3] hover:shadow-lg hover:-translate-y-0.5'}`}
            >
                💬 {UI_TEXT[language].startChat}
            </button>

            {!weather && (
                <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {UI_TEXT[language].selectLocationError}
                </p>
            )}
        </div>
    );
}
