import { WeatherForecast } from "@mono/api";

interface WeatherCardProps {
    forecast: WeatherForecast
}

export function WeatherCard({ forecast }: WeatherCardProps) {
    const getTemperatureColor = (temp?: number) => {
        if (!temp) return "text-gray-500";
        if (temp < 0) return "text-blue-600";
        if (temp < 15) return "text-blue-400";
        if (temp < 25) return "text-green-500";
        return "text-red-500";
    };
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">
                {forecast.date.toLocaleDateString()}
            </h3>
            <div
                className={`text-3xl font-bold ${getTemperatureColor(forecast.temperatureC)}`}
            >
                {forecast.temperatureC}°C
            </div>
            {forecast.temperatureF && (
                <div className="text-sm text-gray-600 mb-2">
                    {forecast.temperatureF}°F
                </div>
            )}
            <div className="text-sm text-gray-700">
                {forecast.summary || "No description"}
            </div>
        </div>
    );
}