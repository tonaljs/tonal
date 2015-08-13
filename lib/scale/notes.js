var intervals = require('./intervals')
var intervalsToNotes = require('../set/intervals-to-notes')

function notes (dictionary, tonic, scale) {
  scale = intervals(dictionary, scale)
  console.log(scale, tonic)
  return intervalsToNotes(scale, tonic)
}

module.exports = notes
