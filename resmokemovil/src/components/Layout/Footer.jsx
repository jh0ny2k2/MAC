import { Link } from 'react-router-dom'
import { getCategoryPath } from '../../utils/sitemap'

const Footer = () => {
  return (
    <footer className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-5" aria-label="Inicio">
              <img 
                src="/img/resmoke/logo.png" 
                alt="Resmoke" 
                className="h-10 w-auto"
                width="40" height="40"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Marketplace de confianza para comprar y vender cachimbas, vapers y accesorios. Conectamos a compradores y vendedores de toda España.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              <a href="https://twitter.com/resmoke" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all" aria-label="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
              <a href="https://www.instagram.com/resmoke" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all" aria-label="Instagram">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="1.5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="1.5" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/resmoke" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all" aria-label="LinkedIn">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-semibold text-sm tracking-wider uppercase mb-5">Empresa</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Sobre nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Contacto</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Blog</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Términos y condiciones</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-semibold text-sm tracking-wider uppercase mb-5">Soporte</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Devoluciones</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Envíos</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Privacidad</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-gray-900 font-semibold text-sm tracking-wider uppercase mb-5">Categorías</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { id: 1, nombre: 'Cachimbas' },
                { id: 2, nombre: 'Cazoletas' },
                { id: 3, nombre: 'Mangueras' },
                { id: 4, nombre: 'Bases' },
                { id: 5, nombre: 'Accesorios' },
                { id: 6, nombre: 'Vapers' }
              ].map((cat) => (
                <Link key={cat.id} to={getCategoryPath(cat)} className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-gray-200 gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Resmoke. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-5">
            <Link to="/legal" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Aviso legal</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacidad</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Cookies</Link>
            <Link to="/terms" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
