var tape = require('tape')
var p = require('..')

tape('parse note', function (test) {
  test.deepEqual(p.parseNote('Cb4'), [ 'tnl-note', [ -7, 8 ] ])
  test.end()
})

tape('parse interval', function (test) {
  test.deepEqual(p.parseIvl('10m'), [ 'tnl-ivl', 1, [ -3, 3 ] ])
  test.deepEqual(p.parseIvl('m10'), [ 'tnl-ivl', 1, [ -3, 3 ] ])
  test.deepEqual(p.parseIvl('3M'), [ 'tnl-ivl', 1, [ 4, -2 ] ])
  test.deepEqual(p.parseIvl('-3M'), [ 'tnl-ivl', -1, [ 4, -2 ] ])
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
  test.deepEqual('c db2 e#4 fx6 gbbb ab#9'.split(' ').map(id),
    [ 'C', 'Db2', 'E#4', 'F##6', 'Gbbb', null ])
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
