## Functions

<dl>
<dt><a href="#asList">asList(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
<dt><a href="#map">map(fn, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Map a list with a function</p>
<p>Can be partially applied.</p>
</dd>
<dt><a href="#filter">filter(fn, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Filter a list with a function</p>
<p>Can be partially applied.</p>
</dd>
<dt><a href="#listFn">listFn()</a></dt>
<dd><p>Decorates a function to work with lists in pitch array notation</p>
</dd>
<dt><a href="#harmonizer">harmonizer(list)</a> ⇒ <code>function</code></dt>
<dd><p>Create an harmonizer: a function that given a note returns a list of notes.</p>
</dd>
<dt><a href="#harmonize">harmonize(list, pitch)</a> ⇒ <code>Array</code></dt>
<dd><p>Harmonizes a list with a pitch</p>
</dd>
</dl>

<a name="asList"></a>

## asList(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

<a name="map"></a>

## map(fn, list) ⇒ <code>Array</code>
Map a list with a function

Can be partially applied.

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="filter"></a>

## filter(fn, list) ⇒ <code>Array</code>
Filter a list with a function

Can be partially applied.

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="listFn"></a>

## listFn()
Decorates a function to work with lists in pitch array notation

**Kind**: global function  
<a name="harmonizer"></a>

## harmonizer(list) ⇒ <code>function</code>
Create an harmonizer: a function that given a note returns a list of notes.

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="harmonize"></a>

## harmonize(list, pitch) ⇒ <code>Array</code>
Harmonizes a list with a pitch

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>String</code> &#124; <code>Array</code> | 
| pitch | <code>String</code> &#124; <code>Pitch</code> | 

