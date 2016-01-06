/* global describe it */
var assert = require('assert')
var R = require('../helmholtz/regex')
function exec (n) { return R.exec(n).slice(0, 6) }

describe('music-notation/helmholtz/regex', function () {
  it('parses notes', function () {
    assert.deepEqual(exec('C'), ['C', '', 'C', '', '', ''])
    assert.deepEqual(exec('c'), ['c', '', 'c', '', '', ''])
    assert.deepEqual(exec("c'"), [ 'c\'', '', 'c', '', '\'', '' ])
    assert.deepEqual(exec("c''"), [ "c''", '', 'c', '', "''", '' ])
    assert.deepEqual(exec(',,C'), [ ',,C', ',,', 'C', '', '', '' ])
  })

  it('parses durations', function () {
    assert.deepEqual(exec(',C/4'), [',C/4', ',', 'C', '', '', '/4'])
  })
})
