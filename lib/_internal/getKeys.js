'use strict'

// given a list a keys and data hash return
module.exports = function (keys, data) {
  var allNames = Object.keys(data)
  return function filterKeys (filter, noAlias) {
    if (arguments.length === 1) {
      return typeof filter === 'function' ? filterKeys(filter, false) : filterKeys(null, filter)
    }
    var list = [].concat(noAlias ? keys : allNames)
    return !filter ? list : list.filter(function (name) {
      return filter(data[name])
    })
  }
}
