var vows = require('vows')
var assert = require('assert')
var invert = require('../lib/invert-interval')
var names = require('../lib/interval-names')

vows.describe('Invert intervals').addBatch({
  'invert simple ascending': function () {
    var inverted = names().map(function (name) {
      return name + '=>' + invert(name)
    })
    assert.deepEqual(inverted, [
      'd1=>A8', 'P1=>P8', 'A1=>d8', 'd2=>A7', 'm2=>M7', 'M2=>m7', 'A2=>d7',
      'd3=>A6', 'm3=>M6', 'M3=>m6', 'A3=>d6', 'd4=>A5', 'P4=>P5', 'A4=>d5',
      'd5=>A4', 'P5=>P4', 'A5=>d4', 'd6=>A3', 'm6=>M3', 'M6=>m3', 'A6=>d3',
      'd7=>A2', 'm7=>M2', 'M7=>m2', 'A7=>d2', 'd8=>A1', 'P8=>P1', 'A8=>d1' ])
  },
  'invert simple descending': function () {
    var inverted = names().map(function (name) {
      name = name[0] + '-' + name[1]
      return name + '=>' + invert(name)
    })
    assert.deepEqual(inverted, ['d-1=>A-8', 'P-1=>P-8', 'A-1=>d-8', 'd-2=>A-7',
      'm-2=>M-7', 'M-2=>m-7', 'A-2=>d-7', 'd-3=>A-6', 'm-3=>M-6', 'M-3=>m-6',
      'A-3=>d-6', 'd-4=>A-5', 'P-4=>P-5', 'A-4=>d-5', 'd-5=>A-4', 'P-5=>P-4',
      'A-5=>d-4', 'd-6=>A-3', 'm-6=>M-3', 'M-6=>m-3', 'A-6=>d-3', 'd-7=>A-2',
      'm-7=>M-2', 'M-7=>m-2', 'A-7=>d-2', 'd-8=>A-1', 'P-8=>P-1', 'A-8=>d-1'])
  }
}).export(module)
