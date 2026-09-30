import { useState } from 'react'
import { Search, Download, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

const statusConfig = {
  paid: { label: 'Pagada', class: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pendiente', class: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'Vencida', class: 'bg-red-100 text-red-700' },
}

export default function Billing() {
  const { data } = useDashboard()
  const [search, setSearch] = useState('')

  const totalPaid = data.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = data.invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)

  const filtered = data.invoices.filter(i =>
    i.client.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona las facturas y cobros</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString()}€</p>
              <p className="text-xs text-gray-500">Cobrado</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPending.toLocaleString()}€</p>
              <p className="text-xs text-gray-500">Pendiente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.invoices.length}</p>
              <p className="text-xs text-gray-500">Facturas totales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar facturas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                <th className="p-4 font-medium">Factura</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Plan</th>
                <th className="p-4 font-medium">Importe</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inv, i) => (
                <ScrollReveal key={inv.id} delay={i * 0.03} as="tr" className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-mono text-sm text-gray-900">{inv.id}</td>
                  <td className="p-4 font-medium text-gray-700">{inv.client}</td>
                  <td className="p-4 text-gray-500">{inv.plan}</td>
                  <td className="p-4 font-medium text-gray-900">{inv.amount.toLocaleString()}€</td>
                  <td className="p-4 text-gray-500">{inv.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[inv.status].class}`}>{statusConfig[inv.status].label}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download className="w-3.5 h-3.5" /></button>
                  </td>
                </ScrollReveal>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
