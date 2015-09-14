# Sequence module

Sequence are arrays of events. The most common sequences in tonal are pitch and interval sequences. Sequences help with tonal functional programming:

```js
sequence('C4 D4 E4 G4 C5').map(transpose('2M')) // => ['D4', 'E4', 'F#4', 'A4', 'D5']
```

The functions of this module help to create and manipulate sequences. Here are some examples:

```js
// create a pitch sequence from an interval sequence
harmonize('D', ['2M', '3M']) // => ['E4', 'F#4']
// manipulate sequences
reverse('C D E') // => ['E', 'D', 'C']
rotate('C D E', 1) // => ['D', 'E', 'C']
```

### Pitch sets

A special type of sequence is the pitchSet. A pitch set is an sequence of pitch classes, where they can't be repeated.

```js
var set = require('tonal/sequence/pitchSet')
set('C2 D E3 C3 E3 D') // => ['C', 'D', 'E']
set('D C F E') // => ['D', 'E', 'F', 'C']
```

Some tonal functions (like scales) returns pitch sets instead of sequences.

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
<h4 class="name" id="harmonize"><span class="type-signature"></span>harmonize<span class="signature">(tonic, intervals)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a collection of pitches from a tonic and a collection of intervals</p>
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
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the tonic</p></td>
</tr>
<tr>
<td class="name"><code>intervals</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>a collection of intervals</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/next/harmonize.js">harmonize.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/next/harmonize.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a collection of pitches</p>
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
<pre class="prettyprint"><code>harmonize('C2', ['P1 P5']) // => ['C2', 'G2']</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/next/pitchSet.js">pitchSet.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/next/pitchSet.js#L17">lineno 17</a>
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
<h4 class="name" id="rotate"><span class="type-signature"></span>rotate<span class="signature">(array, times)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Rotate an array</p>
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
<td class="name"><code>array</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the source (se toArray)</p></td>
</tr>
<tr>
<td class="name"><code>times</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/next/rotate.js">rotate.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/next/rotate.js#L17">lineno 17</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>utils/toArray</li>
</ul>
</dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the rotated array</p>
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
<pre class="prettyprint"><code>rotate('A B C', 1) // => ['B', 'C', 'A']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
