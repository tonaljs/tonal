'use strict'

/**
 * Create a list from a string or array
 *
 * @param {Array|String} list - the list
 * @param {Function} validator - (Optional) a function to check values
 * @return {Array} an array with the elements of the list
 *
 * @api private
 */
function list (list, validator) {
  if (typeof list === 'string') list = list.split(' ')
  if (!Array.isArray(list)) return null
  if (validator) {
    for (var i = 0, len = list.length; i < len; i++) {
      if (!validator(list[i])) return null
    }
  }
  return list
}

module.exports = list
