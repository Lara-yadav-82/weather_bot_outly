import React, { useState } from 'react';
import { ForecastData, ForecastItem } from '../types';
import { UI_TEXT } from "@/constants/ui";
import { FaWind, FaTint, FaCompressArrowsAlt } from "react-icons/fa";

interface ForecastRowProps {
    forecast: ForecastData | null;
    language: 'en' | 'ja';
    darkMode: boolean;
}

export default function ForecastRow({ forecast, language, darkMode }: ForecastRowProps) {
    const [selectedForecast, setSelectedForecast] = useState<ForecastItem | null>(null);

    if (!forecast) return null;

    // Filter to get one forecast per day (approx noon)
    const dailyForecasts = forecast.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5);

    const handleDayClick = (day: ForecastItem) => {
        if (selectedForecast === day) {
            setSelectedForecast(null);
        } else {
            setSelectedForecast(day);
        }
    };

    return (
        <div className={`p-5 rounded-xl mb-5 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            <h3 className={`m-0 mb-4 text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {UI_TEXT[language].forecastTitle}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {dailyForecasts.map((day, index) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString(language === 'en' ? 'en-US' : 'ja-JP', { weekday: 'short' });
                    const isSelected = selectedForecast === day;

                    return (
                        <div 
                            key={index} 
                            onClick={() => handleDayClick(day)}
                            className={`flex-1 min-w-[80px] flex flex-col items-center p-3 rounded-lg text-center cursor-pointer transition-all duration-200 border-2
                             ${darkMode ? 'bg-[#3d3d3d]' : 'bg-[#f5f5f5]'}
                             ${isSelected ? (darkMode ? 'border-blue-400 bg-[#4a4a4a]' : 'border-blue-400 bg-white') : 'border-transparent hover:brightness-110'}`}
                        >
                            <div className={`text-sm font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{dayName}</div>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon.replace('n', 'd')}.png`}
                                alt={day.weather[0].description}
                                className="w-[40px] h-[40px] my-1"
                            />
                            <div className={`text-base font-bold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                {Math.round(day.main.temp)}°C
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {day.weather[0].main}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedForecast && (
                <div className={`mt-4 p-4 rounded-lg border animate-fadeIn ${darkMode ? 'bg-[#3d3d3d] border-[#4a4a4a]' : 'bg-blue-50 border-blue-100'}`}>
                   <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {new Date(selectedForecast.dt * 1000).toLocaleDateString(language === 'en' ? 'en-US' : 'ja-JP', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-opacity-10 bg-gray-500">
                             <FaWind className={`mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                             <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{UI_TEXT[language].wind}</span>
                             <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedForecast.wind.speed} m/s</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-opacity-10 bg-gray-500">
                             <FaTint className={`mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                             <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{UI_TEXT[language].humidity}</span>
                             <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedForecast.main.humidity}%</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-opacity-10 bg-gray-500">
                             <FaCompressArrowsAlt className={`mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                             <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'en' ? 'Pressure' : '気圧'}</span>
                             <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedForecast.main.pressure} hPa</span>
                        </div>
                   </div>
                </div>
            )}
        </div>
    );
}
