var vows = require('vows')
var assert = require('assert')
var name = require('../../lib/time/duration-name')

vows.describe('time').addBatch({
  'null as parameter': function () {
    assert.equal(name(null), null)
  },
  'toString': function () {
    assert.equal(name(4), 'l')
    assert.equal(name(4 + 2), 'l.')
    assert.equal(name(4 + 2 + 1), 'l..')
    assert.equal(name(2), 'd')
    assert.equal(name(2 + 1), 'd.')
    assert.equal(name(2 + 1 + 1 / 2), 'd..')
    assert.equal(name(1), 'w')
    assert.equal(name(1 + 1 / 2), 'w.')
    assert.equal(name(1 + 1 / 2 + 1 / 4), 'w..')
    assert.equal(name(1 / 2), 'h')
    assert.equal(name(1 / 2 + 1 / 4), 'h.')
    assert.equal(name(1 / 2 + 1 / 4 + 1 / 8), 'h..')
    assert.equal(name(1 / 4), 'q')
    assert.equal(name(1 / 4 + 1 / 8), 'q.')
    assert.equal(name(1 / 4 + 1 / 8 + 1 / 16), 'q..')
    assert.equal(name(1 / 8), 'e')
    assert.equal(name(1 / 8 + 1 / 16), 'e.')
    assert.equal(name(1 / 8 + 1 / 16 + 1 / 32), 'e..')
    assert.equal(name(1 / 16), 's')
    assert.equal(name(1 / 16 + 1 / 32), 's.')
    assert.equal(name(1 / 16 + 1 / 32 + 1 / 64), 's..')
  }
}).export(module)
