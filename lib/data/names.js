
/**
 * Given a data hash, return the keys
 *
 * @param {Hash} hash - the data hash
 * @return the hash keys as array
 */
function names (data) {
  var keys = null
  return function () {
    if (!keys) keys = Object.keys(data)
    return keys
  }
}

module.exports = names
