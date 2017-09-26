import * as notes from "../index";

const $ = str => str.split(" ");

describe("tonal-notes", () => {
  test("get only notes", () => {
    expect(notes.filter($("c d5 p5 5p other"))).toEqual(["C", "D5"]);
  });

  test("pcset", () => {
    expect(notes.pcset($("C4 c3 C5 C4 c4"))).toEqual(["C"]);
    expect(notes.pcset($("C4 f3 c#10 b5 d4 cb4"))).toEqual($("C C# D F B Cb"));
    expect(notes.pcset($("D4 c#5 A5 F#6"))).toEqual(["D", "F#", "A", "C#"]);
  });

  it("sort notes", () => {
    expect(notes.sort($("c4 c3 c2"))).toEqual(["C2", "C3", "C4"]);
    expect(notes.sort($("a b c d e f g"))).toEqual($("C D E F G A B"));
    expect(notes.sort($("c3 d2 d c"))).toEqual(["C", "D", "D2", "C3"]);
    expect(notes.sort($("a2 g3 f h c n x"))).toEqual(["C", "F", "A2", "G3"]);
    var arr = ["c2", "c1", "c0"];
    expect(notes.sort(arr)).toEqual(["C0", "C1", "C2"]);
    expect(arr).toEqual(["c2", "c1", "c0"]);
  });

  it("unique notes", () => {
    expect(notes.unique($("c4 g5 bb6 c4 bb7"))).toEqual($("C4 G5 Bb6 Bb7"));
    expect(notes.unique($("c4 g5  d e blah bb6 c4 bb7"))).toEqual(
      $("D E C4 G5 Bb6 Bb7")
    );
  });
});
