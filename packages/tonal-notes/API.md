## Functions

<dl>
<dt><a href="#name">name()</a> ⇒ <code>String</code></dt>
<dd><p>Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note</p>
</dd>
<dt><a href="#pc">pc()</a> ⇒ <code>String</code></dt>
<dd><p>Get pitch class of a note. The note can be a string or a pitch array.</p>
</dd>
</dl>

<a name="name"></a>

## name() ⇒ <code>String</code>
Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note

**Kind**: global function  

| Type |
| --- |
| <code>Pitch</code> &#124; <code>String</code> | 

**Example**  
```js
import { name } from 'tonal-notes'
['c', 'db3', '2', 'g+', 'gx4'].map(name)
// => ['C', 'Db3', null, null, 'G##4']
```
<a name="pc"></a>

## pc() ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: global function  
**Returns**: <code>String</code> - the pitch class  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

**Example**  
```js
tonal.pc('Db3') // => 'Db'
```
