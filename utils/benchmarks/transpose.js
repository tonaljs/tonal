var benchmark = require('benchmark')
var suite = new benchmark.Suite()
var tonal = require('../../lib')
var teoria = require('teoria')

console.log(tonal.pitch.transpose('a4', '3M'))
console.log(teoria.note('a4').interval('M3').toString())

// add tests
suite.add('tonal#transpose', function () {
  tonal.pitch.transpose('a4', '3M')
})
.add('teoria#interval', function () {
  teoria.note('a4').interval('M3').toString()
})
.on('cycle', function (event) {
  console.log(String(event.target))
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'))
})
.run({ 'async': true })
