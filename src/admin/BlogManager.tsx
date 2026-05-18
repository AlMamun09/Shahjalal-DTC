import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ImageUpload } from '../components/ImageUpload'
import type { BlogPost } from '../types'

export function AdminBlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    slug: '', title_bn: '', title_en: '', excerpt_bn: '', excerpt_en: '',
    content_bn: '', content_en: '', image_url: '', author: '', category: '', tags: '', published: true,
  })

  useEffect(() => { loadPosts() }, [])

  function loadPosts() {
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPosts(data)
    })
  }

  const openNew = () => {
    setForm({ slug: '', title_bn: '', title_en: '', excerpt_bn: '', excerpt_en: '', content_bn: '', content_en: '', image_url: '', author: '', category: '', tags: '', published: true })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (post: BlogPost) => {
    setForm({
      slug: post.slug, title_bn: post.title_bn, title_en: post.title_en,
      excerpt_bn: post.excerpt_bn, excerpt_en: post.excerpt_en,
      content_bn: post.content_bn, content_en: post.content_en,
      image_url: post.image_url, author: post.author, category: post.category,
      tags: post.tags?.join(', ') || '', published: post.published,
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const data = {
      ...form,
      slug,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editingId) {
      await supabase.from('blog_posts').update(data).eq('id', editingId)
    } else {
      await supabase.from('blog_posts').insert(data)
    }
    setShowForm(false)
    setEditingId(null)
    loadPosts()
  }

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('blog_posts').update({ published: !current }).eq('id', id)
    loadPosts()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    loadPosts()
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0"><h1 className="text-2xl font-bold text-white">Blog Manager</h1><p className="text-sm text-gray-400 mt-1">Create and manage blog posts</p></div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link to="/blog" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all border border-white/[0.06]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Blog
          </Link>
          <button onClick={openNew} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Post
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-[#111827] rounded-2xl p-6 w-full max-w-4xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto border border-white/[0.06]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-orange-500/10 rounded-xl transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Title (Bn)</label>
                  <input value={form.title_bn} onChange={e => setForm({ ...form, title_bn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Title (En)</label>
                  <input required value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Slug (leave blank for auto)</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" placeholder="e.g. Tips, News" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" placeholder="driving, tips, safety" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Excerpt (Bn)</label>
                <textarea value={form.excerpt_bn} onChange={e => setForm({ ...form, excerpt_bn: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Excerpt (En)</label>
                <textarea value={form.excerpt_en} onChange={e => setForm({ ...form, excerpt_en: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Content (Bn)</label>
                <textarea value={form.content_bn} onChange={e => setForm({ ...form, content_bn: e.target.value })} rows={6}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white font-bangla" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Content (En)</label>
                <textarea value={form.content_en} onChange={e => setForm({ ...form, content_en: e.target.value })} rows={6}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                  <ImageUpload value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} folder="blog" /></div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm text-gray-300">Published</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-[#374151] text-gray-300 rounded-xl font-medium hover:bg-orange-500/10 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#111827] rounded-[20px] border border-white/[0.06] shadow-xl shadow-black/20 p-4 transition-all hover:shadow-orange-500/10">
            {post.image_url ? (
              <div className="relative h-32 rounded-[16px] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent mb-4">
                <img src={post.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 rounded-[16px] mb-4 bg-[#374151] flex items-center justify-center text-4xl opacity-40">📝</div>
            )}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-white truncate">{post.title_en || post.title_bn}</h3>
                {post.title_bn && post.title_en && <p className="text-xs text-gray-500 truncate">{post.title_bn}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {post.published ? 'Live' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {post.category && <span className="text-orange-400">{post.category}</span>}
              {post.category && post.author && <span className="mx-1">·</span>}
              {post.author && <span>{post.author}</span>}
              <span className="mx-1">·</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </p>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{post.excerpt_en || post.excerpt_bn}</p>
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
              <button onClick={() => openEdit(post)} className="w-full sm:w-auto px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-xl text-xs font-medium hover:bg-orange-500/20 transition-all">Edit</button>
              <div className="flex gap-1.5">
                <button onClick={() => togglePublished(post.id, post.published)} className="flex-1 sm:flex-none px-3 py-1.5 bg-white/[0.04] text-gray-400 rounded-xl text-xs font-medium hover:bg-white/[0.08] transition-all">
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => remove(post.id)} className="flex-1 sm:flex-none px-2 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-all">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && <p className="text-center text-gray-500 py-12">No posts yet. Click "New Post" to create one.</p>}
    </div>
  )
}