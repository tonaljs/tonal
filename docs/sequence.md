# Module sequence

Sequence are arrays of events. The most common sequences in tonal are pitch and interval sequences. Sequences help with tonal functional programming:

```js
sequence('C4 D4 E4 G4 C5').map(transpose('M2')) // => ['D4', 'E4', 'F#4', 'A4', 'D5']
```

The functions of this module help to create and manipulate sequences. Here are some examples:

```js
// create a pitch sequence from an interval sequence
harmonize('D', ['M2', 'M3']) // => ['E4', 'F#4']
// manipulate sequences
reverse('C D E') // => ['E', 'D', 'C']
rotate('C D E', 1) // => ['D', 'E', 'C']
```

## API

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
<h4 class="name" id="retrograde"><span class="type-signature"></span>retrograde<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the retrograde of a set</p>
<p>Alias of sequence/reverse</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/retrograde.js">retrograde.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/retrograde.js#L3">lineno 3</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>sequence/reverse</li>
</ul>
</dd>
</dl>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="harmonize"><span class="type-signature"></span>harmonize<span class="signature">(tonic, intervals)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a pitch sequence from a sequence of intervals</p>
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
<td class="description last"><p>the tonic pitch</p></td>
</tr>
<tr>
<td class="name"><code>intervals</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>a sequence of intervals</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/harmonize.js">harmonize.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/harmonize.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a sequence of pitches</p>
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
<h4 class="name" id="reverse"><span class="type-signature"></span>reverse<span class="signature">(sequence)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the reverse (retrograde) of a sequence</p>
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
<td class="name"><code>sequence</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the sequence to be reversed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/reverse.js">reverse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/reverse.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>The reversed sequence</p>
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
<pre class="prettyprint"><code>reverse('A B C') // => ['C', 'B', 'A']</code></pre>
</dd>
<dt>
<h4 class="name" id="rotate"><span class="type-signature"></span>rotate<span class="signature">(sequence, times)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Rotate a sequence</p>
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
<td class="name"><code>sequence</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the sequence to rotate</p></td>
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
<a href="https://github.com/danigb/tonal/blob/master/rotate.js">rotate.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/rotate.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the rotated sequence</p>
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
<dt>
<h4 class="name" id="sequence"><span class="type-signature"></span>sequence<span class="signature">(sequence, parser)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a sequence. A sequence is an array of events (of any type, but in tonal
the most common one is an array of notes or intervals)</p>
<p>In its simplest form it transforms a string of space separated events into an
array.</p>
<p>This method optionally receives a parser to convert the string representation
into events.</p>
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
<td class="name"><code>sequence</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the sequence</p></td>
</tr>
<tr>
<td class="name"><code>parser</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>(Optional) a item parser</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/sequence.js">sequence.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/sequence.js#L31">lineno 31</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array with the elements of the sequence (parsed if parser given)</p>
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
<pre class="prettyprint"><code>var sequence = require('sequence/sequence')
// a sequence is an array of events
sequence('A B C') // => ['A', 'B', 'C']
sequence(['A', 'B', 'C']) // => ['A', 'B', 'C']
// create a sequence of pitches
var pitch = require('pitch/pitch')
sequence('A B', pitch) // => [{ name: 'A', midi: 69, ...}, { name: 'B', ... }]
sequence('A G J', pitch) // => null (not all are valid pitches)
// create a sequence of interval objects
var interval = require('interval/interval')
sequence('P1 M2', interval) // => [{ name: 'P1', ...}, { name: 'M2', ... }]
sequence('C2 M2 E3', interval) // => null (not all are valid intervals)</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
