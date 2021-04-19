module.exports = function (api) {
  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          importSource: '@welldone-software/why-did-you-render',
        },
      },
    ],
  ];

  return { presets };
};
