var Tonal = require('../')
var intervals = require('../test/scale-intervals.json')

var groups = { perfect5: [], dimished5: [], augmented5: [], no5: [] }
Object.keys(intervals).forEach(function (name) {
  var spell = intervals[name]
  if (/P5/.test(spell)) groups.perfect5.push(name)
  else if (/d5/.test(spell)) groups.dimished5.push(name)
  else if (/A5/.test(spell)) groups.augmented5.push(name)
  else groups.no5.push(name)
})
var scaleSpell = require('../scale-spell.js')

function diff (name, expected, actual) {
  var diff = []
  for (var i = 0; i < expected.length; i += 3) {
    if (expected[i] !== actual[i] || expected[i + 1] !== actual[i + 1]) {
      diff.push(expected[i] + expected[i + 1])
      diff.push('(' + actual[i] + actual[i + 1] + ')')
    }
  }
  return [name, expected, actual, diff.join('')].join(' | ')
}

function testSpell (base) {
  console.log('------', base)
  scaleSpell.INTERVALS = base
  var correctCount = 0
  Object.keys(groups).forEach(function (groupName) {
    var group = groups[groupName]
    var incorrect = []
    group.forEach(function (name) {
      var spell = Tonal.scale(name).spell().join(',') // .spell().join(',')
      if (spell !== intervals[name]) {
        incorrect.push(diff(name, intervals[name], spell))
      }
    })
    console.log(groupName.toUpperCase(), group.length - incorrect.length, '/', group.length)
    correctCount += group.length - incorrect.length
    console.log(incorrect)
  })
  console.log('Total', correctCount)
}

testSpell(['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'd5', 'P5', 'm6', 'M6', 'm7', 'M7'])
