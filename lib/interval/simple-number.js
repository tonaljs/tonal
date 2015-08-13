var number = require('./number')

function simpleNumber (interval) {
  var num = number(interval)
  while (num > 8) num -= 7
  return num
}
module.exports = simpleNumber
