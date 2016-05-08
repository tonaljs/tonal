var tape = require('tape')
var p = require('..')

tape('get fifths from pitch object', function (test) {
  test.equal(p.fifths(p.parseIvl('2M')), 2)
  test.equal(p.fifths(p.parseIvl('-2M')), -2)
  test.end()
})

tape('get focts from pitch object', function (test) {
  test.equal(p.focts(p.parseIvl('2M')), -1)
  test.equal(p.focts(p.parseIvl('-2M')), 1)
  test.end()
})

tape('get dir from pitch object', function (test) {
  test.equal(p.dir(p.parseIvl('2M')), 1)
  test.equal(p.dir(p.parseIvl('-2M')), -1)
  test.equal(p.dir(p.parseNote('C4')), 1)
  test.equal(p.dir(p.parseNote('C-1')), 1)
  test.end()
})

tape('get chroma from a pitch object', function (test) {
  test.deepEqual('Cb C Db D Eb E Fb F Gb G Ab A Bb B'.split(' ').map(p.parseNote).map(p.chr),
    [ 11, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 11 ])
  test.deepEqual('P1 M2 M3 P4 P5 M6 M7'.split(' ').map(p.parseIvl).map(p.chr),
    [ 0, 2, 4, 5, 7, 9, 11 ])
  test.deepEqual('-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(p.parseIvl).map(p.chr),
    [ 0, 10, 8, 7, 5, 3, 1 ])
  test.end()
})

tape('parse note', function (test) {
  test.deepEqual(p.parseNote('Cb4'), [ 'tnlp', [ -7, 8 ] ])
  test.end()
})

tape('parse interval', function (test) {
  test.deepEqual(p.parseIvl('10m'), [ 'tnlp', [ -3, 3 ], 1 ])
  test.deepEqual(p.parseIvl('m10'), [ 'tnlp', [ -3, 3 ], 1 ])
  test.deepEqual(p.parseIvl('3M'), [ 'tnlp', [ 4, -2 ], 1 ])
  test.deepEqual(p.parseIvl('-3M'), [ 'tnlp', [ 4, -2 ], -1 ])
  test.end()
})

tape('parse pitch', function (test) {
  test.deepEqual(p.parsePitch('Cb4'), p.parseNote('Cb4'))
  test.deepEqual(p.parsePitch('A11'), p.parseNote('A11'))
  test.deepEqual(p.parsePitch('11A'), p.parseIvl('A11'))
  test.end()
})

tape('note to string', function (test) {
  function id (n) { return p.strNote(p.parseNote(n)) }
  test.deepEqual('a c db2 e#4 fx6 gbbb ab#9'.split(' ').map(id),
    [ 'A', 'C', 'Db2', 'E#4', 'F##6', 'Gbbb', null ])
  test.end()
})

tape('interval to string', function (test) {
  function id (i) { return p.strIvl(p.parseIvl(i)) }
  test.deepEqual('1P 2M 3M 4P 5P 6M 7M'.split(' ').map(id),
    [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
  test.deepEqual('1d 2m 3m 4d 5d 6m 7m'.split(' ').map(id),
    [ '1d', '2m', '3m', '4d', '5d', '6m', '7m' ])
  test.deepEqual('8A 9A 10A 11A 12A 13A 14A'.split(' ').map(id),
    [ '8A', '9A', '10A', '11A', '12A', '13A', '14A' ])
  test.deepEqual('-1P -2M -3M -4P -5P -6M -7M'.split(' ').map(id),
    [ '-1P', '-2M', '-3M', '-4P', '-5P', '-6M', '-7M' ])
  test.deepEqual('-8d -9m -10m -11d -12d -13m -14m'.split(' ').map(id),
    [ '-8d', '-9m', '-10m', '-11d', '-12d', '-13m', '-14m' ])
  test.end()
})
