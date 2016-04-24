
var tonal = require('tonal')

const nilFn = () => null
const id = (n) => n
const ascR = (b, n) => { for (var a = []; n-- ; a[n] = b + n ); return a; }
const desR = (b, n) => { for (var a = []; n-- ; a[n] = b - n ) ; return a; }
const midiR = (a, b) => a < b ? ascR(a, b - a + 1) : desR(a, a - b + 1)
const filt = (fn, r) => r.map(fn).filter(id)

function noteRange(a, b) {
  const ma = tonal.midi(a)
  const mb = tonal.midi(b)
  return ma !== null && mb !== null ? midiR(ma, mb) : []
}

export function range (filter, start, end) {
  if (arguments.length === 1) return (s, e) => range(filter, s, e)
  if (arguments.length === 2) return (e) => range(filter, start, e)
  return filt(fiterFn(filter), noteRange(start, end))
}

const _take = (fn, a, acc, m, l, e) => {
  while (tonal.isMidi(m) && a.length < l) {
    e = fn(m)
    if (e !== null) a.push(e)
    m += acc
  }
  return a
}

const dir = (n) => n < 0 ? -1 : 1
const abs = Math.abs
export function take (filter, start, len) {
  if (arguments.length === 1) return (s, l) => take(filter, s, l)
  if (arguments.length === 2) return (l) => take(filter, start, l)
  var midi = tonal.midi(start)
  return (midi === null) ? []
   : _take(fiterFn(filter), [], dir(len), midi, abs(len))
}

function fiterFn (filter) {
  return typeof filter === 'string' ? pitchSetGen(filter)
    : typeof filter === 'function' ? filter
    : filter === true || filter === false ? tonal.chromatic(filter)
    : filter === null ? id
    : nilFn
}

const buildNote = (pc, midi) => pc + (Math.floor(midi / 12) - 1)
export function pitchSetGen (notes) {
  var scale = tonal.map(tonal.pc, notes)
  var chromas = tonal.map(tonal.chroma, scale)
  return function (pitch) {
    var midi = pitch
    var ch = midi % 12
    var index = chromas.indexOf(ch)
    return index > -1 ? buildNote(scale[index], midi) : null
  }
}
