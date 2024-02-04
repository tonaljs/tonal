"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[836],{7772:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>a,contentTitle:()=>i,default:()=>u,frontMatter:()=>c,metadata:()=>s,toc:()=>r});var l=o(7624),t=o(2172);const c={title:"Collections",sidebar_position:10},i=void 0,s={id:"collections/collections",title:"Collections",description:"@tonaljs/collections",source:"@site/docs/collections/collections.md",sourceDirName:"collections",slug:"/collections/",permalink:"/tonal/docs/collections/",draft:!1,unlisted:!1,editUrl:"https://github.com/tonaljs/tonal/tree/main/site/docs/docs/collections/collections.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{title:"Collections",sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"Pitch Class Sets",permalink:"/tonal/docs/collections/pitch-class-sets"},next:{title:"Ranges",permalink:"/tonal/docs/collections/ranges"}},a={},r=[{value:"<code>Collection.range</code>",id:"collectionrange",level:3},{value:"<code>range(from: number, to: number) =&gt; number[]</code>",id:"rangefrom-number-to-number--number",level:4},{value:"<code>Collection.rotate</code>",id:"collectionrotate",level:3},{value:"<code>rotate(times: number, collection: any[]) =&gt; any[]</code>",id:"rotatetimes-number-collection-any--any",level:4},{value:"<code>Collection.shuffle</code>",id:"collectionshuffle",level:3},{value:"<code>shuffle(collection: any[]) =&gt; any[]</code>",id:"shufflecollection-any--any",level:4},{value:"<code>Collection.permutations</code>",id:"collectionpermutations",level:3},{value:"<code>permutations(collection: any[]) =&gt; any[][]</code>",id:"permutationscollection-any--any",level:4}];function d(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",img:"img",p:"p",pre:"pre",...(0,t.M)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.p,{children:"@tonaljs/collections"}),"\n",(0,l.jsxs)(n.p,{children:[(0,l.jsx)(n.img,{src:"https://img.shields.io/badge/@tonaljs-collection-yellow.svg?style=flat-square",alt:"tonal"})," ",(0,l.jsx)(n.a,{href:"https://www.npmjs.com/package/@tonaljs/collection",children:(0,l.jsx)(n.img,{src:"https://img.shields.io/npm/v/@tonaljs/collection.svg?style=flat-square",alt:"npm version"})})]}),"\n",(0,l.jsx)(n.p,{children:"This package contains a collection of utility functions to manipulate abstract collections"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'import { Collection } from "tonal";\nCollection.shuffle(["a", "b", "c"]);\n'})}),"\n",(0,l.jsx)(n.h3,{id:"collectionrange",children:(0,l.jsx)(n.code,{children:"Collection.range"})}),"\n",(0,l.jsx)(n.h4,{id:"rangefrom-number-to-number--number",children:(0,l.jsx)(n.code,{children:"range(from: number, to: number) => number[]"})}),"\n",(0,l.jsx)(n.p,{children:"Creates a numeric range:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:"Collection.range(-2, 2); // => [-2, -1, 0, 1, 2]\nCollection.range(2, -2); // => [2, 1, 0, -1, -2]\n"})}),"\n",(0,l.jsx)(n.h3,{id:"collectionrotate",children:(0,l.jsx)(n.code,{children:"Collection.rotate"})}),"\n",(0,l.jsx)(n.h4,{id:"rotatetimes-number-collection-any--any",children:(0,l.jsx)(n.code,{children:"rotate(times: number, collection: any[]) => any[]"})}),"\n",(0,l.jsx)(n.p,{children:"Rotate an collection a number of times:"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:"Collection.rotate(1, [1, 2, 3]); // => [2, 3, 1]\n"})}),"\n",(0,l.jsx)(n.h3,{id:"collectionshuffle",children:(0,l.jsx)(n.code,{children:"Collection.shuffle"})}),"\n",(0,l.jsx)(n.h4,{id:"shufflecollection-any--any",children:(0,l.jsx)(n.code,{children:"shuffle(collection: any[]) => any[]"})}),"\n",(0,l.jsx)(n.p,{children:"Randomizes the order of the specified collection in-place, using the Fisher\u2013Yates shuffle."}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'Collection.shuffle(["a", "b", "c"]);\n'})}),"\n",(0,l.jsx)(n.h3,{id:"collectionpermutations",children:(0,l.jsx)(n.code,{children:"Collection.permutations"})}),"\n",(0,l.jsx)(n.h4,{id:"permutationscollection-any--any",children:(0,l.jsx)(n.code,{children:"permutations(collection: any[]) => any[][]"})}),"\n",(0,l.jsx)(n.p,{children:"Get all permutations of an collection"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-js",children:'Collection.permutations(["a", "b", "c"])) // =>\n// =>\n// [\n//   ["a", "b", "c"],\n//   ["b", "a", "c"],\n//   ["b", "c", "a"],\n//   ["a", "c", "b"],\n//   ["c", "a", "b"],\n//   ["c", "b", "a"]\n// ]\n'})})]})}function u(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},2172:(e,n,o)=>{o.d(n,{I:()=>s,M:()=>i});var l=o(1504);const t={},c=l.createContext(t);function i(e){const n=l.useContext(c);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),l.createElement(c.Provider,{value:n},e.children)}}}]);