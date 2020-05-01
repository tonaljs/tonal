import ScaleDictionary from "./index";
import ScaleType from "@tonaljs/scale-type";

describe("@tonaljs/scale-dictionary", () => {
  test("alias of ScaleType", () => {
    expect(ScaleDictionary).toEqual(ScaleType);
  });
});
