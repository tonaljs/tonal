import { aliases, mode, Mode, names } from "./index";

const prop = (key: keyof Mode) => (name: string) => {
  const m = mode(name);
  return m ? m[key] : m;
};

describe("Mode", () => {
  test("mode", () => {
    expect(mode("ionian")).toEqual({
      valid: true,
      modeNum: 0,
      name: "ionian",
      pcset: 2773,
      alt: 0,
      triad: "",
      seventh: "Maj7",
      aliases: ["major"]
    });
    expect(mode("major")).toEqual(mode("ionian"));
  });

  test("pcsets", () => {
    const pcsets = names().map(prop("pcset"));
    expect(pcsets).toEqual([2773, 2902, 3418, 2741, 2774, 2906, 3434]);
  });

  test("alt", () => {
    const alt = names().map(prop("alt"));
    expect(alt).toEqual([0, 2, 4, -1, 1, 3, 5]);
  });
  test("triad", () => {
    const triads = names().map(prop("triad"));
    expect(triads).toEqual(["", "m", "m", "", "", "m", "dim"]);
  });
  test("seventh", () => {
    const sevenths = names().map(prop("seventh"));
    expect(sevenths).toEqual(["Maj7", "m7", "m7", "Maj7", "7", "m7", "m7b5"]);
  });

  test("names", () => {
    expect(names()).toEqual([
      "ionian",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian"
    ]);
  });
  test("aliases", () => {
    expect(aliases()).toEqual(["major", "minor"]);
  });
});
