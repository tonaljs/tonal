/**
 * Apply a dictionary to a function parameter
 *
 * This function decorates anotehr one by substituting a parameter with a
 * lookup into a hashmap
 *
 * @param {Hash} data - the hashmap with data
 * @param {Function} func - the function to be decorated
 * @param {Integer} position - (Optional) the argument position to be replaced.
 * It's 0 by default
 * @return {Function} the decorated function
 *
 * @module utils
 *
 * @example
 * var intervals = require('notelab/scale/intervals')
 * dictionary({ major: 2773 }, intervals)
 * intervals('major') => ['P1', 'M2', ...]
 */
 function dictionary (data, func, position) {
   position = position || 0
   return function () {
     // doesn't leak and optimizable by V8: http://stackoverflow.com/a/24011235/181850
     var args = new Array(arguments.length)
     for (var i = 0; i < args.length; ++i) {
       args[i] = arguments[i]
     }
     var value = data[args[position]]
     if (value) args[position] = value
     return func.apply(null, args)
   }
 }

 module.exports = dictionary
