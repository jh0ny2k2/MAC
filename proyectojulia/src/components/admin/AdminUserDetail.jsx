import { useState, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'
import { formatHours } from '../../lib/calculations'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorMessage from '../ui/ErrorMessage'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function AdminUserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [shifts, setShifts] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [working, setWorking] = useState(false)

  const loadUser = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const { data: usersData, error: rpcError } = await supabase.rpc('admin_list_users')
      if (rpcError) throw rpcError

      const found = (usersData || []).find(u => u.id === userId)
      if (!found) {
        setError('Usuario no encontrado')
        return
      }
      setUser(found)

      const [shiftsRes, profileRes] = await Promise.all([
        supabase
          .from('work_shifts')
          .select('*')
          .eq('user_id', userId)
          .order('work_date', { ascending: false })
          .limit(20),
        supabase.from('profiles').select('company_id').eq('id', userId).maybeSingle(),
      ])

      setShifts(shiftsRes.data || [])

      if (profileRes.data?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('name')
          .eq('id', profileRes.data.company_id)
          .maybeSingle()
        setCompanyName(companyData?.name || '')
      } else {
        setCompanyName('')
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el usuario')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const stats = useMemo(() => {
    const totalHours = shifts.reduce((acc, s) => acc + Number(s.total_hours), 0)
    return {
      count: shifts.length,
      hours: totalHours,
      lastShift: shifts[0]?.work_date || null,
    }
  }, [shifts])

  const flashSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 2500)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    setWorking(true)
    setActionError('')

    try {
      const { type, shiftId } = confirmAction

      if (type === 'shift') {
        const { error: delError } = await supabase
          .from('work_shifts')
          .delete()
          .eq('id', shiftId)
        if (delError) throw delError
        setConfirmAction(null)
        await loadUser()
        flashSuccess('Turno eliminado')
      }

      if (type === 'allShifts') {
        const { error: delError } = await supabase
          .from('work_shifts')
          .delete()
          .eq('user_id', userId)
        if (delError) throw delError
        setConfirmAction(null)
        await loadUser()
        flashSuccess('Todos los turnos eliminados')
      }

      if (type === 'profile') {
        const { error: delError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)
        if (delError) throw delError
        setConfirmAction(null)
        navigate('/admin/users', { replace: true })
      }
    } catch (err) {
      setActionError(err.message || 'Error al ejecutar la acción')
      setConfirmAction(null)
    } finally {
      setWorking(false)
    }
  }

  if (loading) return <LoadingSpinner text="Cargando usuario..." />

  if (error && !user) {
    return (
      <div className="space-y-4 animate-fade-in">
        <ErrorMessage message={error} />
        <button onClick={() => navigate('/admin/users')} className="btn-secondary">
          Volver a usuarios
        </button>
      </div>
    )
  }

  const roleLabel = user.role === 'company_owner' ? 'Empresa' : user.role === 'employee' ? 'Empleado' : 'Persona'

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <button onClick={() => navigate('/admin/users')} className="btn-ghost flex items-center gap-1 text-sm mb-3 -ml-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Usuarios
        </button>

        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
            user.role === 'company_owner'
              ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-purple-600/25'
              : user.role === 'employee'
                ? 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-blue-600/25'
                : 'bg-gradient-to-br from-brand-500 to-accent-500 shadow-brand-600/25'
          }`}>
            <span className="text-xl font-bold text-white">{(user.full_name || user.email || '?')[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">
              {user.full_name || user.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <ErrorMessage message={actionError} onDismiss={() => setActionError('')} />

      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm p-3 rounded-xl animate-fade-in">
          {success}
        </div>
      )}

      <div className="card">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Información</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <InfoRow label="Rol" value={roleLabel} />
          <InfoRow label="Empresa" value={companyName || '—'} />
          <InfoRow label="Tarifa" value={`${Number(user.hourly_rate || 0).toFixed(2)} €/hora`} />
          <InfoRow label="Registrado" value={formatDate(user.created_at)} />
          <InfoRow label="Último login" value={formatDate(user.last_sign_in_at)} />
          <InfoRow label="Email confirmado" value={user.confirmed_at ? 'Sí' : 'No'} />
          <InfoRow label="ID" value={user.id} mono />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Turnos" value={stats.count} />
        <MiniStat label="Horas" value={formatHours(stats.hours)} />
        <MiniStat label="Último turno" value={stats.lastShift ? formatDate(stats.lastShift) : '—'} small />
      </div>

      <div className="card">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Últimos turnos ({shifts.length})
        </h3>
        {shifts.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">Sin turnos registrados</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {shifts.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{formatDate(s.work_date)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)} · {formatHours(Number(s.total_hours))}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmAction({ type: 'shift', shiftId: s.id, date: formatDate(s.work_date) })}
                  className="p-2 rounded-xl text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
                  title="Eliminar turno"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card border-red-200/60 dark:border-red-500/20">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-1">Zona de peligro</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Estas acciones no se pueden deshacer. Borrar la cuenta de autenticación debe hacerse desde el panel de Supabase.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => setConfirmAction({ type: 'allShifts' })}
            disabled={stats.count === 0}
            className="w-full py-3 px-4 rounded-2xl font-medium text-sm bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Eliminar todos los turnos
          </button>
          <button
            onClick={() => setConfirmAction({ type: 'profile' })}
            className="w-full py-3 px-4 rounded-2xl font-medium text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-[0.98]"
          >
            Eliminar perfil del usuario
          </button>
        </div>
      </div>

      {confirmAction && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full animate-scale-in border border-slate-200/60 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">
              {confirmAction.type === 'shift' && 'Eliminar turno'}
              {confirmAction.type === 'allShifts' && 'Eliminar todos los turnos'}
              {confirmAction.type === 'profile' && 'Eliminar perfil'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
              {confirmAction.type === 'shift' && `Se eliminará el turno del ${confirmAction.date}. Esta acción no se puede deshacer.`}
              {confirmAction.type === 'allShifts' && `Se eliminarán los ${stats.count} turnos de este usuario. Esta acción no se puede deshacer.`}
              {confirmAction.type === 'profile' && 'Se eliminará el perfil y sus datos asociados. La cuenta seguirá existiendo en Supabase Auth hasta que la borres desde el dashboard.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 btn-ghost text-slate-600 dark:text-slate-300">
                Cancelar
              </button>
              <button onClick={executeAction} disabled={working} className="flex-1 btn-primary !bg-none !bg-red-500 hover:!bg-red-600 !shadow-red-500/25">
                {working ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-3">
      <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-slate-800 dark:text-slate-100 truncate ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function MiniStat({ label, value, small }) {
  return (
    <div className="card !p-4 text-center">
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`font-extrabold text-slate-800 dark:text-white mt-1 tabular-nums ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
    </div>
  )
}
