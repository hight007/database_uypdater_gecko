import React from "react";
import { shallow } from "enzyme";
import Side_menu from "./side_menu";

describe("Side_menu", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Side_menu />);
    expect(wrapper).toMatchSnapshot();
  });
});
