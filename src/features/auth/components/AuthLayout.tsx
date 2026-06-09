import type { ReactNode } from 'react';
import logoDarkFont from '../../../assets/logo-dark-font.png';

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}

/**
 * Split-screen auth shell:
 *   - Left half (md+ only): full-bleed marketing image.
 *   - Right half: logo at top-left, form vertically centered, max-width 520px.
 * Mobile (< md): image hidden, form takes the full viewport width.
 */
export function AuthLayout({ imageSrc, imageAlt, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen" data-slot="auth-layout">
      <aside
        data-slot="image"
        className="relative hidden overflow-hidden md:block md:w-1/2"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </aside>
      <section
        data-slot="form-pane"
        className="flex w-full flex-col bg-background px-6 py-8 sm:px-8 md:w-1/2 lg:px-16"
      >
        <img
          src={logoDarkFont}
          alt="Test"
          className="mb-4 h-14 w-auto self-start"
        />
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
