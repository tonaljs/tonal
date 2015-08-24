var trNote = require('../interval/transpose')
var isInterval = require('../interval/isInterval')
var trInterval = require('../interval/add')
var toList = require('./list')

function transpose (interval, list) {
  list = toList(list)
  var tr = isInterval(list[0]) ? trInterval : trNote
  return list.map(tr(interval))
}

module.exports = transpose
