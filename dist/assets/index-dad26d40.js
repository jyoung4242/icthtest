(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();class C{constructor(){this.state="created",this.bindings=[],this.views=[],this.animations=[],this.animationQueue=[],this.destroyed="",this.moved=""}static create(e,t,r={},i={parent:null,prepare:!0,sibling:null}){const n=new C;if(n.model=r,n.element=t,n.parent=i.parent??s,t instanceof HTMLTemplateElement){const a=t.content.cloneNode(!0);if(a.children.length===1)return s.create(e,a.firstElementChild,r,i);n.views=[...a.children].map(m=>s.create(e,m,r,{...i,parent:n})),n.state="rendered"}else n.bindings.push(...s.parse(n.element,r,n,i.parent));return n.parentElement=e,n.sibling=i.sibling,n.attached=new Promise(a=>{n.attachResolve=a}),n}destroy(){this.views.forEach(e=>e.destroy()),this.element.classList.add("pui-removing"),this.destroyed="queue",s.destroyed.push(this)}terminate(){Promise.all(this.getAnimations()).then(()=>{var t;(t=this.element.parentElement)==null||t.removeChild(this.element),this.bindings.forEach(r=>r.unbind());const e=this.parent.views.findIndex(r=>r===this);e>-1&&this.parent.views.splice(e,1)}),this.destroyed="destroyed"}move(e){this.moved="queue",this.element.classList.add("pui-moving"),this.sibling=e}play(e,t){return typeof e=="string"&&(e=this.animations.find(r=>r.name===e).clone()),e.element=t,e.state="pending",this.animationQueue.push(e),this.updateAnimations(performance.now()),e}updateFromUI(){this.views.forEach(e=>e.updateFromUI()),this.bindings.forEach(e=>e.updateFromUI())}updateToUI(){var e;switch(this.views.forEach(t=>t.updateToUI()),this.bindings.forEach(t=>t.updateToUI()),this.state){case"created":this.element.classList.add("pui-adding"),this.element.hasAttribute("PUI-UNRENDERED")||(this.parentElement??s.parentElement(this.element,this.parent)).insertBefore(this.element,((e=this.sibling)==null?void 0:e.nextSibling)??null),this.attachResolve(),this.state="attaching";break;case"attaching":this.getAnimations(!1).length===0&&(this.element.classList.remove("pui-adding"),this.state="attached");break;case"attached":this.state="rendered";break}}updateAtEvents(){this.views.forEach(e=>e.updateAtEvents()),this.bindings.forEach(e=>e.updateAtEvents())}updateAnimations(e){var t;for(;((t=this.animationQueue[0])==null?void 0:t.state)==="finished";)this.animationQueue.shift().destroy();for(let r=0;r<this.animationQueue.length;r++){const i=this.animationQueue[r];i.state==="pending"&&(i.isBlocked(e)||(i.state="playing",i.startTime=e,i.animation=i.element.animate(i.keyframes,i.options),i.finished=i.animation.finished,i.finished.then(()=>{i.state="finished",this.updateAnimations(performance.now())})))}}updateMove(){switch(this.moved){case"queue":this.moved="move";break;case"move":this.getAnimations().length===0&&(s.parentElement(this.element,this.parent).insertBefore(this.element,this.sibling.nextSibling),this.element.classList.remove("pui-moving"),this.moved="",this.sibling=null);break}this.bindings.forEach(e=>e.updateMove())}getAnimations(e=!0){return this.element.getAnimations({subtree:e}).filter(t=>{var r;return t.playState!=="finished"&&((r=t.effect)==null?void 0:r.getTiming().iterations)!==1/0}).map(t=>t.finished)}}class N{constructor(){this.fromUI=!1,this.toUI=!0,this.atEvent=!1,this.oneTime=!1,this.views=[],this.firstUpdate=!0,this.events=[],this.triggerAtEvent=e=>{e.type==="change"?this.events.push(e):s.resolveValue(this.object,this.property)(e,this.object.$model,this.element,this.attribute,this.object)},this.id=++s.id}get element(){return this.$element==null&&(this.$element=typeof this.selector=="string"?this.context.querySelector(this.selector):this.selector),this.$element}set element(e){this.$element=e}static create(e){var n;const t=new N,r=((n=e.property)==null?void 0:n.split(":"))??[],i=r.shift();return t.object="$model"in e.object?e.object:{$model:e.object},t.property=i,t.arguments=r,t.context=e.context??document,t.selector=e.selector,t.attribute=e.attribute??"innerText",t.value=e.value??t.value,t.template=e.template??t.template,t.fromUI=e.fromUI??t.fromUI,t.toUI=e.toUI??t.toUI,t.atEvent=e.atEvent??t.atEvent,t.oneTime=e.oneTime??t.oneTime,t.parent=e.parent??s,t.addListener(),typeof t.fromUI!="boolean"&&(t.fromUI=t.fromUI.bind(t)),typeof t.toUI!="boolean"&&(t.toUI=t.toUI.bind(t)),t}destroy(){this.element=null,this.removeListener(),this.views.forEach(e=>e.destroy())}unbind(){s.unbind(this)}addListener(){this.atEvent&&(this.toUI=!1,this.fromUI=!1,this.element.addEventListener(this.attribute,this.triggerAtEvent))}removeListener(){this.atEvent&&this.element.removeEventListener(this.attribute,this.triggerAtEvent)}updateFromUI(){if(this.fromUI===!1||this.firstUpdate){this.firstUpdate=!1,this.views.forEach(i=>i.updateFromUI());return}const{target:e,property:t}=s.resolveProperty(this.element,this.attribute),r=e[t];if(r!==this.lastUIValue){let i=this.fromUI!==!0?this.fromUI(r,this.lastUIValue,this.property,this.object):r;if(this.lastUIValue=r,i!==void 0&&i!==this.lastValue){this.lastValue=i;const{target:n,property:a}=s.resolveProperty(this.object,this.property);s.resolveValue(this.object,this.property)==="number"&&!isNaN(i)&&(i=+i),n[a]=i}else this.lastValue=i}this.views.forEach(i=>i.updateFromUI())}updateToUI(){if(this.toUI===!1){this.views.forEach(t=>t.updateToUI());return}let e=s.resolveValue(this.object,this.property);if(this.template!=null){if(this.template instanceof HTMLElement)if(typeof this.attribute=="boolean"){if(e=(e??!1)!==!1,e!==this.lastValue){const t=this.toUI!==!0?this.toUI(e,this.lastValue,this.property,this.object,this.value):e;if(t!==void 0&&t!==this.lastUIValue){if(t===this.attribute)this.views.push(C.create(this.element.parentElement,this.template.cloneNode(!0),this.object,{parent:this,prepare:!1,sibling:this.element}));else{const r=this.views.pop();r==null||r.destroy()}this.lastValue=e,this.lastUIValue=t}}}else{let t=!1,r=!1;e==null&&(e=[]);const i=this.arguments[0],n=this.lastValue??[];if(e.length!==n.length)t=!0;else for(let l=0,w=e.length;l<w;l++){let f,c;i==null?e[l]!==n[l]&&(t=!0,r=!0):(f=s.resolveValue(e[l]??{},i),c=s.resolveValue(n[l]??{},i),f!==c&&(t=!0),e[l]!==n[l]&&(r=!0))}if(!t)if(r){const l=this.toUI!==!0?this.toUI(e,n,this.property,this.object,this.value):e;return this.updateViews(e,l)}else return this.updateViews();const a=this.toUI!==!0?this.toUI(e,n,this.property,this.object,this.value):e;if(a==null)return this.updateViews();const m=this.lastUIValue??[];let b=0;for(let l=0,w=a.length,f=0;l<w;l++,f++){let c,p;if(i==null?(c=a[l],p=m[f]):(c=s.resolveValue(a[l]??{},i),p=s.resolveValue(m[f]??{},i)),c===p)b++;else break}if(b===a.length&&a.length===m.length)return this.updateViews(e,a);const h=this.views.splice(0,b);let o=h[h.length-1];for(let l=b,w=a.length,f=b;l<w;l++,f++){const c=a[l],p=this.views.shift();if(p==null){const g={$model:{[this.attribute]:c},$parent:this.object},y=C.create(this.element.parentElement,this.template.cloneNode(!0),g,{parent:this,prepare:!1,sibling:(o==null?void 0:o.element)??this.element});h.push(y),o=y;continue}const v=i==null?c:s.resolveValue(c??{},i),u=p==null?void 0:p.model.$model[this.attribute],V=i==null?u:s.resolveValue(u??{},i);if(v===V){h.push(p),p.move((o==null?void 0:o.element)??this.element),o=p;continue}if(!a.slice(l).map(g=>i==null?g:s.resolveValue(g??{},i)).includes(V)){p.destroy(),l--,o=p;continue}this.views.unshift(p);let E=!1;for(let g=0,y=this.views.length;g<y;g++){const A=this.views[g],d=A==null?void 0:A.model.$model[this.attribute],x=i==null?d:s.resolveValue(d??{},i);if(v===x){h.push(...this.views.splice(g,1)),A.move((o==null?void 0:o.element)??this.element),E=!0,o=A;break}}if(!E){const g={$model:{[this.attribute]:c},$parent:this.object},y=C.create(this.element.parentElement,this.template.cloneNode(!0),g,{parent:this,prepare:!1,sibling:(o==null?void 0:o.element)??this.element});h.push(y),o=y}}return this.views.forEach(l=>l.destroy()),this.views=h,this.updateViews(e,a)}else if(this.value==null){const t=s.resolveValue(this.object,this.attribute),r=t.template,i=e==null?t:t.create(e);this.value=e??t,this.views.push(s.create(this.element.parentElement,r,i,{parent:this,prepare:!0,sibling:this.element}))}}else if(e!==this.lastValue){const t=this.toUI!==!0?this.toUI(e,this.lastValue,this.property,this.object,this.value):e;if(t!==void 0&&t!==this.lastUIValue){const{target:r,property:i}=s.resolveProperty(this.element,this.attribute);r[i]=t,this.lastValue=e,this.lastUIValue=t}}this.updateViews()}updateAtEvents(){let e=this.events.shift();for(;e!=null;)s.resolveValue(this.object,this.property)(e,this.object.$model,this.element,this.attribute,this.object),e=this.events.shift();this.views.forEach(t=>t.updateAtEvents())}updateMove(){this.views.forEach(e=>e.updateMove())}updateViews(e,t){e==null?this.views.forEach(r=>r.updateToUI()):(this.views.forEach((r,i)=>{const n=t[i];typeof n!="string"&&(n.$index=i),r.model.$model[this.attribute]=n,r.updateToUI()}),this.lastValue=[...e],this.lastUIValue=[...t]),this.oneTime&&(this.toUI=!1,this.fromUI=!1)}}class s{static initialize(e=!0){if(s.initialized=!0,e!==!1){if(e===!0){const t=()=>{s.update(),requestAnimationFrame(t)};requestAnimationFrame(t);return}setInterval(()=>s.update(),1e3/e)}}static create(e,t,r={},i={parent:null,prepare:!0,sibling:null}){if(typeof t=="string"){const a=(e==null?void 0:e.ownerDocument)??document;if(t.startsWith("#"))t=a.querySelector(t);else{const m=a.createElement("template");m.innerHTML=i.prepare?s.prepare(t):t,t=m}}const n=C.create(e,t,r,i);return n.parent===s&&s.views.push(n),s.initialized||s.initialize(),n}static play(e,t){return typeof e=="string"?(e=this.globals.animations.find(r=>r.name===e).clone(),e.play(t)):e.play()}static queue(e){this.t.push(e)}static parse(e,t,r,i){const n=[];if(e.nodeType===3){let a=e.textContent,m=a.match(s.regexValue);for(;m!=null;){const b=m[1];let h=m[2];a=m[3];let o=!1;h.startsWith("|")&&(o=!0,h=h.slice(1).trimStart());const l=h.match(s.regexConditionalValue);let w,f=!0;l&&(h=l[3],w=`${l[2]}${l[1]}`,f=function(p,v,u,V,E){const g=E[0]==="=";return E=E.slice(2,-1),!!p===g?E:""});let c=e.cloneNode();e.textContent=b,s.parentElement(e,i).insertBefore(c,e.nextSibling),n.push(s.bind({selector:c,attribute:"textContent",object:t,property:h,parent:r,oneTime:o,value:w,toUI:f})),e=c,c=e.cloneNode(),c.textContent=a,s.parentElement(e,i).insertBefore(c,e.nextSibling),e=c,m=a.match(s.regexValue)}}else{const a=e.getAttribute("pui")??"";if(a.trim().length>0){const m=a.split(";");for(let b of m)b=b.trim(),b.length>0&&e.setAttribute(`pui.${s.bindingCounter++}`,b)}if(e.removeAttribute("pui"),n.push(...Object.keys(e.attributes??[]).reverse().map(m=>{const b=[];if(e instanceof Comment)return[];const h=e.attributes[m];if(h.name.startsWith("pui.")){const f=h.value.match(s.regexAttribute);let[c,p,v,u,V]=f,E,g,y=!1;if(v!=="@"){const A=p.match(/^'(.*?)'$/);if(A!=null)E=A[1],e.setAttribute("value",E),p=e.nodeName.toLowerCase()==="option"?"selected":"checked",u=d=>d?E:void 0,v=d=>d===E;else if(p==="")if(u===">"){const{target:d,property:x}=s.resolveProperty(t,V);return d[x]=e,[]}else{const d=document.createComment(h.name);s.parentNode(e,i).insertBefore(d,e),s.parentNode(e,i).removeChild(e),e.removeAttribute(h.name),g=e,e=d,p=v==="=",v=!0,u==="|"&&(y=!0)}else if(u==="="&&v==="="){const d=s.parentNode(e,i);if(d.nodeType!==8){const x=document.createComment(h.name);d.insertBefore(x,e),d.removeChild(e),e.removeAttribute(h.name),e=x}else e=d;g=p,y=!0,v=!0}else if(u==="*"){const d=document.createComment(h.name);s.parentNode(e,i).insertBefore(d,e),s.parentNode(e,i).removeChild(e),e.removeAttribute(h.name),g=e,e=d}else u==="|"?y=!0:p!=="checked"&&e.setAttribute(p,"")}return[s.bind({selector:e,attribute:p,value:E,object:t,property:V,template:g,toUI:typeof v=="string"?v==="<":v,fromUI:typeof u=="string"?u===">":u,atEvent:v==="@",parent:r,oneTime:y})]}const o=[h.value];let l=0,w=o[l].match(s.regexValue);for(;w!=null;){let{before:f,property:c,after:p}=w.groups,v=!1;c.startsWith("|")&&(v=!0,c=c.slice(1).trimStart());const u=c.match(s.regexConditionalValue);let V;u&&(c=u[3],V=`${u[2]}${u[1]}`),b.push(s.bind({selector:e,attribute:h.name,object:t,property:c,oneTime:v,toUI(E,g,y,A,d){if(this.oneTime){const $=o.indexOf(y);$>-1&&(o[$]=s.resolveValue(A,y),o[$-1]+=o[$]+o[$+1],o.splice($,2))}const x=o.map(($,T)=>{if(T%2===0)return $;const j=$.match(s.regexSplitConditionalValue);if(j){const U=$===`${y}${d}`?E:s.resolveValue(A,j[1]),I=j[2]==="=";return!!U===I?j[3].slice(1,-1):""}return $===y?E:s.resolveValue(A,$)}).join("");return e.setAttribute(h.name,x),x},parent:r,value:V})),o[l++]=f,o[l++]=`${c}${V??""}`,o[l]=p,w=o[l].match(s.regexValue)}return b}).flat()),e instanceof Comment)return n.filter(m=>m.template!=null?!0:(m.unbind(),!1));if(!s.leaveAttributes)for(let m=Object.keys(e.attributes??[]).length-1;m>=0;m--){const b=e.attributes[Object.keys(e.attributes??[])[m]];b.name.startsWith("pui.")&&e.removeAttribute(b.name)}n.push(...Array.from(e.childNodes).map(m=>s.parse(m,t,r,i)).flat())}return n}static bind(e){return N.create(e)}static unbind(e){if(e.destroy(),e.parent!==s){const t=e.parent.bindings,r=t.indexOf(e);r>-1&&t.splice(r,1)}}static update(){this.i.forEach(t=>t()),this.i=this.t,this.t=[],this.views.forEach(t=>t.updateFromUI()),this.views.forEach(t=>t.updateToUI()),this.views.forEach(t=>t.updateAtEvents());const e=performance.now();[...this.views,this.globals].forEach(t=>t.updateAnimations(e)),this.views.forEach(t=>{t.updateMove()}),this.destroyed.forEach(t=>{switch(t.destroyed){case"queue":t.state==="rendered"?t.destroyed="destroy":t.updateToUI();break;case"destroy":{t.terminate();const r=this.destroyed.findIndex(i=>t===i);r>-1&&this.destroyed.splice(r,1)}}})}static resolveProperty(e,t){t=t.replace("[",".").replace("]",".");const r=t.split(".").filter(n=>(n??"").length>0);for(;r[0]==="$parent"&&e.$parent!=null;)e=e.$parent,r.shift();let i="$model"in e?e.$model:e;for(;r.length>1;)i=i[r.shift()];return{target:i,property:r[0]}}static resolveValue(e,t){let r=0;do{const{target:i,property:n}=s.resolveProperty(e,t);if(i!=null&&n in i)return i[n];e=e.$parent}while(e!=null&&r++<1e3)}static parentElement(e,t){const r=e.parentElement;if(r!=null)return r;for(;t!=null&&(t.element==null||t.element===e);)t=t.parent;return t==null?void 0:t.element}static parentNode(e,t){const r=e.parentNode;if(r!=null)return r;for(;t!=null&&(t.element==null||t.element===e);)t=t.parent;return t==null?void 0:t.element}static prepare(e){let t=e;e="";let r=t.match(s.regexReplace);for(;r!=null;){const[i,n,a,m]=r;a.match(/\S\s*===/)?e+=`${n.trimEnd()}br PUI-UNRENDERED PUI.${s.bindingCounter++}="${a}"`:e+=`${n} PUI.${s.bindingCounter++}="${a}" `,t=m,r=t.match(s.regexReplace)}return e+=t,e}static parseAttribute(e,t,r,i,n,a){const m=a.match(s.regexAttribute);let[b,h,o,l,w]=m,f,c,p=!1;if(o!=="@"){const v=h.match(/^'(.*?)'$/);if(v!=null)f=v[1],e.setAttribute("value",f),h=e.nodeName.toLowerCase()==="option"?"selected":"checked",l=u=>u?f:void 0,o=u=>u===f;else if(h==="")if(l===">"){const{target:u,property:V}=s.resolveProperty(t,w);return u[V]=e,[]}else{const u=document.createComment(n);s.parentNode(e,i).insertBefore(u,e),s.parentNode(e,i).removeChild(e),e.removeAttribute(n),c=e,e=u,h=o==="=",o=!0,l==="|"&&(p=!0)}else if(l==="="&&o==="="){const u=s.parentNode(e,i);if(u.nodeType!==8){const V=document.createComment(n);u.insertBefore(V,e),u.removeChild(e),e.removeAttribute(n),e=V}else e=u;c=h,p=!0,o=!0}else if(l==="*"){const u=document.createComment(n);s.parentNode(e,i).insertBefore(u,e),s.parentNode(e,i).removeChild(e),e.removeAttribute(n),c=e,e=u}else l==="|"?p=!0:h!=="checked"&&e.setAttribute(h,"")}return[s.bind({selector:e,attribute:h,value:f,object:t,property:w,template:c,toUI:typeof o=="string"?o==="<":o,fromUI:typeof l=="string"?l===">":l,atEvent:o==="@",parent:r,oneTime:p})]}}s.initialized=!1;s.id=0;s.views=[];s.destroyed=[];s.globals=new C;s.leaveAttributes=!1;s.regexReplace=/([\S\s]*?)\\?\$\{([^}]*?[<=@!]=[*=>|][^}]*?)\}([\S\s]*)/m;s.regexAttribute=/^\s*(\S*?)\s*([<=@!])=([*=>|])\s*(\S*?)\s*$/;s.regexValue=/(?<before>[\S\s]*?)\\?\$\{\s*(?<property>[\s\S]*?)\s*\}(?<after>[\S\s]*)/m;s.regexConditionalValue=/^\s*(.+?)\s*([=!])\s*(\S+)/;s.regexSplitConditionalValue=/^(.+?)([=!])(.*)/;s.bindingCounter=0;s.i=[];s.t=[];const L={},S="<div> Hello Peasy!!! </div>";s.create(document.body,S,L);console.log("Hello World");
