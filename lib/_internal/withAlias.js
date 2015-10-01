'use strict'

// Add alias to a hash
module.exports = function (data, aliases) {
  var result = {}
  Object.keys(data).forEach(function (name) { result[name] = data[name].split(' ') })
  Object.keys(aliases).forEach(function (name) { result[name] = result[aliases[name]] })
  return result
}
