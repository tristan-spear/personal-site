import js from '@eslint/js'
import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'
import { defineConfig, globalIgnores } from 'eslint/config'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

export default defineConfig([
  globalIgnores(['.next', 'node_modules']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,mjs}'],
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      // Apostrophes in page copy are intentional and render correctly.
      'react/no-unescaped-entities': 'off',
    },
  },
])
