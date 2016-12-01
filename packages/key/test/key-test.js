
var test = require('tape')
var key = require('..')

test('key: mode', function (t) {
  t.equal(key.mode('mixophrygian'), null)
  t.equal(key.mode('blah'), null)
  t.equal(key.mode(null), null)
  key.modes(true).forEach(function (m) {
    t.equal(key.mode(m), m)
  })
  t.end()
})

test('key: tonic', function (t) {
  t.equal(key.tonic('c4 mixolydian'), 'C')
  t.equal(key.tonic('mixolydian'), null)
  t.end()
})

test('key: props', function (t) {
  t.deepEqual(key.props('Eb mixolydian'), { mode: 'mixolydian', tonic: 'Eb' })
  t.deepEqual(key.props('lydian'), { mode: 'lydian', tonic: false })
  t.deepEqual(key.props('F#'), { mode: 'major', tonic: 'F#' })
  t.deepEqual(key.props('blah'), null)
  t.deepEqual(key.props('Eb blah'), null)
  t.end()
})

test('key: scale', function (t) {
  t.deepEqual(key.scale('C major'), [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ])
  t.deepEqual(key.scale('C dorian'), [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ])
  t.deepEqual(key.scale('E mixolydian'), [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ])
  t.end()
})

test('key: modes', function (t) {
  t.deepEqual(key.modes(false),
    [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ])
  t.deepEqual(key.modes(true),
    [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
      'major', 'minor' ])
  t.end()
})

test('from alter', function (t) {
  t.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(key.fromAlter),
    [ 'C major', 'G major', 'D major', 'A major', 'E major',
      'B major', 'F# major', 'C# major' ])
  t.deepEqual([-0, -1, -2, -3, -4, -5, -6, -7, -8].map(key.fromAlter),
    [ 'C major', 'F major', 'Bb major', 'Eb major', 'Ab major',
      'Db major', 'Gb major', 'Cb major', 'Fb major' ])
  t.end()
})

test('key: from accidentals', function (t) {
  t.equal(key.fromAcc('###'), 'A major')
  t.equal(key.fromAcc('bbb'), 'Eb major')
  t.end()
})

test('key: relative', function (t) {
  t.equal(key.relative('minor', 'Eb major'), 'C minor')
  t.equal(key.relative('dorian', 'Bb mixolydian'), 'F dorian')
  t.equal(key.relative('blah', 'C major'), null)

  var minor = key.relative('minor')
  t.equal(minor('C'), 'A minor')
  t.end()
})

test('key: alteration', function (t) {
  t.equal(key.alteration('A major'), 3)
  var Amaj = 'A B C# D E F# G#'.split(' ')
  var modes = key.modes(false)
  Amaj.forEach(function (tonic, i) {
    t.equal(key.alteration(tonic + ' ' + modes[i]), 3)
  })

  t.equal(key.alteration('Bb major'), -2)
  t.end()
})

test('signature', function (t) {
  t.equal(key.signature('E dorian'), '##')
  t.equal(key.signature('Eb major'), 'bbb')
  t.end()
})

test('alteredNotes', function (t) {
  t.deepEqual(key.alteredNotes('Eb major'), [ 'Bb', 'Eb', 'Ab' ])
  t.deepEqual(key.alteredNotes('A major'), [ 'F#', 'C#', 'G#' ])
  t.end()
})
