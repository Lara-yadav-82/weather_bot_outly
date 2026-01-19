import React from 'react';
import {
    FaDumbbell, FaLandmark, FaShoppingBag, FaCoffee, FaFilm,
    FaHiking, FaHotTub, FaSkiing, FaMountain, FaUmbrellaBeach,
    FaSwimmer, FaRunning, FaTree, FaIceCream, FaBicycle,
    FaWalking, FaCamera
} from "react-icons/fa";
import { MdOutlineSpa } from "react-icons/md";
import { Activity } from "@/types";

// Define strict types for our weather conditions to make the logic cleaner
type WeatherCategory = 'rain' | 'cold' | 'hot' | 'mild';

interface ActivityDefinition {
    name: string;
    icon: React.ReactNode;
    condition: string;
    recommended: boolean;
}

// Helper to determine the category
const getWeatherCategory = (condition: string, temp: number): WeatherCategory => {
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        return 'rain';
    }

    if (temp < 10) {
        return 'cold';
    }

    if (temp >= 25) {
        return 'hot';
    }

    return 'mild';
};

export const getActivities = (
    condition: string,
    temp: number,
    windSpeed: number,
    language: 'en' | 'ja'
): Activity[] => {
    const category = getWeatherCategory(condition, temp);
    const isEnglish = language === 'en';

    if (category === 'rain') {
        if (isEnglish) {
            return [
                { name: "Indoor Gym", icon: <FaDumbbell size={48} />, condition: "Stay dry and active", recommended: true },
                { name: "Museum Visit", icon: <FaLandmark size={48} />, condition: "Cultural experience", recommended: true },
                { name: "Shopping Mall", icon: <FaShoppingBag size={48} />, condition: "Indoor entertainment", recommended: true },
                { name: "Cafe Work", icon: <FaCoffee size={48} />, condition: "Cozy atmosphere", recommended: true },
                { name: "Movie Theater", icon: <FaFilm size={48} />, condition: "Perfect rainy day activity", recommended: true }
            ];
        } else {
            return [
                { name: "屋内ジム", icon: <FaDumbbell size={48} />, condition: "乾いたまま運動できます", recommended: true },
                { name: "博物館見学", icon: <FaLandmark size={48} />, condition: "文化的な体験", recommended: true },
                { name: "ショッピングモール", icon: <FaShoppingBag size={48} />, condition: "屋内エンターテイメント", recommended: true },
                { name: "カフェで仕事", icon: <FaCoffee size={48} />, condition: "居心地の良い雰囲気", recommended: true },
                { name: "映画館", icon: <FaFilm size={48} />, condition: "雨の日に最適", recommended: true }
            ];
        }
    }

    if (category === 'cold') {
        if (isEnglish) {
            return [
                { name: "Winter Hiking", icon: <FaHiking size={48} />, condition: "Dress warm", recommended: true },
                { name: "Hot Spring", icon: <FaHotTub size={48} />, condition: "Warm relaxation", recommended: true },
                { name: "Winter Sports", icon: <FaSkiing size={48} />, condition: "Cold weather fun", recommended: true },
                { name: "Indoor Climbing", icon: <FaMountain size={48} />, condition: "Stay active indoors", recommended: true },
                { name: "Cozy Cafe", icon: <FaCoffee size={48} />, condition: "Warm beverages", recommended: true }
            ];
        } else {
            return [
                { name: "冬のハイキング", icon: <FaHiking size={48} />, condition: "暖かく着る", recommended: true },
                { name: "温泉", icon: <FaHotTub size={48} />, condition: "温かいリラクゼーション", recommended: true },
                { name: "ウィンタースポーツ", icon: <FaSkiing size={48} />, condition: "寒い天気の楽しみ", recommended: true },
                { name: "室内クライミング", icon: <FaMountain size={48} />, condition: "屋内でアクティブに", recommended: true },
                { name: "居心地の良いカフェ", icon: <FaCoffee size={48} />, condition: "温かい飲み物", recommended: true }
            ];
        }
    }

    if (category === 'hot') {
        if (isEnglish) {
            return [
                { name: "Beach Visit", icon: <FaUmbrellaBeach size={48} />, condition: "Perfect beach weather", recommended: true },
                { name: "Swimming", icon: <FaSwimmer size={48} />, condition: "Cool off in water", recommended: true },
                { name: "Early Morning Run", icon: <FaRunning size={48} />, condition: "Beat the heat", recommended: true },
                { name: "Park Picnic", icon: <FaTree size={48} />, condition: "Enjoy outdoors", recommended: true },
                { name: "Ice Cream Walk", icon: <FaIceCream size={48} />, condition: "Sweet treat stroll", recommended: true }
            ];
        } else {
            return [
                { name: "ビーチ訪問", icon: <FaUmbrellaBeach size={48} />, condition: "完璧なビーチの天気", recommended: true },
                { name: "水泳", icon: <FaSwimmer size={48} />, condition: "水で涼む", recommended: true },
                { name: "早朝ランニング", icon: <FaRunning size={48} />, condition: "暑さを避ける", recommended: true },
                { name: "公園でピクニック", icon: <FaTree size={48} />, condition: "屋外を楽しむ", recommended: true },
                { name: "アイスクリーム散歩", icon: <FaIceCream size={48} />, condition: "甘いお菓子の散歩", recommended: true }
            ];
        }
    }

    // Mild / Default
    if (isEnglish) {
        return [
            { name: "Jogging", icon: <FaRunning size={48} />, condition: "Perfect temperature", recommended: true },
            { name: "Cycling", icon: <FaBicycle size={48} />, condition: "Great for biking", recommended: true },
            { name: "Park Walk", icon: <FaWalking size={48} />, condition: "Pleasant conditions", recommended: true },
            { name: "Outdoor Yoga", icon: <MdOutlineSpa size={48} />, condition: "Comfortable weather", recommended: true },
            { name: "Photography", icon: <FaCamera size={48} />, condition: "Good lighting", recommended: true }
        ];
    } else {
        return [
            { name: "ジョギング", icon: <FaRunning size={48} />, condition: "完璧な温度", recommended: true },
            { name: "サイクリング", icon: <FaBicycle size={48} />, condition: "自転車に最適", recommended: true },
            { name: "公園散歩", icon: <FaWalking size={48} />, condition: "快適な条件", recommended: true },
            { name: "屋外ヨガ", icon: <MdOutlineSpa size={48} />, condition: "快適な天気", recommended: true },
            { name: "写真撮影", icon: <FaCamera size={48} />, condition: "良い照明", recommended: true }
        ];
    }
};
