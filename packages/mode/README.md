# @tonaljs/mode [![npm version](https://img.shields.io/npm/v/@tonaljs/mode.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/mode)

[![tonal](https://img.shields.io/badge/@tonaljs-mode-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`@tonaljs/mode` is a collection of functions to get musical modes

## API

### `mode(name: string) => Mode`

Given a mode name, returns a Mode object with the following fields:

- name: the mode name
- aliases: alternative mode names
- modeNum: the mode number (0...7)
- pcset: the pcset number
- alt: the alterations
- triad: the triad chord type
- seventh: the seventh chord type

Example:

```js
mode("major");
// =>
{
  name: "ionian",
  aliases: ["major"]
  intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
  modeNum: 0,
  pcset: 2773,
  alt: 0,
  triad: "",
  seventh: "Maj7",
}
```

### `names() => string[]`

Rerturn a list of mode names

### `aliases() => string[]`

Return a list of alternative mode names
