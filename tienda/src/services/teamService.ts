import type { Team } from '../types'
import teamsData from '../data/teams.json'
import { loadCollection, saveCollection, simulateDelay } from './storage'

const KEY = 'teams'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function all(): Team[] {
  return loadCollection<Team>(KEY, teamsData)
}

function save(collection: Team[]): void {
  saveCollection(KEY, collection)
}

export const teamService = {
  async getAll(): Promise<Team[]> {
    await simulateDelay()
    return all()
  },

  async getById(id: string): Promise<Team | undefined> {
    await simulateDelay(200)
    return all().find((t) => t.id === id)
  },

  async create(data: Omit<Team, 'id'> & { id?: string }): Promise<Team> {
    await simulateDelay()
    const collection = all()
    const team: Team = {
      ...data,
      id: data.id || slugify(data.name) || `team-${collection.length + 1}`,
    }
    collection.push(team)
    save(collection)
    return team
  },

  async update(id: string, data: Partial<Team>): Promise<Team> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Escudería no encontrada')
    collection[index] = { ...collection[index], ...data, id }
    save(collection)
    return collection[index]
  },

  async remove(id: string): Promise<void> {
    await simulateDelay()
    save(all().filter((t) => t.id !== id))
  },
}