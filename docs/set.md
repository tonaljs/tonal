# Set module

Functions to create pitch class sets in different representations. A pitch set is a collection of pitch classes, where they can't be repeated.

```js
var set = require('tonal/set/pitchSet')
set('C2 D E3 C3 E3 D') // => ['C', 'D', 'E']
set('D C F E') // => ['D', 'E', 'F', 'C']
```

Some tonal functions (like scales) returns pitch sets instead of sets.

### Binary representations of sets (or scales)

This is a implementation of binary scales as presented in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal, see previous example) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Why 2048 scales?

All the scales have root, so the smallest scale is '100000000000' (2048) and
the biggest is '111111111111' (4095), so the total number is 2048 (4096 - 2048)

Most of they are not interesting enough to be used in music.
For example, at [allthescales.org site](http://allthescales.org) they limit all the possibilities to those with leap < 5 (1490)

## Functions


<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="modes"><span class="type-signature"></span>modes<span class="signature">(pitchSet)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return all modes of a pitch set</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>pitchSet</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch set</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/modes.js">modes.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/modes.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of arrays with the set rotated set.length times</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]</code></pre>
</dd>
<dt>
<h4 class="name" id="pitchSet"><span class="type-signature"></span>pitchSet<span class="signature">(pitches)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a pitch class set from a collection of pitches. The pitch classes
are ordered by frequency starting from the first note of the collection</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>pitches</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the collection of pitches</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/pitchSet.js">pitchSet.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/pitchSet.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a pitch set</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']</code></pre>
</dd>
<dt>
<h4 class="name" id="toBinary"><span class="type-signature"></span>toBinary<span class="signature">(intervals)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Return the binary set representation of a collection of intervals</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>intervals</code></td>
<td class="type">
<span class="param-type">Array</span>
</td>
<td class="description last"><p>an interval array</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/toBinary.js">toBinary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/toBinary.js#L12">lineno 12</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="toIntervals"><span class="type-signature"></span>toIntervals<span class="signature">(source)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Convert a binary set number to an intervals collection</p>
<p>The source can be one of the following forms:
- An array of intervals (they are returned without modification)
- A string with a intervals separated by a space
- A string with a binay representation
- A decimal (that is converted to a binary representation)</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>source</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>an interval list in any of its valid forms</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/binaryIntervals.js">binaryIntervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/binaryIntervals.js#L22">lineno 22</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>An array of intervals</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
