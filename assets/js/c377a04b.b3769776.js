"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[416],{2028:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>a,metadata:()=>l,toc:()=>d});var t=s(7624),r=s(2172);const a={title:"Usage",sidebar_position:1},i="tonal",l={id:"index",title:"Usage",description:"npm version",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/tonal/docs/",draft:!1,unlisted:!1,editUrl:"https://github.com/tonaljs/tonal/tree/main/site/docs/docs/index.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Usage",sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Notes",permalink:"/tonal/docs/notes"}},o={},d=[{value:"Example",id:"example",level:2},{value:"Install",id:"install",level:2},{value:"Usage",id:"usage",level:2},{value:"ES6 <code>import</code>:",id:"es6-import",level:4},{value:"ES5 <code>require</code>:",id:"es5-require",level:4},{value:"Browser",id:"browser",level:4},{value:"Bundle size",id:"bundle-size",level:4}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h4:"h4",img:"img",p:"p",pre:"pre",...(0,r.M)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"tonal",children:"tonal"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://www.npmjs.com/package/tonal",children:(0,t.jsx)(n.img,{src:"https://img.shields.io/npm/v/tonal.svg?style=flat-square",alt:"npm version"})})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"tonal"})," is a music theory library. Contains functions to manipulate tonal\nelements of music (note, intervals, chords, scales, modes, keys). It deals with\nabstractions (not actual music or sound)."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"tonal"})," is implemented in Typescript and published as a collection of Javascript\nnpm packages."]}),"\n",(0,t.jsx)(n.p,{children:"It uses a functional programing style: all functions are pure, there is no data\nmutation, and entities are represented by data structures instead of objects."}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'import { Chord, Interval, Note, Scale } from "tonal";\n\nNote.midi("C4"); // => 60\nNote.freq("a4"); // => 440\nNote.accidentals("c#2"); // => \'#\'\nNote.transpose("C4", "5P"); // => "G4"\nInterval.semitones("5P"); // => 7\nInterval.distance("C4", "G4"); // => "5P"\n\n// Scales\nScale.get("C major").notes; // => ["C", "D", "E", "F", "G", "A", "B"];\n[1, 3, 5, 7].map(Scale.degrees("C major")); // => ["C", "E", "G", "B"]\n\nChord.get("Cmaj7").name; // => "C major seventh"\n\n// Chord inversions\nconst triad = Chord.degrees("Cm");\n[1, 2, 3].map(triad); // => ["C", "Eb", "G"];\n[2, 3, 1].map(triad); // => ["Eb", "G", "C"];\n[3, 1, 2].map(triad); // => ["G", "C", "Eb"];\n'})}),"\n",(0,t.jsx)(n.h2,{id:"install",children:"Install"}),"\n",(0,t.jsx)(n.p,{children:"Install all packages at once:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm install --save tonal\n"})}),"\n",(0,t.jsxs)(n.p,{children:["You can read ",(0,t.jsx)(n.a,{href:"https://github.com/tonaljs/tonal/blob/main/docs/CHANGELOG.md",children:"CHANGELOG here"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsx)(n.p,{children:"Tonal is compatible with both ES5 and ES6 modules, and browser."}),"\n",(0,t.jsxs)(n.h4,{id:"es6-import",children:["ES6 ",(0,t.jsx)(n.code,{children:"import"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'import { Note, Scale } from "tonal";\n'})}),"\n",(0,t.jsxs)(n.h4,{id:"es5-require",children:["ES5 ",(0,t.jsx)(n.code,{children:"require"}),":"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'const { Note, Scale } = require("tonal");\n'})}),"\n",(0,t.jsx)(n.h4,{id:"browser",children:"Browser"}),"\n",(0,t.jsx)(n.p,{children:"You can use the browser version from jsdelivr CDN directly in your html:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-html",children:'<script src="https://cdn.jsdelivr.net/npm/tonal/browser/tonal.min.js"><\/script>\n<script>\n  console.log(Tonal.Key.minorKey("Ab"));\n<\/script>\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Or if you prefer, grab the\n",(0,t.jsx)(n.a,{href:"https://raw.githubusercontent.com/tonaljs/tonal/master/packages/tonal/browser/tonal.min.js",children:"minified browser ready version"}),"\nfrom the repository."]}),"\n",(0,t.jsx)(n.h4,{id:"bundle-size",children:"Bundle size"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"tonal"})," includes all published modules."]}),"\n",(0,t.jsx)(n.p,{children:"Although the final bundle it is small, you can\nreduce bundle sizes even more by installing the modules individually, and\nimporting only the functions you need."}),"\n",(0,t.jsxs)(n.p,{children:["Note that individual modules are prefixed with ",(0,t.jsx)(n.code,{children:"@tonaljs/"}),". For example:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-bash",children:"npm i @tonaljs/note\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'import { transpose } from "@tonaljs/note";\ntranspose("A4", "P5");\n'})})]})}function h(e={}){const{wrapper:n}={...(0,r.M)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},2172:(e,n,s)=>{s.d(n,{I:()=>l,M:()=>i});var t=s(1504);const r={},a=t.createContext(r);function i(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);