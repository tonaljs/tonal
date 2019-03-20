import { chord, scale } from "./";

const $ = str => str.split(" ");

describe("Detect", () => {
  test("chord", () => {
    const toStr = chord => chord.tonic + chord.name + chord.mod;

    expect(chord($("c e g b")).map(toStr)).toEqual(["Cmaj7"]);
    expect(chord($("C E G A")).map(toStr)).toEqual(["C6", "Am7/C"]);
    expect(chord($("C# E# G# A#")).map(toStr)).toEqual(["C#6", "A#m7/C#"]);
    expect(chord($("Cb Eb Gb Ab")).map(toStr)).toEqual(["B6", "Abm7/Cb"]);
    expect(chord($("D F# A B")).map(toStr)).toEqual(["D6", "Bm7/D"]);
    expect(chord($("d f# a c#")).map(toStr)).toEqual(["Dmaj7"]);
    expect(chord($("g b d")).map(toStr)).toEqual(["GM", "Bm#5/G"]);
    expect(chord($("b d f")).map(toStr)).toEqual(["Bdim"]);
    expect(chord($("b d f a")).map(toStr)).toEqual($("Bm7b5 Dm6/B"));
    expect(chord($("B D F Ab")).map(toStr)).toEqual(
      $("Bdim7 Ddim7/B Fdim7/B Abdim7/B")
    );
  });

  test.skip("scale", () => {
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
