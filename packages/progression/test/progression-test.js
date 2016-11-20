var test = require('tape')
var prog = require('..')

test('progression: concrete', function (t) {
  t.deepEqual(prog.concrete('I IIm7 V7', 'C'), ['C', 'Dm7', 'G7'])
  t.deepEqual(prog.concrete('Imaj7 2 IIIm7', 'C'), [ 'Cmaj7', null, 'Em7' ])
  t.end()
})

test('progression: abstract', function (t) {
  t.deepEqual(prog.abstract('Cmaj7 Dm7 G7', 'C'), [ 'Imaj7', 'IIm7', 'V7' ])
  t.end()
})

test('progressions: build roman chord', function (t) {
  t.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return prog.buildRoman(n) }),
    [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'I', 'II' ])
  t.equal(prog.buildRoman(2, -1), 'bIII')
  t.equal(prog.buildRoman(3, 1, 'dim'), '#IVdim')
  t.end()
})

test('progression: parseRomanChord', function (t) {
  t.deepEqual(prog.parseRomanChord('V7'), { type: '7', root: '5P' })
  t.deepEqual(prog.parseRomanChord('IIm7'), { type: 'm7', root: '2M' })
  t.end()
})

test('progression: romanRegex', function (t) {
  function exec (str) { return prog.romanRegex().exec(str).slice(0, 4) }
  var nums = 'I II III IV V VI VII'.split(' ')
  nums.forEach(function (n) {
    t.deepEqual(exec(n), [n, '', n, ''])
    var l = n.toLowerCase()
    t.deepEqual(exec(l), [l, '', l, ''])
  })

  nums.forEach(function (n) {
    '# ## b bb'.split(' ').forEach(function (alt) {
      t.deepEqual(exec(alt + n), [alt + n, alt, n, ''])
    })
  })

  t.deepEqual(exec('bVImaj7'), ['bVImaj7', 'b', 'VI', 'maj7'])
  t.deepEqual(exec('III dom'), ['III dom', '', 'III', 'dom'])
  t.end()
})
