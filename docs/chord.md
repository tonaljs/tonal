# Chord module

Create or manipulate chords:

```js
var chord = require('tonal/chord/chord')
chord('Cmaj7') // => ['C4', 'E4', 'G4', 'B4']
```

## API

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
<h4 class="name" id="chord"><span class="type-signature"></span>chord<span class="signature">(name, tonic)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get chord notes or intervals by its type and (optionally) tonic pitch</p>
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
<td class="description last"><p>the chord name (may include the tonic)</p></td>
</tr>
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>(Optional) the tonic pitch</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/chord.js">chord.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/chord.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of intervals or notes (if the tonic is provided)</p>
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
<pre class="prettyprint"><code>chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord('7b5', 'Bb2')</code></pre>
</dd>
<dt>
<h4 class="name" id="fromScale"><span class="type-signature"></span>fromScale<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Return all the chord names of a given scale</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/fromScale.js">fromScale.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/fromScale.js#L11">lineno 11</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="name"><span class="type-signature"></span>name<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the chord name(s) of a given pitches</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/name.js">name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/name.js#L11">lineno 11</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(chord)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the components of a chord name</p>
<p>The returned object has the properties:</p>
<ul>
<li><strong>tonic</strong>: the tonic note or null if not specified</li>
<li><strong>type</strong>: the chord type</li>
</ul>
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
<td class="name"><code>chord</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the chord string to be parsed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/parse.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the chord object</p>
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
<pre class="prettyprint"><code>parse('C#Maj7') // => { tonic: 'C#', type: 'Maj7' }
parse('7b5') // => { tonic: null, type: '7b5' }</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/names.js">names.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/names.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>names() => ['major', 'minor', ....]</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
