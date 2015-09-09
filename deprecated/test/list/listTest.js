var vows = require('vows')
var assert = require('assert')
var list = require('../../lib/list/list')

vows.describe('list/list').addBatch({
  'simple use cases (see list/parse)': function () {
    assert.deepEqual(list('C D E'), ['C4', 'D4', 'E4'])
    assert.deepEqual(list('P-1 M-2 M-3'), ['P-1', 'M-2', 'M-3'])
  },
  'return an array': function () {
    assert.deepEqual(list(list('A B')), ['A4', 'B4'])
    assert.deepEqual(list(['notValid']), ['notValid'])
  }
}).export(module)
