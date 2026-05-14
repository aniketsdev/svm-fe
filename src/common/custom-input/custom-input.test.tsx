import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import CustomInput from './custom-input'

const baseProps = {
  name: 'test-input',
  placeholder: 'Enter value',
  value: '',
  onChange: vi.fn(),
}

describe('CustomInput', () => {
  it('renders placeholder text', () => {
    render(<CustomInput {...baseProps} placeholder="Type here" />)
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<CustomInput {...baseProps} value="hello" />)
    const input = screen.getByPlaceholderText('Enter value') as HTMLInputElement
    expect(input.value).toBe('hello')
  })

  it('calls onChange when typed into', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<CustomInput {...baseProps} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Enter value')
    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message when hasError is true', () => {
    render(
      <CustomInput
        {...baseProps}
        hasError
        errorMessage="This field is required"
      />,
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not show error message when hasError is false', () => {
    render(
      <CustomInput
        {...baseProps}
        hasError={false}
        errorMessage="This field is required"
      />,
    )
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('renders as disabled when disableField is true', () => {
    render(<CustomInput {...baseProps} disableField />)
    const input = screen.getByPlaceholderText('Enter value') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('renders placeholder when value is empty', () => {
    render(<CustomInput {...baseProps} value="" placeholder="Placeholder text" />)
    expect(screen.getByPlaceholderText('Placeholder text')).toBeInTheDocument()
  })
})
