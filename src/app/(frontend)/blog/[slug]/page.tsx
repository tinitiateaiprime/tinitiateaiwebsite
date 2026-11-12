import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { getPayload } from '@/lib/getPayload'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload()

  const result = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const post = result.docs[0]
  if (!post) notFound()

  const author = typeof post.author === 'object' ? post.author : null
  const date = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
          ← Back to Blog
        </Link>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
          {date && <span>{date}</span>}
          {author && (
            <>
              <span>&middot;</span>
              <Link href={`/trainers/${author.slug}`} className="hover:text-brand-600">
                By {author.name}
              </Link>
            </>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
        <div className="mt-8">
          <RichText data={post.content} />
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {post.tags.map((t, i) => (
              <span key={t.id ?? i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {t.tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
