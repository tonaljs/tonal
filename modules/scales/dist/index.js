'use strict';

var tonal = require('tonal');

var raw = require('./scales.json');

var DATA = Object.keys(raw).reduce(function (d, k) {
  // add intervals
  d[k] = raw[k][0].split(' ').map(tonal.parseIvl);
  // add alias
  if (raw[k][1]) raw[k][1].forEach(function (a) {
    d[a] = k;
  });
  return d;
}, {});

var harmonizer = function harmonizer(ivls) {
  return function (tonic) {
    return tonal.harmonize(ivls, tonic || 'P1');
  };
};

/**
 * Create a scale from a name or intervals and tonic
 *
 * @param {Array} source - the scale name, scale intervals or scale notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * const scale = require('tonal-scales')
 * // get scale from type and tonic
 * scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // get scale from intervals and tonic
 * scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * // partially applied
 * const major = scale('major')
 * major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // part of tonal
 * tonal.scale('major', 'A')
 */
function scale(source, tonic) {
  if (arguments.length > 1) return scale(source)(tonic);
  var intervals = DATA[source];
  // is an alias?
  if (typeof intervals === 'string') intervals = DATA[intervals];
  return harmonizer(intervals || source);
}

/**
 * Get scale notes by scale name
 *
 * @param {String} name - the complete scale name (with tonic)
 * @return {Array} scale notes
 *
 * @example
 * const scales = require('tonal-scales')
 * scales.fromName('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 */
function fromName(name) {
  var i = name.indexOf(' ');
  if (i === -1) return scale(name, false);else return scale(name.slice(i + 1), name.slice(0, i));
}

/**
 * Return the available scale names
 *
 * @param {boolean} aliases - true to include aliases
 * @return {Array} an array of scale names
 *
 * @example
 * const scales = require('tonal-scales')
 * scales.names() // => ['maj7', ...]
 */
function names(aliases) {
  if (aliases) return Object.keys(DATA);
  return Object.keys(DATA).reduce(function (names, name) {
    if (typeof DATA[name] !== 'string') names.push(name);
    return names;
  }, []);
}

var buildNote = function buildNote(pc, midi) {
  return pc + (Math.floor(midi / 12) - 1);
};
var pitchSetGen = function pitchSetGen(notes) {
  var scale = tonal.map(tonal.pc, notes);
  var chromas = tonal.map(tonal.chroma, scale);
  return function (midi) {
    var pcIndex = chromas.indexOf(midi % 12);
    return pcIndex > -1 ? buildNote(scale[pcIndex], midi) : null;
  };
};

/**
 * Create a scale range. It accepts a scale name or scale notes.
 *
 * @param {String|Array} src - the scale name or scale notes
 * @param {String} start - the first note of the range
 * @param {String} end - the last note of the range
 * @return {Array} the scale range, an empty array if not valid source or
 * null if not valid start or end
 * @example
 * import { scaleRange } from 'tonal-scales'
 * scalesRange('C bebbop', 'C3', 'C2')
 * // => [ 'C3', 'B2', 'Bb2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
 */
function scaleRange(src, start, end) {
  var scale = fromName(src);
  return tonal.noteRange(pitchSetGen(scale.length ? scale : src), start, end);
}

exports.DATA = DATA;
exports.scale = scale;
exports.fromName = fromName;
exports.names = names;
exports.scaleRange = scaleRange;