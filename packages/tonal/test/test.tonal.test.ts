import { interval, isTonal, note } from "../index";

describe("@tonal/tonal", () => {
  test("isTonal", () => {
    expect(isTonal(note("C4"))).toBe(true);
    expect(isTonal(interval("P4"))).toBe(true);
    expect(isTonal(note("X"))).toBe(true);

    expect(isTonal(undefined)).toBe(false);
    expect(isTonal("")).toBe(false);
  });
});
