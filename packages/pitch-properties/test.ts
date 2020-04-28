import { pitchProps } from "./index";

describe("@tonaljs/pitch", () => {
  test("pitch class", () => {
    expect(pitchProps({ step: 0, alt: 0 })).toEqual({
      chroma: 0,
      coord: [0],
      height: -1200,
      freq: null,
      midi: null,
    });
  });
  test("pitch", () => {
    expect(pitchProps({ step: 0, alt: 0, oct: 0 })).toEqual({
      chroma: 0,
      coord: [0, 0],
      height: 0,
      freq: 16.351597831287414,
      midi: 12,
    });
    expect(pitchProps({ step: 5, alt: 0, oct: 4 }).midi).toEqual(69);
  });
  test("interval", () => {
    expect(pitchProps({ step: 0, alt: 0, oct: 0, dir: -1 })).toEqual({
      chroma: 0,
      coord: [-0, -0],
      height: -0,
      freq: null,
      midi: null,
    });
    expect(pitchProps({ step: 0, alt: 0, oct: 2, dir: -1 }).height).toEqual(
      -24
    );
  });
});
