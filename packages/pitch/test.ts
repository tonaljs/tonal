import { isPitch } from "./index";

describe("@tonaljs/pitch", () => {
  test("isPitch", () => {
    expect(isPitch({ step: 0, alt: 0, oct: 0, dir: 1 })).toBe(true);
    expect(isPitch({ step: 0, alt: 0, oct: 0 })).toBe(true);
    expect(isPitch({ step: 0, alt: 0 })).toBe(true);

    expect(isPitch({ step: "str", alt: 0 })).toBe(false);
    expect(isPitch({ step: 0, alt: "str" })).toBe(false);
    expect(isPitch({})).toBe(false);
    expect(isPitch("")).toBe(false);
    expect(isPitch(undefined)).toBe(false);
    expect(isPitch(null)).toBe(false);
  });
});
