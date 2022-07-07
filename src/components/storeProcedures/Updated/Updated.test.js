import React from "react";
import { shallow } from "enzyme";
import Updated from "./Updated";

describe("Updated", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Updated />);
    expect(wrapper).toMatchSnapshot();
  });
});
