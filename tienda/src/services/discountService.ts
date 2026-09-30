import type { DiscountCode } from '../types/admin'
import discountsData from '../data/discounts.json'
import { loadCollection, nextId, saveCollection, simulateDelay } from './storage'

const KEY = 'discounts'

function all(): DiscountCode[] {
  return loadCollection<DiscountCode>(KEY, discountsData as DiscountCode[])
}

function save(collection: DiscountCode[]): void {
  saveCollection(KEY, collection)
}

export const discountService = {
  async getAll(): Promise<DiscountCode[]> {
    await simulateDelay()
    return all()
  },

  async getByCode(code: string): Promise<DiscountCode | undefined> {
    await simulateDelay(150)
    const found = all().find(
      (d) => d.code.toLowerCase() === code.trim().toLowerCase(),
    )
    if (
      found &&
      (found.status === 'expirado' ||
        found.status === 'desactivado' ||
        found.uses >= found.maxUses)
    ) {
      return undefined
    }
    return found
  },

  async create(
    data: Omit<DiscountCode, 'id' | 'uses'> & {
      id?: number
      uses?: number
    },
  ): Promise<DiscountCode> {
    await simulateDelay()
    const collection = all()
    const discount: DiscountCode = {
      ...data,
      uses: data.uses ?? 0,
      id: data.id ?? nextId(collection),
    }
    collection.push(discount)
    save(collection)
    return discount
  },

  async update(id: number, data: Partial<DiscountCode>): Promise<DiscountCode> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((d) => d.id === id)
    if (index === -1) throw new Error('Descuento no encontrado')
    collection[index] = { ...collection[index], ...data, id }
    save(collection)
    return collection[index]
  },

  async remove(id: number): Promise<void> {
    await simulateDelay()
    save(all().filter((d) => d.id !== id))
  },

  async registerUse(id: number): Promise<void> {
    await simulateDelay(100)
    const collection = all()
    const index = collection.findIndex((d) => d.id === id)
    if (index === -1) return
    collection[index] = { ...collection[index], uses: collection[index].uses + 1 }
    save(collection)
  },

  async setStatus(
    id: number,
    status: 'activo' | 'programado' | 'expirado' | 'desactivado',
  ): Promise<void> {
    await this.update(id, { status })
  },
}