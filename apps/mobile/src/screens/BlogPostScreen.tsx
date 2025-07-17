import React, { useEffect, useState } from 'react'
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import Markdown from 'react-native-markdown-display'
import { getBlogPost, formatDate } from '../utils/blog'
import { BlogPost, RootStackParamList } from '../types'

type BlogPostScreenRouteProp = RouteProp<RootStackParamList, 'BlogPost'>

export function BlogPostScreen() {
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const route = useRoute<BlogPostScreenRouteProp>()
    const navigation = useNavigation()
    const { slug } = route.params

    useEffect(() => {
        loadBlogPost()
    }, [slug])

    const loadBlogPost = async () => {
        try {
            setLoading(true)
            setError(null)
            const post = await getBlogPost(slug)
            if (post) {
                setBlogPost(post)
                // Set the title in the navigation header
                navigation.setOptions({
                    title: post.metadata.title,
                })
            } else {
                setError('Blog post not found')
            }
        } catch (err) {
            setError('Failed to load blog post')
            console.error('Error loading blog post:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading blog post...</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (error || !blogPost) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error || 'Blog post not found'}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadBlogPost}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>{blogPost.metadata.title}</Text>

                    <View style={styles.metadata}>
                        <Text style={styles.date}>
                            {formatDate(blogPost.metadata.publishedAt)}
                        </Text>
                    </View>

                    <Text style={styles.summary}>{blogPost.metadata.summary}</Text>

                    <View style={styles.contentContainer}>
                        <Markdown style={markdownStyles}>
                            {blogPost.content}
                        </Markdown>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 36,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    metadata: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    summary: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    contentContainer: {
        marginTop: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    heading1: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 16,
        color: '#1a1a1a',
    },
    heading2: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 12,
        color: '#1a1a1a',
    },
    heading3: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: '#1a1a1a',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        color: '#333',
    },
    code_inline: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 14,
        fontFamily: 'Courier',
    },
    code_block: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        fontSize: 14,
        fontFamily: 'Courier',
    },
    link: {
        color: '#007AFF',
    },
    blockquote: {
        backgroundColor: '#f9f9f9',
        borderLeftWidth: 4,
        borderLeftColor: '#ddd',
        paddingLeft: 16,
        paddingVertical: 8,
        marginVertical: 8,
    },
})
