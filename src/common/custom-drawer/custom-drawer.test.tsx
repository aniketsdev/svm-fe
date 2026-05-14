import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import CustomDrawer from './custom-drawer'

describe('CustomDrawer', () => {
  it('renders title and children when open', () => {
    render(
      <CustomDrawer anchor="right" open title="Test Drawer" onClose={vi.fn()}>
        <p>Drawer content</p>
      </CustomDrawer>,
    )
    expect(screen.getByText('Test Drawer')).toBeInTheDocument()
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('does not show content when open is false', () => {
    render(
      <CustomDrawer anchor="right" open={false} title="Test Drawer" onClose={vi.fn()}>
        <p>Hidden content</p>
      </CustomDrawer>,
    )
    // MUI Drawer with keepMounted keeps DOM but hides it
    expect(screen.queryByText('Hidden content')).not.toBeVisible()
  })

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    render(
      <CustomDrawer anchor="right" open title="Test Drawer" onClose={handleClose}>
        <p>Content</p>
      </CustomDrawer>,
    )
    // CloseOutlinedIcon is inside an IconButton; find it via role button near the title
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('does not render close button when title is not provided', () => {
    render(
      <CustomDrawer anchor="right" open onClose={vi.fn()}>
        <p>No title content</p>
      </CustomDrawer>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
