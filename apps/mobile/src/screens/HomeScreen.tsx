import React, { useEffect, useState } from 'react'
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getBlogPosts, formatDate } from '../utils/blog'
import { BlogPost, RootStackParamList } from '../types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

export function HomeScreen() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigation = useNavigation<NavigationProp>()

    useEffect(() => {
        loadBlogPosts()
    }, [])

    const loadBlogPosts = async () => {
        try {
            setLoading(true)
            setError(null)
            const posts = await getBlogPosts()
            // Sort posts by date (newest first)
            const sortedPosts = posts.sort((a, b) => {
                return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
            })
            setBlogPosts(sortedPosts)
        } catch (err) {
            setError('Failed to load blog posts')
            console.error('Error loading blog posts:', err)
        } finally {
            setLoading(false)
        }
    }

    const handlePostPress = (slug: string) => {
        navigation.navigate('BlogPost', { slug })
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadBlogPosts()
        setRefreshing(false)
    }

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <Text style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </Text>
            <TouchableOpacity
                style={styles.weatherButton}
                onPress={() => navigation.navigate('Weather')}
            >
                <Text style={styles.weatherButtonText}>View Weather</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Latest Blog Posts</Text>
        </View>
    )

    const renderBlogPost = ({ item }: { item: BlogPost }) => (
        <TouchableOpacity
            style={styles.postContainer}
            onPress={() => handlePostPress(item.slug)}
            activeOpacity={0.7}
        >
            <View style={styles.postContent}>
                <Text style={styles.postDate}>
                    {formatDate(item.metadata.publishedAt, false)}
                </Text>
                <Text style={styles.postTitle}>{item.metadata.title}</Text>
                <Text style={styles.postSummary} numberOfLines={2}>
                    {item.metadata.summary}
                </Text>
            </View>
        </TouchableOpacity>
    )

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading blog posts...</Text>
                </View>
            )
        }

        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadBlogPosts}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return null
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={blogPosts}
                renderItem={renderBlogPost}
                keyExtractor={(item) => item.slug}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    weatherButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    weatherButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        padding: 16,
    },
    headerContent: {
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postContent: {
        gap: 8,
    },
    postDate: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    postTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 24,
    },
    postSummary: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        minHeight: 200,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
