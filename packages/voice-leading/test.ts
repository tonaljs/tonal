import { describe, expect, test } from "vitest";
import { topNoteDiff } from ".";

describe("VoiceLeading", () => {
  test("topNoteDiff", () => {
    expect(
      topNoteDiff(
        [
          ["F3", "A3", "C4", "E4"],
          ["C4", "E4", "F4", "A4"],
        ],
        ["C4", "E4", "G4", "B4"],
      ),
    ).toEqual(["C4", "E4", "F4", "A4"]);
  });

  test("topNoteDiff doesn't change the given voicings", () => {
    const voicings = [
      ["A3", "B4"],
      ["C4", "D4"],
      ["E4", "G4"],
    ];
    const copy = voicings.map((v) => [...v]);
    expect(topNoteDiff(voicings, ["C4", "F4"])).toEqual(["E4", "G4"]);
    expect(voicings).toEqual(copy);
  });

  test("topNoteDiff picks the first voicing on a tie", () => {
    expect(
      topNoteDiff(
        [
          ["C4", "D4"],
          ["C4", "F#4"],
          ["C4", "E4"],
        ],
        ["F4"],
      ),
    ).toEqual(["C4", "F#4"]);
  });

  test("topNoteDiff with no voicings", () => {
    expect(topNoteDiff([], ["C4"])).toEqual([]);
    expect(topNoteDiff([], [])).toEqual([]);
  });
});
