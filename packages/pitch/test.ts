import {
  chroma,
  height,
  midi,
  freq,
  coordinates,
  pitch,
  IntervalPitch,
} from "./index";

// Pitch classes
const C = { step: 0, alt: 0 };
const Cs = { step: 0, alt: 1 };
const Cb = { step: 0, alt: -1 };
const A = { step: 5, alt: 0 };

// Notes
const C4 = { step: 0, alt: 0, oct: 4 };
const A4 = { step: 5, alt: 0, oct: 4 };
const Gs6 = { step: 4, alt: 1, oct: 6 };

// Intervals
const P5: IntervalPitch = { step: 4, alt: 0, oct: 0, dir: 1 };
const P_5: IntervalPitch = { step: 4, alt: 0, oct: 0, dir: -1 };

describe("@tonaljs/pitch", () => {
  test("height", () => {
    expect([C, Cs, Cb, A].map(height)).toEqual([-1200, -1199, -1201, -1191]);
    expect([C4, A4, Gs6].map(height)).toEqual([48, 57, 80]);
    expect([P5, P_5].map(height)).toEqual([7, -7]);
  });
  test("midi", () => {
    expect([C, Cs, Cb, A].map(midi)).toEqual([null, null, null, null]);
    expect([C4, A4, Gs6].map(midi)).toEqual([60, 69, 92]);
  });

  test("chroma", () => {
    expect([C, Cs, Cb, A].map(chroma)).toEqual([0, 1, 11, 9]);
    expect([C4, A4, Gs6].map(chroma)).toEqual([0, 9, 8]);
    expect([P5, P_5].map(chroma)).toEqual([7, 7]);
  });

  test("coordinates", () => {
    expect(coordinates(C)).toEqual([0]);
    expect(coordinates(A)).toEqual([3]);
    expect(coordinates(Cs)).toEqual([7]);
    expect(coordinates(Cb)).toEqual([-7]);
    // notes
    expect(coordinates(C4)).toEqual([0, 4]);
    expect(coordinates(A4)).toEqual([3, 3]);
    // intervals
    expect(coordinates(P5)).toEqual([1, 0]);
    expect(coordinates(P_5)).toEqual([-1, -0]);
  });

  test("pitch", () => {
    expect(pitch([0])).toEqual(C);
    expect(pitch([7])).toEqual(Cs);
  });
});
