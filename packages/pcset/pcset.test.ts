import {
  chromas,
  EmptyPcset,
  filter,
  isEqual,
  isNoteIncludedInSet,
  isSubsetOf,
  isSupersetOf,
  modes,
  pcset
} from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/pcset", () => {
  describe("pcset", () => {
    test("from note list", () => {
      expect(pcset(["c", "d", "e"])).toEqual({
        empty: false,
        name: "",
        setNum: 2688,
        chroma: "101010000000",
        normalized: "100000001010",
        intervals: ["1P", "2M", "3M"]
      });
      expect(pcset(["d", "e", "c"])).toEqual(pcset(["c", "d", "e"]));
      expect(pcset(["not a note or interval"])).toEqual(EmptyPcset);
      expect(pcset([])).toEqual(EmptyPcset);
    });
    test("from pcset number", () => {
      expect(pcset(2048)).toEqual(pcset(["C"]));
    });
    test("setNum", () => {
      expect(pcset("000000000001").setNum).toBe(1);
      expect(pcset(["B"]).setNum).toBe(1);
      expect(pcset(["Cb"]).setNum).toBe(1);
      expect(pcset(["C"]).setNum).toBe(2048);
      expect(pcset("100000000000").setNum).toBe(2048);
      expect(pcset("111111111111").setNum).toBe(4095);
    });
    test("normalized", () => {
      const likeC = pcset(["C"]).chroma; // 100000000000
      "cdefgab".split("").forEach(pc => {
        expect(pcset([pc]).normalized).toBe(likeC);
      });
      expect(pcset(["E", "F#"]).normalized).toBe(pcset(["C", "D"]).normalized);
    });
  });
  test("chroma", () => {
    expect(pcset(["C"]).chroma).toBe("100000000000");
    expect(pcset(["D"]).chroma).toBe("001000000000");
    expect(pcset($("c d e")).chroma).toBe("101010000000");
    expect(pcset($("g g#4 a bb5")).chroma).toBe("000000011110");
    expect(pcset($("P1 M2 M3 P4 P5 M6 M7")).chroma).toBe(
      pcset($("c d e f g a b")).chroma
    );
    expect(pcset("101010101010").chroma).toBe("101010101010");
    expect(pcset(["one", "two"]).chroma).toBe("000000000000");
    expect(pcset("A B C").chroma).toBe("000000000000");
  });

  test("chromas", () => {
    expect(chromas().length).toBe(2048);
    expect(chromas()[0]).toBe("100000000000");
    expect(chromas()[2047]).toBe("111111111111");
  });

  test("intervals", () => {
    expect(pcset("101010101010").intervals).toEqual($("1P 2M 3M 5d 6m 7m"));
    expect(pcset("1010").intervals).toEqual([]);
    expect(pcset(["D", "F", "A"]).intervals).toEqual(["2M", "4P", "6M"]);
  });

  test("isChroma", () => {
    expect(pcset("101010101010").chroma).toBe("101010101010");
    expect(pcset("1010101").chroma).toBe("000000000000");
    expect(pcset("blah").chroma).toBe("000000000000");
    expect(pcset("c d e").chroma).toBe("000000000000");
  });

  test("isSubsetOf", () => {
    const isInCMajor = isSubsetOf($("c4 e6 g"));
    expect(isInCMajor($("c2 g7"))).toBe(true);
    expect(isInCMajor($("c2 e"))).toBe(true);
    expect(isInCMajor($("c2 e3 g4"))).toBe(false);
    expect(isInCMajor($("c2 e3 b5"))).toBe(false);
    expect(isSubsetOf($("c d e"))(["C", "D"])).toBe(true);
  });

  test("isSubsetOf with chroma", () => {
    const isSubset = isSubsetOf("101010101010");
    expect(isSubset("101000000000")).toBe(true);
    expect(isSubset("111000000000")).toBe(false);
  });

  test("isSupersetOf", () => {
    const extendsCMajor = isSupersetOf(["c", "e", "g"]);
    expect(extendsCMajor($("c2 g3 e4 f5"))).toBe(true);
    expect(extendsCMajor($("e c g"))).toBe(false);
    expect(extendsCMajor($("c e f"))).toBe(false);
    expect(isSupersetOf(["c", "d"])(["c", "d", "e"])).toBe(true);
  });

  test("isSupersetOf with chroma", () => {
    const isSuperset = isSupersetOf("101000000000");
    expect(isSuperset("101010101010")).toBe(true);
    expect(isSuperset("110010101010")).toBe(false);
  });

  test("isEqual", () => {
    expect(isEqual($("c2 d3 e7 f5"), $("c4 c d5 e6 f1"))).toBeTruthy();
    expect(isEqual($("c f"), $("c4 c f1"))).toBeTruthy();
  });

  test("includes", () => {
    const isIncludedInC = isNoteIncludedInSet(["c", "d", "e"]);
    expect(isIncludedInC("C4")).toBe(true);
    expect(isIncludedInC("C#4")).toBe(false);
  });

  test("filter", () => {
    const inCMajor = filter($("c d e"));
    expect(inCMajor($("c2 c#2 d2 c3 c#3 d3"))).toEqual($("c2 d2 c3 d3"));
    expect(filter($("c"))($("c2 c#2 d2 c3 c#3 d3"))).toEqual($("c2 c3"));
  });

  test("modes", () => {
    expect(modes($("c d e f g a b"))).toEqual([
      "101011010101",
      "101101010110",
      "110101011010",
      "101010110101",
      "101011010110",
      "101101011010",
      "110101101010"
    ]);
    expect(modes($("c d e f g a b"), false)).toEqual([
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
    expect(modes(["blah", "bleh"])).toEqual([]);
  });
});
