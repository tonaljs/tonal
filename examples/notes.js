var Note = require('./note.js')

var notes = 'C D E F G A B'.split(' ')

var all = []
notes.forEach(function(note) {
  all.push(note + '4')
  all.push(note + 'b4')
  all.push(note + 'bb4')
  all.push(note + '#4')
  all.push(note + '##4')
})
console.log(all.join(','))

var midi = {}
all.forEach(function (name) {
  if (name === 'Cbb4') name = 'Cbb5'
  if (name === 'Cb4') name = 'Cb5'
  if (name === 'B#4') name = 'B#3'
  if (name === 'B##4') name = 'B##3'
  var note = Note(name)
  midi[note.midi] = midi[note.midi] || []
  midi[note.midi].push(name)
})
console.log(JSON.stringify(midi))
console.log(Object.keys(midi).length)

var chromatic = []
Object.keys(midi).forEach(function (num) {
  var names = midi[num]
  names.sort(function (a, b) {
    var len = a.length - b.length
    return len === 0 ? b.indexOf('b') : len
  })
  var e = [null, null, null, null, null]
  names.forEach(function (name) {
    var ndx
    if (name.length === 2) e[0] = name
    else if (name.length === 3) {
      ndx = name.indexOf('b') > 0 ? 1 : 2
      e[ndx] = name
    } else {
      ndx = name.indexOf('b') > 0 ? 3 : 4
      e[ndx] = name
    }
  })
  chromatic.push(names)
})
console.log(JSON.stringify(chromatic).replace(/\d/g, '').replace(/"/g, "'").replace(/,/g, ', '))
