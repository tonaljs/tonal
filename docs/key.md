# Key module

Functions to work with keys and key signatures.

Work in progress.

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
<h4 class="name" id="accidentals"><span class="type-signature"></span>accidentals<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a key (number) returns the accidentals</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/accidentals.js">accidentals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/accidentals.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>accidentals('G major') // => '#'
accidentals('Eb minor') // => 'bbbbbb'
accidentals(3) // => '###'
accidentals(-2) // => 'bb'</code></pre>
</dd>
<dt>
<h4 class="name" id="keyNumber"><span class="type-signature"></span>keyNumber<span class="signature">(name)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given a key (<code>C major</code> for example), get the key number. The key number is the
number of sharps (if positive number) or flats (if the number is negative) of
the key</p>
<p>The name can be a pitch class (and major key is supposed), a pitch class with
a 'major' or 'minor' appended, or a string with the accidentals</p>
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
<td class="description last"><p>the name of the key</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/keyNumber.js">keyNumber.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/keyNumber.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the key number (number of alterations)</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Integer</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>keyNumber('C major') // => 0
keyNumber('G') // => 1
keyNumber('Eb minor') // => -6
keyNumber('##') // => 2
keyNumber('bbb') // => -3</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a key name</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/parse.js#L12">lineno 12</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>parse('C minor') // => { tonic: 'C', type: 'minor'}
parse('C#') // => { tonic: 'C#', type: 'major'}</code></pre>
</dd>
<dt>
<h4 class="name" id="pitches"><span class="type-signature"></span>pitches<span class="signature">(key)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the pitch class set from a key.</p>
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
<td class="name"><code>key</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the key name</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/pitches.js">pitches.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/pitches.js#L21">lineno 21</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a pitch class set</p>
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
<pre class="prettyprint"><code>pitches('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
pitches('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']</code></pre>
</dd>
<dt>
<h4 class="name" id="triads"><span class="type-signature"></span>triads<span class="signature">(key)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the triads of</p>
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
<td class="name"><code>key</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the key name</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/triads.js">triads.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/triads.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a pitch class set</p>
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
<pre class="prettyprint"><code>triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
