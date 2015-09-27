var vows = require('vows')
var assert = require('assert')
var extensions = require('../../lib/chord/extensions')

vows.describe('scale/extensions').addBatch({
  'all chord extensions': function () {
    assert.deepEqual(extensions('Maj7'), ['M13', 'M13#11', 'M7#11', 'M7#9#11',
      'M7add13', 'M7b9', 'M9', 'M9#11'])
    assert.deepEqual(extensions('M13'), ['M13#11'])
  }
}).export(module)
