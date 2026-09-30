import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import NotificationBell from '../NotificationBell/NotificationBell'
import useAnalytics from '../../hooks/useAnalytics'
import { useSubscription } from '../../hooks/useSubscription'
import PremiumBadge from '../UI/PremiumBadge';
import CookieConsent from '../Cookies/CookieConsent';
import EmailVerificationModal from '../Modals/EmailVerificationModal';
import { getCategoryPath } from '../../utils/sitemap';

const Header = () => {
  const { user, signOut } = useAuth()
  const { isPremium } = useSubscription()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUserDbId, setCurrentUserDbId] = useState(null)
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { trackSearch } = useAnalytics()

  const isAdmin = user && user.rol === 'admin'
  const isEmailVerified = !!user?.isVerified
  const categoryBarItems = [
    { id: 1, name: 'Cachimbas' },
    { id: 2, name: 'Cazoletas' },
    { id: 3, name: 'Mangueras' },
    { id: 4, name: 'Bases' },
    { id: 5, name: 'Accesorios' },
    { id: 6, name: 'Vapers' }
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchCurrentUserDbId()
    } else {
      setUnreadCount(0)
      setCurrentUserDbId(null)
    }
  }, [user])

  useEffect(() => {
    if (currentUserDbId) {
      fetchUnreadCount()
      const subscription = supabase
        .channel('messages-header-products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          fetchUnreadCount()
        })
        .subscribe()
      return () => { subscription.unsubscribe() }
    }
  }, [currentUserDbId])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('profile_image, nombre')
        .eq('email', user.email)
        .single()
      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchCurrentUserDbId = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single()
      if (error) throw error
      setCurrentUserDbId(data.id)
    } catch (error) {
      console.error('Error fetching user DB ID:', error)
    }
  }

  const fetchUnreadCount = async () => {
    if (!currentUserDbId) return
    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`buyer_id.eq.${currentUserDbId},seller_id.eq.${currentUserDbId}`)
      if (convError) throw convError
      if (!conversations || conversations.length === 0) { setUnreadCount(0); return }
      const conversationIds = conversations.map(conv => conv.id)
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .neq('sender_id', currentUserDbId)
        .eq('is_read', false)
        .in('conversation_id', conversationIds)
      if (error) throw error
      setUnreadCount(count || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      setUnreadCount(0)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsDropdownOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim())
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/productos')
    }
  }

  const getProfileImage = () => {
    if (userProfile?.profile_image) return `${userProfile.profile_image}?t=${Date.now()}`
    return user?.user_metadata?.avatar_url || `/img/resmoke/fotoNoPerfil.jpeg`
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50' : 'bg-white/80 backdrop-blur-md border-b border-gray-200/30'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-20 gap-4">
            <Link to="/welcome" className="flex-shrink-0" aria-label="Inicio">
              <img 
                src="/img/resmoke/logo.png" 
                alt="Resmoke" 
                className="h-10 lg:h-12 w-auto transition-all duration-200" 
                width="48" height="48"
                loading="eager" decoding="async" fetchPriority="high"
              />
            </Link>

            <div className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <input 
                  type="text" name="buscador" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Busca lo que necesites..." 
                  aria-label="Buscar productos"
                  className="w-full h-10 px-4 pl-10 border border-gray-300 rounded-full text-sm text-gray-900 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition-all duration-200" 
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button type="submit" onClick={handleSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-2 ml-auto">
              {user ? (
                <>
                  <div className="hidden lg:block">
                    <NotificationBell />
                  </div>

                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={() => setShowEmailVerificationModal(true)}
                      className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all text-xs font-medium"
                    >
                      <span className="material-icons text-sm">mark_email_unread</span>
                      Verificar email
                    </button>
                  )}

                  <Link to="/add-product" className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden lg:inline">Publicar</span>
                    <span className="lg:hidden">+</span>
                  </Link>

                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none" 
                      type="button"
                    >
                      <div className="relative">
                        <img 
                          src={getProfileImage()}
                          alt="Perfil" 
                          className={`h-8 w-8 lg:h-9 lg:w-9 rounded-full border-2 object-cover ${
                            isPremium ? 'border-gray-900' : 'border-gray-200'
                          }`}
                          width="36" height="36" decoding="async"
                          onError={(e) => { e.target.src = '/img/resmoke/fotoNoPerfil.jpeg' }}
                        />
                        {isPremium && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
                            <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 py-2 z-50 animate-slide-down overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-100 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre || user?.email}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                          <Link to="/my-chats" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors relative" onClick={() => setIsDropdownOpen(false)}>
                            <span className="mr-3 text-lg">💬</span> Mis Chats
                            {unreadCount > 0 && (
                              <div className="ml-auto w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </div>
                            )}
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                              <span className="mr-3 text-lg">⚙️</span> Panel Admin
                            </Link>
                          )}
                          <div className="my-1 border-t border-gray-100" />
                          <Link to="/favorites" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                            <span className="mr-3 text-lg">❤️</span> Favoritos
                          </Link>
                          <Link to="/my-products" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                            <span className="mr-3 text-lg">📦</span> Mis Productos
                          </Link>
                          <Link to="/purchases" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                            <span className="mr-3 text-lg">🛒</span> Compras
                          </Link>
                          <div className="my-1 border-t border-gray-100" />
                          <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                            <span className="mr-3 text-lg">👤</span> Perfil
                          </Link>
                          <div className="my-1 border-t border-gray-100" />
                          <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <span className="mr-3 text-lg">🚪</span> Cerrar Sesión
                          </button>
                        </div>
                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)} />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 text-sm font-medium rounded-lg transition-all duration-200">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-200">
                      Registrarse
                    </button>
                  </Link>
                </div>
              )}
            </nav>

            <div className="md:hidden flex items-center space-x-2 ml-auto">
              {user && (
                <Link to="/add-product" className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <div className="relative">
              <input 
                type="text" name="buscador" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Busca lo que necesites..." 
                aria-label="Buscar productos"
                className="w-full h-9 px-3 pl-9 border border-gray-300 rounded-full text-sm text-gray-900 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition-all" 
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {user ? (
                <>
                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={() => { setIsMobileMenuOpen(false); setShowEmailVerificationModal(true) }}
                      className="w-full flex items-center px-3 py-2.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl transition-colors text-sm"
                    >
                      <span className="mr-3 text-lg">📩</span>
                      Verificar email pendiente
                    </button>
                  )}
                  <Link to="/my-chats" className="relative flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="mr-3 text-lg">💬</span> Mis Chats
                    {unreadCount > 0 && (
                      <div className="ml-auto w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </Link>
                  <Link to="/favorites" className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="mr-3 text-lg">❤️</span> Favoritos
                  </Link>
                  <Link to="/my-products" className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="mr-3 text-lg">📦</span> Mis Productos
                  </Link>
                  <Link to="/purchases" className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="mr-3 text-lg">🛒</span> Compras
                  </Link>
                  <Link to="/profile" className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="mr-3 text-lg">👤</span> Perfil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="mr-3 text-lg">⚙️</span> Panel Admin
                    </Link>
                  )}
                  <div className="my-2 border-t border-gray-100" />
                  <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false) }} className="flex items-center w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm">
                    <span className="mr-3 text-lg">🚪</span> Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-xl py-2.5 px-4 transition-all text-sm">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-gray-900 text-white rounded-xl py-2.5 px-4 transition-all text-sm font-medium hover:bg-gray-800">
                      Registrarse
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center sm:justify-start py-2.5 gap-1 overflow-x-auto scrollbar-none">
              {categoryBarItems.map((category) => (
                <Link
                  key={category.id}
                  to={getCategoryPath(category)}
                  className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all whitespace-nowrap font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="h-28 lg:h-32"></div>

      {showEmailVerificationModal && (
        <EmailVerificationModal onClose={() => setShowEmailVerificationModal(false)} />
      )}
      <CookieConsent />
    </>
  )
}

export default Header
