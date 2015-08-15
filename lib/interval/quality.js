var parse = require('./parse')

function quality (interval) {
  return parse(interval).q
}
module.exports = quality
