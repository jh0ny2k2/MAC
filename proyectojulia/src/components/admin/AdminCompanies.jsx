import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatHours } from '../../lib/calculations'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import ErrorMessage from '../ui/ErrorMessage'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [members, setMembers] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [companiesRes, membersRes, shiftsRes] = await Promise.all([
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('company_members').select('*'),
        supabase.from('work_shifts').select('user_id, total_hours'),
      ])

      setCompanies(companiesRes.data || [])
      setMembers(membersRes.data || [])
      setShifts(shiftsRes.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar las empresas')
    } finally {
      setLoading(false)
    }
  }

  const rows = useMemo(() => {
    return companies.map((c) => {
      const companyMembers = members.filter(m => m.company_id === c.id)
      const accepted = companyMembers.filter(m => m.status === 'accepted')
      const memberIds = accepted.map(m => m.user_id)
      const companyShifts = shifts.filter(s => memberIds.includes(s.user_id))
      const hours = companyShifts.reduce((acc, s) => acc + Number(s.total_hours), 0)

      return {
        ...c,
        employees: accepted.length,
        pendingInvites: companyMembers.filter(m => m.status === 'pending').length,
        shifts: companyShifts.length,
        hours,
      }
    })
  }, [companies, members, shifts])

  if (loading) return <LoadingSpinner text="Cargando empresas..." />

  return (
    <div className="space-y-4 animate-fade-in">
      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {companies.length} empresa{companies.length !== 1 ? 's' : ''}
        </p>
        <button onClick={loadData} className="btn-ghost !px-2" title="Recargar">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8 text-brand-500 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          title="No hay empresas"
          description="Cuando un usuario cree una empresa aparecerá aquí"
        />
      ) : (
        <div className="space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-600/25">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{c.name}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Creada el {formatDate(c.created_at)}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg flex-shrink-0 tabular-nums">
                  {c.employees} emp.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums">{c.shifts}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Turnos</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums">{formatHours(c.hours)}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Horas</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums">{c.pendingInvites}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Invites</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
