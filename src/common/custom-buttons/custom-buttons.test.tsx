import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import CustomButton from './custom-buttons'

describe('CustomButton', () => {
  it('renders with children text', () => {
    render(<CustomButton>Click me</CustomButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const { user } = render(
      <CustomButton onClick={handleClick}>Submit</CustomButton>,
    )

    await user.click(screen.getByText('Submit'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const { user } = render(
      <CustomButton onClick={handleClick} disabled>
        Submit
      </CustomButton>,
    )

    await user.click(screen.getByText('Submit'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading spinner when loading', () => {
    render(<CustomButton loading>Saving</CustomButton>)
    expect(screen.getByText('Saving')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders with data-testid', () => {
    render(<CustomButton data-testid="submit-btn">Go</CustomButton>)
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
  })

  it('sets aria-disabled when disabled', () => {
    render(<CustomButton disabled>Disabled</CustomButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })
})
