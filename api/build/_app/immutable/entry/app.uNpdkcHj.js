const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../nodes/0.BeSXbI64.js","../chunks/disclose-version.Bg9kRutz.js","../chunks/runtime.abrMvGU9.js","../chunks/render.BL_amxVg.js","../chunks/if.CZPx-Ecd.js","../chunks/class.Ct5_4gtP.js","../chunks/props.CwHRb1Ux.js","../chunks/utils.Di2KRJEk.js","../chunks/attributes.Jce5emvo.js","../chunks/entry.Dqgg3Cya.js","../chunks/index.C4LRAEAA.js","../chunks/index-client.007pFWc0.js","../chunks/queryClient.BjLvEgtg.js","../chunks/legacy.CjaeNba4.js","../chunks/lifecycle.QzCIaJTB.js","../assets/0.CWiMy1AR.css","../nodes/1.CEAfJlvM.js","../nodes/2.BVmhigVy.js","../nodes/3.CQlsiWXv.js","../chunks/BasePage.BdjcuQGV.js","../nodes/4.Dw-NklVj.js","../nodes/5.CIt1-DYE.js","../chunks/each.C0dtL42L.js","../nodes/6.D07xdDrT.js","../chunks/this.ByIZMl-g.js"])))=>i.map(i=>d[i]);
var z=r=>{throw TypeError(r)};var G=(r,t,s)=>t.has(r)||z("Cannot "+s);var l=(r,t,s)=>(G(r,t,"read from private field"),s?s.call(r):t.get(r)),p=(r,t,s)=>t.has(r)?z("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,s),S=(r,t,s,a)=>(G(r,t,"write to private field"),a?a.call(r,s):t.set(r,s),s);import{j as N,k as K,m as Q,R as Z,A as M,x as $,B as tt,g as v,aj as et,a4 as O,az as rt,an as st,L as nt,p as at,X as ot,u as it,aA as ct,f as L,a as lt,aB as C,$ as ut,e as mt,r as ft,t as dt,_ as j}from"../chunks/runtime.abrMvGU9.js";import{h as _t,m as ht,u as vt,a as A,t as X,c as D,b as gt,s as yt}from"../chunks/render.BL_amxVg.js";import"../chunks/disclose-version.Bg9kRutz.js";import{i as I}from"../chunks/if.CZPx-Ecd.js";import{p as V,b as Et}from"../chunks/props.CwHRb1Ux.js";import{b as B}from"../chunks/this.ByIZMl-g.js";import{o as bt}from"../chunks/index-client.007pFWc0.js";function q(r,t,s){N&&K();var a=r,o,c;Q(()=>{o!==(o=t())&&(c&&(tt(c),c=null),o&&(c=M(()=>s(a,o))))},Z),N&&(a=$)}function Pt(r){return class extends Rt{constructor(t){super({component:r,...t})}}}var g,m;class Rt{constructor(t){p(this,g);p(this,m);var c;var s=new Map,a=(n,e)=>{var f=nt(e);return s.set(n,f),f};const o=new Proxy({...t.props||{},$$events:{}},{get(n,e){return v(s.get(e)??a(e,Reflect.get(n,e)))},has(n,e){return e===et?!0:(v(s.get(e)??a(e,Reflect.get(n,e))),Reflect.has(n,e))},set(n,e,f){return O(s.get(e)??a(e,f),f),Reflect.set(n,e,f)}});S(this,m,(t.hydrate?_t:ht)(t.component,{target:t.target,anchor:t.anchor,props:o,context:t.context,intro:t.intro??!1,recover:t.recover})),(!((c=t==null?void 0:t.props)!=null&&c.$$host)||t.sync===!1)&&rt(),S(this,g,o.$$events);for(const n of Object.keys(l(this,m)))n==="$set"||n==="$destroy"||n==="$on"||st(this,n,{get(){return l(this,m)[n]},set(e){l(this,m)[n]=e},enumerable:!0});l(this,m).$set=n=>{Object.assign(o,n)},l(this,m).$destroy=()=>{vt(l(this,m))}}$set(t){l(this,m).$set(t)}$on(t,s){l(this,g)[t]=l(this,g)[t]||[];const a=(...o)=>s.call(this,...o);return l(this,g)[t].push(a),()=>{l(this,g)[t]=l(this,g)[t].filter(o=>o!==a)}}$destroy(){l(this,m).$destroy()}}g=new WeakMap,m=new WeakMap;const At="modulepreload",kt=function(r,t){return new URL(r,t).href},W={},P=function(t,s,a){let o=Promise.resolve();if(s&&s.length>0){const n=document.getElementsByTagName("link"),e=document.querySelector("meta[property=csp-nonce]"),f=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));o=Promise.allSettled(s.map(u=>{if(u=kt(u,a),u in W)return;W[u]=!0;const y=u.endsWith(".css"),T=y?'[rel="stylesheet"]':"";if(!!a)for(let E=n.length-1;E>=0;E--){const i=n[E];if(i.href===u&&(!y||i.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${T}`))return;const _=document.createElement("link");if(_.rel=y?"stylesheet":At,y||(_.as="script"),_.crossOrigin="",_.href=u,f&&_.setAttribute("nonce",f),document.head.appendChild(_),y)return new Promise((E,i)=>{_.addEventListener("load",E),_.addEventListener("error",()=>i(new Error(`Unable to preload CSS for ${u}`)))})}))}function c(n){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=n,window.dispatchEvent(e),!e.defaultPrevented)throw n}return o.then(n=>{for(const e of n||[])e.status==="rejected"&&c(e.reason);return t().catch(c)})},Ft={};var wt=X('<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>'),xt=X("<!> <!>",1);function Lt(r,t){at(t,!0);let s=V(t,"components",23,()=>[]),a=V(t,"data_0",3,null),o=V(t,"data_1",3,null);ot(()=>t.stores.page.set(t.page)),it(()=>{t.stores,t.page,t.constructors,s(),t.form,a(),o(),t.stores.page.notify()});let c=C(!1),n=C(!1),e=C(null);bt(()=>{const i=t.stores.page.subscribe(()=>{v(c)&&(O(n,!0),ct().then(()=>{O(e,Et(document.title||"untitled page"))}))});return O(c,!0),i});const f=j(()=>t.constructors[1]);var u=xt(),y=L(u);{var T=i=>{var h=D();const k=j(()=>t.constructors[0]);var w=L(h);q(w,()=>v(k),(b,R)=>{B(R(b,{get data(){return a()},get form(){return t.form},children:(d,pt)=>{var U=D(),Y=L(U);q(Y,()=>v(f),(H,J)=>{B(J(H,{get data(){return o()},get form(){return t.form}}),x=>s()[1]=x,()=>{var x;return(x=s())==null?void 0:x[1]})}),A(d,U)},$$slots:{default:!0}}),d=>s()[0]=d,()=>{var d;return(d=s())==null?void 0:d[0]})}),A(i,h)},F=i=>{var h=D();const k=j(()=>t.constructors[0]);var w=L(h);q(w,()=>v(k),(b,R)=>{B(R(b,{get data(){return a()},get form(){return t.form}}),d=>s()[0]=d,()=>{var d;return(d=s())==null?void 0:d[0]})}),A(i,h)};I(y,i=>{t.constructors[1]?i(T):i(F,!1)})}var _=ut(y,2);{var E=i=>{var h=wt(),k=mt(h);{var w=b=>{var R=gt();dt(()=>yt(R,v(e))),A(b,R)};I(k,b=>{v(n)&&b(w)})}ft(h),A(i,h)};I(_,i=>{v(c)&&i(E)})}A(r,u),lt()}const Ut=Pt(Lt),zt=[()=>P(()=>import("../nodes/0.BeSXbI64.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),import.meta.url),()=>P(()=>import("../nodes/1.CEAfJlvM.js"),__vite__mapDeps([16,1,13,2,3,14,9,10,7,11]),import.meta.url),()=>P(()=>import("../nodes/2.BVmhigVy.js"),__vite__mapDeps([17,1,13,2,14,11]),import.meta.url),()=>P(()=>import("../nodes/3.CQlsiWXv.js"),__vite__mapDeps([18,1,13,2,19,3,5,6,7]),import.meta.url),()=>P(()=>import("../nodes/4.Dw-NklVj.js"),__vite__mapDeps([20,1,13,2,19,3,5,6,7]),import.meta.url),()=>P(()=>import("../nodes/5.CIt1-DYE.js"),__vite__mapDeps([21,1,13,2,3,4,22,14,6,7,19,5,12,10]),import.meta.url),()=>P(()=>import("../nodes/6.D07xdDrT.js"),__vite__mapDeps([23,1,13,2,3,4,22,8,5,6,7,24,14,19,12,10]),import.meta.url)],Gt=[],Nt={"/":[2],"/administration":[3],"/invoices":[4],"/logs":[5],"/monitoring":[6]},Ot={handleError:({error:r})=>{console.error(r)},reroute:()=>{},transport:{}},Tt=Object.fromEntries(Object.entries(Ot.transport).map(([r,t])=>[r,t.decode])),Wt=!1,Xt=(r,t)=>Tt[r](t);export{Xt as decode,Tt as decoders,Nt as dictionary,Wt as hash,Ot as hooks,Ft as matchers,zt as nodes,Ut as root,Gt as server_loads};
