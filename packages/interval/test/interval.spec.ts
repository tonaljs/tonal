var ivl = require("../index");

const $ = (str: string) => str.split(" ");
const lift = (fn: (str: any) => any) => (str: string) =>
  str
    .split(" ")
    .map(fn)
    .join(" ");

describe("tonal-interval", () => {
  test("tokenize", () => {
    expect(ivl.tokenize("-2M")).toEqual(["-2", "M"]);
    expect(ivl.tokenize("M-3")).toEqual(["-3", "M"]);
  });

  test("qToAlt", () => {
    expect(ivl.qToAlt("blabla")).toEqual(null);
    expect(ivl.qToAlt("P", "ddd")).toEqual(-3);
    expect(ivl.qToAlt("P", "d")).toEqual(-1);
    expect(ivl.qToAlt("M", "d")).toEqual(-2);
  });
  test("altToQ", () => {
    expect(ivl.altToQ("blabla")).toEqual(null);
  });
  test("names", () => {
    expect(ivl.names()).toEqual($("1P 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P"));
    expect(ivl.names("P")).toEqual($("1P 4P 5P 8P"));
    expect(ivl.names("PM")).toEqual($("1P 2M 3M 4P 5P 6M 7M 8P"));
    expect(ivl.names("Pm")).toEqual($("1P 2m 3m 4P 5P 6m 7m 8P"));
    expect(ivl.names("m")).toEqual($("2m 3m 6m 7m"));
    expect(ivl.names("d")).toEqual([]);
  });

  test("num", () => {
    const pos = [1, 2, 3, 4, 5, 6, 7];
    expect($("1P 2M 3M 4P 5P 6M 7M").map(ivl.num)).toEqual(pos);
    expect($("P1 M2 M3 P4 P5 M6 M7").map(ivl.num)).toEqual(pos);
    const neg = [-1, -2, -3, -4, -5, -6, -7];
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(ivl.num)).toEqual(neg);
  });

  test("name", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M").map(ivl.name)).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M")
    );
    expect($("P1 M2 M3 P4 P5 M6 M7").map(ivl.name)).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M")
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(ivl.name)).toEqual(
      $("-1P -2M -3M -4P -5P -6M -7M")
    );
    expect($("P-1 M-2 M-3 P-4 P-5 M-6 M-7").map(ivl.name)).toEqual(
      $("-1P -2M -3M -4P -5P -6M -7M")
    );
    expect(ivl.name("not-an-interval")).toBe(null);
    expect(ivl.name("2P")).toBe(null);
    expect(ivl.name(22)).toBe(null);
    expect(ivl.name()).toBe(null);
  });

  test("build", () => {
    expect(ivl.build({ step: 0, alt: 0, oct: 0, dir: 1 })).toBe("1P");
    expect(ivl.build({ step: 0, alt: -1, oct: 1, dir: -1 })).toBe("-8d");
    expect(ivl.build({ step: 1, alt: -1, oct: 1, dir: -1 })).toBe("-9m");
    expect(ivl.build({ num: 9, alt: 0 })).toBe("9M");
    expect(ivl.build({ num: 15, alt: 0 })).toBe("15P");
    expect(ivl.build({ num: 9, alt: "some string" })).toBe(null);
    expect(ivl.build()).toBe(null);
  });

  test("semitones", () => {
    let result = [0, 2, 4, 5, 7, 9, 11];
    expect($("1P 2M 3M 4P 5P 6M 7M").map(ivl.semitones)).toEqual(result);

    result = [12, 14, 16, 17, 19, 21, 23];
    expect($("8P 9M 10M 11P 12P 13M 14M").map(ivl.semitones)).toEqual(result);

    result = [11, 13, 15, 16, 18, 20, 22];
    expect($("8d 9m 10m 11d 12d 13m 14m").map(ivl.semitones)).toEqual(result);

    result = [-0, -2, -4, -5, -7, -9, -11];
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(ivl.semitones)).toEqual(result);

    result = [-12, -14, -16, -17, -19, -21, -23];
    expect($("-8P -9M -10M -11P -12P -13M -14M").map(ivl.semitones)).toEqual(
      result
    );
  });

  test("fromSemitones", () => {
    let semis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(semis.map(ivl.fromSemitones)).toEqual(
      $("1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M")
    );
    semis = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    expect(semis.map(ivl.fromSemitones)).toEqual(
      $("8P 9m 9M 10m 10M 11P 12d 12P 13m 13M 14m 14M")
    );
    semis = [-0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];
    expect(semis.map(ivl.fromSemitones)).toEqual(
      $("1P -2m -2M -3m -3M -4P -5d -5P -6m -6M -7m -7M")
    );
    semis = [-12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23];
    expect(semis.map(ivl.fromSemitones)).toEqual(
      $("-8P -9m -9M -10m -10M -11P -12d -12P -13m -13M -14m -14M")
    );
  });

  test("chroma", () => {
    let chromas = [0, 2, 4, 5, 7, 9, 11, 0];
    expect($("1P 2M 3M 4P 5P 6M 7M 8P").map(ivl.chroma)).toEqual(chromas);
    chromas = [11, 1, 3, 4, 6, 8, 10, 11];
    expect($("1d 2m 3m 4d 5d 6m 7m 8d").map(ivl.chroma)).toEqual(chromas);
    chromas = [1, 3, 5, 6, 8, 10, 0, 1];
    expect($("1A 2A 3A 4A 5A 6A 7A 8A").map(ivl.chroma)).toEqual(chromas);
    chromas = [0, 2, 4, 5, 7, 9, 11, 0];
    expect($("8P 9M 10M 11P 12P 13M 14M 15P").map(ivl.chroma)).toEqual(chromas);
    chromas = [0, 10, 8, 7, 5, 3, 1, 0];
    expect($("-1P -2M -3M -4P -5P -6M -7M -8P").map(ivl.chroma)).toEqual(
      chromas
    );
  });

  test("interval class", () => {
    let result = [0, 2, 4, 5, 5, 3, 1, 0];
    expect($("1P 2M 3M 4P 5P 6M 7M 8P").map(ivl.ic)).toEqual(result);
    result = [1, 1, 3, 4, 6, 4, 2, 1];
    expect($("1d 2m 3m 4d 5d 6m 7m 8d").map(ivl.ic)).toEqual(result);
    result = [0, 2, 4, 5, 5, 3, 1, 0];
    expect($("8P 9M 10M 11P 12P 13M 14M 15P").map(ivl.ic)).toEqual(result);
    result = [0, 2, 4, 5, 5, 3, 1, 0];
    expect($("-1P -2M -3M -4P -5P -6M -7M -8P").map(ivl.ic)).toEqual(result);
    expect(ivl.ic("blah")).toBe(null);

    const semitones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const ics = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0];
    expect(semitones.map(ivl.ic)).toEqual(ics);
  });

  test("interval types", () => {
    const type = (i: string) => ivl.props(i).type;
    expect($("1P 2M 3M 4P 5P 6M 7M").map(type)).toEqual($("P M M P P M M"));
    expect($("8d 9m 10m 11d 12d 13m 14m").map(type)).toEqual(
      $("P M M P P M M")
    );
    expect($("-15A -16A -17A -18A -19A -20A -21A").map(type)).toEqual(
      $("P M M P P M M")
    );
  });

  test("simplify intervals", () => {
    expect($("1P 2M 3M 4P 5P 6M 7M").map(ivl.simplify)).toEqual(
      $("1P 2M 3M 4P 5P 6M 7M")
    );
    expect($("8P 9M 10M 11P 12P 13M 14M").map(ivl.simplify)).toEqual(
      $("8P 2M 3M 4P 5P 6M 7M")
    );
    expect($("1d 1P 1A 8d 8P 8A 15d 15P 15A").map(ivl.simplify)).toEqual(
      $("1d 1P 1A 8d 8P 8A 1d 1P 1A")
    );
    expect($("-1P -2M -3M -4P -5P -6M -7M").map(ivl.simplify)).toEqual(
      $("-1P -2M -3M -4P -5P -6M -7M")
    );
    expect($("-8P -9M -10M -11P -12P -13M -14M").map(ivl.simplify)).toEqual(
      $("-8P -2M -3M -4P -5P -6M -7M")
    );
    expect(ivl.simplify("oh hai mark")).toEqual(null);
  });

  test("invert intervals", () => {
    const invert = lift(ivl.invert);
    expect(invert("1P 2M 3M 4P 5P 6M 7M")).toEqual("1P 7m 6m 5P 4P 3m 2m");
    expect(invert("1d 2m 3m 4d 5d 6m 7m")).toEqual("1A 7M 6M 5A 4A 3M 2M");
    expect(invert("1A 2A 3A 4A 5A 6A 7A")).toEqual("1d 7d 6d 5d 4d 3d 2d");
    expect(invert("-1P -2M -3M -4P -5P -6M -7M")).toEqual(
      "-1P -7m -6m -5P -4P -3m -2m"
    );
    expect(invert("8P 9M 10M 11P 12P 13M 14M")).toEqual(
      "8P 14m 13m 12P 11P 10m 9m"
    );
    expect(ivl.invert("oh hai mark")).toEqual(null);
  });
});
