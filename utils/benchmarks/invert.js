var benchmark = require('benchmark')
var suite = new benchmark.Suite()
var interval = require('../../lib/pitch/interval')
var teoria = require('teoria')

// add tests
suite.add('tonal#interval', function () {
  interval('a4', 'bb5')
})
.add('teoria#interval', function () {
  teoria.note('a4').interval(teoria.note('bb5')).toString()
})
.on('cycle', function (event) {
  console.log(String(event.target))
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'))
})
.run({ 'async': true })
