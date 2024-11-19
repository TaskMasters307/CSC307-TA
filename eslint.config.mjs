import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin' // TypeScript ESLint plugin
import pluginReact from 'eslint-plugin-react'
import pluginPrettier from 'eslint-plugin-prettier' // Prettier plugin

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],

        languageOptions: {
            globals: {
                ...globals.browser, // Browser globals (e.g., `window`)
                ...globals.es2021, // ES2021 features
                ...globals.jest, // Jest globals for testing
            },
        },

        plugins: {
            js: pluginJs,
            '@typescript-eslint': tseslint,
            react: pluginReact,
            prettier: pluginPrettier,
        },

        ignores: ['node_modules/', 'dist/', 'coverage/', '*.min.js'],

        settings: {
            react: {
                version: 'detect', // Automatically detect React version
            },
        },

        rules: {
            // JavaScript recommended rules
            ...pluginJs.configs.recommended.rules,

            // TypeScript recommended rules
            ...tseslint.configs.recommended.rules,

            // React recommended rules
            ...pluginReact.configs.flat.recommended.rules,

            // Prettier recommended rules
            ...pluginPrettier.configs.recommended.rules,

            // Custom React rules
            'react/prop-types': 'off', // Disable React prop-types rule
            'react/react-in-jsx-scope': 'off', // Disable rule requiring React in scope for JSX

            // Prettier integration rule
            'prettier/prettier': 'error',
        },
    },
]
