import { Menu } from 'lucide-react';
import logoDark from '../../../assets/logo-dark-font.png';
import { HeaderSearch } from './HeaderSearch';

interface TopHeaderProps {
  onOpenNav: () => void;
}

/** Slim top bar inside the main column: mobile hamburger + brand line. */
export function TopHeader({ onOpenNav }: TopHeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-white px-4 text-foreground md:px-6"
      data-slot="top-header"
    >
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation menu"
        className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      {/* Mobile logo */}
      <img src={logoDark} alt="Logo" className="h-6 w-auto md:hidden" />

      {/* Brand line (desktop) */}
      <div className="hidden md:block">
        <p className="text-sm font-semibold leading-tight text-foreground">Ayurvedic Operations</p>
        <p className="text-xs leading-tight text-muted-foreground">
          Production-grade workflow console
        </p>
      </div>

      <div className="flex-1" />

      <HeaderSearch />
    </header>
  );
}
