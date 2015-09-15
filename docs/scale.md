# Scale module

Create or detect scales:

```js
var scale = require('tonal/scale')
scale('C myxolidian') // => ['C', 'D', 'E', 'F', 'G', 'A', 'Bb']
scale('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']

var mode = require('tonal/scale/mode')
mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']

var names = require('tonal/scale/names')
names('D E F# G A B C#') // => ['D dorian']
```

## Functions

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/names.js">names.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/names.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>names() => ['major', 'minor', ....]</code></pre>
</div>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="name"><span class="type-signature"></span>name<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a pitch set return the scale name (if any)</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/name.js">name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/name.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>name('C D E F G A B')</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(scale)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parase a scale name and returns its components</p>
<p>A scale name can have two components:
- tonic: a pitch specifing the tonic
- type: the scale type</p>
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
<td class="name"><code>scale</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale name (with optional tonic)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/parse.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the parsed scale name</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>parse('C major') // => { tonic: 'C', type: 'major' }</code></pre>
</dd>
<dt>
<h4 class="name" id="scale"><span class="type-signature"></span>scale<span class="signature">(name)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given a scale name, returns its pitches or intervals</p>
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
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale name</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/scale.js">scale.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/scale.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of intervals or notes (if tonic is present)</p>
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
<pre class="prettyprint"><code>scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => '1P 2M 3M 4P 5P 6M 7m 7M'</code></pre>
</dd>
<dt>
<h4 class="name" id="triad"><span class="type-signature"></span>triad<span class="signature">(set, len)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get a triad from a set, a simplistic implementation.</p>
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
<td class="name"><code>set</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the pitch class set</p></td>
</tr>
<tr>
<td class="name"><code>len</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the number of notes of the triad (3 by default)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/triad.js">triad.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/triad.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 4) // => ['C', 'E', 'G', 'B', 'D']</code></pre>
</dd>
<dt>
<h4 class="name" id="triadic"><span class="type-signature"></span>triadic<span class="signature">(scale, size)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get a scale intervals in triadic form</p>
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
<td class="name"><code>scale</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale name</p></td>
</tr>
<tr>
<td class="name"><code>size</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the number of intervals</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/triadic.js">triadic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/triadic.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of intervals</p>
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
<pre class="prettyprint"><code>triadic('major') // => ['1P', '3M', '5P', '7M', '9M', '11P', '13M']
triadic('dorian', 4) // => ['1P', '3m', '5P', '7m']</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Get a generic scale (the intervals) from a scale name without tonic</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/generic.js">generic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/generic.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>generic('C major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']</code></pre>
</div>
</article>
</section>
<section>
<article>
<div class="container-overview">
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/mode.js">mode.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/mode.js#L4">lineno 4</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>internal/rotate</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
