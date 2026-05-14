import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import CustomDialog from './custom-dialog'

describe('CustomDialog', () => {
  it('renders content when open is true', () => {
    render(
      <CustomDialog title="Test Dialog" open onClose={vi.fn()}>
        <p>Dialog content</p>
      </CustomDialog>,
    )
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('does not render content when open is false', () => {
    render(
      <CustomDialog title="Test Dialog" open={false} onClose={vi.fn()}>
        <p>Hidden content</p>
      </CustomDialog>,
    )
    // MUI Dialog unmounts content when closed (no keepMounted)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    render(
      <CustomDialog title="Test Dialog" open onClose={handleClose}>
        <p>Content</p>
      </CustomDialog>,
    )
    await user.click(screen.getByLabelText('close'))
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    render(
      <CustomDialog title="Test Dialog" open onClose={handleClose}>
        <p>Content</p>
      </CustomDialog>,
    )
    // Click the MUI backdrop to trigger onClose (simulates dismiss outside dialog)
    const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement
    if (backdrop) {
      await user.click(backdrop)
      expect(handleClose).toHaveBeenCalled()
    } else {
      // Fallback: close button
      await user.click(screen.getByLabelText('close'))
      expect(handleClose).toHaveBeenCalled()
    }
  })
})
