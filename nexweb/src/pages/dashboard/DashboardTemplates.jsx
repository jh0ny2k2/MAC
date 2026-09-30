import { useState } from 'react'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

export default function DashboardTemplates() {
  const { data, addWebsite, updateWebsite, deleteWebsite } = useDashboard()
  const [search, setSearch] = useState('')

  const filtered = data.templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plantillas</h1>
        <p className="text-gray-500 text-sm mt-1">{data.templates.length} plantillas de inicio</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar plantillas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 0.03}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="w-full h-28 bg-gradient-to-br from-blue-100 to-violet-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600/30">{t.name[0]}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{t.category}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {t.status === 'active' ? 'Activa' : 'Borrador'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t.used} usos</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
