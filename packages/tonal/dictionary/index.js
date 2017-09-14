/**
 * This module tonal dictionaries: functions that, given a name, returns an
 * array of intervals.
 *
 * @module dictionary
 */
import { map, compact, sort } from "tonal-array";
import { pc } from "tonal-note";
import { chroma, modes } from "tonal-pcset";
import scalesData from "./data/scales.json";
import chordsData from "./data/chords.json";

/**
 * Create a tonal dictionary from data object
 * 
 * The data object must have this form:
 * `{ key: [intervals, [aliases]] }`
 * 
 * @param {Object} source 
 * @param {Function} parse 
 * @example
 * const dictionary = require('tonal-dictionary')
 * var DATA = {
 *   'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7':   ['1 b3 5 7']
 * }
 * var chords = dictionary.build(DATA);
 * chords('maj7') // => [ '1', '3', '5', '7' ]
 * chords('Maj7') // => [ '1', '3', '5', '7' ]
 * chords('m7') // => ['1', 'b3', '5', '7']
 * chords('m7b5') // => null
 * chords.keys() // => ['maj7', 'm7']
 * chords.keys(true) // => ['maj7', 'm7', 'Maj7']
 */
export function build(source, parse = x => x.split(" ")) {
  const keys = Object.keys(source).sort();
  const data = {};
  keys.forEach(k => {
    data[k] = parse(source[k][0]);
    (source[k][1] || []).forEach(alias => (data[alias] = data[k]));
  });
  const allKeys = Object.keys(data).sort();
  const dictionary = name => data[name];
  dictionary.keys = aliases => (aliases ? allKeys : keys).slice();
  return dictionary;
}

export const scale = build(scalesData);
export const chord = build(chordsData);

/**
 * A dictionary with all known pitchsets (includes chords and scales)
 * 
 * @param {String} name 
 */
export const pitchset = name => scale(name) || chord(name);
pitchset.keys = alias => scale.keys(alias).concat(chord.keys(alias));

export const index = (dictionary, genKey = chroma) => {
  const names = dictionary.keys(true);
  const data = {};
  names.forEach(name => {
    const key = genKey(dictionary(name));
    data[key] = data[key] || [];
    data[key].push(name);
  });
  const index = name => data[name] || [];
  index.keys = () => Object.keys(data);
  return index;
};

/**
 * Create a tonal dictionary. A dictionary is an object with two functions: get and
 * keys.
 *
 * The data given to this constructor it's a HashMap in the form:
 * `{ key: [intervals, [aliases]] }`
 *
 * @param {HashMap} data - the dictionary data
 * @return {Object} the dictionary object
 *
 * @example
 * var dictionary = require('tonal-dictionary').dictionary
 * var DATA = {
 * 'maj7': ['1 3 5 7', ['Maj7']],
 *   'm7': ['1 b3 5 7']
 * }
 * var chords = dictionary(DATA, function (str) { return str.split(' ') })
 * chords.get('maj7') // => [ '1', '3', '5', '7' ]
 * chords.get('Maj7') // => [ '1', '3', '5', '7' ]
 * chords.get('m7') // => ['1', 'b3', '5', '7']
 * chords.get('m7b5') // => null
 * chords.keys() // => ['maj7', 'm7']
 * chords.keys(true) // => ['maj7', 'm7', 'Maj7']
 */
export function dictionary(raw, parse) {
  console.warn("@deprecated: use dictionary.build");
  parse = parse || (x => x);
  var byKey = {};
  var names = Object.keys(raw);
  var aliases = [];
  names.forEach(function(k) {
    var value = parse(raw[k][0]);
    byKey[k] = value;
    if (raw[k][1]) {
      raw[k][1].forEach(function(alias) {
        byKey[alias] = value;
        aliases.push(alias);
      });
    }
  });
  return {
    /**
     * Get a value by key
     * @name get
     * @function
     * @param {String} key
     * @return {Object} the value (normally an array of intervals or notes)
     * @memberof dictionary
     */
    get: function(n) {
      return byKey[n];
    },
    /**
     * Get the valid keys of dictionary
     * @name keys
     * @function
     * @param {Boolean} aliases - (Optional) include aliases names (false by default)
     * @param {Function} filter - a function to filter the names. It receives the
     * name and the value as parameters
     * @return {Array<String>} the keys
     * @memberof dictionary
     */
    keys: function(all, filter) {
      var keys = all ? names.concat(aliases) : names.slice();
      return typeof filter !== "function"
        ? keys
        : keys.filter(function(k) {
            return filter(k, byKey[k]);
          });
    }
  };
}

/**
 * Create a pitch set detector. Given a dictionary data, it returns a
 * function that tries to detect a given pitch set inside the dictionary
 *
 * @param {Dictionary} dictionary - the dictionary object
 * @param {Function|String} builder - (Optional) a function that given a name and a tonic,
 * returns the object or a string to join both
 * @return {Function} the detector function
 * @see chord.detect
 * @see scale.detect
 * @example
 * var detect = detector(dictionary(DATA), '')
 * detect('c d e b') // => 'Cmaj/'
 */
export function detector(dict, build) {
  var isSep = typeof build === "string";
  var isFn = typeof build === "function";
  var nameByChroma = dict.keys(false).reduce(function(map, key) {
    map[chroma(dict.get(key))] = key;
    return map;
  }, {});

  return function(notes) {
    notes = sort(map(pc, notes));
    var sets = modes(notes);
    return compact(
      sets.map(function(set, i) {
        var type = nameByChroma[set];
        if (!type) return null;
        var tonic = notes[i];
        return isSep
          ? tonic + build + type
          : isFn ? build(type, tonic) : [type, tonic];
      })
    );
  };
}
