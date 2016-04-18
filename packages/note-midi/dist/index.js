(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.noteMidi = factory());
}(this, function () { 'use strict';

  var isArr = Array.isArray;
  var pitch = function pitch(s, a, o) {
    return o || o === 0 ? [s, a, o] : [s, a];
  };
  var PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/;
  var STEPS = 'CDEFGAB';
  /**
   * Given a pitch letter string, return it's letter index.
   * @param {String} letter - the pitch letter
   * @return {Integer} the letter index
   */
  var step = function step(l) {
    return STEPS.indexOf(l.toUpperCase());
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
  // parse a string with a pitch in scientific notation
  function parseSci(str) {
    var m = PITCH_REGEX.exec(str);
    if (!m) return null;
    var l = step(m[1]);
    var a = accToAlt(m[2]);
    var o = m[3] ? +m[3] : null;
    return pitch(l, a, o);
  }
  // decorate a parser to cache results
  function cache(parser) {
    var cache = {};
    return function (str) {
      if (typeof str !== 'string') return null;
      return cache[str] || (cache[str] = parser(str));
    };
  }
  /**
   * Given a pitch string in scientific notation, get the pitch in array notation
   * @function
   * @param {String} str - the string to parse
   * @return {Array} the pitch in array notation or null if not valid string
   * @example
   * pitchParse('C2') // => [2, 1]
   * pitchParse('bla') // => null
   */
  var pitchParse = cache(parseSci);
  var pitchArr = function pitchArr(p) {
    return isArr(p) ? p : pitchParse(p);
  };
  var prop = function prop(fn) {
    return function (p) {
      return fn(pitchArr(p));
    };
  };
  var hasOct = function hasOct(p) {
    return isArr(p) && typeof p[2] !== 'undefined';
  };
  var octOr = function octOr(d) {
    return function (p) {
      return hasOct(p) ? p[2] : d;
    };
  };
  var octStr = octOr('');
  var octNum = octOr(0);
  /**
   * Test if the given number is a valid midi note number
   * @function
   * @param {Object} num - the number to test
   * @return {Boolean} true if it's a valid midi note number
   */
  var isMidi = function isMidi(m) {
    return !isArr(m) && m > 0 && m < 129;
  };
  var HEIGHTS = [0, 2, 4, 5, 7, 9, 11];
  var chroma = prop(function (p) {
    return HEIGHTS[p[0]] + p[1];
  });
  var height = prop(function (p) {
    return chroma(p) + 12 * octNum(p);
  });
  /**
   * Get midi number for a pitch
   * @function
   * @param {Array|String} pitch - the pitch
   * @return {Integer} the midi number or null if not valid pitch
   * @example
   * midi('C4') // => 60
   */
  var midi = function midi(p) {
    var a = pitchArr(p);
    return hasOct(a) ? height(a) + 12 : isMidi(p) ? +p : null;
  };

  return midi;

}));