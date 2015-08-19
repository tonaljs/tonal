# note 




## accidentals(number) 

Given an alteration number, get the accidentals string




### Parameters

- **number** `Integer`   - the number of accidentals (posivite for shaprs, negative for flats, zero for an empty string)




### Examples

```javascript
var accidentals = require('tonal/note/accidentals')
accidenals(2) // => '##'
accidenals(-2) // => 'bb'
accidenals(0) // => ''
```


### Returns


- `String`   an accidentals string




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

The step is __always__ in uppercase. The accidentals is always using '#' or 'b'
never 'x'


### Parameters

- **note** `String`   - the note




### Examples

```javascript
name('C#4') // => 'C#'
name('Gx4') // => 'G##'
```


### Returns


- `String`   the note name




## parse(note) 

Parse a note and return its properties

It returns an object with the following properties:
- __note__: the parsed note
- __step__: the step letter __always__ in uppercase
- __acc__: a string with the accidentals or '' if no accidentals (never null)
- __oct__: a integer with the octave. If not present in the note, is set to 4
- __alter__: the integer representic the accidentals (0 for no accidentals,
-1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)
- __pc__: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class#Integer_notation)
of the note. The pitch class is an integer value between 0 and 11
where C=0, C#=1, D=2...B=11


### Parameters

- **note** `String`   - the note (pitch) to be p




### Examples

```javascript
parse('C#2') // => { }
```


### Returns


-   




## parseStrict() 

Parse a string and throws exception if its not valid note

This method is exactly the same as `note/parse` but with
exceptions




### Returns


- `Void`




## step(note, amount) 

Transpose note steps




### Parameters

- **note** `String`   - the note to get the step from
- **amount** `Integer`   - (Optional) the amount of steps to move. 0 by default




### Examples

```javascript
step('C#2') // => 'C'
step('C#2', 1) // => 'D'
step('C#2', -1) // => 'B'
```


### Returns


- `Void`




## module.exports() 

Transpose a note by an (diatonic) interval






### Examples

```javascript
transpose('P5', 'D') // => 'A4'
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
