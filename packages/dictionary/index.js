/**
 * [![npm version](https://img.shields.io/npm/v/tonal-dictionary.svg)](https://www.npmjs.com/package/tonal-dictionary)
 *
 * `tonal-dictionary` contains a dictionary of musical scales and chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Dictionary from "tonal-dictionary"
 * // es5
 * const Dictionary = require("tonal-dictionary")
 *
 * @example
 * Dictionary.chord("Maj7") // => ["1P", "3M", "5P", "7M"]
 *
 * @module Dictionary
 */
import { chroma } from "tonal-pcset";

export const chordAliases = names => {
  return names.reduce((all, name) => {
    all.push(name);
    if (/^Maj7/.test(name)) {
      all.push(name.slice(4) + "maj7");
      all.push(name.slice(4) + "M7");
    } else if (/^m7/.test(name)) {
      all.push(name.slice(2) + "_7");
    } else if (/^M6/.test(name)) {
      all.push(name.slice(1));
    }
    return all;
  }, []);
};

const noAlias = list => list;
const comparator = (a, b) => a.localeCompare(b);

export function dictionary(list, withAlias, compare) {
  if (!withAlias) withAlias = noAlias;
  if (!compare) compare = comparator;

  const data = {};
  const names = [];
  const index = {};

  list.forEach(row => {
    const ivls = row[0].split(" ");
    const chr = chroma(ivls);
    index[chr] = [];
    names.push(row[1]);
    const nameList = withAlias(row.slice(1));
    nameList.forEach(name => {
      data[name] = ivls;
      index[chr].push(name);
    });
  });

  names.sort(compare);
  const allNames = Object.keys(data).sort(compare);

  function dictionary(name) {
    return data[name];
  }
  dictionary.names = aliases => {
    if (typeof aliases === "string") return index[aliases];
    return (aliases === true ? allNames : names).slice();
  };
  return dictionary;
}

/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * It also has a names function that return the names,
 * or the names of a given chroma.
 *
 * @function
 * @param {String} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * // scale names
 * scale.names(); // => ["major", ...]
 * // names with aliases
 * scale.names(true) // => ["major", "ionian", ...]
 * // names for a given chroma
 * scale.names("101011010101") // => ["major", "ionian"]
 */
export const scale = dictionary(require("./data/scales.json"));

/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * It also has a names function that return the names,
 * or the names of a given chroma.
 *
 * @function
 * @param {String} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 * chord.names(true) // => return names including aliases
 * chord.names("100010010000") // => ["Maj", "M"]
 */
export const chord = dictionary(require("./data/chords.json"), chordAliases);

export const combine = (a, b) => {
  const dict = name => a(name) || b(name);
  dict.names = p => a.names(p).concat(b.names(p));
  return dict;
};
export const pcset = combine(scale, chord);
