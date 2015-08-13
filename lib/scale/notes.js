var intervals = require('./intervals')
var intervalsToNotes = require('../set/intervals-to-notes')

function notes (dictionary, tonic, scale) {
  scale = intervals(dictionary, scale)
  return intervalsToNotes(scale, tonic)
}

module.exports = notes
