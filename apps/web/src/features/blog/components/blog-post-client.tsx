'use client'

import { notFound } from 'next/navigation'
import { CustomMDX } from '@/features/blog/components/mdx'
import { formatDate } from '@/features/blog/utils'
import { useGetBlogPostBySlug } from '@mono/api-orval'
import { baseUrl } from '@/app/sitemap'

interface BlogPostClientProps {
    slug: string
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
    const { data: response, isLoading, error } = useGetBlogPostBySlug(slug)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-neutral-600 dark:text-neutral-400">Loading blog post...</div>
            </div>
        )
    }

    if (error || !response || response.status !== 200) {
        notFound()
    }

    const post = response.data

    return (
        <section>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        dateModified: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image
                            ? `${baseUrl}${post.metadata.image}`
                            : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                        url: `${baseUrl}/blog/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: 'My Portfolio',
                        },
                    }),
                }}
            />
            <h1 className="title font-semibold text-2xl tracking-tighter">
                {post.metadata.title}
            </h1>
            <div className="flex justify-between items-center mt-2 mb-8 text-sm">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDate(post.metadata.publishedAt)}
                </p>
            </div>
            <article className="prose">
                <CustomMDX source={post.content} />
            </article>
        </section>
    )
}
