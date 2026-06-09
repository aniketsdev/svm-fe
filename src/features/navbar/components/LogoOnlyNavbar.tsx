import logoDark from '../../../assets/logo-dark-font.png';
import { NAVBAR_HEIGHT } from '../constants';

export function LogoOnlyNavbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center border-b border-border bg-white px-2 md:px-4"
      style={{ height: NAVBAR_HEIGHT }}
      data-slot="logo-only-navbar"
    >
      <img
        src={logoDark}
        alt="Test"
        className="h-8 w-auto shrink-0"
      />
    </header>
  );
}
