import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, POSTS } from "@/lib/blog";
import { getCityData } from "@/lib/destinations";
import { breadcrumbJsonLd, ldJson } from "@/lib/jsonld";

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | 쿨스테이 블로그`,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.thumbnail],
      type: 'article',
      publishedTime: post.date,
    },
    alternates: {
      canonical: `https://coolstay.kr/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "홈", url: "https://coolstay.kr/" },
    { name: "블로그", url: "https://coolstay.kr/blog" },
    { name: post.title, url: `https://coolstay.kr/blog/${slug}` },
  ]);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.thumbnail,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'COOLSTAY', url: 'https://coolstay.kr' },
    publisher: {
      '@type': 'Organization',
      name: 'COOLSTAY',
      logo: { '@type': 'ImageObject', url: 'https://coolstay.kr/icon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://coolstay.kr/blog/${slug}` },
    keywords: post.tags.join(', '),
  };

  const city = post.cityKey && post.countryKey ? getCityData(post.countryKey, post.cityKey) : null;
  const related = POSTS.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <article className="bg-white">
      <script {...ldJson(breadcrumb)} />
      <script {...ldJson(articleLd)} />

      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500">홈</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="hover:text-orange-500">블로그</Link>
          </nav>
          <span className="inline-block text-xs bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-full mb-3">{post.category}</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>📅 {post.date}</span>
            <span>•</span>
            <span>📖 약 {Math.ceil((post.intro.length + post.sections.reduce((s, sec) => s + sec.content.length, 0)) / 500)}분 읽기</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8" />
        )}

        <p className="text-base text-gray-700 leading-relaxed mb-10 font-medium border-l-4 border-orange-500 pl-4">{post.intro}</p>

        {post.sections.map((s, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{s.h2}</h2>
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: s.content.replace(/\*\*(.+?)\*\*/g, '<strong class="text-orange-600">$1</strong>'),
              }}
            />
          </section>
        ))}

        {/* 태그 */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(t => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">#{t}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        {city && post.cityKey && post.countryKey && (
          <section className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">{city.name} 호텔 최저가 비교</h3>
            <p className="text-white/80 text-sm mb-4">아고다 실시간 특가 · 무료 취소</p>
            <Link href={`/${post.countryKey}/${post.cityKey}`}
              className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              {city.name} 호텔 보기
            </Link>
          </section>
        )}

        {/* 관련 글 */}
        {related.length > 0 && (
          <section className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow hover:border-orange-200 transition-all">
                  <div className="h-28 overflow-hidden">
                    <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-gray-800 line-clamp-2">{r.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
