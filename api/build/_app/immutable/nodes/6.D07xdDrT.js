import"../chunks/disclose-version.Bg9kRutz.js";import"../chunks/legacy.CjaeNba4.js";import{ao as ft,af as mt,K as Bt,C as Qt,h as xt,t as k,p as Ut,a as Kt,f as ht,g as d,aE as vt,e as l,r as u,$ as c,a4 as Z,aF as Gt,ak as Zt}from"../chunks/runtime.abrMvGU9.js";import{a as y,n as Pt,d as te,t as j,c as ee,b as bt,s as S}from"../chunks/render.BL_amxVg.js";import{i as tt}from"../chunks/if.CZPx-Ecd.js";import{e as ae,i as ne}from"../chunks/each.C0dtL42L.js";import{c as gt}from"../chunks/attributes.Jce5emvo.js";import{b as St,a as pt}from"../chunks/class.Ct5_4gtP.js";import{i as re,p as kt,s as se,a as _t}from"../chunks/props.CwHRb1Ux.js";import{b as oe}from"../chunks/this.ByIZMl-g.js";import{i as ie}from"../chunks/lifecycle.QzCIaJTB.js";import{B as le}from"../chunks/BasePage.BdjcuQGV.js";import{a as ue,b as ce}from"../chunks/queryClient.BjLvEgtg.js";let yt=!1;function de(){yt||(yt=!0,document.addEventListener("reset",t=>{Promise.resolve().then(()=>{var a;if(!t.defaultPrevented)for(const e of t.target.elements)(a=e.__on_r)==null||a.call(e)})},{capture:!0}))}function fe(t){var a=Bt,e=Qt;ft(null),mt(null);try{return t()}finally{ft(a),mt(e)}}function me(t,a,e,n=e){t.addEventListener(a,()=>fe(e));const r=t.__on_r;r?t.__on_r=()=>{r(),n(!0)}:t.__on_r=()=>n(!0),de()}function Wt(t,a,e){if(t.multiple)return be(t,a);for(var n of t.options){var r=A(n);if(re(r,a)){n.selected=!0;return}}(!e||a!==void 0)&&(t.selectedIndex=-1)}function he(t,a){xt(()=>{var e=new MutationObserver(()=>{var n=t.__value;Wt(t,n)});return e.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{e.disconnect()}})}function ve(t,a,e=a){var n=!0;me(t,"change",r=>{var i=r?"[selected]":":checked",o;if(t.multiple)o=[].map.call(t.querySelectorAll(i),A);else{var s=t.querySelector(i)??t.querySelector("option:not([disabled])");o=s&&A(s)}e(o)}),xt(()=>{var r=a();if(Wt(t,r,n),n&&r===void 0){var i=t.querySelector(":checked");i!==null&&(r=A(i),e(r))}t.__value=r,n=!1}),he(t)}function be(t,a){for(var e of t.options)e.selected=~a.indexOf(A(e))}function A(t){return"__value"in t?t.__value:t.value}var ge=Pt('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path></svg>');function pe(t,a){let e=kt(a,"class",3,"");var n=ge();k(()=>St(n,`icon icon-tabler icons-tabler-outline icon-tabler-dots ${(e()||"")??""}`)),y(t,n)}var _e=Pt('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 7l-1 1"></path><path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3"></path><path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14"></path><path d="M9 11.5l-1.5 2.5h3l-1.5 2.5"></path><path d="M3 20l12 0"></path><path d="M4 8l10 0"></path></svg>');function ye(t,a){let e=kt(a,"class",3,"");var n=_e();k(()=>St(n,`icon icon-tabler icons-tabler-outline icon-tabler-charging-pile ${(e()||"")??""}`)),y(t,n)}const T=43200,wt=1440,Mt=Symbol.for("constructDateFrom");function at(t,a){return typeof t=="function"?t(a):t&&typeof t=="object"&&Mt in t?t[Mt](a):t instanceof Date?new t.constructor(a):new Date(a)}function M(t,a){return at(t,t)}let we={};function Me(){return we}function Dt(t){const a=M(t),e=new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()));return e.setUTCFullYear(a.getFullYear()),+t-+e}function nt(t,...a){const e=at.bind(null,t||a.find(n=>typeof n=="object"));return a.map(e)}function X(t,a){const e=+M(t)-+M(a);return e<0?-1:e>0?1:e}function De(t){return at(t,Date.now())}function xe(t,a,e){const[n,r]=nt(e==null?void 0:e.in,t,a),i=n.getFullYear()-r.getFullYear(),o=n.getMonth()-r.getMonth();return i*12+o}function Pe(t){return a=>{const n=(t?Math[t]:Math.trunc)(a);return n===0?0:n}}function Se(t,a){return+M(t)-+M(a)}function ke(t,a){const e=M(t);return e.setHours(23,59,59,999),e}function We(t,a){const e=M(t),n=e.getMonth();return e.setFullYear(e.getFullYear(),n+1,0),e.setHours(23,59,59,999),e}function Ce(t,a){const e=M(t);return+ke(e)==+We(e)}function Fe(t,a,e){const[n,r,i]=nt(e==null?void 0:e.in,t,t,a),o=X(r,i),s=Math.abs(xe(r,i));if(s<1)return 0;r.getMonth()===1&&r.getDate()>27&&r.setDate(30),r.setMonth(r.getMonth()-o*s);let v=X(r,i)===-o;Ce(n)&&s===1&&X(n,i)===1&&(v=!1);const f=o*(s-+v);return f===0?0:f}function Ae(t,a,e){const n=Se(t,a)/1e3;return Pe(e==null?void 0:e.roundingMethod)(n)}const je={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Oe=(t,a,e)=>{let n;const r=je[t];return typeof r=="string"?n=r:a===1?n=r.one:n=r.other.replace("{{count}}",a.toString()),e!=null&&e.addSuffix?e.comparison&&e.comparison>0?"in "+n:n+" ago":n};function et(t){return(a={})=>{const e=a.width?String(a.width):t.defaultWidth;return t.formats[e]||t.formats[t.defaultWidth]}}const Te={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Xe={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},qe={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},Ne={date:et({formats:Te,defaultWidth:"full"}),time:et({formats:Xe,defaultWidth:"full"}),dateTime:et({formats:qe,defaultWidth:"full"})},Ie={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},Ye=(t,a,e,n)=>Ie[t];function C(t){return(a,e)=>{const n=e!=null&&e.context?String(e.context):"standalone";let r;if(n==="formatting"&&t.formattingValues){const o=t.defaultFormattingWidth||t.defaultWidth,s=e!=null&&e.width?String(e.width):o;r=t.formattingValues[s]||t.formattingValues[o]}else{const o=t.defaultWidth,s=e!=null&&e.width?String(e.width):t.defaultWidth;r=t.values[s]||t.values[o]}const i=t.argumentCallback?t.argumentCallback(a):a;return r[i]}}const ze={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Le={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},$e={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Re={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Ve={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},He={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ee=(t,a)=>{const e=Number(t),n=e%100;if(n>20||n<10)switch(n%10){case 1:return e+"st";case 2:return e+"nd";case 3:return e+"rd"}return e+"th"},Je={ordinalNumber:Ee,era:C({values:ze,defaultWidth:"wide"}),quarter:C({values:Le,defaultWidth:"wide",argumentCallback:t=>t-1}),month:C({values:$e,defaultWidth:"wide"}),day:C({values:Re,defaultWidth:"wide"}),dayPeriod:C({values:Ve,defaultWidth:"wide",formattingValues:He,defaultFormattingWidth:"wide"})};function F(t){return(a,e={})=>{const n=e.width,r=n&&t.matchPatterns[n]||t.matchPatterns[t.defaultMatchWidth],i=a.match(r);if(!i)return null;const o=i[0],s=n&&t.parsePatterns[n]||t.parsePatterns[t.defaultParseWidth],v=Array.isArray(s)?Qe(s,D=>D.test(o)):Be(s,D=>D.test(o));let f;f=t.valueCallback?t.valueCallback(v):v,f=e.valueCallback?e.valueCallback(f):f;const _=a.slice(o.length);return{value:f,rest:_}}}function Be(t,a){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e)&&a(t[e]))return e}function Qe(t,a){for(let e=0;e<t.length;e++)if(a(t[e]))return e}function Ue(t){return(a,e={})=>{const n=a.match(t.matchPattern);if(!n)return null;const r=n[0],i=a.match(t.parsePattern);if(!i)return null;let o=t.valueCallback?t.valueCallback(i[0]):i[0];o=e.valueCallback?e.valueCallback(o):o;const s=a.slice(r.length);return{value:o,rest:s}}}const Ke=/^(\d+)(th|st|nd|rd)?/i,Ge=/\d+/i,Ze={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},ta={any:[/^b/i,/^(a|c)/i]},ea={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},aa={any:[/1/i,/2/i,/3/i,/4/i]},na={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},ra={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},sa={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},oa={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},ia={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},la={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},ua={ordinalNumber:Ue({matchPattern:Ke,parsePattern:Ge,valueCallback:t=>parseInt(t,10)}),era:F({matchPatterns:Ze,defaultMatchWidth:"wide",parsePatterns:ta,defaultParseWidth:"any"}),quarter:F({matchPatterns:ea,defaultMatchWidth:"wide",parsePatterns:aa,defaultParseWidth:"any",valueCallback:t=>t+1}),month:F({matchPatterns:na,defaultMatchWidth:"wide",parsePatterns:ra,defaultParseWidth:"any"}),day:F({matchPatterns:sa,defaultMatchWidth:"wide",parsePatterns:oa,defaultParseWidth:"any"}),dayPeriod:F({matchPatterns:ia,defaultMatchWidth:"any",parsePatterns:la,defaultParseWidth:"any"})},ca={code:"en-US",formatDistance:Oe,formatLong:Ne,formatRelative:Ye,localize:Je,match:ua,options:{weekStartsOn:0,firstWeekContainsDate:1}};function da(t,a,e){const n=Me(),r=(e==null?void 0:e.locale)??n.locale??ca,i=2520,o=X(t,a);if(isNaN(o))throw new RangeError("Invalid time value");const s=Object.assign({},e,{addSuffix:e==null?void 0:e.addSuffix,comparison:o}),[v,f]=nt(e==null?void 0:e.in,...o>0?[a,t]:[t,a]),_=Ae(f,v),D=(Dt(f)-Dt(v))/1e3,h=Math.round((_-D)/60);let b;if(h<2)return e!=null&&e.includeSeconds?_<5?r.formatDistance("lessThanXSeconds",5,s):_<10?r.formatDistance("lessThanXSeconds",10,s):_<20?r.formatDistance("lessThanXSeconds",20,s):_<40?r.formatDistance("halfAMinute",0,s):_<60?r.formatDistance("lessThanXMinutes",1,s):r.formatDistance("xMinutes",1,s):h===0?r.formatDistance("lessThanXMinutes",1,s):r.formatDistance("xMinutes",h,s);if(h<45)return r.formatDistance("xMinutes",h,s);if(h<90)return r.formatDistance("aboutXHours",1,s);if(h<wt){const g=Math.round(h/60);return r.formatDistance("aboutXHours",g,s)}else{if(h<i)return r.formatDistance("xDays",1,s);if(h<T){const g=Math.round(h/wt);return r.formatDistance("xDays",g,s)}else if(h<T*2)return b=Math.round(h/T),r.formatDistance("aboutXMonths",b,s)}if(b=Fe(f,v),b<12){const g=Math.round(h/T);return r.formatDistance("xMonths",g,s)}else{const g=b%12,x=Math.trunc(b/12);return g<3?r.formatDistance("aboutXYears",x,s):g<9?r.formatDistance("overXYears",x,s):r.formatDistance("almostXYears",x+1,s)}}function fa(t,a){return da(t,De(t),a)}var ma=(t,a,e)=>a(d(e).id,d(e).registrationStatus),ha=j('<span class="text-base-300">No data</span>'),va=j('<div class="card bg-base-200 shadow-md"><div class="card-body"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><!> <h2 class="card-title"> </h2></div> <button class="btn btn-sm btn-ghost" aria-label="Open status modal"><!></button></div> <p class="text-sm"><span class="font-bold">Vendor:</span> </p> <p class="text-sm"><span class="font-bold">Status:</span> <span> </span></p> <p class="text-sm"><span class="font-bold">Firmware:</span> </p> <p class="text-sm"><span class="font-bold">Last Heartbeat:</span> <br> <small><!></small></p> <p class="text-sm"><span class="font-bold">Registration:</span> <span> </span></p></div></div>'),ba=j('<p class="text-base-300 text-center">Loading chargers...</p>'),ga=j('<span class="loading loading-spinner"></span>'),pa=(t,a)=>d(a).close(),_a=j('<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"><!></div> <dialog class="modal"><form method="dialog" class="modal-box bg-base-200"><h3 class="text-lg font-bold">Update Charger Status</h3> <p class="py-2">Select a new status for the charger:</p> <div class="form-control"><label class="label"><span class="label-text">Status</span></label> <select class="select select-bordered bg-base-100"><option>Accepted</option><option>Pending</option><option>Rejected</option><option>Disabled</option></select></div> <div class="modal-action"><button class="btn btn-primary"><!></button> <button class="btn">Cancel</button></div></form></dialog>',1);function Oa(t,a){Ut(a,!1);const e=se(),n=()=>_t(o,"$mutationChargerStatus",e),r=()=>_t(i,"$queryChargers",e),i=ue(),o=ce();let s=vt(),v=null,f=vt("Accepted");const _=(b,g)=>{v=b,Z(f,g),d(s).showModal()},D=async()=>{v&&n().mutate({id:v.toString(),status:d(f)},{onSuccess:()=>d(s).close()})},h=b=>({Accepted:"badge bg-base-200 text-success",Pending:"badge bg-base-200 text-warning",Rejected:"badge bg-base-200 text-neutral",Disabled:"badge bg-base-200 text-secondary"})[b]||"badge";ie(),le(t,{title:"Monitoring",children:(b,g)=>{var x=_a(),q=ht(x),Ct=l(q);{var Ft=m=>{var w=ee(),qt=ht(w);ae(qt,1,()=>r().data,ne,(Nt,p)=>{var R=va(),it=l(R),V=l(it),H=l(V),lt=l(H);ye(lt,{class:"text-primary h-6 w-6"});var ut=c(lt,2),It=l(ut);u(ut),u(H);var E=c(H,2);E.__click=[ma,_,p];var Yt=l(E);pe(Yt,{}),u(E),u(V);var J=c(V,2),zt=c(l(J));u(J);var B=c(J,2),Q=c(l(B),2),Lt=l(Q,!0);u(Q),u(B);var U=c(B,2),$t=c(l(U));u(U);var K=c(U,2),ct=c(l(K),4),Rt=l(ct);{var Vt=P=>{var O=bt();k(()=>S(O,fa(new Date(d(p).lastHeartbeat),{addSuffix:!0}))),y(P,O)},Ht=P=>{var O=ha();y(P,O)};tt(Rt,P=>{d(p).lastHeartbeat?P(Vt):P(Ht,!1)})}u(ct),u(K);var dt=c(K,2),G=c(l(dt),2);const Et=Zt(()=>gt(h(d(p).registrationStatus)));var Jt=l(G,!0);u(G),u(dt),u(it),u(R),k(()=>{S(It,`${d(p).model??""} (${d(p).serialNumber??""})`),S(zt,` ${d(p).vendor??""}`),pt(Q,gt(d(p).status==="Online"?"badge bg-base-300 text-success":"badge bg-base-300 text-error"),""),S(Lt,d(p).status),S($t,` ${d(p).firmwareVersion||"Unknown"}`),pt(G,d(Et),""),S(Jt,d(p).registrationStatus)}),y(Nt,R)}),y(m,w)},At=m=>{var w=ba();y(m,w)};tt(Ct,m=>{r().data?m(Ft):m(At,!1)})}u(q);var N=c(q,2),rt=l(N),I=c(l(rt),4),Y=c(l(I),2);k(()=>{d(f),Gt(()=>{})});var z=l(Y);z.value=(z.__value="Accepted")==null?"":"Accepted";var L=c(z);L.value=(L.__value="Pending")==null?"":"Pending";var $=c(L);$.value=($.__value="Rejected")==null?"":"Rejected";var st=c($);st.value=(st.__value="Disabled")==null?"":"Disabled",u(Y),u(I);var ot=c(I,2),W=l(ot);W.__click=D;var jt=l(W);{var Ot=m=>{var w=ga();y(m,w)},Tt=m=>{var w=bt("Update");y(m,w)};tt(jt,m=>{n().isPending?m(Ot):m(Tt,!1)})}u(W);var Xt=c(W,2);Xt.__click=[pa,s],u(ot),u(rt),u(N),oe(N,m=>Z(s,m),()=>d(s)),k(()=>W.disabled=n().isPending),ve(Y,()=>d(f),m=>Z(f,m)),y(b,x)},$$slots:{default:!0}}),Kt()}te(["click"]);export{Oa as component};
