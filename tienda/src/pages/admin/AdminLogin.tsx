import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import { FormInput } from '../../components/common/FormControls'

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = (location.state as { from?: string })?.from ?? '/admin'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      showToast('Bienvenido al panel de administración')
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al iniciar sesión',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-carbon-950 px-4 py-10">
      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-carbon-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Volver a la tienda
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-f1-500 font-display text-xl font-bold text-white shadow-lg shadow-f1-500/30">
            F1
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold uppercase tracking-wide text-white">
            Apex Admin
          </h1>
          <p className="mt-1.5 text-sm text-carbon-400">
            Accede para gestionar tu tienda F1 a escala
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-carbon-800 bg-carbon-900/40 p-6 shadow-2xl shadow-black/30"
        >
          <FormInput
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@f1store.com"
            autoComplete="username"
            required
          />
          <div className="relative">
            <FormInput
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-9 text-carbon-500 transition-colors hover:text-white"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button type="submit" block size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Accediendo...
              </>
            ) : (
              <>
                <Lock size={16} />
                Iniciar sesión
              </>
            )}
          </Button>

          {error && (
            <p className="rounded-lg border border-f1-500/30 bg-f1-500/10 px-3 py-2 text-center text-xs text-f1-400">
              {error}
            </p>
          )}
        </form>

        <div className="mt-4 rounded-xl border border-carbon-800 bg-carbon-900/30 px-4 py-3 text-center text-xs text-carbon-500">
          Demo: <span className="font-semibold text-carbon-300">admin@f1store.com</span> ·{' '}
          <span className="font-semibold text-carbon-300">admin123</span>
        </div>
      </div>
    </div>
  )
}