<template>
  <div>
    <EasyTable
      :columns="columns"
      :rows="teams"
      :fixedHeader="true"
      :enableRadioButtons="true"
      :selectedItem.sync="selectedItem"
      :enableCheckBoxes="true"
      :selectedItems.sync="selectedItems"
      id="teamsTable"
      enableAccordianforDetailRow="multi"
    >
      <template v-slot:expandedDetailRowIcon>
        <font-awesome-icon icon="minus" />
      </template>
      <template v-slot:collapsedDetailRowIcon>
        <font-awesome-icon icon="plus" />
      </template>

      <template v-slot:edit="row">
        <button>Edit {{ row.name }}</button>
      </template>
      <template v-slot:detailRowSlot="row">
        <EasyTable
          id="playersTable"
          :columns="playerColumns"
          :rows="row.players"
        />
      </template>
    </EasyTable>

    <div>Selected Team: {{ selectedItem ? selectedItem.name : "none" }}</div>
    <div>Selected Teams: {{ selectedItems.map((i) => i.name).join(", ") }}</div>
  </div>
</template>

<style scoped>
#teamsTable /deep/ .headerName {
  font-style: italic;
}
#teamsTable /deep/ .name {
  color: blue;
}

#teamsTable /deep/ .headerWins {
  font-style: italic;
}
#teamsTable /deep/ .wins {
  color: green;
}

#teamsTable /deep/ .headerLosses {
  font-style: italic;
}
#teamsTable /deep/ .losses {
  color: red;
}

/* /deep/ .evenColumn {
  background-color: rgba(220, 220, 220, 0.5);
}

/deep/ .oddColumn {
  background-color: rgba(220, 220, 220, 0.2);
} */

#teamsTable /deep/ .evenRow {
  background-color: rgba(240, 248, 255, 0.5);
}

#teamsTable /deep/ .oddRow {
  background-color: rgba(240, 248, 255, 0.2);
}

#playersTable {
  position: relative;
  left: 2em;
  width: 400px;
}
#playersTable /deep/ .name {
  color: black;
}
</style>

<script>
import EasyTable from "./EasyTable";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faPlus);
library.add(faMinus);

export default {
  name: "Demo",
  components: {
    EasyTable,
    FontAwesomeIcon,
  },
  data() {
    return {
      selectedItem: null,
      selectedItems: [],
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
      playerColumns: [
        {
          header: "Player Name",
          property: "name",
          initialSort: true,
        },
        {
          header: "Baskets",
          property: "baskets",
          sortable: true,
        },
        {
          header: "Assists",
          property: "assists",
          sortable: true,
        },
      ],
      teams: [
        {
          name: "Panthers",
          wins: 6,
          losses: 18,
          players: [
            {
              name: "Jay",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Ali",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Ben",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Mary",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Treyvon",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Bobcats",
          wins: 8,
          losses: 16,
          players: [
            {
              name: "Jasper",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Amelia",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Theo",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Ava",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Charlotte",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Unicorns",
          wins: 24,
          losses: 0,
          players: [
            {
              name: "Ben",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Grace",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Oli",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Lydia",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Tim",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Slugs",
          wins: 0,
          losses: 24,
          players: [
            {
              name: "Jay",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Ali",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Ben",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Mary",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Lupe",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Lions",
          wins: 12,
          losses: 12,
          players: [
            {
              name: "Aadi",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Aalam",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Aaliyah",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Aaralyn",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Aba",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Whales",
          wins: 13,
          losses: 11,
          players: [
            {
              name: "Baara",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Bae",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Baha",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Bailey",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Balin",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Bulldogs",
          wins: 6,
          losses: 8,
          players: [
            {
              name: "Cadee",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Cadence",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Cain",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Cal",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Caleb",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Dolphins",
          wins: 11,
          losses: 13,
          players: [
            {
              name: "Dagen",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Dillin",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Dalia",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Dama",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Daisy",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Eagles",
          wins: 16,
          losses: 8,
          players: [
            {
              name: "Earl",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Eddie",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Edna",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Ebba",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Edith",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Sharks",
          wins: 8,
          losses: 16,
          players: [
            {
              name: "Faber",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Fala",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Fantasia",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Fabio",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Falk",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Dragons",
          wins: 24,
          losses: 0,
          players: [
            {
              name: "Gabby",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Galen",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Gabe",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Galia",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Gaius",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Snails",
          wins: 0,
          losses: 24,
          players: [
            {
              name: "Hadi",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Hahn",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Haile",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Hal",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Hodor",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Hornets",
          wins: 7,
          losses: 17,
          players: [
            {
              name: "Iago",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Ian",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Ida",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Idris",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Ianna",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Tigers",
          wins: 12,
          losses: 12,
          players: [
            {
              name: "Ja",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Jacob",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Jaan",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Jadyn",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Jacquelle",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Cheetahs",
          wins: 13,
          losses: 11,
          players: [
            {
              name: "Kaavia",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Kaegan",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Kaelin",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Kailey",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Kai",
              baskets: 156,
              assists: 147,
            },
          ],
        },
        {
          name: "Elephants",
          wins: 11,
          losses: 13,
          players: [
            {
              name: "Lacey",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Laik",
              baskets: 146,
              assists: 99,
            },
            {
              name: "Lali",
              baskets: 99,
              assists: 146,
            },
            {
              name: "Lam",
              baskets: 88,
              assists: 199,
            },
            {
              name: "Lamar",
              baskets: 156,
              assists: 147,
            },
          ],
        },
      ],
    };
  },
  created() {
    this.selectedItem = this.teams[0];
    this.selectedItems.push(this.teams[0]);
    this.selectedItems.push(this.teams[1]);
    this.selectedItems.push(this.teams[2]);
    this.selectedItems.push(this.teams[3]);
    this.selectedItems.push(this.teams[4]);
    this.selectedItems.push(this.teams[5]);
    this.selectedItems.push(this.teams[6]);
    this.selectedItems.push(this.teams[7]);
    this.selectedItems.push(this.teams[8]);
    this.selectedItems.push(this.teams[9]);
    this.selectedItems.push(this.teams[10]);
    this.selectedItems.push(this.teams[11]);
    this.selectedItems.push(this.teams[12]);
    this.selectedItems.push(this.teams[13]);
    this.selectedItems.push(this.teams[14]);
    this.selectedItems.push(this.teams[15]);
    // this.selectedItems.push({ test: "test!!!" });
  },
};
</script>
