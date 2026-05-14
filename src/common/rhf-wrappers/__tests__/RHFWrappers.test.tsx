import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { RHFInput } from '../RHFInput'
import { RHFCheckbox } from '../RHFCheckbox'

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface TestInputFormValues {
  username: string
}

function RHFInputFixture({
  defaultValues = { username: '' },
  placeholder = 'Enter username',
}: {
  defaultValues?: TestInputFormValues
  placeholder?: string
}) {
  const { control } = useForm<TestInputFormValues>({ defaultValues })
  return (
    <RHFInput
      name="username"
      control={control}
      placeholder={placeholder}
    />
  )
}

interface TestCheckboxFormValues {
  agreed: boolean
}

function RHFCheckboxFixture({
  defaultValues = { agreed: false },
  label,
}: {
  defaultValues?: TestCheckboxFormValues
  label?: string
}) {
  const { control } = useForm<TestCheckboxFormValues>({ defaultValues })
  return (
    <RHFCheckbox
      name="agreed"
      control={control}
      label={label}
    />
  )
}

// ─── RHFInput ────────────────────────────────────────────────────────────────

describe('RHFInput', () => {
  it('renders the input with the given placeholder', () => {
    render(<RHFInputFixture placeholder="Type here" />)
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
  })

  it('displays the default value from the form', () => {
    render(
      <RHFInputFixture
        defaultValues={{ username: 'john_doe' }}
        placeholder="Enter username"
      />,
    )
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement
    expect(input.value).toBe('john_doe')
  })

  it('renders an empty input when default value is empty string', () => {
    render(<RHFInputFixture defaultValues={{ username: '' }} />)
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement
    expect(input.value).toBe('')
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    render(<RHFInputFixture />)
    const input = screen.getByPlaceholderText('Enter username')
    await user.type(input, 'hello')
    expect((input as HTMLInputElement).value).toBe('hello')
  })

  it('does not show an error message when there is no error', () => {
    render(<RHFInputFixture />)
    // The CustomInput always renders an error Typography; it just stays empty
    const errorElements = screen.queryAllByText(/.+/)
    // No non-empty text node that looks like a validation error
    const visibleErrors = errorElements.filter(
      (el) => el.tagName !== 'INPUT' && el.textContent?.trim(),
    )
    expect(visibleErrors.length).toBe(0)
  })
})

// ─── RHFCheckbox ─────────────────────────────────────────────────────────────

describe('RHFCheckbox', () => {
  it('renders the checkbox with a label', () => {
    render(<RHFCheckboxFixture label="I agree" />)
    expect(screen.getByText('I agree')).toBeInTheDocument()
  })

  it('starts unchecked when default value is false', () => {
    render(<RHFCheckboxFixture label="Accept" defaultValues={{ agreed: false }} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('starts checked when default value is true', () => {
    render(<RHFCheckboxFixture label="Accept" defaultValues={{ agreed: true }} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles checked state when clicked', async () => {
    const user = userEvent.setup()
    render(<RHFCheckboxFixture label="Accept" defaultValues={{ agreed: false }} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('renders without a label when label prop is omitted', () => {
    render(<RHFCheckboxFixture />)
    // A checkbox element should still render
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
})

// ─── RHFInput — onChange wired to form state ─────────────────────────────────

describe('RHFInput form state integration', () => {
  it('calls the controller onChange when the user types', async () => {
    const user = userEvent.setup()
    function SpyInputFixture() {
      const { control, watch } = useForm<{ query: string }>({
        defaultValues: { query: '' },
      })
      // Watch so the component re-renders on change
      const _val = watch('query')
      void _val
      return (
        <RHFInput
          name="query"
          control={control}
          placeholder="Search"
        />
      )
    }

    render(<SpyInputFixture />)
    const input = screen.getByPlaceholderText('Search')
    await user.type(input, 'abc')
    // The input value should reflect what was typed
    expect((input as HTMLInputElement).value).toBe('abc')
  })
})
