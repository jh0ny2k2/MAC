import { useEffect, useState } from 'react'
import { Building2, CreditCard, Palette, ShieldCheck, Truck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { FormInput } from '../../components/common/FormControls'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { settingsService } from '../../services/settingsService'
import type { StoreSettings } from '../../types/admin'

export default function Settings() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    settingsService.get().then((data) => {
      if (mounted) setSettings(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const set = <K extends keyof StoreSettings>(
    section: K,
    key: keyof StoreSettings[K],
    value: string | number,
  ) => {
    setSettings((prev) =>
      prev ? { ...prev, [section]: { ...prev[section], [key]: value } } : prev,
    )
  }

  const handleSave = async () => {
    if (!settings) return
    if (!settings.store.email.includes('@')) {
      showToast('Introduce un email válido', 'error')
      return
    }
    setSaving(true)
    try {
      await settingsService.save(settings)
      showToast('Ajustes guardados correctamente')
    } catch {
      showToast('No se pudieron guardar los ajustes', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!settings) {
    return <LoadingSkeleton variant="lines" count={8} />
  }

  const section =
    'rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5 space-y-4'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ajustes"
        subtitle="Configuración general de la tienda"
        actions={
          <Button onClick={handleSave} disabled={saving || !settings}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        }
      />

      <div className="max-w-3xl space-y-6">
        <section className={section}>
          <div className="flex items-center gap-2.5">
            <Building2 size={17} className="text-f1-400" />
            <h3 className="font-display text-sm font-semibold text-white">Datos de la tienda</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Nombre de la tienda"
              value={settings.store.name}
              onChange={(e) => set('store', 'name', e.target.value)}
            />
            <FormInput
              label="Email de contacto"
              type="email"
              value={settings.store.email}
              onChange={(e) => set('store', 'email', e.target.value)}
            />
            <FormInput
              label="Teléfono"
              value={settings.store.phone}
              onChange={(e) => set('store', 'phone', e.target.value)}
            />
            <FormInput
              label="Dirección"
              value={settings.store.address}
              onChange={(e) => set('store', 'address', e.target.value)}
            />
          </div>
        </section>

        <section className={section}>
          <div className="flex items-center gap-2.5">
            <Truck size={17} className="text-racing-400" />
            <h3 className="font-display text-sm font-semibold text-white">Envíos</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormInput
              label="Precio envío estándar (EUR)"
              type="number"
              step="0.01"
              value={String(settings.shipping.standardPrice)}
              onChange={(e) => set('shipping', 'standardPrice', Number(e.target.value))}
            />
            <FormInput
              label="Envío gratis desde (EUR)"
              type="number"
              step="0.01"
              value={String(settings.shipping.freeFrom)}
              onChange={(e) => set('shipping', 'freeFrom', Number(e.target.value))}
            />
            <FormInput
              label="Tiempo estimado"
              value={settings.shipping.estimatedDays}
              onChange={(e) => set('shipping', 'estimatedDays', e.target.value)}
            />
          </div>
        </section>

        <section className={section}>
          <div className="flex items-center gap-2.5">
            <CreditCard size={17} className="text-emerald-400" />
            <h3 className="font-display text-sm font-semibold text-white">Impuestos</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormInput
              label="IVA (%)"
              type="number"
              step="0.1"
              value={String(settings.tax.vatRate)}
              onChange={(e) => set('tax', 'vatRate', Number(e.target.value))}
              hint="Se aplica al calcular los precios totales"
            />
          </div>
        </section>

        <section className={section}>
          <div className="flex items-center gap-2.5">
            <Palette size={17} className="text-amber-400" />
            <h3 className="font-display text-sm font-semibold text-white">Apariencia</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Etiqueta del logo"
              value={settings.appearance.logoLabel}
              onChange={(e) => set('appearance', 'logoLabel', e.target.value)}
            />
            <FormInput
              label="Nombre visible"
              value={settings.appearance.storeName}
              onChange={(e) => set('appearance', 'storeName', e.target.value)}
            />
          </div>
        </section>

        <section className={section}>
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="text-sky-400" />
            <h3 className="font-display text-sm font-semibold text-white">Cuenta admin</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              label="Nombre"
              value={settings.admin.name}
              onChange={(e) => set('admin', 'name', e.target.value)}
            />
            <FormInput
              label="Email"
              type="email"
              value={settings.admin.email}
              onChange={(e) => set('admin', 'email', e.target.value)}
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">
                Contraseña (demo)
              </label>
              <input
                type="password"
                value={settings.admin.password}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2.5 text-sm text-carbon-500 opacity-60"
              />
            </div>
          </div>
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400/90">
            ⚠️ Entorno de demostración: cambiar la contraseña aquí no es seguro. En una
            app real, gestiona las credenciales con autenticación segura.
          </p>
        </section>
      </div>
    </div>
  )
}