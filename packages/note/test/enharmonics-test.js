var tape = require('tape')
var note = require('..')

tape('get enharmonics', function (test) {
  test.deepEqual(note.enharmonics('C'), [ 'B#', 'C', 'Dbb' ])
  test.deepEqual(note.enharmonics('B'), [ 'A##', 'B', 'Cb' ])
  test.deepEqual(note.enharmonics('B#'), [ 'A###', 'B#', 'C' ])
  test.deepEqual(note.enharmonics('F5'), [ 'E#5', 'F5', 'Gbb5' ])
  test.deepEqual(note.enharmonics('E#2'), [ 'D###2', 'E#2', 'F2' ])
  test.deepEqual(note.enharmonics('A###6'), [ 'G#####6', 'A###6', 'B#6' ])
  test.deepEqual(note.enharmonics('A'), [ 'G##', 'A', 'Bbb' ])
  test.deepEqual(note.enharmonics('Ab3'), [ 'G#3', 'Ab3', 'Bbbb3' ])
  test.deepEqual(note.enharmonics('Db'), [ 'C#', 'Db', 'Ebbb' ])
  test.end()
})
tape('returns empty array if not valid pitch', function (test) {
  test.deepEqual(note.enharmonics('blah'), null)
  test.end()
})
tape('with arrays', function (test) {
  var C = ['tnlp', [0]]
  test.deepEqual(note.enharmonics(C),
    [ [ 'tnlp', [ 12 ] ], [ 'tnlp', [ 0 ] ], [ 'tnlp', [ -12 ] ] ])
  test.end()
})
tape('simpleEnh note', function (test) {
  test.equal(note.simplify('E#2'), 'F2')
  test.equal(note.simplify('B#2'), 'C3')
  test.equal(note.simplify('Cb2'), 'B1')
  // strage case: not a COMPLETE simplification, but I think is enough
  test.equal(note.simplify('A###6'), 'B#6')
  test.end()
})
