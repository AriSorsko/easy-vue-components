// Import vue component
import EasyTable from "./EasyTable.vue";

// Declare install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("EasyTable", EasyTable);
}

// Create module definition for Vue.use()
const plugin = {
  install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  // In this case find vue in the global browser's scope instead of here
  // eslint-disable-next-line no-undef
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export EasyTable
export default EasyTable;
