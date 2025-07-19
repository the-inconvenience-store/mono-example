// import { blogPostsApi, type BlogPost } from '@/lib/api-client'
import { getAllBlogPosts, BlogPost, getBlogPostBySlug } from '@mono/api-orval'
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await getAllBlogPosts()
    // The new getAllBlogPosts() returns an object with a 'data' property containing the posts array.
    // Check if response.data is an array (BlogPost[]), otherwise handle as error.
    if (Array.isArray(response.data)) {
      return response.data
    } else {
      console.error('Failed to fetch blog posts: received ProblemDetails', response.data)
      return []
    }
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await getBlogPostBySlug(slug)
    // The new getBlogPostBySlug() returns an object with a 'data' property containing the post or ProblemDetails.
    if (response && 'data' in response && response.data && !('type' in response.data)) {
      return response.data as BlogPost
    } else {
      console.error('Failed to fetch blog post: received ProblemDetails', response?.data)
      return null
    }
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error)
    return null
  }
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
