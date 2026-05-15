# svm-fe

Frontend for the SVM project. React 19 + TypeScript + Vite + Tailwind CSS 4.

## Quick links

- **Component library quickstart**:
  [`specs/001-mui-to-tailwind-migration/quickstart.md`](../specs/001-mui-to-tailwind-migration/quickstart.md)
  — how to use the components in `src/common/`, the canonical Zod + RHF form
  pattern, TanStack Query wiring, toast usage, and the dev-only component
  library page at `#__component-library`.
- **Component contracts (Props APIs)**:
  [`specs/001-mui-to-tailwind-migration/contracts/`](../specs/001-mui-to-tailwind-migration/contracts/)
- **Project constitution**:
  [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)
  — the five frontend principles (custom components, Tailwind-only, Zod+RHF
  type-safe forms, project-structure discipline, mobile-first responsive).

## Common scripts

```bash
bun dev          # start the Vite dev server
bun run build    # type-check + production build
bun run test     # run the Vitest suite once
bun run test:watch  # watch mode
bun run lint     # ESLint (bans @mui/* and @emotion/* imports)
```

## Open the component library

```bash
bun dev
# then visit:
http://localhost:5173/#__component-library
```

The route only exists when `import.meta.env.DEV` is true; production builds
never expose it.

## Project structure

```text
src/
├── common/         # The migrated component library (25 components + 15 RHF wrappers).
├── lib/            # Shared helpers (cn, query-client).
├── pages/
│   └── __component-library/   # Dev-only component library demo page.
├── App.tsx
├── main.tsx
└── index.css       # @import "tailwindcss" + @theme design tokens.
```

---

(Vite template documentation removed — see the Vite + Tailwind v4 docs for
upstream details. The project is fully wired and ready to use; no extra
configuration is required to add components.)
