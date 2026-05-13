import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { BlogPost } from '../types'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    let q = supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
    if (category) q = q.eq('category', category)
    q.then(({ data }) => { if (data) setPosts(data) })
  }, [category])

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Section>
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">Blog</h1>
        <div className="section-divider" />
        <p className="text-gray-500 text-center mt-4 max-w-2xl mx-auto">Tips, guides and updates from Shahjalal Driving Training Center</p>
      </Section>

      {categories.length > 0 && (
        <Section delay={100}>
          <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
            <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!category ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
            {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>)}
          </div>
        </Section>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Section key={post.id} delay={i * 80}>
            <div className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="h-48 bg-gradient-to-br from-brand-red/10 to-brand-gold/10 flex items-center justify-center text-5xl overflow-hidden">
                {post.image_url ? <img src={post.image_url} alt="" className="w-full h-full object-cover" loading="lazy" /> : '📝'}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">{post.title_en || post.title_bn}</h2>
                <p className="text-sm text-gray-600 flex-1 mb-4 line-clamp-3">{post.excerpt_en || post.excerpt_bn}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{post.author}</span>
                  <span className="text-sm text-brand-red font-medium hover:underline">Read More →</span>
                </div>
              </div>
            </div>
          </Section>
        ))}
      </div>
      {posts.length === 0 && <p className="text-center text-gray-400 py-16">No articles yet. Coming soon!</p>}
    </div>
  )
}
