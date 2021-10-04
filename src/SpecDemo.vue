<template>
  <div>
    <EasyTable
      id="playersTable"
      :columns="columns"
      :rows="rows"
      :groups="groups"
    >
      <template v-slot:groupHeader>
        <span style="font-weight: bold">testing</span>
      </template>
    </EasyTable>
  </div>
</template>

<style scoped></style>

<script>
import EasyTable from "./EasyTable";

export default {
  name: "SpecDemo",
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
      rows: [
        {
          name: "Panthers",
          wins: 16,
          losses: 8,
          details: {
            city: "Charlotte",
          },
        },
        {
          name: "Bobcats",
          wins: 8,
          losses: 16,
          details: {
            city: "San Francisco",
          },
        },
        {
          name: "Unicorns",
          wins: 24,
          losses: 0,
        },
      ],
      groups: [
        {
          header: "Kitties!!!",
          filter: (team) =>
            ["Panthers", "Tigers", "Lions", "Bobcats"].includes(team.name),
        },
        {
          header: "Magical!!!",
          filter: (team) =>
            ["Dragons", "Unicorns", "Elves"].includes(team.name),
        },
        {
          header: "All!!!",
          filter: () => true,
        },
      ],
    };
  },
};
</script>
