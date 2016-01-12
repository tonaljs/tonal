var Tone = require('tone')
var h = require('hyperscript')

function render (state) {
  document.body.innerHTML = ''
  document.body.appendChild(App(state))
}

render({})

function App (state) {
  return h('div#app',
    h('h1', 'Chords example'))
}
