import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import SEO from '../components/SEO'
import Button from '../components/common/Button'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <SEO
        title="Acceder al Panel de Control"
        description="Accede al panel de control de NexWeb para gestionar tus proyectos y clientes."
        url="/login"
        type="website"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-dark noise-bg relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-[#f5b342]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[#f08a3a]/5 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center text-[#0a0a0a] font-bold shadow-lg shadow-[#f5b342]/30 group-hover:shadow-[#f5b342]/40 transition-all">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nex<span className="text-gradient">Web</span></span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Acceder al panel</h2>
          <p className="text-[#5a5652] mt-2">Gestiona tus proyectos desde un solo lugar.</p>
        </div>

        <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-8 shadow-card">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#8a8682] mb-1.5">Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] text-white text-sm placeholder:text-[#5a5652] focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8a8682] mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required className="w-full px-4 py-3 pr-12 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] text-white text-sm placeholder:text-[#5a5652] focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5652] hover:text-[#8a8682] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#5a5652] cursor-pointer">
                <input type="checkbox" className="rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#f5b342] focus:ring-[#f5b342]/30 focus:ring-offset-0" />
                Recordarme
              </label>
              <a href="#" className="text-[#f5b342] hover:text-[#f7c65a] transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            <Button type="submit" className="w-full" size="lg" icon={LogIn}>Acceder</Button>
          </form>
          <p className="text-center text-xs text-[#5a5652] mt-6">
            ¿No tienes cuenta? <a href="#" className="text-[#f5b342] hover:text-[#f7c65a] transition-colors font-medium">Solicita acceso</a>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
