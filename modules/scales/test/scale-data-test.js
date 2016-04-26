/* global describe it */
var assert = require('assert')
var scales = require('..')

describe('tonal-scales', function () {
  describe('data', function () {
    it('each name has intervals', function () {
      var id = function (e) { return e }
      scales.names(true).forEach(function (name) {
        if (!Array.isArray(scales.DATA[name])) return
        var ivls = scales.scale(name, false)
        var data = scales.DATA[name]
        assert.equal(data.length, ivls.length, 'Scale data: ' + name)
      })
    })
  })
})
