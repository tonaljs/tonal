var test = require('tape')
var dft = require('..')

test('dft: pcset', function (t) {
  t.deepEqual(dft.pcset('C4 E4 G#4'), [ '0', '4', '8' ])
  t.end()
})

test('dft: components', function (t) {
  t.deepEqual(dft.dft('C4 E4 G#4'),
    [ [ 3, 0 ], [ 0, 0 ], [ 0, 0 ], [ 3, 0 ], [ 0, 0 ], [ 0, 0 ], [ 3, 0 ] ])
  t.end()
})
test('dft: spectra', function (t) {
  t.deepEqual(dft.spectra('C4 E4 G#4'), [ 3, 0, 0, 3, 0, 0, 3 ])
  t.end()
})
