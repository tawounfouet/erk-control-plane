import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/__tests__/test-utils'
import { OperationsPage } from '@/routes/operations/OperationsPage'
import { SuggestionsPage } from '@/routes/suggestions/SuggestionsPage'

describe('operations and suggestions control planes', () => {
  it('exposes an accessible operation creation workflow', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OperationsPage />)
    expect(await screen.findByText("Fuite d'eau A-101")).toBeInTheDocument()
    await user.click(screen.getByText('Créer une opération'))
    expect(screen.getByLabelText('Titre')).toBeInTheDocument()
    expect(screen.getByLabelText('Type')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument()
  })

  it('exposes an accessible suggestion submission workflow', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SuggestionsPage />)
    expect(await screen.findByText('Installer des fontaines à eau')).toBeInTheDocument()
    await user.click(screen.getByText('Déposer une suggestion'))
    expect(screen.getByLabelText('Titre')).toBeInTheDocument()
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument()
  })
})
