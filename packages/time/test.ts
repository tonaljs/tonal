import { euclid } from "@tonaljs/rhythm-pattern";
import { describe, expect, test } from "vitest";
import * as Time from "./index";

describe("@tonaljs/time", () => {
  describe("fraction", () => {
    test("fractions, numbers and strings", () => {
      expect(Time.fraction([2, 4])).toEqual([1, 2]);
      expect(Time.fraction([3, -6])).toEqual([-1, 2]);
      expect(Time.fraction([0, 5])).toEqual([0, 1]);
      expect(Time.fraction(1.5)).toEqual([3, 2]);
      expect(Time.fraction(3)).toEqual([3, 1]);
      expect(Time.fraction(-0.25)).toEqual([-1, 4]);
      expect(Time.fraction(1 / 1024)).toEqual([1, 1024]);
      expect(Time.fraction("6/4")).toEqual([3, 2]);
      expect(Time.fraction(" -1/3 ")).toEqual([-1, 3]);
      expect(Time.fraction("1.5")).toEqual([3, 2]);
      expect(Time.fraction("2")).toEqual([2, 1]);
    });

    test("numbers that aren't exact", () => {
      expect(Time.fraction(0.1)).toBeNull();
      expect(Time.fraction(1 / 3)).toBeNull();
      expect(Time.fraction(1 / 2048)).toBeNull();
      expect(Time.fraction("0.1")).toBeNull();
    });

    test("invalid", () => {
      expect(Time.fraction([1, 0])).toBeNull();
      expect(Time.fraction([1.5, 2])).toBeNull();
      expect(Time.fraction([2 ** 60, 3])).toBeNull();
      expect(Time.fraction(NaN)).toBeNull();
      expect(Time.fraction(Infinity)).toBeNull();
      expect(Time.fraction("x")).toBeNull();
      expect(Time.fraction("1/0")).toBeNull();
      expect(Time.fraction([1] as never)).toBeNull();
      expect(Time.fraction(null as never)).toBeNull();
    });
  });

  describe("arithmetic", () => {
    test("add, sub, mul, div", () => {
      expect(Time.add([1, 3], [1, 6])).toEqual([1, 2]);
      expect(Time.add(4, "1/3")).toEqual([13, 3]);
      expect(Time.sub(4, [1, 3])).toEqual([11, 3]);
      expect(Time.sub([1, 2], 1)).toEqual([-1, 2]);
      expect(Time.mul([1, 2], [2, 3])).toEqual([1, 3]);
      expect(Time.mul([3, 2], 4)).toEqual([6, 1]);
      expect(Time.div(4, [1, 3])).toEqual([12, 1]);
      expect(Time.div(1, 0)).toBeNull();
      expect(Time.add(1, "x")).toBeNull();
    });

    test("the float failures of the research are exact", () => {
      // 84 triplet eighths: 7 bars of 4/4 (floats give 27.999999999999968)
      let pos: Time.Fraction = [0, 1];
      for (let i = 0; i < 84; i++) pos = Time.add(pos, [1, 3]) as Time.Fraction;
      expect(pos).toEqual([28, 1]);
      expect(Time.toBarBeat(pos, "4/4")).toEqual("8:1");
      // six triplet sixteenths are one beat (floats give 0.9999999999999999)
      let beat: Time.Fraction = [0, 1];
      for (let i = 0; i < 6; i++)
        beat = Time.add(beat, [1, 6]) as Time.Fraction;
      expect(beat).toEqual([1, 1]);
    });

    test("compare and equal", () => {
      expect(Time.compare([1, 3], 0.5)).toBe(-1);
      expect(Time.compare("1/2", 0.5)).toBe(0);
      expect(Time.compare(2, [3, 2])).toBe(1);
      expect(Time.compare(1, "x")).toBe(0);
      const list: Time.TimeValue[] = [[3, 2], [1, 3], 1];
      expect(list.sort(Time.compare)).toEqual([[1, 3], 1, [3, 2]]);
      expect(Time.equal([2, 4], 0.5)).toBe(true);
      expect(Time.equal("1/2", [1, 3])).toBe(false);
      expect(Time.equal("x", "x")).toBe(false);
    });

    test("toNumber and toString", () => {
      expect(Time.toNumber([3, 2])).toBe(1.5);
      expect(Time.toNumber("x")).toBeNull();
      expect(Time.toString([3, 2])).toBe("3/2");
      expect(Time.toString(4)).toBe("4");
      expect(Time.toString([-2, 4])).toBe("-1/2");
      expect(Time.toString("x")).toBe("");
    });

    test("JSON round trip", () => {
      const value = Time.fraction("6/8");
      expect(Time.equal(JSON.parse(JSON.stringify(value)), [3, 4])).toBe(true);
    });
  });

  describe("meter", () => {
    test("bar, beat and pulses", () => {
      expect(Time.meter("4/4")).toEqual({
        empty: false,
        name: "4/4",
        bar: [4, 1],
        beat: [1, 1],
        pulses: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
        ],
      });
      expect(Time.meter("3/4").pulses).toHaveLength(3);
      expect(Time.meter("2/2").beat).toEqual([2, 1]);
      expect(Time.meter("2/2").pulses).toEqual([
        [2, 1],
        [2, 1],
      ]);
      // compound: the beat is the eighth, the pulses dotted quarters
      expect(Time.meter("6/8")).toEqual({
        empty: false,
        name: "6/8",
        bar: [3, 1],
        beat: [1, 2],
        pulses: [
          [3, 2],
          [3, 2],
        ],
      });
      expect(Time.meter("12/8").pulses).toHaveLength(4);
      expect(Time.meter("3/8").pulses).toEqual([[3, 2]]);
      // additive: one pulse per group
      expect(Time.meter("2+2+3/8").bar).toEqual([7, 2]);
      expect(Time.meter("2+2+3/8").beat).toEqual([1, 2]);
      expect(Time.meter("2+2+3/8").pulses).toEqual([
        [1, 1],
        [1, 1],
        [3, 2],
      ]);
      // not grouped by guess
      expect(Time.meter("7/8").pulses).toHaveLength(7);
      expect(Time.meter("C").name).toBe("4/4");
    });

    test("a meter is returned as is", () => {
      const m = Time.meter("6/8");
      expect(Time.meter(m)).toBe(m);
    });

    test("invalid", () => {
      expect(Time.meter("x").empty).toBe(true);
      expect(Time.meter("x").pulses).toEqual([]);
      expect(Time.meter({} as never).empty).toBe(true);
      expect(Time.meter({ bar: 1, beat: 1, pulses: 5 } as never).empty).toBe(
        true,
      );
    });
  });

  test("duration", () => {
    expect(Time.duration("q")).toEqual([1, 1]);
    expect(Time.duration("q.")).toEqual([3, 2]);
    expect(Time.duration("e")).toEqual([1, 2]);
    expect(Time.duration("w")).toEqual([4, 1]);
    expect(Time.duration("sixteenth")).toEqual([1, 4]);
    expect(Time.mul(Time.duration("e") ?? 0, [2, 3])).toEqual([1, 3]);
    expect(Time.duration("x")).toBeNull();
  });

  describe("bar and beat", () => {
    test("fromBarBeat", () => {
      expect(Time.fromBarBeat("1:1", "4/4")).toEqual([0, 1]);
      expect(Time.fromBarBeat("2:3", "4/4")).toEqual([6, 1]);
      expect(Time.fromBarBeat("2:3+1/3", "4/4")).toEqual([19, 3]);
      // the beat is the lower note: in 6/8, beat 4 is the second dotted quarter
      expect(Time.fromBarBeat("1:4", "6/8")).toEqual([3, 2]);
      expect(Time.fromBarBeat("1:2", "6/8")).toEqual([1, 2]);
      expect(Time.fromBarBeat("1:3", "3/8")).toEqual([1, 1]);
      // 2+2+3/8 counts seven eighths, like 7/8
      expect(Time.fromBarBeat("2:5", "2+2+3/8")).toEqual([11, 2]);
      expect(Time.fromBarBeat("2:5", "7/8")).toEqual([11, 2]);
      expect(Time.fromBarBeat("2:1", Time.meter("3/4"))).toEqual([3, 1]);
    });

    test("toBarBeat and round trips", () => {
      expect(Time.toBarBeat([19, 3], "4/4")).toBe("2:3+1/3");
      expect(Time.toBarBeat(28, "4/4")).toBe("8:1");
      expect(Time.toBarBeat([5, 2], "2+2+3/8")).toBe("1:6");
      expect(Time.toBarBeat([7, 2], "2+2+3/8")).toBe("2:1");
      expect(Time.toBarBeat([3, 2], "6/8")).toBe("1:4");
      expect(Time.toBarBeat([2, 3], "6/8")).toBe("1:2+1/3");
      const cases: [string, string][] = [
        ["1:1", "4/4"],
        ["3:2", "4/4"],
        ["4:4+1/3", "4/4"],
        ["12:2+3/4", "4/4"],
        ["5:5+2/3", "6/8"],
        ["3:6+1/2", "2+2+3/8"],
        ["1:6", "6/8"],
        ["2:7", "7/8"],
      ];
      for (const [text, sig] of cases) {
        expect(Time.toBarBeat(Time.fromBarBeat(text, sig) ?? -1, sig)).toBe(
          text,
        );
      }
    });

    test("septuplets stay exact", () => {
      const septuplet: Time.Fraction = [1, 7];
      expect(Time.toBarBeat(Time.mul(septuplet, 6) ?? -1, "4/4")).toBe(
        "1:1+6/7",
      );
    });

    test("invalid", () => {
      expect(Time.fromBarBeat("0:1", "4/4")).toBeNull();
      expect(Time.fromBarBeat("1:5", "4/4")).toBeNull();
      expect(Time.fromBarBeat("1:7", "6/8")).toBeNull();
      expect(Time.fromBarBeat("1:1+3/2", "4/4")).toBeNull();
      expect(Time.fromBarBeat("1:1+1/0", "4/4")).toBeNull();
      expect(Time.fromBarBeat("x", "4/4")).toBeNull();
      expect(Time.fromBarBeat("1:1", "x")).toBeNull();
      expect(Time.fromBarBeat("99999999999999999999:1", "4/4")).toBeNull();
      expect(Time.toBarBeat(-1, "4/4")).toBe("");
      expect(Time.toBarBeat("x", "4/4")).toBe("");
      expect(Time.toBarBeat(1, "x")).toBe("");
    });
  });

  describe("onsets", () => {
    test("rhythm patterns to positions", () => {
      expect(Time.onsets(euclid(8, 3), [1, 2])).toEqual([
        [0, 1],
        [3, 2],
        [3, 1],
      ]);
      expect(Time.onsets([1, 1, 1], [1, 3], 4)).toEqual([
        [4, 1],
        [13, 3],
        [14, 3],
      ]);
      expect(Time.onsets([1, 0, 1], 0.5, "1/2")).toEqual([
        [1, 2],
        [3, 2],
      ]);
      expect(Time.onsets([], [1, 2])).toEqual([]);
    });

    test("invalid", () => {
      expect(Time.onsets([1, 2], [1, 2])).toEqual([]);
      expect(Time.onsets([1], "x")).toEqual([]);
      expect(Time.onsets([1], 1, 0.1)).toEqual([]);
      expect(Time.onsets("x" as never, 1)).toEqual([]);
    });
  });
});
