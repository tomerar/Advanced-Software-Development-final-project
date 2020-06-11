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
    "no-unused-vars": ["error", { "vars": "local"}],
    "indent": ["error", "tab"],
    "indent": ["error", 2],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 1}],
    "no-trailing-spaces": "error"
}
};
