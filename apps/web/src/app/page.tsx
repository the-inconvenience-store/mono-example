import { BlogPosts } from '@/features/blog/components/posts'

export default async function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Blog
      </h1>
      <p className="mb-4">
        {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
