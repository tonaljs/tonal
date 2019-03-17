<a name="module_Sonority"></a>

# Sonority
Analyse sonority of musical elements. Currently only one function.

## Usage

**Example**  
```js
import Sonority from "tonal/sonority"
Sonority.density(["C", "E", "G", "B"])) // => [2, 2, 1, 0, 1, 0];

## API
```
<a name="module_Sonority.density"></a>

## `Sonority.density(notes)` ⇒ <code>Array.&lt;number&gt;</code>
Get the intervals analysis of a collection of notes

Returns an array with the format `[p, m, n, s, d, t]` where:

- p: the number of perfect fourths or fifths
- m: the number of major thirds or minor sixths
- n: the number of major sixths or minor thirds
- s: the number of major seconds or minor sevenths
- d: the number of major sevents or minor seconds
- t: the number of tritones

This is, mostly, an academic puzzle to show the expresiveness of tonal.
Implements the ideas found in "The Analysis of Intervals" chapter from
[Harmonic Materials of Modern Music]():

> The letters _pmn_, therefore, represent intervals commonly considered
consonant, whereas the letters _sdt_ represent the intervals commonly
considered dissonant. (...) A sonority represented, for example, by the
symbol `sd^2`, indicating a triad composed of one major second and two minor
seconds, would be recognized as a highly dissonant sound, while the symbol
`pmn` would indicate a consonant sound.

**Kind**: static method of [<code>Sonority</code>](#module_Sonority)  
**Returns**: <code>Array.&lt;number&gt;</code> - the _pmnsdt_ array  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> | the notes to analyze |

**Example**  
```js
Sonority.density(["c", "d", "gb"])) // => [0, 1, 0, 1, 0, 1];
```
