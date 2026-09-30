import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, PackageX, RefreshCw } from 'lucide-react'
import { inventoryService, type InventoryAlertItem } from '../../services/inventoryService'
import { formatPrice } from '../../utils/format'
import { cx } from '../../utils/format'
import LoadingSkeleton from '../common/LoadingSkeleton'

export function InventoryAlertsBanner() {
  const [alerts, setAlerts] = useState<InventoryAlertItem[] | null>(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let mounted = true
    inventoryService.getAlerts().then((list) => {
      if (mounted) setAlerts(list)
    })
    return () => {
      mounted = false
    }
  }, [reload])

  const refresh = () => setReload((prev) => prev + 1)

  if (alerts === null) {
    return (
      <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-4">
        <LoadingSkeleton variant="lines" count={3} />
      </div>
    )
  }

  if (alerts.length === 0) {
    return null
  }

  const lowStock = alerts.filter((a) => a.alert === 'stock-bajo')
  const out = alerts.filter((a) => a.alert === 'agotado')

  return (
    <div
      className={cx(
        'rounded-2xl border p-5',
        out.length > 0
          ? 'border-f1-500/30 bg-f1-500/5'
          : 'border-amber-500/30 bg-amber-500/5',
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cx(
              'flex size-9 items-center justify-center rounded-lg border',
              out.length > 0
                ? 'border-f1-500/30 bg-f1-500/10 text-f1-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400',
            )}
          >
            {out.length > 0 ? <PackageX size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Alertas de inventario
            </h3>
            <p className="text-xs text-carbon-400">
              {lowStock.length} producto(s) con stock bajo · {out.length} agotado(s)
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-1.5 rounded-lg border border-carbon-700 px-3 py-1.5 text-xs font-medium text-carbon-300 transition-colors hover:border-carbon-500"
        >
          <RefreshCw size={13} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {alerts.map((alert) => (
          <Link
            key={alert.product.id}
            to={`/admin/inventario?destacar=${alert.product.id}`}
            className="flex items-center gap-3 rounded-xl border border-carbon-800 bg-carbon-900/50 p-3 transition-colors hover:border-carbon-600"
          >
            <div
              className={cx(
                'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                alert.alert === 'agotado'
                  ? 'border-f1-500/30 bg-f1-500/10 text-f1-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400',
              )}
            >
              {alert.alert === 'agotado' ? (
                <PackageX size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-carbon-100">
                {alert.product.name}
              </p>
              <p className="text-xs text-carbon-400">
                {alert.alert === 'agotado'
                  ? 'Sin existencias'
                  : `${alert.product.stock} uds. · mínimo ${alert.product.minStock ?? 5}`}{' '}
                · {formatPrice(alert.product.price)}
              </p>
            </div>
            {alert.soldUnits >= 30 && alert.alert === 'stock-bajo' ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-f1-500/10 px-2 py-1 text-[11px] font-semibold text-f1-400">
                <AlertTriangle size={12} />
                Vende rápido
              </span>
            ) : (
              alert.soldUnits < 30 && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 size={12} />
                  En stock
                </span>
              )
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}