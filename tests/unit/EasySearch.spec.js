import "regenerator-runtime/runtime";
import EasySearch from "@/EasySearch.vue";
import { mount } from "@vue/test-utils";

describe("EasySearch.vue", () => {
  it("renders the magnifying glass icon and input", () => {
    const wrapper = mount(EasySearch, {
      propsData: {
        searchTerm: "",
      },
    });

    const searchIcon = wrapper.findComponent({ ref: "searchIcon" });
    const easySearch = wrapper.findComponent({ ref: "easySearch" });

    expect(searchIcon).toBeTruthy();
    expect(easySearch).toBeTruthy();
  });

  it("Emits update:searchTerm on input", async () => {
    const wrapper = mount(EasySearch, {
      propsData: {
        searchTerm: "",
      },
    });

    const easySearch = wrapper.find("input");
    await easySearch.setValue("test");
    expect(wrapper.emitted()["update:searchTerm"][0][0]).toBe("test");
    expect(wrapper.emitted()["update:searchTerm"].length).toBe(1);
  });
});
