import { WiDayCloudy } from "react-icons/wi";
import { FaMoon, FaSun, FaGlobe } from "react-icons/fa";

import { UI_TEXT } from "@/constants/ui";

interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    language: 'en' | 'ja';
    setLanguage: (value: 'en' | 'ja') => void;
}

export default function Header({ darkMode, setDarkMode, language, setLanguage }: HeaderProps) {
    return (
        <header className={`fixed top-0 left-0 right-0 h-[60px] shadow-md flex items-center justify-between px-8 z-50 transition-colors duration-300 ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            <div className="flex items-center gap-4">
                <h1 className={`m-0 text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    <WiDayCloudy size={32} /> {UI_TEXT[language].appTitle}
                </h1>
            </div>

            <div className="flex gap-4 items-center">
                {/* Language Toggle */}
                <button
                    onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
                    className={`nav-button px-4 py-2 rounded-full border-none text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2
                        ${darkMode ? 'bg-[#3d3d3d] text-white hover:bg-[#4d4d4d]' : 'bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0]'}`}
                >
                    <FaGlobe /> {UI_TEXT[language].languageMeta}
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-10 h-10 rounded-full border-none flex items-center justify-center text-xl cursor-pointer transition-all duration-300
                        ${darkMode ? 'bg-[#3d3d3d] text-[#ffd700] hover:bg-[#4d4d4d]' : 'bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0]'}`}
                    aria-label={darkMode ? UI_TEXT[language].switchToLight : UI_TEXT[language].switchToDark}
                >
                    {darkMode ? <FaMoon /> : <FaSun />}
                </button>
            </div>
        </header>
    );
}
