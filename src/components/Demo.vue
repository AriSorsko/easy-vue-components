<template>
  <div>
    <EasyTable :columns="columns" :rows="teams" />
  </div>
</template>

<style scoped>
/deep/ .headerName {
  font-style: italic;
}
/deep/ .name {
  color: blue;
}

/deep/ .headerWins {
  font-style: italic;
}
/deep/ .wins {
  color: green;
}

/deep/ .headerLosses {
  font-style: italic;
}
/deep/ .losses {
  color: red;
}
</style>

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
          width: "130px",
        },
        {
          header: "Number of Losses",
          property: "losses",
          width: "140px",
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
