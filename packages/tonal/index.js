
function T () {}

T.notation = require('array-notation')
T.note = T.notation.note
T.interval = T.notation.interval
T.roman = T.notation.roman
T.pitch = T.notation.pitch
T.transpose = require('note-transpose')
T.note.transpose = T.transpose
T.note.interval = require('note-interval')

T.midi = T.note.midi = require('note-midi')

module.exports = T
