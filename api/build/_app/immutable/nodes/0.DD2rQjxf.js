import"../chunks/disclose-version.Bg9kRutz.js";import{n as et,y as tt,e as Ee,t as h,p as $e,i as te,a as Ie,h as ae,s as Z,k as e,f as v,j as d,g as l,d as qe,a3 as Q}from"../chunks/runtime.DvGnrOxf.js";import{l as at,a as m,n as K,t as M,c as ge,d as Qe,s as ee,e as rt}from"../chunks/render.CP-ZJxph.js";import{i as U}from"../chunks/if.BktC0TgM.js";import{s as G,b as W,t as f,a as nt}from"../chunks/class.CWCituMS.js";import{i as st,b as B,p as N,s as ot,a as it}from"../chunks/props.CmCJi6lp.js";import{s as R,u as lt,Q as ct,r as ze,v as vt}from"../chunks/queryClient.DOObSZT0.js";import{s as ut}from"../chunks/entry.CKdE5lRC.js";import{o as Se,a as pt}from"../chunks/index-client.BjYtNTkr.js";import{I as ht}from"../chunks/IconLockPin.Cd3JSPAq.js";import{e as je,i as Ce}from"../chunks/each.DLolFtAN.js";import{b as Fe,a as dt}from"../chunks/input.Dpw84tVH.js";import{b as ft}from"../chunks/this.CB7nEYyl.js";import{d as Pe,z as mt}from"../chunks/drawerStore.DedmOxCn.js";import{I as _t}from"../chunks/IconDeviceAirtag.B9AVD1kC.js";import"../chunks/legacy.Bx86S8IA.js";import{i as bt}from"../chunks/lifecycle.CZF0KIGC.js";function gt(a,n,r,t,o){var L;et&&tt();var s=(L=n.$$slots)==null?void 0:L[r],_=!1;s===!0&&(s=n.children,_=!0),s===void 0||s(a,_?()=>t:t)}function Re(a){var n,r,t="";if(typeof a=="string"||typeof a=="number")t+=a;else if(typeof a=="object")if(Array.isArray(a)){var o=a.length;for(n=0;n<o;n++)a[n]&&(r=Re(a[n]))&&(t&&(t+=" "),t+=r)}else for(r in a)a[r]&&(t&&(t+=" "),t+=r);return t}function wt(){for(var a,n,r=0,t="",o=arguments.length;r<o;r++)(a=arguments[r])&&(n=Re(a))&&(t&&(t+=" "),t+=n);return t}function xt(a){return typeof a=="object"?wt(a):a??""}function Ue(a,n,r){if(a.multiple)return Mt(a,n);for(var t of a.options){var o=oe(t);if(st(o,n)){t.selected=!0;return}}(!r||n!==void 0)&&(a.selectedIndex=-1)}function yt(a,n){Ee(()=>{var r=new MutationObserver(()=>{var t=a.__value;Ue(a,t)});return r.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{r.disconnect()}})}function kt(a,n,r=n){var t=!0;at(a,"change",o=>{var s=o?"[selected]":":checked",_;if(a.multiple)_=[].map.call(a.querySelectorAll(s),oe);else{var L=a.querySelector(s)??a.querySelector("option:not([disabled])");_=L&&oe(L)}r(_)}),Ee(()=>{var o=n();if(Ue(a,o,t),t&&o===void 0){var s=a.querySelector(":checked");s!==null&&(o=oe(s),r(o))}a.__value=o,t=!1}),yt(a)}function Mt(a,n){for(var r of a.options)r.selected=~n.indexOf(oe(r))}function oe(a){return"__value"in a?a.__value:a.value}var zt=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M6 4v4"></path><path d="M6 12v8"></path><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M12 4v10"></path><path d="M12 18v2"></path><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M18 4v1"></path><path d="M18 9v11"></path></svg>');function jt(a,n){let r=B(n,"class",3,"");var t=zt();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-adjustments ${(r()||"")??""}`)),m(a,t)}var Ct=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M19 12v7a1.78 1.78 0 0 1 -3.1 1.4a1.65 1.65 0 0 0 -2.6 0a1.65 1.65 0 0 1 -2.6 0a1.65 1.65 0 0 0 -2.6 0a1.78 1.78 0 0 1 -3.1 -1.4v-14a2 2 0 0 1 2 -2h7l5 5v4.25"></path></svg>');function $t(a,n){let r=B(n,"class",3,"");var t=Ct();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-invoice ${(r()||"")??""}`)),m(a,t)}var It=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7.027 11.477a5 5 0 1 0 5.496 -4.45a4.951 4.951 0 0 0 -3.088 .681"></path><path d="M5.636 5.636a9 9 0 1 0 3.555 -2.188"></path><path d="M18 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M9 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>');function St(a,n){let r=B(n,"class",3,"");var t=It();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-universe ${(r()||"")??""}`)),m(a,t)}const Lt=""+new URL("../assets/Logo.B4IurQiF.png",import.meta.url).href;var Dt=M('<img alt="Logo">');function Ot(a,n){let r=B(n,"class",3,"");var t=Dt();R(t,"src",Lt),h(()=>W(t,xt(r()),"")),m(a,t)}var At=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 6l-6 6l6 6"></path></svg>');function Nt(a,n){let r=B(n,"class",3,"");var t=At();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-chevron-left ${(r()||"")??""}`)),m(a,t)}var Bt=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg>');function Tt(a,n){let r=B(n,"class",3,"");var t=Bt();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-chevron-right ${(r()||"")??""}`)),m(a,t)}const Ht=()=>{const a=ut;return{page:{subscribe:a.page.subscribe},navigating:{subscribe:a.navigating.subscribe},updated:a.updated}},qt={subscribe(a){return Ht().page.subscribe(a)}};var Ft=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12h.01"></path><path d="M4 6h.01"></path><path d="M4 18h.01"></path><path d="M8 18h2"></path><path d="M8 12h2"></path><path d="M8 6h2"></path><path d="M14 6h6"></path><path d="M14 12h6"></path><path d="M14 18h6"></path></svg>');function Pt(a,n){let r=B(n,"class",3,"");var t=Ft();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-logs ${(r()||"")??""}`)),m(a,t)}function Et(a,n){$e(n,!1);let r=B(n,"client",24,()=>new ct);Se(()=>{r().mount()}),lt(r()),pt(()=>{r().unmount()}),bt();var t=ge(),o=te(t);gt(o,n,"default",{}),m(a,t),Ie()}var Qt=(a,n,r,t,o,s)=>{n(e(r),e(t)[e(r).name]);const _=o(e(r),e(t)[e(r).name]);e(s)[e(r).name]=_},Rt=M("<input>"),Ut=(a,n,r,t,o,s)=>{n(e(r),e(t)[e(r).name]);const _=o(e(r),e(t)[e(r).name]);e(s)[e(r).name]=_},Zt=M('<input type="checkbox">'),Jt=(a,n,r,t,o,s)=>{n(e(r),e(t)[e(r).name]);const _=o(e(r),e(t)[e(r).name]);e(s)[e(r).name]=_},Vt=M("<option> </option>"),Wt=M("<select></select>"),Kt=(a,n,r,t,o,s)=>{n(e(r),e(t)[e(r).name]);const _=o(e(r),e(t)[e(r).name]);e(s)[e(r).name]=_},Gt=M('<input type="datetime-local">'),Xt=M('<label class="label"><span class="label-text-alt text-error"> </span></label>'),Yt=M('<div class="form-control"><label class="label"><span class="label-text"> </span></label> <!> <!></div>'),ea=(a,n,r)=>{e(n).buttonType!=="submit"&&r(e(n))},ta=M("<button> </button>"),aa=M('<form class="menu bg-base-200 text-base-content min-h-full w-[30rem] p-4"><h2 class="text-lg font-bold"> </h2> <div class="my-4 space-y-4"></div> <div class="mt-4 flex space-x-2"></div></form>'),ra=M('<div class="drawer drawer-end"><input id="object-drawer" type="checkbox" class="drawer-toggle"> <div class="drawer-side"><label for="object-drawer" class="drawer-overlay"></label> <!></div></div>');function na(a,n){$e(n,!0);let r,t=ae(null),o=ae(N({})),s=ae(N({}));const _=c=>{if(!c||!c.endsWith("Z"))return c;const u=new Date(c);return new Date(u.getTime()-u.getTimezoneOffset()*6e4).toISOString().slice(0,16)},L=c=>{if(!c||c.endsWith("Z"))return c;const u=new Date(c);return new Date(u.getTime()+u.getTimezoneOffset()*6e4).toISOString()},x=(c,u)=>{var p;if(c.validation)try{c.validation.parse(u);return}catch(b){return b instanceof mt.ZodError?(p=b.errors[0])==null?void 0:p.message:"Invalid value"}},C=c=>{if(e(t)){if(Z(s,N({})),c.buttonType==="submit"){let u=!1;if(e(t).fields.forEach(p=>{const b=x(p,e(o)[p.name]);b&&(e(s)[p.name]=b,u=!0)}),u)return}c.callback({fieldValues:e(o),close:()=>Pe.close()})}},Le=c=>{Z(o,N(c.fields.reduce((u,p)=>{var D;let b;return p.defaultValue!==void 0?p.type==="date"?b=_(p.defaultValue):b=p.defaultValue:p.type==="checkbox"?b=!1:p.type==="dropdown"?b=((D=p.options[0])==null?void 0:D.value)||"":p.type==="number"?b=0:b="",u[p.name]=b,u},{}))),c.fields.forEach(u=>{const p=e(o)[u.name];T(u,p)})};Se(()=>{const c=Pe.subscribe(u=>{const p=r.checked;Z(t,N(u)),e(t)&&!p&&(Le(e(t)),Z(s,N({}))),r.checked=!!e(t)});return()=>{c()}});const T=(c,u)=>{if(c.onChange)switch(c.type){case"number":return c.onChange(u);case"text":return c.onChange(u);case"checkbox":return c.onChange(u);case"dropdown":return c.onChange(u);case"date":return typeof u=="string"?c.onChange(L(u)||null):void 0}};var J=ra(),ie=v(J);ft(ie,c=>r=c,()=>r);var le=d(ie,2),we=d(v(le),2);{var re=c=>{var u=aa(),p=v(u),b=v(p,!0);l(p);var D=d(p,2);je(D,21,()=>e(t).fields,Ce,(H,i,g)=>{var $=Yt(),A=v($);R(A,"for",`field-${g}`);var ve=v(A),ue=v(ve,!0);l(ve),l(A);var pe=d(A,2);{var ne=z=>{var w=Rt();ze(w),R(w,"id",`field-${g}`),w.__input=[Qt,T,i,o,x,s],h(()=>{R(w,"type",e(i).type),W(w,`input input-bordered ${e(i).class||""} ${e(s)[e(i).name]?"input-error":""}`)}),Fe(w,()=>e(o)[e(i).name],I=>e(o)[e(i).name]=I),m(z,w)},X=z=>{var w=ge(),I=te(w);{var se=q=>{var k=Zt();ze(k),R(k,"id",`field-${g}`),k.__change=[Ut,T,i,o,x,s],h(()=>W(k,`checkbox ${e(i).class||""} ${e(s)[e(i).name]?"checkbox-error":""}`)),dt(k,()=>e(o)[e(i).name],F=>e(o)[e(i).name]=F),m(q,k)},de=q=>{var k=ge(),F=te(k);{var ye=P=>{var y=Wt();R(y,"id",`field-${g}`),y.__change=[Jt,T,i,o,x,s],je(y,21,()=>e(i).options,Ce,(O,E)=>{var j=Vt(),S={},V=v(j,!0);l(j),h(()=>{S!==(S=e(E).value)&&(j.value=(j.__value=e(E).value)==null?"":e(E).value),ee(V,e(E).label)}),m(O,j)}),l(y),h(()=>W(y,`select select-bordered ${e(i).class||""} ${e(s)[e(i).name]?"select-error":""}`)),kt(y,()=>e(o)[e(i).name],O=>e(o)[e(i).name]=O),m(P,y)},fe=P=>{var y=ge(),O=te(y);{var E=j=>{var S=Gt();ze(S),R(S,"id",`field-${g}`),S.__change=[Kt,T,i,o,x,s],h(()=>W(S,`input input-bordered ${e(i).class||""} ${e(s)[e(i).name]?"input-error":""}`)),Fe(S,()=>e(o)[e(i).name],V=>e(o)[e(i).name]=V),m(j,S)};U(O,j=>{e(i).type==="date"&&j(E)},!0)}m(P,y)};U(F,P=>{e(i).type==="dropdown"?P(ye):P(fe,!1)},!0)}m(q,k)};U(I,q=>{e(i).type==="checkbox"?q(se):q(de,!1)},!0)}m(z,w)};U(pe,z=>{e(i).type==="text"||e(i).type==="number"?z(ne):z(X,!1)})}var xe=d(pe,2);{var he=z=>{var w=Xt(),I=v(w),se=v(I,!0);l(I),l(w),h(()=>ee(se,e(s)[e(i).name])),m(z,w)};U(xe,z=>{e(s)[e(i).name]&&z(he)})}l($),h(()=>ee(ue,e(i).label)),m(H,$)}),l(D);var ce=d(D,2);je(ce,21,()=>e(t).actions,Ce,(H,i)=>{var g=ta();g.__click=[ea,i,C];var $=v(g,!0);l(g),h(()=>{R(g,"type",e(i).buttonType),W(g,`btn ${(e(i).class||"")??""}`),ee($,e(i).label)}),m(H,g)}),l(ce),l(u),h(()=>ee(b,e(t).header)),rt("submit",u,H=>{var g;H.preventDefault(),H.stopPropagation();const i=(g=e(t))==null?void 0:g.actions.find($=>$.buttonType==="submit");i&&C(i)}),m(c,u)};U(we,c=>{e(t)&&c(re)})}l(le),l(J),m(a,J),Ie()}Qe(["input","change","click"]);var sa=K('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path></svg>');function oa(a,n){let r=B(n,"class",3,"");var t=sa();h(()=>G(t,`icon icon-tabler icons-tabler-outline icon-tabler-bolt ${(r()||"")??""}`)),m(a,t)}function ia(a,n){Z(n,!e(n))}var la=M('<aside><div class="flex h-full flex-col p-4"><div class="relative"><button class="bg-base-200 border-base-content absolute -right-8 top-0 flex items-center justify-center rounded-full border-2 p-1"><!></button></div> <ul class="menu flex flex-col space-y-4"><li class="mb-10"><a href="/" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">OCPP Manager</p></a></li> <li><a href="/monitoring" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Monitoring</p></a></li> <li><a href="/transactions" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Transactions</p></a></li> <li><a href="/rfid-tags" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">RFID Tags</p></a></li> <li><a href="/authorization" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Authorization</p></a></li> <li><a href="/invoices" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Invoices</p></a></li> <li><a href="/administration" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Administration</p></a></li> <li><a href="/logs" class="item flex items-center text-lg font-bold"><!> <p class="ml-4 text-nowrap">Logs</p></a></li></ul></div></aside> <div class="flex flex-1 flex-col"><main class="bg-base-100 flex-1 p-8"><!></main> <footer class="bg-base-200 p-4 text-center text-sm"><p> </p></footer></div>',1),ca=M('<div class="bg-base-100 flex h-screen"><!></div> <!>',1);function Ca(a,n){$e(n,!0);const r=ot(),t=()=>it(qt,"$page",r);let o=ae(N(new Date)),s=ae(!1),_=ae(!1);const L="isSidebarMinimized";qe(()=>{const C=setInterval(()=>{Z(o,N(new Date))},1e3);return()=>clearInterval(C)}),Se(()=>{const C=localStorage.getItem(L);C!==null&&Z(s,N(JSON.parse(C))),Z(_,!0)}),qe(()=>{localStorage.setItem(L,JSON.stringify(e(s)))});function x(C){return t().url.pathname===C}Et(a,{client:vt,children:(C,Le)=>{var T=ca(),J=te(T),ie=v(J);{var le=re=>{var c=la(),u=te(c),p=v(u),b=v(p),D=v(b);D.__click=[ia,s];var ce=v(D);{var H=Y=>{Tt(Y,{class:"text-base-content size-6"})},i=Y=>{Nt(Y,{class:"text-base-content size-6"})};U(ce,Y=>{e(s)?Y(H):Y(i,!1)})}l(D),l(b);var g=d(b,2),$=v(g),A=v($);const ve=Q(()=>x("/"));h(()=>f(A,"btn-active",e(ve)));var ue=v(A);Ot(ue,{class:"size-6"});var pe=d(ue,2);l(A),l($);var ne=d($,2),X=v(ne);const xe=Q(()=>x("/monitoring"));h(()=>f(X,"btn-active",e(xe)));var he=v(X);St(he,{class:" size-6"});var z=d(he,2);l(X),l(ne);var w=d(ne,2),I=v(w);const se=Q(()=>x("/transactions"));h(()=>f(I,"btn-active",e(se)));var de=v(I);oa(de,{class:" size-6"});var q=d(de,2);l(I),l(w);var k=d(w,2),F=v(k);const ye=Q(()=>x("/rfid-tags"));h(()=>f(F,"btn-active",e(ye)));var fe=v(F);_t(fe,{class:" size-6"});var P=d(fe,2);l(F),l(k);var y=d(k,2),O=v(y);const E=Q(()=>x("/authorization"));h(()=>f(O,"btn-active",e(E)));var j=v(O);ht(j,{class:" size-6"});var S=d(j,2);l(O),l(y);var V=d(y,2),me=v(V);const Ze=Q(()=>x("/invoices"));h(()=>f(me,"btn-active",e(Ze)));var De=v(me);$t(De,{class:"size-6"});var Je=d(De,2);l(me),l(V);var ke=d(V,2),_e=v(ke);const Ve=Q(()=>x("/administration"));h(()=>f(_e,"btn-active",e(Ve)));var Oe=v(_e);jt(Oe,{class:"size-6"});var We=d(Oe,2);l(_e),l(ke);var Ae=d(ke,2),be=v(Ae);const Ke=Q(()=>x("/logs"));h(()=>f(be,"btn-active",e(Ke)));var Ne=v(be);Pt(Ne,{class:"size-6"});var Ge=d(Ne,2);l(be),l(Ae),l(g),l(p),l(u);var Be=d(u,2),Me=v(Be),Xe=v(Me);nt(Xe,()=>n.children),l(Me);var Te=d(Me,2),He=v(Te),Ye=v(He,!0);h(()=>ee(Ye,e(o).toLocaleTimeString())),l(He),l(Te),l(Be),h(()=>{W(u,`${e(s)?"w-24":"w-72"} bg-base-200 text-base-content transition-width flex-shrink-0 duration-300`),f(A,"justify-center",e(s)),f(pe,"hidden",e(s)),f(X,"justify-center",e(s)),f(z,"hidden",e(s)),f(I,"justify-center",e(s)),f(q,"hidden",e(s)),f(F,"justify-center",e(s)),f(P,"hidden",e(s)),f(O,"justify-center",e(s)),f(S,"hidden",e(s)),f(me,"justify-center",e(s)),f(Je,"hidden",e(s)),f(_e,"justify-center",e(s)),f(We,"hidden",e(s)),f(be,"justify-center",e(s)),f(Ge,"hidden",e(s))}),m(re,c)};U(ie,re=>{e(_)&&re(le)})}l(J);var we=d(J,2);na(we,{}),m(C,T)},$$slots:{default:!0}}),Ie()}Qe(["click"]);export{Ca as component};
