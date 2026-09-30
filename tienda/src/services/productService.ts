import type { Product } from '../types'
import productsData from '../data/products.json'
import { loadCollection, nextId, saveCollection, simulateDelay } from './storage'

const KEY = 'products'
const GRID_IMAGES = [
  '/images/products/placeholder.svg',
]

function normalize(product: Product): Product {
  return {
    ...product,
    rating: product.rating ?? 4.5,
    reviews: product.reviews ?? 0,
    images: product.images.length > 0 ? product.images : GRID_IMAGES,
  }
}

function all(): Product[] {
  return loadCollection<Product>(KEY, productsData as Product[])
}

function save(collection: Product[]): void {
  saveCollection(KEY, collection)
}

export const productService = {
  async getAll(): Promise<Product[]> {
    await simulateDelay()
    return all().map((p) => normalize(p))
  },

  async getById(id: number): Promise<Product | undefined> {
    await simulateDelay(200)
    const found = all().find((p) => p.id === id)
    return found ? normalize(found) : undefined
  },

  async create(data: Partial<Product>): Promise<Product> {
    await simulateDelay()
    const collection = all()
    const base: Product = {
      id: 0,
      name: '',
      team: '',
      driver: '',
      season: new Date().getFullYear(),
      scale: '1:43',
      price: 0,
      rating: 4.5,
      reviews: 0,
      stock: 0,
      featured: false,
      bestseller: false,
      category: '',
      manufacturer: '',
      material: '',
      dimensions: '',
      weight: '',
      images: GRID_IMAGES,
      description: '',
      specifications: [],
      sku: `F1-${String(nextId(collection)).padStart(3, '0')}`,
      minStock: 5,
      isNew: true,
      status: 'borrador',
    }
    const product = normalize({
      ...base,
      ...data,
      id: nextId(collection),
    })
    collection.push(product)
    save(collection)
    return product
  },

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Producto no encontrado')
    const updated = normalize({ ...collection[index], ...data, id })
    collection[index] = updated
    save(collection)
    return updated
  },

  async updateStock(id: number, stock: number): Promise<Product> {
    return this.update(id, { stock })
  },

  async remove(id: number): Promise<void> {
    await simulateDelay()
    save(all().filter((p) => p.id !== id))
  },

  async duplicate(id: number): Promise<Product> {
    await simulateDelay()
    const source = all().find((p) => p.id === id)
    if (!source) throw new Error('Producto no encontrado')
    const { ...rest } = source
    return this.create({
      ...rest,
      name: `${source.name} (copia)`,
    })
  },

  async bulkRemove(ids: number[]): Promise<void> {
    await simulateDelay()
    save(all().filter((p) => !ids.includes(p.id)))
  },

  async bulkSetStatus(
    ids: number[],
    status: 'disponible' | 'poco-stock' | 'agotado' | 'borrador',
  ): Promise<void> {
    await simulateDelay()
    const collection = all()
    for (const p of collection) {
      if (ids.includes(p.id)) p.status = status
    }
    save(collection)
  },
}

export const INVENTORY_GRID_IMAGES = GRID_IMAGES