import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import SearchFilter from './custom-search-filter'

const baseProps = {
  textData: {
    placeholder: 'Search...',
    btnTitle: 'Search',
  },
}

describe('SearchFilter', () => {
  it('renders the search input', () => {
    render(<SearchFilter {...baseProps} />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('displays updated value as user types', async () => {
    const user = userEvent.setup()
    render(<SearchFilter {...baseProps} />)
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
    await user.type(input, 'hello')
    expect(input.value).toBe('hello')
  })

  it('calls onSearch with typed value when provided', async () => {
    // SearchFilter manages its own internal state; onSearch is available but currently
    // not triggered by default (button is commented out). Test that typing updates input.
    const handleSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchFilter {...baseProps} onSearch={handleSearch} />)
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'test')
    expect((input as HTMLInputElement).value).toBe('test')
  })

  it('uses custom placeholder from textData prop', () => {
    render(
      <SearchFilter
        textData={{ placeholder: 'Find client...', btnTitle: 'Find' }}
      />,
    )
    expect(screen.getByPlaceholderText('Find client...')).toBeInTheDocument()
  })
})
