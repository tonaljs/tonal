(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.noteMidi = factory());
}(this, function () { 'use strict';

  var isArr = Array.isArray;
  var isStr = function isStr(s) {
    return typeof s === 'string';
  };
  // The number of fifths required to get C, D, E, F, G, A and B
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  // get the number of fifths for a letter index and alteration
  // letter is 0 for C, 1 for D, 2 for E ... and 6 for B
  // alt is 0 for unaltered, positive for sharps and negative for flats
  var fifths = function fifths(letter, alt) {
    return FIFTHS[letter] + 7 * alt;
  };
  // given a number of fiths, return the octaves they span
  var fifthsOcts = function fifthsOcts(f) {
    return Math.floor(f * 7 / 12);
  };
  // encode the octaves required for a pitch
  function octaves(letter, alt, oct) {
    return oct - fifthsOcts(FIFTHS[letter]) - 4 * alt;
  }
  /**
   * Build a pitch from letter index, alteration and octave. If
   * octave is not present, it builds a pitch class.
   *
   * @param {Integer} letter - the letter number (0-based index)
   * @param {Integer} alt - the pitch accidentals integer
   * @param {Integer} oct - the pitch octave
   * @return {Array} the pitch in coord notation
   */
  function pitch(letter, alt, oct) {
    return !oct && oct !== 0 ? [fifths(letter, alt)] : [fifths(letter, alt), octaves(letter, alt, oct)];
  }
  var PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/;
  /**
   * Given a pitch letter string, return it's letter index.
   * @param {String} letter - the pitch letter
   * @return {Integer} the letter index
   */
  var letterIndex = function letterIndex(l) {
    return 'CDEFGAB'.indexOf(l.toUpperCase());
  };
  /**
   * Convert accidental string to alteration number
   * @function
   * @param {String} acc - the accidental string
   * @return {Integer} the alteration number
   * @example
   * accToAlt('#') // => 1
   * accToAlt('bbb') // => -2
   * accToAlt('') // => 0
   * accToAlt('x') // => 2
   */
  function accToAlt(acc) {
    var alt = acc.replace(/x/g, '##').length;
    return acc[0] === 'b' ? -alt : alt;
  }
  /**
   * Given a pitch string in scientific notation, get the pitch in array notation
   * @param {String} str - the string to parse
   * @return {Array} the pitch in array notation or null if not valid string
   * @example
   * pitchParse('C2') // => [2, 1]
   * pitchParse('bla') // => null
   */
  function pitchParse(str) {
    var m = PITCH_REGEX.exec(str);
    if (!m) return null;
    var li = letterIndex(m[1]);
    var alt = accToAlt(m[2]);
    var oct = m[3] ? +m[3] : null;
    return pitch(li, alt, oct);
  }
  function tryParser(parser) {
    return function (obj) {
      return isStr(obj) ? parser(obj) || obj : obj;
    };
  }

  /**
   * Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.
   *
   * @function
   * @param {Object} obj - the object to parse
   * @return {Array|Object} the parsed pitch or the object if not valid pitch string
   * @example
   * tryPitch('G3') // => [1, 3]
   * tryPitch([1, 3]) // => [1, 3]
   * tryPitch(3) // => 2
   */
  var tryPitch = tryParser(pitchParse);
  /**
   * Decorate a function with one parameter to accepts
   * pitch in scientific notation
   * @param {Function} fn - the function to decorate
   * @return {Function} a function with one parameter that can be a pitch in scientific notation or anything else.
   */
  var prop = function prop(fn) {
    return function (obj) {
      return fn(tryPitch(obj));
    };
  };
  // return if pitch has octave or not (is a pitch class)
  function hasOct(p) {
    return isArr(p) && typeof p[1] !== 'undefined';
  }
  // get pitch height
  var height = function height(p) {
    return p[0] * 7 + 12 * p[1];
  };
  /**
   * Test if the given number is a valid midi note number
   * @function
   * @param {Object} num - the number to test
   * @return {Boolean} true if it's a valid midi note number
   */
  var isMidi = function isMidi(m) {
    return !isArr(m) && m > 0 && m < 129;
  };
  /**
   * Get midi number for a pitch
   * @function
   * @param {Array|String} pitch - the pitch
   * @return {Integer} the midi number or null if not valid pitch
   * @example
   * midi('C4') // => 60
   */
  var midi = prop(function (p) {
    return hasOct(p) ? height(p) + 12 : isMidi(p) ? +p : null;
  });

  return midi;

}));
