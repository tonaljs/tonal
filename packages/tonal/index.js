/**
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
 * - key
 * - dictionary
 *
 * @example
 * var tonal = require('tonal')
 * tonal.distance.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord.notes('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */
import * as note from "tonal-note/index";
import * as interval from "tonal-interval/index";
import * as distance from "tonal-distance/index";
import * as key from "tonal-key/index";
import * as scale from "tonal-scale/index";
import * as chord from "tonal-chord/index";
import * as pcset from "tonal-pcset/index";

export { note, interval, distance, key, scale, chord, pcset };
