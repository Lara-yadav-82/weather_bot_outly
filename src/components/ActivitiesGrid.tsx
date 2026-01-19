import React from 'react';
import { Activity } from '../types';
import { FaInfoCircle } from 'react-icons/fa';
import { UI_TEXT } from "@/constants/ui";

interface ActivitiesGridProps {
    activities: Activity[];
    isProcessing: boolean;
    language: 'en' | 'ja';
    darkMode: boolean;
    onActivityClick?: (activity: Activity) => void;
}

export default function ActivitiesGrid({ activities, isProcessing, language, darkMode, onActivityClick }: ActivitiesGridProps) {
    if (activities.length === 0) return null;

    return (
        <div className={`p-5 rounded-xl mb-5 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            <h3 className={`m-0 mb-4 text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {UI_TEXT[language].activitiesTitle}
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        onClick={() => onActivityClick?.(activity)}
                        className={`p-5 rounded-xl text-center transition-all hover:scale-105 border-2 cursor-pointer relative group flex flex-col items-center justify-center
                            ${activity.recommended
                                ? (darkMode ? 'bg-[#1a4d2e] border-[#4caf50]' : 'bg-[#e8f5e9] border-[#81c784]')
                                : (darkMode ? 'bg-[#3d3d3d] border-transparent' : 'bg-[#f5f5f5] border-transparent')
                            }`}
                    >
                        {/* Learn More overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-semibold text-lg flex items-center gap-2">
                                <FaInfoCircle /> {UI_TEXT[language].learnMore}
                            </span>
                        </div>
                        <div className={`text-5xl mb-3 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>{activity.icon}</div>
                        <div className={`text-base font-semibold mb-2 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                            {activity.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {activity.condition}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
