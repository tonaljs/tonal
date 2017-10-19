import { detector, chord, scale } from "../index.js";
import * as Dict from "tonal-dictionary";

const $ = str => str.split(" ");

describe("Detect", () => {
  test("chord", () => {
    expect(chord($("c e g b"))).toEqual(["CMaj7"]);
    expect(chord($("e c a g"))).toEqual(["CM6", "Am7"]);
    expect(chord($("g d f# b"))).toEqual(["GMaj7"]);
    expect(chord($("f a d g b"))).toEqual(["Dm6", "G9"]);
    expect(chord($("f bb g d# a"))).toEqual(["Gm9#5"]);
  });

  test("scale", () => {
    expect(scale($("f3 a c5 e2 d g2 b6"))).toEqual([
      "C major",
      "D dorian",
      "E phrygian",
      "F lydian",
      "G mixolydian",
      "A aeolian",
      "B locrian"
    ]);
  });

  it("create a detector", () => {
    const detect = detector(
      Dict.scale,
      (tonic, names) => `${tonic} ${names[0]}`
    );
    expect(detect($("c d e f g a b"))).toEqual([
      "C major",
      "D dorian",
      "E phrygian",
      "F lydian",
      "G mixolydian",
      "A aeolian",
      "B locrian"
    ]);
  });
});
