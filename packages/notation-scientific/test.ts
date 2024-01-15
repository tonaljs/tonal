import { name, parse, tokenize } from "./index";

describe("Scientific Notation", () => {
  test("tokenize", () => {
    expect(tokenize("Cbb5 major")).toEqual(["C", "bb", "5", "major"]);
    expect(tokenize("Ax")).toEqual(["A", "##", "", ""]);
    expect(tokenize("CM")).toEqual(["C", "", "", "M"]);
    expect(tokenize("maj7")).toEqual(["", "", "", "maj7"]);
    expect(tokenize("")).toEqual(["", "", "", ""]);
    expect(tokenize("bb")).toEqual(["B", "b", "", ""]);
    expect(tokenize("##")).toEqual(["", "##", "", ""]);
  });

  test("parse", () => {
    expect(parse("C3")).toEqual({ alt: 0, oct: 3, step: 0 });
    expect(parse("A4")).toEqual({ alt: 0, oct: 4, step: 5 });
    expect(parse("D#")).toEqual({ alt: 1, oct: undefined, step: 1 });
    expect(parse("D##")).toEqual({ alt: 2, oct: undefined, step: 1 });
    expect(parse("D###")).toEqual({ alt: 3, oct: undefined, step: 1 });
    expect(parse("eb")).toEqual({ alt: -1, oct: undefined, step: 2 });
    expect(parse("ebbb")).toEqual({ alt: -3, oct: undefined, step: 2 });
    expect(parse("ebbb3")).toEqual({ alt: -3, oct: 3, step: 2 });
    expect(parse("ebbb-3")).toEqual({ alt: -3, oct: -3, step: 2 });
    expect(parse("ebbbbbb-3")).toEqual({ alt: -6, oct: -3, step: 2 });
    expect(parse("bb")).toEqual(parse("Bb"));
  });

  test("name", () => {
    expect(name({ step: 1, alt: -1 })).toBe("Db");
    expect(name({ step: 2, alt: 1 })).toBe("E#");
    expect(name({ step: 2, alt: 1, oct: 4 })).toBe("E#4");
    expect(name({ step: 5, alt: 0 })).toBe("A");
    expect(name({ step: 5, alt: 0, oct: 2 })).toBe("A2");
    expect(name({ step: -1, alt: 0 })).toBe("");
    expect(name({ step: 8, alt: 0 })).toBe("");
  });
});
