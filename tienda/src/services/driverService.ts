import type { Driver } from '../types'
import driversData from '../data/drivers.json'
import { loadCollection, nextId, saveCollection, simulateDelay } from './storage'

const KEY = 'drivers'

function all(): Driver[] {
  return loadCollection<Driver>(KEY, driversData)
}

function save(collection: Driver[]): void {
  saveCollection(KEY, collection)
}

export const driverService = {
  async getAll(): Promise<Driver[]> {
    await simulateDelay()
    return all()
  },

  async getById(id: number): Promise<Driver | undefined> {
    await simulateDelay(200)
    return all().find((d) => d.id === id)
  },

  async create(data: Omit<Driver, 'id'> & { id?: number }): Promise<Driver> {
    await simulateDelay()
    const collection = all()
    const driver: Driver = {
      ...data,
      id: data.id ?? nextId(collection),
    }
    collection.push(driver)
    save(collection)
    return driver
  },

  async update(id: number, data: Partial<Driver>): Promise<Driver> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((d) => d.id === id)
    if (index === -1) throw new Error('Piloto no encontrado')
    collection[index] = { ...collection[index], ...data, id }
    save(collection)
    return collection[index]
  },

  async remove(id: number): Promise<void> {
    await simulateDelay()
    save(all().filter((d) => d.id !== id))
  },
}