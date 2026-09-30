import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const EmailVerificationModal = ({ onClose }) => {
  const { user, markUserVerified } = useAuth()
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [token, setToken] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const startEndpoint = isLocal ? '/api/verify-email-start' : '/.netlify/functions/start-verify-email'
  const completeEndpoint = isLocal ? '/api/verify-email-complete' : '/.netlify/functions/verify-email-complete'

  const readJson = async (res) => {
    const text = await res.text().catch(() => '')
    if (!text) return {}
    try {
      return JSON.parse(text)
    } catch {
      return {}
    }
  }

  const toUiError = ({ phase, status, rawError }) => {
    const raw = String(rawError || '').trim()
    const e = raw.toLowerCase()

    const withHint = (message) => {
      if (!message) return 'Ha ocurrido un error. Inténtalo de nuevo.'
      return message
    }

    if (phase === 'start') {
      if (status === 400 && (e.includes('email requerido') || e.includes('email'))) {
        return 'Tu cuenta no tiene email válido. Revisa tu perfil o inicia sesión de nuevo.'
      }
      if (status === 404 || e.includes('usuario no encontrado')) {
        return 'No encontramos tu usuario. Cierra sesión e inicia sesión otra vez.'
      }
      if (status === 500 && (e.includes('resend_api_key') || e.includes('supabase') || e.includes('no configurada'))) {
        return 'El servicio de verificación no está disponible ahora mismo. Inténtalo más tarde.'
      }
      if (e.includes('rate') || e.includes('limit') || status === 429) {
        return 'Has hecho demasiadas solicitudes. Espera un momento y vuelve a intentarlo.'
      }
      return withHint(raw)
    }

    if (phase === 'complete') {
      if (e.includes('código expirado') || e.includes('codigo expirado')) {
        return 'Código caducado. Pulsa “Reenviar código” para recibir uno nuevo.'
      }
      if (e.includes('código incorrecto') || e.includes('codigo incorrecto')) {
        return 'Código incorrecto. Revisa el correo y vuelve a intentarlo.'
      }
      if (e.includes('no hay verificación pendiente') || e.includes('no hay verificacion pendiente')) {
        return 'No hay una verificación en curso. Pulsa “Iniciar verificación” para recibir un código.'
      }
      if (e.includes('token expirado') || e.includes('token inválido') || e.includes('token invalido') || e.includes('firma inválida') || e.includes('firma invalida')) {
        return 'La verificación ha caducado. Vuelve a iniciar el proceso para recibir un nuevo código.'
      }
      if (status === 404 || e.includes('usuario no encontrado')) {
        return 'No encontramos tu usuario. Cierra sesión e inicia sesión otra vez.'
      }
      if (status === 500) {
        return 'No se pudo completar la verificación por un problema del servidor. Inténtalo más tarde.'
      }
      return withHint(raw)
    }

    return withHint(raw)
  }

  const startVerification = async () => {
    if (!user?.email) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      const payload = { email: user.email, nombre: user.nombre || '' }
      const doFetch = async (url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      const res = await doFetch(startEndpoint)
      const data = await readJson(res)
      if (!data.success) {
        setError(toUiError({ phase: 'start', status: res.status, rawError: data.error || '' }))
        setSending(false)
        return
      }
      setToken(data.token || '')
      setStep(2)
      setSuccess('Se te ha enviado un correo con un código')
    } catch (e) {
      setError('No se pudo conectar con el servicio de verificación. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const completeVerification = async () => {
    if (!token || !code) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      const payload = { token, code }
      const doFetch = async (url) =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      const res = await doFetch(completeEndpoint)
      const data = await readJson(res)
      if (!data.success) {
        const msg = toUiError({ phase: 'complete', status: res.status, rawError: data.error || '' })
        setError(msg)
        const lower = String(data.error || '').toLowerCase()
        if (lower.includes('token') || lower.includes('firma')) {
          setStep(1)
          setToken('')
          setCode('')
        }
        setSending(false)
        return
      }
      setSuccess('Tu cuenta ha sido verificada')
      markUserVerified && markUserVerified()
      setTimeout(() => {
        onClose && onClose()
      }, 800)
    } catch (e) {
      setError('No se pudo conectar para completar la verificación. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Verifica tu cuenta</h3>
        </div>
        {step === 1 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">Para acceder a todas las funciones, verifica tu correo electrónico.</p>
            <button
              onClick={startVerification}
              disabled={sending}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
            >
              {sending ? 'Enviando...' : 'Iniciar verificación'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">Se te ha enviado un correo con un código de verificación.</p>
            <div className="flex items-center gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de 6 caracteres"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                onClick={completeVerification}
                disabled={sending || !code}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
              >
                Confirmar
              </button>
            </div>
            <button
              onClick={startVerification}
              disabled={sending}
              className="mt-3 text-sm text-gray-600 underline"
            >
              Reenviar código
            </button>
          </div>
        )}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        {success && <div className="mt-2 text-sm text-green-600">{success}</div>}
      </div>
    </div>
  )
}

export default EmailVerificationModal
