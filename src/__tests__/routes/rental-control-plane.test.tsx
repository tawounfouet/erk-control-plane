import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/__tests__/test-utils'
import { RentalControlPage } from '@/routes/rental/RentalControlPage'

describe('rental control plane', () => {
  it('offers keyboard-accessible views for the complete rental ledger', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RentalControlPage />)

    expect(await screen.findByText('Affectation de A-001')).toBeInTheDocument()
    const meters = screen.getByRole('tab', { name: 'Compteurs' })
    await user.click(meters)
    expect(meters).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByText(/1284.50/)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'États des lieux' }))
    expect(await screen.findByText(/Logement remis en bon état/)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Acceptations' }))
    expect(await screen.findByText('Signatures en attente')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une signature')).toBeInTheDocument()
  })
})
