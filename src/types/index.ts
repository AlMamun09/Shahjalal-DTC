export interface Branch {
  id: string
  slug: string
  name_bn: string
  name_en: string
  address_bn: string
  address_en: string
  phones: string[]
  emails: string[]
  whatsapp: string
  map_embed_url: string
  photo_url: string
  seo_title: string
  seo_desc: string
  seo_keywords: string
  is_active: boolean
  sort_order: number
}

export interface Course {
  id: string
  slug: string
  name_bn: string
  name_en: string
  category: 'car' | 'motorcycle' | 'professional' | 'refresher' | 'license'
  duration_bn: string
  duration_en: string
  fee: string
  description_bn: string
  description_en: string
  icon: string
  is_active: boolean
  sort_order: number
}

export interface Lead {
  id: string
  created_at: string
  name: string
  phone: string
  email: string
  branch_pref: string
  course_interest: string
  message: string
  status: 'new' | 'contacted' | 'enrolled' | 'closed'
  admin_notes: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  text_bn: string
  text_en: string
  photo_url: string
  is_visible: boolean
  sort_order: number
}

export interface Instructor {
  id: string
  name_bn: string
  name_en: string
  experience: string
  specialization: string
  photo_url: string
  is_active: boolean
}

export interface SiteSetting {
  key: string
  value: string
}

export interface PageSEO {
  page_key: string
  meta_title: string
  meta_desc: string
  og_image_url: string
}

export interface GalleryPhoto {
  id: string
  url: string
  alt_text: string
  sort_order: number
}

export interface GalleryVideo {
  id: string
  title_bn: string
  title_en: string
  youtube_url: string
  sort_order: number
}
