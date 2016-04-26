'use strict';

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
 * Create a pitch class in array notation
 *
 * @param {Integer} fifhts - the number of fifths from C
 * @return {Pitch} the pitch in array notation
 */
var pcArr = function pcArr(f) {
  return ['tnl', f];
};

/**
 * Create a note pitch in array notation
 *
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @return {Pitch} the pitch in array notation
 */
var noteArr = function noteArr(f, o) {
  return ['tnl', f, o];
};

// calculate interval direction
var calcDir = function calcDir(f, o) {
  return encDir(7 * f + 12 * o);
};

/**
 * Create an interval in array notation
 *
 * @param {Integer} fifhts - the number of fifths from C
 * @param {Integer} octaves - the number of encoded octaves
 * @param {Integer} dir - (Optional) the direction
 * @return {Pitch} the pitch in array notation
 */
var ivlArr = function ivlArr(f, o, d) {
  return ['tnl', f, o, d || calcDir(f, o)];
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
var isInterval = function isInterval(i) {
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
  if (!isNum(oct)) return pcArr(pc);
  var o = encOct(step, alt, oct);

  // if not direction, return a note pitch
  if (!isNum(dir)) return noteArr(pc, o);
  var d = encDir(dir);
  // return the interval
  return ivlArr(d * pc, d * o, d);
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
 * @param {String}
 * @return {Pitch}
 */
var parseNote = cached(function (str) {
  var n = noteParse(str);
  return n ? encode(n.step, n.alt, n.oct) : null;
});

/**
 * Test if the given string is a note name
 * @param {String}
 * @return {Boolean}
 */
var isNoteStr = function isNoteStr(s) {
  return parseNote(s) !== null;
};

/**
 * Parses an interval name in shorthand notation
 * @param {String}
 * @return {Pitch}
 */
var parseIvl = cached(function (str) {
  var i = ivlNttn.parse(str);
  return i ? encode(i.simple - 1, i.alt, i.oct, i.dir) : null;
});

/**
 * Test if the given string is an interval name
 * @param {String}
 * @return {Boolean}
 */
var isIntervalStr = function isIntervalStr(s) {
  return parseIvl(s) !== null;
};

var parsePitch = function parsePitch(str) {
  return parseNote(str) || parseIvl(str);
};

// ### Pitch to string

/**
 * Given a step number return the letter
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
 * @param {String|Pitch}
 * @return {Integer}
 */
var chroma = pitchFn(function (n) {
  return n[1] * 7 - Math.floor(n[1] * 7 / 12) * 12;
});

/**
 * Return the letter of a pitch
 *
 * @param {String|Pitch}
 * @return {String}
 */
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
  return ivlArr(i[1], -d * (FIFTH_OCTS[s] + 4 * a), d);
});

var simplifyAsc = ivlFn(function (i) {
  var s = simplify(i);
  return s[3] === 1 ? s : ivlArr(s[1], s[2] + 1, 1);
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

var PCS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');
/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats.
 * @param {Integer} midi - the midi note number
 * @return {String} the note name
 * @example
 * tonal.fromMidi(61) // => 'Db4'
 */
var fromMidi = function fromMidi(m) {
  var pc = PCS[m % 12];
  var o = Math.floor(m / 12) - 1;
  return pc + o;
};

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
 * tonal.freq('C4') // => 261.6255653005986
 */
var freq = wellTempered(440);

// ## 2. Pitch distances

function trBy(i, p) {
  if (p === null) return null;
  var f = i[1] + p[1];
  if (p.length === 2) return ['tnl', f];
  var o = i[2] + p[2];
  if (p.length === 3) return ['tnl', f, o];
  return ['tnl', f, o, calcDir(f, o)];
}

/**
 * Transpose notes. Can be used to add intervals
 * @function
 */
function transpose(a, b) {
  if (arguments.length === 1) return function (b) {
    return transpose(a, b);
  };
  var pa = asPitch(a);
  var pb = asPitch(b);
  var r = isInterval(pa) ? trBy(pa, pb) : isInterval(pb) ? trBy(pb, pa) : null;
  return toPitchStr(r);
}

/**
 * Transpose notes. An alias for `transpose`
 * @function
 */
var tr = transpose;

// test two pitches against same type detector
var are = function are(type, a, b) {
  return type(a) && type(b);
};

// substract two pitches
function substr(a, b) {
  return are(isPitchClass, a, b) ? simplifyAsc(ivlArr(b[1] - a[1], 0)) : are(isNotePitch, a, b) ? ivlArr(b[1] - a[1], b[2] - a[2]) : are(isInterval, a, b) ? ivlArr(b[1] - a[1], b[2] - a[2]) : null;
}

/**
 * Find distance between two pitches. Both pitches MUST be of the same type.
 * Distances between pitch classes always returns ascending intervals.
 * Distances between intervals substract one from the other.
 *
 * @param {Pitch|String} from - distance from
 * @param {Pitch|String} to - distance to
 * @return {Interval} the distance between pitches
 * @example
 * var tonal = require('tonal')
 * tonal.distance('C2', 'C3') // => 'P8'
 * tonal.distance('G', 'B') // => 'M3'
 * tonal.distance('M2', 'P5') // => 'P4'
 */
function distance(a, b) {
  if (arguments.length === 1) return function (b) {
    return distance(a, b);
  };
  var pa = asPitch(a);
  var pb = asPitch(b);
  var i = substr(pa, pb);
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : toIvlStr(i);
}

/**
 * An alias for `distance`
 * @function
 */
var dist = distance;
/**
 * An alias for `distance`
 * @function
 */
var interval = distance;

// ## 3. Lists

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/;
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function asList(src) {
  return isArr(src) ? src : typeof src === 'string' ? src.trim().split(SEP) : src === null || typeof src === 'undefined' ? [] : [src];
}

function map(fn, list) {
  return arguments.length > 1 ? map(fn)(list) : function (l) {
    return asList(l).map(fn);
  };
}

function filter(fn, list) {
  return arguments.length > 1 ? filter(fn)(list) : function (l) {
    return asList(l).filter(fn);
  };
}

// #### Transform lists in array notation

var listToStr = function listToStr(v) {
  return isPitch(v) ? toPitchStr(v) : isArr(v) ? v.map(toPitchStr) : v;
};

/**
 * Decorates a function to work with lists in pitch array notation
 * @function
 */
var listFn = function listFn(fn) {
  return function (src) {
    var param = asList(src).map(asPitch);
    var result = fn(param);
    return listToStr(result);
  };
};

// #### Transpose lists

/**
 * Create an harmonizer: a function that given a note returns a list of notes.
 * @function
 */
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

// #### Ranges

// ascending range
var ascR = function ascR(b, n) {
  for (var a = []; n--; a[n] = n + b) {}return a;
};
// descending range
var descR = function descR(b, n) {
  for (var a = []; n--; a[n] = b - n) {}return a;
};

/**
 * Create a range. It works with numbers or note names
 * @function
 */
function range(a, b) {
  var ma = isNum(a) ? a : midi(a);
  var mb = isNum(b) ? b : midi(b);
  return ma === null || mb === null ? [] : ma < mb ? ascR(ma, mb - ma + 1) : descR(ma, ma - mb + 1);
}

/**
 * Create a note range
 * @function
 */
function noteRange(fn, a, b) {
  if (arguments.length === 1) return function (a, b) {
    return noteRange(fn, a, b);
  };
  return range(a, b).map(fn).filter(function (x) {
    return x !== null;
  });
}

/**
 * Create a range of chromatic notes
 * @function
 * @example
 * tonal.chromatic('C2', 'E2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2']
 */
var chromatic = noteRange(fromMidi);

// #### Cycle of fifths

/**
 * Transpose a tonic a number of perfect fifths.
 * @function
 */
function fifthsFrom(t, n) {
  if (arguments.length > 1) return fifthsFrom(t)(n);
  return function (n) {
    return tr(t, ivlArr(n, 0));
  };
}

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
exports.id = id;
exports.pcArr = pcArr;
exports.noteArr = noteArr;
exports.ivlArr = ivlArr;
exports.isPitch = isPitch;
exports.isPitchClass = isPitchClass;
exports.hasOct = hasOct;
exports.isNotePitch = isNotePitch;
exports.isInterval = isInterval;
exports.isPitchNotIvl = isPitchNotIvl;
exports.encode = encode;
exports.decode = decode;
exports.parseNote = parseNote;
exports.isNoteStr = isNoteStr;
exports.parseIvl = parseIvl;
exports.isIntervalStr = isIntervalStr;
exports.toLetter = toLetter;
exports.toAcc = toAcc;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.note = note;
exports.pc = pc;
exports.chroma = chroma;
exports.letter = letter;
exports.accidentals = accidentals;
exports.octave = octave;
exports.simplify = simplify;
exports.simplifyAsc = simplifyAsc;
exports.simpleNum = simpleNum;
exports.number = number;
exports.quality = quality;
exports.semitones = semitones;
exports.isMidi = isMidi;
exports.midi = midi;
exports.fromMidi = fromMidi;
exports.wellTempered = wellTempered;
exports.freq = freq;
exports.transpose = transpose;
exports.tr = tr;
exports.distance = distance;
exports.dist = dist;
exports.interval = interval;
exports.asList = asList;
exports.map = map;
exports.filter = filter;
exports.listFn = listFn;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.range = range;
exports.noteRange = noteRange;
exports.chromatic = chromatic;
exports.fifthsFrom = fifthsFrom;
exports.sort = sort;