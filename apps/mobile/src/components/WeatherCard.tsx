import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WeatherForecast } from "../lib/api-client";

interface WeatherCardProps {
    forecast: WeatherForecast;
    onPress?: () => void;
}

export function WeatherCard({ forecast, onPress }: WeatherCardProps) {
    const formatDate = (date?: Date) => {
        if (!date) return "Unknown";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getTemperatureColor = (temp?: number) => {
        if (!temp) return "#666";
        if (temp < 0) return "#2563eb";
        if (temp < 15) return "#3b82f6";
        if (temp < 25) return "#10b981";
        return "#ef4444";
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <Text style={styles.date}>{formatDate(forecast.date)}</Text>
                <View style={styles.summaryBadge}>
                    <Text style={styles.summaryText}>
                        {forecast.summary || "Unknown"}
                    </Text>
                </View>
            </View>

            <View style={styles.temperatureContainer}>
                <Text
                    style={[
                        styles.temperatureC,
                        { color: getTemperatureColor(forecast.temperatureC) },
                    ]}
                >
                    {forecast.temperatureC}°C
                </Text>
                <Text style={styles.temperatureF}>{forecast.temperatureF}°F</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    date: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    summaryBadge: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    summaryText: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    temperatureContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    temperatureC: {
        fontSize: 24,
        fontWeight: "bold",
    },
    temperatureF: {
        fontSize: 14,
        color: "#666",
    },
});
