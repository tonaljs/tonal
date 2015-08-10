
var midi = require('./midi')

function freq (note, tuning) {
  tuning = tuning || 440
  return Math.pow(2, (midi(note) - 69) / 12) * tuning
}

module.exports = freq
