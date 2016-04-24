'use strict';

var _ = require('tonal')

const nilFn = () => null
const id = (n) => n
const ascR = (b, n) => { for (var a = []; n-- ; a[n] = b + n ); return a; }
const desR = (b, n) => { for (var a = []; n-- ; a[n] = b - n ) ; return a; }

// create a range from midi numbers
const midiR = (a, b) => a < b ? ascR(a, b - a + 1) : desR(a, a - b + 1)

// create a range from note names or midi numbers
function _range (a, b) {
  const ma = _.midi(a)
  const mb = _.midi(b)
  return ma !== null && mb !== null ? midiR(ma, mb) : []
}

function range (nameGen, start, end) {
  if (arguments.length === 1) return (s, e) => range(nameGen, s, e)
  if (arguments.length === 2) return (e) => range(nameGen, start, e)
  return _range(start, end).map(genFn(nameGen)).filter(id)
}

const _take = (fn, a, acc, m, l, e) => {
  while (_.isMidi(m) && a.length < l) {
    e = fn(m)
    if (e !== null) a.push(e)
    m += acc
  }
  return a
}

const dir = (n) => n < 0 ? -1 : 1
const abs = Math.abs
function take (nameGen, start, len) {
  if (arguments.length === 1) return (s, l) => take(nameGen, s, l)
  if (arguments.length === 2) return (l) => take(nameGen, start, l)
  var midi = _.midi(start)
  return (midi === null) ? []
   : _take(genFn(nameGen), [], dir(len), midi, abs(len))
}

function genFn (nameGen) {
  return typeof nameGen === 'function' ? nameGen
    : typeof nameGen === 'string' ? pitchSetGen(nameGen)
    : nameGen === true || nameGen === false ? _.chromatic(nameGen)
    : nameGen === null ? id
    : nilFn
}

const buildNote = (pc, midi) => pc + (Math.floor(midi / 12) - 1)
function pitchSetGen (notes) {
  var scale = _.map(_.pc, notes)
  var chromas = _.map(_.chroma, scale)
  return function (pitch) {
    var midi = pitch
    var ch = midi % 12
    var index = chromas.indexOf(ch)
    return index > -1 ? buildNote(scale[index], midi) : null
  }
}

exports.range = range;
exports.take = take;
exports.pitchSetGen = pitchSetGen;