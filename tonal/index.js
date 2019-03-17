import * as Array from "../array";
import * as Chord from "../chord";
import * as ChordDictionary from "../chord-dictionary";
//import * as Detect from "../detect";
import * as Distance from "../distance";
import * as Interval from "../interval";
import * as Key from "../key";
import * as Note from "../note";
import * as Pcset from "../pcset";
import * as RomanNumeral from "../roman-numeral";
import * as Scale from "../scale";
import * as ScaleDictionary from "../scale-dictionary";

/**
 * Tonal exports all tonal modules
 *
 * **Important: since v3 single npm packages are not supported**
 *
 * @example
 * // ES6 modules (recommended: requires babel, webpack, browserify, parcel or similar tool)
 * import { Note } from 'tonal'
 * Note.midi('C4') // => 60
 *
 * @example
 * // with require (node.js or ES6)
 * const { Note }= require('tonal')
 * Note.midi('C4') // => 60
 *
 * @example
 * // inside browser (using the bundled package)
 * Tonal.Note.midi('C4') // => 60
 *
 * @module Tonal
 */
export default {
  Array,
  Chord,
  ChordDictionary,
  // Detect, // not ready for publishing yet
  Distance,
  Interval,
  Key,
  Note,
  Pcset,
  RomanNumeral,
  Scale,
  ScaleDictionary
};
