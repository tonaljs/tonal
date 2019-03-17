import Chords from "./";
import data from "./chord-data";
import { name } from "../interval";

const $ = str => str.split(" ");

describe("Chord dictionary", () => {
  describe("chord names", () => {
    it("list names", () => {
      expect(Chords.names()).toHaveLength(33);
    });

    it("list of abbreviations", () => {
      expect(Chords.abbreviations()).toHaveLength(109);
    });

    it("list of all aliases (names + all abbreviations)", () => {
      expect(Chords.aliases()).toHaveLength(198);
    });
  });

  it("get abbreviations of a chord ", () => {
    expect(Chords.abbreviationsOf($("1P 3m 5P"))).toEqual(["m", "min", "-"]);
    expect(Chords.abbreviationsOf("minor")).toEqual(["m", "min", "-"]);
    expect(Chords.abbreviationsOf("-")).toEqual(["m", "min", "-"]);
    expect(Chords.abbreviationsOf("maj13#11")).toEqual([
      "M13#11",
      "maj13#11",
      "M13+4",
      "M13#4"
    ]);
    expect(Chords.abbreviationsOf("no chord")).toEqual([]);
  });

  it("get name of a chord", () => {
    expect(Chords.nameOf($("1P 3M 5P 7M 9M"))).toEqual("major ninth");
    expect(Chords.nameOf("101010010001")).toEqual("major ninth");
    expect(Chords.nameOf("m")).toEqual("minor");
    expect(Chords.nameOf("-")).toEqual("minor");
    expect(Chords.nameOf("minor")).toEqual("minor");
    expect(Chords.nameOf("69#11")).toEqual(null);
    expect(Chords.nameOf("no chord")).toEqual(undefined);
  });

  it("get intervals from name or abbreviation", () => {
    expect(Chords.intervalsOf("major")).toEqual($("1P 3M 5P"));
    expect(Chords.intervalsOf("")).toEqual($("1P 3M 5P"));
    expect(Chords.intervalsOf("M")).toEqual($("1P 3M 5P"));
    expect(Chords.intervalsOf("maj13#11")).toEqual($("1P 3M 5P 7M 9M 11A 13M"));
    expect(Chords.intervalsOf("no chord")).toEqual([]);
    expect(Chords.intervalsOf("o7")).toEqual($("1P 3m 5d 7d"));
    expect(Chords.intervalsOf("M6")).toEqual($("1P 3M 5P 6M"));
  });

  describe("data integrity", () => {
    it("has valid intervals", () => {
      Object.keys(data).forEach(str => {
        const ivls = str.split(" ");
        const valid = ivls.map(name).filter(x => x);
        if (ivls.length !== valid.length) {
          expect(data[str]).toBe(str);
        }
      });
    });
    it("not contains duplicated abbreviations", () => {
      const defined = {};
      Object.keys(data).forEach(ivls => {
        const name = data[ivls][0];
        const abbreviations = data[ivls][1].split(" ");
        abbreviations.forEach(abbrv => {
          if (defined[abbrv]) {
            const prev = `'${abbrv}' was defined at '${defined[abbrv]}'`;
            const current = `but was overrided at '${name || ivls}'`;
            expect(prev).toEqual(current);
          } else {
            defined[abbrv] = name || ivls;
          }
        });
      });
    });
  });
});
