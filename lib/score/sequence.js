'use strict'

var timeMeter = require('../time/time-meter')
var durationValue = require('../time/duration-value')

// Use ticks internally (to prevent 1/3 + 1/3 + 1/3 == 0.99 )
var TICKS = 96 * 4

/**
 * Create an array of events from a string representation of a sequence
 *
 * You can parse measures separated with '|' where the time of each measure
 * is evenly distributed between the elements inside the measure:
 *
 * ```js
 * parse('Cm | D0 G7 | Cm');
 * // [{ value: 'Cm', position: 0,   duration: 1 },
 * //  { value: 'D0', position: 1,   duration: 0.5  },
 * //  { value: 'G7', position: 1.5, duration: 0.5  },
 * //  { value: 'Cm', position: 2,   duration: 1  }
 * ```
 *
 * You can specify durations:
 * ```js
 * var melody = parse('a2/4 b2/4 c#3/8 d3/8');
 * // [{ value: 'a2',  position: 0,      duration: 0.25 },
 * //  { value: 'b2',  position: 0.25,   duration: 0.25 },
 * //  { value: 'c#3', position: 0.5,    duration: 0.125 },
 * //  { value: 'd3',  position: 0.625,  duration: 0.125 }]
 * ```
 * The duration can be expressed with numbers and dots (`"4."`, `"2.."`), with
 * letters and dots (`"q."`, `"w.."`) or names (`"quarter"`)
 * @see tonal/time/duration-value
 *
 * If the duration is not specified, and there's no measure separator,
 * the default duration is 4. But if there are any measure separators, i
 * the duration is calculated by dividing the measure length by the number
 * of items. You can use parenthesis to group items and write complex
 * rhythmic structures:
 *
 * ```js
 * parse('a b c d |'); // duration: 0.25, 0.25, 0.25, 0.25
 * parse('a (b c)'); // durations: 0.5, 0.25, 0.25
 * parse('a b (c d e)'); // durations: q, q, qt, qt, qt
 * parse('(a _ _ b) (c d)') // durations: 0.375, 0.125, 0.25, 0.25
 * ```
 *
 * The `_` symbol extends the duration of the previous item:
 *
 * ```js
 * parser'Cm | _ ');
 * // [{ value: 'Cm', position: 0, duration: 2 }]
 * parse('c d _ e | f _ _ g');
 * // [{ value: 'c', position: 0,    duration: 0.25 }]
 * // [{ value: 'd', position: 0.25, duration: 0.50 }]
 * // [{ value: 'e', position: 0.75, duration: 0.25 }]
 * // [{ value: 'f', position: 1,    duration: 0.75 }]
 * // [{ value: 'g', position: 1.75, duration: 0.25 }]
 * ```
 *
 * You can specify other time signatures (it's 4/4 by default):
 *
 * ```js
 * parse('Cm | D0 G7 | Cm', '6/8');
 * parse('C | D / G | C', '3/4');
 * ```
 *
 * It returns an array in the form { pos: integer, dur: integer, val: object }
 *
 * @param {String} measures - the string measures to be parsed
 * @param {Object} options - parsing options
 * @return {Array} - an array of obects with the form
 * { pos: position, dur: duration, val: value }
 *
 * @example
 * sequence = require('tonal/score/sequence')
 *
 */
function sequence (measures, options) {
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

module.exports = sequence

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
