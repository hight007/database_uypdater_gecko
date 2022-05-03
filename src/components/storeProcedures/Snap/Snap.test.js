import React from "react";
import { shallow } from "enzyme";
import Snap from "./Snap";

describe("Snap", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Snap />);
    expect(wrapper).toMatchSnapshot();
  });
});
