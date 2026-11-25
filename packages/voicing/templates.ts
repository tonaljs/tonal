import { formula, noteOf } from "@tonaljs/chord";
import { chroma as noteChroma, get as getNote } from "@tonaljs/note";

/**
 * The voicing templates of tonal's catalogue, by chord family. Each form is a
 * list of chord degrees from the bottom, with `|` between the hands. A plain
 * number is the chord's own degree with that number (`3` is the b3 of a minor
 * chord, `7` the 6th of a sixth chord); `R` is the root.
 *
 * Every template is in two or more independent jazz piano books:
 *
 * - `shell`: root and 3rd or 7th, or root, 3rd and 7th. Phil DeGreg, *Jazz
 *   Keyboard Harmony* (1994), ch. 1; Rawlins & Bahha, *Jazzology* (2005), p.
 *   67; Tim Richards, *Exploring Jazz Piano*, vol. 1, p. 153; Jeremy Siskind,
 *   *Playing Solo Jazz Piano*.
 * - `guide-tones`: the root, then the 3rd and 7th in the right hand. Mark
 *   Levine, *The Jazz Piano Book* (1989), ch. 3; DeGreg, ch. 2; *Jazzology*,
 *   ch. 4.
 * - `rootless`: three or four notes with the 3rd or the 7th at the bottom
 *   (the "A" and "B" forms). Levine, ch. 7; DeGreg, chs. 4 and 6; *Jazzology*,
 *   pp. 67-69; Dan Haerle, *Jazz Piano Voicing Skills*, skills 40-45;
 *   Richards, vol. 2, ch. 7.
 * - `rootless-spread`: the same, two notes in each hand. Jeremy Siskind, *Jazz
 *   Band Pianist*, ch. 10; DeGreg, ch. 7 (open position); Richards, vol. 2,
 *   fig. 9.16.
 * - `so-what`: three 4ths and a major 3rd. Levine, ch. 12; Haerle, skills
 *   48-49; DeGreg, ch. 9; *Jazzology*, ch. 6; Richards, vol. 2, fig. 6.47.
 * - `fourths`: voicings in 4ths. Levine, ch. 13; Frank Mantooth, *Voicings for
 *   Jazz Keyboard*, ch. 2; DeGreg, ch. 8; *Jazzology*, ch. 6; Richards, vol.
 *   2, ch. 6.
 * - `upper-structure` (and `upper-structure-II`, `-bIII`, `-bV`, `-bVI`,
 *   `-VI`): a major triad over the root, 3rd and 7th of a dominant. Levine,
 *   ch. 14; Haerle, skills 109-113; DeGreg, p. 216; Mantooth, ch. 6; Richards,
 *   vol. 2, chs. 8-10.
 * - `triad-over-root`: a triad over the root. Mark Harrison, *The Pop Piano
 *   Book*, ch. 5, and *R&B Keyboard*, ch. 3; DeGreg, pp. 217-219; Siskind,
 *   *Jazz Band Pianist*, ch. 15.
 *
 * @private
 */
export const TEMPLATES: Record<string, Record<string, string[]>> = {
  shell: { "*": ["R-3", "R-7", "R-3-7", "R-7-3"] },
  "guide-tones": { "*": ["R | 3-7", "R | 7-3"] },
  rootless: {
    major: ["3-7-9", "7-3-5", "3-5-7-9", "7-9-3-5"],
    minor: ["3-7-9", "7-3-5", "3-5-7-9", "7-9-3-5"],
    dominant: ["3-7-9", "7-3-13", "3-13-7-9", "7-9-3-13"],
    altered: ["3-7-b9", "7-3-#5", "3-#5-7-b9", "7-b9-3-#5"],
    suspended: ["7-9-11-13", "11-13-7-9"],
    "half-diminished": ["3-7-R", "7-3-5", "3-5-7-R", "7-R-3-5"],
    diminished: ["3-7-R", "7-3-5", "3-5-7-R", "7-R-3-5"],
  },
  "rootless-spread": {
    major: ["3-7 | 9-5", "7-3 | 5-9"],
    minor: ["3-7 | 9-5", "7-3 | 5-9"],
    dominant: ["3-7 | 9-13", "7-3 | 13-9"],
  },
  "so-what": {
    minor: ["R-11-7 | 3-5"],
    major: ["3-13-9 | 5-7", "13-9-5 | R-3"],
    suspended: ["5-R-11 | 7-9"],
  },
  fourths: {
    major: ["3-13-9", "13-9-5", "7-3-13", "3-13-9-5-R", "7-3-13-9-5"],
    minor: ["R-11-7", "5-R-11", "11-7-3", "5-R-11-7-3"],
    dominant: ["7-3-13", "7-3-13-9-5", "3-7-9-5-R"],
    suspended: ["R-11-7", "5-R-11"],
  },
  "upper-structure-II": dominant(["R-3-7", "9-#11-13"]),
  "upper-structure-bIII": dominant(["R-3", "#9-5-7"]),
  "upper-structure-bV": dominant(["R-3", "b5-7-b9"]),
  "upper-structure-bVI": dominant(["R-3-7", "b13-R-#9"]),
  "upper-structure-VI": dominant(["R-7", "13-b9-3"]),
  "triad-over-root": {
    major: ["R | R-3-5", "R | 3-5-7", "R | 5-7-9"],
    minor: ["R | R-3-5", "R | 3-5-7"],
    dominant: ["R | R-3-5", "R | 3-5-7"],
    suspended: ["R | 7-9-11"],
    "half-diminished": ["R | 3-5-7"],
  },
};
TEMPLATES["upper-structure"] = dominantForms(
  ["II", "bIII", "bV", "bVI", "VI"].flatMap(
    (d) => TEMPLATES["upper-structure-" + d].dominant,
  ),
);

// A dominant template: a left hand under a triad in its three positions (any
// inversion of the triad works: Levine, ch. 14)
function dominant([left, triad]: [string, string]): Record<string, string[]> {
  const t = triad.split("-");
  return dominantForms(
    [0, 1, 2].map(
      (r) => `${left} | ${[...t.slice(r), ...t.slice(0, r)].join("-")}`,
    ),
  );
}

function dominantForms(forms: string[]): Record<string, string[]> {
  return { dominant: forms, altered: forms };
}

const degreeNum = (d: string) => +(d.match(/\d+$/)?.[0] ?? NaN);

/**
 * The note of each degree of a template form for a chord, or undefined when
 * the form doesn't apply (a plain degree from 1 to 7 the chord doesn't have).
 *
 * @private
 */
export function resolveForm(
  symbol: string,
  form: string,
): { degree: string; note: string; hand: number }[] | undefined {
  const own = formula(symbol);
  const result: { degree: string; note: string; hand: number }[] = [];
  const hands = form.split("|");
  for (let hand = 0; hand < hands.length; hand++) {
    for (const token of hands[hand].split("-").map((t) => t.trim())) {
      if (!token) continue;
      let degree = token === "R" ? "1" : token;
      if (/^\d+$/.test(degree)) {
        const num = +degree;
        const fallback = num === 3 ? [3, 4, 2] : num === 7 ? [7, 6] : [num];
        const found = fallback
          .map((n) => own.find((d) => degreeNum(d) === n))
          .find((d) => d !== undefined);
        if (found) degree = found;
        else if (num <= 7) return undefined;
      }
      const note = noteOf(symbol, degree);
      if (!note) return undefined;
      result.push({ degree, note: getNote(note).pc, hand });
    }
  }
  return result.length ? result : undefined;
}

/** The forms of a template for a chord family. @private */
export function templateForms(
  template: string | string[],
  family: string,
): string[] {
  if (Array.isArray(template)) return template;
  const entry = TEMPLATES[template];
  if (!entry) return /\d/.test(template) ? [template] : [];
  // an altered dominant uses the dominant forms when there are no others
  const fallback = family === "altered" ? entry.dominant : undefined;
  return entry[family] ?? fallback ?? entry["*"] ?? [];
}

type Placed = { name: string; midi: number; chroma: number; degree: string };

/**
 * Place a resolved form: the first note at every octave in the range, each
 * next note at the nearest pitch above the one below; after a `|`, also an
 * octave higher (the right hand can start above the left hand's top note).
 *
 * @private
 */
export function placeForm(
  form: { degree: string; note: string; hand: number }[],
  low: number,
  high: number,
): Placed[][] {
  const at = (pc: string, midi: number): Placed | undefined => {
    for (let oct = -1; oct <= 10; oct++) {
      const n = getNote(pc + oct);
      if (n.midi === midi) {
        return {
          name: n.name,
          midi,
          chroma: noteChroma(n.name) as number,
          degree: "",
        };
      }
    }
    return undefined;
  };
  const results: Placed[][] = [];
  const firstChroma = noteChroma(form[0].note) as number;
  for (let start = low; start <= high; start++) {
    if (((start % 12) + 12) % 12 !== firstChroma) continue;
    let partial: Placed[][] = [
      [{ ...at(form[0].note, start)!, degree: form[0].degree }],
    ];
    for (let i = 1; i < form.length; i++) {
      const { note, degree, hand } = form[i];
      const c = noteChroma(note) as number;
      partial = partial.flatMap((list) => {
        const prev = list[list.length - 1].midi;
        let next = prev + 1;
        while (((next % 12) + 12) % 12 !== c) next++;
        const options = hand !== form[i - 1].hand ? [next, next + 12] : [next];
        return options
          .filter((m) => m <= high)
          .map((m) => [...list, { ...at(note, m)!, degree }]);
      });
    }
    results.push(...partial);
  }
  return results;
}
