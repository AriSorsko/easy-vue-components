<template>
  <div>
    <div id="container" :style="columnWidthsStyle" ref="container">
      <!-- Headings -->
      <!-- Empty div to keep the headers lined up with their columns when there are radio buttons  -->
      <div v-if="enableAccordianforDetailRow" />
      <!-- Empty div to keep the headers lined up with their columns when there are radio buttons  -->
      <div v-if="enableRadioButtons" />
      <!-- Empty div to keep the headers lined up with their columns when there are check boxes  -->
      <div v-if="enableCheckBoxes" />
      <!-- TODO: have checkbox here that toggles all of the boxes -->
      <div
        v-for="(column, index) in columns"
        :key="column.header"
        class="headerCell"
        :class="generateHeaderClasses(column.property, index)"
        :ref="'headerCell_' + index"
      >
        {{ column.header }}
        <span v-if="column.sortable || column.initialSort">
          <font-awesome-icon
            icon="arrow-down"
            v-if="columnSortDirection[column.property] === 'asc'"
            @click="reverseSort(column.property)"
            :ref="'arrowDown_' + index"
          />
          <font-awesome-icon
            icon="arrow-up"
            v-else
            @click="reverseSort(column.property)"
            :ref="'arrowUp_' + index"
          />
        </span>
      </div>
      <!-- Data Rows -->
      <div v-if="!sortedRows || sortedRows.length === 0" id="noDataMessage">
        There is no data for this table.
      </div>
      <div
        v-else
        v-for="(row, rindex) in sortedRows"
        :key="rindex"
        class="collapseDivs"
      >
        <!-- Expand/Collapse controls for the details row -->
        <div v-if="enableAccordianforDetailRow">
          <div v-if="openDetailRows.includes(row)" @click="collapseRow(row)">
            <slot name="expandedDetailRowIcon" v-bind="row">
              <font-awesome-icon
                icon="angle-down"
                :ref="'angleDown_' + rindex"
              />
            </slot>
          </div>
          <div v-else @click="expandRow(row)">
            <slot name="collapsedDetailRowIcon" v-bind="row">
              <font-awesome-icon
                icon="angle-right"
                :ref="'angleRight_' + rindex"
              />
            </slot>
          </div>
        </div>
        <input
          v-if="enableRadioButtons"
          type="radio"
          :id="rindex"
          :value="row"
          v-model="internalSelectedItem"
          :ref="'radio_' + rindex"
        />
        <input
          v-if="enableCheckBoxes"
          type="checkbox"
          :id="rindex"
          :value="row"
          v-model="internalSelectedItems"
          :ref="'check_' + rindex"
        />
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

        <div
          class="detailRowSlot"
          :key="JSON.stringify(row)"
          v-if="!enableAccordianforDetailRow || openDetailRows.includes(row)"
        >
          <slot name="detailRowSlot" v-bind="row" />
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

.detailRowSlot {
  grid-column: 1/-1;
}
</style>

<script>
import camelCase from "lodash/camelCase";
import sortBy from "lodash/sortBy";
import cloneDeep from "lodash/cloneDeep";
import reverse from "lodash/reverse";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUp,
  faArrowDown,
  faAngleDown,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowUp);
library.add(faArrowDown);
library.add(faAngleDown);
library.add(faAngleRight);

export default {
  name: "EasyTable",
  components: { FontAwesomeIcon },
  props: {
    columns: Array,
    rows: Array,
    fixedHeader: {
      type: Boolean,
      default: false,
    },
    enableRadioButtons: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: null,
    },
    enableCheckBoxes: {
      type: Boolean,
      default: false,
    },
    selectedItems: {
      type: Array,
      default: null,
    },
    enableAccordianforDetailRow: {
      type: String, // Can be single or multi
      default: null,
    },
  },
  data() {
    return {
      sortedRows: [],
      columnSortDirection: {},
      internalSelectedItem: null,
      internalSelectedItems: [],
      openDetailRows: [],
    };
  },
  created() {
    // Error checking
    if (!this.columns) {
      console.error("columns is a required prop to easy table");
      return;
    }
    if (!Array.isArray(this.columns)) {
      console.error(
        "'columns' prop must be an array, not",
        typeof this.columns
      );
      return;
    }
    if (this.columns.length === 0) {
      console.warn("'columns' array is empty, no table data will be displayed");
      return;
    }
    if (this.columns.find((c) => !c.property)) {
      console.error("'property' is a required field on all columns");
      return;
    }
    if (this.columns.find((c) => typeof c.property !== "string")) {
      console.error("The 'property' field on all columns must be a string");
      return;
    }
    if (!this.enableRadioButtons && this.selectedItem) {
      console.warn(
        "The 'selectedItem' prop is only used with when radio buttons are enabled"
      );
    }
    if (!this.enableCheckBoxes && this.selectedItems) {
      console.warn(
        "The 'selectedItems' prop is only used with when check boxes are enabled"
      );
    }

    if (
      this.enableAccordianforDetailRow &&
      this.enableAccordianforDetailRow !== "single" &&
      this.enableAccordianforDetailRow !== "multi"
    ) {
      console.warn(
        "The 'enableAccordianforDetailRow' prop should be 'single' or 'multi', not ",
        this.enableAccordianforDetailRow
      );
    }

    // Handle sorting setup
    if (this.rows) {
      const initialSortColumns = this.columns.filter((c) => c.initialSort);
      const sortableColumns = this.columns.filter((c) => c.sortable);
      let initialSortColumn;
      if (initialSortColumns.length > 0) {
        if (initialSortColumns.length > 1) {
          const columnNames = initialSortColumns.map((c) => c.header);
          console.warn(
            `There are multiple initialSortColumns, please choose 1 column to initially sort by.
            The current initial sort columns are: ` + columnNames.join(", ")
          );
        }
        initialSortColumn = initialSortColumns[0];
      } else {
        if (sortableColumns.length > 0) initialSortColumn = sortableColumns[0];
      }

      this.sortedRows = cloneDeep(this.rows);

      let sortingProperties = initialSortColumn
        ? [initialSortColumn.property]
        : [];
      const sortableColumnProperties = sortableColumns.map((c) => c.property);
      sortingProperties = sortingProperties.concat(sortableColumnProperties);
      this.sortedRows = sortBy(this.sortedRows, sortingProperties);

      sortingProperties.forEach((sortableColumnPropery) => {
        this.columnSortDirection[sortableColumnPropery] = "asc";
      });
    }

    // Handle radio buttons setup
    if (this.selectedItem) {
      if (this.rows.includes(this.selectedItem))
        this.internalSelectedItem = this.selectedItem;
      else
        console.warn(
          "The selected item is not one of the row items!",
          this.selectedItem
        );
    }

    // Handle checkboxes setup
    if (this.selectedItems) {
      const selectedItemsNotInRows = this.selectedItems.filter(
        (i) => !this.rows.includes(i)
      );

      const filteredSelected = this.selectedItems.filter(
        (i) => !selectedItemsNotInRows.includes(i)
      );
      this.internalSelectedItems = this.internalSelectedItems.concat(
        filteredSelected
      );
      if (selectedItemsNotInRows.length !== 0)
        console.warn(
          "The following selected items are not one of the row items!",
          selectedItemsNotInRows
        );
    }

    // Handle details row accordian control setup
  },
  watch: {
    internalSelectedItem() {
      this.$emit("update:selectedItem", this.internalSelectedItem);
    },
    internalSelectedItems() {
      this.$emit("update:selectedItems", this.internalSelectedItems);
    },
  },
  computed: {
    columnWidthsStyle() {
      if (Array.isArray(this.columns)) {
        let columnsWidths = "grid-template-columns:";
        if (this.enableRadioButtons) {
          columnsWidths += " 2em";
        }
        if (this.enableCheckBoxes) {
          columnsWidths += " 2em";
        }
        if (
          this.enableAccordianforDetailRow === "single" ||
          this.enableAccordianforDetailRow === "multi"
        ) {
          columnsWidths += " 2em";
        }

        this.columns.forEach((column) => {
          if (column.width) columnsWidths += ` ${column.width}`;
          else columnsWidths += " auto";
        });
        return columnsWidths;
      } else {
        return "";
      }
    },
  },
  methods: {
    collapseRow(row) {
      this.openDetailRows = this.openDetailRows.filter((r) => r !== row);
    },
    expandRow(row) {
      if (this.enableAccordianforDetailRow === "single")
        this.openDetailRows = [];
      this.openDetailRows.push(row);
    },
    reverseSort(columnProperty) {
      this.sortedRows = sortBy(this.sortedRows, [columnProperty]);
      if (this.columnSortDirection[columnProperty] === "asc") {
        this.columnSortDirection[columnProperty] = "desc";
        this.sortedRows = reverse(this.sortedRows);
      } else this.columnSortDirection[columnProperty] = "asc";
    },
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
