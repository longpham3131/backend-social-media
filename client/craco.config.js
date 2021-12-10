const CracoLessPlugin = require("craco-less");
module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#57d9a7",
              "@primary-color-hover": "#1DA57A",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
