import * as R from "./index";

describe("rhythm-pattern", () => {
  it("generates binary rhythms", () => {
    expect(R.binary(13)).toEqual([1, 1, 0, 1]);
    expect(R.binary(12, 13)).toEqual([1, 1, 0, 0, 1, 1, 0, 1]);
  });

  it("generates rhythms from onset spaces", () => {
    expect(R.onsets(1, 2, 2, 1)).toEqual([1, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
  });
});
