import"../chunks/disclose-version.Bg9kRutz.js";import{p as C,d as D,a as E,s as c,f as d,g as p,h as $,i as F,j as m,t as G,k as u}from"../chunks/runtime.DvGnrOxf.js";import{d as J,a as n,t as v,b as K}from"../chunks/render.CP-ZJxph.js";import{i as M}from"../chunks/if.BktC0TgM.js";import{c as N,a as O,r as I}from"../chunks/queryClient.DOObSZT0.js";import{b as R,a as T}from"../chunks/input.Dpw84tVH.js";import{s as V,p as q,a as w}from"../chunks/props.CmCJi6lp.js";import{B as W}from"../chunks/BasePage.C0WGob7w.js";function X(k,g,f,e,a){g().mutate({heartbeatInterval:u(e),systemMaintenance:u(a)})}var Y=v('<p class="text-center">Loading settings...</p>'),Z=v('<span class="loading loading-spinner"></span>'),tt=v('<div class="form-control"><label class="mb-2 block text-sm font-medium">Heartbeat Interval (seconds)</label> <input type="number" class="input input-bordered w-full" placeholder="300"></div> <div class="form-control"><label class="mb-2 block text-sm font-medium">System Maintenance</label> <input type="checkbox" class="toggle toggle-primary"></div> <button class="btn btn-primary w-full"><!></button>',1),at=v('<div class="max-w-xl space-y-6 p-4"><!></div>');function pt(k,g){C(g,!0);const f=V(),e=()=>w(B,"$querySettings",f),a=()=>w(P,"$mutationSettings",f),B=N(),P=O();let i=$(300),r=$(!1);D(()=>{e().data&&(c(i,q(e().data.heartbeatInterval||300)),c(r,q(!!e().data.systemMaintenance)))}),W(k,{title:"Administration",children:(j,et)=>{var b=at(),A=d(b);{var H=s=>{var o=Y();n(s,o)},L=s=>{var o=tt(),_=F(o),y=m(d(_),2);I(y),p(_);var S=m(_,2),h=m(d(S),2);I(h),p(S);var l=m(S,2);l.__click=[X,a,P,i,r];var Q=d(l);{var U=t=>{var x=Z();n(t,x)},z=t=>{var x=K("Update Settings");n(t,x)};M(Q,t=>{a().isPending?t(U):t(z,!1)})}p(l),G(()=>{y.disabled=a().isPending,h.disabled=a().isPending,l.disabled=a().isPending}),R(y,()=>u(i),t=>c(i,t)),T(h,()=>u(r),t=>c(r,t)),n(s,o)};M(A,s=>{e().isPending?s(H):s(L,!1)})}p(b),n(j,b)},$$slots:{default:!0}}),E()}J(["click"]);export{pt as component};