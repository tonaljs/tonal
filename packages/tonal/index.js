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
 * @example
 * // es6 modules
 * import * as Tonal from 'tonal'
 * Tonal.Note.name('cx') // => 'C##'
 * 
 * @example
 * import { Note } from 'tonal'
 * Note.name('bb') // => 'Bb'
 *
 * @example
 * // es5 node modules
 * var Tonal = require('tonal');
 * Tonal.Distance.transpose(Tonal.Note.pc('C#2'), 'M3') // => 'E#'
 * Tonal.Chord.notes('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module Tonal
 */
import * as Array from "tonal-array";
import * as Note from "tonal-note";
import * as Interval from "tonal-interval";
import * as Distance from "tonal-distance";
import * as Scale from "tonal-scale";
import * as Chord from "tonal-chord";
import * as PcSet from "tonal-pcset";

export { Array, Note, Interval, Distance, Scale, Chord, PcSet };

export const transpose = Distance.transpose;
export const interval = Distance.interval;
export const note = Note.props;
