import React from 'react';
import { WeatherData } from '../types';
import { WiStrongWind, WiHumidity, WiThermometer } from 'react-icons/wi';
import { FaEye } from 'react-icons/fa';
import { UI_TEXT } from "@/constants/ui";

interface WeatherSummaryProps {
    weather: WeatherData | null;
    language: 'en' | 'ja';
    darkMode: boolean;
}

export default function WeatherSummary({ weather, language, darkMode }: WeatherSummaryProps) {
    if (!weather) return null;

    const description = language === 'en'
        ? weather.weather[0].description
        : (weather.descriptionJp || weather.weather[0].description);

    return (
        <div className={`p-5 rounded-xl mb-5 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            <h3 className={`m-0 mb-4 text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {UI_TEXT[language].weatherSummaryTitle}
            </h3>
            <div className="flex items-center gap-5 mb-4">
                <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={description}
                    className="w-[60px] h-[60px]"
                />
                <div>
                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                        {Math.round(weather.main.temp)}°C
                    </div>
                    <div className={`text-base capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {description}
                    </div>
                </div>
            </div>
            <div className={`grid grid-cols-2 gap-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2"><WiStrongWind size={20} /> {UI_TEXT[language].wind}: {weather.wind.speed} m/s</div>
                <div className="flex items-center gap-2"><WiHumidity size={20} /> {UI_TEXT[language].humidity}: {weather.main.humidity}%</div>
                <div className="flex items-center gap-2"><WiThermometer size={20} /> {UI_TEXT[language].feelsLike}: {Math.round(weather.main.feels_like)}°C</div>
                <div className="flex items-center gap-2"><FaEye size={16} /> {UI_TEXT[language].visibility}: {(weather.visibility / 1000).toFixed(1)} km</div>
            </div>
        </div>
    );
}
