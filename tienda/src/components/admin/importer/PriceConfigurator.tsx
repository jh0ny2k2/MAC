import { Calculator } from 'lucide-react'
import type { PriceConfig, PriceStrategy } from '../../../types/import'
import { suggestedPrice } from '../../../services/importer/ProductNormalizer'
import { formatPrice } from '../../../utils/format'
import { FormInput, FormSelect } from '../../common/FormControls'
import Button from '../../ui/Button'

interface PriceConfiguratorProps {
  config: PriceConfig
  currency: string
  onChange: (config: PriceConfig) => void
}

const STRATEGY_OPTIONS: Array<{ value: PriceStrategy; label: string }> = [
  { value: 'margin', label: 'Margen porcentual' },
  { value: 'fixed', label: 'Incremento fijo' },
  { value: 'manual', label: 'Precio manual' },
]

export default function PriceConfigurator({
  config,
  currency,
  onChange,
}: PriceConfiguratorProps) {
  const suggested = suggestedPrice(
    config.cost,
    config.strategy,
    config.marginPercent,
    config.fixedIncrease,
  )

  const patch = (next: Partial<PriceConfig>) => onChange({ ...config, ...next })

  const setNumber = (field: keyof PriceConfig, raw: string) => {
    const value = Number.parseFloat(raw.replace(',', '.'))
    const parsed = Number.isNaN(value) ? 0 : value
    patch({ [field]: Math.round(parsed * 100) / 100 } as Partial<PriceConfig>)
  }

  const applySuggested = () => patch({ salePrice: suggested })

  return (
    <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-white">
            Configuración de precio
          </h3>
          <p className="mt-0.5 text-xs text-carbon-500">
            El precio del proveedor se guarda como <strong>coste</strong>. El
            precio de venta es independiente y siempre revisable.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={applySuggested}>
          <Calculator size={14} />
          Calcular automáticamente
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormSelect
          label="Estrategia"
          value={config.strategy}
          onChange={(e) =>
            onChange({ ...config, strategy: e.target.value as PriceStrategy })
          }
          options={STRATEGY_OPTIONS}
        />
        <FormInput
          label={`Coste proveedor (${currency})`}
          type="number"
          step="0.01"
          value={config.cost}
          onChange={(e) => setNumber('cost', e.target.value)}
          placeholder="0.00"
        />
        {config.strategy === 'margin' ? (
          <FormInput
            label="Margen (%)"
            type="number"
            step="1"
            value={config.marginPercent}
            onChange={(e) => setNumber('marginPercent', e.target.value)}
          />
        ) : config.strategy === 'fixed' ? (
          <FormInput
            label={`Incremento (${currency})`}
            type="number"
            step="0.01"
            value={config.fixedIncrease}
            onChange={(e) => setNumber('fixedIncrease', e.target.value)}
          />
        ) : (
          <div className="rounded-xl border border-carbon-800 bg-carbon-950/50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-carbon-500">
              Precio manual
            </p>
            <p className="mt-1 text-sm text-carbon-300">Introduce el precio de venta a la derecha.</p>
          </div>
        )}
        <FormInput
          label={`Precio de venta (${currency})`}
          type="number"
          step="0.01"
          value={config.salePrice}
          onChange={(e) => setNumber('salePrice', e.target.value)}
        />
        <FormInput
          label={`Precio anterior (${currency})`}
          type="number"
          step="0.01"
          value={config.oldPrice}
          onChange={(e) => setNumber('oldPrice', e.target.value)}
          placeholder="Opcional (descuento)"
        />
        <FormInput
          label="Descuento (%)"
          type="number"
          step="1"
          min="0"
          max="100"
          value={config.discountPercent}
          onChange={(e) => setNumber('discountPercent', e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-carbon-500">
            Precio sugerido
          </p>
          <p className="font-display text-xl font-bold text-f1-400">
            {formatPrice(suggested)}
          </p>
        </div>
        <div className="hidden h-8 w-px bg-carbon-800 sm:block" />
        <div>
          <p className="text-[11px] uppercase tracking-wider text-carbon-500">
            Consta de
          </p>
          <p className="text-sm text-carbon-300">
            {config.strategy === 'margin'
              ? `Coste ${formatPrice(config.cost)} + ${config.marginPercent}%`
              : config.strategy === 'fixed'
                ? `Coste ${formatPrice(config.cost)} + ${formatPrice(config.fixedIncrease)}`
                : 'Precio manual'}
          </p>
        </div>
        {config.discountPercent > 0 && (
          <span className="rounded-md bg-f1-500/10 px-2 py-1 text-xs font-semibold text-f1-400">
            -{config.discountPercent}% (respecto al precio anterior)
          </span>
        )}
      </div>
    </div>
  )
}