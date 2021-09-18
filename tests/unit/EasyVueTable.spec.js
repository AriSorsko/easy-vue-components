import "regenerator-runtime/runtime";
import EasyVueTable from "@/EasyVueTable.vue";
import { mount } from "@vue/test-utils";

const columns = [
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
];
const rows = [
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
];
const groups = [
  {
    header: "Kitties!!!",
    filter: (team) =>
      ["Panthers", "Tigers", "Lions", "Bobcats"].includes(team.name),
  },
  {
    header: "Magical!!!",
    filter: (team) => ["Dragons", "Unicorns", "Elves"].includes(team.name),
  },
  {
    header: "All!!!",
    filter: () => true,
  },
];

describe("EasyVueTable.vue", () => {
  it("renders the column names", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });
    expect(wrapper.text()).toContain("Team");
    expect(wrapper.text()).toContain("Number of Wins");
    expect(wrapper.text()).toContain("Number of Losses");
  });

  it("header cells include the header classes", () => {
    const columns = [
      {
        header: "Number of Losses",
        property: "losses",
        width: "150px",
      },
    ];
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows: [] },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });

    expect(firstHeaderCell.classes()).toContain("headerCell");
    expect(firstHeaderCell.classes()).toContain("losses");
    expect(firstHeaderCell.classes()).toContain("headerLosses");
  });

  it("Fixed header class is included when fixedHeader prop is true", () => {
    const fixedHeader = true;
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, fixedHeader },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).toContain("fixedHeader");
  });

  it("Fixed header class is not included when fixedHeader prop is ommitted", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).not.toContain("fixedHeader");
  });

  it("All columns are rendered", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_0_1" });
    expect(secondCell.text()).toContain("16");

    const thirdCell = wrapper.findComponent({ ref: "rowCell_0_0_2" });
    expect(thirdCell.text()).toContain("8");
  });

  it("All rows are rendered", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(secondCell.text()).toContain("Bobcats");

    const thirdCell = wrapper.findComponent({ ref: "rowCell_0_2_0" });
    expect(thirdCell.text()).toContain("Unicorns");
  });

  it("Column widths are included in the tableContainer style", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const tableContainer = wrapper.findComponent({ ref: "tableContainer" });
    expect(tableContainer.attributes("style")).toBe(
      "grid-template-columns: auto 140px 150px auto;"
    );
  });

  it("Empty table message is rendered when there are no rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows: [] },
    });

    expect(wrapper.text()).toContain("There is no data for this table.");
  });

  it("Row cells include the row classes", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.classes()).toContain("evenColumn");
    expect(firstCell.classes()).toContain("evenRow");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(secondCell.classes()).toContain("evenColumn");
    expect(secondCell.classes()).toContain("oddRow");
  });

  it("Column cells include the column classes", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });
    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).toContain("evenColumn");

    const secondHeaderCell = wrapper.findComponent({ ref: "headerCell_1" });
    expect(secondHeaderCell.classes()).toContain("oddColumn");

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.classes()).toContain("evenColumn");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_0_1" });
    expect(secondCell.classes()).toContain("oddColumn");
  });

  it("Cells include general cells classes", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });
    const c00 = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(c00.classes()).toContain("row");
    expect(c00.classes()).toContain("name");

    const c01 = wrapper.findComponent({ ref: "rowCell_0_0_1" });
    expect(c01.classes()).toContain("row");
    expect(c01.classes()).toContain("wins");

    const c02 = wrapper.findComponent({ ref: "rowCell_0_0_2" });
    expect(c02.classes()).toContain("row");
    expect(c02.classes()).toContain("losses");

    const c10 = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(c10.classes()).toContain("row");
    expect(c10.classes()).toContain("name");
  });

  it("Default cell content is replacable with slots", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
      scopedSlots: {
        edit: '<p slot-scope="edit">Slot Test</p>',
      },
    });
    expect(wrapper.text()).toContain("Slot Test");
  });

  it("Header cell content is replacable with slots", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
      scopedSlots: {
        headerTeam: '<p slot-scope="headerTeam">Heading cell Test</p>',
      },
    });
    expect(wrapper.text()).toContain("Heading cell Test");
  });

  it("Group heading content is replacable with slots", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, groups },
      scopedSlots: {
        groupHeader: '<p slot-scope="groupHeader">Group Heading Test</p>',
      },
    });
    expect(wrapper.text()).toContain("Group Heading Test");
  });

  it("Sort icons are replacable with slots", () => {
    const sortableColumns = [
      {
        header: "Team",
        property: "name",
        sort: {
          priority: 0,
          direction: "ascending",
        },
      },
    ];
    const wrapper = mount(EasyVueTable, {
      propsData: { columns: sortableColumns, rows },
      scopedSlots: {
        sortAscendingIcon: '<p slot-scope="sortAscendingIcon">Ascending</p>',
      },
    });
    expect(wrapper.text()).toContain("Ascending");
  });

  it("Data starts sorted by the first priority column", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        sort: {
          priority: 0,
          direction: "ascending",
        },
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sort: {
          priority: 1,
          direction: "ascending",
        },
      },
    ];

    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const c00 = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(c00.text()).toBe("Bobcats");
    const c10 = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(c10.text()).toBe("Panthers");
    const c20 = wrapper.findComponent({ ref: "rowCell_0_2_0" });
    expect(c20.text()).toBe("Unicorns");
  });

  it("Sortable columns start with an arrow indicating their initial sort direction", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        sort: {
          priority: 0,
          direction: "ascending",
        },
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sort: {
          priority: 1,
          direction: "descending",
        },
      },
    ];

    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const ad0 = wrapper.findComponent({ ref: "arrowDown_0" });
    expect(ad0).toBeTruthy();
    const ad1 = wrapper.findComponent({ ref: "arrowUp_1" });
    expect(ad1).toBeTruthy();
  });

  it("Clicking down arrow sorts by that column and changes to up arrow", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        sort: {
          priority: 0,
          direction: "ascending",
        },
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sort: {
          priority: 2,
          direction: "ascending",
        },
      },
    ];

    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
    });

    const ad1 = wrapper.findComponent({ ref: "arrowDown_1" });
    ad1.trigger("click").then(() => {
      const c01 = wrapper.findComponent({ ref: "rowCell_0_0_1" });
      expect(c01.text()).toBe("24");
      const c11 = wrapper.findComponent({ ref: "rowCell_0_1_1" });
      expect(c11.text()).toBe("16");
      const c21 = wrapper.findComponent({ ref: "rowCell_0_2_1" });
      expect(c21.text()).toBe("8");

      const au1 = wrapper.findComponent({ ref: "arrowUp_0" });
      expect(au1).toBeTruthy();
    });
  });

  it("Passing a value to the selectedItem prop adds a radio button column", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, selectedItem: {} },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0).toBeTruthy;
  });

  it("selectedItem prop toggles the radio button for that row", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItem: rows[0],
      },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0.element.checked).toBeTruthy();
  });

  it("Selecting a radio button emits an update for the selectedItem", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItem: {},
      },
    });

    const radio1 = wrapper.findComponent({ ref: "radio_1" });
    expect(radio1.element.checked).toBeFalsy();
    radio1.trigger("click").then(() => {
      expect(radio1.element.checked).toBeTruthy();
      expect(wrapper.emitted("update:selectedItem")[0][0].name).toBe("Bobcats");
    });
  });

  it("Passing a value to the selectedItems prop adds a checkboxes column", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, selectedItems: [] },
    });

    const check0 = wrapper.findComponent({ ref: "check_0" });
    expect(check0).toBeTruthy();
  });

  it("selectedItems prop toggles the check boxes for those rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [rows[0], rows[1]],
      },
    });

    const check0 = wrapper.findComponent({ ref: "check_0" });
    expect(check0.element.checked).toBeTruthy();
    const check1 = wrapper.findComponent({ ref: "check_1" });
    expect(check1.element.checked).toBeTruthy();
    const check2 = wrapper.findComponent({ ref: "check_2" });
    expect(check2.element.checked).toBeFalsy();
  });

  it("Selecting a check box emits an update for the selectedItems", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [],
      },
    });

    const check1 = wrapper.findComponent({ ref: "check_1" });
    expect(check1.element.checked).toBeFalsy();
    check1.trigger("click").then(() => {
      expect(check1.element.checked).toBeTruthy();
      expect(wrapper.emitted("update:selectedItems")[0][0][0].name).toBe(
        "Bobcats"
      );
    });
  });

  it("Header checkbox is checked when all rows are selected", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [rows[0], rows[1], rows[2]],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeTruthy();
    expect(checkAll.element.indeterminate).toBeFalsy();
  });

  it("Header checkbox is not checked when no rows are selected", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeFalsy();
    expect(checkAll.element.indeterminate).toBeFalsy();
  });

  it("Header checkbox is indeterminate when some rows are selected", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [rows[0]],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeFalsy();
    expect(checkAll.element.indeterminate).toBeTruthy();
  });

  it("Clicking header checkbox when no rows are selected selects all rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeFalsy();
    expect(checkAll.element.indeterminate).toBeFalsy();
    checkAll.trigger("click").then(() => {
      expect(checkAll.element.checked).toBeTruthy();
      expect(checkAll.element.indeterminate).toBeFalsy();
      const check0 = wrapper.findComponent({ ref: "check_0" });
      expect(check0.element.checked).toBeTruthy();
      const check1 = wrapper.findComponent({ ref: "check_1" });
      expect(check1.element.checked).toBeTruthy();
      const check2 = wrapper.findComponent({ ref: "check_2" });
      expect(check2.element.checked).toBeTruthy();
    });
  });

  it("Clicking header checkbox when some rows are selected selects all rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [rows[0]],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeFalsy();
    expect(checkAll.element.indeterminate).toBeTruthy();
    checkAll.trigger("click").then(() => {
      expect(checkAll.element.checked).toBeTruthy();
      expect(checkAll.element.indeterminate).toBeFalsy();
      const check0 = wrapper.findComponent({ ref: "check_0" });
      expect(check0.element.checked).toBeTruthy();
      const check1 = wrapper.findComponent({ ref: "check_1" });
      expect(check1.element.checked).toBeTruthy();
      const check2 = wrapper.findComponent({ ref: "check_2" });
      expect(check2.element.checked).toBeTruthy();
    });
  });

  it("Clicking header checkbox when all rows are selected deselects all rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        selectedItems: [rows[0], rows[1], rows[2]],
      },
    });

    const checkAll = wrapper.findComponent({ ref: "checkAll" });
    expect(checkAll.element.checked).toBeTruthy();
    expect(checkAll.element.indeterminate).toBeFalsy();
    checkAll.trigger("click").then(() => {
      expect(checkAll.element.checked).toBeFalsy();
      expect(checkAll.element.indeterminate).toBeFalsy();
      const check0 = wrapper.findComponent({ ref: "check_0" });
      expect(check0.element.checked).toBeFalsy();
      const check1 = wrapper.findComponent({ ref: "check_1" });
      expect(check1.element.checked).toBeFalsy();
      const check2 = wrapper.findComponent({ ref: "check_2" });
      expect(check2.element.checked).toBeFalsy();
    });
  });

  it("Detail row cell content is replacable with slots", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows },
      scopedSlots: {
        detailRowSlot: `
        <template v-slot:detailRowSlot="row">
          Some Row Details
        </template>`,
      },
    });
    expect(wrapper.text()).toContain("Some Row Details");
  });

  it("enableDetailRowAccordian prop shows the expand/collapse icons and those icons work", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, enableDetailRowAccordian: true },
    });

    const angleRight0 = wrapper.findComponent({ ref: "angleRight_0" });
    expect(angleRight0).toBeTruthy();
    angleRight0.trigger("click").then(() => {
      const angleDown0 = wrapper.findComponent({ ref: "angleDown_0" });
      expect(angleDown0).toBeTruthy();
    });
  });

  it("onlyShowOneDetailRow closes previously open detail rows when a new detail row is opened", async () => {
    const wrapper = mount(EasyVueTable, {
      propsData: {
        columns,
        rows,
        enableDetailRowAccordian: true,
        onlyShowOneDetailRow: true,
      },
      scopedSlots: {
        detailRowSlot: `
        <template v-slot:detailRowSlot="row">
          Some Row Details:{{row.name}}
        </template>`,
      },
    });

    const angleRight0 = wrapper.findComponent({ ref: "angleRight_0" });
    angleRight0.trigger("click").then(() => {
      expect(wrapper.text()).toContain("Some Row Details:Panthers");
      const angleRight1 = wrapper.findComponent({ ref: "angleRight_1" });
      angleRight1.trigger("click").then(() => {
        expect(wrapper.text()).not.toContain("Some Row Details:Panthers");
        expect(wrapper.text()).toContain("Some Row Details:Bobcats");
      });
    });
  });

  it("The table rows are filtered based on the table search term", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, showTableSearchInput: true },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toContain("Panthers");
    wrapper.setData({ searchTerm: "0" }).then(() => {
      const firstFilteredCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
      expect(firstFilteredCell.text()).toContain("Unicorns");
    });
  });

  it("No matching rows message shows up when the search value filters out all the rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, showTableSearchInput: true },
    });

    expect(wrapper.text()).toContain("Panthers");
    wrapper.setData({ searchTerm: "abc123" }).then(() => {
      expect(wrapper.text()).toContain("No rows match the search");
      expect(wrapper.text()).not.toContain("Panthers");
    });
  });

  it("rowsPerPage prop controls how many pages are displayed", async () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, enablePaging: true, rowsPerPage: 2 },
    });
    // Wait for the pages to finish computing
    await wrapper.findComponent({ ref: "rowCell_0_0_0" });

    expect(wrapper.text()).toContain("Panthers");
    expect(wrapper.text()).toContain("Bobcats");
    expect(wrapper.text()).not.toContain("Unicorns");
  });

  it("rowsPerPage prop controls how many pages are displayed", async () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, enablePaging: true, rowsPerPage: 2 },
    });
    // Wait for the pages to finish computing
    await wrapper.findComponent({ ref: "rowCell_0_0_0" });

    expect(wrapper.text()).toContain("Panthers");
    expect(wrapper.text()).toContain("Bobcats");
    expect(wrapper.text()).not.toContain("Unicorns");
  });

  it("Groups show headers and associated rows", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, groups },
    });

    expect(wrapper.text()).toContain("Panthers");
    expect(wrapper.text()).toContain("Bobcats");
    expect(wrapper.text()).toContain("Unicorns");
    expect(wrapper.text()).toContain("Kitties!!!");
    expect(wrapper.text()).toContain("Magical!!!");
  });

  it("Groups support having same row in multiple groups", () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, groups },
    });

    expect(wrapper.text()).toContain("Kitties!!!");
    expect(wrapper.text()).toContain("Magical!!!");
    expect(wrapper.text()).toContain("All!!!");

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(secondCell.text()).toContain("Bobcats");

    const thirdCell = wrapper.findComponent({ ref: "rowCell_1_0_0" });
    expect(thirdCell.text()).toContain("Unicorns");

    const fourthCell = wrapper.findComponent({ ref: "rowCell_2_0_0" });
    expect(fourthCell.text()).toContain("Panthers");

    const fithCell = wrapper.findComponent({ ref: "rowCell_2_1_0" });
    expect(fithCell.text()).toContain("Bobcats");

    const sixthCell = wrapper.findComponent({ ref: "rowCell_2_2_0" });
    expect(sixthCell.text()).toContain("Unicorns");
  });

  it(`Having a row duplicated in several groups does not make the 
  number or rows exceed the rowsPerPage value`, async () => {
    const wrapper = mount(EasyVueTable, {
      propsData: { columns, rows, groups, enablePaging: true, rowsPerPage: 2 },
    });

    // Wait for the pages to finish computing
    await wrapper.findComponent({ ref: "rowCell_0_0_0" });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(secondCell.text()).toContain("Bobcats");

    expect(wrapper.text()).toContain("Kitties!!!");
    expect(wrapper.text()).not.toContain("Magical!!!");
    expect(wrapper.text()).not.toContain("All!!!");

    expect(wrapper.findComponent({ ref: "rowCell_0_1_0" }).exists()).toBe(true);
    expect(wrapper.findComponent({ ref: "rowCell_1_0_0" }).exists()).toBe(
      false
    );
  });

  it(`Nested properties display properly`, async () => {
    const columnsWithNestedData = [
      {
        header: "City",
        property: "details.city",
        defaultValue: "-",
      },
    ];

    const wrapper = mount(EasyVueTable, {
      propsData: { columns: columnsWithNestedData, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0_0" });
    expect(firstCell.text()).toBe("Charlotte");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1_0" });
    expect(secondCell.text()).toBe("San Francisco");

    // when there is no value, the defaultValue should display instead
    const thirdCell = wrapper.findComponent({ ref: "rowCell_0_2_0" });
    expect(thirdCell.text()).toBe("-");
  });

  it(`Nested properties display properly when there is no value or default value`, async () => {
    const columnsWithNestedData = [
      {
        header: "City",
        property: "details.city",
      },
    ];

    const wrapper = mount(EasyVueTable, {
      propsData: { columns: columnsWithNestedData, rows },
    });

    // when there is no value, the defaultValue should display instead
    const thirdCell = wrapper.findComponent({ ref: "rowCell_0_2_0" });
    expect(thirdCell.text()).toBe("");
  });
});
