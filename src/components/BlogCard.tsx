import Link from 'next/link'
import type { BlogPost } from '@/payload-types'

export function BlogCard({ post }: { post: BlogPost }) {
  const author = typeof post.author === 'object' ? post.author : null
  const date = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        {date && <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{date}</span>}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{post.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-slate-600">{post.excerpt}</p>
        {author && <p className="mt-2 text-xs font-medium text-slate-500">By {author.name}</p>}
      </div>
    </Link>
  )
}
