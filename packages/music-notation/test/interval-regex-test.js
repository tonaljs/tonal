/* global describe it */
var assert = require('assert')
var R = require('../interval/regex')
function exec (n) { return R.exec(n).slice(0, 9) }

describe('music-notation/interval-regex', function () {
  it('parses tonal style', function () {
    assert.deepEqual(exec('-3M'), ['-3M', '-3M', '-', '3', 'M', null, null, null, null])
    assert.deepEqual(exec('-3m'), ['-3m', '-3m', '-', '3', 'm', null, null, null, null])
  })

  it('parses strict style', function () {
    assert.deepEqual(exec('M-3'), ['M-3', null, null, null, null, 'M-3', 'M', '-', '3'])
  })
})
