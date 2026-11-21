import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/__tests__/test-utils'
import { EquipmentPage } from '@/routes/patrimoine/EquipmentPage'
import { PatrimoineRegistryPage } from '@/routes/patrimoine/PatrimoineRegistryPage'

describe('patrimoine control plane', () => {
  it('navigates the technical registry with accessible tabs', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PatrimoineRegistryPage />)

    expect(await screen.findByText('Studio')).toBeInTheDocument()
    const assetsTab = screen.getByRole('tab', { name: 'Éléments fixes' })
    await user.click(assetsTab)

    expect(assetsTab).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByText('Peinture des murs')).toBeInTheDocument()
  })

  it('shows atomic stock and permission-bound actions', async () => {
    renderWithProviders(<EquipmentPage />)

    expect(await screen.findByText('CLI-2026-SAM-00001')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Contrôler' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retour' })).toBeInTheDocument()
    expect(screen.getByLabelText('Unité cible pour VEN-2026-BEL-00002')).toBeInTheDocument()
  })
})
