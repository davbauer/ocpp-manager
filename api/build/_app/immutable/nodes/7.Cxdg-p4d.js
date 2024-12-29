import"../chunks/disclose-version.Bg9kRutz.js";import"../chunks/legacy.K_zCUCQM.js";import{t as C,e as Ce,k as e,o as r,r as t,f as ye,n as we,q as g,a3 as tt}from"../chunks/runtime.ehUlzqf7.js";import{a as d,n as ke,d as Me,s as l,t as y,c as Se}from"../chunks/render.CTvaeiJJ.js";import{i as te}from"../chunks/if.DhglbZ1u.js";import{e as Ue,i as Ee}from"../chunks/each.xjQWOxjV.js";import{i as at}from"../chunks/lifecycle.BkkXAv86.js";import{b as Ne,s as Re,a as p}from"../chunks/props.BJYttQBT.js";import{B as rt}from"../chunks/BasePage.BtoTIJcp.js";import{m as st,n as nt,o as ot,p as it,q as lt,d as dt,t as ct}from"../chunks/queryClient.D14jiU7u.js";import{s as Pe,t as fe,b as xe}from"../chunks/class.DcSGHe10.js";import{b as vt}from"../chunks/this.F4vZ-ts8.js";import{d as Ae,z as N,t as m}from"../chunks/toast.CGwG1ZJt.js";import{f as gt}from"../chunks/formatDistanceToNow.Cbs4euKL.js";import{S as ut}from"../chunks/Scrollable.DcwQ1d9i.js";var mt=ke('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 7l-1 1"></path><path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3"></path><path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14"></path><path d="M9 11.5l-1.5 2.5h3l-1.5 2.5"></path><path d="M3 20l12 0"></path><path d="M4 8l10 0"></path></svg>');function ht(i,a){let s=Ne(a,"class",3,"");var n=mt();C(()=>Pe(n,`icon icon-tabler icons-tabler-outline icon-tabler-charging-pile ${(s()||"")??""}`)),d(i,n)}var bt=ke('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z"></path><path d="M4 20l3.5 -3.5"></path><path d="M15 4l-3.5 3.5"></path><path d="M20 9l-3.5 3.5"></path></svg>');function pt(i,a){let s=Ne(a,"class",3,"");var n=bt();C(()=>Pe(n,`icon icon-tabler icons-tabler-outline icon-tabler-plug ${(s()||"")??""}`)),d(i,n)}const _t=(i,a,s,n,u,R)=>{Ae.open({header:"Edit Charger",fields:[{label:"Friendly Name",name:"friendlyName",type:"text",defaultValue:a.charger.friendlyName||"",validation:N.string().min(1,{message:"Please enter a friendly name."})},{label:"Shortcode",name:"shortcode",type:"text",defaultValue:a.charger.shortcode||"",validation:N.string().regex(/^[a-z0-9-]+$/,{message:"Only lowercase letters, numbers, and dashes are allowed (no spaces or other characters)."}).min(5,{message:"Minimum length is 5 characters."}).max(30,{message:"Maximum length is 30 characters."})},{label:"Status",name:"status",type:"dropdown",options:[{label:"Pending",value:"Pending"},{label:"Accepted",value:"Accepted"},{label:"Rejected",value:"Rejected"}],defaultValue:a.charger.status||"Pending",validation:N.enum(["Pending","Accepted","Rejected"])}],actions:[{label:"Save",key:"save",class:"btn-primary",buttonType:"submit",callback:({fieldValues:o,close:w})=>{s().mutate({id:a.charger.id.toString(),friendlyName:o.friendlyName,status:o.status,shortcode:o.shortcode},{onError:()=>{m({message:"Error saving charger",type:"error"})},onSuccess:()=>{m({message:"Charger saved",type:"success"}),w()}})}},{label:"Cancel",key:"cancel",class:"btn-outline",callback:({close:o})=>{o()}},{label:"Delete",key:"delete",class:"btn-error btn-outline",buttonType:"button",callback:({close:o})=>{u().mutate({id:a.charger.id.toString()},{onError:()=>{m({message:"Error deleting charger",type:"error"})},onSuccess:()=>{m({message:"Charger deleted",type:"success"}),o()}}),o()}}]})};var ft=(i,a)=>a("Soft"),xt=(i,a)=>a("Hard"),Ct=y('<p class="text-error mt-1 text-sm"> </p>'),yt=(i,a,s,n)=>a().mutate({id:g(n).id.toString()}),wt=y('<div class="bg-base-300 flex w-full items-center justify-between rounded-lg p-4 shadow-md"><div class="flex items-center gap-4"><!> <div class="flex flex-col text-left"><span class="font-bold"> </span> <span class="text-sm"> </span> <!></div> <div class="w-16"></div> <button class="btn btn-ghost btn-sm">Unlock</button></div> <div class="flex items-center gap-4"><p class="text-sm font-medium"> </p> <div></div></div></div>'),kt=y('<div class="bg-base-200 container mx-auto rounded-lg px-4 py-6 shadow-md"><div class="mb-6 flex items-center justify-between"><div class="flex items-center gap-4"><!> <div><h2 class="text-2xl font-semibold"> </h2> <p class="text-sm text-gray-500"> </p></div></div> <div class="flex gap-x-2"><div><button class="btn btn-ghost btn-sm">Reset</button> <dialog class="modal"><div class="modal-box"><form method="dialog"><button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form> <h3 class="mb-10 text-lg font-bold">Reset Charger</h3> <div class="flex gap-x-2"><button class="btn btn-warning btn-sm">Soft Reset</button> <button class="btn btn-error btn-sm">Hard Reset</button></div></div></dialog></div> <button class="btn btn-ghost btn-sm">Edit</button></div></div> <div class="mb-6"><span class="badge badge-lg badge-outline p-3"> </span></div> <table class="bg-base-300 table w-full overflow-hidden rounded-lg"><tbody><tr><td class="w-60 font-medium">Connectivity</td><td><span> </span></td></tr><tr><td class="w-60 font-medium">Firmware</td><td> </td></tr><tr><td class="w-60 font-medium">Model</td><td> </td></tr><tr><td class="w-60 font-medium">Last Heartbeat</td><td> </td></tr><tr><td class="w-60 font-medium">Shortcode</td><td> </td></tr></tbody></table> <div class="mt-6"><h3 class="mb-4 text-xl font-bold">Connectors</h3> <div class="space-y-4"><!></div></div></div>');function Mt(i,a){Ce(a,!0);const s=Re(),n=()=>p(_,"$mutationChargerUpdate",s),u=()=>p(f,"$mutationChargerDelete",s),R=()=>p(j,"$mutationChargerReset",s),o=()=>p(ae,"$queryConnectors",s),w=()=>p(P,"$mutationConnectorUnlock",s),ae=st(a.charger.id.toString(),1e4),_=nt(),f=ot(),j=it(),P=lt(),q=v=>({Available:"bg-success",Preparing:"bg-info",Charging:"bg-primary",SuspendedEVSE:"bg-warning",SuspendedEV:"bg-warning",Finishing:"bg-info",Reserved:"bg-secondary",Unavailable:"bg-base-300",Faulted:"bg-error"})[v]||"bg-base-300";let k;const x=v=>{R().mutate({id:a.charger.id,type:v},{onError:()=>{m({message:"Error resetting charger",type:"error"})},onSuccess:()=>{m({message:"Charger reset",type:"success"}),k.close()}})};var M=kt(),S=e(M),U=e(S),c=e(U);ht(c,{class:"text-primary h-10 w-10"});var h=r(c,2),E=e(h),H=e(E,!0);t(E);var A=r(E,2),De=e(A,!0);t(A),t(h),t(U);var re=r(U,2),z=e(re),se=e(z);se.__click=()=>k.showModal();var V=r(se,2),ne=e(V),oe=r(e(ne),4),ie=e(oe);ie.__click=[ft,x];var je=r(ie,2);je.__click=[xt,x],t(oe),t(ne),t(V),vt(V,v=>k=v,()=>k),t(z);var qe=r(z,2);qe.__click=[_t,a,n,_,u,f],t(re),t(S);var L=r(S,2),D=e(L),He=e(D,!0);t(D),t(L);var B=r(L,2),le=e(B),F=e(le),de=r(e(F)),T=e(de),ze=e(T,!0);t(T),t(de),t(F);var I=r(F),ce=r(e(I)),Ve=e(ce,!0);t(ce),t(I);var O=r(I),ve=r(e(O)),Le=e(ve,!0);t(ve),t(O);var Q=r(O),ge=r(e(Q)),Be=e(ge,!0);C(()=>l(Be,a.charger.lastHeartbeat?gt(new Date(a.charger.lastHeartbeat),{addSuffix:!0}):"N/A")),t(ge),t(Q);var ue=r(Q),me=r(e(ue)),Fe=e(me,!0);t(me),t(ue),t(le),t(B);var he=r(B,2),be=r(e(he),2),Te=e(be);{var Ie=v=>{var W=Se(),Oe=we(W);Ue(Oe,1,()=>o().data,Ee,(Qe,b)=>{var G=wt(),J=e(G),pe=e(J);pt(pe,{class:"h-6 w-6 text-current"});var K=r(pe,2),X=e(K),We=e(X);t(X);var Y=r(X,2),Ge=e(Y);t(Y);var Je=r(Y,2);{var Ke=$=>{var ee=Ct(),et=e(ee);t(ee),C(()=>l(et,`Error: ${g(b).errorCode??""}`)),d($,ee)};te(Je,$=>{g(b).errorCode&&$(Ke)})}t(K);var Xe=r(K,4);Xe.__click=[yt,w,P,b],t(J);var _e=r(J,2),Z=e(_e),Ye=e(Z,!0);t(Z);var Ze=r(Z,2);const $e=tt(()=>`h-3 w-20 rounded-full ${q(g(b).status)}`);t(_e),t(G),C(()=>{l(We,`Connector ${g(b).connectorId??""}`),l(Ge,`Current Load: ${g(b).currentLoad.valueWh??""} W`),l(Ye,g(b).status),xe(Ze,g($e))}),d(Qe,G)}),d(v,W)};te(Te,v=>{o().data&&v(Ie)})}t(be),t(he),t(M),C(()=>{l(H,a.charger.friendlyName||"Unknown"),l(De,a.charger.vendor||"Unknown Vendor"),fe(D,"badge-warning",a.charger.status==="Pending"),fe(D,"badge-success",a.charger.status==="Accepted"),l(He,a.charger.status||"Unknown"),xe(T,`badge badge-outline ${a.charger.connectivity==="Online"?"badge-success":"badge-warning"} p-3 text-white`),l(ze,a.charger.connectivity||"Unknown"),l(Ve,a.charger.firmwareVersion||"N/A"),l(Le,a.charger.model||"N/A"),l(Fe,a.charger.shortcode||"N/A")}),d(i,M),ye()}Me(["click"]);const St=(i,a,s)=>{Ae.open({header:"Add Charger",fields:[{label:"Label",name:"label",type:"text",defaultValue:"",validation:N.string().min(1)},{label:"Shortcode",name:"shortcode",type:"text",defaultValue:"your-shortcode",validation:N.string().regex(/^[a-z0-9-]+$/,{message:"Only lowercase letters, numbers, and dashes are allowed (no spaces or other characters)."}).min(5,{message:"Minimum length is 5 characters."}).max(30,{message:"Maximum length is 30 characters."})}],actions:[{label:"Create",key:"create",class:"btn-primary",buttonType:"submit",callback:({fieldValues:n,close:u})=>{a().mutate({friendlyName:n.label,shortcode:n.shortcode},{onError:()=>{m({message:"Error creating charger",type:"error"})},onSuccess:()=>{m({message:"Charger created",type:"success"}),u()}})}}]})};var Ut=y('<div class="bg-base-200 rounded-lg p-8 text-center"><p class="text-base-content">Loading chargers...</p></div>'),Et=y('<div class="space-y-6"><!></div>'),Nt=y('<div class="container mx-auto px-4"><div class="mb-6 flex items-center justify-between"><h1 class="text-2xl font-bold">Chargers</h1> <button class="btn btn-primary">Add Charger</button></div> <!></div>');function Qt(i,a){Ce(a,!1);const s=Re(),n=()=>p(o,"$mutationChargerCreate",s),u=()=>p(R,"$queryChargers",s),R=dt(1e4),o=ct();at(),rt(i,{title:"Monitoring",children:(w,ae)=>{var _=Nt(),f=e(_),j=r(e(f),2);j.__click=[St,n,o],t(f);var P=r(f,2);ut(P,{class:"p-4",maxHeight:"80svh",children:(q,k)=>{var x=Et(),M=e(x);{var S=c=>{var h=Se(),E=we(h);Ue(E,1,()=>u().data,Ee,(H,A)=>{Mt(H,{get charger(){return g(A)}})}),d(c,h)},U=c=>{var h=Ut();d(c,h)};te(M,c=>{u().data?c(S):c(U,!1)})}t(x),d(q,x)},$$slots:{default:!0}}),t(_),d(w,_)},$$slots:{default:!0}}),ye()}Me(["click"]);export{Qt as component};
