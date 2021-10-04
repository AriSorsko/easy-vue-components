import commonjs from "@rollup/plugin-commonjs"; // Convert CommonJS modules to ES6
import vue from "rollup-plugin-vue"; // Handle .vue SFC files
import buble from "@rollup/plugin-buble"; // Transpile/polyfill with reasonable browser support
export default [
  // ESM build to be used with webpack/rollup.
  {
    input: "src/index.js",
    output: {
      format: "esm",
      file: "dist/EasyTable.esm.js",
    },
    plugins: [commonjs(), vue(), buble()],
    external: [
      "lodash",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/fontawesome-svg-core",
    ],
  },
  // SSR build.
  {
    input: "src/index.js",
    output: {
      format: "cjs",
      file: "dist/EasyTable.ssr.js",
    },
    plugins: [commonjs(), vue({ template: { optimizeSSR: true } }), buble()],
    external: [
      "lodash",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/fontawesome-svg-core",
    ],
  },
  // Browser build.
  {
    input: "src/wrapper.js",
    output: {
      format: "iife",
      file: "dist/EasyTable.js",
      name: "EasyTable",
      globals: {
        lodash: "lodash",
        "@fortawesome/fontawesome-svg-core": "fontawesomeSvgCore",
        "@fortawesome/free-solid-svg-icons": "freeSolidSvgIcons",
        "@fortawesome/vue-fontawesome": "@fortawesome/vue-fontawesome",
      },
    },
    plugins: [commonjs(), vue(), buble()],
    external: [
      "lodash",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/fontawesome-svg-core",
    ],
  },
  {
    input: "src/wrapper.js",
    output: {
      format: "umd",
      file: "dist/EasyTable.umd.js",
      name: "EasyTable",
      globals: {
        lodash: "lodash",
        "@fortawesome/fontawesome-svg-core": "fontawesomeSvgCore",
        "@fortawesome/free-solid-svg-icons": "freeSolidSvgIcons",
        "@fortawesome/vue-fontawesome": "@fortawesome/vue-fontawesome",
      },
    },
    plugins: [commonjs(), vue(), buble()],
    external: [
      "lodash",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/fontawesome-svg-core",
    ],
  },
];
