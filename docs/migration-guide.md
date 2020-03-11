# Migration guide

## From version 3 to 4

No breaking changes, but deprecations:

- New module structure: Tonal is renamed to Core. Modules renamed to Tonal
- All modules exports default for easy ES6 import
- Rename chord-dictionary to chord-type and scale-dictionary to scale-type
- Rename array to collection (to avoid name classing with native Array)

## From version 2 to 3

Tonal version 3 is a complete rewrite of the library in Typescript.

The new features are:

- Simplified and more coherent API
- Type definitions for all modules
- Better documentation

Unfortunately there are a lot of breaking changes:

### tonal is published under `@tonaljs` namespace

To avoid mistakes (and have a better npm home) from v3 the npm packages are namespaced.

So instead of:

```js
const tonal = require("tonal");
// or
import * as tonal from "tonal";
```

Now we have to:

```js
const tonal = require("@tonaljs/core");
// or
import * as tonal from "@tonaljs/core";
```

### Better module dependencies

In version 2 `tonal` was a facade for the modules, so dependencies between modules were not clear. Moreover, same functions were exported by different modules.

This is not longer true in v3

### `@tonaljs/core` contains the tonal "core" functions

In version 2 `tonal` was a facade for the rest of the modules:

```js
// this is not longer valid in v3
import { Note } from "tonal";
```

Now, `@tonaljs/core` module contains just four functions:

```js
import { note, interval, transpose, distance } from "@tonaljs/core";
```

### Midi related functions are moved from `note` to `midi`

Instead of:

```js
// v2
import { midiToNote } from "tonal-note";
```

You will find the function at:

```js
// v3
import { midiToNoteName } from "@tonaljs/midi";
```

### Functions are not exported twice

In v2 some functions were exported in several places (like `Tonal.transpose` and `Note.transpose`). That made the API hard to understand.

Now, every public function is documented in it's own module.

### Most of modules depends on `@tonaljs/core`

The module architecture is easier to grasp:

TODO: diagram of tonal modules

### Simplified API

Lot of changes, but as a positive side effect, the library API surface is smaller so code and documentation are easier to write and maintain.

Now functions falls in two catergories:

- **Parsers**: takes a name of something (string) and return an object with properties. Examples of that functions are: note, interval, pcset, scaleType, chordType, scale, chord, mode. All of the returning objects has the properties `empty` (boolean) and name (string, "" indicating _no value_)
- **Operations**: takes one or more names and return a new name. It always work with strings (no objects). Invalid results are represented with empty strings "". Examples: transpose, distance, substract

### Utilility functions removed or made private

First of all, lot of functions are gone, like `oct`, `accToAlt`, and other utility functions (some still exists, but are considered private)

### Not optional function application

Some functions in v2 could be partially applied:

```js
// valid in v2 and v3
transpose(note, interval);
// not valid in v3
tranpose(note)(interval);
```

This optional partial application made code unnecessarily complex and, with Typescript types, much harder to understand or write.

For this reason **optional** partial application are not possible in v3. Most of the functions needs all parameters to execute.

However, there are some execptions to make the API easier to use. In that cases, partial application is obligatory:

```js
// valid in v2 and v3
isSubsetOf(set1)(set2); // => true
// not valid in v3
isSubsetOf(set1, set2);
```

If you need curry 🍛, use an utility library like [lodash](https://lodash.com))

### Better API documentation

API documentation are now handwritten and it's inside each module README.md file.

### No more `null`'s

No tonal function returns a `null` anymore. For property objects (like Note, or Scale) you can test for the `empty` property:

```js
note("hello"); // => { empty: true, name: '' }
interval("bye"); // => { empty: true, name: '' }
scaleType("unknown"); // => { empty: true, name: '' }
```

This is more important in functions that returns strings (like `transpose`):

**All functions that returns an string, returns an empty string to indicate invalid params:**

```js
// in v2
transpose("C4", "hello"); // => null
// in v3
transpose("C4", "hello"); // => ''
```
