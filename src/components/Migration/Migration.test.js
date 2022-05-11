import React from "react";
import { shallow } from "enzyme";
import Migration from "./Migration";

describe("Migration", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Migration />);
    expect(wrapper).toMatchSnapshot();
  });
});
