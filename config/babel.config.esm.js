const presets = [
  ['@babel/preset-typescript'],
  [
    '@babel/preset-env',
    {
      modules: false,
      bugfixes: true,
    },
  ],
];

const plugins = [
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
  '@babel/plugin-syntax-dynamic-import',
];

module.exports = { plugins, presets };
