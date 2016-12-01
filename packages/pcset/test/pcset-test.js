var test = require('tape')
var pcset = require('..')

test('pcset: notes', function (t) {
  t.deepEqual(pcset.notes('g4 f5 g3 d3 a3 a4 c6 a1'),
    [ 'G', 'A', 'C', 'D', 'F' ])
  t.end()
})

test('pcset: chroma', function (t) {
  t.equal(pcset.chroma('c d e'), '101010000000')
  t.equal(pcset.chroma('g g#4 a bb5'), '000000011110')
  t.equal(pcset.chroma('P1 M2 M3 P4 P5 M6 M7'),
    pcset.chroma('c d e f g a b'))
  t.equal(pcset.chroma('101010101010'), '101010101010')
  t.end()
})

test('pcset: fromChroma', function (t) {
  t.deepEqual(pcset.fromChroma('101010101010', 'C'),
    [ 'C', 'D', 'E', 'Gb', 'Ab', 'Bb' ])
  t.deepEqual(pcset.fromChroma('101010101010', null),
    [ '1P', '2M', '3M', '5d', '6m', '7m' ])
  t.end()
})

test('pcset: modes', function (t) {
  // TODO: fixme, the 4th mode should have F# instead of Gb
  t.deepEqual(pcset.chromaModes('c d e f g a b').map(function (chroma, i) {
    return pcset.fromChroma(chroma, 'C')
  }), [ [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ],
      [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ],
      [ 'C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb' ],
      [ 'C', 'D', 'E', 'Gb', 'G', 'A', 'B' ],
      [ 'C', 'D', 'E', 'F', 'G', 'A', 'Bb' ],
      [ 'C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb' ],
      [ 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb' ] ])
  t.end()
})

test('pcset: isChroma', function (t) {
  t.equal(pcset.isChroma('101010101010'), true)
  t.equal(pcset.isChroma('1010101'), false)
  t.equal(pcset.isChroma('blah'), false)
  t.equal(pcset.isChroma('c d e'), false)
  t.end()
})

test('pcset: subset', function (t) {
  t.equal(pcset.subset('c4 d5 e6', 'c2 d3'), true)
  t.equal(pcset.subset('c4 d5 e6', 'c2 d3 e5'), true)
  t.equal(pcset.subset('c d e', 'c d e f'), false)
  t.equal(pcset.subset('c d e', 'c2 d3 f6'), false)
  t.end()
})

test('pcset: superset', function (t) {
  t.equal(pcset.superset('c d e', 'c2 d3 e4 f5'), true)
  t.equal(pcset.superset('c d e', 'e f g'), false)
  t.equal(pcset.superset('c d e', 'd e'), false)
  t.end()
})

test('pcset: equal', function (t) {
  t.ok(pcset.equal('c2 d3 e7 f5', 'c4 c d5 e6 f1'))
  t.end()
})

test('pcset: includes', function (t) {
  t.equal(pcset.includes('c d e', 'C4'), true)
  t.equal(pcset.includes('c d e', 'C#4'), false)
  t.end()
})

test('pcset: filter', function (t) {
  t.deepEqual(pcset.filter('c d e', 'c2 c#2 d2 c3 c#3 d3'),
    [ 'c2', 'd2', 'c3', 'd3' ])
  t.end()
})

test('pcset: chromaModes', function (t) {
  t.deepEqual(pcset.chromaModes('c d e f g a b'),
    [ '101011010101', '101101010110', '110101011010', '101010110101',
      '101011010110', '101101011010', '110101101010' ])
  t.deepEqual(pcset.chromaModes('c d e f g a b', false),
    [ '101011010101', '010110101011', '101101010110', '011010101101',
      '110101011010', '101010110101', '010101101011', '101011010110',
      '010110101101', '101101011010', '011010110101', '110101101010' ])
  t.deepEqual(pcset.chromaModes('blah bleh'), [])
  t.end()
})
