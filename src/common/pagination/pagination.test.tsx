import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import Paginator from './pagination'

const baseProps = {
  page: 0,
  totalPages: 5,
  totalRecord: 50,
  onPageChange: vi.fn(),
}

describe('Paginator', () => {
  it('renders page range info', () => {
    render(<Paginator {...baseProps} page={0} totalRecord={50} />)
    // The text "1-5 of 50 Rows" is split across spans; use regex on the container text
    expect(screen.getByText('50')).toBeInTheDocument()
    // Confirm the paragraph containing the range info is present
    const rowsEl = screen.getByText((_, element) => {
      return element?.textContent?.includes('Rows') === true &&
        element?.tagName === 'P'
    })
    expect(rowsEl).toBeInTheDocument()
  })

  it('calls onPageChange when next page is clicked', async () => {
    const handlePageChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Paginator
        {...baseProps}
        page={0}
        totalPages={3}
        onPageChange={handlePageChange}
      />,
    )
    const nextButton = screen.getByRole('button', { name: /go to next page/i })
    await user.click(nextButton)
    expect(handlePageChange).toHaveBeenCalled()
  })

  it('disables prev button on first page', () => {
    render(<Paginator {...baseProps} page={0} totalPages={3} />)
    const prevButton = screen.getByRole('button', { name: /go to previous page/i })
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Paginator {...baseProps} page={2} totalPages={3} />)
    const nextButton = screen.getByRole('button', { name: /go to next page/i })
    expect(nextButton).toBeDisabled()
  })

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Paginator {...baseProps} totalPages={0} totalRecord={0} />,
    )
    // The outer fragment renders nothing visible
    expect(container.firstChild).toBeNull()
  })
})
