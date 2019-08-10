module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  extends: [
    'airbnb',
  ],
  rules: {
    'jsx-a11y/click-events-have-key-events': 0, // Didn't quite understand this rule; enter key seems to work OK
    'react/jsx-filename-extension': [2, { 'extensions': ['.jsx', '.tsx'] }], // support tsx
    'import/prefer-default-export': 0, // I prefer named exports so never confusion
    'no-underscore-dangle': ['error', { 'allow': ['_env_', '__typename'] }], // allow underscore dangle only for specified
    'arrow-parens': ['error', 'as-needed'], // only require parens on arrow function if needed
    'react/prop-types': 0, // This is handled by typescript
    'import/no-unresolved': 0, // This is handled by typescript
    'no-unused-vars': 0, // use typescript alternative
    '@typescript-eslint/no-unused-vars': ['error', { 'varsIgnorePattern': '_.*' }], // using typescript alternative, allow unused vars if beginning with _
    'no-useless-constructor': 'off', // use typescript alternative
    '@typescript-eslint/no-useless-constructor': 'error', // using typescript alternative
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn' // Checks effect dependencies
  },
  env: {
    'browser': true,
  },
}
