import { weatherApi } from "@/lib/api-client";
import { WeatherGrid } from "@/features/weather/component/WeatherGrid";

// This is metadata for the page
export const metadata = {
    title: "Weather Forecast",
    description: "Current weather forecast data",
};

// This is a Server Component - it runs on the server
export default async function WeatherPage() {
    try {
        // This API call happens on the server
        const forecasts = await weatherApi.getWeatherForecast();

        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">
                    Weather Forecast
                </h1>
                <WeatherGrid forecasts={forecasts} />
            </div>
        );
    } catch (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">
                    Weather Forecast

                </h1>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">
                        Failed to load weather data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
}
