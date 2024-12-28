import{av as N,am as L,T as W,K as w,af as z,at as F,C as G,z as j,A,Q as E,aw as x,ax as K,h,d,a as $,B as S,ay as M,az as Q,_ as U,aA as D,G as b,R as J,aB as X,aC as Z,N as ee,D as re,aD as te,c as ae,e as ne,f as se,g as ie}from"./runtime.BhkHmGnc.js";const oe=["touchstart","touchmove"];function ue(e){return oe.includes(e)}let I=!1;function fe(){I||(I=!0,document.addEventListener("reset",e=>{Promise.resolve().then(()=>{var r;if(!e.defaultPrevented)for(const t of e.target.elements)(r=t.__on_r)==null||r.call(t)})},{capture:!0}))}function k(e){var r=W,t=w;N(null),L(null);try{return e()}finally{N(r),L(t)}}function _e(e,r,t,s=t){e.addEventListener(r,()=>k(t));const n=e.__on_r;n?e.__on_r=()=>{n(),s(!0)}:e.__on_r=()=>s(!0),fe()}const B=new Set,O=new Set;function de(e,r,t,s){function n(a){if(s.capture||y.call(r,a),!a.cancelBubble)return k(()=>t.call(this,a))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?j(()=>{r.addEventListener(e,n,s)}):r.addEventListener(e,n,s),n}function ve(e,r,t,s,n){var a={capture:s,passive:n},i=de(e,r,t,a);(r===document.body||r===window||r===document)&&z(()=>{r.removeEventListener(e,i,a)})}function he(e){for(var r=0;r<e.length;r++)B.add(e[r]);for(var t of O)t(e)}function y(e){var C;var r=this,t=r.ownerDocument,s=e.type,n=((C=e.composedPath)==null?void 0:C.call(e))||[],a=n[0]||e.target,i=0,l=e.__root;if(l){var f=n.indexOf(l);if(f!==-1&&(r===document||r===window)){e.__root=r;return}var g=n.indexOf(r);if(g===-1)return;f<=g&&(i=f)}if(a=n[i]||e.target,a!==r){F(e,"currentTarget",{configurable:!0,get(){return a||t}});var R=W,c=w;N(null),L(null);try{for(var o,u=[];a!==null;){var v=a.assignedSlot||a.parentNode||a.host||null;try{var p=a["__"+s];if(p!==void 0&&!a.disabled)if(G(p)){var[Y,...q]=p;Y.apply(a,[e,...q])}else p.call(a,e)}catch(T){o?u.push(T):o=T}if(e.cancelBubble||v===r||v===null)break;a=v}if(o){for(let T of u)queueMicrotask(()=>{throw T});throw o}}finally{e.__root=r,delete e.currentTarget,N(R),L(c)}}}function H(e){var r=document.createElement("template");return r.innerHTML=e,r.content}function _(e,r){var t=w;t.nodes_start===null&&(t.nodes_start=e,t.nodes_end=r)}function pe(e,r){var t=(r&x)!==0,s=(r&K)!==0,n,a=!e.startsWith("<!>");return()=>{if(h)return _(d,null),d;n===void 0&&(n=H(a?e:"<!>"+e),t||(n=E(n)));var i=s?document.importNode(n,!0):n.cloneNode(!0);if(t){var l=E(i),f=i.lastChild;_(l,f)}else _(i,i);return i}}function ge(e,r,t="svg"){var s=!e.startsWith("<!>"),n=`<${t}>${s?e:"<!>"+e}</${t}>`,a;return()=>{if(h)return _(d,null),d;if(!a){var i=H(n),l=E(i);a=E(l)}var f=a.cloneNode(!0);return _(f,f),f}}function me(e=""){if(!h){var r=A(e+"");return _(r,r),r}var t=d;return t.nodeType!==3&&(t.before(t=A()),S(t)),_(t,t),t}function ye(){if(h)return _(d,null),d;var e=document.createDocumentFragment(),r=document.createComment(""),t=A();return e.append(r,t),_(r,t),e}function Ee(e,r){if(h){w.nodes_end=d,$();return}e!==null&&e.before(r)}function we(e,r){var t=r==null?"":typeof r=="object"?r+"":r;t!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=t,e.nodeValue=t==null?"":t+"")}function le(e,r){return V(e,r)}function Te(e,r){M(),r.intro=r.intro??!1;const t=r.target,s=h,n=d;try{for(var a=E(t);a&&(a.nodeType!==8||a.data!==Q);)a=U(a);if(!a)throw D;b(!0),S(a),$();const i=V(e,{...r,anchor:a});if(d===null||d.nodeType!==8||d.data!==J)throw X(),D;return b(!1),i}catch(i){if(i===D)return r.recover===!1&&Z(),M(),ee(t),b(!1),le(e,r);throw i}finally{b(s),S(n)}}const m=new Map;function V(e,{target:r,anchor:t,props:s={},events:n,context:a,intro:i=!0}){M();var l=new Set,f=c=>{for(var o=0;o<c.length;o++){var u=c[o];if(!l.has(u)){l.add(u);var v=ue(u);r.addEventListener(u,y,{passive:v});var p=m.get(u);p===void 0?(document.addEventListener(u,y,{passive:v}),m.set(u,1)):m.set(u,p+1)}}};f(re(B)),O.add(f);var g=void 0,R=te(()=>{var c=t??r.appendChild(A());return ae(()=>{if(a){ne({});var o=ie;o.c=a}n&&(s.$$events=n),h&&_(c,null),g=e(c,s)||{},h&&(w.nodes_end=d),a&&se()}),()=>{var v;for(var o of l){r.removeEventListener(o,y);var u=m.get(o);--u===0?(document.removeEventListener(o,y),m.delete(o)):m.set(o,u)}O.delete(f),c!==t&&((v=c.parentNode)==null||v.removeChild(c))}});return P.set(g,R),g}let P=new WeakMap;function be(e,r){const t=P.get(e);return t?(P.delete(e),t(r)):Promise.resolve()}export{Ee as a,me as b,ye as c,he as d,ve as e,fe as f,Te as h,_e as l,le as m,ge as n,we as s,pe as t,be as u};
