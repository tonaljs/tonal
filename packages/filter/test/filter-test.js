var test = require('tape')
var filter = require('../')

test('scaleFilter', function (t) {
  t.deepEqual(filter.scaleFilter('C D E', 60), 'C4')
  t.deepEqual(filter.scaleFilter('C D E', 'C4'), 'C4')
  t.deepEqual(filter.scaleFilter('C D E', 'B#2'), 'C3')
  var aMajor = filter.scaleFilter('A C# E')
  t.deepEqual([69, 70, 71, 72, 73].map(aMajor),
    [ 'A4', null, null, null, 'C#5' ])

  t.deepEqual(['C2', 'D3', 'E4', 'F2', 'G1'].map(aMajor),
    [ null, null, 'E4', null, null ])
  t.end()
})
