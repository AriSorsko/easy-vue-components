<template>
  <div>
    <!-- Expand/Collapse controls for the details row -->
    <div v-if="enableDetailRowAccordian">
      <div v-if="detailRowOpen" @click="toggleRow()">
        <slot name="expandedDetailRowIcon">
          <font-awesome-icon icon="angle-down" :ref="'angleDown_' + rindex" />
        </slot>
      </div>
      <div v-else @click="toggleRow()">
        <slot name="collapsedDetailRowIcon">
          <font-awesome-icon icon="angle-right" :ref="'angleRight_' + rindex" />
        </slot>
      </div>
    </div>

    <!-- Radio buttons -->
    <input
      v-if="enableRadioButtons"
      type="radio"
      :id="rindex"
      :value="row"
      v-model="selectedItem"
      :ref="'radio_' + rindex"
    />

    <!-- Check boxes -->
    <input
      v-if="enableCheckBoxes"
      type="checkbox"
      :id="rindex"
      :value="row"
      v-model="selectedItems"
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
      :key="'detailRow' + rindex"
      v-show="!enableDetailRowAccordian || detailRowOpen"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.spanAllColumns {
  grid-column: 1/-1;
}

/* Note: gap leaves spaces when 
highlighting a row on hover etc. */
.cellPadding {
  padding-left: 2px;
  padding-right: 2px;
}
</style>

<script>
import { camelCase } from "lodash";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleDown);
library.add(faAngleRight);

export default {
  name: "ExpandableRow",
  components: { FontAwesomeIcon },
  props: {
    columns: { type: Array, required: true },
    row: Object,
    internalSelectedItem: {
      type: Object,
      default: null,
    },
    internalSelectedItems: {
      type: Array,
      default: null,
    },
    enableDetailRowAccordian: {
      type: Boolean,
      default: false,
    },
    enableRadioButtons: Boolean,
    enableCheckBoxes: Boolean,
    gindex: Number,
    rindex: Number,
    generateSlotName: Function,
    getCellValue: Function,
    closeDetailRowsToggle: Boolean,
  },
  data() {
    return {
      detailRowOpen: false,
      thisIsToggledRow: false,
    };
  },
  watch: {
    closeDetailRowsToggle() {
      if (this.thisIsToggledRow) this.thisIsToggledRow = false;
      else this.detailRowOpen = false;
    },
  },
  computed: {
    selectedItem: {
      get() {
        return this.internalSelectedItem;
      },
      set(toggled) {
        this.$emit("update:internalSelectedItem", toggled);
      },
    },
    selectedItems: {
      get() {
        return this.internalSelectedItems;
      },
      set(toggled) {
        this.$emit("update:internalSelectedItems", toggled);
      },
    },
  },
  methods: {
    toggleRow() {
      this.detailRowOpen = !this.detailRowOpen;
      if (this.detailRowOpen) {
        this.thisIsToggledRow = true;
        this.$emit("detailRowOpened");
      }
    },
    generateCellClasses(column, cindex, rindex) {
      let classes = "row ";
      classes += " cellPadding ";
      classes += camelCase(column.property);
      classes += cindex % 2 === 0 ? " evenColumn" : " oddColumn";
      classes += rindex % 2 === 0 ? " evenRow" : " oddRow";
      return classes;
    },
  },
};
</script>
