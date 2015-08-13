var intervals = require('./intervals')
var intervalsToNotes = require('../set/intervals-to-notes')

/**
 * Get the notes of a scale
 */
function notes (tonic, scale) {
  return intervalsToNotes(intervals(scale), tonic)
}

module.exports = notes
