/**
 * Decorate a function to return null when a exception is thrown
 *
 * The opposite of `util/strict`
 *
 * @example
 * var alwaysNull = unstrict(function () { throw Error() })
 * alwaysNull() // => null
 */
function unstrict (func) {
  return function () {
    try {
      return func.apply(this, arguments)
    } catch (e) {
      return null
    }
  }
}

module.exports = unstrict
