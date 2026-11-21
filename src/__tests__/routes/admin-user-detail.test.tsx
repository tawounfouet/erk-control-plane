import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/__tests__/test-utils'
import { UserDetailPage } from '@/routes/admin/UserDetailPage'

describe('administrative user record', () => {
  it('renders identity, permissions and tenant information', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/admin/users/:id" element={<UserDetailPage />} />
      </Routes>,
      { initialEntries: ['/admin/users/u-004'] },
    )

    expect((await screen.findAllByText('Jean MBARGA')).length).toBeGreaterThan(0)
    expect(screen.getByText('Identité et contact')).toBeInTheDocument()
    expect(screen.getByText('Accès et rôles')).toBeInTheDocument()
    expect(screen.getByText('Dossier locataire')).toBeInTheDocument()
    expect(screen.getByText('H-203 · Eureka')).toBeInTheDocument()
    expect(screen.getByText('Carte nationale d’identité')).toBeInTheDocument()
  })
})
