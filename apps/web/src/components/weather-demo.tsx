'use client'

import { useGetWeatherForecast } from '@mono/api-orval'

export function WeatherDemo() {
    const { data: response, isLoading, error } = useGetWeatherForecast()

    if (isLoading) {
        return (
            <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">Weather Forecast</h3>
                <div className="text-neutral-600">Loading weather data...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-lg mb-2">Weather Forecast</h3>
                <div className="text-red-600">Failed to load weather data: {error instanceof Error ? error.message : 'Unknown error'}</div>
            </div>
        )
    }

    if (!response || response.status !== 200) {
        return (
            <div className="p-4 border rounded-lg bg-yellow-50">
                <h3 className="font-semibold text-lg mb-2">Weather Forecast</h3>
                <div className="text-yellow-600">No weather data available</div>
            </div>
        )
    }

    const forecasts = response.data

    return (
        <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold text-lg mb-4">5-Day Weather Forecast</h3>
            <div className="grid gap-2">
                {forecasts.map((forecast, index) => (
                    <div
                        key={forecast.date || index}
                        className="flex justify-between items-center p-2 bg-white rounded"
                    >
                        <span className="font-medium">{forecast.date}</span>
                        <span className="text-sm text-gray-600">{forecast.summary}</span>
                        <span className="font-semibold">
                            {forecast.temperatureC}°C / {forecast.temperatureF}°F
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
