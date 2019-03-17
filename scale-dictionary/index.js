import data from "./scale-data";
import { chroma } from "../pc-set";

/**
 * A dictionary of musical scales. Query functions to get scale names,
 * names from intervals, and intervals from names
 *
 * Probably you want to use Tonal.Scale instead of this module.
 *
 * @example
 * import ScaleDictionary from "tonal/scale-dictionary"
 *
 * ScaleDictionary.names() // => ["major", "minor", ...]
 * ScaleDictionary.getScale("major") // => {
 *   name: 'major',
 *   intervals: [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ],
 *   names: [ 'major', 'ionian' ],
 *   chroma: '101011010101',
 *   setnum: 2773
 * }
 *
 * @example
 * // CommonJS modules (require, node.js)
 * const { ScaleDictionary } = require("tonal")
 *
 * @module ScaleDictionary
 */
export default { names, aliases, getScale };

// cache
let nameList, aliasList, index;

const NO_SCALE = Object.freeze({ intervals: [], names: [] });
const toScale = data => {
  const intervals = data[0].split(" ");
  const name = data[1];
  const names = data.slice(1);
  const scale = { name, intervals, names };
  scale.chroma = chroma(intervals);
  scale.setnum = parseInt(scale.chroma, 2);
  return scale;
};

const buildIndex = () =>
  data.map(toScale).reduce((index, scale) => {
    index[scale.chroma] = scale;
    scale.names.forEach(name => (index[name] = scale));
    return index;
  }, {});

/**
 * Get all scale names without alises
 * @return {Array<string>} a list of scale names sorted alphabetically
 * @example
 * ScaleDictionary.names() // => [...]
 */
export function names() {
  nameList = nameList || data.map(scale => scale[1]).sort();
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
    data.reduce((list, scale) => [...list, ...scale.slice(1)], []).sort();
  return aliasList.slice();
}

/**
 * Get a scale. The scale can be found using a name, an alias, a list
 * of intervals or a chroma string.
 *
 * The scale object has the following fields:
 * - name: the scale main name
 * - names: a list with all possible names (including the main name)
 * - intervals: an array with the scale intervals
 * - chroma:  scale chroma
 * - setnum: scale chroma number
 *
 * In case of not found any scale, it returns { intervals: [], aliases: [] }
 *
 * @function
 * @param {string|Array<string>} source
 * @return {object} the scale object
 */
export function getScale(source) {
  index = index || buildIndex();
  const scale = Array.isArray(source) ? index[chroma(source)] : index[source];
  return scale || NO_SCALE;
}
