import { topNoteDiff } from ".";

describe("VoiceLeading", () => {
  test("topNoteDiff", () => {
    expect(
      topNoteDiff(
        [
          ["F3", "A3", "C4", "E4"],
          ["C4", "E4", "F4", "A4"],
        ],
        ["C4", "E4", "G4", "B4"]
      )
    ).toEqual(["C4", "E4", "F4", "A4"]);
  });
});
