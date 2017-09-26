/**
 * The `tonal` module is a facade to all the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `tonal.note.pc`
 *
 * Some modules are NOT namespaced for developer comfort:
 *
 * - `tonal-array`: for example `tonal.map(tonal.note.pc, 'C#2')`
 * - `tonal-transpose`: for example `tonal.transpose('C', '3M')`
 * - `tonal-distance`: for example `tonal.interval('C3', 'G4')`
 *
 * It also adds a couple of function aliases:
 *
 * - `tonal.scale` is an alias for `tonal.scale.notes`
 * - `tonal.chord` is an alias for `tonal.chord.notes`
 *
 * @example
 * var tonal = require('tonal')
 * tonal.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */
import * as array from "tonal-array";
import * as transpose from "tonal-transpose";
import * as harmonizer from "tonal-harmonizer";
import * as distance from "tonal-distance";
import * as note from "tonal-note";
import * as interval from "tonal-interval";
import * as midi from "tonal-midi";
import * as freq from "tonal-freq";
import * as range from "tonal-range";
import * as key from "tonal-key";
import * as scale from "tonal-scale";
import * as chord from "tonal-chord";
import * as pitch from "tonal-pitch";
import * as notation from "tonal-notation";
import * as progression from "tonal-progression";
import * as sonority from "tonal-sonority";
import * as pitchset from "tonal-pitchset";
import * as pcset from "tonal-pcset";

var assign = Object.assign;
var tonal = assign({}, array, transpose, harmonizer, distance);
tonal.pitch = pitch;
tonal.notation = notation;
tonal.note = note;
tonal.ivl = interval;
tonal.midi = midi;
tonal.freq = freq;
tonal.range = range;
tonal.key = key;
tonal.progression = progression;
tonal.sonority = sonority;
tonal.pitchset = pitchset;
tonal.pcset = pcset;

tonal.scale = function(name) {
  return tonal.scale.notes(name);
};
assign(tonal.scale, scale);
tonal.chord = function(name) {
  return tonal.chord.notes(name);
};
assign(tonal.chord, chord);

if (typeof window !== "undefined") window.Tonal = tonal;
export default tonal;
