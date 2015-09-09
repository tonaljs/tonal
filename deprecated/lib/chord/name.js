'use strict'

/*
 * achord
 */

module.exports = function (intervals) {
  var chord = intervals.join('-') + '-'

  chord = chord.replace(/P1-/, '')

  chord = chord.replace(/m3-/, 'm')
  chord = chord.replace(/M3-/g, 'M')

  chord = chord.replace(/P4-/g, 'sus4')

  chord = chord.replace(/P5-/, '')
  chord = chord.replace(/A5-/, '#5')
  chord = chord.replace(/d5-/, 'b5')
  chord = chord.replace(/M#5/, '#5')
  chord = chord.replace(/Mb5/, 'b5')
  chord = chord.replace(/mb5/, 'ø')

  chord = chord.replace(/m6-/, 'b6')
  chord = chord.replace(/M6-/, '6')
  chord = chord.replace(/A6-/, '#6')
  chord = chord.replace(/M6/, '6')
  chord = chord.replace(/M#6/, '#6')

  chord = chord.replace(/m7-/, '7')
  chord = chord.replace(/M7-/, 'Maj7')
  chord = chord.replace(/d7-/, 'b7')
  chord = chord.replace(/MMaj7/, 'Maj7')
  chord = chord.replace(/ø7/, '7b5')
  chord = chord.replace(/øb7/, 'ø7')
  chord = chord.replace(/sus47/, '7sus4')

  chord = chord.replace(/m9-/, 'b9')
  chord = chord.replace(/M9-/, '9')
  chord = chord.replace(/A9-/, '#9')

  chord = chord.replace(/M9/, '9')
  chord = chord.replace(/M79/, '9')
  chord = chord.replace(/M7#9/, '#9')
  chord = chord.replace(/M7b9/, 'b9')
  chord = chord.replace(/69/, '6/9')
  chord = chord.replace(/#57#9/, '#5#9')

  chord = chord.replace(/P11-/, '11')
  chord = chord.replace(/A11-/, '#11')
  chord = chord.replace(/9#11/, '#11')
  chord = chord.replace(/m7911/, 'm11')

  chord = chord.replace(/M13-/, '13')
  chord = chord.replace(/913/, '13')
  chord = chord.replace(/91113/, '13')

  chord = chord.replace(/M7/, '7')

  if (chord === '') chord = '5'
  return chord
}
