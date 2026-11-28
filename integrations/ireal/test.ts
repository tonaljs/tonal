import * as Chart from "@tonaljs/chart";
import { describe, expect, test } from "vitest";
import * as IReal from "./index";

// irealb:// music is scrambled in 50-character blocks; the permutation is its
// own inverse, so this builds test links from readable music
function scramble(music: string): string {
  const swap = (s: string) => {
    const c = s.split("");
    for (let i = 0; i < 50; i++) {
      if (i < 5 || (i >= 10 && i < 24)) {
        c[i] = s[49 - i];
        c[49 - i] = s[i];
      }
    }
    return c.join("");
  };
  let s = music;
  let out = "";
  while (s.length > 51) {
    out += swap(s.slice(0, 50));
    s = s.slice(50);
  }
  return "1r34LbKcu7" + out + s;
}
// an irealb:// song: title, composer, (unused), style, key, transpose, music,
// groove, tempo, repeats
const irealb = (songs: string[][], name?: string) =>
  "irealb://" +
  encodeURIComponent(
    songs
      .map(
        ([
          title,
          composer,
          style,
          key,
          music,
          groove = "",
          tempo = "0",
          repeats = "0",
        ]) =>
          [
            title,
            composer,
            "",
            style,
            key,
            "",
            scramble(music),
            groove,
            tempo,
            repeats,
          ].join("="),
      )
      .join("===") + (name !== undefined ? `===${name}` : ""),
  );
const irealbook = (music: string, title = "Test", key = "C") =>
  `irealbook://${title}=Composer Some=Medium Swing=${key}=n=${music}`;

// the first song of a link
const song = (url: string) => IReal.parse(url).songs[0];
// the chords of each bar, as "value@at"
const bars = (url: string) =>
  song(url).chart.bars.map((bar) =>
    bar.chords.map((c) => `${c.value}@${c.at[0]}/${c.at[1]}`).join(" "),
  );
// the played form, as the first chord of each bar
const played = (url: string, options?: Chart.UnrollOptions) => {
  const { chart } = song(url);
  return Chart.unroll(chart, options)
    .map((b) => chart.bars[b.bar].chords[0]?.value ?? "-")
    .join(" ");
};

describe("@tonaljs/ireal", () => {
  describe("chord", () => {
    test("qualities", () => {
      const cases: [string, string][] = [
        ["C", "C"],
        ["C^", "C"],
        ["C^7", "Cmaj7"],
        ["C-7", "Cm7"],
        ["Ch7", "Cm7b5"],
        ["Ch", "Cm7b5"],
        ["Co7", "Cdim7"],
        ["C-^7", "CmMaj7"],
        ["C7sus", "C7sus4"],
        ["C69", "C69"],
        ["C2", "Cadd9"],
        ["C7b9b13", "C7b9b13"],
        ["C7alt", "C7alt"],
        ["C+", "Caug"],
        ["Bb-7/Ab", "Bbm7/Ab"],
        ["F#h7/C", "F#m7b5/C"],
      ];
      for (const [ireal, tonal] of cases)
        expect([ireal, IReal.chord(ireal)]).toEqual([ireal, tonal]);
    });
    test("custom qualities between asterisks", () => {
      expect(IReal.chord("Eb*7M*")).toBe("Ebmaj7");
      expect(IReal.chord("A*m7b5*")).toBe("Am7b5");
      expect(IReal.chord("D*m*")).toBe("Dm");
      expect(IReal.chord("G**")).toBe("G");
    });
    test("not a chord", () => {
      expect(IReal.chord("Xyz")).toBe("");
      expect(IReal.chord("C-7 G7")).toBe("");
      expect(IReal.chord("")).toBe("");
      expect(IReal.chord(42 as unknown as string)).toBe("");
    });
  });

  describe("parse: links and fields", () => {
    test("an irealbook:// song", () => {
      const s = song(irealbook("[T44C^7 |A-7 |D-7 |G7 Z", "My Song", "Eb"));
      expect([s.title, s.composer, s.style, s.key, s.keyName]).toEqual([
        "My Song",
        "Composer Some",
        "Medium Swing",
        "Eb",
        "Eb major",
      ]);
      expect([s.transpose, s.groove, s.tempo, s.repeats]).toEqual([
        0,
        "",
        0,
        0,
      ]);
      expect(Chart.toText(s.chart)).toBe("| Cmaj7 | Am7 | Dm7 | G7 ||");
    });
    test("an irealbook:// playlist", () => {
      const url =
        "irealbook://One=A B=Ballad=F=n=[T44F |C7 Z=Two=C D=Bossa Nova=A-=n=[T44A- |E7 Z=My List";
      const playlist = IReal.parse(url);
      expect(playlist.name).toBe("My List");
      expect(playlist.songs.map((s) => [s.title, s.keyName])).toEqual([
        ["One", "F major"],
        ["Two", "A minor"],
      ]);
    });
    test("an irealb:// playlist, scrambled", () => {
      const long =
        "{*AT44C^7XyQ|A-7XyQ|D-7XyQ|G7XyQ}[*BE-7XyQ|A7XyQ|D-7XyQ|G7XyQZ";
      const url = irealb(
        [
          [
            "Long One",
            "Doe Jane",
            "Medium Up Swing",
            "C",
            long,
            "Jazz-Medium Swing",
            "180",
            "3",
          ],
          ["Short", "Roe Jim", "Waltz", "Bb-", "[T34Bb-XyQ|F7XyQZ"],
        ],
        "Scrambled",
      );
      const playlist = IReal.parse(url);
      expect(playlist.problems).toEqual([]);
      expect(playlist.name).toBe("Scrambled");
      const [one, two] = playlist.songs;
      expect([one.title, one.groove, one.tempo, one.repeats]).toEqual([
        "Long One",
        "Jazz-Medium Swing",
        180,
        3,
      ]);
      expect(Chart.toText(one.chart)).toBe(
        "[A] |: Cmaj7 | Am7 | Dm7 | G7 :|\n[B] | Em7 | A7 | Dm7 | G7 ||",
      );
      expect([two.keyName, Chart.toText(two.chart)]).toEqual([
        "Bb minor",
        "| 3/4 Bbm | F7 ||",
      ]);
    });
    test("a link copied from HTML keeps its entities", () => {
      const s = song("irealbook://Don&#039;t Go=A B=Ballad=C=n=[T44C |G7 Z");
      expect(s.title).toBe("Don't Go");
    });
    test("not a link: an empty playlist with problems", () => {
      expect(IReal.parse("")).toEqual({
        name: "",
        songs: [],
        problems: ["not an iReal Pro link"],
      });
      expect(IReal.parse("https://example.com").songs).toEqual([]);
      expect(IReal.parse(undefined as unknown as string).problems).toEqual([
        "not an iReal Pro link",
      ]);
      expect(IReal.parse("irealb://%E0%A4%A").problems).toEqual([
        "the link isn't percent-encoded right",
      ]);
      expect(IReal.parse("irealb://only text").problems).toEqual([
        "no song in the link",
      ]);
    });
  });

  describe("parse: the chart", () => {
    test("chords by cell: a 4/4 bar has 4 cells", () => {
      // two blanks, then the chord on beat 4
      expect(bars(irealbook("[T44C^7  G7|C^7 Z"))).toEqual([
        "Cmaj7@0/1 G7@3/1",
        "Cmaj7@0/1",
      ]);
      // commas separate chords without a cell
      expect(bars(irealbook("[T44C,D-,E-,F|C Z"))).toEqual([
        "C@0/1 Dm@1/1 Em@2/1 F@3/1",
        "C@0/1",
      ]);
      // three chords as 1 + 1 + 2 beats (a blank is a cell too)
      expect(bars(irealbook("[T44C,D-,E-, Z"))[0]).toBe("C@0/1 Dm@1/1 Em@2/1");
      expect(bars(irealbook("[T44C D- E-  Z"))[0]).toBe("C@0/1 Dm@2/1 Em@3/1");
    });
    test("blanks after a closing bar line are alignment, not a bar", () => {
      expect(bars(irealbook("{C |G7 }        [F |C Z"))).toEqual([
        "C@0/1",
        "G7@0/1",
        "F@0/1",
        "C@0/1",
      ]);
    });
    test("sections, before or after the bar line", () => {
      const sections = (music: string) =>
        song(irealbook(music)).chart.bars.map((b) => b.section ?? "");
      expect(sections("*A[C |G ]*B[F |C Z")).toEqual(["A", "", "B", ""]);
      expect(sections("[*AC |G ][*BF |C Z")).toEqual(["A", "", "B", ""]);
      expect(sections("[*iC |G ][*vF |C Z")).toEqual([
        "Intro",
        "",
        "Verse",
        "",
      ]);
    });
    test("repeated bars: x is the bar before, r the two before", () => {
      expect(bars(irealbook("[C |G7 | x |F |C | r| Z"))).toEqual([
        "C@0/1",
        "G7@0/1",
        "G7@0/1",
        "F@0/1",
        "C@0/1",
        "F@0/1",
        "C@0/1",
      ]);
    });
    test("no chord, slash, invisible chord", () => {
      const s = song(irealbook("[C7ppF7|n   |C^7 W/E  Z"));
      expect(
        s.chart.bars.map((b) =>
          b.chords.map((c) => c.value + (c.rest ? "(rest)" : "")).join(" "),
        ),
      ).toEqual(["C7 F7", "N.C.(rest)", "Cmaj7 Cmaj7/E"]);
      expect(s.chart.bars[0].chords[1].at).toEqual([3, 1]);
    });
    test("meters change from their bar on", () => {
      expect(
        song(irealbook("[T44C |T34F |G Z")).chart.bars.map((b) => b.meter),
      ).toEqual(["4/4", "3/4", "3/4"]);
      expect(song(irealbook("[T68C |F Z")).chart.bars[0].meter).toBe("6/8");
    });
    test("endings, repeat counts and N0", () => {
      const url = irealbook("{C |N1G7 }        |N2F <3x> }|N0C Z");
      const chart = song(url).chart;
      expect(chart.bars.map((b) => b.ending?.join(",") ?? "")).toEqual([
        "",
        "1",
        "2",
        "3",
      ]);
      expect(chart.bars[2].repeatEnd).toBe(3);
    });
    test("jumps: D.C. al Coda with two coda signs", () => {
      const url = irealbook("[C |G7Q |F <D.C. al Coda> ][QBb |C Z");
      expect(Chart.problems(song(url).chart)).toEqual([]);
      expect(played(url)).toBe("C G7 F C G7 Bb C");
    });
    test("a coda alone: one sign, played after the last chorus", () => {
      const url = irealbook("[C |G7 ][QF |C Z");
      expect(played(url, { choruses: 2 })).toBe("C G7 C G7 F C");
    });
    test("D.C. al 2nd ending, as iReal Pro writes it", () => {
      const url = irealbook(
        "{C |N1G7 }        |N2F <Fine>]|Bb <D.C. al 2nd End.> Z",
      );
      expect(song(url).chart.bars[3].jump).toBe("D.C. al 2nd ending");
      expect(played(url)).toBe("C G7 C F Bb C F");
    });
    test("segno and fine", () => {
      const url = irealbook("[C |SF |G7 <Fine>|Bb <D.S. al Fine> Z");
      expect(played(url)).toBe("C F G7 Bb F G7");
    });
    test("alternates and comments, with their bar", () => {
      const s = song(irealbook("[C(A-7) |<Solos>G7 |F <*36Repeat> Z"));
      expect(s.alternates).toEqual([{ bar: 0, value: "A-7" }]);
      expect(s.comments).toEqual([
        { bar: 1, text: "Solos" },
        { bar: 2, text: "Repeat" },
      ]);
    });
    test("what can't be read goes to the chart's problems", () => {
      const s = song(irealbook("[C |Xb7 |G7 Z"));
      expect(s.chart.problems).toEqual([
        'bar 2: unknown token "X"',
        'bar 2: unknown token "b"',
        'bar 2: unknown token "7"',
      ]);
      expect(s.chart.bars.length).toBe(3);
    });
  });
});
