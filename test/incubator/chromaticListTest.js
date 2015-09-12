var vows = require('vows')
var assert = require('assert')
var chromatic = require('../../lib/incubator/chromaticList')

vows.describe('incubator/chromaticList').addBatch({
  'empty list': function () {
    assert.deepEqual(chromatic(0), [])
  },
  'one octave chromatic interval list': function () {
    assert.deepEqual(chromatic(1), ['1P'])
    assert.deepEqual(chromatic(12), ['1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M'])
  },
  'two octaves chromatic list': function () {
    assert.deepEqual(chromatic(13), ['1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M', '8P'])
    assert.deepEqual(chromatic(24), [
      '1P', '2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M',
      '8P', '9m', '9M', '10m', '10M', '11P', '11A', '12P', '13m', '13M', '14m', '14M'])
  }
}).export(module)
