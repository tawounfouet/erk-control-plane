import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/test-utils'
import { BuildingsPage } from '@/routes/patrimoine/BuildingsPage'

describe('BuildingsPage', () => {
  it('renders title', () => {
    renderWithProviders(<BuildingsPage />)
    expect(screen.getByText('Bâtiments')).toBeInTheDocument()
  })

  it('renders building cards after loading', async () => {
    renderWithProviders(<BuildingsPage />)
    expect(await screen.findByText('Résidence Eureka A')).toBeInTheDocument()
    expect(await screen.findByText('Résidence Eureka B')).toBeInTheDocument()
  })

  it('renders building stats', async () => {
    renderWithProviders(<BuildingsPage />)
    expect(await screen.findByText('12 unités')).toBeInTheDocument()
    expect(screen.getByText('3 étages')).toBeInTheDocument()
  })
})
