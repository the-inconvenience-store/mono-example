"use client";

import { WeatherGrid } from "@/features/weather/component/WeatherGrid";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useWeatherData } from "@mono/hooks";

export default function InteractiveWeatherPage() {
    const { forecasts, error, lastUpdated, loading, refresh } = useWeatherData()

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Interactive Weather Dashboard
                    </h1>
                    {lastUpdated && (
                        <p className="text-sm text-gray-600">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                <Button
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-2"
                    variant={'weather'}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    {loading ? "Loading..." : "Refresh"}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {loading && forecasts.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading weather data...</span>
                </div>
            ) : (
                <WeatherGrid forecasts={forecasts} />
            )}
        </div>
    );
}
