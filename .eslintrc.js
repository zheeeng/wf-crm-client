module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  env: {
    es6: true,
    node: true,
    browser: true,
    jasmine: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/array-type': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/indent': ['off'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/prefer-interface': ['off'],
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-empty-interface': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': ['off'],
    'react/display-name': ['off'],
    'comma-dangle': ['error', 'always-multiline'],
    'quote-props': ['error', 'as-needed'],
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
  },
}
