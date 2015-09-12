# Pitch module

This is the basic building block of tonal. You can create pitches in a variety of ways:

```js
var pitch = require('tonal/pitch/pitch')
pitch('C4') // => { name: 'C4', pitchClass: 'C', midi: 60 ... }
pitch('D', 5, 1) // => { name: 'D#5', ... }
pitch('B', 2, -1) // => { name: 'Bb2', ... }
```

And transform them:

```js
var freq = require('tonal/freq/freq')
freq('A3') // => 220
freq('A4', 444) // => 444

var transpose = require('tonal/transpose')
transpose('C2', 'P5') // => 'G5'
```

If you are building an app to deal with notes and midi and frequencies, this is your module.

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
<h4 class="name" id="distance"><span class="type-signature"></span>distance<span class="signature">(from, to)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the interval between two pitches</p>
<p>You can get a partially applied version of this function by passing only one
parameter. See examples below:</p>
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
<td class="name"><code>from</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>first pitch</p></td>
</tr>
<tr>
<td class="name"><code>to</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>second pitch</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/distance.js">distance.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/distance.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the interval between pitches</p>
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
<pre class="prettyprint"><code>distance('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(distance.from('C')) // => ['P1', 'M2', 'm3']</code></pre>
</dd>
<dt>
<h4 class="name" id="enharmonic"><span class="type-signature"></span>enharmonic<span class="signature">()</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the enharmonic of a pitch with a given step</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/enharmonic.js">enharmonic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/enharmonic.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the enharmonic pitch name</p>
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
<pre class="prettyprint"><code>enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'</code></pre>
</dd>
<dt>
<h4 class="name" id="freq"><span class="type-signature"></span>freq<span class="signature">(pitch, tuning)</span><span class="type-signature"> &rarr; {Float}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the pitch frequency in hertzs</p>
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
<td class="name"><code>pitch</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch</p></td>
</tr>
<tr>
<td class="name"><code>tuning</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>optional tuning, 440 by default</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/freq.js">freq.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/freq.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<ul>
<li>the pitch frequency</li>
</ul>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Float</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var freq = require('tonal/freq')
freq('A4') // => 440
freq('A3', 444) // => 222</code></pre>
</dd>
<dt>
<h4 class="name" id="fromMidi"><span class="type-signature"></span>fromMidi<span class="signature">(midi)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the pitch of the given midi number</p>
<p>This method doesn't take into account diatonic spelling. Always the same
pitch class is given to the same midi number. @see enahrmonic</p>
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
<td class="name"><code>midi</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the midi number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/fromMidi.js">fromMidi.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fromMidi.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the pitch</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">String</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="pitch"><span class="type-signature"></span>pitch<span class="signature">(pitch, octave, alteration)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get a pitch properties from a string and optionally change the octave or the
accidentals</p>
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
<td class="name"><code>pitch</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>a string with a step letter and optinally
aaccidentals and octave number</p></td>
</tr>
<tr>
<td class="name"><code>octave</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the pitch octave.</p></td>
</tr>
<tr>
<td class="name"><code>alteration</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the alteration number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/pitch.js">pitch.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/pitch.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an object with the pitch properties</p>
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
<pre class="prettyprint"><code>pitch('Db3') // properties of 'Db3'
pitch('C4', 2) // properties of 'C2'
pitch('G', 1, 1) // properties of 'G#1'
pitch('G', null, 2) // properties of 'G##4'
pitch('C##', 3, -1) // properties of 'Cb3'</code></pre>
</dd>
<dt>
<h4 class="name" id="props"><span class="type-signature"></span>props<span class="signature">(pitch)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get pitch properties</p>
<p>Probably you want to use <code>pitch/pitch</code> instead.</p>
<p>It returns an object with the following properties:</p>
<ul>
<li><strong>name</strong>: the propsd pitch string</li>
<li><strong>letter</strong>: the pitch letter <strong>always</strong> in uppercase</li>
<li><strong>pitchClass</strong>: the pitch <a href="https://en.wikipedia.org/wiki/Pitch_class">pitch class</a>
(letter in uppercase, accidentals using 'b' or '#', never 'x', no octave)</li>
<li><strong>acc</strong>: a string with the accidentals or '' if no accidentals (never null)</li>
<li><strong>oct</strong>: a integer with the octave. If not present in the pitch, is set to 4</li>
<li><strong>alter</strong>: the integer representic the accidentals (0 for no accidentals,</li>
<li><strong>midi</strong>: {Integer} the midi value
-1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)</li>
<li><strong>chroma</strong>: {Integer} the pitch class interger value (between 0 and 11)
where C=0, C#=1, D=2...B=11</li>
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
<td class="name"><code>pitch</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch to get the properties from</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/props.js">props.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/props.js#L31">lineno 31</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>pitch/pitch</li>
</ul>
</dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an object with the pitch components or null if its not a valid pitch</p>
</div>
<h5>Example</h5>
<pre class="prettyprint"><code>props('C#2') // => { }</code></pre>
</dd>
<dt>
<h4 class="name" id="transpose"><span class="type-signature"></span>transpose<span class="signature">(pitch, interval)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Transpose a pitch by an interval</p>
<p>This is an <em>strict</em> function: if pitch or interval are not valid, an exception
is thrown</p>
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
<td class="name"><code>pitch</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch to be transposed</p></td>
</tr>
<tr>
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>(Optional) the interval. If not present, a partially
applied function with the pitch is returned</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/transpose.js">transpose.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/transpose.js#L24">lineno 24</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the resulting pitch</p>
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
<pre class="prettyprint"><code>transpose('E', 'M2') // => 'F#4'
transpose('C', 'M-2') // => 'Bb3'
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
['C', 'D', 'E'].map(transpose.by('M2')) // => ['D4', 'E4', 'F#4']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
