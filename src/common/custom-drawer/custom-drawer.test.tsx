import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomDrawer } from './custom-drawer';

describe('CustomDrawer', () => {
  (['left', 'right', 'top', 'bottom'] as const).forEach((anchor) => {
    it(`renders with anchor="${anchor}"`, () => {
      render(
        <CustomDrawer open anchor={anchor} title={`drawer-${anchor}`} onClose={() => {}}>
          <p>body</p>
        </CustomDrawer>,
      );
      expect(screen.getByText(`drawer-${anchor}`)).toBeInTheDocument();
      expect(screen.getByText('body')).toBeInTheDocument();
      const content = document.querySelector('[data-slot="content"]');
      expect(content).toHaveAttribute('data-anchor', anchor);
    });
  });

  it('fires onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CustomDrawer open anchor="right" title="t" onClose={onClose}>
        body
      </CustomDrawer>,
    );
    await user.click(screen.getByRole('button', { name: /close drawer/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render content when open is false', () => {
    render(
      <CustomDrawer open={false} anchor="right" title="t" onClose={() => {}}>
        body
      </CustomDrawer>,
    );
    expect(screen.queryByText('body')).not.toBeInTheDocument();
  });
});
