var score = require('scorejs')
var player = require('scorejs/ext/player')
var snabbdom = require('snabbdom')
var patch = snabbdom.init([ // Init patch function with choosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
])
var h = require('snabbdom/h')
var section = document.getElementById('scales-app')
var ac = new AudioContext()

var tonics = 'C Db D Eb E F F# G Ab A Bb B'.split(' ')
var prevNode = false

render({ tonic: 'C', scale: 'major' })

function render(props) {
  console.log('render', props)
  var node = h('div#app', {},
    []
    .concat(renderScale(props.tonic, props.scale))
    .concat(renderTonics(props))
    .concat(renderSelector(props))
  )
  patch(prevNode ? prevNode : section, node)
  prevNode = node
}

function renderSelector (props) {
  var current = props.scale
  function handleClick (name) {
    render(Object.assign(props, { scale: name }))
  }
  return h('section#scales', tonal.scale.names().sort().map(function (name) {
    return h('a.scale', {
      class: { active: name === current },
      props: { href: 'javascript:false' },
      on: { click: [handleClick, name] }
      }, name)
  }))
}

function renderTonics (props) {
  var current = props.tonic
  function clickHandler(t) {
    render(Object.assign(props, { tonic: t }))
  }
  return h('div#tonics', {}, tonics.map(function (n) {
    return h('a', {
      class: { active: n === current },
      props: { href: 'javascript:false' },
      on: { click: [clickHandler, n] }
    }, n)
  }))
}

function renderScales (tonic) {
  var scales = tonal.scale.names(false)
  return scales.sort().map(function (name) {
    return renderScale(tonic, name)
  })
}

function renderScale(tonic, scaleName) {
  if (!tonic || !scaleName) return
  var notes = tonal.scale(scaleName, tonic + '4')
  var id = scaleName.replace(' ', '-').toLowerCase()
  function update (node) {
    renderCanvas(notes, node.elm)
  }

  return h('section', [
    h('h3', tonic + ' ' + scaleName),
    h('figure', [
      h('label.margin-toggle', { props: { for: 'scale-' + id } }),
      h('input.margin-toggle', { props: { id: 'scale-' + id }}),
      h('span.marginnote', renderProperties(scaleName, notes)),
      h('canvas#scale' + scaleName.replace(' ', '-'),
        { props: { width: 510, height: 120 },
          hook: { insert: function (node) { renderCanvas(notes, node.elm) },
                  update: function (_, node) { renderCanvas(notes, node.elm) } } }
      )
    ])
  ])
}

function pc(n) { return n.slice(0, -1) }
function renderProperties(scaleName, notes) {
  function play () {
    var s = score.phrase(notes, 1)
    player.play(ac, player.synth, score.tempo(120, s))
  }
  return [
    h('span.code', tonal.scale(scaleName, false).join(' ')), h('br'),
    h('span.code', notes.map(pc).join(' ')), h('br'),
    h('a', { props: { href: 'javascript:false' },
      on: { click: play } }, [h('i.fa.fa-play', ' '), ' Play'])
  ]
}

function renderCanvas (notes, canvas) {
  var renderer = new Vex.Flow.Renderer(canvas,
    Vex.Flow.Renderer.Backends.CANVAS)

  var ctx = renderer.getContext()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var stave = new Vex.Flow.Stave(0, 0, 500)
  stave.addClef("treble").setContext(ctx).draw()

  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes.map(function (n) {
    var pc = n.charAt(0)
    var alt = n.slice(1, -1)
    var oct = n.slice(-1)
    var note = new Vex.Flow.StaveNote({ keys: [pc + "/" + oct], duration: "q" })
    if (alt) note.addAccidental(0, new Vex.Flow.Accidental(alt))
    return note
  }))
}
