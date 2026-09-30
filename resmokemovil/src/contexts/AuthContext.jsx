import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import * as Sentry from '@sentry/react'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error al leer usuario del localStorage:', error)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkStoredUser()
  }, [])

  useEffect(() => {
    if (!import.meta.env.VITE_SENTRY_DSN) return
    if (!user) {
      Sentry.setUser(null)
      return
    }
    const id = user.originalId ?? user.id ?? undefined
    const email = user.email ?? undefined
    Sentry.setUser({ id: id ? String(id) : undefined, email })
    Sentry.setTag('isVerified', String(!!user.isVerified))
    if (user.rol) Sentry.setTag('role', String(user.rol))
  }, [user])

  // Función de registro (mantener para compatibilidad)
  const signUp = async (email, password, userData = {}) => {
    try {
      // Esta función ya no se usa, pero la mantenemos por compatibilidad
      return { data: null, error: 'Usar RegisterPage para registro' }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const getAuthEndpoint = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocal ? 'http://localhost:3001/api/auth' : '/.netlify/functions/auth';
  };

  // Función de inicio de sesión personalizada
  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${getAuthEndpoint()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!data.success) {
        return { data: null, error: data.error || 'Credenciales incorrectas' }
      }
      
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const userData = {
        id: generateUUID(),
        originalId: data.user.id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol,
        isVerified: !!data.user.is_verified
      }

      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { data: userData, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  // Función para guardar usuario de Google en la base de datos
  const saveGoogleUserToDatabase = async (googleUser) => {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', googleUser.email.toLowerCase().trim())
        .single();

      if (existingUser) {
        // Usuario ya existe, solo actualizar información si es necesario
        const { error: updateError } = await supabase
          .from('Users')
          .update({
            nombre: googleUser.name,
            profile_image: googleUser.picture,
            google_id: googleUser.sub,
            ultimo_acceso: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.warn('Error actualizando usuario existente:', updateError);
        }

        return { data: existingUser, error: null };
      } else {
        // Crear nuevo usuario
        const userData = {
          nombre: googleUser.name,
          email: googleUser.email.toLowerCase().trim(),
          profile_image: googleUser.picture,
          google_id: googleUser.sub,
          rol: 'usuario',
          creado_en: new Date().toISOString(),
          ultimo_acceso: new Date().toISOString(),
          // No establecer password para usuarios de Google
          password: null,
          telefono: null, // Se puede completar después
          fecha_nacimiento: null // Se puede completar después
        };

        const { data: newUser, error: insertError } = await supabase
          .from('Users')
          .insert(userData)
          .select()
          .single();

        if (insertError) throw insertError;

        return { data: newUser, error: null };
      }
    } catch (error) {
      console.error('Error guardando usuario de Google:', error);
      return { data: null, error: error.message };
    }
  };

  // Función de login/registro con Google
  const signInWithGoogle = async (credentialResponse) => {
    try {
      // Decodificar el JWT token de Google
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const googleUser = JSON.parse(jsonPayload);

      // Guardar usuario en la base de datos
      const { data: dbUser, error } = await saveGoogleUserToDatabase(googleUser);

      if (error) {
        return { data: null, error };
      }

      // Función para generar UUID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Crear objeto de usuario para el estado local
      const userData = {
        id: generateUUID(),
        originalId: dbUser.id,
        nombre: dbUser.nombre,
        email: dbUser.email,
        rol: dbUser.rol,
        profile_image: dbUser.profile_image,
        google_id: dbUser.google_id,
        isGoogleUser: true,
        isVerified: !!dbUser.is_verified
      };

      // Guardar en localStorage y estado
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { data: userData, error: null };

    } catch (error) {
      console.error('Error en login con Google:', error);
      return { data: null, error: 'Error al procesar login con Google' };
    }
  };

  // Función de cierre de sesión
  const signOut = async () => {
    try {
      // Limpiar localStorage y estado
      localStorage.removeItem('user')
      localStorage.removeItem('rememberUser')
      setUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message)
    }
  }

  const markUserVerified = () => {
    try {
      if (!user) return
      const updated = { ...user, isVerified: true }
      localStorage.setItem('user', JSON.stringify(updated))
      setUser(updated)
    } catch {}
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    markUserVerified
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
