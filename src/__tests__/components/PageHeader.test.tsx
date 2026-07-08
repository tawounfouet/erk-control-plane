import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from '@/components/common/PageHeader'

describe('PageHeader', () => {
  it('renders title and description', () => {
    render(<PageHeader title="Test Title" description="Test description" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders without description', () => {
    render(<PageHeader title="Only Title" />)
    expect(screen.getByText('Only Title')).toBeInTheDocument()
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders actions', () => {
    render(<PageHeader title="Title" actions={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})
