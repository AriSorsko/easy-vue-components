import "regenerator-runtime/runtime";
import SearchInput from "@/SearchInput.vue";
import { mount } from "@vue/test-utils";

describe("SearchInput.vue", () => {
  it("renders the magnifying glass icon and input", () => {
    const wrapper = mount(SearchInput, {
      propsData: {
        searchTerm: "",
      },
    });

    const searchIcon = wrapper.findComponent({ ref: "searchIcon" });
    const searchInput = wrapper.findComponent({ ref: "searchInput" });

    expect(searchIcon).toBeTruthy();
    expect(searchInput).toBeTruthy();
  });

  it("Emits update:searchTerm on input", async () => {
    const wrapper = mount(SearchInput, {
      propsData: {
        searchTerm: "",
      },
    });

    const searchInput = wrapper.find("input");
    await searchInput.setValue("test");
    expect(wrapper.emitted()["update:searchTerm"][0][0]).toBe("test");
    expect(wrapper.emitted()["update:searchTerm"].length).toBe(1);
  });
});
