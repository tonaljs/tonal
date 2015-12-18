# Notation

This library represent pitches in three different formats:

- Strings literals: just it.
- Array notation: a numerical fifths/octave pitch representation
- Properties: pitch properties expressed with numbers

## String literals

Currently three formats are supported. They are __case independent__:

- Notes is scientific notation: `C#2`, `Eb5`, `eb2` are valid notes.
- Intervals in a variation of shorthand notation: `3P`, `4#`, `2` are valid intervals.
- Roman numerals: `vii`, `III` are valid roman numerals.

## Array notation

The pitches are encoding using array notation. This is a modified version of coord notation from [teoria](https://github.com/saebekassebil/teoria)

- It can represent different types of pitched elements
- All numerical, no need to parse
- All entities represented by an array
- The array length determine the type of the element

#### Pitch classes in array notation

A pitch class is a note name without octave (only a letter and -sometimes- accidentals).

A pitch class is encoded using a 1-element array in the format `[ fifhts ]` where:

- __fifths__ `{Integer}`: the number of fifths from C to the pitch class.

Here are the unaltered pitch classes in array notation:

| C | D | E | F | G | A | B |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| ` [0] `| ` [2] `| ` [4] `| ` [-1] `| ` [1] `| ` [3] `| ` [5] `|

Add 7 to add sharps:

| C# | D# | E# | F# | G# | A# | B# |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| ` [7] ` | ` [9] ` | ` [11] ` | ` [6] ` | ` [8] ` | ` [10] ` | ` [12] ` |


Subtract 7 to add flats:

| Cb | Db | Eb | Fb | Gb | Ab | Bb |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| ` [-7] ` | ` [-5] ` | ` [-3] ` | ` [-8] ` | ` [-6] ` | ` [-4] ` | ` [-2] ` |

#### Intervals in array notation

Intervals are encoded by 2-element arrays with the form `[ fifths, octaves ]` where:

- __fifths__ `{Integer}`: the number of fifths (same as pitch class)
- __octaves__ `{Integer}`: is the number of octaves (positive are ascending, negative descending)

For example, a major second is two fifths up and one octave down: `[2, -1]`


Here are the most popular ascending intervals:

| Interval name | Short | Array notation |
| :-- | :-: | :-: |
| unison | 1P | `[0, 0]` |
| minor second | 2m | `[-5, 3]` |
| major second | 2M | `[2, -1]` |
| minor third | 3m | `[-3, 2]` |
| major third | 3M | `[4, -3]` |
| perfect fourth | 4P | `[-1, 1]` |
| augmented fourth | 4A | `[6, -3]` |
| diminished fifth | 5d | `[-6, 4]` |
| perfect fifth | 5P | `[1, 0]` |
| minor sixth | 6m | `[-4, 3]` |
| major sixth | 6M | `[3, -2]` |
| minor seven | 7m | `[-2, 2]` |
| major seven | 7M | `[5, -2]` |
| octave | 8P | `[0, 1]` |

Compound intervals are created by adding octaves:

| Simple | Array | Compound | Array |
| :-- | :-: | :-: | :-: |
| second | `[2, -1]` | ninth | `[-2, 0]`
| third | `[4, -3]` | tenth | `[4, -2]`
| ... | ... | ... | ... |


Descending intervals are the same as ascending but with opposite direction:

| Interval | Ascending | Descending |
| :-- | :-: | :-: |
| major second | `[2, -1]` | `[-2, 1]`
| major third | `[4, -3]` | `[-4, 3]`
| .... | | ||

#### Notes in array notation

For notes, a 3-length array is used with the form `[fifths, octaves, duration]` where:

- __fifths__ `{Integer}`: number of fifths
- __octaves__ `{Integer}`: number of octaves
- __duration__ `{Integer}`: the duration of the note. Can be `null` to represent pure pitches (notes without duration).

Duration has no defined value, its only a relative duration where an outside reference is needed to convert to time units. Popular choices are 96 or 720 to represent quarter notes.

## Properties

The note properties is an array in the form `[ number, alteration, octave, duration ]` where:

- number: is a positive integer between 0 to 6 to represent `C` to `B` (or `1` to `7` in case of intervals)
- alteration: 0 means no accidentals. Positive are sharps and negative flats.
- octave: the octave number for notes (or the number of octaves it spawns for intervals)
- duration: optional. numeric.
