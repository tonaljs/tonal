# @tonaljs/time-signature

## 4.9.0

### Minor Changes

#### `default` export is deprecated for @tonaljs modules

Using default exports for single packages are deprecated, so instead of:

```js
import TimeSignature from "@tonaljs/time-signature";
```

You should do this:

```js
import * as TimeSignature from "@tonaljs/time-signature";
```

The same for all modules.

## 4.8.1

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

## 4.7.2

### Patch Changes

- Unify package versions

## 4.7.1

### Patch Changes

- fix npm publish problem

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak

## 4.6.10

### Patch Changes

- Bug fixing
