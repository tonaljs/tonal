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
<h4 class="name" id="accidentals"><span class="type-signature"></span>accidentals<span class="signature">(number)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given an alteration number, get the accidentals string</p>
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
<td class="name"><code>number</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the number of accidentals (posivite for shaprs,
negative for flats, zero for an empty string)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/accidentals.js">lib/note/accidentals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/accidentals.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an accidentals string</p>
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
<pre class="prettyprint"><code>var accidentals = require('tonal/note/accidentals')
accidenals(2) // => '##'
accidenals(-2) // => 'bb'
accidenals(0) // => ''</code></pre>
</dd>
<dt>
<h4 class="name" id="areIntervals"><span class="type-signature"></span>areIntervals<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a list, check it its a note list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/areNotes.js">lib/list/areNotes.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/areNotes.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="areIntervals"><span class="type-signature"></span>areIntervals<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a list, check it its a interval list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/areIntervals.js">lib/list/areIntervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/areIntervals.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="binary"><span class="type-signature"></span>binary<span class="signature">(set)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return a binary representation of the set</p>
<p>The binary representation of a set is a binary number in which the first
digit is always 1 (the 'P1' interval). It's important to note that
<code>set === intervals(binary(set))</code> is not always true (you loose some
information when converting to a binary set)</p>
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
<span class="param-type">Array</span>
|
<span class="param-type">Integer</span>
|
<span class="param-type">Binary</span>
</td>
<td class="description last"><p>the set to get the binary from</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/set/toBinary.js">incubation/lib/set/toBinary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/set/toBinary.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the binary string representation of that set</p>
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
<h4 class="name" id="chromaticList"><span class="type-signature"></span>chromaticList<span class="signature">(length)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Returns a interval list with a chromatic scale</p>
<p>The harmonic chromatic scale is the same whether rising or falling and
includes all the notes in the major, harmonic minor or melodic minor
scales plus flattened second and sharpened fourth degrees</p>
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
<td class="name"><code>length</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the number of items in the list</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/misc/chromaticList.js">incubation/lib/misc/chromaticList.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/misc/chromaticList.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a list (of intervals or notes, depending of params)</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="classNumber"><span class="type-signature"></span>classNumber<span class="signature">(interval)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_class">interval class</a> of
a given interval.</p>
<p>In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes</p>
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
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Interval</span>
</td>
<td class="description last"><p>the Interval</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/interval/classNumber.js">incubation/lib/interval/classNumber.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/interval/classNumber.js#L21">lineno 21</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>A value between 0 and 6</p>
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
<pre class="prettyprint"><code>var classNumber = require('tonal/classNumber')
classNumber('P8') // => 0
classNumber('m6') // => 4</code></pre>
</dd>
<dt>
<h4 class="name" id="coerce"><span class="type-signature"></span>coerce<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Internal function: ensures the param is a string</p>
<p>It allows parse to be called on itself:
<code>parse(parse(parse('C3')))</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/coerceParam.js">lib/utils/coerceParam.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/coerceParam.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="enharmonic"><span class="type-signature"></span>enharmonic<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the enharmonic of a note with a given step</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/enharmonic.js">lib/note/enharmonic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/enharmonic.js#L11">lineno 11</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'</code></pre>
</dd>
<dt>
<h4 class="name" id="fifths"><span class="type-signature"></span>fifths<span class="signature">(step)</span><span class="type-signature"> &rarr; {String|Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the relation between a note and the number of steps in the
cycle of fifths (with root in C)</p>
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
<td class="name"><code>step</code></td>
<td class="type">
<span class="param-type">Integer</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>if it's an integer, returns the note step after
moving <code>step</code> steps in the cycle. If it's a step string, returns the number
of steps starting from 'C' to the given step</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/misc/fifths.js">incubation/lib/misc/fifths.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/misc/fifths.js#L24">lineno 24</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<ul>
<li>the note name or the number of steps (depending of the param)</li>
</ul>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var cycle = require('tonal/cycle-of-fifths')
cycle(0) // => 'C'
cycle(1) // => 'G'
cycle(-1) // => 'F'
cycle('C') // => 0
cycle('G') // => 1
cycle('F') // => -1
cycle('C2') // => undefined</code></pre>
</dd>
<dt>
<h4 class="name" id="freq"><span class="type-signature"></span>freq<span class="signature">(note, tuning)</span><span class="type-signature"> &rarr; {Float}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the note frequency in hertzs</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note</p></td>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/note/freq.js">lib/note/freq.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/freq.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<ul>
<li>the note frequency</li>
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
<p>Get the note of the given midi number</p>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/note/fromMidi.js">lib/note/fromMidi.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/fromMidi.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the note or null if there's no pitchClass available to this note name</p>
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
<h4 class="name" id="fromNotes"><span class="type-signature"></span>fromNotes<span class="signature">(from, to)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the interval between two notes</p>
<p>This is the function to calculate distances (expressed in intervals) for
two notes. An alias of this function is in <code>note/distance</code></p>
<p>This is an 'strict' function: if the notes are note valid, an
exception is thrown.</p>
<p>You can get a <em>curryfied</em> version of this function by passing only one
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
<td class="description last"><p>first note</p></td>
</tr>
<tr>
<td class="name"><code>to</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>second note</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/fromNotes.js">lib/interval/fromNotes.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/fromNotes.js#L26">lineno 26</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the interval between notes</p>
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
<pre class="prettyprint"><code>fromNotes('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(fromNotes('C')) // => ['P1', 'M2', 'm3']</code></pre>
</dd>
<dt>
<h4 class="name" id="generic"><span class="type-signature"></span>generic<span class="signature">(number)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<ul>
<li>Given an interval number, return its generic interval</li>
</ul>
<p>Probably you don't need this function. Use ´interval/parse´ to obtain the
generic number of an interval</p>
<p>The generic interval is an object with two properties:
- num: {Integer} the generic number
- perfectable: {Boolean} if the generic interval is perfectable or note</p>
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
<td class="name"><code>number</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the interval number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/generic.js">lib/interval/generic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/generic.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the generic interval object</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="interval"><span class="type-signature"></span>interval<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Create a interval from its components</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/interval.js">lib/interval/interval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/interval.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="invert"><span class="type-signature"></span>invert<span class="signature">(interval, ascending)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Invert an interval</p>
<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_(music">inversion</a>#Inversion)
of an interval.</p>
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
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the interval to invert</p></td>
</tr>
<tr>
<td class="name"><code>ascending</code></td>
<td class="type">
<span class="param-type">Boolean</span>
</td>
<td class="description last"><p>(Optional) if true, the inverted interval will
be ascending, if false (by default) the direction will be the same as the
given interval</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/invert.js">lib/interval/invert.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/invert.js#L20">lineno 20</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>simple('M9') // => 'M2'
simple('M-10') // => 'M-3'
simple('P-11', true) // => 'P4'</code></pre>
</dd>
<dt>
<h4 class="name" id="isBinaryList"><span class="type-signature"></span>isBinaryList<span class="signature">(number)</span><span class="type-signature"> &rarr; {boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Determine if a given number is a valid binary list number</p>
<p>A valid binary list is a binary number with two conditions:
- its 12 digit long
- starts with 1 (P1 interval)</p>
<p>The binary number can be expressed in decimal as well (i.e 2773)</p>
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
<td class="name"><code>number</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the number to test</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/isBinary.js">lib/list/isBinary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/isBinary.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if its a valid scale binary number</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">boolean</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>isBinary('101010101010') // => true
isBinary(2773) // => true
isBinary('001010101010') // => false (missing first 1)
isBinary('1001') // => false</code></pre>
</dd>
<dt>
<h4 class="name" id="isInterval"><span class="type-signature"></span>isInterval<span class="signature">(interval)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Test if a string is a valid interval</p>
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
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the interval to be tested</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/isInterval.js">lib/interval/isInterval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/isInterval.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if its a valid interval</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false</code></pre>
</dd>
<dt>
<h4 class="name" id="isNote"><span class="type-signature"></span>isNote<span class="signature">(string)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Determine if the given string is a valid note</p>
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
<td class="name"><code>string</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the string to be tested</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/isNote.js">lib/note/isNote.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/isNote.js#L8">lineno 8</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if is a valid note</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="list"><span class="type-signature"></span>list<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get a list of notes or isInterval</p>
<p>This is the principal function to create lists. Basically does the same as
<code>list/parse</code> but if an array is given, it returns it without modification
or validation (so, only pass an array when you are sure that is a valid list)</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the list to be parsed or passed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/list.js">lib/list/list.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/list.js#L21">lineno 21</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array list of notes or intervals (or anything it you pass
an array to the function)</p>
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
<pre class="prettyprint"><code>list('c d# e5') // => ['C4', 'D#4', 'E5']
list('P1 m2') // => ['P1', 'm2']
list('bb2') // => ['Bb2']
list('101') // => ['P1', 'M2']
// to validate an array
list(['C#3', 'P2'].join(' ')) // => null</code></pre>
</dd>
<dt>
<h4 class="name" id="listDict"><span class="type-signature"></span>listDict<span class="signature">(data, parser)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a list dictionary from a hash map data and a name parser</p>
<p>A list dictionary is a function that generates lists from keys. It uses
a parser to remove the tonic (if present) from the key. Then look up
into the hash for a name and pass it to a list generator.</p>
<p>If the returned dictionary is called without arguments, a list of all keys
is returned</p>
<p>If the name is not found in the hash data, it throws an exception</p>
<p>The parser should receive one string and return an object with two string
properties:
- tonic: a note if any, or null
- type: (required) the key to lookfor</p>
<p>The scale/scale and chord/chord functions uses this to create a generator.</p>
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
<td class="name"><code>data</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>the data hash (dictionary)</p></td>
</tr>
<tr>
<td class="name"><code>parser</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>a function that parses the name and returns
an object with tonic (if not present) and the name properties</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/dictionary.js">lib/list/dictionary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/dictionary.js#L36">lineno 36</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the list dictionary</p>
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
<pre class="prettyprint"><code>var listDict = require('tonal/data/listDict')
var scale = listDict({'major': 2773})
scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
// get keys:
scale() // => ['major']</code></pre>
</dd>
<dt>
<h4 class="name" id="memoize"><span class="type-signature"></span>memoize<span class="signature">(func)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Simplest and fastest memoize function I can imagine</p>
<p>This is in base of two restrictive asumptions:
- the function only receives <strong>one paramater</strong>
- the parameter <strong>is a string</strong></p>
<p>For a more complete memoize solution see:
https://github.com/addyosmani/memoize.js</p>
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
<td class="name"><code>func</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>the function to memoize</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/fastMemoize.js">lib/utils/fastMemoize.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/fastMemoize.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>A memoized function</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="midi"><span class="type-signature"></span>midi<span class="signature">(note)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the midi number of the given note</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/midi.js">lib/note/midi.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/midi.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<ul>
<li>the midi number</li>
</ul>
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
<pre class="prettyprint"><code>var midi = require('tonal/note/midi')
midi('A4') // => 69</code></pre>
</dd>
<dt>
<h4 class="name" id="name"><span class="type-signature"></span>name<span class="signature">(note)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the name (step and accidentals) of the note</p>
<p>The step is <strong>always</strong> in uppercase. The accidentals is always using '#' or 'b'
never 'x'</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/name.js">lib/note/name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/name.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the note name</p>
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
<pre class="prettyprint"><code>name('C#4') // => 'C#'
name('Gx4') // => 'G##'</code></pre>
</dd>
<dt>
<h4 class="name" id="note"><span class="type-signature"></span>note<span class="signature">(note, alteration, octave)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Create a note from its components (step, alteration, octave)</p>
<p>It returns the cannonical representation of a note (ie. 'C##2', 'Db3')
In tonal it means a string with:
- step (in upper case)
- accidentals (with '#' or 'b', never 'x')
- a octave number (a positive decimal, always present)</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>or step - a string with a note or a strp</p></td>
</tr>
<tr>
<td class="name"><code>alteration</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the alteration number. If not set
uses the alterations from the note (if present) or 0</p></td>
</tr>
<tr>
<td class="name"><code>octave</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the note octave. If note set uses the
octave from the note (if present) or 4</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/note.js">lib/note/note.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/note.js#L27">lineno 27</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>note('D', -2, 3) // => 'Dbb3'
note('G', 2, 1) // => 'G##1'
note('C', 1) // => 'C#4'
note('C##', -1) // => 'Cb4'
note('Cx') // => 'C##4'
note('Cx', null, 2) // => 'C##2'</code></pre>
</dd>
<dt>
<h4 class="name" id="opposite"><span class="type-signature"></span>opposite<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given an interval, return its opposite</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/opposite.js">lib/interval/opposite.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/opposite.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(name)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse an interval and get its properties</p>
<p>This method retuns an object with the following properties:
- interval: the parsed interval
- quality: the quality (one of <code>dmPMA</code> for dimished, minor, perfect, major and
augmented respectively)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- num: diatonic number (a positive integer bigger that 0)
- generic: generic interval (https://en.wikipedia.org/wiki/Generic_interval), an
integer between (0 and 6)
- oct: the number of octaves (a positive integer)
- perfectable: true if the interval is perfectable
- alter: an integer with the alteration respect to the cannonical.
For perfectable intervals is 'P': 0, 'd': -1, 'A': +1 and for
non perfectable intervals is 'M': 0, 'm', -1, 'd': -2, 'A': +1</p>
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
<td class="description last"><p>the name of the interval to be parsed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/parse.js">lib/interval/parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/parse.js#L29">lineno 29</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a interval object or null if not a valid interval</p>
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
<pre class="prettyprint"><code>var parse = require('tonal/interval/parse')
parse('P-5') // => {quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
parse('m9') // => {quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a string to a note or interval list</p>
<p>The string can be notes or intervals separated by white spaces or a binary
or decimal representation of a interval list</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the string to be parsed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/parse.js">lib/list/parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/parse.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of notes or intervals, null if not valid list</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(chord)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a chord name and returns the tonic (if any) and the chord type</p>
<p>The returned object has the properties:
- tonic: the tonic note or null if not specified
- type: the chord type</p>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/parse.js">lib/chord/parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/chord/parse.js#L16">lineno 16</a>
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
<pre class="prettyprint"><code>parse('C#major') // => { tonic: 'C#', type: 'major' }
parse('minor') // => { tonic: null, type: 'minor' }</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(note)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a note and return its properties</p>
<p>It returns an object with the following properties:
- <strong>note</strong>: the parsed note
- <strong>step</strong>: the step letter <strong>always</strong> in uppercase
- <strong>acc</strong>: a string with the accidentals or '' if no accidentals (never null)
- <strong>oct</strong>: a integer with the octave. If not present in the note, is set to 4
- <strong>alter</strong>: the integer representic the accidentals (0 for no accidentals,
-1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)
- <strong>pc</strong>: the <a href="https://en.wikipedia.org/wiki/Pitch_class#Integer_notation">pitch class</a>
of the note. The pitch class is an integer value between 0 and 11
where C=0, C#=1, D=2...B=11</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note (pitch) to be p</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/parse.js">lib/note/parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/parse.js#L24">lineno 24</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an object with the note components or null if its not a valid note</p>
</div>
<h5>Example</h5>
<pre class="prettyprint"><code>parse('C#2') // => { }</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/parse.js">lib/scale/parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/parse.js#L16">lineno 16</a>
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
<h4 class="name" id="reverse"><span class="type-signature"></span>reverse<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the reverse (retrograde) of a list</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the list to be reversed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/reverse.js">lib/list/reverse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/reverse.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>The reversed list</p>
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
<h4 class="name" id="rotate"><span class="type-signature"></span>rotate<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Rotate a list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/rotate.js">lib/list/rotate.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/list/rotate.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="step"><span class="type-signature"></span>step<span class="signature">(note, steps)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Transpose note steps</p>
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
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note to get the step from</p></td>
</tr>
<tr>
<td class="name"><code>steps</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the number of steps to move (ascending if
positive or descending oterwise). 0 by default</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/step.js">lib/note/step.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/note/step.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the step (in uppercase)</p>
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
<pre class="prettyprint"><code>step('C', 1) // => 'D'
step('C#', 1) // => 'D'
step('C#2', -1) // => 'B'
step('C#') // => 'C'</code></pre>
</dd>
<dt>
<h4 class="name" id="strict"><span class="type-signature"></span>strict<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Decorate a function to throw exception when return null</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/strict.js">lib/utils/strict.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/strict.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var parse = require('tonal/note/parse')
var strictParse = strict('Not a valid note', parse)
strictParse('P8') // throws Error with msg 'Not a valid note'</code></pre>
</dd>
<dt>
<h4 class="name" id="timeMeter"><span class="type-signature"></span>timeMeter<span class="signature">(meter)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a time meter signature</p>
<p>The returned time meter object has the following properties:
- beats: number of beats per measure (integer)
- subdivision: the meter subdivision (4 or 8)
- measure: the length (in duration value) of the measure</p>
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
<td class="name"><code>meter</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the string representing the time meter</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/time-meter.js">incubation/lib/time/time-meter.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/time-meter.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a time meter object</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="transpose"><span class="type-signature"></span>transpose<span class="signature">(interval, note)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Transpose a note by an interval</p>
<p>This is the principal function of interval module. You should be able to
transpose any note with any interval. (if not, is a bug ;-)</p>
<p>You can also get a currified version by passing one parameter instead
of two. For example, with <code>transpose('M2')</code> you get a function that transposes
any note by a 'M2' interval. The same way, with <code>transpose('C4')</code> you get
a function that transposes C4 to the given interval. See examples below.</p>
<p>This is an <em>strict</em> function: if note or interval are not valid, an exception
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
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the interval to tranpose</p></td>
</tr>
<tr>
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note to be transposed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/transpose.js">lib/interval/transpose.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/transpose.js#L36">lineno 36</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the resulting note</p>
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
<pre class="prettyprint"><code>transpose('M2', 'E') // => 'F#4'
transpose('M-2', 'C') // => 'Bb3'
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']</code></pre>
</dd>
<dt>
<h4 class="name" id="unstrict"><span class="type-signature"></span>unstrict<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Decorate a function to return null when a exception is thrown</p>
<p>The opposite of <code>util/strict</code></p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/unstrict.js">lib/utils/unstrict.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/utils/unstrict.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var alwaysNull = unstrict(function () { throw Error() })
alwaysNull() // => null</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Simplify an interval</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/simple.js">lib/interval/simple.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/simple.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>simple('M9') // => 'M2'
simple('M-9') // => 'M-2'
simple('M-9', true) // => 'M2'</code></pre>
</div>
</article>
</section>
<section>
<article>
<div class="container-overview">
<div class="description"><p>Get the semitones distance of an intervals</p>
<p>This is an <em>strict</em> function: if the interval is note valid, an exception
is thrown.</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/semitones.js">lib/interval/semitones.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/semitones.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>semitones('P5') // => 7</code></pre>
</div>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Get the 2048 scales</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scaleSpace.js">lib/scale/scaleSpace.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/scale/scaleSpace.js#L2">lineno 2</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>scaleSpace() // => an array of 2048 binary numbers</code></pre>
</div>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Given a note duration name, get its <a href="https://en.wikipedia.org/wiki/Note_value">value</a></p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/duration-value.js">incubation/lib/time/duration-value.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/duration-value.js#L3">lineno 3</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>time/duration-name</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>var value = require('tonal/time/duration-value')
// You can convert from names to values:
value('long');          // => 4
value('double');         // => 2
value('whole');          // => 1
value('half');           // => 1/2
value('quarter');        // => 1/4
value('eighth');         // => 1/8
value('sixteenth');      // => 1/16
value('thirty-second');  // => 1/32
// From letter and dots to values:
value('h');   // => 1/2
value('h.');  // => dot: 1/2 + 1/4
value('h..'); // => double dot: 1/2 + 1/4 + 1/8
value('ht');  // => triplet: (1/2 + 1/ 2) / 3
value('q');   // => 1/4
value('q.');  // => dot: 1/4 + 1/8
value('q..'); // => double dot: 1/4 + 1/8 + 1/16
value('qt');  // => triplet: (1/4 + 1/4) / 3
// From number string to value:
value('2');   // => 1/2
value('2.');  // => dot: 1/2 + 1/4
value('2t');  // => triplet: (1/2 + 1/ 2) / 3
value('2..'); // => double dot: 1/2 + 1/4 + 1/8
value('4');   // => 1/4
value('4.');  // => dot: 1/4 + 1/8
value('4..'); // => double dot: 1/4 + 1/8 + 1/16
value('4t');  // => triplet: (1/4 + 1/4) / 3</code></pre>
</div>
</article>
</section>
<section>
<article>
<div class="container-overview">
<div class="description"><p>Given a <a href="https://en.wikipedia.org/wiki/Note_value">note value</a> get its name</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/duration-name.js">incubation/lib/time/duration-name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/incubation/lib/time/duration-name.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>var name = require('tonal/time/duration-name')
name(1/2 + 1/4)        // => 'h.'
name(1/4 + 1/2 + 1/8)  // => 'q..'</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->