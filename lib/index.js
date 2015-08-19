
var tonal = {
  note: {
    parse: require('./note/parse'),
    isNote: require('./note/isNote'),
    fromMidi: require('./note/fromMidi'),
    midi: require('./note/midi'),
    freq: require('./note/freq'),
    enharmonic: require('./note/enharmonic'),
    transpose: require('./note/transpose'),
    distance: require('./note/distance')
  },
  interval: {
    parse: require('./interval/parse'),
    isInterval: require('./interval/isInterval'),
    fromNotes: require('./interval/fromNotes'),
    invert: require('./interval/invert'),
    transpose: require('./interval/transpose')
  }
}

module.exports = tonal
