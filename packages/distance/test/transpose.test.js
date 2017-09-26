const dist = require("../index");
const tr = dist.transpose;

const map = fn => arr => (arr.split ? arr.split(" ") : arr).map(fn).join(" ");

describe("distance - transposition", () => {
  test("subtract intervals", () => {
    expect(dist.subtract("5P", "3M")).toEqual("3m");
    expect(dist.subtract("3M", "5P")).toEqual("-3m");
  });

  test("transpose by interval", () => {
    const trBy3M = map(dist.transposeBy("3M"));
    expect(trBy3M("c2 d3 f4 g5")).toEqual("E2 F#3 A4 B5");
  });
  test("transpose notes", () => {
    const trFromBb = map(dist.transpose("Bb"));
    expect(trFromBb("P1 M3 P5 M7")).toEqual("Bb D F A");
  });
  test("transpose nulls", () => {
    expect(tr("M3", "blah")).toBe(null);
    expect(tr("blah", "C2")).toBe(null);
    expect(tr(null, null)).toBe(null);
  });
  test("notes by descending intervals", () => {
    const trDescM2 = map(dist.transposeBy("-2M"));
    expect(trDescM2("c2 d3 f4 g5")).toEqual("Bb1 C3 Eb4 F5");
  });
  test("add intervals ", () => {
    const add3M = map(dist.add("3M"));
    expect(add3M("1P 2M 3M 4P 5P")).toEqual("3M 4A 5A 6M 7M");
  });

  test("add with descending intervals", () => {
    const addDescM2 = map(dist.add("-2M"));
    expect(addDescM2("1P 2M 3M 4P 5P")).toEqual("-2M 1P 2M 3m 4P");
    expect(addDescM2("-5P -4P -3M -2M 1P")).toEqual("-6M -5P -4A -3M -2M");
  });

  test("transpose edge cases", () => {
    const fromC2 = map(dist.transpose("C2"));

    expect(fromC2("1d 1P 1A")).toEqual("Cb2 C2 C#2");
    expect(fromC2("-1d -1P -1A")).toEqual("C#2 C2 Cb2");
    expect(fromC2("2d 2m 2M 2A")).toEqual("Dbb2 Db2 D2 D#2");
    expect(fromC2("-2d -2m -2M -2A")).toEqual("B#1 B1 Bb1 Bbb1");
    expect(fromC2("4dd 4d 4P 4A 4AA")).toEqual("Fbb2 Fb2 F2 F#2 F##2");
    expect(fromC2("5P -5P 5A -5A")).toEqual("G2 F1 G#2 Fb1");
    expect(fromC2("6M -6M 6m -6m")).toEqual("A2 Eb1 Ab2 E1");
  });

  test("transpose fifths", () => {
    const fifthsFromC = map(dist.trFifths("C"));
    expect(fifthsFromC([0, 1, 2, 3, 4, 5, 6, 7])).toEqual("C G D A E B F# C#");
  });
});
