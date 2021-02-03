<template>
  <div id="container" :style="columnWidthsStyle">
    <!-- Headings -->
    <div v-for="column in columns" :key="column.header">
      {{ column.header }}
    </div>
    <!-- Data Rows -->
    <div v-for="column in columns" :key="column.property">
      <div v-for="(row, index) in rows" :key="index">
        {{ row[column.property] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  display: grid;
}

.headerCell {
  display: flex;
}
</style>

<script>
export default {
  name: "EasyTable",
  props: {
    columns: Array,
    rows: Array,
  },
  computed: {
    columnWidthsStyle() {
      let columnsWidths = "grid-template-columns:";
      this.columns.forEach((column) => {
        if (column.width) columnsWidths += ` ${column.width}`;
        else columnsWidths += " auto";
      });
      return columnsWidths;
    },
  },
};
</script>
