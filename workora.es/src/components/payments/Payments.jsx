import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import PaymentDetailModal from './PaymentDetailModal'

export default function Payments() {
  const { user, profile } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPayments()
  }, [user])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    try {
      setSaving(true)
      setError('')

      if (editing) {
        const { error } = await supabase
          .from('payments')
          .update({
            amount: Number(amount),
            description: description || null,
            payment_date: paymentDate,
          })
          .eq('id', editing.id)

        if (error) throw error
        setSelected(null)
      } else {
        const { error } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            company_id: profile?.company_id || null,
            amount: Number(amount),
            description: description || null,
            payment_date: paymentDate,
          })

        if (error) throw error
      }

      setAmount('')
      setDescription('')
      setPaymentDate(new Date().toISOString().split('T')[0])
      setShowForm(false)
      setEditing(null)
      await loadPayments()
    } catch (err) {
      console.error('Error:', err)
      setError(err?.message || 'No se pudo guardar el cobro')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (payment) => {
    setEditing(payment)
    setAmount(String(payment.amount))
    setDescription(payment.description || '')
    setPaymentDate(payment.payment_date)
    setSelected(null)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return

    try {
      setDeleting(true)
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', confirmDelete.id)

      if (error) throw error

      setConfirmDelete(null)
      setSelected(null)
      await loadPayments()
    } catch (err) {
      console.error('Error:', err)
      setError(err?.message || 'No se pudo eliminar el cobro')
    } finally {
      setDeleting(false)
    }
  }

  const now = new Date()
  const filteredPayments = payments.filter(p => {
    if (filter === 'month') {
      const pDate = new Date(p.payment_date)
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear()
    }
    if (filter === 'year') {
      const pDate = new Date(p.payment_date)
      return pDate.getFullYear() === now.getFullYear()
    }
    return true
  })

  const totalAmount = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  const monthTotal = payments
    .filter(p => {
      const d = new Date(p.payment_date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const yearTotal = payments
    .filter(p => new Date(p.payment_date).getFullYear() === now.getFullYear())
    .reduce((sum, p) => sum + Number(p.amount), 0)

  if (loading) return <LoadingSpinner text="Cargando cobros..." />

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Cobros</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Gestiona tus pagos recibidos</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditing(null)
            setAmount('')
            setDescription('')
            setPaymentDate(new Date().toISOString().split('T')[0])
          }}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors ${
            showForm
              ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              : 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? 'Cancelar' : 'Añadir'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'month', label: 'Este mes' },
          { key: 'year', label: 'Este año' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`chip ${filter === f.key ? 'chip-active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/60 dark:border-rose-500/20 animate-fade-in">
          <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-rose-400 hover:text-rose-600 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl shadow-emerald-600/25 animate-fade-in">
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Cobrado</p>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white whitespace-nowrap">
              {filteredPayments.length} {filteredPayments.length === 1 ? 'cobro' : 'cobros'}
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white mt-2 tabular-nums">
            €{totalAmount.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/60 mt-1">
            {filter === 'month' ? 'Cobrado este mes' : filter === 'year' ? 'Cobrado este año' : 'Total cobrado'}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Este mes</p>
              <p className="text-white font-bold tabular-nums">€{monthTotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Este año</p>
              <p className="text-white font-bold tabular-nums">€{yearTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add payment form */}
      {showForm && (
        <div className="card animate-slide-up border-emerald-200/40 dark:border-emerald-500/20">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="label">Importe (€)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                placeholder="0.00"
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[50, 100, 200, 500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`chip !px-3 !py-1.5 text-xs ${Number(amount) === val ? 'chip-active' : ''}`}
                  >
                    {val} €
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Concepto</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="Ej: Pago quincenal, extras..."
              />
            </div>
            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={saving || !amount} className="btn-primary w-full">
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Registrar cobro'}
            </button>
          </form>
        </div>
      )}

      {/* Payments list */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="No hay cobros registrados"
          description="Registra tu primer cobro para llevar un seguimiento."
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredPayments.map((payment) => (
              <button
                key={payment.id}
                onClick={() => setSelected(payment)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {payment.description || 'Cobro registrado'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatPaymentDate(payment.payment_date)}
                  </p>
                </div>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums flex-shrink-0">
                  +€{Number(payment.amount).toFixed(2)}
                </p>
                <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <PaymentDetailModal
        payment={selected}
        onClose={() => setSelected(null)}
        onEdit={handleEdit}
        onDelete={(p) => { setSelected(null); setConfirmDelete(p) }}
      />

      {confirmDelete && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-premium-lg animate-scale-in border border-slate-200/60 dark:border-slate-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Eliminar cobro</h3>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  ¿Eliminar el cobro de <strong className="text-slate-700 dark:text-slate-200">€{Number(confirmDelete.amount).toFixed(2)}</strong>?
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-primary flex-1 !bg-gradient-to-r !from-rose-500 !to-red-500 !shadow-rose-500/25"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function formatPaymentDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'

  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
