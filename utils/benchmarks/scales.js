var benchmark = require('benchmark')
var suite = new benchmark.Suite()
var tonal = require('../../lib')
var teoria = require('teoria')

var scales = tonal.scale.names().map(function (name) {
  return tonal.scale.scale('C ' + name)
})

// add tests
suite.add('tonal#transpose', function () {
  scales.map(function (scale) {
    return scale.map(tonal.pitch.transpose('3M'))
  })
})
.add('teoria#interval', function () {
  scales.map(function (scale) {
    return scale.map(function (note) {
      return teoria.note(note).interval('M3')
    })
  })
})
.on('cycle', function (event) {
  console.log(String(event.target))
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'))
})
.run({ 'async': true })
