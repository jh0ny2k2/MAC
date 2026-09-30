import type { StoreSettings } from '../types/admin'
import { loadObject, saveObject, simulateDelay } from './storage'

const KEY = 'settings'

const DEFAULTS: StoreSettings = {
  store: {
    name: 'Apex F1 Store',
    email: 'hola@apexf1store.com',
    phone: '+34 900 100 200',
    address: 'Calle de la Fórmula 1, 44 · 28001 Madrid',
  },
  shipping: {
    standardPrice: 6.99,
    freeFrom: 99,
    estimatedDays: '2-4 días laborables',
  },
  tax: {
    vatRate: 21,
  },
  appearance: {
    logoLabel: 'APEX',
    storeName: 'Apex F1 Store',
  },
  admin: {
    name: 'Administrador',
    email: 'admin@f1store.com',
    password: 'admin123',
  },
}

export const settingsService = {
  async get(): Promise<StoreSettings> {
    await simulateDelay(200)
    const current = loadObject<StoreSettings>(KEY, DEFAULTS)
    return {
      ...DEFAULTS,
      ...current,
      store: { ...DEFAULTS.store, ...current.store },
      shipping: { ...DEFAULTS.shipping, ...current.shipping },
      tax: { ...DEFAULTS.tax, ...current.tax },
      appearance: { ...DEFAULTS.appearance, ...current.appearance },
      admin: { ...DEFAULTS.admin, ...current.admin },
    }
  },

  async save(settings: StoreSettings): Promise<StoreSettings> {
    await simulateDelay()
    saveObject(KEY, settings)
    return settings
  },
}