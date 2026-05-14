import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import { ArticleCard } from '../components/ui/blog-post-card'
import type { BlogPost } from '../types'

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [filtered, setFiltered] = useState<BlogPost[]>([])
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setAllPosts(data)
        const cats = [...new Set(data.map(p => p.category).filter(Boolean))] as string[]
        setCategories(cats)
      }
    })
  }, [])

  useEffect(() => {
    if (category) {
      setFiltered(allPosts.filter(p => p.category === category))
    } else {
      setFiltered(allPosts)
    }
  }, [category, allPosts])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Section>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">Blog</h1>
        <div className="section-divider" />
        <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">Tips, guides and updates from Shahjalal Driving Training Center</p>
      </Section>

      {categories.length > 0 && (
        <Section delay={100}>
          <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
            <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!category ? 'bg-orange-500 text-white shadow-md' : 'bg-[#374151] text-gray-300 hover:bg-orange-500/20 hover:text-orange-400'}`}>All</button>
            {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-orange-500 text-white shadow-md' : 'bg-[#374151] text-gray-300 hover:bg-orange-500/20 hover:text-orange-400'}`}>{c}</button>)}
          </div>
        </Section>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <Section key={post.id} delay={i * 80} className="h-full">
            <ArticleCard
              headline={post.title_en || post.title_bn}
              excerpt={post.excerpt_en || post.excerpt_bn}
              cover={post.image_url || undefined}
              tag={post.category}
              writer={post.author}
              publishedAt={new Date(post.created_at)}
              clampLines={3}
              readMoreUrl={`/blog/${post.slug}`}
            />
          </Section>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-500 py-16">No articles yet. Coming soon!</p>}
    </div>
  )
}