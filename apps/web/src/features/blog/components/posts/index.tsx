'use client'
import Link from 'next/link'
import { formatDate, getBlogPosts } from '@/features/blog/utils'
import { useGetAllBlogPosts } from '@mono/api-orval'
import type { BlogPost } from '@mono/api-orval'

export function BlogPosts() {
  const { data: response, isLoading, error } = useGetAllBlogPosts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-neutral-600 dark:text-neutral-400">Loading blog posts...</div>
      </div>
    )
  }

  if (error) {
    console.error(error)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600 dark:text-red-400">Failed to load blog posts</div>
      </div>
    )
  }

  // Check if response is successful and contains data
  if (!response || response.status !== 200) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600 dark:text-red-400">Failed to load blog posts</div>
      </div>
    )
  }

  const allBlogs: BlogPost[] = response.data || []
  // const allBlogs = await getBlogPosts()
  return (
    <div>
      {allBlogs
        .sort((a: BlogPost, b: BlogPost) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post: BlogPost) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
