import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';

import { FaMicrophone, FaTrash, FaCommentDots, FaPaperPlane } from "react-icons/fa";
import { UI_TEXT } from "@/constants/ui";

interface ChatAreaProps {
    messages: Message[];
    isProcessing: boolean;
    darkMode: boolean;
    language: 'en' | 'ja';
    onSendMessage?: (message: string) => void;
    textInput?: string;
    setTextInput?: (value: string) => void;
    onVoiceInput?: (text: string) => void;
    onLanguageToggle?: () => void;
    onClearChat?: () => void;
}

export default function ChatArea({ messages, isProcessing, darkMode, language, onSendMessage, textInput, setTextInput, onVoiceInput, onLanguageToggle, onClearChat }: ChatAreaProps) {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // const [showLangDropdown, setShowLangDropdown] = useState(false); // Hidden per request

    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isProcessing, isListening]);

    // Maintain focus on input after text is cleared
    useEffect(() => {
        if (!isProcessing && textInput === '') {
            inputRef.current?.focus();
        }
    }, [textInput, isProcessing]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput && textInput.trim() && onSendMessage && !isProcessing) {
            onSendMessage(textInput);
        }
    };

    return (
        <div className={`flex flex-col h-full rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-[#2d2d2d]' : 'bg-white'}`}>
            {/* Clear Chat Button */}
            {onClearChat && (
                <div className={`p-3 border-b ${darkMode ? 'border-[#3d3d3d]' : 'border-gray-200'} flex justify-end`}>
                    <button
                        onClick={onClearChat}
                        disabled={messages.length === 0}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${messages.length === 0
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 border border-gray-400'
                            : darkMode
                                ? 'bg-[#3d3d3d] text-white hover:bg-[#4d4d4d] border border-[#4d4d4d]'
                                : 'bg-white text-[#1a1a1a] hover:bg-gray-50 border border-gray-300'
                            }`}
                        title={UI_TEXT[language].clearChatTooltip}
                    >
                        <FaTrash />
                        <span>{UI_TEXT[language].clearChat}</span>
                    </button>
                </div>
            )}
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5">
                {messages.length === 0 && !isProcessing && (
                    <div className={`text-center py-20 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <div className="text-6xl mb-4 flex justify-center"><FaCommentDots /></div>
                        <p className="text-lg">
                            {UI_TEXT[language].emptyChatTitle}
                        </p>
                        <p className="text-sm mt-2">
                            {UI_TEXT[language].emptyChatDesc}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[70%] md:max-w-[60%] p-4 rounded-xl leading-relaxed whitespace-pre-wrap
                                ${msg.role === 'user'
                                    ? 'bg-[#0066db] text-white self-end rounded-br-none'
                                    : (darkMode ? 'bg-[#3d3d3d] text-[#e5e5e5] self-start rounded-bl-none' : 'bg-[#f0f0f0] text-[#1a1a1a] self-start rounded-bl-none')}`}
                        >
                            <div className="text-base">{msg.content}</div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className={`self-start p-4 rounded-xl rounded-bl-none 
                            ${darkMode ? 'bg-[#3d3d3d]' : 'bg-[#f0f0f0]'}`}>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#90949c] animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#90949c] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-[#90949c] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    {isListening && (
                        <div className={`self-center p-2 rounded-full animate-pulse transition-all
                            ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                            <span className="text-sm font-medium flex items-center gap-2">
                                ● Listening...
                            </span>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input Area */}
            {onSendMessage && setTextInput && (
                <div className={`p-4 border-t ${darkMode ? 'border-[#3d3d3d]' : 'border-gray-200'}`}>
                    {/* Text Input Form */}
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={textInput || ''}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : UI_TEXT[language].chatPlaceholder}
                            disabled={isProcessing || isListening}
                            className={`flex-1 px-4 py-3 rounded-lg border outline-none transition-all ${darkMode
                                ? 'bg-[#1a1a1a] border-[#3d3d3d] text-white placeholder-gray-500 focus:border-[#0066db]'
                                : 'bg-white border-gray-300 text-[#1a1a1a] placeholder-gray-400 focus:border-[#0066db]'
                                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {onVoiceInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (isListening) {
                                        // If already listening, we could potentially stop it, but standard API 
                                        // doesn't always support nice aborting without full stop. 
                                        // For now, let's just ignore or let it timeout.
                                        // Actually, let's maintain the existing logic structure but wrapped.
                                        return;
                                    }

                                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                    if (!SpeechRecognition) {
                                        alert('Speech recognition not supported');
                                        return;
                                    }
                                    const recognition = new SpeechRecognition();
                                    recognition.lang = language === 'ja' ? 'ja-JP' : 'en-US';
                                    recognition.interimResults = false;
                                    recognition.maxAlternatives = 1;

                                    recognition.onstart = () => {
                                        setIsListening(true);
                                    };

                                    recognition.onend = () => {
                                        setIsListening(false);
                                    };

                                    recognition.onresult = (event: any) => {
                                        const text = event.results[0][0].transcript;
                                        onVoiceInput(text);
                                    };
                                    recognition.onerror = (event: any) => {
                                        console.error('Speech recognition error', event.error);
                                        setIsListening(false);
                                    };
                                    recognition.start();
                                }}
                                disabled={isProcessing || isListening}
                                className={`px-4 py-3 max-[420px]:p-2 max-[420px]:text-sm rounded-lg font-medium transition-all border flex items-center gap-2 ${isProcessing
                                    ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 text-white'
                                    : isListening
                                        ? 'bg-red-500 border-red-500 text-white animate-pulse'
                                        : darkMode
                                            ? 'bg-[#3d3d3d] border-[#4d4d4d] text-white hover:bg-[#4d4d4d]'
                                            : 'bg-white border-gray-300 text-[#1a1a1a] hover:bg-gray-50'
                                    }`}
                                title={UI_TEXT[language].voiceInput}
                            >
                                <FaMicrophone />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isProcessing || !textInput?.trim()}
                            className={`px-6 py-3 max-[420px]:px-4 max-[420px]:py-2 rounded-lg font-medium transition-all flex items-center justify-center ${isProcessing || !textInput?.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#0066db] hover:bg-[#0052b4]'
                                } text-white`}
                            title={UI_TEXT[language].sendButton}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
