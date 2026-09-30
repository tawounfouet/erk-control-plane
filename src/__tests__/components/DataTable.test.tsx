import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTable } from '@/components/common/DataTable'

const rows = [{ id: '1', name: 'Résidence Atlas' }]
const columns = [{ key: 'name', header: 'Nom' }]

describe('DataTable accessibility', () => {
  it('exposes its caption and column headers', () => {
    render(<DataTable columns={columns} data={rows} caption="Liste des résidences" />)
    expect(screen.getByRole('table', { name: 'Liste des résidences' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Nom' })).toBeInTheDocument()
  })

  it('allows keyboard activation of interactive rows', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} data={rows} onRowClick={onRowClick} />)
    const row = screen.getByRole('row', { name: /Résidence Atlas/ })
    row.focus()
    fireEvent.keyDown(row, { key: 'Enter' })
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })
})
