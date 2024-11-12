import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'node_modules/',      
      'dist/',               
      '**/*.min.js',         
      'public/**',
      '.eslintrc.cjs',
      'eslint.config.js',
      'vite.config.js'           
    ],
    files: ["**/*.js"], 
    languageOptions: {sourceType: "module"}
  },
  {languageOptions: { globals: globals.browser }},
];