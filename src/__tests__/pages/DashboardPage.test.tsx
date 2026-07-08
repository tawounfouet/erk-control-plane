import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/__tests__/test-utils'
import { DashboardPage } from '@/routes/manager/DashboardPage'

describe('DashboardPage', () => {
  it('renders welcome message', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
  })

  it('renders stat cards', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Logements')).toBeInTheDocument()
    expect(screen.getByText("Taux d'occupation")).toBeInTheDocument()
    expect(screen.getByText('Locataires actifs')).toBeInTheDocument()
    expect(screen.getByText('Maintenance ouverte')).toBeInTheDocument()
    expect(screen.getByText('Suggestions non lues')).toBeInTheDocument()
  })

  it('renders overview section', () => {
    renderWithProviders(<DashboardPage />)
    expect(screen.getByText('Vue d\'ensemble')).toBeInTheDocument()
  })
})
