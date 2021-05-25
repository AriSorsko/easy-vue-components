<template>
  <div>
    <input
      v-if="enableTableSearching"
      v-model="tableSearch"
      placeholder="Search"
      class="searchInput"
      id="searchInput"
      ref="searchInput"
    />

    <div id="container" :style="columnWidthsStyle" ref="container">
      <!-- Empty div to keep the headers lined up with their columns when there are exapnd/collapse buttons  -->
      <div v-if="enableAccordianforDetailRow" />
      <!-- Empty div to keep the headers lined up with their columns when there are radio buttons  -->
      <div v-if="enableRadioButtons" />
      <!-- Toggle all of the check boxes  -->
      <input
        v-if="enableCheckBoxes"
        type="checkbox"
        v-model="checkAll"
        value="checkAll"
        ref="checkAll"
        @click="checkAllToggled"
      />
      <!-- Headings -->
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

      <!-- No table data -->
      <div v-if="!rows || rows.length === 0" class="spanAllColumns">
        There is no data for this table.
      </div>
      <!-- No table data that matches the search value-->
      <div
        v-else-if="
          !sortedFilteredAndGroupedRows ||
            sortedFilteredAndGroupedRows.length === 0
        "
        class="spanAllColumns"
      >
        No rows match the search
      </div>

      <!-- Data Rows -->
      <div v-else class="collapseDivs">
        <div
          v-for="(group, gindex) in rowsToShow"
          :key="gindex"
          class="collapseDivs"
        >
          <!-- Header row for groups -->
          <div
            class="spanAllColumns groupHeader"
            v-if="group.header && group.rows.length > 0"
          >
            <slot name="groupHeader" v-bind="group">
              {{ group.header }}
            </slot>
          </div>

          <div
            v-for="(row, rindex) in group.rows"
            :key="rindex"
            class="collapseDivs"
          >
            <!-- Expand/Collapse controls for the details row -->
            <div v-if="enableAccordianforDetailRow">
              <div
                v-if="openDetailRows.includes(row)"
                @click="collapseRow(row)"
              >
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

            <!-- Radio buttons -->
            <input
              v-if="enableRadioButtons"
              type="radio"
              :id="rindex"
              :value="row"
              v-model="internalSelectedItem"
              :ref="'radio_' + rindex"
            />

            <!-- Check boxes -->
            <input
              v-if="enableCheckBoxes"
              type="checkbox"
              :id="rindex"
              :value="row"
              v-model="internalSelectedItems"
              :ref="'check_' + rindex"
            />

            <!-- Columns for the row -->
            <div
              v-for="(column, cindex) in columns"
              :key="column.property + cindex"
              :class="generateCellClasses(column, cindex, rindex)"
              :ref="'rowCell_' + gindex + '_' + rindex + '_' + cindex"
            >
              <slot :name="column.property" v-bind="row">
                {{ row[column.property] }}
              </slot>
            </div>

            <!-- Detail row -->
            <div
              class="detailRowSlot"
              :key="JSON.stringify(row)"
              v-if="
                !enableAccordianforDetailRow || openDetailRows.includes(row)
              "
            >
              <slot name="detailRowSlot" v-bind="row" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Pages
      v-if="enablePaging"
      id="pagingControls"
      class="pagingControls"
      :numberOfitems="sortedFilteredAndGroupedRows.length"
      :itemsPerPage="rowsPerPage"
      :startIndex.sync="startIndex"
      :endIndex.sync="endIndex"
    />
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
    Which in this context means nested divs still end up
    in a single long list of divs as the css grid expects
*/
.collapseDivs {
  display: contents;
}

#container {
  display: grid;
}

.spanAllColumns {
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

.groupHeader {
  text-align: left;
}

.detailRowSlot {
  grid-column: 1/-1;
}

.searchInput {
  display: block;
}
</style>

<script>
import camelCase from "lodash/camelCase";
import sortBy from "lodash/sortBy";
import cloneDeep from "lodash/cloneDeep";
import reverse from "lodash/reverse";
import Pages from "@/components/Pages";
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
  components: { FontAwesomeIcon, Pages },
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
    enableTableSearching: {
      type: Boolean,
      default: false,
    },
    enablePaging: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: Number,
    groups: {
      type: Array,
    },
  },
  data() {
    return {
      sortedRows: [],
      columnSortDirection: {},
      internalSelectedItem: null,
      internalSelectedItems: [],
      openDetailRows: [],
      checkAll: true,
      tableSearch: "",
      startIndex: 0,
      endIndex: 0,
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
        "The 'selectedItem' prop is only used when radio buttons are enabled"
      );
    }
    if (!this.enableCheckBoxes && this.selectedItems) {
      console.warn(
        "The 'selectedItems' prop is only used when check boxes are enabled"
      );
    }
    if (this.rowsPerPage && !this.enablePaging) {
      console.warn(
        "The 'rowsPerPage' prop is only used when the 'enablePaging' prop is enabled"
      );
    }

    if (!this.rows) return;

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
      this.checkAll = this.internalSelectedItems.length === this.rows.length;
      if (selectedItemsNotInRows.length !== 0)
        console.warn(
          "The following selected items are not one of the row items!",
          selectedItemsNotInRows
        );
    }
  },
  watch: {
    internalSelectedItem() {
      this.$emit("update:selectedItem", this.internalSelectedItem);
    },
    internalSelectedItems() {
      this.$emit("update:selectedItems", this.internalSelectedItems);
      this.checkAll = this.internalSelectedItems.length === this.rows.length;
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
    sortedFilteredAndGroupedRows() {
      let sortedFilteredRows = this.sortedRows;

      if (this.tableSearch && this.enableTableSearching) {
        sortedFilteredRows = sortedFilteredRows.filter((row) => {
          return this.stringifyRow(row)
            .toLowerCase()
            .includes(this.tableSearch.toLowerCase());
        });
      }

      // Handle edge case where if a row is in multiple groups
      // it will be repeated, as expected, however the paging
      // needs to account for that so it does not end up with
      // more rows on a page than should be there. To do that
      // duplicate the rows that are in multiple groups before
      // slicing for the page rows.
      // Also the page component needs to know the number
      // of rows, including duplicates, but excluding filtered
      // rows. Which is why this is its own computed property.
      let groupedRows = [];
      const groups = this.groups ? this.groups : [{ filter: () => true }];
      groups.forEach((group) => {
        const rowsForGroup = this.filterByGroup(sortedFilteredRows, group);
        const rowsWithGroup = rowsForGroup.map((row) => {
          return { group, row };
        });
        groupedRows = groupedRows.concat(rowsWithGroup);
      });
      return groupedRows;
    },
    rowsToShow() {
      let groupedRows = this.sortedFilteredAndGroupedRows;
      //handle paging
      if (this.enablePaging) {
        groupedRows = groupedRows.slice(this.startIndex, this.endIndex);
      }

      // handle grouping part 2
      // Turn the array of {group, row} objects into an array of {group, header, [rows]} objects
      let displayRows = [];
      groupedRows.forEach((gr) => {
        if (
          displayRows.length === 0 ||
          displayRows[displayRows.length - 1].group !== gr.group
        ) {
          displayRows.push({
            header: gr.group.header,
            group: gr.group,
            rows: [],
          });
        }
        displayRows[displayRows.length - 1].rows.push(gr.row);
      });

      return displayRows;
    },
  },
  methods: {
    filterByGroup(rows, group) {
      if (!group.filter || typeof group.filter !== "function") {
        console.error("Groups must have a filter field that is a function");
        return [];
      }
      return rows.filter((r) => {
        return group.filter(r);
      });
    },
    stringifyRow(row) {
      return this.columns
        .map((column) => row[column.property])
        .reduce((accumulator, curVal) => {
          if (curVal !== undefined) {
            accumulator += " " + curVal;
          }
          return accumulator;
        });
    },
    checkAllToggled() {
      this.internalSelectedItems = [];
      if (!this.checkAll) {
        this.internalSelectedItems = this.internalSelectedItems.concat(
          this.rows
        );
      }
    },
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
