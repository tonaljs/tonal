/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 *
 * The `Tonal` module is a facade to the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `Tonal.Note.pc`
 *
 * It exports the following modules:
 * - Note
 * - Interval
 * - Distance
 * - Scale
 * - Chord
 * - PcSet
 *
 * Additionally this facade exports some functions without namespace (see "Methods" below)
 *
 * @example
 * // es6 modules
 * import * as Tonal from "tonal"
 * Tonal.Note.name("cx") // => "C##"
 *
 * @example
 * import { Note } from "tonal"
 * Note.name("bb") // => "Bb"
 *
 * @example
 * // es5 node modules
 * var Tonal = require("tonal");
 * Tonal.Distance.transpose(Tonal.Note.pc("C#2"), "M3") // => "E#"
 * Tonal.Chord.notes("Dmaj7") // => ["D", "F#", "A", "C#"]
 *
 * @module Tonal
 */
import * as Array from "tonal-array";
import * as Note from "tonal-note";
import * as Interval from "tonal-interval";
import * as Distance from "tonal-distance";
import * as Dictionary from "tonal-dictionary";
import * as Scale from "tonal-scale";
import * as Chord from "tonal-chord";
import * as PcSet from "tonal-pcset";

export { Array, Note, Interval, Distance, Scale, Chord, PcSet, Dictionary };

/**
 * Transpose a note by an interval
 * @function
 * @param {string} note
 * @param {string} interval
 * @return {string} the transported note
 * @see Distance.transpose
 */
export const transpose = Distance.transpose;

/**
 * Get the interval from two notes
 * @function
 * @param {string} from
 * @param {string} to
 * @return {string} the interval in reverse shorthand notation
 * @see Distance.interval
 */
export const interval = Distance.interval;

/**
 * Get note properties
 * @function
 * @param {string} note - the note name
 * @return {Object}
 * @see Note.props
 * @example
 * Tonal.note("A4").chroma // => 9
 */
export const note = Note.props;

/**
 * Get midi note number
 * @function
 * @param {string} note
 * @return {Number}
 * @see Note.midi
 * @example
 * Tonal.midi("A4") // => 49
 */
export const midi = Note.midi;

/**
 * Get note frequency using equal tempered tuning at 440
 * @function
 * @param {string} note
 * @return {Number}
 * @see Note.freq
 * @example
 * Tonal.freq("A4") // => 440
 */
export const freq = Note.freq;

/**
 * Get intervals from a chord type
 * @function
 * @param {string} type - the chord type (no tonic)
 * @return {Array} an array of intervals or undefined if the chord type is not known
 * @see Dictionary.chord
 * @example
 * Tonal.chord("m7b5") // => ["1P", "3m", "5d", "7m"]
 */
export const chord = Dictionary.chord;

/**
 * Get intervals from scale name
 * @function
 * @param {string} name - the scale name (without tonic)
 * @return {Array} an array of intervals or undefiend if the scale is not kown
 * @example
 * Tonal.scale("major") // => ["1P", "2M", "3M"...]
 */
export const scale = Dictionary.scale;
