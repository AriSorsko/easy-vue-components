<template>
  <div>
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
.searchInput {
  display: block;
}
</style>

<script>
export default {
  name: "Search",
  data() {
    return {
      tableSearch: "",
    };
  },
};
</script>
