'use strict'

/**
 * Create a list from a string or array
 *
 * @param {Array|String} list - the list
 * @param {Function} parser - (Optional) a item parser
 * @return {Array} an array with the elements of the list (parsed if parser given)
 *
 * @api private
 */
function list (list, parser) {
  if (typeof list === 'string') list = list.split(' ')
  if (!Array.isArray(list)) return null
  if (!parser) return list

  var item
  var result = []
  for (var i = 0, len = list.length; i < len; i++) {
    item = parser(list[i])
    if (!item) return null
    result.push(item)
  }
  return result
}

module.exports = list
