/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 *
 * The `tonal` module is a facade to the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `tonal.note.pc`
 *
 * It exports the following modules:
 * - note
 * - interval
 * - distance
 * - scale
 * - chord
 * - pcset
 *
 * @example
 * var tonal = require('tonal')
 * tonal.distance.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord.notes('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */
import * as array from "tonal-array";
import * as note from "tonal-note";
import * as interval from "tonal-interval";
import * as distance from "tonal-distance";
import * as scale from "tonal-scale";
import * as chord from "tonal-chord";
import * as pcset from "tonal-pcset";

export { array, note, interval, distance, scale, chord, pcset };
export default { array, note, interval, distance, scale, chord, pcset };
