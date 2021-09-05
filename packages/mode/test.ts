import Mode from "./index";

describe("Mode", () => {
  describe("mode", () => {
    test("properties", () => {
      expect(Mode.get("ionian")).toEqual({
        empty: false,
        modeNum: 0,
        name: "ionian",
        setNum: 2773,
        chroma: "101011010101",
        normalized: "101011010101",
        alt: 0,
        triad: "",
        seventh: "Maj7",
        aliases: ["major"],
        intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      });
      expect(Mode.get("major")).toEqual(Mode.get("ionian"));
    });
    test("accept Named as parameter", () => {
      expect(Mode.get(Mode.get("major"))).toEqual(Mode.get("major"));
      expect(Mode.get({ name: "Major" })).toEqual(Mode.get("major"));
    });
    test("name is case independent", () => {
      expect(Mode.get("Dorian")).toEqual(Mode.get("dorian"));
    });
    test("setNum", () => {
      const pcsets = Mode.names().map((name) => Mode.get(name).setNum);
      expect(pcsets).toEqual([2773, 2902, 3418, 2741, 2774, 2906, 3434]);
    });

    test("alt", () => {
      const alt = Mode.names().map((name) => Mode.get(name).alt);
      expect(alt).toEqual([0, 2, 4, -1, 1, 3, 5]);
    });
    test("triad", () => {
      const triads = Mode.names().map((name) => Mode.get(name).triad);
      expect(triads).toEqual(["", "m", "m", "", "", "m", "dim"]);
    });
    test("seventh", () => {
      const sevenths = Mode.names().map((name) => Mode.get(name).seventh);
      expect(sevenths).toEqual(["Maj7", "m7", "m7", "Maj7", "7", "m7", "m7b5"]);
    });

    test("aliases", () => {
      expect(Mode.get("major")).toEqual(Mode.get("ionian"));
      expect(Mode.get("minor")).toEqual(Mode.get("aeolian"));
    });
  });
  test("names", () => {
    expect(Mode.names()).toEqual([
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian",
    ]);
  });

  test("notes", () => {
    expect(Mode.notes("major", "C").join(" ")).toEqual("C D E F G A B");
    expect(Mode.notes("dorian", "C").join(" ")).toEqual("C D Eb F G A Bb");
    expect(Mode.notes("dorian", "F").join(" ")).toEqual("F G Ab Bb C D Eb");
    expect(Mode.notes("lydian", "F").join(" ")).toEqual("F G A B C D E");
    expect(Mode.notes("anything", "F").join(" ")).toEqual("");
  });

  test("triads", () => {
    expect(Mode.triads("minor", "C").join(" ")).toEqual(
      "Cm Ddim Eb Fm Gm Ab Bb"
    );
    expect(Mode.triads("mixolydian", "Bb").join(" ")).toEqual(
      "Bb Cm Ddim Eb Fm Gm Ab"
    );
  });

  test("seventhChords", () => {
    expect(Mode.seventhChords("major", "C#").join(" ")).toEqual(
      "C#Maj7 D#m7 E#m7 F#Maj7 G#7 A#m7 B#m7b5"
    );

    expect(Mode.seventhChords("dorian", "G").join(" ")).toEqual(
      "Gm7 Am7 BbMaj7 C7 Dm7 Em7b5 FMaj7"
    );
  });

  test("relativeTonic", () => {
    expect(Mode.relativeTonic("major", "minor", "A")).toEqual("C");
    expect(Mode.relativeTonic("major", "minor", "D")).toEqual("F");
    expect(Mode.relativeTonic("minor", "dorian", "D")).toEqual("A");
    expect(Mode.relativeTonic("nonsense", "dorian", "D")).toEqual("");
  });
});
