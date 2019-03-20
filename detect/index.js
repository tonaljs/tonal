/**
 * [![npm version](https://img.shields.io/npm/v/tonal-detect.svg?style=flat-square)](https://www.npmjs.com/package/tonal-detect)
 *
 * Find chord and scale names from a collection of notes or pitch classes
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * import { chord } from "tonal-detect"
 * chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
 *
 * @example
 * const Detect = require("tonal-detect")
 * Detect.chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
 *
 * @module Detect
 */
import { find as findChord } from "../chord-dictionary";
import { name, props, chroma, fromMidi } from "../note";
import { compact } from "../array";
import { modes } from "../pcset";

/**
 * Given a collection of notes or pitch classes, try to find the chord name
 * @function
 * @param {Array<String>} notes - notes (or intervals)
 * @return {Array<Object>} chord names or empty array
 * @example
 * Detect.chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
 */
export function chord(notes) {
  notes = compact(notes.map(name));
  const sharps = notes.find(note => props(note).alt > 0) !== undefined;
  const root = notes[0];
  const offset = chroma(root);

  const results = [];
  function found(chord, chroma, rotation) {
    const score = rotation - offset ? 0.5 : 1;
    const mod = score === 1 ? "" : "/" + root;
    const tonic = fromMidi(rotation, { pitchClass: true, sharps });
    const name = chord.abbreviatures[0];
    results.push({ tonic, name, mod, score });
  }

  modes(notes, false).forEach((chroma, rotation) => {
    const chord = findChord(chroma);
    if (chord.intervals.length) found(chord, chroma, rotation);
  });

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Given a collection of notes or pitch classes, try to find the scale names
 * @function
 * @param {Array<String>} notes
 * @return {Array<String>} scale names or empty array
 * @example
 * Detect.scale(["f3", "a", "c5", "e2", "d", "g2", "b6"]) // => [
 * "C major",
 * "D dorian",
 * "E phrygian",
 * "F lydian",
 * "G mixolydian",
 * "A aeolian",
 * "B locrian"
 * ]
 */
export function scale(intervals) {}
