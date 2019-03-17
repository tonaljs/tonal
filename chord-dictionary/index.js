import data from "./chord-data";
import { chroma } from "../pc-set";

/**
 * A dictionary of musical chords. Query functions to get chord names and abbreviations
 * chord name from intervals, and intervals from chord name
 *
 * @example
 * import ChordDictionary from "tonal/chord-dictionary"
 *
 * ChordDictionary.intervals("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
 * ChordDictionary.names() // => ["major", "minor", ...]
 *
 * @example
 * // with require
 * const { ChordDictionary } = require("tonal")
 *
 * @module ChordDictionary
 */
export default {
  names,
  abbreviations,
  aliases,
  nameOf,
  abbreviationsOf,
  intervalsOf
};

const map = fn => Object.keys(data).map(fn);
const build = (fn, init = {}) =>
  Object.keys(data).reduce((acc, key) => {
    fn(acc, key, data[key]);
    return acc;
  }, init);

// CACHES
let nameList,
  abbrvList,
  aliasList,
  abbreviationsIndex,
  namesIndex,
  intervalsBySymbol;

/**
 * Get chord names
 * @return {Array<string>} a list of chord names sorted alphabetically
 * @example
 * ChordDictionary.names() // => [...]
 */
export function names() {
  nameList =
    nameList ||
    map(key => data[key][0])
      .filter(x => x)
      .sort();
  return nameList.slice();
}

/**
 * Get all chord abbreviations (without abbreviation alises)
 * It returns one abbreviation for each different chord
 *
 * @return {Array<string>} a list of chord abbreviations sorted alphabetically
 * @example
 * ChordDictionary.abbreviations() // => [...]
 */
export function abbreviations() {
  abbrvList = abbrvList || map(key => data[key][1].split(" ")[0]).sort();
  return abbrvList.slice();
}

/**
 * Get all chord names with all chord abbreviations (including aliases)
 * Basically it returns a list of all known names and abbreviations
 *
 * @return {Array<string>} a list of chord names sorted alphabetically
 * @example
 * ChordDictionary.aliases() // => [...]
 */
export function aliases() {
  aliasList =
    aliasList ||
    build((abbreviationsIndexes, key, value) => {
      value[1]
        .split(" ")
        .forEach(abbreviationsIndex =>
          abbreviationsIndexes.push(abbreviationsIndex)
        );
    }, []).sort();
  return aliasList.slice();
}

/**
 * Given a chord symbol (name or abbreviation), return the name
 *
 * @param {string} symbol - chord name or abbreviation
 * @return {Array<string>} list of names or empty list if name not found
 * @example
 * ChordDictionary.nameOf("M") // => "major seventh"
 * ChordDictionary.nameOf("major seventh") // => "major seventh"
 */
export function nameOf(symbol) {
  namesIndex =
    namesIndex ||
    build((index, ivls, [name, abbrvs]) => {
      index[chroma(ivls.split(" "))] = name;
      if (name) index[name] = name;
      abbrvs.split(" ").forEach(abb => (index[abb] = name));
    });
  const chordChroma = chroma(symbol);
  return chordChroma ? namesIndex[chordChroma] : namesIndex[symbol];
}

/**
 * Given a chord symbol (name or abbreviation), return all known abbreviations
 *
 * @param {Array<String>|string} source - chord intervals, chroma, name or abbreviation
 * @return {Array<string>} list of names or empty list if name not found
 * @example
 * ChordDictionary.abbreviationsOf("major seventh") // => ['maj7', 'Δ', 'ma7', 'M7', 'Maj7']
 * ChordDictionary.abbreviationsOf("maj7") // => ['maj7', 'Δ', 'ma7', 'M7', 'Maj7']
 */
export function abbreviationsOf(source) {
  abbreviationsIndex =
    abbreviationsIndex ||
    build((index, ivls, [name, abbvsStr]) => {
      const abbreviations = abbvsStr.split(" ");
      index[chroma(ivls.split(" "))] = abbreviations;
      index[name] = abbreviations;
      abbreviations.forEach(abb => (index[abb] = abbreviations));
    });

  const chordChroma = chroma(source);
  const abbreviations = chordChroma
    ? abbreviationsIndex[chordChroma]
    : abbreviationsIndex[source];
  return abbreviations || [];
}

/**
 * Given a chord name or abbreviation, return its intervals
 *
 * @param {string} symbol - name or abbreviation
 * @return {Array<string>} a list of intervals or empty list if name not found
 *
 * @example
 * ChordDictionary.intervalsOf("M") // => ["1P", "3M", "5P"]
 * ChordDictionary.intervalsOf("major seventh") // => ["1P", "3M", "5P", "7M"]
 * ChordDictionary.intervalsOf("maj7") // => ["1P", "3M", "5P", "7M"]
 * ChordDictionary.intervalsOf("Δ") // => ["1P", "3M", "5P", "7M"]
 */
export function intervalsOf(symbol) {
  intervalsBySymbol =
    intervalsBySymbol ||
    build((index, key, [name, abbrevs]) => {
      const intervals = key.split(" ");
      index[name] = intervals;
      abbrevs.split(" ").forEach(abb => (index[abb] = intervals));
    }, {});
  return intervalsBySymbol[symbol] || [];
}
