import { describe, it, expect, beforeEach } from 'vitest'
import { setTokens, clearTokens } from '@/lib/api/client'
import { listBuildings, getBuilding, listUnits } from '@/lib/api/patrimoine'

beforeEach(() => {
  clearTokens()
  setTokens('test-access', 'test-refresh')
})

describe('patrimoine API', () => {
  it('lists buildings', async () => {
    const data = await listBuildings()
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.results[0].name).toContain('Eureka')
  })

  it('gets building detail', async () => {
    const building = await getBuilding('b-001')
    expect(building.name).toBe('Résidence Eureka A')
  })

  it('returns 404 for unknown building', async () => {
    await expect(getBuilding('unknown')).rejects.toThrow()
  })

  it('lists units with status filter', async () => {
    const data = await listUnits({ current_status: 'OCCUPIED' })
    expect(data.results.every((u) => u.current_status === 'OCCUPIED')).toBe(true)
  })

  it('lists all units without filter', async () => {
    const data = await listUnits()
    expect(data.results.length).toBe(5)
  })
})
