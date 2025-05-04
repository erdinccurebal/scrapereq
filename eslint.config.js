import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Global variables for Node.js and Jest
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    rules: {
      semi: ['error', 'always'], // Require semicolons
      quotes: ['error', 'single'], // Use single quotes
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allow parameters starting with underscore
          varsIgnorePattern: '^_', // Allow variables starting with underscore
          caughtErrorsIgnorePattern: '^_' // Allow exceptions starting with underscore
        }
      ],
      'no-console': 'off', // Allow console usage
      'no-var': 'error', // Prefer let/const over var
      'prefer-const': 'error', // Use const for variables that are never reassigned
      eqeqeq: ['error', 'always'], // Require === and !== instead of == and !=
      'object-curly-spacing': ['error', 'always'] // Enforce spacing inside curly braces
    },
    ignores: ['node_modules/**', 'dist/**', 'tmp/**'] // Also ignore tmp directory
  },
  // Add eslint-config-prettier to disable ESLint rules that conflict with Prettier
  eslintConfigPrettier
];
