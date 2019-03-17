import data from "./scale-data";
import { chroma } from "../pcset";

/**
 * A dictionary of musical scales.
 *
 * This is a low level module. Probably you should use Tonal.Scale that
 * includes this module and more functionallities.
 *
 * Each musical scale is represented by an object with:
 * - {string} - name: the main name
 * - {array<string>} - names: all known names (including the main name)
 * - {array<string>} - intervals
 * - {string} - chroma: the pitchclass set chroma
 * - {integer} - setnum: the pitchclass set chroma number in decimal
 *
 * @example
 * import ScaleDictionary from "tonal/scale-dictionary"
 *
 * ScaleDictionary.all() // => [{ name: aeolian, .... }, ]
 * ScaleDictionary.find("major") // => {
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
export default { all, find };

let cached;

const toScale = data => {
  const intervals = data[0].split(" ");
  const name = data[1];
  const names = data.slice(1);
  const scale = { name, intervals, names };
  scale.chroma = chroma(intervals);
  scale.setnum = parseInt(scale.chroma, 2);
  return Object.freeze(scale);
};
const byName = (a, b) => a.name.localeCompare(b.name);

/**
 * Return a list of all available scales
 *
 * @return {array<object>} array of scales
 */
export function all() {
  return cached || (cached = data.map(toScale).sort(byName));
}

const NO_SCALE = Object.freeze({ intervals: [], names: [] });

/**
 * Find a scale with the given query
 *
 * The query can include: name, intervals, chroma or setnum
 *
 * @param {*} props
 */
export function find(props) {
  if (typeof props === "string") props = { name: props, chroma: props };
  else if (Array.isArray(props)) props = { intervals: props };
  else if (typeof props === "number") props = { setnum: props };
  if (props.intervals) props.chroma = chroma(props.intervals);

  const predicate = scale =>
    (props.name && scale.names.indexOf(props.name) !== -1) ||
    (props.chroma && props.chroma === scale.chroma) ||
    (props.setnum && props.setnum === scale.setnum);
  return all().find(predicate) || NO_SCALE;
}
