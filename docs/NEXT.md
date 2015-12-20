## TODO

- Add strict shorthand interval notation


-----------------------

```js

var tonal = require('tonal')

tonal('f g b d').scale() // => ['F', 'G', 'B', 'D']
Chord('C major').type() // => 'maj'

tonal.harmonics('c d e')
tonal.gamut()

gamut
  -> pitch set
    -> scale
  -> chord

tonal.gamut('1 3 5 7', 'C').modes().map(tonal.type())
tonal.scale('')

```

Scale('C major').notes()

g = Gamut('C D G F')
g.notes() [c, d, g, f]
g.intervals() [1, 2, 5, 4]
g.tonic() => 'C'
g.rotate().notes() [d, g, f, c]
g.sort().notes() [c, d, f, g]

g2 = Gamut('1 3 5 7')
g.notes() []
g.intervals() [1, 3, 5, 7]
g.harmonize('C').notes() [c, e, g, b]
g.select('1 2 3').notes('C')

g.set()
g.setType()
g.degrees()

Set('1 8 15').notes()

## gamut

-
- harmonics
- operation map
- rotate
- select
- scale
- set
- sort
- split

## chord
build _buildChord_
chord _chord_ chord('C major')
names
type

## scale

chords _scaleChord_ // get triad chord of a scale
build _buildScale_
scale _scale_ scale('C dorian')
modes _scaleModes_ // get all modes of a scale
names _scaleNames_ // => given a list of notes, get scale names
select _scaleDegrees_
