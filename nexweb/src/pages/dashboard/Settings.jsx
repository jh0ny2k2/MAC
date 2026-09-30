import { useState } from 'react'
import { Save } from 'lucide-react'
import Button from '../../components/common/Button'
import { useDashboard } from '../../context/DashboardContext'

export default function Settings() {
  const { data, updateSettings } = useDashboard()
  const [form, setForm] = useState({ ...data.settings })

  const handleSave = (e) => {
    e.preventDefault()
    updateSettings(form)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administra la configuración de la plataforma</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la empresa</label>
            <input type="text" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
            <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
            <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Zona horaria</label>
            <select value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white">
              <option value="Europe/Madrid">Europe/Madrid</option>
              <option value="America/Mexico_City">America/Mexico_City</option>
              <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Idioma</label>
            <select value={form.language} onChange={e => setForm({...form, language: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button type="submit" icon={Save}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
