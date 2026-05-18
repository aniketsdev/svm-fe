import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    'coverage',
    // Generated SDK (Orval) — only `src/sdk/mutator.ts` is hand-written and
    // it's small enough to spot-review. Linting auto-generated output is more
    // pain than signal; regenerating to satisfy a lint rule is the wrong gate.
    'src/sdk/**/*.ts',
    '!src/sdk/mutator.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Constitution Principle I + II: no MUI / Emotion runtime in feature code.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@mui/*', '@mui/material', '@mui/icons-material', '@mui/system'],
              message:
                'MUI runtime is forbidden under the project constitution (Principle I). Use components from svm-fe/src/common/ styled with Tailwind.',
            },
            {
              group: ['@emotion/*'],
              message:
                'CSS-in-JS via Emotion is forbidden under the project constitution (Principle II). Use Tailwind utilities.',
            },
          ],
        },
      ],
    },
  },
]);
