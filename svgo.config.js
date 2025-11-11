module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: {
            minify: true,
            preserve: [],
          },
          convertPathData: {
            floatPrecision: 2,
          },
        },
      },
    },
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'mergeStyles',
    'inlineStyles',
    'minifyStyles',
    'cleanupNumericValues',
    'removeUselessDefs',
    'convertColors',
    'sortDefsChildren',
  ],
};
