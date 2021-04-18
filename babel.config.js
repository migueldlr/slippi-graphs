module.exports = function (api) {
  const isServer = api.caller(caller => caller && caller.isServer);
  const isCallerDevelopment = api.caller(caller => caller && caller.isDev);

  console.log(isServer);
  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          importSource:
            !isServer && api.env('development')
              ? '@welldone-software/why-did-you-render'
              : 'react',
        },
      },
    ],
  ];

  return { presets };
};
