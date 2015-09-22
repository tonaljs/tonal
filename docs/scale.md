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
<h4 class="name" id="generic"><span class="type-signature"></span>generic<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the intervals of a scale name (without tonic)</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/intervals.js">intervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/intervals.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>generic('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']</code></pre>
</dd>
<dt>
<h4 class="name" id="mode()"><span class="type-signature"></span>mode()<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the mode of a scale</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/mode.js">mode.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/mode.js#L4">lineno 4</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']</code></pre>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="name"><span class="type-signature"></span>name<span class="signature">(scale)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given a scale notes return the scale name (if any)</p>
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
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>the scale notes</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/name.js">name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/name.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the scale name or null if not found</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">String</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>name('C D E F G A B') // => 'C major'</code></pre>
</dd>
<dt>
<h4 class="name" id="scale"><span class="type-signature"></span>scale<span class="signature">(name, tonic)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the scale (pitch set) of a scale name</p>
<p>If the scale name does not contains the tonic, a list of intervals is returned</p>
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
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>(Optional) the tonic</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scale.js">scale.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scale.js#L20">lineno 20</a>
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
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']</code></pre>
</dd>
<dt>
<h4 class="name" id="scaleNames"><span class="type-signature"></span>scaleNames<span class="signature">()</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get all known scale names</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scaleNames.js">scaleNames.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scaleNames.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>array with all the known names</p>
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
<pre class="prettyprint"><code>names() => ['major', 'minor', ....]</code></pre>
</dd>
<dt>
<h4 class="name" id="triad"><span class="type-signature"></span>triad<span class="signature">(set, len)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get a triad from a set starting from the first note, a simplistic implementation.</p>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/triad.js">triad.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/triad.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->