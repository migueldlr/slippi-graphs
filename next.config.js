module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    if (!isServer) {
      config.resolve.alias = {
        fs: false,
        net: false,
        ws: false,
        dgram: false,
        ...config.resolve.alias,
      };
    }

    // Important: return the modified config
    return config;
  },
};
