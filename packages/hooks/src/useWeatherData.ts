import { useState, useEffect, useCallback } from "react";
import { weatherApi, WeatherForecast } from "./lib/api-client";

interface UseWeatherDataReturn {
    forecasts: WeatherForecast[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => Promise<void>;
}

export function useWeatherData(): UseWeatherDataReturn {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // useCallback prevents unnecessary re-renders
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await weatherApi.getWeatherForecast();
            setForecasts(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load weather data");
            console.error("Weather API error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data on mount
    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        forecasts,
        loading,
        error,
        lastUpdated,
        refresh,
    };
}
