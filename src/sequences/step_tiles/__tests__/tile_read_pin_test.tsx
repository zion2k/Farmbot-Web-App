import * as React from "react";
import { TileReadPin } from "../tile_read_pin";
import { mount } from "enzyme";
import { fakeSequence } from "../../../__test_support__/fake_state/resources";
import { ReadPin } from "farmbot/dist";
import { emptyState } from "../../../resources/reducer";

describe("<TileReadPin/>", () => {
  function bootstrapTest() {
    const currentStep: ReadPin = {
      kind: "read_pin",
      args: {
        pin_number: 3,
        label: "pinlabel",
        pin_mode: 1
      }
    };
    return {
      component: mount(<TileReadPin
        currentSequence={fakeSequence()}
        currentStep={currentStep}
        dispatch={jest.fn()}
        index={0}
        sequences={[]}
        tools={[]}
        slots={[]}
        resources={emptyState().index} />)
    };
  }

  it("renders inputs", () => {
    let block = bootstrapTest().component;
    let inputs = block.find("input");
    let labels = block.find("label");
    expect(inputs.length).toEqual(4);
    expect(labels.length).toEqual(3);
    expect(inputs.first().props().placeholder).toEqual("Read Pin");
    expect(labels.at(0).text()).toEqual("Pin Number");
    expect(inputs.at(1).props().value).toEqual(3);
    expect(labels.at(1).text()).toEqual("Data Label");
    expect(inputs.at(2).props().value).toEqual("pinlabel");
    expect(labels.at(2).text()).toEqual("Pin Mode");
    expect(inputs.at(3).props().value).toEqual(1);
  });
});
