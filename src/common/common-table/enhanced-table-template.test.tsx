import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import EnhancedTableTemplate from './enhanced-table-template'

describe('EnhancedTableTemplate', () => {
  it('renders all column headers', () => {
    render(<EnhancedTableTemplate />)
    expect(screen.getByText('Client ID')).toBeInTheDocument()
    expect(screen.getByText('Client Name')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Treatment Description')).toBeInTheDocument()
    expect(screen.getByText('Reason')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders row data from initialData prop', () => {
    const testData = [
      {
        id: '1',
        clientId: 'CLI001',
        clientName: 'Alice Smith',
        type: 'Individual',
        code: '2001',
        treatmentDescription: 'Initial Assessment',
        reason: 'Probation',
      },
    ]
    render(<EnhancedTableTemplate initialData={testData} />)
    expect(screen.getByText('CLI001')).toBeInTheDocument()
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Individual')).toBeInTheDocument()
    expect(screen.getByText('2001')).toBeInTheDocument()
    expect(screen.getByText('Initial Assessment')).toBeInTheDocument()
    expect(screen.getByText('Probation')).toBeInTheDocument()
  })

  it('shows "No data available" when initialData is empty', () => {
    render(<EnhancedTableTemplate initialData={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('renders default mock data when no initialData is provided', () => {
    render(<EnhancedTableTemplate />)
    // Default mock data includes "Leon Kennedy"
    expect(screen.getByText('Leon Kennedy')).toBeInTheDocument()
  })
})
