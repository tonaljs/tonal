var pcset = require("../index");

const $ = str => str.split(" ");

describe("pcset", () => {
  test("chroma", () => {
    expect(pcset.chroma($("c d e"))).toBe("101010000000");
    expect(pcset.chroma($("g g#4 a bb5"))).toBe("000000011110");
    expect(pcset.chroma($("P1 M2 M3 P4 P5 M6 M7"))).toBe(
      pcset.chroma($("c d e f g a b"))
    );
    expect(pcset.chroma("101010101010")).toBe("101010101010");
  });

  test("intervals", () => {
    expect(pcset.intervals("101010101010")).toEqual($("1P 2M 3M 5d 6m 7m"));
    expect(pcset.intervals("1010")).toEqual([]);
  });

  test("isChroma", () => {
    expect(pcset.isChroma("101010101010")).toBe(true);
    expect(pcset.isChroma("1010101")).toBe(false);
    expect(pcset.isChroma("blah")).toBe(false);
    expect(pcset.isChroma("c d e")).toBe(false);
  });

  test("isSubset", () => {
    expect(pcset.isSubset($("c2 d3"), $("c4 d5 e6"))).toBe(true);
    expect(pcset.isSubset($("c2 d3 e5"), $("c4 d5 e6"))).toBe(true);
    expect(pcset.isSubset($("c d e f"), $("c d e"))).toBe(false);
  });

  test("subset with chroma", () => {
    expect(pcset.isSubset($("101000000000"), $("101010101010"))).toBe(true);
    expect(pcset.isSubset($("111000000000"), $("101010101010"))).toBe(false);
  });

  test("isSuperset", () => {
    expect(pcset.isSuperset($("c2 d3 e4 f5"), $("c d e"))).toBe(true);
    expect(pcset.isSuperset($("e f g"), $("c d e"))).toBe(false);
    expect(pcset.isSuperset($("d e"), $("c d e"))).toBe(false);
  });

  test("isSuperset with chroma", () => {
    expect(pcset.isSuperset("101010101010", "101000000000")).toBe(true);
    expect(pcset.isSuperset("101010101010", "111000000000")).toBe(false);
  });

  test("isEqual", () => {
    expect(pcset.isEqual($("c2 d3 e7 f5"), $("c4 c d5 e6 f1"))).toBeTruthy();
    expect(pcset.isEqual($("c f"))($("c4 c f1"))).toBeTruthy();
  });

  test("includes", () => {
    expect(pcset.includes($("c d e"), "C4")).toBe(true);
    expect(pcset.includes($("c d e"), "C#4")).toBe(false);
  });

  test("filter", () => {
    expect(pcset.filter($("c d e"), $("c2 c#2 d2 c3 c#3 d3"))).toEqual(
      $("c2 d2 c3 d3")
    );
    expect(pcset.filter($("c"))($("c2 c#2 d2 c3 c#3 d3"))).toEqual($("c2 c3"));
  });

  test("modes", () => {
    expect(pcset.modes($("c d e f g a b"))).toEqual([
      "101011010101",
      "101101010110",
      "110101011010",
      "101010110101",
      "101011010110",
      "101101011010",
      "110101101010"
    ]);
    expect(pcset.modes($("c d e f g a b"), false)).toEqual([
      "101011010101",
      "010110101011",
      "101101010110",
      "011010101101",
      "110101011010",
      "101010110101",
      "010101101011",
      "101011010110",
      "010110101101",
      "101101011010",
      "011010110101",
      "110101101010"
    ]);
    expect(pcset.modes("blah bleh")).toEqual([]);
  });
});
