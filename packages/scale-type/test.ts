import { describe, expect, test } from "vitest";
import { chroma, modes } from "@tonaljs/pcset";
import ScaleType from "./index";
import data from "./data";

describe("gets dictionary", () => {
  test("list names", () => {
    expect(ScaleType.all()).toHaveLength(110);
    // sorted
    expect(ScaleType.all()[0].name).toEqual("major pentatonic");
  });

  test("get ", () => {
    expect(ScaleType.get("major")).toEqual({
      empty: false,
      setNum: 2773,
      name: "major",
      intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
      aliases: ["ionian"],
      family: "major",
      degree: 1,
      chroma: "101011010101",
      normalized: "101010110101",
    });
  });

  test("not valid get type", () => {
    expect(ScaleType.get("unknown")).toEqual({
      empty: true,
      name: "",
      setNum: 0,
      aliases: [],
      family: "",
      degree: 0,
      chroma: "000000000000",
      intervals: [],
      normalized: "000000000000",
    });
  });

  test("add a chord type", () => {
    ScaleType.add(["1P", "5P"], "quinta");
    expect(ScaleType.get("quinta")).toMatchObject({
      chroma: "100000010000",
    });
    ScaleType.add(["1P", "5P"], "quinta", ["q", "Q"]);
    expect(ScaleType.get("q")).toEqual(ScaleType.get("quinta"));
    expect(ScaleType.get("Q")).toEqual(ScaleType.get("quinta"));
  });

  test("major modes", () => {
    const chromas = modes(ScaleType.get("major").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "major",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "minor",
      "locrian",
    ]);
  });
  test("harmonic minor modes", () => {
    const chromas = modes(ScaleType.get("harmonic minor").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "harmonic minor",
      "locrian 6",
      "major augmented",
      "dorian #4",
      "phrygian dominant",
      "lydian #9",
      "ultralocrian",
    ]);
  });
  test("melodic minor modes", () => {
    const chromas = modes(ScaleType.get("melodic minor").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "melodic minor",
      "dorian b2",
      "lydian augmented",
      "lydian dominant",
      "mixolydian b6",
      "locrian #2",
      "altered",
    ]);
  });

  test("harmonic major modes", () => {
    const chromas = modes(ScaleType.get("harmonic major").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "harmonic major",
      "dorian b5",
      "phrygian b4",
      "lydian diminished",
      "mixolydian b2",
      "lydian augmented #2",
      "locrian bb7",
    ]);
  });
  test("neapolitan major modes", () => {
    const chromas = modes(ScaleType.get("neapolitan major").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "neapolitan major",
      "leading whole tone",
      "lydian augmented dominant",
      "lydian minor",
      "locrian major",
      "locrian #2 b4",
      "altered bb3",
    ]);
  });
  test("neapolitan minor modes", () => {
    const chromas = modes(ScaleType.get("neapolitan minor").intervals, true);
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "neapolitan minor",
      "lydian #6",
      "mixolydian augmented",
      "aeolian #4",
      "locrian dominant",
      "ionian #2",
      "ultralocrian bb3",
    ]);
  });
  test("double harmonic major modes", () => {
    const chromas = modes(
      ScaleType.get("double harmonic major").intervals,
      true,
    );
    const names = chromas.map((chroma) => ScaleType.get(chroma).name);
    expect(names).toEqual([
      "double harmonic major",
      "lydian #2 #6",
      "ultraphrygian",
      "hungarian minor",
      "oriental",
      "ionian augmented #2",
      "locrian bb3 bb7",
    ]);
  });

  test("family and degree", () => {
    expect(ScaleType.get("dorian b5")).toMatchObject({
      family: "harmonic major",
      degree: 2,
    });
    expect(ScaleType.get("balinese")).toMatchObject({
      name: "neapolitan minor",
      family: "neapolitan minor",
      degree: 1,
    });
    expect(ScaleType.get("ritusen")).toMatchObject({
      family: "major pentatonic",
      degree: 4,
    });
    expect(ScaleType.get("chromatic")).toMatchObject({ family: "", degree: 0 });
  });

  test("every mode of a family has a name, in degree order", () => {
    const families = new Map<string, string[]>();
    for (const scale of ScaleType.all()) {
      if (!scale.family) continue;
      const modes = families.get(scale.family) ?? [];
      modes[scale.degree - 1] = scale.name;
      families.set(scale.family, modes);
    }
    expect(Object.fromEntries(families)).toEqual({
      major: [
        "major",
        "dorian",
        "phrygian",
        "lydian",
        "mixolydian",
        "minor",
        "locrian",
      ],
      "melodic minor": [
        "melodic minor",
        "dorian b2",
        "lydian augmented",
        "lydian dominant",
        "mixolydian b6",
        "locrian #2",
        "altered",
      ],
      "harmonic minor": [
        "harmonic minor",
        "locrian 6",
        "major augmented",
        "dorian #4",
        "phrygian dominant",
        "lydian #9",
        "ultralocrian",
      ],
      "harmonic major": [
        "harmonic major",
        "dorian b5",
        "phrygian b4",
        "lydian diminished",
        "mixolydian b2",
        "lydian augmented #2",
        "locrian bb7",
      ],
      "neapolitan major": [
        "neapolitan major",
        "leading whole tone",
        "lydian augmented dominant",
        "lydian minor",
        "locrian major",
        "locrian #2 b4",
        "altered bb3",
      ],
      "neapolitan minor": [
        "neapolitan minor",
        "lydian #6",
        "mixolydian augmented",
        "aeolian #4",
        "locrian dominant",
        "ionian #2",
        "ultralocrian bb3",
      ],
      "double harmonic major": [
        "double harmonic major",
        "lydian #2 #6",
        "ultraphrygian",
        "hungarian minor",
        "oriental",
        "ionian augmented #2",
        "locrian bb3 bb7",
      ],
      "major pentatonic": [
        "major pentatonic",
        "egyptian",
        "malkos raga",
        "ritusen",
        "minor pentatonic",
      ],
    });
  });

  test("the family is the name of its first mode", () => {
    for (const scale of ScaleType.all()) {
      if (!scale.family) continue;
      expect(ScaleType.get(scale.family)).toMatchObject({
        name: scale.family,
        family: scale.family,
        degree: 1,
      });
    }
  });

  test("a scale type added later gets its family", () => {
    ScaleType.add(["1P", "2M", "3m", "4P", "5d", "6M", "7m"], "my dorian b5");
    expect(ScaleType.get("my dorian b5")).toMatchObject({
      family: "harmonic major",
      degree: 2,
    });
  });

  test("every name and alias belongs to one scale", () => {
    const names = data.flatMap(([, ...names]) => names);
    expect(new Set(names).size).toEqual(names.length);
    for (const [, name, ...aliases] of data) {
      for (const alias of aliases) {
        expect(ScaleType.get(alias).name).toEqual(name);
      }
    }
  });

  test("every pitch class set is one scale", () => {
    const chromas = data.map(([ivls]) => chroma(ivls.split(" ")));
    expect(new Set(chromas).size).toEqual(chromas.length);
  });

  test("clear dictionary", () => {
    ScaleType.removeAll();
    expect(ScaleType.all()).toEqual([]);
    expect(ScaleType.keys()).toEqual([]);
  });
});

describe("scale type input safety", () => {
  test("Object.prototype keys are not scale types", () => {
    for (const key of [
      "constructor",
      "toString",
      "__proto__",
      "hasOwnProperty",
    ]) {
      expect(ScaleType.get(key).empty).toBe(true);
    }
  });
});
