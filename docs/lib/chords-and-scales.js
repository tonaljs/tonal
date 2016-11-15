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
