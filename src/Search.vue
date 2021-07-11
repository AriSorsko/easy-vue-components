<template>
  <div id="searchContainer" class="searchContainer">
    <font-awesome-icon
      icon="search"
      ref="search"
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
  },
  computed: {
    tableSearch: {
      get() {
        return this.searchTerm;
      },
      set(newSearchTerm) {
        this.$emit("update:searchTerm", newSearchTerm);
      },
    },
  },
};
</script>
