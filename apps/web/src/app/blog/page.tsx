import { BlogPosts } from '@/features/blog/components/posts'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default async function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
