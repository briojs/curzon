import brioJSConfig from 'eslint-config-briojs';

export default brioJSConfig({
  rules: {
    'unicorn/no-static-only-class': 'off',
    'unicorn/prefer-spread': 'off',
  },
});
