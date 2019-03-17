import data from "./data";
import { chroma } from "../pcset";

/**
 * A dictionary of musical scales. Query functions to get scale names,
 * names from intervals, and intervals from names
 *
 * @example
 * import ScaleDictionary from "tonal/scale-dictionary"
 *
 * ScaleDictionary.names() // => ["major", "minor", ...]
 * ScaleDictionary.intervalsOf("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
 * ScaleDictionary.nameOf(["1P", "2M", "3M", "4P", "5P", "6M", "7M"]) // =>  "major"
 *
 * @example
 * // with require
 * const { ScaleDictionary } = require("tonal")
 *
 * @module ScaleDictionary
 */
export default { names, aliases, intervalsOf, nameOf, aliasesOf };

// cache
let nameList, aliasList, ivlsByName, aliasByName, nameByChroma;

const buildIndex = fn =>
  Object.keys(data).reduce((idx, key) => {
    fn(idx, key, data[key]);
    return idx;
  }, {});

/**
 * Get all scale names without alises
 * @return {Array<string>} a list of scale names sorted alphabetically
 * @example
 * ScaleDictionary.names() // => [...]
 */
export function names() {
  nameList =
    nameList ||
    Object.keys(data)
      .map(key => data[key][0])
      .sort();
  return nameList.slice();
}

/**
 * Get all scale names with aliases
 * @return {Array<string>} a list of scale names sorted alphabetically
 * @example
 * ScaleDictionary.aliases() // => [...]
 */
export function aliases() {
  aliasList =
    aliasList ||
    Object.keys(data)
      .reduce((list, ivls) => [...list, ...data[ivls]], [])
      .sort();
  return aliasList.slice();
}

/**
 * Given a scale name, return its intervals
 * @param {string} name
 * @return [Array<string>] a list of intervals or empty list if name not found
 * @example
 * ScaleDictionary.intervalsOf("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
 */
export function intervalsOf(name) {
  ivlsByName =
    ivlsByName ||
    buildIndex((idx, ivls, names) => {
      const intervals = ivls.split(" ");
      names.forEach(name => (idx[name] = intervals));
    });
  return (ivlsByName[name] || []).slice();
}

/**
 * Given a list of intervals or a chroma string, return the scale name
 *
 * @param {Array<string>|string} source - a list of intervals, a pcset chroma or a scale name
 * @return {string} the scale name or undefined if not found
 * @example
 * ScaleDictionary.nameOf(["1P", "2M", "3M", "4P", "5P", "6M", "7M"]) // => "major"
 * ScaleDictionary.nameOf("101011010101") // => "major"
 * ScaleDictionary.nameOf("ionian") // => "major"
 * ScaleDictionary.nameOf("major") // => "major"
 */
export function nameOf(intervals) {
  nameByChroma =
    nameByChroma ||
    buildIndex((index, ivls, names) => {
      index[chroma(ivls.split(" "))] = names[0];
      names.forEach(name => (index[name] = names[0]));
    });
  return nameByChroma[chroma(intervals)] || nameByChroma[intervals];
}

/**
 * Given a scale name, return all its aliases (including the given one)
 * @param {string} name
 * @return {Array<string>} list of names or empty list if name not found
 * @example
 * ScaleDictionary.aliasesOf("blues") // => ["blues", "minor blues"]
 */
export function aliasesOf(name) {
  aliasByName =
    aliasByName ||
    buildIndex((idx, ivls, names) => {
      names.forEach(name => (idx[name] = names));
    });
  return aliasByName[name] || [];
}
