import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { AdminRoute } from './components/AdminRoute'
import { AdminLayout } from './components/AdminLayout'
import { AdminLogin } from './admin/Login'
import { AdminDashboard } from './admin/Dashboard'
import { AdminSettings } from './admin/Settings'
import { AdminBranchManager } from './admin/BranchManager'
import { AdminCourseManager } from './admin/CourseManager'
import { AdminLeadsManager } from './admin/LeadsManager'
import { AdminGalleryManager } from './admin/GalleryManager'
import { AdminTestimonialsManager } from './admin/TestimonialsManager'
import { AdminAboutManager } from './admin/AboutManager'
import { AdminSeoManager } from './admin/SeoManager'
import { AdminBlogManager } from './admin/BlogManager'
import { CourseDetailPage } from './pages/CourseDetail'
import { BlogDetailPage } from './pages/BlogDetail'
import { PublicLayout } from './components/PublicLayout'
import { HomePage } from './pages/Home'
import { CoursesPage } from './pages/Courses'
import { BranchesPage } from './pages/Branches'
import { BranchDetailPage } from './pages/BranchDetail'
import { AboutPage } from './pages/About'
import { GalleryPage } from './pages/Gallery'
import { ContactPage } from './pages/Contact'
import { EnrollPage } from './pages/Enroll'
import { BlogPage } from './pages/Blog'
import { LicensePage } from './pages/License'
import { CertificateCheckPage } from './pages/CertificateCheck'
import { ThemeProvider } from './hooks/useTheme'

function AdminWrapper({ children }: { children: React.ReactNode }) {
  return <AdminRoute><AdminLayout>{children}</AdminLayout></AdminRoute>
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/branches/:slug" element={<BranchDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/enroll" element={<EnrollPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/license" element={<LicensePage />} />
            <Route path="/certificate-check" element={<CertificateCheckPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminWrapper><AdminDashboard /></AdminWrapper>} />
          <Route path="/admin/settings" element={<AdminWrapper><AdminSettings /></AdminWrapper>} />
          <Route path="/admin/branches" element={<AdminWrapper><AdminBranchManager /></AdminWrapper>} />
          <Route path="/admin/courses" element={<AdminWrapper><AdminCourseManager /></AdminWrapper>} />
          <Route path="/admin/leads" element={<AdminWrapper><AdminLeadsManager /></AdminWrapper>} />
          <Route path="/admin/gallery" element={<AdminWrapper><AdminGalleryManager /></AdminWrapper>} />
          <Route path="/admin/testimonials" element={<AdminWrapper><AdminTestimonialsManager /></AdminWrapper>} />
          <Route path="/admin/about" element={<AdminWrapper><AdminAboutManager /></AdminWrapper>} />
          <Route path="/admin/blog" element={<AdminWrapper><AdminBlogManager /></AdminWrapper>} />
          <Route path="/admin/seo" element={<AdminWrapper><AdminSeoManager /></AdminWrapper>} />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>404</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}