# chord 




## module.exports(name) 

Create a list from a chord name

If the chord name contains the tonic, a note list is returned. If only the
chord type is given, you get an interval list.


### Parameters

- **name** `String`   - a chord name (with or without tonic)




### Examples

```javascript
chord('M') // => ['P1', 'M3', 'P5']
chord('C7') // => ['C4', 'E4', 'G4', 'B4']
```


### Returns


- `Array`   a list (of notes or intervals depending on the name)




## parse(chord) 

Parse a chord name and returns the tonic (if any) and the chord type

The returned object has the properties:
- tonic: the tonic note or null if not specified
- type: the chord type


### Parameters

- **chord** `String`   - the chord string to be parsed




### Examples

```javascript
parse('C#major') // => { tonic: 'C#', type: 'major' }
parse('minor') // => { tonic: null, type: 'minor' }
```


### Returns


- `Object`   the chord object




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
