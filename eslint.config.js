import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // Ignores globais: build, dependências e assets estáticos não devem ser lintados.
  // index-*.js na raiz é bundle minificado do Vite (build output solto), não fonte.
  { ignores: ['dist/**', 'node_modules/**', 'public/**', 'index-*.js'] },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Blindagem: deps de hooks fora de sincronia são bugs, não avisos
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    // Arquivos Node (build/server): globals do Node, não do browser
    files: ['**/*.cjs', 'server.cjs', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
