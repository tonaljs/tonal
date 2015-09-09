'use strict'

var harmonizer = require('./harmonizer')
var data = require('./chords-all.json')

function chord (name) {
  return harmonizer(data[name])
}

var names = null
chord.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = chord
