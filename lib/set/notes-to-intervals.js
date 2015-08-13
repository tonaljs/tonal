
/**
 * Given a set of notes, get the generator intervals
 *
 * @param {Array} notes - an array of notes
 * @param {String} root - (Optional) If given, the note is used as root. If not
 * present, the root will be the first note of the array
 * @return {Array} an array of intervals
 */
 function notesToIntervals (notes, root) {
   root = root || notes[0]
   return notes.map(function (note) {
     return distance(root, note)
   })
 }

 module.export = notesToIntervals
