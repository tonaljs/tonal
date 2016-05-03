'use strict';

var tonalPitches = require('tonal-pitches');
var tonalDistances = require('tonal-distances');
var tonalMidi = require('tonal-midi');

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/;
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function asList(src) {
  return tonalPitches.isArr(src) ? src : typeof src === 'string' ? src.trim().split(SEP) : src === null || typeof src === 'undefined' ? [] : [src];
}

/**
 * Map a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
function map(fn, list) {
  return arguments.length > 1 ? map(fn)(list) : function (l) {
    return asList(l).map(fn);
  };
}

/**
 * Filter a list with a function
 *
 * Can be partially applied.
 *
 * @param {Function}
 * @param {String|Array}
 * @return {Array}
 */
function filter(fn, list) {
  return arguments.length > 1 ? filter(fn)(list) : function (l) {
    return asList(l).filter(fn);
  };
}

// #### Transform lists in array notation

var listToStr = function listToStr(v) {
  return tonalPitches.isPitch(v) ? tonalPitches.toPitchStr(v) : tonalPitches.isArr(v) ? v.map(tonalPitches.toPitchStr) : v;
};

/**
 * Decorates a function to work with lists in pitch array notation
 * @function
 */
var listFn = function listFn(fn) {
  return function (src) {
    var param = asList(src).map(tonalPitches.asPitch);
    var result = fn(param);
    return listToStr(result);
  };
};

// #### Transpose lists

/**
 * Create an harmonizer: a function that given a note returns a list of notes.
 *
 * @function
 * @param {String|Array} list
 * @return {Function}
 */
var harmonizer = function harmonizer(list) {
  return function (pitch) {
    return listFn(function (list) {
      return list.map(tonalDistances.tr(pitch || 'P1')).filter(tonalPitches.id);
    })(list);
  };
};

/**
 * Harmonizes a list with a pitch
 *
 * @function
 * @param {String|Array} list
 * @param {String|Pitch} pitch
 * @return {Array}
 */
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
  var ma = tonalPitches.isNum(a) ? a : tonalMidi.toMidi(a);
  var mb = tonalPitches.isNum(b) ? b : tonalMidi.toMidi(b);
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
var chromatic = noteRange(tonalMidi.fromMidi);

// #### Cycle of fifths

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {Integer} the first step from tonic
 * @param {Integer} the last step from tonic (can be negative)
 * @param {String|Pitch} the tonic
 * @return {Array} a range of cycle of fifths
 */
var cycleOfFifths = function cycleOfFifths(s, e, t) {
  return range(s, e).map(tonalDistances.fifthsFrom(t));
};

// #### Sort lists

var objHeight = function objHeight(p) {
  if (!p) return -Infinity;
  var f = p[1] * 7;
  var o = tonalPitches.isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10;
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

exports.asList = asList;
exports.map = map;
exports.filter = filter;
exports.listFn = listFn;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.range = range;
exports.noteRange = noteRange;
exports.chromatic = chromatic;
exports.cycleOfFifths = cycleOfFifths;
exports.sort = sort;