# Towards a 1.0.0 Release

## Goals

#### Reduce API surface and simplify

Currently there's too many functions to learn.

- [ ] Split codebase into groups: core, extensions, utilities, incubator, deprecatedbb

#### Reduce technical debt

- [ ] Interchangable notation introduced a cost abstraction. Remove it.

#### Stabilize

All the core should be stable. Extensions may vary.

- [ ] Use different versioning schemas for core and extensions?

## Proposed API

#### Note

```js
type note = string

names()  // => ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", ...]
name(note)
chroma(note) : number
- freq(note)
- midi(note)
- octave(note)
- fromFreq(freq)
- fromMidi(midi)
- withOctave(note)
- transpose(note)(interval) 
- transposeBy(interval)(note)
- distance(from)(to)
- distanceTo(to)(from)
```

##### Interval

```js
type interval = string

name("3m") // => "3m"
name("m3") // => "3m"
name("P3") // => null
num("m9")  // => 9
num("9M") // => 9
type("A4") // => "perfectable"
semitones("5P") // => 7
simplify("9M") // => "2M"
invert("2M") // => "7m"
add("2M")("2m") // => "3m"
subtract("2M")("5P") // => "4P"
```

#### Array (¿Collection?, ¿Notes?)

- toArr(arr) strings to arrays
- toNotes(arr) remove all but notes
- toPcset(arr) pcset, ordered starting from C
- toScale(arr) pcset, ordered, the first note is preserved
- toChord(arr) sorted, remove repetitions

// utility (uses functions from interval and note)
- distances(notes, [from]) 
- relative(notes) // relative distances (aka intervallic)
- transpose(notes, interval)
- harmonize(note, intervals)

- sort(notes)
- rotate(notes, preserveOctaves: boolean)
- range(['C4', 'C5'], [filter])
```js
range(['C4', 'C5'])
range(['C4', 'C5', 'C3'])
range('C4 C5 C3');
range('C4 C5', 'c d e f g a b')
```
- filterBy(notes)
```js
const inC = filterBy('c d e f g a b') // => function
inC('C4') // => true
inC('C#4') // => false
````

- cycle('P5', 'C4', 4)

# Scale

type scale = note[]

- types(aliases, [tonic])
- fromName(name, [tonic]) // tonic === null => intervals
- detect(notes) => { exact: "", modes: "", includedIn: "", extendedBy: "" }
- degree(name, step)

# Chord

type chord = note[]

- types(aliases, [tonic])
- fromName(name, [tonic])
- detect(notes)
- triad(scale) // => []

# Key

type key = string

- names(tonic) // major, minor
- altered(name) // altered notes
- signature(name) // ### or bbb
- scales() // => ["C major"] , ["A minor", "A melodic minor", "A harmonic minor" ]
- harmony() => [
  { tonic: "C", types: ["M", "Maj7", "M9", f: "tonic" },
  { tonic: "D", types: ["m", "m7"], f: "subdominant" },
  ...
]

# Modes

- names(tonic) // ionian, dorian (major, minor are aliases)
- relative(mode, type)
- scale(mode)
- chord(mode)
- modes(mode) // modes("C major") // => ["D dorian", ...]