/**
 * Decorate a function to throw exception when return null
 *
 * @example
 * var parse = require('tonal/note/parse')
 * var strictParse = strict('Not a valid note', parse)
 * strictParse('P8') // throws Error with msg 'Not a valid note'
 */
function strict (msg, func) {
  return function () {
    var r = func.apply(this, arguments)
    if (r === null) throw Error(msg + ': ' + arguments[0])
    return r
  }
}

module.exports = strict
