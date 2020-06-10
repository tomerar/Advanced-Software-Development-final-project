module.exports = {
    parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {
      configFile: "path/to/config.js",
    },
  },
  //"extends": "jquery",
  "rules": {
    "no-unused-vars": ["error", { "vars": "local"}]
}
};
