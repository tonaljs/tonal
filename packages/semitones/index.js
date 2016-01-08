var pitch = require('music-notation/pitch')

module.exports = pitch(function (p) {
  if (!p) return null
  var f = p[0] * 7
  var o = p[1] || p[1] === 0 ? p[1] : -Math.floor(f / 12)
  return f + o * 12
})
