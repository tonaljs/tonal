import { describe, expect, test } from "vitest";
import * as Chart from "./index";

// the chords of each bar, as "value@at"
const bars = (text: string, options?: Chart.ParseOptions) =>
  Chart.parse(text, options).bars.map((bar) =>
    bar.chords.map((c) => `${c.value}@${c.at[0]}/${c.at[1]}`).join(" "),
  );

// the played chords, as "value start+duration"
const played = (text: string, options?: Chart.UnrollOptions) =>
  Chart.chords(Chart.parse(text), options).map(
    (c) =>
      `${c.value} ${c.start[0]}/${c.start[1]}+${c.duration[0]}/${c.duration[1]}`,
  );

describe("@tonaljs/chart", () => {
  describe("parse", () => {
    test("bars and chords", () => {
      expect(Chart.parse("| Cmaj7 | Dm7 G7 |")).toEqual({
        empty: false,
        bars: [
          { meter: "4/4", chords: [{ value: "Cmaj7", at: [0, 1] }] },
          {
            meter: "4/4",
            chords: [
              { value: "Dm7", at: [0, 1] },
              { value: "G7", at: [2, 1] },
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
      expect(Chart.problems(Chart.parse("| C <Fin> |"))).toEqual([
        'bar 1: unknown mark "<Fin>"',
      ]);
      expect(Chart.problems(Chart.parse("| C |"))).toEqual([]);
      expect(Chart.problems(null as never)).toEqual([]);
    });
  });

  describe("unroll", () => {
    test("bars with their position, duration and meter", () => {
      const form = Chart.unroll(Chart.parse("| C | 3/4 G | F | 6/8 C |"));
      expect(form.map((b) => [b.start, b.duration, b.meter])).toEqual([
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
            chart.bars[b.bar].chords.map((c) => c.value).join("") +
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
          chords: [{ value: "A", at: [0, 1] }],
          repeatStart: true,
        },
        {
          meter: "4/4",
          chords: [{ value: "B", at: [0, 1] }],
          ending: [1],
          repeatEnd: 2,
        },
        {
          meter: "4/4",
          chords: [{ value: "C", at: [0, 1] }],
          ending: [2],
          doubleBar: true,
        },
        { meter: "4/4", chords: [{ value: "D", at: [0, 1] }], repeatEnd: 3 },
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

  describe("jumps: D.C., D.S., coda and fine", () => {
    // the played bars, as their chords with the chorus (c2)
    const order = (text: string, options?: Chart.UnrollOptions) => {
      const chart = Chart.parse(text);
      return Chart.unroll(chart, options)
        .map(
          (b) =>
            chart.bars[b.bar].chords.map((c) => c.value).join("") +
            (b.chorus > 1 ? `c${b.chorus}` : ""),
        )
        .join(" ");
    };
    const problems = (text: string) => Chart.problems(Chart.parse(text));

    test("the written chart", () => {
      const chart = Chart.parse(
        "| F | <Segno> A | B <To Coda> | C | <d.s. al coda> | <Coda> D <Fine> |",
      );
      const marks = chart.bars.map((bar) => {
        const { meter, chords, ...rest } = bar;
        void meter;
        void chords;
        return rest;
      });
      expect(marks).toEqual([
        {},
        { segno: true },
        { toCoda: true },
        { jump: "D.S. al Coda" },
        { coda: true, fine: true },
      ]);
      // a mark alone at the end of a line closes the bar before
      expect(Chart.parse("| A | B |\n<D.C.>").bars[1].jump).toBe("D.C.");
    });

    test("D.C. and D.S.", () => {
      expect(order("| A | B <D.C.> |")).toBe("A B A B");
      expect(order("| A <Fine> | B | C <D.C. al Fine> |")).toBe("A B C A");
      expect(order("| F | <Segno> A | B <Fine> | C <D.S. al Fine> |")).toBe(
        "F A B C A B",
      );
      expect(order("| F | <Segno> A | B <D.S.> |")).toBe("F A B A B");
    });

    test("al Coda", () => {
      expect(
        order("| A | B <To Coda> | C <D.C. al Coda> | <Coda> D | E |"),
      ).toBe("A B C A B D E");
      // the jump alone between bar lines belongs to the bar before
      expect(order("| A | B <To Coda> | C | <D.C. al Coda> | <Coda> D |")).toBe(
        "A B C A B D",
      );
      // To Coda and Coda without a jump: a D.C. al Coda before the coda
      expect(order("| A | B <To Coda> | C | <Coda> D |")).toBe("A B C A B D");
    });

    test("repeats and endings after a jump", () => {
      // no repeats, the last ending (the case music21 gets wrong)
      expect(order("| C |: D |1 E :|2 F | G <D.C.> |")).toBe(
        "C D E D F G C D F G",
      );
      expect(
        order("| C |: D |1 E :|2 F | G <D.C.> |", { repeatsOnJump: true }),
      ).toBe("C D E D F G C D E D F G");
      // a lone first ending is skipped after the jump
      expect(order("|: A |1 B :| C <D.C.> |")).toBe("A B A C A C");
    });

    test("choruses: the coda only at the end of the last chorus", () => {
      expect(
        order("| A | B <To Coda> | C <D.C. al Coda> | <Coda> D |", {
          choruses: 2,
        }),
      ).toBe("A B C Ac2 Bc2 Cc2 Ac2 Bc2 Dc2");
      // D.S.: the intro only in the first chorus
      expect(
        order("| F | <Segno> A | B <To Coda> | C <D.S. al Coda> | <Coda> D |", {
          choruses: 3,
        }),
      ).toBe("F A B C Ac2 Bc2 Cc2 Ac3 Bc3 Cc3 Ac3 Bc3 Dc3");
      // al Fine
      expect(order("| A <Fine> | B <D.C. al Fine> |", { choruses: 2 })).toBe(
        "A B Ac2 Bc2 Ac2",
      );
    });

    test("choruses: a plain D.C. or D.S. is part of the tune", () => {
      expect(order("| A | B <D.C.> |", { choruses: 2 })).toBe(
        "A B A B Ac2 Bc2 Ac2 Bc2",
      );
      // the whole tune, intro included
      expect(order("| F | <Segno> A | B <D.S.> |", { choruses: 2 })).toBe(
        "F A B A B Fc2 Ac2 Bc2 Ac2 Bc2",
      );
    });

    test("marks that don't fit", () => {
      expect(problems("| A | B <D.S.> |")).toEqual([
        "bar 2: D.S. without a <Segno>",
      ]);
      expect(problems("| A <Fine> | B <D.C.> |")).toEqual([
        "bar 1: <Fine> without a D.C. al Fine or D.S. al Fine",
      ]);
      expect(problems("| A | B <D.C. al Fine> |")).toEqual([
        "bar 2: D.C. al Fine without a <Fine>",
      ]);
      expect(problems("| A | B <D.C. al Coda> |")).toEqual([
        "bar 2: D.C. al Coda without a <To Coda> and a <Coda>",
      ]);
      expect(problems("| A <D.C.> | B <D.S.> |")).toEqual([
        "bar 2: a second jump",
      ]);
      expect(problems("| <Coda> A | B <To Coda> <D.C. al Coda> |")).toEqual([
        "bar 1: <To Coda> must come before the jump, and <Coda> after it",
      ]);
      expect(problems("| A | B <Wrong> |")).toEqual([
        'bar 2: unknown mark "<Wrong>"',
      ]);
      expect(Chart.unroll(Chart.parse("| A | B <D.S.> |"))).toEqual([]);
    });
  });

  describe("the conventions of real charts", () => {
    // the played bars, as their chords, with the pass (p2) and the ending (e2)
    const order = (text: string, options?: Chart.UnrollOptions) => {
      const chart = Chart.parse(text);
      return Chart.unroll(chart, options)
        .map((b) => chart.bars[b.bar].chords.map((c) => c.value).join(""))
        .join(" ");
    };
    const problems = (text: string) => Chart.problems(Chart.parse(text));

    test("an ending can start a section", () => {
      const text = "[A] |: C |1 G :| [B] |2 F |";
      expect(problems(text)).toEqual([]);
      expect(order(text)).toBe("C G C F");
      expect(
        Chart.unroll(Chart.parse(text)).map((b) => [b.section, b.ending]),
      ).toEqual([
        ["A", undefined],
        ["A", 1],
        ["A", undefined],
        ["B", 2],
      ]);
      // a section without an ending still closes the group
      expect(problems("|: C |1 G :| [B] F |")).toEqual([]);
      expect(order("|: C |1 G :| [B] F |")).toBe("C G C F");
    });

    test("D.C. or D.S. al 1st, 2nd or 3rd ending", () => {
      // back to the start, then the second ending, then the Fine
      expect(order("|: A |1 B :|2 C <Fine> || D <D.C. al 2nd ending> |")).toBe(
        "A B A C D A C",
      );
      // without a Fine, on to the end
      expect(order("|: A |1 B :|2 C || D <D.C. al 2nd ending> |")).toBe(
        "A B A C D A C D",
      );
      // dal segno
      expect(
        order("| F |: <Segno> A |1 B :|2 C <Fine> || D <D.S. al 2nd ending> |"),
      ).toBe("F A B A C D A C");
      // also written "2nd End."
      expect(Chart.parse("| A <D.C. al 2nd End.> |").bars[0].jump).toBe(
        "D.C. al 2nd ending",
      );
      // with choruses, the jump ends the tune
      expect(
        order("|: A |1 B :|2 C <Fine> || D <D.C. al 2nd ending> |", {
          choruses: 2,
        }),
      ).toBe("A B A C D A B A C D A C");
      expect(problems("| A | B <D.C. al 3rd ending> |")).toEqual([
        "bar 2: D.C. al 3rd ending without an ending 3",
      ]);
    });

    test("an ending after the jump joins its group", () => {
      // ending 3 is written after the jump: only the jump plays it
      const text = "|: A |1 B :|2 C || D <D.C. al 3rd ending> |3 E |";
      expect(problems(text)).toEqual([]);
      expect(order(text)).toBe("A B A C D A E");
      // the repeat still plays two passes
      expect(
        order("|: A |1 B :|2 C || D <D.C. al 3rd ending> |3 E <Fine> | F |"),
      ).toBe("A B A C D A E");
      // in a repeat of its own, an ending that goes on with the numbers
      // (charts that number endings across sections) is a new group, played
      // as before
      expect(problems("|: A |1 B :|2 C || [B] |: D |3 E :|4 F |")).toEqual([]);
      expect(order("|: A |1 B :|2 C || [B] |: D |3 E :|4 F |")).toBe(
        "A B A C D F",
      );
      // without a jump to it, it's never played: a problem
      expect(problems("|: A |1 B :|2 C || D |3 E |")).toEqual([
        "bar 5: ending 3 is after its group, and no jump goes to it",
      ]);
    });

    test("a coda alone follows the last chorus", () => {
      expect(problems("| C | G | <Coda> F |")).toEqual([]);
      expect(order("| C | G | <Coda> F |")).toBe("C G F");
      expect(order("| C | G | <Coda> F |", { choruses: 2 })).toBe("C G C G F");
      // with a repeat in the form, and a vamp in the coda
      expect(order("|: C :| G | <Coda> F |: Bb :|", { choruses: 2 })).toBe(
        "C C G C C G F Bb Bb",
      );
    });

    test("a fine without a jump is only a sign", () => {
      expect(problems("| C | F <Fine> | G7 |")).toEqual([]);
      expect(order("| C | F <Fine> | G7 |")).toBe("C F G7");
      expect(order("| C | F <Fine> | G7 |", { choruses: 2 })).toBe(
        "C F G7 C F G7",
      );
    });

    test("a segno without a D.S. is only a sign", () => {
      expect(problems("| A <D.C.> | <Segno> B |")).toEqual([]);
      expect(order("| A | <Segno> B |")).toBe("A B");
      expect(order("| A | <Segno> B <D.C.> |")).toBe("A B A B");
    });

    test("the new jumps round-trip as text", () => {
      const text = "|: A |1 B :|2 C <Fine> ||\n| D <D.C. al 2nd ending> |";
      const chart = Chart.parse(text);
      expect(Chart.parse(Chart.toText(chart)).bars).toEqual(chart.bars);
      expect(Chart.toText(chart)).toContain("<D.C. al 2nd ending>");
    });
  });

  describe("fromForm", () => {
    const sections = {
      Intro: "| Am | D7 |",
      A: "| C | G |",
      B: "3/4 | F | E7 |",
    };
    const runs = (form: string) =>
      Chart.unroll(Chart.fromForm(sections, form))
        .map((b) => `${b.section}${b.sectionBar}`)
        .join(" ");

    test("sections in the order of the form", () => {
      expect(runs("A A B A")).toBe("A0 A1 A0 A1 B0 B1 A0 A1");
      expect(runs("Intro A*2 B A")).toBe(
        "Intro0 Intro1 A0 A1 A0 A1 B0 B1 A0 A1",
      );
      // letter by letter, when no section has that name
      expect(runs("AABA")).toBe("A0 A1 A0 A1 B0 B1 A0 A1");
      const chart = Chart.fromForm(sections, "A B");
      expect(chart.bars.map((b) => b.section)).toEqual([
        "A",
        undefined,
        "B",
        undefined,
      ]);
    });

    test("each section keeps its own meter", () => {
      const form = Chart.unroll(Chart.fromForm(sections, "A B A"));
      expect(form.map((b) => b.meter)).toEqual([
        "4/4",
        "4/4",
        "3/4",
        "3/4",
        "4/4",
        "4/4",
      ]);
      expect(form[5].start).toEqual([18, 1]);
      const waltz = Chart.fromForm({ A: "| C |" }, "A", { meter: "3/4" });
      expect(waltz.bars[0].meter).toBe("3/4");
    });

    test("repeats and jumps in the sections", () => {
      const chart = Chart.fromForm(
        { A: "|: C | G :|", B: "| F <D.C.> |" },
        "A B",
      );
      expect(
        Chart.unroll(chart)
          .map((b) => chart.bars[b.bar].chords[0].value)
          .join(" "),
      ).toBe("C G C G F C G F");
    });

    test("problems", () => {
      const unknown = Chart.fromForm(sections, "A C");
      expect(unknown.empty).toBe(true);
      expect(Chart.problems(unknown)).toEqual(['unknown section "C"']);
      expect(
        Chart.problems(Chart.fromForm({ A: "| C | xyz |" }, "A A")),
      ).toEqual(['section "A", bar 2: unknown word "xyz"']);
      expect(
        Chart.problems(Chart.fromForm({ A: "", B: "| C |" }, "A B")),
      ).toEqual(['section "A" has no bars']);
      expect(Chart.fromForm(sections, "").empty).toBe(true);
      expect(Chart.fromForm(null as never, "A").empty).toBe(true);
      expect(Chart.fromForm(sections, 5 as never).empty).toBe(true);
      expect(Chart.fromForm({ toString: 5 } as never, "toString").empty).toBe(
        true,
      );
    });
  });

  describe("bar lines next to each other", () => {
    const count = (text: string) => Chart.parse(text).bars.length;
    test("bar lines with only spaces between them are one bar line", () => {
      expect(count("|: A |1,2 B :|x3 |3 C |")).toBe(3);
      expect(count("|: A |1,2 B :|x3|3 C |")).toBe(3);
      expect(count("| A || |: B :|")).toBe(2);
      expect(count("|: A :| |: B :|")).toBe(2);
      expect(count("| A :| | B |")).toBe(2);
      expect(count("|: | A :|")).toBe(1);
      expect(Chart.parse("|: A |1,2 B :|x3 |3 C |").bars[2].ending).toEqual([
        3,
      ]);
    });

    test("except two plain ones: an empty bar", () => {
      expect(count("| A | | B |")).toBe(3);
      expect(count("| A | | | B |")).toBe(4);
      expect(count("| A :| | | B |")).toBe(3);
      // the empty bar keeps the marks of the bar lines around it
      const chart = Chart.parse("|: | | A :|");
      expect(chart.bars[0]).toEqual({
        meter: "4/4",
        chords: [],
        repeatStart: true,
      });
      expect(Chart.parse("| A | | :|").bars[1].repeatEnd).toBe(2);
    });
  });

  describe("toText, transpose and barAt", () => {
    const charts = [
      "| Cmaj7 | Dm7 G7 |",
      "Cmaj7 | Am7\nDm7 | G7",
      "| Cm7 b9 F7 | NC | N.C. |",
      "| Dm7 G7 | % | | C |",
      "[A] | C | G |\n[Verse 2] | F | C |",
      "| C | 3/4 G | F | 6/8 C |",
      "| C | C F | C F G | C F G A | C F G A B |",
      "6/8 | C F | C F G | C G@4 |",
      "| Em7 A7@4 | C@2+1/2 | Dm7@1 G7@3 | C F@2 G |",
      "2+2+3/8 | C F | C@3 G |",
      "|: A |1 B :|2 C || D :|x3",
      "|: A |1,2 B :|x3 |3 C |",
      "|: A :| |: B :|",
      "| A || |: B :|",
      "|: | A :|",
      "| A :| | B |",
      "|: | | A :|",
      "| A :| | | B |",
      "| A | | | :|",
      "| A | 3/4 <Segno> | B <D.S.> |",
      "| A :|| B |",
      "| | C |",
      "[A] |: Cmaj7 | Am7 |1 Dm7 | G7 :|2 Dm7 G7 | Cmaj7 ||\n[B] | Em7 | A7 | Dm7 | G7 |",
      "| F | <Segno> A | B <To Coda> | C | <d.s. al coda> | <Coda> D <Fine> |",
      "[Intro] | Gm7 C7 |\n[A] | <Segno> F | Gm7 C7 <To Coda> | G7 <D.S. al Coda> |\n[Coda] | <Coda> F6 |",
      "3/4 |: Gmaj7 | Em7 :|x3 4/4 Gmaj7 C7 | G6 |",
    ];

    test("toText gives back the same chart", () => {
      for (const text of charts) {
        const chart = Chart.parse(text);
        expect(Chart.parse(Chart.toText(chart)).bars, text).toEqual(chart.bars);
      }
    });

    test("toText", () => {
      expect(Chart.toText(Chart.parse("[A] |: C | G7 :| [B] | F |"))).toBe(
        "[A] |: C | G7 :|\n[B] | F |",
      );
      // four bars a line, meters where they change, positions where needed
      expect(
        Chart.toText(
          Chart.parse("| C | D | E | F | G | 3/4 A | B@2 C | Dm7 G7 | %"),
        ),
      ).toBe("| C | D | E | F |\n| G | 3/4 A | B@2 C@3 | Dm7 G7 |\n| Dm7 G7 |");
      expect(Chart.toText(Chart.parse(""))).toBe("");
      expect(Chart.toText(null as never)).toBe("");
    });

    test("transpose", () => {
      const chart = Chart.parse(
        "[A] |: Dm7 G7 |1 Cmaj7 :|2 C7/E Cm7 b9@3 | N.C. <D.C.> |",
      );
      expect(Chart.toText(Chart.transpose(chart, "2M"))).toBe(
        "[A] |: Em7 A7 |1 Dmaj7 :|2 D7/F# Dm7 b9 | N.C. <D.C.> |",
      );
      expect(Chart.transpose(chart, "-2m").bars[0].chords[0].value).toBe(
        "C#m7",
      );
      expect(Chart.transpose(chart, "x").empty).toBe(true);
      expect(Chart.transpose(Chart.parse(""), "2M").empty).toBe(true);
    });

    test("barAt", () => {
      const played = Chart.unroll(Chart.parse("| C | 3/4 G | F |"));
      expect(Chart.barAt(played, 0)?.index).toBe(0);
      expect(Chart.barAt(played, 3.5)?.index).toBe(0);
      expect(Chart.barAt(played, 4)?.index).toBe(1);
      expect(Chart.barAt(played, "13/2")?.index).toBe(1);
      expect(Chart.barAt(played, [7, 1])?.index).toBe(2);
      expect(Chart.barAt(played, 11)).toBeNull();
      expect(Chart.barAt(played, -1)).toBeNull();
      expect(Chart.barAt(played, 0.1)).toBeNull();
      expect(Chart.barAt([], 0)).toBeNull();
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
      expect(Chart.chordAt(blues, at("8:3"))?.value).toBe("A7");
      expect(Chart.chordAt(blues, at("11:3"))?.value).toBe("A7");
      // the last triplet eighth before beat 3
      expect(Chart.chordAt(blues, at("11:2+2/3"))?.value).toBe("C7");
      expect(Chart.chordAt(blues, at("12:4"))?.value).toBe("G7");
      expect(Chart.chordAt(blues, 48)).toBeNull();
      // a triplet-eighth comping: twelve onsets in the A7 bars
      const onsets = Array.from({ length: 144 }, (_, i): [number, number] => [
        i,
        3,
      ]);
      const symbols = onsets.map((p) => Chart.chordAt(blues, p)?.value);
      expect(symbols.filter((s) => s === "A7")).toHaveLength(12 + 6);
    });

    test("chordAt takes exact numbers and strings", () => {
      const chords = Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |"));
      expect(Chart.chordAt(chords, 0)?.value).toBe("Dm7");
      expect(Chart.chordAt(chords, 1.5)?.value).toBe("Dm7");
      expect(Chart.chordAt(chords, 2)?.value).toBe("G7");
      expect(Chart.chordAt(chords, "7/2")?.value).toBe("G7");
      expect(Chart.chordAt(chords, [8, 1])).toBeNull();
      expect(Chart.chordAt(chords, -1)).toBeNull();
      expect(Chart.chordAt(chords, 0.1)).toBeNull();
      expect(Chart.chordAt([], 0)).toBeNull();
    });

    test("a chart that starts with an empty bar", () => {
      const chords = Chart.chords(Chart.parse("| | C |"));
      expect(Chart.chordAt(chords, 1)).toBeNull();
      expect(Chart.chordAt(chords, 4)?.value).toBe("C");
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

  test("N.C. is a rest", () => {
    const chart = Chart.parse("| Dm7 G7 | NC | Cmaj7 |");
    expect(chart.bars[1].chords).toEqual([
      { value: "N.C.", at: [0, 1], rest: true },
    ]);
    expect(chart.bars[0].chords[0].rest).toBeUndefined();
    expect(Chart.chords(chart).map((c) => [c.value, c.rest])).toEqual([
      ["Dm7", undefined],
      ["G7", undefined],
      ["N.C.", true],
      ["Cmaj7", undefined],
    ]);
    expect(Chart.chordAt(Chart.chords(chart), 5)?.rest).toBe(true);
    const moved = Chart.transpose(chart, "2M");
    expect(moved.bars[1].chords).toEqual([
      { value: "N.C.", at: [0, 1], rest: true },
    ]);
    expect(Chart.parse(Chart.toText(chart)).bars).toEqual(chart.bars);
  });
});
