'use strict';

var _ = require('tonal');
var areFlats = function areFlats(s) {
  return (/^b+$/.test(s)
  );
};
var areSharps = function areSharps(s) {
  return (/^#+$/.test(s)
  );
};

// Modes
// =====

var MODES = { major: 0, minor: 5, ionian: 0, dorian: 1, phrygian: 2,
  lydian: 3, mixolydian: 4, aeolian: 5, locrian: 6 };
var isModeStr = function isModeStr(m) {
  return MODES[m] != null;
};
var modes = function modes() {
  return Object.keys(MODES);
};

/**
 * Create a key
 */
function build(tonic, mode) {
  if (!_.isStr(mode)) return null;
  var m = mode.trim().toLowerCase();
  if (!isModeStr(m)) return null;
  var t = _.pc(tonic) || false;
  var n = t ? t + ' ' + m : null;
  return { name: n, tonic: t, mode: m };
}
var isKey = function isKey(o) {
  return o && _.isDef(o.tonic) && _.isStr(o.mode);
};
var hasTonic = function hasTonic(o) {
  return isKey(o) && o.tonic;
};

// create a interval of n * P5
var nP5 = function nP5(n) {
  return ['tnl', n, 0, 1];
};
var major = function major(n) {
  return build(_.transpose('C', nP5(n)), 'major');
};

/**
 * Create a key from alterations
 */
var fromAlter = function fromAlter(n) {
  return major(+n);
};

/**
 * Create a key from accidentals
 */
var fromAcc = function fromAcc(s) {
  return areSharps(s) ? major(s.length) : areFlats(s) ? major(-s.length) : null;
};

/**
 * Create a key from key name
 *
 */
var fromName = function fromName(str) {
  if (!_.isStr(str)) return null;
  var p = str.split(/\s+/);
  switch (p.length) {
    case 1:
      return _.isNoteStr(p[0]) ? build(p[0], 'major') : isModeStr(p[0]) ? build(false, p[0]) : null;
    case 2:
      return build(p[0], p[1]);
    default:
      return null;
  }
};

/**
 * Try to interpret the given object as a key
 */
var asKey = function asKey(obj) {
  return isKey(obj) ? obj : fromName(obj) || fromAcc(obj) || fromAlter(obj);
};
var keyFn = function keyFn(fn) {
  return function (key) {
    var k = asKey(key);
    return k ? fn(k) : null;
  };
};

var modeNum = function modeNum(k) {
  return MODES[k.mode];
};
var relative = function relative(rel, key) {
  var r = asKey(rel);
  if (hasTonic(r)) return null;
  var k = asKey(key);
  if (!hasTonic(k)) return null;
  var toMajor = _.ivl(modeNum(k), 0, 0, -1);
  var toRel = _.ivl(modeNum(r), 0, 0, 1);
  var tonic = _.transpose(k.tonic, _.transpose(toMajor, toRel));
  return build(tonic, rel);
};

var alteration = function alteration(key) {
  var k = asKey(key);
  var toMajor = modeNum(k);
  var toC = _.parseNote(k.tonic)[1];
  return toMajor + toC;
};

var accidentals = function accidentals(key) {
  return _.toAcc(alteration(key));
};
var signature = accidentals;

var alteredNotes = function alteredNotes(key) {
  var alt = alteration(key);
  return alt === null ? null : alt < 0 ? _.range(-1, alt).map(_.fifthsFrom('F')) : _.range(1, alt).map(_.fifthsFrom('B'));
};

exports.areFlats = areFlats;
exports.areSharps = areSharps;
exports.isModeStr = isModeStr;
exports.modes = modes;
exports.build = build;
exports.isKey = isKey;
exports.hasTonic = hasTonic;
exports.fromAlter = fromAlter;
exports.fromAcc = fromAcc;
exports.fromName = fromName;
exports.asKey = asKey;
exports.keyFn = keyFn;
exports.relative = relative;
exports.alteration = alteration;
exports.accidentals = accidentals;
exports.signature = signature;
exports.alteredNotes = alteredNotes;