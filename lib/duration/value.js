'use strict'

/**
 * Given a note duration name get its [value](https://en.wikipedia.org/wiki/Note_value)
 *
 * @param {String} name - the duration name. Can be expressed with standard names
 * ('long', 'double'), with letters and dots ('q', 'q..') or number strings with
 * dots ('2.', '4..')
 * @return {Float} the duration value
 *
 * @module duration
 * @see duration/name (does exactly the opposite)
 *
 * @example
 * // You can convert from names to values:
 * value('long');          // => 4
 * value('double');         // => 2
 * value('whole');          // => 1
 * value('half');           // => 1/2
 * value('quarter');        // => 1/4
 * value('eighth');         // => 1/8
 * value('sixteenth');      // => 1/16
 * value('thirty-second');  // => 1/32
 *
 * // From letter and dots to values:
 * value('h');   // => 1/2
 * value('h.');  // => dot: 1/2 + 1/4
 * value('h..'); // => double dot: 1/2 + 1/4 + 1/8
 * value('ht');  // => triplet: (1/2 + 1/ 2) / 3
 * value('q');   // => 1/4
 * value('q.');  // => dot: 1/4 + 1/8
 * value('q..'); // => double dot: 1/4 + 1/8 + 1/16
 * value('qt');  // => triplet: (1/4 + 1/4) / 3
 *
 * // From number string to value:
 * value('2');   // => 1/2
 * value('2.');  // => dot: 1/2 + 1/4
 * value('2t');  // => triplet: (1/2 + 1/ 2) / 3
 * value('2..'); // => double dot: 1/2 + 1/4 + 1/8
 * value('4');   // => 1/4
 * value('4.');  // => dot: 1/4 + 1/8
 * value('4..'); // => double dot: 1/4 + 1/8 + 1/16
 * value('4t');  // => triplet: (1/4 + 1/4) / 3
 */
function value (name) {
  return namesToValues['' + name]
}

module.exports = value

/*
 * BUILD DICTIONARY
 */
var names = ['long', 'double', 'whole', 'half', 'quarter', 'eighth', 'sixteenth', 'thirty-second']
var values = [4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32]

var namesToValues = {}
for (var i = 0; i < values.length; i++) {
  var name = names[i]
  var val = values[i]
  var short = name[0]
  var num = '' + (1 / val)
  namesToValues[name] = val
  namesToValues[short] = namesToValues[num] = val
  namesToValues[short + '.'] = namesToValues[num + '.'] = val + val / 2
  namesToValues[short + '..'] = namesToValues[num + '..'] = val + val / 2 + val / 4
  namesToValues[short + 't'] = namesToValues[num + 't'] = (val + val) / 3
}
