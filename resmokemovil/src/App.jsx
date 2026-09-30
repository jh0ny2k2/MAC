import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { AuthProvider } from './contexts/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CONFIG } from './config/googleAuth'
import useAnalytics from './hooks/useAnalytics'
import Home from './pages/Home/Home'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import CategoryPage from './pages/Category/CategoryPage'
import AddProductPage from './pages/AddProduct/AddProductPage'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import ProductPage from './pages/Product/ProductPage';
import ProfilePage from './pages/Profile/ProfilePage';
import MyProductsPage from './pages/Product/MyProductsPage';
import FavoritesPage from './pages/Favorites/FavoritesPage';
import EditProfilePage from './pages/Profile/EditProfilePage';
import EditProductPage from './pages/Product/EditProductPage';
import ChatPage from './pages/Chat/ChatPage';
import MyChatsPage from './pages/Chat/MyChatsPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import PurchasesPage from './pages/Purchases/PurchasesPage';
import MyReviews from './pages/Profile/MyReviews';
import AvisoLegal from './pages/Legal/AvisoLegal';
import Privacidad from './pages/Legal/Privacidad';
import Cookies from './pages/Legal/Cookies';
import Terminos from './pages/Legal/Terminos';
import SellerProfilePage from './pages/Profile/SellerProfilePage';
import StatisticsPage from './pages/Statistics/StatisticsPage';

// Importaciones de About
import AboutPage from './pages/About/AboutPage';
import SustainabilityPage from './pages/About/SustainabilityPage';
import CareersPage from './pages/About/CareersPage';
import HelpCenterPage from './pages/About/HelpCenterPage';
import CommunityRulesPage from './pages/About/CommunityRulesPage';
import SafetyTipsPage from './pages/About/SafetyTipsPage';
import HowToBuyPage from './pages/About/HowToBuyPage';
import PaymentMethodsPage from './pages/About/PaymentMethodsPage';
import ContactSellerPage from './pages/About/ContactSellerPage';
import ReturnPolicyPage from './pages/About/ReturnPolicyPage';
import HowToSellPage from './pages/About/HowToSellPage';
import PhotoTipsPage from './pages/About/PhotoTipsPage';
import OrderManagementPage from './pages/About/OrderManagementPage';
import PricingTipsPage from './pages/About/PricingTipsPage';
import CreateAccountPage from './pages/About/CreateAccountPage';
import ChangePasswordPage from './pages/About/ChangePasswordPage';
import UpdateProfilePage from './pages/About/UpdateProfilePage';
import PrivacySettingsPage from './pages/About/PrivacySettingsPage';

// Nuevas páginas de Pagos y Facturación
import AcceptedPaymentMethodsPage from './pages/About/AcceptedPaymentMethodsPage';
import PaymentProcessingPage from './pages/About/PaymentProcessingPage';
import PaymentIssuesPage from './pages/About/PaymentIssuesPage';
import RefundsPage from './pages/About/RefundsPage';

// Nuevas páginas de Seguridad
import SecurityTipsPage from './pages/About/SecurityTipsPage';
import DataProtectionPage from './pages/About/DataProtectionPage';
import ReportSuspiciousActivityPage from './pages/About/ReportSuspiciousActivityPage';
import IdentityVerificationPage from './pages/About/IdentityVerificationPage';

// Nuevas páginas de Soporte Técnico
import ContactSupportPage from './pages/About/ContactSupportPage';
import ReportBugPage from './pages/About/ReportBugPage';
import SystemStatusPage from './pages/About/SystemStatusPage';
import TutorialsPage from './pages/About/TutorialsPage';


// Importaciones de Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminProductsPending from './pages/Admin/Products/AdminProductsPending';
import ViewProduct from './pages/Admin/Products/ViewProduct';
import EditProduct from './pages/Admin/Products/EditProduct';
import AddProduct from './pages/Admin/Products/AddProduct';
import EditUser from './pages/Admin/Users/EditUser';
import AddUser from './pages/Admin/Users/AddUser';
import RequireAdmin from './components/RouteGuards/RequireAdmin';
import RequireAuth from './components/RouteGuards/RequireAuth';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import AdminStripePage from './pages/Admin/AdminStripePage';
import AdminSupabasePage from './pages/Admin/AdminSupabasePage';
import AdminNetlifyPage from './pages/Admin/AdminNetlifyPage';
import AdminReports from './pages/Admin/AdminReports';
import AdminOpinions from './pages/Admin/AdminOpinions';
import AddCategory from './pages/Admin/Categories/AddCategory';
import CheckoutPage from './pages/Checkout/CheckoutPage';

// Importaciones de Subscription
import SubscriptionPage from './pages/Subscription/SubscriptionPage';
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans';
import SubscriptionSuccess from './pages/Subscription/SubscriptionSuccess';
import SubscriptionCancel from './pages/Subscription/SubscriptionCancel';
import SubscriptionTest from './pages/Subscription/SubscriptionTest';
import SubscriptionManagementPage from './pages/Subscription/SubscriptionManagementPage';
import PromotionsPage from './pages/Subscription/PromotionsPage';
import PWAInstallPrompt from './components/PWA/PWAInstallPrompt';
import ChatNotificationListener from './components/Chat/ChatNotificationListener';

function SentryRouteTracker() {
  const location = useLocation()

  useEffect(() => {
    if (!import.meta.env.VITE_SENTRY_DSN) return
    const path = `${location.pathname}${location.search || ''}${location.hash || ''}`
    Sentry.setTag('route', location.pathname)
    Sentry.setContext('route', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    })
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: path,
      level: 'info'
    })
  }, [location])

  return null
}

function AppContent() {
  useAnalytics();

  return (
    <>
      <PWAInstallPrompt />
      <ChatNotificationListener />
      <SentryRouteTracker />
      <Routes>
        <Route path="/" element={
        <>
          <Header />
          <Home />
          <Footer />
        </>
      } />
      <Route path="/welcome" element={
        <>
          <Header />
          <Home />
          <Footer />
        </>
      } />

      {/* Rutas de Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas de Productos */}
      <Route path="/web/verCategoria/:categoryId" element={<CategoryPage />} />
      <Route path="/categoria/:categoryKey" element={<CategoryPage />} />
      <Route path="/add-product" element={<RequireAuth><AddProductPage /></RequireAuth>} />
      <Route path="/product/:productId" element={<ProductPage />} />
      <Route path="/checkout/:productId" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/productos" element={<CategoryPage />} />
      <Route path="/my-products" element={<RequireAuth><MyProductsPage /></RequireAuth>} />
      <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
      <Route path="/edit-product/:id" element={<RequireAuth><EditProductPage /></RequireAuth>} />
      <Route path="/purchases" element={<RequireAuth><PurchasesPage /></RequireAuth>} />

      {/* Rutas de Perfil */}
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/edit-profile" element={<RequireAuth><EditProfilePage /></RequireAuth>} />
      <Route path="/my-reviews" element={<RequireAuth><MyReviews /></RequireAuth>} />
      <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
      <Route path="/statistics" element={<RequireAuth><StatisticsPage /></RequireAuth>} />

      {/* Rutas de Chat */}
      <Route path="/chat/:conversationId" element={<RequireAuth><ChatPage /></RequireAuth>} />
      <Route path="/my-chats" element={<RequireAuth><MyChatsPage /></RequireAuth>} />
      
      {/* Rutas de Ayuda */}
      <Route path="/about" element={<AboutPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contacto" element={<HelpCenterPage />} />
      <Route path="/normas-resmoke" element={<CommunityRulesPage />} />
      <Route path="/consejos-seguridad" element={<SafetyTipsPage />} />

      <Route path="/aviso-legal" element={<AvisoLegal />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/terminos" element={<Terminos />} />

            {/* Rutas de Comprar */}
            <Route path="/como-comprar" element={<HowToBuyPage />} />
            <Route path="/metodos-pago" element={<PaymentMethodsPage />} />
            <Route path="/contactar-vendedor" element={<ContactSellerPage />} />
            <Route path="/politica-devoluciones" element={<ReturnPolicyPage />} />

            {/* Rutas de Vender */}
            <Route path="/como-publicar" element={<HowToSellPage />} />
            <Route path="/consejos-fotos" element={<PhotoTipsPage />} />
            <Route path="/gestion-pedidos" element={<OrderManagementPage />} />
            <Route path="/fijar-precios" element={<PricingTipsPage />} />

            {/* Rutas de Mi Cuenta */}
            <Route path="/crear-cuenta" element={<CreateAccountPage />} />
            <Route path="/cambiar-password" element={<ChangePasswordPage />} />
            <Route path="/actualizar-perfil" element={<UpdateProfilePage />} />
            <Route path="/configuracion-privacidad" element={<PrivacySettingsPage />} />
            
            {/* Rutas de Pagos y Facturación */}
            <Route path="/metodos-pago-aceptados" element={<AcceptedPaymentMethodsPage />} />
            <Route path="/cuando-procesa-pago" element={<PaymentProcessingPage />} />
            <Route path="/problemas-pagos" element={<PaymentIssuesPage />} />
            <Route path="/reembolsos-cancelaciones" element={<RefundsPage />} />
            
            {/* Rutas de Seguridad */}
            <Route path="/consejos-seguridad-avanzados" element={<SecurityTipsPage />} />
            <Route path="/proteccion-datos" element={<DataProtectionPage />} />
            <Route path="/reportar-actividad" element={<ReportSuspiciousActivityPage />} />
            <Route path="/verificacion-identidad" element={<IdentityVerificationPage />} />
            
            {/* Rutas de Soporte Técnico */}
            <Route path="/contactar-soporte" element={<ContactSupportPage />} />
            <Route path="/reportar-bug" element={<ReportBugPage />} />
            <Route path="/estado-sistema" element={<SystemStatusPage />} />
            <Route path="/tutoriales" element={<TutorialsPage />} />

      {/* Rutas de No Recuerdo Contraseña */}      
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Rutas de Admin (protegidas) */}
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

        {/* Rutas de Usuarios */}
        <Route path="/admin/usuarios" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/usuarios/editar/:id" element={<RequireAdmin><EditUser /></RequireAdmin>} />
        <Route path="/admin/usuarios/agregar" element={<RequireAdmin><AddUser /></RequireAdmin>} />

        {/* Rutas de Productos */}
        <Route path="/admin/productos" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
        <Route path="/admin/productos/ver/:id" element={<RequireAdmin><ViewProduct /></RequireAdmin>} />
        <Route path="/admin/productos/editar/:id" element={<RequireAdmin><EditProduct /></RequireAdmin>} />
        <Route path="/admin/productos/ver/:id" element={<RequireAdmin><ViewProduct /></RequireAdmin>} />
        <Route path="/admin/productos/agregar" element={<RequireAdmin><AddProduct /></RequireAdmin>} />
        <Route path="/admin/productos/confirmaciones" element={<RequireAdmin><AdminProductsPending /></RequireAdmin>} />

        {/* Rutas de Categorias */}
        <Route path="/admin/categorias" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
        <Route path="/admin/categorias/agregar" element={<RequireAdmin><AddCategory /></RequireAdmin>} />

        {/* Rutas de Analíticas */}
        <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />

        {/* Rutas de Stripe */}
        <Route path="/admin/stripe" element={<RequireAdmin><AdminStripePage /></RequireAdmin>} />

        {/* Rutas de Supabase */}
        <Route path="/admin/supabase" element={<RequireAdmin><AdminSupabasePage /></RequireAdmin>} />

        {/* Rutas de Netlify */}
        <Route path="/admin/netlify" element={<RequireAdmin><AdminNetlifyPage /></RequireAdmin>} />

        {/* Rutas de Reportes */}
        <Route path="/admin/reportes" element={<RequireAdmin><AdminReports /></RequireAdmin>} />

        {/* Rutas de Opiniones */}
        <Route path="/admin/opiniones" element={<RequireAdmin><AdminOpinions /></RequireAdmin>} />

      {/* Rutas de Suscripción */}
      {/* Rutas específicas de subscription primero */}
                <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
                <Route path="/subscription/test" element={<SubscriptionTest />} />
                <Route path="/subscription/plans" element={<SubscriptionPlans />} />
                <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                <Route path="/subscription-management" element={<SubscriptionManagementPage />} />
                {/* Ruta general de subscription al final */}
                <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.clientId}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App;




