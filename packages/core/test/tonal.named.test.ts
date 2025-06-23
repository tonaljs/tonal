import { describe, expect, test } from "vitest";
import { interval, isNamedPitch, note } from "../index";

describe("@tonaljs/core", () => {
  test("isNamedPitch", () => {
    expect(isNamedPitch(note("C4"))).toBe(true);
    expect(isNamedPitch(interval("P4"))).toBe(true);
    expect(isNamedPitch(note("X"))).toBe(true);

    expect(isNamedPitch(undefined)).toBe(false);
    expect(isNamedPitch(null)).toBe(false);
    expect(isNamedPitch("")).toBe(false);
  });
});
