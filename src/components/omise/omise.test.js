import React from "react";
import { shallow } from "enzyme";
import Omise from "./omise";

describe("Omise", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Omise />);
    expect(wrapper).toMatchSnapshot();
  });
});
