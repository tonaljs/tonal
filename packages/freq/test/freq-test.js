var tape = require('tape')
var freq = require('..')

tape('note name to frequency', function (test) {
  test.equal(freq.toFreq('A4'), 440)
  test.equal(freq.toFreq('C4'), 261.6255653005986)
  test.end()
})

tape('midi number to frequency', function (test) {
  test.equal(freq.toFreq(69), freq.toFreq('A4'))
  test.equal(freq.toFreq(60), freq.toFreq('C4'))
  test.end()
})

tape('midi number from frequency', function (test) {
  test.equal(freq.midiFromFreq(220), 57)
  test.equal(freq.midiFromFreq(261.62), 60)
  test.end()
})

tape('note name from frequency', function (test) {
  test.equal(freq.fromFreq(261), 'C4')
  test.end()
})

tape('get distance in cents', function (test) {
  test.equal(freq.cents(261, 'C4'), 4.1444603457298985)
  test.end()
})
