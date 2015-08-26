# Note module

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
<a href="https://github.com/danigb/tonal/blob/master/enharmonic.js">enharmonic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/enharmonic.js#L10">lineno 10</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/freq.js">freq.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/freq.js#L15">lineno 15</a>
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
<a href="https://github.com/danigb/tonal/blob/master/fromMidi.js">fromMidi.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fromMidi.js#L15">lineno 15</a>
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
<a href="https://github.com/danigb/tonal/blob/master/isNote.js">isNote.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/isNote.js#L8">lineno 8</a>
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
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(note)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a note and return its properties</p>
<p>Probably you want to use <code>note/note</code> instead.</p>
<p>It returns an object with the following properties:</p>
<ul>
<li><strong>name</strong>: {String} the parsed note string</li>
<li><strong>letter</strong>: the note letter <strong>always</strong> in uppercase</li>
<li><strong>pitchClass</strong>: the note <a href="https://en.wikipedia.org/wiki/Pitch_class">pitch class</a>
(letter in uppercase, accidentals using 'b' or '#', never 'x', no octave)</li>
<li><strong>acc</strong>: a string with the accidentals or '' if no accidentals (never null)</li>
<li><strong>oct</strong>: a integer with the octave. If not present in the note, is set to 4</li>
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
<a href="https://github.com/danigb/tonal/blob/master/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/parse.js#L31">lineno 31</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>note/note</li>
</ul>
</dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an object with the note components or null if its not a valid note</p>
</div>
<h5>Example</h5>
<pre class="prettyprint"><code>parse('C#2') // => { }</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/step.js">step.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/step.js#L18">lineno 18</a>
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
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Create a note from its components (letter, octave, alteration)</p>
<p>It returns the cannonical representation of a note (ie. 'C##2', 'Db3')
In tonal it means a string with:
- letter (in upper case)
- accidentals (with '#' or 'b', never 'x')
- a octave number (a positive decimal, always present)</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/note.js">note.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/note.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>note('D', -2, 3) // => 'Dbb3'
note('G', 2, 1) // => 'G##1'
note('C', 1) // => 'C#4'
note('C##', -1) // => 'Cb4'
note('Cx') // => 'C##4'
note('Cx', null, 2) // => 'C##2'</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
