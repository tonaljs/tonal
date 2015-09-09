var transpose = require('../pitch/transpose')
var intervals = require('./intervals')
var toList = require('./list')

function notes (list, tonic) {
  list = toList(list)
  if (!list) return null

  if (list[0] === 'P1' || list[0] === 'P-1') {
    return list.map(transpose(tonic))
  } else {
    if (!tonic) return list
    return intervals(list).map(transpose(tonic))
  }
}

module.exports = notes
