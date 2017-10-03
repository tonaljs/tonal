/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 * [![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-key` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
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
 *
 * @example
 * var tonal = require('tonal')
 * tonal.distance.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord.notes('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */
export { props as note, midi, freq, fromMidi, pc, chroma } from "tonal-note";
export { semitones } from "tonal-interval";
export { transpose, interval } from "tonal-distance";
export { scale, chord } from "tonal-dictionary";
