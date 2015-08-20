var vows = require('vows')
var assert = require('assert')
var reverse = require('../../lib/list/reverse')

vows.describe('list/reverse').addBatch({
  'reverse strings': function () {
    assert.deepEqual(reverse('C D E'), ['E', 'D', 'C'])
    assert.deepEqual(reverse('P1 P4 P5'), ['P5', 'P4', 'P1'])
  },
  'reverse arrays': function () {
    var notes = 'A B C'.split(' ')
    assert.deepEqual(reverse(notes), ['C', 'B', 'A'])
    assert.deepEqual(notes, ['A', 'B', 'C'])
  },
  'reverse binary': function () {
    assert.deepEqual(reverse(2773), ['M7', 'M6', 'P5', 'P4', 'M3', 'M2', 'P1'])
  }
}).export(module)
