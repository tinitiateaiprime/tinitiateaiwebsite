import { Container } from '@/components/ui/Container'
import { BlogCard } from '@/components/BlogCard'
import { getPayload } from '@/lib/getPayload'

export const metadata = { title: 'Blog — TinitiateAI' }

export default async function BlogPage() {
  const payload = await getPayload()
  const posts = await payload.find({ collection: 'blog-posts', limit: 50, depth: 1, sort: '-publishedDate' })

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Blog</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Career advice and AI insights from our trainers
        </h1>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.docs.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </Container>
  )
}
