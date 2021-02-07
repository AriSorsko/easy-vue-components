<template>
  <div>
    <div id="container" :style="columnWidthsStyle" ref="container">
      <!-- Headings -->
      <div
        v-for="(column, index) in columns"
        :key="column.header"
        class="headerCell"
        :class="generateHeaderClasses(column.property)"
        :ref="'headerCell_' + index"
      >
        {{ column.header }}
      </div>
      <!-- Data Rows -->
      <div v-if="!rows || rows.length === 0" id="noDataMessage">
        There is no data for this table.
      </div>
      <div v-else v-for="(column, cindex) in columns" :key="column.property">
        <div
          v-for="(row, rindex) in rows"
          :key="rindex"
          class="dataCell"
          :class="column.property"
          :ref="'rowCell_' + rindex + '_' + cindex"
        >
          {{ row[column.property] }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  display: grid;
}

#noDataMessage {
  grid-column: 1/-1;
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
