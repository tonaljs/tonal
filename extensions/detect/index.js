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
import { name, pc } from "tonal-note";
import * as Dictionary from "tonal-dictionary";
import { sort, compact } from "tonal-array";
import { modes } from "tonal-pcset";

export function detector(dictionary, defaultBuilder) {
  defaultBuilder = defaultBuilder || ((tonic, names) => [tonic, names]);
  return function(notes, builder) {
    builder = builder || defaultBuilder;
    notes = sort(notes.map(pc));
    return modes(notes)
      .map((mode, i) => {
        const tonic = name(notes[i]);
        const names = dictionary.names(mode);
        return names.length ? builder(tonic, names) : null;
      })
      .filter(x => x);
  };
}

/**
 * Given a collection of notes or pitch classes, try to find the chord name
 * @function
 * @param {Array<String>} notes
 * @return {Array<String>} chord names or empty array
 * @example
 * Detect.chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
 */
export const chord = detector(
  Dictionary.chord,
  (tonic, names) => tonic + names[0]
);

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
export const scale = detector(
  Dictionary.scale,
  (tonic, names) => tonic + " " + names[0]
);

export const pcset = detector(Dictionary.pcset);
