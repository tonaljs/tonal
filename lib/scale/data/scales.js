'use strict'

var data = require('./intervals.json')
var aliases = require('./aliases.json')

// Return a hash with the scale intervals with aliases
module.exports = withAlias(data, aliases)

function withAlias (data, aliases) {
  var result = {}
  Object.keys(data).forEach(function (name) { result[name] = data[name] })
  Object.keys(aliases).forEach(function (name) { result[name] = result[aliases[name]] })
  return result
}
