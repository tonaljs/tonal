import { interval, isPitch, note } from "../index";

describe("@tonal/tonal", () => {
  test("isPitch", () => {
    expect(isPitch(note("C4"))).toBe(true);
    expect(isPitch(interval("P4"))).toBe(true);

    expect(isPitch(note("X"))).toBe(false);
    expect(isPitch(undefined)).toBe(false);
    expect(isPitch("")).toBe(false);
  });
});
