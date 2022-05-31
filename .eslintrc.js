const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'))
);

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  plugins: [
    'compat',
    'import',
    'promise',
    'prettier',
  ],
  env: {
    jest: true,
    node: true,
  },
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 13, // ES2022
    requireConfigFile: false,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'arrow-body-style': [2, 'as-needed'],
    'brace-style': [2, '1tbs'],
    'class-methods-use-this': 0,
    'import/imports-first': 0,
    'import/no-dynamic-require': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,
    'import/no-webpack-loader-syntax': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        offsetTernaryExpressions: true,
      },
    ],
    'no-undef': 0,
    'import/newline-after-import': 2,
    'import/first': 2,
    'import/order': [
      2,
      {
        groups: [
          'external',
          'internal',
          'parent',
          'sibling',
          'builtin',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    'import/prefer-default-export': 0,
    'max-len': 0,
    'newline-per-chained-call': 0,
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'array-bracket-spacing': [2, 'never'],
    'comma-spacing': [2, { before: false, after: true }],
    'comma-style': [2, 'last'],
    'no-confusing-arrow': 0,
    'no-console': 1,
    'no-underscore-dangle': 0,
    'no-use-before-define': 0,
    'prefer-template': 2,
    'require-yield': 0,
    'operator-assignment': [2, 'always'],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    '@typescript-eslint/no-explicit-any': 0,
    'no-restricted-exports': 0,
    '@typescript-eslint/ban-types': [
      'error',
      {
        'extendDefaults': true,
        'types': {
          '{}': false
        }
      }
    ],
    '@typescript-eslint/no-useless-constructor': 0,
  },
  ignorePatterns: ['.eslintrc.js']
};
