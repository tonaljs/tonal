
/**
 * Given a hash, return a function that find a key by its value
 */
module.exports = function findByValue (hash) {
  var keys
  return function (value) {
    keys = keys || Object.keys(hash)
    for (var i = 0, len = keys.length; i < len; i++) {
      if (hash[keys[i]] === value) return keys[i]
    }
    return null
  }
}
