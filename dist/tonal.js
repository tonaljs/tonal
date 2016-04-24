'use strict';

var _arguments = arguments;
// # Tonal

// __tonal__ is a functional music theory library. It deals with abstract music
// concepts like picthes and intervals, not actual music.

// `tonal` is also the result of my journey of learning how to implement a music
// theory library in javascript in a functional way.

// You are currently reading the source code of the library. It's written in
// [literate programming](https://en.wikipedia.org/wiki/Literate_programming) as
// a tribute to the The Haskell School of Music and it's impressive book/source
// code ["From Signals to
// Symphonies"](http://haskell.cs.yale.edu/wp-content/uploads/2015/03/HSoM.pdf)
// that has a big influence over tonal development.

// This page is generated using the documentation tool
// [docco](http://jashkenas.github.io/docco/)

// #### Prelude

// Parse note names with `note-parser`
var note = require('note-parser');
// Parse interval names with `interval-notation`
var ivl = require('interval-notation');

// Utilities

// Is an array?
var isArr = Array.isArray;
// Is a number?
var isNum = function isNum(n) {
  return typeof n === 'number';
};
// Is string?
var isStr = function isStr(o) {
  return typeof o === 'string';
};
// Is defined? (can be null)
var isDef = function isDef(o) {
  return typeof o !== 'undefined';
};
// Is a value?
var isValue = function isValue(v) {
  return v !== null && typeof v !== 'undefined';
};

// __Functional helpers__

// Identity function
var id = function id(x) {
  return x;
};

// ## 1. Pitches

// #### Pitch encoding

// Map from letter step to number of fifths and octaves
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
// Encode a pitch class using the step number and alteration
var encPC = function encPC(step, alt) {
  return FIFTHS[step] + 7 * alt;
};

// Given a number of fifths, return the octaves they span
var fifthsSpan = function fifthsSpan(f) {
  return Math.floor(f * 7 / 12);
};
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fifthsSpan);

// Encode octaves
var encOct = function encOct(step, alt, oct) {
  return oct - FIFTH_OCTS[step] - 4 * alt;
};

/**
 * Create a pitch. A pitch in tonal may refer to a pitch class, the pitch
 * of a note or an interval.
 *
 * @param {Integer} step - an integer from 0 to 6 representing letters
 * from C to B or simple interval numbers from unison to seventh
 * @param {Integer} alt - the alteration
 * @param {Integer} oct - the pitch octave
 * @param {Integer} dir - (Optional, intervals only) The interval direction
 * @return {Pitch} the pitch encoded as array notation
 *
 */
function pitch(step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null;
  var pc = encPC(step, alt || 0);
  // if not octave, return the pitch class
  if (!isNum(oct)) return [pc];
  var o = encOct(step, alt, oct);
  if (!isNum(dir)) return [pc, o];
  var d = dir < 0 ? -1 : 1;
  return [d * pc, d * o, d];
}

// Some definitions:

/**
 * Test if a given object is a pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch, false otherwise
 */
var isPitch = function isPitch(p) {
  return isArr(p) && isNum(p[0]);
};
/**
 * Test if a given object is a pitch class
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch class, false otherwise
 */
var isPitchClass = function isPitchClass(p) {
  return isArr(p) && p.length === 1;
};
var hasOct = function hasOct(p) {
  return isPitch(p) && isNum(p[1]);
};
var isPitchNote = function isPitchNote(p) {
  return hasOct(p) && p.length === 2;
};
var isInterval = function isInterval(i) {
  return hasOct(i) && isNum(i[2]);
};

// ### Pitch decoding

// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered(f) {
  var i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

var decodeStep = function decodeStep(f) {
  return STEPS[unaltered(f)];
};
var decodeAlt = function decodeAlt(f) {
  return Math.floor((f + 1) / 7);
};
// 'FCGDAEB' steps numbers
var STEPS = [3, 0, 4, 1, 5, 2, 6];
function decode(p) {
  var s = decodeStep(p[0]);
  var a = decodeAlt(p[0]);
  var o = isNum(p[1]) ? p[1] + 4 * a + FIFTH_OCTS[s] : null;
  return { step: s, alt: a, oct: o, dir: p[2] || null };
}

// #### Pitch parsers

// Convert from string to pitches is a quite expensive operation that it's
// executed a lot of times. Some caching will help:

var cache = {};
var cached = function cached(parser) {
  return function (str) {
    if (typeof str !== 'string') return null;
    return cache[str] || (cache[str] = parser(str));
  };
};

var parseNote = cached(function (str) {
  var n = note.parse(str);
  return n ? pitch(n.step, n.alt, n.oct) : null;
});

var isNoteStr = function isNoteStr(s) {
  return parseNote(s) !== null;
};

var parseIvl = cached(function (str) {
  var i = ivl.parse(str);
  return i ? pitch(i.simple - 1, i.alt, i.oct, i.dir) : null;
});

var parsePitch = function parsePitch(str) {
  return parseNote(str) || parseIvl(str);
};

// ### Pitch to string

var toLetter = function toLetter(s) {
  return 'CDEFGAB'[s % 7];
};
var fillStr = function fillStr(s, num) {
  return Array(Math.abs(num) + 1).join(s);
};
var toAcc = function toAcc(n) {
  return fillStr(n < 0 ? 'b' : '#', n);
};
var strNum = function strNum(n) {
  return n !== null ? n : '';
};
function strNote(pitch) {
  var p = !isInterval(pitch) ? decode(pitch) : null;
  return p ? toLetter(p.step) + toAcc(p.alt) + strNum(p.oct) : null;
}

var isAsc = function isAsc(p) {
  return p.dir === 1;
};
var isPerf = function isPerf(p) {
  return ivl.type(p.step + 1) === 'P';
};
var calcNum = function calcNum(p) {
  return isAsc(p) ? p.step + 1 + 7 * p.oct : 8 - p.step - 7 * (p.oct + 1);
};
var calcAlt = function calcAlt(p) {
  return isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1);
};

function strIvl(pitch) {
  var p = isInterval(pitch) ? decode(pitch) : null;
  if (!p) return null;
  var num = calcNum(p);
  return p.dir * num + ivl.altToQ(num, calcAlt(p));
}

var strPitch = function strPitch(p) {
  return p[2] ? strIvl(p) : strNote(p);
};

// #### Decorate pitch transform functions

var notation = function notation(parse, str) {
  return function (v) {
    return !isPitch(v) ? parse(v) : str(v);
  };
};

var expectNote = notation(parseNote, id);
var expectIvl = notation(parseIvl, id);
var expectPitch = notation(parsePitch, id);

var toNoteStr = notation(id, strNote);
var toIvlStr = notation(id, strIvl);
var toPitchStr = notation(id, strPitch);

var buildFnDec = function buildFnDec(expect, to) {
  return function (fn) {
    return function (v) {
      var p = expect(v);
      return p ? to(fn(p)) : null;
    };
  };
};
var noteFn = buildFnDec(expectNote, toNoteStr);
var ivlFn = buildFnDec(expectIvl, toIvlStr);
var pitchFn = buildFnDec(expectPitch, toPitchStr);

var sci = noteFn(id);

// #### Pitch properties

var pc = noteFn(function (p) {
  return [p[0]];
});

var chroma = noteFn(function (n) {
  return n[0] * 7 - Math.floor(n[0] * 7 / 12) * 12;
});

var letter = noteFn(function (n) {
  return toLetter(decode(n).step);
});

var accidentals = noteFn(function (n) {
  return toAcc(decode(n).alt);
});

var octave = pitchFn(function (p) {
  return decode(p).oct;
});

var simplify = ivlFn(function (i) {
  var d = i[2];
  var s = decodeStep(d * i[0]);
  var a = decodeAlt(d * i[0]);
  return [i[0], -d * (FIFTH_OCTS[s] + 4 * a), d];
});

var simpleNum = ivlFn(function (i) {
  var p = decode(i);
  return p.step + 1;
});

var number = ivlFn(function (i) {
  return calcNum(decode(i));
});

var quality = ivlFn(function (i) {
  var p = decode(i);
  return ivl.altToQ(p.step + 1, p.alt);
});

// __semitones__

// get pitch height
var height = function height(p) {
  return p[0] * 7 + 12 * p[1];
};
var semitones = ivlFn(height);

// #### Midi pitch numbers

// The midi note number can have a value between 0-127
// http://www.midikits.net/midi_analyser/midi_note_numbers_for_octaves.htm

/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
var isMidi = function isMidi(m) {
  return isValue(m) && !isArr(m) && m >= 0 && m < 128;
};

// To match the general midi specification where `C4` is 60 we must add 12 to
// `height` function:

/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
var midi = function midi(val) {
  var p = expectNote(val);
  return hasOct(p) ? height(p) + 12 : isMidi(val) ? +val : null;
};

// We are going to create a chromatic scale. Since altered notes can be
// represented either with flats or sharps, the CHROMATIC constant maps
// only the unaltered steps:
var CHROMATIC = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6];
var midiStep = function midiStep(m) {
  return CHROMATIC[m % 12];
};

// And the `chromatic()` function will fill the _holes_ with flat or
// sharp altered notes depending of the first parameter:

/**
 * Create a chromatic scale
 * @param {Boolean} useSharps - use sharps or flats when notes is altered
 * @return {Function} returns a function that converts from midi number to
 * note name
 * @example
 * var chromaticScale = chromatic(false)
 * [60, 61, 62].map(chromaticScale) // => ['C4', 'Db4', 'D4']
 */
var chromatic = function chromatic(useSharps) {
  return function (midi) {
    var c = midiStep(midi);
    var o = Math.floor(midi / 12) - 1;
    var n = c !== null ? pitch(c, 0, o) : useSharps ? pitch(midiStep(midi - 1), 1, o) : pitch(midiStep(midi + 1), -1, o);
    return strNote(n);
  };
};

// Without a context, it's impossible to know the _right_ note name for a given
// midi number, so we arbitrarily select chromatic with flats:

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidi(61) // => 'Db4'
 */
var fromMidi = chromatic(false);

// #### Frequency conversions

// The most popular way (in western music) to calculate the frequency of a pitch
// is using the [well
// temperament](https://en.wikipedia.org/wiki/Well_temperament) tempered tuning.
// It assumes the octave to be divided in 12 equally sized semitones and tune
// all the notes against a reference:

/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
var wellTempered = function wellTempered(ref) {
  return function (pitch) {
    var m = midi(pitch);
    return m ? Math.pow(2, (m - 69) / 12) * ref : null;
  };
};

// The common tuning reference is `A4 = 440Hz`:

/**
 * Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz
 * @function
 * @param {Array|String} pitch - the pitch to get the frequency from
 * @return {Float} the frequency in herzs
 * @example
 * toFreq('C4') // => 261.6255653005986
 */
var toFreq = wellTempered(440);

// ## 2. Pitch distances

function trBy(i, p) {
  if (p === null) return null;
  var f = i[0] + p[0];
  if (p.length === 1) return [f];
  var o = i[1] + p[1];
  if (p.length === 2) return [f, o];
  var d = 7 * f + 12 * o < 0 ? -1 : 1;
  return [f, o, d];
}

function transpose(a, b) {
  if (arguments.length === 1) return function (b) {
    return transpose(a, b);
  };
  var pa = expectPitch(a);
  var pb = expectPitch(b);
  var r = isInterval(pa) ? trBy(pa, pb) : isInterval(pb) ? trBy(pb, pa) : null;
  return toPitchStr(r);
}

// ## 3. Lists

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/;
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function listArr(src) {
  return isArr(src) ? src : typeof src === 'string' ? src.trim().split(SEP) : src === null || typeof src === 'undefined' ? [] : [src];
}

// #### Transform lists

var listToStr = function listToStr(v) {
  return isArr(v) ? v.map(toPitchStr) : toPitchStr(v);
};

var listFn = function listFn(fn) {
  return function (src) {
    var param = listArr(src).map(expectPitch);
    var result = fn(param);
    return listToStr(result);
  };
};

function map(fn, list) {
  if (arguments.length > 1) return map(fn)(list);
  return listFn(function (arr) {
    return arr.map(fn);
  });
}

// #### Transpose lists

var harmonizer = function harmonizer(list) {
  return function (pitch) {
    return listFn(function (list) {
      return list.map(transpose(pitch)).filter(id);
    })(list);
  };
};

var harmonize = function harmonize(list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list);
};

// #### Sort lists

var objHeight = function objHeight(p) {
  if (!p) return -Infinity;
  var f = p[0] * 7;
  var o = isNum(p[1]) ? p[1] : -Math.floor(f / 12) - 10;
  return f + o * 12;
};

var ascComp = function ascComp(a, b) {
  return objHeight(a) - objHeight(b);
};
var descComp = function descComp(a, b) {
  return -ascComp(a, b);
};

function sort(comp, list) {
  if (arguments.length > 1) return sort(comp)(list);
  var fn = comp === true || comp === null ? ascComp : comp === false ? descComp : comp;
  return listFn(function (arr) {
    return arr.sort(fn);
  });
}

// Fin.

exports.isArr = isArr;
exports.isNum = isNum;
exports.isStr = isStr;
exports.isDef = isDef;
exports.isValue = isValue;
exports.pitch = pitch;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isPitchNote = isPitchNote;
exports.isInterval = isInterval;
exports.parseNote = parseNote;
exports.isNoteStr = isNoteStr;
exports.parseIvl = parseIvl;
exports.toLetter = toLetter;
exports.toAcc = toAcc;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.sci = sci;
exports.pc = pc;
exports.chroma = chroma;
exports.letter = letter;
exports.accidentals = accidentals;
exports.octave = octave;
exports.simplify = simplify;
exports.simpleNum = simpleNum;
exports.number = number;
exports.quality = quality;
exports.semitones = semitones;
exports.isMidi = isMidi;
exports.midi = midi;
exports.chromatic = chromatic;
exports.fromMidi = fromMidi;
exports.wellTempered = wellTempered;
exports.toFreq = toFreq;
exports.transpose = transpose;
exports.listArr = listArr;
exports.map = map;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.sort = sort;