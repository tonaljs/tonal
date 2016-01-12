var Tone = require('tone')
var h = require('hyperscript')
var scale = require('music-scale')

var synth = new Tone.SimpleSynth().toMaster()

function App (state) {
  var scales = scale.names()
  return h('div.container',
    h('h1', 'Scales example'),
    h('div#selector',
      h('div#scales'), scales.map(Scale))
    )
}

function Scale (name) {
  function handler () {
    scale(name, 'C4').forEach(function (note, index) {
      var t = '+' + (index) + '* 4n'
      console.log(note, t)
      synth.triggerAttackRelease(note, '8n', t)
    })
    return false
  }
  return h('div.row',
    h('.column', h('a', { href: '#', onclick: handler }, name)),
    h('.column', h('span', scale(name, 'C').join(' ')))
  )
}

function render (state) {
  document.body.innerHTML = ''
  document.body.appendChild(App(state))
}

render({})
