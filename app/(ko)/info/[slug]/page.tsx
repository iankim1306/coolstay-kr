import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE, CATEGORIES, categorySlug, getLivePost, getLivePosts } from '@/lib/stay'
import { StayBody } from '@/components/StayBody'
import { breadcrumbJsonLd, ldJson } from '@/lib/jsonld'

export const dynamicParams = false

export async function generateStaticParams() {
  return getLivePosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getLivePost(slug)
  if (!post) return {}
  return {
    title: `${post.title} | 쿨스테이`,
    description: post.description,
    alternates: { canonical: `${BASE}/info/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.publishAt },
  }
}

export default async function StayPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getLivePost(slug)
  if (!post) notFound()

  const cat = CATEGORIES.find((c) => c.key === post.category)
  const related = getLivePosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 4)
  const others = getLivePosts()
    .filter((p) => p.category !== post.category)
    .slice(0, 3)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishAt,
    dateModified: post.publishAt,
    author: { '@type': 'Organization', name: '쿨스테이', url: BASE },
    publisher: { '@type': 'Organization', name: '쿨스테이', logo: { '@type': 'ImageObject', url: `${BASE}/icon.svg` } },
    mainEntityOfPage: `${BASE}/info/${post.slug}`,
  }
  const crumbs = breadcrumbJsonLd([
    { name: '홈', url: `${BASE}/` },
    { name: post.category, url: `${BASE}/info#${categorySlug(post.category)}` },
    { name: post.title, url: `${BASE}/info/${post.slug}` },
  ])

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script {...ldJson(articleLd)} />
      <script {...ldJson(crumbs)} />
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-teal-700">홈</Link> ›{' '}
        <Link href={`/info#${cat?.slug ?? ''}`} className="hover:text-teal-700">{post.category}</Link>
      </nav>
      <h1 className="mt-4 text-3xl font-bold leading-snug text-gray-900 sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-gray-500">{post.description}</p>
      <p className="mt-2 text-sm text-gray-400">쿨스테이 편집 · {post.publishAt}</p>

      <div className="mt-8 border-t border-gray-100 pt-2">
        <StayBody blocks={post.body} />
      </div>

      {post.sources && post.sources.length > 0 && (
        <section className="mt-12 rounded-xl bg-gray-50 p-5 text-sm">
          <h2 className="mb-2 font-bold text-gray-900">참고한 공식 자료</h2>
          <ul className="list-disc space-y-1 pl-5">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener nofollow" className="text-teal-700 underline underline-offset-2">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900">{post.category} 다른 글</h2>
          <ul className="space-y-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/info/${p.slug}`} className="font-medium text-gray-800 hover:text-teal-700">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">함께 보면 좋은 글</h2>
          <ul className="space-y-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/info/${p.slug}`} className="font-medium text-gray-800 hover:text-teal-700">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
