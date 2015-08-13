var parse = require('./parse')

function quality (interval) {
  return parse(interval)[0]
}
module.exports = quality
