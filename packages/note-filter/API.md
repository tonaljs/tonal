# filter

Filter notes using a function or a collection of notes

This function is currified and can be partially applied.

**Parameters**

-   `filter` **([Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)\|[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** the function to filter notes or the
    collection of notes allowed. The collection of notes can be pitch classes or
    individual notes. The function will receive one parameter with a note in
    [array notation](<>) and must return true or false
-   `fn`  
-   `notes` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the notes to be filtered

**Examples**

```javascript
var filter = require('note-filter')
// filter by pitch class
filter('C', 'c3 c#2 c2 c4 cb2') // => ['C3', 'C2', 'C4'])
// filter by note
filter('c3', 'c1 c2 c3 c4 c5 c6') // => ['C3']
// filter by collection
filter('C E G3', 'c2 db2 c3 eb2 gb2 g3 ab g4') // => [ 'C2', 'C3', 'G3' ])
```

```javascript
// partially applied
var cMajorFilter = filter('C D E F G A B')
cMajorFilter('c3') // => 'C3'
cMajorFilter('c#3') // => null
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the filtered notes

## filter.midi

Filter midi notes using a filter function or a note list

The difference from normal filter is that it check note enhramonics (see example)

**Parameters**

-   `filter` **([Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\|[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** the filter function or the collection
    of valid notes
-   `midi` **(Integer|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\|[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** the midi notes

**Examples**

```javascript
var filter = require('note-filter')
filter.midi('C D F', '60 61 62 63 64 65 66 67 69') // => ['C4', 'D4', 'F4']
// enhramonics
filter.midi('C D E#', '60 61 62 63 64 65 66 67 69') // => ['C4', 'D4', 'E#4']
```
