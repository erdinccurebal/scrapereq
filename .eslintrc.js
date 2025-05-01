module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    semi: ['error', 'never'], // No semicolons
    quotes: ['error', 'single'], // Single quotes
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }], // Allow unused variables starting with underscore
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}