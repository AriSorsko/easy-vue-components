import EasyTable from "@/components/EasyTable.vue";
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
];

describe("EasyTable.vue", () => {
  it("renders the column names", () => {
    const wrapper = mount(EasyTable, {
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
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows: [] },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });

    expect(firstHeaderCell.classes()).toContain("headerCell");
    expect(firstHeaderCell.classes()).toContain("losses");
    expect(firstHeaderCell.classes()).toContain("headerLosses");
  });

  it("Fixed header class is included when fixedHeader prop is true", () => {
    const fixedHeader = true;
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows, fixedHeader },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).toContain("fixedHeader");
  });

  it("Fixed header class is not included when fixedHeader prop is ommitted", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).not.toContain("fixedHeader");
  });

  it("All columns are rendered", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1" });
    expect(secondCell.text()).toContain("16");

    const thirdCell = wrapper.findComponent({ ref: "rowCell_0_2" });
    expect(thirdCell.text()).toContain("8");
  });

  it("All rows are rendered", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(firstCell.text()).toContain("Panthers");

    const secondCell = wrapper.findComponent({ ref: "rowCell_1_0" });
    expect(secondCell.text()).toContain("Bobcats");

    const thirdCell = wrapper.findComponent({ ref: "rowCell_2_0" });
    expect(thirdCell.text()).toContain("Unicorns");
  });

  it("Column widths are included in the container style", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const container = wrapper.findComponent({ ref: "container" });
    expect(container.attributes("style")).toBe(
      "grid-template-columns: auto 140px 150px auto;"
    );
  });

  it("Empty table message is rendered when there are no rows", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows: [] },
    });

    expect(wrapper.text()).toContain("There is no data for this table.");
  });

  it("Row cells include the row classes", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(firstCell.classes()).toContain("evenColumn");
    expect(firstCell.classes()).toContain("evenRow");

    const secondCell = wrapper.findComponent({ ref: "rowCell_1_0" });
    expect(secondCell.classes()).toContain("evenColumn");
    expect(secondCell.classes()).toContain("oddRow");
  });

  it("Column cells include the column classes", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });
    const firstHeaderCell = wrapper.findComponent({ ref: "headerCell_0" });
    expect(firstHeaderCell.classes()).toContain("evenColumn");

    const secondHeaderCell = wrapper.findComponent({ ref: "headerCell_1" });
    expect(secondHeaderCell.classes()).toContain("oddColumn");

    const firstCell = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(firstCell.classes()).toContain("evenColumn");

    const secondCell = wrapper.findComponent({ ref: "rowCell_0_1" });
    expect(secondCell.classes()).toContain("oddColumn");
  });

  it("Cells include general cells classes", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });
    const c00 = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(c00.classes()).toContain("row");
    expect(c00.classes()).toContain("name");

    const c01 = wrapper.findComponent({ ref: "rowCell_0_1" });
    expect(c01.classes()).toContain("row");
    expect(c01.classes()).toContain("wins");

    const c02 = wrapper.findComponent({ ref: "rowCell_0_2" });
    expect(c02.classes()).toContain("row");
    expect(c02.classes()).toContain("losses");

    const c10 = wrapper.findComponent({ ref: "rowCell_1_0" });
    expect(c10.classes()).toContain("row");
    expect(c10.classes()).toContain("name");
  });

  it("Default cell content is replacable with slots", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
      scopedSlots: {
        edit: '<p slot-scope="edit">Slot Test</p>',
      },
    });
    expect(wrapper.text()).toContain("Slot Test");
  });

  it("Data starts sorted by initial sort column", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        initialSort: true,
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sortable: true,
      },
    ];

    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const c00 = wrapper.findComponent({ ref: "rowCell_0_0" });
    expect(c00.text()).toBe("Bobcats");
    const c10 = wrapper.findComponent({ ref: "rowCell_1_0" });
    expect(c10.text()).toBe("Panthers");
    const c20 = wrapper.findComponent({ ref: "rowCell_2_0" });
    expect(c20.text()).toBe("Unicorns");
  });

  it("Sortable columns start with down arrow", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        initialSort: true,
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sortable: true,
      },
    ];

    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const ad0 = wrapper.findComponent({ ref: "arrowDown_0" });
    expect(ad0).toBeTruthy();
    const ad1 = wrapper.findComponent({ ref: "arrowDown_1" });
    expect(ad1).toBeTruthy();
  });

  it("Clicking down arrow sorts by that column and changes to up arrow", () => {
    const columns = [
      {
        header: "Team",
        property: "name",
        initialSort: true,
      },
      {
        header: "Number of Wins",
        property: "wins",
        width: "140px",
        sortable: true,
      },
    ];

    const wrapper = mount(EasyTable, {
      propsData: { columns, rows },
    });

    const ad1 = wrapper.findComponent({ ref: "arrowDown_1" });
    ad1.trigger("click").then((result) => {
      const c01 = wrapper.findComponent({ ref: "rowCell_0_1" });
      expect(c01.text()).toBe("24");
      const c11 = wrapper.findComponent({ ref: "rowCell_1_1" });
      expect(c11.text()).toBe("16");
      const c21 = wrapper.findComponent({ ref: "rowCell_2_1" });
      expect(c21.text()).toBe("8");

      const au1 = wrapper.findComponent({ ref: "arrowUp_0" });
      expect(au1).toBeTruthy();
    });
  });

  it("enableRadioButtons prop adds a radio button row", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows, enableRadioButtons: true },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0).toBeTruthy();
  });

  it("enableRadioButtons prop adds a radio button row", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows, enableRadioButtons: true },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0).toBeTruthy;
  });

  it("selectedItem prop toggles the radio button for that row", () => {
    const wrapper = mount(EasyTable, {
      propsData: {
        columns,
        rows,
        enableRadioButtons: true,
        selectedItem: rows[0],
      },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0.element.checked).toBeTruthy();
  });

  it("enableRadioButtons prop adds a radio button row", () => {
    const wrapper = mount(EasyTable, {
      propsData: { columns, rows, enableRadioButtons: true },
    });

    const radio0 = wrapper.findComponent({ ref: "radio_0" });
    expect(radio0).toBeTruthy;
  });

  it("Selecting a radio button emits an update for the selectedItem", () => {
    const wrapper = mount(EasyTable, {
      propsData: {
        columns,
        rows,
        enableRadioButtons: true,
      },
    });

    const radio1 = wrapper.findComponent({ ref: "radio_1" });
    expect(radio1.element.checked).toBeFalsy();
    radio1.trigger("click").then((reult) => {
      expect(radio1.element.checked).toBeTruthy();
      expect(wrapper.emitted("update:selectedItem")[0][0].name).toBe("Bobcats");
    });
  });
});
