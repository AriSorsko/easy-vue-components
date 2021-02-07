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
});
