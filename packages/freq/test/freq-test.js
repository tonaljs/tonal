var test = require('tape')
var freq = require('..')

test('note name to frequency', function (t) {
  t.equal(freq.toFreq('A4'), 440)
  t.equal(freq.toFreq('C4'), 261.63)
  t.equal(freq.toFreq('blah'), null)
  t.end()
})

test('midi number to frequency', function (t) {
  t.equal(freq.toFreq(69), freq.toFreq('A4'))
  t.equal(freq.toFreq(60), freq.toFreq('C4'))
  t.end()
})

test('freq: eqTempFreqToMidi', function (t) {
  t.equal(freq.eqTempFreqToMidi(440, 2, 440), 69)
  t.equal(freq.eqTempFreqToMidi(444, 2, 440), 68.84)
  t.equal(freq.eqTempFreqToMidi(444, 4, 440), 68.8433)
  t.equal(freq.eqTempFreqToMidi(440, 4, 255), 59.5559)
  t.equal(freq.eqTempFreqToMidi(440, 0, 255), 60)
  t.end()
})

test('freq: toMidi', function (t) {
  t.equal(freq.toMidi(220), 57)
  t.equal(freq.toMidi(261.62), 60)
  t.equal(freq.toMidi(261), 59.96)
  t.end()
})

test('note name from frequency', function (t) {
  t.equal(freq.note(261), 'C4')
  t.equal(freq.note(275), 'Db4')
  t.equal(freq.note(275, true), 'C#4')
  t.end()
})

test('get distance in cents', function (t) {
  t.equal(freq.cents(261, 'C4'), 4)
  t.equal(freq.cents('C4', 261), -4)
  t.end()
})

test('freq: eqTempFreq', function (t) {
  t.equal(freq.eqTempFreq(444, 4, 'C6'), 1056.0159)
  t.equal(freq.eqTempFreq(444, 3, 'C6'), 1056.016)
  t.deepEqual('c4 d4 e4 f4 g4 a4 b4'.split(' ').map(freq.eqTempFreq(440, 1)),
    [ 261.6, 293.7, 329.6, 349.2, 392, 440, 493.9 ])
  t.deepEqual('c4 d4 e4 f4 g4 a4 b4'.split(' ').map(freq.eqTempFreq(440, 2)),
    [ 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88 ])
  t.end()
})
