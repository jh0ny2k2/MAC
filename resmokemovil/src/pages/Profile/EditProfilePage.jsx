import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const completeness = Math.round(([userProfile?.nombre, userProfile?.telefono, userProfile?.fecha_nacimiento, userProfile?.profile_image].filter(Boolean).length / 4) * 100) || 0;

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    fotoPerfil: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      setUserProfile(data);
      setFormData({
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
        fechaNacimiento: data.fecha_nacimiento || '',
        fotoPerfil: null
      });

      if (data.profile_image) {
        const imageUrl = data.profile_image.includes('?')
          ? data.profile_image
          : `${data.profile_image}?t=${Date.now()}`;
        setPreviewImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        fotoPerfil: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        throw new Error('No se pudo encontrar el usuario');
      }

      let profileImageUrl = null;

      if (formData.fotoPerfil) {
        try {
          const fileExt = formData.fotoPerfil.name.split('.').pop();
          const fileName = `profile_${userData.id}_${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, formData.fotoPerfil, {
              upsert: true
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error(`Error al subir imagen: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          profileImageUrl = publicUrl;

        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          throw new Error(`Error al procesar la imagen: ${imageError.message}`);
        }
      }

      const updateData = {};

      if (formData.nombre && formData.nombre.trim()) {
        updateData.nombre = formData.nombre.trim();
      }

      if (formData.telefono && formData.telefono.trim()) {
        updateData.telefono = formData.telefono.trim();
      }

      if (formData.fechaNacimiento) {
        updateData.fecha_nacimiento = formData.fechaNacimiento;
      }

      if (profileImageUrl) {
        updateData.profile_image = profileImageUrl;
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('Users')
          .update(updateData)
          .eq('id', userData.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error(`Error al actualizar perfil: ${updateError.message}`);
        }
      }

      setSuccess(true);
      setError(null);

      await fetchUserProfile();

      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
            <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-center">
            <p className="text-xl font-semibold mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Editar perfil</h1>
            <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-gray-500">{completeness}% completo</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── LEFT: Avatar + Personal Info ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Avatar Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
                <div className="relative inline-block">
                  <label className="block w-32 h-32 rounded-full cursor-pointer border-2 border-dashed border-gray-200 hover:border-gray-400 transition-all bg-gray-50 bg-cover bg-center bg-no-repeat overflow-hidden"
                    style={{ backgroundImage: previewImage ? `url(${previewImage})` : 'none' }}
                  >
                    <input type="file" name="fotoPerfil" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all duration-200">
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                        </svg>
                      </div>
                    </div>
                    {!previewImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    )}
                  </label>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium">Haz clic en la foto para cambiarla</p>

                {/* Rol badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rol</span>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Usuario
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Perfil completado</span>
                  <span className="text-sm font-bold text-gray-800">{completeness}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-400 to-gray-900 rounded-full transition-all duration-500" style={{ width: `${completeness}%` }} />
                </div>
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: 'Nombre', done: !!userProfile?.nombre },
                    { label: 'Teléfono', done: !!userProfile?.telefono },
                    { label: 'Fecha de nacimiento', done: !!userProfile?.fecha_nacimiento },
                    { label: 'Foto de perfil', done: !!userProfile?.profile_image },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                        {item.done && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      </div>
                      <span className={item.done ? 'text-gray-500' : 'text-gray-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT: Form Fields ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Personal Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-0.5 h-5 bg-gradient-to-b from-gray-900 to-gray-400 rounded-full" />
                  <h2 className="text-sm font-semibold text-gray-900 tracking-wide">Información Personal</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="nombre" className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Nombre completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Teléfono</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                        placeholder="+34 600 00 00 00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fechaNacimiento" className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Fecha de nacimiento</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-0.5 h-5 bg-gradient-to-b from-gray-900 to-gray-400 rounded-full" />
                  <h2 className="text-sm font-semibold text-gray-900 tracking-wide">Información de Contacto</h2>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Correo electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    El email no se puede modificar
                  </p>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-100 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-emerald-700 flex-1">Perfil actualizado correctamente. Redirigiendo...</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfilePage;
