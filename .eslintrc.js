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
  "indent": ["error", "tab"],
  "indent": ["error", 2],
  "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 1}],
  "no-trailing-spaces": "error",
  "no-multi-spaces":"error",
  "no-unused-labels":"error",
  "no-useless-return":"error",
  "no-undef-init":"error",
  "linebreak-style":"error",
  "no-lonely-if":"error",
  "no-multiple-empty-lines":"error",
  "no-trailing-spaces":"error",
  "no-useless-rename":"error",
  "newline-after-var":"error",
  "max-len": ["error", { "code": 120 }],

}
};
