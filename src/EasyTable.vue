<template>
  <div>
    <Search
      v-if="showTableEasySearch"
      ref="easySearch"
      :search-term.sync="searchTerm"
      :highlight-query-selector="
        enableSearchHighlight ? '#tableContainer' : null
      "
      :highlight-options="highlightOptions"
    />

    <div
      id="tableContainer"
      ref="tableContainer"
      :style="columnWidthsStyle"
    >
      <!-- Empty div to keep the headers lined up with their columns when there are exapnd/collapse buttons  -->
      <div v-if="enableDetailRowAccordian" />
      <!-- Empty div to keep the headers lined up with their columns when there are radio buttons  -->
      <div v-if="enableRadioButtons" />
      <!-- Toggle all of the check boxes  -->
      <input
        v-if="enableCheckBoxes"
        ref="checkAll"
        v-model="allChecked"
        type="checkbox"
        :indeterminate.prop="someChecked"
      >
      <!-- Headings -->
      <div
        v-for="(column, index) in columns"
        :key="column.header"
        :ref="'headerCell_' + index"
        class="headerCell"
        :class="generateHeaderClasses(column.property, index)"
      >
        <slot
          :name="generateSlotName('header', column.header)"
          v-bind="column"
        >
          {{ column.header }}
        </slot>

        <span
          v-if="column.sort || column.initialSort"
          @click="reverseSort(column.property)"
        >
          <slot
            v-if="arrowDirection[column.property] === 'ascending'"
            name="sortAscendingIcon"
            v-bind="column"
          >
            <font-awesome-icon
              :ref="'arrowDown_' + index"
              icon="arrow-down"
            />
          </slot>
          <slot
            v-else
            name="sortDescendingIcon"
            v-bind="column"
          >
            <font-awesome-icon
              :ref="'arrowUp_' + index"
              icon="arrow-up"
            />
          </slot>
        </span>
      </div>

      <!-- No table data -->
      <div
        v-if="!rows || rows.length === 0"
        class="spanAllColumns"
      >
        <slot name="noDataMessage">
          There is no data for this table.
        </slot>
      </div>

      <!-- No table data that matches the search value-->
      <div
        v-else-if="!displayRows || displayRows.length === 0"
        class="spanAllColumns"
      >
        No rows match the search
      </div>

      <!-- Data Rows -->
      <div
        v-else
        class="makeGridIgnoreDiv"
      >
        <div
          v-for="(group, gindex) in internalGroups"
          :key="gindex"
          class="makeGridIgnoreDiv "
        >
          <!-- Group Header -->
          <div
            v-if="showGroupHeader(group)"
            class="spanAllColumns groupHeader row"
          >
            <slot
              name="groupHeader"
              v-bind="group.originalGroup"
            >
              {{ group.header }}
            </slot>
          </div>

          <!-- Rows -->
          <div
            v-for="(row, rindex) in displayRows.slice(
              Math.max(group.filteredStartIndex - startIndex, 0),
              Math.max(group.filteredEndIndex - startIndex, 0)
            )"
            :key="rindex + row.toString()"
            class="makeGridIgnoreDiv row"
          >
            <!-- Expand/Collapse controls for the details row -->
            <div v-if="enableDetailRowAccordian">
              <div
                v-if="row.detailRowOpen"
                @click="collapseRow(row)"
              >
                <slot name="expandedDetailRowIcon">
                  <font-awesome-icon
                    :ref="'angleDown_' + rindex"
                    icon="angle-down"
                  />
                </slot>
              </div>
              <div
                v-else
                @click="expandRow(row)"
              >
                <slot name="collapsedDetailRowIcon">
                  <font-awesome-icon
                    :ref="'angleRight_' + rindex"
                    icon="angle-right"
                  />
                </slot>
              </div>
            </div>

            <!-- Radio buttons -->
            <input
              v-if="enableRadioButtons"
              :id="rindex"
              :ref="'radio_' + rindex"
              v-model="internalSelectedItem"
              type="radio"
              :value="row.originalRow"
            >

            <!-- Check boxes -->
            <input
              v-if="enableCheckBoxes"
              :id="rindex"
              :ref="'check_' + rindex"
              v-model="internalSelectedItems"
              type="checkbox"
              :value="row.originalRow"
            >

            <!-- Columns for the row -->
            <div
              v-for="(column, cindex) in columns"
              :key="column.property + cindex"
              :ref="'rowCell_' + gindex + '_' + rindex + '_' + cindex"
              :class="generateCellClasses(column, cindex, rindex, row)"
            >
              <slot
                :name="column.property"
                v-bind="row.originalRow"
              >
                {{ getCellValue(row, column) }}
              </slot>
            </div>

            <!-- Detail row -->
            <div
              v-if="!enableDetailRowAccordian || row.detailRowOpen"
              :key="'detailRow' + rindex"
              class="spanAllColumns"
            >
              <slot
                name="detailRowSlot"
                v-bind="row.originalRow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <EasyPages
      v-if="enablePaging"
      id="pagingControls"
      class="pagingControls"
      :number-ofitems="totalRows"
      :items-per-page="rowsPerPage"
      :start-index.sync="startIndex"
      :end-index.sync="endIndex"
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
*/
.makeGridIgnoreDiv {
  display: contents;
}

#tableContainer {
  display: grid;
  margin: 5px;
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
  font-size: 1.2em;
}

.row.groupHeader {
  text-align: left;
  font-size: 1.1em;
  background-color: rgb(250, 250, 250);
  padding-left: 6px;
}

.easySearch {
  display: block;
}

/* Note: gap leaves spaces when 
highlighting a row on hover etc. */
.cellPadding {
  padding-left: 2px;
  padding-right: 2px;
}

.row {
  padding: 2px 0;
}
</style>

<script>
import {
  camelCase,
  clone,
  difference,
  get,
  intersection,
  reverse,
  sortBy,
  uniq,
  pull,
} from "lodash";
import EasyPages from "./EasyPages.vue";
import Search from "./EasySearch.vue";
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
  components: { FontAwesomeIcon, EasyPages, Search },
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    fixedHeader: {
      type: Boolean,
      default: false,
    },
    enableRadioButtons: {
      type: Boolean,
      defaut: false,
    },
    selectedItem: {
      type: Object,
      default: null,
    },
    enableCheckBoxes: {
      type: Boolean,
      defaut: false,
    },
    selectedItems: {
      type: Array,
      default: null,
    },
    enableDetailRowAccordian: {
      type: Boolean,
      default: false,
    },
    onlyShowOneDetailRow: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    rowsPerPage: Number,
    // eslint-disable-next-line vue/require-default-prop
    groups: Array,
    showTableEasySearch: {
      type: Boolean,
      default: false,
    },
    enableSearchFilter: {
      type: Boolean,
      default: true,
    },
    enableSearchHighlight: {
      type: Boolean,
      default: true,
    },
    highlightOptions: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      columnSortDirection: [],
      arrowDirection: {},
      internalSelectedItem: null,
      internalSelectedItems: [],
      internalGroups: [],
      internalRows: [],
      searchTerm: "",
      totalRows: 0,
      startIndex: 0,
      endIndex: 0,
    };
  },
  computed: {
    enablePaging() {
      return !!this.rowsPerPage;
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
        if (this.enableDetailRowAccordian) {
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
    allChecked: {
      get() {
        return (
          this.internalSelectedItems.length === this.uniqueOriginalRows.length
        );
      },
      set(checked) {
        // it is a bit confusing to "check all" and only have some items be checked,
        // while the check all box remains indeterminate, but checking filtered out
        // rows is even more confusing, as is showing that "all rows are checked"
        // even if only some rows are checked. Life is messy, when rows are filtered
        // by a search term just add the rows that pass the filter to the selected rows.
        const filteredRows = this.filterRowsBySearchValue(
          this.internalRows,
          this.searchTerm,
          this.enableSearchFilter
        ).map((row) => row.originalRow);

        if (checked) {
          this.internalSelectedItems = this.internalSelectedItems.concat(
            filteredRows
          );
          this.internalSelectedItems = uniq(this.internalSelectedItems);
        } else {
          if (this.searchTerm) {
            this.internalSelectedItems = difference(
              this.internalSelectedItems,
              filteredRows
            );
          } else {
            this.internalSelectedItems = [];
          }
        }
      },
    },
    someChecked() {
      return (
        this.internalSelectedItems.length > 0 &&
        this.internalSelectedItems.length < this.uniqueOriginalRows.length
      );
    },
    displayRows() {
      let rows = this.filterRowsBySearchValue(
        this.internalRows,
        this.searchTerm,
        this.enableSearchFilter
      );
      rows = this.sortRows(rows);
      rows = this.pageRows(rows);
      return rows;
    },
    uniqueOriginalRows() {
      return uniq(this.internalRows.map((r) => r.originalRow));
    },
  },
  watch: {
    internalSelectedItem() {
      this.$emit("update:selectedItem", this.internalSelectedItem);
      this.$emit("selectedItemChanged", this.internalSelectedItem);
    },
    internalSelectedItems() {
      this.$emit("update:selectedItems", this.internalSelectedItems);
      this.$emit("selectedItemsChanged", this.internalSelectedItems);
    },
  },
  created() {
    // Error checking
    let validProps = this.errorPropValidations();
    if (!validProps) return;
    if (!this.rows) return;

    // Handle sorting setup
    let sortableColumns = this.columns.filter((c) => {
      return c.sort && typeof c.sort.priority === "number" && c.sort.direction;
    });
    sortableColumns = sortBy(sortableColumns, ["sort.priority"]);
    sortableColumns = reverse(sortableColumns);
    sortableColumns.forEach((sortableColumn) => {
      this.columnSortDirection.push({
        property: sortableColumn.property,
        direction: sortableColumn.sort.direction,
        format: sortableColumn.format,
        sortBy: sortableColumn.sortBy,
      });
      this.arrowDirection[sortableColumn.property] =
        sortableColumn.sort.direction;
    });

    // Handle internal rows setup
    let groupedRows = this.groupRows(this.rows);

    // The detail rows with accordian controls get really hinky
    // given that 1) the *original* object needs to be preserved
    // so users can "===" on them and it works as expected for the
    // selectedItem and selectedItems. 2) The table supports having
    // multiple copies of the same object in different groups. 3)
    // filtering changes the index of objects in the visible rows.
    // Because of 1 and 2 the object can't be used to determine if
    // a detail row is open while 2 and 3 make using indexs challening.
    // So instead, each row will be its own object, with the state of
    // the detail row and a reference to the original object. Makes
    // the rest of the code a bit more convoluted, but that is the
    // least bad option.
    this.internalRows = groupedRows.map((row) => {
      return {
        originalRow: row,
        detailRowOpen: !this.enableDetailRowAccordian,
      };
    });

    // Handle radio buttons setup
    if (this.selectedItem) {
      if (this.internalRows.find((r) => r.originalRow === this.selectedItem))
        this.internalSelectedItem = this.selectedItem;
      else {
        console.warn(
          "The 'selectedItem' prop is not one of the objects in the rows: ",
          this.selectedItem
        );
      }
    }

    // Handle checkboxes setup
    if (this.selectedItems) {
      this.internalSelectedItems = intersection(
        this.selectedItems,
        this.uniqueOriginalRows
      );
    }

    this.warningPropValidations();
  },
  methods: {
    groupRows(rows) {
      this.internalGroups = [];
      let groupedRows = [];
      if (this.groups) {
        let startIndex = 0;
        this.groups.forEach((group) => {
          if (group.filter) {
            const rowsInGroup = rows.filter((row) => {
              return group.filter(row);
            });
            groupedRows = groupedRows.concat(rowsInGroup);
          } else {
            groupedRows = groupedRows.concat(group.rows);
          }

          const newGroup = {
            header: group.header,
            displayHeader: true,
            startIndex: startIndex,
            filteredStartIndex: startIndex,
            endIndex: groupedRows.length,
            filteredEndIndex: groupedRows.length,
            originalGroup: group,
          };
          this.internalGroups.push(newGroup);
          startIndex = groupedRows.length;
        });
      } else {
        this.internalGroups.push({
          displayHeader: false,
          startIndex: 0,
          filteredStartIndex: 0,
          endIndex: rows.length,
          filteredEndIndex: rows.length,
        });
        groupedRows = clone(rows);
      }
      this.totalRows = groupedRows.length;
      return groupedRows;
    },
    filterRowsBySearchValue(rows, searchTerm, enableSearchFilter) {
      if (searchTerm && enableSearchFilter) {
        let filteredRows = [];
        let filteredStartIndex = 0;
        this.internalGroups.forEach((group) => {
          const rowsInGroup = this.internalRows.slice(
            group.startIndex,
            group.endIndex
          );
          const filteredRowsInGroup = rowsInGroup.filter((row) => {
            // Note: stringifyRow only includes visible fields
            // That way searching for say "12" doesn't incorrectly
            // also include rows that have a non-visible ID field
            // that happens to include "12"
            return this.stringifyRow(row)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          });
          group.filteredStartIndex = filteredStartIndex;
          group.filteredEndIndex =
            filteredStartIndex + filteredRowsInGroup.length;
          filteredStartIndex = filteredStartIndex + filteredRowsInGroup.length;
          filteredRows = filteredRows.concat(filteredRowsInGroup);
        });
        this.totalRows = filteredRows.length;
        return filteredRows;
      }

      this.internalGroups.forEach((group) => {
        group.filteredStartIndex = group.startIndex;
        group.filteredEndIndex = group.endIndex;
      });
      this.totalRows = rows.length;
      return rows;
    },
    sortRows(rows) {
      if (this.columnSortDirection.length > 0) {
        let sortedRows = [];
        this.internalGroups.forEach((group) => {
          let rowsInGroup = rows.slice(
            group.filteredStartIndex,
            group.filteredEndIndex
          );
          this.columnSortDirection.forEach((sortableColumn) => {
            rowsInGroup = sortBy(rowsInGroup, [
              (row) => {
                if (sortableColumn.sortBy) {
                  return sortableColumn.sortBy(
                    row.originalRow[sortableColumn.property],
                    row.originalRow
                  );
                }
                return this.getCellValue(row, sortableColumn);
              },
            ]);
            if (sortableColumn.direction === "descending")
              rowsInGroup = reverse(rowsInGroup);
          });
          sortedRows = sortedRows.concat(rowsInGroup);
        });
        return sortedRows;
      }
      return rows;
    },
    pageRows(rows) {
      if (this.enablePaging) {
        return rows.slice(this.startIndex, this.endIndex);
      }
      return rows;
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
    reverseSort(columnProperty) {
      const sortObject = this.getSortByProperty(columnProperty);
      pull(this.columnSortDirection, [sortObject]);

      if (sortObject.direction === "ascending") {
        this.arrowDirection[columnProperty] = "descending";
        sortObject.direction = "descending";
      } else {
        this.arrowDirection[columnProperty] = "ascending";
        sortObject.direction = "ascending";
      }

      this.columnSortDirection.push(sortObject);
    },
    getSortByProperty(columnProperty) {
      return this.columnSortDirection.find(
        (csd) => csd.property === columnProperty
      );
    },
    showGroupHeader(group) {
      const anyRowsInRange =
        this.indexInPagedRows(group.filteredStartIndex) ||
        this.indexInPagedRows(group.filteredEndIndex - 1);
      const hasRows = group.filteredStartIndex < group.filteredEndIndex;
      return group.displayHeader && anyRowsInRange && hasRows;
    },
    indexInPagedRows(index) {
      if (!this.rowsPerPage) return true;
      return index >= this.startIndex && index < this.endIndex;
    },
    getCellValue(row, column) {
      const cellValue = get(
        row.originalRow,
        column.property,
        column.defaultValue
      );
      return column.format
        ? column.format(cellValue, row.originalRow)
        : cellValue;
    },
    generateHeaderClasses(header, index) {
      let classes = camelCase(header);
      classes += " cellPadding ";
      classes += " " + camelCase("header " + header);
      classes += index % 2 === 0 ? " evenColumn" : " oddColumn";
      if (this.fixedHeader) classes += " fixedHeader";
      return classes;
    },
    generateSlotName(prefix, value) {
      return camelCase(prefix + " " + value);
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
      // cell format functions
      this.columns.forEach((c) => {
        if (c.format && typeof c.format !== "function") {
          console.error(
            "All column format properties must be functions, column '" +
              c.property +
              "' has a format function of type " +
              typeof c.format
          );
          return false;
        }
      });
      // cell sortBy functions
      this.columns.forEach((c) => {
        if (c.sortBy && typeof c.sortBy !== "function") {
          console.error(
            "All column sortBy properties must be functions, column '" +
              c.property +
              "' has a sortBy function of type " +
              typeof c.sortBy
          );
          return false;
        }
      });

      // rows and groups
      if (!this.rows) {
        if (!this.groups) {
          console.error(
            "The rows prop or groups with rows properties are required"
          );
          return false;
        }
        const rowsInGroups = this.groups.map((group) => group.rows);
        if (!rowsInGroups) {
          console.error(
            "The rows prop or groups with rows properties are required"
          );
          return false;
        }

        const groupFilters = this.groups.map((group) => group.filter);
        if (groupFilters.length > 0) {
          console.error("Groups with filter properties require the row prop.");
          return false;
        }
      }
      if (this.groups) {
        // Filter property on groups needs to be an function
        const groupsWithBadFilters = this.groups
          .filter((group) => group.filter && typeof group.filter !== "function")
          .map((g) => g.header);
        if (groupsWithBadFilters.length > 0) {
          console.error(
            "The filter property in group objects must be a function, these groups have non-function filters: " +
              groupsWithBadFilters
          );
          return false;
        }

        // Rows property on groups needs to be an Array
        const groupsWithBadRows = this.groups
          .filter((group) => group.rows && !Array.isArray(group.rows))
          .map((g) => g.header);
        if (groupsWithBadRows.length > 0) {
          console.error(
            "The rows property in group objects must be an Array, these groups have non-array rows: " +
              groupsWithBadRows
          );
          return false;
        }

        // Groups require either rows or filter property
        const groupsWithNoRowsOrFilters = this.groups
          .filter((group) => !group.rows && !group.filter)
          .map((g) => g.header);
        if (groupsWithNoRowsOrFilters.length > 0) {
          console.error(
            "Every group must have either a 'rows' property or a 'filter' property, these groups have nither: " +
              groupsWithNoRowsOrFilters
          );
          return false;
        }
      }

      // Rows Per Page
      if (this.rowsPerPage < 1) {
        console.error("The 'rowsPerPage' prop must be greater than 0");
        return false;
      }
      return true;
    },
    warningPropValidations() {
      // radio buttons
      if (this.selectedItem && !this.enableRadioButtons) {
        console.warn(
          "The 'selectedItem' prop is only valid when the 'enableRadioButtons' prop is true"
        );
      }

      if (this.selectedItems && !this.enableCheckBoxes) {
        console.warn(
          "The 'selectedItems' prop is only valid when the 'enableCheckBoxes' prop is true"
        );
      }

      // enableDetailRowAccordian
      if (this.onlyShowOneDetailRow && !this.enableDetailRowAccordian) {
        console.warn(
          "The 'onlyShowOneDetailRow' prop is only valid when the 'enableDetailRowAccordian' is true"
        );
      }

      // selected items
      if (this.selectedItems) {
        const selectedItemsNotInRows = difference(
          this.selectedItems,
          this.uniqueOriginalRows
        );
        if (selectedItemsNotInRows.length > 0) {
          console.warn(
            "These selected items are not in the rows: ",
            selectedItemsNotInRows
          );
        }
      }

      // searching
      if (
        this.showTableEasySearch &&
        !this.enableSearchFilter &&
        !this.enableSearchHighlight
      ) {
        console.warn(
          "The search input is visible but both the enableSearchFilter and the enableSearchHighlight props are disabled so searching will have no effect"
        );
      }

      // sorting
      let sortableColumns = this.columns.filter((c) => {
        return c.sort;
      });
      sortableColumns = sortBy(sortableColumns, ["sort.priority"]);
      let lastSortableColumn = null;
      sortableColumns.forEach((column) => {
        const sortOptions = column.sort;

        if (typeof sortOptions.priority !== "number") {
          console.warn(
            "The sort priority option must be a number. For column " +
              column.property +
              " it is a " +
              typeof sortOptions.priority
          );
        }
        if (!["ascending", "descending"].includes(sortOptions.direction)) {
          console.warn(
            "The sort direction option must be either 'ascending' or 'descending'. For column " +
              column.property +
              " it is " +
              sortOptions.direction
          );
        }
        if (
          lastSortableColumn !== null &&
          lastSortableColumn.sort.priority === column.sort.priority
        ) {
          console.warn(
            "The sort priority option for column " +
              column.property +
              " is the same as the sort priority option for " +
              lastSortableColumn.property
          );
        }
        lastSortableColumn = column;
      });

      // css classes
    },
    expandRow(row) {
      if (this.onlyShowOneDetailRow) {
        this.internalRows.forEach((row) => (row.detailRowOpen = false));
      }
      row.detailRowOpen = true;
      const index = this.internalRows.indexOf(row);
      this.$set(this.internalRows, index, row);
    },
    collapseRow(row) {
      row.detailRowOpen = false;
      const index = this.internalRows.indexOf(row);
      this.$set(this.internalRows, index, row);
    },
    generateCellClasses(column, cindex, rindex, row) {
      let classes = "row ";
      classes += " cellPadding ";
      classes += camelCase(column.property);
      classes += cindex % 2 === 0 ? " evenColumn" : " oddColumn";
      classes += rindex % 2 === 0 ? " evenRow" : " oddRow";
      if (column.classFunction) {
        const calculatedClass = column.classFunction(row.originalRow);
        classes += calculatedClass ? " " + calculatedClass : "";
      }
      if (column.class) classes += " " + column.class;
      return classes;
    },
  },
};
</script>
