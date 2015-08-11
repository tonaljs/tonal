var vows = require('vows')
var assert = require('assert')
var Tonal = require('../lib/')
var fs = require('fs')
var path = require('path')

vows.describe('Tonal').addBatch({
  'it exports all functions': {
    'topic': function () {
      fs.readdir(path.join(__dirname, '../lib'), this.callback)
    },
    'Tonal export all functions': function (err, list) {
      assert.isNull(err)
      // add -2 because index.js and module.json
      assert.equal(Object.keys(Tonal).length, list.length - 2)
    }
  }
}).export(module)
