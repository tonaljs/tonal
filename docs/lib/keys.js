/* global Vex tonal */
var snabbdom = require('snabbdom')
var patch = snabbdom.init([ // Init patch function with choosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners') // attaches event listeners
])
var h = require('snabbdom/h')

function renderer (base, component) {
  var prev = null
  return function (state, override) {
    if (override) state = Object.assign({}, state, override)
    var node = component(state)
    patch(prev || base, node)
    prev = node
  }
}

var MODES = [ 'major', 'minor', 'ionian', 'dorian', 'phrygian', 'lydian',
  'mixolydian', 'aeolian', 'locrian' ]
var TONICS = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ')

var keyfn = (state) => state.tonic + ' ' + state.mode
function KeyProperties (state) {
  return h('div.app', {}, [
    Selector({ options: TONICS, current: state.tonic,
      onClick: (t) => { App(state, { tonic: t }) }
    }),
    Selector({ options: MODES, current: state.mode,
      onClick: (m) => { App(state, { mode: m }) }
    }),
    h('h3.code', keyfn(state)),
    KeyStave(state),
    h('div.code', tonal.key.altered(keyfn(state)).join(', '))
  ])
}

function KeyStave (state) {
  var id = state.tonic + state.mode
  var vex = (node) => renderKeyStave(keyfn(state), node.elm)
  return h('figure', [
    h('canvas#scale' + id,
      { props: { width: 510, height: 100 },
        hook: { insert: vex, update: (_, node) => vex(node) } })
  ])
}

function renderKeyStave (key, canvas) {
  var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS)

  var ctx = renderer.getContext()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var stave = new Vex.Flow.Stave(0, 0, 500)
  stave.addClef('treble').setContext(ctx).draw()
}

function Selector (state) {
  return h('div.selector', state.options.map(function (mode) {
    return h('a.item', {
      props: { href: 'javascript:false' },
      class: { active: mode === state.current },
      on: { click: [state.onClick, mode] }
    }, mode)
  }))
}

var el = document.getElementById('key-properties-app')
var App = renderer(el, KeyProperties)
App({ tonic: 'C', mode: 'major' })
