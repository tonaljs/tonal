<a name="module_Tonal"></a>

# Tonal
Tonal exports all tonal modules

**Important: since v3 single npm packages are not supported**

**Example**  
```js
// ES6 modules (recommended: requires babel, webpack, browserify, parcel or similar tool)
import { Note } from 'tonal'
Note.midi('C4') // => 60
```
**Example**  
```js
// with require (node.js or ES6)
const { Note }= require('tonal')
Note.midi('C4') // => 60
```
**Example**  
```js
// inside browser (using the bundled package)
Tonal.Note.midi('C4') // => 60
```
