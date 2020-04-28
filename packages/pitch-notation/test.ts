import { validTokens, invalidTokens } from "./index";

describe("@tonaljs/pitch-notation", () => {
  describe("pitch-tokens", () => {
    test("validTokens", () => {
      expect(validTokens("C", "##", "4", "/4")).toEqual({
        valid: "C##4",
        rest: "/4",
        letter: "C",
        accidentals: "##",
        acc: "##",
        octave: "4",
      });
    });
    test("validPitchTokens", () => {
      expect(invalidTokens("nonsense")).toEqual({
        valid: "",
        rest: "nonsense",
        acc: "",
        accidentals: "",
        letter: "",
        octave: "",
      });
    });
  });
});
