var vows = require('vows')
var assert = require('assert')
var parse = require('../lib/parse-note')

vows.describe('note').addBatch({
  'parse note': function () {
    var note = parse('c#4')
    assert.equal(note.pc, 'C')
    assert.equal(note.acc, '#')
    assert.equal(note.name, 'C#4')
    assert.equal(note.oct, 4)
  },
  'default octave is 4': function () {
    assert.equal(parse('d').oct, 4)
  },
  'no accidentals is an empty string': function () {
    assert.equal(parse('c').acc, '')
  },
  'parse a note object, returns itself': function () {
    var note = parse('c')
    assert(note === parse(note))
  }
}).export(module)
