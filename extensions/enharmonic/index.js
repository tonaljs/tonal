/**
 * Find and simplify enharmonic notes.
 * 
 * @example
 * var enharmonics = require('tonal-enharmonics')
 * enharmonics.find('C#4') // => ['B##3', 'C#4' 'Db4']
 * enharmonics.simplify('B#3') // => 'C4'
 *
 * @module enharmonics
 */
import { transpose } from "tonal-transpose";

var ASC = "2d";
var DESC = "-2d";

/**
 * Find the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
 * @param {String} note - the note to get the enharmonics from
 * @return {Array} an array of notes ordered by distance to the given one
 *
 * @example
 * const enharmonics = require('tonal-enharmonics')
 * enharmonics.find('C') // => ['B#', 'C', 'Dbb']
 * enharmonics.find('A') // => ['G##', 'A', 'Bbb']
 * enharmonics.find('C#4') // => ['B##3', 'C#4' 'Db4']
 * enharmonics.find('Db') // => ['C#', 'Db', 'Ebbb'])
 */
export function find(note) {
  const below = transpose(DESC, note);
  if (below === null) return null;
  const upper = transpose(ASC, note);
  return [below, note, upper];
}

/**
 * Get a simpler enharmonic note name from a note, if exists
 *
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (if not found, return same note)
 *
 * @example
 * const enharmonics = require('tonal-enharmonics')
 * enharmonics.simplify('B#3') // => 'C4'
 */
export function simplify(note) {
  return find(note).reduce(function(simple, next) {
    if (!simple) return next;
    return simple.length > next.length ? next : simple;
  }, null);
}
