var test = require('tape')
var _ = require('../')

test('harmonizer: harmonics', function (t) {
  t.deepEqual(_.harmonics('C E G'), [ '1P', '3M', '5P' ])
  t.deepEqual(_.harmonics('C2 E3 G4'), [ '1P', '10M', '19P' ])
  t.deepEqual(_.harmonics('x y z'), [])
  t.end()
})

test('harmonizer: distances', function (t) {
  t.deepEqual(_.distances('c e g'), [ '3M', '3m' ])
  t.deepEqual(_.distances('e g c'), [ '3m', '4P' ])
  t.deepEqual(_.distances('C2 g4 c4'), [ '19P', '-5P' ])
  t.end()
})

test('harmonizer: harmonize', function (t) {
  t.deepEqual(_.harmonize('1P 3M 5P', 'A4'), [ 'A4', 'C#5', 'E5' ])
  t.deepEqual(_.harmonize('C E G', 'M3'), [ 'E', 'G#', 'B' ])

  t.deepEqual(_.harmonize('C blah D', '7m'), [ 'Bb', 'C' ])
  t.deepEqual(_.harmonize(null, '7m'), [])
  t.deepEqual(_.harmonize('c d e', null), [ 'C', 'D', 'E' ])

  var maj7 = _.harmonize('1P 3M 5P 7M')
  t.deepEqual(maj7('Bb'), [ 'Bb', 'D', 'F', 'A' ])
  t.end()
})
