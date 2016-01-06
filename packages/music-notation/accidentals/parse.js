'use strict'

var R = /^(#{1,}|b{1,}|x{1,}|)$/

/**
 * Given an accidentals string returns its alteration number
 *
 * @param {String} accidentals - the accidentals string
 * @param {boolean} skipValidation - true to skip validation
 */
module.exports = function (str, skip) {
  if (!skip && !R.exec(str)) return null
  var alt = str.replace(/x/g, '##').length
  return str[0] === '#' ? alt : -alt
}
