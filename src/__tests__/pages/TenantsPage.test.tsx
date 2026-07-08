import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/test-utils'
import { TenantsPage } from '@/routes/rental/TenantsPage'

describe('TenantsPage', () => {
  it('renders title', () => {
    renderWithProviders(<TenantsPage />)
    expect(screen.getByText('Locataires')).toBeInTheDocument()
  })

  it('renders tenant cards after loading', async () => {
    renderWithProviders(<TenantsPage />)
    expect(await screen.findByText('Jean Dupont')).toBeInTheDocument()
    expect(await screen.findByText('Marie Ndiaye')).toBeInTheDocument()
    expect(await screen.findByText('Paul Biyong')).toBeInTheDocument()
  })

  it('shows active badge for renting tenants', async () => {
    renderWithProviders(<TenantsPage />)
    const badges = await screen.findAllByText('Actif')
    expect(badges.length).toBe(3)
  })
})
