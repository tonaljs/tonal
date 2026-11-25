import { describe, expect, test } from "vitest";
import Chord from "@tonaljs/chord";
import Note from "@tonaljs/note";
import * as VoicingDictionary from "./index";

// "10m" => "3m", "13M" => "6M", "8P" => "1P"
const simple = (interval: string) => {
  const [, num, quality] = interval.match(/^(\d+)(.+)$/) ?? [];
  return ((+num - 1) % 7) + 1 + quality;
};
const chroma = (interval: string) => Note.chroma(Note.transpose("C", interval));
// ninths, elevenths and thirteenths, natural or altered
const TENSIONS = ["2m", "2M", "2A", "4P", "4A", "6m", "6M"];

describe("data", () => {
  test("every note is a chord tone or a tension, spelled as in the chord", () => {
    const { all } = VoicingDictionary;
    for (const [symbol, voicings] of Object.entries(all)) {
      const chord = Chord.get("C" + symbol);
      expect(chord.empty, symbol).toBe(false);
      const chordTones = chord.intervals.map(simple);
      const chordChromas = chord.intervals.map(chroma);
      for (const voicing of voicings) {
        for (const interval of voicing.split(" ").map(simple)) {
          const where = `${symbol}: ${voicing}`;
          if (chordTones.includes(interval)) continue;
          expect(TENSIONS, where).toContain(interval);
          // a tension that sounds like a chord tone is spelled as the chord tone
          expect(chordChromas, where).not.toContain(chroma(interval));
        }
      }
    }
  });

  test("fixed voicings", () => {
    const { lefthand } = VoicingDictionary;
    expect(lefthand["69"]).toEqual(["3M 5P 6M 9M"]);
    expect(lefthand["7#11"]).toEqual(["7m 9M 11A 13M"]);
    expect(lefthand.o7).toEqual(["1P 3m 5d 7d", "5d 7d 8P 10m"]);
  });
});

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
