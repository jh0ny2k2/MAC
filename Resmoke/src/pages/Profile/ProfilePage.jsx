import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import EmailVerificationModal from '../../components/Modals/EmailVerificationModal';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    full_name_visibility: 'initial',
    location_visibility: 'full',
    registration_date_visibility: 'exact',
    last_connection_visibility: 'approximate',
    email_visibility: 'buyers',
    phone_visibility: 'verified',
    social_media_visibility: 'public',
    products_sold_visibility: 'exact',
    purchase_history_visibility: 'summary',
    ratings_visibility: 'all',
    response_time_visibility: 'exact',
    appear_in_searches: true,
    appear_in_suggestions: true
  });
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const [privacySuccess, setPrivacySuccess] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (userProfile) {
      fetchOpinions();
      fetchUserStats();
      fetchPrivacySettings();
    }
  }, [userProfile]);

  const fetchPrivacySettings = async () => {
    try {
      if (!userProfile) return;
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userProfile.id)
        .limit(1)
        .maybeSingle();
      if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') throw error;
      if (data) setPrivacySettings(data);
    } catch (error) {
      setPrivacySettings(prev => ({ ...prev }));
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email)
        .single();
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpinions = async () => {
    try {
      if (!userProfile) return;
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, image_url, created_at,
          buyer:buyer_id (id, nombre),
          product:product_id (id, name)
        `)
        .eq('seller_id', userProfile.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const shuffled = data ? [...data].sort(() => 0.5 - Math.random()) : [];
      setOpinions(shuffled.slice(0, 3));
    } catch (error) {
      console.error('Error fetching opinions:', error);
      setOpinions([]);
    }
  };

  const fetchUserStats = async () => {
    try {
      if (!userProfile) return;
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews').select('rating').eq('seller_id', userProfile.id);
      if (reviewsError) throw reviewsError;
      if (reviewsData && reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(Math.round((totalRating / reviewsData.length) * 10) / 10);
      } else setAverageRating(0);
      const { data: salesData, error: salesError } = await supabase
        .from('products').select('id').eq('user_id', userProfile.id).eq('status', 'vendido');
      if (salesError) throw salesError;
      setTotalSales(salesData ? salesData.length : 0);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      setPasswordLoading(false);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      setPasswordLoading(false);
      return;
    }
    try {
      const hash = (await import('hash.js')).default;
      const currentPasswordHash = hash.sha256().update(passwordForm.currentPassword).digest('hex');
      const { data: currentUser, error: verifyError } = await supabase
        .from('Users')
        .select('password')
        .eq('id', user.originalId)
        .eq('password', currentPasswordHash)
        .single();
      if (verifyError || !currentUser) {
        setPasswordError('La contraseña actual es incorrecta');
        setPasswordLoading(false);
        return;
      }
      const newPasswordHash = hash.sha256().update(passwordForm.newPassword).digest('hex');
      const { error: updateError } = await supabase
        .from('Users')
        .update({ password: newPasswordHash })
        .eq('id', user.originalId);
      if (updateError) throw updateError;
      alert('Contraseña actualizada exitosamente');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.message || 'Error al actualizar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
    setPrivacyError('');
    setPrivacySuccess('');
  };

  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    setPrivacyLoading(true);
    setPrivacyError('');
    setPrivacySuccess('');
    try {
      const { data: existingSettings, error: checkError } = await supabase
        .from('privacy_settings').select('id').eq('user_id', userProfile.id).limit(1).maybeSingle();
      if (checkError && checkError.code === 'PGRST205') {
        setPrivacyError('Configuraciones de privacidad no disponibles');
        return;
      }
      let result;
      if (existingSettings) {
        result = await supabase.from('privacy_settings').update({ ...privacySettings, updated_at: new Date().toISOString() }).eq('user_id', userProfile.id);
      } else {
        result = await supabase.from('privacy_settings').insert({ ...privacySettings, user_id: userProfile.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      }
      if (result.error) throw result.error;
      setPrivacySuccess('Configuraciones actualizadas');
      setTimeout(() => { setShowPrivacyModal(false); setPrivacySuccess(''); }, 2000);
    } catch (error) {
      setPrivacyError(error.message || 'Error al actualizar');
    } finally {
      setPrivacyLoading(false);
    }
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
    setPrivacyError('');
    setPrivacySuccess('');
    fetchPrivacySettings();
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
      const endpoint = isLocal ? 'http://localhost:3001/api' : '/.netlify/functions';
      const res = await fetch(`${endpoint}/auth/delete-account`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.originalId })
      });
      const data = await res.json();
      if (!data.success) { alert('No se pudo eliminar la cuenta'); return; }
      await signOut();
      navigate('/');
      alert('Cuenta eliminada exitosamente.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al eliminar la cuenta.');
    } finally { setDeleteLoading(false); setShowDeleteModal(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
          <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Error al cargar el perfil</p>
          <p className="text-sm text-gray-400 mt-1">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Banner + Profile Info ── */}
      <div className="relative">
        <div className="h-44 sm:h-52 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {userProfile.profile_image ? (
                  <img
                    src={`${userProfile.profile_image}?t=${Date.now()}`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className={`w-full h-full items-center justify-center text-3xl font-semibold text-gray-400 ${userProfile.profile_image ? 'hidden' : 'flex'}`}>
                  {userProfile.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Name + Role + Stats */}
            <div className="flex-1 min-w-0 pb-1 text-center sm:text-left">
              <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight whitespace-nowrap">{userProfile.nombre}</h1>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium
                  </span>
                )}
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">{userProfile.rol || 'Usuario'}</span>
              </div>
              <p className="text-gray-500 mt-1 text-sm">{userProfile.email}</p>
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                {[
                  { value: '12', label: 'productos' },
                  { value: averageRating > 0 ? averageRating : '—', label: 'rating' },
                  { value: totalSales, label: 'ventas' },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    <div className="flex items-center gap-1">
                      <span className="text-base font-bold text-gray-900 tabular-nums">{stat.value}</span>
                      <span className="text-xs text-gray-400">{stat.label}</span>
                    </div>
                    {i < 2 && <span className="w-0.5 h-3 rounded-full bg-gray-200" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Edit Button */}
            <Link to="/edit-profile" className="pb-1 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              Editar perfil
            </Link>
          </div>

        {/* Verification Banner */}
        {!(user?.isVerified || userProfile?.is_verified) && (
          <div className="mt-5 flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200/50 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm text-amber-700 flex-1">Verifica tu correo para acceder a todas las funciones.</p>
            <button onClick={() => setShowEmailVerificationModal(true)}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 whitespace-nowrap underline-offset-4 hover:underline transition-all"
            >
              Verificar
            </button>
          </div>
        )}
      </div>
      </div>

      {/* ── Main Content: 3-Column Layout ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left Column: Contact + Rating ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contacto</h3>
              <div className="space-y-3">
                {userProfile.telefono && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{userProfile.telefono}</p>
                      <p className="text-[11px] text-gray-400">Teléfono</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">{userProfile.email}</p>
                    <p className="text-[11px] text-gray-400">Email</p>
                  </div>
                </div>
                {userProfile.fecha_nacimiento && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{userProfile.fecha_nacimiento}</p>
                      <p className="text-[11px] text-gray-400">Cumpleaños</p>
                    </div>
                  </div>
                )}
                {userProfile.creado_en && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(userProfile.creado_en)}</p>
                      <p className="text-[11px] text-gray-400">Miembro desde</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Valoración</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{averageRating > 0 ? averageRating : '—'}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Basado en {opinions.length} reseñas</p>
            </div>

            {/* Chat / Contact Button */}
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-medium text-sm shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:from-gray-800 hover:to-gray-700 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Contactar
            </button>

          </div>

          {/* ── Middle Column: Quick Actions + Reviews ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Accesos directos</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { to: '/favorites', label: 'Favoritos', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
                  { to: '/my-products', label: 'Mis productos', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
                  { onClick: () => setShowPasswordModal(true), label: 'Contraseña', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z' },
                  { onClick: () => setShowPrivacyModal(true), label: 'Privacidad', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
                  { to: '/statistics', label: 'Estadísticas', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
                ].map((item) => {
                  const btn = (
                    <button className="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all text-left w-full group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-gray-300 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                  return item.to ? (
                    <Link key={item.label} to={item.to}>{btn}</Link>
                  ) : (
                    <div key={item.label} onClick={item.onClick} className="cursor-pointer">{btn}</div>
                  );
                })}
              </div>
              <div className="mt-2.5">
                <div onClick={() => setShowDeleteModal(true)} className="cursor-pointer">
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-red-300 transition-colors">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </div>
                    <span>Eliminar cuenta</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Reseñas</h3>
              {opinions.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aún no tienes reseñas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {opinions.map((review) => (
                    <div key={review.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                          {review.buyer?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{review.buyer?.nombre || 'Usuario'}</p>
                          <p className="text-[11px] text-gray-400 truncate">{review.product?.name || 'Producto'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                  <Link to="/my-reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors pt-1">
                    Ver todas
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column: Stats Widget ── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resumen</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '12', label: 'Productos', color: 'text-gray-900' },
                  { value: totalSales, label: 'Ventas', color: 'text-gray-900' },
                  { value: averageRating > 0 ? averageRating : '—', label: 'Rating', color: 'text-gray-900' },
                  { value: opinions.length, label: 'Reseñas', color: 'text-gray-900' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm text-center">
                    <p className={`text-xl font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Actividad</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Última venta</p>
                    <p className="text-xs text-gray-400">{totalSales > 0 ? 'Reciente' : 'Sin ventas aún'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Última reseña</p>
                    <p className="text-xs text-gray-400">{opinions.length > 0 ? 'Reciente' : 'Sin reseñas aún'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Miembro desde</p>
                    <p className="text-xs text-gray-400">{userProfile.creado_en ? formatDate(userProfile.creado_en) : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Modals ── */}

      {/* Modal - Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900">Cambiar contraseña</h2>
              </div>
              <button onClick={closePasswordModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">
                      {field === 'currentPassword' ? 'Contraseña actual' : field === 'newPassword' ? 'Nueva contraseña' : 'Confirmar contraseña'}
                    </label>
                    <input type="password" name={field} value={passwordForm[field]} onChange={handlePasswordChange}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                      placeholder={field === 'currentPassword' ? 'Ingresa tu contraseña actual' : 'Mínimo 6 caracteres'}
                      required minLength={field !== 'currentPassword' ? 6 : undefined}
                    />
                  </div>
                ))}
                {passwordError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-sm text-red-600 font-medium">{passwordError}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closePasswordModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">Cancelar</button>
                  <button type="submit" disabled={passwordLoading} className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm disabled:opacity-50 shadow-sm">
                    {passwordLoading ? 'Actualizando...' : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Privacy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900">Privacidad</h2>
              </div>
              <button onClick={closePrivacyModal} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <form onSubmit={handlePrivacySubmit} className="space-y-5">
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Visibilidad del perfil</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Nombre completo', field: 'full_name_visibility', options: [['public', 'Público'], ['initial', 'Solo inicial'], ['private', 'Privado']] },
                      { label: 'Ubicación', field: 'location_visibility', options: [['full', 'Ciudad completa'], ['province', 'Solo provincia'], ['hidden', 'Oculta']] },
                      { label: 'Fecha de registro', field: 'registration_date_visibility', options: [['exact', 'Fecha exacta'], ['month', 'Solo mes y año'], ['year', 'Solo año'], ['hidden', 'Oculta']] },
                      { label: 'Última conexión', field: 'last_connection_visibility', options: [['exact', 'Hora exacta'], ['approximate', 'Aproximada'], ['hidden', 'Oculta']] },
                    ].map(({ label, field, options }) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                        <select value={privacySettings[field]} onChange={(e) => handlePrivacyChange(field, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white transition-all"
                        >
                          {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Información de contacto</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Email', field: 'email_visibility', options: [['public', 'Público'], ['buyers', 'Solo compradores'], ['verified', 'Solo verificados'], ['private', 'Privado']] },
                      { label: 'Teléfono', field: 'phone_visibility', options: [['public', 'Público'], ['buyers', 'Solo compradores'], ['verified', 'Solo verificados'], ['private', 'Privado']] },
                      { label: 'Redes sociales', field: 'social_media_visibility', options: [['public', 'Público'], ['buyers', 'Solo compradores'], ['private', 'Privado']] },
                    ].map(({ label, field, options }) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                        <select value={privacySettings[field]} onChange={(e) => handlePrivacyChange(field, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white transition-all"
                        >
                          {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Actividad y estadísticas</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Productos vendidos', field: 'products_sold_visibility', options: [['exact', 'Número exacto'], ['range', 'Rango aproximado'], ['hidden', 'Oculto']] },
                      { label: 'Historial de compras', field: 'purchase_history_visibility', options: [['public', 'Público'], ['summary', 'Solo resumen'], ['private', 'Privado']] },
                      { label: 'Valoraciones', field: 'ratings_visibility', options: [['all', 'Todas'], ['positive', 'Solo positivas'], ['summary', 'Solo promedio'], ['hidden', 'Ocultas']] },
                      { label: 'Tiempo de respuesta', field: 'response_time_visibility', options: [['exact', 'Tiempo exacto'], ['range', 'Rango aproximado'], ['hidden', 'Oculto']] },
                    ].map(({ label, field, options }) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                        <select value={privacySettings[field]} onChange={(e) => handlePrivacyChange(field, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white transition-all"
                        >
                          {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Búsqueda y descubrimiento</h3>
                  <div className="space-y-3">
                    {[
                      { field: 'appear_in_searches', label: 'Aparecer en búsquedas' },
                      { field: 'appear_in_suggestions', label: 'Aparecer en sugerencias' },
                    ].map(({ field, label }) => (
                      <div key={field} className="flex items-center justify-between py-1">
                        <p className="text-sm text-gray-700">{label}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={privacySettings[field]} onChange={(e) => handlePrivacyChange(field, e.target.checked)} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-900/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {privacyError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-sm text-red-600 font-medium">{privacyError}</p>
                  </div>
                )}
                {privacySuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-sm text-emerald-600 font-medium">{privacySuccess}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closePrivacyModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">Cancelar</button>
                  <button type="submit" disabled={privacyLoading} className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm disabled:opacity-50 shadow-sm">
                    {privacyLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-slide-up">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900">Eliminar cuenta</h2>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">Esta acción <strong className="text-gray-900">no se puede deshacer</strong>. Se eliminará permanentemente toda tu información.</p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                <ul className="text-sm text-red-600 space-y-2">
                  {['Perfil e información personal', 'Productos publicados', 'Historial de compras y ventas', 'Reseñas y calificaciones'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">Cancelar</button>
                <button onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm disabled:opacity-50 shadow-md shadow-red-200">
                  {deleteLoading ? 'Eliminando...' : 'Eliminar cuenta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {showEmailVerificationModal && <EmailVerificationModal onClose={() => setShowEmailVerificationModal(false)} />}
    </div>
  );
};

export default ProfilePage;
