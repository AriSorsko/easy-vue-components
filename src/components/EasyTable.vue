<template>
  <div id="container" :style="columnWidthsStyle">
    <!-- Headings -->
    <div
      v-for="column in columns"
      :key="column.header"
      class="headerCell"
      :class="generateHeaderClasses(column.property)"
    >
      {{ column.header }}
    </div>
    <!-- Data Rows -->
    <div v-for="column in columns" :key="column.property">
      <div
        v-for="(row, index) in rows"
        :key="index"
        class="dataCell"
        :class="column.property"
      >
        {{ row[column.property] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  display: grid;
}

.fixedHeader {
  position: sticky;
  top: 0;
  background-color: white;
}

.headerCell {
  font-weight: bold;
}
</style>

<script>
import camelCase from "lodash/camelCase";

export default {
  name: "EasyTable",
  props: {
    columns: Array,
    rows: Array,
    fixedHeader: {
      type: Boolean,
      default: false,
    },
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
  methods: {
    generateHeaderClasses(header) {
      let classes = header;
      classes += " " + camelCase("header " + header);
      if (this.fixedHeader) classes += " fixedHeader";
      return classes;
    },
  },
};
</script>
