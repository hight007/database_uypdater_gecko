import React from "react";
import { shallow } from "enzyme";
import Duration_analysis from "./duration_analysis";

describe("Duration_analysis", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Duration_analysis />);
    expect(wrapper).toMatchSnapshot();
  });
});
