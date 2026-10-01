import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Fabrics from './pages/Fabrics'
import FabricDetail from './pages/FabricDetail'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Resources from './pages/Resources'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import AdminLogin from './admin/pages/Login'
import AdminDashboard from './admin/pages/Dashboard'
import AdminProducts from './admin/pages/Products'
import AdminProductForm from './admin/pages/ProductForm'
import AdminLeads from './admin/pages/Leads'
import ProtectedRoute from './admin/components/ProtectedRoute'
import Settings from './admin/pages/Settings'
import MediaLibrary from './admin/pages/MediaLibrary'
import CatalogGallery from './admin/pages/CatalogGallery'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/fabrics" element={<Fabrics />} />
        <Route path="/fabrics/:slug" element={<FabricDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin panel — no site header/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
      <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
      <Route path="/admin/catalog" element={<ProtectedRoute><CatalogGallery /></ProtectedRoute>} />
    </Routes>
  )
}
