module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      '@csstools/postcss-global-data',
      {
        files: [
          'node_modules://@hashicorp/mktg-global-styles/custom-media.css',
        ],
      },
    ],
    [
      'postcss-preset-env',
      {
        stage: 3,
        browsers: ['defaults'],
        autoprefixer: { flexbox: 'no-2009' },
        features: {
          'nesting-rules': true,
          'custom-media-queries': true,
          'custom-properties': false,
        },
      },
    ],
    ['postcss-normalize', { browsers: 'defaults' }],
  ],
}
