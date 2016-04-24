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
var noteParse = require('note-parser').parse;
// Parse interval names with `interval-notation`
var ivlNttn = require('interval-notation');

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

// An array with the signature: `['tnl', fifths, octaves, direction]`:

/**
 * Test if a given object is a pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch, false otherwise
 */
var isPitch = function isPitch(p) {
  return p && p[0] === 'tnl';
};
/**
 * Test if a given object is a pitch class
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean} true if is a pitch class, false otherwise
 */
var isPitchClass = function isPitchClass(p) {
  return isPitch(p) && p.length === 2;
};
var hasOct = function hasOct(p) {
  return isPitch(p) && isNum(p[2]);
};
var isPitchNote = function isPitchNote(p) {
  return hasOct(p) && p.length === 3;
};
var isInterval = function isInterval(i) {
  return hasOct(i) && isNum(i[3]);
};

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
function encode(step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null;
  var pc = encPC(step, alt || 0);
  // if not octave, return the pitch class
  if (!isNum(oct)) return ['tnl', pc];
  var o = encOct(step, alt, oct);
  if (!isNum(dir)) return ['tnl', pc, o];
  var d = dir < 0 ? -1 : 1;
  return ['tnl', d * pc, d * o, d];
}

var pitchClass = function pitchClass(s, a) {
  return encode(s, a);
};
var notePitch = function notePitch(s, a, o) {
  return encode(s, a, o);
};
var interval = function interval(s, a, o, d) {
  return encode(s, a, o, d);
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
  var s = decodeStep(p[1]);
  var a = decodeAlt(p[1]);
  var o = isNum(p[2]) ? p[2] + 4 * a + FIFTH_OCTS[s] : null;
  return { step: s, alt: a, oct: o, dir: p[3] || null };
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
  var n = noteParse(str);
  return n ? notePitch(n.step, n.alt, n.oct) : null;
});

var isNoteStr = function isNoteStr(s) {
  return parseNote(s) !== null;
};

var parseIvl = cached(function (str) {
  var i = ivlNttn.parse(str);
  return i ? interval(i.simple - 1, i.alt, i.oct, i.dir) : null;
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

function strNote(n) {
  var p = isPitch(n) && !n[3] ? decode(n) : null;
  return p ? toLetter(p.step) + toAcc(p.alt) + strNum(p.oct) : null;
}

var isAsc = function isAsc(p) {
  return p.dir === 1;
};
var isPerf = function isPerf(p) {
  return ivlNttn.type(p.step + 1) === 'P';
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
  return p.dir * num + ivlNttn.altToQ(num, calcAlt(p));
}

var strPitch = function strPitch(p) {
  return p[3] ? strIvl(p) : strNote(p);
};

// #### Decorate pitch transform functions

var notation = function notation(parse, str) {
  return function (v) {
    return !isPitch(v) ? parse(v) : str(v);
  };
};

var asNote = notation(parseNote, id);
var asIvl = notation(parseIvl, id);
var asPitch = notation(parsePitch, id);

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
var noteFn = buildFnDec(asNote, toNoteStr);
var ivlFn = buildFnDec(asIvl, toIvlStr);
var pitchFn = buildFnDec(asPitch, toPitchStr);

var sci = noteFn(id);

// #### Pitch properties

var pc = noteFn(function (p) {
  return ['tnl', p[1]];
});

var chroma = noteFn(function (n) {
  return n[1] * 7 - Math.floor(n[1] * 7 / 12) * 12;
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
  var d = i[3];
  var s = decodeStep(d * i[1]);
  var a = decodeAlt(d * i[1]);
  return ['tnl', i[1], -d * (FIFTH_OCTS[s] + 4 * a), d];
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
  return ivlNttn.altToQ(p.step + 1, p.alt);
});

// __semitones__

// get pitch height
var height = function height(p) {
  return p[1] * 7 + 12 * p[2];
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
  var p = asNote(val);
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
 * Create a chromatic scale note names generator. A name generator is a function
 * that given a midi number returns a note name.
 *
 * @param {Boolean} useSharps - use sharps or flats when notes is altered
 * @return {Function} returns a function that converts from midi number to
 * note name
 * @example
 * var tonal = require('tonal')
 * var flats = tonal.chromatic(false)
 * [60, 61, 62, 63].map(flats) // => ['C4', 'Db4', 'D4', 'Eb']
 */
var chromatic = function chromatic(useSharps) {
  return function (midi) {
    var step = midiStep(midi);
    var o = Math.floor(midi / 12) - 1;
    var n = step !== null ? notePitch(step, 0, o) : useSharps ? notePitch(midiStep(midi - 1), 1, o) : notePitch(midiStep(midi + 1), -1, o);
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
  var f = i[1] + p[1];
  if (p.length === 2) return ['tnl', f];
  var o = i[2] + p[2];
  if (p.length === 3) return ['tnl', f, o];
  var d = 7 * f + 12 * o < 0 ? -1 : 1;
  return ['tnl', f, o, d];
}

function transpose(a, b) {
  if (arguments.length === 1) return function (b) {
    return transpose(a, b);
  };
  var pa = asPitch(a);
  var pb = asPitch(b);
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
  return isPitch(v) ? toPitchStr(v) : isArr(v) ? v.map(toPitchStr) : v;
};

var transform = function transform(fn) {
  return function (src) {
    var param = listArr(src).map(asPitch);
    var result = fn(param);
    return listToStr(result);
  };
};

function map(fn, list) {
  if (arguments.length > 1) return map(fn)(list);
  return function (l) {
    return listArr(l).map(fn);
  };
}

// #### Transpose lists

var harmonizer = function harmonizer(list) {
  return function (pitch) {
    return transform(function (list) {
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
  var f = p[1] * 7;
  var o = isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10;
  return f + o * 12;
};

var ascComp = function ascComp(a, b) {
  return objHeight(a) - objHeight(b);
};
var descComp = function descComp(a, b) {
  return -ascComp(a, b);
};

var maxP = function maxP(a, b) {
  return ascComp(a, b) < 0 ? b : a;
};
var max = transform(function (list) {
  return list.reduce(maxP, null);
});

function sort(comp, list) {
  if (arguments.length > 1) return sort(comp)(list);
  var fn = comp === true || comp === null ? ascComp : comp === false ? descComp : comp;
  return transform(function (arr) {
    return arr.sort(fn);
  });
}

// Fin.

exports.isArr = isArr;
exports.isNum = isNum;
exports.isStr = isStr;
exports.isDef = isDef;
exports.isValue = isValue;
exports.id = id;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isPitchNote = isPitchNote;
exports.isInterval = isInterval;
exports.encode = encode;
exports.pitchClass = pitchClass;
exports.notePitch = notePitch;
exports.interval = interval;
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
exports.max = max;
exports.sort = sort;