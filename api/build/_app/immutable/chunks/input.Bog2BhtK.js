import{q as k,h as n,j as s,v as u}from"./runtime.BtD-H5di.js";import{l as h}from"./render.CEt87p24.js";function t(e,a,v=a){var c=k();h(e,"input",l=>{var r=l?e.defaultValue:e.value;if(r=f(e)?d(r):r,v(r),c&&r!==(r=a())){var _=e.selectionStart,o=e.selectionEnd;e.value=r??"",o!==null&&(e.selectionStart=_,e.selectionEnd=Math.min(o,e.value.length))}}),(n&&e.defaultValue!==e.value||s(a)==null&&e.value)&&v(f(e)?d(e.value):e.value),u(()=>{var l=a();f(e)&&l===d(e.value)||e.type==="date"&&!l&&!e.value||l!==e.value&&(e.value=l??"")})}function y(e,a,v=a){h(e,"change",c=>{var l=c?e.defaultChecked:e.checked;v(l)}),(n&&e.defaultChecked!==e.checked||s(a)==null)&&v(e.checked),u(()=>{var c=a();e.checked=!!c})}function f(e){var a=e.type;return a==="number"||a==="range"}function d(e){return e===""?null:+e}export{y as a,t as b};