/* global describe test expect */
var d = require("../index");

var DATA = [["1P 3M 5P 7M", "Maj7"], ["1P 3m 5P 7m", "m7"]];

const arr = str => str.split(" ");

describe("tonal-dictionary", () => {
  test("create a dictionary", () => {
    const dict = d.dictionary(DATA, d.chordAliases);
    expect(dict("m7")).toEqual(["1P", "3m", "5P", "7m"]);
    expect(dict("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj")).toBe(undefined);
  });

  test("dictionary has keys", () => {
    const dict = d.dictionary(DATA, d.chordAliases);
    expect(dict.names()).toEqual(["m7", "Maj7"]);
    expect(dict.names(true)).toEqual(["_7", "m7", "M7", "maj7", "Maj7"]);
  });

  test("chord aliases", () => {
    expect(d.chord("maj7")).toEqual(d.chord("Maj7"));
    expect(d.chord("M7")).toEqual(d.chord("Maj7"));
    expect(d.chord("_7")).toEqual(d.chord("m7"));
    expect(d.chord("6#11")).toEqual(d.chord("M6#11"));
    expect(d.chord("6b5")).toEqual(d.chord("M6b5"));
  });

  test("scale dictionary", () => {
    expect(d.scale("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(d.scale("ionian")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(d.scale("bebop minor")).toEqual(arr("1P 2M 3m 3M 4P 5P 6M 7m"));
    expect(d.scale.names("101011010101")).toEqual(["major", "ionian"]);
  });

  test("chord dictionary", () => {
    expect(d.chord("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(d.chord("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(d.chord.names("100010010001")).toEqual(["Maj7", "maj7", "M7"]);
  });

  test("pitchset dictionary", () => {
    expect(d.pcset("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(d.pcset("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
    expect(d.pcset.names().length).toEqual(
      d.scale.names().length + d.chord.names().length
    );
  });
});
