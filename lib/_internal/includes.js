'use strict'

module.exports = function (array, searchElement) {
  var O = Object(array)
  var len = parseInt(O.length, 10) || 0
  if (len === 0) {
    return false
  }
  var n = parseInt(arguments[2], 10) || 0
  var k
  if (n >= 0) {
    k = n
  } else {
    k = len + n
    if (k < 0) k = 0
  }
  var currentElement
  while (k < len) {
    currentElement = O[k]
    if (searchElement === currentElement) {
      return true
    }
    k++
  }
  return false
}
