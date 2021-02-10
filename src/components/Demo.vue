<template>
  <div>
    <EasyTable
      :columns="columns"
      :rows="teams"
      :fixedHeader="true"
      :enableRadioButtons="true"
      :selectedItem.sync="selectedItem"
    >
      <template v-slot:edit="row">
        <button>Edit {{ row.name }}</button>
      </template>
    </EasyTable>

    <div>Selected Team: {{ selectedItem ? selectedItem.name : "none" }}</div>
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
      selectedItem: null,
      columns: [
        {
          header: "Team",
          property: "name",
          initialSort: true,
        },
        {
          header: "Number of Wins",
          property: "wins",
          width: "170px",
          sortable: true,
        },
        {
          header: "Number of Losses",
          property: "losses",
          width: "180px",
        },
        {
          header: "Edit",
          property: "edit",
        },
      ],
      teams: [
        {
          name: "Panthers",
          wins: 6,
          losses: 18,
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
          name: "Bobcats",
          wins: 6,
          losses: 8,
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
          name: "Bobcats",
          wins: 7,
          losses: 17,
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
  created() {
    this.selectedItem = this.teams[0];
  },
};
</script>
