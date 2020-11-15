import VoicingDictionary from "./index";

describe("lookup", () => {
  test("lookup", () => {
    expect(VoicingDictionary.lookup("M", VoicingDictionary.triads)).toEqual([
      "1P 3M 5P",
      "3M 5P 8P",
      "5P 8P 10M",
    ]);
    expect(VoicingDictionary.lookup("", VoicingDictionary.triads)).toEqual([
      "1P 3M 5P",
      "3M 5P 8P",
      "5P 8P 10M",
    ]);
    expect(VoicingDictionary.lookup("minor", { minor: ["1P 3m 5P"] })).toEqual([
      "1P 3m 5P",
    ]);
  });
});
