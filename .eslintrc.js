module.exports = {
  env: { es6: true, node: true },
  extends: ['eslint:recommended', 'google'],
  rules: { quotes: ['error', 'single'], 'require-jsdoc': 0 },
  parserOptions: { ecmaVersion: 2020 }
};