/* global describe test expect */
var enharmonics = require("..");

describe("tonal-enharmonics", () => {
  test("enharmonics", () => {
    expect(enharmonics.find("C")).toEqual(["B#", "C", "Dbb"]);
    expect(enharmonics.find("B")).toEqual(["A##", "B", "Cb"]);
    expect(enharmonics.find("B#")).toEqual(["A###", "B#", "C"]);
    expect(enharmonics.find("F5")).toEqual(["E#5", "F5", "Gbb5"]);
    expect(enharmonics.find("E#2")).toEqual(["D###2", "E#2", "F2"]);
    expect(enharmonics.find("A###6")).toEqual(["G#####6", "A###6", "B#6"]);
    expect(enharmonics.find("A")).toEqual(["G##", "A", "Bbb"]);
    expect(enharmonics.find("Ab3")).toEqual(["G#3", "Ab3", "Bbbb3"]);
    expect(enharmonics.find("Db")).toEqual(["C#", "Db", "Ebbb"]);
  });

  test("enharmonics - returns empty array if not valid pitch", () => {
    expect(enharmonics.find("blah")).toBe(null);
  });

  test("simplify", () => {
    expect(enharmonics.simplify("E#2")).toEqual("F2");
    expect(enharmonics.simplify("B#2")).toEqual("C3");
    expect(enharmonics.simplify("Cb2")).toEqual("B1");
    // strage case: not a COMPLETE simplification, but I think is enough
    expect(enharmonics.simplify("A###6")).toEqual("B#6");
  });
});
