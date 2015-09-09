'use strict'

var harmonizer = require('./harmonizer')
var data = require('./scales-all.json')

function scale (name) {
  return harmonizer(data[name])
}

var names = null

scale.names = function () {
  names = names || Object.keys(data)
  return names
}

module.exports = scale
