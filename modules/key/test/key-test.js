
var test = require('tape')
var key = require('..')

test('isKeyMode', function (t) {
  key.names(true).forEach(function (m) {
    t.ok(key.isKeyMode(m), m)
  })
  t.equal(key.isKeyMode('blah'), false)
  t.equal(key.isKeyMode(null), false)
  t.end()
})

test('names', function (t) {
  t.deepEqual(key.names(false),
    [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian' ])
  t.deepEqual(key.names(true),
    [ 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
      'major', 'minor' ])
  t.end()
})

test('build', function (t) {
  t.deepEqual(key.build('C3', 'mixolydian'),
    ['mixolydian', 'C'])
  t.deepEqual(key.build(null, 'phrygian'),
    ['phrygian', false])
  t.deepEqual(key.build('blah', 'major'), null)
  t.deepEqual(key.build('C', 'blah'), null)
  t.end()
})

test('from alter', function (t) {
  t.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(key.fromAlter),
    [ [ 'major', 'C' ], [ 'major', 'G' ], [ 'major', 'D' ], [ 'major', 'A' ],
      [ 'major', 'E' ], [ 'major', 'B' ], [ 'major', 'F#' ], [ 'major', 'C#' ] ])
  t.deepEqual([-0, -1, -2, -3, -4, -5, -6, -7, -8].map(key.fromAlter),
    [ [ 'major', 'C' ], [ 'major', 'F' ], [ 'major', 'Bb' ], [ 'major', 'Eb' ],
      [ 'major', 'Ab' ], [ 'major', 'Db' ], [ 'major', 'Gb' ], [ 'major', 'Cb' ],
      [ 'major', 'Fb' ] ])
  t.end()
})

test('from accidentals', function (t) {
  t.deepEqual(key.fromAcc('###'), [ 'major', 'A' ])
  t.deepEqual(key.fromAcc('bbb'), [ 'major', 'Eb' ])
  t.end()
})

test('from name', function (t) {
  t.deepEqual(key.fromName('Eb mixolydian'), [ 'mixolydian', 'Eb' ])
  t.deepEqual(key.fromName('lydian'), [ 'lydian', false ])
  t.deepEqual(key.fromName('F#'), [ 'major', 'F#' ])
  t.equal(key.fromName('blah'), null)
  t.equal(key.fromName('Eb blah'), null)
  t.end()
})

test('asKey', function (t) {
  t.deepEqual(key.asKey('C minor'), ['minor', 'C'])
  t.equal(key.asKey('blah'), null)
  t.end()
})

test('relative', function (t) {
  t.deepEqual(key.relative('minor', 'Eb major'), ['minor', 'C'])
  t.deepEqual(key.relative('dorian', 'Bb mixolydian'), ['dorian', 'F'])
  t.equal(key.relative('blah', 'C major'), null)

  var minor = key.relative('minor')
  t.deepEqual(minor('C'), [ 'minor', 'A' ])
  t.end()
})

test('alteration', function (t) {
  t.equal(key.alteration('A major'), 3)
  var Amaj = 'A B C# D E F# G#'.split(' ')
  var modes = key.names(false)
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
