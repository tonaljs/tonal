"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[940],{1744:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>c,contentTitle:()=>r,default:()=>l,frontMatter:()=>d,metadata:()=>o,toc:()=>a});var t=n(7624),s=n(2172);const d={title:"MIDI",sidebar_position:1},r=void 0,o={id:"notation/midi",title:"MIDI",description:"tonal npm version",source:"@site/docs/notation/midi.md",sourceDirName:"notation",slug:"/notation/midi",permalink:"/tonal/docs/notation/midi",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/notation/midi.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"MIDI",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Notation and Conversion"},next:{title:"ABC Notation",permalink:"/tonal/docs/notation/abc-notation"}},c={},a=[{value:"<code>Midi.toMidi</code>",id:"miditomidi",level:3},{value:"<code>toMidi(note: string | number) =&gt; number | null</code>",id:"tomidinote-string--number--number--null",level:4},{value:"<code>Midi.midiToFreq</code>",id:"midimiditofreq",level:3},{value:"<code>midiToFreq(midi: number, tuning = 440) =&gt; number</code>",id:"miditofreqmidi-number-tuning--440--number",level:4},{value:"<code>Midi.midiToNoteName</code>",id:"midimiditonotename",level:3},{value:"<code>midiToNoteName(midi: number) =&gt; string</code>",id:"miditonotenamemidi-number--string",level:4},{value:"<code>Midi.freqToMidi</code>",id:"midifreqtomidi",level:3},{value:"<code>freqToMidi(freq: number) =&gt; number</code>",id:"freqtomidifreq-number--number",level:4},{value:"<code>Midi.pcset</code>",id:"midipcset",level:3},{value:"<code>pcset(set: number[] | string) =&gt; number[]</code>",id:"pcsetset-number--string--number",level:4},{value:"<code>Midi.pcsetNearest</code>",id:"midipcsetnearest",level:3},{value:"<code>pcsetNearest(set: number[] | string) =&gt; (midi: number) =&gt; number | undefined</code>",id:"pcsetnearestset-number--string--midi-number--number--undefined",level:4},{value:"<code>Midi.pcsetSteps</code>",id:"midipcsetsteps",level:3},{value:"<code>pcsetSteps(set: number[] | string, tonic: number) =&gt; (index: number) =&gt; number</code>",id:"pcsetstepsset-number--string-tonic-number--index-number--number",level:4}];function m(e){const i={a:"a",code:"code",h3:"h3",h4:"h4",img:"img",p:"p",pre:"pre",...(0,s.M)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.img,{src:"https://img.shields.io/badge/@tonaljs-midi-yellow.svg?style=flat-square",alt:"tonal"})," ",(0,t.jsx)(i.a,{href:"https://www.npmjs.com/package/@tonaljs/midi",children:(0,t.jsx)(i.img,{src:"https://img.shields.io/npm/v/@tonaljs/midi.svg?style=flat-square",alt:"npm version"})})]}),"\n",(0,t.jsxs)(i.p,{children:[(0,t.jsx)(i.code,{children:"@tonaljs/midi"})," is collection of functions to convert from and to midi numbers"]}),"\n",(0,t.jsx)(i.h3,{id:"miditomidi",children:(0,t.jsx)(i.code,{children:"Midi.toMidi"})}),"\n",(0,t.jsx)(i.h4,{id:"tomidinote-string--number--number--null",children:(0,t.jsx)(i.code,{children:"toMidi(note: string | number) => number | null"})}),"\n",(0,t.jsx)(i.p,{children:"Given a note name or number, return the midi number. Midi numbers are always in range 0..127"}),"\n",(0,t.jsx)(i.p,{children:"Examples:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:'Midi.toMidi("C4"); // => 60\nMidi.toMidi("#"); // => null\nMidi.toMidi(60); // => 60\nMidi.toMidi("60"); // => 60\nMidi.toMidi(-1); // => null\n'})}),"\n",(0,t.jsx)(i.h3,{id:"midimiditofreq",children:(0,t.jsx)(i.code,{children:"Midi.midiToFreq"})}),"\n",(0,t.jsx)(i.h4,{id:"miditofreqmidi-number-tuning--440--number",children:(0,t.jsx)(i.code,{children:"midiToFreq(midi: number, tuning = 440) => number"})}),"\n",(0,t.jsx)(i.p,{children:"Given a midi number, return the frequency:"}),"\n",(0,t.jsx)(i.p,{children:"Examples:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:"Midi.midiToFreq(60); // => 261.6255653005986\nMidi.midiToFreq(69); // => 440\nMidi.midiToFreq(69, 443); // => 443\n"})}),"\n",(0,t.jsx)(i.h3,{id:"midimiditonotename",children:(0,t.jsx)(i.code,{children:"Midi.midiToNoteName"})}),"\n",(0,t.jsx)(i.h4,{id:"miditonotenamemidi-number--string",children:(0,t.jsx)(i.code,{children:"midiToNoteName(midi: number) => string"})}),"\n",(0,t.jsxs)(i.p,{children:["Given a midi number, returns a note name. The altered notes will have flats unless explicitly set with the optional ",(0,t.jsx)(i.code,{children:"useSharps"})," parameter."]}),"\n",(0,t.jsx)(i.p,{children:"Examples:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:'Midi.midiToNoteName(61); // => "Db4"\nMidi.midiToNoteName(61, { pitchClass: true }); // => "Db"\nMidi.midiToNoteName(61, { sharps: true }); // => "C#4"\nMidi.midiToNoteName(61, { pitchClass: true, sharps: true }); // => "C#"\n// it rounds to nearest note\nmidiToNoteName(61.7); // => "D4"\n'})}),"\n",(0,t.jsx)(i.h3,{id:"midifreqtomidi",children:(0,t.jsx)(i.code,{children:"Midi.freqToMidi"})}),"\n",(0,t.jsx)(i.h4,{id:"freqtomidifreq-number--number",children:(0,t.jsx)(i.code,{children:"freqToMidi(freq: number) => number"})}),"\n",(0,t.jsx)(i.p,{children:"Given a frequency in hertz, returns the midi number. The midi number can have decimals (with two digits precision)"}),"\n",(0,t.jsx)(i.p,{children:"Example:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:"Midi.freqToMidi(220); //=> 57\nMidi.freqToMidi(261.62); //=> 60\nMidi.freqToMidi(261); //=> 59.96\n"})}),"\n",(0,t.jsx)(i.h3,{id:"midipcset",children:(0,t.jsx)(i.code,{children:"Midi.pcset"})}),"\n",(0,t.jsx)(i.h4,{id:"pcsetset-number--string--number",children:(0,t.jsx)(i.code,{children:"pcset(set: number[] | string) => number[]"})}),"\n",(0,t.jsx)(i.p,{children:"Return the pitch class set from a number of midi note numbers or pcset chroma."}),"\n",(0,t.jsxs)(i.p,{children:["A pitch class set in this ",(0,t.jsx)(i.code,{children:"Midi"})," package refers to a unique sorted collection of notes between 0 and 11 (that represents the pitch class of the note."]}),"\n",(0,t.jsx)(i.p,{children:"Example:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:'Midi.pcset([62, 63, 60, 65, 70, 72]); // => [0, 2, 3, 5, 10]\nMidi.pcset("100100100101"); // => [0, 3, 6, 9, 11]\n'})}),"\n",(0,t.jsxs)(i.p,{children:["You can read more about pitch classes on ",(0,t.jsx)(i.code,{children:"Note"})," module."]}),"\n",(0,t.jsxs)(i.p,{children:["The string is a pitch class chroma, a string with a binary representation of a set. Read more about pitch class chroma in ",(0,t.jsx)(i.code,{children:"Pcset"})," module documentation."]}),"\n",(0,t.jsx)(i.h3,{id:"midipcsetnearest",children:(0,t.jsx)(i.code,{children:"Midi.pcsetNearest"})}),"\n",(0,t.jsx)(i.h4,{id:"pcsetnearestset-number--string--midi-number--number--undefined",children:(0,t.jsx)(i.code,{children:"pcsetNearest(set: number[] | string) => (midi: number) => number | undefined"})}),"\n",(0,t.jsx)(i.p,{children:"Returns a function that finds the nearest midi note of a pitch class set. Can be used to constrain a note to a scale, for example:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:'const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);\n[60, 61, 62, 63, 64, 65, 66].map(nearest); // => [60, 62, 62, 63, 65, 65, 67]\n'})}),"\n",(0,t.jsx)(i.h3,{id:"midipcsetsteps",children:(0,t.jsx)(i.code,{children:"Midi.pcsetSteps"})}),"\n",(0,t.jsx)(i.h4,{id:"pcsetstepsset-number--string-tonic-number--index-number--number",children:(0,t.jsx)(i.code,{children:"pcsetSteps(set: number[] | string, tonic: number) => (index: number) => number"})}),"\n",(0,t.jsx)(i.p,{children:"Returns a function to map a pitch class set over any note. Given a tonic a pitch class set, step 0 means the first note, step 1 the second, and so on:"}),"\n",(0,t.jsx)(i.pre,{children:(0,t.jsx)(i.code,{className:"language-js",children:'const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);\n[-2, -1, 0, 1, 2, 3].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]\n'})}),"\n",(0,t.jsxs)(i.p,{children:["A similar function called ",(0,t.jsx)(i.code,{children:"pcsetDegrees"})," exists that just uses 1 as first note instead of 0 (more common in music theory books). See ",(0,t.jsx)(i.code,{children:"Scale.degrees"})," and ",(0,t.jsx)(i.code,{children:"Chord.degrees"})," for more information."]})]})}function l(e={}){const{wrapper:i}={...(0,s.M)(),...e.components};return i?(0,t.jsx)(i,{...e,children:(0,t.jsx)(m,{...e})}):m(e)}},2172:(e,i,n)=>{n.d(i,{I:()=>o,M:()=>r});var t=n(1504);const s={},d=t.createContext(s);function r(e){const i=t.useContext(d);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function o(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),t.createElement(d.Provider,{value:i},e.children)}}}]);