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
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="names"><span class="type-signature"></span>names<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a pitch set return the scale name (if any)</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/names.js">names.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/names.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>names('C D E F G A B')</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(scale)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parase a scale name and returns its components</p>
<p>A scale name can have two components:
- tonic: a note specifing the tonic
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
<a href="https://github.com/danigb/tonal/blob/master/scale.js#L19">lineno 19</a>
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
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
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
</dl>
<pre class="prettyprint"><code>mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
