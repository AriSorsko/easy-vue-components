module.exports = {
  env: {
    browser: true,
    es6: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended",
  ],

  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },

  parserOptions: {
    ecmaVersion: 2018,
    parser: "babel-eslint",
    sourceType: "module",
  },

  plugins: ["vue"],

  rules: {},

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
