import { encode, decode } from "./index";

describe("@tonaljs/pitch", () => {
  test("encode pitch classes", () => {
    expect(encode({ step: 0, alt: 0 })).toEqual([0]);
    expect(encode({ step: 5, alt: 0 })).toEqual([3]);
    expect(encode({ step: 0, alt: 1 })).toEqual([7]);
    expect(encode({ step: 0, alt: -1 })).toEqual([-7]);
  });
  test("encode notes", () => {
    expect(encode({ step: 0, alt: 0, oct: 0 })).toEqual([0, 0]);
    expect(encode({ step: 0, alt: 0, oct: 4 })).toEqual([0, 4]);
    expect(encode({ step: 5, alt: 0, oct: 4 })).toEqual([3, 3]);
  });
  test("encode intervals", () => {
    expect(encode({ step: 0, alt: 1, oct: 0, dir: -1 })).toEqual([-7, 4]);
  });
  test("decode", () => {
    expect(decode([0])).toEqual({ step: 0, alt: 0, dir: undefined });
  });
});
