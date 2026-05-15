import logoLight from '../../../assets/logo-light-font.svg';
import { NAVBAR_HEIGHT } from '../constants';

export function LogoOnlyNavbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center bg-primary-08 px-2 md:px-4"
      style={{ height: NAVBAR_HEIGHT }}
      data-slot="logo-only-navbar"
    >
      <img
        src={logoLight}
        alt="Test"
        className="h-8 w-auto shrink-0"
      />
    </header>
  );
}
