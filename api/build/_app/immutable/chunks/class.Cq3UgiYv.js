import{b as n,E as _,c as f,a5 as u,O as p,h as l,d as v}from"./runtime.BtD-H5di.js";function b(s,e,...t){var c=s,a=u,i;n(()=>{a!==(a=e())&&(i&&(p(i),i=null),i=f(()=>a(c,...t)))},_),l&&(c=v)}function A(s,e,t){var c=s.__className,a=r(e,t);l&&s.getAttribute("class")===a?s.__className=a:(c!==a||l&&s.getAttribute("class")!==a)&&(a===""?s.removeAttribute("class"):s.setAttribute("class",a),s.__className=a)}function g(s,e,t){var c=s.__className,a=r(e,t);l&&s.className===a?s.__className=a:(c!==a||l&&s.className!==a)&&(e==null&&!t?s.removeAttribute("class"):s.className=a,s.__className=a)}function r(s,e){return(s??"")+(e?" "+e:"")}function o(s,e,t){if(t){if(s.classList.contains(e))return;s.classList.add(e)}else{if(!s.classList.contains(e))return;s.classList.remove(e)}}export{b as a,g as b,A as s,o as t};