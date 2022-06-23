module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  globals: {
    __DEV__: true,
    __dirname: false,
    GLOBAL: true,
    fetch: true,
  },
  settings: {
    react: {
        version: '17.0.2'
    }
  }
};
