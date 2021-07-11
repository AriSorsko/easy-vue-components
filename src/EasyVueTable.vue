<template>
  <div>
    <Search v-if="enableTableSearching" :searchTerm.sync="searchTerm" />

    <div id="container" :style="columnWidthsStyle" ref="container">
      <!-- Empty div to keep the headers lined up with their columns when there are exapnd/collapse buttons  -->
      <div v-if="enableAccordianforDetailRow" />
      <!-- Empty div to keep the headers lined up with their columns when there are radio buttons  -->
      <div v-if="enableRadioButtons" />
      <!-- Toggle all of the check boxes  -->
      <input
        v-if="enableCheckBoxes"
        type="checkbox"
        v-model="allChecked"
        ref="checkAll"
        :indeterminate.prop="someChecked"
      />
      <!-- Headings -->
      <div
        v-for="(column, index) in columns"
        :key="column.header"
        class="headerCell"
        :class="generateHeaderClasses(column.property, index)"
        :ref="'headerCell_' + index"
      >
        <slot :name="generateSlotName('header', column.header)" v-bind="column">
          {{ column.header }}
        </slot>

        <span
          v-if="column.sortable || column.initialSort"
          @click="reverseSort(column.property)"
        >
          <slot
            name="sortAscendingIcon"
            v-bind="column"
            v-if="columnSortDirection[column.property] === 'asc'"
          >
            <font-awesome-icon icon="arrow-down" :ref="'arrowDown_' + index" />
          </slot>
          <slot name="sortDescendingIcon" v-bind="column" v-else>
            <font-awesome-icon icon="arrow-up" :ref="'arrowUp_' + index" />
          </slot>
        </span>
      </div>

      <!-- No table data -->

      <div v-if="!rows || rows.length === 0" class="spanAllColumns">
        <slot name="noDataMessage">
          There is no data for this table.
        </slot>
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
                {{ getCellValue(row, column) }}
              </slot>
            </div>

            <!-- Detail row -->
            <div
              class="spanAllColumns"
              :key="JSON.stringify(row)"
              v-if="
                !enableAccordianforDetailRow || openDetailRows.includes(row)
              "
            >
              <slot name="spanAllColumns" v-bind="row" />
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

.searchInput {
  display: block;
}
.cellPadding {
  padding-left: 2px;
  padding-right: 2px;
}
</style>

<script>
import {
  camelCase,
  cloneDeep,
  difference,
  get,
  intersection,
  isEmpty,
  reverse,
  sortBy,
} from "lodash";
import Pages from "./Pages.vue";
import Search from "./Search.vue";
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
  name: "EasyVueTable",
  components: { FontAwesomeIcon, Pages, Search },
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    fixedHeader: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: null,
    },
    selectedItems: {
      type: Array,
      default: null,
    },
    enableAccordianforDetailRow: {
      type: String, // only valid values are 'single' or 'multi'
      default: null,
    },
    enableTableSearching: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: Number,
    groups: Array,
  },
  data() {
    return {
      sortedRows: [],
      columnSortDirection: {},
      internalSelectedItem: null,
      internalSelectedItems: [],
      openDetailRows: [],
      searchTerm: "",
      startIndex: 0,
      endIndex: 0,
    };
  },
  created() {
    // Error checking
    let validProps = this.errorPropValidations();
    if (!validProps) return;
    this.warningPropValidations();

    if (!this.rows) return;

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
    }

    // Handle checkboxes setup
    if (this.selectedItems) {
      const filteredSelected = intersection(this.selectedItems, this.rows);

      this.internalSelectedItems = this.internalSelectedItems.concat(
        filteredSelected
      );
    }
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
    enablePaging() {
      return !!this.rowsPerPage;
    },
    enableRadioButtons() {
      return !!this.selectedItem;
    },
    enableCheckBoxes() {
      return !!this.selectedItems;
    },
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

      if (this.searchTerm && this.enableTableSearching) {
        sortedFilteredRows = sortedFilteredRows.filter((row) => {
          // Note: stringifyRow only includes visible fields
          // That way searching for say "12" doesn't incorrectly
          // also include rows that have a non-visible ID field
          // that happens to include "12"
          return this.stringifyRow(row)
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
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
    allChecked: {
      get() {
        return this.internalSelectedItems.length === this.rows.length;
      },
      set(checked) {
        this.internalSelectedItems = [];
        if (checked) {
          this.internalSelectedItems = this.internalSelectedItems.concat(
            this.rows
          );
        }
      },
    },
    someChecked() {
      return (
        this.internalSelectedItems.length > 0 &&
        this.internalSelectedItems.length < this.rows.length
      );
    },
  },
  methods: {
    getCellValue(row, column) {
      return get(row, column.property, column.defaultValue);
    },
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
        .map((column) => this.getCellValue(row, column))
        .reduce((accumulator, curVal) => {
          if (curVal !== undefined) {
            accumulator += " " + curVal;
          }
          return accumulator;
        });
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
      let classes = camelCase(header);
      classes += " cellPadding ";
      classes += " " + camelCase("header " + header);
      classes += index % 2 === 0 ? " evenColumn" : " oddColumn";
      if (this.fixedHeader) classes += " fixedHeader";
      return classes;
    },
    generateCellClasses(column, cindex, rindex) {
      let classes = "row ";
      classes += " cellPadding ";
      classes += camelCase(column.property);
      classes += cindex % 2 === 0 ? " evenColumn" : " oddColumn";
      classes += rindex % 2 === 0 ? " evenRow" : " oddRow";
      return classes;
    },
    errorPropValidations() {
      // validate columns
      if (!this.columns) {
        console.error("columns is a required prop");
        return false;
      }
      if (!Array.isArray(this.columns)) {
        console.error(
          "'columns' prop must be an array, not",
          typeof this.columns
        );
        return false;
      }
      if (this.columns.length === 0) {
        console.error(
          "'columns' array is empty, no table data will be displayed"
        );
        return false;
      }
      if (this.columns.find((c) => typeof c !== "object")) {
        console.error("All columns must be objects");
        return false;
      }
      if (this.columns.find((c) => !c.property)) {
        console.error("'property' is a required field on all columns");
        return false;
      }
      if (this.columns.find((c) => typeof c.property !== "string")) {
        console.error("The 'property' field on all columns must be a string");
        return false;
      }

      // Rows Per Page
      if (this.rowsPerPage < 1) {
        console.error("The 'rowsPerPage' prop should be greater than 0");
        return false;
      }
      return true;
    },
    warningPropValidations() {
      // enableAccordianforDetailRow
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

      if (this.rows && typeof Array.isArray(this.rows)) {
        // selectedItem
        if (
          this.selectedItem &&
          !isEmpty(this.selectedItem) &&
          !this.rows.find((r) => r === this.selectedItem)
        ) {
          console.warn(
            "The 'selectedItem' prop is not one of the objects in the rows: ",
            this.selectedItem
          );
        }
        //selectedItems
        if (this.selectedItems) {
          const selectedItemsNotInRows = difference(
            this.selectedItems,
            this.rows
          );
          if (selectedItemsNotInRows.length > 0) {
            console.warn(
              "These selected items are not in the rows: ",
              selectedItemsNotInRows
            );
          }
        }
      }
    },
    generateSlotName(prefix, value) {
      return camelCase(prefix + " " + value);
    },
  },
};
</script>
