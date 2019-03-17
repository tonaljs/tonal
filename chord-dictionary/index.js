import data from "./chord-data";
import { chroma } from "../pc-set";

/**
 * A dictionary of musical chords.
 *
 * This is a low level module. Probably you should use Tonal.Chord that
 * includes this module and more functionallities.
 *
 * Each musical chord is represented by an object with:
 * - {string} - name: the main name
 * - {array<string>} - names: all known names (including the main name)
 * - {array<string>} - intervals
 * - {string} - chroma: the pitchclass set chroma
 * - {integer} - setnum: the pitchclass set chroma number in decimal
 *
 * @example
 * import ChordDictionary from "tonal/chord-dictionary"
 *
 * ChordDictionary.all() // => [{ name: aeolian, .... }, ]
 * ChordDictionary.find("major") // => {
 * }
 *
 * @example
 * // CommonJS modules (require, node.js)
 * const { ChordDictionary } = require("tonal")
 *
 * @module ChordDictionary
 */
export default { all, find };

let cached;

const toChord = data => {
  const intervals = data[0].split(" ");
  const name = data[1];
  const abbreviatures = data[2].split(" ");
  const chord = { name, intervals, abbreviatures };
  chord.chroma = chroma(intervals);
  chord.setnum = parseInt(chord.chroma, 2);
  return Object.freeze(chord);
};
const byName = (a, b) => (a.name || "").localeCompare(b.name);

/**
 * Return a list of all available chords
 *
 * @return {array<object>} array of chords
 */
export function all() {
  return cached || (cached = data.map(toChord).sort(byName));
}

const NO_SCALE = Object.freeze({ intervals: [], names: [] });
const isString = s => typeof s === "string";

/**
 * Find a chord with the given query
 *
 * The query can include: name, intervals, chroma or setnum
 *
 * @param {*} props
 */
export function find(props) {
  if (!props && props !== "") return NO_SCALE;

  if (isString(props))
    props = { name: props, abbreviature: props, chroma: props };
  else if (Array.isArray(props)) props = { intervals: props };
  else if (typeof props === "number") props = { setnum: props };

  if (props.intervals) props.chroma = chroma(props.intervals);

  const predicate = chord =>
    (isString(props.name) && props.name === chord.name) ||
    (isString(props.abbreviature) &&
      chord.abbreviatures.indexOf(props.abbreviature) !== -1) ||
    (props.chroma && props.chroma === chord.chroma) ||
    (props.setnum && props.setnum === chord.setnum);
  return all().find(predicate) || NO_SCALE;
}
