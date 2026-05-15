import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Quarantined paths (will be migrated in feature 003):
  //   - src/features/navbar/** — full navbar feature still on MUI.
  //   - src/theme/components.ts / index.ts — MUI Theme objects, deleted in feature 003.
  globalIgnores([
    'dist',
    'node_modules',
    'coverage',
    'src/features/navbar/**',
    'src/theme/components.ts',
    'src/theme/index.ts',
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
