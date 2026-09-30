import type { Category } from '../types'
import categoriesData from '../data/categories.json'
import { loadCollection, saveCollection, simulateDelay } from './storage'

const KEY = 'categories'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function all(): Category[] {
  return loadCollection<Category>(KEY, categoriesData)
}

function save(collection: Category[]): void {
  saveCollection(KEY, collection)
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    await simulateDelay()
    return all()
  },

  async create(data: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
    await simulateDelay()
    const collection = all()
    const category: Category = {
      ...data,
      id: data.id || slugify(data.name) || `category-${collection.length + 1}`,
    }
    collection.push(category)
    save(collection)
    return category
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Categoría no encontrada')
    collection[index] = { ...collection[index], ...data, id }
    save(collection)
    return collection[index]
  },

  async remove(id: string): Promise<void> {
    await simulateDelay()
    save(all().filter((c) => c.id !== id))
  },
}