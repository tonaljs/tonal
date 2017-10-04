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

  test("chromas", () => {
    expect(pcset.chromas().length).toBe(2048);
    expect(pcset.chromas()[0]).toBe("100000000000");
    expect(pcset.chromas()[2047]).toBe("111111111111");
    expect(pcset.chromas(0)).toEqual([]);
    expect(pcset.chromas(1)).toEqual(["100000000000"]);
    expect(pcset.chromas(12)).toEqual(["111111111111"]);
    expect(pcset.chromas(2).length).toEqual(11);
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

  test("isSubsetOf", () => {
    const isInCMajor = pcset.isSubsetOf($("c4 e6 g"));
    expect(isInCMajor($("c2 g7"))).toBe(true);
    expect(isInCMajor($("c2 e"))).toBe(true);
    expect(isInCMajor($("c2 e3 g4"))).toBe(false);
    expect(isInCMajor($("c2 e3 b5"))).toBe(false);
    expect(pcset.isSubsetOf($("c d e"), $("c d"))).toBe(true);
  });

  test("isSubsetOf with chroma", () => {
    const isSubset = pcset.isSubsetOf("101010101010");
    expect(isSubset("101000000000")).toBe(true);
    expect(isSubset("111000000000")).toBe(false);
  });

  test("isSupersetOf", () => {
    const extendsCMajor = pcset.isSupersetOf(["c", "e", "g"]);
    expect(extendsCMajor($("c2 g3 e4 f5"))).toBe(true);
    expect(extendsCMajor($("e c g"))).toBe(false);
    expect(extendsCMajor($("c e f"))).toBe(false);
    expect(pcset.isSupersetOf(["c", "d"], ["c", "d", "e"])).toBe(true);
  });

  test("isSupersetOf with chroma", () => {
    const isSuperset = pcset.isSupersetOf("101000000000");
    expect(isSuperset("101010101010")).toBe(true);
    expect(isSuperset("110010101010")).toBe(false);
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
