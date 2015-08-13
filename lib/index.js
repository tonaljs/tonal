
var tonal = {
  note: {
    transpose: require('./note/transpose'),
    distance: require('./note/distance'),
    name: require('./note/name'),
    octave: require('./note/octave'),
    midi: require('./note/midi'),
    freq: require('./note/freq'),
    fromMidi: require('./note/from-midi')
  }
}

module.exports = tonal
