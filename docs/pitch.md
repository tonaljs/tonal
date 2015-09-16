# Pitch module

This is the basic building block of tonal. A pitch is a string with the note pitch in scientific notation. To create a pitch use `pitch/pitch` (although you normally won't need this method):

```js
var pitch = require('tonal/pitch/pitch')
pitch('c') // => 'C4'
pitch('c', 2, 1) // => 'C#2'
pitch('bbb') // => 'Bbb4'
pitch('eb2') // => 'Eb2'
```


You can get all the properties with the `props` function:

```js
var pitch = require('tonal/pitch/props')
pitch('C4') // => { name: 'C4', pitchClass: 'C', midi: 60 ... }
pitch('D#5') // => { name: 'D#5', ... }
pitch('Bb2') // => { name: 'Bb2', ... }
```

Work with midi and frequencies:

```js
var midi = require('tonal/pitch/midi')
midi('g#2') // => 44
var fromMidi = require('tonal/pitch/fromMidi')
fromMidi(44) // => 'G#2'
var freq = require('tonal/pitch/freq')
freq('A3') // => 220
freq('A4', 444) // => 444
var fromFreq = require('tonal/pitch/fromFreq')
fromFreq(330) // => 'E4'
```

Transpose pitches:

```js
var transpose = require('tonal/pitch/transpose')
transpose('C2', '5P') // => 'G5'
['C', 'D', 'E'].map(transpose('3M')) // => ['E4', 'F#4', 'G#4']
var interval = require('tonal/pitch/interval')
interval('C', 'D') // => '2M'
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
<h4 class="name" id="midi"><span class="type-signature"></span>midi<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the midi of a pitch</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/midi.js">midi.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/midi.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>midi('a4') // => 69</code></pre>
</dd>
<dt>
<h4 class="name" id="octave"><span class="type-signature"></span>octave<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the octave of a pitch</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/octave.js">octave.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/octave.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>octave('a4') // => 4</code></pre>
</dd>
<dt>
<h4 class="name" id="pitchClass"><span class="type-signature"></span>pitchClass<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the <a href="https://en.wikipedia.org/wiki/Pitch_class">pitchClass</a> of a pitch</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/pitchClass.js">pitchClass.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/pitchClass.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>pitchClass('a4') // => 69</code></pre>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="cents"><span class="type-signature"></span>cents<span class="signature">(from, to)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return the distance in cents between to pitches or frequencies with two
decimals precision</p>
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
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>first pitch or frequency</p></td>
</tr>
<tr>
<td class="name"><code>to</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>other pitch or frequency</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/cents.js">cents.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/cents.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the distance in cents</p>
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
<pre class="prettyprint"><code>cents(440, 444) // => 15.66
cents('A4', 444) // => 15.66
cents('A4', 'A#4') // => 100</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/enharmonic.js#L15">lineno 15</a>
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
<h4 class="name" id="fromFreq"><span class="type-signature"></span>fromFreq<span class="signature">(freq)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given a frequency, get the pitch. It will round the frequency to the nearest
pitch frequency</p>
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
<td class="name"><code>freq</code></td>
<td class="type">
<span class="param-type">Float</span>
</td>
<td class="description last"><p>the frequency</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/fromFreq.js">fromFreq.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fromFreq.js#L14">lineno 14</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li><a href="global.html#cents">cents</a></li>
</ul>
</dd>
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
<h4 class="name" id="fromKey"><span class="type-signature"></span>fromKey<span class="signature">(key)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the pitch of the given piano key number</p>
<p>This method doesn't take into account diatonic spelling. Always the same
pitch class is given to the same key number.</p>
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
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the key number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/fromKey.js">fromKey.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fromKey.js#L16">lineno 16</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>pitch/fromMidi</li>
</ul>
</dd>
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
<h4 class="name" id="interval"><span class="type-signature"></span>interval<span class="signature">(from, to)</span><span class="type-signature"> &rarr; {String}</span></h4>
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
<a href="https://github.com/danigb/tonal/blob/master/interval.js">interval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/interval.js#L20">lineno 20</a>
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
<pre class="prettyprint"><code>interval('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(interval.from('C')) // => ['P1', 'M2', 'm3']</code></pre>
</dd>
<dt>
<h4 class="name" id="intervalFrom"><span class="type-signature"></span>intervalFrom<span class="signature">(from)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Partial apply <code>picth/interval</code> to return a interval from a pitch</p>
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
<td class="description last"><p>the base pitch</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/intervalFrom.js">intervalFrom.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/intervalFrom.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a function that returns a interval from the base pitch
to a given one</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>['C', 'D', 'E'].map(intervalFrom('C')) // => ['1P', '2M', '3M']</code></pre>
</dd>
<dt>
<h4 class="name" id="intervalTo"><span class="type-signature"></span>intervalTo<span class="signature">(to)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Partial apply <code>picth/interval</code> to return a interval to a pitch</p>
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
<td class="name"><code>to</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the destination pitch</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/intervalTo.js">intervalTo.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/intervalTo.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a function that returns a interval from a pitch
to the destination one</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>['C', 'D', 'E'].map(intervalTo('E')) // => ['3M', '2M', '1P']</code></pre>
</dd>
<dt>
<h4 class="name" id="key"><span class="type-signature"></span>key<span class="signature">(pitch)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return the key number from a pitch</p>
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
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/key.js">key.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/key.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the key number</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Integer</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="letter"><span class="type-signature"></span>letter<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the letter of a pitch (optionally move a number of steps)</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/letter.js">letter.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/letter.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>letter('c#5') // => 'C'
letter('c', 0) // => 'C'
letter('c', 1) // => 'D'
letter('c', 2) // => 'E'</code></pre>
</dd>
<dt>
<h4 class="name" id="pitch"><span class="type-signature"></span>pitch<span class="signature">(pitch, alteration, octave)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the scientific notation of a pitch from a pitch and optional octave and
alteration. The octave and alteration will override the ones from the pitch</p>
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
<td class="description last"><p>a pitch, a pitch class or a pitch letter</p></td>
</tr>
<tr>
<td class="name"><code>alteration</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the alteration number
(overrides the one from the pitch string). Can be null to avoid overrides</p></td>
</tr>
<tr>
<td class="name"><code>octave</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the octave (overrides the one from the pitch string)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/pitch.js">pitch.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/pitch.js#L26">lineno 26</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the pitch in scientific notation or null if not valid pitch</p>
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
<pre class="prettyprint"><code>pitch('c') // => 'C4'
pitch('c', '#') // => 'C#4'
pitch('c', '#', 2) // => 'C#2'
pitch('c#4') // => 'C#4'
pitch('C#4', 'b', 2) // => 'Cb2'
pitch('C#4', null, 2) // => 'C#2'
pitch('C7', -1) // => 'Cb7'
pitch('bluf') // => null</code></pre>
</dd>
<dt>
<h4 class="name" id="props"><span class="type-signature"></span>props<span class="signature">(pitch)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get pitch properties</p>
<p>It returns an object with the following properties:</p>
<ul>
<li><strong>name</strong>: the propsd pitch string</li>
<li><strong>letter</strong>: the pitch letter <strong>always</strong> in uppercase</li>
<li><strong>str</strong>: the pitch in scientific representation</li>
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
<a href="https://github.com/danigb/tonal/blob/master/props.js#L30">lineno 30</a>
</li>
</ul></dd>
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
<a href="https://github.com/danigb/tonal/blob/master/transpose.js#L25">lineno 25</a>
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
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
