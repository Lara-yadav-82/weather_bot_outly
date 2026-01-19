export interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    visibility: number;
    descriptionJp?: string;
}

export interface Activity {
    name: string;
    icon: React.ReactNode;
    condition: string;
    recommended: boolean;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    translation?: string;
}

export interface ForecastItem {
    dt: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    dt_txt: string;
}

export interface ForecastData {
    list: ForecastItem[];
    city: {
        name: string;
        sunrise: number;
        sunset: number;
    };
}
