var transpose = require('../note/transpose')

/**
 * Given a root and a set return a note set (an array of notes)
 */
function noteSet (intervals, root) {
  return intervals.map(function (interval) {
    return transpose(interval, root)
  })
}

module.exports = noteSet
