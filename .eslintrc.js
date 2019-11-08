module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'standard',
    'standard-react',
    'prettier/react',
    'plugin:prettier/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', 'react-hooks', 'import', 'promise', 'jest'],
  rules: {
    'react/prop-types': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-unresolved': [
      'error',
      { ignore: ['^react(-dom)?$', '^styled-components$'] },
    ],
    'promise/no-nesting': ['off'],
    'valid-jsdoc': 'error',
    'linebreak-style': ['error', 'unix'],
    curly: 'error',
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.6',
    },
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: { jest: true },
    },
  ],
}
