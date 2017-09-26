/* global describe test expect */
var d = require("../index");

var DATA = {
  maj7: ["1P 3M 5P 7M", ["Maj7"]],
  m7: ["1P 3m 5P 7m"]
};

const arr = str => str.split(" ");

describe("tonal-dictionary", () => {
  test("create a dictionary", () => {
    const dict = d.dictionary(DATA);
    expect(dict("m7")).toEqual(["1P", "3m", "5P", "7m"]);
    expect(dict("maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj7")).toEqual(["1P", "3M", "5P", "7M"]);
    expect(dict("Maj")).toBe(undefined);
  });

  test("dictionary has keys", () => {
    const dict = d.dictionary(DATA);
    expect(dict.names()).toEqual(["m7", "maj7"]);
    expect(dict.names(true)).toEqual(["Maj7", "m7", "maj7"]);
  });

  test("scale dictionary", () => {
    expect(d.scale("major")).toEqual(arr("1P 2M 3M 4P 5P 6M 7M"));
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
