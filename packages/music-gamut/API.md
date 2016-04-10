# filter

Filter a gamut with a function. The function operates pitches in array notation.

This function is currified.

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function used to filter the gamut. It must return
    true or false to include or exclude the note from the gamut. It receives one
    parameter of a pitch in array notation (can be null)
-   `pitches` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\|[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** the pitches to filter
-   `source`  

**Examples**

```javascript
var onlyC = gamut.filter(function(p) { return p[0] === 0 })
onlyC('c2 d3 c4 f6 c7') // => ['C2', 'C4', 'C7']
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** the filtered notes

# gamut.rotate

Rotate the gamut

**Parameters**

-   `count` **Integer** the number of rotations
-   `gamut` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** a list of notes or intervals

**Examples**

```javascript
var G = require('music-gamut')
G.rotate(1, 'C D E') // => ['D', 'E', 'C']
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the gamut rotated count times

# gamut.select

Select some elements from a gamut

**Parameters**

-   `numbers` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** a **1-based** index of the elements
-   `gamut` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** the notes or intervals

**Examples**

```javascript
var gamut = require('music-gamut')
gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the selected elements

# map

Map a gamut with a function. The function operates pitches in array notation

**Parameters**

-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the function used to map gamut elements
-   `pitches` **([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)\|[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** the pithes
-   `source`  

**Examples**

```javascript
var gamut = require('music-gamut')
var octUp = gamut.map(function (n) { return [n[0], n[1] + 1, n[2]] })
octUp('c2 d3 e4') // => [ 'C3', 'D4', 'E5' ]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the mapped gamut

# reduce

Applies a function against an accumulator and each value of a pitch
collection.

This function is currified so can be partially applied

**Parameters**

-   `fn`  
-   `acc`  
-   `source`  

# split

Split a collection of notes into an array.
No transformation to notes is performed.

An alias for `gamut.transform(false)`

**Parameters**

-   `notes` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** the notes to split

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the notes as an array

# transform

Transform a collection of pitches with a function.

It will convert the collection of pitches to array notation, perform the
transformation and convert the pitches back to strings.

The collection of pitches (notes, pitch classes or intervals) that can be
expressed as an array or as string.

The function will receive the gamut in [array notation](<>) and must return
the result. If the result is an array of pitches in array notation they will
be converted back to note strings.

If the given function is `false` the gamut is returned (as an array) but
with no transformation applied.

If the given function is `null` the gamut is returned (as an array) with
the non-pitched elements filtered.

This is the base function to derive `map`, `reduce` and `filter`

**Parameters**

-   `fn` **([Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)\|[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))** the function to transform the gamut. If false
-   `source` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** a list of elements

**Examples**

```javascript
var gamut = require('music-gamut')
// filter notes elements
gamut(null, 'c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** a list of pitches
