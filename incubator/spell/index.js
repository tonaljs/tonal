var { parse, midi, chroma } = require("note-parser");

/**
* This module contains functions to convert from numeric pitch to
* note names in scientific notation
*
* This is an ongoing experiment about how to detach names from pitches
*
* This module is experimental and not included in tonal facade (yet)
*
* > to name, write, or otherwise give the letters, in order, of (a word
*
* @private
* @module spell
*/

export function pitch(note) {
  return typeof note === "number" ? note : midi(note) || chroma(note);
}

var LETTERS = ["C", null, "D", null, "E", "F", null, "G", null, "A", null, "B"];

function pc(midi) {
  var pc = midi % 12;
  return pc < 0 ? 12 + pc : pc;
}
function letter(midi) {
  return LETTERS[pc(midi)];
}

export function pcnote(midi, base) {
  base = base || 0;
  var l = letter(midi);
  if (l) return l;
  var prev = letter(midi - 1);
  var next = letter(midi + 1);
  var prevDist = Math.abs(fff(prev, 1) - base);
  var nextDist = Math.abs(fff(next, -1) - base);
  // console.log('ALT', prev + '#', prevDist, next + 'b', nextDist)
  return prevDist < nextDist ? prev + "#" : next + "b";
}

// fifths distance for [A, B, C, D, E, F, G]
var FIFTHS = [4, 6, 1, 3, 5, 0, 2];
function fff(letter, alt) {
  return FIFTHS[letter.charCodeAt(0) - 65] + alt * 7;
}
export function fifths(name) {
  var props = parse(name);
  return fff(props.letter, props.alt);
}

export var note = noteIn("C");

export function noteIn(key, midi) {
  var base = typeof key === "number" ? key : fifths(key);
  return function(midi) {
    return pcnote(midi, base) + ((midi - midi % 12) / 12 - 1);
  };
}

export function pcIn(key, midi) {
  var base = typeof key === "number" ? key : fifths(key);
  return function(midi) {
    return pcnote(midi, base);
  };
}
