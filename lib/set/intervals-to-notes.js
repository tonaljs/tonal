var transpose = require('../note/transpose')

/**
 * Convert an interval set to notes set with the given note as root
 */
function intervalToNotes (intervals, root) {
  return intervals.map(function (interval) {
    return transpose(interval, root)
  })
}

module.exports = intervalToNotes
