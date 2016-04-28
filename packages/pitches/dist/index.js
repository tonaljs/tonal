'use strict';

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
 * Create a pitch class in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @return {Pitch} the pitch in array notation
 */
var pitchClass = function pitchClass(f) {
  return ['tnl', f];
};

/**
 * Create a note pitch in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @return {Pitch} the pitch in array notation
 */
var notePitch = function notePitch(f, o) {
  return ['tnl', f, o];
};

// calculate interval direction
var calcDir = function calcDir(f, o) {
  return encDir(7 * f + 12 * o);
};

/**
 * Create an interval in array notation
 *
 * @function
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @param {Integer} dir - (Optional) the direction
 * @return {Pitch} the pitch in array notation
 */
var ivlPitch = function ivlPitch(f, o, d) {
  var oct = isNum(o) ? o : -fOcts(f);
  return ['tnl', f, oct, d || calcDir(f, oct)];
};

/**
 * Test if a given object is a pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var isPitch = function isPitch(p) {
  return p && p[0] === 'tnl';
};
/**
 * Test if a given object is a pitch class
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var isPitchClass = function isPitchClass(p) {
  return isPitch(p) && p.length === 2;
};
/**
 * Test if a given object is a pitch with octave (note pitch or interval)
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var hasOct = function hasOct(p) {
  return isPitch(p) && isNum(p[2]);
};
/**
 * Test if a given object is a note pitch
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var isNotePitch = function isNotePitch(p) {
  return hasOct(p) && p.length === 3;
};
/**
 * Test if a given object is a pitch interval
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var isIvlPitch = function isIvlPitch(i) {
  return hasOct(i) && isNum(i[3]);
};
/**
 * Test if a given object is a pitch, but not an interval
 * @function
 * @param {Object} obj - the object to test
 * @return {Boolean}
 */
var isPitchNotIvl = function isPitchNotIvl(i) {
  return isPitch(i) && !isDef(i[3]);
};

var height = function height(p) {
  return p[1] * 7 + 12 * p[2];
};

// #### Pitch encoding

// Map from letter step to number of fifths and octaves
// equivalent to: { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];

// Encode a pitch class using the step number and alteration
var encPC = function encPC(step, alt) {
  return FIFTHS[step] + 7 * alt;
};

// Given a number of fifths, return the octaves they span
var fOcts = function fOcts(f) {
  return Math.floor(f * 7 / 12);
};
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts);

// Encode octaves
var encOct = function encOct(step, alt, oct) {
  return oct - FIFTH_OCTS[step] - 4 * alt;
};

// Encode direction
var encDir = function encDir(n) {
  return n < 0 ? -1 : 1;
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
  if (!isNum(oct)) return pitchClass(pc);

  var o = encOct(step, alt, oct);
  // if not direction, return a note pitch
  if (!isNum(dir)) return notePitch(pc, o);

  var d = encDir(dir);
  // return the interval
  return ivlPitch(d * pc, d * o, d);
}

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
/**
 * Decode a pitch to its numeric properties
 * @param {Pitch}
 * @return {Object}
 */
function decode(p) {
  var s = decodeStep(p[1]);
  var a = decodeAlt(p[1]);
  var o = isNum(p[2]) ? p[2] + 4 * a + FIFTH_OCTS[s] : null;
  return { step: s, alt: a, oct: o, dir: p[3] || null };
}

// #### Pitch parsers

// Convert from string to pitches is a quite expensive operation that it's
// executed a lot of times. Some caching will help:

var cached = function cached(parser) {
  var cache = {};
  return function (str) {
    if (typeof str !== 'string') return null;
    return cache[str] || (cache[str] = parser(str));
  };
};

/**
 * Parse a note name
 * @function
 * @param {String}
 * @return {Pitch}
 */
var parseNote = cached(function (str) {
  var n = noteParse(str);
  return n ? encode(n.step, n.alt, n.oct) : null;
});

/**
 * Test if the given string is a note name
 * @function
 * @param {String}
 * @return {Boolean}
 */
var isNoteStr = function isNoteStr(s) {
  return parseNote(s) !== null;
};

/**
 * Parses an interval name in shorthand notation
 * @function
 * @param {String}
 * @return {Pitch}
 */
var parseIvl = cached(function (str) {
  var i = ivlNttn.parse(str);
  return i ? encode(i.simple - 1, i.alt, i.oct, i.dir) : null;
});

/**
 * Test if the given string is an interval name
 * @function
 * @param {String}
 * @return {Boolean}
 */
var isIvlPitchStr = function isIvlPitchStr(s) {
  return parseIvl(s) !== null;
};

var parsePitch = function parsePitch(str) {
  return parseNote(str) || parseIvl(str);
};

// ### Pitch to string

/**
 * Given a step number return the letter
 * @function
 * @param {Integer}
 * @return {String}
 */
var toLetter = function toLetter(s) {
  return 'CDEFGAB'[s % 7];
};

// Repeat a string num times
var fillStr = function fillStr(s, num) {
  return Array(Math.abs(num) + 1).join(s);
};

/**
 * Given an alteration number, return the accidentals
 *
 * @function
 * @param {Integer}
 * @return {String}
 */
var toAcc = function toAcc(n) {
  return fillStr(n < 0 ? 'b' : '#', n);
};
var strNum = function strNum(n) {
  return n !== null ? n : '';
};

/**
 * Given a pitch class or a pitch note, get the string in scientific
 * notation
 *
 * @param {Pitch}
 * @return {String}
 */
function strNote(n) {
  var p = isPitch(n) && !n[3] ? decode(n) : null;
  return p ? toLetter(p.step) + toAcc(p.alt) + strNum(p.oct) : null;
}

// is an interval ascending?
var isAsc = function isAsc(p) {
  return p.dir === 1;
};
// is an interval perfectable?
var isPerf = function isPerf(p) {
  return ivlNttn.type(p.step + 1) === 'P';
};
// calculate interval number
var calcNum = function calcNum(p) {
  return isAsc(p) ? p.step + 1 + 7 * p.oct : 8 - p.step - 7 * (p.oct + 1);
};
// calculate interval alteration
var calcAlt = function calcAlt(p) {
  return isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1);
};

/**
 * Given an interval, get the string in scientific
 * notation
 *
 * @param {Pitch}
 * @return {String}
 */
function strIvl(pitch) {
  var p = isIvlPitch(pitch) ? decode(pitch) : null;
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

// create a function decorator to work with pitches
var pitchOp = function pitchOp(parse, to) {
  return function (fn) {
    return function (v) {
      // is value in array notation?...
      var isP = isPitch(v);
      // then no transformation is required
      if (isP) return fn(v);
      // else parse the pitch
      var p = parse(v);
      // if parsed, apply function and back to string
      return p ? to(fn(p)) : null;
    };
  };
};
var noteFn = pitchOp(parseNote, toNoteStr);
var ivlFn = pitchOp(parseIvl, toIvlStr);
var pitchFn = pitchOp(parsePitch, toPitchStr);

/**
 * Given a string return a note string in scientific notation or null
 * if not valid string
 *
 * @function
 * @param {String}
 * @return {String}
 * @example
 * ['c', 'db3', '2', 'g+', 'gx4'].map(tonal.note)
 * // => ['C', 'Db3', null, null, 'G##4']
 */
var note = noteFn(id);

// #### Pitch properties

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
var pc = noteFn(function (p) {
  return ['tnl', p[1]];
});

/**
 * Return the chroma of a pitch.
 *
 * @function
 * @param {String|Pitch}
 * @return {Integer}
 */
var chroma = pitchFn(function (n) {
  return 7 * n[1] - 12 * fOcts(n[1]);
});

exports.isArr = isArr;
exports.isNum = isNum;
exports.isStr = isStr;
exports.isDef = isDef;
exports.isValue = isValue;
exports.id = id;
exports.pitchClass = pitchClass;
exports.notePitch = notePitch;
exports.ivlPitch = ivlPitch;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPitchNotIvl = isPitchNotIvl;
exports.height = height;
exports.encode = encode;
exports.decode = decode;
exports.parseNote = parseNote;
exports.isNoteStr = isNoteStr;
exports.parseIvl = parseIvl;
exports.isIvlPitchStr = isIvlPitchStr;
exports.toLetter = toLetter;
exports.toAcc = toAcc;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.asNote = asNote;
exports.asIvl = asIvl;
exports.asPitch = asPitch;
exports.toNoteStr = toNoteStr;
exports.toIvlStr = toIvlStr;
exports.toPitchStr = toPitchStr;
exports.note = note;
exports.pc = pc;
exports.chroma = chroma;