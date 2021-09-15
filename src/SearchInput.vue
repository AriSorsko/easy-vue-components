<template>
  <div>
    <div id="searchContainer" class="searchContainer">
      <font-awesome-icon
        icon="search"
        ref="searchIcon"
        class="searchIcon"
        id="searchIcon"
      />
      <input
        v-model="tableSearch"
        placeholder="Search"
        class="searchInput"
        id="searchInput"
        ref="searchInput"
      />
    </div>
  </div>
</template>

<style scoped>
.searchContainer {
  display: flex;
  border: 1px solid grey;
  border-radius: 3px;
  padding: 4px;
  width: 188px;
  background-color: transparent;
  margin: 10px 0;
}
.searchIcon {
  padding-left: 4px;
  padding-right: 4px;
}
.searchInput {
  display: block;
  border: none;
  background-color: transparent;
}
.searchInput:focus {
  outline: none;
  background-color: transparent;
}
</style>

<script>
import Mark from "mark.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faSearch);

export default {
  name: "Search",
  components: { FontAwesomeIcon },
  props: {
    searchTerm: {
      type: String,
      default: "",
    },
    highlightQuerySelector: String,
    highlightOptions: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      ignoreDomUpdates: false,
    };
  },
  computed: {
    tableSearch: {
      get() {
        return this.searchTerm;
      },
      set(newSearchTerm) {
        this.$emit("update:searchTerm", newSearchTerm);
        this.updateHighlighting();
      },
    },
    markJSInstance() {
      if (this.highlightQuerySelector) {
        const element = document.querySelector(this.highlightQuerySelector);
        if (element) {
          // Vue's props down/events up doesn't work real well when the parent
          // component changes the DOM that needs to be marked, either the parent
          // needs to use the $refs "hack" to manually update the highlighting which
          // is fragile or it needs to use props, which are data, to pass what is
          // fundamentally an event to the search, which is both confusing and fragile.
          // Instead use pure javascript to watch the DOM element that is being
          // highlighted and call it a day.
          const config = { attributes: true, childList: true, subtree: true };
          const observer = new MutationObserver(this.updateHighlighting);
          observer.observe(element, config);

          return new Mark(element);
        } else {
          console.warn(
            "highlightQuerySelector: ",
            this.highlightQuerySelector,
            " did not match any elements"
          );
          return null;
        }
      }
      return null;
    },
  },
  methods: {
    updateHighlighting() {
      if (this.markJSInstance && !this.ignoreDomUpdates) {
        this.ignoreDomUpdates = true;
        this.markJSInstance.unmark();
        this.$nextTick(() => {
          this.markJSInstance.mark(this.searchTerm, this.highlightOptions);
          this.$nextTick(() => {
            this.ignoreDomUpdates = false;
          });
        });
      }
    },
  },
};
</script>
