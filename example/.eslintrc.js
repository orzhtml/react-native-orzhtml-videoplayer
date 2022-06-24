module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-native',
    'react-hooks',
    '@typescript-eslint',
  ],
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
  rules: {
    'no-unused-vars': 0,
    'no-console': 0, // 不禁用console
    indent: [1, 2, { SwitchCase: 1 }],
    eqeqeq: 1,
    'prefer-const': 0,
    'handle-callback-err': 0,
    'no-return-assign': 0,
    'no-mixed-spaces-and-tabs': 0,
    'node/no-deprecated-api': 0,
    'react/no-deprecated': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/no-string-refs': 0,
    'no-delete-var': 2, // 不能对var声明的变量使用delete操作符
    'no-const-assign': 2, // 禁止修改const声明的变量
    'react/no-did-mount-set-state': 0, // 防止在componentDidMount中使用setState
    'react/no-did-update-set-state': 1, // 防止在componentDidUpdate中使用setState
    'react/no-direct-mutation-state': 2, // 防止this.state的直接变异
    'react/no-set-state': 0, // 防止使用setState
    'react/forbid-prop-types': [2, { forbid: ['any'] }], // 禁止某些propTypes
    'array-callback-return': 0,
    'no-use-before-define': 0,
    // warn
    'import/first': 'warn', // import 放在文件头
    'spaced-comment': 'warn', // 注释要含有空格
    camelcase: 'warn', // 驼峰命名
    'react-hooks/exhaustive-deps': 0,
    'comma-dangle': ['error', 'always-multiline'],
  },
  globals: {
    __DEV__: true,
    __dirname: false,
    GLOBAL: true,
    fetch: true,
  },
  settings: {
    react: {
        version: '18.0.14'
    }
  }
};
