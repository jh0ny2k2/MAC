import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import Products from '../pages/admin/Products'
import ProductCreate from '../pages/admin/ProductCreate'
import ProductEdit from '../pages/admin/ProductEdit'
import Orders from '../pages/admin/Orders'
import OrderDetail from '../pages/admin/OrderDetail'
import Customers from '../pages/admin/Customers'
import CustomerDetail from '../pages/admin/CustomerDetail'
import Inventory from '../pages/admin/Inventory'
import Importar from '../pages/admin/Importar'
import Importaciones from '../pages/admin/Importaciones'
import Teams from '../pages/admin/Teams'
import Drivers from '../pages/admin/Drivers'
import Categories from '../pages/admin/Categories'
import Discounts from '../pages/admin/Discounts'
import Analytics from '../pages/admin/Analytics'
import Settings from '../pages/admin/Settings'
import NotFound from '../pages/NotFound'

function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
  }
  return <Outlet />
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/nuevo" element={<ProductCreate />} />
          <Route path="/productos/:id/editar" element={<ProductEdit />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/pedidos/:id" element={<OrderDetail />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/clientes/:id" element={<CustomerDetail />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/importar" element={<Importar />} />
          <Route path="/importaciones" element={<Importaciones />} />
          <Route path="/escuderias" element={<Teams />} />
          <Route path="/pilotos" element={<Drivers />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/descuentos" element={<Discounts />} />
          <Route path="/analiticas" element={<Analytics />} />
          <Route path="/ajustes" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}