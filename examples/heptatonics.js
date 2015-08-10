var Tonal = require('../')

var hepta = Tonal.Scale.all().filter(function (scale) {
  return scale.length === 7
})

var allModes = []
hepta.forEach(function (scale) {
  if (allModes.indexOf(scale.rootMode) === -1) {
    allModes.push(scale.rootMode)
  }
})
var modes = []
var correct = hepta.filter(function (scale) {
  var spell = scale.spell()
  for (var i = 1; i < 8; i++) {
    if (spell[i - 1][1] !== '' + i) return false
  }
  if (modes.indexOf(scale.rootMode) === -1) {
    modes.push(scale.rootMode)
  }
  return true
})
console.log('Hepta: ', hepta.length)
console.log('Spelled: ', correct.length)
console.log('Spelled', correct.map(function (s) {
  return [s.decimal, s.spell(), s.binary, s.names()[0]].join('|')
}))
console.log('Modes', modes.sort(), modes.length)
console.log('All modes', allModes.length)
