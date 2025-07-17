import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { weatherApi, WeatherForecast } from "../lib/api-client";
import { WeatherCard } from "../components/WeatherCard";

export function WeatherScreen() {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadForecasts = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            setError(null);

            const data = await weatherApi.getWeatherForecast();
            setForecasts(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load weather data");
            console.error("Weather API error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadForecasts(true);
    };

    useEffect(() => {
        loadForecasts();
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Weather Forecast</Text>
            {lastUpdated && (
                <Text style={styles.lastUpdated}>
                    Updated: {lastUpdated.toLocaleTimeString()}
                </Text>
            )}
        </View>
    );

    const renderForecast = ({ item }: { item: WeatherForecast }) => (
        <WeatherCard forecast={item} />
    );

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading weather data...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => loadForecasts()}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No weather data available</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={forecasts}
                renderItem={renderForecast}
                keyExtractor={(item, index) =>
                    item.date?.toString() || index.toString()
                }
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#007AFF"]}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    lastUpdated: {
        fontSize: 14,
        color: "#666",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        minHeight: 200,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff4444",
        textAlign: "center",
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
