import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import ScrollToTop from './components/common/ScrollToTop'
import { DashboardProvider } from './context/DashboardContext'

const Home = lazy(() => import('./pages/Home'))
const Invitaciones = lazy(() => import('./pages/Invitaciones'))
const InvitacionesDisenos = lazy(() => import('./pages/InvitacionesDisenos'))
const InvitacionesCrear = lazy(() => import('./pages/InvitacionesCrear'))
const InvitacionesPublicar = lazy(() => import('./pages/InvitacionesPublicar'))
const Services = lazy(() => import('./pages/Services'))
const Templates = lazy(() => import('./pages/Templates'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const Clients = lazy(() => import('./pages/dashboard/Clients'))
const Websites = lazy(() => import('./pages/dashboard/Websites'))
const Projects = lazy(() => import('./pages/dashboard/Projects'))
const Requests = lazy(() => import('./pages/dashboard/Requests'))
const DashboardTemplates = lazy(() => import('./pages/dashboard/DashboardTemplates'))
const Billing = lazy(() => import('./pages/dashboard/Billing'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))
const FinderLead = lazy(() => import('./pages/dashboard/FinderLead'))
const Campaigns = lazy(() => import('./pages/dashboard/Campaigns'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#f5b342] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <DashboardProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/plantillas" element={<Templates />} />
              <Route path="/precios" element={<Pricing />} />
              <Route path="/sobre-nosotros" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/invitaciones" element={<Invitaciones />} />
            <Route path="/invitaciones/disenos" element={<InvitacionesDisenos />} />
            <Route path="/invitaciones/crear" element={<InvitacionesCrear />} />
            <Route path="/invitaciones/publicar" element={<InvitacionesPublicar />} />
            <Route path="/panel" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="webs" element={<Websites />} />
              <Route path="proyectos" element={<Projects />} />
              <Route path="solicitudes" element={<Requests />} />
              <Route path="plantillas" element={<DashboardTemplates />} />
              <Route path="facturacion" element={<Billing />} />
              <Route path="configuracion" element={<Settings />} />
              <Route path="finderlead" element={<FinderLead />} />
              <Route path="campaigns" element={<Campaigns />} />
            </Route>
          </Routes>
        </Suspense>
      </DashboardProvider>
    </>
  )
}
