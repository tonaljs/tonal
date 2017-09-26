/* global describe test expect */
var dictionary = require("../index.js");
var d = require("../index.js");

var DATA = {
  maj7: ["1P 3M 5P 7M", ["Maj7"]],
  m7: ["1P 3m 5P 7m"]
};

const arr = str => str.split(" ");

describe("tonal-dictionary", () => {
  test("detector", () => {
    var dict = d.dictionary(DATA);
    expect(d.detector(dict, null)("E4 C4 B2 G5")).toEqual([["maj7", "C"]]);
    expect(d.detector(dict, "")("D4 b7 f#2 G5")).toEqual(["Gmaj7"]);
    expect(d.detector(dict, " ")("E C5 B G3")).toEqual(["C maj7"]);
  });

  test("create a dictionary", () => {
    const dict = dictionary.build(DATA);
    expect(dict("m7")).toEqual(["1P", "3m", "5P", "7m"]);
    expect(dict("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj")).toBe(undefined);
  });

  test("dictionary has keys", () => {
    const dict = dictionary.build(DATA);
    expect(dict.keys()).toEqual(["m7", "maj7"]);
    expect(dict.keys(true)).toEqual(["Maj7", "m7", "maj7"]);
  });

  test("scale dictionary", () => {
    expect(dictionary.scale("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(dictionary.scale("bebop minor")).toEqual(
      arr("1P 2M 3m 3M 4P 5P 6M 7m")
    );
  });

  test("chord dictionary", () => {
    expect(dictionary.chord("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dictionary.chord("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
  });

  test("pitchset dictionary", () => {
    expect(dictionary.pitchset("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dictionary.pitchset("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(dictionary.pitchset.keys().length).toEqual(
      dictionary.scale.keys().length + dictionary.chord.keys().length
    );
  });

  test("create chroma index", () => {
    const find = dictionary.index(dictionary.pitchset);
    expect(find("101101011010")).toEqual(["aeolian", "minor"]);
    expect(find("100000000000")).toEqual([]);
    expect(find("100000010000")).toEqual(["5"]);
  });
});
