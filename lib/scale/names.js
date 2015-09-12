'use strict'

var scales = require('./scales.json')
var aliases = require('./aliases.json')
var names

module.exports = function () {
  if (!names) {
    names = Object.keys(scales).concat(Object.keys(aliases))
  }
  return names
}
