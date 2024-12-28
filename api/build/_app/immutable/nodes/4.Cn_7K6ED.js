import"../chunks/disclose-version.Bg9kRutz.js";import"../chunks/legacy.CT0A0X_A.js";import{e as Ct,f as _t,t as D,k as a,o as i,r as e,n as xt,q as o,x as tt}from"../chunks/runtime.BhkHmGnc.js";import{d as Dt,a as y,t as I,c as It,s as C}from"../chunks/render.BQ4Vc4Ij.js";import{i as $t}from"../chunks/if.zEQZhpIz.js";import{e as zt,i as At}from"../chunks/each.CMEkCpSi.js";import{i as wt}from"../chunks/lifecycle.DzPzqbVW.js";import{s as Tt,a as h}from"../chunks/props.BwEu9BMa.js";import{b as St,d as kt,e as Et,f as qt,g as Nt,h as Rt}from"../chunks/queryClient.C8IPkV7D.js";import{d as et,z as f,t as v}from"../chunks/toast.BILRVjIN.js";import{B as Pt}from"../chunks/BasePage.CnamnGhH.js";import{I as Ut}from"../chunks/IconLockPin.CBWK4i-h.js";import{S as Ft}from"../chunks/Scrollable.Dihwx7Il.js";import{f as at}from"../chunks/formatDistanceToNow.DXTjigy3.js";const Mt=($,u,n,s,g,z,R)=>{et.open({header:"Add Charge Authorization",fields:[{label:"Charger ID",name:"chargerId",type:"dropdown",options:u().data?u().data.map(r=>({label:`${r.friendlyName} (${r.vendor})`,value:r.id.toString()})):[],validation:f.string().min(1)},{label:"Expiry Date",name:"expiryDate",type:"date",defaultValue:"",validation:f.string()},{label:"RFID Tag ID",name:"rfidTagId",type:"dropdown",options:s().data?s().data.map(r=>({label:`${r.friendlyName} (${r.rfidTag})`,value:r.id.toString()})):[],validation:f.string().min(1)}],actions:[{label:"Create",key:"create",class:"btn-primary",buttonType:"submit",callback:({fieldValues:r,close:_})=>{z().mutate({chargerId:parseInt(r.chargerId),expiryDate:r.expiryDate?new Date(r.expiryDate):null,rfidTagId:parseInt(r.rfidTagId)||null},{onError:()=>{v({message:"Error creating charge authorization",type:"error"})},onSuccess:()=>{v({message:"Charge authorization created",type:"success"}),_()}})}}]})};var Qt=($,u,n)=>u(o(n)),jt=I('<div class="bg-base-200 rounded-lg p-6 shadow-md"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><!> <div><h3 class="text-xl font-semibold"> </h3></div></div> <button class="btn btn-ghost btn-sm">Edit</button></div> <table class="bg-base-300 mt-4 table w-full overflow-hidden rounded-lg"><tbody><tr><td class="w-60 font-medium">Charging Station</td><td> </td></tr><tr><td class="w-60 font-medium">RFID Tag</td><td> </td></tr><tr><td class="w-60 font-medium">Expiry Date</td><td> </td></tr><tr><td class="w-60 font-medium">Created</td><td> </td></tr></tbody></table></div>'),Bt=I('<div class="bg-base-200 rounded-lg p-8 text-center"><p class="text-base-content">Loading Charge Authorizations...</p></div>'),Lt=I('<div class="space-y-6"><!></div>'),Ht=I('<div class="container mx-auto px-4"><div class="mb-6 flex items-center justify-between"><h1 class="text-2xl font-bold">Charge Authorizations</h1> <button class="btn btn-primary">Add Charge Authorization</button></div> <!></div>');function na($,u){Ct(u,!1);const n=Tt(),s=()=>h(P,"$queryChargers",n),g=()=>h(U,"$queryRfidTags",n),z=()=>h(F,"$mutationChargeAuthorizationCreate",n),R=()=>h(it,"$mutationChargeAuthorizationUpdate",n),r=()=>h(ot,"$mutationChargeAuthorizationDelete",n),_=()=>h(rt,"$queryChargeAuthorizations",n),rt=St(1e4),P=kt(1e4),U=Et(1e4),F=qt(),it=Nt(),ot=Rt(),nt=l=>{var A;et.open({header:"Edit Charge Authorization",fields:[{label:"Charger ID",name:"chargerId",type:"dropdown",defaultValue:l.chargerId.toString(),options:s().data?s().data.map(t=>({label:`${t.friendlyName} (${t.vendor})`,value:t.id.toString()})):[],validation:f.string().min(1)},{label:"Expiry Date",name:"expiryDate",type:"date",defaultValue:l.expiryDate||"",validation:f.string()},{label:"RFID Tag ID",name:"rfidTagId",type:"dropdown",defaultValue:((A=l.rfidTagId)==null?void 0:A.toString())||"",options:g().data?g().data.map(t=>({label:`${t.friendlyName} (${t.rfidTag})`,value:t.id.toString()})):[],validation:f.string().min(1)}],actions:[{label:"Save",key:"save",class:"btn-primary",buttonType:"submit",callback:({fieldValues:t,close:b})=>{R().mutate({id:l.id,chargerId:parseInt(t.chargerId),expiryDate:t.expiryDate?new Date(t.expiryDate):null,rfidTagId:parseInt(t.rfidTagId)||null},{onError:()=>{v({message:"Error saving charge authorization",type:"error"})},onSuccess:()=>{v({message:"Charge authorization saving",type:"success"}),b()}})}},{label:"Cancel",key:"cancel",class:"btn-outline",callback:({close:t})=>{t()}},{label:"Delete",key:"delete",class:"btn-error btn-outline",buttonType:"button",callback:({close:t})=>{r().mutate({id:l.id},{onError:()=>{v({message:"Error deleting charge authorization",type:"error"})},onSuccess:()=>{v({message:"Charge authorization deleted",type:"success"}),t()}})}}]})};wt(),Pt($,{title:"Charge Authorizations",children:(l,A)=>{var t=Ht(),b=a(t),M=i(a(b),2);M.__click=[Mt,s,P,g,U,z,F],e(b);var st=i(b,2);Ft(st,{class:"p-4",maxHeight:"80svh",children:(dt,Gt)=>{var w=Lt(),lt=a(w);{var ct=m=>{var x=It(),gt=xt(x);zt(gt,1,()=>_().data,At,(mt,c)=>{var T=jt();const Q=tt(()=>{var d;return(d=g().data)==null?void 0:d.find(p=>p.id===o(c).rfidTagId)}),j=tt(()=>{var d;return(d=s().data)==null?void 0:d.find(p=>p.id===o(c).chargerId)});var S=a(T),k=a(S),B=a(k);Ut(B,{class:"text-primary h-10 w-10"});var L=i(B,2),H=a(L),pt=a(H);e(H),e(L),e(k);var ht=i(k,2);ht.__click=[Qt,nt,c],e(S);var G=i(S,2),J=a(G),E=a(J),K=i(a(E)),vt=a(K);e(K),e(E);var q=i(E),O=i(a(q)),ft=a(O);e(O),e(q);var N=i(q),W=i(a(N)),bt=a(W,!0);D(()=>C(bt,o(c).expiryDate?at(new Date(o(c).expiryDate),{addSuffix:!0}):"N/A")),e(W),e(N);var X=i(N),Y=i(a(X)),yt=a(Y,!0);D(()=>C(yt,at(new Date(o(c).createdAt),{addSuffix:!0}))),e(Y),e(X),e(J),e(G),e(T),D(()=>{var d,p,Z,V;C(pt,`Charger ID: ${o(c).chargerId??""}`),C(vt,`${((d=o(j))==null?void 0:d.friendlyName)??""} (${((p=o(j))==null?void 0:p.vendor)??""})`),C(ft,`${((Z=o(Q))==null?void 0:Z.friendlyName)??""} (${((V=o(Q))==null?void 0:V.rfidTag)??""})`)}),y(mt,T)}),y(m,x)},ut=m=>{var x=Bt();y(m,x)};$t(lt,m=>{_().data?m(ct):m(ut,!1)})}e(w),y(dt,w)},$$slots:{default:!0}}),e(t),D(()=>M.disabled=s().isPending||g().isPending),y(l,t)},$$slots:{default:!0}}),_t()}Dt(["click"]);export{na as component};
