
var SCALES = {
  'major': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'melodic minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  'harmonic minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  'major pentatonic': ['P1', 'M2', 'M3', 'P5', 'M6'],
  'minor pentatonic': ['P1', 'm3', 'P4', 'P5', 'm7']
}

/*
 * Given a scale name, returns its intervals
 */
function fromName (name) {
  return SCALES[name]
}

module.exports =fromName
