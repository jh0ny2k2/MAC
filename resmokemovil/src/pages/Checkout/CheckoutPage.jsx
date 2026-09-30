import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import stripeService from '../../services/stripeService'

const CheckoutPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [seller, setSeller] = useState(null)
  const [currentUserDbId, setCurrentUserDbId] = useState(null)

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [protection, setProtection] = useState(true)

  const protectionCost = 17.6

  const price = product ? parseFloat(product.price) || 0 : 0
  const extra = protection ? protectionCost : 0
  const total = (price + extra)

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories (id, name), Users!products_user_id_fkey (id, nombre, email)`) 
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
      setCategory(data.categories)
      setSeller(data.Users)
    } catch (e) {
      setError('Error cargando producto')
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUserDbId = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email, telefono')
        .eq('email', user.email)
        .single()
      if (error) throw error
      setCurrentUserDbId(data.id)
    } catch {}
  }

  useEffect(() => {
    fetchProduct()
    fetchCurrentUserDbId()
  }, [productId, user])

  const handleContinue = async () => {
    if (!user || !currentUserDbId) {
      alert('Debes iniciar sesión para comprar')
      return
    }
    if (user && user.isVerified === false) {
      alert('Debes verificar tu correo electrónico para realizar compras')
      navigate('/verificacion-identidad')
      return
    }
    if (!product) return
    if (String(currentUserDbId) === String(product.user_id)) {
      alert('No puedes comprar tu propio producto')
      return
    }
    if (product.status !== 'available') {
      alert('Este producto ya no está disponible')
      return
    }
    try {
      if (paymentMethod === 'card') {
        if (Number(total) <= 0) {
          const { error: updateError } = await supabase
            .from('products')
            .update({
              status: 'sold',
              buyer_user_id: currentUserDbId,
              buyer_name: user.nombre,
              buyer_email: user.email,
              buyer_phone: user.telefono || '',
              sold_date: new Date().toISOString(),
              sale_price: 0
            })
            .eq('id', productId)
          if (updateError) throw updateError
          alert('Compra confirmada (gratuita)')
          navigate('/purchases')
          return
        }
        const successUrl = `${window.location.origin}/purchases?session_id={CHECKOUT_SESSION_ID}`
        const cancelUrl = `${window.location.origin}/product/${productId}`
        const result = await stripeService.createProductCheckout({
          productId,
          amount: total,
          productName: product?.name,
          buyerUserId: currentUserDbId,
          buyerEmail: user.email,
          successUrl,
          cancelUrl,
        })
        if (!result.success) {
          alert(result.error || 'No se pudo iniciar el pago')
        }
        return
      }

      // Otros métodos (bizum, transfer, cash): por ahora confirmación manual
      const { error: updateError } = await supabase
        .from('products')
        .update({
          status: 'sold',
          buyer_user_id: currentUserDbId,
          buyer_name: user.nombre,
          buyer_email: user.email,
          buyer_phone: user.telefono || '',
          sold_date: new Date().toISOString(),
          sale_price: price
        })
        .eq('id', productId)
      if (updateError) throw updateError
      alert('Compra confirmada')
      navigate('/purchases')
    } catch (e) {
      alert('Error procesando la compra')
    }
  }

  const formatEUR = (n) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Resumen de compra</h1>

        {loading ? (
          <div className="p-8 bg-white rounded-2xl border border-gray-200">Cargando...</div>
        ) : error ? (
          <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-red-700">{error}</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-gray-700">inventory_2</span>
                    <span className="font-semibold">Producto</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img src={product?.main_image} alt={product?.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product?.name}</p>
                    <p className="text-sm text-gray-600">{category?.name}</p>
                    <p className="text-lg font-bold text-gray-900">{formatEUR(price)}</p>
                    {seller && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                        <img src={seller.profile_image || '/img/resmoke/user.png'} alt={seller.nombre} className="w-6 h-6 rounded-full object-cover" />
                        <span>{seller.nombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-icons text-gray-700">credit_card</span>
                  <span className="font-semibold">Método de pago</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Selecciona cómo quieres pagar.</p>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-green-600">credit_card</span>
                      <div>
                        <p className="font-medium text-gray-900">Tarjeta</p>
                        <p className="text-sm text-gray-600">Pago seguro con Stripe</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} />
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'bizum' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-purple-600">phone_iphone</span>
                      <div>
                        <p className="font-medium text-gray-900">Bizum</p>
                        <p className="text-sm text-gray-600">Pago móvil inmediato</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod==='bizum'} onChange={() => setPaymentMethod('bizum')} />
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'transfer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-blue-600">receipt_long</span>
                      <div>
                        <p className="font-medium text-gray-900">Transferencia</p>
                        <p className="text-sm text-gray-600">Paga mediante transferencia bancaria</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod==='transfer'} onChange={() => setPaymentMethod('transfer')} />
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer ${paymentMethod === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons text-gray-700">paid</span>
                      <div>
                        <p className="font-medium text-gray-900">Pago en mano</p>
                        <p className="text-sm text-gray-600">Coordina entrega y pago presencial</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod==='cash'} onChange={() => setPaymentMethod('cash')} />
                  </label>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={protection} onChange={() => setProtection(!protection)} />
                  <div>
                    <p className="font-medium text-gray-900">Garantía Resmoke</p>
                    <p className="text-sm text-gray-600">Protege tu compra con cobertura de incidencias</p>
                  </div>
                  <span className="ml-auto font-semibold">{formatEUR(protectionCost)}</span>
                </label>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="font-semibold text-gray-900 mb-4">Ticket de compra</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-gray-600">Producto</span><span className="font-medium">{formatEUR(price)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-600">Garantía Resmoke</span><span className="font-medium">{formatEUR(extra)}</span></div>
                  <div className="border-t pt-3 flex items-center justify-between"><span className="font-semibold">Total a pagar</span><span className="text-lg font-bold">{formatEUR(total)}</span></div>
                </div>
                <p className="mt-3 text-xs text-gray-500">Método de pago: {paymentMethod === 'card' ? 'Tarjeta' : paymentMethod === 'bizum' ? 'Bizum' : paymentMethod === 'transfer' ? 'Transferencia' : 'Pago en mano'}</p>
                <button onClick={handleContinue} disabled={loading} className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60">Continuar</button>
                <p className="mt-3 text-xs text-gray-500">Al pulsar "Continuar" aceptas las condiciones de uso de Resmoke.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CheckoutPage
