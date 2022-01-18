<template>
  <div>
    <font-awesome-icon
      ref="AngleDoubleLeft"
      icon="angle-double-left"
      class="pagingIcon"
      :class="page === 1 ? 'disabled' : 'enabled'"
      @click="page = 1"
    />
    <font-awesome-icon
      ref="AngleLeft"
      icon="angle-left"
      class="pagingIcon"
      :class="page === 1 ? 'disabled' : 'enabled'"
      @click="page === 1 ? 1 : page--"
    />

    <input
      id="pageInput"
      ref="pageInput"
      v-model="page"
      class="pageInput"
    >

    <font-awesome-icon
      ref="AngleRight"
      icon="angle-right"
      class="pagingIcon"
      :class="page === lastPage ? 'disabled' : 'enabled'"
      @click="page === lastPage ? lastPage : page++"
    />
    <font-awesome-icon
      ref="AngleDoubleRight"
      icon="angle-double-right"
      class="pagingIcon"
      :class="page === lastPage ? 'disabled' : 'enabled'"
      @click="page = lastPage"
    />
  </div>
</template>

<style scoped>
.pagingIcon {
  margin: 0 5px 0 5px;
}

.pageInput {
  width: 40px;
}

.disabled {
  color: darkgray;
}
</style>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleRight,
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleRight);
library.add(faAngleLeft);
library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);

export default {
  name: "EasyPages",
  components: { FontAwesomeIcon },
  // TODO: Prop validation
  props: {
    numberOfitems: { type: Number, required: true },
    itemsPerPage: { type: Number, default: 10 },
  },
  data() {
    return {
      page: 1,
    };
  },
  computed: {
    lastPage() {
      return Math.ceil(this.numberOfitems / this.itemsPerPage);
    },
    startIndex() {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      return startIndex;
    },
    endIndex() {
      let endIndex = this.startIndex + this.itemsPerPage;
      if (endIndex > this.numberOfitems) endIndex = this.numberOfitems;
      return endIndex;
    },
    isValidPage() {
      if (!this.page) return false;
      if (isNaN(this.page)) return false;
      if (this.page <= 0) return false;
      if (this.page > this.lastPage) return false;
      return true;
    },
  },
  watch: {
    numberOfitems() {
      this.page = 1;
    },
    startIndex() {
      if (this.isValidPage) this.$emit("update:startIndex", this.startIndex);
    },
    endIndex() {
      if (this.isValidPage) this.$emit("update:endIndex", this.endIndex);
    },
    page(newval, oldval) {
      if (newval === "") return;
      if (!Number.isInteger(newval)) this.page = Math.floor(newval);

      if (isNaN(this.page)) this.page = oldval;
      else if (this.page < 1) this.page = oldval;
      else if (this.page > this.lastPage) this.page = oldval;
    },
  },
  created() {
    this.$emit("update:startIndex", this.startIndex);
    this.$emit("update:endIndex", this.endIndex);
  },
};
</script>
