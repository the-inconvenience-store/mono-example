import { WeatherForecast } from "@mono/api";
import { WeatherCard } from "./WeatherCard";

interface WeatherGridProps {
    forecasts: WeatherForecast[]
}

export function WeatherGrid({ forecasts }: WeatherGridProps) {
    // Handle empty state
    if (forecasts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No weather data available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map((forecast, index) => (
                <WeatherCard
                    key={forecast.date.toString() || index}
                    forecast={forecast}
                />
            ))}
        </div>
    );
}
