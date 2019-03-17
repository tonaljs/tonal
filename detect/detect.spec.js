import { detector, chord, scale } from "./";

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
});
