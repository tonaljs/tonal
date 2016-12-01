var tonal = require('../packages/tonal')

console.log('Given a chord name, get the available chord extensions')

var base = 'C'
console.log('Base notes', tonal.chord.notes('C'))

tonal.chord.names().filter(function (name) {

})
