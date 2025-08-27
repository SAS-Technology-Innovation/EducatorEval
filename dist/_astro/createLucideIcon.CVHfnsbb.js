import{r as l}from"./index.R_mOzHLH.js";var c={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function f(){if(d)return i;d=1;var t=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function n(s,r,e){var u=null;if(e!==void 0&&(u=""+e),r.key!==void 0&&(u=""+r.key),"key"in r){e={};for(var a in r)a!=="key"&&(e[a]=r[a])}else e=r;return r=e.ref,{$$typeof:t,type:s,key:u,ref:r!==void 0?r:null,props:e}}return i.Fragment=o,i.jsx=n,i.jsxs=n,i}var x;function E(){return x||(x=1,c.exports=f()),c.exports}var C=E();/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),p=(...t)=>t.filter((o,n,s)=>!!o&&s.indexOf(o)===n).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var w={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=l.forwardRef(({color:t="currentColor",size:o=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:r="",children:e,iconNode:u,...a},m)=>l.createElement("svg",{ref:m,...w,width:o,height:o,stroke:t,strokeWidth:s?Number(n)*24/Number(o):n,className:p("lucide",r),...a},[...u.map(([R,v])=>l.createElement(R,v)),...Array.isArray(e)?e:[e]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(t,o)=>{const n=l.forwardRef(({className:s,...r},e)=>l.createElement(h,{ref:e,iconNode:o,className:p(`lucide-${k(t)}`,s),...r}));return n.displayName=`${t}`,n};export{A as c,C as j};
