'use strict'

var timeMeter = require('../time/time-meter')
var durationValue = require('../time/duration-value')

// Use ticks internally (to prevent 1/3 + 1/3 + 1/3 == 0.99 )
var TICKS = 96 * 4

/**
 * Create an array of events from a string representation of a sequence
 *
 * @param {String} measures - the string measures to be parsed
 * @param {Object} options - parsing options
 * @return {Array} - an array of obects with the form
 * { pos: position, dur: duration, val: value }
 */
module.exports = function (measures, options) {
  if (Array.isArray(measures)) {
    return measures
  } else if (typeof measures !== 'string') {
    throw Error('String or Array expected in melody-parser')
  }

  var opts = {}
  options = options || {}
  opts.durationParser = options.durationParser || parseDuration
  opts.forceDurations = options.forceDurations || /[|()]/.test(measures)
  opts.extendSymbol = options.extendSymbol || '_'
  opts.meter = options.meter || '4/4'

  var meter = timeMeter(opts.meter)
  return parseMeasures(meter, measures, opts)
}

function parseMeasures (meter, measures, options) {
  var events = []
  var position = 0
  var expectedDur = options.forceDurations ? meter.measure * TICKS : -1

  splitMeasures(measures).forEach(function (measure) {
    measure = measure.trim()
    if (measure.length > 0) { // ignore empty measures
      var list = parenthesize(tokenize(measure), [])
      position = parseList(events, list, position, expectedDur, options)
    }
  })

  events.forEach(function (event) {
    event.duration = event.duration / TICKS
    event.position = event.position / TICKS
  })
  return events
}

function parseList (events, list, position, total, options) {
  var expectedDur = total / list.length
  list.forEach(function (item) {
    if (Array.isArray(item)) {
      position = parseList(events, item, position, expectedDur, options)
    } else {
      position = parseItem(events, item, position, expectedDur, options)
    }
  })
  return position
}

function parseItem (events, item, position, expectedDur, options) {
  var parsed = options.durationParser(item, expectedDur / TICKS)
  var event = parsed ?
    { value: parsed[0], position: position, duration: parsed[1] * TICKS} :
    { value: item, position: position, duration: expectedDur}

  // var rounded = Math.floor(event.position * 10 + 0.001)
  // if (Math.floor(event.position * 10) !== rounded) {
  //   event.position = rounded / 10
  // }

  if (event.value === options.extendSymbol) {
    var last = events[events.length - 1]
    last.duration += event.duration
  } else {
    events.push(event)
  }
  return event.position + event.duration
}

function parseDuration (item, expectedDur) {
  var split = item.split('/')
  var dur = calcDuration(split[1])
  if (dur) return [split[0], dur]
  else if (expectedDur > 0) return [item, expectedDur]
  else return [item, 0.25]
}

function calcDuration (string) {
  if (!string) return null
  var duration = string.split('+').map(function (durString) {
    return durationValue(durString)
  }).reduce(function (a, b) {
    return a + b
  }, 0)
  return (duration === +duration) ? duration : null
}

function splitMeasures (repr) {
  return repr
    .replace(/\s+\||\|\s+/, '|') // spaces between |
    .replace(/^\||\|\s*$/g, '') // first and last |
    .split('|')
}

/*
 * The following code is copied from https://github.com/maryrosecook/littlelisp
 * See: http://maryrosecook.com/blog/post/little-lisp-interpreter
 * Thanks Mary Rose Cook!
 */
var parenthesize = function (input, list) {
  var token = input.shift()
  if (token === undefined) {
    return list
  } else if (token === '(') {
    list.push(parenthesize(input, []))
    return parenthesize(input, list)
  } else if (token === ')') {
    return list
  } else {
    return parenthesize(input, list.concat(token))
  }
}

var tokenize = function (input) {
  return input
    .replace(/[\(]/g, ' ( ')
    .replace(/[\)]/g, ' ) ')
    .replace(/\,/g, ' ')
    .trim().split(/\s+/)
}
