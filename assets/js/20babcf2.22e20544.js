"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[604],{5928:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>t,default:()=>h,frontMatter:()=>i,metadata:()=>c,toc:()=>o});var l=s(7624),a=s(2172);const i={title:"Scale dictionary",sidebar_position:1},t=void 0,c={id:"collections/scale-types",title:"Scale dictionary",description:"@tonaljs/scale-type",source:"@site/docs/collections/scale-types.md",sourceDirName:"collections",slug:"/collections/scale-types",permalink:"/tonal/docs/collections/scale-types",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/collections/scale-types.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Scale dictionary",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Chord dictionary",permalink:"/tonal/docs/collections/chord-types"},next:{title:"Modes",permalink:"/tonal/docs/collections/modes"}},d={},o=[{value:"Usage",id:"usage",level:2},{value:"API",id:"api",level:2},{value:"<code>ScaleType.get</code>",id:"scaletypeget",level:3},{value:"<code>get(name: string) =&gt; ScaleType</code>",id:"getname-string--scaletype",level:4},{value:"<code>ScaleType.names</code>",id:"scaletypenames",level:3},{value:"<code>names() =&gt; string[]</code>",id:"names--string",level:4},{value:"<code>ScaleType.all</code>",id:"scaletypeall",level:3},{value:"<code>all() =&gt; object[]</code>",id:"all--object",level:4},{value:"<code>ScaleType.add</code>",id:"scaletypeadd",level:3},{value:"<code>add(intervals: string[], name?: string, aliases?: string[]) =&gt; ScaleType</code>",id:"addintervals-string-name-string-aliases-string--scaletype",level:4},{value:"How to...",id:"how-to",level:2},{value:"How to get all pentatonics names?",id:"how-to-get-all-pentatonics-names",level:3},{value:"How do to add a scale to the dictionary?",id:"how-do-to-add-a-scale-to-the-dictionary",level:3},{value:"References",id:"references",level:2}];function r(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.M)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.p,{children:(0,l.jsx)(n.code,{children:"@tonaljs/scale-type"})}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.a,{href:"https://www.npmjs.com/package/@tonaljs/scale-type",children:(0,l.jsx)(n.img,{src:"https://img.shields.io/npm/v/@tonaljs/scale-type.svg?style=flat-square",alt:"npm version"})}),"\n",(0,l.jsx)(n.a,{href:"https://www.npmjs.com/browse/keyword/tonal",children:(0,l.jsx)(n.img,{src:"https://img.shields.io/badge/@tonaljs-scale_dictionary-yellow.svg?style=flat-square",alt:"tonal"})})]}),"\n",(0,l.jsx)(n.p,{children:"A dictionary of musical scales."}),"\n",(0,l.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,l.jsx)(n.p,{children:"ES6:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'import { ScaleType } from "tonal";\n'})}),"\n",(0,l.jsx)(n.p,{children:"nodejs:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'const { ScaleType } = require("tonal");\n'})}),"\n",(0,l.jsx)(n.h2,{id:"api",children:"API"}),"\n",(0,l.jsx)(n.h3,{id:"scaletypeget",children:(0,l.jsx)(n.code,{children:"ScaleType.get"})}),"\n",(0,l.jsx)(n.h4,{id:"getname-string--scaletype",children:(0,l.jsx)(n.code,{children:"get(name: string) => ScaleType"})}),"\n",(0,l.jsx)(n.p,{children:"Given a scale type name, return a ScaleType object with the following properties:"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"name: the scale type name"}),"\n",(0,l.jsx)(n.li,{children:"aliases: a list of alternative names"}),"\n",(0,l.jsx)(n.li,{children:"quality: Major | Minor | Augmented | Diminished | Unknown"}),"\n",(0,l.jsx)(n.li,{children:"num: the pcset number"}),"\n",(0,l.jsx)(n.li,{children:"chroma: the pcset chroma"}),"\n",(0,l.jsx)(n.li,{children:"length: the number of notes"}),"\n",(0,l.jsx)(n.li,{children:"intervals: the interval list"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:"Example:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'ScaleType.get("major"); // =>\n// {\n// name: "major",\n// aliases: ["ionian"],\n// num: 2773,\n// chroma: "101011010101",\n// length: 7\n// intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],\n// });\n'})}),"\n",(0,l.jsx)(n.h3,{id:"scaletypenames",children:(0,l.jsx)(n.code,{children:"ScaleType.names"})}),"\n",(0,l.jsx)(n.h4,{id:"names--string",children:(0,l.jsx)(n.code,{children:"names() => string[]"})}),"\n",(0,l.jsx)(n.p,{children:"Return a list of all scale names"}),"\n",(0,l.jsx)(n.h3,{id:"scaletypeall",children:(0,l.jsx)(n.code,{children:"ScaleType.all"})}),"\n",(0,l.jsx)(n.h4,{id:"all--object",children:(0,l.jsx)(n.code,{children:"all() => object[]"})}),"\n",(0,l.jsx)(n.p,{children:"Return a list of all scale types"}),"\n",(0,l.jsx)(n.h3,{id:"scaletypeadd",children:(0,l.jsx)(n.code,{children:"ScaleType.add"})}),"\n",(0,l.jsx)(n.h4,{id:"addintervals-string-name-string-aliases-string--scaletype",children:(0,l.jsx)(n.code,{children:"add(intervals: string[], name?: string, aliases?: string[]) => ScaleType"})}),"\n",(0,l.jsx)(n.p,{children:"Add a scale type to dictionary:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'ScaleType.add(["1P", "5P"], null, ["5"]);\n'})}),"\n",(0,l.jsx)(n.h2,{id:"how-to",children:"How to..."}),"\n",(0,l.jsx)(n.h3,{id:"how-to-get-all-pentatonics-names",children:"How to get all pentatonics names?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:"ScaleType.all()\n  .filter((scaleType) => scaleType.intervals.length === 5)\n  .map((scaleType) => scaleType.name);\n"})}),"\n",(0,l.jsx)(n.h3,{id:"how-do-to-add-a-scale-to-the-dictionary",children:"How do to add a scale to the dictionary?"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'ScaleType.add(["1P", "5P"], "quinta", ["quinta justa", "diapente"]);\nScaleType.scale("quinta"); // => { name: "quinta", intervals: ...}\nScaleType.scale("quinta justa"); // => { name: "quinta", intervals: ... }\n'})}),"\n",(0,l.jsx)(n.h2,{id:"references",children:"References"}),"\n",(0,l.jsx)(n.p,{children:"Some sources explaining various scale systems:"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Mode_(music)",children:"Modes"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Blues_scale",children:"Blues Scales"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Jazz_scale",children:"Jazz Scales"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Mode_of_limited_transposition",children:'Messiaen\'s "Modes of Limited Transposition" (wikipedia, en)'})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"https://de.wikipedia.org/wiki/Raga",children:"Raga"})}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,a.M)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(r,{...e})}):r(e)}},2172:(e,n,s)=>{s.d(n,{I:()=>c,M:()=>t});var l=s(1504);const a={},i=l.createContext(a);function t(e){const n=l.useContext(i);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),l.createElement(i.Provider,{value:n},e.children)}}}]);