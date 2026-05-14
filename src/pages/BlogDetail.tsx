import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { BlogPost } from '../types'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function BlogDetailPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    if (!slug) return
    supabase.from('blog_posts').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setPost(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/blog" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">Back to Blog</Link>
      </div>
    )
  }

  const title = lang === 'bn' ? post.title_bn : post.title_en
  const content = lang === 'bn' ? post.content_bn : post.content_en

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Section>
        <Link to="/blog" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Blog
        </Link>
      </Section>

      <article>
        {post.image_url && (
          <Section delay={50}>
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg shadow-orange-500/10">
              <img src={post.image_url} alt="" className="w-full h-64 md:h-80 object-cover" />
            </div>
          </Section>
        )}

        <Section delay={80}>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            {post.category && (
              <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-medium">{post.category}</span>
            )}
            <span>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 leading-[1.3]">
            {title}
          </h1>

          {post.excerpt_en && (
            <p className="text-lg text-gray-400 mb-8 leading-relaxed italic border-l-4 border-orange-500/30 pl-4">
              {lang === 'bn' ? post.excerpt_bn : post.excerpt_en}
            </p>
          )}
        </Section>

        <Section delay={120}>
          <div className="prose prose-invert max-w-none">
            {content ? (
              <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
                {content}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available yet.</p>
            )}
          </div>
        </Section>
      </article>

      <Section delay={180}>
        <div className="mt-12 pt-8 border-t border-orange-500/10 flex justify-between items-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Blog
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-[#374151] text-gray-400 rounded-lg text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  )
}