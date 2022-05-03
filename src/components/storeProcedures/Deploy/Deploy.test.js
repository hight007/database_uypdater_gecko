import React from "react";
import { shallow } from "enzyme";
import Deploy from "./Deploy";

describe("Deploy", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Deploy />);
    expect(wrapper).toMatchSnapshot();
  });
});
