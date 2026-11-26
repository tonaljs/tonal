import { describe, expect, test } from "vitest";
import * as Chart from "./index";

// the chords of each bar, as "symbol@at"
const bars = (text: string, options?: Chart.ParseOptions) =>
  Chart.parse(text, options).bars.map((bar) =>
    bar.chords.map((c) => `${c.symbol}@${c.at[0]}/${c.at[1]}`).join(" "),
  );

// the played chords, as "symbol start+duration"
const played = (text: string, options?: Chart.UnrollOptions) =>
  Chart.chords(Chart.parse(text), options).map(
    (c) =>
      `${c.symbol} ${c.start[0]}/${c.start[1]}+${c.duration[0]}/${c.duration[1]}`,
  );

describe("@tonaljs/chart", () => {
  describe("parse", () => {
    test("bars and chords", () => {
      expect(Chart.parse("| Cmaj7 | Dm7 G7 |")).toEqual({
        empty: false,
        bars: [
          { meter: "4/4", chords: [{ symbol: "Cmaj7", at: [0, 1] }] },
          {
            meter: "4/4",
            chords: [
              { symbol: "Dm7", at: [0, 1] },
              { symbol: "G7", at: [2, 1] },
            ],
          },
        ],
        problems: [],
      });
      // bar lines are optional at the ends of a line, and a line ends a bar
      expect(bars("Cmaj7 | Am7\nDm7 | G7")).toEqual([
        "Cmaj7@0/1",
        "Am7@0/1",
        "Dm7@0/1",
        "G7@0/1",
      ]);
      // a double bar is a bar line
      expect(bars("| C || F |")).toEqual(["C@0/1", "F@0/1"]);
    });

    test("qualifiers and N.C.", () => {
      expect(bars("| Cm7 b9 F7 | NC | N.C. |")).toEqual([
        "Cm7 b9@0/1 F7@2/1",
        "N.C.@0/1",
        "N.C.@0/1",
      ]);
    });

    test("% and empty bars", () => {
      expect(bars("| Dm7 G7 | % | | C |")).toEqual([
        "Dm7@0/1 G7@2/1",
        "Dm7@0/1 G7@2/1",
        "",
        "C@0/1",
      ]);
    });

    test("sections", () => {
      const chart = Chart.parse("[A] | C | G |\n[Verse 2] | F | C |");
      expect(chart.bars.map((b) => b.section)).toEqual([
        "A",
        undefined,
        "Verse 2",
        undefined,
      ]);
    });

    test("meters", () => {
      const chart = Chart.parse("| C | 3/4 G | F | 6/8 C |", { meter: "2/2" });
      expect(chart.bars.map((b) => b.meter)).toEqual([
        "2/2",
        "3/4",
        "3/4",
        "6/8",
      ]);
      expect(bars("3/4 | C | F |")).toEqual(["C@0/1", "F@0/1"]);
      expect(Chart.parse("| C |", { meter: "x" }).bars[0].meter).toBe("4/4");
    });

    test("empty", () => {
      expect(Chart.parse("").empty).toBe(true);
      expect(Chart.parse("| |  |").bars).toHaveLength(2);
      expect(Chart.parse(5 as never).empty).toBe(true);
    });
  });

  describe("the split rule", () => {
    test("4/4", () => {
      expect(bars("| C | C F | C F G | C F G A | C F G A B |")).toEqual([
        "C@0/1",
        "C@0/1 F@2/1",
        "C@0/1 F@2/1 G@3/1",
        "C@0/1 F@1/1 G@2/1 A@3/1",
        "C@0/1 F@4/5 G@8/5 A@12/5 B@16/5",
      ]);
    });

    test("3/4 and 5/4", () => {
      expect(bars("3/4 | C F | C F G | C F G A |")).toEqual([
        "C@0/1 F@2/1",
        "C@0/1 F@1/1 G@2/1",
        "C@0/1 F@3/4 G@3/2 A@9/4",
      ]);
      expect(bars("5/4 | C F | C F G |")).toEqual([
        "C@0/1 F@3/1",
        "C@0/1 F@2/1 G@4/1",
      ]);
    });

    test("by the pulses: 6/8, 12/8 and additive meters", () => {
      expect(bars("6/8 | C F | C F G |")).toEqual([
        "C@0/1 F@3/2",
        "C@0/1 F@1/1 G@2/1",
      ]);
      expect(bars("12/8 | C F | C F G |")).toEqual([
        "C@0/1 F@3/1",
        "C@0/1 F@3/1 G@9/2",
      ]);
      expect(bars("2+2+3/8 | C F |")).toEqual(["C@0/1 F@2/1"]);
      expect(bars("7/8 | C F |")).toEqual(["C@0/1 F@2/1"]);
    });

    test("explicit positions", () => {
      expect(bars("| Em7 A7@4 | C@2+1/2 | Dm7@1 G7@3 |")).toEqual([
        "Em7@0/1 A7@3/1",
        "C@3/2",
        "Dm7@0/1 G7@2/1",
      ]);
      // in 6/8 a beat is an eighth: beat 4 is the second dotted quarter
      expect(bars("6/8 | C G@4 |")).toEqual(["C@0/1 G@3/2"]);
      // without a position: the next pulse after the chord before
      expect(bars("| C F@2 G |")).toEqual(["C@0/1 F@1/1 G@2/1"]);
      expect(Chart.parse("| C F@2 G |").problems).toEqual([]);
    });

    test("positions that don't fit", () => {
      const chart = Chart.parse("| C@9 | G@3 C@2 | C@4 G |");
      expect(chart.problems).toEqual([
        'bar 1: invalid position "@9"',
        'bar 2: "C" is placed before the chord before it',
        'bar 3: no room for "G" after the chord before it',
      ]);
      expect(bars("| C@9 |")).toEqual(["C@0/1"]);
    });
  });

  describe("problems", () => {
    test("words, chords and marks it can't read", () => {
      expect(Chart.problems(Chart.parse("| Cmaj7 | xyz | Hm7 |"))).toEqual([
        'bar 2: unknown word "xyz"',
        'bar 3: unknown word "Hm7"',
      ]);
      // an invalid meter keeps the one before
      const chart = Chart.parse("| C | 5/0 C |");
      expect(Chart.problems(chart)).toEqual(['bar 2: invalid meter "5/0"']);
      expect(chart.bars[1].meter).toBe("4/4");
      expect(Chart.problems(Chart.parse("| Cfoo |"))).toEqual([
        'bar 1: unknown chord "Cfoo"',
      ]);
      expect(Chart.problems(Chart.parse("| C <Fine> |"))).toEqual([
        'bar 1: unknown mark "<Fine>"',
      ]);
      expect(Chart.problems(Chart.parse("| C |"))).toEqual([]);
      expect(Chart.problems(null as never)).toEqual([]);
    });
  });

  describe("unroll", () => {
    test("bars with their position, length and meter", () => {
      const form = Chart.unroll(Chart.parse("| C | 3/4 G | F | 6/8 C |"));
      expect(form.map((b) => [b.start, b.length, b.meter])).toEqual([
        [[0, 1], [4, 1], "4/4"],
        [[4, 1], [3, 1], "3/4"],
        [[7, 1], [3, 1], "3/4"],
        [[10, 1], [3, 1], "6/8"],
      ]);
      expect(form.map((b) => [b.bar, b.index, b.chorus, b.pass])).toEqual([
        [0, 0, 1, 1],
        [1, 1, 1, 1],
        [2, 2, 1, 1],
        [3, 3, 1, 1],
      ]);
    });

    test("sections and their runs", () => {
      const run = (text: string, options?: Chart.UnrollOptions) =>
        Chart.unroll(Chart.parse(text), options).map(
          (b) => `${b.section}${b.sectionBar}/${b.sectionLength}`,
        );
      expect(run("| C | [A] | C | G | [B] | F |")).toEqual([
        "0/1",
        "A0/2",
        "A1/2",
        "B0/1",
      ]);
      // two A sections are two runs
      expect(run("[A] | C | G | [A] | C | G |")).toEqual([
        "A0/2",
        "A1/2",
        "A0/2",
        "A1/2",
      ]);
      // a chorus starts a run
      expect(run("[A] | C | G |", { choruses: 2 })).toEqual([
        "A0/2",
        "A1/2",
        "A0/2",
        "A1/2",
      ]);
    });

    test("choruses", () => {
      const form = Chart.unroll(Chart.parse("| C | G |"), { choruses: 3 });
      expect(form.map((b) => b.chorus)).toEqual([1, 1, 2, 2, 3, 3]);
      expect(form[5].start).toEqual([20, 1]);
    });

    test("invalid", () => {
      expect(Chart.unroll(Chart.parse(""))).toEqual([]);
      expect(Chart.unroll(Chart.parse("| C |"), { choruses: 0 })).toEqual([]);
      expect(Chart.unroll(Chart.parse("| C |"), { choruses: 1.5 })).toEqual([]);
      expect(Chart.unroll(null as never)).toEqual([]);
    });
  });

  describe("repeats and endings", () => {
    // the played bars, as their chords with the pass (p2) and ending (e2)
    const order = (text: string, options?: Chart.UnrollOptions) => {
      const chart = Chart.parse(text);
      return Chart.unroll(chart, options)
        .map(
          (b) =>
            chart.bars[b.bar].chords.map((c) => c.symbol).join("") +
            (b.pass > 1 ? `p${b.pass}` : "") +
            (b.ending ? `e${b.ending}` : ""),
        )
        .join(" ");
    };

    test("the written chart", () => {
      const chart = Chart.parse("|: A |1 B :|2 C || D :|x3");
      expect(chart.bars).toEqual([
        {
          meter: "4/4",
          chords: [{ symbol: "A", at: [0, 1] }],
          repeatStart: true,
        },
        {
          meter: "4/4",
          chords: [{ symbol: "B", at: [0, 1] }],
          ending: [1],
          repeatEnd: 2,
        },
        {
          meter: "4/4",
          chords: [{ symbol: "C", at: [0, 1] }],
          ending: [2],
          doubleBar: true,
        },
        { meter: "4/4", chords: [{ symbol: "D", at: [0, 1] }], repeatEnd: 3 },
      ]);
      // a meter after a bar line isn't an ending
      expect(Chart.parse("|3/4 C |").bars[0].meter).toBe("3/4");
      expect(Chart.parse("|1,2 C |").bars[0].ending).toEqual([1, 2]);
      // across lines: ":|" at the start of a line closes the bar before
      expect(Chart.parse("|: A |\n:|2 C |").bars[0].repeatEnd).toBe(2);
    });

    test("repeats", () => {
      expect(order("|: A | B :|")).toBe("A B Ap2 Bp2");
      expect(order("|: A | B :| C |")).toBe("A B Ap2 Bp2 C");
      expect(order("|: A :|x3 B |")).toBe("A Ap2 Ap3 B");
      // without a start: from the start, or after the repeat before
      expect(order("| A :| B |")).toBe("A Ap2 B");
      expect(order("|: A :| B :|")).toBe("A Ap2 B Bp2");
      // two repeats in a row
      expect(order("|: A :| |: B :|")).toBe("A Ap2 B Bp2");
      expect(order("|: A :|: B :|")).toBe("A Ap2 B Bp2");
    });

    test("endings", () => {
      expect(order("|: A |1 B :|2 C | D |")).toBe("A Be1 Ap2 Cp2e2 D");
      // a double bar closes the last ending
      expect(order("|: A |1 B :|2 C | D || E |")).toBe(
        "A Be1 Ap2 Cp2e2 Dp2e2 E",
      );
      // an ending for several passes; as many passes as the highest ending
      expect(order("|: A |1,2 B :|3 C |")).toBe("A Be1 Ap2 Bp2e2 Ap3 Cp3e3");
      expect(order("|: A |1 B :|2 C :|3 D |")).toBe(
        "A Be1 Ap2 Cp2e2 Ap3 Dp3e3",
      );
      // a first ending alone: the second pass skips it
      expect(order("|: A |1 B :| C |")).toBe("A Be1 Ap2 C");
    });

    test("an AABA tune with first and second endings", () => {
      const tune =
        "[A] |: Cmaj7 | Am7 |1 Dm7 | G7 :|2 Dm7 G7 | Cmaj7 ||\n" +
        "[B] | Em7 | A7 | Dm7 | G7 |\n[A] | Cmaj7 | Am7 | Dm7 G7 | Cmaj7 |";
      expect(order(tune)).toBe(
        "Cmaj7 Am7 Dm7e1 G7e1 Cmaj7p2 Am7p2 Dm7G7p2e2 Cmaj7p2e2 " +
          "Em7 A7 Dm7 G7 Cmaj7 Am7 Dm7G7 Cmaj7",
      );
      const form = Chart.unroll(Chart.parse(tune));
      // going back to the bar that starts [A] starts a new run, as if the two
      // A sections were written out
      expect(form.map((b) => `${b.section}${b.sectionBar}`).join(" ")).toBe(
        "A0 A1 A2 A3 A0 A1 A2 A3 B0 B1 B2 B3 A0 A1 A2 A3",
      );
      expect(Chart.chords(Chart.parse(tune)).at(-1)?.start).toEqual([60, 1]);
    });

    test("with choruses", () => {
      expect(order("|: A |1 B :|2 C |", { choruses: 2 })).toBe(
        "A Be1 Ap2 Cp2e2 A Be1 Ap2 Cp2e2",
      );
    });

    test("charts that can't be unrolled", () => {
      const problems = (text: string) => Chart.problems(Chart.parse(text));
      expect(problems("|: A |: B :|")).toEqual([
        "bar 2: a repeat starts inside another repeat",
      ]);
      expect(problems("|: A | B |")).toEqual([
        "bar 1: a repeat starts without a repeat end",
      ]);
      expect(problems("| A |1 B | C |")).toEqual([
        "bar 2: ending 1 has no repeat end",
      ]);
      expect(problems("|: A |1 B |2 C :|")).toEqual([
        "bar 2: ending 1 has no repeat end",
      ]);
      expect(problems("|0 A :|")).toEqual(['bar 1: invalid ending "0"']);
      expect(Chart.unroll(Chart.parse("|: A |: B :|"))).toEqual([]);
      expect(Chart.chords(Chart.parse("| A |1 B | C |"))).toEqual([]);
      expect(Chart.unroll(Chart.parse("| A :|x200000"))).toEqual([]);
    });
  });

  describe("chords and chordAt", () => {
    test("chords last until the next one", () => {
      expect(played("| Dm7 G7 | Cmaj7 | | N.C. |")).toEqual([
        "Dm7 0/1+2/1",
        "G7 2/1+2/1",
        "Cmaj7 4/1+8/1",
        "N.C. 12/1+4/1",
      ]);
      // a chord written again is played again
      expect(played("| C | C | % |")).toEqual([
        "C 0/1+4/1",
        "C 4/1+4/1",
        "C 8/1+4/1",
      ]);
      // across meters and choruses
      expect(played("| C | 3/4 G |", { choruses: 2 })).toEqual([
        "C 0/1+4/1",
        "G 4/1+3/1",
        "C 7/1+4/1",
        "G 11/1+3/1",
      ]);
    });

    test("a 12-bar blues", () => {
      const blues = Chart.chords(
        Chart.parse(
          "| C7 | F7 | C7 | C7 |\n| F7 | F7 | C7 | A7 |\n| Dm7 | G7 | C7 A7 | Dm7 G7 |",
        ),
      );
      const form = Chart.unroll(Chart.parse("| C7 |".repeat(12)));
      const at = (text: string) => Chart.position(form, text) ?? -1;
      expect(Chart.chordAt(blues, at("8:3"))?.symbol).toBe("A7");
      expect(Chart.chordAt(blues, at("11:3"))?.symbol).toBe("A7");
      // the last triplet eighth before beat 3
      expect(Chart.chordAt(blues, at("11:2+2/3"))?.symbol).toBe("C7");
      expect(Chart.chordAt(blues, at("12:4"))?.symbol).toBe("G7");
      expect(Chart.chordAt(blues, 48)).toBeNull();
      // a triplet-eighth comping: twelve onsets in the A7 bars
      const onsets = Array.from({ length: 144 }, (_, i): [number, number] => [
        i,
        3,
      ]);
      const symbols = onsets.map((p) => Chart.chordAt(blues, p)?.symbol);
      expect(symbols.filter((s) => s === "A7")).toHaveLength(12 + 6);
    });

    test("chordAt takes exact numbers and strings", () => {
      const chords = Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |"));
      expect(Chart.chordAt(chords, 0)?.symbol).toBe("Dm7");
      expect(Chart.chordAt(chords, 1.5)?.symbol).toBe("Dm7");
      expect(Chart.chordAt(chords, 2)?.symbol).toBe("G7");
      expect(Chart.chordAt(chords, "7/2")?.symbol).toBe("G7");
      expect(Chart.chordAt(chords, [8, 1])).toBeNull();
      expect(Chart.chordAt(chords, -1)).toBeNull();
      expect(Chart.chordAt(chords, 0.1)).toBeNull();
      expect(Chart.chordAt([], 0)).toBeNull();
    });

    test("a chart that starts with an empty bar", () => {
      const chords = Chart.chords(Chart.parse("| | C |"));
      expect(Chart.chordAt(chords, 1)).toBeNull();
      expect(Chart.chordAt(chords, 4)?.symbol).toBe("C");
    });
  });

  describe("position", () => {
    test("bar and beat of the played form, in each bar's meter", () => {
      const form = Chart.unroll(Chart.parse("| C | 3/4 G | 6/8 F |"));
      expect(Chart.position(form, "1:1")).toEqual([0, 1]);
      expect(Chart.position(form, "2:3")).toEqual([6, 1]);
      expect(Chart.position(form, "3:4")).toEqual([17, 2]);
      expect(Chart.position(form, "3:2+1/2")).toEqual([31, 4]);
    });

    test("invalid", () => {
      const form = Chart.unroll(Chart.parse("| C |"));
      expect(Chart.position(form, "2:1")).toBeNull();
      expect(Chart.position(form, "0:1")).toBeNull();
      expect(Chart.position(form, "1:5")).toBeNull();
      expect(Chart.position(form, "x")).toBeNull();
      expect(Chart.position(null as never, "1:1")).toBeNull();
    });
  });
});
