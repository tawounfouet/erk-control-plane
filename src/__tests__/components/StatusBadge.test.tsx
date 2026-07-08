import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge, PriorityBadge } from '@/components/operations/StatusBadge'

describe('StatusBadge', () => {
  it.each([
    ['CREATED', 'Créée'],
    ['PENDING_VALIDATION', 'En attente'],
    ['APPROVED', 'Approuvée'],
    ['IN_PROGRESS', 'En cours'],
    ['COMPLETED', 'Terminée'],
    ['CANCELLED', 'Annulée'],
  ] as const)('renders %s as "%s"', (status, label) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('renders with correct color class for COMPLETED', () => {
    const { container } = render(<StatusBadge status="COMPLETED" />)
    expect(container.firstChild).toHaveClass('bg-green-100')
  })

  it('renders with correct color class for CANCELLED', () => {
    const { container } = render(<StatusBadge status="CANCELLED" />)
    expect(container.firstChild).toHaveClass('bg-gray-200')
  })
})

describe('PriorityBadge', () => {
  it.each([
    ['URGENT', 'Urgente'],
    ['HIGH', 'Haute'],
    ['NORMAL', 'Normale'],
    ['LOW', 'Basse'],
  ] as const)('renders %s as "%s"', (priority, label) => {
    render(<PriorityBadge priority={priority} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
