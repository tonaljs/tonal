import Pcset from "./index";

const $ = (str: string) => str.split(" ");

describe("@tonaljs/pcset", () => {
  describe("pcset", () => {
    test("from note list", () => {
      expect(Pcset.get(["c", "d", "e"])).toEqual({
        empty: false,
        name: "",
        setNum: 2688,
        chroma: "101010000000",
        normalized: "100000001010",
        intervals: ["1P", "2M", "3M"]
      });
      expect(Pcset.get(["d", "e", "c"])).toEqual(Pcset.get(["c", "d", "e"]));
      expect(Pcset.get(["not a note or interval"]).empty).toBe(true);
      expect(Pcset.get([]).empty).toBe(true);
    });
    test("from pcset number", () => {
      expect(Pcset.get(2048)).toEqual(Pcset.get(["C"]));
    });
    test("num", () => {
      expect(Pcset.num("000000000001")).toBe(1);
      expect(Pcset.num(["B"])).toBe(1);
      expect(Pcset.num(["Cb"])).toBe(1);
      expect(Pcset.num(["C", "E", "G"])).toBe(2192);
      expect(Pcset.num(["C"])).toBe(2048);
      expect(Pcset.num("100000000000")).toBe(2048);
      expect(Pcset.num("111111111111")).toBe(4095);
    });
    test("normalized", () => {
      const likeC = Pcset.get(["C"]).chroma; // 100000000000
      "cdefgab".split("").forEach(pc => {
        expect(Pcset.get([pc]).normalized).toBe(likeC);
      });
      expect(Pcset.get(["E", "F#"]).normalized).toBe(
        Pcset.get(["C", "D"]).normalized
      );
    });
  });

  test("chroma", () => {
    expect(Pcset.chroma(["C"])).toBe("100000000000");
    expect(Pcset.chroma(["D"])).toBe("001000000000");
    expect(Pcset.chroma($("c d e"))).toBe("101010000000");
    expect(Pcset.chroma($("g g#4 a bb5"))).toBe("000000011110");
    expect(Pcset.chroma($("P1 M2 M3 P4 P5 M6 M7"))).toBe(
      Pcset.chroma($("c d e f g a b"))
    );
    expect(Pcset.chroma("101010101010")).toBe("101010101010");
    expect(Pcset.chroma(["one", "two"])).toBe("000000000000");
    expect(Pcset.chroma("A B C")).toBe("000000000000");
  });

  test("chromas", () => {
    expect(Pcset.chromas().length).toBe(2048);
    expect(Pcset.chromas()[0]).toBe("100000000000");
    expect(Pcset.chromas()[2047]).toBe("111111111111");
  });

  test("intervals", () => {
    expect(Pcset.intervals("101010101010")).toEqual($("1P 2M 3M 5d 6m 7m"));
    expect(Pcset.intervals("1010")).toEqual([]);
    expect(Pcset.intervals(["C", "G", "B"])).toEqual(["1P", "5P", "7M"]);
    expect(Pcset.intervals(["D", "F", "A"])).toEqual(["2M", "4P", "6M"]);
  });

  test("isChroma", () => {
    expect(Pcset.get("101010101010").chroma).toBe("101010101010");
    expect(Pcset.get("1010101").chroma).toBe("000000000000");
    expect(Pcset.get("blah").chroma).toBe("000000000000");
    expect(Pcset.get("c d e").chroma).toBe("000000000000");
  });

  test("isSubsetOf", () => {
    const isInCMajor = Pcset.isSubsetOf($("c4 e6 g"));
    expect(isInCMajor($("c2 g7"))).toBe(true);
    expect(isInCMajor($("c2 e"))).toBe(true);
    expect(isInCMajor($("c2 e3 g4"))).toBe(false);
    expect(isInCMajor($("c2 e3 b5"))).toBe(false);
    expect(Pcset.isSubsetOf($("c d e"))(["C", "D"])).toBe(true);
  });

  test("isSubsetOf with chroma", () => {
    const isSubset = Pcset.isSubsetOf("101010101010");
    expect(isSubset("101000000000")).toBe(true);
    expect(isSubset("111000000000")).toBe(false);
  });

  test("isSupersetOf", () => {
    const extendsCMajor = Pcset.isSupersetOf(["c", "e", "g"]);
    expect(extendsCMajor($("c2 g3 e4 f5"))).toBe(true);
    expect(extendsCMajor($("e c g"))).toBe(false);
    expect(extendsCMajor($("c e f"))).toBe(false);
    expect(Pcset.isSupersetOf(["c", "d"])(["c", "d", "e"])).toBe(true);
  });

  test("isSupersetOf with chroma", () => {
    const isSuperset = Pcset.isSupersetOf("101000000000");
    expect(isSuperset("101010101010")).toBe(true);
    expect(isSuperset("110010101010")).toBe(false);
  });

  test("isEqual", () => {
    expect(Pcset.isEqual($("c2 d3 e7 f5"), $("c4 c d5 e6 f1"))).toBeTruthy();
    expect(Pcset.isEqual($("c f"), $("c4 c f1"))).toBeTruthy();
  });

  test("isNoteIncludedIn", () => {
    const isIncludedInC = Pcset.isNoteIncludedIn(["c", "d", "e"]);
    expect(isIncludedInC("C4")).toBe(true);
    expect(isIncludedInC("C#4")).toBe(false);
  });

  test("filter", () => {
    const inCMajor = Pcset.filter($("c d e"));
    expect(inCMajor($("c2 c#2 d2 c3 c#3 d3"))).toEqual($("c2 d2 c3 d3"));
    expect(Pcset.filter($("c"))($("c2 c#2 d2 c3 c#3 d3"))).toEqual($("c2 c3"));
  });

  test("modes", () => {
    expect(Pcset.modes($("c d e f g a b"))).toEqual([
      "101011010101",
      "101101010110",
      "110101011010",
      "101010110101",
      "101011010110",
      "101101011010",
      "110101101010"
    ]);
    expect(Pcset.modes($("c d e f g a b"), false)).toEqual([
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
    expect(Pcset.modes(["blah", "bleh"])).toEqual([]);
  });
});
