import { describe, expect, test } from "vitest";
import TimeSignature from "./index";

describe("time-signature", () => {
  test("get", () => {
    expect(TimeSignature.get("4/4")).toEqual({
      empty: false,
      name: "4/4",
      type: "simple",
      upper: 4,
      lower: 4,
      additive: [],
    });
  });

  test("get invalid", () => {
    expect(TimeSignature.get("0/0").empty).toBe(true);
  });

  test("does not throw on input that is not a time signature", () => {
    // Regression for #490: "C" (common time) and other non-matching input
    // used to throw "Cannot read properties of undefined (reading 'split')".
    for (const input of ["C", "", "x", "4", "/", "abc"]) {
      expect(() => TimeSignature.get(input)).not.toThrow();
      expect(TimeSignature.get(input).empty).toBe(true);
    }
    // A valid signature still parses correctly.
    expect(TimeSignature.get("4/4").empty).toBe(false);
    expect(TimeSignature.get("4/4").name).toBe("4/4");
  });

  test("simple", () => {
    expect(TimeSignature.get("4/4").type).toEqual("simple");
    expect(TimeSignature.get("3/4").type).toEqual("simple");
    expect(TimeSignature.get("2/4").type).toEqual("simple");
    expect(TimeSignature.get("2/2").type).toEqual("simple");
  });
  test("compound", () => {
    expect(TimeSignature.get("3/8").type).toEqual("compound");
    expect(TimeSignature.get("6/8").type).toEqual("compound");
    expect(TimeSignature.get("9/8").type).toEqual("compound");
    expect(TimeSignature.get("12/8").type).toEqual("compound");
  });

  test("irregular", () => {
    expect(TimeSignature.get("2+3+3/8").type).toEqual("irregular");
    expect(TimeSignature.get("3+2+2/8").type).toEqual("irregular");
  });

  test("irrational", () => {
    expect(TimeSignature.get("12/10").type).toEqual("irrational");
    expect(TimeSignature.get("12/19").type).toEqual("irrational");
  });

  test("names", () => {
    expect(TimeSignature.names()).toEqual([
      "4/4",
      "3/4",
      "2/4",
      "2/2",
      "12/8",
      "9/8",
      "6/8",
      "3/8",
    ]);
  });
});
