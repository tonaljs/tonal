<a name="module_notes"></a>

# notes
[![npm version](https://img.shields.io/npm/v/tonal-notes.svg)](https://www.npmjs.com/package/tonal-notes)
[![tonal](https://img.shields.io/badge/tonal-notes-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

> Manipulate arrays of music notes

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import { sort } as collection from 'tonal-notes'
sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
sort(["g", "a", "f", "d", "c", "b", "e"]) // => ["C", "D", "E", "F", "G", "A", "B"]

// part of tonal
const tonal = require('tonal')
tonal.notes.sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
```

## Install

[![npm install tonal-notes](https://nodei.co/npm/tonal-notes.png?mini=true)](https://npmjs.org/package/tonal-notes/)

## API Documentation


* [notes](#module_notes)
    * [`.sort(notes)`](#module_notes.sort) ⇒ <code>Array</code>
    * [`.unique(notes)`](#module_notes.unique)
    * [`.filter(source)`](#module_notes.filter) ⇒ <code>Array</code>
    * [`.pcset(notes)`](#module_notes.pcset) ⇒ <code>Array</code>

<a name="module_notes.sort"></a>

## `notes.sort(notes)` ⇒ <code>Array</code>
Sort an array of notes in ascending order

**Kind**: static method of [<code>notes</code>](#module_notes)  
**Returns**: <code>Array</code> - sorted array of notes  

| Param | Type |
| --- | --- |
| notes | <code>String</code> \| <code>Array</code> | 

<a name="module_notes.unique"></a>

## `notes.unique(notes)`
Get notes sorted with duplicates removed

**Kind**: static method of [<code>notes</code>](#module_notes)  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

<a name="module_notes.filter"></a>

## `notes.filter(source)` ⇒ <code>Array</code>
Filter all except notes from an array

**Kind**: static method of [<code>notes</code>](#module_notes)  

| Param | Type |
| --- | --- |
| source | <code>Array</code> | 

**Example**  
```js
notes.filter("c d5 p5 5p other") // => ["C", "D5"]
```
<a name="module_notes.pcset"></a>

## `notes.pcset(notes)` ⇒ <code>Array</code>
Get a pitch class set, ordered, starting from the first note

**Kind**: static method of [<code>notes</code>](#module_notes)  
**Returns**: <code>Array</code> - a pitch class set ordered starting from the first note  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

