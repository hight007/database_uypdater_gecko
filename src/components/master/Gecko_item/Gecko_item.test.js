import React from "react";
import { shallow } from "enzyme";
import Gecko_item from "./Gecko_item";

describe("Gecko_item", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Gecko_item />);
    expect(wrapper).toMatchSnapshot();
  });
});
