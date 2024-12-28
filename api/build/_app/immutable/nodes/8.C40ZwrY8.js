import"../chunks/disclose-version.Bg9kRutz.js";import"../chunks/legacy.CT0A0X_A.js";import{e as ae,f as te,k as e,o as s,r as a,n as re,t as U,q as u}from"../chunks/runtime.BhkHmGnc.js";import{d as se,a as c,t as b,c as ie,s as I}from"../chunks/render.BQ4Vc4Ij.js";import{i as oe}from"../chunks/if.zEQZhpIz.js";import{e as de,i as ne}from"../chunks/each.CMEkCpSi.js";import{i as le}from"../chunks/lifecycle.DzPzqbVW.js";import{s as ce,a as g}from"../chunks/props.BwEu9BMa.js";import{e as me,j as fe,k as ve,l as ge}from"../chunks/queryClient.C8IPkV7D.js";import{d as j,z as p,t as n}from"../chunks/toast.BILRVjIN.js";import{B as ue}from"../chunks/BasePage.CnamnGhH.js";import{I as pe}from"../chunks/IconDeviceAirtag.CSJR9HFD.js";import{S as be}from"../chunks/Scrollable.Dihwx7Il.js";import{f as Te}from"../chunks/formatDistanceToNow.DXTjigy3.js";const ye=(T,l,t)=>{j.open({header:"Add RFID Tag",fields:[{label:"Friendly Name",name:"friendlyName",type:"text",defaultValue:"",validation:p.string().min(1)},{label:"RFID Tag",name:"rfidTag",type:"text",defaultValue:"",validation:p.string().min(1)}],actions:[{label:"Create",key:"create",class:"btn-primary",buttonType:"submit",callback:({fieldValues:m,close:y})=>{l().mutate({friendlyName:m.friendlyName,rfidTag:m.rfidTag},{onError:()=>{n({message:"Error creating RFID Tag",type:"error"})},onSuccess:()=>{n({message:"RFID Tag created",type:"success"}),y()}})}}]})};var _e=(T,l,t)=>l(u(t)),Re=b('<div class="bg-base-200 rounded-lg p-6 shadow-md"><div class="mb-6 flex items-center justify-between"><div class="mb-6 flex items-center gap-4"><!> <div><h3 class="text-xl font-semibold"> </h3> <p class="text-sm text-gray-500"> </p></div></div> <button class="btn btn-ghost btn-sm">Edit</button></div> <table class="bg-base-300 table w-full overflow-hidden rounded-lg"><tbody><tr><td class="w-60 font-medium">Created</td><td> </td></tr></tbody></table></div>'),xe=b('<div class="bg-base-200 rounded-lg p-8 text-center"><p class="text-base-content">Loading RFID Tags...</p></div>'),De=b('<div class="space-y-6"><!></div>'),he=b('<div class="container mx-auto px-4"><div class="mb-6 flex items-center justify-between"><h1 class="text-2xl font-bold">RFID Tags</h1> <button class="btn btn-primary">Add RFID Tag</button></div> <!></div>');function Be(T,l){ae(l,!1);const t=ce(),m=()=>g(k,"$mutationRfidTagCreate",t),y=()=>g(V,"$mutationRfidTagUpdate",t),M=()=>g(B,"$mutationRfidTagDelete",t),$=()=>g(P,"$queryRfidTags",t),P=me(1e4),k=fe(),B=ve(),V=ge(),z=i=>{j.open({header:"Edit RFID Tag",fields:[{label:"Friendly Name",name:"friendlyName",type:"text",defaultValue:i.friendlyName,validation:p.string().min(1)},{label:"RFID Tag",name:"rfidTag",type:"text",defaultValue:i.rfidTag,validation:p.string().min(1)}],actions:[{label:"Save",key:"save",class:"btn-primary",buttonType:"submit",callback:({fieldValues:r,close:o})=>{y().mutate({id:i.id,friendlyName:r.friendlyName,rfidTag:r.rfidTag},{onError:()=>{n({message:"Error saving RFID Tag",type:"error"})},onSuccess:()=>{n({message:"RFID Tag saved",type:"success"}),o()}}),o()}},{label:"Cancel",key:"cancel",class:"btn-outline",callback:({close:r})=>r()},{label:"Delete",key:"delete",class:"btn-error btn-outline",buttonType:"button",callback:({close:r})=>{M().mutate({id:i.id},{onError:()=>{n({message:"Error deleting RFID Tag",type:"error"})},onSuccess:()=>{n({message:"RFID Tag deleted",type:"success"}),r()}})}}]})};le(),ue(T,{title:"RFID Tags",children:(i,r)=>{var o=he(),_=e(o),H=s(e(_),2);H.__click=[ye,m,k],a(_);var L=s(_,2);be(L,{class:"p-4",maxHeight:"80svh",children:(Q,Fe)=>{var R=De(),G=e(R);{var J=d=>{var f=ie(),O=re(f);de(O,1,()=>$().data,ne,(W,v)=>{var x=Re(),D=e(x),h=e(D),w=e(h);pe(w,{class:"text-primary h-10 w-10"});var N=s(w,2),F=e(N),X=e(F,!0);a(F);var C=s(F,2),Y=e(C);a(C),a(N),a(h);var Z=s(h,2);Z.__click=[_e,z,v],a(D);var E=s(D,2),S=e(E),q=e(S),A=s(e(q)),ee=e(A,!0);U(()=>I(ee,Te(new Date(u(v).createdAt),{addSuffix:!0}))),a(A),a(q),a(S),a(E),a(x),U(()=>{I(X,u(v).friendlyName),I(Y,`RFID: ${u(v).rfidTag??""}`)}),c(W,x)}),c(d,f)},K=d=>{var f=xe();c(d,f)};oe(G,d=>{$().data?d(J):d(K,!1)})}a(R),c(Q,R)},$$slots:{default:!0}}),a(o),c(i,o)},$$slots:{default:!0}}),te()}se(["click"]);export{Be as component};