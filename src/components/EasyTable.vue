<template>
  <div>
    <div id="container" :style="columnWidthsStyle" ref="container">
      <!-- Headings -->
      <div
        v-for="(column, index) in columns"
        :key="column.header"
        class="headerCell"
        :class="generateHeaderClasses(column.property, index)"
        :ref="'headerCell_' + index"
      >
        {{ column.header }}
      </div>
      <!-- Data Rows -->
      <div v-if="!rows || rows.length === 0" id="noDataMessage">
        There is no data for this table.
      </div>
      <div
        v-else
        v-for="(row, rindex) in rows"
        :key="rindex"
        class="collapseDivs"
      >
        <div
          v-for="(column, cindex) in columns"
          :key="column.property + cindex"
          :class="generateCellClasses(column, cindex, rindex)"
          :ref="'rowCell_' + rindex + '_' + cindex"
        >
          <slot :name="column.property" v-bind="row">
            {{ row[column.property] }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Here be magic. This tells browsers to treat this:
    <div> <--- row div
      <div>cell</div>
      <div>cell</div>
      <div>cell</div>
    </div> <--- end row div
    like it is this:
    <div>cell</div>
    <div>cell</div>
    <div>cell</div>
    Which in this context means all of the rows line up!
*/
.collapseDivs {
  display: contents;
}

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
    generateHeaderClasses(header, index) {
      let classes = header;
      classes += " " + camelCase("header " + header);
      classes += index % 2 === 0 ? " evenColumn" : " oddColumn";
      if (this.fixedHeader) classes += " fixedHeader";
      return classes;
    },
    generateCellClasses(column, cindex, rindex) {
      let classes = "row ";
      classes += column.property;
      classes += cindex % 2 === 0 ? " evenColumn" : " oddColumn";
      classes += rindex % 2 === 0 ? " evenRow" : " oddRow";
      return classes;
    },
  },
};
</script>
