import React from "react";
import { shallow } from "enzyme";
import EventLogRawData from "./eventLogRawData";

describe("EventLogRawData", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<EventLogRawData />);
    expect(wrapper).toMatchSnapshot();
  });
});
