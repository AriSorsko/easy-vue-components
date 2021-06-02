import "regenerator-runtime/runtime";
import Pages from "@/Pages.vue";
import { mount } from "@vue/test-utils";

const items = [0, 1, 2, 3, 4, 5];
const itemsPerPage = 4;

describe("Pages.vue", () => {
  it("renders the icons and input", () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const doubleLeft = wrapper.findComponent({ ref: "AngleDoubleLeft" });
    const angleLeft = wrapper.findComponent({ ref: "AngleLeft" });
    const pageInput = wrapper.findComponent({ ref: "pageInput" });
    const angleRight = wrapper.findComponent({ ref: "AngleRight" });
    const AngleDoubleRight = wrapper.findComponent({ ref: "AngleDoubleRight" });

    expect(doubleLeft).toBeTruthy();
    expect(angleLeft).toBeTruthy();
    expect(pageInput).toBeTruthy();
    expect(angleRight).toBeTruthy();
    expect(AngleDoubleRight).toBeTruthy();
  });

  it("left and right icons decrement/increment page as appropriate", () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const doubleLeft = wrapper.findComponent({ ref: "AngleDoubleLeft" });
    const angleLeft = wrapper.findComponent({ ref: "AngleLeft" });
    const pageInput = wrapper.findComponent({ ref: "pageInput" });
    const angleRight = wrapper.findComponent({ ref: "AngleRight" });
    const AngleDoubleRight = wrapper.findComponent({ ref: "AngleDoubleRight" });

    expect(doubleLeft).toBeTruthy();
    expect(angleLeft).toBeTruthy();
    expect(pageInput).toBeTruthy();
    expect(angleRight).toBeTruthy();
    expect(AngleDoubleRight).toBeTruthy();
  });

  it("left and right icons decrement/increment page as appropriate", async () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const angleLeft = wrapper.findComponent({ ref: "AngleLeft" });
    const angleRight = wrapper.findComponent({ ref: "AngleRight" });

    expect(wrapper.vm.$data.page).toBe(1);
    await angleRight.trigger("click");
    expect(wrapper.vm.$data.page).toBe(2);

    // can't exceed the max number of pages
    await angleRight.trigger("click");
    expect(wrapper.vm.$data.page).toBe(2);

    await angleLeft.trigger("click");
    expect(wrapper.vm.$data.page).toBe(1);

    // can't go below the first page
    await angleLeft.trigger("click");
    expect(wrapper.vm.$data.page).toBe(1);
  });

  it("Double left and double right icons go to the first and last pages", async () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const angleDoubleLeft = wrapper.findComponent({ ref: "AngleDoubleLeft" });
    const angleDoubleRight = wrapper.findComponent({ ref: "AngleDoubleRight" });

    expect(wrapper.vm.$data.page).toBe(1);

    await angleDoubleRight.trigger("click");
    expect(wrapper.vm.$data.page).toBe(2);

    await angleDoubleLeft.trigger("click");
    expect(wrapper.vm.$data.page).toBe(1);
  });

  it("Page input accepts valid values", async () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const pageInput = wrapper.findComponent({ ref: "pageInput" });

    pageInput.element.value = 2;
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(2);

    pageInput.element.value = 1;
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);
  });

  it("Page input does not accept invalid values", async () => {
    const wrapper = mount(Pages, {
      propsData: {
        numberOfitems: items.length,
        itemsPerPage,
      },
    });

    const pageInput = wrapper.findComponent({ ref: "pageInput" });

    pageInput.element.value = 3;
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);

    pageInput.element.value = "fdldlfgmn";
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);

    pageInput.element.value = "1.9";
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);

    pageInput.element.value = "-1";
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);

    pageInput.element.value = "1,9";
    await pageInput.trigger("input");
    expect(wrapper.vm.page).toBe(1);
  });
});
