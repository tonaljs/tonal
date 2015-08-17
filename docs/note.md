# note 




## accidentals(note) 

Return an accidentals of a note




### Parameters

- **note** `String`   - the note




### Examples

```javascript
var accidentals = require('tonal/note/accidentals')
accidenals('C#4') // => '#'
accidenals('Db') // => 'b'
accidenals('E') // => ''
```


### Returns


- `String`   an accidentals string




## alteration(note) 

Return the alteration number of the note




### Parameters

- **note** `String`   - the note




### Examples

```javascript
alteration('C#6') // 1
alteration('Db') // -1
alteration('E') // 0
alteration('bb') // => -1 (first char is the step)
```


### Returns


- `Integer`   the alteration number




## module.exports() 

Get the interval between two notes






### Examples

```javascript
transpose('P5', 'D') // => 'A4'
```


### Returns


- `Void`




## enharmonic() 

Get the enharmonic of a note with a given step






### Examples

```javascript
enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'
```


### Returns


- `Void`




## freq(note, tuning) 

Get the note frequency in hertzs




### Parameters

- **note** `String`   - the note
- **tuning** `Integer`   - optional tuning, 440 by default




### Examples

```javascript
var freq = require('tonal/freq')
freq('A4') // => 440
freq('A3', 444) // => 222
```


### Returns


- `Float`   - the note frequency




## fromMidi(midi) 

Get the note of the given midi number

This method doesn't take into account diatonic spelling. Always the same
pitch class is given to the same midi number. @see enahrmonic


### Parameters

- **midi** `Integer`   - the midi number




### Returns


- `String`   the note or null if there's no pitchClass available to this note name




## isNote(string) 

Determine if the given string is a valid note




### Parameters

- **string** `String`   - the string to be tested




### Returns


- `Boolean`   true if is a valid note




## midi(note) 

Get the midi number of the given note




### Parameters

- **note** `String`   - the note




### Examples

```javascript
var midi = require('tonal/note/midi')
midi('A4') // => 69
```


### Returns


- `Integer`   - the midi number




## name(note) 

Get the name (step and accidentals) of the note

The step is __always__ in uppercase


### Parameters

- **note** `String`   - the note




### Returns


- `String`   the note name




## parse() 








### Returns


- `Void`




## parse(note, namePrefix) 

Get the components of a note (step, accidentals and octave)

It returns an object with the following properties:
- step: the step letter __always__ in uppercase
- acc: a string with the accidentals or '' if no accidentals (never null)
- oct: a integer with the octave. If not present in the note, is set to 4


### Parameters

- **note** `String`   - the note (pitch) to be parsed
- **namePrefix** `boolean`   - if name prefix is true, then a note name (without octave) is extracted from the beggining of the string




### Returns


-   




## pitchClass() 

Get the [pitch class](https://en.wikipedia.org/wiki/Pitch_class#Integer_notation)
of the note

The pitch class is an integer value of the pitch where C=0, C#=1, D=2...B=11




### Examples

```javascript
pitchClass('C2') // => 0
pitchClass('C3') // => 0
pitchClass('C#') // => 1
pitchClass('Db') // => 1
```


### Returns


- `Void`




## step(note) 

Get the step of a note (the letter in uppercase, ignoring the accidentals and octave)




### Parameters

- **note** `String`   - the note to get the step of




### Examples

```javascript
step('C#4') // => 'C'
step('db7') // => 'D'
```


### Returns


- `String`   the step letter (__always in uppercase__)




## module.exports() 

Transpose a note by an (diatonic) interval






### Examples

```javascript
transpose('P5', 'D') // => 'A4'
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
