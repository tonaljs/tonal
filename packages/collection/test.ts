import { describe, expect, it, test } from "vitest";
import Collection from "./index";

const $ = (arr: string) => arr.split(" ");

describe("@tonaljs/collection", () => {
  test("range", () => {
    expect(Collection.range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    expect(Collection.range(2, -2)).toEqual([2, 1, 0, -1, -2]);
    expect(Collection.range(3, 3)).toEqual([3]);
  });

  test("range with fractional or infinite bounds", () => {
    expect(Collection.range(1.5, 4)).toEqual([1.5, 2.5, 3.5]);
    expect(Collection.range(4, 1.5)).toEqual([4, 3, 2]);
    expect(Collection.range(0, 0.5)).toEqual([0]);
    expect(Collection.range(0, Infinity)).toEqual([]);
    expect(Collection.range(-Infinity, 0)).toEqual([]);
    expect(Collection.range(NaN, 2)).toEqual([]);
  });

  test("rotate", () => {
    expect(Collection.rotate(2, $("a b c d e"))).toEqual($("c d e a b"));
  });

  test("compact", () => {
    const input = ["a", 1, 0, true, false, null, undefined];
    const result = ["a", 1, 0, true];
    expect(Collection.compact(input)).toEqual(result);
  });

  test("shuffle", () => {
    const rnd = () => 0.2;
    expect(Collection.shuffle($("a b c d"), rnd)).toEqual(["b", "c", "d", "a"]);
  });

  it("permutations", () => {
    expect(Collection.permutations(["a", "b", "c"])).toEqual([
      ["a", "b", "c"],
      ["b", "a", "c"],
      ["b", "c", "a"],
      ["a", "c", "b"],
      ["c", "a", "b"],
      ["c", "b", "a"],
    ]);
  });
});
