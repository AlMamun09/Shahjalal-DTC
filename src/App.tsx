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
import { PublicLayout } from './components/PublicLayout'
import { HomePage } from './pages/Home'
import { CoursesPage } from './pages/Courses'
import { BranchesPage } from './pages/Branches'
import { BranchDetailPage } from './pages/BranchDetail'
import { AboutPage } from './pages/About'
import { GalleryPage } from './pages/Gallery'
import { ContactPage } from './pages/Contact'
import { EnrollPage } from './pages/Enroll'

function AdminWrapper({ children }: { children: React.ReactNode }) {
  return <AdminRoute><AdminLayout>{children}</AdminLayout></AdminRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/branches/:slug" element={<BranchDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/enroll" element={<EnrollPage />} />
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
        <Route path="/admin/seo" element={<AdminWrapper><AdminSeoManager /></AdminWrapper>} />

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-light-gray">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-brand-red mb-4">404</h1>
              <p className="text-gray-600">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
