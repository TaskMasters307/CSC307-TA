import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import pluginReact from 'eslint-plugin-react'

export default [
    {
        files: ['**/*.{js,jsx}'], // Match JavaScript and JSX files
        languageOptions: {
            parser: tsParser, // Use TypeScript parser (also works for plain JS)
            parserOptions: {
                ecmaVersion: 2021, // Modern ECMAScript features
                sourceType: 'module', // Enable ES modules
                ecmaFeatures: {
                    jsx: true, // Enable JSX syntax
                },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: pluginReact,
        },
        settings: {
            react: {
                version: 'detect', // Auto-detect React version
            },
        },
        rules: {
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 'off', // Not needed for React 17+
            'no-unused-vars': 'off',
        },
    },
]
