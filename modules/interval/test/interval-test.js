var tape = require('tape')
var ivl = require('..')

function map (fn, arr) {
  return (Array.isArray(arr) ? arr : arr.split(' ')).map(fn)
}

tape('get interval names', function (test) {
  test.deepEqual(map(ivl.ivlName, '1P 2M m3 P-4 5 blah'),
    [ '1P', '2M', '3m', '-4P', null, null ])
  test.end()
})

tape('get semitones of intervals', function (test) {
  test.deepEqual(map(ivl.semitones, '1P 2M 3M 4P 5P 6M 7M'),
    [ 0, 2, 4, 5, 7, 9, 11 ])
  test.deepEqual(map(ivl.semitones, '8P 9M 10M 11P 12P 13M 14M'),
    [ 12, 14, 16, 17, 19, 21, 23 ])
  test.deepEqual(map(ivl.semitones, '8d 9m 10m 11d 12d 13m 14m'),
    [ 11, 13, 15, 16, 18, 20, 22 ])
  test.deepEqual(map(ivl.semitones, '-8P -9M -10M -11P -12P -13M -14M'),
    [ -12, -14, -16, -17, -19, -21, -23 ])
  test.end()
})

tape('get interval name from semitones', function (test) {
  test.deepEqual(map(ivl.fromSemitones, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    [ '1P', '2m', '2M', '3m', '3M', '4P', '5d', '5P', '6m', '6M', '7m', '7M' ])
  test.deepEqual(map(ivl.fromSemitones, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
    [ '8P', '9m', '9M', '10m', '10M', '11P', '12d', '12P', '13m', '13M', '14m', '14M' ])
  test.deepEqual(map(ivl.fromSemitones, [-0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]),
    [ '1P', '-2m', '-2M', '-3m', '-3M', '-4P', '-5d', '-5P', '-6m', '-6M', '-7m', '-7M' ])
  test.deepEqual(map(ivl.fromSemitones, [-12, -13, -14, -15, -16, -17, -18, -19, -20, -21, -22, -23]),
    [ '-8P', '-9m', '-9M', '-10m', '-10M', '-11P', '-12d', '-12P', '-13m', '-13M', '-14m', '-14M' ])
  test.end()
})

tape('get interval class', function (test) {
  test.deepEqual(map(ivl.ic, '1P 2M 3M 4P 5P 6M 7M 8P'),
    [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  test.deepEqual(map(ivl.ic, '1d 2m 3m 4d 5d 6m 7m 8d'),
    [ 1, 1, 3, 4, 6, 4, 2, 1 ])
  test.deepEqual(map(ivl.ic, '8P 9M 10M 11P 12P 13M 14M 15P'),
    [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  test.deepEqual(map(ivl.ic, '-1P -2M -3M -4P -5P -6M -7M -8P'),
    [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  // from semitones
  test.deepEqual(map(ivl.ic, [0, 2, 4, 5, 7, 9, 11, 12]),
    [ 0, 2, 4, 5, 5, 3, 1, 0 ])
  test.equal(ivl.ic('blah'), null)
  test.end()
})

tape('interval types', function (test) {
  test.deepEqual(map(ivl.itype, '1P 2M 3M 4P 5P 6M 7M'),
    [ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
  test.deepEqual(map(ivl.itype, '8d 9m 10m 11d 12d 13m 14m'),
    [ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
  test.deepEqual(map(ivl.itype, '-15A -16A -17A -18A -19A -20A -21A'),
    [ 'P', 'M', 'M', 'P', 'P', 'M', 'M' ])
  test.end()
})

tape('simplify intervals', function (test) {
  test.deepEqual(map(ivl.simplify, '1P 2M 3M 4P 5P 6M 7M'),
    [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  test.deepEqual(map(ivl.simplify, '8P 9M 10M 11P 12P 13M 14M'),
    [ '8P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  test.deepEqual(map(ivl.simplify, '1d 1P 1A 8d 8P 8A 15d 15P 15A'),
    [ '1d', '1P', '1A', '8d', '8P', '8A', '1d', '1P', '1A' ])
  test.deepEqual(map(ivl.simplify, '-1P -2M -3M -4P -5P -6M -7M'),
    [ '-1P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
  test.deepEqual(map(ivl.simplify, '-8P -9M -10M -11P -12P -13M -14M'),
    [ '-8P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
  test.end()
})

tape('invert intervals', function (test) {
  test.deepEqual(map(ivl.invert, '1P 2M 3M 4P 5P 6M 7M'),
    [ '1P', '7m', '6m', '5P', '4P', '3m', '2m' ])
  test.deepEqual(map(ivl.invert, '1d 2m 3m 4d 5d 6m 7m'),
    [ '1A', '7M', '6M', '5A', '4A', '3M', '2M' ])
  test.deepEqual(map(ivl.invert, '1A 2A 3A 4A 5A 6A 7A'),
    [ '1d', '7d', '6d', '5d', '4d', '3d', '2d' ])
  test.deepEqual(map(ivl.invert, '-1P -2M -3M -4P -5P -6M -7M'),
    [ '-1P', '-7m', '-6m', '-5P', '-4P', '-3m', '-2m' ])
  test.deepEqual(map(ivl.invert, '8P 9M 10M 11P 12P 13M 14M'),
    [ '8P', '14m', '13m', '12P', '11P', '10m', '9m' ])
  test.end()
})
