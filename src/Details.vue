<template #edit="row">
  <div>
    <button @click="showDetails = true">{{ team.name }} Details</button>

    <div v-if="showDetails" id="detailsDiv">
      win
    </div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  name: "Details",
  props: {
    team: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showDetails: false,
    };
  },
};
</script>
