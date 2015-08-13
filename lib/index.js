
var tonal = {
  note: {
    transpose: require('./note/transpose'),
    name: require('./note/name'),
    octave: require('./note/octave'),
    midi: require('./note/midi'),
    freq: require('./note/freq'),
    fromMidi: require('./note/from-midi')
  }
}

module.exports = tonal
