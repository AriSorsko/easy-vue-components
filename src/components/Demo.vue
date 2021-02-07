<template>
  <div>
    <EasyTable :columns="columns" :rows="teams" :fixedHeader="true">
      <template v-slot:edit="row">
        <button>Edit {{ row.name }}</button>
      </template>
    </EasyTable>
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

/* /deep/ .evenColumn {
  background-color: rgba(220, 220, 220, 0.5);
}

/deep/ .oddColumn {
  background-color: rgba(220, 220, 220, 0.2);
} */

/deep/ .evenRow {
  background-color: rgba(240, 248, 255, 0.5);
}

/deep/ .oddRow {
  background-color: rgba(240, 248, 255, 0.2);
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
          width: "140px",
        },
        {
          header: "Number of Losses",
          property: "losses",
          width: "150px",
        },
        {
          header: "Edit",
          property: "edit",
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

        {
          name: "Eagles",
          wins: 16,
          losses: 8,
        },
        {
          name: "Sharks",
          wins: 8,
          losses: 16,
        },
        {
          name: "Dragons",
          wins: 24,
          losses: 0,
        },
        {
          name: "Snails",
          wins: 0,
          losses: 24,
        },
        {
          name: "Tigers",
          wins: 12,
          losses: 12,
        },
        {
          name: "Cheetahs",
          wins: 13,
          losses: 11,
        },
        {
          name: "Elephants",
          wins: 11,
          losses: 13,
        },
      ],
    };
  },
};
</script>
