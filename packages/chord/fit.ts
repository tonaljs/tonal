import { ChordDegreeName, degreeNum } from "./degrees";
import { degreePc } from "./tensions";

// The number of a degree in the octave: 9 is 2, 11 is 4, 13 is 6
const simple = (degree: ChordDegreeName) => ((degreeNum(degree) - 1) % 7) + 1;

// The signed distance in semitones from one pitch class to another, -5 to 6
const pcDistance = (a: number, b: number) => {
  const d = (((b - a) % 12) + 12) % 12;
  return d > 6 ? d - 12 : d;
};

// The candidate closest to the degree: the same name, else the nearest in
// semitones, ties up
function closest(
  candidates: ChordDegreeName[],
  degree: ChordDegreeName,
): ChordDegreeName {
  if (candidates.includes(degree)) return degree;
  const pc = degreePc(degree);
  let best = candidates[0];
  let bestDist = Infinity;
  for (const candidate of candidates) {
    const d = pcDistance(pc, degreePc(candidate));
    const dist = Math.abs(d) - (d > 0 ? 0.5 : 0);
    if (dist < bestDist) {
      best = candidate;
      bestDist = dist;
    }
  }
  return best;
}

/**
 * The degree of a chord (its formula and tensions) that plays the role of a
 * degree, by the rules of `Chord.fitDegree`. `scale` are the scale's degrees
 * counted from the chord's root. @private
 */
export function fitDegreeIn(
  degree: ChordDegreeName,
  formula: ChordDegreeName[],
  tensions: ChordDegreeName[],
  scale?: ChordDegreeName[],
): ChordDegreeName {
  const num = simple(degree);
  const pc = degreePc(degree);
  if (Number.isNaN(num) || pc < 0 || !formula.length) return "";
  const sameNumber = (list: ChordDegreeName[]) =>
    list.filter((d) => simple(d) === num);

  // 0. a chord tone stays, and a tension the scale (if any) has
  if (formula.includes(degree)) return degree;
  const inScale = !scale || scale.some((d) => degreePc(d) === pc);
  if (tensions.includes(degree) && inScale) return degree;

  // 1. a chord tone with the same number
  const tones = sameNumber(formula);
  if (tones.length) return closest(tones, degree);

  // 2. a chord tone with the same pitch class
  const samePc = formula.find((d) => degreePc(d) === pc);
  if (samePc) return samePc;

  // 3. the scale note with the same number, keeping the degree's number
  if (scale) {
    const step = scale.find((d) => simple(d) === num);
    if (step) {
      const acc = step.replace(/\d+$/, "");
      return acc + degreeNum(degree);
    }
  }

  // 4. a tension with the same number
  const available = sameNumber(tensions);
  if (available.length) return closest(available, degree);

  // 5. a 3rd on a chord without 3rd: its sus tone
  if (num === 3) {
    const sus = formula.find((d) => simple(d) === 4 || simple(d) === 2);
    if (sus) return sus;
  }

  // 6. the degree stays
  return degree;
}
