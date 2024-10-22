import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Import TypeScript ESLint plugin
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier"; // Import Prettier plugin

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  
  { languageOptions: { 
      globals: {
        ...globals.browser,  // Browser globals (like 'window')
        ...globals.es2021,   // ES2021 features
        ...globals.jest      // Jest globals for testing
      }
  }},

  pluginJs.configs.recommended,        // JavaScript recommended rules
  ...tseslint.configs.recommended,     // TypeScript recommended rules
  pluginReact.configs.flat.recommended, // React recommended rules

  pluginPrettier.configs.recommended, // Prettier recommended configuration

  {
    rules: {
      // Disable React prop-types rule
      "react/prop-types": "off",

      // Disable the rule requiring React in scope for JSX
      "react/react-in-jsx-scope": "off",

      // Prettier integration rule (already in pluginPrettier.configs.recommended)
      "prettier/prettier": "error"
    }
  }
];
