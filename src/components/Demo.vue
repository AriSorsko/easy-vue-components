<template>
  <div>
    <EasyTable :columns="columns" :rows="teams" />
  </div>
</template>

<style scoped></style>

<script>
import EasyTable from "./EasyTable";

export default {
  name: "Demo",
  components: {
    EasyTable,
  },
  data() {
    return {
      columns: [
        {
          header: "Team",
          property: "name",
        },
        {
          header: "Number of Wins",
          property: "wins",
        },
        {
          header: "Number of Loses",
          property: "losses",
        },
      ],
      teams: [
        {
          name: "Panthers",
          wins: 16,
          losses: 8,
        },
        {
          name: "Bobcats",
          wins: 8,
          losses: 16,
        },
        {
          name: "Unicorns",
          wins: 24,
          losses: 0,
        },
        {
          name: "Slugs",
          wins: 0,
          losses: 24,
        },
        {
          name: "Lions",
          wins: 12,
          losses: 12,
        },
        {
          name: "Whales",
          wins: 13,
          losses: 11,
        },
        {
          name: "Dolphins",
          wins: 11,
          losses: 13,
        },
      ],
    };
  },
};
</script>
