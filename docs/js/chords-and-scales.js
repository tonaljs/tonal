(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global AudioContext Vex */

var range = require('tonal-range')
var chord = require('tonal-chord')
var scale = require('tonal-scale')
var score = require('scorejs')
var player = require('scorejs/ext/scheduler')
var snabbdom = require('snabbdom')
var patch = snabbdom.init([ // Init patch function with choosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners') // attaches event listeners
])
var h = require('snabbdom/h')
var sf = require('soundfont-player')

function pc (n) { return n.slice(0, -1) }
var assign = Object.assign

var ac = new AudioContext()
var piano = sf(ac).instrument('acoustic_grand_piano')

function Chords (state) {
  return h('div#chords-app', {}, []
    .concat(ChordStave({}, state))
    .concat(Tonics({
      onClick: function (t) { ChordsApp(assign(state, { tonic: t })) }
    }, state))
    .concat(Selector({
      names: chord.names,
      onClick: function (name) { ChordsApp(assign(state, { name: name })) }
    }, state))
  )
}

function Scales (state) {
  return h('div#scales-app', {}, []
    .concat(ScaleStave(null, state))
    .concat(Tonics({
      onClick: function (t) { ScalesApp(assign(state, { tonic: t })) }
    }, state))
    .concat(Selector({
      names: scale.names,
      onClick: function (name) { ScalesApp(assign(state, { name: name })) }
    }, state))
  )
}

var tonics = 'C Db D Eb E F F# G Ab A Bb B'.split(' ')
function Tonics (props, state) {
  var current = state.tonic
  return h('div.tonics', {}, tonics.map(function (t) {
    return h('a', {
      class: { active: t === current },
      props: { href: 'javascript:false' },
      on: { click: [props.onClick, t] }
    }, t)
  }))
}

function toId (name) { return name.replace(' ', '-').toLowerCase() }
function octFor (note) { return note[0] === 'A' || note[0] === 'B' ? 3 : 4 }
function ChordStave (props, state) {
  var id = toId(state.name)
  var notes = chord.build(state.name, state.tonic + octFor(state.tonic))
  var vox = (node) => voxChord(notes, node.elm)

  return [
    h('h3', state.tonic + state.name),
    h('figure', []
      .concat(MarginNote(null, { notes: notes, id: id,
        intervals: chord.build(state.name, false),
        score: score.chord(notes) }))
      .concat(h('canvas#' + id, { props: { width: 510, height: 120 },
          hook: { insert: vox, update: (_, node) => vox(node) } })))
  ]
}

function Selector (props, state) {
  var current = state.name
  return h('section.name-list', props.names().sort().map(function (name) {
    return h('a.name', {
      class: { active: name === current },
      state: { href: 'javascript:false' },
      on: { click: [props.onClick, name] }
    }, name)
  }))
}

function ScaleStave (props, state) {
  var id = toId(state.name)
  var sc = scale.build(state.name, state.tonic)
  var t = state.tonic
  var notes = range.scaleRange(sc, [t + 4, t + 5])
  var phrase = range.scaleRange(sc, [t + 4, t + 5, t + 4])
  var vex = (node) => renderCanvas(notes, node.elm)

  return h('section', [
    h('h3', state.tonic + ' ' + state.name),
    h('figure', []
      .concat(MarginNote(null, { notes: notes, id: id,
        intervals: scale.build(state.name, false),
        score: score.phrase(phrase, 0.5) }))
      .concat(h('canvas#scale' + id,
        { props: { width: 510, height: 120 },
          hook: { insert: vex, update: (_, node) => vex(node) } }))
    )
  ])
}

function MarginNote (_, state) {
  return [
    h('label.margin-toggle', { props: { for: 'scale-' + state.id } }),
    h('input.margin-toggle', { props: { id: 'scale-' + state.id } }),
    h('span.marginnote', [
      h('span.code', state.intervals.join(' ')), h('br'),
      h('span.code', state.notes.map(pc).join(' ')), h('br'),
      h('a', { props: { href: 'javascript:false' },
        on: { click: [ play, state.score ] } },
        [ h('i.fa.fa-play', ' '), ' Play' ])
    ])
  ]
}

function play (s) {
  var e = score.events(score.tempo(120, s))
  player.schedule(ac, 0, e, function (time, note) {
    console.log('play', time, note)
    piano.play(note.pitch, time)
  })
}

function renderCanvas (notes, canvas) {
  var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS)

  var ctx = renderer.getContext()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var stave = new Vex.Flow.Stave(0, 0, 500)
  stave.addClef('treble').setContext(ctx).draw()

  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes.map(function (n) {
    var pc = n.charAt(0)
    var alt = n.slice(1, -1)
    var oct = n.slice(-1)
    var note = new Vex.Flow.StaveNote({ keys: [pc + '/' + oct], duration: 'q' })
    if (alt) note.addAccidental(0, new Vex.Flow.Accidental(alt))
    return note
  }))
}

var render = (app) => (state) => {
  console.log('render', state)
  var node = app(state)
  patch(state.node ? state.node : state.el, node)
  state.node = node
}

var ChordsApp = render(Chords)
var ScalesApp = render(Scales)
var scalesEl = document.getElementById('scales-app')
var chordsEl = document.getElementById('chords-app')
ScalesApp({ tonic: 'C', name: 'major', node: null, el: scalesEl })
ChordsApp({ tonic: 'C', name: 'Maj7', node: null, el: chordsEl })

function voxChord (notes, canvas) {
  var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS)

  var ctx = renderer.getContext()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var stave = new Vex.Flow.Stave(0, 0, 500)
  stave.addClef('treble').setContext(ctx).draw()

  var keys = notes.map(function (n) {
    return n.charAt(0, -1) + '/' + n.slice(-1)
  })
  var note = new Vex.Flow.StaveNote({ keys: keys, duration: '2' })
  var render = [ note ]
  notes.forEach(function (n, i) {
    var pc = n.charAt(0)
    var alt = n.slice(1, -1)
    var oct = n.slice(-1)
    var nt = new Vex.Flow.StaveNote({ keys: [pc + alt + '/' + oct], duration: 'q' })
    if (alt) {
      nt.addAccidental(0, new Vex.Flow.Accidental(alt))
      note.addAccidental(i, new Vex.Flow.Accidental(alt))
    }
    render.push(nt)
  })
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, render)
}

},{"scorejs":3,"scorejs/ext/scheduler":2,"snabbdom":42,"snabbdom/h":35,"snabbdom/modules/class":38,"snabbdom/modules/eventlisteners":39,"snabbdom/modules/props":40,"snabbdom/modules/style":41,"soundfont-player":47,"tonal-chord":56,"tonal-range":67,"tonal-scale":95}],2:[function(require,module,exports){

var DEFAULTS = {
  // time in milliseconds of the scheduler lookahead
  lookahead: 500,
  overlap: 250
}

/**
 *
 */
function schedule (ac, time, events, fn, options) {
  console.log(events)
  time = Math.max(time, ac.currentTime)
  var opts = DEFAULTS
  var id = null
  var nextEvtNdx = 0

  function scheduleEvents () {
    var current = ac.currentTime
    var from = current - time
    var to = current + (opts.lookahead + opts.overlap) / 1000
    console.log('scheduling', from, to)
    var next = events[nextEvtNdx]
    while (next && next[0] >= from && next[0] < to) {
      fn(time + next[0], next[1])
      console.log('event', next, current, time, time + next[0])
      nextEvtNdx++
      next = events[nextEvtNdx]
    }
    if (next) id = setTimeout(scheduleEvents, opts.lookahead)
  }
  scheduleEvents()

  return {
    stop: function () {
      clearTimeout(id)
    }
  }
}

module.exports = { schedule: schedule }

},{}],3:[function(require,module,exports){
'use strict'

var slice = Array.prototype.slice
var modules = [
  require('./lib/score'),
  require('./lib/notes'),
  require('./lib/stats'),
  require('./lib/timed'),
  require('./lib/rhythm'),
  require('./lib/measures'),
  require('./lib/harmony'),
  require('./lib/performance'),
  require('./lib/build')
]

function score (data) {
  if (arguments.length > 1) data = score.sim(slice.call(arguments))
  return score.build(score, data).score
}

modules.forEach(function (module) {
  Object.keys(module).forEach(function (name) { score[name] = module[name] })
})

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score

},{"./lib/build":4,"./lib/harmony":5,"./lib/measures":6,"./lib/notes":7,"./lib/performance":8,"./lib/rhythm":9,"./lib/score":10,"./lib/stats":11,"./lib/timed":12}],4:[function(require,module,exports){
/** @module build */

function build (scope, data) {
  if (arguments.length > 1) return build(scope)(data)

  return function (data) {
    var ctx = {}
    ctx.score = exec(ctx, scope, data)
    return ctx
  }
}

// exec a data array
function exec (ctx, scope, data) {
  var fn = getFunction(ctx, scope, data[0])
  var elements = data.slice(1)
  var params = elements.map(function (p) {
    return Array.isArray(p) ? exec(ctx, scope, p)
      : (p[0] === '$') ? ctx[p] : p
  }).filter(function (p) { return p !== VAR })
  return fn.apply(null, params)
}

function getFunction (ctx, scope, name) {
  if (typeof name === 'function') return name
  else if (typeof name !== 'string') throw Error('Not a valid function: ' + name)
  else if (name[0] === '$') return variableFn(ctx, name)
  else if (!scope[name]) throw Error('Command not found: ' + name)
  else return scope[name]
}

var VAR = { type: 'var' }
function variableFn (ctx, name) {
  return function (obj) {
    ctx[name] = obj
    return VAR
  }
}

module.exports = { build: build }

},{}],5:[function(require,module,exports){
/** @module harmony */

var score = require('./score')
var measures = require('./measures').measures
var getChord = require('chord-dictionary')

/**
 * Create a chord names sequence
 *
 * @param {String} meter - the meter used in the measures
 * @param {String} measures - the chords
 * @param {Sequence} a sequence of chords
 *
 * @example
 * score.chords('4/4', 'C6 | Dm7 G7 | Cmaj7')
 *
 * @example
 * score(['chords', '4/4', 'Cmaj7 | Dm7 G7'])
 */
function chords (meter, data) {
  return measures(meter, data, function (dur, el) {
    return score.el({ duration: dur, chord: el })
  })
}

/**
 * Convert a chord names sequence into a chord notes sequence
 */
var expandChords = score.map(function (el) {
  var toNote = score.note(el.duration)
  var setOct = function (pc) { return pc + 4 }
  return el.chord
    ? score.sim(getChord(el.chord).map(setOct).map(toNote)) : el
}, null)

/**
 * Create a harmony sequence
 */
function harmony (meter, data) {
  return expandChords(chords(meter, data))
}

module.exports = { chords: chords, expandChords: expandChords, harmony: harmony }

},{"./measures":6,"./score":10,"chord-dictionary":14}],6:[function(require,module,exports){
/** @module measures */

var score = require('./score')

/**
 * Parse masures using a time meter to get a sequence
 *
 * @param {String} meter - the time meter
 * @param {String} measures - the measures string
 * @param {Function} builder - (Optional) the function used to build the notes
 * @return {Score} the score object
 *
 * @example
 * measures('4/4', 'c d (e f) | g | (a b c) d')
 */
function measures (meter, measures, builder) {
  var list
  var mLen = measureLength(meter)
  if (!mLen) throw Error('Not valid meter: ' + meter)

  var seq = []
  builder = builder || score.note
  splitMeasures(measures).forEach(function (measure) {
    measure = measure.trim()
    if (measure.length > 0) {
      list = parenthesize(tokenize(measure), [])
      processList(seq, list, measureLength(meter), builder)
    }
  })
  return score.seq(seq)
}

// get the length of one measure
function measureLength (meter) {
  var m = meter.split('/').map(function (n) {
    return +n.trim()
  })
  return m[0] * (4 / m[1])
}

function processList (seq, list, total, builder) {
  var dur = total / list.length
  list.forEach(function (i) {
    if (Array.isArray(i)) processList(seq, i, dur, builder)
    else seq.push(builder(dur, i))
  })
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

module.exports = { measures: measures, melody: measures }

},{"./score":10}],7:[function(require,module,exports){
/** @module notes */

var score = require('./score')
var tr = require('note-transposer')

// ======== UTILITY ========
// This is an utility function to create array of notes quickly.
function notes (pitches, durations, params) {
  var p = toArray(pitches || null)
  var d = toArray(durations || 1)
  return p.map(function (pitch, i) {
    return score.note(+d[i % d.length], pitch, params)
  })
}

// convert anything to an array (if string, split it)
function toArray (obj) {
  if (Array.isArray(obj)) return obj
  else if (typeof obj === 'string') return obj.trim().split(/\s+/)
  else return [ obj ]
}

// ======= API ========

/**
 * Create a phrase (a sequential structure of notes)
 *
 * @param {String|Array} pitches - the phrase note pitches
 * @param {String|Array} durations - the phrase note durations
 * @param {Hash} attributes - the phrase note attributes
 * @return {Array} a sequential musical structure
 *
 * @example
 * score.phrase('A B C D E', 1)
 */
function phrase (p, d, a) { return score.seq(notes(p, d, a)) }

/**
 * Create a collection of simultaneus notes
 *
 * You can specify a collection of pitches, durations and attributes
 * and `chord` will arrange them as a collection of notes in simultaneus
 * layout
 *
 * @param {String|Array} pitches - the chord note pitches
 * @param {String|Array} durations - the chord note durations
 * @param {Hash} attributes - the chord note attributes
 * @return {Array} a parallel musical structure
 *
 * @example
 * score.phrase('A B C D E', 1)
 */
function chord (p, d, a) { return score.sim(notes(p, d, a)) }

/**
 * Transpose notes
 *
 * @param {String} interval - the interval to transpose
 * @param {Object} score - the score object
 * @return {Score} the score with the notes transposed
 */
var trans = score.map(function (note, interval) {
  return note.pitch
    ? score.el(note, { pitch: tr(interval, note.pitch) }) : note
})

module.exports = { phrase: phrase, chord: chord, trans: trans }

},{"./score":10,"note-transposer":21}],8:[function(require,module,exports){
/** @module performance */

var score = require('./score')

var inst = score.map(function (note, name) {
  return score.el(note, { inst: name })
})

var tempo = score.map(function (note, tempo) {
  var c = 60 / tempo
  return score.el(note, { duration: c * note.duration })
})

var vel = score.map(function (note, vel) {
  return score.el(note, { velocity: vel })
})

module.exports = { inst: inst, tempo: tempo, vel: vel }

},{"./score":10}],9:[function(require,module,exports){
/** @module rhythm */

var score = require('./score')

var rhythm = {}

/**
 * Create a rhythmic sequence from a pattern
 */
rhythm.pattern = function (pattern, duration) {
  var arr = pattern.split('')
  var dur = duration ? duration / arr.length : 1
  return score.seq(arr.map(score.note(dur)))
}

/**
 * Create a rhythmic sequence from an inter onset interval number
 */
rhythm.ioi = function (ioi) {
  return rhythm.pattern(rhythm.ioiToPattern(ioi))
}

/**
 * Convert an [inter onset interval](https://en.wikipedia.org/wiki/Time_point#Interonset_interval)
 * to a pattern
 *
 * @param {String} ioi - the inter onset interval
 * @param {String} the rhythm pattern
 */
rhythm.ioiToPattern = function (num) {
  return num.split('').map(function (n) {
    return 'x' + Array(+n).join('.')
  }).join('')
}

/**
 * Convert a pattern string to inter onset interval string
 *
 * @param {String} pattern - the pattern to be converted
 * @return {String} the inter onset interval
 */
rhythm.patternToIoi = function (pattern) {
  return pattern.split(/x/)
    .map(function (d) { return d.length })
    .filter(function (_, i) { return i }) // remove first
    .map(function (d) { return d + 1 })
    .join('')
}

module.exports = rhythm

},{"./score":10}],10:[function(require,module,exports){
'use strict'

/**
 * @module score
 */
var isArray = Array.isArray
var slice = Array.prototype.slice
var assign = Object.assign
function typeOf (obj) { return isArray(obj) ? obj[0] : 'el' }
function isStruct (e) { return isArray(e) && typeof e[0] === 'string' }
// create a sequence builder
function builder (name) {
  return function (elements) {
    if (arguments.length > 1) return [name].concat(slice.call(arguments))
    else if (isStruct(elements)) return [name, elements]
    return [name].concat(elements)
  }
}

/**
 * Create a score element: an object with duration
 *
 * It's accepts any data you supply, but duration property has a special
 * meaning: it's a number representing the duration in arbitrary units.
 * It's assumed to be 0 (no duration) if not present or not a valid number
 *
 * @param {Number} duration - the element duration
 * @param {Object} data - the additional element data
 */
function el (d, data) {
  if (typeof d === 'object') return assign({}, d, data)
  else return assign({ duration: +d || 0 }, data)
}

/**
 * Create a note from duration and pitch
 *
 * A note is any object with duration and pitch attributes. The duration
 * must be a number, but the pitch can be any value (although only strings with
 * scientific notation pitches and midi numbers are recogniced by the manipulation
 * or display functions)
 *
 * If only duration is provided, a partially applied function is returned.
 *
 * @param {Integer} duration - the note duration
 * @param {String|Integer} pitch - the note pitch
 * @param {Hash} data - (Optional) arbitraty note data
 * @return {Hash} a note
 *
 * @example
 * score.note(1, 'A') // => { duration: 1, pitch: 'A' }
 * score.note(0.5, 'anything') // => { duration: 0.5, pitch: 'anything' }
 * score.note(2, 'A', 2, { inst: 'piano' }) // => { duration: 2, pitch: 'A', inst: 'piano' }
 *
 * @example
 * // partially applied
 * ['C', 'D', 'E'].map(score.note(1)) // => [{ duration: 1, pitch: 'C'},
 *   { duration: 1, pitch: 'D'}, { duration: 1, pitch: 'E'}]
 */
function note (dur, pitch, data) {
  if (arguments.length === 1) return function (p, d) { return note(dur, p, d) }
  return assign({ pitch: pitch, duration: dur || 1 }, data)
}

/**
 * Create a musical structure where elements are sequenetial
 *
 * @function
 * @param {Array} elements - an array of elements
 * @return {Array} the sequential musical structure
 *
 * @example
 * score.sequential([score.note('A'), score.note('B')])
 */
var seq = builder('seq')

/**
 * Create a musical structure where elements are simultaneous
 *
 * @function
 * @example
 * score.sim([score.note('A'), score.note('B')])
 */
var sim = builder('sim')

/**
 * Transform a musical structure
 *
 * This is probably the most important function. It allows complex
 * transformations of musical structures using three functions
 *
 * @param {Function} elTransform - element transform function
 * @param {Function} seqTransform - sequential structure transform function
 * @param {Function} parTransform - simultaneous structure transform function
 * @param {*} ctx - an additional object passed to transform functions
 * @param {Object} score - the score to transform
 * @return {*} the result of the transformation
 */
function transform (nt, st, pt, ctx, obj) {
  switch (arguments.length) {
    case 0: return transform
    case 1:
    case 2:
    case 3: return transformer(nt, st, pt)
    case 4: return function (o) { return transformer(nt, st, pt)(ctx, o) }
    default: return transformer(nt, st, pt)(ctx, obj)
  }
}

function transformer (nt, st, pt) {
  var T = function (ctx, obj) {
    var m = function (o) { return T(ctx, o) }
    switch (typeOf(obj)) {
      case 'el': return nt(obj, ctx)
      case 'seq': return st(obj.slice(1).map(m), ctx)
      case 'sim': return pt(obj.slice(1).map(m), ctx)
      default: return obj
    }
  }
  return T
}

/**
* Map the notes of a musical structure using a function
*
* @param {Function} fn - the function used to map the notes
* @param {Object} ctx - a context object passed to the function
* @param {Score} score - the score to transform
* @return {Score} the transformed score
*/
function map (fn, ctx, obj) {
  switch (arguments.length) {
    case 0: return map
    case 1: return transform(fn, buildSeq, buildSim)
    case 2: return function (obj) { return map(fn)(ctx, obj) }
    case 3: return map(fn)(ctx, obj)
  }
}
function buildSeq (el, ctx) { return seq(el) }
function buildSim (el, ctx) { return sim(el) }

module.exports = {
  el: el, note: note,
  seq: seq, sequentially: seq,
  sim: sim, simultaneosly: sim,
  transform: transform, map: map }

},{}],11:[function(require,module,exports){
/** @module stats */
var score = require('./score')

function dur (obj) { return obj.duration }
function one () { return 1 }
function arrayMax (arr) { return Math.max.apply(null, arr) }
function arrayAdd (arr) { return arr.reduce(function (a, b) { return a + b }) }

/**
 * Get the total duration of a score
 * @function
 */
var duration = score.transform(dur, arrayAdd, arrayMax, null)

/**
 * Get the longest element duration of a score
 * @function
 */
var longest = score.transform(dur, arrayMax, arrayMax, null)

/**
 * Return the number of elements of a score
 */
var count = score.transform(one, arrayAdd, arrayAdd, null)

module.exports = { duration: duration, longest: longest, count: count }

},{"./score":10}],12:[function(require,module,exports){
/** @module timed */
var score = require('./score')

/**
* Get all notes for side-effects
*
* __Important:__ ascending time ordered is not guaranteed
*
* @param {Function} fn - the function
* @param {Object} ctx - (Optional) a context object passed to the function
* @param {Score} score - the score object
*/
function forEachTime (fn, ctx, obj) {
  if (arguments.length > 1) return forEachTime(fn)(ctx, obj)

  return function (ctx, obj) {
    return score.transform(
      function (note) {
        return function (time, ctx) {
          fn(time, note, ctx)
          return note.duration
        }
      },
      function (seq) {
        return function (time, ctx) {
          return seq.reduce(function (dur, fn) {
            return dur + fn(time + dur, ctx)
          }, 0)
        }
      },
      function (par) {
        return function (time, ctx) {
          return par.reduce(function (max, fn) {
            return Math.max(max, fn(time, ctx))
          }, 0)
        }
      }
    )(null, obj)(0, ctx)
  }
}

/**
 * Get a sorted events array from a score
 *
 */
function events (obj, build, compare) {
  var e = []
  forEachTime(function (time, obj) {
    e.push(build ? build(time, obj) : [time, obj])
  }, null, obj)
  return e.sort(compare || function (a, b) { return a[0] - b[0] })
}

module.exports = { forEachTime: forEachTime, events: events }

},{"./score":10}],13:[function(require,module,exports){
module.exports={
  "4": [ "1 4 7b 10m", [ "quartal" ] ],
  "5": [ "1 5" ],

  "M": [ "1 3 5", [ "Major", "" ] ],
  "M#5": [ "1 3 5A", [ "augmented", "maj#5", "Maj#5", "+", "aug" ] ],
  "M#5add9": [ "1 3 5A 9", [ "+add9" ] ],
  "M13": [ "1 3 5 7 9 13", [ "maj13", "Maj13" ] ],
  "M13#11": [ "1 3 5 7 9 11# 13", [ "maj13#11", "Maj13#11", "M13+4", "M13#4" ] ],
  "M6": [ "1 3 5 13", [ "6" ] ],
  "M6#11": [ "1 3 5 6 11#", [ "M6b5", "6#11", "6b5" ] ],
  "M69": [ "1 3 5 6 9", [ "69" ] ],
  "M69#11": [ "1 3 5 6 9 11#" ],
  "M7#11": [ "1 3 5 7 11#", [ "maj7#11", "Maj7#11", "M7+4", "M7#4" ] ],
  "M7#5": [ "1 3 5A 7", [ "maj7#5", "Maj7#5", "maj9#5", "M7+" ] ],
  "M7#5sus4": [ "1 4 5A 7" ],
  "M7#9#11": [ "1 3 5 7 9# 11#" ],
  "M7add13": [ "1 3 5 6 7 9" ],
  "M7b5": [ "1 3 5d 7" ],
  "M7b6": [ "1 3 6b 7" ],
  "M7b9": [ "1 3 5 7 9b" ],
  "M7sus4": [ "1 4 5 7" ],
  "M9": [ "1 3 5 7 9", [ "maj9", "Maj9" ] ],
  "M9#11": [ "1 3 5 7 9 11#", [ "maj9#11", "Maj9#11", "M9+4", "M9#4" ] ],
  "M9#5": [ "1 3 5A 7 9", [ "Maj9#5" ] ],
  "M9#5sus4": [ "1 4 5A 7 9" ],
  "M9b5": [ "1 3 5d 7 9" ],
  "M9sus4": [ "1 4 5 7 9" ],
  "Madd9": [ "1 3 5 9", [ "2", "add9", "add2" ] ],
  "Maj7": [ "1 3 5 7", [ "maj7", "M7" ] ],
  "Mb5": [ "1 3 5d" ],
  "Mb6": [ "1 3 13b" ],
  "Msus2": [ "1 2M 5", [ "add9no3", "sus2" ] ],
  "Msus4": [ "1 4 5", [ "sus", "sus4" ] ],
  "addb9": [ "1 3 5 9b" ],
  "7": [ "1 3 5 7b", [ "Dominant", "Dom" ] ],
  "9": [ "1 3 5 7b 9", [ "79" ] ],
  "11": [ "1 5 7b 9 11" ],
  "13": [ "1 3 5 7b 9 13", [ "13_" ] ],
  "11b9": [ "1 5 7b 9b 11" ],
  "13#11": [ "1 3 5 7b 9 11# 13", [ "13+4", "13#4" ] ],
  "13#9": [ "1 3 5 7b 9# 13", [ "13#9_" ] ],
  "13#9#11": [ "1 3 5 7b 9# 11# 13" ],
  "13b5": [ "1 3 5d 6 7b 9" ],
  "13b9": [ "1 3 5 7b 9b 13" ],
  "13b9#11": [ "1 3 5 7b 9b 11# 13" ],
  "13no5": [ "1 3 7b 9 13" ],
  "13sus4": [ "1 4 5 7b 9 13", [ "13sus" ] ],
  "69#11": [ "1 3 5 6 9 11#" ],
  "7#11": [ "1 3 5 7b 11#", [ "7+4", "7#4", "7#11_", "7#4_" ] ],
  "7#11b13": [ "1 3 5 7b 11# 13b", [ "7b5b13" ] ],
  "7#5": [ "1 3 5A 7b", [ "+7", "7aug", "aug7" ] ],
  "7#5#9": [ "1 3 5A 7b 9#", [ "7alt", "7#5#9_", "7#9b13_" ] ],
  "7#5b9": [ "1 3 5A 7b 9b" ],
  "7#5b9#11": [ "1 3 5A 7b 9b 11#" ],
  "7#5sus4": [ "1 4 5A 7b" ],
  "7#9": [ "1 3 5 7b 9#", [ "7#9_" ] ],
  "7#9#11": [ "1 3 5 7b 9# 11#", [ "7b5#9" ] ],
  "7#9#11b13": [ "1 3 5 7b 9# 11# 13b" ],
  "7#9b13": [ "1 3 5 7b 9# 13b" ],
  "7add6": [ "1 3 5 7b 13", [ "67", "7add13" ] ],
  "7b13": [ "1 3 7b 13b" ],
  "7b5": [ "1 3 5d 7b" ],
  "7b6": [ "1 3 5 6b 7b" ],
  "7b9": [ "1 3 5 7b 9b" ],
  "7b9#11": [ "1 3 5 7b 9b 11#", [ "7b5b9" ] ],
  "7b9#9": [ "1 3 5 7b 9b 9#" ],
  "7b9b13": [ "1 3 5 7b 9b 13b" ],
  "7b9b13#11": [ "1 3 5 7b 9b 11# 13b", [ "7b9#11b13", "7b5b9b13" ] ],
  "7no5": [ "1 3 7b" ],
  "7sus4": [ "1 4 5 7b", [ "7sus" ] ],
  "7sus4b9": [ "1 4 5 7b 9b", [ "susb9", "7susb9", "7b9sus", "7b9sus4", "phryg" ] ],
  "7sus4b9b13": [ "1 4 5 7b 9b 13b", [ "7b9b13sus4" ] ],
  "9#11": [ "1 3 5 7b 9 11#", [ "9+4", "9#4", "9#11_", "9#4_" ] ],
  "9#11b13": [ "1 3 5 7b 9 11# 13b", [ "9b5b13" ] ],
  "9#5": [ "1 3 5A 7b 9", [ "9+" ] ],
  "9#5#11": [ "1 3 5A 7b 9 11#" ],
  "9b13": [ "1 3 7b 9 13b" ],
  "9b5": [ "1 3 5d 7b 9" ],
  "9no5": [ "1 3 7b 9" ],
  "9sus4": [ "1 4 5 7b 9", [ "9sus" ] ],
  "m": [ "1 3b 5", [ "minor" ] ],
  "m#5": [ "1 3b 5A", [ "m+", "mb6" ] ],
  "m11": [ "1 3b 5 7b 9 11", [ "_11" ] ],
  "m11#5": [ "1 3b 6b 7b 9 11" ],
  "m11b5": [ "1 3b 7b 12d 2M 4", [ "h11", "_11b5" ] ],
  "m13": [ "1 3b 5 7b 9 11 13", [ "_13" ] ],
  "m6": [ "1 3b 4 5 13", [ "_6" ] ],
  "m69": [ "1 3b 5 6 9", [ "_69" ] ],
  "m7": [ "1 3b 5 7b", [ "minor7", "_", "_7" ] ],
  "m7#5": [ "1 3b 6b 7b" ],
  "m7add11": [ "1 3b 5 7b 11", [ "m7add4" ] ],
  "m7b5": [ "1 3b 5d 7b", [ "half-diminished", "h7", "_7b5" ] ],
  "m9": [ "1 3b 5 7b 9", [ "_9" ] ],
  "m9#5": [ "1 3b 6b 7b 9" ],
  "m9b5": [ "1 3b 7b 12d 2M", [ "h9", "-9b5" ] ],
  "mMaj7": [ "1 3b 5 7", [ "mM7", "_M7" ] ],
  "mMaj7b6": [ "1 3b 5 6b 7", [ "mM7b6" ] ],
  "mM9": [ "1 3b 5 7 9", [ "mMaj9", "-M9" ] ],
  "mM9b6": [ "1 3b 5 6b 7 9", [ "mMaj9b6" ] ],
  "mb6M7": [ "1 3b 6b 7" ],
  "mb6b9": [ "1 3b 6b 9b" ],
  "o": [ "1 3b 5d", [ "mb5", "dim" ] ],
  "o7": [ "1 3b 5d 13", [ "diminished", "m6b5", "dim7" ] ],
  "o7M7": [ "1 3b 5d 6 7" ],
  "oM7": [ "1 3b 5d 7" ],
  "sus24": [ "1 2M 4 5", [ "sus4add9" ] ],
  "+add#9": [ "1 3 5A 9#" ],
  "madd4": [ "1 3b 4 5" ],
  "madd9": [ "1 3b 5 9" ]
}

},{}],14:[function(require,module,exports){
'use strict'

var chords = require('./chords.json')
var dictionary = require('music-dictionary')

/**
 * A chord dictionary. Get chord data from a chord name.
 *
 * @name chord
 * @function
 * @param {String} name - the chord name
 * @see music-dictionary
 *
 * @example
 * // get chord data
 * var chord = require('chord-dictionary')
 * chord('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
 *                //      intervals:  [ ...],
 *                //      binary: '100010010001', decimal: 2193 }
 *
 * @example
 * // get it from aliases, binary or decimal numbers
 * chord('Maj7') === chord('M7') === chord('100010010001') === chord(2913)
 *
 * @example
 * // get chord names
 * chord.names // => ['Maj7', 'm7', ...]
 */
module.exports = dictionary(chords)

},{"./chords.json":13,"music-dictionary":15}],15:[function(require,module,exports){
'use strict'

var parse = require('music-notation/interval/parse')
var R = require('music-notation/note/regex')
var transpose = require('note-transposer')

/**
 * Create a musical dictionary. A musical dictionary is a function that given
 * a name (and optionally a tonic) returns an array of notes.
 *
 * A dictionary is created from a HashMap. It maps a name to a string with
 * an interval list and, optionally, an alternative name list (see example)
 *
 * Additionally, the dictionary has properties (see examples):
 *
 * - data: a hash with the dictionary data
 * - names: an array with all the names
 * - aliases: an array with all the names including aliases
 * - source: the source of the dictionary
 *
 * Each value of the data hash have the following properties:
 *
 * - name: the name
 * - aliases: an array with the alternative names
 * - intervals: an array with the intervals
 * - steps: an array with the intervals in __array notation__
 * - binary: a binary representation of the set
 * - decimal: the decimal representation of the set
 *
 * @name dictionary
 * @function
 * @param {Hash} source - the dictionary source
 * @return {Function} the dictionary
 *
 * @example
 * var dictionary = require('music-dictionary')
 * var chords = dictionary({'Maj7': ['1 3 5 7', ['M7']], 'm7': ['1 3b 5 7b'] })
 * chords('CMaj7') // => ['C', 'E', 'G', 'B']
 * chords('DM7') // => ['D', 'F#', 'A', 'C#']
 * chords('Bm7') // => ['B', 'D', 'F#', 'A']
 *
 * @example
 * // dictionary data
 * chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
 *                   //      intervals: ['1', '3', '5', '7'], steps: [ ...],
 *                   //      binary: '10010010001', decimal: 2193 }
 *
 * // get chord by binary numbers
 * chords.data['100010010001'] === chords.data['Maj7']
 * chords.data[2193] === chords.data['Maj7']
 *
 * @example
 * // available names
 * chords.names // => ['Maj7', 'm7']
 * chords.aliases // => ['Maj7', 'm7', 'M7']
 */
module.exports = function (src) {
  function dict (name, tonic) {
    var v = dict.props(name)
    if (!v) {
      var n = R.exec(name)
      v = n ? dict.props(n[5]) : null
      if (!v) return []
      tonic = tonic === false ? tonic : tonic || n[1] + n[2] + n[3]
    }
    if (tonic !== false && !tonic) return function (t) { return dict(name, t) }
    return v.intervals.map(transpose(tonic))
  }
  return build(src, dict)
}

function build (src, dict) {
  var data = {}
  var names = Object.keys(src)
  var aliases = names.slice()

  dict.props = function (name) { return data[name] }
  dict.names = function (a) { return (a ? aliases : names).slice() }

  names.forEach(function (k) {
    var d = src[k]
    var c = { name: k, aliases: d[1] || [] }
    c.intervals = d[0].split(' ')
    c.steps = c.intervals.map(parse)
    c.binary = binary([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], c.steps)
    c.decimal = parseInt(c.binary, 2)
    data[k] = data[c.binary] = data[c.decimal] = c
    c.aliases.forEach(function (a) { data[a] = c })
    if (c.aliases.length > 0) aliases = aliases.concat(c.aliases)
  })
  return dict
}

function binary (num, intervals) {
  intervals.forEach(function (i) { num[(i[0] * 7 + i[1] * 12) % 12] = '1' })
  return num.join('')
}

},{"music-notation/interval/parse":17,"music-notation/note/regex":20,"note-transposer":21}],16:[function(require,module,exports){
'use strict'

// map from pitch number to number of fifths and octaves
var BASES = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

/**
 * Get a pitch in [array notation]() from pitch properties
 *
 * @name array.fromProps
 * @function
 * @param {Integer} step - the step index
 * @param {Integer} alterations - (Optional) the alterations number
 * @param {Integer} octave - (Optional) the octave
 * @param {Integer} duration - (Optional) duration
 * @return {Array} the pitch in array format
 *
 * @example
 * var fromProps = require('music-notation/array/from-props')
 * fromProps([0, 1, 4, 0])
 */
module.exports = function (step, alt, oct, dur) {
  var base = BASES[step]
  alt = alt || 0
  var f = base[0] + 7 * alt
  if (typeof oct === 'undefined') return [f]
  var o = oct + base[1] - 4 * alt
  if (typeof dur === 'undefined') return [f, o]
  else return [f, o, dur]
}

},{}],17:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var fromProps = require('../array/from-props')
var INTERVAL = require('./regex')
var TYPES = 'PMMPPMM'
var QALT = {
  P: { dddd: -4, ddd: -3, dd: -2, d: -1, P: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 },
  M: { ddd: -4, dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 }
}

/**
 * Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * to [interval coord notation](https://github.com/danigb/music.array.notation)
 *
 * This function is cached for better performance.
 *
 * @name interval.parse
 * @function
 * @param {String} interval - the interval string
 * @return {Array} the interval in array notation or null if not a valid interval
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * parse('3m') // => [2, -1, 0]
 * parse('9b') // => [1, -1, 1]
 * parse('-2M') // => [6, -1, -1]
 */
module.exports = memoize(function (str) {
  var m = INTERVAL.exec(str)
  if (!m) return null
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  var num = +(m[3] || m[8]) - 1
  var q = m[4] || m[6] || ''

  var simple = num % 7

  var alt
  if (q === '') alt = 0
  else if (q[0] === '#') alt = q.length
  else if (q[0] === 'b') alt = -q.length
  else {
    alt = QALT[TYPES[simple]][q]
    if (typeof alt === 'undefined') return null
  }
  var oct = Math.floor(num / 7)
  var arr = fromProps(simple, alt, oct)
  return dir === 1 ? arr : [-arr[0], -arr[1]]
})

},{"../array/from-props":16,"../memoize":19,"./regex":18}],18:[function(require,module,exports){

// shorthand tonal notation (with quality after number)
var TONAL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4}|b{1,4}|#{1,4}|)'
// strict shorthand notation (with quality before number)
var STRICT = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + TONAL + ')|(' + STRICT + '))'

/**
 * A regex for parse intervals in shorthand notation
 *
 * Three different shorthand notations are supported:
 *
 * - default [direction][number][quality]: the preferred style `3M`, `-5A`
 * - strict: [quality][direction][number], for example: `M3`, `A-5`
 * - altered: [direction][number][alterations]: `3`, `-5#`
 *
 * @name interval.regex
 */
module.exports = new RegExp('^' + COMPOSE + '$')

},{}],19:[function(require,module,exports){
'use strict'

/**
 * A simple and fast memoization function
 *
 * It helps creating functions that convert from string to pitch in array format.
 * Basically it does two things:
 * - ensure the function only receives strings
 * - memoize the result
 *
 * @name memoize
 * @function
 * @private
 */
module.exports = function (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return (str in cache) ? cache[str] : cache[str] = fn(str)
  }
}

},{}],20:[function(require,module,exports){
'use strict'

/**
 * A regex for matching note strings in scientific notation.
 *
 * The note string should have the form `letter[accidentals][octave][/duration]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - duration: (Optional) anything follows a slash `/` is considered to be the duration
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * @name note.regex
 * @example
 * var R = require('music-notation/note/regex')
 * R.exec('c#4') // => ['c#4', 'c', '#', '4', '', '']
 */
module.exports = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)(\/\d+|)\s*(.*)\s*$/

},{}],21:[function(require,module,exports){
var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var operation = require('music-notation/operation')(parse, str)

/**
 * Transposes a note by an interval.
 *
 * Given a note and an interval it returns the transposed note. It can be used
 * to add intervals if both parameters are intervals.
 *
 * The order of the parameters is indifferent.
 *
 * This function is currified so it can be used to map arrays of notes.
 *
 * @name transpose
 * @function
 * @param {String|Array} interval - the interval. If its false, the note is not
 * transposed.
 * @param {String|Array} note - the note to transpose
 * @return {String|Array} the note transposed
 *
 * @example
 * var transpose = require('note-transposer')
 * transpose('3m', 'C4') // => 'Eb4'
 * transpose('C4', '3m') // => 'Eb4'
 * tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
 * ['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
 */
var transpose = operation(function (i, n) {
  if (i === false) return n
  else if (!Array.isArray(i) || !Array.isArray(n)) return null
  else if (i.length === 1 || n.length === 1) return [n[0] + i[0]]
  var d = i.length === 2 && n.length === 2 ? null : n[2] || i[2]
  return [n[0] + i[0], n[1] + i[1], d]
})

if (typeof module === 'object' && module.exports) module.exports = transpose
if (typeof window !== 'undefined') window.transpose = transpose

},{"music-notation/operation":32,"music-notation/pitch/parse":33,"music-notation/pitch/str":34}],22:[function(require,module,exports){
'use strict'

/**
 * Build an accidentals string from alteration number
 *
 * @name accidentals.str
 * @param {Integer} alteration - the alteration number
 * @return {String} the accidentals string
 *
 * @example
 * var accidentals = require('music-notation/accidentals/str')
 * accidentals(0) // => ''
 * accidentals(1) // => '#'
 * accidentals(2) // => '##'
 * accidentals(-1) // => 'b'
 * accidentals(-2) // => 'bb'
 */
module.exports = function (num) {
  if (num < 0) return Array(-num + 1).join('b')
  else if (num > 0) return Array(num + 1).join('#')
  else return ''
}

},{}],23:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],24:[function(require,module,exports){
'use strict'

// Map from number of fifths to interval number (0-index) and octave
// -1 = fourth, 0 = unison, 1 = fifth, 2 = second, 3 = sixth...
var BASES = [[3, 1], [0, 0], [4, 0], [1, -1], [5, -1], [2, -2], [6, -2], [3, -3]]

/**
 * Get properties from a pitch in array format
 *
 * The properties is an array with the form [number, alteration, octave, duration]
 *
 * @name array.toProps
 * @function
 * @param {Array} array - the pitch in coord format
 * @return {Array} the pitch in property format
 *
 * @example
 * var toProps = require('music-notation/array/to-props')
 * toProps([2, 1, 4]) // => [1, 2, 4]
 */
module.exports = function (arr) {
  if (!Array.isArray(arr)) return null
  var index = (arr[0] + 1) % 7
  if (index < 0) index = 7 + index
  var base = BASES[index]
  var alter = Math.floor((arr[0] + 1) / 7)
  var oct = arr.length === 1 ? null : arr[1] - base[1] + alter * 4
  var dur = arr[2] || null
  return [base[0], alter, oct, dur]
}

},{}],25:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"../array/from-props":23,"../memoize":28,"./regex":26,"dup":17}],26:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],27:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var cache = {}

/**
 * Get a string with a [shorthand interval notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * from interval in [array notation](https://github.com/danigb/music.array.notation)
 *
 * The returned string has the form: `number + quality` where number is the interval number
 * (positive integer for ascending intervals, negative integer for descending intervals, never 0)
 * and the quality is one of: 'M', 'm', 'P', 'd', 'A' (major, minor, perfect, dimished, augmented)
 *
 * @name interval.str
 * @function
 * @param {Array} interval - the interval in array notation
 * @return {String} the interval string in shorthand notation or null if not valid interval
 *
 * @example
 * var str = require('music-notation/interval/str')
 * str([1, 0, 0]) // => '2M'
 * str([1, 0, 1]) // => '9M'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length !== 2) return null
  var str = '|' + arr[0] + '|' + arr[1]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
var TYPES = 'PMMPPMM'

function build (coord) {
  var p = props(coord)
  var t = TYPES[p[0]]

  var dir, num, alt
  // if its descening, invert number
  if (p[2] < 0) {
    dir = -1
    num = (8 - p[0]) - 7 * (p[2] + 1)
    alt = t === 'P' ? -p[1] : -(p[1] + 1)
  } else {
    dir = 1
    num = p[0] + 1 + 7 * p[2]
    alt = p[1]
  }
  var q = ALTER[t][4 + alt]
  return dir * num + q
}

},{"../array/to-props":24}],28:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],29:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var R = require('./regex')
var BASES = { C: [0, 0], D: [2, -1], E: [4, -2], F: [-1, 1], G: [1, 0], A: [3, -1], B: [5, -2] }

/**
 * Get a pitch in [array notation]()
 * from a string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The string to parse must be in the form of: `letter[accidentals][octave]`
 * The accidentals can be up to four # (sharp) or b (flat) or two x (double sharps)
 *
 * This function is cached for better performance.
 *
 * @name note.parse
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the note in array notation or null if not valid note
 *
 * @example
 * var parse = require('music-notation/note/parse')
 * parse('C') // => [ 0 ]
 * parse('c#') // => [ 8 ]
 * parse('c##') // => [ 16 ]
 * parse('Cx') // => [ 16 ] (double sharp)
 * parse('Cb') // => [ -6 ]
 * parse('db') // => [ -4 ]
 * parse('G4') // => [ 2, 3, null ]
 * parse('c#3') // => [ 8, -1, null ]
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  if (!m || m[5]) return null

  var base = BASES[m[1].toUpperCase()]
  var alt = m[2].replace(/x/g, '##').length
  if (m[2][0] === 'b') alt *= -1
  var fifths = base[0] + 7 * alt
  if (!m[3]) return [fifths]
  var oct = +m[3] + base[1] - 4 * alt
  var dur = m[4] ? +(m[4].substring(1)) : null
  return [fifths, oct, dur]
})

},{"../memoize":28,"./regex":30}],30:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],31:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var acc = require('../accidentals/str')
var cache = {}

/**
 * Get [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) string
 * from pitch in [array notation]()
 *
 * Array length must be 1 or 3 (see array notation documentation)
 *
 * The returned string format is `letter[+ accidentals][+ octave][/duration]` where the letter
 * is always uppercase, and the accidentals, octave and duration are optional.
 *
 * This function is memoized for better perfomance.
 *
 * @name note.str
 * @function
 * @param {Array} arr - the note in array notation
 * @return {String} the note in scientific notation or null if not valid note array
 *
 * @example
 * var str = require('music-notation/note/str')
 * str([0]) // => 'F'
 * str([0, 4]) // => null (its an interval)
 * str([0, 4, null]) // => 'F4'
 * str([0, 4, 2]) // => 'F4/2'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length < 1 || arr.length === 2) return null
  var str = '|' + arr[0] + '|' + arr[1] + '|' + arr[2]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var LETTER = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
function build (coord) {
  var p = props(coord)
  return LETTER[p[0]] + acc(p[1]) + (p[2] !== null ? p[2] : '') + (p[3] !== null ? '/' + p[3] : '')
}

},{"../accidentals/str":22,"../array/to-props":24}],32:[function(require,module,exports){
'use strict'

function curry (fn, arity) {
  if (arity === 1) return fn
  return function (a, b) {
    if (arguments.length === 1) return function (c) { return fn(a, c) }
    return fn(a, b)
  }
}

/**
 * Decorate a function to work with intervals, notes or pitches in
 * [array notation](https://github.com/danigb/tonal/tree/next/packages/music-notation)
 * with independence of string representations.
 *
 * This is the base of the pluggable notation system of
 * [tonal](https://github.com/danigb/tonal)
 *
 * @name operation
 * @function
 * @param {Function} parse - the parser
 * @param {Function} str - the string builder
 * @param {Function} fn - the operation to decorate
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * var str = require('music-notation/interval/str')
 * var operation = require('music-notation/operation')(parse, str)
 * var add = operation(function(a, b) { return [a[0] + b[0], a[1] + b[1]] })
 * add('3m', '3M') // => '5P'
 */
module.exports = function op (parse, str, fn) {
  if (arguments.length === 2) return function (f) { return op(parse, str, f) }
  return curry(function (a, b) {
    var ac = parse(a)
    var bc = parse(b)
    if (!ac && !bc) return fn(a, b)
    var v = fn(ac || a, bc || b)
    return str(v) || v
  }, fn.length)
}

},{}],33:[function(require,module,exports){
var note = require('../note/parse')
var interval = require('../interval/parse')

/**
 * Convert a note or interval string to a [pitch in coord notation]()
 *
 * @name pitch.parse
 * @function
 * @param {String} pitch - the note or interval to parse
 * @return {Array} the pitch in array notation
 *
 * @example
 * var parse = require('music-notation/pitch/parse')
 * parse('C2') // => [0, 2, null]
 * parse('5P') // => [1, 0]
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/parse":25,"../note/parse":29}],34:[function(require,module,exports){
var note = require('../note/str')
var interval = require('../interval/str')

/**
 * Convert a pitch in coordinate notation to string. It deals with notes, pitch
 * classes and intervals.
 *
 * @name pitch.str
 * @funistron
 * @param {Array} pitch - the pitch in array notation
 * @return {String} the pitch string
 *
 * @example
 * var str = require('music-notation/pitch.str')
 * // pitch class
 * str([0]) // => 'C'
 * // interval
 * str([0, 0]) // => '1P'
 * // note
 * str([0, 2, 4]) // => 'C2/4'
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/str":27,"../note/str":31}],35:[function(require,module,exports){
var VNode = require('./vnode');
var is = require('./is');

function addNS(data, children) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (children !== undefined) {
    for (var i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children);
    }
  }
}

module.exports = function h(sel, b, c) {
  var data = {}, children, text, i;
  if (arguments.length === 3) {
    data = b;
    if (is.array(c)) { children = c; }
    else if (is.primitive(c)) { text = c; }
  } else if (arguments.length === 2) {
    if (is.array(b)) { children = b; }
    else if (is.primitive(b)) { text = b; }
    else { data = b; }
  }
  if (is.array(children)) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children);
  }
  return VNode(sel, data, children, text, undefined);
};

},{"./is":37,"./vnode":43}],36:[function(require,module,exports){
function createElement(tagName){
  return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName){
  return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text){
  return document.createTextNode(text);
}


function insertBefore(parentNode, newNode, referenceNode){
  parentNode.insertBefore(newNode, referenceNode);
}


function removeChild(node, child){
  node.removeChild(child);
}

function appendChild(node, child){
  node.appendChild(child);
}

function parentNode(node){
  return node.parentElement;
}

function nextSibling(node){
  return node.nextSibling;
}

function tagName(node){
  return node.tagName;
}

function setTextContent(node, text){
  node.textContent = text;
}

module.exports = {
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  appendChild: appendChild,
  removeChild: removeChild,
  insertBefore: insertBefore,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent
};

},{}],37:[function(require,module,exports){
module.exports = {
  array: Array.isArray,
  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
};

},{}],38:[function(require,module,exports){
function updateClass(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldClass = oldVnode.data.class || {},
      klass = vnode.data.class || {};
  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

module.exports = {create: updateClass, update: updateClass};

},{}],39:[function(require,module,exports){
var is = require('../is');

function arrInvoker(arr) {
  return function() {
    // Special case when length is two, for performance
    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
  };
}

function fnInvoker(o) {
  return function(ev) { o.fn(ev); };
}

function updateEventListeners(oldVnode, vnode) {
  var name, cur, old, elm = vnode.elm,
      oldOn = oldVnode.data.on || {}, on = vnode.data.on;
  if (!on) return;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (old === undefined) {
      if (is.array(cur)) {
        elm.addEventListener(name, arrInvoker(cur));
      } else {
        cur = {fn: cur};
        on[name] = cur;
        elm.addEventListener(name, fnInvoker(cur));
      }
    } else if (is.array(old)) {
      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
      old.length = cur.length;
      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
      on[name]  = old;
    } else {
      old.fn = cur;
      on[name] = old;
    }
  }
}

module.exports = {create: updateEventListeners, update: updateEventListeners};

},{"../is":37}],40:[function(require,module,exports){
function updateProps(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

module.exports = {create: updateProps, update: updateProps};

},{}],41:[function(require,module,exports){
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
  nextFrame(function() { obj[prop] = val; });
}

function updateStyle(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldStyle = oldVnode.data.style || {},
      style = vnode.data.style || {},
      oldHasDel = 'delayed' in oldStyle;
  for (name in oldStyle) {
    if (!style[name]) {
      elm.style[name] = '';
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed') {
      for (name in style.delayed) {
        cur = style.delayed[name];
        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
          setNextFrame(elm.style, name, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      elm.style[name] = cur;
    }
  }
}

function applyDestroyStyle(vnode) {
  var style, name, elm = vnode.elm, s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}

function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
      compStyle, style = s.remove, amount = 0, applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if(applied.indexOf(props[i]) !== -1) amount++;
  }
  elm.addEventListener('transitionend', function(ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};

},{}],42:[function(require,module,exports){
// jshint newcap: false
/* global require, module, document, Node */
'use strict';

var VNode = require('./vnode');
var is = require('./is');
var domApi = require('./htmldomapi.js');

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, map = {}, key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules, api) {
  var i, j, cbs = {};

  if (isUndef(api)) api = domApi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function emptyNodeAt(elm) {
    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    return function() {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode, insertedVnodeQueue) {
    var i, thunk, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
      if (isDef(i = data.vnode)) {
          thunk = vnode;
          vnode = i;
      }
    }
    var elm, children = vnode.children, sel = vnode.sel;
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                                                          : api.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
        }
      } else if (is.primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      elm = vnode.elm = api.createTextNode(vnode.text);
    }
    if (isDef(thunk)) thunk.elm = vnode.elm;
    return vnode.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
      if (isDef(i = data.vnode)) invokeDestroyHook(i);
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) { // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
      patchVnode(oldVnode, i, insertedVnodeQueue);
      vnode.elm = i.elm;
      return;
    }
    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
    if (oldVnode === vnode) return;
    if (!sameVnode(oldVnode, vnode)) {
      var parentElm = api.parentNode(oldVnode.elm);
      elm = createElm(vnode, insertedVnodeQueue);
      api.insertBefore(parentElm, elm, oldVnode.elm);
      removeVnodes(parentElm, [oldVnode], 0, 0);
      return;
    }
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      api.setTextContent(elm, vnode.text);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function(oldVnode, vnode) {
    var i, elm, parent;
    var insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef(oldVnode.sel)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };
}

module.exports = {init: init};

},{"./htmldomapi.js":36,"./is":37,"./vnode":43}],43:[function(require,module,exports){
module.exports = function(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,
          text: text, elm: elm, key: key};
};

},{}],44:[function(require,module,exports){
'use strict';

function b64ToUint6 (nChr) {
  return nChr > 64 && nChr < 91 ?
      nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
    : nChr > 47 && nChr < 58 ?
      nChr + 4
    : nChr === 43 ?
      62
    : nChr === 47 ?
      63
    :
      0;

}

// Decode Base64 to Uint8Array
// ---------------------------
function base64DecodeToArray(sBase64, nBlocksSize) {
  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
  var nInLen = sB64Enc.length;
  var nOutLen = nBlocksSize ?
    Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize :
    nInLen * 3 + 1 >> 2;
  var taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;
    }
  }
  return taBytes;
}

module.exports = base64DecodeToArray;

},{}],45:[function(require,module,exports){
'use strict'

var midi = require('note-midi')

/**
 * Create a soundfont buffers player
 *
 * @param {AudioContext} ac - the audio context
 * @param {Hash} buffers - a midi number to audio buffer hash map
 * @param {Hash} options - (Optional) a hash of options:
 * - gain: the output gain (default: 2)
 * - destination: the destination of the player (default: `ac.destination`)
 */
module.exports = function (ctx, buffers, options) {
  options = options || {}
  var gain = options.gain || 2
  var destination = options.destination || ctx.destination

  return function (note, time, duration) {
    var m = note > 0 && note < 128 ? note : midi(note)
    var buffer = buffers[m]
    if (!buffer) return
    var source = ctx.createBufferSource()
    source.buffer = buffer

    /* VCA */
    var vca = ctx.createGain()
    vca.gain.value = gain
    source.connect(vca)
    vca.connect(destination)

    source.start(time)
    if (duration > 0) source.stop(time + duration)
    return source
  }
}

},{"note-midi":51}],46:[function(require,module,exports){
'use strict'

var base64DecodeToArray = require('./b64decode.js')

/**
 * Given a base64 encoded audio data, return a prmomise with an audio buffer
 *
 * @param {AudioContext} context - the [audio context](https://developer.mozilla.org/en/docs/Web/API/AudioContext)
 * @param {String} data - the base64 encoded audio data
 * @return {Promise} a promise that resolves to an [audio buffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)
 * @api private
 */
module.exports = function (context, data) {
  return new Promise(function (done, reject) {
    var decodedData = base64DecodeToArray(data.split(',')[1]).buffer
    context.decodeAudioData(decodedData, function (buffer) {
      done(buffer)
    }, function (e) {
      reject('DecodeAudioData error', e)
    })
  })
}

},{"./b64decode.js":44}],47:[function(require,module,exports){
'use strict'

var loadBank = require('./load-bank')
var oscillatorPlayer = require('./oscillator-player')
var buffersPlayer = require('./buffers-player')

/**
 * Create a Soundfont object
 *
 * @param {AudioContext} context - the [audio context](https://developer.mozilla.org/en/docs/Web/API/AudioContext)
 * @return {Soundfont} a soundfont object
 */
function Soundfont (ctx, nameToUrl) {
  if (!(this instanceof Soundfont)) return new Soundfont(ctx)

  this.nameToUrl = nameToUrl || Soundfont.nameToUrl || gleitzUrl
  this.ctx = ctx
  this.instruments = {}
  this.promises = []
}

Soundfont.prototype.instrument = function (name, options) {
  var ctx = this.ctx
  name = name || 'default'
  if (name in this.instruments) return this.instruments[name]
  var inst = { name: name, play: oscillatorPlayer(ctx, options) }
  this.instruments[name] = inst
  var promise = loadBank(ctx, this.nameToUrl(name)).then(function (buffers) {
    inst.play = buffersPlayer(ctx, buffers, options)
    return inst
  })
  this.promises.push(promise)
  inst.onready = function (cb) { promise.then(cb) }
  return inst
}

Soundfont.loadBuffers = function (ctx, name) {
  var nameToUrl = Soundfont.nameToUrl || gleitzUrl
  return loadBank(ctx, nameToUrl(name))
}

/*
 * Given an instrument name returns a URL to to the Benjamin Gleitzman's
 * package of [pre-rendered sound fonts](https://github.com/gleitz/midi-js-soundfonts)
 *
 * @param {String} name - instrument name
 * @returns {String} the Soundfont file url
 */
function gleitzUrl (name) {
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
}

if (typeof module === 'object' && module.exports) module.exports = Soundfont
if (typeof window !== 'undefined') window.Soundfont = Soundfont

},{"./buffers-player":45,"./load-bank":48,"./oscillator-player":49}],48:[function(require,module,exports){
'use strict'

var midi = require('note-midi')
var decodeBuffer = require('./decode-buffer')

/**
 * Load a soundfont bank
 *
 * @param {AudioContext} ctx - the audio context object
 * @param {String} url - the url of the js file
 * @param {Function} get - (Optional) given a url return a promise with the contents
 * @param {Function} parse - (Optinal) given a js file return JSON object
 */
module.exports = function (ctx, url, get, parse) {
  get = get || getContent
  parse = parse || parseJavascript
  return Promise.resolve(url).then(get).then(parse)
    .then(function (data) {
      return { ctx: ctx, data: data, buffers: {} }
    })
    .then(decodeBank)
    .then(function (bank) { return bank.buffers })
}

function getContent (url) {
  return new Promise(function (done, reject) {
    var req = new window.XMLHttpRequest()
    req.open('GET', url)

    req.onload = function () {
      if (req.status === 200) {
        done(req.response)
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(Error('Network Error'))
    }
    req.send()
  })
}

/**
 *  Parse the SoundFont data and return a JSON object
 *  (SoundFont data are .js files wrapping json data)
 *
 * @param {String} data - the SoundFont js file content
 * @return {JSON} the parsed data as JSON object
 * @api private
 */
function parseJavascript (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

/*
 * Decode a bank
 * @param {Object} bank - the bank object
 * @return {Promise} a promise that resolves to the bank with the buffers decoded
 * @api private
 */
function decodeBank (bank) {
  var promises = Object.keys(bank.data).map(function (note) {
    return decodeBuffer(bank.ctx, bank.data[note])
    .then(function (buffer) {
      bank.buffers[midi(note)] = buffer
    })
  })

  return Promise.all(promises).then(function () {
    return bank
  })
}

},{"./decode-buffer":46,"note-midi":51}],49:[function(require,module,exports){
'use strict'

var freq = require('midi-freq')(440)
var midi = require('note-midi')

/**
 * Returns a function that plays an oscillator
 *
 * @param {AudioContext} ac - the audio context
 * @param {Hash} options - (Optional) a hash of options:
 * - vcoType: the oscillator type (default: 'sine')
 * - gain: the output gain value (default: 0.2)
 * - destination: the player destination (default: ac.destination)
 */
module.exports = function (ctx, options) {
  options = options || {}
  var destination = options.destination || ctx.destination
  var vcoType = options.vcoType || 'sine'
  var gain = options.gain || 0.2

  return function (note, time, duration) {
    var f = freq(midi(note))
    if (!f) return

    duration = duration || 0.2

    var vco = ctx.createOscillator()
    vco.type = vcoType
    vco.frequency.value = f

    /* VCA */
    var vca = ctx.createGain()
    vca.gain.value = gain

    /* Connections */
    vco.connect(vca)
    vca.connect(destination)

    vco.start(time)
    if (duration > 0) vco.stop(time + duration)
    return vco
  }
}

},{"midi-freq":50,"note-midi":51}],50:[function(require,module,exports){
/**
 * Get the pitch frequency in herzs (with custom concert tuning) from a midi number
 *
 * This function is currified so it can be partially applied (see examples)
 *
 * @name midi.freq
 * @function
 * @param {Float} tuning - the frequency of A4 (null means 440)
 * @param {Integer} midi - the midi number
 * @return {Float} the frequency of the note
 *
 * @example
 * var freq = require('midi-freq')
 * // 69 midi is A4
 * freq(null, 69) // => 440
 * freq(444, 69) // => 444
 *
 * @example
 * // partially applied
 * var freq = require('midi-freq')(440)
 * freq(69) // => 440
 */
module.exports = function freq (tuning, midi) {
  tuning = tuning || 440
  if (arguments.length > 1) return freq(tuning)(midi)

  return function (m) {
    return m > 0 && m < 128 ? Math.pow(2, (m - 69) / 12) * tuning : null
  }
}

},{}],51:[function(require,module,exports){
'use strict'

var parse = require('music-notation/note/parse')

/**
 * Get the midi number of a note
 *
 * If the argument passed to this function is a valid midi number, it returns it
 *
 * The note can be an string in scientific notation or
 * [array pitch notation](https://github.com/danigb/music.array.notation)
 *
 * @name midi
 * @function
 * @param {String|Array|Integer} note - the note in string or array notation.
 * If the parameter is a valid midi number it return it as it.
 * @return {Integer} the midi number
 *
 * @example
 * var midi = require('note-midi')
 * midi('A4') // => 69
 * midi('a3') // => 57
 * midi([0, 2]) // => 36 (C2 in array notation)
 * midi(60) // => 60
 * midi('C') // => null (pitch classes don't have midi number)
 */
function midi (note) {
  if ((typeof note === 'number' || typeof note === 'string') &&
    note > 0 && note < 128) return +note
  var p = Array.isArray(note) ? note : parse(note)
  if (!p || p.length < 2) return null
  return p[0] * 7 + p[1] * 12 + 12
}

if (typeof module === 'object' && module.exports) module.exports = midi
if (typeof window !== 'undefined') window.midi = midi

},{"music-notation/note/parse":53}],52:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],53:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"../memoize":52,"./regex":54,"dup":29}],54:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],55:[function(require,module,exports){
module.exports={
  "4": [ "1P 4P 7m 10m", [ "quartal" ] ],
  "64": ["5P 8P 10M"],
  "5": [ "1P 5P" ],
  "M": [ "1P 3M 5P", [ "Major", "" ] ],
  "M#5": [ "1P 3M 5A", [ "augmented", "maj#5", "Maj#5", "+", "aug" ] ],
  "M#5add9": [ "1P 3M 5A 9M", [ "+add9" ] ],
  "M13": [ "1P 3M 5P 7M 9M 13M", [ "maj13", "Maj13" ] ],
  "M13#11": [ "1P 3M 5P 7M 9M 11A 13M", [ "maj13#11", "Maj13#11", "M13+4", "M13#4" ] ],
  "M6": [ "1P 3M 5P 13M", [ "6" ] ],
  "M6#11": [ "1P 3M 5P 6M 11A", [ "M6b5", "6#11", "6b5" ] ],
  "M69": [ "1P 3M 5P 6M 9M", [ "69" ] ],
  "M69#11": [ "1P 3M 5P 6M 9M 11A" ],
  "M7#11": [ "1P 3M 5P 7M 11A", [ "maj7#11", "Maj7#11", "M7+4", "M7#4" ] ],
  "M7#5": [ "1P 3M 5A 7M", [ "maj7#5", "Maj7#5", "maj9#5", "M7+" ] ],
  "M7#5sus4": [ "1P 4P 5A 7M" ],
  "M7#9#11": [ "1P 3M 5P 7M 9A 11A" ],
  "M7add13": [ "1P 3M 5P 6M 7M 9M" ],
  "M7b5": [ "1P 3M 5d 7M" ],
  "M7b6": [ "1P 3M 6m 7M" ],
  "M7b9": [ "1P 3M 5P 7M 9m" ],
  "M7sus4": [ "1P 4P 5P 7M" ],
  "M9": [ "1P 3M 5P 7M 9M", [ "maj9", "Maj9" ] ],
  "M9#11": [ "1P 3M 5P 7M 9M 11A", [ "maj9#11", "Maj9#11", "M9+4", "M9#4" ] ],
  "M9#5": [ "1P 3M 5A 7M 9M", [ "Maj9#5" ] ],
  "M9#5sus4": [ "1P 4P 5A 7M 9M" ],
  "M9b5": [ "1P 3M 5d 7M 9M" ],
  "M9sus4": [ "1P 4P 5P 7M 9M" ],
  "Madd9": [ "1P 3M 5P 9M", [ "2", "add9", "add2" ] ],
  "Maj7": [ "1P 3M 5P 7M", [ "maj7", "M7" ] ],
  "Mb5": [ "1P 3M 5d" ],
  "Mb6": [ "1P 3M 13m" ],
  "Msus2": [ "1P 2M 5P", [ "add9no3", "sus2" ] ],
  "Msus4": [ "1P 4P 5P", [ "sus", "sus4" ] ],
  "addb9": [ "1P 3M 5P 9m" ],
  "7": [ "1P 3M 5P 7m", [ "Dominant", "Dom" ] ],
  "9": [ "1P 3M 5P 7m 9M", [ "79" ] ],
  "11": [ "1P 5P 7m 9M 11P" ],
  "13": [ "1P 3M 5P 7m 9M 13M", [ "13_" ] ],
  "11b9": [ "1P 5P 7m 9m 11P" ],
  "13#11": [ "1P 3M 5P 7m 9M 11A 13M", [ "13+4", "13#4" ] ],
  "13#9": [ "1P 3M 5P 7m 9A 13M", [ "13#9_" ] ],
  "13#9#11": [ "1P 3M 5P 7m 9A 11A 13M" ],
  "13b5": [ "1P 3M 5d 6M 7m 9M" ],
  "13b9": [ "1P 3M 5P 7m 9m 13M" ],
  "13b9#11": [ "1P 3M 5P 7m 9m 11A 13M" ],
  "13no5": [ "1P 3M 7m 9M 13M" ],
  "13sus4": [ "1P 4P 5P 7m 9M 13M", [ "13sus" ] ],
  "69#11": [ "1P 3M 5P 6M 9M 11A" ],
  "7#11": [ "1P 3M 5P 7m 11A", [ "7+4", "7#4", "7#11_", "7#4_" ] ],
  "7#11b13": [ "1P 3M 5P 7m 11A 13m", [ "7b5b13" ] ],
  "7#5": [ "1P 3M 5A 7m", [ "+7", "7aug", "aug7" ] ],
  "7#5#9": [ "1P 3M 5A 7m 9A", [ "7alt", "7#5#9_", "7#9b13_" ] ],
  "7#5b9": [ "1P 3M 5A 7m 9m" ],
  "7#5b9#11": [ "1P 3M 5A 7m 9m 11A" ],
  "7#5sus4": [ "1P 4P 5A 7m" ],
  "7#9": [ "1P 3M 5P 7m 9A", [ "7#9_" ] ],
  "7#9#11": [ "1P 3M 5P 7m 9A 11A", [ "7b5#9" ] ],
  "7#9#11b13": [ "1P 3M 5P 7m 9A 11A 13m" ],
  "7#9b13": [ "1P 3M 5P 7m 9A 13m" ],
  "7add6": [ "1P 3M 5P 7m 13M", [ "67", "7add13" ] ],
  "7b13": [ "1P 3M 7m 13m" ],
  "7b5": [ "1P 3M 5d 7m" ],
  "7b6": [ "1P 3M 5P 6m 7m" ],
  "7b9": [ "1P 3M 5P 7m 9m" ],
  "7b9#11": [ "1P 3M 5P 7m 9m 11A", [ "7b5b9" ] ],
  "7b9#9": [ "1P 3M 5P 7m 9m 9A" ],
  "7b9b13": [ "1P 3M 5P 7m 9m 13m" ],
  "7b9b13#11": [ "1P 3M 5P 7m 9m 11A 13m", [ "7b9#11b13", "7b5b9b13" ] ],
  "7no5": [ "1P 3M 7m" ],
  "7sus4": [ "1P 4P 5P 7m", [ "7sus" ] ],
  "7sus4b9": [ "1P 4P 5P 7m 9m", [ "susb9", "7susb9", "7b9sus", "7b9sus4", "phryg" ] ],
  "7sus4b9b13": [ "1P 4P 5P 7m 9m 13m", [ "7b9b13sus4" ] ],
  "9#11": [ "1P 3M 5P 7m 9M 11A", [ "9+4", "9#4", "9#11_", "9#4_" ] ],
  "9#11b13": [ "1P 3M 5P 7m 9M 11A 13m", [ "9b5b13" ] ],
  "9#5": [ "1P 3M 5A 7m 9M", [ "9+" ] ],
  "9#5#11": [ "1P 3M 5A 7m 9M 11A" ],
  "9b13": [ "1P 3M 7m 9M 13m" ],
  "9b5": [ "1P 3M 5d 7m 9M" ],
  "9no5": [ "1P 3M 7m 9M" ],
  "9sus4": [ "1P 4P 5P 7m 9M", [ "9sus" ] ],
  "m": [ "1P 3m 5P", [ "minor" ] ],
  "m#5": [ "1P 3m 5A", [ "m+", "mb6" ] ],
  "m11": [ "1P 3m 5P 7m 9M 11P", [ "_11" ] ],
  "m11A 5": [ "1P 3m 6m 7m 9M 11P" ],
  "m11b5": [ "1P 3m 7m 12d 2M 4P", [ "h11", "_11b5" ] ],
  "m13": [ "1P 3m 5P 7m 9M 11P 13M", [ "_13" ] ],
  "m6": [ "1P 3m 4P 5P 13M", [ "_6" ] ],
  "m69": [ "1P 3m 5P 6M 9M", [ "_69" ] ],
  "m7": [ "1P 3m 5P 7m", [ "minor7", "_", "_7" ] ],
  "m7#5": [ "1P 3m 6m 7m" ],
  "m7add11": [ "1P 3m 5P 7m 11P", [ "m7add4" ] ],
  "m7b5": [ "1P 3m 5d 7m", [ "half-diminished", "h7", "_7b5" ] ],
  "m9": [ "1P 3m 5P 7m 9M", [ "_9" ] ],
  "m9#5": [ "1P 3m 6m 7m 9M" ],
  "m9b5": [ "1P 3m 7m 12d 2M", [ "h9", "-9b5" ] ],
  "mMaj7": [ "1P 3m 5P 7M", [ "mM7", "_M7" ] ],
  "mMaj7b6": [ "1P 3m 5P 6m 7M", [ "mM7b6" ] ],
  "mM9": [ "1P 3m 5P 7M 9M", [ "mMaj9", "-M9" ] ],
  "mM9b6": [ "1P 3m 5P 6m 7M 9M", [ "mMaj9b6" ] ],
  "mb6M7": [ "1P 3m 6m 7M" ],
  "mb6b9": [ "1P 3m 6m 9m" ],
  "o": [ "1P 3m 5d", [ "mb5", "dim" ] ],
  "o7": [ "1P 3m 5d 13M", [ "diminished", "m6b5", "dim7" ] ],
  "o7M7": [ "1P 3m 5d 6M 7M" ],
  "oM7": [ "1P 3m 5d 7M" ],
  "sus24": [ "1P 2M 4P 5P", [ "sus4add9" ] ],
  "+add#9": [ "1P 3M 5A 9A" ],
  "madd4": [ "1P 3m 4P 5P" ],
  "madd9": [ "1P 3m 5P 9M" ]
}

},{}],56:[function(require,module,exports){
'use strict';

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var noteParser = require('note-parser');
var tonalArray = require('tonal-array');

var DATA = require('./chords.json')

var dict = tonalDictionary.fromName(tonalPitch.parseIvl, DATA)

/**
 * Create chords by chord type or intervals and tonic. The returned chord is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the chord type, intervals or notes
 * @param {String} tonic - the chord tonic (or false to get intervals)
 * @return {Array} the chord notes
 *
 * @example
 * var chord = require('tonal-chord')
 * // get chord notes using type and tonic
 * chord.build('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get chord intervals (tonic false)
 * chord.build('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * const maj7 = chord.build('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // create chord from intervals
 * chord.build('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return tonalArray.harmonize(dict(src) || src, tonic)
}

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * import { chordNames } from 'tonal-chords'
 * chordNames() // => ['maj7', ...]
 */
var names$1 = tonalDictionary.names(DATA)

/**
 * Get chord notes from chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the chord notes
 *
 * @example
 * import { fromName } from 'tonal-chords'
 * fromName('C7') // => ['C', 'E', 'G', 'Bb']
 * fromName('CMaj7') // => ['C', 'E', 'G', 'B']
 */
function get (name) {
  var p = noteParser.regex().exec(name)
  if (!p) return []
  // it has note and chord name
  if (p[4]) return build(p[4], p[1] + p[2] + p[3])
  // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
  return build(p[3], p[1] + p[2])
}

exports.build = build;
exports.names = names$1;
exports.get = get;
},{"./chords.json":55,"note-parser":57,"tonal-array":58,"tonal-dictionary":62,"tonal-pitch":63}],57:[function(require,module,exports){
'use strict'

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true if the note is the tonic of something.
 * If true, en extra tonicOf property is returned. It's false by default.
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... It can have negative values: -1 = Cb.
 * Can detect pitch class enhramonics.
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || !isTonic && m[4]) return null
  tuning = tuning || 440

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  p.chroma = SEMITONES[p.step] + p.alt
  if (m[3]) {
    p.oct = +m[3]
    p.midi = p.chroma + 12 * (p.oct + 1)
    p.freq = Math.pow(2, (p.midi - 69) / 12) * tuning
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

// add a property getter to a lib
function getter (lib, name) {
  lib[name] = function (src) {
    var p = parse(src)
    return p && (typeof p[name] !== 'undefined') ? p[name] : null
  }
  return lib
}

var PROPS = ['letter', 'acc', 'pc', 'step', 'alt', 'chroma', 'oct', 'midi', 'freq']
var parser = PROPS.reduce(getter, {})
parser.regex = regex
parser.parse = parse
module.exports = parser

// extra API docs
/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String} note - the note name
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 */
/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 */

},{}],58:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');
var tonalNotation = require('tonal-notation');
var tonalTranspose = require('tonal-transpose');
var tonalDistance = require('tonal-distance');

function id (x) { return x }

// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/

/**
 * Convert anything to array. Speifically, split string separated by spaces,
 * commas or bars. The arrays are passed without modifications and the rest of
 * the objects are wrapped.
 *
 * This function always returns an array (null or undefined values are converted
 * to empty arrays)
 *
 * Thanks to this function, the rest of the functions of this module accepts
 * any object (or more useful: strings) as an array parameter.
 *
 * @param {*} source - the thing to get an array from
 * @return {Array} the object as an array
 *
 * @example
 * import { asArr } from 'tonal-arrays'
 * asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
 */
function asArr (src) {
  return tonalNotation.isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}

/**
 * Return a new array with the elements mapped by a function.
 * Basically the same as the JavaScript standard `array.map` but with
 * two enhacements:
 *
 * - Arrays can be expressed as strings (see [asArr])
 * - This function can be partially applied. This is useful to create _mapped_
 * versions of single element functions. For an excellent introduction of
 * the adventages [read this](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)
 *
 * @param {Function} fn - the function
 * @param {Array|String} arr - the array to be mapped
 * @return {Array}
 * @example
 * var arr = require('tonal-arr')
 * var toUp = arr.map(function(e) { return e.toUpperCase() })
 * toUp('a b c') // => ['A', 'B', 'C']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.map(tonal.transpose('M3'), 'C D E') // => ['E', 'F#', 'G#']
 */
function map (fn, list) {
  return arguments.length > 1 ? map(fn)(list)
    : function (l) { return asArr(l).map(fn) }
}

/**
 * Compact map: map an array with a function and remove nulls.
 * Can be partially applied.
 * @param {Function} fn
 * @param {Array|String} list
 * @return {Array}
 * @see map
 */
function cMap (fn, list) {
  if (arguments.length === 1) return function (l) { return cMap(fn, list) }
  return map(fn, list).filter(id)
}

/**
 * Return a copy of the array with the null values removed
 * @param {String|Array} list
 * @return {Array}
 */
function compact (arr) { return asArr(arr).filter(id) }

/**
 * Filter an array with a function. Again, almost the same as JavaScript standard
 * filter function but:
 * - It accepts strings as arrays
 * - Can be partially applied
 *
 * @param {Function} fn
 * @param {String|Array} arr
 * @return {Array}
 */
function filter (fn, list) {
  return arguments.length > 1 ? filter(fn)(list)
    : function (l) { return asArr(l).filter(fn) }
}

/**
 * Given a list of notes, return the distance from the first note to the rest.
 * @param {Array|String} notes - the list of notes
 * @return {Array} the intervals
 * @example
 * tonal.harmonics('C E g') // => ['1P', '3M', '5P']
 */
function harmonics (list) {
  var a = asArr(list)
  return a.length ? a.map(tonalDistance.distance(a[0])).filter(id) : a
}

/**
 * Given an array of intervals, create a function that harmonizes a
 * note with this intervals. Given a list of notes, return a function that
 * transpose the notes by an interval.
 *
 * @param {Array|String} ivls - the list of pitches
 * @return {Function} The harmonizer
 * @example
 * import { harmonizer } from 'tonal-arrays'
 * var maj7 = harmonizer('P1 M3 P5 M7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * var C = harmonizer('C D E')
 * C('M3') // => ['E', 'G#', 'B']
 */
function harmonizer (list) {
  return function (tonic) {
    return cMap(tonalTranspose.tr(tonic || 'P1'), list)
  }
}

/**
 * Harmonizes a note with an array of intervals. It's a layer of sintatic
 * sugar over `harmonizer`.
 *
 * @function
 * @param {String|Array} ivl - the array of intervals
 * @param {String|Pitch} note - the note to be harmonized
 * @return {Array} the resulting notes
 * @example
 * var tonal = require('tonal')
 * tonal.harmonise('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
 */
var harmonize = function (list, pitch) {
  return arguments.length > 1 ? harmonizer(list)(pitch) : harmonizer(list)
}

// a custom height function that
// - returns -Infinity for non-pitch objects
// - assumes pitch classes has octave -10 (so are sorted before that notes)
var objHeight = function (p) {
  if (!p) return -Infinity
  var f = p[1] * 7
  var o = tonalNotation.isNum(p[2]) ? p[2] : -Math.floor(f / 12) - 10
  return f + o * 12
}

// ascending comparator
function ascComp (a, b) { return objHeight(a) - objHeight(b) }
// descending comparator
function descComp (a, b) { return -ascComp(a, b) }

/**
 * Sort an array or notes or intervals. It uses the JavaScript standard sort
 * function.
 *
 * @param {Boolean|Function} comp - the comparator. `true` means use an
 * ascending comparator, `false` a descending comparator, or you can pass a
 * custom comparator (that receives pitches in array notation)
 * @param {Array|String} arr - the array of notes or intervals
 * @example
 * import { sort } from 'tonal-arrays'
 * sort(true, 'D E C') // => ['C', 'D', 'E']
 * @example
 * var tonal = require('tonal')
 * tonal.sort(false, 'D E C') // => ['E', 'D', 'C']
 */
function sort (comp, list) {
  if (arguments.length > 1) return sort(comp)(list)
  var fn = comp === true || comp === null ? ascComp
    : comp === false ? descComp : comp
  return listFn(function (arr) {
    return arr.sort(fn)
  })
}

/**
 * Randomizes the order of the specified array using the Fisher–Yates shuffle.
 *
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * import { shuffle } from 'tonal-arrays'
 * @example
 * var tonal = require('tonal')
 * tonal.shuffle('C D E F')
 */
var shuffle = listFn(function (arr) {
  var i, t
  var m = arr.length
  while (m) {
    i = Math.random() * m-- | 0
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
  }
  return arr
})

// #### Transform lists in array notation
function asPitchStr (p) { return tonalPitch.strPitch(p) || p }
function listToStr (v) {
  return tonalPitch.isPitch(v) ? tonalPitch.strPitch(v)
    : tonalNotation.isArr(v) ? v.map(asPitchStr)
    : v
}

/**
 * Decorates a function to so it's first parameter is an array of pitches in
 * array notation. Also, if the return value is a pitch or an array of pitches
 * in array notation, it convert backs to strings.
 *
 * @function
 * @param {Function} fn - the function to decorate
 * @return {Function} the decorated function
 * @example
 * import { listFn } from 'tonal-arrays'
 * var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
 * octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
 */
function listFn (fn) {
  return function (list) {
    var arr = asArr(list).map(tonalPitch.asPitch)
    var res = fn(arr)
    return listToStr(res)
  }
}

exports.asArr = asArr;
exports.map = map;
exports.cMap = cMap;
exports.compact = compact;
exports.filter = filter;
exports.harmonics = harmonics;
exports.harmonizer = harmonizer;
exports.harmonize = harmonize;
exports.sort = sort;
exports.shuffle = shuffle;
exports.listFn = listFn;
},{"tonal-distance":59,"tonal-notation":60,"tonal-pitch":63,"tonal-transpose":61}],59:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');

// substract two pitches
function substr (a, b) {
  if (!a || !b || a[1].length !== b[1].length) return null
  var f = tonalPitch.fifths(b) - tonalPitch.fifths(a)
  if (tonalPitch.isPC(a)) return tonalPitch.pitch(f, -Math.floor(f * 7 / 12), 1)
  var o = tonalPitch.focts(b) - tonalPitch.focts(a)
  var d = tonalPitch.height(b) - tonalPitch.height(a) < 0 ? -1 : 1
  return tonalPitch.pitch(d * f, d * o, d)
}

/**
 * Find distance between two pitches. Both pitches MUST be of the same type.
 * Distances between pitch classes always returns ascending intervals.
 * Distances between intervals substract one from the other.
 *
 * @param {Pitch|String} from - distance from
 * @param {Pitch|String} to - distance to
 * @return {Interval} the distance between pitches
 * @example
 * var tonal = require('tonal')
 * tonal.distance('C2', 'C3') // => 'P8'
 * tonal.distance('G', 'B') // => 'M3'
 * tonal.distance('M2', 'P5') // => 'P4'
 */
function interval (a, b) {
  if (arguments.length === 1) return function (b) { return distance(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var i = substr(pa, pb)
  // if a and b are in array notation, no conversion back
  return a === pa && b === pb ? i : tonalPitch.strIvl(i)
}

/**
 * An alias for `distance`
 * @function
 */
var distance = interval

exports.interval = interval;
exports.distance = distance;
},{"tonal-pitch":63}],60:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.notation = global.notation || {})));
}(this, function (exports) { 'use strict';

  var isArr = Array.isArray
  function isNum (x) { return typeof x === 'number' }
  function isStr (x) { return typeof x === 'string' }

  // NOTE LETTERS
  // ============

  // Given a letter, return step
  function toStep (l) {
    var s = 'CDEFGAB'.indexOf(l.toUpperCase())
    return s < 0 ? null : s
  }

  /**
   * Is a valid step number
   */
  function isStep (d) { return !(d < 0 || d > 6) }

  /**
   * Given a step, return a letter
   */
  function toLetter (s) {
    return isStep(s) ? 'CDEFGAB'.charAt(s) : null
  }

  // ACCIDENTALS
  // ===========

  function areFlats (s) { return /^b+$/.test(s) }
  function areSharps (s) { return /^#+$/.test(s) }

  function toAlt (s) {
    return s === '' ? 0
      : areFlats(s) ? -s.length
      : areSharps(s) ? s.length
      : null
  }

  function fillStr (s, num) { return Array(num + 1).join(s) }

  function toAcc (n) {
    return n === 0 ? ''
      : n < 0 ? fillStr('b', -n)
      : fillStr('#', n)
  }

  exports.isArr = isArr;
  exports.isNum = isNum;
  exports.isStr = isStr;
  exports.toStep = toStep;
  exports.isStep = isStep;
  exports.toLetter = toLetter;
  exports.areFlats = areFlats;
  exports.areSharps = areSharps;
  exports.toAlt = toAlt;
  exports.toAcc = toAcc;

}));
},{}],61:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');

function trBy (i, p) {
  var t = tonalPitch.pType(p)
  if (!t) return null
  var f = tonalPitch.fifths(i) + tonalPitch.fifths(p)
  if (tonalPitch.isPC(p)) return ['tnlp', [f]]
  var o = tonalPitch.focts(i) + tonalPitch.focts(p)
  if (t === 'note') return ['tnlp', [f, o]]
  var d = tonalPitch.height(i) + tonalPitch.height(p) < 0 ? -1 : 1
  return ['tnlp', [d * f, d * o], d]
}

/**
 * Transpose notes. Can be used to add intervals. At least one of the parameter
 * is expected to be an interval. If not, it returns null.
 *
 * @param {String|Pitch} a - a note or interval
 * @param {String|Pitch} b - a note or interavl
 * @return {String|Pitch} the transposed pitch or null if not valid parameters
 */
function transpose (a, b) {
  if (arguments.length === 1) return function (b) { return transpose(a, b) }
  var pa = tonalPitch.asPitch(a)
  var pb = tonalPitch.asPitch(b)
  var r = tonalPitch.isIvlPitch(pa) ? trBy(pa, pb)
    : tonalPitch.isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : tonalPitch.strPitch(r)
}

/**
 * An alias for `transpose`
 * @function
 */
var tr = transpose

/**
 * Transpose a tonic a number of perfect fifths. It can be partially applied.
 *
 * @function
 * @param {Pitch|String} tonic
 * @param {Integer} number - the number of times
 * @return {String|Pitch} the transposed note
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D5'
 */
function trFifths (t, n) {
  if (arguments.length > 1) return trFifths(t)(n)
  return function (n) {
    return tr(t, tonalPitch.pitch(n, 0, 1))
  }
}

exports.transpose = transpose;
exports.tr = tr;
exports.trFifths = trFifths;
},{"tonal-pitch":63}],62:[function(require,module,exports){
'use strict';

function id (x) { return x }

function fromName (parse, raw, name) {
  if (arguments.length > 2) return fromName(parse, raw)(name)
  var data = Object.keys(raw).reduce(function (d, k) {
    // add intervals
    d[k] = raw[k][0].split(' ').map(parse || id)
    // add alias
    if (raw[k][1]) raw[k][1].forEach(function (a) { d[a] = d[k] })
    return d
  }, {})
  return function (n) {
    return data[n]
  }
}

function names (raw, alias) {
  if (arguments.length > 1) return names(raw)(alias)
  var main = Object.keys(raw)
  var aliases = main.reduce(function (a, k) {
    if (raw[k][1]) raw[k][1].forEach(function (n) { a.push(n) })
    return a
  }, [])
  return function (alias) {
    return alias ? main.concat(aliases) : main.slice()
  }
}

exports.fromName = fromName;
exports.names = names;
},{}],63:[function(require,module,exports){
'use strict';

var noteParser = require('note-parser');
var intervalNotation = require('interval-notation');
var tonalEncoding = require('tonal-encoding');
var tonalNotation = require('tonal-notation');

/**
 * Create a pitch
 * @param {Integer} fifths - the number of fifths from C or from P1
 * @param {Integer} focts - the number of encoded octaves
 * @param {Integer} dir - (Optional) Only required for intervals. Can be 1 or -1
 * @return {Pitch}
 */
function pitch (fifths, focts, dir) {
  return dir ? ['tnlp', [fifths, focts], dir] : ['tnlp', [fifths, focts]]
}
/**
 * Test if an object is a pitch
 * @param {Pitch}
 * @return {Boolean}
 */
function isPitch (p) { return tonalNotation.isArr(p) && p[0] === 'tnlp' }
/**
 * Encode a pitch
 * @param {Integer} step
 * @param {Integer} alt
 * @param {Integer} oct
 * @param {Integer} dir - (Optional)
 */
function encode$1 (s, a, o, dir) {
  return dir ? ['tnlp', tonalEncoding.encode(s, a, o), dir] : ['tnlp', tonalEncoding.encode(s, a, o)]
}

/**
 * Decode a pitch
 * @param {Pitch} the pitch
 * @return {Array} An array with [step, alt, oct]
 */
function decode$1 (p) {
  return tonalEncoding.decode.apply(null, p[1])
}

/**
 * Get pitch type
 * @param {Pitch}
 * @return {String} 'ivl' or 'note' or null if not a pitch
 */
function pType (p) {
  return !isPitch(p) ? null
    : p[2] ? 'ivl' : 'note'
}
/**
 * Test if is a pitch note (with or without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isNotePitch (p) { return pType(p) === 'note' }
/**
 * Test if is an interval
 * @param {Pitch}
 * @return {Boolean}
 */
function isIvlPitch (p) { return pType(p) === 'ivl' }
/**
 * Test if is a pitch class (a pitch note without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
function isPC (p) { return isPitch(p) && p[1].length === 1 }

/**
 * Get direction of a pitch (even for notes)
 * @param {Pitch}
 * @return {Integer} 1 or -1
 */
function dir (p) { return p[2] === -1 ? -1 : 1 }

/**
 * Get encoded fifths from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
/**
 * Get encoded octaves from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
/**
 * Get height of a pitch.
 * @param {Pitch}
 * @return {Integer}
 */
function height (p) { return fifths(p) * 7 + focts(p) * 12 }

/**
 * Get chroma of a pitch. The chroma is a number between 0 and 11 to represent
 * the position of a pitch inside an octave. Is the numeric equivlent of a
 * pitch class.
 *
 * @param {Pitch}
 * @return {Integer}
 */
function chr (p) {
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

// memoize parsers
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (!tonalNotation.isStr(str)) return null
    return cache[str] || (cache[str] = fn(str))
  }
}

/**
 * Parse a note
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid note string
 */
var parseNote = memoize(function (s) {
  var p = noteParser.parse(s)
  return p ? encode$1(p.step, p.alt, p.oct) : null
})

/**
 * Parse an interval
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid interval string
 */
var parseIvl = memoize(function (s) {
  var p = intervalNotation.parse(s)
  if (!p) return null
  return p ? encode$1(p.simple - 1, p.alt, p.oct, p.dir) : null
})

/**
 * Parse a note or an interval
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid pitch string
 */
function parsePitch (s) { return parseNote(s) || parseIvl(s) }

/**
 * Ensure the given object is a note pitch. If is a string, it will be
 * parsed. If not a note pitch or valid note string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
/**
 * Ensure the given object is a interval pitch. If is a string, it will be
 * parsed. If not a interval pitch or valid interval string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
/**
 * Ensure the given object is a pitch. If is a string, it will be
 * parsed. If not a pitch or valid pitch string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

function octStr (n) { return tonalNotation.isNum(n) ? n : '' }

/**
 * Convert a note pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strNote (p) {
  if (!isNotePitch(p)) return null
  var d = decode$1(p)
  // d = [step, alt, oct]
  return tonalNotation.toLetter(d[0]) + tonalNotation.toAcc(d[1]) + octStr(d[2])
}

/**
 * Convert a interval pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
function strIvl (p) {
  if (!isIvlPitch(p)) return null
  // decode to [step, alt, oct]
  var d = decode$1(p)
  // d = [step, alt, oct]
  var num = d[0] + 1 + 7 * d[2]
  return p[2] * num + intervalNotation.altToQ(num, d[1])
}

/**
 * Convert a pitch to string representation (either notes or intervals)
 * @param {Pitch}
 * @return {String}
 */
function strPitch (p) { return strNote(p) || strIvl(p) }

function decorator (is, parse, str) {
  return function (fn) {
    return function (v) {
      var i = is(v)
      // if the value is in pitch notation no conversion
      if (i) return fn(v)
      // else parse the pitch
      var p = parse(v)
      // if parsed, apply function and back to string
      return p ? str(fn(p)) : null
    }
  }
}

/**
 * Decorate a function to work internally with note pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a note pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var noteFn = decorator(isNotePitch, parseNote, strNote)
/**
 * Decorate a function to work internally with interval pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a interval pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
/**
 * Decorate a function to work internally with pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
var pitchFn = decorator(isPitch, parsePitch, strPitch)

exports.pitch = pitch;
exports.isPitch = isPitch;
exports.encode = encode$1;
exports.decode = decode$1;
exports.pType = pType;
exports.isNotePitch = isNotePitch;
exports.isIvlPitch = isIvlPitch;
exports.isPC = isPC;
exports.dir = dir;
exports.fifths = fifths;
exports.focts = focts;
exports.height = height;
exports.chr = chr;
exports.parseNote = parseNote;
exports.parseIvl = parseIvl;
exports.parsePitch = parsePitch;
exports.asNotePitch = asNotePitch;
exports.asIvlPitch = asIvlPitch;
exports.asPitch = asPitch;
exports.strNote = strNote;
exports.strIvl = strIvl;
exports.strPitch = strPitch;
exports.noteFn = noteFn;
exports.ivlFn = ivlFn;
exports.pitchFn = pitchFn;
},{"interval-notation":64,"note-parser":57,"tonal-encoding":65,"tonal-notation":66}],64:[function(require,module,exports){
'use strict'

// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Parse a string with an interval in [shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * and returns an object with interval properties
 *
 * @param {String} str - the string with the interval
 * @return {Object} an object properties or null if not valid interval string
 * The returned object contains:
 * - `num`: the interval number
 * - `q`: the interval quality string (M is major, m is minor, P is perfect...)
 * - `simple`: the simplified number (from 1 to 7)
 * - `dir`: the interval direction (1 ascending, -1 descending)
 * - `type`: the interval type (P is perfectable, M is majorable)
 * - `alt`: the alteration, a numeric representation of the quality
 * - `oct`: the number of octaves the interval spans. 0 for simple intervals.
 * - `size`: the size of the interval in semitones
 * @example
 * var parse = require('interval-notation').parse
 * parse('M3')
 * // => { num: 3, q: 'M', dir: 1, simple: 3,
 * //      type: 'M', alt: 0, oct: 0, size: 4 }
 */
function parse (str) {
  if (typeof str !== 'string') return null
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var i = { num: +(m[3] || m[8]), q: m[4] || m[6] }
  i.dir = (m[2] || m[7]) === '-' ? -1 : 1
  var step = (i.num - 1) % 7
  i.simple = step + 1
  i.type = TYPES[step]
  i.alt = qToAlt(i.type, i.q)
  i.oct = Math.floor((i.num - 1) / 7)
  i.size = i.dir * (SIZES[step] + i.alt + 12 * i.oct)
  return i
}
var SIZES = [0, 2, 4, 5, 7, 9, 11]

var TYPES = 'PMMPPMM'
/**
 * Get the type of interval. Can be perfectavle ('P') or majorable ('M')
 * @param {Integer} num - the interval number
 * @return {String} `P` if it's perfectable, `M` if it's majorable.
 */
function type (num) {
  return TYPES[(num - 1) % 7]
}

function dirStr (dir) { return dir === -1 ? '-' : '' }
function num (simple, oct) { return simple + 7 * oct }

/**
 * Build a shorthand interval notation string from properties.
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.shorthand(3, 0, 0, 1) // => 'M3'
 * interval.shorthand(3, -1, 0, -1) // => 'm-3'
 * interval.shorthand(3, 1, 1, 1) // => 'A10'
 */
function shorthand (simple, alt, oct, dir) {
  return altToQ(simple, alt) + dirStr(dir) + num(simple, oct)
}
/**
 * Build a special shorthand interval notation string from properties.
 * The special shorthand interval notation changes the order or the standard
 * shorthand notation so instead of 'M-3' it returns '-3M'.
 *
 * The standard shorthand notation has a string 'A4' (augmented four) that can't
 * be differenciate from 'A4' (the A note in 4th octave), so the purpose of this
 * notation is avoid collisions
 *
 * @param {Integer} simple - the interval simple number (from 1 to 7)
 * @param {Integer} alt - the quality expressed in numbers. 0 means perfect
 * or major, depending of the interval number.
 * @param {Integer} oct - the number of octaves the interval spans.
 * 0 por simple intervals. Positive number.
 * @param {Integer} dir - the interval direction: 1 ascending, -1 descending.
 * @example
 * var interval = require('interval-notation')
 * interval.build(3, 0, 0, 1) // => '3M'
 * interval.build(3, -1, 0, -1) // => '-3m'
 * interval.build(3, 1, 1, 1) // => '10A'
 */
function build (simple, alt, oct, dir) {
  return dirStr(dir) + num(simple, oct) + altToQ(simple, alt)
}

/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {Integer|String} num - the interval number or a string representing
 * the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qToAlt('M', 'P') // => null (majorables can't be perfect)
 */
function qToAlt (num, q) {
  var t = typeof num === 'number' ? type(num) : num
  if (q === 'M' && t === 'M') return 0
  if (q === 'P' && t === 'P') return 0
  if (q === 'm' && t === 'M') return -1
  if (/^A+$/.test(q)) return q.length
  if (/^d+$/.test(q)) return t === 'P' ? -q.length : -q.length - 1
  return null
}

function fillStr(s, n) { return Array(Math.abs(n) + 1).join(s) }
/**
 * Get interval quality from interval type and alteration
 *
 * @function
 * @param {Integer|String} num - the interval number of the the interval
 * type ('M' for majorables, 'P' for perfectables)
 * @param {Integer} alt - the interval alteration
 * @return {String} the quality string
 * @example
 * altToQ('M', 0) // => 'M'
 */
function altToQ (num, alt) {
  var t = typeof num === 'number' ? type(Math.abs(num)) : num
  if (alt === 0) return t === 'M' ? 'M' : 'P'
  else if (alt === -1 && t === 'M') return 'm'
  else if (alt > 0) return fillStr('A', alt)
  else if (alt < 0) return fillStr('d', t === 'P' ? alt : alt + 1)
  else return null
}

module.exports = { parse: parse, type: type,
  altToQ: altToQ, qToAlt: qToAlt,
  build: build, shorthand: shorthand }

},{}],65:[function(require,module,exports){
'use strict';

// Encoding pitches into fifhts/octave notation

function isNum (n) { return typeof n === 'number' }

// Map from letter step to number of fifths starting from 'C':
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// Given a number of fifths, return the octaves they span
function fOcts (f) { return Math.floor(f * 7 / 12) }
// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts)

function encode (step, alt, oct) {
  var f = FIFTHS[step] + 7 * alt
  if (!isNum(oct)) return [f]
  var o = oct - FIFTH_OCTS[step] - 4 * alt
  return [f, o]
}

// Return the number of fifths as if it were unaltered
function unaltered (f) {
  var i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// { 0: F, 1: C, 2: G, 3: D, 4: A, 5: E, 6: B}
var STEPS = [3, 0, 4, 1, 5, 2, 6]

function decode (f, o) {
  var step = STEPS[unaltered(f)]
  var alt = Math.floor((f + 1) / 7)
  if (!isNum(o)) return [step, alt]
  var oct = o + 4 * alt + FIFTH_OCTS[step]
  return [step, alt, oct]
}

exports.encode = encode;
exports.decode = decode;
},{}],66:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],67:[function(require,module,exports){
'use strict';

var tonalArray = require('tonal-array');
var tonalTranspose = require('tonal-transpose');
var tonalMidi = require('tonal-midi');
var tonalFilter = require('tonal-filter');

var slice = Array.prototype.slice
function isNum (n) { return typeof n === 'number' }
// convert notes to midi if needed
function asNum (n) { return isNum(n) ? n : tonalMidi.toMidi(n) }
// ascending range
function ascR (b, n) { for (var a = []; n--; a[n] = n + b); return a }
// descending range
function descR (b, n) { for (var a = []; n--; a[n] = b - n); return a }
// create a range between a and b
function ran (a, b) {
  return a === null || b === null ? []
    : a < b ? ascR(a, b - a + 1) : descR(a, a - b + 1)
}

/**
 * Create a numeric range. You supply a list of notes or numbers and it will
 * be conected to create complex ranges.
 *
 * @param {String|Array} list - the list of notes or numbers used
 * @return {Array} an array of numbers or empty array if not vald parameters
 *
 * @example
 * import { range } from 'tonal-range'
 * range('C5 C4') // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
 * // it works with numbers
 * range([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
 * // complex range
 * range('C4 E4 Bb3') // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
 * // can be expressed with a string or array
 * range('C2 C4 C2') === range(['C2', 'C4', 'C2'])
 * // included in tonal package
 * tonal.range('C2 C3')
 */
function range (list) {
  return tonalArray.asArr(list).map(asNum).reduce(function (r, n, i) {
    if (i === 1) return ran(r, n)
    var last = r[r.length - 1]
    return r.concat(ran(last, n).slice(1))
  })
}

/**
 * Create a range of chromatic notes. The altered notes will use flats.
 *
 * @function
 * @param {String|Array} list - the list of notes or midi note numbers
 * @return {Array} an array of note names
 * @example
 * tonal.chromatic('C2 E2 D2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2', 'Eb2', 'D2']
 */
function chromatic (list) {
  var args = arguments.length === 1 ? list : slice.call(arguments)
  return tonalArray.cMap(tonalMidi.fromMidi, range(args))
}

/**
 * Create a range with a cycle of fifths
 * @function
 * @param {Integer} the first step from tonic
 * @param {Integer} the last step from tonic (can be negative)
 * @param {String|Pitch} the tonic
 * @return {Array} a range of cycle of fifths
 * @example
 * var range = require('tonal-ranges')
 * range.cycleOfFifths(0, 6, 'C') // => [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
 */
function cycleOfFifths (s, e, t) {
  return range([s, e]).map(tonalTranspose.trFifths(t))
}

/**
 * Create a scale range. Given a pitch set (a collection of pitch classes),
 * and a start and end it returns a note range.
 *
 * @param {String|Array|Function} scale - the scale to use or a function to
 * convert from midi numbers to note names
 * @param {String|Array} range - a list of notes or midi numbers
 * @return {Array} the scale range, an empty array if not valid source or
 * null if not valid start or end
 * @example
 * var range = require('tonal-ranges')
 * range.scale('C D E F G A B', 'C3 C2')
 * // => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
 */
function scaleRange (src, list) {
  if (arguments.length === 1) return function (l) { return scaleRange(src, l) }
  var fn = typeof src === 'function' ? src : tonalFilter.scaleFilter(src)
  return tonalArray.cMap(fn, range(list))
}

exports.range = range;
exports.chromatic = chromatic;
exports.cycleOfFifths = cycleOfFifths;
exports.scaleRange = scaleRange;
},{"tonal-array":68,"tonal-filter":75,"tonal-midi":76,"tonal-transpose":88}],68:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"dup":58,"tonal-distance":69,"tonal-notation":70,"tonal-pitch":71,"tonal-transpose":88}],69:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59,"tonal-pitch":71}],70:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],71:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63,"interval-notation":72,"note-parser":73,"tonal-encoding":74,"tonal-notation":70}],72:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],73:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],74:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],75:[function(require,module,exports){
'use strict';

var tonalNote = require('tonal-note');
var tonalArray = require('tonal-array');
var tonalMidi = require('tonal-midi');

/**
 * This function filter notes using a scale. Given a scale and a note, it
 * returns the note name if it belongs to the scale or null if not. The
 * note can be given as string or as midi number.
 *
 * This function work with heights instead of names, so the note name returned
 * is not guaranteed to be the same provided (see 'B#3' example)
 *
 * It can be partially applied.
 *
 * @param {String|Array} scale - the scale used to filter
 * @param {String|Pitch|Number} note - the note to be filtered
 * @return {String} the note name or null if note in the pitch classes
 *
 * @example
 * import { scaleFilter } from 'tonal-filter'
 * scaleFilter('C D E', 'C4') // => 'C4'
 * scaleFilter('C D E', 'B#3') // => 'C4'
 * scaleFilter('C D E', 60) // => 'C4'
 * aMajor = scaleFilter('A C# E')
 * [69, 70, 71, 72, 73].map(aMajor) // => [ 'A4', null, null, null, 'C#5' ]
 */
function scaleFilter (notes, m) {
  if (arguments.length > 1) return scaleFilter(notes)(m)
  var scale = tonalArray.map(tonalNote.pc, notes)
  var chromas = tonalArray.map(tonalNote.chroma, scale)
  return function (note) {
    var midi = tonalMidi.toMidi(note)
    var m = midi !== null ? midi - 12 : tonalNote.chroma(note)
    var pcIndex = chromas.indexOf(m % 12)
    return pcIndex > -1 ? scale[pcIndex] + Math.floor(m / 12) : null
  }
}

exports.scaleFilter = scaleFilter;
},{"tonal-array":68,"tonal-midi":76,"tonal-note":82}],76:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tonal-pitch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tonal-pitch'], factory) :
  (factory((global.midi = global.midi || {}),global.tonalPitch));
}(this, function (exports,tonalPitch) { 'use strict';

  /**
   * Test if the given number is a valid midi note number
   * @function
   * @param {Object} num - the thing to be tested
   * @return {Boolean} true if it's a valid midi note number
   */
  function isMidiNum (m) {
    if (m === null || Array.isArray(m)) return false
    return m >= 0 && m < 128
  }

  // To match the general midi specification where `C4` is 60 we must add 12 to
  // `height` function:

  /**
   * Get midi number for a pitch
   * @function
   * @param {Array|String} pitch - the pitch
   * @return {Integer} the midi number or null if not valid pitch
   * @example
   * midi('C4') // => 60
   */
  function toMidi (val) {
    var p = tonalPitch.asNotePitch(val)
    return p && !tonalPitch.isPC(p) ? tonalPitch.height(p) + 12
      : isMidiNum(val) ? +val
      : null
  }

  var FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ')
  var SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ')

  function fromMidiFn (pcs) {
    return function (m) {
      var pc = pcs[m % 12]
      var o = Math.floor(m / 12) - 1
      return pc + o
    }
  }

  /**
   * Given a midi number, returns a note name. The altered notes will have
   * flats.
   * @function
   * @param {Integer} midi - the midi note number
   * @return {String} the note name
   * @example
   * tonal.fromMidi(61) // => 'Db4'
   */
  var fromMidi = fromMidiFn(FLATS)

  /**
   * Given a midi number, returns a note name. The altered notes will have
   * sharps.
   * @function
   * @param {Integer} midi - the midi note number
   * @return {String} the note name
   * @example
   * tonal.fromMidiS(61) // => 'C#4'
   */
  var fromMidiS = fromMidiFn(SHARPS)

  exports.isMidiNum = isMidiNum;
  exports.toMidi = toMidi;
  exports.fromMidi = fromMidi;
  exports.fromMidiS = fromMidiS;

}));
},{"tonal-pitch":77}],77:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63,"interval-notation":78,"note-parser":79,"tonal-encoding":80,"tonal-notation":81}],78:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],79:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],80:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],81:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],82:[function(require,module,exports){
'use strict';

var tonalPitch = require('tonal-pitch');
var tonalTranspose = require('tonal-transpose');

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {String|Pitch} note
 * @return {Integer} the chroma
 */
function chroma (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.chr(p) : null
}

/**
 * Given a note (as string or as array notation) returns a string
 * with the note name in scientific notation or null
 * if not valid note
 *
 * @function
 * @param {Pitch|String}
 * @return {String}
 * @example
 * import { noteName } from 'tonal-notes'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(noteName)
 * // => ['C', 'Db3', null, null, 'G##4']
 *
 * @example
 * var tonal = require('tonal')
 * tonal.noteName('cb2') // => 'Cb2'
 * tonal.map(tonal.noteName, 'c db3 2 g+ gx4')
 */
function noteName (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote(p) : null
}

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {String|Pitch}
 * @return {String} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 */
function pc (n) {
  var p = tonalPitch.asNotePitch(n)
  return p ? tonalPitch.strNote([ p[0], [ tonalPitch.fifths(p) ] ]) : null
}

var ASC = tonalPitch.parseIvl('2d')
var DESC = tonalPitch.parseIvl('-2d')

/**
 * Get the enharmonics of a note. It returns an array of three elements: the
 * below enharmonic, the note, and the upper enharmonic
 *
 * @param {String} note - the note to get the enharmonics from
 * @return {Array} an array of pitches ordered by distance to the given one
 *
 * @example
 * enharmonics = require('enharmonics')
 * enharmonics('C') // => ['B#', 'C', 'Dbb']
 * enharmonics('A') // => ['G##', 'A', 'Bbb']
 * enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
 * enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
 */
function enharmonics (pitch) {
  var notes = []
  notes.push(tonalTranspose.tr(DESC, pitch))
  if (notes[0] === null) return null
  notes.push(pitch)
  notes.push(tonalTranspose.tr(ASC, pitch))
  return notes
}

/**
 * An alias for `enharmonics`
 * @function
 */
var enh = enharmonics

/**
 * Get a simpler enharmonic note name from a note if exists
 *
 * @param {String} note - the note to simplify
 * @return {String} the simplfiied note (if not found, return same note)
 *
 * @example
 * var enharmonics = require('enharmonics')
 * enharmonics.simpleEnh('B#3') // => 'C4'
 */
function simpleEnh (pitch) {
  return enharmonics(pitch).reduce(function (simple, next) {
    if (!simple) return next
    return simple.length > next.length ? next : simple
  }, null)
}

exports.chroma = chroma;
exports.noteName = noteName;
exports.pc = pc;
exports.enharmonics = enharmonics;
exports.enh = enh;
exports.simpleEnh = simpleEnh;
},{"tonal-pitch":83,"tonal-transpose":88}],83:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63,"interval-notation":84,"note-parser":85,"tonal-encoding":86,"tonal-notation":87}],84:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],85:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],86:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],87:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],88:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61,"tonal-pitch":89}],89:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63,"interval-notation":90,"note-parser":91,"tonal-encoding":92,"tonal-notation":93}],90:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],91:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],92:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],93:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],94:[function(require,module,exports){
module.exports={
  "lydian": [ "1P 2M 3M 4A 5P 6M 7M" ],
  "major": [ "1P 2M 3M 4P 5P 6M 7M" , [ "ionian" ] ],
  "mixolydian": [ "1P 2M 3M 4P 5P 6M 7m" , [ "dominant" ] ],
  "dorian": [ "1P 2M 3m 4P 5P 6M 7m" ],
  "aeolian": [ "1P 2M 3m 4P 5P 6m 7m" , [ "minor" ] ],
  "phrygian": [ "1P 2m 3m 4P 5P 6m 7m" ],
  "locrian": [ "1P 2m 3m 4P 5d 6m 7m" ],
  "melodic minor": [ "1P 2M 3m 4P 5P 6M 7M" ],
  "melodic minor second mode": [ "1P 2m 3m 4P 5P 6M 7m" ],
  "lydian augmented": [ "1P 2M 3M 4A 5A 6M 7M" ],
  "lydian dominant": [ "1P 2M 3M 4A 5P 6M 7m" , [ "lydian b7" ] ],
  "melodic minor fifth mode": [ "1P 2M 3M 4P 5P 6m 7m" , [ "hindu", "mixolydian b6M" ] ],
  "locrian #2": [ "1P 2M 3m 4P 5d 6m 7m" ],
  "locrian major": [ "1P 2M 3M 4P 5d 6m 7m" , [ "arabian" ] ],
  "altered": [ "1P 2m 3m 3M 5d 6m 7m" , [ "super locrian", "diminished whole tone", "pomeroy" ] ],
  "major pentatonic": [ "1P 2M 3M 5P 6M" , [ "pentatonic" ] ],
  "lydian pentatonic": [ "1P 3M 4A 5P 7M" , [ "chinese" ] ],
  "mixolydian pentatonic": [ "1P 3M 4P 5P 7m" , [ "indian" ] ],
  "locrian pentatonic": [ "1P 3m 4P 5d 7m" , [ "minor seven flat five pentatonic" ] ],
  "minor pentatonic": [ "1P 3m 4P 5P 7m" ],
  "minor six pentatonic": [ "1P 3m 4P 5P 6M" ],
  "minor hexatonic": [ "1P 2M 3m 4P 5P 7M" ],
  "flat three pentatonic": [ "1P 2M 3m 5P 6M" , [ "kumoi" ] ],
  "flat six pentatonic": [ "1P 2M 3M 5P 6m" ],
  "major flat two pentatonic": [ "1P 2m 3M 5P 6M" ],
  "whole tone pentatonic": [ "1P 3M 5d 6m 7m" ],
  "ionian pentatonic": [ "1P 3M 4P 5P 7M" ],
  "lydian #5P pentatonic": [ "1P 3M 4A 5A 7M" ],
  "lydian dominant pentatonic": [ "1P 3M 4A 5P 7m" ],
  "minor #7M pentatonic": [ "1P 3m 4P 5P 7M" ],
  "super locrian pentatonic": [ "1P 3m 4d 5d 7m" ],
  "in-sen": [ "1P 2m 4P 5P 7m" ],
  "iwato": [ "1P 2m 4P 5d 7m" ],
  "hirajoshi": [ "1P 2M 3m 5P 6m" ],
  "kumoijoshi": [ "1P 2m 4P 5P 6m" ],
  "pelog": [ "1P 2m 3m 5P 6m" ],
  "vietnamese 1": [ "1P 3m 4P 5P 6m" ],
  "vietnamese 2": [ "1P 3m 4P 5P 7m" ],
  "prometheus": [ "1P 2M 3M 4A 6M 7m" ],
  "prometheus neopolitan": [ "1P 2m 3M 4A 6M 7m" ],
  "ritusen": [ "1P 2M 4P 5P 6M" ],
  "scriabin": [ "1P 2m 3M 5P 6M" ],
  "piongio": [ "1P 2M 4P 5P 6M 7m" ],
  "major blues": [ "1P 2M 3m 3M 5P 6M" ],
  "minor blues": [ "1P 3m 4P 5d 5P 7m" , [ "blues" ] ],
  "composite blues": [ "1P 2M 3m 3M 4P 5d 5P 6M 7m" ],
  "augmented": [ "1P 2A 3M 5P 5A 7M" ],
  "augmented heptatonic": [ "1P 2A 3M 4P 5P 5A 7M" ],
  "dorian #4": [ "1P 2M 3m 4A 5P 6M 7m" ],
  "lydian diminished": [ "1P 2M 3m 4A 5P 6M 7M" ],
  "whole tone": [ "1P 2M 3M 4A 5A 7m" ],
  "leading whole tone": [ "1P 2M 3M 4A 5A 7m 7M" ],
  "harmonic minor": [ "1P 2M 3m 4P 5P 6m 7M" ],
  "lydian minor": [ "1P 2M 3M 4A 5P 6m 7m" ],
  "neopolitan": [ "1P 2m 3m 4P 5P 6m 7M" ],
  "neopolitan minor": [ "1P 2m 3m 4P 5P 6m 7m" ],
  "neopolitan major": [ "1P 2m 3m 4P 5P 6M 7M" , [ "dorian b2" ] ],
  "neopolitan major pentatonic": [ "1P 3M 4P 5d 7m" ],
  "romanian minor": [ "1P 2M 3m 5d 5P 6M 7m" ],
  "double harmonic lydian": [ "1P 2m 3M 4A 5P 6m 7M" ],
  "diminished": [ "1P 2M 3m 4P 5d 6m 6M 7M" ],
  "harmonic major": [ "1P 2M 3M 4P 5P 6m 7M" ],
  "double harmonic major": [ "1P 2m 3M 4P 5P 6m 7M" , [ "gypsy" ] ],
  "egyptian": [ "1P 2M 4P 5P 7m" ],
  "hungarian minor": [ "1P 2M 3m 4A 5P 6m 7M" ],
  "hungarian major": [ "1P 2A 3M 4A 5P 6M 7m" ],
  "oriental": [ "1P 2m 3M 4P 5d 6M 7m" ],
  "spanish": [ "1P 2m 3M 4P 5P 6m 7m" , [ "phrygian major" ] ],
  "spanish heptatonic": [ "1P 2m 3m 3M 4P 5P 6m 7m" ],
  "flamenco": [ "1P 2m 3m 3M 4A 5P 7m" ],
  "balinese": [ "1P 2m 3m 4P 5P 6m 7M" ],
  "todi raga": [ "1P 2m 3m 4A 5P 6m 7M" ],
  "malkos raga": [ "1P 3m 4P 6m 7m" ],
  "kafi raga": [ "1P 3m 3M 4P 5P 6M 7m 7M" ],
  "purvi raga": [ "1P 2m 3M 4P 4A 5P 6m 7M" ],
  "persian": [ "1P 2m 3M 4P 5d 6m 7M" ],
  "bebop": [ "1P 2M 3M 4P 5P 6M 7m 7M" ],
  "bebop dominant": [ "1P 2M 3M 4P 5P 6M 7m 7M" ],
  "bebop minor": [ "1P 2M 3m 3M 4P 5P 6M 7m" ],
  "bebop major": [ "1P 2M 3M 4P 5P 5A 6M 7M" ],
  "bebop locrian": [ "1P 2m 3m 4P 5d 5P 6m 7m" ],
  "minor bebop": [ "1P 2M 3m 4P 5P 6m 7m 7M" ],
  "mystery #1": [ "1P 2m 3M 5d 6m 7m" ],
  "enigmatic": [ "1P 2m 3M 5d 6m 7m 7M" ],
  "minor six diminished": [ "1P 2M 3m 4P 5P 6m 6M 7M" ],
  "ionian augmented": [ "1P 2M 3M 4P 5A 6M 7M" ],
  "lydian #9": [ "1P 2m 3M 4A 5P 6M 7M" ],
  "ichikosucho": [ "1P 2M 3M 4P 5d 5P 6M 7M" ],
  "six tone symmetric": [ "1P 2m 3M 4P 5A 6M" ]
}

},{}],95:[function(require,module,exports){
'use strict';

var tonalDictionary = require('tonal-dictionary');
var tonalPitch = require('tonal-pitch');
var tonalArray = require('tonal-array');

var DATA = require('./scales.json')

var dict = tonalDictionary.fromName(tonalPitch.parseIvl, DATA)

/**
 * Create scales by scale type or intervals and tonic. The returned scale is an
 * array of notes (or intervals if you specify `false` as tonic)
 *
 * This function is currified
 *
 * @param {String} source - the scale type, intervals or notes
 * @param {String} tonic - the scale tonic (or false to get intervals)
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal.scale')
 * // get scale notes using type and tonic
 * scale.create('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get scale intervals (tonic false)
 * scale.create('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * const maj7 = scale.create('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // create scale from intervals
 * scale.create('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 */
function build (src, tonic) {
  if (arguments.length === 1) return function (t) { return build(src, t) }
  return tonalArray.harmonize(get(src) || src, tonic)
}

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * scaleNames() // => ['maj7', ...]
 */
var names$1 = tonalDictionary.names(DATA)

/**
 * Get scale notes from scale name
 *
 * @param {String} name - the scale name
 * @return {Array} the scale notes
 *
 * @example
 * var scale = require('tonal-scale')
 * scale.get('C7') // => ['C', 'E', 'G', 'Bb']
 * scale.get('CMaj7') // => ['C', 'E', 'G', 'B']
 */
function get (name) {
  var i = name.indexOf(' ')
  var tonic = name.substring(0, i)
  return tonalPitch.parseNote(tonic) ? tonalArray.harmonize(dict(name.substring(i + 1)), tonic)
    : tonalArray.harmonize(dict(name), false)
}

exports.build = build;
exports.names = names$1;
exports.get = get;
},{"./scales.json":94,"tonal-array":96,"tonal-dictionary":100,"tonal-pitch":101}],96:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"dup":58,"tonal-distance":97,"tonal-notation":98,"tonal-pitch":101,"tonal-transpose":99}],97:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59,"tonal-pitch":101}],98:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],99:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61,"tonal-pitch":101}],100:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"dup":62}],101:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63,"interval-notation":102,"note-parser":103,"tonal-encoding":104,"tonal-notation":105}],102:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],103:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],104:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65}],105:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}]},{},[1]);
