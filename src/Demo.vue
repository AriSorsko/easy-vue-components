<template>
  <div>
    <EasyTable
      id="teamsTable"
      :showTableEasySearch="true"
      :groups="groups"
      :fixedHeader="true"
      :enableDetailRowAccordian="true"
      :onlyShowOneDetailRow="true"
      :columns="columns"
      :rows="teams"
      :rowsPerPage="16"
      :highlightOptions="highlightOptions"
      :enableRadioButtons="true"
      :selectedItem.sync="selectedItem"
      :enableCheckBoxes="true"
      :selectedItems.sync="selectedItems"
    >
      <!-- 
      :enableSearchFilter="false"
      :enableSearchHighlight="false"
       -->
      <!-- <template v-slot:sortAscendingIcon>
        asc!
      </template>
      <template v-slot:sortDescendingIcon>
        desc!
      </template>
      <template v-slot:noDataMessage>
        No Data here!
      </template> -->
      <template v-slot:headerLosses="group"> {{ group.header }} :'( </template>
      <template v-slot:expandedDetailRowIcon>
        <font-awesome-icon icon="minus" />
      </template>
      <template v-slot:collapsedDetailRowIcon>
        <font-awesome-icon icon="plus" />
      </template>
      <!-- <template v-slot:groupHeader="group">
        <span style="font-weight: bold">{{ group.header }}</span>
      </template> -->

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
#teamsTable {
  border: 2px solid gray;
}
#teamsTable /deep/ .row {
  border-bottom: 2px solid darkcyan;
}
#teamsTable /deep/ .name {
  border-right: 2px solid darkgray;
}

#playersTable {
  position: relative;
  left: 2em;
  width: 400px;
}

#teamsTable /deep/ .teamName {
  font-family: "Courier New", Courier, monospace;
}
#teamsTable /deep/ .nextGame {
  background-color: lightgreen;
}
#teamsTable /deep/ .nextGame.lastGamePassed {
  background-color: lightyellow;
}

#teamsTable /deep/ .row:hover div {
  background-color: lightgray;
}

/* #teamsTable /deep/ .headerName {
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

#teamsTable /deep/ .evenRow {
  background-color: rgba(240, 248, 255, 0.5);
}

#teamsTable /deep/ .oddRow {
  background-color: rgba(240, 248, 255, 0.2);
}
#playersTable /deep/ .name {
  color: black;
}

#teamsTable /deep/ .groupHeader {
  color: purple;
} */

/* /deep/ .evenColumn {
  background-color: rgba(220, 220, 220, 0.5);
}

/deep/ .oddColumn {
  background-color: rgba(220, 220, 220, 0.2);
} */
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
      highlightOptions: {
        exclude: ["button"],
      },
      columns: [
        {
          header: "Team",
          property: "name",
          sort: {
            priority: 0,
            direction: "ascending",
          },
          class: "teamName",
        },
        {
          header: "Wins",
          property: "wins",
          sort: {
            priority: 1,
            direction: "ascending",
          },
        },
        {
          header: "Losses",
          property: "losses",
        },
        {
          header: "Championships",
          property: "details.championships",
          defaultValue: "-",
        },
        {
          header: "School",
          property: "details.school",
          sort: {
            priority: 2,
            direction: "ascending",
          },
        },
        {
          header: "Next Game",
          property: "nextGame",
          sort: {
            priority: 3,
            direction: "ascending",
          },
          format: (cell, team) => {
            const nextGameTime = new Date(cell);
            return nextGameTime.toDateString() + " vs " + team.nextGameOpponent;
          },
          // Override sorting by the result of the format function
          // and instead sort by the original cell value
          sortBy: (nextGameTime) => {
            return nextGameTime;
          },
          classFunction: (team) => {
            if (team.nextGame < Date.now()) return "lastGamePassed";
          },
        },
        {
          // header: "Edit",
          property: "edit",
        },
      ],
      playerColumns: [
        {
          header: "Player Name",
          property: "name",
          sort: {
            priority: 0,
            direction: "ascending",
          },
        },
        {
          header: "Baskets",
          property: "baskets",
          sort: {
            priority: 1,
            direction: "ascending",
          },
        },
        {
          header: "Assists",
          property: "assists",
          sort: {
            priority: 2,
            direction: "ascending",
          },
        },
      ],
      teams: [
        {
          name: "Panthers",
          wins: 6,
          losses: 18,
          nextGame: 1644646969181,
          nextGameOpponent: "Hornets",
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
          details: {
            school: "Wichita High",
            championships: 2,
            yearsPlayed: 22,
          },
        },
        {
          name: "Bobcats",
          wins: 8,
          losses: 16,
          nextGame: 1633586969181,
          nextGameOpponent: "Panthers",
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
          details: {
            school: "Tulsa High",
            championships: 2,
            yearsPlayed: 22,
          },
        },
        {
          name: "Unicorns",
          wins: 24,
          losses: 0,
          nextGame: 1633476969181,
          nextGameOpponent: "Bobcats",
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
          details: {
            school: "Dallas High",
            yearsPlayed: 22,
          },
        },
        {
          name: "Slugs",
          wins: 23,
          losses: 1,
          nextGame: 1633446969181,
          nextGameOpponent: "Sharks",
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
          details: {
            school: "Atlanta Arts High",
            championships: 1,
            yearsPlayed: 18,
          },
        },
        {
          name: "Whales",
          wins: 11,
          losses: 13,
          nextGame: 1633446969181,
          nextGameOpponent: "Elephants",
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
          details: {
            school: "Seattle High",
            yearsPlayed: 28,
          },
        },
        {
          name: "Bulldogs",
          wins: 22,
          losses: 2,
          nextGame: 1633446969181,
          nextGameOpponent: "Snails",
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
          details: {
            school: "San Francisco High",
            championships: 5,
            yearsPlayed: 18,
          },
        },
        {
          name: "Dolphins",
          wins: 20,
          losses: 4,
          nextGame: 1633966979181,
          nextGameOpponent: "Whales",
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
          details: {
            school: "Los Angeles High",
            championships: 5,
            yearsPlayed: 29,
          },
        },
        {
          name: "Eagles",
          wins: 16,
          losses: 8,
          nextGame: 1633456989181,
          nextGameOpponent: "Tigers",
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
          details: {
            school: "Denver High",
            yearsPlayed: 3,
          },
        },
        {
          name: "Sharks",
          wins: 8,
          losses: 16,
          nextGame: 1633476999181,
          nextGameOpponent: "Lions",
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
          details: {
            school: "Charlotte High",
            championships: 1,
            yearsPlayed: 13,
          },
        },
        {
          name: "Dragons",
          wins: 24,
          losses: 0,
          nextGame: 1633447969181,
          nextGameOpponent: "Cheetahs",
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
          details: {
            school: "Houston High",
            championships: 1,
            yearsPlayed: 17,
          },
        },
        {
          name: "Snails",
          wins: 0,
          losses: 24,
          nextGame: 1633448969181,
          nextGameOpponent: "Dolphins",
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
          details: {
            school: "Miami High",
            championships: 2,
            yearsPlayed: 20,
          },
        },
        {
          name: "Hornets",
          wins: 7,
          losses: 17,
          nextGame: 1634449969181,
          nextGameOpponent: "Unicorns",
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
          details: {
            school: "Birmingham High",
            yearsPlayed: 4,
          },
        },
        {
          name: "Cheetahs",
          wins: 13,
          losses: 11,
          nextGame: 1634546969181,
          nextGameOpponent: "Eagles",
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
          details: {
            school: "Boston High",
            championships: 2,
            yearsPlayed: 24,
          },
        },
        {
          name: "Elephants",
          wins: 11,
          losses: 13,
          nextGame: 1633456969181,
          nextGameOpponent: "Dragons",
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
      groups: [
        {
          header: "Teams with a winning season",
          filter: (team) => {
            return team.wins > team.losses;
          },
        },
        {
          header: "Teams with a tied season",
          rows: [
            {
              name: "Lions",
              wins: 12,
              losses: 12,
              nextGame: 1633446969181,
              nextGameOpponent: "Slugs",
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
              details: {
                school: "NYC High",
                yearsPlayed: 2,
              },
            },
            {
              name: "Tigers",
              wins: 12,
              losses: 12,
              nextGame: 1633446969181,
              nextGameOpponent: "Bulldogs",
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
              details: {
                school: "DC High",
                championships: 3,
                yearsPlayed: 27,
              },
            },
          ],
        },
        {
          header: "Teams with a losing season",
          filter: (team) => {
            return team.wins < team.losses;
          },
        },
        {
          header: "All Teams",
          filter: () => true,
        },
      ],
    };
  },
  created() {
    this.selectedItem = this.teams[0];
    // this.selectedItem = { a: "foo", b: "bar" };
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
    // this.selectedItems.push({ test: "test!!!" });

    this.$nextTick(() => {
      this.$nextTick(() => {
        this.selectedItem = this.teams[1];
        this.selectedItems.push(this.groups[1].rows[0]);
        this.selectedItems.push(this.groups[1].rows[1]);
      });
    });
  },
};
</script>
