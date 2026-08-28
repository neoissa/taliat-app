(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function $y(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var ud={exports:{}},Oa={},cd={exports:{}},Ce={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rg;function PE(){if(rg)return Ce;rg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),T=Symbol.iterator;function A(V){return V===null||typeof V!="object"?null:(V=T&&V[T]||V["@@iterator"],typeof V=="function"?V:null)}var F={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$=Object.assign,G={};function B(V,W,he){this.props=V,this.context=W,this.refs=G,this.updater=he||F}B.prototype.isReactComponent={},B.prototype.setState=function(V,W){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,W,"setState")},B.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function fe(){}fe.prototype=B.prototype;function ce(V,W,he){this.props=V,this.context=W,this.refs=G,this.updater=he||F}var pe=ce.prototype=new fe;pe.constructor=ce,$(pe,B.prototype),pe.isPureReactComponent=!0;var J=Array.isArray,Ee=Object.prototype.hasOwnProperty,ue={current:null},k={key:!0,ref:!0,__self:!0,__source:!0};function I(V,W,he){var Se,Re={},De=null,Me=null;if(W!=null)for(Se in W.ref!==void 0&&(Me=W.ref),W.key!==void 0&&(De=""+W.key),W)Ee.call(W,Se)&&!k.hasOwnProperty(Se)&&(Re[Se]=W[Se]);var Fe=arguments.length-2;if(Fe===1)Re.children=he;else if(1<Fe){for(var $e=Array(Fe),_t=0;_t<Fe;_t++)$e[_t]=arguments[_t+2];Re.children=$e}if(V&&V.defaultProps)for(Se in Fe=V.defaultProps,Fe)Re[Se]===void 0&&(Re[Se]=Fe[Se]);return{$$typeof:r,type:V,key:De,ref:Me,props:Re,_owner:ue.current}}function C(V,W){return{$$typeof:r,type:V.type,key:W,ref:V.ref,props:V.props,_owner:V._owner}}function x(V){return typeof V=="object"&&V!==null&&V.$$typeof===r}function D(V){var W={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(he){return W[he]})}var O=/\/+/g;function R(V,W){return typeof V=="object"&&V!==null&&V.key!=null?D(""+V.key):W.toString(36)}function rt(V,W,he,Se,Re){var De=typeof V;(De==="undefined"||De==="boolean")&&(V=null);var Me=!1;if(V===null)Me=!0;else switch(De){case"string":case"number":Me=!0;break;case"object":switch(V.$$typeof){case r:case e:Me=!0}}if(Me)return Me=V,Re=Re(Me),V=Se===""?"."+R(Me,0):Se,J(Re)?(he="",V!=null&&(he=V.replace(O,"$&/")+"/"),rt(Re,W,he,"",function(_t){return _t})):Re!=null&&(x(Re)&&(Re=C(Re,he+(!Re.key||Me&&Me.key===Re.key?"":(""+Re.key).replace(O,"$&/")+"/")+V)),W.push(Re)),1;if(Me=0,Se=Se===""?".":Se+":",J(V))for(var Fe=0;Fe<V.length;Fe++){De=V[Fe];var $e=Se+R(De,Fe);Me+=rt(De,W,he,$e,Re)}else if($e=A(V),typeof $e=="function")for(V=$e.call(V),Fe=0;!(De=V.next()).done;)De=De.value,$e=Se+R(De,Fe++),Me+=rt(De,W,he,$e,Re);else if(De==="object")throw W=String(V),Error("Objects are not valid as a React child (found: "+(W==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":W)+"). If you meant to render a collection of children, use an array instead.");return Me}function Dt(V,W,he){if(V==null)return V;var Se=[],Re=0;return rt(V,Se,"","",function(De){return W.call(he,De,Re++)}),Se}function Vt(V){if(V._status===-1){var W=V._result;W=W(),W.then(function(he){(V._status===0||V._status===-1)&&(V._status=1,V._result=he)},function(he){(V._status===0||V._status===-1)&&(V._status=2,V._result=he)}),V._status===-1&&(V._status=0,V._result=W)}if(V._status===1)return V._result.default;throw V._result}var ze={current:null},ee={transition:null},me={ReactCurrentDispatcher:ze,ReactCurrentBatchConfig:ee,ReactCurrentOwner:ue};function ie(){throw Error("act(...) is not supported in production builds of React.")}return Ce.Children={map:Dt,forEach:function(V,W,he){Dt(V,function(){W.apply(this,arguments)},he)},count:function(V){var W=0;return Dt(V,function(){W++}),W},toArray:function(V){return Dt(V,function(W){return W})||[]},only:function(V){if(!x(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},Ce.Component=B,Ce.Fragment=t,Ce.Profiler=o,Ce.PureComponent=ce,Ce.StrictMode=s,Ce.Suspense=g,Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=me,Ce.act=ie,Ce.cloneElement=function(V,W,he){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var Se=$({},V.props),Re=V.key,De=V.ref,Me=V._owner;if(W!=null){if(W.ref!==void 0&&(De=W.ref,Me=ue.current),W.key!==void 0&&(Re=""+W.key),V.type&&V.type.defaultProps)var Fe=V.type.defaultProps;for($e in W)Ee.call(W,$e)&&!k.hasOwnProperty($e)&&(Se[$e]=W[$e]===void 0&&Fe!==void 0?Fe[$e]:W[$e])}var $e=arguments.length-2;if($e===1)Se.children=he;else if(1<$e){Fe=Array($e);for(var _t=0;_t<$e;_t++)Fe[_t]=arguments[_t+2];Se.children=Fe}return{$$typeof:r,type:V.type,key:Re,ref:De,props:Se,_owner:Me}},Ce.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:l,_context:V},V.Consumer=V},Ce.createElement=I,Ce.createFactory=function(V){var W=I.bind(null,V);return W.type=V,W},Ce.createRef=function(){return{current:null}},Ce.forwardRef=function(V){return{$$typeof:p,render:V}},Ce.isValidElement=x,Ce.lazy=function(V){return{$$typeof:w,_payload:{_status:-1,_result:V},_init:Vt}},Ce.memo=function(V,W){return{$$typeof:_,type:V,compare:W===void 0?null:W}},Ce.startTransition=function(V){var W=ee.transition;ee.transition={};try{V()}finally{ee.transition=W}},Ce.unstable_act=ie,Ce.useCallback=function(V,W){return ze.current.useCallback(V,W)},Ce.useContext=function(V){return ze.current.useContext(V)},Ce.useDebugValue=function(){},Ce.useDeferredValue=function(V){return ze.current.useDeferredValue(V)},Ce.useEffect=function(V,W){return ze.current.useEffect(V,W)},Ce.useId=function(){return ze.current.useId()},Ce.useImperativeHandle=function(V,W,he){return ze.current.useImperativeHandle(V,W,he)},Ce.useInsertionEffect=function(V,W){return ze.current.useInsertionEffect(V,W)},Ce.useLayoutEffect=function(V,W){return ze.current.useLayoutEffect(V,W)},Ce.useMemo=function(V,W){return ze.current.useMemo(V,W)},Ce.useReducer=function(V,W,he){return ze.current.useReducer(V,W,he)},Ce.useRef=function(V){return ze.current.useRef(V)},Ce.useState=function(V){return ze.current.useState(V)},Ce.useSyncExternalStore=function(V,W,he){return ze.current.useSyncExternalStore(V,W,he)},Ce.useTransition=function(){return ze.current.useTransition()},Ce.version="18.3.1",Ce}var ig;function Jd(){return ig||(ig=1,cd.exports=PE()),cd.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sg;function kE(){if(sg)return Oa;sg=1;var r=Jd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(p,g,_){var w,T={},A=null,F=null;_!==void 0&&(A=""+_),g.key!==void 0&&(A=""+g.key),g.ref!==void 0&&(F=g.ref);for(w in g)s.call(g,w)&&!l.hasOwnProperty(w)&&(T[w]=g[w]);if(p&&p.defaultProps)for(w in g=p.defaultProps,g)T[w]===void 0&&(T[w]=g[w]);return{$$typeof:e,type:p,key:A,ref:F,props:T,_owner:o.current}}return Oa.Fragment=t,Oa.jsx=h,Oa.jsxs=h,Oa}var og;function xE(){return og||(og=1,ud.exports=kE()),ud.exports}var U=xE(),Pe=Jd();const NE=$y(Pe);var Pu={},hd={exports:{}},Zt={},dd={exports:{}},fd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ag;function DE(){return ag||(ag=1,(function(r){function e(ee,me){var ie=ee.length;ee.push(me);e:for(;0<ie;){var V=ie-1>>>1,W=ee[V];if(0<o(W,me))ee[V]=me,ee[ie]=W,ie=V;else break e}}function t(ee){return ee.length===0?null:ee[0]}function s(ee){if(ee.length===0)return null;var me=ee[0],ie=ee.pop();if(ie!==me){ee[0]=ie;e:for(var V=0,W=ee.length,he=W>>>1;V<he;){var Se=2*(V+1)-1,Re=ee[Se],De=Se+1,Me=ee[De];if(0>o(Re,ie))De<W&&0>o(Me,Re)?(ee[V]=Me,ee[De]=ie,V=De):(ee[V]=Re,ee[Se]=ie,V=Se);else if(De<W&&0>o(Me,ie))ee[V]=Me,ee[De]=ie,V=De;else break e}}return me}function o(ee,me){var ie=ee.sortIndex-me.sortIndex;return ie!==0?ie:ee.id-me.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,p=h.now();r.unstable_now=function(){return h.now()-p}}var g=[],_=[],w=1,T=null,A=3,F=!1,$=!1,G=!1,B=typeof setTimeout=="function"?setTimeout:null,fe=typeof clearTimeout=="function"?clearTimeout:null,ce=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function pe(ee){for(var me=t(_);me!==null;){if(me.callback===null)s(_);else if(me.startTime<=ee)s(_),me.sortIndex=me.expirationTime,e(g,me);else break;me=t(_)}}function J(ee){if(G=!1,pe(ee),!$)if(t(g)!==null)$=!0,Vt(Ee);else{var me=t(_);me!==null&&ze(J,me.startTime-ee)}}function Ee(ee,me){$=!1,G&&(G=!1,fe(I),I=-1),F=!0;var ie=A;try{for(pe(me),T=t(g);T!==null&&(!(T.expirationTime>me)||ee&&!D());){var V=T.callback;if(typeof V=="function"){T.callback=null,A=T.priorityLevel;var W=V(T.expirationTime<=me);me=r.unstable_now(),typeof W=="function"?T.callback=W:T===t(g)&&s(g),pe(me)}else s(g);T=t(g)}if(T!==null)var he=!0;else{var Se=t(_);Se!==null&&ze(J,Se.startTime-me),he=!1}return he}finally{T=null,A=ie,F=!1}}var ue=!1,k=null,I=-1,C=5,x=-1;function D(){return!(r.unstable_now()-x<C)}function O(){if(k!==null){var ee=r.unstable_now();x=ee;var me=!0;try{me=k(!0,ee)}finally{me?R():(ue=!1,k=null)}}else ue=!1}var R;if(typeof ce=="function")R=function(){ce(O)};else if(typeof MessageChannel<"u"){var rt=new MessageChannel,Dt=rt.port2;rt.port1.onmessage=O,R=function(){Dt.postMessage(null)}}else R=function(){B(O,0)};function Vt(ee){k=ee,ue||(ue=!0,R())}function ze(ee,me){I=B(function(){ee(r.unstable_now())},me)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(ee){ee.callback=null},r.unstable_continueExecution=function(){$||F||($=!0,Vt(Ee))},r.unstable_forceFrameRate=function(ee){0>ee||125<ee?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<ee?Math.floor(1e3/ee):5},r.unstable_getCurrentPriorityLevel=function(){return A},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(ee){switch(A){case 1:case 2:case 3:var me=3;break;default:me=A}var ie=A;A=me;try{return ee()}finally{A=ie}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(ee,me){switch(ee){case 1:case 2:case 3:case 4:case 5:break;default:ee=3}var ie=A;A=ee;try{return me()}finally{A=ie}},r.unstable_scheduleCallback=function(ee,me,ie){var V=r.unstable_now();switch(typeof ie=="object"&&ie!==null?(ie=ie.delay,ie=typeof ie=="number"&&0<ie?V+ie:V):ie=V,ee){case 1:var W=-1;break;case 2:W=250;break;case 5:W=1073741823;break;case 4:W=1e4;break;default:W=5e3}return W=ie+W,ee={id:w++,callback:me,priorityLevel:ee,startTime:ie,expirationTime:W,sortIndex:-1},ie>V?(ee.sortIndex=ie,e(_,ee),t(g)===null&&ee===t(_)&&(G?(fe(I),I=-1):G=!0,ze(J,ie-V))):(ee.sortIndex=W,e(g,ee),$||F||($=!0,Vt(Ee))),ee},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(ee){var me=A;return function(){var ie=A;A=me;try{return ee.apply(this,arguments)}finally{A=ie}}}})(fd)),fd}var lg;function VE(){return lg||(lg=1,dd.exports=DE()),dd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ug;function OE(){if(ug)return Zt;ug=1;var r=Jd(),e=VE();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){h(n,i),h(n+"Capture",i)}function h(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var p=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,w={},T={};function A(n){return g.call(T,n)?!0:g.call(w,n)?!1:_.test(n)?T[n]=!0:(w[n]=!0,!1)}function F(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function $(n,i,a,c){if(i===null||typeof i>"u"||F(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function G(n,i,a,c,d,m,v){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=m,this.removeEmptyString=v}var B={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){B[n]=new G(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];B[i]=new G(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){B[n]=new G(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){B[n]=new G(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){B[n]=new G(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){B[n]=new G(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){B[n]=new G(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){B[n]=new G(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){B[n]=new G(n,5,!1,n.toLowerCase(),null,!1,!1)});var fe=/[\-:]([a-z])/g;function ce(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(fe,ce);B[i]=new G(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(fe,ce);B[i]=new G(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(fe,ce);B[i]=new G(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){B[n]=new G(n,1,!1,n.toLowerCase(),null,!1,!1)}),B.xlinkHref=new G("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){B[n]=new G(n,1,!1,n.toLowerCase(),null,!0,!0)});function pe(n,i,a,c){var d=B.hasOwnProperty(i)?B[i]:null;(d!==null?d.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&($(i,a,d,c)&&(a=null),c||d===null?A(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(i=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(i):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var J=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ee=Symbol.for("react.element"),ue=Symbol.for("react.portal"),k=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),x=Symbol.for("react.provider"),D=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),rt=Symbol.for("react.suspense_list"),Dt=Symbol.for("react.memo"),Vt=Symbol.for("react.lazy"),ze=Symbol.for("react.offscreen"),ee=Symbol.iterator;function me(n){return n===null||typeof n!="object"?null:(n=ee&&n[ee]||n["@@iterator"],typeof n=="function"?n:null)}var ie=Object.assign,V;function W(n){if(V===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);V=i&&i[1]||""}return`
`+V+n}var he=!1;function Se(n,i){if(!n||he)return"";he=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(j){var c=j}Reflect.construct(n,[],i)}else{try{i.call()}catch(j){c=j}n.call(i.prototype)}else{try{throw Error()}catch(j){c=j}n()}}catch(j){if(j&&c&&typeof j.stack=="string"){for(var d=j.stack.split(`
`),m=c.stack.split(`
`),v=d.length-1,S=m.length-1;1<=v&&0<=S&&d[v]!==m[S];)S--;for(;1<=v&&0<=S;v--,S--)if(d[v]!==m[S]){if(v!==1||S!==1)do if(v--,S--,0>S||d[v]!==m[S]){var P=`
`+d[v].replace(" at new "," at ");return n.displayName&&P.includes("<anonymous>")&&(P=P.replace("<anonymous>",n.displayName)),P}while(1<=v&&0<=S);break}}}finally{he=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?W(n):""}function Re(n){switch(n.tag){case 5:return W(n.type);case 16:return W("Lazy");case 13:return W("Suspense");case 19:return W("SuspenseList");case 0:case 2:case 15:return n=Se(n.type,!1),n;case 11:return n=Se(n.type.render,!1),n;case 1:return n=Se(n.type,!0),n;default:return""}}function De(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case k:return"Fragment";case ue:return"Portal";case C:return"Profiler";case I:return"StrictMode";case R:return"Suspense";case rt:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case D:return(n.displayName||"Context")+".Consumer";case x:return(n._context.displayName||"Context")+".Provider";case O:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Dt:return i=n.displayName||null,i!==null?i:De(n.type)||"Memo";case Vt:i=n._payload,n=n._init;try{return De(n(i))}catch{}}return null}function Me(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return De(i);case 8:return i===I?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Fe(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function $e(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function _t(n){var i=$e(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,m=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,m.call(this,v)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function ur(n){n._valueTracker||(n._valueTracker=_t(n))}function _s(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=$e(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function Lr(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Ni(n,i){var a=i.checked;return ie({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function vs(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Fe(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function jo(n,i){i=i.checked,i!=null&&pe(n,"checked",i,!1)}function zo(n,i){jo(n,i);var a=Fe(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Es(n,i.type,a):i.hasOwnProperty("defaultValue")&&Es(n,i.type,Fe(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function fl(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function Es(n,i,a){(i!=="number"||Lr(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var cr=Array.isArray;function hr(n,i,a,c){if(n=n.options,i){i={};for(var d=0;d<a.length;d++)i["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=i.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Fe(a),i=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function Bo(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ie({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ws(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(cr(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Fe(a)}}function Ts(n,i){var a=Fe(i.value),c=Fe(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function $o(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function dt(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ft(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?dt(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var dr,qo=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(dr=dr||document.createElement("div"),dr.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=dr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function Mr(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var Di={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Vi=["Webkit","ms","Moz","O"];Object.keys(Di).forEach(function(n){Vi.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),Di[i]=Di[n]})});function Ho(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||Di.hasOwnProperty(n)&&Di[n]?(""+i).trim():i+"px"}function Wo(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=Ho(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Go=ie({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ko(n,i){if(i){if(Go[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function Qo(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Oi=null;function Is(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ss=null,hn=null,qn=null;function As(n){if(n=va(n)){if(typeof Ss!="function")throw Error(t(280));var i=n.stateNode;i&&(i=$l(i),Ss(n.stateNode,n.type,i))}}function Hn(n){hn?qn?qn.push(n):qn=[n]:hn=n}function Yo(){if(hn){var n=hn,i=qn;if(qn=hn=null,As(n),i)for(n=0;n<i.length;n++)As(i[n])}}function bi(n,i){return n(i)}function Xo(){}var fr=!1;function Jo(n,i,a){if(fr)return n(i,a);fr=!0;try{return bi(n,i,a)}finally{fr=!1,(hn!==null||qn!==null)&&(Xo(),Yo())}}function it(n,i){var a=n.stateNode;if(a===null)return null;var c=$l(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var Rs=!1;if(p)try{var In={};Object.defineProperty(In,"passive",{get:function(){Rs=!0}}),window.addEventListener("test",In,In),window.removeEventListener("test",In,In)}catch{Rs=!1}function Li(n,i,a,c,d,m,v,S,P){var j=Array.prototype.slice.call(arguments,3);try{i.apply(a,j)}catch(Q){this.onError(Q)}}var Mi=!1,Cs=null,Sn=!1,Zo=null,Mc={onError:function(n){Mi=!0,Cs=n}};function Ps(n,i,a,c,d,m,v,S,P){Mi=!1,Cs=null,Li.apply(Mc,arguments)}function pl(n,i,a,c,d,m,v,S,P){if(Ps.apply(this,arguments),Mi){if(Mi){var j=Cs;Mi=!1,Cs=null}else throw Error(t(198));Sn||(Sn=!0,Zo=j)}}function An(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Fi(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function Rn(n){if(An(n)!==n)throw Error(t(188))}function ml(n){var i=n.alternate;if(!i){if(i=An(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var d=a.return;if(d===null)break;var m=d.alternate;if(m===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===m.child){for(m=d.child;m;){if(m===a)return Rn(d),n;if(m===c)return Rn(d),i;m=m.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=m;else{for(var v=!1,S=d.child;S;){if(S===a){v=!0,a=d,c=m;break}if(S===c){v=!0,c=d,a=m;break}S=S.sibling}if(!v){for(S=m.child;S;){if(S===a){v=!0,a=m,c=d;break}if(S===c){v=!0,c=m,a=d;break}S=S.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function ea(n){return n=ml(n),n!==null?ks(n):null}function ks(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=ks(n);if(i!==null)return i;n=n.sibling}return null}var xs=e.unstable_scheduleCallback,ta=e.unstable_cancelCallback,gl=e.unstable_shouldYield,Fc=e.unstable_requestPaint,qe=e.unstable_now,yl=e.unstable_getCurrentPriorityLevel,Ui=e.unstable_ImmediatePriority,Fr=e.unstable_UserBlockingPriority,dn=e.unstable_NormalPriority,na=e.unstable_LowPriority,_l=e.unstable_IdlePriority,ji=null,nn=null;function vl(n){if(nn&&typeof nn.onCommitFiberRoot=="function")try{nn.onCommitFiberRoot(ji,n,void 0,(n.current.flags&128)===128)}catch{}}var Bt=Math.clz32?Math.clz32:wl,ra=Math.log,El=Math.LN2;function wl(n){return n>>>=0,n===0?32:31-(ra(n)/El|0)|0}var Ns=64,Ds=4194304;function Ur(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function zi(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,m=n.pingedLanes,v=a&268435455;if(v!==0){var S=v&~d;S!==0?c=Ur(S):(m&=v,m!==0&&(c=Ur(m)))}else v=a&~d,v!==0?c=Ur(v):m!==0&&(c=Ur(m));if(c===0)return 0;if(i!==0&&i!==c&&(i&d)===0&&(d=c&-c,m=i&-i,d>=m||d===16&&(m&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Bt(i),d=1<<a,c|=n[a],i&=~d;return c}function Uc(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function pr(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,m=n.pendingLanes;0<m;){var v=31-Bt(m),S=1<<v,P=d[v];P===-1?((S&a)===0||(S&c)!==0)&&(d[v]=Uc(S,i)):P<=i&&(n.expiredLanes|=S),m&=~S}}function rn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Bi(){var n=Ns;return Ns<<=1,(Ns&4194240)===0&&(Ns=64),n}function jr(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function zr(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Bt(i),n[i]=a}function Be(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Bt(a),m=1<<d;i[d]=0,c[d]=-1,n[d]=-1,a&=~m}}function Br(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Bt(a),d=1<<c;d&i|n[c]&i&&(n[c]|=i),a&=~d}}var Ne=0;function $r(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Tl,Vs,Il,Sl,Al,ia=!1,Wn=[],At=null,Cn=null,Pn=null,qr=new Map,fn=new Map,Gn=[],jc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Rl(n,i){switch(n){case"focusin":case"focusout":At=null;break;case"dragenter":case"dragleave":Cn=null;break;case"mouseover":case"mouseout":Pn=null;break;case"pointerover":case"pointerout":qr.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":fn.delete(i.pointerId)}}function Wt(n,i,a,c,d,m){return n===null||n.nativeEvent!==m?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:m,targetContainers:[d]},i!==null&&(i=va(i),i!==null&&Vs(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function zc(n,i,a,c,d){switch(i){case"focusin":return At=Wt(At,n,i,a,c,d),!0;case"dragenter":return Cn=Wt(Cn,n,i,a,c,d),!0;case"mouseover":return Pn=Wt(Pn,n,i,a,c,d),!0;case"pointerover":var m=d.pointerId;return qr.set(m,Wt(qr.get(m)||null,n,i,a,c,d)),!0;case"gotpointercapture":return m=d.pointerId,fn.set(m,Wt(fn.get(m)||null,n,i,a,c,d)),!0}return!1}function Cl(n){var i=Gi(n.target);if(i!==null){var a=An(i);if(a!==null){if(i=a.tag,i===13){if(i=Fi(a),i!==null){n.blockedOn=i,Al(n.priority,function(){Il(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function mr(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=Os(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Oi=c,a.target.dispatchEvent(c),Oi=null}else return i=va(a),i!==null&&Vs(i),n.blockedOn=a,!1;i.shift()}return!0}function $i(n,i,a){mr(n)&&a.delete(i)}function Pl(){ia=!1,At!==null&&mr(At)&&(At=null),Cn!==null&&mr(Cn)&&(Cn=null),Pn!==null&&mr(Pn)&&(Pn=null),qr.forEach($i),fn.forEach($i)}function kn(n,i){n.blockedOn===i&&(n.blockedOn=null,ia||(ia=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Pl)))}function xn(n){function i(d){return kn(d,n)}if(0<Wn.length){kn(Wn[0],n);for(var a=1;a<Wn.length;a++){var c=Wn[a];c.blockedOn===n&&(c.blockedOn=null)}}for(At!==null&&kn(At,n),Cn!==null&&kn(Cn,n),Pn!==null&&kn(Pn,n),qr.forEach(i),fn.forEach(i),a=0;a<Gn.length;a++)c=Gn[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Gn.length&&(a=Gn[0],a.blockedOn===null);)Cl(a),a.blockedOn===null&&Gn.shift()}var gr=J.ReactCurrentBatchConfig,Hr=!0;function Ye(n,i,a,c){var d=Ne,m=gr.transition;gr.transition=null;try{Ne=1,sa(n,i,a,c)}finally{Ne=d,gr.transition=m}}function Bc(n,i,a,c){var d=Ne,m=gr.transition;gr.transition=null;try{Ne=4,sa(n,i,a,c)}finally{Ne=d,gr.transition=m}}function sa(n,i,a,c){if(Hr){var d=Os(n,i,a,c);if(d===null)Zc(n,i,c,qi,a),Rl(n,c);else if(zc(d,n,i,a,c))c.stopPropagation();else if(Rl(n,c),i&4&&-1<jc.indexOf(n)){for(;d!==null;){var m=va(d);if(m!==null&&Tl(m),m=Os(n,i,a,c),m===null&&Zc(n,i,c,qi,a),m===d)break;d=m}d!==null&&c.stopPropagation()}else Zc(n,i,c,null,a)}}var qi=null;function Os(n,i,a,c){if(qi=null,n=Is(c),n=Gi(n),n!==null)if(i=An(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Fi(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return qi=n,null}function oa(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(yl()){case Ui:return 1;case Fr:return 4;case dn:case na:return 16;case _l:return 536870912;default:return 16}default:return 16}}var sn=null,bs=null,Gt=null;function aa(){if(Gt)return Gt;var n,i=bs,a=i.length,c,d="value"in sn?sn.value:sn.textContent,m=d.length;for(n=0;n<a&&i[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&i[a-c]===d[m-c];c++);return Gt=d.slice(n,1<c?1-c:void 0)}function Ls(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function Kn(){return!0}function la(){return!1}function Rt(n){function i(a,c,d,m,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=m,this.target=v,this.currentTarget=null;for(var S in n)n.hasOwnProperty(S)&&(a=n[S],this[S]=a?a(m):m[S]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?Kn:la,this.isPropagationStopped=la,this}return ie(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Kn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Kn)},persist:function(){},isPersistent:Kn}),i}var Nn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ms=Rt(Nn),Qn=ie({},Nn,{view:0,detail:0}),$c=Rt(Qn),Fs,yr,Wr,Hi=ie({},Qn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Yn,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Wr&&(Wr&&n.type==="mousemove"?(Fs=n.screenX-Wr.screenX,yr=n.screenY-Wr.screenY):yr=Fs=0,Wr=n),Fs)},movementY:function(n){return"movementY"in n?n.movementY:yr}}),Us=Rt(Hi),ua=ie({},Hi,{dataTransfer:0}),kl=Rt(ua),js=ie({},Qn,{relatedTarget:0}),zs=Rt(js),xl=ie({},Nn,{animationName:0,elapsedTime:0,pseudoElement:0}),_r=Rt(xl),Nl=ie({},Nn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Dl=Rt(Nl),Vl=ie({},Nn,{data:0}),ca=Rt(Vl),Bs={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$t={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ol={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function bl(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Ol[n])?!!i[n]:!1}function Yn(){return bl}var u=ie({},Qn,{key:function(n){if(n.key){var i=Bs[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Ls(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?$t[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Yn,charCode:function(n){return n.type==="keypress"?Ls(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ls(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),f=Rt(u),y=ie({},Hi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),E=Rt(y),b=ie({},Qn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Yn}),z=Rt(b),Z=ie({},Nn,{propertyName:0,elapsedTime:0,pseudoElement:0}),je=Rt(Z),pt=ie({},Hi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Ve=Rt(pt),vt=[9,13,27,32],at=p&&"CompositionEvent"in window,pn=null;p&&"documentMode"in document&&(pn=document.documentMode);var on=p&&"TextEvent"in window&&!pn,Wi=p&&(!at||pn&&8<pn&&11>=pn),$s=" ",Xf=!1;function Jf(n,i){switch(n){case"keyup":return vt.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Zf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var qs=!1;function A0(n,i){switch(n){case"compositionend":return Zf(i);case"keypress":return i.which!==32?null:(Xf=!0,$s);case"textInput":return n=i.data,n===$s&&Xf?null:n;default:return null}}function R0(n,i){if(qs)return n==="compositionend"||!at&&Jf(n,i)?(n=aa(),Gt=bs=sn=null,qs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Wi&&i.locale!=="ko"?null:i.data;default:return null}}var C0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ep(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!C0[n.type]:i==="textarea"}function tp(n,i,a,c){Hn(c),i=jl(i,"onChange"),0<i.length&&(a=new Ms("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var ha=null,da=null;function P0(n){vp(n,0)}function Ll(n){var i=Qs(n);if(_s(i))return n}function k0(n,i){if(n==="change")return i}var np=!1;if(p){var qc;if(p){var Hc="oninput"in document;if(!Hc){var rp=document.createElement("div");rp.setAttribute("oninput","return;"),Hc=typeof rp.oninput=="function"}qc=Hc}else qc=!1;np=qc&&(!document.documentMode||9<document.documentMode)}function ip(){ha&&(ha.detachEvent("onpropertychange",sp),da=ha=null)}function sp(n){if(n.propertyName==="value"&&Ll(da)){var i=[];tp(i,da,n,Is(n)),Jo(P0,i)}}function x0(n,i,a){n==="focusin"?(ip(),ha=i,da=a,ha.attachEvent("onpropertychange",sp)):n==="focusout"&&ip()}function N0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Ll(da)}function D0(n,i){if(n==="click")return Ll(i)}function V0(n,i){if(n==="input"||n==="change")return Ll(i)}function O0(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Dn=typeof Object.is=="function"?Object.is:O0;function fa(n,i){if(Dn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(i,d)||!Dn(n[d],i[d]))return!1}return!0}function op(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function ap(n,i){var a=op(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=op(a)}}function lp(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?lp(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function up(){for(var n=window,i=Lr();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=Lr(n.document)}return i}function Wc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function b0(n){var i=up(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&lp(a.ownerDocument.documentElement,a)){if(c!==null&&Wc(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,m=Math.min(c.start,d);c=c.end===void 0?m:Math.min(c.end,d),!n.extend&&m>c&&(d=c,c=m,m=d),d=ap(a,m);var v=ap(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),m>c?(n.addRange(i),n.extend(v.node,v.offset)):(i.setEnd(v.node,v.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var L0=p&&"documentMode"in document&&11>=document.documentMode,Hs=null,Gc=null,pa=null,Kc=!1;function cp(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Kc||Hs==null||Hs!==Lr(c)||(c=Hs,"selectionStart"in c&&Wc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),pa&&fa(pa,c)||(pa=c,c=jl(Gc,"onSelect"),0<c.length&&(i=new Ms("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=Hs)))}function Ml(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var Ws={animationend:Ml("Animation","AnimationEnd"),animationiteration:Ml("Animation","AnimationIteration"),animationstart:Ml("Animation","AnimationStart"),transitionend:Ml("Transition","TransitionEnd")},Qc={},hp={};p&&(hp=document.createElement("div").style,"AnimationEvent"in window||(delete Ws.animationend.animation,delete Ws.animationiteration.animation,delete Ws.animationstart.animation),"TransitionEvent"in window||delete Ws.transitionend.transition);function Fl(n){if(Qc[n])return Qc[n];if(!Ws[n])return n;var i=Ws[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in hp)return Qc[n]=i[a];return n}var dp=Fl("animationend"),fp=Fl("animationiteration"),pp=Fl("animationstart"),mp=Fl("transitionend"),gp=new Map,yp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Gr(n,i){gp.set(n,i),l(i,[n])}for(var Yc=0;Yc<yp.length;Yc++){var Xc=yp[Yc],M0=Xc.toLowerCase(),F0=Xc[0].toUpperCase()+Xc.slice(1);Gr(M0,"on"+F0)}Gr(dp,"onAnimationEnd"),Gr(fp,"onAnimationIteration"),Gr(pp,"onAnimationStart"),Gr("dblclick","onDoubleClick"),Gr("focusin","onFocus"),Gr("focusout","onBlur"),Gr(mp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ma="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),U0=new Set("cancel close invalid load scroll toggle".split(" ").concat(ma));function _p(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,pl(c,i,void 0,n),n.currentTarget=null}function vp(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var m=void 0;if(i)for(var v=c.length-1;0<=v;v--){var S=c[v],P=S.instance,j=S.currentTarget;if(S=S.listener,P!==m&&d.isPropagationStopped())break e;_p(d,S,j),m=P}else for(v=0;v<c.length;v++){if(S=c[v],P=S.instance,j=S.currentTarget,S=S.listener,P!==m&&d.isPropagationStopped())break e;_p(d,S,j),m=P}}}if(Sn)throw n=Zo,Sn=!1,Zo=null,n}function Ge(n,i){var a=i[sh];a===void 0&&(a=i[sh]=new Set);var c=n+"__bubble";a.has(c)||(Ep(i,n,2,!1),a.add(c))}function Jc(n,i,a){var c=0;i&&(c|=4),Ep(a,n,c,i)}var Ul="_reactListening"+Math.random().toString(36).slice(2);function ga(n){if(!n[Ul]){n[Ul]=!0,s.forEach(function(a){a!=="selectionchange"&&(U0.has(a)||Jc(a,!1,n),Jc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[Ul]||(i[Ul]=!0,Jc("selectionchange",!1,i))}}function Ep(n,i,a,c){switch(oa(i)){case 1:var d=Ye;break;case 4:d=Bc;break;default:d=sa}a=d.bind(null,i,a,n),d=void 0,!Rs||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(i,a,{capture:!0,passive:d}):n.addEventListener(i,a,!0):d!==void 0?n.addEventListener(i,a,{passive:d}):n.addEventListener(i,a,!1)}function Zc(n,i,a,c,d){var m=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var S=c.stateNode.containerInfo;if(S===d||S.nodeType===8&&S.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var P=v.tag;if((P===3||P===4)&&(P=v.stateNode.containerInfo,P===d||P.nodeType===8&&P.parentNode===d))return;v=v.return}for(;S!==null;){if(v=Gi(S),v===null)return;if(P=v.tag,P===5||P===6){c=m=v;continue e}S=S.parentNode}}c=c.return}Jo(function(){var j=m,Q=Is(a),Y=[];e:{var K=gp.get(n);if(K!==void 0){var ne=Ms,oe=n;switch(n){case"keypress":if(Ls(a)===0)break e;case"keydown":case"keyup":ne=f;break;case"focusin":oe="focus",ne=zs;break;case"focusout":oe="blur",ne=zs;break;case"beforeblur":case"afterblur":ne=zs;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ne=Us;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ne=kl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ne=z;break;case dp:case fp:case pp:ne=_r;break;case mp:ne=je;break;case"scroll":ne=$c;break;case"wheel":ne=Ve;break;case"copy":case"cut":case"paste":ne=Dl;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ne=E}var ae=(i&4)!==0,st=!ae&&n==="scroll",L=ae?K!==null?K+"Capture":null:K;ae=[];for(var N=j,M;N!==null;){M=N;var X=M.stateNode;if(M.tag===5&&X!==null&&(M=X,L!==null&&(X=it(N,L),X!=null&&ae.push(ya(N,X,M)))),st)break;N=N.return}0<ae.length&&(K=new ne(K,oe,null,a,Q),Y.push({event:K,listeners:ae}))}}if((i&7)===0){e:{if(K=n==="mouseover"||n==="pointerover",ne=n==="mouseout"||n==="pointerout",K&&a!==Oi&&(oe=a.relatedTarget||a.fromElement)&&(Gi(oe)||oe[vr]))break e;if((ne||K)&&(K=Q.window===Q?Q:(K=Q.ownerDocument)?K.defaultView||K.parentWindow:window,ne?(oe=a.relatedTarget||a.toElement,ne=j,oe=oe?Gi(oe):null,oe!==null&&(st=An(oe),oe!==st||oe.tag!==5&&oe.tag!==6)&&(oe=null)):(ne=null,oe=j),ne!==oe)){if(ae=Us,X="onMouseLeave",L="onMouseEnter",N="mouse",(n==="pointerout"||n==="pointerover")&&(ae=E,X="onPointerLeave",L="onPointerEnter",N="pointer"),st=ne==null?K:Qs(ne),M=oe==null?K:Qs(oe),K=new ae(X,N+"leave",ne,a,Q),K.target=st,K.relatedTarget=M,X=null,Gi(Q)===j&&(ae=new ae(L,N+"enter",oe,a,Q),ae.target=M,ae.relatedTarget=st,X=ae),st=X,ne&&oe)t:{for(ae=ne,L=oe,N=0,M=ae;M;M=Gs(M))N++;for(M=0,X=L;X;X=Gs(X))M++;for(;0<N-M;)ae=Gs(ae),N--;for(;0<M-N;)L=Gs(L),M--;for(;N--;){if(ae===L||L!==null&&ae===L.alternate)break t;ae=Gs(ae),L=Gs(L)}ae=null}else ae=null;ne!==null&&wp(Y,K,ne,ae,!1),oe!==null&&st!==null&&wp(Y,st,oe,ae,!0)}}e:{if(K=j?Qs(j):window,ne=K.nodeName&&K.nodeName.toLowerCase(),ne==="select"||ne==="input"&&K.type==="file")var le=k0;else if(ep(K))if(np)le=V0;else{le=N0;var ge=x0}else(ne=K.nodeName)&&ne.toLowerCase()==="input"&&(K.type==="checkbox"||K.type==="radio")&&(le=D0);if(le&&(le=le(n,j))){tp(Y,le,a,Q);break e}ge&&ge(n,K,j),n==="focusout"&&(ge=K._wrapperState)&&ge.controlled&&K.type==="number"&&Es(K,"number",K.value)}switch(ge=j?Qs(j):window,n){case"focusin":(ep(ge)||ge.contentEditable==="true")&&(Hs=ge,Gc=j,pa=null);break;case"focusout":pa=Gc=Hs=null;break;case"mousedown":Kc=!0;break;case"contextmenu":case"mouseup":case"dragend":Kc=!1,cp(Y,a,Q);break;case"selectionchange":if(L0)break;case"keydown":case"keyup":cp(Y,a,Q)}var ye;if(at)e:{switch(n){case"compositionstart":var we="onCompositionStart";break e;case"compositionend":we="onCompositionEnd";break e;case"compositionupdate":we="onCompositionUpdate";break e}we=void 0}else qs?Jf(n,a)&&(we="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(we="onCompositionStart");we&&(Wi&&a.locale!=="ko"&&(qs||we!=="onCompositionStart"?we==="onCompositionEnd"&&qs&&(ye=aa()):(sn=Q,bs="value"in sn?sn.value:sn.textContent,qs=!0)),ge=jl(j,we),0<ge.length&&(we=new ca(we,n,null,a,Q),Y.push({event:we,listeners:ge}),ye?we.data=ye:(ye=Zf(a),ye!==null&&(we.data=ye)))),(ye=on?A0(n,a):R0(n,a))&&(j=jl(j,"onBeforeInput"),0<j.length&&(Q=new ca("onBeforeInput","beforeinput",null,a,Q),Y.push({event:Q,listeners:j}),Q.data=ye))}vp(Y,i)})}function ya(n,i,a){return{instance:n,listener:i,currentTarget:a}}function jl(n,i){for(var a=i+"Capture",c=[];n!==null;){var d=n,m=d.stateNode;d.tag===5&&m!==null&&(d=m,m=it(n,a),m!=null&&c.unshift(ya(n,m,d)),m=it(n,i),m!=null&&c.push(ya(n,m,d))),n=n.return}return c}function Gs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function wp(n,i,a,c,d){for(var m=i._reactName,v=[];a!==null&&a!==c;){var S=a,P=S.alternate,j=S.stateNode;if(P!==null&&P===c)break;S.tag===5&&j!==null&&(S=j,d?(P=it(a,m),P!=null&&v.unshift(ya(a,P,S))):d||(P=it(a,m),P!=null&&v.push(ya(a,P,S)))),a=a.return}v.length!==0&&n.push({event:i,listeners:v})}var j0=/\r\n?/g,z0=/\u0000|\uFFFD/g;function Tp(n){return(typeof n=="string"?n:""+n).replace(j0,`
`).replace(z0,"")}function zl(n,i,a){if(i=Tp(i),Tp(n)!==i&&a)throw Error(t(425))}function Bl(){}var eh=null,th=null;function nh(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var rh=typeof setTimeout=="function"?setTimeout:void 0,B0=typeof clearTimeout=="function"?clearTimeout:void 0,Ip=typeof Promise=="function"?Promise:void 0,$0=typeof queueMicrotask=="function"?queueMicrotask:typeof Ip<"u"?function(n){return Ip.resolve(null).then(n).catch(q0)}:rh;function q0(n){setTimeout(function(){throw n})}function ih(n,i){var a=i,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),xn(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);xn(i)}function Kr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Sp(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var Ks=Math.random().toString(36).slice(2),Xn="__reactFiber$"+Ks,_a="__reactProps$"+Ks,vr="__reactContainer$"+Ks,sh="__reactEvents$"+Ks,H0="__reactListeners$"+Ks,W0="__reactHandles$"+Ks;function Gi(n){var i=n[Xn];if(i)return i;for(var a=n.parentNode;a;){if(i=a[vr]||a[Xn]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Sp(n);n!==null;){if(a=n[Xn])return a;n=Sp(n)}return i}n=a,a=n.parentNode}return null}function va(n){return n=n[Xn]||n[vr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Qs(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function $l(n){return n[_a]||null}var oh=[],Ys=-1;function Qr(n){return{current:n}}function Ke(n){0>Ys||(n.current=oh[Ys],oh[Ys]=null,Ys--)}function He(n,i){Ys++,oh[Ys]=n.current,n.current=i}var Yr={},Ot=Qr(Yr),Kt=Qr(!1),Ki=Yr;function Xs(n,i){var a=n.type.contextTypes;if(!a)return Yr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var d={},m;for(m in a)d[m]=i[m];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function Qt(n){return n=n.childContextTypes,n!=null}function ql(){Ke(Kt),Ke(Ot)}function Ap(n,i,a){if(Ot.current!==Yr)throw Error(t(168));He(Ot,i),He(Kt,a)}function Rp(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in i))throw Error(t(108,Me(n)||"Unknown",d));return ie({},a,c)}function Hl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Yr,Ki=Ot.current,He(Ot,n),He(Kt,Kt.current),!0}function Cp(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Rp(n,i,Ki),c.__reactInternalMemoizedMergedChildContext=n,Ke(Kt),Ke(Ot),He(Ot,n)):Ke(Kt),He(Kt,a)}var Er=null,Wl=!1,ah=!1;function Pp(n){Er===null?Er=[n]:Er.push(n)}function G0(n){Wl=!0,Pp(n)}function Xr(){if(!ah&&Er!==null){ah=!0;var n=0,i=Ne;try{var a=Er;for(Ne=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Er=null,Wl=!1}catch(d){throw Er!==null&&(Er=Er.slice(n+1)),xs(Ui,Xr),d}finally{Ne=i,ah=!1}}return null}var Js=[],Zs=0,Gl=null,Kl=0,mn=[],gn=0,Qi=null,wr=1,Tr="";function Yi(n,i){Js[Zs++]=Kl,Js[Zs++]=Gl,Gl=n,Kl=i}function kp(n,i,a){mn[gn++]=wr,mn[gn++]=Tr,mn[gn++]=Qi,Qi=n;var c=wr;n=Tr;var d=32-Bt(c)-1;c&=~(1<<d),a+=1;var m=32-Bt(i)+d;if(30<m){var v=d-d%5;m=(c&(1<<v)-1).toString(32),c>>=v,d-=v,wr=1<<32-Bt(i)+d|a<<d|c,Tr=m+n}else wr=1<<m|a<<d|c,Tr=n}function lh(n){n.return!==null&&(Yi(n,1),kp(n,1,0))}function uh(n){for(;n===Gl;)Gl=Js[--Zs],Js[Zs]=null,Kl=Js[--Zs],Js[Zs]=null;for(;n===Qi;)Qi=mn[--gn],mn[gn]=null,Tr=mn[--gn],mn[gn]=null,wr=mn[--gn],mn[gn]=null}var an=null,ln=null,Xe=!1,Vn=null;function xp(n,i){var a=En(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Np(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,an=n,ln=Kr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,an=n,ln=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Qi!==null?{id:wr,overflow:Tr}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=En(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,an=n,ln=null,!0):!1;default:return!1}}function ch(n){return(n.mode&1)!==0&&(n.flags&128)===0}function hh(n){if(Xe){var i=ln;if(i){var a=i;if(!Np(n,i)){if(ch(n))throw Error(t(418));i=Kr(a.nextSibling);var c=an;i&&Np(n,i)?xp(c,a):(n.flags=n.flags&-4097|2,Xe=!1,an=n)}}else{if(ch(n))throw Error(t(418));n.flags=n.flags&-4097|2,Xe=!1,an=n}}}function Dp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;an=n}function Ql(n){if(n!==an)return!1;if(!Xe)return Dp(n),Xe=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!nh(n.type,n.memoizedProps)),i&&(i=ln)){if(ch(n))throw Vp(),Error(t(418));for(;i;)xp(n,i),i=Kr(i.nextSibling)}if(Dp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){ln=Kr(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}ln=null}}else ln=an?Kr(n.stateNode.nextSibling):null;return!0}function Vp(){for(var n=ln;n;)n=Kr(n.nextSibling)}function eo(){ln=an=null,Xe=!1}function dh(n){Vn===null?Vn=[n]:Vn.push(n)}var K0=J.ReactCurrentBatchConfig;function Ea(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,m=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===m?i.ref:(i=function(v){var S=d.refs;v===null?delete S[m]:S[m]=v},i._stringRef=m,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Yl(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Op(n){var i=n._init;return i(n._payload)}function bp(n){function i(L,N){if(n){var M=L.deletions;M===null?(L.deletions=[N],L.flags|=16):M.push(N)}}function a(L,N){if(!n)return null;for(;N!==null;)i(L,N),N=N.sibling;return null}function c(L,N){for(L=new Map;N!==null;)N.key!==null?L.set(N.key,N):L.set(N.index,N),N=N.sibling;return L}function d(L,N){return L=si(L,N),L.index=0,L.sibling=null,L}function m(L,N,M){return L.index=M,n?(M=L.alternate,M!==null?(M=M.index,M<N?(L.flags|=2,N):M):(L.flags|=2,N)):(L.flags|=1048576,N)}function v(L){return n&&L.alternate===null&&(L.flags|=2),L}function S(L,N,M,X){return N===null||N.tag!==6?(N=rd(M,L.mode,X),N.return=L,N):(N=d(N,M),N.return=L,N)}function P(L,N,M,X){var le=M.type;return le===k?Q(L,N,M.props.children,X,M.key):N!==null&&(N.elementType===le||typeof le=="object"&&le!==null&&le.$$typeof===Vt&&Op(le)===N.type)?(X=d(N,M.props),X.ref=Ea(L,N,M),X.return=L,X):(X=Eu(M.type,M.key,M.props,null,L.mode,X),X.ref=Ea(L,N,M),X.return=L,X)}function j(L,N,M,X){return N===null||N.tag!==4||N.stateNode.containerInfo!==M.containerInfo||N.stateNode.implementation!==M.implementation?(N=id(M,L.mode,X),N.return=L,N):(N=d(N,M.children||[]),N.return=L,N)}function Q(L,N,M,X,le){return N===null||N.tag!==7?(N=is(M,L.mode,X,le),N.return=L,N):(N=d(N,M),N.return=L,N)}function Y(L,N,M){if(typeof N=="string"&&N!==""||typeof N=="number")return N=rd(""+N,L.mode,M),N.return=L,N;if(typeof N=="object"&&N!==null){switch(N.$$typeof){case Ee:return M=Eu(N.type,N.key,N.props,null,L.mode,M),M.ref=Ea(L,null,N),M.return=L,M;case ue:return N=id(N,L.mode,M),N.return=L,N;case Vt:var X=N._init;return Y(L,X(N._payload),M)}if(cr(N)||me(N))return N=is(N,L.mode,M,null),N.return=L,N;Yl(L,N)}return null}function K(L,N,M,X){var le=N!==null?N.key:null;if(typeof M=="string"&&M!==""||typeof M=="number")return le!==null?null:S(L,N,""+M,X);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Ee:return M.key===le?P(L,N,M,X):null;case ue:return M.key===le?j(L,N,M,X):null;case Vt:return le=M._init,K(L,N,le(M._payload),X)}if(cr(M)||me(M))return le!==null?null:Q(L,N,M,X,null);Yl(L,M)}return null}function ne(L,N,M,X,le){if(typeof X=="string"&&X!==""||typeof X=="number")return L=L.get(M)||null,S(N,L,""+X,le);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case Ee:return L=L.get(X.key===null?M:X.key)||null,P(N,L,X,le);case ue:return L=L.get(X.key===null?M:X.key)||null,j(N,L,X,le);case Vt:var ge=X._init;return ne(L,N,M,ge(X._payload),le)}if(cr(X)||me(X))return L=L.get(M)||null,Q(N,L,X,le,null);Yl(N,X)}return null}function oe(L,N,M,X){for(var le=null,ge=null,ye=N,we=N=0,Tt=null;ye!==null&&we<M.length;we++){ye.index>we?(Tt=ye,ye=null):Tt=ye.sibling;var Le=K(L,ye,M[we],X);if(Le===null){ye===null&&(ye=Tt);break}n&&ye&&Le.alternate===null&&i(L,ye),N=m(Le,N,we),ge===null?le=Le:ge.sibling=Le,ge=Le,ye=Tt}if(we===M.length)return a(L,ye),Xe&&Yi(L,we),le;if(ye===null){for(;we<M.length;we++)ye=Y(L,M[we],X),ye!==null&&(N=m(ye,N,we),ge===null?le=ye:ge.sibling=ye,ge=ye);return Xe&&Yi(L,we),le}for(ye=c(L,ye);we<M.length;we++)Tt=ne(ye,L,we,M[we],X),Tt!==null&&(n&&Tt.alternate!==null&&ye.delete(Tt.key===null?we:Tt.key),N=m(Tt,N,we),ge===null?le=Tt:ge.sibling=Tt,ge=Tt);return n&&ye.forEach(function(oi){return i(L,oi)}),Xe&&Yi(L,we),le}function ae(L,N,M,X){var le=me(M);if(typeof le!="function")throw Error(t(150));if(M=le.call(M),M==null)throw Error(t(151));for(var ge=le=null,ye=N,we=N=0,Tt=null,Le=M.next();ye!==null&&!Le.done;we++,Le=M.next()){ye.index>we?(Tt=ye,ye=null):Tt=ye.sibling;var oi=K(L,ye,Le.value,X);if(oi===null){ye===null&&(ye=Tt);break}n&&ye&&oi.alternate===null&&i(L,ye),N=m(oi,N,we),ge===null?le=oi:ge.sibling=oi,ge=oi,ye=Tt}if(Le.done)return a(L,ye),Xe&&Yi(L,we),le;if(ye===null){for(;!Le.done;we++,Le=M.next())Le=Y(L,Le.value,X),Le!==null&&(N=m(Le,N,we),ge===null?le=Le:ge.sibling=Le,ge=Le);return Xe&&Yi(L,we),le}for(ye=c(L,ye);!Le.done;we++,Le=M.next())Le=ne(ye,L,we,Le.value,X),Le!==null&&(n&&Le.alternate!==null&&ye.delete(Le.key===null?we:Le.key),N=m(Le,N,we),ge===null?le=Le:ge.sibling=Le,ge=Le);return n&&ye.forEach(function(CE){return i(L,CE)}),Xe&&Yi(L,we),le}function st(L,N,M,X){if(typeof M=="object"&&M!==null&&M.type===k&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case Ee:e:{for(var le=M.key,ge=N;ge!==null;){if(ge.key===le){if(le=M.type,le===k){if(ge.tag===7){a(L,ge.sibling),N=d(ge,M.props.children),N.return=L,L=N;break e}}else if(ge.elementType===le||typeof le=="object"&&le!==null&&le.$$typeof===Vt&&Op(le)===ge.type){a(L,ge.sibling),N=d(ge,M.props),N.ref=Ea(L,ge,M),N.return=L,L=N;break e}a(L,ge);break}else i(L,ge);ge=ge.sibling}M.type===k?(N=is(M.props.children,L.mode,X,M.key),N.return=L,L=N):(X=Eu(M.type,M.key,M.props,null,L.mode,X),X.ref=Ea(L,N,M),X.return=L,L=X)}return v(L);case ue:e:{for(ge=M.key;N!==null;){if(N.key===ge)if(N.tag===4&&N.stateNode.containerInfo===M.containerInfo&&N.stateNode.implementation===M.implementation){a(L,N.sibling),N=d(N,M.children||[]),N.return=L,L=N;break e}else{a(L,N);break}else i(L,N);N=N.sibling}N=id(M,L.mode,X),N.return=L,L=N}return v(L);case Vt:return ge=M._init,st(L,N,ge(M._payload),X)}if(cr(M))return oe(L,N,M,X);if(me(M))return ae(L,N,M,X);Yl(L,M)}return typeof M=="string"&&M!==""||typeof M=="number"?(M=""+M,N!==null&&N.tag===6?(a(L,N.sibling),N=d(N,M),N.return=L,L=N):(a(L,N),N=rd(M,L.mode,X),N.return=L,L=N),v(L)):a(L,N)}return st}var to=bp(!0),Lp=bp(!1),Xl=Qr(null),Jl=null,no=null,fh=null;function ph(){fh=no=Jl=null}function mh(n){var i=Xl.current;Ke(Xl),n._currentValue=i}function gh(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function ro(n,i){Jl=n,fh=no=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(Yt=!0),n.firstContext=null)}function yn(n){var i=n._currentValue;if(fh!==n)if(n={context:n,memoizedValue:i,next:null},no===null){if(Jl===null)throw Error(t(308));no=n,Jl.dependencies={lanes:0,firstContext:n}}else no=no.next=n;return i}var Xi=null;function yh(n){Xi===null?Xi=[n]:Xi.push(n)}function Mp(n,i,a,c){var d=i.interleaved;return d===null?(a.next=a,yh(i)):(a.next=d.next,d.next=a),i.interleaved=a,Ir(n,c)}function Ir(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var Jr=!1;function _h(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Fp(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Sr(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function Zr(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(be&2)!==0){var d=c.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),c.pending=i,Ir(n,a)}return d=c.interleaved,d===null?(i.next=i,yh(c)):(i.next=d.next,d.next=i),c.interleaved=i,Ir(n,a)}function Zl(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Br(n,a)}}function Up(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,m=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};m===null?d=m=v:m=m.next=v,a=a.next}while(a!==null);m===null?d=m=i:m=m.next=i}else d=m=i;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:m,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function eu(n,i,a,c){var d=n.updateQueue;Jr=!1;var m=d.firstBaseUpdate,v=d.lastBaseUpdate,S=d.shared.pending;if(S!==null){d.shared.pending=null;var P=S,j=P.next;P.next=null,v===null?m=j:v.next=j,v=P;var Q=n.alternate;Q!==null&&(Q=Q.updateQueue,S=Q.lastBaseUpdate,S!==v&&(S===null?Q.firstBaseUpdate=j:S.next=j,Q.lastBaseUpdate=P))}if(m!==null){var Y=d.baseState;v=0,Q=j=P=null,S=m;do{var K=S.lane,ne=S.eventTime;if((c&K)===K){Q!==null&&(Q=Q.next={eventTime:ne,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var oe=n,ae=S;switch(K=i,ne=a,ae.tag){case 1:if(oe=ae.payload,typeof oe=="function"){Y=oe.call(ne,Y,K);break e}Y=oe;break e;case 3:oe.flags=oe.flags&-65537|128;case 0:if(oe=ae.payload,K=typeof oe=="function"?oe.call(ne,Y,K):oe,K==null)break e;Y=ie({},Y,K);break e;case 2:Jr=!0}}S.callback!==null&&S.lane!==0&&(n.flags|=64,K=d.effects,K===null?d.effects=[S]:K.push(S))}else ne={eventTime:ne,lane:K,tag:S.tag,payload:S.payload,callback:S.callback,next:null},Q===null?(j=Q=ne,P=Y):Q=Q.next=ne,v|=K;if(S=S.next,S===null){if(S=d.shared.pending,S===null)break;K=S,S=K.next,K.next=null,d.lastBaseUpdate=K,d.shared.pending=null}}while(!0);if(Q===null&&(P=Y),d.baseState=P,d.firstBaseUpdate=j,d.lastBaseUpdate=Q,i=d.shared.interleaved,i!==null){d=i;do v|=d.lane,d=d.next;while(d!==i)}else m===null&&(d.shared.lanes=0);es|=v,n.lanes=v,n.memoizedState=Y}}function jp(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var wa={},Jn=Qr(wa),Ta=Qr(wa),Ia=Qr(wa);function Ji(n){if(n===wa)throw Error(t(174));return n}function vh(n,i){switch(He(Ia,i),He(Ta,n),He(Jn,wa),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:ft(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=ft(i,n)}Ke(Jn),He(Jn,i)}function io(){Ke(Jn),Ke(Ta),Ke(Ia)}function zp(n){Ji(Ia.current);var i=Ji(Jn.current),a=ft(i,n.type);i!==a&&(He(Ta,n),He(Jn,a))}function Eh(n){Ta.current===n&&(Ke(Jn),Ke(Ta))}var Je=Qr(0);function tu(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var wh=[];function Th(){for(var n=0;n<wh.length;n++)wh[n]._workInProgressVersionPrimary=null;wh.length=0}var nu=J.ReactCurrentDispatcher,Ih=J.ReactCurrentBatchConfig,Zi=0,Ze=null,mt=null,Et=null,ru=!1,Sa=!1,Aa=0,Q0=0;function bt(){throw Error(t(321))}function Sh(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Dn(n[a],i[a]))return!1;return!0}function Ah(n,i,a,c,d,m){if(Zi=m,Ze=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,nu.current=n===null||n.memoizedState===null?Z0:eE,n=a(c,d),Sa){m=0;do{if(Sa=!1,Aa=0,25<=m)throw Error(t(301));m+=1,Et=mt=null,i.updateQueue=null,nu.current=tE,n=a(c,d)}while(Sa)}if(nu.current=ou,i=mt!==null&&mt.next!==null,Zi=0,Et=mt=Ze=null,ru=!1,i)throw Error(t(300));return n}function Rh(){var n=Aa!==0;return Aa=0,n}function Zn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Et===null?Ze.memoizedState=Et=n:Et=Et.next=n,Et}function _n(){if(mt===null){var n=Ze.alternate;n=n!==null?n.memoizedState:null}else n=mt.next;var i=Et===null?Ze.memoizedState:Et.next;if(i!==null)Et=i,mt=n;else{if(n===null)throw Error(t(310));mt=n,n={memoizedState:mt.memoizedState,baseState:mt.baseState,baseQueue:mt.baseQueue,queue:mt.queue,next:null},Et===null?Ze.memoizedState=Et=n:Et=Et.next=n}return Et}function Ra(n,i){return typeof i=="function"?i(n):i}function Ch(n){var i=_n(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=mt,d=c.baseQueue,m=a.pending;if(m!==null){if(d!==null){var v=d.next;d.next=m.next,m.next=v}c.baseQueue=d=m,a.pending=null}if(d!==null){m=d.next,c=c.baseState;var S=v=null,P=null,j=m;do{var Q=j.lane;if((Zi&Q)===Q)P!==null&&(P=P.next={lane:0,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null}),c=j.hasEagerState?j.eagerState:n(c,j.action);else{var Y={lane:Q,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null};P===null?(S=P=Y,v=c):P=P.next=Y,Ze.lanes|=Q,es|=Q}j=j.next}while(j!==null&&j!==m);P===null?v=c:P.next=S,Dn(c,i.memoizedState)||(Yt=!0),i.memoizedState=c,i.baseState=v,i.baseQueue=P,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do m=d.lane,Ze.lanes|=m,es|=m,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function Ph(n){var i=_n(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,m=i.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do m=n(m,v.action),v=v.next;while(v!==d);Dn(m,i.memoizedState)||(Yt=!0),i.memoizedState=m,i.baseQueue===null&&(i.baseState=m),a.lastRenderedState=m}return[m,c]}function Bp(){}function $p(n,i){var a=Ze,c=_n(),d=i(),m=!Dn(c.memoizedState,d);if(m&&(c.memoizedState=d,Yt=!0),c=c.queue,kh(Wp.bind(null,a,c,n),[n]),c.getSnapshot!==i||m||Et!==null&&Et.memoizedState.tag&1){if(a.flags|=2048,Ca(9,Hp.bind(null,a,c,d,i),void 0,null),wt===null)throw Error(t(349));(Zi&30)!==0||qp(a,i,d)}return d}function qp(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=Ze.updateQueue,i===null?(i={lastEffect:null,stores:null},Ze.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function Hp(n,i,a,c){i.value=a,i.getSnapshot=c,Gp(i)&&Kp(n)}function Wp(n,i,a){return a(function(){Gp(i)&&Kp(n)})}function Gp(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Dn(n,a)}catch{return!0}}function Kp(n){var i=Ir(n,1);i!==null&&Mn(i,n,1,-1)}function Qp(n){var i=Zn();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ra,lastRenderedState:n},i.queue=n,n=n.dispatch=J0.bind(null,Ze,n),[i.memoizedState,n]}function Ca(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=Ze.updateQueue,i===null?(i={lastEffect:null,stores:null},Ze.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function Yp(){return _n().memoizedState}function iu(n,i,a,c){var d=Zn();Ze.flags|=n,d.memoizedState=Ca(1|i,a,void 0,c===void 0?null:c)}function su(n,i,a,c){var d=_n();c=c===void 0?null:c;var m=void 0;if(mt!==null){var v=mt.memoizedState;if(m=v.destroy,c!==null&&Sh(c,v.deps)){d.memoizedState=Ca(i,a,m,c);return}}Ze.flags|=n,d.memoizedState=Ca(1|i,a,m,c)}function Xp(n,i){return iu(8390656,8,n,i)}function kh(n,i){return su(2048,8,n,i)}function Jp(n,i){return su(4,2,n,i)}function Zp(n,i){return su(4,4,n,i)}function em(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function tm(n,i,a){return a=a!=null?a.concat([n]):null,su(4,4,em.bind(null,i,n),a)}function xh(){}function nm(n,i){var a=_n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Sh(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function rm(n,i){var a=_n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Sh(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function im(n,i,a){return(Zi&21)===0?(n.baseState&&(n.baseState=!1,Yt=!0),n.memoizedState=a):(Dn(a,i)||(a=Bi(),Ze.lanes|=a,es|=a,n.baseState=!0),i)}function Y0(n,i){var a=Ne;Ne=a!==0&&4>a?a:4,n(!0);var c=Ih.transition;Ih.transition={};try{n(!1),i()}finally{Ne=a,Ih.transition=c}}function sm(){return _n().memoizedState}function X0(n,i,a){var c=ri(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},om(n))am(i,a);else if(a=Mp(n,i,a,c),a!==null){var d=Ht();Mn(a,n,c,d),lm(a,i,c)}}function J0(n,i,a){var c=ri(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(om(n))am(i,d);else{var m=n.alternate;if(n.lanes===0&&(m===null||m.lanes===0)&&(m=i.lastRenderedReducer,m!==null))try{var v=i.lastRenderedState,S=m(v,a);if(d.hasEagerState=!0,d.eagerState=S,Dn(S,v)){var P=i.interleaved;P===null?(d.next=d,yh(i)):(d.next=P.next,P.next=d),i.interleaved=d;return}}catch{}finally{}a=Mp(n,i,d,c),a!==null&&(d=Ht(),Mn(a,n,c,d),lm(a,i,c))}}function om(n){var i=n.alternate;return n===Ze||i!==null&&i===Ze}function am(n,i){Sa=ru=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function lm(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Br(n,a)}}var ou={readContext:yn,useCallback:bt,useContext:bt,useEffect:bt,useImperativeHandle:bt,useInsertionEffect:bt,useLayoutEffect:bt,useMemo:bt,useReducer:bt,useRef:bt,useState:bt,useDebugValue:bt,useDeferredValue:bt,useTransition:bt,useMutableSource:bt,useSyncExternalStore:bt,useId:bt,unstable_isNewReconciler:!1},Z0={readContext:yn,useCallback:function(n,i){return Zn().memoizedState=[n,i===void 0?null:i],n},useContext:yn,useEffect:Xp,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,iu(4194308,4,em.bind(null,i,n),a)},useLayoutEffect:function(n,i){return iu(4194308,4,n,i)},useInsertionEffect:function(n,i){return iu(4,2,n,i)},useMemo:function(n,i){var a=Zn();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=Zn();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=X0.bind(null,Ze,n),[c.memoizedState,n]},useRef:function(n){var i=Zn();return n={current:n},i.memoizedState=n},useState:Qp,useDebugValue:xh,useDeferredValue:function(n){return Zn().memoizedState=n},useTransition:function(){var n=Qp(!1),i=n[0];return n=Y0.bind(null,n[1]),Zn().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=Ze,d=Zn();if(Xe){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),wt===null)throw Error(t(349));(Zi&30)!==0||qp(c,i,a)}d.memoizedState=a;var m={value:a,getSnapshot:i};return d.queue=m,Xp(Wp.bind(null,c,m,n),[n]),c.flags|=2048,Ca(9,Hp.bind(null,c,m,a,i),void 0,null),a},useId:function(){var n=Zn(),i=wt.identifierPrefix;if(Xe){var a=Tr,c=wr;a=(c&~(1<<32-Bt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Aa++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=Q0++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},eE={readContext:yn,useCallback:nm,useContext:yn,useEffect:kh,useImperativeHandle:tm,useInsertionEffect:Jp,useLayoutEffect:Zp,useMemo:rm,useReducer:Ch,useRef:Yp,useState:function(){return Ch(Ra)},useDebugValue:xh,useDeferredValue:function(n){var i=_n();return im(i,mt.memoizedState,n)},useTransition:function(){var n=Ch(Ra)[0],i=_n().memoizedState;return[n,i]},useMutableSource:Bp,useSyncExternalStore:$p,useId:sm,unstable_isNewReconciler:!1},tE={readContext:yn,useCallback:nm,useContext:yn,useEffect:kh,useImperativeHandle:tm,useInsertionEffect:Jp,useLayoutEffect:Zp,useMemo:rm,useReducer:Ph,useRef:Yp,useState:function(){return Ph(Ra)},useDebugValue:xh,useDeferredValue:function(n){var i=_n();return mt===null?i.memoizedState=n:im(i,mt.memoizedState,n)},useTransition:function(){var n=Ph(Ra)[0],i=_n().memoizedState;return[n,i]},useMutableSource:Bp,useSyncExternalStore:$p,useId:sm,unstable_isNewReconciler:!1};function On(n,i){if(n&&n.defaultProps){i=ie({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function Nh(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:ie({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var au={isMounted:function(n){return(n=n._reactInternals)?An(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=Ht(),d=ri(n),m=Sr(c,d);m.payload=i,a!=null&&(m.callback=a),i=Zr(n,m,d),i!==null&&(Mn(i,n,d,c),Zl(i,n,d))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=Ht(),d=ri(n),m=Sr(c,d);m.tag=1,m.payload=i,a!=null&&(m.callback=a),i=Zr(n,m,d),i!==null&&(Mn(i,n,d,c),Zl(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=Ht(),c=ri(n),d=Sr(a,c);d.tag=2,i!=null&&(d.callback=i),i=Zr(n,d,c),i!==null&&(Mn(i,n,c,a),Zl(i,n,c))}};function um(n,i,a,c,d,m,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,m,v):i.prototype&&i.prototype.isPureReactComponent?!fa(a,c)||!fa(d,m):!0}function cm(n,i,a){var c=!1,d=Yr,m=i.contextType;return typeof m=="object"&&m!==null?m=yn(m):(d=Qt(i)?Ki:Ot.current,c=i.contextTypes,m=(c=c!=null)?Xs(n,d):Yr),i=new i(a,m),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=au,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=m),i}function hm(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&au.enqueueReplaceState(i,i.state,null)}function Dh(n,i,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},_h(n);var m=i.contextType;typeof m=="object"&&m!==null?d.context=yn(m):(m=Qt(i)?Ki:Ot.current,d.context=Xs(n,m)),d.state=n.memoizedState,m=i.getDerivedStateFromProps,typeof m=="function"&&(Nh(n,i,m,a),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&au.enqueueReplaceState(d,d.state,null),eu(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function so(n,i){try{var a="",c=i;do a+=Re(c),c=c.return;while(c);var d=a}catch(m){d=`
Error generating stack: `+m.message+`
`+m.stack}return{value:n,source:i,stack:d,digest:null}}function Vh(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function Oh(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var nE=typeof WeakMap=="function"?WeakMap:Map;function dm(n,i,a){a=Sr(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){pu||(pu=!0,Qh=c),Oh(n,i)},a}function fm(n,i,a){a=Sr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=i.value;a.payload=function(){return c(d)},a.callback=function(){Oh(n,i)}}var m=n.stateNode;return m!==null&&typeof m.componentDidCatch=="function"&&(a.callback=function(){Oh(n,i),typeof c!="function"&&(ti===null?ti=new Set([this]):ti.add(this));var v=i.stack;this.componentDidCatch(i.value,{componentStack:v!==null?v:""})}),a}function pm(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new nE;var d=new Set;c.set(i,d)}else d=c.get(i),d===void 0&&(d=new Set,c.set(i,d));d.has(a)||(d.add(a),n=gE.bind(null,n,i,a),i.then(n,n))}function mm(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function gm(n,i,a,c,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Sr(-1,1),i.tag=2,Zr(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var rE=J.ReactCurrentOwner,Yt=!1;function qt(n,i,a,c){i.child=n===null?Lp(i,null,a,c):to(i,n.child,a,c)}function ym(n,i,a,c,d){a=a.render;var m=i.ref;return ro(i,d),c=Ah(n,i,a,c,m,d),a=Rh(),n!==null&&!Yt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Ar(n,i,d)):(Xe&&a&&lh(i),i.flags|=1,qt(n,i,c,d),i.child)}function _m(n,i,a,c,d){if(n===null){var m=a.type;return typeof m=="function"&&!nd(m)&&m.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=m,vm(n,i,m,c,d)):(n=Eu(a.type,null,c,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(m=n.child,(n.lanes&d)===0){var v=m.memoizedProps;if(a=a.compare,a=a!==null?a:fa,a(v,c)&&n.ref===i.ref)return Ar(n,i,d)}return i.flags|=1,n=si(m,c),n.ref=i.ref,n.return=i,i.child=n}function vm(n,i,a,c,d){if(n!==null){var m=n.memoizedProps;if(fa(m,c)&&n.ref===i.ref)if(Yt=!1,i.pendingProps=c=m,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Yt=!0);else return i.lanes=n.lanes,Ar(n,i,d)}return bh(n,i,a,c,d)}function Em(n,i,a){var c=i.pendingProps,d=c.children,m=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},He(ao,un),un|=a;else{if((a&1073741824)===0)return n=m!==null?m.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,He(ao,un),un|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=m!==null?m.baseLanes:a,He(ao,un),un|=c}else m!==null?(c=m.baseLanes|a,i.memoizedState=null):c=a,He(ao,un),un|=c;return qt(n,i,d,a),i.child}function wm(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function bh(n,i,a,c,d){var m=Qt(a)?Ki:Ot.current;return m=Xs(i,m),ro(i,d),a=Ah(n,i,a,c,m,d),c=Rh(),n!==null&&!Yt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Ar(n,i,d)):(Xe&&c&&lh(i),i.flags|=1,qt(n,i,a,d),i.child)}function Tm(n,i,a,c,d){if(Qt(a)){var m=!0;Hl(i)}else m=!1;if(ro(i,d),i.stateNode===null)uu(n,i),cm(i,a,c),Dh(i,a,c,d),c=!0;else if(n===null){var v=i.stateNode,S=i.memoizedProps;v.props=S;var P=v.context,j=a.contextType;typeof j=="object"&&j!==null?j=yn(j):(j=Qt(a)?Ki:Ot.current,j=Xs(i,j));var Q=a.getDerivedStateFromProps,Y=typeof Q=="function"||typeof v.getSnapshotBeforeUpdate=="function";Y||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==c||P!==j)&&hm(i,v,c,j),Jr=!1;var K=i.memoizedState;v.state=K,eu(i,c,v,d),P=i.memoizedState,S!==c||K!==P||Kt.current||Jr?(typeof Q=="function"&&(Nh(i,a,Q,c),P=i.memoizedState),(S=Jr||um(i,a,S,c,K,P,j))?(Y||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(i.flags|=4194308)):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=P),v.props=c,v.state=P,v.context=j,c=S):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{v=i.stateNode,Fp(n,i),S=i.memoizedProps,j=i.type===i.elementType?S:On(i.type,S),v.props=j,Y=i.pendingProps,K=v.context,P=a.contextType,typeof P=="object"&&P!==null?P=yn(P):(P=Qt(a)?Ki:Ot.current,P=Xs(i,P));var ne=a.getDerivedStateFromProps;(Q=typeof ne=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==Y||K!==P)&&hm(i,v,c,P),Jr=!1,K=i.memoizedState,v.state=K,eu(i,c,v,d);var oe=i.memoizedState;S!==Y||K!==oe||Kt.current||Jr?(typeof ne=="function"&&(Nh(i,a,ne,c),oe=i.memoizedState),(j=Jr||um(i,a,j,c,K,oe,P)||!1)?(Q||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,oe,P),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,oe,P)),typeof v.componentDidUpdate=="function"&&(i.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=oe),v.props=c,v.state=oe,v.context=P,c=j):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),c=!1)}return Lh(n,i,a,c,m,d)}function Lh(n,i,a,c,d,m){wm(n,i);var v=(i.flags&128)!==0;if(!c&&!v)return d&&Cp(i,a,!1),Ar(n,i,m);c=i.stateNode,rE.current=i;var S=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&v?(i.child=to(i,n.child,null,m),i.child=to(i,null,S,m)):qt(n,i,S,m),i.memoizedState=c.state,d&&Cp(i,a,!0),i.child}function Im(n){var i=n.stateNode;i.pendingContext?Ap(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Ap(n,i.context,!1),vh(n,i.containerInfo)}function Sm(n,i,a,c,d){return eo(),dh(d),i.flags|=256,qt(n,i,a,c),i.child}var Mh={dehydrated:null,treeContext:null,retryLane:0};function Fh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Am(n,i,a){var c=i.pendingProps,d=Je.current,m=!1,v=(i.flags&128)!==0,S;if((S=v)||(S=n!==null&&n.memoizedState===null?!1:(d&2)!==0),S?(m=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),He(Je,d&1),n===null)return hh(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(v=c.children,n=c.fallback,m?(c=i.mode,m=i.child,v={mode:"hidden",children:v},(c&1)===0&&m!==null?(m.childLanes=0,m.pendingProps=v):m=wu(v,c,0,null),n=is(n,c,a,null),m.return=i,n.return=i,m.sibling=n,i.child=m,i.child.memoizedState=Fh(a),i.memoizedState=Mh,n):Uh(i,v));if(d=n.memoizedState,d!==null&&(S=d.dehydrated,S!==null))return iE(n,i,v,c,S,d,a);if(m){m=c.fallback,v=i.mode,d=n.child,S=d.sibling;var P={mode:"hidden",children:c.children};return(v&1)===0&&i.child!==d?(c=i.child,c.childLanes=0,c.pendingProps=P,i.deletions=null):(c=si(d,P),c.subtreeFlags=d.subtreeFlags&14680064),S!==null?m=si(S,m):(m=is(m,v,a,null),m.flags|=2),m.return=i,c.return=i,c.sibling=m,i.child=c,c=m,m=i.child,v=n.child.memoizedState,v=v===null?Fh(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},m.memoizedState=v,m.childLanes=n.childLanes&~a,i.memoizedState=Mh,c}return m=n.child,n=m.sibling,c=si(m,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function Uh(n,i){return i=wu({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function lu(n,i,a,c){return c!==null&&dh(c),to(i,n.child,null,a),n=Uh(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function iE(n,i,a,c,d,m,v){if(a)return i.flags&256?(i.flags&=-257,c=Vh(Error(t(422))),lu(n,i,v,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(m=c.fallback,d=i.mode,c=wu({mode:"visible",children:c.children},d,0,null),m=is(m,d,v,null),m.flags|=2,c.return=i,m.return=i,c.sibling=m,i.child=c,(i.mode&1)!==0&&to(i,n.child,null,v),i.child.memoizedState=Fh(v),i.memoizedState=Mh,m);if((i.mode&1)===0)return lu(n,i,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var S=c.dgst;return c=S,m=Error(t(419)),c=Vh(m,c,void 0),lu(n,i,v,c)}if(S=(v&n.childLanes)!==0,Yt||S){if(c=wt,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==m.retryLane&&(m.retryLane=d,Ir(n,d),Mn(c,n,d,-1))}return td(),c=Vh(Error(t(421))),lu(n,i,v,c)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=yE.bind(null,n),d._reactRetry=i,null):(n=m.treeContext,ln=Kr(d.nextSibling),an=i,Xe=!0,Vn=null,n!==null&&(mn[gn++]=wr,mn[gn++]=Tr,mn[gn++]=Qi,wr=n.id,Tr=n.overflow,Qi=i),i=Uh(i,c.children),i.flags|=4096,i)}function Rm(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),gh(n.return,i,a)}function jh(n,i,a,c,d){var m=n.memoizedState;m===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(m.isBackwards=i,m.rendering=null,m.renderingStartTime=0,m.last=c,m.tail=a,m.tailMode=d)}function Cm(n,i,a){var c=i.pendingProps,d=c.revealOrder,m=c.tail;if(qt(n,i,c.children,a),c=Je.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Rm(n,a,i);else if(n.tag===19)Rm(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(He(Je,c),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(a=i.child,d=null;a!==null;)n=a.alternate,n!==null&&tu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=i.child,i.child=null):(d=a.sibling,a.sibling=null),jh(i,!1,d,a,m);break;case"backwards":for(a=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&tu(n)===null){i.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}jh(i,!0,a,null,m);break;case"together":jh(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function uu(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ar(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),es|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=si(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=si(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function sE(n,i,a){switch(i.tag){case 3:Im(i),eo();break;case 5:zp(i);break;case 1:Qt(i.type)&&Hl(i);break;case 4:vh(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,d=i.memoizedProps.value;He(Xl,c._currentValue),c._currentValue=d;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(He(Je,Je.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Am(n,i,a):(He(Je,Je.current&1),n=Ar(n,i,a),n!==null?n.sibling:null);He(Je,Je.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Cm(n,i,a);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),He(Je,Je.current),c)break;return null;case 22:case 23:return i.lanes=0,Em(n,i,a)}return Ar(n,i,a)}var Pm,zh,km,xm;Pm=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},zh=function(){},km=function(n,i,a,c){var d=n.memoizedProps;if(d!==c){n=i.stateNode,Ji(Jn.current);var m=null;switch(a){case"input":d=Ni(n,d),c=Ni(n,c),m=[];break;case"select":d=ie({},d,{value:void 0}),c=ie({},c,{value:void 0}),m=[];break;case"textarea":d=Bo(n,d),c=Bo(n,c),m=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=Bl)}Ko(a,c);var v;a=null;for(j in d)if(!c.hasOwnProperty(j)&&d.hasOwnProperty(j)&&d[j]!=null)if(j==="style"){var S=d[j];for(v in S)S.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else j!=="dangerouslySetInnerHTML"&&j!=="children"&&j!=="suppressContentEditableWarning"&&j!=="suppressHydrationWarning"&&j!=="autoFocus"&&(o.hasOwnProperty(j)?m||(m=[]):(m=m||[]).push(j,null));for(j in c){var P=c[j];if(S=d!=null?d[j]:void 0,c.hasOwnProperty(j)&&P!==S&&(P!=null||S!=null))if(j==="style")if(S){for(v in S)!S.hasOwnProperty(v)||P&&P.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in P)P.hasOwnProperty(v)&&S[v]!==P[v]&&(a||(a={}),a[v]=P[v])}else a||(m||(m=[]),m.push(j,a)),a=P;else j==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,S=S?S.__html:void 0,P!=null&&S!==P&&(m=m||[]).push(j,P)):j==="children"?typeof P!="string"&&typeof P!="number"||(m=m||[]).push(j,""+P):j!=="suppressContentEditableWarning"&&j!=="suppressHydrationWarning"&&(o.hasOwnProperty(j)?(P!=null&&j==="onScroll"&&Ge("scroll",n),m||S===P||(m=[])):(m=m||[]).push(j,P))}a&&(m=m||[]).push("style",a);var j=m;(i.updateQueue=j)&&(i.flags|=4)}},xm=function(n,i,a,c){a!==c&&(i.flags|=4)};function Pa(n,i){if(!Xe)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Lt(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function oE(n,i,a){var c=i.pendingProps;switch(uh(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Lt(i),null;case 1:return Qt(i.type)&&ql(),Lt(i),null;case 3:return c=i.stateNode,io(),Ke(Kt),Ke(Ot),Th(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Ql(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Vn!==null&&(Jh(Vn),Vn=null))),zh(n,i),Lt(i),null;case 5:Eh(i);var d=Ji(Ia.current);if(a=i.type,n!==null&&i.stateNode!=null)km(n,i,a,c,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return Lt(i),null}if(n=Ji(Jn.current),Ql(i)){c=i.stateNode,a=i.type;var m=i.memoizedProps;switch(c[Xn]=i,c[_a]=m,n=(i.mode&1)!==0,a){case"dialog":Ge("cancel",c),Ge("close",c);break;case"iframe":case"object":case"embed":Ge("load",c);break;case"video":case"audio":for(d=0;d<ma.length;d++)Ge(ma[d],c);break;case"source":Ge("error",c);break;case"img":case"image":case"link":Ge("error",c),Ge("load",c);break;case"details":Ge("toggle",c);break;case"input":vs(c,m),Ge("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!m.multiple},Ge("invalid",c);break;case"textarea":ws(c,m),Ge("invalid",c)}Ko(a,m),d=null;for(var v in m)if(m.hasOwnProperty(v)){var S=m[v];v==="children"?typeof S=="string"?c.textContent!==S&&(m.suppressHydrationWarning!==!0&&zl(c.textContent,S,n),d=["children",S]):typeof S=="number"&&c.textContent!==""+S&&(m.suppressHydrationWarning!==!0&&zl(c.textContent,S,n),d=["children",""+S]):o.hasOwnProperty(v)&&S!=null&&v==="onScroll"&&Ge("scroll",c)}switch(a){case"input":ur(c),fl(c,m,!0);break;case"textarea":ur(c),$o(c);break;case"select":case"option":break;default:typeof m.onClick=="function"&&(c.onclick=Bl)}c=d,i.updateQueue=c,c!==null&&(i.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=dt(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[Xn]=i,n[_a]=c,Pm(n,i,!1,!1),i.stateNode=n;e:{switch(v=Qo(a,c),a){case"dialog":Ge("cancel",n),Ge("close",n),d=c;break;case"iframe":case"object":case"embed":Ge("load",n),d=c;break;case"video":case"audio":for(d=0;d<ma.length;d++)Ge(ma[d],n);d=c;break;case"source":Ge("error",n),d=c;break;case"img":case"image":case"link":Ge("error",n),Ge("load",n),d=c;break;case"details":Ge("toggle",n),d=c;break;case"input":vs(n,c),d=Ni(n,c),Ge("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=ie({},c,{value:void 0}),Ge("invalid",n);break;case"textarea":ws(n,c),d=Bo(n,c),Ge("invalid",n);break;default:d=c}Ko(a,d),S=d;for(m in S)if(S.hasOwnProperty(m)){var P=S[m];m==="style"?Wo(n,P):m==="dangerouslySetInnerHTML"?(P=P?P.__html:void 0,P!=null&&qo(n,P)):m==="children"?typeof P=="string"?(a!=="textarea"||P!=="")&&Mr(n,P):typeof P=="number"&&Mr(n,""+P):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(o.hasOwnProperty(m)?P!=null&&m==="onScroll"&&Ge("scroll",n):P!=null&&pe(n,m,P,v))}switch(a){case"input":ur(n),fl(n,c,!1);break;case"textarea":ur(n),$o(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Fe(c.value));break;case"select":n.multiple=!!c.multiple,m=c.value,m!=null?hr(n,!!c.multiple,m,!1):c.defaultValue!=null&&hr(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=Bl)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Lt(i),null;case 6:if(n&&i.stateNode!=null)xm(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Ji(Ia.current),Ji(Jn.current),Ql(i)){if(c=i.stateNode,a=i.memoizedProps,c[Xn]=i,(m=c.nodeValue!==a)&&(n=an,n!==null))switch(n.tag){case 3:zl(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&zl(c.nodeValue,a,(n.mode&1)!==0)}m&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[Xn]=i,i.stateNode=c}return Lt(i),null;case 13:if(Ke(Je),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Xe&&ln!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Vp(),eo(),i.flags|=98560,m=!1;else if(m=Ql(i),c!==null&&c.dehydrated!==null){if(n===null){if(!m)throw Error(t(318));if(m=i.memoizedState,m=m!==null?m.dehydrated:null,!m)throw Error(t(317));m[Xn]=i}else eo(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Lt(i),m=!1}else Vn!==null&&(Jh(Vn),Vn=null),m=!0;if(!m)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Je.current&1)!==0?gt===0&&(gt=3):td())),i.updateQueue!==null&&(i.flags|=4),Lt(i),null);case 4:return io(),zh(n,i),n===null&&ga(i.stateNode.containerInfo),Lt(i),null;case 10:return mh(i.type._context),Lt(i),null;case 17:return Qt(i.type)&&ql(),Lt(i),null;case 19:if(Ke(Je),m=i.memoizedState,m===null)return Lt(i),null;if(c=(i.flags&128)!==0,v=m.rendering,v===null)if(c)Pa(m,!1);else{if(gt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(v=tu(n),v!==null){for(i.flags|=128,Pa(m,!1),c=v.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)m=a,n=c,m.flags&=14680066,v=m.alternate,v===null?(m.childLanes=0,m.lanes=n,m.child=null,m.subtreeFlags=0,m.memoizedProps=null,m.memoizedState=null,m.updateQueue=null,m.dependencies=null,m.stateNode=null):(m.childLanes=v.childLanes,m.lanes=v.lanes,m.child=v.child,m.subtreeFlags=0,m.deletions=null,m.memoizedProps=v.memoizedProps,m.memoizedState=v.memoizedState,m.updateQueue=v.updateQueue,m.type=v.type,n=v.dependencies,m.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return He(Je,Je.current&1|2),i.child}n=n.sibling}m.tail!==null&&qe()>lo&&(i.flags|=128,c=!0,Pa(m,!1),i.lanes=4194304)}else{if(!c)if(n=tu(v),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Pa(m,!0),m.tail===null&&m.tailMode==="hidden"&&!v.alternate&&!Xe)return Lt(i),null}else 2*qe()-m.renderingStartTime>lo&&a!==1073741824&&(i.flags|=128,c=!0,Pa(m,!1),i.lanes=4194304);m.isBackwards?(v.sibling=i.child,i.child=v):(a=m.last,a!==null?a.sibling=v:i.child=v,m.last=v)}return m.tail!==null?(i=m.tail,m.rendering=i,m.tail=i.sibling,m.renderingStartTime=qe(),i.sibling=null,a=Je.current,He(Je,c?a&1|2:a&1),i):(Lt(i),null);case 22:case 23:return ed(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(un&1073741824)!==0&&(Lt(i),i.subtreeFlags&6&&(i.flags|=8192)):Lt(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function aE(n,i){switch(uh(i),i.tag){case 1:return Qt(i.type)&&ql(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return io(),Ke(Kt),Ke(Ot),Th(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Eh(i),null;case 13:if(Ke(Je),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));eo()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Ke(Je),null;case 4:return io(),null;case 10:return mh(i.type._context),null;case 22:case 23:return ed(),null;case 24:return null;default:return null}}var cu=!1,Mt=!1,lE=typeof WeakSet=="function"?WeakSet:Set,se=null;function oo(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){tt(n,i,c)}else a.current=null}function Bh(n,i,a){try{a()}catch(c){tt(n,i,c)}}var Nm=!1;function uE(n,i){if(eh=Hr,n=up(),Wc(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,m=c.focusNode;c=c.focusOffset;try{a.nodeType,m.nodeType}catch{a=null;break e}var v=0,S=-1,P=-1,j=0,Q=0,Y=n,K=null;t:for(;;){for(var ne;Y!==a||d!==0&&Y.nodeType!==3||(S=v+d),Y!==m||c!==0&&Y.nodeType!==3||(P=v+c),Y.nodeType===3&&(v+=Y.nodeValue.length),(ne=Y.firstChild)!==null;)K=Y,Y=ne;for(;;){if(Y===n)break t;if(K===a&&++j===d&&(S=v),K===m&&++Q===c&&(P=v),(ne=Y.nextSibling)!==null)break;Y=K,K=Y.parentNode}Y=ne}a=S===-1||P===-1?null:{start:S,end:P}}else a=null}a=a||{start:0,end:0}}else a=null;for(th={focusedElem:n,selectionRange:a},Hr=!1,se=i;se!==null;)if(i=se,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,se=n;else for(;se!==null;){i=se;try{var oe=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(oe!==null){var ae=oe.memoizedProps,st=oe.memoizedState,L=i.stateNode,N=L.getSnapshotBeforeUpdate(i.elementType===i.type?ae:On(i.type,ae),st);L.__reactInternalSnapshotBeforeUpdate=N}break;case 3:var M=i.stateNode.containerInfo;M.nodeType===1?M.textContent="":M.nodeType===9&&M.documentElement&&M.removeChild(M.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(X){tt(i,i.return,X)}if(n=i.sibling,n!==null){n.return=i.return,se=n;break}se=i.return}return oe=Nm,Nm=!1,oe}function ka(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var m=d.destroy;d.destroy=void 0,m!==void 0&&Bh(i,a,m)}d=d.next}while(d!==c)}}function hu(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function $h(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Dm(n){var i=n.alternate;i!==null&&(n.alternate=null,Dm(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[Xn],delete i[_a],delete i[sh],delete i[H0],delete i[W0])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Vm(n){return n.tag===5||n.tag===3||n.tag===4}function Om(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Vm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function qh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=Bl));else if(c!==4&&(n=n.child,n!==null))for(qh(n,i,a),n=n.sibling;n!==null;)qh(n,i,a),n=n.sibling}function Hh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Hh(n,i,a),n=n.sibling;n!==null;)Hh(n,i,a),n=n.sibling}var Ct=null,bn=!1;function ei(n,i,a){for(a=a.child;a!==null;)bm(n,i,a),a=a.sibling}function bm(n,i,a){if(nn&&typeof nn.onCommitFiberUnmount=="function")try{nn.onCommitFiberUnmount(ji,a)}catch{}switch(a.tag){case 5:Mt||oo(a,i);case 6:var c=Ct,d=bn;Ct=null,ei(n,i,a),Ct=c,bn=d,Ct!==null&&(bn?(n=Ct,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Ct.removeChild(a.stateNode));break;case 18:Ct!==null&&(bn?(n=Ct,a=a.stateNode,n.nodeType===8?ih(n.parentNode,a):n.nodeType===1&&ih(n,a),xn(n)):ih(Ct,a.stateNode));break;case 4:c=Ct,d=bn,Ct=a.stateNode.containerInfo,bn=!0,ei(n,i,a),Ct=c,bn=d;break;case 0:case 11:case 14:case 15:if(!Mt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var m=d,v=m.destroy;m=m.tag,v!==void 0&&((m&2)!==0||(m&4)!==0)&&Bh(a,i,v),d=d.next}while(d!==c)}ei(n,i,a);break;case 1:if(!Mt&&(oo(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(S){tt(a,i,S)}ei(n,i,a);break;case 21:ei(n,i,a);break;case 22:a.mode&1?(Mt=(c=Mt)||a.memoizedState!==null,ei(n,i,a),Mt=c):ei(n,i,a);break;default:ei(n,i,a)}}function Lm(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new lE),i.forEach(function(c){var d=_E.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Ln(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var m=n,v=i,S=v;e:for(;S!==null;){switch(S.tag){case 5:Ct=S.stateNode,bn=!1;break e;case 3:Ct=S.stateNode.containerInfo,bn=!0;break e;case 4:Ct=S.stateNode.containerInfo,bn=!0;break e}S=S.return}if(Ct===null)throw Error(t(160));bm(m,v,d),Ct=null,bn=!1;var P=d.alternate;P!==null&&(P.return=null),d.return=null}catch(j){tt(d,i,j)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Mm(i,n),i=i.sibling}function Mm(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Ln(i,n),er(n),c&4){try{ka(3,n,n.return),hu(3,n)}catch(ae){tt(n,n.return,ae)}try{ka(5,n,n.return)}catch(ae){tt(n,n.return,ae)}}break;case 1:Ln(i,n),er(n),c&512&&a!==null&&oo(a,a.return);break;case 5:if(Ln(i,n),er(n),c&512&&a!==null&&oo(a,a.return),n.flags&32){var d=n.stateNode;try{Mr(d,"")}catch(ae){tt(n,n.return,ae)}}if(c&4&&(d=n.stateNode,d!=null)){var m=n.memoizedProps,v=a!==null?a.memoizedProps:m,S=n.type,P=n.updateQueue;if(n.updateQueue=null,P!==null)try{S==="input"&&m.type==="radio"&&m.name!=null&&jo(d,m),Qo(S,v);var j=Qo(S,m);for(v=0;v<P.length;v+=2){var Q=P[v],Y=P[v+1];Q==="style"?Wo(d,Y):Q==="dangerouslySetInnerHTML"?qo(d,Y):Q==="children"?Mr(d,Y):pe(d,Q,Y,j)}switch(S){case"input":zo(d,m);break;case"textarea":Ts(d,m);break;case"select":var K=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!m.multiple;var ne=m.value;ne!=null?hr(d,!!m.multiple,ne,!1):K!==!!m.multiple&&(m.defaultValue!=null?hr(d,!!m.multiple,m.defaultValue,!0):hr(d,!!m.multiple,m.multiple?[]:"",!1))}d[_a]=m}catch(ae){tt(n,n.return,ae)}}break;case 6:if(Ln(i,n),er(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,m=n.memoizedProps;try{d.nodeValue=m}catch(ae){tt(n,n.return,ae)}}break;case 3:if(Ln(i,n),er(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{xn(i.containerInfo)}catch(ae){tt(n,n.return,ae)}break;case 4:Ln(i,n),er(n);break;case 13:Ln(i,n),er(n),d=n.child,d.flags&8192&&(m=d.memoizedState!==null,d.stateNode.isHidden=m,!m||d.alternate!==null&&d.alternate.memoizedState!==null||(Kh=qe())),c&4&&Lm(n);break;case 22:if(Q=a!==null&&a.memoizedState!==null,n.mode&1?(Mt=(j=Mt)||Q,Ln(i,n),Mt=j):Ln(i,n),er(n),c&8192){if(j=n.memoizedState!==null,(n.stateNode.isHidden=j)&&!Q&&(n.mode&1)!==0)for(se=n,Q=n.child;Q!==null;){for(Y=se=Q;se!==null;){switch(K=se,ne=K.child,K.tag){case 0:case 11:case 14:case 15:ka(4,K,K.return);break;case 1:oo(K,K.return);var oe=K.stateNode;if(typeof oe.componentWillUnmount=="function"){c=K,a=K.return;try{i=c,oe.props=i.memoizedProps,oe.state=i.memoizedState,oe.componentWillUnmount()}catch(ae){tt(c,a,ae)}}break;case 5:oo(K,K.return);break;case 22:if(K.memoizedState!==null){jm(Y);continue}}ne!==null?(ne.return=K,se=ne):jm(Y)}Q=Q.sibling}e:for(Q=null,Y=n;;){if(Y.tag===5){if(Q===null){Q=Y;try{d=Y.stateNode,j?(m=d.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none"):(S=Y.stateNode,P=Y.memoizedProps.style,v=P!=null&&P.hasOwnProperty("display")?P.display:null,S.style.display=Ho("display",v))}catch(ae){tt(n,n.return,ae)}}}else if(Y.tag===6){if(Q===null)try{Y.stateNode.nodeValue=j?"":Y.memoizedProps}catch(ae){tt(n,n.return,ae)}}else if((Y.tag!==22&&Y.tag!==23||Y.memoizedState===null||Y===n)&&Y.child!==null){Y.child.return=Y,Y=Y.child;continue}if(Y===n)break e;for(;Y.sibling===null;){if(Y.return===null||Y.return===n)break e;Q===Y&&(Q=null),Y=Y.return}Q===Y&&(Q=null),Y.sibling.return=Y.return,Y=Y.sibling}}break;case 19:Ln(i,n),er(n),c&4&&Lm(n);break;case 21:break;default:Ln(i,n),er(n)}}function er(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(Vm(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Mr(d,""),c.flags&=-33);var m=Om(n);Hh(n,m,d);break;case 3:case 4:var v=c.stateNode.containerInfo,S=Om(n);qh(n,S,v);break;default:throw Error(t(161))}}catch(P){tt(n,n.return,P)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function cE(n,i,a){se=n,Fm(n)}function Fm(n,i,a){for(var c=(n.mode&1)!==0;se!==null;){var d=se,m=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||cu;if(!v){var S=d.alternate,P=S!==null&&S.memoizedState!==null||Mt;S=cu;var j=Mt;if(cu=v,(Mt=P)&&!j)for(se=d;se!==null;)v=se,P=v.child,v.tag===22&&v.memoizedState!==null?zm(d):P!==null?(P.return=v,se=P):zm(d);for(;m!==null;)se=m,Fm(m),m=m.sibling;se=d,cu=S,Mt=j}Um(n)}else(d.subtreeFlags&8772)!==0&&m!==null?(m.return=d,se=m):Um(n)}}function Um(n){for(;se!==null;){var i=se;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:Mt||hu(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!Mt)if(a===null)c.componentDidMount();else{var d=i.elementType===i.type?a.memoizedProps:On(i.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var m=i.updateQueue;m!==null&&jp(i,m,c);break;case 3:var v=i.updateQueue;if(v!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}jp(i,v,a)}break;case 5:var S=i.stateNode;if(a===null&&i.flags&4){a=S;var P=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":P.autoFocus&&a.focus();break;case"img":P.src&&(a.src=P.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var j=i.alternate;if(j!==null){var Q=j.memoizedState;if(Q!==null){var Y=Q.dehydrated;Y!==null&&xn(Y)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Mt||i.flags&512&&$h(i)}catch(K){tt(i,i.return,K)}}if(i===n){se=null;break}if(a=i.sibling,a!==null){a.return=i.return,se=a;break}se=i.return}}function jm(n){for(;se!==null;){var i=se;if(i===n){se=null;break}var a=i.sibling;if(a!==null){a.return=i.return,se=a;break}se=i.return}}function zm(n){for(;se!==null;){var i=se;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{hu(4,i)}catch(P){tt(i,a,P)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var d=i.return;try{c.componentDidMount()}catch(P){tt(i,d,P)}}var m=i.return;try{$h(i)}catch(P){tt(i,m,P)}break;case 5:var v=i.return;try{$h(i)}catch(P){tt(i,v,P)}}}catch(P){tt(i,i.return,P)}if(i===n){se=null;break}var S=i.sibling;if(S!==null){S.return=i.return,se=S;break}se=i.return}}var hE=Math.ceil,du=J.ReactCurrentDispatcher,Wh=J.ReactCurrentOwner,vn=J.ReactCurrentBatchConfig,be=0,wt=null,lt=null,Pt=0,un=0,ao=Qr(0),gt=0,xa=null,es=0,fu=0,Gh=0,Na=null,Xt=null,Kh=0,lo=1/0,Rr=null,pu=!1,Qh=null,ti=null,mu=!1,ni=null,gu=0,Da=0,Yh=null,yu=-1,_u=0;function Ht(){return(be&6)!==0?qe():yu!==-1?yu:yu=qe()}function ri(n){return(n.mode&1)===0?1:(be&2)!==0&&Pt!==0?Pt&-Pt:K0.transition!==null?(_u===0&&(_u=Bi()),_u):(n=Ne,n!==0||(n=window.event,n=n===void 0?16:oa(n.type)),n)}function Mn(n,i,a,c){if(50<Da)throw Da=0,Yh=null,Error(t(185));zr(n,a,c),((be&2)===0||n!==wt)&&(n===wt&&((be&2)===0&&(fu|=a),gt===4&&ii(n,Pt)),Jt(n,c),a===1&&be===0&&(i.mode&1)===0&&(lo=qe()+500,Wl&&Xr()))}function Jt(n,i){var a=n.callbackNode;pr(n,i);var c=zi(n,n===wt?Pt:0);if(c===0)a!==null&&ta(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&ta(a),i===1)n.tag===0?G0($m.bind(null,n)):Pp($m.bind(null,n)),$0(function(){(be&6)===0&&Xr()}),a=null;else{switch($r(c)){case 1:a=Ui;break;case 4:a=Fr;break;case 16:a=dn;break;case 536870912:a=_l;break;default:a=dn}a=Xm(a,Bm.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function Bm(n,i){if(yu=-1,_u=0,(be&6)!==0)throw Error(t(327));var a=n.callbackNode;if(uo()&&n.callbackNode!==a)return null;var c=zi(n,n===wt?Pt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=vu(n,c);else{i=c;var d=be;be|=2;var m=Hm();(wt!==n||Pt!==i)&&(Rr=null,lo=qe()+500,ns(n,i));do try{pE();break}catch(S){qm(n,S)}while(!0);ph(),du.current=m,be=d,lt!==null?i=0:(wt=null,Pt=0,i=gt)}if(i!==0){if(i===2&&(d=rn(n),d!==0&&(c=d,i=Xh(n,d))),i===1)throw a=xa,ns(n,0),ii(n,c),Jt(n,qe()),a;if(i===6)ii(n,c);else{if(d=n.current.alternate,(c&30)===0&&!dE(d)&&(i=vu(n,c),i===2&&(m=rn(n),m!==0&&(c=m,i=Xh(n,m))),i===1))throw a=xa,ns(n,0),ii(n,c),Jt(n,qe()),a;switch(n.finishedWork=d,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:rs(n,Xt,Rr);break;case 3:if(ii(n,c),(c&130023424)===c&&(i=Kh+500-qe(),10<i)){if(zi(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Ht(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=rh(rs.bind(null,n,Xt,Rr),i);break}rs(n,Xt,Rr);break;case 4:if(ii(n,c),(c&4194240)===c)break;for(i=n.eventTimes,d=-1;0<c;){var v=31-Bt(c);m=1<<v,v=i[v],v>d&&(d=v),c&=~m}if(c=d,c=qe()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*hE(c/1960))-c,10<c){n.timeoutHandle=rh(rs.bind(null,n,Xt,Rr),c);break}rs(n,Xt,Rr);break;case 5:rs(n,Xt,Rr);break;default:throw Error(t(329))}}}return Jt(n,qe()),n.callbackNode===a?Bm.bind(null,n):null}function Xh(n,i){var a=Na;return n.current.memoizedState.isDehydrated&&(ns(n,i).flags|=256),n=vu(n,i),n!==2&&(i=Xt,Xt=a,i!==null&&Jh(i)),n}function Jh(n){Xt===null?Xt=n:Xt.push.apply(Xt,n)}function dE(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],m=d.getSnapshot;d=d.value;try{if(!Dn(m(),d))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function ii(n,i){for(i&=~Gh,i&=~fu,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Bt(i),c=1<<a;n[a]=-1,i&=~c}}function $m(n){if((be&6)!==0)throw Error(t(327));uo();var i=zi(n,0);if((i&1)===0)return Jt(n,qe()),null;var a=vu(n,i);if(n.tag!==0&&a===2){var c=rn(n);c!==0&&(i=c,a=Xh(n,c))}if(a===1)throw a=xa,ns(n,0),ii(n,i),Jt(n,qe()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,rs(n,Xt,Rr),Jt(n,qe()),null}function Zh(n,i){var a=be;be|=1;try{return n(i)}finally{be=a,be===0&&(lo=qe()+500,Wl&&Xr())}}function ts(n){ni!==null&&ni.tag===0&&(be&6)===0&&uo();var i=be;be|=1;var a=vn.transition,c=Ne;try{if(vn.transition=null,Ne=1,n)return n()}finally{Ne=c,vn.transition=a,be=i,(be&6)===0&&Xr()}}function ed(){un=ao.current,Ke(ao)}function ns(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,B0(a)),lt!==null)for(a=lt.return;a!==null;){var c=a;switch(uh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&ql();break;case 3:io(),Ke(Kt),Ke(Ot),Th();break;case 5:Eh(c);break;case 4:io();break;case 13:Ke(Je);break;case 19:Ke(Je);break;case 10:mh(c.type._context);break;case 22:case 23:ed()}a=a.return}if(wt=n,lt=n=si(n.current,null),Pt=un=i,gt=0,xa=null,Gh=fu=es=0,Xt=Na=null,Xi!==null){for(i=0;i<Xi.length;i++)if(a=Xi[i],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,m=a.pending;if(m!==null){var v=m.next;m.next=d,c.next=v}a.pending=c}Xi=null}return n}function qm(n,i){do{var a=lt;try{if(ph(),nu.current=ou,ru){for(var c=Ze.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}ru=!1}if(Zi=0,Et=mt=Ze=null,Sa=!1,Aa=0,Wh.current=null,a===null||a.return===null){gt=1,xa=i,lt=null;break}e:{var m=n,v=a.return,S=a,P=i;if(i=Pt,S.flags|=32768,P!==null&&typeof P=="object"&&typeof P.then=="function"){var j=P,Q=S,Y=Q.tag;if((Q.mode&1)===0&&(Y===0||Y===11||Y===15)){var K=Q.alternate;K?(Q.updateQueue=K.updateQueue,Q.memoizedState=K.memoizedState,Q.lanes=K.lanes):(Q.updateQueue=null,Q.memoizedState=null)}var ne=mm(v);if(ne!==null){ne.flags&=-257,gm(ne,v,S,m,i),ne.mode&1&&pm(m,j,i),i=ne,P=j;var oe=i.updateQueue;if(oe===null){var ae=new Set;ae.add(P),i.updateQueue=ae}else oe.add(P);break e}else{if((i&1)===0){pm(m,j,i),td();break e}P=Error(t(426))}}else if(Xe&&S.mode&1){var st=mm(v);if(st!==null){(st.flags&65536)===0&&(st.flags|=256),gm(st,v,S,m,i),dh(so(P,S));break e}}m=P=so(P,S),gt!==4&&(gt=2),Na===null?Na=[m]:Na.push(m),m=v;do{switch(m.tag){case 3:m.flags|=65536,i&=-i,m.lanes|=i;var L=dm(m,P,i);Up(m,L);break e;case 1:S=P;var N=m.type,M=m.stateNode;if((m.flags&128)===0&&(typeof N.getDerivedStateFromError=="function"||M!==null&&typeof M.componentDidCatch=="function"&&(ti===null||!ti.has(M)))){m.flags|=65536,i&=-i,m.lanes|=i;var X=fm(m,S,i);Up(m,X);break e}}m=m.return}while(m!==null)}Gm(a)}catch(le){i=le,lt===a&&a!==null&&(lt=a=a.return);continue}break}while(!0)}function Hm(){var n=du.current;return du.current=ou,n===null?ou:n}function td(){(gt===0||gt===3||gt===2)&&(gt=4),wt===null||(es&268435455)===0&&(fu&268435455)===0||ii(wt,Pt)}function vu(n,i){var a=be;be|=2;var c=Hm();(wt!==n||Pt!==i)&&(Rr=null,ns(n,i));do try{fE();break}catch(d){qm(n,d)}while(!0);if(ph(),be=a,du.current=c,lt!==null)throw Error(t(261));return wt=null,Pt=0,gt}function fE(){for(;lt!==null;)Wm(lt)}function pE(){for(;lt!==null&&!gl();)Wm(lt)}function Wm(n){var i=Ym(n.alternate,n,un);n.memoizedProps=n.pendingProps,i===null?Gm(n):lt=i,Wh.current=null}function Gm(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=oE(a,i,un),a!==null){lt=a;return}}else{if(a=aE(a,i),a!==null){a.flags&=32767,lt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{gt=6,lt=null;return}}if(i=i.sibling,i!==null){lt=i;return}lt=i=n}while(i!==null);gt===0&&(gt=5)}function rs(n,i,a){var c=Ne,d=vn.transition;try{vn.transition=null,Ne=1,mE(n,i,a,c)}finally{vn.transition=d,Ne=c}return null}function mE(n,i,a,c){do uo();while(ni!==null);if((be&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var m=a.lanes|a.childLanes;if(Be(n,m),n===wt&&(lt=wt=null,Pt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||mu||(mu=!0,Xm(dn,function(){return uo(),null})),m=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||m){m=vn.transition,vn.transition=null;var v=Ne;Ne=1;var S=be;be|=4,Wh.current=null,uE(n,a),Mm(a,n),b0(th),Hr=!!eh,th=eh=null,n.current=a,cE(a),Fc(),be=S,Ne=v,vn.transition=m}else n.current=a;if(mu&&(mu=!1,ni=n,gu=d),m=n.pendingLanes,m===0&&(ti=null),vl(a.stateNode),Jt(n,qe()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)d=i[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(pu)throw pu=!1,n=Qh,Qh=null,n;return(gu&1)!==0&&n.tag!==0&&uo(),m=n.pendingLanes,(m&1)!==0?n===Yh?Da++:(Da=0,Yh=n):Da=0,Xr(),null}function uo(){if(ni!==null){var n=$r(gu),i=vn.transition,a=Ne;try{if(vn.transition=null,Ne=16>n?16:n,ni===null)var c=!1;else{if(n=ni,ni=null,gu=0,(be&6)!==0)throw Error(t(331));var d=be;for(be|=4,se=n.current;se!==null;){var m=se,v=m.child;if((se.flags&16)!==0){var S=m.deletions;if(S!==null){for(var P=0;P<S.length;P++){var j=S[P];for(se=j;se!==null;){var Q=se;switch(Q.tag){case 0:case 11:case 15:ka(8,Q,m)}var Y=Q.child;if(Y!==null)Y.return=Q,se=Y;else for(;se!==null;){Q=se;var K=Q.sibling,ne=Q.return;if(Dm(Q),Q===j){se=null;break}if(K!==null){K.return=ne,se=K;break}se=ne}}}var oe=m.alternate;if(oe!==null){var ae=oe.child;if(ae!==null){oe.child=null;do{var st=ae.sibling;ae.sibling=null,ae=st}while(ae!==null)}}se=m}}if((m.subtreeFlags&2064)!==0&&v!==null)v.return=m,se=v;else e:for(;se!==null;){if(m=se,(m.flags&2048)!==0)switch(m.tag){case 0:case 11:case 15:ka(9,m,m.return)}var L=m.sibling;if(L!==null){L.return=m.return,se=L;break e}se=m.return}}var N=n.current;for(se=N;se!==null;){v=se;var M=v.child;if((v.subtreeFlags&2064)!==0&&M!==null)M.return=v,se=M;else e:for(v=N;se!==null;){if(S=se,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:hu(9,S)}}catch(le){tt(S,S.return,le)}if(S===v){se=null;break e}var X=S.sibling;if(X!==null){X.return=S.return,se=X;break e}se=S.return}}if(be=d,Xr(),nn&&typeof nn.onPostCommitFiberRoot=="function")try{nn.onPostCommitFiberRoot(ji,n)}catch{}c=!0}return c}finally{Ne=a,vn.transition=i}}return!1}function Km(n,i,a){i=so(a,i),i=dm(n,i,1),n=Zr(n,i,1),i=Ht(),n!==null&&(zr(n,1,i),Jt(n,i))}function tt(n,i,a){if(n.tag===3)Km(n,n,a);else for(;i!==null;){if(i.tag===3){Km(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(ti===null||!ti.has(c))){n=so(a,n),n=fm(i,n,1),i=Zr(i,n,1),n=Ht(),i!==null&&(zr(i,1,n),Jt(i,n));break}}i=i.return}}function gE(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=Ht(),n.pingedLanes|=n.suspendedLanes&a,wt===n&&(Pt&a)===a&&(gt===4||gt===3&&(Pt&130023424)===Pt&&500>qe()-Kh?ns(n,0):Gh|=a),Jt(n,i)}function Qm(n,i){i===0&&((n.mode&1)===0?i=1:(i=Ds,Ds<<=1,(Ds&130023424)===0&&(Ds=4194304)));var a=Ht();n=Ir(n,i),n!==null&&(zr(n,i,a),Jt(n,a))}function yE(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),Qm(n,a)}function _E(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),Qm(n,a)}var Ym;Ym=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Kt.current)Yt=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return Yt=!1,sE(n,i,a);Yt=(n.flags&131072)!==0}else Yt=!1,Xe&&(i.flags&1048576)!==0&&kp(i,Kl,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;uu(n,i),n=i.pendingProps;var d=Xs(i,Ot.current);ro(i,a),d=Ah(null,i,c,n,d,a);var m=Rh();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Qt(c)?(m=!0,Hl(i)):m=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,_h(i),d.updater=au,i.stateNode=d,d._reactInternals=i,Dh(i,c,n,a),i=Lh(null,i,c,!0,m,a)):(i.tag=0,Xe&&m&&lh(i),qt(null,i,d,a),i=i.child),i;case 16:c=i.elementType;e:{switch(uu(n,i),n=i.pendingProps,d=c._init,c=d(c._payload),i.type=c,d=i.tag=EE(c),n=On(c,n),d){case 0:i=bh(null,i,c,n,a);break e;case 1:i=Tm(null,i,c,n,a);break e;case 11:i=ym(null,i,c,n,a);break e;case 14:i=_m(null,i,c,On(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:On(c,d),bh(n,i,c,d,a);case 1:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:On(c,d),Tm(n,i,c,d,a);case 3:e:{if(Im(i),n===null)throw Error(t(387));c=i.pendingProps,m=i.memoizedState,d=m.element,Fp(n,i),eu(i,c,null,a);var v=i.memoizedState;if(c=v.element,m.isDehydrated)if(m={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},i.updateQueue.baseState=m,i.memoizedState=m,i.flags&256){d=so(Error(t(423)),i),i=Sm(n,i,c,a,d);break e}else if(c!==d){d=so(Error(t(424)),i),i=Sm(n,i,c,a,d);break e}else for(ln=Kr(i.stateNode.containerInfo.firstChild),an=i,Xe=!0,Vn=null,a=Lp(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(eo(),c===d){i=Ar(n,i,a);break e}qt(n,i,c,a)}i=i.child}return i;case 5:return zp(i),n===null&&hh(i),c=i.type,d=i.pendingProps,m=n!==null?n.memoizedProps:null,v=d.children,nh(c,d)?v=null:m!==null&&nh(c,m)&&(i.flags|=32),wm(n,i),qt(n,i,v,a),i.child;case 6:return n===null&&hh(i),null;case 13:return Am(n,i,a);case 4:return vh(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=to(i,null,c,a):qt(n,i,c,a),i.child;case 11:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:On(c,d),ym(n,i,c,d,a);case 7:return qt(n,i,i.pendingProps,a),i.child;case 8:return qt(n,i,i.pendingProps.children,a),i.child;case 12:return qt(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,d=i.pendingProps,m=i.memoizedProps,v=d.value,He(Xl,c._currentValue),c._currentValue=v,m!==null)if(Dn(m.value,v)){if(m.children===d.children&&!Kt.current){i=Ar(n,i,a);break e}}else for(m=i.child,m!==null&&(m.return=i);m!==null;){var S=m.dependencies;if(S!==null){v=m.child;for(var P=S.firstContext;P!==null;){if(P.context===c){if(m.tag===1){P=Sr(-1,a&-a),P.tag=2;var j=m.updateQueue;if(j!==null){j=j.shared;var Q=j.pending;Q===null?P.next=P:(P.next=Q.next,Q.next=P),j.pending=P}}m.lanes|=a,P=m.alternate,P!==null&&(P.lanes|=a),gh(m.return,a,i),S.lanes|=a;break}P=P.next}}else if(m.tag===10)v=m.type===i.type?null:m.child;else if(m.tag===18){if(v=m.return,v===null)throw Error(t(341));v.lanes|=a,S=v.alternate,S!==null&&(S.lanes|=a),gh(v,a,i),v=m.sibling}else v=m.child;if(v!==null)v.return=m;else for(v=m;v!==null;){if(v===i){v=null;break}if(m=v.sibling,m!==null){m.return=v.return,v=m;break}v=v.return}m=v}qt(n,i,d.children,a),i=i.child}return i;case 9:return d=i.type,c=i.pendingProps.children,ro(i,a),d=yn(d),c=c(d),i.flags|=1,qt(n,i,c,a),i.child;case 14:return c=i.type,d=On(c,i.pendingProps),d=On(c.type,d),_m(n,i,c,d,a);case 15:return vm(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:On(c,d),uu(n,i),i.tag=1,Qt(c)?(n=!0,Hl(i)):n=!1,ro(i,a),cm(i,c,d),Dh(i,c,d,a),Lh(null,i,c,!0,n,a);case 19:return Cm(n,i,a);case 22:return Em(n,i,a)}throw Error(t(156,i.tag))};function Xm(n,i){return xs(n,i)}function vE(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function En(n,i,a,c){return new vE(n,i,a,c)}function nd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function EE(n){if(typeof n=="function")return nd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===O)return 11;if(n===Dt)return 14}return 2}function si(n,i){var a=n.alternate;return a===null?(a=En(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function Eu(n,i,a,c,d,m){var v=2;if(c=n,typeof n=="function")nd(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case k:return is(a.children,d,m,i);case I:v=8,d|=8;break;case C:return n=En(12,a,i,d|2),n.elementType=C,n.lanes=m,n;case R:return n=En(13,a,i,d),n.elementType=R,n.lanes=m,n;case rt:return n=En(19,a,i,d),n.elementType=rt,n.lanes=m,n;case ze:return wu(a,d,m,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case x:v=10;break e;case D:v=9;break e;case O:v=11;break e;case Dt:v=14;break e;case Vt:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=En(v,a,i,d),i.elementType=n,i.type=c,i.lanes=m,i}function is(n,i,a,c){return n=En(7,n,c,i),n.lanes=a,n}function wu(n,i,a,c){return n=En(22,n,c,i),n.elementType=ze,n.lanes=a,n.stateNode={isHidden:!1},n}function rd(n,i,a){return n=En(6,n,null,i),n.lanes=a,n}function id(n,i,a){return i=En(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function wE(n,i,a,c,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=jr(0),this.expirationTimes=jr(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=jr(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function sd(n,i,a,c,d,m,v,S,P){return n=new wE(n,i,a,S,P),i===1?(i=1,m===!0&&(i|=8)):i=0,m=En(3,null,null,i),n.current=m,m.stateNode=n,m.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},_h(m),n}function TE(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ue,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function Jm(n){if(!n)return Yr;n=n._reactInternals;e:{if(An(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Qt(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Qt(a))return Rp(n,a,i)}return i}function Zm(n,i,a,c,d,m,v,S,P){return n=sd(a,c,!0,n,d,m,v,S,P),n.context=Jm(null),a=n.current,c=Ht(),d=ri(a),m=Sr(c,d),m.callback=i??null,Zr(a,m,d),n.current.lanes=d,zr(n,d,c),Jt(n,c),n}function Tu(n,i,a,c){var d=i.current,m=Ht(),v=ri(d);return a=Jm(a),i.context===null?i.context=a:i.pendingContext=a,i=Sr(m,v),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=Zr(d,i,v),n!==null&&(Mn(n,d,v,m),Zl(n,d,v)),v}function Iu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function eg(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function od(n,i){eg(n,i),(n=n.alternate)&&eg(n,i)}function IE(){return null}var tg=typeof reportError=="function"?reportError:function(n){console.error(n)};function ad(n){this._internalRoot=n}Su.prototype.render=ad.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));Tu(n,i,null,null)},Su.prototype.unmount=ad.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;ts(function(){Tu(null,n,null,null)}),i[vr]=null}};function Su(n){this._internalRoot=n}Su.prototype.unstable_scheduleHydration=function(n){if(n){var i=Sl();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Gn.length&&i!==0&&i<Gn[a].priority;a++);Gn.splice(a,0,n),a===0&&Cl(n)}};function ld(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Au(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function ng(){}function SE(n,i,a,c,d){if(d){if(typeof c=="function"){var m=c;c=function(){var j=Iu(v);m.call(j)}}var v=Zm(i,c,n,0,null,!1,!1,"",ng);return n._reactRootContainer=v,n[vr]=v.current,ga(n.nodeType===8?n.parentNode:n),ts(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var S=c;c=function(){var j=Iu(P);S.call(j)}}var P=sd(n,0,!1,null,null,!1,!1,"",ng);return n._reactRootContainer=P,n[vr]=P.current,ga(n.nodeType===8?n.parentNode:n),ts(function(){Tu(i,P,a,c)}),P}function Ru(n,i,a,c,d){var m=a._reactRootContainer;if(m){var v=m;if(typeof d=="function"){var S=d;d=function(){var P=Iu(v);S.call(P)}}Tu(i,v,n,d)}else v=SE(a,i,n,d,c);return Iu(v)}Tl=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Ur(i.pendingLanes);a!==0&&(Br(i,a|1),Jt(i,qe()),(be&6)===0&&(lo=qe()+500,Xr()))}break;case 13:ts(function(){var c=Ir(n,1);if(c!==null){var d=Ht();Mn(c,n,1,d)}}),od(n,1)}},Vs=function(n){if(n.tag===13){var i=Ir(n,134217728);if(i!==null){var a=Ht();Mn(i,n,134217728,a)}od(n,134217728)}},Il=function(n){if(n.tag===13){var i=ri(n),a=Ir(n,i);if(a!==null){var c=Ht();Mn(a,n,i,c)}od(n,i)}},Sl=function(){return Ne},Al=function(n,i){var a=Ne;try{return Ne=n,i()}finally{Ne=a}},Ss=function(n,i,a){switch(i){case"input":if(zo(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var d=$l(c);if(!d)throw Error(t(90));_s(c),zo(c,d)}}}break;case"textarea":Ts(n,a);break;case"select":i=a.value,i!=null&&hr(n,!!a.multiple,i,!1)}},bi=Zh,Xo=ts;var AE={usingClientEntryPoint:!1,Events:[va,Qs,$l,Hn,Yo,Zh]},Va={findFiberByHostInstance:Gi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},RE={bundleType:Va.bundleType,version:Va.version,rendererPackageName:Va.rendererPackageName,rendererConfig:Va.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:J.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ea(n),n===null?null:n.stateNode},findFiberByHostInstance:Va.findFiberByHostInstance||IE,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Cu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Cu.isDisabled&&Cu.supportsFiber)try{ji=Cu.inject(RE),nn=Cu}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=AE,Zt.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ld(i))throw Error(t(200));return TE(n,i,null,a)},Zt.createRoot=function(n,i){if(!ld(n))throw Error(t(299));var a=!1,c="",d=tg;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=sd(n,1,!1,null,null,a,!1,c,d),n[vr]=i.current,ga(n.nodeType===8?n.parentNode:n),new ad(i)},Zt.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ea(i),n=n===null?null:n.stateNode,n},Zt.flushSync=function(n){return ts(n)},Zt.hydrate=function(n,i,a){if(!Au(i))throw Error(t(200));return Ru(null,n,i,!0,a)},Zt.hydrateRoot=function(n,i,a){if(!ld(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,m="",v=tg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(m=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),i=Zm(i,null,n,1,a??null,d,!1,m,v),n[vr]=i.current,ga(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,d]:i.mutableSourceEagerHydrationData.push(a,d);return new Su(i)},Zt.render=function(n,i,a){if(!Au(i))throw Error(t(200));return Ru(null,n,i,!1,a)},Zt.unmountComponentAtNode=function(n){if(!Au(n))throw Error(t(40));return n._reactRootContainer?(ts(function(){Ru(null,null,n,!1,function(){n._reactRootContainer=null,n[vr]=null})}),!0):!1},Zt.unstable_batchedUpdates=Zh,Zt.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!Au(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Ru(n,i,a,!1,c)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var cg;function bE(){if(cg)return hd.exports;cg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),hd.exports=OE(),hd.exports}var hg;function LE(){if(hg)return Pu;hg=1;var r=bE();return Pu.createRoot=r.createRoot,Pu.hydrateRoot=r.hydrateRoot,Pu}var ME=LE();const FE=$y(ME),UE=()=>{};var dg={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qy=function(r){const e=[];let t=0;for(let s=0;s<r.length;s++){let o=r.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},jE=function(r){const e=[];let t=0,s=0;for(;t<r.length;){const o=r[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[s++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],p=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|p&63)-65536;e[s++]=String.fromCharCode(55296+(g>>10)),e[s++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[s++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},Hy={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,p=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,w=l>>2,T=(l&3)<<4|p>>4;let A=(p&15)<<2|_>>6,F=_&63;g||(F=64,h||(A=64)),s.push(t[w],t[T],t[A],t[F])}return s.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(qy(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):jE(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],p=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const T=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||p==null||_==null||T==null)throw new zE;const A=l<<2|p>>4;if(s.push(A),_!==64){const F=p<<4&240|_>>2;if(s.push(F),T!==64){const $=_<<6&192|T;s.push($)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class zE extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const BE=function(r){const e=qy(r);return Hy.encodeByteArray(e,!0)},Hu=function(r){return BE(r).replace(/\./g,"")},Wy=function(r){try{return Hy.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $E(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qE=()=>$E().__FIREBASE_DEFAULTS__,HE=()=>{if(typeof process>"u"||typeof dg>"u")return;const r=dg.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},WE=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Wy(r[1]);return e&&JSON.parse(e)},cc=()=>{try{return UE()||qE()||HE()||WE()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Gy=r=>{var e,t;return(t=(e=cc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},GE=r=>{const e=Gy(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Ky=()=>{var r;return(r=cc())===null||r===void 0?void 0:r.config},Qy=r=>{var e;return(e=cc())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KE{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function No(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Yy(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QE(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Hu(JSON.stringify(t)),Hu(JSON.stringify(h)),""].join(".")}const za={};function YE(){const r={prod:[],emulator:[]};for(const e of Object.keys(za))za[e]?r.emulator.push(e):r.prod.push(e);return r}function XE(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let fg=!1;function Xy(r,e){if(typeof window>"u"||typeof document>"u"||!No(window.location.host)||za[r]===e||za[r]||fg)return;za[r]=e;function t(A){return`__firebase__banner__${A}`}const s="__firebase__banner",l=YE().prod.length>0;function h(){const A=document.getElementById(s);A&&A.remove()}function p(A){A.style.display="flex",A.style.background="#7faaf0",A.style.position="fixed",A.style.bottom="5px",A.style.left="5px",A.style.padding=".5em",A.style.borderRadius="5px",A.style.alignItems="center"}function g(A,F){A.setAttribute("width","24"),A.setAttribute("id",F),A.setAttribute("height","24"),A.setAttribute("viewBox","0 0 24 24"),A.setAttribute("fill","none"),A.style.marginLeft="-6px"}function _(){const A=document.createElement("span");return A.style.cursor="pointer",A.style.marginLeft="16px",A.style.fontSize="24px",A.innerHTML=" &times;",A.onclick=()=>{fg=!0,h()},A}function w(A,F){A.setAttribute("id",F),A.innerText="Learn more",A.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",A.setAttribute("target","__blank"),A.style.paddingLeft="5px",A.style.textDecoration="underline"}function T(){const A=XE(s),F=t("text"),$=document.getElementById(F)||document.createElement("span"),G=t("learnmore"),B=document.getElementById(G)||document.createElement("a"),fe=t("preprendIcon"),ce=document.getElementById(fe)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(A.created){const pe=A.element;p(pe),w(B,G);const J=_();g(ce,fe),pe.append(ce,$,B,J),document.body.appendChild(pe)}l?($.innerText="Preview backend disconnected.",ce.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ce.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,$.innerText="Preview backend running in this workspace."),$.setAttribute("id",F)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",T):T()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function JE(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(zt())}function ZE(){var r;const e=(r=cc())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ew(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function tw(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function nw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function rw(){const r=zt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function iw(){return!ZE()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function sw(){try{return typeof indexedDB=="object"}catch{return!1}}function ow(){return new Promise((r,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)===null||l===void 0?void 0:l.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aw="FirebaseError";class br extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=aw,Object.setPrototypeOf(this,br.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,nl.prototype.create)}}class nl{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?lw(l,s):"Error",p=`${this.serviceName}: ${h} (${o}).`;return new br(o,p,s)}}function lw(r,e){return r.replace(uw,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const uw=/\{\$([^}]+)}/g;function cw(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function xr(r,e){if(r===e)return!0;const t=Object.keys(r),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const l=r[o],h=e[o];if(pg(l)&&pg(h)){if(!xr(l,h))return!1}else if(l!==h)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function pg(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rl(r){const e=[];for(const[t,s]of Object.entries(r))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function ba(r){const e={};return r.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[o,l]=s.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function La(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function hw(r,e){const t=new dw(r,e);return t.subscribe.bind(t)}class dw{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");fw(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=pd),o.error===void 0&&(o.error=pd),o.complete===void 0&&(o.complete=pd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fw(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function pd(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function St(r){return r&&r._delegate?r._delegate:r}class ls{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pw{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new KE;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(l){if(o)return null;throw l}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(gw(e))try{this.getOrInitializeService({instanceIdentifier:ss})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});s.resolve(l)}catch{}}}}clearInstance(e=ss){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ss){return this.instances.has(e)}getOptions(e=ss){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[l,h]of this.instancesDeferred.entries()){const p=this.normalizeInstanceIdentifier(l);s===p&&h.resolve(o)}return o}onInit(e,t){var s;const o=this.normalizeInstanceIdentifier(t),l=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;l.add(e),this.onInitCallbacks.set(o,l);const h=this.instances.get(o);return h&&e(h,o),()=>{l.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:mw(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=ss){return this.component?this.component.multipleInstances?e:ss:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function mw(r){return r===ss?void 0:r}function gw(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new pw(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ke;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(ke||(ke={}));const _w={debug:ke.DEBUG,verbose:ke.VERBOSE,info:ke.INFO,warn:ke.WARN,error:ke.ERROR,silent:ke.SILENT},vw=ke.INFO,Ew={[ke.DEBUG]:"log",[ke.VERBOSE]:"log",[ke.INFO]:"info",[ke.WARN]:"warn",[ke.ERROR]:"error"},ww=(r,e,...t)=>{if(e<r.logLevel)return;const s=new Date().toISOString(),o=Ew[e];if(o)console[o](`[${s}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Zd{constructor(e){this.name=e,this._logLevel=vw,this._logHandler=ww,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ke))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?_w[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ke.DEBUG,...e),this._logHandler(this,ke.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ke.VERBOSE,...e),this._logHandler(this,ke.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ke.INFO,...e),this._logHandler(this,ke.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ke.WARN,...e),this._logHandler(this,ke.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ke.ERROR,...e),this._logHandler(this,ke.ERROR,...e)}}const Tw=(r,e)=>e.some(t=>r instanceof t);let mg,gg;function Iw(){return mg||(mg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Sw(){return gg||(gg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Jy=new WeakMap,Ad=new WeakMap,Zy=new WeakMap,md=new WeakMap,ef=new WeakMap;function Aw(r){const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(fi(r.result)),o()},h=()=>{s(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&Jy.set(t,r)}).catch(()=>{}),ef.set(e,r),e}function Rw(r){if(Ad.has(r))return;const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{s(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});Ad.set(r,e)}let Rd={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Ad.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Zy.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return fi(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Cw(r){Rd=r(Rd)}function Pw(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=r.call(gd(this),e,...t);return Zy.set(s,e.sort?e.sort():[e]),fi(s)}:Sw().includes(r)?function(...e){return r.apply(gd(this),e),fi(Jy.get(this))}:function(...e){return fi(r.apply(gd(this),e))}}function kw(r){return typeof r=="function"?Pw(r):(r instanceof IDBTransaction&&Rw(r),Tw(r,Iw())?new Proxy(r,Rd):r)}function fi(r){if(r instanceof IDBRequest)return Aw(r);if(md.has(r))return md.get(r);const e=kw(r);return e!==r&&(md.set(r,e),ef.set(e,r)),e}const gd=r=>ef.get(r);function xw(r,e,{blocked:t,upgrade:s,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),p=fi(h);return s&&h.addEventListener("upgradeneeded",g=>{s(fi(h.result),g.oldVersion,g.newVersion,fi(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),p.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),p}const Nw=["get","getKey","getAll","getAllKeys","count"],Dw=["put","add","delete","clear"],yd=new Map;function yg(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(yd.get(e))return yd.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=Dw.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||Nw.includes(t)))return;const l=async function(h,...p){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return s&&(_=_.index(p.shift())),(await Promise.all([_[t](...p),o&&g.done]))[0]};return yd.set(e,l),l}Cw(r=>({...r,get:(e,t,s)=>yg(e,t)||r.get(e,t,s),has:(e,t)=>!!yg(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vw{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Ow(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Ow(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Cd="@firebase/app",_g="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr=new Zd("@firebase/app"),bw="@firebase/app-compat",Lw="@firebase/analytics-compat",Mw="@firebase/analytics",Fw="@firebase/app-check-compat",Uw="@firebase/app-check",jw="@firebase/auth",zw="@firebase/auth-compat",Bw="@firebase/database",$w="@firebase/data-connect",qw="@firebase/database-compat",Hw="@firebase/functions",Ww="@firebase/functions-compat",Gw="@firebase/installations",Kw="@firebase/installations-compat",Qw="@firebase/messaging",Yw="@firebase/messaging-compat",Xw="@firebase/performance",Jw="@firebase/performance-compat",Zw="@firebase/remote-config",eT="@firebase/remote-config-compat",tT="@firebase/storage",nT="@firebase/storage-compat",rT="@firebase/firestore",iT="@firebase/ai",sT="@firebase/firestore-compat",oT="firebase",aT="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pd="[DEFAULT]",lT={[Cd]:"fire-core",[bw]:"fire-core-compat",[Mw]:"fire-analytics",[Lw]:"fire-analytics-compat",[Uw]:"fire-app-check",[Fw]:"fire-app-check-compat",[jw]:"fire-auth",[zw]:"fire-auth-compat",[Bw]:"fire-rtdb",[$w]:"fire-data-connect",[qw]:"fire-rtdb-compat",[Hw]:"fire-fn",[Ww]:"fire-fn-compat",[Gw]:"fire-iid",[Kw]:"fire-iid-compat",[Qw]:"fire-fcm",[Yw]:"fire-fcm-compat",[Xw]:"fire-perf",[Jw]:"fire-perf-compat",[Zw]:"fire-rc",[eT]:"fire-rc-compat",[tT]:"fire-gcs",[nT]:"fire-gcs-compat",[rT]:"fire-fst",[sT]:"fire-fst-compat",[iT]:"fire-vertex","fire-js":"fire-js",[oT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu=new Map,uT=new Map,kd=new Map;function vg(r,e){try{r.container.addComponent(e)}catch(t){Nr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function wo(r){const e=r.name;if(kd.has(e))return Nr.debug(`There were multiple attempts to register component ${e}.`),!1;kd.set(e,r);for(const t of Wu.values())vg(t,r);for(const t of uT.values())vg(t,r);return!0}function tf(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function wn(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pi=new nl("app","Firebase",cT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hT{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ls("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do=aT;function nf(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Pd,automaticDataCollectionEnabled:!0},e),o=s.name;if(typeof o!="string"||!o)throw pi.create("bad-app-name",{appName:String(o)});if(t||(t=Ky()),!t)throw pi.create("no-options");const l=Wu.get(o);if(l){if(xr(t,l.options)&&xr(s,l.config))return l;throw pi.create("duplicate-app",{appName:o})}const h=new yw(o);for(const g of kd.values())h.addComponent(g);const p=new hT(t,s,h);return Wu.set(o,p),p}function rf(r=Pd){const e=Wu.get(r);if(!e&&r===Pd&&Ky())return nf();if(!e)throw pi.create("no-app",{appName:r});return e}function mi(r,e,t){var s;let o=(s=lT[r])!==null&&s!==void 0?s:r;t&&(o+=`-${t}`);const l=o.match(/\s|\//),h=e.match(/\s|\//);if(l||h){const p=[`Unable to register library "${o}" with version "${e}":`];l&&p.push(`library name "${o}" contains illegal characters (whitespace or "/")`),l&&h&&p.push("and"),h&&p.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Nr.warn(p.join(" "));return}wo(new ls(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dT="firebase-heartbeat-database",fT=1,Ga="firebase-heartbeat-store";let _d=null;function e_(){return _d||(_d=xw(dT,fT,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Ga)}catch(t){console.warn(t)}}}}).catch(r=>{throw pi.create("idb-open",{originalErrorMessage:r.message})})),_d}async function pT(r){try{const t=(await e_()).transaction(Ga),s=await t.objectStore(Ga).get(t_(r));return await t.done,s}catch(e){if(e instanceof br)Nr.warn(e.message);else{const t=pi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Nr.warn(t.message)}}}async function Eg(r,e){try{const s=(await e_()).transaction(Ga,"readwrite");await s.objectStore(Ga).put(e,t_(r)),await s.done}catch(t){if(t instanceof br)Nr.warn(t.message);else{const s=pi.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Nr.warn(s.message)}}}function t_(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mT=1024,gT=30;class yT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new vT(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=wg();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>gT){const h=ET(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Nr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=wg(),{heartbeatsToSend:s,unsentEntries:o}=_T(this._heartbeatsCache.heartbeats),l=Hu(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return Nr.warn(t),""}}}function wg(){return new Date().toISOString().substring(0,10)}function _T(r,e=mT){const t=[];let s=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),Tg(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),Tg(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class vT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return sw()?ow().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await pT(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return Eg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return Eg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function Tg(r){return Hu(JSON.stringify({version:2,heartbeats:r})).length}function ET(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let s=1;s<r.length;s++)r[s].date<t&&(t=r[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wT(r){wo(new ls("platform-logger",e=>new Vw(e),"PRIVATE")),wo(new ls("heartbeat",e=>new yT(e),"PRIVATE")),mi(Cd,_g,r),mi(Cd,_g,"esm2017"),mi("fire-js","")}wT("");function sf(r,e){var t={};for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(r);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(r,s[o])&&(t[s[o]]=r[s[o]]);return t}function n_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const TT=n_,r_=new nl("auth","Firebase",n_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gu=new Zd("@firebase/auth");function IT(r,...e){Gu.logLevel<=ke.WARN&&Gu.warn(`Auth (${Do}): ${r}`,...e)}function bu(r,...e){Gu.logLevel<=ke.ERROR&&Gu.error(`Auth (${Do}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bn(r,...e){throw of(r,...e)}function nr(r,...e){return of(r,...e)}function i_(r,e,t){const s=Object.assign(Object.assign({},TT()),{[e]:t});return new nl("auth","Firebase",s).create(e,{appName:r.name})}function kr(r){return i_(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function of(r,...e){if(typeof r!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(t,...s)}return r_.create(r,...e)}function _e(r,e,...t){if(!r)throw of(e,...t)}function Cr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw bu(e),new Error(e)}function Dr(r,e){r||Cr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function ST(){return Ig()==="http:"||Ig()==="https:"}function Ig(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ST()||tw()||"connection"in navigator)?navigator.onLine:!0}function RT(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il{constructor(e,t){this.shortDelay=e,this.longDelay=t,Dr(t>e,"Short delay should be less than long delay!"),this.isMobile=JE()||nw()}get(){return AT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function af(r,e){Dr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Cr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Cr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Cr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],kT=new il(3e4,6e4);function Ri(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Ci(r,e,t,s,o={}){return o_(r,o,async()=>{let l={},h={};s&&(e==="GET"?h=s:l={body:JSON.stringify(s)});const p=rl(Object.assign({key:r.config.apiKey},h)).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _=Object.assign({method:e,headers:g},l);return ew()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&No(r.emulatorConfig.host)&&(_.credentials="include"),s_.fetch()(await a_(r,r.config.apiHost,t,p),_)})}async function o_(r,e,t){r._canInitEmulator=!1;const s=Object.assign(Object.assign({},CT),e);try{const o=new NT(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw ku(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const p=l.ok?h.errorMessage:h.error.message,[g,_]=p.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw ku(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw ku(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw ku(r,"user-disabled",h);const w=s[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw i_(r,w,_);Bn(r,w)}}catch(o){if(o instanceof br)throw o;Bn(r,"network-request-failed",{message:String(o)})}}async function sl(r,e,t,s,o={}){const l=await Ci(r,e,t,s,o);return"mfaPendingCredential"in l&&Bn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function a_(r,e,t,s){const o=`${e}${t}?${s}`,l=r,h=l.config.emulator?af(r.config,o):`${r.config.apiScheme}://${o}`;return PT.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function xT(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class NT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(nr(this.auth,"network-request-failed")),kT.get())})}}function ku(r,e,t){const s={appName:r.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=nr(r,e,s);return o.customData._tokenResponse=t,o}function Sg(r){return r!==void 0&&r.enterprise!==void 0}class DT{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return xT(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function VT(r,e){return Ci(r,"GET","/v2/recaptchaConfig",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function OT(r,e){return Ci(r,"POST","/v1/accounts:delete",e)}async function Ku(r,e){return Ci(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ba(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function bT(r,e=!1){const t=St(r),s=await t.getIdToken(e),o=lf(s);_e(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:s,authTime:Ba(vd(o.auth_time)),issuedAtTime:Ba(vd(o.iat)),expirationTime:Ba(vd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function vd(r){return Number(r)*1e3}function lf(r){const[e,t,s]=r.split(".");if(e===void 0||t===void 0||s===void 0)return bu("JWT malformed, contained fewer than 3 sections"),null;try{const o=Wy(t);return o?JSON.parse(o):(bu("Failed to decode base64 JWT payload"),null)}catch(o){return bu("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function Ag(r){const e=lf(r);return _e(e,"internal-error"),_e(typeof e.exp<"u","internal-error"),_e(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ka(r,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof br&&LT(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function LT({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ba(this.lastLoginAt),this.creationTime=Ba(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qu(r){var e;const t=r.auth,s=await r.getIdToken(),o=await Ka(r,Ku(t,{idToken:s}));_e(o==null?void 0:o.users.length,t,"internal-error");const l=o.users[0];r._notifyReloadListener(l);const h=!((e=l.providerUserInfo)===null||e===void 0)&&e.length?l_(l.providerUserInfo):[],p=UT(r.providerData,h),g=r.isAnonymous,_=!(r.email&&l.passwordHash)&&!(p!=null&&p.length),w=g?_:!1,T={uid:l.localId,displayName:l.displayName||null,photoURL:l.photoUrl||null,email:l.email||null,emailVerified:l.emailVerified||!1,phoneNumber:l.phoneNumber||null,tenantId:l.tenantId||null,providerData:p,metadata:new Nd(l.createdAt,l.lastLoginAt),isAnonymous:w};Object.assign(r,T)}async function FT(r){const e=St(r);await Qu(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function UT(r,e){return[...r.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function l_(r){return r.map(e=>{var{providerId:t}=e,s=sf(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jT(r,e){const t=await o_(r,{},async()=>{const s=rl({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await a_(r,o,"/v1/token",`key=${l}`),p=await r._getAdditionalHeaders();p["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:p,body:s};return r.emulatorConfig&&No(r.emulatorConfig.host)&&(g.credentials="include"),s_.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function zT(r,e){return Ci(r,"POST","/v2/accounts:revokeToken",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_e(e.idToken,"internal-error"),_e(typeof e.idToken<"u","internal-error"),_e(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ag(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_e(e.length!==0,"internal-error");const t=Ag(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(_e(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:l}=await jT(e,t);this.updateTokensAndExpiration(s,o,Number(l))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:l}=t,h=new go;return s&&(_e(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),o&&(_e(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(_e(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new go,this.toJSON())}_performRefresh(){return Cr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ai(r,e){_e(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Fn{constructor(e){var{uid:t,auth:s,stsTokenManager:o}=e,l=sf(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new MT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=l.displayName||null,this.email=l.email||null,this.emailVerified=l.emailVerified||!1,this.phoneNumber=l.phoneNumber||null,this.photoURL=l.photoURL||null,this.isAnonymous=l.isAnonymous||!1,this.tenantId=l.tenantId||null,this.providerData=l.providerData?[...l.providerData]:[],this.metadata=new Nd(l.createdAt||void 0,l.lastLoginAt||void 0)}async getIdToken(e){const t=await Ka(this,this.stsTokenManager.getToken(this.auth,e));return _e(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return bT(this,e)}reload(){return FT(this)}_assign(e){this!==e&&(_e(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Fn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_e(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Qu(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(wn(this.auth.app))return Promise.reject(kr(this.auth));const e=await this.getIdToken();return await Ka(this,OT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,o,l,h,p,g,_,w;const T=(s=t.displayName)!==null&&s!==void 0?s:void 0,A=(o=t.email)!==null&&o!==void 0?o:void 0,F=(l=t.phoneNumber)!==null&&l!==void 0?l:void 0,$=(h=t.photoURL)!==null&&h!==void 0?h:void 0,G=(p=t.tenantId)!==null&&p!==void 0?p:void 0,B=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,fe=(_=t.createdAt)!==null&&_!==void 0?_:void 0,ce=(w=t.lastLoginAt)!==null&&w!==void 0?w:void 0,{uid:pe,emailVerified:J,isAnonymous:Ee,providerData:ue,stsTokenManager:k}=t;_e(pe&&k,e,"internal-error");const I=go.fromJSON(this.name,k);_e(typeof pe=="string",e,"internal-error"),ai(T,e.name),ai(A,e.name),_e(typeof J=="boolean",e,"internal-error"),_e(typeof Ee=="boolean",e,"internal-error"),ai(F,e.name),ai($,e.name),ai(G,e.name),ai(B,e.name),ai(fe,e.name),ai(ce,e.name);const C=new Fn({uid:pe,auth:e,email:A,emailVerified:J,displayName:T,isAnonymous:Ee,photoURL:$,phoneNumber:F,tenantId:G,stsTokenManager:I,createdAt:fe,lastLoginAt:ce});return ue&&Array.isArray(ue)&&(C.providerData=ue.map(x=>Object.assign({},x))),B&&(C._redirectEventId=B),C}static async _fromIdTokenResponse(e,t,s=!1){const o=new go;o.updateFromServerResponse(t);const l=new Fn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await Qu(l),l}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];_e(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?l_(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),p=new go;p.updateFromIdToken(s);const g=new Fn({uid:o.localId,auth:e,stsTokenManager:p,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new Nd(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rg=new Map;function Pr(r){Dr(r instanceof Function,"Expected a class definition");let e=Rg.get(r);return e?(Dr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Rg.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}u_.type="NONE";const Cg=u_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lu(r,e,t){return`firebase:${r}:${e}:${t}`}class yo{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:l}=this.auth;this.fullUserKey=Lu(this.userKey,o.apiKey,l),this.fullPersistenceKey=Lu("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ku(this.auth,{idToken:e}).catch(()=>{});return t?Fn._fromGetAccountInfoResponse(this.auth,t,e):null}return Fn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new yo(Pr(Cg),e,s);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Pr(Cg);const h=Lu(s,e.config.apiKey,e.name);let p=null;for(const _ of t)try{const w=await _._get(h);if(w){let T;if(typeof w=="string"){const A=await Ku(e,{idToken:w}).catch(()=>{});if(!A)break;T=await Fn._fromGetAccountInfoResponse(e,A,w)}else T=Fn._fromJSON(e,w);_!==l&&(p=T),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new yo(l,e,s):(l=g[0],p&&await l._set(h,p.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new yo(l,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pg(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(f_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(c_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(m_(e))return"Blackberry";if(g_(e))return"Webos";if(h_(e))return"Safari";if((e.includes("chrome/")||d_(e))&&!e.includes("edge/"))return"Chrome";if(p_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function c_(r=zt()){return/firefox\//i.test(r)}function h_(r=zt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function d_(r=zt()){return/crios\//i.test(r)}function f_(r=zt()){return/iemobile/i.test(r)}function p_(r=zt()){return/android/i.test(r)}function m_(r=zt()){return/blackberry/i.test(r)}function g_(r=zt()){return/webos/i.test(r)}function uf(r=zt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function BT(r=zt()){var e;return uf(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $T(){return rw()&&document.documentMode===10}function y_(r=zt()){return uf(r)||p_(r)||g_(r)||m_(r)||/windows phone/i.test(r)||f_(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function __(r,e=[]){let t;switch(r){case"Browser":t=Pg(zt());break;case"Worker":t=`${Pg(zt())}-${r}`;break;default:t=r}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Do}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=l=>new Promise((h,p)=>{try{const g=e(l);h(g)}catch(g){p(g)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function HT(r,e={}){return Ci(r,"GET","/v2/passwordPolicy",Ri(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WT=6;class GT{constructor(e){var t,s,o,l;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:WT,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(l=e.forceUpgradeOnSignin)!==null&&l!==void 0?l:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,o,l,h,p;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(s=g.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(l=g.containsUppercaseLetter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(p=g.containsNonAlphanumericCharacter)!==null&&p!==void 0?p:!0),g}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KT{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new kg(this),this.idTokenSubscription=new kg(this),this.beforeStateQueue=new qT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=r_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Pr(t)),this._initializationPromise=this.queue(async()=>{var s,o,l;if(!this._deleted&&(this.persistenceManager=await yo.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)===null||l===void 0?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ku(this,{idToken:e}),s=await Fn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(wn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(p=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(p,p))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,l=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,p=o==null?void 0:o._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===p)&&(g!=null&&g.user)&&(o=g.user,l=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(l)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return _e(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Qu(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=RT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(wn(this.app))return Promise.reject(kr(this));const t=e?St(e):null;return t&&_e(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_e(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return wn(this.app)?Promise.reject(kr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return wn(this.app)?Promise.reject(kr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Pr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await HT(this),t=new GT(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new nl("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await zT(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Pr(e)||this._popupRedirectResolver;_e(t,this,"argument-error"),this.redirectPersistenceManager=await yo.create(this,[Pr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const p=this._isInitialized?Promise.resolve():this._initializationPromise;if(_e(p,this,"internal-error"),p.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,s,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _e(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=__(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(wn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&IT(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function ps(r){return St(r)}class kg{constructor(e){this.auth=e,this.observer=null,this.addObserver=hw(t=>this.observer=t)}get next(){return _e(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function QT(r){hc=r}function v_(r){return hc.loadJS(r)}function YT(){return hc.recaptchaEnterpriseScript}function XT(){return hc.gapiScript}function JT(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class ZT{constructor(){this.enterprise=new eI}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class eI{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const tI="recaptcha-enterprise",E_="NO_RECAPTCHA";class nI{constructor(e){this.type=tI,this.auth=ps(e)}async verify(e="verify",t=!1){async function s(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,p)=>{VT(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)p(new Error("recaptcha Enterprise site key undefined"));else{const _=new DT(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{p(g)})})}function o(l,h,p){const g=window.grecaptcha;Sg(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(E_)})}):p(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ZT().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{s(this.auth).then(p=>{if(!t&&Sg(window.grecaptcha))o(p,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=YT();g.length!==0&&(g+=p),v_(g).then(()=>{o(p,l,h)}).catch(_=>{h(_)})}}).catch(p=>{h(p)})})}}async function xg(r,e,t,s=!1,o=!1){const l=new nI(r);let h;if(o)h=E_;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const p=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in p){const g=p.phoneEnrollmentInfo.phoneNumber,_=p.phoneEnrollmentInfo.recaptchaToken;Object.assign(p,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in p){const g=p.phoneSignInInfo.recaptchaToken;Object.assign(p,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return p}return s?Object.assign(p,{captchaResp:h}):Object.assign(p,{captchaResponse:h}),Object.assign(p,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(p,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),p}async function Dd(r,e,t,s,o){var l;if(!((l=r._getRecaptchaConfig())===null||l===void 0)&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await xg(r,e,t,t==="getOobCode");return s(r,h)}else return s(r,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const p=await xg(r,e,t,t==="getOobCode");return s(r,p)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rI(r,e){const t=tf(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(xr(l,e??{}))return o;Bn(o,"already-initialized")}return t.initialize({options:e})}function iI(r,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Pr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function sI(r,e,t){const s=ps(r);_e(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,l=w_(e),{host:h,port:p}=oI(e),g=p===null?"":`:${p}`,_={url:`${l}//${h}${g}/`},w=Object.freeze({host:h,port:p,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){_e(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),_e(xr(_,s.config.emulator)&&xr(w,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=_,s.emulatorConfig=w,s.settings.appVerificationDisabledForTesting=!0,No(h)?(Yy(`${l}//${h}${g}`),Xy("Auth",!0)):aI()}function w_(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function oI(r){const e=w_(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const l=o[1];return{host:l,port:Ng(s.substr(l.length+1))}}else{const[l,h]=s.split(":");return{host:l,port:Ng(h)}}}function Ng(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function aI(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cf{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Cr("not implemented")}_getIdTokenResponse(e){return Cr("not implemented")}_linkToIdToken(e,t){return Cr("not implemented")}_getReauthenticationResolver(e){return Cr("not implemented")}}async function lI(r,e){return Ci(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uI(r,e){return sl(r,"POST","/v1/accounts:signInWithPassword",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cI(r,e){return sl(r,"POST","/v1/accounts:signInWithEmailLink",Ri(r,e))}async function hI(r,e){return sl(r,"POST","/v1/accounts:signInWithEmailLink",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa extends cf{constructor(e,t,s,o=null){super("password",s),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new Qa(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new Qa(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dd(e,t,"signInWithPassword",uI);case"emailLink":return cI(e,{email:this._email,oobCode:this._password});default:Bn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dd(e,s,"signUpPassword",lI);case"emailLink":return hI(e,{idToken:t,email:this._email,oobCode:this._password});default:Bn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _o(r,e){return sl(r,"POST","/v1/accounts:signInWithIdp",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dI="http://localhost";class us extends cf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new us(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Bn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o}=t,l=sf(t,["providerId","signInMethod"]);if(!s||!o)return null;const h=new us(s,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return _o(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,_o(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,_o(e,t)}buildRequest(){const e={requestUri:dI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=rl(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fI(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function pI(r){const e=ba(La(r)).link,t=e?ba(La(e)).deep_link_id:null,s=ba(La(r)).deep_link_id;return(s?ba(La(s)).link:null)||s||t||e||r}class hf{constructor(e){var t,s,o,l,h,p;const g=ba(La(e)),_=(t=g.apiKey)!==null&&t!==void 0?t:null,w=(s=g.oobCode)!==null&&s!==void 0?s:null,T=fI((o=g.mode)!==null&&o!==void 0?o:null);_e(_&&w&&T,"argument-error"),this.apiKey=_,this.operation=T,this.code=w,this.continueUrl=(l=g.continueUrl)!==null&&l!==void 0?l:null,this.languageCode=(h=g.lang)!==null&&h!==void 0?h:null,this.tenantId=(p=g.tenantId)!==null&&p!==void 0?p:null}static parseLink(e){const t=pI(e);try{return new hf(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(){this.providerId=Vo.PROVIDER_ID}static credential(e,t){return Qa._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=hf.parseLink(t);return _e(s,"argument-error"),Qa._fromEmailAndCode(e,s.code,s.tenantId)}}Vo.PROVIDER_ID="password";Vo.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Vo.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T_{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol extends T_{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li extends ol{constructor(){super("facebook.com")}static credential(e){return us._fromParams({providerId:li.PROVIDER_ID,signInMethod:li.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return li.credentialFromTaggedObject(e)}static credentialFromError(e){return li.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return li.credential(e.oauthAccessToken)}catch{return null}}}li.FACEBOOK_SIGN_IN_METHOD="facebook.com";li.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui extends ol{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return us._fromParams({providerId:ui.PROVIDER_ID,signInMethod:ui.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ui.credentialFromTaggedObject(e)}static credentialFromError(e){return ui.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return ui.credential(t,s)}catch{return null}}}ui.GOOGLE_SIGN_IN_METHOD="google.com";ui.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci extends ol{constructor(){super("github.com")}static credential(e){return us._fromParams({providerId:ci.PROVIDER_ID,signInMethod:ci.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ci.credentialFromTaggedObject(e)}static credentialFromError(e){return ci.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ci.credential(e.oauthAccessToken)}catch{return null}}}ci.GITHUB_SIGN_IN_METHOD="github.com";ci.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi extends ol{constructor(){super("twitter.com")}static credential(e,t){return us._fromParams({providerId:hi.PROVIDER_ID,signInMethod:hi.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return hi.credentialFromTaggedObject(e)}static credentialFromError(e){return hi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return hi.credential(t,s)}catch{return null}}}hi.TWITTER_SIGN_IN_METHOD="twitter.com";hi.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mI(r,e){return sl(r,"POST","/v1/accounts:signUp",Ri(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const l=await Fn._fromIdTokenResponse(e,s,o),h=Dg(s);return new cs({user:l,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=Dg(s);return new cs({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function Dg(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yu extends br{constructor(e,t,s,o){var l;super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,Yu.prototype),this.customData={appName:e.name,tenantId:(l=e.tenantId)!==null&&l!==void 0?l:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new Yu(e,t,s,o)}}function I_(r,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?Yu._fromErrorAndOperation(r,l,e,s):l})}async function gI(r,e,t=!1){const s=await Ka(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return cs._forOperation(r,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yI(r,e,t=!1){const{auth:s}=r;if(wn(s.app))return Promise.reject(kr(s));const o="reauthenticate";try{const l=await Ka(r,I_(s,o,e,r),t);_e(l.idToken,s,"internal-error");const h=lf(l.idToken);_e(h,s,"internal-error");const{sub:p}=h;return _e(r.uid===p,s,"user-mismatch"),cs._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Bn(s,"user-mismatch"),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S_(r,e,t=!1){if(wn(r.app))return Promise.reject(kr(r));const s="signIn",o=await I_(r,s,e),l=await cs._fromIdTokenResponse(r,s,o);return t||await r._updateCurrentUser(l.user),l}async function _I(r,e){return S_(ps(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function A_(r){const e=ps(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function vI(r,e,t){if(wn(r.app))return Promise.reject(kr(r));const s=ps(r),h=await Dd(s,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",mI).catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&A_(r),g}),p=await cs._fromIdTokenResponse(s,"signIn",h);return await s._updateCurrentUser(p.user),p}function EI(r,e,t){return wn(r.app)?Promise.reject(kr(r)):_I(St(r),Vo.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&A_(r),s})}function wI(r,e,t,s){return St(r).onIdTokenChanged(e,t,s)}function TI(r,e,t){return St(r).beforeAuthStateChanged(e,t)}function II(r){return St(r).signOut()}const Xu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Xu,"1"),this.storage.removeItem(Xu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SI=1e3,AI=10;class C_ extends R_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=y_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,p,g)=>{this.notifyListeners(h,g)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},l=this.storage.getItem(s);$T()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,AI):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},SI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}C_.type="LOCAL";const RI=C_;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P_ extends R_{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}P_.type="SESSION";const k_=P_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CI(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new dc(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const p=Array.from(h).map(async _=>_(t.origin,l)),g=await CI(p);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}dc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function df(r="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((p,g)=>{const _=df("",20);o.port1.start();const w=setTimeout(()=>{g(new Error("unsupported_event"))},s);h={messageChannel:o,onMessage(T){const A=T;if(A.data.eventId===_)switch(A.data.status){case"ack":clearTimeout(w),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),p(A.data.response);break;default:clearTimeout(w),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(){return window}function kI(r){rr().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x_(){return typeof rr().WorkerGlobalScope<"u"&&typeof rr().importScripts=="function"}async function xI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function NI(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function DI(){return x_()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N_="firebaseLocalStorageDb",VI=1,Ju="firebaseLocalStorage",D_="fbase_key";class al{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function fc(r,e){return r.transaction([Ju],e?"readwrite":"readonly").objectStore(Ju)}function OI(){const r=indexedDB.deleteDatabase(N_);return new al(r).toPromise()}function Vd(){const r=indexedDB.open(N_,VI);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(Ju,{keyPath:D_})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(Ju)?e(s):(s.close(),await OI(),e(await Vd()))})})}async function Vg(r,e,t){const s=fc(r,!0).put({[D_]:e,value:t});return new al(s).toPromise()}async function bI(r,e){const t=fc(r,!1).get(e),s=await new al(t).toPromise();return s===void 0?null:s.value}function Og(r,e){const t=fc(r,!0).delete(e);return new al(t).toPromise()}const LI=800,MI=3;class V_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Vd(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>MI)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return x_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=dc._getInstance(DI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await xI(),!this.activeServiceWorker)return;this.sender=new PI(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||NI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Vd();return await Vg(e,Xu,"1"),await Og(e,Xu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Vg(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>bI(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Og(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=fc(o,!1).getAll();return new al(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),LI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}V_.type="LOCAL";const FI=V_;new il(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UI(r,e){return e?Pr(e):(_e(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff extends cf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return _o(e,this._buildIdpRequest())}_linkToIdToken(e,t){return _o(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return _o(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function jI(r){return S_(r.auth,new ff(r),r.bypassAuthState)}function zI(r){const{auth:e,user:t}=r;return _e(t,e,"internal-error"),yI(t,new ff(r),r.bypassAuthState)}async function BI(r){const{auth:e,user:t}=r;return _e(t,e,"internal-error"),gI(t,new ff(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e,t,s,o,l=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:l,error:h,type:p}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:s,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(p)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return jI;case"linkViaPopup":case"linkViaRedirect":return BI;case"reauthViaPopup":case"reauthViaRedirect":return zI;default:Bn(this.auth,"internal-error")}}resolve(e){Dr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Dr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I=new il(2e3,1e4);class mo extends O_{constructor(e,t,s,o,l){super(e,t,o,l),this.provider=s,this.authWindow=null,this.pollId=null,mo.currentPopupAction&&mo.currentPopupAction.cancel(),mo.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return _e(e,this.auth,"internal-error"),e}async onExecution(){Dr(this.filter.length===1,"Popup operations only handle one event");const e=df();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(nr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(nr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,mo.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(nr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$I.get())};e()}}mo.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qI="pendingRedirect",Mu=new Map;class HI extends O_{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Mu.get(this.auth._key());if(!e){try{const s=await WI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Mu.set(this.auth._key(),e)}return this.bypassAuthState||Mu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function WI(r,e){const t=QI(e),s=KI(r);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function GI(r,e){Mu.set(r._key(),e)}function KI(r){return Pr(r._redirectPersistence)}function QI(r){return Lu(qI,r.config.apiKey,r.name)}async function YI(r,e,t=!1){if(wn(r.app))return Promise.reject(kr(r));const s=ps(r),o=UI(s,e),h=await new HI(s,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XI=600*1e3;class JI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ZI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!b_(e)){const o=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(nr(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=XI&&this.cachedEventUids.clear(),this.cachedEventUids.has(bg(e))}saveEventToCache(e){this.cachedEventUids.add(bg(e)),this.lastProcessedEventTime=Date.now()}}function bg(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function b_({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ZI(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return b_(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eS(r,e={}){return Ci(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tS=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nS=/^https?/;async function rS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await eS(r);for(const t of e)try{if(iS(t))return}catch{}Bn(r,"unauthorized-domain")}function iS(r){const e=xd(),{protocol:t,hostname:s}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&s===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!nS.test(t))return!1;if(tS.test(r))return s===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sS=new il(3e4,6e4);function Lg(){const r=rr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function oS(r){return new Promise((e,t)=>{var s,o,l;function h(){Lg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Lg(),t(nr(r,"network-request-failed"))},timeout:sS.get()})}if(!((o=(s=rr().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((l=rr().gapi)===null||l===void 0)&&l.load)h();else{const p=JT("iframefcb");return rr()[p]=()=>{gapi.load?h():t(nr(r,"network-request-failed"))},v_(`${XT()}?onload=${p}`).catch(g=>t(g))}}).catch(e=>{throw Fu=null,e})}let Fu=null;function aS(r){return Fu=Fu||oS(r),Fu}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lS=new il(5e3,15e3),uS="__/auth/iframe",cS="emulator/auth/iframe",hS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fS(r){const e=r.config;_e(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?af(e,cS):`https://${r.config.authDomain}/${uS}`,s={apiKey:e.apiKey,appName:r.name,v:Do},o=dS.get(r.config.apiHost);o&&(s.eid=o);const l=r._getFrameworks();return l.length&&(s.fw=l.join(",")),`${t}?${rl(s).slice(1)}`}async function pS(r){const e=await aS(r),t=rr().gapi;return _e(t,r,"internal-error"),e.open({where:document.body,url:fS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hS,dontclear:!0},s=>new Promise(async(o,l)=>{await s.restyle({setHideOnLeave:!1});const h=nr(r,"network-request-failed"),p=rr().setTimeout(()=>{l(h)},lS.get());function g(){rr().clearTimeout(p),o(s)}s.ping(g).then(g,()=>{l(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gS=500,yS=600,_S="_blank",vS="http://localhost";class Mg{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ES(r,e,t,s=gS,o=yS){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let p="";const g=Object.assign(Object.assign({},mS),{width:s.toString(),height:o.toString(),top:l,left:h}),_=zt().toLowerCase();t&&(p=d_(_)?_S:t),c_(_)&&(e=e||vS,g.scrollbars="yes");const w=Object.entries(g).reduce((A,[F,$])=>`${A}${F}=${$},`,"");if(BT(_)&&p!=="_self")return wS(e||"",p),new Mg(null);const T=window.open(e||"",p,w);_e(T,r,"popup-blocked");try{T.focus()}catch{}return new Mg(T)}function wS(r,e){const t=document.createElement("a");t.href=r,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TS="__/auth/handler",IS="emulator/auth/handler",SS=encodeURIComponent("fac");async function Fg(r,e,t,s,o,l){_e(r.config.authDomain,r,"auth-domain-config-required"),_e(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:s,v:Do,eventId:o};if(e instanceof T_){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",cw(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[w,T]of Object.entries({}))h[w]=T}if(e instanceof ol){const w=e.getScopes().filter(T=>T!=="");w.length>0&&(h.scopes=w.join(","))}r.tenantId&&(h.tid=r.tenantId);const p=h;for(const w of Object.keys(p))p[w]===void 0&&delete p[w];const g=await r._getAppCheckToken(),_=g?`#${SS}=${encodeURIComponent(g)}`:"";return`${AS(r)}?${rl(p).slice(1)}${_}`}function AS({config:r}){return r.emulator?af(r,IS):`https://${r.authDomain}/${TS}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed="webStorageSupport";class RS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=k_,this._completeRedirectFn=YI,this._overrideRedirectResult=GI}async _openPopup(e,t,s,o){var l;Dr((l=this.eventManagers[e._key()])===null||l===void 0?void 0:l.manager,"_initialize() not called before _openPopup()");const h=await Fg(e,t,s,xd(),o);return ES(e,h,df())}async _openRedirect(e,t,s,o){await this._originValidation(e);const l=await Fg(e,t,s,xd(),o);return kI(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Dr(l,"If manager is not set, promise should be"),l)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await pS(e),s=new JI(e);return t.register("authEvent",o=>(_e(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ed,{type:Ed},o=>{var l;const h=(l=o==null?void 0:o[0])===null||l===void 0?void 0:l[Ed];h!==void 0&&t(!!h),Bn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=rS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return y_()||h_()||uf()}}const CS=RS;var Ug="@firebase/auth",jg="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_e(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function xS(r){wo(new ls("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:p}=s.options;_e(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const g={apiKey:h,authDomain:p,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:__(r)},_=new KT(s,o,l,g);return iI(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),wo(new ls("auth-internal",e=>{const t=ps(e.getProvider("auth").getImmediate());return(s=>new PS(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),mi(Ug,jg,kS(r)),mi(Ug,jg,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NS=300,DS=Qy("authIdTokenMaxAge")||NS;let zg=null;const VS=r=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>DS)return;const o=t==null?void 0:t.token;zg!==o&&(zg=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function L_(r=rf()){const e=tf(r,"auth");if(e.isInitialized())return e.getImmediate();const t=rI(r,{popupRedirectResolver:CS,persistence:[FI,RI,k_]}),s=Qy("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(s,location.origin);if(location.origin===l.origin){const h=VS(l.toString());TI(t,h,()=>h(t.currentUser)),wI(t,p=>h(p))}}const o=Gy("auth");return o&&sI(t,`http://${o}`),t}function OS(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}QT({loadJS(r){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=e,s.onerror=o=>{const l=nr("internal-error");l.customData=o,t(l)},s.type="text/javascript",s.charset="UTF-8",OS().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});xS("Browser");var bS="firebase",LS="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mi(bS,LS,"app");var Bg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gi,M_;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(k,I){function C(){}C.prototype=I.prototype,k.D=I.prototype,k.prototype=new C,k.prototype.constructor=k,k.C=function(x,D,O){for(var R=Array(arguments.length-2),rt=2;rt<arguments.length;rt++)R[rt-2]=arguments[rt];return I.prototype[D].apply(x,R)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(k,I,C){C||(C=0);var x=Array(16);if(typeof I=="string")for(var D=0;16>D;++D)x[D]=I.charCodeAt(C++)|I.charCodeAt(C++)<<8|I.charCodeAt(C++)<<16|I.charCodeAt(C++)<<24;else for(D=0;16>D;++D)x[D]=I[C++]|I[C++]<<8|I[C++]<<16|I[C++]<<24;I=k.g[0],C=k.g[1],D=k.g[2];var O=k.g[3],R=I+(O^C&(D^O))+x[0]+3614090360&4294967295;I=C+(R<<7&4294967295|R>>>25),R=O+(D^I&(C^D))+x[1]+3905402710&4294967295,O=I+(R<<12&4294967295|R>>>20),R=D+(C^O&(I^C))+x[2]+606105819&4294967295,D=O+(R<<17&4294967295|R>>>15),R=C+(I^D&(O^I))+x[3]+3250441966&4294967295,C=D+(R<<22&4294967295|R>>>10),R=I+(O^C&(D^O))+x[4]+4118548399&4294967295,I=C+(R<<7&4294967295|R>>>25),R=O+(D^I&(C^D))+x[5]+1200080426&4294967295,O=I+(R<<12&4294967295|R>>>20),R=D+(C^O&(I^C))+x[6]+2821735955&4294967295,D=O+(R<<17&4294967295|R>>>15),R=C+(I^D&(O^I))+x[7]+4249261313&4294967295,C=D+(R<<22&4294967295|R>>>10),R=I+(O^C&(D^O))+x[8]+1770035416&4294967295,I=C+(R<<7&4294967295|R>>>25),R=O+(D^I&(C^D))+x[9]+2336552879&4294967295,O=I+(R<<12&4294967295|R>>>20),R=D+(C^O&(I^C))+x[10]+4294925233&4294967295,D=O+(R<<17&4294967295|R>>>15),R=C+(I^D&(O^I))+x[11]+2304563134&4294967295,C=D+(R<<22&4294967295|R>>>10),R=I+(O^C&(D^O))+x[12]+1804603682&4294967295,I=C+(R<<7&4294967295|R>>>25),R=O+(D^I&(C^D))+x[13]+4254626195&4294967295,O=I+(R<<12&4294967295|R>>>20),R=D+(C^O&(I^C))+x[14]+2792965006&4294967295,D=O+(R<<17&4294967295|R>>>15),R=C+(I^D&(O^I))+x[15]+1236535329&4294967295,C=D+(R<<22&4294967295|R>>>10),R=I+(D^O&(C^D))+x[1]+4129170786&4294967295,I=C+(R<<5&4294967295|R>>>27),R=O+(C^D&(I^C))+x[6]+3225465664&4294967295,O=I+(R<<9&4294967295|R>>>23),R=D+(I^C&(O^I))+x[11]+643717713&4294967295,D=O+(R<<14&4294967295|R>>>18),R=C+(O^I&(D^O))+x[0]+3921069994&4294967295,C=D+(R<<20&4294967295|R>>>12),R=I+(D^O&(C^D))+x[5]+3593408605&4294967295,I=C+(R<<5&4294967295|R>>>27),R=O+(C^D&(I^C))+x[10]+38016083&4294967295,O=I+(R<<9&4294967295|R>>>23),R=D+(I^C&(O^I))+x[15]+3634488961&4294967295,D=O+(R<<14&4294967295|R>>>18),R=C+(O^I&(D^O))+x[4]+3889429448&4294967295,C=D+(R<<20&4294967295|R>>>12),R=I+(D^O&(C^D))+x[9]+568446438&4294967295,I=C+(R<<5&4294967295|R>>>27),R=O+(C^D&(I^C))+x[14]+3275163606&4294967295,O=I+(R<<9&4294967295|R>>>23),R=D+(I^C&(O^I))+x[3]+4107603335&4294967295,D=O+(R<<14&4294967295|R>>>18),R=C+(O^I&(D^O))+x[8]+1163531501&4294967295,C=D+(R<<20&4294967295|R>>>12),R=I+(D^O&(C^D))+x[13]+2850285829&4294967295,I=C+(R<<5&4294967295|R>>>27),R=O+(C^D&(I^C))+x[2]+4243563512&4294967295,O=I+(R<<9&4294967295|R>>>23),R=D+(I^C&(O^I))+x[7]+1735328473&4294967295,D=O+(R<<14&4294967295|R>>>18),R=C+(O^I&(D^O))+x[12]+2368359562&4294967295,C=D+(R<<20&4294967295|R>>>12),R=I+(C^D^O)+x[5]+4294588738&4294967295,I=C+(R<<4&4294967295|R>>>28),R=O+(I^C^D)+x[8]+2272392833&4294967295,O=I+(R<<11&4294967295|R>>>21),R=D+(O^I^C)+x[11]+1839030562&4294967295,D=O+(R<<16&4294967295|R>>>16),R=C+(D^O^I)+x[14]+4259657740&4294967295,C=D+(R<<23&4294967295|R>>>9),R=I+(C^D^O)+x[1]+2763975236&4294967295,I=C+(R<<4&4294967295|R>>>28),R=O+(I^C^D)+x[4]+1272893353&4294967295,O=I+(R<<11&4294967295|R>>>21),R=D+(O^I^C)+x[7]+4139469664&4294967295,D=O+(R<<16&4294967295|R>>>16),R=C+(D^O^I)+x[10]+3200236656&4294967295,C=D+(R<<23&4294967295|R>>>9),R=I+(C^D^O)+x[13]+681279174&4294967295,I=C+(R<<4&4294967295|R>>>28),R=O+(I^C^D)+x[0]+3936430074&4294967295,O=I+(R<<11&4294967295|R>>>21),R=D+(O^I^C)+x[3]+3572445317&4294967295,D=O+(R<<16&4294967295|R>>>16),R=C+(D^O^I)+x[6]+76029189&4294967295,C=D+(R<<23&4294967295|R>>>9),R=I+(C^D^O)+x[9]+3654602809&4294967295,I=C+(R<<4&4294967295|R>>>28),R=O+(I^C^D)+x[12]+3873151461&4294967295,O=I+(R<<11&4294967295|R>>>21),R=D+(O^I^C)+x[15]+530742520&4294967295,D=O+(R<<16&4294967295|R>>>16),R=C+(D^O^I)+x[2]+3299628645&4294967295,C=D+(R<<23&4294967295|R>>>9),R=I+(D^(C|~O))+x[0]+4096336452&4294967295,I=C+(R<<6&4294967295|R>>>26),R=O+(C^(I|~D))+x[7]+1126891415&4294967295,O=I+(R<<10&4294967295|R>>>22),R=D+(I^(O|~C))+x[14]+2878612391&4294967295,D=O+(R<<15&4294967295|R>>>17),R=C+(O^(D|~I))+x[5]+4237533241&4294967295,C=D+(R<<21&4294967295|R>>>11),R=I+(D^(C|~O))+x[12]+1700485571&4294967295,I=C+(R<<6&4294967295|R>>>26),R=O+(C^(I|~D))+x[3]+2399980690&4294967295,O=I+(R<<10&4294967295|R>>>22),R=D+(I^(O|~C))+x[10]+4293915773&4294967295,D=O+(R<<15&4294967295|R>>>17),R=C+(O^(D|~I))+x[1]+2240044497&4294967295,C=D+(R<<21&4294967295|R>>>11),R=I+(D^(C|~O))+x[8]+1873313359&4294967295,I=C+(R<<6&4294967295|R>>>26),R=O+(C^(I|~D))+x[15]+4264355552&4294967295,O=I+(R<<10&4294967295|R>>>22),R=D+(I^(O|~C))+x[6]+2734768916&4294967295,D=O+(R<<15&4294967295|R>>>17),R=C+(O^(D|~I))+x[13]+1309151649&4294967295,C=D+(R<<21&4294967295|R>>>11),R=I+(D^(C|~O))+x[4]+4149444226&4294967295,I=C+(R<<6&4294967295|R>>>26),R=O+(C^(I|~D))+x[11]+3174756917&4294967295,O=I+(R<<10&4294967295|R>>>22),R=D+(I^(O|~C))+x[2]+718787259&4294967295,D=O+(R<<15&4294967295|R>>>17),R=C+(O^(D|~I))+x[9]+3951481745&4294967295,k.g[0]=k.g[0]+I&4294967295,k.g[1]=k.g[1]+(D+(R<<21&4294967295|R>>>11))&4294967295,k.g[2]=k.g[2]+D&4294967295,k.g[3]=k.g[3]+O&4294967295}s.prototype.u=function(k,I){I===void 0&&(I=k.length);for(var C=I-this.blockSize,x=this.B,D=this.h,O=0;O<I;){if(D==0)for(;O<=C;)o(this,k,O),O+=this.blockSize;if(typeof k=="string"){for(;O<I;)if(x[D++]=k.charCodeAt(O++),D==this.blockSize){o(this,x),D=0;break}}else for(;O<I;)if(x[D++]=k[O++],D==this.blockSize){o(this,x),D=0;break}}this.h=D,this.o+=I},s.prototype.v=function(){var k=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);k[0]=128;for(var I=1;I<k.length-8;++I)k[I]=0;var C=8*this.o;for(I=k.length-8;I<k.length;++I)k[I]=C&255,C/=256;for(this.u(k),k=Array(16),I=C=0;4>I;++I)for(var x=0;32>x;x+=8)k[C++]=this.g[I]>>>x&255;return k};function l(k,I){var C=p;return Object.prototype.hasOwnProperty.call(C,k)?C[k]:C[k]=I(k)}function h(k,I){this.h=I;for(var C=[],x=!0,D=k.length-1;0<=D;D--){var O=k[D]|0;x&&O==I||(C[D]=O,x=!1)}this.g=C}var p={};function g(k){return-128<=k&&128>k?l(k,function(I){return new h([I|0],0>I?-1:0)}):new h([k|0],0>k?-1:0)}function _(k){if(isNaN(k)||!isFinite(k))return T;if(0>k)return B(_(-k));for(var I=[],C=1,x=0;k>=C;x++)I[x]=k/C|0,C*=4294967296;return new h(I,0)}function w(k,I){if(k.length==0)throw Error("number format error: empty string");if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(k.charAt(0)=="-")return B(w(k.substring(1),I));if(0<=k.indexOf("-"))throw Error('number format error: interior "-" character');for(var C=_(Math.pow(I,8)),x=T,D=0;D<k.length;D+=8){var O=Math.min(8,k.length-D),R=parseInt(k.substring(D,D+O),I);8>O?(O=_(Math.pow(I,O)),x=x.j(O).add(_(R))):(x=x.j(C),x=x.add(_(R)))}return x}var T=g(0),A=g(1),F=g(16777216);r=h.prototype,r.m=function(){if(G(this))return-B(this).m();for(var k=0,I=1,C=0;C<this.g.length;C++){var x=this.i(C);k+=(0<=x?x:4294967296+x)*I,I*=4294967296}return k},r.toString=function(k){if(k=k||10,2>k||36<k)throw Error("radix out of range: "+k);if($(this))return"0";if(G(this))return"-"+B(this).toString(k);for(var I=_(Math.pow(k,6)),C=this,x="";;){var D=J(C,I).g;C=fe(C,D.j(I));var O=((0<C.g.length?C.g[0]:C.h)>>>0).toString(k);if(C=D,$(C))return O+x;for(;6>O.length;)O="0"+O;x=O+x}},r.i=function(k){return 0>k?0:k<this.g.length?this.g[k]:this.h};function $(k){if(k.h!=0)return!1;for(var I=0;I<k.g.length;I++)if(k.g[I]!=0)return!1;return!0}function G(k){return k.h==-1}r.l=function(k){return k=fe(this,k),G(k)?-1:$(k)?0:1};function B(k){for(var I=k.g.length,C=[],x=0;x<I;x++)C[x]=~k.g[x];return new h(C,~k.h).add(A)}r.abs=function(){return G(this)?B(this):this},r.add=function(k){for(var I=Math.max(this.g.length,k.g.length),C=[],x=0,D=0;D<=I;D++){var O=x+(this.i(D)&65535)+(k.i(D)&65535),R=(O>>>16)+(this.i(D)>>>16)+(k.i(D)>>>16);x=R>>>16,O&=65535,R&=65535,C[D]=R<<16|O}return new h(C,C[C.length-1]&-2147483648?-1:0)};function fe(k,I){return k.add(B(I))}r.j=function(k){if($(this)||$(k))return T;if(G(this))return G(k)?B(this).j(B(k)):B(B(this).j(k));if(G(k))return B(this.j(B(k)));if(0>this.l(F)&&0>k.l(F))return _(this.m()*k.m());for(var I=this.g.length+k.g.length,C=[],x=0;x<2*I;x++)C[x]=0;for(x=0;x<this.g.length;x++)for(var D=0;D<k.g.length;D++){var O=this.i(x)>>>16,R=this.i(x)&65535,rt=k.i(D)>>>16,Dt=k.i(D)&65535;C[2*x+2*D]+=R*Dt,ce(C,2*x+2*D),C[2*x+2*D+1]+=O*Dt,ce(C,2*x+2*D+1),C[2*x+2*D+1]+=R*rt,ce(C,2*x+2*D+1),C[2*x+2*D+2]+=O*rt,ce(C,2*x+2*D+2)}for(x=0;x<I;x++)C[x]=C[2*x+1]<<16|C[2*x];for(x=I;x<2*I;x++)C[x]=0;return new h(C,0)};function ce(k,I){for(;(k[I]&65535)!=k[I];)k[I+1]+=k[I]>>>16,k[I]&=65535,I++}function pe(k,I){this.g=k,this.h=I}function J(k,I){if($(I))throw Error("division by zero");if($(k))return new pe(T,T);if(G(k))return I=J(B(k),I),new pe(B(I.g),B(I.h));if(G(I))return I=J(k,B(I)),new pe(B(I.g),I.h);if(30<k.g.length){if(G(k)||G(I))throw Error("slowDivide_ only works with positive integers.");for(var C=A,x=I;0>=x.l(k);)C=Ee(C),x=Ee(x);var D=ue(C,1),O=ue(x,1);for(x=ue(x,2),C=ue(C,2);!$(x);){var R=O.add(x);0>=R.l(k)&&(D=D.add(C),O=R),x=ue(x,1),C=ue(C,1)}return I=fe(k,D.j(I)),new pe(D,I)}for(D=T;0<=k.l(I);){for(C=Math.max(1,Math.floor(k.m()/I.m())),x=Math.ceil(Math.log(C)/Math.LN2),x=48>=x?1:Math.pow(2,x-48),O=_(C),R=O.j(I);G(R)||0<R.l(k);)C-=x,O=_(C),R=O.j(I);$(O)&&(O=A),D=D.add(O),k=fe(k,R)}return new pe(D,k)}r.A=function(k){return J(this,k).h},r.and=function(k){for(var I=Math.max(this.g.length,k.g.length),C=[],x=0;x<I;x++)C[x]=this.i(x)&k.i(x);return new h(C,this.h&k.h)},r.or=function(k){for(var I=Math.max(this.g.length,k.g.length),C=[],x=0;x<I;x++)C[x]=this.i(x)|k.i(x);return new h(C,this.h|k.h)},r.xor=function(k){for(var I=Math.max(this.g.length,k.g.length),C=[],x=0;x<I;x++)C[x]=this.i(x)^k.i(x);return new h(C,this.h^k.h)};function Ee(k){for(var I=k.g.length+1,C=[],x=0;x<I;x++)C[x]=k.i(x)<<1|k.i(x-1)>>>31;return new h(C,k.h)}function ue(k,I){var C=I>>5;I%=32;for(var x=k.g.length-C,D=[],O=0;O<x;O++)D[O]=0<I?k.i(O+C)>>>I|k.i(O+C+1)<<32-I:k.i(O+C);return new h(D,k.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,M_=s,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=w,gi=h}).apply(typeof Bg<"u"?Bg:typeof self<"u"?self:typeof window<"u"?window:{});var xu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var F_,Ma,U_,Uu,Od,j_,z_,B_;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(u,f,y){return u==Array.prototype||u==Object.prototype||(u[f]=y.value),u};function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof xu=="object"&&xu];for(var f=0;f<u.length;++f){var y=u[f];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var s=t(this);function o(u,f){if(f)e:{var y=s;u=u.split(".");for(var E=0;E<u.length-1;E++){var b=u[E];if(!(b in y))break e;y=y[b]}u=u[u.length-1],E=y[u],f=f(E),f!=E&&f!=null&&e(y,u,{configurable:!0,writable:!0,value:f})}}function l(u,f){u instanceof String&&(u+="");var y=0,E=!1,b={next:function(){if(!E&&y<u.length){var z=y++;return{value:f(z,u[z]),done:!1}}return E=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}o("Array.prototype.values",function(u){return u||function(){return l(this,function(f,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},p=this||self;function g(u){var f=typeof u;return f=f!="object"?f:u?Array.isArray(u)?"array":f:"null",f=="array"||f=="object"&&typeof u.length=="number"}function _(u){var f=typeof u;return f=="object"&&u!=null||f=="function"}function w(u,f,y){return u.call.apply(u.bind,arguments)}function T(u,f,y){if(!u)throw Error();if(2<arguments.length){var E=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,E),u.apply(f,b)}}return function(){return u.apply(f,arguments)}}function A(u,f,y){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?w:T,A.apply(null,arguments)}function F(u,f){var y=Array.prototype.slice.call(arguments,1);return function(){var E=y.slice();return E.push.apply(E,arguments),u.apply(this,E)}}function $(u,f){function y(){}y.prototype=f.prototype,u.aa=f.prototype,u.prototype=new y,u.prototype.constructor=u,u.Qb=function(E,b,z){for(var Z=Array(arguments.length-2),je=2;je<arguments.length;je++)Z[je-2]=arguments[je];return f.prototype[b].apply(E,Z)}}function G(u){const f=u.length;if(0<f){const y=Array(f);for(let E=0;E<f;E++)y[E]=u[E];return y}return[]}function B(u,f){for(let y=1;y<arguments.length;y++){const E=arguments[y];if(g(E)){const b=u.length||0,z=E.length||0;u.length=b+z;for(let Z=0;Z<z;Z++)u[b+Z]=E[Z]}else u.push(E)}}class fe{constructor(f,y){this.i=f,this.j=y,this.h=0,this.g=null}get(){let f;return 0<this.h?(this.h--,f=this.g,this.g=f.next,f.next=null):f=this.i(),f}}function ce(u){return/^[\s\xa0]*$/.test(u)}function pe(){var u=p.navigator;return u&&(u=u.userAgent)?u:""}function J(u){return J[" "](u),u}J[" "]=function(){};var Ee=pe().indexOf("Gecko")!=-1&&!(pe().toLowerCase().indexOf("webkit")!=-1&&pe().indexOf("Edge")==-1)&&!(pe().indexOf("Trident")!=-1||pe().indexOf("MSIE")!=-1)&&pe().indexOf("Edge")==-1;function ue(u,f,y){for(const E in u)f.call(y,u[E],E,u)}function k(u,f){for(const y in u)f.call(void 0,u[y],y,u)}function I(u){const f={};for(const y in u)f[y]=u[y];return f}const C="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function x(u,f){let y,E;for(let b=1;b<arguments.length;b++){E=arguments[b];for(y in E)u[y]=E[y];for(let z=0;z<C.length;z++)y=C[z],Object.prototype.hasOwnProperty.call(E,y)&&(u[y]=E[y])}}function D(u){var f=1;u=u.split(":");const y=[];for(;0<f&&u.length;)y.push(u.shift()),f--;return u.length&&y.push(u.join(":")),y}function O(u){p.setTimeout(()=>{throw u},0)}function R(){var u=me;let f=null;return u.g&&(f=u.g,u.g=u.g.next,u.g||(u.h=null),f.next=null),f}class rt{constructor(){this.h=this.g=null}add(f,y){const E=Dt.get();E.set(f,y),this.h?this.h.next=E:this.g=E,this.h=E}}var Dt=new fe(()=>new Vt,u=>u.reset());class Vt{constructor(){this.next=this.g=this.h=null}set(f,y){this.h=f,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let ze,ee=!1,me=new rt,ie=()=>{const u=p.Promise.resolve(void 0);ze=()=>{u.then(V)}};var V=()=>{for(var u;u=R();){try{u.h.call(u.g)}catch(y){O(y)}var f=Dt;f.j(u),100>f.h&&(f.h++,u.next=f.g,f.g=u)}ee=!1};function W(){this.s=this.s,this.C=this.C}W.prototype.s=!1,W.prototype.ma=function(){this.s||(this.s=!0,this.N())},W.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function he(u,f){this.type=u,this.g=this.target=f,this.defaultPrevented=!1}he.prototype.h=function(){this.defaultPrevented=!0};var Se=(function(){if(!p.addEventListener||!Object.defineProperty)return!1;var u=!1,f=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};p.addEventListener("test",y,f),p.removeEventListener("test",y,f)}catch{}return u})();function Re(u,f){if(he.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u){var y=this.type=u.type,E=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;if(this.target=u.target||u.srcElement,this.g=f,f=u.relatedTarget){if(Ee){e:{try{J(f.nodeName);var b=!0;break e}catch{}b=!1}b||(f=null)}}else y=="mouseover"?f=u.fromElement:y=="mouseout"&&(f=u.toElement);this.relatedTarget=f,E?(this.clientX=E.clientX!==void 0?E.clientX:E.pageX,this.clientY=E.clientY!==void 0?E.clientY:E.pageY,this.screenX=E.screenX||0,this.screenY=E.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=typeof u.pointerType=="string"?u.pointerType:De[u.pointerType]||"",this.state=u.state,this.i=u,u.defaultPrevented&&Re.aa.h.call(this)}}$(Re,he);var De={2:"touch",3:"pen",4:"mouse"};Re.prototype.h=function(){Re.aa.h.call(this);var u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var Me="closure_listenable_"+(1e6*Math.random()|0),Fe=0;function $e(u,f,y,E,b){this.listener=u,this.proxy=null,this.src=f,this.type=y,this.capture=!!E,this.ha=b,this.key=++Fe,this.da=this.fa=!1}function _t(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function ur(u){this.src=u,this.g={},this.h=0}ur.prototype.add=function(u,f,y,E,b){var z=u.toString();u=this.g[z],u||(u=this.g[z]=[],this.h++);var Z=Lr(u,f,E,b);return-1<Z?(f=u[Z],y||(f.fa=!1)):(f=new $e(f,this.src,z,!!E,b),f.fa=y,u.push(f)),f};function _s(u,f){var y=f.type;if(y in u.g){var E=u.g[y],b=Array.prototype.indexOf.call(E,f,void 0),z;(z=0<=b)&&Array.prototype.splice.call(E,b,1),z&&(_t(f),u.g[y].length==0&&(delete u.g[y],u.h--))}}function Lr(u,f,y,E){for(var b=0;b<u.length;++b){var z=u[b];if(!z.da&&z.listener==f&&z.capture==!!y&&z.ha==E)return b}return-1}var Ni="closure_lm_"+(1e6*Math.random()|0),vs={};function jo(u,f,y,E,b){if(Array.isArray(f)){for(var z=0;z<f.length;z++)jo(u,f[z],y,E,b);return null}return y=$o(y),u&&u[Me]?u.K(f,y,_(E)?!!E.capture:!1,b):zo(u,f,y,!1,E,b)}function zo(u,f,y,E,b,z){if(!f)throw Error("Invalid event type");var Z=_(b)?!!b.capture:!!b,je=ws(u);if(je||(u[Ni]=je=new ur(u)),y=je.add(f,y,E,Z,z),y.proxy)return y;if(E=fl(),y.proxy=E,E.src=u,E.listener=y,u.addEventListener)Se||(b=Z),b===void 0&&(b=!1),u.addEventListener(f.toString(),E,b);else if(u.attachEvent)u.attachEvent(hr(f.toString()),E);else if(u.addListener&&u.removeListener)u.addListener(E);else throw Error("addEventListener and attachEvent are unavailable.");return y}function fl(){function u(y){return f.call(u.src,u.listener,y)}const f=Bo;return u}function Es(u,f,y,E,b){if(Array.isArray(f))for(var z=0;z<f.length;z++)Es(u,f[z],y,E,b);else E=_(E)?!!E.capture:!!E,y=$o(y),u&&u[Me]?(u=u.i,f=String(f).toString(),f in u.g&&(z=u.g[f],y=Lr(z,y,E,b),-1<y&&(_t(z[y]),Array.prototype.splice.call(z,y,1),z.length==0&&(delete u.g[f],u.h--)))):u&&(u=ws(u))&&(f=u.g[f.toString()],u=-1,f&&(u=Lr(f,y,E,b)),(y=-1<u?f[u]:null)&&cr(y))}function cr(u){if(typeof u!="number"&&u&&!u.da){var f=u.src;if(f&&f[Me])_s(f.i,u);else{var y=u.type,E=u.proxy;f.removeEventListener?f.removeEventListener(y,E,u.capture):f.detachEvent?f.detachEvent(hr(y),E):f.addListener&&f.removeListener&&f.removeListener(E),(y=ws(f))?(_s(y,u),y.h==0&&(y.src=null,f[Ni]=null)):_t(u)}}}function hr(u){return u in vs?vs[u]:vs[u]="on"+u}function Bo(u,f){if(u.da)u=!0;else{f=new Re(f,this);var y=u.listener,E=u.ha||u.src;u.fa&&cr(u),u=y.call(E,f)}return u}function ws(u){return u=u[Ni],u instanceof ur?u:null}var Ts="__closure_events_fn_"+(1e9*Math.random()>>>0);function $o(u){return typeof u=="function"?u:(u[Ts]||(u[Ts]=function(f){return u.handleEvent(f)}),u[Ts])}function dt(){W.call(this),this.i=new ur(this),this.M=this,this.F=null}$(dt,W),dt.prototype[Me]=!0,dt.prototype.removeEventListener=function(u,f,y,E){Es(this,u,f,y,E)};function ft(u,f){var y,E=u.F;if(E)for(y=[];E;E=E.F)y.push(E);if(u=u.M,E=f.type||f,typeof f=="string")f=new he(f,u);else if(f instanceof he)f.target=f.target||u;else{var b=f;f=new he(E,u),x(f,b)}if(b=!0,y)for(var z=y.length-1;0<=z;z--){var Z=f.g=y[z];b=dr(Z,E,!0,f)&&b}if(Z=f.g=u,b=dr(Z,E,!0,f)&&b,b=dr(Z,E,!1,f)&&b,y)for(z=0;z<y.length;z++)Z=f.g=y[z],b=dr(Z,E,!1,f)&&b}dt.prototype.N=function(){if(dt.aa.N.call(this),this.i){var u=this.i,f;for(f in u.g){for(var y=u.g[f],E=0;E<y.length;E++)_t(y[E]);delete u.g[f],u.h--}}this.F=null},dt.prototype.K=function(u,f,y,E){return this.i.add(String(u),f,!1,y,E)},dt.prototype.L=function(u,f,y,E){return this.i.add(String(u),f,!0,y,E)};function dr(u,f,y,E){if(f=u.i.g[String(f)],!f)return!0;f=f.concat();for(var b=!0,z=0;z<f.length;++z){var Z=f[z];if(Z&&!Z.da&&Z.capture==y){var je=Z.listener,pt=Z.ha||Z.src;Z.fa&&_s(u.i,Z),b=je.call(pt,E)!==!1&&b}}return b&&!E.defaultPrevented}function qo(u,f,y){if(typeof u=="function")y&&(u=A(u,y));else if(u&&typeof u.handleEvent=="function")u=A(u.handleEvent,u);else throw Error("Invalid listener argument");return 2147483647<Number(f)?-1:p.setTimeout(u,f||0)}function Mr(u){u.g=qo(()=>{u.g=null,u.i&&(u.i=!1,Mr(u))},u.l);const f=u.h;u.h=null,u.m.apply(null,f)}class Di extends W{constructor(f,y){super(),this.m=f,this.l=y,this.h=null,this.i=!1,this.g=null}j(f){this.h=arguments,this.g?this.i=!0:Mr(this)}N(){super.N(),this.g&&(p.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Vi(u){W.call(this),this.h=u,this.g={}}$(Vi,W);var Ho=[];function Wo(u){ue(u.g,function(f,y){this.g.hasOwnProperty(y)&&cr(f)},u),u.g={}}Vi.prototype.N=function(){Vi.aa.N.call(this),Wo(this)},Vi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Go=p.JSON.stringify,Ko=p.JSON.parse,Qo=class{stringify(u){return p.JSON.stringify(u,void 0)}parse(u){return p.JSON.parse(u,void 0)}};function Oi(){}Oi.prototype.h=null;function Is(u){return u.h||(u.h=u.i())}function Ss(){}var hn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function qn(){he.call(this,"d")}$(qn,he);function As(){he.call(this,"c")}$(As,he);var Hn={},Yo=null;function bi(){return Yo=Yo||new dt}Hn.La="serverreachability";function Xo(u){he.call(this,Hn.La,u)}$(Xo,he);function fr(u){const f=bi();ft(f,new Xo(f))}Hn.STAT_EVENT="statevent";function Jo(u,f){he.call(this,Hn.STAT_EVENT,u),this.stat=f}$(Jo,he);function it(u){const f=bi();ft(f,new Jo(f,u))}Hn.Ma="timingevent";function Rs(u,f){he.call(this,Hn.Ma,u),this.size=f}$(Rs,he);function In(u,f){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return p.setTimeout(function(){u()},f)}function Li(){this.g=!0}Li.prototype.xa=function(){this.g=!1};function Mi(u,f,y,E,b,z){u.info(function(){if(u.g)if(z)for(var Z="",je=z.split("&"),pt=0;pt<je.length;pt++){var Ve=je[pt].split("=");if(1<Ve.length){var vt=Ve[0];Ve=Ve[1];var at=vt.split("_");Z=2<=at.length&&at[1]=="type"?Z+(vt+"="+Ve+"&"):Z+(vt+"=redacted&")}}else Z=null;else Z=z;return"XMLHTTP REQ ("+E+") [attempt "+b+"]: "+f+`
`+y+`
`+Z})}function Cs(u,f,y,E,b,z,Z){u.info(function(){return"XMLHTTP RESP ("+E+") [ attempt "+b+"]: "+f+`
`+y+`
`+z+" "+Z})}function Sn(u,f,y,E){u.info(function(){return"XMLHTTP TEXT ("+f+"): "+Mc(u,y)+(E?" "+E:"")})}function Zo(u,f){u.info(function(){return"TIMEOUT: "+f})}Li.prototype.info=function(){};function Mc(u,f){if(!u.g)return f;if(!f)return null;try{var y=JSON.parse(f);if(y){for(u=0;u<y.length;u++)if(Array.isArray(y[u])){var E=y[u];if(!(2>E.length)){var b=E[1];if(Array.isArray(b)&&!(1>b.length)){var z=b[0];if(z!="noop"&&z!="stop"&&z!="close")for(var Z=1;Z<b.length;Z++)b[Z]=""}}}}return Go(y)}catch{return f}}var Ps={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},pl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},An;function Fi(){}$(Fi,Oi),Fi.prototype.g=function(){return new XMLHttpRequest},Fi.prototype.i=function(){return{}},An=new Fi;function Rn(u,f,y,E){this.j=u,this.i=f,this.l=y,this.R=E||1,this.U=new Vi(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ml}function ml(){this.i=null,this.g="",this.h=!1}var ea={},ks={};function xs(u,f,y){u.L=1,u.v=Br(rn(f)),u.m=y,u.P=!0,ta(u,null)}function ta(u,f){u.F=Date.now(),qe(u),u.A=rn(u.v);var y=u.A,E=u.R;Array.isArray(E)||(E=[String(E)]),qr(y.i,"t",E),u.C=0,y=u.j.J,u.h=new ml,u.g=Vl(u.j,y?f:null,!u.m),0<u.O&&(u.M=new Di(A(u.Y,u,u.g),u.O)),f=u.U,y=u.g,E=u.ca;var b="readystatechange";Array.isArray(b)||(b&&(Ho[0]=b.toString()),b=Ho);for(var z=0;z<b.length;z++){var Z=jo(y,b[z],E||f.handleEvent,!1,f.h||f);if(!Z)break;f.g[Z.key]=Z}f=u.H?I(u.H):{},u.m?(u.u||(u.u="POST"),f["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.A,u.u,u.m,f)):(u.u="GET",u.g.ea(u.A,u.u,null,f)),fr(),Mi(u.i,u.u,u.A,u.l,u.R,u.m)}Rn.prototype.ca=function(u){u=u.target;const f=this.M;f&&Gt(u)==3?f.j():this.Y(u)},Rn.prototype.Y=function(u){try{if(u==this.g)e:{const at=Gt(this.g);var f=this.g.Ba();const pn=this.g.Z();if(!(3>at)&&(at!=3||this.g&&(this.h.h||this.g.oa()||aa(this.g)))){this.J||at!=4||f==7||(f==8||0>=pn?fr(3):fr(2)),Ui(this);var y=this.g.Z();this.X=y;t:if(gl(this)){var E=aa(this.g);u="";var b=E.length,z=Gt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){dn(this),Fr(this);var Z="";break t}this.h.i=new p.TextDecoder}for(f=0;f<b;f++)this.h.h=!0,u+=this.h.i.decode(E[f],{stream:!(z&&f==b-1)});E.length=0,this.h.g+=u,this.C=0,Z=this.h.g}else Z=this.g.oa();if(this.o=y==200,Cs(this.i,this.u,this.A,this.l,this.R,at,y),this.o){if(this.T&&!this.K){t:{if(this.g){var je,pt=this.g;if((je=pt.g?pt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ce(je)){var Ve=je;break t}}Ve=null}if(y=Ve)Sn(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,na(this,y);else{this.o=!1,this.s=3,it(12),dn(this),Fr(this);break e}}if(this.P){y=!0;let on;for(;!this.J&&this.C<Z.length;)if(on=Fc(this,Z),on==ks){at==4&&(this.s=4,it(14),y=!1),Sn(this.i,this.l,null,"[Incomplete Response]");break}else if(on==ea){this.s=4,it(15),Sn(this.i,this.l,Z,"[Invalid Chunk]"),y=!1;break}else Sn(this.i,this.l,on,null),na(this,on);if(gl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),at!=4||Z.length!=0||this.h.h||(this.s=1,it(16),y=!1),this.o=this.o&&y,!y)Sn(this.i,this.l,Z,"[Invalid Chunked Response]"),dn(this),Fr(this);else if(0<Z.length&&!this.W){this.W=!0;var vt=this.j;vt.g==this&&vt.ba&&!vt.M&&(vt.j.info("Great, no buffering proxy detected. Bytes received: "+Z.length),ua(vt),vt.M=!0,it(11))}}else Sn(this.i,this.l,Z,null),na(this,Z);at==4&&dn(this),this.o&&!this.J&&(at==4?zs(this.j,this):(this.o=!1,qe(this)))}else Ls(this.g),y==400&&0<Z.indexOf("Unknown SID")?(this.s=3,it(12)):(this.s=0,it(13)),dn(this),Fr(this)}}}catch{}finally{}};function gl(u){return u.g?u.u=="GET"&&u.L!=2&&u.j.Ca:!1}function Fc(u,f){var y=u.C,E=f.indexOf(`
`,y);return E==-1?ks:(y=Number(f.substring(y,E)),isNaN(y)?ea:(E+=1,E+y>f.length?ks:(f=f.slice(E,E+y),u.C=E+y,f)))}Rn.prototype.cancel=function(){this.J=!0,dn(this)};function qe(u){u.S=Date.now()+u.I,yl(u,u.I)}function yl(u,f){if(u.B!=null)throw Error("WatchDog timer not null");u.B=In(A(u.ba,u),f)}function Ui(u){u.B&&(p.clearTimeout(u.B),u.B=null)}Rn.prototype.ba=function(){this.B=null;const u=Date.now();0<=u-this.S?(Zo(this.i,this.A),this.L!=2&&(fr(),it(17)),dn(this),this.s=2,Fr(this)):yl(this,this.S-u)};function Fr(u){u.j.G==0||u.J||zs(u.j,u)}function dn(u){Ui(u);var f=u.M;f&&typeof f.ma=="function"&&f.ma(),u.M=null,Wo(u.U),u.g&&(f=u.g,u.g=null,f.abort(),f.ma())}function na(u,f){try{var y=u.j;if(y.G!=0&&(y.g==u||Bt(y.h,u))){if(!u.K&&Bt(y.h,u)&&y.G==3){try{var E=y.Da.g.parse(f)}catch{E=null}if(Array.isArray(E)&&E.length==3){var b=E;if(b[0]==0){e:if(!y.u){if(y.g)if(y.g.F+3e3<u.F)js(y),Nn(y);else break e;Us(y),it(18)}}else y.za=b[1],0<y.za-y.T&&37500>b[2]&&y.F&&y.v==0&&!y.C&&(y.C=In(A(y.Za,y),6e3));if(1>=vl(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else _r(y,11)}else if((u.K||y.g==u)&&js(y),!ce(f))for(b=y.Da.g.parse(f),f=0;f<b.length;f++){let Ve=b[f];if(y.T=Ve[0],Ve=Ve[1],y.G==2)if(Ve[0]=="c"){y.K=Ve[1],y.ia=Ve[2];const vt=Ve[3];vt!=null&&(y.la=vt,y.j.info("VER="+y.la));const at=Ve[4];at!=null&&(y.Aa=at,y.j.info("SVER="+y.Aa));const pn=Ve[5];pn!=null&&typeof pn=="number"&&0<pn&&(E=1.5*pn,y.L=E,y.j.info("backChannelRequestTimeoutMs_="+E)),E=y;const on=u.g;if(on){const Wi=on.g?on.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Wi){var z=E.h;z.g||Wi.indexOf("spdy")==-1&&Wi.indexOf("quic")==-1&&Wi.indexOf("h2")==-1||(z.j=z.l,z.g=new Set,z.h&&(ra(z,z.h),z.h=null))}if(E.D){const $s=on.g?on.g.getResponseHeader("X-HTTP-Session-Id"):null;$s&&(E.ya=$s,Be(E.I,E.D,$s))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-u.F,y.j.info("Handshake RTT: "+y.R+"ms")),E=y;var Z=u;if(E.qa=Dl(E,E.J?E.ia:null,E.W),Z.K){El(E.h,Z);var je=Z,pt=E.L;pt&&(je.I=pt),je.B&&(Ui(je),qe(je)),E.g=Z}else Hi(E);0<y.i.length&&Qn(y)}else Ve[0]!="stop"&&Ve[0]!="close"||_r(y,7);else y.G==3&&(Ve[0]=="stop"||Ve[0]=="close"?Ve[0]=="stop"?_r(y,7):Rt(y):Ve[0]!="noop"&&y.l&&y.l.ta(Ve),y.v=0)}}fr(4)}catch{}}var _l=class{constructor(u,f){this.g=u,this.map=f}};function ji(u){this.l=u||10,p.PerformanceNavigationTiming?(u=p.performance.getEntriesByType("navigation"),u=0<u.length&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(p.chrome&&p.chrome.loadTimes&&p.chrome.loadTimes()&&p.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function nn(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function vl(u){return u.h?1:u.g?u.g.size:0}function Bt(u,f){return u.h?u.h==f:u.g?u.g.has(f):!1}function ra(u,f){u.g?u.g.add(f):u.h=f}function El(u,f){u.h&&u.h==f?u.h=null:u.g&&u.g.has(f)&&u.g.delete(f)}ji.prototype.cancel=function(){if(this.i=wl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function wl(u){if(u.h!=null)return u.i.concat(u.h.D);if(u.g!=null&&u.g.size!==0){let f=u.i;for(const y of u.g.values())f=f.concat(y.D);return f}return G(u.i)}function Ns(u){if(u.V&&typeof u.V=="function")return u.V();if(typeof Map<"u"&&u instanceof Map||typeof Set<"u"&&u instanceof Set)return Array.from(u.values());if(typeof u=="string")return u.split("");if(g(u)){for(var f=[],y=u.length,E=0;E<y;E++)f.push(u[E]);return f}f=[],y=0;for(E in u)f[y++]=u[E];return f}function Ds(u){if(u.na&&typeof u.na=="function")return u.na();if(!u.V||typeof u.V!="function"){if(typeof Map<"u"&&u instanceof Map)return Array.from(u.keys());if(!(typeof Set<"u"&&u instanceof Set)){if(g(u)||typeof u=="string"){var f=[];u=u.length;for(var y=0;y<u;y++)f.push(y);return f}f=[],y=0;for(const E in u)f[y++]=E;return f}}}function Ur(u,f){if(u.forEach&&typeof u.forEach=="function")u.forEach(f,void 0);else if(g(u)||typeof u=="string")Array.prototype.forEach.call(u,f,void 0);else for(var y=Ds(u),E=Ns(u),b=E.length,z=0;z<b;z++)f.call(void 0,E[z],y&&y[z],u)}var zi=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Uc(u,f){if(u){u=u.split("&");for(var y=0;y<u.length;y++){var E=u[y].indexOf("="),b=null;if(0<=E){var z=u[y].substring(0,E);b=u[y].substring(E+1)}else z=u[y];f(z,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function pr(u){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,u instanceof pr){this.h=u.h,Bi(this,u.j),this.o=u.o,this.g=u.g,jr(this,u.s),this.l=u.l;var f=u.i,y=new Wn;y.i=f.i,f.g&&(y.g=new Map(f.g),y.h=f.h),zr(this,y),this.m=u.m}else u&&(f=String(u).match(zi))?(this.h=!1,Bi(this,f[1]||"",!0),this.o=Ne(f[2]||""),this.g=Ne(f[3]||"",!0),jr(this,f[4]),this.l=Ne(f[5]||"",!0),zr(this,f[6]||"",!0),this.m=Ne(f[7]||"")):(this.h=!1,this.i=new Wn(null,this.h))}pr.prototype.toString=function(){var u=[],f=this.j;f&&u.push($r(f,Vs,!0),":");var y=this.g;return(y||f=="file")&&(u.push("//"),(f=this.o)&&u.push($r(f,Vs,!0),"@"),u.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&u.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push($r(y,y.charAt(0)=="/"?Sl:Il,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",$r(y,ia)),u.join("")};function rn(u){return new pr(u)}function Bi(u,f,y){u.j=y?Ne(f,!0):f,u.j&&(u.j=u.j.replace(/:$/,""))}function jr(u,f){if(f){if(f=Number(f),isNaN(f)||0>f)throw Error("Bad port number "+f);u.s=f}else u.s=null}function zr(u,f,y){f instanceof Wn?(u.i=f,Gn(u.i,u.h)):(y||(f=$r(f,Al)),u.i=new Wn(f,u.h))}function Be(u,f,y){u.i.set(f,y)}function Br(u){return Be(u,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),u}function Ne(u,f){return u?f?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function $r(u,f,y){return typeof u=="string"?(u=encodeURI(u).replace(f,Tl),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function Tl(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var Vs=/[#\/\?@]/g,Il=/[#\?:]/g,Sl=/[#\?]/g,Al=/[#\?@]/g,ia=/#/g;function Wn(u,f){this.h=this.g=null,this.i=u||null,this.j=!!f}function At(u){u.g||(u.g=new Map,u.h=0,u.i&&Uc(u.i,function(f,y){u.add(decodeURIComponent(f.replace(/\+/g," ")),y)}))}r=Wn.prototype,r.add=function(u,f){At(this),this.i=null,u=fn(this,u);var y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(f),this.h+=1,this};function Cn(u,f){At(u),f=fn(u,f),u.g.has(f)&&(u.i=null,u.h-=u.g.get(f).length,u.g.delete(f))}function Pn(u,f){return At(u),f=fn(u,f),u.g.has(f)}r.forEach=function(u,f){At(this),this.g.forEach(function(y,E){y.forEach(function(b){u.call(f,b,E,this)},this)},this)},r.na=function(){At(this);const u=Array.from(this.g.values()),f=Array.from(this.g.keys()),y=[];for(let E=0;E<f.length;E++){const b=u[E];for(let z=0;z<b.length;z++)y.push(f[E])}return y},r.V=function(u){At(this);let f=[];if(typeof u=="string")Pn(this,u)&&(f=f.concat(this.g.get(fn(this,u))));else{u=Array.from(this.g.values());for(let y=0;y<u.length;y++)f=f.concat(u[y])}return f},r.set=function(u,f){return At(this),this.i=null,u=fn(this,u),Pn(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[f]),this.h+=1,this},r.get=function(u,f){return u?(u=this.V(u),0<u.length?String(u[0]):f):f};function qr(u,f,y){Cn(u,f),0<y.length&&(u.i=null,u.g.set(fn(u,f),G(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],f=Array.from(this.g.keys());for(var y=0;y<f.length;y++){var E=f[y];const z=encodeURIComponent(String(E)),Z=this.V(E);for(E=0;E<Z.length;E++){var b=z;Z[E]!==""&&(b+="="+encodeURIComponent(String(Z[E]))),u.push(b)}}return this.i=u.join("&")};function fn(u,f){return f=String(f),u.j&&(f=f.toLowerCase()),f}function Gn(u,f){f&&!u.j&&(At(u),u.i=null,u.g.forEach(function(y,E){var b=E.toLowerCase();E!=b&&(Cn(this,E),qr(this,b,y))},u)),u.j=f}function jc(u,f){const y=new Li;if(p.Image){const E=new Image;E.onload=F(Wt,y,"TestLoadImage: loaded",!0,f,E),E.onerror=F(Wt,y,"TestLoadImage: error",!1,f,E),E.onabort=F(Wt,y,"TestLoadImage: abort",!1,f,E),E.ontimeout=F(Wt,y,"TestLoadImage: timeout",!1,f,E),p.setTimeout(function(){E.ontimeout&&E.ontimeout()},1e4),E.src=u}else f(!1)}function Rl(u,f){const y=new Li,E=new AbortController,b=setTimeout(()=>{E.abort(),Wt(y,"TestPingServer: timeout",!1,f)},1e4);fetch(u,{signal:E.signal}).then(z=>{clearTimeout(b),z.ok?Wt(y,"TestPingServer: ok",!0,f):Wt(y,"TestPingServer: server error",!1,f)}).catch(()=>{clearTimeout(b),Wt(y,"TestPingServer: error",!1,f)})}function Wt(u,f,y,E,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),E(y)}catch{}}function zc(){this.g=new Qo}function Cl(u,f,y){const E=y||"";try{Ur(u,function(b,z){let Z=b;_(b)&&(Z=Go(b)),f.push(E+z+"="+encodeURIComponent(Z))})}catch(b){throw f.push(E+"type="+encodeURIComponent("_badmap")),b}}function mr(u){this.l=u.Ub||null,this.j=u.eb||!1}$(mr,Oi),mr.prototype.g=function(){return new $i(this.l,this.j)},mr.prototype.i=(function(u){return function(){return u}})({});function $i(u,f){dt.call(this),this.D=u,this.o=f,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}$($i,dt),r=$i.prototype,r.open=function(u,f){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=u,this.A=f,this.readyState=1,xn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const f={headers:this.u,method:this.B,credentials:this.m,cache:void 0};u&&(f.body=u),(this.D||p).fetch(new Request(this.A,f)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,kn(this)),this.readyState=0},r.Sa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,xn(this)),this.g&&(this.readyState=3,xn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof p.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Pl(this)}else u.text().then(this.Ra.bind(this),this.ga.bind(this))};function Pl(u){u.j.read().then(u.Pa.bind(u)).catch(u.ga.bind(u))}r.Pa=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var f=u.value?u.value:new Uint8Array(0);(f=this.v.decode(f,{stream:!u.done}))&&(this.response=this.responseText+=f)}u.done?kn(this):xn(this),this.readyState==3&&Pl(this)}},r.Ra=function(u){this.g&&(this.response=this.responseText=u,kn(this))},r.Qa=function(u){this.g&&(this.response=u,kn(this))},r.ga=function(){this.g&&kn(this)};function kn(u){u.readyState=4,u.l=null,u.j=null,u.v=null,xn(u)}r.setRequestHeader=function(u,f){this.u.append(u,f)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],f=this.h.entries();for(var y=f.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=f.next();return u.join(`\r
`)};function xn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty($i.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function gr(u){let f="";return ue(u,function(y,E){f+=E,f+=":",f+=y,f+=`\r
`}),f}function Hr(u,f,y){e:{for(E in y){var E=!1;break e}E=!0}E||(y=gr(y),typeof u=="string"?y!=null&&encodeURIComponent(String(y)):Be(u,f,y))}function Ye(u){dt.call(this),this.headers=new Map,this.o=u||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}$(Ye,dt);var Bc=/^https?$/i,sa=["POST","PUT"];r=Ye.prototype,r.Ha=function(u){this.J=u},r.ea=function(u,f,y,E){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);f=f?f.toUpperCase():"GET",this.D=u,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():An.g(),this.v=this.o?Is(this.o):Is(An),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(f,String(u),!0),this.B=!1}catch(z){qi(this,z);return}if(u=y||"",y=new Map(this.headers),E)if(Object.getPrototypeOf(E)===Object.prototype)for(var b in E)y.set(b,E[b]);else if(typeof E.keys=="function"&&typeof E.get=="function")for(const z of E.keys())y.set(z,E.get(z));else throw Error("Unknown input type for opt_headers: "+String(E));E=Array.from(y.keys()).find(z=>z.toLowerCase()=="content-type"),b=p.FormData&&u instanceof p.FormData,!(0<=Array.prototype.indexOf.call(sa,f,void 0))||E||b||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[z,Z]of y)this.g.setRequestHeader(z,Z);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{bs(this),this.u=!0,this.g.send(u),this.u=!1}catch(z){qi(this,z)}};function qi(u,f){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=f,u.m=5,Os(u),sn(u)}function Os(u){u.A||(u.A=!0,ft(u,"complete"),ft(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=u||7,ft(this,"complete"),ft(this,"abort"),sn(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),sn(this,!0)),Ye.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?oa(this):this.bb())},r.bb=function(){oa(this)};function oa(u){if(u.h&&typeof h<"u"&&(!u.v[1]||Gt(u)!=4||u.Z()!=2)){if(u.u&&Gt(u)==4)qo(u.Ea,0,u);else if(ft(u,"readystatechange"),Gt(u)==4){u.h=!1;try{const Z=u.Z();e:switch(Z){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var f=!0;break e;default:f=!1}var y;if(!(y=f)){var E;if(E=Z===0){var b=String(u.D).match(zi)[1]||null;!b&&p.self&&p.self.location&&(b=p.self.location.protocol.slice(0,-1)),E=!Bc.test(b?b.toLowerCase():"")}y=E}if(y)ft(u,"complete"),ft(u,"success");else{u.m=6;try{var z=2<Gt(u)?u.g.statusText:""}catch{z=""}u.l=z+" ["+u.Z()+"]",Os(u)}}finally{sn(u)}}}}function sn(u,f){if(u.g){bs(u);const y=u.g,E=u.v[0]?()=>{}:null;u.g=null,u.v=null,f||ft(u,"ready");try{y.onreadystatechange=E}catch{}}}function bs(u){u.I&&(p.clearTimeout(u.I),u.I=null)}r.isActive=function(){return!!this.g};function Gt(u){return u.g?u.g.readyState:0}r.Z=function(){try{return 2<Gt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(u){if(this.g){var f=this.g.responseText;return u&&f.indexOf(u)==0&&(f=f.substring(u.length)),Ko(f)}};function aa(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.H){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function Ls(u){const f={};u=(u.g&&2<=Gt(u)&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let E=0;E<u.length;E++){if(ce(u[E]))continue;var y=D(u[E]);const b=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const z=f[b]||[];f[b]=z,z.push(y)}k(f,function(E){return E.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Kn(u,f,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||f}function la(u){this.Aa=0,this.i=[],this.j=new Li,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Kn("failFast",!1,u),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Kn("baseRetryDelayMs",5e3,u),this.cb=Kn("retryDelaySeedMs",1e4,u),this.Wa=Kn("forwardChannelMaxRetries",2,u),this.wa=Kn("forwardChannelRequestTimeoutMs",2e4,u),this.pa=u&&u.xmlHttpFactory||void 0,this.Xa=u&&u.Tb||void 0,this.Ca=u&&u.useFetchStreams||!1,this.L=void 0,this.J=u&&u.supportsCrossDomainXhr||!1,this.K="",this.h=new ji(u&&u.concurrentRequestLimit),this.Da=new zc,this.P=u&&u.fastHandshake||!1,this.O=u&&u.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=u&&u.Rb||!1,u&&u.xa&&this.j.xa(),u&&u.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&u&&u.detectBufferingProxy||!1,this.ja=void 0,u&&u.longPollingTimeout&&0<u.longPollingTimeout&&(this.ja=u.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=la.prototype,r.la=8,r.G=1,r.connect=function(u,f,y,E){it(0),this.W=u,this.H=f||{},y&&E!==void 0&&(this.H.OSID=y,this.H.OAID=E),this.F=this.X,this.I=Dl(this,null,this.W),Qn(this)};function Rt(u){if(Ms(u),u.G==3){var f=u.U++,y=rn(u.I);if(Be(y,"SID",u.K),Be(y,"RID",f),Be(y,"TYPE","terminate"),yr(u,y),f=new Rn(u,u.j,f),f.L=2,f.v=Br(rn(y)),y=!1,p.navigator&&p.navigator.sendBeacon)try{y=p.navigator.sendBeacon(f.v.toString(),"")}catch{}!y&&p.Image&&(new Image().src=f.v,y=!0),y||(f.g=Vl(f.j,null),f.g.ea(f.v)),f.F=Date.now(),qe(f)}Nl(u)}function Nn(u){u.g&&(ua(u),u.g.cancel(),u.g=null)}function Ms(u){Nn(u),u.u&&(p.clearTimeout(u.u),u.u=null),js(u),u.h.cancel(),u.s&&(typeof u.s=="number"&&p.clearTimeout(u.s),u.s=null)}function Qn(u){if(!nn(u.h)&&!u.s){u.s=!0;var f=u.Ga;ze||ie(),ee||(ze(),ee=!0),me.add(f,u),u.B=0}}function $c(u,f){return vl(u.h)>=u.h.j-(u.s?1:0)?!1:u.s?(u.i=f.D.concat(u.i),!0):u.G==1||u.G==2||u.B>=(u.Va?0:u.Wa)?!1:(u.s=In(A(u.Ga,u,f),xl(u,u.B)),u.B++,!0)}r.Ga=function(u){if(this.s)if(this.s=null,this.G==1){if(!u){this.U=Math.floor(1e5*Math.random()),u=this.U++;const b=new Rn(this,this.j,u);let z=this.o;if(this.S&&(z?(z=I(z),x(z,this.S)):z=this.S),this.m!==null||this.O||(b.H=z,z=null),this.P)e:{for(var f=0,y=0;y<this.i.length;y++){t:{var E=this.i[y];if("__data__"in E.map&&(E=E.map.__data__,typeof E=="string")){E=E.length;break t}E=void 0}if(E===void 0)break;if(f+=E,4096<f){f=y;break e}if(f===4096||y===this.i.length-1){f=y+1;break e}}f=1e3}else f=1e3;f=Wr(this,b,f),y=rn(this.I),Be(y,"RID",u),Be(y,"CVER",22),this.D&&Be(y,"X-HTTP-Session-Id",this.D),yr(this,y),z&&(this.O?f="headers="+encodeURIComponent(String(gr(z)))+"&"+f:this.m&&Hr(y,this.m,z)),ra(this.h,b),this.Ua&&Be(y,"TYPE","init"),this.P?(Be(y,"$req",f),Be(y,"SID","null"),b.T=!0,xs(b,y,null)):xs(b,y,f),this.G=2}}else this.G==3&&(u?Fs(this,u):this.i.length==0||nn(this.h)||Fs(this))};function Fs(u,f){var y;f?y=f.l:y=u.U++;const E=rn(u.I);Be(E,"SID",u.K),Be(E,"RID",y),Be(E,"AID",u.T),yr(u,E),u.m&&u.o&&Hr(E,u.m,u.o),y=new Rn(u,u.j,y,u.B+1),u.m===null&&(y.H=u.o),f&&(u.i=f.D.concat(u.i)),f=Wr(u,y,1e3),y.I=Math.round(.5*u.wa)+Math.round(.5*u.wa*Math.random()),ra(u.h,y),xs(y,E,f)}function yr(u,f){u.H&&ue(u.H,function(y,E){Be(f,E,y)}),u.l&&Ur({},function(y,E){Be(f,E,y)})}function Wr(u,f,y){y=Math.min(u.i.length,y);var E=u.l?A(u.l.Na,u.l,u):null;e:{var b=u.i;let z=-1;for(;;){const Z=["count="+y];z==-1?0<y?(z=b[0].g,Z.push("ofs="+z)):z=0:Z.push("ofs="+z);let je=!0;for(let pt=0;pt<y;pt++){let Ve=b[pt].g;const vt=b[pt].map;if(Ve-=z,0>Ve)z=Math.max(0,b[pt].g-100),je=!1;else try{Cl(vt,Z,"req"+Ve+"_")}catch{E&&E(vt)}}if(je){E=Z.join("&");break e}}}return u=u.i.splice(0,y),f.D=u,E}function Hi(u){if(!u.g&&!u.u){u.Y=1;var f=u.Fa;ze||ie(),ee||(ze(),ee=!0),me.add(f,u),u.v=0}}function Us(u){return u.g||u.u||3<=u.v?!1:(u.Y++,u.u=In(A(u.Fa,u),xl(u,u.v)),u.v++,!0)}r.Fa=function(){if(this.u=null,kl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var u=2*this.R;this.j.info("BP detection timer enabled: "+u),this.A=In(A(this.ab,this),u)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,it(10),Nn(this),kl(this))};function ua(u){u.A!=null&&(p.clearTimeout(u.A),u.A=null)}function kl(u){u.g=new Rn(u,u.j,"rpc",u.Y),u.m===null&&(u.g.H=u.o),u.g.O=0;var f=rn(u.qa);Be(f,"RID","rpc"),Be(f,"SID",u.K),Be(f,"AID",u.T),Be(f,"CI",u.F?"0":"1"),!u.F&&u.ja&&Be(f,"TO",u.ja),Be(f,"TYPE","xmlhttp"),yr(u,f),u.m&&u.o&&Hr(f,u.m,u.o),u.L&&(u.g.I=u.L);var y=u.g;u=u.ia,y.L=1,y.v=Br(rn(f)),y.m=null,y.P=!0,ta(y,u)}r.Za=function(){this.C!=null&&(this.C=null,Nn(this),Us(this),it(19))};function js(u){u.C!=null&&(p.clearTimeout(u.C),u.C=null)}function zs(u,f){var y=null;if(u.g==f){js(u),ua(u),u.g=null;var E=2}else if(Bt(u.h,f))y=f.D,El(u.h,f),E=1;else return;if(u.G!=0){if(f.o)if(E==1){y=f.m?f.m.length:0,f=Date.now()-f.F;var b=u.B;E=bi(),ft(E,new Rs(E,y)),Qn(u)}else Hi(u);else if(b=f.s,b==3||b==0&&0<f.X||!(E==1&&$c(u,f)||E==2&&Us(u)))switch(y&&0<y.length&&(f=u.h,f.i=f.i.concat(y)),b){case 1:_r(u,5);break;case 4:_r(u,10);break;case 3:_r(u,6);break;default:_r(u,2)}}}function xl(u,f){let y=u.Ta+Math.floor(Math.random()*u.cb);return u.isActive()||(y*=2),y*f}function _r(u,f){if(u.j.info("Error code "+f),f==2){var y=A(u.fb,u),E=u.Xa;const b=!E;E=new pr(E||"//www.google.com/images/cleardot.gif"),p.location&&p.location.protocol=="http"||Bi(E,"https"),Br(E),b?jc(E.toString(),y):Rl(E.toString(),y)}else it(2);u.G=0,u.l&&u.l.sa(f),Nl(u),Ms(u)}r.fb=function(u){u?(this.j.info("Successfully pinged google.com"),it(2)):(this.j.info("Failed to ping google.com"),it(1))};function Nl(u){if(u.G=0,u.ka=[],u.l){const f=wl(u.h);(f.length!=0||u.i.length!=0)&&(B(u.ka,f),B(u.ka,u.i),u.h.i.length=0,G(u.i),u.i.length=0),u.l.ra()}}function Dl(u,f,y){var E=y instanceof pr?rn(y):new pr(y);if(E.g!="")f&&(E.g=f+"."+E.g),jr(E,E.s);else{var b=p.location;E=b.protocol,f=f?f+"."+b.hostname:b.hostname,b=+b.port;var z=new pr(null);E&&Bi(z,E),f&&(z.g=f),b&&jr(z,b),y&&(z.l=y),E=z}return y=u.D,f=u.ya,y&&f&&Be(E,y,f),Be(E,"VER",u.la),yr(u,E),E}function Vl(u,f,y){if(f&&!u.J)throw Error("Can't create secondary domain capable XhrIo object.");return f=u.Ca&&!u.pa?new Ye(new mr({eb:y})):new Ye(u.pa),f.Ha(u.J),f}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function ca(){}r=ca.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Bs(){}Bs.prototype.g=function(u,f){return new $t(u,f)};function $t(u,f){dt.call(this),this.g=new la(f),this.l=u,this.h=f&&f.messageUrlParams||null,u=f&&f.messageHeaders||null,f&&f.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=f&&f.initMessageHeaders||null,f&&f.messageContentType&&(u?u["X-WebChannel-Content-Type"]=f.messageContentType:u={"X-WebChannel-Content-Type":f.messageContentType}),f&&f.va&&(u?u["X-WebChannel-Client-Profile"]=f.va:u={"X-WebChannel-Client-Profile":f.va}),this.g.S=u,(u=f&&f.Sb)&&!ce(u)&&(this.g.m=u),this.v=f&&f.supportsCrossDomainXhr||!1,this.u=f&&f.sendRawJson||!1,(f=f&&f.httpSessionIdParam)&&!ce(f)&&(this.g.D=f,u=this.h,u!==null&&f in u&&(u=this.h,f in u&&delete u[f])),this.j=new Yn(this)}$($t,dt),$t.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},$t.prototype.close=function(){Rt(this.g)},$t.prototype.o=function(u){var f=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.u&&(y={},y.__data__=Go(u),u=y);f.i.push(new _l(f.Ya++,u)),f.G==3&&Qn(f)},$t.prototype.N=function(){this.g.l=null,delete this.j,Rt(this.g),delete this.g,$t.aa.N.call(this)};function Ol(u){qn.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var f=u.__sm__;if(f){e:{for(const y in f){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,f=f!==null&&u in f?f[u]:void 0),this.data=f}else this.data=u}$(Ol,qn);function bl(){As.call(this),this.status=1}$(bl,As);function Yn(u){this.g=u}$(Yn,ca),Yn.prototype.ua=function(){ft(this.g,"a")},Yn.prototype.ta=function(u){ft(this.g,new Ol(u))},Yn.prototype.sa=function(u){ft(this.g,new bl)},Yn.prototype.ra=function(){ft(this.g,"b")},Bs.prototype.createWebChannel=Bs.prototype.g,$t.prototype.send=$t.prototype.o,$t.prototype.open=$t.prototype.m,$t.prototype.close=$t.prototype.close,B_=function(){return new Bs},z_=function(){return bi()},j_=Hn,Od={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ps.NO_ERROR=0,Ps.TIMEOUT=8,Ps.HTTP_ERROR=6,Uu=Ps,pl.COMPLETE="complete",U_=pl,Ss.EventType=hn,hn.OPEN="a",hn.CLOSE="b",hn.ERROR="c",hn.MESSAGE="d",dt.prototype.listen=dt.prototype.K,Ma=Ss,Ye.prototype.listenOnce=Ye.prototype.L,Ye.prototype.getLastError=Ye.prototype.Ka,Ye.prototype.getLastErrorCode=Ye.prototype.Ba,Ye.prototype.getStatus=Ye.prototype.Z,Ye.prototype.getResponseJson=Ye.prototype.Oa,Ye.prototype.getResponseText=Ye.prototype.oa,Ye.prototype.send=Ye.prototype.ea,Ye.prototype.setWithCredentials=Ye.prototype.Ha,F_=Ye}).apply(typeof xu<"u"?xu:typeof self<"u"?self:typeof window<"u"?window:{});const $g="@firebase/firestore",qg="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ut.UNAUTHENTICATED=new Ut(null),Ut.GOOGLE_CREDENTIALS=new Ut("google-credentials-uid"),Ut.FIRST_PARTY=new Ut("first-party-uid"),Ut.MOCK_USER=new Ut("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oo="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hs=new Zd("@firebase/firestore");function co(){return hs.logLevel}function re(r,...e){if(hs.logLevel<=ke.DEBUG){const t=e.map(pf);hs.debug(`Firestore (${Oo}): ${r}`,...t)}}function Vr(r,...e){if(hs.logLevel<=ke.ERROR){const t=e.map(pf);hs.error(`Firestore (${Oo}): ${r}`,...t)}}function vi(r,...e){if(hs.logLevel<=ke.WARN){const t=e.map(pf);hs.warn(`Firestore (${Oo}): ${r}`,...t)}}function pf(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(r,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,$_(r,s,t)}function $_(r,e,t){let s=`FIRESTORE (${Oo}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Vr(s),new Error(s)}function Ue(r,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,r||$_(e,o,s)}function Ie(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class te extends br{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ut.UNAUTHENTICATED)))}shutdown(){}}class FS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class US{constructor(e){this.t=e,this.currentUser=Ut.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ue(this.o===void 0,42304);let s=this.i;const o=g=>this.i!==s?(s=this.i,t(g)):Promise.resolve();let l=new yi;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new yi,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},p=g=>{re("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>p(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?p(g):(re("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new yi)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(re("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Ue(typeof s.accessToken=="string",31837,{l:s}),new q_(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ue(e===null||typeof e=="string",2055,{h:e}),new Ut(e)}}class jS{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Ut.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class zS{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new jS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ut.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Hg{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class BS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,wn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Ue(this.o===void 0,3512);const s=l=>{l.error!=null&&re("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,re("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>s(l)))};const o=l=>{re("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):re("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Hg(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Ue(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Hg(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $S(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<r;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H_(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=$S(40);for(let l=0;l<o.length;++l)s.length<20&&o[l]<t&&(s+=e.charAt(o[l]%62))}return s}}function Ae(r,e){return r<e?-1:r>e?1:0}function bd(r,e){let t=0;for(;t<r.length&&t<e.length;){const s=r.codePointAt(t),o=e.codePointAt(t);if(s!==o){if(s<128&&o<128)return Ae(s,o);{const l=H_(),h=qS(l.encode(Wg(r,t)),l.encode(Wg(e,t)));return h!==0?h:Ae(s,o)}}t+=s>65535?2:1}return Ae(r.length,e.length)}function Wg(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function qS(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return Ae(r[t],e[t]);return Ae(r.length,e.length)}function To(r,e,t){return r.length===e.length&&r.every(((s,o)=>t(s,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg="__name__";class tr{constructor(e,t,s){t===void 0?t=0:t>e.length&&ve(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&ve(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return tr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof tr?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const l=tr.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return Ae(e.length,t.length)}static compareSegments(e,t){const s=tr.isNumericId(e),o=tr.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?tr.extractNumericId(e).compare(tr.extractNumericId(t)):bd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return gi.fromString(e.substring(4,e.length-2))}}class We extends tr{construct(e,t,s){return new We(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new te(q.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new We(t)}static emptyPath(){return new We([])}}const HS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class xt extends tr{construct(e,t,s){return new xt(e,t,s)}static isValidIdentifier(e){return HS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),xt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Gg}static keyField(){return new xt([Gg])}static fromServerFormat(e){const t=[];let s="",o=0;const l=()=>{if(s.length===0)throw new te(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;o<e.length;){const p=e[o];if(p==="\\"){if(o+1===e.length)throw new te(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new te(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=g,o+=2}else p==="`"?(h=!h,o++):p!=="."||h?(s+=p,o++):(l(),o++)}if(l(),h)throw new te(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new xt(t)}static emptyPath(){return new xt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.path=e}static fromPath(e){return new de(We.fromString(e))}static fromName(e){return new de(We.fromString(e).popFirst(5))}static empty(){return new de(We.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&We.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return We.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new de(new We(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W_(r,e,t){if(!t)throw new te(q.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function WS(r,e,t,s){if(e===!0&&s===!0)throw new te(q.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Kg(r){if(!de.isDocumentKey(r))throw new te(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Qg(r){if(de.isDocumentKey(r))throw new te(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function G_(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function pc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":ve(12329,{type:typeof r})}function Un(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new te(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=pc(r);throw new te(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(r,e){const t={typeString:r};return e&&(t.value=e),t}function ll(r,e){if(!G_(r))throw new te(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,l="value"in e[s]?{value:e[s].value}:void 0;if(!(s in r)){t=`JSON missing required field: '${s}'`;break}const h=r[s];if(o&&typeof h!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${s}' field to equal '${l.value}'`;break}}if(t)throw new te(q.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yg=-62135596800,Xg=1e6;class Qe{static now(){return Qe.fromMillis(Date.now())}static fromDate(e){return Qe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Xg);return new Qe(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new te(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new te(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Yg)throw new te(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new te(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Xg}_compareTo(e){return this.seconds===e.seconds?Ae(this.nanoseconds,e.nanoseconds):Ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Qe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ll(e,Qe._jsonSchema))return new Qe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Yg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Qe._jsonSchemaVersion="firestore/timestamp/1.0",Qe._jsonSchema={type:ht("string",Qe._jsonSchemaVersion),seconds:ht("number"),nanoseconds:ht("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{static fromTimestamp(e){return new Te(e)}static min(){return new Te(new Qe(0,0))}static max(){return new Te(new Qe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ya=-1;function GS(r,e){const t=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,o=Te.fromTimestamp(s===1e9?new Qe(t+1,0):new Qe(t,s));return new Ei(o,de.empty(),e)}function KS(r){return new Ei(r.readTime,r.key,Ya)}class Ei{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Ei(Te.min(),de.empty(),Ya)}static max(){return new Ei(Te.max(),de.empty(),Ya)}}function QS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=de.comparator(r.documentKey,e.documentKey),t!==0?t:Ae(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class XS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bo(r){if(r.code!==q.FAILED_PRECONDITION||r.message!==YS)throw r;re("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ve(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new H(((s,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(s,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(s,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof H?t:H.resolve(t)}catch(t){return H.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):H.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):H.reject(t)}static resolve(e){return new H(((t,s)=>{t(e)}))}static reject(e){return new H(((t,s)=>{s(e)}))}static waitFor(e){return new H(((t,s)=>{let o=0,l=0,h=!1;e.forEach((p=>{++o,p.next((()=>{++l,h&&l===o&&t()}),(g=>s(g)))})),h=!0,l===o&&t()}))}static or(e){let t=H.resolve(!1);for(const s of e)t=t.next((o=>o?H.resolve(o):s()));return t}static forEach(e,t){const s=[];return e.forEach(((o,l)=>{s.push(t.call(this,o,l))})),this.waitFor(s)}static mapArray(e,t){return new H(((s,o)=>{const l=e.length,h=new Array(l);let p=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((w=>{h[_]=w,++p,p===l&&s(h)}),(w=>o(w)))}}))}static doWhile(e,t){return new H(((s,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):s()};l()}))}}function JS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Lo(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}mc.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gf=-1;function gc(r){return r==null}function Zu(r){return r===0&&1/r==-1/0}function ZS(r){return typeof r=="number"&&Number.isInteger(r)&&!Zu(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K_="";function e1(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Jg(e)),e=t1(r.get(t),e);return Jg(e)}function t1(r,e){let t=e;const s=r.length;for(let o=0;o<s;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case K_:t+="";break;default:t+=l}}return t}function Jg(r){return r+K_+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zg(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Pi(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Q_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t){this.comparator=e,this.root=t||kt.EMPTY}insert(e,t){return new et(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,kt.BLACK,null,null))}remove(e){return new et(this.comparator,this.root.remove(e,this.comparator).copy(null,null,kt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return t+s.left.size;o<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Nu(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Nu(this.root,e,this.comparator,!1)}getReverseIterator(){return new Nu(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Nu(this.root,e,this.comparator,!0)}}class Nu{constructor(e,t,s,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?s(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class kt{constructor(e,t,s,o,l){this.key=e,this.value=t,this.color=s??kt.RED,this.left=o??kt.EMPTY,this.right=l??kt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,o,l){return new kt(e??this.key,t??this.value,s??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let o=this;const l=s(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,s),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return kt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return kt.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,kt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,kt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ve(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ve(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ve(27949);return e+(this.isRed()?0:1)}}kt.EMPTY=null,kt.RED=!0,kt.BLACK=!1;kt.EMPTY=new class{constructor(){this.size=0}get key(){throw ve(57766)}get value(){throw ve(16141)}get color(){throw ve(16727)}get left(){throw ve(29726)}get right(){throw ve(36894)}copy(e,t,s,o,l){return this}insert(e,t,s){return new kt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e){this.comparator=e,this.data=new et(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ey(this.data.getIterator())}getIteratorFrom(e){return new ey(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof yt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new yt(this.comparator);return t.data=e,t}}class ey{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e){this.fields=e,e.sort(xt.comparator)}static empty(){return new cn([])}unionWith(e){let t=new yt(xt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new cn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return To(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_ extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Y_("Invalid base64 string: "+l):l}})(e);return new Nt(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Nt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Nt.EMPTY_BYTE_STRING=new Nt("");const n1=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function wi(r){if(Ue(!!r,39018),typeof r=="string"){let e=0;const t=n1.exec(r);if(Ue(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:ot(r.seconds),nanos:ot(r.nanos)}}function ot(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ti(r){return typeof r=="string"?Nt.fromBase64String(r):Nt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X_="server_timestamp",J_="__type__",Z_="__previous_value__",ev="__local_write_time__";function yf(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[J_])===null||t===void 0?void 0:t.stringValue)===X_}function yc(r){const e=r.mapValue.fields[Z_];return yf(e)?yc(e):e}function Xa(r){const e=wi(r.mapValue.fields[ev].timestampValue);return new Qe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r1{constructor(e,t,s,o,l,h,p,g,_,w){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=p,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=w}}const ec="(default)";class Ja{constructor(e,t){this.projectId=e,this.database=t||ec}static empty(){return new Ja("","")}get isDefaultDatabase(){return this.database===ec}isEqual(e){return e instanceof Ja&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tv="__type__",i1="__max__",Du={mapValue:{}},nv="__vector__",tc="value";function Ii(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?yf(r)?4:o1(r)?9007199254740991:s1(r)?10:11:ve(28295,{value:r})}function lr(r,e){if(r===e)return!0;const t=Ii(r);if(t!==Ii(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Xa(r).isEqual(Xa(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=wi(o.timestampValue),p=wi(l.timestampValue);return h.seconds===p.seconds&&h.nanos===p.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Ti(o.bytesValue).isEqual(Ti(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ot(o.geoPointValue.latitude)===ot(l.geoPointValue.latitude)&&ot(o.geoPointValue.longitude)===ot(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ot(o.integerValue)===ot(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ot(o.doubleValue),p=ot(l.doubleValue);return h===p?Zu(h)===Zu(p):isNaN(h)&&isNaN(p)}return!1})(r,e);case 9:return To(r.arrayValue.values||[],e.arrayValue.values||[],lr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},p=l.mapValue.fields||{};if(Zg(h)!==Zg(p))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(p[g]===void 0||!lr(h[g],p[g])))return!1;return!0})(r,e);default:return ve(52216,{left:r})}}function Za(r,e){return(r.values||[]).find((t=>lr(t,e)))!==void 0}function Io(r,e){if(r===e)return 0;const t=Ii(r),s=Ii(e);if(t!==s)return Ae(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ae(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const p=ot(l.integerValue||l.doubleValue),g=ot(h.integerValue||h.doubleValue);return p<g?-1:p>g?1:p===g?0:isNaN(p)?isNaN(g)?0:-1:1})(r,e);case 3:return ty(r.timestampValue,e.timestampValue);case 4:return ty(Xa(r),Xa(e));case 5:return bd(r.stringValue,e.stringValue);case 6:return(function(l,h){const p=Ti(l),g=Ti(h);return p.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const p=l.split("/"),g=h.split("/");for(let _=0;_<p.length&&_<g.length;_++){const w=Ae(p[_],g[_]);if(w!==0)return w}return Ae(p.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const p=Ae(ot(l.latitude),ot(h.latitude));return p!==0?p:Ae(ot(l.longitude),ot(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ny(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var p,g,_,w;const T=l.fields||{},A=h.fields||{},F=(p=T[tc])===null||p===void 0?void 0:p.arrayValue,$=(g=A[tc])===null||g===void 0?void 0:g.arrayValue,G=Ae(((_=F==null?void 0:F.values)===null||_===void 0?void 0:_.length)||0,((w=$==null?void 0:$.values)===null||w===void 0?void 0:w.length)||0);return G!==0?G:ny(F,$)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===Du.mapValue&&h===Du.mapValue)return 0;if(l===Du.mapValue)return 1;if(h===Du.mapValue)return-1;const p=l.fields||{},g=Object.keys(p),_=h.fields||{},w=Object.keys(_);g.sort(),w.sort();for(let T=0;T<g.length&&T<w.length;++T){const A=bd(g[T],w[T]);if(A!==0)return A;const F=Io(p[g[T]],_[w[T]]);if(F!==0)return F}return Ae(g.length,w.length)})(r.mapValue,e.mapValue);default:throw ve(23264,{le:t})}}function ty(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Ae(r,e);const t=wi(r),s=wi(e),o=Ae(t.seconds,s.seconds);return o!==0?o:Ae(t.nanos,s.nanos)}function ny(r,e){const t=r.values||[],s=e.values||[];for(let o=0;o<t.length&&o<s.length;++o){const l=Io(t[o],s[o]);if(l)return l}return Ae(t.length,s.length)}function So(r){return Ld(r)}function Ld(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const s=wi(t);return`time(${s.seconds},${s.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Ti(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return de.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let s="[",o=!0;for(const l of t.values||[])o?o=!1:s+=",",s+=Ld(l);return s+"]"})(r.arrayValue):"mapValue"in r?(function(t){const s=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of s)l?l=!1:o+=",",o+=`${h}:${Ld(t.fields[h])}`;return o+"}"})(r.mapValue):ve(61005,{value:r})}function ju(r){switch(Ii(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=yc(r);return e?16+ju(e):16;case 5:return 2*r.stringValue.length;case 6:return Ti(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((o,l)=>o+ju(l)),0)})(r.arrayValue);case 10:case 11:return(function(s){let o=0;return Pi(s.fields,((l,h)=>{o+=l.length+ju(h)})),o})(r.mapValue);default:throw ve(13486,{value:r})}}function ry(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Md(r){return!!r&&"integerValue"in r}function _f(r){return!!r&&"arrayValue"in r}function iy(r){return!!r&&"nullValue"in r}function sy(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function zu(r){return!!r&&"mapValue"in r}function s1(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[tv])===null||t===void 0?void 0:t.stringValue)===nv}function $a(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Pi(r.mapValue.fields,((t,s)=>e.mapValue.fields[t]=$a(s))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=$a(r.arrayValue.values[t]);return e}return Object.assign({},r)}function o1(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===i1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e){this.value=e}static empty(){return new tn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!zu(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=$a(t)}setAll(e){let t=xt.emptyPath(),s={},o=[];e.forEach(((h,p)=>{if(!t.isImmediateParentOf(p)){const g=this.getFieldsMap(t);this.applyChanges(g,s,o),s={},o=[],t=p.popLast()}h?s[p.lastSegment()]=$a(h):o.push(p.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,s,o)}delete(e){const t=this.field(e.popLast());zu(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return lr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=t.mapValue.fields[e.get(s)];zu(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,s){Pi(t,((o,l)=>e[o]=l));for(const o of s)delete e[o]}clone(){return new tn($a(this.value))}}function rv(r){const e=[];return Pi(r.fields,((t,s)=>{const o=new xt([t]);if(zu(s)){const l=rv(s.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new cn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e,t,s,o,l,h,p){this.key=e,this.documentType=t,this.version=s,this.readTime=o,this.createTime=l,this.data=h,this.documentState=p}static newInvalidDocument(e){return new jt(e,0,Te.min(),Te.min(),Te.min(),tn.empty(),0)}static newFoundDocument(e,t,s,o){return new jt(e,1,t,Te.min(),s,o,0)}static newNoDocument(e,t){return new jt(e,2,t,Te.min(),Te.min(),tn.empty(),0)}static newUnknownDocument(e,t){return new jt(e,3,t,Te.min(),Te.min(),tn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Te.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=tn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=tn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Te.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof jt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new jt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nc{constructor(e,t){this.position=e,this.inclusive=t}}function oy(r,e,t){let s=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?s=de.comparator(de.fromName(h.referenceValue),t.key):s=Io(h,t.data.field(l.field)),l.dir==="desc"&&(s*=-1),s!==0)break}return s}function ay(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!lr(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(e,t="asc"){this.field=e,this.dir=t}}function a1(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iv{}class ct extends iv{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new u1(e,t,s):t==="array-contains"?new d1(e,s):t==="in"?new f1(e,s):t==="not-in"?new p1(e,s):t==="array-contains-any"?new m1(e,s):new ct(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new c1(e,s):new h1(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Io(t,this.value)):t!==null&&Ii(this.value)===Ii(t)&&this.matchesComparison(Io(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ve(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $n extends iv{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new $n(e,t)}matches(e){return sv(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function sv(r){return r.op==="and"}function ov(r){return l1(r)&&sv(r)}function l1(r){for(const e of r.filters)if(e instanceof $n)return!1;return!0}function Fd(r){if(r instanceof ct)return r.field.canonicalString()+r.op.toString()+So(r.value);if(ov(r))return r.filters.map((e=>Fd(e))).join(",");{const e=r.filters.map((t=>Fd(t))).join(",");return`${r.op}(${e})`}}function av(r,e){return r instanceof ct?(function(s,o){return o instanceof ct&&s.op===o.op&&s.field.isEqual(o.field)&&lr(s.value,o.value)})(r,e):r instanceof $n?(function(s,o){return o instanceof $n&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce(((l,h,p)=>l&&av(h,o.filters[p])),!0):!1})(r,e):void ve(19439)}function lv(r){return r instanceof ct?(function(t){return`${t.field.canonicalString()} ${t.op} ${So(t.value)}`})(r):r instanceof $n?(function(t){return t.op.toString()+" {"+t.getFilters().map(lv).join(" ,")+"}"})(r):"Filter"}class u1 extends ct{constructor(e,t,s){super(e,t,s),this.key=de.fromName(s.referenceValue)}matches(e){const t=de.comparator(e.key,this.key);return this.matchesComparison(t)}}class c1 extends ct{constructor(e,t){super(e,"in",t),this.keys=uv("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class h1 extends ct{constructor(e,t){super(e,"not-in",t),this.keys=uv("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function uv(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>de.fromName(s.referenceValue)))}class d1 extends ct{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return _f(t)&&Za(t.arrayValue,this.value)}}class f1 extends ct{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Za(this.value.arrayValue,t)}}class p1 extends ct{constructor(e,t){super(e,"not-in",t)}matches(e){if(Za(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Za(this.value.arrayValue,t)}}class m1 extends ct{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!_f(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>Za(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g1{constructor(e,t=null,s=[],o=[],l=null,h=null,p=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=o,this.limit=l,this.startAt=h,this.endAt=p,this.Pe=null}}function ly(r,e=null,t=[],s=[],o=null,l=null,h=null){return new g1(r,e,t,s,o,l,h)}function vf(r){const e=Ie(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Fd(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(l){return l.field.canonicalString()+l.dir})(s))).join(","),gc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>So(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>So(s))).join(",")),e.Pe=t}return e.Pe}function Ef(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!a1(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!av(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!ay(r.startAt,e.startAt)&&ay(r.endAt,e.endAt)}function Ud(r){return de.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(e,t=null,s=[],o=[],l=null,h="F",p=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=l,this.limitType=h,this.startAt=p,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function y1(r,e,t,s,o,l,h,p){return new Mo(r,e,t,s,o,l,h,p)}function _c(r){return new Mo(r)}function uy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function cv(r){return r.collectionGroup!==null}function qa(r){const e=Ie(r);if(e.Te===null){e.Te=[];const t=new Set;for(const l of e.explicitOrderBy)e.Te.push(l),t.add(l.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let p=new yt(xt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(p=p.add(_.field))}))})),p})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Te.push(new el(l,s))})),t.has(xt.keyField().canonicalString())||e.Te.push(new el(xt.keyField(),s))}return e.Te}function ir(r){const e=Ie(r);return e.Ie||(e.Ie=_1(e,qa(r))),e.Ie}function _1(r,e){if(r.limitType==="F")return ly(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new el(o.field,l)}));const t=r.endAt?new nc(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new nc(r.startAt.position,r.startAt.inclusive):null;return ly(r.path,r.collectionGroup,e,r.filters,r.limit,t,s)}}function jd(r,e){const t=r.filters.concat([e]);return new Mo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function rc(r,e,t){return new Mo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function vc(r,e){return Ef(ir(r),ir(e))&&r.limitType===e.limitType}function hv(r){return`${vf(ir(r))}|lt:${r.limitType}`}function ho(r){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((o=>lv(o))).join(", ")}]`),gc(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((o=>So(o))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((o=>So(o))).join(",")),`Target(${s})`})(ir(r))}; limitType=${r.limitType})`}function Ec(r,e){return e.isFoundDocument()&&(function(s,o){const l=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(l):de.isDocumentKey(s.path)?s.path.isEqual(l):s.path.isImmediateParentOf(l)})(r,e)&&(function(s,o){for(const l of qa(s))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(s,o){for(const l of s.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(s,o){return!(s.startAt&&!(function(h,p,g){const _=oy(h,p,g);return h.inclusive?_<=0:_<0})(s.startAt,qa(s),o)||s.endAt&&!(function(h,p,g){const _=oy(h,p,g);return h.inclusive?_>=0:_>0})(s.endAt,qa(s),o))})(r,e)}function v1(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function dv(r){return(e,t)=>{let s=!1;for(const o of qa(r)){const l=E1(o,e,t);if(l!==0)return l;s=s||o.field.isKeyField()}return 0}}function E1(r,e,t){const s=r.field.isKeyField()?de.comparator(e.key,t.key):(function(l,h,p){const g=h.data.field(l),_=p.data.field(l);return g!==null&&_!==null?Io(g,_):ve(42886)})(r.field,e,t);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return ve(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[o,l]of s)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[t]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Pi(this.inner,((t,s)=>{for(const[o,l]of s)e(o,l)}))}isEmpty(){return Q_(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w1=new et(de.comparator);function Or(){return w1}const fv=new et(de.comparator);function Fa(...r){let e=fv;for(const t of r)e=e.insert(t.key,t);return e}function pv(r){let e=fv;return r.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function os(){return Ha()}function mv(){return Ha()}function Ha(){return new ms((r=>r.toString()),((r,e)=>r.isEqual(e)))}const T1=new et(de.comparator),I1=new yt(de.comparator);function xe(...r){let e=I1;for(const t of r)e=e.add(t);return e}const S1=new yt(Ae);function A1(){return S1}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Zu(e)?"-0":e}}function gv(r){return{integerValue:""+r}}function R1(r,e){return ZS(e)?gv(e):wf(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(){this._=void 0}}function C1(r,e,t){return r instanceof tl?(function(o,l){const h={fields:{[J_]:{stringValue:X_},[ev]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&yf(l)&&(l=yc(l)),l&&(h.fields[Z_]=l),{mapValue:h}})(t,e):r instanceof Ao?_v(r,e):r instanceof Ro?vv(r,e):(function(o,l){const h=yv(o,l),p=cy(h)+cy(o.Ee);return Md(h)&&Md(o.Ee)?gv(p):wf(o.serializer,p)})(r,e)}function P1(r,e,t){return r instanceof Ao?_v(r,e):r instanceof Ro?vv(r,e):t}function yv(r,e){return r instanceof ic?(function(s){return Md(s)||(function(l){return!!l&&"doubleValue"in l})(s)})(e)?e:{integerValue:0}:null}class tl extends wc{}class Ao extends wc{constructor(e){super(),this.elements=e}}function _v(r,e){const t=Ev(e);for(const s of r.elements)t.some((o=>lr(o,s)))||t.push(s);return{arrayValue:{values:t}}}class Ro extends wc{constructor(e){super(),this.elements=e}}function vv(r,e){let t=Ev(e);for(const s of r.elements)t=t.filter((o=>!lr(o,s)));return{arrayValue:{values:t}}}class ic extends wc{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function cy(r){return ot(r.integerValue||r.doubleValue)}function Ev(r){return _f(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{constructor(e,t){this.field=e,this.transform=t}}function k1(r,e){return r.field.isEqual(e.field)&&(function(s,o){return s instanceof Ao&&o instanceof Ao||s instanceof Ro&&o instanceof Ro?To(s.elements,o.elements,lr):s instanceof ic&&o instanceof ic?lr(s.Ee,o.Ee):s instanceof tl&&o instanceof tl})(r.transform,e.transform)}class x1{constructor(e,t){this.version=e,this.transformResults=t}}class jn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new jn}static exists(e){return new jn(void 0,e)}static updateTime(e){return new jn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Bu(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Tc{}function wv(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Iv(r.key,jn.none()):new ul(r.key,r.data,jn.none());{const t=r.data,s=tn.empty();let o=new yt(xt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?s.delete(l):s.set(l,h),o=o.add(l)}return new ki(r.key,s,new cn(o.toArray()),jn.none())}}function N1(r,e,t){r instanceof ul?(function(o,l,h){const p=o.value.clone(),g=dy(o.fieldTransforms,l,h.transformResults);p.setAll(g),l.convertToFoundDocument(h.version,p).setHasCommittedMutations()})(r,e,t):r instanceof ki?(function(o,l,h){if(!Bu(o.precondition,l))return void l.convertToUnknownDocument(h.version);const p=dy(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(Tv(o)),g.setAll(p),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function Wa(r,e,t,s){return r instanceof ul?(function(l,h,p,g){if(!Bu(l.precondition,h))return p;const _=l.value.clone(),w=fy(l.fieldTransforms,g,h);return _.setAll(w),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,s):r instanceof ki?(function(l,h,p,g){if(!Bu(l.precondition,h))return p;const _=fy(l.fieldTransforms,g,h),w=h.data;return w.setAll(Tv(l)),w.setAll(_),h.convertToFoundDocument(h.version,w).setHasLocalMutations(),p===null?null:p.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((T=>T.field)))})(r,e,t,s):(function(l,h,p){return Bu(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):p})(r,e,t)}function D1(r,e){let t=null;for(const s of r.fieldTransforms){const o=e.data.field(s.field),l=yv(s.transform,o||null);l!=null&&(t===null&&(t=tn.empty()),t.set(s.field,l))}return t||null}function hy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&To(s,o,((l,h)=>k1(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class ul extends Tc{constructor(e,t,s,o=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class ki extends Tc{constructor(e,t,s,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function Tv(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=r.data.field(t);e.set(t,s)}})),e}function dy(r,e,t){const s=new Map;Ue(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,p=e.data.field(l.field);s.set(l.field,P1(h,p,t[o]))}return s}function fy(r,e,t){const s=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);s.set(o.field,C1(l,h,e))}return s}class Iv extends Tc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class V1 extends Tc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O1{constructor(e,t,s,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&N1(l,e,s[o])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Wa(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Wa(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=mv();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let p=this.applyToLocalView(h,l.mutatedFields);p=t.has(o.key)?null:p;const g=wv(h,p);g!==null&&s.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(Te.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),xe())}isEqual(e){return this.batchId===e.batchId&&To(this.mutations,e.mutations,((t,s)=>hy(t,s)))&&To(this.baseMutations,e.baseMutations,((t,s)=>hy(t,s)))}}class If{constructor(e,t,s,o){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=o}static from(e,t,s){Ue(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let o=(function(){return T1})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,s[h].version);return new If(e,t,s,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b1{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L1{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ut,Oe;function M1(r){switch(r){case q.OK:return ve(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return ve(15467,{code:r})}}function Sv(r){if(r===void 0)return Vr("GRPC error has no .code"),q.UNKNOWN;switch(r){case ut.OK:return q.OK;case ut.CANCELLED:return q.CANCELLED;case ut.UNKNOWN:return q.UNKNOWN;case ut.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case ut.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case ut.INTERNAL:return q.INTERNAL;case ut.UNAVAILABLE:return q.UNAVAILABLE;case ut.UNAUTHENTICATED:return q.UNAUTHENTICATED;case ut.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case ut.NOT_FOUND:return q.NOT_FOUND;case ut.ALREADY_EXISTS:return q.ALREADY_EXISTS;case ut.PERMISSION_DENIED:return q.PERMISSION_DENIED;case ut.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case ut.ABORTED:return q.ABORTED;case ut.OUT_OF_RANGE:return q.OUT_OF_RANGE;case ut.UNIMPLEMENTED:return q.UNIMPLEMENTED;case ut.DATA_LOSS:return q.DATA_LOSS;default:return ve(39323,{code:r})}}(Oe=ut||(ut={}))[Oe.OK=0]="OK",Oe[Oe.CANCELLED=1]="CANCELLED",Oe[Oe.UNKNOWN=2]="UNKNOWN",Oe[Oe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Oe[Oe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Oe[Oe.NOT_FOUND=5]="NOT_FOUND",Oe[Oe.ALREADY_EXISTS=6]="ALREADY_EXISTS",Oe[Oe.PERMISSION_DENIED=7]="PERMISSION_DENIED",Oe[Oe.UNAUTHENTICATED=16]="UNAUTHENTICATED",Oe[Oe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Oe[Oe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Oe[Oe.ABORTED=10]="ABORTED",Oe[Oe.OUT_OF_RANGE=11]="OUT_OF_RANGE",Oe[Oe.UNIMPLEMENTED=12]="UNIMPLEMENTED",Oe[Oe.INTERNAL=13]="INTERNAL",Oe[Oe.UNAVAILABLE=14]="UNAVAILABLE",Oe[Oe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F1=new gi([4294967295,4294967295],0);function py(r){const e=H_().encode(r),t=new M_;return t.update(e),new Uint8Array(t.digest())}function my(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new gi([t,s],0),new gi([o,l],0)]}class Sf{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Ua(`Invalid padding: ${t}`);if(s<0)throw new Ua(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Ua(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Ua(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=gi.fromNumber(this.fe)}pe(e,t,s){let o=e.add(t.multiply(gi.fromNumber(s)));return o.compare(F1)===1&&(o=new gi([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=py(e),[s,o]=my(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);if(!this.ye(h))return!1}return!0}static create(e,t,s){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new Sf(l,o,t);return s.forEach((p=>h.insert(p))),h}insert(e){if(this.fe===0)return;const t=py(e),[s,o]=my(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);this.we(h)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Ua extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(e,t,s,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const o=new Map;return o.set(e,cl.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Ic(Te.min(),o,new et(Ae),Or(),xe())}}class cl{constructor(e,t,s,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new cl(s,t,xe(),xe(),xe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(e,t,s,o){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=o}}class Av{constructor(e,t){this.targetId=e,this.De=t}}class Rv{constructor(e,t,s=Nt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=o}}class gy{constructor(){this.ve=0,this.Ce=yy(),this.Fe=Nt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=xe(),t=xe(),s=xe();return this.Ce.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:s=s.add(o);break;default:ve(38017,{changeType:l})}})),new cl(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=yy()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Ue(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class U1{constructor(e){this.We=e,this.Ge=new Map,this.ze=Or(),this.je=Vu(),this.Je=Vu(),this.He=new et(Ae)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:ve(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,s=e.De.count,o=this.st(t);if(o){const l=o.target;if(Ud(l))if(s===0){const h=new de(l.path);this.Xe(t,h,jt.newNoDocument(h,Te.min()))}else Ue(s===1,20013,{expectedCount:s});else{const h=this.ot(t);if(h!==s){const p=this._t(e),g=p?this.ut(p,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,_)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:l=0}=t;let h,p;try{h=Ti(s).toUint8Array()}catch(g){if(g instanceof Y_)return vi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{p=new Sf(h,o,l)}catch(g){return vi(g instanceof Ua?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return p.fe===0?null:p}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let o=0;return s.forEach((l=>{const h=this.We.lt(),p=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(p)||(this.Xe(t,l,null),o++)})),o}Pt(e){const t=new Map;this.Ge.forEach(((l,h)=>{const p=this.st(h);if(p){if(l.current&&Ud(p.target)){const g=new de(p.target.path);this.Tt(g).has(h)||this.It(h,g)||this.Xe(h,g,jt.newNoDocument(g,e))}l.Ne&&(t.set(h,l.Le()),l.ke())}}));let s=xe();this.Je.forEach(((l,h)=>{let p=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(p=!1,!1)})),p&&(s=s.add(l))})),this.ze.forEach(((l,h)=>h.setReadTime(e)));const o=new Ic(e,t,this.He,this.ze,s);return this.ze=Or(),this.je=Vu(),this.Je=Vu(),this.He=new et(Ae),o}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const o=this.tt(e);this.It(e,t)?o.qe(t,1):o.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new gy,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new yt(Ae),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new yt(Ae),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||re("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new gy),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Vu(){return new et(de.comparator)}function yy(){return new et(de.comparator)}const j1={asc:"ASCENDING",desc:"DESCENDING"},z1={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},B1={and:"AND",or:"OR"};class $1{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function zd(r,e){return r.useProto3Json||gc(e)?e:{value:e}}function sc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Cv(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function q1(r,e){return sc(r,e.toTimestamp())}function sr(r){return Ue(!!r,49232),Te.fromTimestamp((function(t){const s=wi(t);return new Qe(s.seconds,s.nanos)})(r))}function Af(r,e){return Bd(r,e).canonicalString()}function Bd(r,e){const t=(function(o){return new We(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Pv(r){const e=We.fromString(r);return Ue(Vv(e),10190,{key:e.toString()}),e}function $d(r,e){return Af(r.databaseId,e.path)}function wd(r,e){const t=Pv(e);if(t.get(1)!==r.databaseId.projectId)throw new te(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new te(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new de(xv(t))}function kv(r,e){return Af(r.databaseId,e)}function H1(r){const e=Pv(r);return e.length===4?We.emptyPath():xv(e)}function qd(r){return new We(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function xv(r){return Ue(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function _y(r,e,t){return{name:$d(r,e),fields:t.value.mapValue.fields}}function W1(r,e){let t;if("targetChange"in e){e.targetChange;const s=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:ve(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,w){return _.useProto3Json?(Ue(w===void 0||typeof w=="string",58123),Nt.fromBase64String(w||"")):(Ue(w===void 0||w instanceof Buffer||w instanceof Uint8Array,16193),Nt.fromUint8Array(w||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,p=h&&(function(_){const w=_.code===void 0?q.UNKNOWN:Sv(_.code);return new te(w,_.message||"")})(h);t=new Rv(s,o,l,p||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=wd(r,s.document.name),l=sr(s.document.updateTime),h=s.document.createTime?sr(s.document.createTime):Te.min(),p=new tn({mapValue:{fields:s.document.fields}}),g=jt.newFoundDocument(o,l,h,p),_=s.targetIds||[],w=s.removedTargetIds||[];t=new $u(_,w,g.key,g)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=wd(r,s.document),l=s.readTime?sr(s.readTime):Te.min(),h=jt.newNoDocument(o,l),p=s.removedTargetIds||[];t=new $u([],p,h.key,h)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=wd(r,s.document),l=s.removedTargetIds||[];t=new $u([],l,o,null)}else{if(!("filter"in e))return ve(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:l}=s,h=new L1(o,l),p=s.targetId;t=new Av(p,h)}}return t}function G1(r,e){let t;if(e instanceof ul)t={update:_y(r,e.key,e.value)};else if(e instanceof Iv)t={delete:$d(r,e.key)};else if(e instanceof ki)t={update:_y(r,e.key,e.data),updateMask:nA(e.fieldMask)};else{if(!(e instanceof V1))return ve(16599,{Rt:e.type});t={verify:$d(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(l,h){const p=h.transform;if(p instanceof tl)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(p instanceof Ao)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:p.elements}};if(p instanceof Ro)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:p.elements}};if(p instanceof ic)return{fieldPath:h.field.canonicalString(),increment:p.Ee};throw ve(20930,{transform:h.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:q1(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:ve(27497)})(r,e.precondition)),t}function K1(r,e){return r&&r.length>0?(Ue(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?sr(o.updateTime):sr(l);return h.isEqual(Te.min())&&(h=sr(l)),new x1(h,o.transformResults||[])})(t,e)))):[]}function Q1(r,e){return{documents:[kv(r,e.path)]}}function Y1(r,e){const t={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=kv(r,o);const l=(function(_){if(_.length!==0)return Dv($n.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((w=>(function(A){return{field:fo(A.field),direction:Z1(A.dir)}})(w)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const p=zd(r,e.limit);return p!==null&&(t.structuredQuery.limit=p),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{Vt:t,parent:o}}function X1(r){let e=H1(r.parent);const t=r.structuredQuery,s=t.from?t.from.length:0;let o=null;if(s>0){Ue(s===1,65062);const w=t.from[0];w.allDescendants?o=w.collectionId:e=e.child(w.collectionId)}let l=[];t.where&&(l=(function(T){const A=Nv(T);return A instanceof $n&&ov(A)?A.getFilters():[A]})(t.where));let h=[];t.orderBy&&(h=(function(T){return T.map((A=>(function($){return new el(po($.field),(function(B){switch(B){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})($.direction))})(A)))})(t.orderBy));let p=null;t.limit&&(p=(function(T){let A;return A=typeof T=="object"?T.value:T,gc(A)?null:A})(t.limit));let g=null;t.startAt&&(g=(function(T){const A=!!T.before,F=T.values||[];return new nc(F,A)})(t.startAt));let _=null;return t.endAt&&(_=(function(T){const A=!T.before,F=T.values||[];return new nc(F,A)})(t.endAt)),y1(e,o,h,l,p,"F",g,_)}function J1(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ve(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Nv(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=po(t.unaryFilter.field);return ct.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=po(t.unaryFilter.field);return ct.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=po(t.unaryFilter.field);return ct.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=po(t.unaryFilter.field);return ct.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ve(61313);default:return ve(60726)}})(r):r.fieldFilter!==void 0?(function(t){return ct.create(po(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ve(58110);default:return ve(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return $n.create(t.compositeFilter.filters.map((s=>Nv(s))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return ve(1026)}})(t.compositeFilter.op))})(r):ve(30097,{filter:r})}function Z1(r){return j1[r]}function eA(r){return z1[r]}function tA(r){return B1[r]}function fo(r){return{fieldPath:r.canonicalString()}}function po(r){return xt.fromServerFormat(r.fieldPath)}function Dv(r){return r instanceof ct?(function(t){if(t.op==="=="){if(sy(t.value))return{unaryFilter:{field:fo(t.field),op:"IS_NAN"}};if(iy(t.value))return{unaryFilter:{field:fo(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(sy(t.value))return{unaryFilter:{field:fo(t.field),op:"IS_NOT_NAN"}};if(iy(t.value))return{unaryFilter:{field:fo(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:fo(t.field),op:eA(t.op),value:t.value}}})(r):r instanceof $n?(function(t){const s=t.getFilters().map((o=>Dv(o)));return s.length===1?s[0]:{compositeFilter:{op:tA(t.op),filters:s}}})(r):ve(54877,{filter:r})}function nA(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Vv(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di{constructor(e,t,s,o,l=Te.min(),h=Te.min(),p=Nt.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=p,this.expectedCount=g}withSequenceNumber(e){return new di(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new di(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new di(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new di(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e){this.gt=e}}function iA(r){const e=X1({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?rc(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sA{constructor(){this.Dn=new oA}addToCollectionParentIndex(e,t){return this.Dn.add(t),H.resolve()}getCollectionParents(e,t){return H.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return H.resolve()}deleteFieldIndex(e,t){return H.resolve()}deleteAllFieldIndexes(e){return H.resolve()}createTargetIndexes(e,t){return H.resolve()}getDocumentsMatchingTarget(e,t){return H.resolve(null)}getIndexType(e,t){return H.resolve(0)}getFieldIndexes(e,t){return H.resolve([])}getNextCollectionGroupToUpdate(e){return H.resolve(null)}getMinOffset(e,t){return H.resolve(Ei.min())}getMinOffsetFromCollectionGroup(e,t){return H.resolve(Ei.min())}updateCollectionGroup(e,t,s){return H.resolve()}updateIndexEntries(e,t){return H.resolve()}}class oA{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t]||new yt(We.comparator),l=!o.has(s);return this.index[t]=o.add(s),l}has(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t];return o&&o.has(s)}getEntries(e){return(this.index[e]||new yt(We.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Ov=41943040;class en{static withCacheSize(e){return new en(e,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */en.DEFAULT_COLLECTION_PERCENTILE=10,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,en.DEFAULT=new en(Ov,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),en.DISABLED=new en(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Co(0)}static ur(){return new Co(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey="LruGarbageCollector",aA=1048576;function wy([r,e],[t,s]){const o=Ae(r,t);return o===0?Ae(e,s):o}class lA{constructor(e){this.Tr=e,this.buffer=new yt(wy),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();wy(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class uA{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){re(Ey,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Lo(t)?re(Ey,"Ignoring IndexedDB error during garbage collection: ",t):await bo(t)}await this.Rr(3e5)}))}}class cA{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return H.resolve(mc.ue);const s=new lA(t);return this.Vr.forEachTarget(e,(o=>s.Er(o.sequenceNumber))).next((()=>this.Vr.gr(e,(o=>s.Er(o))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(re("LruGarbageCollector","Garbage collection skipped; disabled"),H.resolve(vy)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(re("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),vy):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,o,l,h,p,g,_;const w=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((T=>(T>this.params.maximumSequenceNumbersToCollect?(re("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${T}`),o=this.params.maximumSequenceNumbersToCollect):o=T,h=Date.now(),this.nthSequenceNumber(e,o)))).next((T=>(s=T,p=Date.now(),this.removeTargets(e,s,t)))).next((T=>(l=T,g=Date.now(),this.removeOrphanedDocuments(e,s)))).next((T=>(_=Date.now(),co()<=ke.DEBUG&&re("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-w}ms
	Determined least recently used ${o} in `+(p-h)+`ms
	Removed ${l} targets in `+(g-p)+`ms
	Removed ${T} documents in `+(_-g)+`ms
Total Duration: ${_-w}ms`),H.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:T}))))}}function hA(r,e){return new cA(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dA{constructor(){this.changes=new ms((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,jt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?H.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(e,t,s,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(s=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(s!==null&&Wa(s.mutation,o,cn.empty(),Qe.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,xe()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=xe()){const o=os();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,s).next((l=>{let h=Fa();return l.forEach(((p,g)=>{h=h.insert(p,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const s=os();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,xe())))}populateOverlays(e,t,s){const o=[];return s.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,p)=>{t.set(h,p)}))}))}computeViews(e,t,s,o){let l=Or();const h=Ha(),p=(function(){return Ha()})();return t.forEach(((g,_)=>{const w=s.get(_.key);o.has(_.key)&&(w===void 0||w.mutation instanceof ki)?l=l.insert(_.key,_):w!==void 0?(h.set(_.key,w.mutation.getFieldMask()),Wa(w.mutation,_,w.mutation.getFieldMask(),Qe.now())):h.set(_.key,cn.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,w)=>h.set(_,w))),t.forEach(((_,w)=>{var T;return p.set(_,new fA(w,(T=h.get(_))!==null&&T!==void 0?T:null))})),p)))}recalculateAndSaveOverlays(e,t){const s=Ha();let o=new et(((h,p)=>h-p)),l=xe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const p of h)p.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let w=s.get(g)||cn.empty();w=p.applyToLocalView(_,w),s.set(g,w);const T=(o.get(p.batchId)||xe()).add(g);o=o.insert(p.batchId,T)}))})).next((()=>{const h=[],p=o.getReverseIterator();for(;p.hasNext();){const g=p.getNext(),_=g.key,w=g.value,T=mv();w.forEach((A=>{if(!l.has(A)){const F=wv(t.get(A),s.get(A));F!==null&&T.set(A,F),l=l.add(A)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,T))}return H.waitFor(h)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,o){return(function(h){return de.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):cv(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,o):this.getDocumentsMatchingCollectionQuery(e,t,s,o)}getNextDocuments(e,t,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,o-l.size):H.resolve(os());let p=Ya,g=l;return h.next((_=>H.forEach(_,((w,T)=>(p<T.largestBatchId&&(p=T.largestBatchId),l.get(w)?H.resolve():this.remoteDocumentCache.getEntry(e,w).next((A=>{g=g.insert(w,A)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,xe()))).next((w=>({batchId:p,changes:pv(w)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new de(t)).next((s=>{let o=Fa();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,o){const l=t.collectionGroup;let h=Fa();return this.indexManager.getCollectionParents(e,l).next((p=>H.forEach(p,(g=>{const _=(function(T,A){return new Mo(A,null,T.explicitOrderBy.slice(),T.filters.slice(),T.limit,T.limitType,T.startAt,T.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,s,o).next((w=>{w.forEach(((T,A)=>{h=h.insert(T,A)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,s,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,l,o)))).next((h=>{l.forEach(((g,_)=>{const w=_.getKey();h.get(w)===null&&(h=h.insert(w,jt.newInvalidDocument(w)))}));let p=Fa();return h.forEach(((g,_)=>{const w=l.get(g);w!==void 0&&Wa(w.mutation,_,cn.empty(),Qe.now()),Ec(t,_)&&(p=p.insert(g,_))})),p}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mA{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return H.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:sr(o.createTime)}})(t)),H.resolve()}getNamedQuery(e,t){return H.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(o){return{name:o.name,query:iA(o.bundledQuery),readTime:sr(o.readTime)}})(t)),H.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gA{constructor(){this.overlays=new et(de.comparator),this.kr=new Map}getOverlay(e,t){return H.resolve(this.overlays.get(t))}getOverlays(e,t){const s=os();return H.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&s.set(o,l)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((o,l)=>{this.wt(e,t,l)})),H.resolve()}removeOverlaysForBatchId(e,t,s){const o=this.kr.get(s);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.kr.delete(s)),H.resolve()}getOverlaysForCollection(e,t,s){const o=os(),l=t.length+1,h=new de(t.child("")),p=this.overlays.getIteratorFrom(h);for(;p.hasNext();){const g=p.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>s&&o.set(g.getKey(),g)}return H.resolve(o)}getOverlaysForCollectionGroup(e,t,s,o){let l=new et(((_,w)=>_-w));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>s){let w=l.get(_.largestBatchId);w===null&&(w=os(),l=l.insert(_.largestBatchId,w)),w.set(_.getKey(),_)}}const p=os(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,w)=>p.set(_,w))),!(p.size()>=o)););return H.resolve(p)}wt(e,t,s){const o=this.overlays.get(s.key);if(o!==null){const h=this.kr.get(o.largestBatchId).delete(s.key);this.kr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(s.key,new b1(t,s));let l=this.kr.get(t);l===void 0&&(l=xe(),this.kr.set(t,l)),this.kr.set(t,l.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(){this.sessionToken=Nt.EMPTY_BYTE_STRING}getSessionToken(e){return H.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,H.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rf{constructor(){this.qr=new yt(It.Qr),this.$r=new yt(It.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new It(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new It(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new de(new We([])),s=new It(t,e),o=new It(t,e+1),l=[];return this.$r.forEachInRange([s,o],(h=>{this.Wr(h),l.push(h.key)})),l}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new de(new We([])),s=new It(t,e),o=new It(t,e+1);let l=xe();return this.$r.forEachInRange([s,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new It(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class It{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return de.comparator(e.key,t.key)||Ae(e.Hr,t.Hr)}static Ur(e,t){return Ae(e.Hr,t.Hr)||de.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _A{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new yt(It.Qr)}checkEmpty(e){return H.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,o){const l=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new O1(l,t,s,o);this.mutationQueue.push(h);for(const p of o)this.Yr=this.Yr.add(new It(p.key,l)),this.indexManager.addToCollectionParentIndex(e,p.key.path.popLast());return H.resolve(h)}lookupMutationBatch(e,t){return H.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,o=this.Xr(s),l=o<0?0:o;return H.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return H.resolve(this.mutationQueue.length===0?gf:this.er-1)}getAllMutationBatches(e){return H.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new It(t,0),o=new It(t,Number.POSITIVE_INFINITY),l=[];return this.Yr.forEachInRange([s,o],(h=>{const p=this.Zr(h.Hr);l.push(p)})),H.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new yt(Ae);return t.forEach((o=>{const l=new It(o,0),h=new It(o,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([l,h],(p=>{s=s.add(p.Hr)}))})),H.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,o=s.length+1;let l=s;de.isDocumentKey(l)||(l=l.child(""));const h=new It(new de(l),0);let p=new yt(Ae);return this.Yr.forEachWhile((g=>{const _=g.key.path;return!!s.isPrefixOf(_)&&(_.length===o&&(p=p.add(g.Hr)),!0)}),h),H.resolve(this.ei(p))}ei(e){const t=[];return e.forEach((s=>{const o=this.Zr(s);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){Ue(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return H.forEach(t.mutations,(o=>{const l=new It(o.key,t.batchId);return s=s.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new It(t,0),o=this.Yr.firstAfterOrEqual(s);return H.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,H.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vA{constructor(e){this.ni=e,this.docs=(function(){return new et(de.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,o=this.docs.get(s),l=o?o.size:0,h=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return H.resolve(s?s.document.mutableCopy():jt.newInvalidDocument(t))}getEntries(e,t){let s=Or();return t.forEach((o=>{const l=this.docs.get(o);s=s.insert(o,l?l.document.mutableCopy():jt.newInvalidDocument(o))})),H.resolve(s)}getDocumentsMatchingQuery(e,t,s,o){let l=Or();const h=t.path,p=new de(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(p);for(;g.hasNext();){const{key:_,value:{document:w}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||QS(KS(w),s)<=0||(o.has(w.key)||Ec(t,w))&&(l=l.insert(w.key,w.mutableCopy()))}return H.resolve(l)}getAllFromCollectionGroup(e,t,s,o){ve(9500)}ri(e,t){return H.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new EA(this)}getSize(e){return H.resolve(this.size)}}class EA extends dA{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,o)=>{o.isValidDocument()?t.push(this.Or.addEntry(e,o)):this.Or.removeEntry(s)})),H.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e){this.persistence=e,this.ii=new ms((t=>vf(t)),Ef),this.lastRemoteSnapshotVersion=Te.min(),this.highestTargetId=0,this.si=0,this.oi=new Rf,this.targetCount=0,this._i=Co.ar()}forEachTarget(e,t){return this.ii.forEach(((s,o)=>t(o))),H.resolve()}getLastRemoteSnapshotVersion(e){return H.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return H.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),H.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),H.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Co(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,H.resolve()}updateTargetData(e,t){return this.hr(t),H.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,H.resolve()}removeTargets(e,t,s){let o=0;const l=[];return this.ii.forEach(((h,p)=>{p.sequenceNumber<=t&&s.get(p.targetId)===null&&(this.ii.delete(h),l.push(this.removeMatchingKeysForTargetId(e,p.targetId)),o++)})),H.waitFor(l).next((()=>o))}getTargetCount(e){return H.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return H.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),H.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),H.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),H.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return H.resolve(s)}containsKey(e,t){return H.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bv{constructor(e,t){this.ai={},this.overlays={},this.ui=new mc(0),this.ci=!1,this.ci=!0,this.li=new yA,this.referenceDelegate=e(this),this.hi=new wA(this),this.indexManager=new sA,this.remoteDocumentCache=(function(o){return new vA(o)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new rA(t),this.Ti=new mA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new gA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new _A(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){re("MemoryPersistence","Starting transaction:",e);const o=new TA(this.ui.next());return this.referenceDelegate.Ii(),s(o).next((l=>this.referenceDelegate.di(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ei(e,t){return H.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class TA extends XS{constructor(e){super(),this.currentSequenceNumber=e}}class Cf{constructor(e){this.persistence=e,this.Ai=new Rf,this.Ri=null}static Vi(e){return new Cf(e)}get mi(){if(this.Ri)return this.Ri;throw ve(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),H.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),H.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),H.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((o=>this.mi.add(o.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.mi.add(l.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return H.forEach(this.mi,(s=>{const o=de.fromPath(s);return this.fi(e,o).next((l=>{l||t.removeEntry(o,Te.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return H.or([()=>H.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class oc{constructor(e,t){this.persistence=e,this.gi=new ms((s=>e1(s.path)),((s,o)=>s.isEqual(o))),this.garbageCollector=hA(this,t)}static Vi(e,t){return new oc(e,t)}Ii(){}di(e){return H.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((o=>s+o))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return H.forEach(this.gi,((s,o)=>this.Sr(e,s,o).next((l=>l?H.resolve():t(o)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ri(e,(h=>this.Sr(e,h,t).next((p=>{p||(s++,l.removeEntry(h,Te.min()))})))).next((()=>l.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),H.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),H.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),H.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),H.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ju(e.data.value)),t}Sr(e,t,s){return H.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.gi.get(t);return H.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(e,t,s,o){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=o}static Es(e,t){let s=xe(),o=xe();for(const l of t.docChanges)switch(l.type){case 0:s=s.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new Pf(e,t.fromCache,s,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return iw()?8:JS(zt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,o){const l={result:null};return this.ps(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.ys(e,t,o,s).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new IA;return this.ws(e,t,h).next((p=>{if(l.result=p,this.Rs)return this.Ss(e,t,h,p.size)}))})).next((()=>l.result))}Ss(e,t,s,o){return s.documentReadCount<this.Vs?(co()<=ke.DEBUG&&re("QueryEngine","SDK will not create cache indexes for query:",ho(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),H.resolve()):(co()<=ke.DEBUG&&re("QueryEngine","Query:",ho(t),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.fs*o?(co()<=ke.DEBUG&&re("QueryEngine","The SDK decides to create cache indexes for query:",ho(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ir(t))):H.resolve())}ps(e,t){if(uy(t))return H.resolve(null);let s=ir(t);return this.indexManager.getIndexType(e,s).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=rc(t,null,"F"),s=ir(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((l=>{const h=xe(...l);return this.gs.getDocuments(e,h).next((p=>this.indexManager.getMinOffset(e,s).next((g=>{const _=this.bs(t,p);return this.Ds(t,_,h,g.readTime)?this.ps(e,rc(t,null,"F")):this.vs(e,_,t,g)}))))})))))}ys(e,t,s,o){return uy(t)||o.isEqual(Te.min())?H.resolve(null):this.gs.getDocuments(e,s).next((l=>{const h=this.bs(t,l);return this.Ds(t,h,s,o)?H.resolve(null):(co()<=ke.DEBUG&&re("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),ho(t)),this.vs(e,h,t,GS(o,Ya)).next((p=>p)))}))}bs(e,t){let s=new yt(dv(e));return t.forEach(((o,l)=>{Ec(e,l)&&(s=s.add(l))})),s}Ds(e,t,s,o){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ws(e,t,s){return co()<=ke.DEBUG&&re("QueryEngine","Using full collection scan to execute query:",ho(t)),this.gs.getDocumentsMatchingQuery(e,t,Ei.min(),s)}vs(e,t,s,o){return this.gs.getDocumentsMatchingQuery(e,s,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf="LocalStore",AA=3e8;class RA{constructor(e,t,s,o){this.persistence=e,this.Cs=t,this.serializer=o,this.Fs=new et(Ae),this.Ms=new ms((l=>vf(l)),Ef),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new pA(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function CA(r,e,t,s){return new RA(r,e,t,s)}async function Lv(r,e){const t=Ie(r);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let o;return t.mutationQueue.getAllMutationBatches(s).next((l=>(o=l,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((l=>{const h=[],p=[];let g=xe();for(const _ of o){h.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}for(const _ of l){p.push(_.batchId);for(const w of _.mutations)g=g.add(w.key)}return t.localDocuments.getDocuments(s,g).next((_=>({Bs:_,removedBatchIds:h,addedBatchIds:p})))}))}))}function PA(r,e){const t=Ie(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const o=e.batch.keys(),l=t.Os.newChangeBuffer({trackRemovals:!0});return(function(p,g,_,w){const T=_.batch,A=T.keys();let F=H.resolve();return A.forEach(($=>{F=F.next((()=>w.getEntry(g,$))).next((G=>{const B=_.docVersions.get($);Ue(B!==null,48541),G.version.compareTo(B)<0&&(T.applyToRemoteDocument(G,_),G.isValidDocument()&&(G.setReadTime(_.commitVersion),w.addEntry(G)))}))})),F.next((()=>p.mutationQueue.removeMutationBatch(g,T)))})(t,s,e,l).next((()=>l.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(p){let g=xe();for(let _=0;_<p.mutationResults.length;++_)p.mutationResults[_].transformResults.length>0&&(g=g.add(p.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(s,o)))}))}function Mv(r){const e=Ie(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function kA(r,e){const t=Ie(r),s=e.snapshotVersion;let o=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Os.newChangeBuffer({trackRemovals:!0});o=t.Fs;const p=[];e.targetChanges.forEach(((w,T)=>{const A=o.get(T);if(!A)return;p.push(t.hi.removeMatchingKeys(l,w.removedDocuments,T).next((()=>t.hi.addMatchingKeys(l,w.addedDocuments,T))));let F=A.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(T)!==null?F=F.withResumeToken(Nt.EMPTY_BYTE_STRING,Te.min()).withLastLimboFreeSnapshotVersion(Te.min()):w.resumeToken.approximateByteSize()>0&&(F=F.withResumeToken(w.resumeToken,s)),o=o.insert(T,F),(function(G,B,fe){return G.resumeToken.approximateByteSize()===0||B.snapshotVersion.toMicroseconds()-G.snapshotVersion.toMicroseconds()>=AA?!0:fe.addedDocuments.size+fe.modifiedDocuments.size+fe.removedDocuments.size>0})(A,F,w)&&p.push(t.hi.updateTargetData(l,F))}));let g=Or(),_=xe();if(e.documentUpdates.forEach((w=>{e.resolvedLimboDocuments.has(w)&&p.push(t.persistence.referenceDelegate.updateLimboDocument(l,w))})),p.push(xA(l,h,e.documentUpdates).next((w=>{g=w.Ls,_=w.ks}))),!s.isEqual(Te.min())){const w=t.hi.getLastRemoteSnapshotVersion(l).next((T=>t.hi.setTargetsMetadata(l,l.currentSequenceNumber,s)));p.push(w)}return H.waitFor(p).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Fs=o,l)))}function xA(r,e,t){let s=xe(),o=xe();return t.forEach((l=>s=s.add(l))),e.getEntries(r,s).next((l=>{let h=Or();return t.forEach(((p,g)=>{const _=l.get(p);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(p)),g.isNoDocument()&&g.version.isEqual(Te.min())?(e.removeEntry(p,g.readTime),h=h.insert(p,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(p,g)):re(kf,"Ignoring outdated watch update for ",p,". Current version:",_.version," Watch version:",g.version)})),{Ls:h,ks:o}}))}function NA(r,e){const t=Ie(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=gf),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function DA(r,e){const t=Ie(r);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let o;return t.hi.getTargetData(s,e).next((l=>l?(o=l,H.resolve(o)):t.hi.allocateTargetId(s).next((h=>(o=new di(e,h,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,o).next((()=>o)))))))})).then((s=>{const o=t.Fs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function Hd(r,e,t){const s=Ie(r),o=s.Fs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",l,(h=>s.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Lo(h))throw h;re(kf,`Failed to update sequence numbers for target ${e}: ${h}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(o.target)}function Ty(r,e,t){const s=Ie(r);let o=Te.min(),l=xe();return s.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,w){const T=Ie(g),A=T.Ms.get(w);return A!==void 0?H.resolve(T.Fs.get(A)):T.hi.getTargetData(_,w)})(s,h,ir(e)).next((p=>{if(p)return o=p.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(h,p.targetId).next((g=>{l=g}))})).next((()=>s.Cs.getDocumentsMatchingQuery(h,e,t?o:Te.min(),t?l:xe()))).next((p=>(VA(s,v1(e),p),{documents:p,qs:l})))))}function VA(r,e,t){let s=r.xs.get(e)||Te.min();t.forEach(((o,l)=>{l.readTime.compareTo(s)>0&&(s=l.readTime)})),r.xs.set(e,s)}class Iy{constructor(){this.activeTargetIds=A1()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class OA{constructor(){this.Fo=new Iy,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Iy,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bA{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sy="ConnectivityMonitor";class Ay{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){re(Sy,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){re(Sy,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ou=null;function Wd(){return Ou===null?Ou=(function(){return 268435456+Math.round(2147483648*Math.random())})():Ou++,"0x"+Ou.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td="RestConnection",LA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class MA{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${o}`,this.Ko=this.databaseId.database===ec?`project_id=${s}`:`project_id=${s}&database_id=${o}`}Wo(e,t,s,o,l){const h=Wd(),p=this.Go(e,t.toUriEncodedString());re(Td,`Sending RPC '${e}' ${h}:`,p,s);const g={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(g,o,l);const{host:_}=new URL(p),w=No(_);return this.jo(e,p,g,s,w).then((T=>(re(Td,`Received RPC '${e}' ${h}: `,T),T)),(T=>{throw vi(Td,`RPC '${e}' ${h} failed with error: `,T,"url: ",p,"request:",s),T}))}Jo(e,t,s,o,l,h){return this.Wo(e,t,s,o,l)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Oo})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),s&&s.headers.forEach(((o,l)=>e[l]=o))}Go(e,t){const s=LA[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="WebChannelConnection";class UA extends MA{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,o,l){const h=Wd();return new Promise(((p,g)=>{const _=new F_;_.setWithCredentials(!0),_.listenOnce(U_.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case Uu.NO_ERROR:const T=_.getResponseJson();re(Ft,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(T)),p(T);break;case Uu.TIMEOUT:re(Ft,`RPC '${e}' ${h} timed out`),g(new te(q.DEADLINE_EXCEEDED,"Request time out"));break;case Uu.HTTP_ERROR:const A=_.getStatus();if(re(Ft,`RPC '${e}' ${h} failed with status:`,A,"response text:",_.getResponseText()),A>0){let F=_.getResponseJson();Array.isArray(F)&&(F=F[0]);const $=F==null?void 0:F.error;if($&&$.status&&$.message){const G=(function(fe){const ce=fe.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(ce)>=0?ce:q.UNKNOWN})($.status);g(new te(G,$.message))}else g(new te(q.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new te(q.UNAVAILABLE,"Connection failed."));break;default:ve(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{re(Ft,`RPC '${e}' ${h} completed.`)}}));const w=JSON.stringify(o);re(Ft,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",w,s,15)}))}P_(e,t,s){const o=Wd(),l=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=B_(),p=z_(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;_!==void 0&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.useFetchStreams=!0),this.zo(g.initMessageHeaders,t,s),g.encodeInitMessageHeaders=!0;const w=l.join("");re(Ft,`Creating RPC '${e}' stream ${o}: ${w}`,g);const T=h.createWebChannel(w,g);this.T_(T);let A=!1,F=!1;const $=new FA({Ho:B=>{F?re(Ft,`Not sending because RPC '${e}' stream ${o} is closed:`,B):(A||(re(Ft,`Opening RPC '${e}' stream ${o} transport.`),T.open(),A=!0),re(Ft,`RPC '${e}' stream ${o} sending:`,B),T.send(B))},Yo:()=>T.close()}),G=(B,fe,ce)=>{B.listen(fe,(pe=>{try{ce(pe)}catch(J){setTimeout((()=>{throw J}),0)}}))};return G(T,Ma.EventType.OPEN,(()=>{F||(re(Ft,`RPC '${e}' stream ${o} transport opened.`),$.s_())})),G(T,Ma.EventType.CLOSE,(()=>{F||(F=!0,re(Ft,`RPC '${e}' stream ${o} transport closed`),$.__(),this.I_(T))})),G(T,Ma.EventType.ERROR,(B=>{F||(F=!0,vi(Ft,`RPC '${e}' stream ${o} transport errored. Name:`,B.name,"Message:",B.message),$.__(new te(q.UNAVAILABLE,"The operation could not be completed")))})),G(T,Ma.EventType.MESSAGE,(B=>{var fe;if(!F){const ce=B.data[0];Ue(!!ce,16349);const pe=ce,J=(pe==null?void 0:pe.error)||((fe=pe[0])===null||fe===void 0?void 0:fe.error);if(J){re(Ft,`RPC '${e}' stream ${o} received error:`,J);const Ee=J.status;let ue=(function(C){const x=ut[C];if(x!==void 0)return Sv(x)})(Ee),k=J.message;ue===void 0&&(ue=q.INTERNAL,k="Unknown error status: "+Ee+" with message "+J.message),F=!0,$.__(new te(ue,k)),T.close()}else re(Ft,`RPC '${e}' stream ${o} received:`,ce),$.a_(ce)}})),G(p,j_.STAT_EVENT,(B=>{B.stat===Od.PROXY?re(Ft,`RPC '${e}' stream ${o} detected buffering proxy`):B.stat===Od.NOPROXY&&re(Ft,`RPC '${e}' stream ${o} detected no buffering proxy`)})),setTimeout((()=>{$.o_()}),0),$}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Id(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sc(r){return new $1(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(e,t,s=1e3,o=1.5,l=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=o,this.A_=l,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-s);o>0&&re("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ry="PersistentStream";class Uv{constructor(e,t,s,o,l,h,p,g){this.Fi=e,this.w_=s,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=p,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new Fv(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(Vr(t.toString()),Vr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,o])=>{this.b_===t&&this.W_(s,o)}),(s=>{e((()=>{const o=new te(q.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(o)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((o=>{s((()=>this.G_(o)))})),this.stream.onMessage((o=>{s((()=>++this.C_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return re(Ry,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(re(Ry,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class jA extends Uv{constructor(e,t,s,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=W1(this.serializer,e),s=(function(l){if(!("targetChange"in l))return Te.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?Te.min():h.readTime?sr(h.readTime):Te.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=qd(this.serializer),t.addTarget=(function(l,h){let p;const g=h.target;if(p=Ud(g)?{documents:Q1(l,g)}:{query:Y1(l,g).Vt},p.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){p.resumeToken=Cv(l,h.resumeToken);const _=zd(l,h.expectedCount);_!==null&&(p.expectedCount=_)}else if(h.snapshotVersion.compareTo(Te.min())>0){p.readTime=sc(l,h.snapshotVersion.toTimestamp());const _=zd(l,h.expectedCount);_!==null&&(p.expectedCount=_)}return p})(this.serializer,e);const s=J1(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=qd(this.serializer),t.removeTarget=e,this.k_(t)}}class zA extends Uv{constructor(e,t,s,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Ue(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Ue(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Ue(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=K1(e.writeResults,e.commitTime),s=sr(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=qd(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>G1(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BA{}class $A extends BA{constructor(e,t,s,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new te(q.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Wo(e,Bd(t,s),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new te(q.UNKNOWN,l.toString())}))}Jo(e,t,s,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,p])=>this.connection.Jo(e,Bd(t,s),o,h,p,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new te(q.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class qA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Vr(t),this._a=!1):re("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds="RemoteStore";class HA{constructor(e,t,s,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=l,this.Ea.xo((h=>{s.enqueueAndForget((async()=>{gs(this)&&(re(ds,"Restarting streams for network reachability change."),await(async function(g){const _=Ie(g);_.Ia.add(4),await hl(_),_.Aa.set("Unknown"),_.Ia.delete(4),await Ac(_)})(this))}))})),this.Aa=new qA(s,o)}}async function Ac(r){if(gs(r))for(const e of r.da)await e(!0)}async function hl(r){for(const e of r.da)await e(!1)}function jv(r,e){const t=Ie(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Vf(t)?Df(t):Fo(t).x_()&&Nf(t,e))}function xf(r,e){const t=Ie(r),s=Fo(t);t.Ta.delete(e),s.x_()&&zv(t,e),t.Ta.size===0&&(s.x_()?s.B_():gs(t)&&t.Aa.set("Unknown"))}function Nf(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Te.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Fo(r).H_(e)}function zv(r,e){r.Ra.$e(e),Fo(r).Y_(e)}function Df(r){r.Ra=new U1({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Fo(r).start(),r.Aa.aa()}function Vf(r){return gs(r)&&!Fo(r).M_()&&r.Ta.size>0}function gs(r){return Ie(r).Ia.size===0}function Bv(r){r.Ra=void 0}async function WA(r){r.Aa.set("Online")}async function GA(r){r.Ta.forEach(((e,t)=>{Nf(r,e)}))}async function KA(r,e){Bv(r),Vf(r)?(r.Aa.la(e),Df(r)):r.Aa.set("Unknown")}async function QA(r,e,t){if(r.Aa.set("Online"),e instanceof Rv&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const p of l.targetIds)o.Ta.has(p)&&(await o.remoteSyncer.rejectListen(p,h),o.Ta.delete(p),o.Ra.removeTarget(p))})(r,e)}catch(s){re(ds,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await ac(r,s)}else if(e instanceof $u?r.Ra.Ye(e):e instanceof Av?r.Ra.it(e):r.Ra.et(e),!t.isEqual(Te.min()))try{const s=await Mv(r.localStore);t.compareTo(s)>=0&&await(function(l,h){const p=l.Ra.Pt(h);return p.targetChanges.forEach(((g,_)=>{if(g.resumeToken.approximateByteSize()>0){const w=l.Ta.get(_);w&&l.Ta.set(_,w.withResumeToken(g.resumeToken,h))}})),p.targetMismatches.forEach(((g,_)=>{const w=l.Ta.get(g);if(!w)return;l.Ta.set(g,w.withResumeToken(Nt.EMPTY_BYTE_STRING,w.snapshotVersion)),zv(l,g);const T=new di(w.target,g,_,w.sequenceNumber);Nf(l,T)})),l.remoteSyncer.applyRemoteEvent(p)})(r,t)}catch(s){re(ds,"Failed to raise snapshot:",s),await ac(r,s)}}async function ac(r,e,t){if(!Lo(e))throw e;r.Ia.add(1),await hl(r),r.Aa.set("Offline"),t||(t=()=>Mv(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{re(ds,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await Ac(r)}))}function $v(r,e){return e().catch((t=>ac(r,t,e)))}async function Rc(r){const e=Ie(r),t=Si(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:gf;for(;YA(e);)try{const o=await NA(e.localStore,s);if(o===null){e.Pa.length===0&&t.B_();break}s=o.batchId,XA(e,o)}catch(o){await ac(e,o)}qv(e)&&Hv(e)}function YA(r){return gs(r)&&r.Pa.length<10}function XA(r,e){r.Pa.push(e);const t=Si(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function qv(r){return gs(r)&&!Si(r).M_()&&r.Pa.length>0}function Hv(r){Si(r).start()}async function JA(r){Si(r).na()}async function ZA(r){const e=Si(r);for(const t of r.Pa)e.X_(t.mutations)}async function eR(r,e,t){const s=r.Pa.shift(),o=If.from(s,e,t);await $v(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Rc(r)}async function tR(r,e){e&&Si(r).Z_&&await(async function(s,o){if((function(h){return M1(h)&&h!==q.ABORTED})(o.code)){const l=s.Pa.shift();Si(s).N_(),await $v(s,(()=>s.remoteSyncer.rejectFailedWrite(l.batchId,o))),await Rc(s)}})(r,e),qv(r)&&Hv(r)}async function Cy(r,e){const t=Ie(r);t.asyncQueue.verifyOperationInProgress(),re(ds,"RemoteStore received new credentials");const s=gs(t);t.Ia.add(3),await hl(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Ac(t)}async function nR(r,e){const t=Ie(r);e?(t.Ia.delete(2),await Ac(t)):e||(t.Ia.add(2),await hl(t),t.Aa.set("Unknown"))}function Fo(r){return r.Va||(r.Va=(function(t,s,o){const l=Ie(t);return l.ia(),new jA(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:WA.bind(null,r),e_:GA.bind(null,r),n_:KA.bind(null,r),J_:QA.bind(null,r)}),r.da.push((async e=>{e?(r.Va.N_(),Vf(r)?Df(r):r.Aa.set("Unknown")):(await r.Va.stop(),Bv(r))}))),r.Va}function Si(r){return r.ma||(r.ma=(function(t,s,o){const l=Ie(t);return l.ia(),new zA(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:JA.bind(null,r),n_:tR.bind(null,r),ea:ZA.bind(null,r),ta:eR.bind(null,r)}),r.da.push((async e=>{e?(r.ma.N_(),await Rc(r)):(await r.ma.stop(),r.Pa.length>0&&(re(ds,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Of{constructor(e,t,s,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=l,this.deferred=new yi,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,l){const h=Date.now()+s,p=new Of(e,t,h,o,l);return p.start(s),p}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new te(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function bf(r,e){if(Vr("AsyncQueue",`${e}: ${r}`),Lo(r))return new te(q.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo{static emptySet(e){return new vo(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||de.comparator(t.key,s.key):(t,s)=>de.comparator(t.key,s.key),this.keyedMap=Fa(),this.sortedSet=new et(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof vo)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new vo;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(){this.fa=new et(de.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ve(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Po{constructor(e,t,s,o,l,h,p,g,_){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=p,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,s,o,l){const h=[];return t.forEach((p=>{h.push({type:0,doc:p})})),new Po(e,t,vo.emptySet(t),h,s,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&vc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==s[o].type||!t[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rR{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class iR{constructor(){this.queries=ky(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const o=Ie(t),l=o.queries;o.queries=ky(),l.forEach(((h,p)=>{for(const g of p.wa)g.onError(s)}))})(this,new te(q.ABORTED,"Firestore shutting down"))}}function ky(){return new ms((r=>hv(r)),vc)}async function Wv(r,e){const t=Ie(r);let s=3;const o=e.query;let l=t.queries.get(o);l?!l.Sa()&&e.ba()&&(s=2):(l=new rR,s=e.ba()?0:1);try{switch(s){case 0:l.ya=await t.onListen(o,!0);break;case 1:l.ya=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const p=bf(h,`Initialization of query '${ho(e.query)}' failed`);return void e.onError(p)}t.queries.set(o,l),l.wa.push(e),e.va(t.onlineState),l.ya&&e.Ca(l.ya)&&Lf(t)}async function Gv(r,e){const t=Ie(r),s=e.query;let o=3;const l=t.queries.get(s);if(l){const h=l.wa.indexOf(e);h>=0&&(l.wa.splice(h,1),l.wa.length===0?o=e.ba()?0:1:!l.Sa()&&e.ba()&&(o=2))}switch(o){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function sR(r,e){const t=Ie(r);let s=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const p of h.wa)p.Ca(o)&&(s=!0);h.ya=o}}s&&Lf(t)}function oR(r,e,t){const s=Ie(r),o=s.queries.get(e);if(o)for(const l of o.wa)l.onError(t);s.queries.delete(e)}function Lf(r){r.Da.forEach((e=>{e.next()}))}var Gd,xy;(xy=Gd||(Gd={})).Fa="default",xy.Cache="cache";class Kv{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new Po(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Po.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==Gd.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qv{constructor(e){this.key=e}}class Yv{constructor(e){this.key=e}}class aR{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=xe(),this.mutatedKeys=xe(),this.Xa=dv(e),this.eu=new vo(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new Py,o=t?t.eu:this.eu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,p=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((w,T)=>{const A=o.get(w),F=Ec(this.query,T)?T:null,$=!!A&&this.mutatedKeys.has(A.key),G=!!F&&(F.hasLocalMutations||this.mutatedKeys.has(F.key)&&F.hasCommittedMutations);let B=!1;A&&F?A.data.isEqual(F.data)?$!==G&&(s.track({type:3,doc:F}),B=!0):this.iu(A,F)||(s.track({type:2,doc:F}),B=!0,(g&&this.Xa(F,g)>0||_&&this.Xa(F,_)<0)&&(p=!0)):!A&&F?(s.track({type:0,doc:F}),B=!0):A&&!F&&(s.track({type:1,doc:A}),B=!0,(g||_)&&(p=!0)),B&&(F?(h=h.add(F),l=G?l.add(w):l.delete(w)):(h=h.delete(w),l=l.delete(w)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const w=this.query.limitType==="F"?h.last():h.first();h=h.delete(w.key),l=l.delete(w.key),s.track({type:1,doc:w})}return{eu:h,ru:s,Ds:p,mutatedKeys:l}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,o){const l=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const h=e.ru.pa();h.sort(((w,T)=>(function(F,$){const G=B=>{switch(B){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ve(20277,{At:B})}};return G(F)-G($)})(w.type,T.type)||this.Xa(w.doc,T.doc))),this.su(s),o=o!=null&&o;const p=t&&!o?this.ou():[],g=this.Za.size===0&&this.current&&!o?1:0,_=g!==this.Ya;return this.Ya=g,h.length!==0||_?{snapshot:new Po(this.query,e.eu,l,h,e.mutatedKeys,g===0,_,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:p}:{_u:p}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Py,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=xe(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Yv(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new Qv(s))})),t}uu(e){this.Ha=e.qs,this.Za=xe();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Po.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Mf="SyncEngine";class lR{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class uR{constructor(e){this.key=e,this.lu=!1}}class cR{constructor(e,t,s,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.hu={},this.Pu=new ms((p=>hv(p)),vc),this.Tu=new Map,this.Iu=new Set,this.du=new et(de.comparator),this.Eu=new Map,this.Au=new Rf,this.Ru={},this.Vu=new Map,this.mu=Co.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function hR(r,e,t=!0){const s=n0(r);let o;const l=s.Pu.get(e);return l?(s.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.cu()):o=await Xv(s,e,t,!0),o}async function dR(r,e){const t=n0(r);await Xv(t,e,!0,!1)}async function Xv(r,e,t,s){const o=await DA(r.localStore,ir(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let p;return s&&(p=await fR(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&jv(r.remoteStore,o),p}async function fR(r,e,t,s,o){r.gu=(T,A,F)=>(async function(G,B,fe,ce){let pe=B.view.nu(fe);pe.Ds&&(pe=await Ty(G.localStore,B.query,!1).then((({documents:k})=>B.view.nu(k,pe))));const J=ce&&ce.targetChanges.get(B.targetId),Ee=ce&&ce.targetMismatches.get(B.targetId)!=null,ue=B.view.applyChanges(pe,G.isPrimaryClient,J,Ee);return Dy(G,B.targetId,ue._u),ue.snapshot})(r,T,A,F);const l=await Ty(r.localStore,e,!0),h=new aR(e,l.qs),p=h.nu(l.documents),g=cl.createSynthesizedTargetChangeForCurrentChange(t,s&&r.onlineState!=="Offline",o),_=h.applyChanges(p,r.isPrimaryClient,g);Dy(r,t,_._u);const w=new lR(e,t,h);return r.Pu.set(e,w),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),_.snapshot}async function pR(r,e,t){const s=Ie(r),o=s.Pu.get(e),l=s.Tu.get(o.targetId);if(l.length>1)return s.Tu.set(o.targetId,l.filter((h=>!vc(h,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await Hd(s.localStore,o.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(o.targetId),t&&xf(s.remoteStore,o.targetId),Kd(s,o.targetId)})).catch(bo)):(Kd(s,o.targetId),await Hd(s.localStore,o.targetId,!0))}async function mR(r,e){const t=Ie(r),s=t.Pu.get(e),o=t.Tu.get(s.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),xf(t.remoteStore,s.targetId))}async function gR(r,e,t){const s=IR(r);try{const o=await(function(h,p){const g=Ie(h),_=Qe.now(),w=p.reduce(((F,$)=>F.add($.key)),xe());let T,A;return g.persistence.runTransaction("Locally write mutations","readwrite",(F=>{let $=Or(),G=xe();return g.Os.getEntries(F,w).next((B=>{$=B,$.forEach(((fe,ce)=>{ce.isValidDocument()||(G=G.add(fe))}))})).next((()=>g.localDocuments.getOverlayedDocuments(F,$))).next((B=>{T=B;const fe=[];for(const ce of p){const pe=D1(ce,T.get(ce.key).overlayedDocument);pe!=null&&fe.push(new ki(ce.key,pe,rv(pe.value.mapValue),jn.exists(!0)))}return g.mutationQueue.addMutationBatch(F,_,fe,p)})).next((B=>{A=B;const fe=B.applyToLocalDocumentSet(T,G);return g.documentOverlayCache.saveOverlays(F,B.batchId,fe)}))})).then((()=>({batchId:A.batchId,changes:pv(T)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),(function(h,p,g){let _=h.Ru[h.currentUser.toKey()];_||(_=new et(Ae)),_=_.insert(p,g),h.Ru[h.currentUser.toKey()]=_})(s,o.batchId,t),await dl(s,o.changes),await Rc(s.remoteStore)}catch(o){const l=bf(o,"Failed to persist write");t.reject(l)}}async function Jv(r,e){const t=Ie(r);try{const s=await kA(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.Eu.get(l);h&&(Ue(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.lu=!0:o.modifiedDocuments.size>0?Ue(h.lu,14607):o.removedDocuments.size>0&&(Ue(h.lu,42227),h.lu=!1))})),await dl(t,s,e)}catch(s){await bo(s)}}function Ny(r,e,t){const s=Ie(r);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const o=[];s.Pu.forEach(((l,h)=>{const p=h.view.va(e);p.snapshot&&o.push(p.snapshot)})),(function(h,p){const g=Ie(h);g.onlineState=p;let _=!1;g.queries.forEach(((w,T)=>{for(const A of T.wa)A.va(p)&&(_=!0)})),_&&Lf(g)})(s.eventManager,e),o.length&&s.hu.J_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function yR(r,e,t){const s=Ie(r);s.sharedClientState.updateQueryState(e,"rejected",t);const o=s.Eu.get(e),l=o&&o.key;if(l){let h=new et(de.comparator);h=h.insert(l,jt.newNoDocument(l,Te.min()));const p=xe().add(l),g=new Ic(Te.min(),new Map,new et(Ae),h,p);await Jv(s,g),s.du=s.du.remove(l),s.Eu.delete(e),Ff(s)}else await Hd(s.localStore,e,!1).then((()=>Kd(s,e,t))).catch(bo)}async function _R(r,e){const t=Ie(r),s=e.batch.batchId;try{const o=await PA(t.localStore,e);e0(t,s,null),Zv(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await dl(t,o)}catch(o){await bo(o)}}async function vR(r,e,t){const s=Ie(r);try{const o=await(function(h,p){const g=Ie(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let w;return g.mutationQueue.lookupMutationBatch(_,p).next((T=>(Ue(T!==null,37113),w=T.keys(),g.mutationQueue.removeMutationBatch(_,T)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,w,p))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,w))).next((()=>g.localDocuments.getDocuments(_,w)))}))})(s.localStore,e);e0(s,e,t),Zv(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await dl(s,o)}catch(o){await bo(o)}}function Zv(r,e){(r.Vu.get(e)||[]).forEach((t=>{t.resolve()})),r.Vu.delete(e)}function e0(r,e,t){const s=Ie(r);let o=s.Ru[s.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),s.Ru[s.currentUser.toKey()]=o}}function Kd(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const s of r.Tu.get(e))r.Pu.delete(s),t&&r.hu.pu(s,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach((s=>{r.Au.containsKey(s)||t0(r,s)}))}function t0(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(xf(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),Ff(r))}function Dy(r,e,t){for(const s of t)s instanceof Qv?(r.Au.addReference(s.key,e),ER(r,s)):s instanceof Yv?(re(Mf,"Document no longer in limbo: "+s.key),r.Au.removeReference(s.key,e),r.Au.containsKey(s.key)||t0(r,s.key)):ve(19791,{yu:s})}function ER(r,e){const t=e.key,s=t.path.canonicalString();r.du.get(t)||r.Iu.has(s)||(re(Mf,"New document in limbo: "+t),r.Iu.add(s),Ff(r))}function Ff(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new de(We.fromString(e)),s=r.mu.next();r.Eu.set(s,new uR(t)),r.du=r.du.insert(t,s),jv(r.remoteStore,new di(ir(_c(t.path)),s,"TargetPurposeLimboResolution",mc.ue))}}async function dl(r,e,t){const s=Ie(r),o=[],l=[],h=[];s.Pu.isEmpty()||(s.Pu.forEach(((p,g)=>{h.push(s.gu(g,e,t).then((_=>{var w;if((_||t)&&s.isPrimaryClient){const T=_?!_.fromCache:(w=t==null?void 0:t.targetChanges.get(g.targetId))===null||w===void 0?void 0:w.current;s.sharedClientState.updateQueryState(g.targetId,T?"current":"not-current")}if(_){o.push(_);const T=Pf.Es(g.targetId,_);l.push(T)}})))})),await Promise.all(h),s.hu.J_(o),await(async function(g,_){const w=Ie(g);try{await w.persistence.runTransaction("notifyLocalViewChanges","readwrite",(T=>H.forEach(_,(A=>H.forEach(A.Is,(F=>w.persistence.referenceDelegate.addReference(T,A.targetId,F))).next((()=>H.forEach(A.ds,(F=>w.persistence.referenceDelegate.removeReference(T,A.targetId,F)))))))))}catch(T){if(!Lo(T))throw T;re(kf,"Failed to update sequence numbers: "+T)}for(const T of _){const A=T.targetId;if(!T.fromCache){const F=w.Fs.get(A),$=F.snapshotVersion,G=F.withLastLimboFreeSnapshotVersion($);w.Fs=w.Fs.insert(A,G)}}})(s.localStore,l))}async function wR(r,e){const t=Ie(r);if(!t.currentUser.isEqual(e)){re(Mf,"User change. New user:",e.toKey());const s=await Lv(t.localStore,e);t.currentUser=e,(function(l,h){l.Vu.forEach((p=>{p.forEach((g=>{g.reject(new te(q.CANCELLED,h))}))})),l.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await dl(t,s.Bs)}}function TR(r,e){const t=Ie(r),s=t.Eu.get(e);if(s&&s.lu)return xe().add(s.key);{let o=xe();const l=t.Tu.get(e);if(!l)return o;for(const h of l){const p=t.Pu.get(h);o=o.unionWith(p.view.tu)}return o}}function n0(r){const e=Ie(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Jv.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=TR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=yR.bind(null,e),e.hu.J_=sR.bind(null,e.eventManager),e.hu.pu=oR.bind(null,e.eventManager),e}function IR(r){const e=Ie(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=_R.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=vR.bind(null,e),e}class lc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Sc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return CA(this.persistence,new SA,e.initialUser,this.serializer)}Du(e){return new bv(Cf.Vi,this.serializer)}bu(e){return new OA}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}lc.provider={build:()=>new lc};class SR extends lc{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Ue(this.persistence.referenceDelegate instanceof oc,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new uA(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?en.withCacheSize(this.cacheSizeBytes):en.DEFAULT;return new bv((s=>oc.Vi(s,t)),this.serializer)}}class Qd{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Ny(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=wR.bind(null,this.syncEngine),await nR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new iR})()}createDatastore(e){const t=Sc(e.databaseInfo.databaseId),s=(function(l){return new UA(l)})(e.databaseInfo);return(function(l,h,p,g){return new $A(l,h,p,g)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,o,l,h,p){return new HA(s,o,l,h,p)})(this.localStore,this.datastore,e.asyncQueue,(t=>Ny(this.syncEngine,t,0)),(function(){return Ay.C()?new Ay:new bA})())}createSyncEngine(e,t){return(function(o,l,h,p,g,_,w){const T=new cR(o,l,h,p,g,_);return w&&(T.fu=!0),T})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Ie(o);re(ds,"RemoteStore shutting down."),l.Ia.add(5),await hl(l),l.Ea.shutdown(),l.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Qd.provider={build:()=>new Qd};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r0{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Vr("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai="FirestoreClient";class AR{constructor(e,t,s,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=o,this.user=Ut.UNAUTHENTICATED,this.clientId=mf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(s,(async h=>{re(Ai,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(s,(h=>(re(Ai,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new yi;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=bf(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Sd(r,e){r.asyncQueue.verifyOperationInProgress(),re(Ai,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let s=t.initialUser;r.setCredentialChangeListener((async o=>{s.isEqual(o)||(await Lv(e.localStore,o),s=o)})),e.persistence.setDatabaseDeletedListener((()=>{vi("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then((()=>{re("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((o=>{vi("Terminating Firestore due to IndexedDb database deletion failed",o)}))})),r._offlineComponents=e}async function Vy(r,e){r.asyncQueue.verifyOperationInProgress();const t=await RR(r);re(Ai,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((s=>Cy(e.remoteStore,s))),r.setAppCheckTokenChangeListener(((s,o)=>Cy(e.remoteStore,o))),r._onlineComponents=e}async function RR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){re(Ai,"Using user provided OfflineComponentProvider");try{await Sd(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===q.FAILED_PRECONDITION||o.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;vi("Error using user provided cache. Falling back to memory cache: "+t),await Sd(r,new lc)}}else re(Ai,"Using default OfflineComponentProvider"),await Sd(r,new SR(void 0));return r._offlineComponents}async function i0(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(re(Ai,"Using user provided OnlineComponentProvider"),await Vy(r,r._uninitializedComponentsProvider._online)):(re(Ai,"Using default OnlineComponentProvider"),await Vy(r,new Qd))),r._onlineComponents}function CR(r){return i0(r).then((e=>e.syncEngine))}async function Yd(r){const e=await i0(r),t=e.eventManager;return t.onListen=hR.bind(null,e.syncEngine),t.onUnlisten=pR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=dR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=mR.bind(null,e.syncEngine),t}function PR(r,e,t={}){const s=new yi;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,p,g,_){const w=new r0({next:A=>{w.Ou(),h.enqueueAndForget((()=>Gv(l,T)));const F=A.docs.has(p);!F&&A.fromCache?_.reject(new te(q.UNAVAILABLE,"Failed to get document because the client is offline.")):F&&A.fromCache&&g&&g.source==="server"?_.reject(new te(q.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(A)},error:A=>_.reject(A)}),T=new Kv(_c(p.path),w,{includeMetadataChanges:!0,ka:!0});return Wv(l,T)})(await Yd(r),r.asyncQueue,e,t,s))),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s0(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oy=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o0="firestore.googleapis.com",by=!0;class Ly{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new te(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=o0,this.ssl=by}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:by;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Ov;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<aA)throw new te(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}WS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=s0((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(l){if(l.timeoutSeconds!==void 0){if(isNaN(l.timeoutSeconds))throw new te(q.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (must not be NaN)`);if(l.timeoutSeconds<5)throw new te(q.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (minimum allowed value is 5)`);if(l.timeoutSeconds>30)throw new te(q.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Cc{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ly({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new te(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new te(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ly(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new MS;switch(s.type){case"firstParty":return new zS(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new te(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Oy.get(t);s&&(re("ComponentProvider","Removing Datastore"),Oy.delete(t),s.terminate())})(this),Promise.resolve()}}function kR(r,e,t,s={}){var o;r=Un(r,Cc);const l=No(e),h=r._getSettings(),p=Object.assign(Object.assign({},h),{emulatorOptions:r._getEmulatorOptions()}),g=`${e}:${t}`;l&&(Yy(`https://${g}`),Xy("Firestore",!0)),h.host!==o0&&h.host!==g&&vi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const _=Object.assign(Object.assign({},h),{host:g,ssl:l,emulatorOptions:s});if(!xr(_,p)&&(r._setSettings(_),s.mockUserToken)){let w,T;if(typeof s.mockUserToken=="string")w=s.mockUserToken,T=Ut.MOCK_USER;else{w=QE(s.mockUserToken,(o=r._app)===null||o===void 0?void 0:o.options.projectId);const A=s.mockUserToken.sub||s.mockUserToken.user_id;if(!A)throw new te(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");T=new Ut(A)}r._authCredentials=new FS(new q_(w,T))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new xi(this.firestore,e,this._query)}}class nt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _i(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new nt(this.firestore,e,this._key)}toJSON(){return{type:nt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(ll(t,nt._jsonSchema))return new nt(e,s||null,new de(We.fromString(t.referencePath)))}}nt._jsonSchemaVersion="firestore/documentReference/1.0",nt._jsonSchema={type:ht("string",nt._jsonSchemaVersion),referencePath:ht("string")};class _i extends xi{constructor(e,t,s){super(e,t,_c(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new nt(this.firestore,null,new de(e))}withConverter(e){return new _i(this.firestore,e,this._path)}}function ko(r,e,...t){if(r=St(r),W_("collection","path",e),r instanceof Cc){const s=We.fromString(e,...t);return Qg(s),new _i(r,null,s)}{if(!(r instanceof nt||r instanceof _i))throw new te(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(We.fromString(e,...t));return Qg(s),new _i(r.firestore,null,s)}}function xo(r,e,...t){if(r=St(r),arguments.length===1&&(e=mf.newId()),W_("doc","path",e),r instanceof Cc){const s=We.fromString(e,...t);return Kg(s),new nt(r,null,new de(s))}{if(!(r instanceof nt||r instanceof _i))throw new te(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(We.fromString(e,...t));return Kg(s),new nt(r.firestore,r instanceof _i?r.converter:null,new de(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const My="AsyncQueue";class Fy{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Fv(this,"async_queue_retry"),this.oc=()=>{const s=Id();s&&re(My,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=Id();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Id();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new yi;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Lo(e))throw e;re(My,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,Vr("INTERNAL UNHANDLED ERROR: ",Uy(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=Of.createAndSchedule(this,e,t,s,(l=>this.lc(l)));return this.ec.push(o),o}ac(){this.tc&&ve(47125,{hc:Uy(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Uy(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jy(r){return(function(t,s){if(typeof t!="object"||t===null)return!1;const o=t;for(const l of s)if(l in o&&typeof o[l]=="function")return!0;return!1})(r,["next","error","complete"])}class fs extends Cc{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new Fy,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Fy(e),this._firestoreClient=void 0,await e}}}function xR(r,e){const t=typeof r=="object"?r:rf(),s=typeof r=="string"?r:ec,o=tf(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const l=GE("firestore");l&&kR(o,...l)}return o}function Uf(r){if(r._terminated)throw new te(q.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||NR(r),r._firestoreClient}function NR(r){var e,t,s;const o=r._freezeSettings(),l=(function(p,g,_,w){return new r1(p,g,_,w.host,w.ssl,w.experimentalForceLongPolling,w.experimentalAutoDetectLongPolling,s0(w.experimentalLongPollingOptions),w.useFetchStreams,w.isUsingEmulator)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,o);r._componentsProvider||!((t=o.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(r._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),r._firestoreClient=new AR(r._authCredentials,r._appCheckCredentials,r._queue,l,r._componentsProvider&&(function(p){const g=p==null?void 0:p._online.build();return{_offline:p==null?void 0:p._offline.build(g),_online:g}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Tn(Nt.fromBase64String(e))}catch(t){throw new te(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Tn(Nt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Tn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ll(e,Tn._jsonSchema))return Tn.fromBase64String(e.bytes)}}Tn._jsonSchemaVersion="firestore/bytes/1.0",Tn._jsonSchema={type:ht("string",Tn._jsonSchemaVersion),bytes:ht("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new te(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new xt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new te(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new te(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ae(this._lat,e._lat)||Ae(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:or._jsonSchemaVersion}}static fromJSON(e){if(ll(e,or._jsonSchema))return new or(e.latitude,e.longitude)}}or._jsonSchemaVersion="firestore/geoPoint/1.0",or._jsonSchema={type:ht("string",or._jsonSchemaVersion),latitude:ht("number"),longitude:ht("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let l=0;l<s.length;++l)if(s[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ar._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ll(e,ar._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ar(e.vectorValues);throw new te(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ar._jsonSchemaVersion="firestore/vectorValue/1.0",ar._jsonSchema={type:ht("string",ar._jsonSchemaVersion),vectorValues:ht("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DR=/^__.*__$/;class VR{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new ki(e,this.data,this.fieldMask,t,this.fieldTransforms):new ul(e,this.data,t,this.fieldTransforms)}}class a0{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new ki(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function l0(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ve(40011,{Ec:r})}}class kc{constructor(e,t,s,o,l,h){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=o,l===void 0&&this.Ac(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new kc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.fc(e),o}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.Ac(),o}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return uc(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(l0(this.Ec)&&DR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class OR{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Sc(e)}Dc(e,t,s,o=!1){return new kc({Ec:e,methodName:t,bc:s,path:xt.emptyPath(),mc:!1,Sc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function xc(r){const e=r._freezeSettings(),t=Sc(r._databaseId);return new OR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function u0(r,e,t,s,o,l={}){const h=r.Dc(l.merge||l.mergeFields?2:0,e,t,o);$f("Data must be an object, but it was:",h,s);const p=h0(s,h);let g,_;if(l.merge)g=new cn(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const w=[];for(const T of l.mergeFields){const A=Xd(e,T,t);if(!h.contains(A))throw new te(q.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);f0(w,A)||w.push(A)}g=new cn(w),_=h.fieldTransforms.filter((T=>g.covers(T.field)))}else g=null,_=h.fieldTransforms;return new VR(new tn(p),g,_)}class Nc extends Uo{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Nc}}function c0(r,e,t){return new kc({Ec:3,bc:e.settings.bc,methodName:r._methodName,mc:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class jf extends Uo{_toFieldTransform(e){return new Tf(e.path,new tl)}isEqual(e){return e instanceof jf}}class zf extends Uo{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=c0(this,e,!0),s=this.vc.map((l=>ys(l,t))),o=new Ao(s);return new Tf(e.path,o)}isEqual(e){return e instanceof zf&&xr(this.vc,e.vc)}}class Bf extends Uo{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=c0(this,e,!0),s=this.vc.map((l=>ys(l,t))),o=new Ro(s);return new Tf(e.path,o)}isEqual(e){return e instanceof Bf&&xr(this.vc,e.vc)}}function bR(r,e,t,s){const o=r.Dc(1,e,t);$f("Data must be an object, but it was:",o,s);const l=[],h=tn.empty();Pi(s,((g,_)=>{const w=qf(e,g,t);_=St(_);const T=o.gc(w);if(_ instanceof Nc)l.push(w);else{const A=ys(_,T);A!=null&&(l.push(w),h.set(w,A))}}));const p=new cn(l);return new a0(h,p,o.fieldTransforms)}function LR(r,e,t,s,o,l){const h=r.Dc(1,e,t),p=[Xd(e,s,t)],g=[o];if(l.length%2!=0)throw new te(q.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<l.length;A+=2)p.push(Xd(e,l[A])),g.push(l[A+1]);const _=[],w=tn.empty();for(let A=p.length-1;A>=0;--A)if(!f0(_,p[A])){const F=p[A];let $=g[A];$=St($);const G=h.gc(F);if($ instanceof Nc)_.push(F);else{const B=ys($,G);B!=null&&(_.push(F),w.set(F,B))}}const T=new cn(_);return new a0(w,T,h.fieldTransforms)}function MR(r,e,t,s=!1){return ys(t,r.Dc(s?4:3,e))}function ys(r,e){if(d0(r=St(r)))return $f("Unsupported field value:",e,r),h0(r,e);if(r instanceof Uo)return(function(s,o){if(!l0(o.Ec))throw o.wc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.wc(`${s._methodName}() is not currently supported inside arrays`);const l=s._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,o){const l=[];let h=0;for(const p of s){let g=ys(p,o.yc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(s,o){if((s=St(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return R1(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const l=Qe.fromDate(s);return{timestampValue:sc(o.serializer,l)}}if(s instanceof Qe){const l=new Qe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:sc(o.serializer,l)}}if(s instanceof or)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Tn)return{bytesValue:Cv(o.serializer,s._byteString)};if(s instanceof nt){const l=o.databaseId,h=s.firestore._databaseId;if(!h.isEqual(l))throw o.wc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:Af(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof ar)return(function(h,p){return{mapValue:{fields:{[tv]:{stringValue:nv},[tc]:{arrayValue:{values:h.toArray().map((_=>{if(typeof _!="number")throw p.wc("VectorValues must only contain numeric values.");return wf(p.serializer,_)}))}}}}}})(s,o);throw o.wc(`Unsupported field value: ${pc(s)}`)})(r,e)}function h0(r,e){const t={};return Q_(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Pi(r,((s,o)=>{const l=ys(o,e.Vc(s));l!=null&&(t[s]=l)})),{mapValue:{fields:t}}}function d0(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Qe||r instanceof or||r instanceof Tn||r instanceof nt||r instanceof Uo||r instanceof ar)}function $f(r,e,t){if(!d0(t)||!G_(t)){const s=pc(t);throw s==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+s)}}function Xd(r,e,t){if((e=St(e))instanceof Pc)return e._internalPath;if(typeof e=="string")return qf(r,e);throw uc("Field path arguments must be of type string or ",r,!1,void 0,t)}const FR=new RegExp("[~\\*/\\[\\]]");function qf(r,e,t){if(e.search(FR)>=0)throw uc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Pc(...e.split("."))._internalPath}catch{throw uc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function uc(r,e,t,s,o){const l=s&&!s.isEmpty(),h=o!==void 0;let p=`Function ${e}() called with invalid data`;t&&(p+=" (via `toFirestore()`)"),p+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${s}`),h&&(g+=` in document ${o}`),g+=")"),new te(q.INVALID_ARGUMENT,p+r+g)}function f0(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p0{constructor(e,t,s,o,l){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new nt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new UR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Dc("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class UR extends p0{data(){return super.data()}}function Dc(r,e){return typeof e=="string"?qf(r,e):e instanceof Pc?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jR(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new te(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Hf{}class Wf extends Hf{}function Vc(r,e,...t){let s=[];e instanceof Hf&&s.push(e),s=s.concat(t),(function(l){const h=l.filter((g=>g instanceof Gf)).length,p=l.filter((g=>g instanceof Oc)).length;if(h>1||h>0&&p>0)throw new te(q.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const o of s)r=o._apply(r);return r}class Oc extends Wf{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Oc(e,t,s)}_apply(e){const t=this._parse(e);return m0(e._query,t),new xi(e.firestore,e.converter,jd(e._query,t))}_parse(e){const t=xc(e.firestore);return(function(l,h,p,g,_,w,T){let A;if(_.isKeyField()){if(w==="array-contains"||w==="array-contains-any")throw new te(q.INVALID_ARGUMENT,`Invalid Query. You can't perform '${w}' queries on documentId().`);if(w==="in"||w==="not-in"){By(T,w);const $=[];for(const G of T)$.push(zy(g,l,G));A={arrayValue:{values:$}}}else A=zy(g,l,T)}else w!=="in"&&w!=="not-in"&&w!=="array-contains-any"||By(T,w),A=MR(p,h,T,w==="in"||w==="not-in");return ct.create(_,w,A)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function zR(r,e,t){const s=e,o=Dc("where",r);return Oc._create(o,s,t)}class Gf extends Hf{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Gf(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:$n.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const p=l.getFlattenedFilters();for(const g of p)m0(h,g),h=jd(h,g)})(e._query,t),new xi(e.firestore,e.converter,jd(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Kf extends Wf{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Kf(e,t)}_apply(e){const t=(function(o,l,h){if(o.startAt!==null)throw new te(q.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new te(q.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new el(l,h)})(e._query,this._field,this._direction);return new xi(e.firestore,e.converter,(function(o,l){const h=o.explicitOrderBy.concat([l]);return new Mo(o.path,o.collectionGroup,h,o.filters.slice(),o.limit,o.limitType,o.startAt,o.endAt)})(e._query,t))}}function BR(r,e="asc"){const t=e,s=Dc("orderBy",r);return Kf._create(s,t)}class Qf extends Wf{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new Qf(e,t,s)}_apply(e){return new xi(e.firestore,e.converter,rc(e._query,this._limit,this._limitType))}}function $R(r){return Qf._create("limit",r,"F")}function zy(r,e,t){if(typeof(t=St(t))=="string"){if(t==="")throw new te(q.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!cv(e)&&t.indexOf("/")!==-1)throw new te(q.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(We.fromString(t));if(!de.isDocumentKey(s))throw new te(q.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return ry(r,new de(s))}if(t instanceof nt)return ry(r,t._key);throw new te(q.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${pc(t)}.`)}function By(r,e){if(!Array.isArray(r)||r.length===0)throw new te(q.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function m0(r,e){const t=(function(o,l){for(const h of o)for(const p of h.getFlattenedFilters())if(l.indexOf(p.op)>=0)return p.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new te(q.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new te(q.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class qR{convertValue(e,t="none"){switch(Ii(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ot(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ti(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ve(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return Pi(e,((o,l)=>{s[o]=this.convertValue(l,t)})),s}convertVectorValue(e){var t,s,o;const l=(o=(s=(t=e.fields)===null||t===void 0?void 0:t[tc].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map((h=>ot(h.doubleValue)));return new ar(l)}convertGeoPoint(e){return new or(ot(e.latitude),ot(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=yc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Xa(e));default:return null}}convertTimestamp(e){const t=wi(e);return new Qe(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=We.fromString(e);Ue(Vv(s),9688,{name:e});const o=new Ja(s.get(1),s.get(3)),l=new de(s.popFirst(5));return o.isEqual(t)||Vr(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g0(r,e,t){let s;return s=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,s}class ja{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class as extends p0{constructor(e,t,s,o,l,h){super(e,t,s,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new qu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Dc("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new te(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=as._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}as._jsonSchemaVersion="firestore/documentSnapshot/1.0",as._jsonSchema={type:ht("string",as._jsonSchemaVersion),bundleSource:ht("string","DocumentSnapshot"),bundleName:ht("string"),bundle:ht("string")};class qu extends as{data(e={}){return super.data(e)}}class Eo{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new ja(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new qu(this._firestore,this._userDataWriter,s.key,s,new ja(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new te(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((p=>{const g=new qu(o._firestore,o._userDataWriter,p.doc.key,p.doc,new ja(o._snapshot.mutatedKeys.has(p.doc.key),o._snapshot.fromCache),o.query.converter);return p.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((p=>l||p.type!==3)).map((p=>{const g=new qu(o._firestore,o._userDataWriter,p.doc.key,p.doc,new ja(o._snapshot.mutatedKeys.has(p.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,w=-1;return p.type!==0&&(_=h.indexOf(p.doc.key),h=h.delete(p.doc.key)),p.type!==1&&(h=h.add(p.doc),w=h.indexOf(p.doc.key)),{type:HR(p.type),doc:g,oldIndex:_,newIndex:w}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new te(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Eo._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=mf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),s.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function HR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ve(61501,{type:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y0(r){r=Un(r,nt);const e=Un(r.firestore,fs);return PR(Uf(e),r._key).then((t=>w0(e,r,t)))}Eo._jsonSchemaVersion="firestore/querySnapshot/1.0",Eo._jsonSchema={type:ht("string",Eo._jsonSchemaVersion),bundleSource:ht("string","QuerySnapshot"),bundleName:ht("string"),bundle:ht("string")};class _0 extends qR{constructor(e){super(),this.firestore=e}convertBytes(e){return new Tn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new nt(this.firestore,null,t)}}function v0(r,e,t){r=Un(r,nt);const s=Un(r.firestore,fs),o=g0(r.converter,e,t);return Yf(s,[u0(xc(s),"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,jn.none())])}function WR(r,e,t,...s){r=Un(r,nt);const o=Un(r.firestore,fs),l=xc(o);let h;return h=typeof(e=St(e))=="string"||e instanceof Pc?LR(l,"updateDoc",r._key,e,t,s):bR(l,"updateDoc",r._key,e),Yf(o,[h.toMutation(r._key,jn.exists(!0))])}function E0(r,e){const t=Un(r.firestore,fs),s=xo(r),o=g0(r.converter,e);return Yf(t,[u0(xc(r.firestore),"addDoc",s._key,o,r.converter!==null,{}).toMutation(s._key,jn.exists(!1))]).then((()=>s))}function bc(r,...e){var t,s,o;r=St(r);let l={includeMetadataChanges:!1,source:"default"},h=0;typeof e[h]!="object"||jy(e[h])||(l=e[h++]);const p={includeMetadataChanges:l.includeMetadataChanges,source:l.source};if(jy(e[h])){const T=e[h];e[h]=(t=T.next)===null||t===void 0?void 0:t.bind(T),e[h+1]=(s=T.error)===null||s===void 0?void 0:s.bind(T),e[h+2]=(o=T.complete)===null||o===void 0?void 0:o.bind(T)}let g,_,w;if(r instanceof nt)_=Un(r.firestore,fs),w=_c(r._key.path),g={next:T=>{e[h]&&e[h](w0(_,r,T))},error:e[h+1],complete:e[h+2]};else{const T=Un(r,xi);_=Un(T.firestore,fs),w=T._query;const A=new _0(_);g={next:F=>{e[h]&&e[h](new Eo(_,A,T,F))},error:e[h+1],complete:e[h+2]},jR(r._query)}return(function(A,F,$,G){const B=new r0(G),fe=new Kv(F,B,$);return A.asyncQueue.enqueueAndForget((async()=>Wv(await Yd(A),fe))),()=>{B.Ou(),A.asyncQueue.enqueueAndForget((async()=>Gv(await Yd(A),fe)))}})(Uf(_),w,p,g)}function Yf(r,e){return(function(s,o){const l=new yi;return s.asyncQueue.enqueueAndForget((async()=>gR(await CR(s),o,l))),l.promise})(Uf(r),e)}function w0(r,e,t){const s=t.docs.get(e._key),o=new _0(r);return new as(r,o,e._key,s,new ja(t.hasPendingWrites,t.fromCache),e.converter)}function Lc(){return new jf("serverTimestamp")}function GR(...r){return new zf("arrayUnion",r)}function KR(...r){return new Bf("arrayRemove",r)}(function(e,t=!0){(function(o){Oo=o})(Do),wo(new ls("firestore",((s,{instanceIdentifier:o,options:l})=>{const h=s.getProvider("app").getImmediate(),p=new fs(new US(s.getProvider("auth-internal")),new BS(h,s.getProvider("app-check-internal")),(function(_,w){if(!Object.prototype.hasOwnProperty.apply(_.options,["projectId"]))throw new te(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ja(_.options.projectId,w)})(h,o),h);return l=Object.assign({useFetchStreams:t},l),p._setSettings(l),p}),"PUBLIC").setMultipleInstances(!0)),mi($g,qg,e),mi($g,qg,"esm2017")})();const T0={apiKey:"AIzaSyCpcSwYcwUQ_f7_0BgYtQzKxSMnsZ2e6CE",authDomain:"taliat-portal.firebaseapp.com",projectId:"taliat-portal",storageBucket:"taliat-portal.firebasestorage.app",messagingSenderId:"258276231531",appId:"1:258276231531:web:035f8c04d21a68f33ca42e",measurementId:"G-VQSJ9ZFKLY"},I0=nf(T0),S0=L_(I0),zn=xR(I0);function QR({onUserAuthenticated:r}){const[e,t]=Pe.useState(""),[s,o]=Pe.useState(""),[l,h]=Pe.useState(""),[p,g]=Pe.useState(!1),_=async w=>{w.preventDefault(),h(""),g(!0);const T=e.trim().toLowerCase(),A=T.includes("@")?T:`${T}@talia.app`;try{const $=(await EI(S0,A,s)).user;try{const G=await y0(xo(zn,"users",$.uid));if(G.exists()){const B=G.data();r({uid:$.uid,email:$.email,role:B.role||"scout",leaderId:B.leaderId||null,patrolId:B.patrolId||null,fullName:B.fullName||T.split("@")[0],username:B.username||T.split("@")[0],rank:B.rank||"",meritBadges:B.meritBadges||[]})}else r({uid:$.uid,email:$.email,role:"leader",leaderId:null,patrolId:null,fullName:T.split("@")[0],username:T.split("@")[0],rank:"",meritBadges:[]})}catch(G){console.warn("Firestore fetch failed, logging in with auth profile:",G),r({uid:$.uid,email:$.email,role:"leader",leaderId:null,patrolId:null,fullName:$.email,username:$.email.split("@")[0],rank:"",meritBadges:[]})}}catch(F){console.error("Login error:",F),h(`[${F.code||"error"}] ${F.message}`)}finally{g(!1)}};return U.jsx("div",{className:"min-h-screen bg-slate-900 flex items-center justify-center p-4",children:U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-8 shadow-2xl",children:[U.jsx("h2",{className:"text-2xl font-bold text-center text-white mb-2",children:"Taliʿa Portal"}),U.jsx("p",{className:"text-sm text-slate-400 text-center mb-6",children:"Log in to track requirements and chat"}),l&&U.jsx("div",{className:"p-3 mb-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-xs break-words",children:l}),U.jsxs("form",{onSubmit:_,className:"space-y-4",children:[U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Username or Email"}),U.jsx("input",{type:"text",required:!0,value:e,onChange:w=>t(w.target.value),placeholder:"e.g. neoissa@gmail.com",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"})]}),U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Password"}),U.jsx("input",{type:"password",required:!0,value:s,onChange:w=>o(w.target.value),placeholder:"••••••••",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"})]}),U.jsx("button",{type:"submit",disabled:p,className:"w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer",children:p?"Logging in...":"Enter Portal"})]})]})})}function YR({currentUser:r}){const[e,t]=Pe.useState([]),[s,o]=Pe.useState("all"),[l,h]=Pe.useState(!0);Pe.useEffect(()=>{const T=Vc(ko(zn,"requirements")),A=bc(T,F=>{const $=F.docs.map(G=>({id:G.id,...G.data()}));t($),h(!1)},F=>{console.error(F),h(!1)});return()=>A()},[]);const p=async T=>{var $;const A=($=T.completedBy)==null?void 0:$.includes(r.uid),F=xo(zn,"requirements",T.id);try{await WR(F,{completedBy:A?KR(r.uid):GR(r.uid)})}catch(G){console.error("Failed to update task:",G)}},g=e.filter(T=>{var A;return(A=T.completedBy)==null?void 0:A.includes(r.uid)}).length,_=e.length>0?Math.round(g/e.length*100):0,w=e.filter(T=>{var F;const A=(F=T.completedBy)==null?void 0:F.includes(r.uid);return s==="completed"?A:s==="remaining"?!A:!0});return U.jsxs("div",{className:"space-y-6",children:[U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6",children:[U.jsxs("div",{className:"flex justify-between items-center mb-2",children:[U.jsx("h3",{className:"font-bold text-lg text-white",children:"Patrol Advancement Progress"}),U.jsxs("span",{className:"text-emerald-400 font-bold",children:[_,"% Completed"]})]}),U.jsx("div",{className:"w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-4",children:U.jsx("div",{className:"bg-emerald-500 h-full transition-all duration-300 rounded-full",style:{width:`${_}%`}})}),U.jsxs("p",{className:"text-xs text-slate-400",children:["Completed ",g," of ",e.length," requirements."]})]}),U.jsx("div",{className:"flex gap-2",children:["all","remaining","completed"].map(T=>U.jsx("button",{onClick:()=>o(T),className:`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${s===T?"bg-emerald-600 text-white shadow-md":"bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"}`,children:T==="all"?"All Tasks":T},T))}),U.jsx("div",{className:"space-y-3",children:l?U.jsx("div",{className:"text-center py-8 text-slate-400 text-sm",children:"Loading requirements..."}):w.length===0?U.jsx("div",{className:"text-center py-8 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800",children:"No requirements found in this category."}):w.map(T=>{var F;const A=(F=T.completedBy)==null?void 0:F.includes(r.uid);return U.jsxs("div",{onClick:()=>p(T),className:`p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer select-none ${A?"bg-emerald-950/20 border-emerald-800/50 text-slate-300":"bg-slate-800 border-slate-700 text-white hover:border-slate-600"}`,children:[U.jsx("input",{type:"checkbox",checked:!!A,readOnly:!0,className:"mt-1 w-5 h-5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"}),U.jsxs("div",{className:"flex-1",children:[U.jsxs("div",{className:"flex justify-between items-center mb-1",children:[U.jsx("span",{className:`font-semibold ${A?"line-through text-slate-400":"text-white"}`,children:T.title}),U.jsx("span",{className:"text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase",children:T.category||"Core"})]}),T.description&&U.jsx("p",{className:"text-xs text-slate-400",children:T.description})]})]},T.id)})})]})}function XR({currentUser:r}){const[e,t]=Pe.useState([]),[s,o]=Pe.useState(""),l=Pe.useRef();Pe.useEffect(()=>{const p=Vc(ko(zn,"patrol_messages"),BR("timestamp","asc"),$R(50)),g=bc(p,_=>{const w=_.docs.map(T=>({id:T.id,...T.data()}));t(w),setTimeout(()=>{var T;return(T=l.current)==null?void 0:T.scrollIntoView({behavior:"smooth"})},100)});return()=>g()},[]);const h=async p=>{if(p.preventDefault(),!s.trim())return;const g=s;o("");try{await E0(ko(zn,"patrol_messages"),{text:g,senderId:r.uid,senderName:r.fullName||r.email.split("@")[0],role:r.role||"member",timestamp:Lc()})}catch(_){console.error("Failed to send message:",_)}};return U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden",children:[U.jsxs("div",{className:"p-4 border-b border-slate-700 bg-slate-800/80",children:[U.jsx("h3",{className:"font-bold text-white text-base",children:"Patrol Stream"}),U.jsx("p",{className:"text-xs text-slate-400",children:"Live communication channel for members & leaders"})]}),U.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-3",children:[e.length===0?U.jsx("div",{className:"text-center py-12 text-slate-500 text-xs",children:"No messages yet. Send the first update!"}):e.map(p=>{const g=p.senderId===r.uid;return U.jsxs("div",{className:`flex flex-col ${g?"items-end":"items-start"}`,children:[U.jsxs("div",{className:"flex items-center gap-1.5 mb-1 px-1",children:[U.jsx("span",{className:"text-xs font-semibold text-slate-300",children:p.senderName}),p.role==="leader"&&U.jsx("span",{className:"text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30",children:"Leader"})]}),U.jsx("div",{className:`p-3 rounded-2xl max-w-[80%] text-sm break-words ${g?"bg-emerald-600 text-white rounded-tr-none":"bg-slate-700 text-slate-100 rounded-tl-none"}`,children:p.text})]},p.id)}),U.jsx("div",{ref:l})]}),U.jsxs("form",{onSubmit:h,className:"p-3 bg-slate-900 border-t border-slate-700 flex gap-2",children:[U.jsx("input",{type:"text",value:s,onChange:p=>o(p.target.value),placeholder:"Share an update or question...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"}),U.jsx("button",{type:"submit",className:"bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",children:"Send"})]})]})}function JR(){const[r,e]=Pe.useState(""),[t,s]=Pe.useState("Knots & Pioneering"),[o,l]=Pe.useState(""),[h,p]=Pe.useState(""),g=async _=>{if(_.preventDefault(),!!r.trim())try{await E0(ko(zn,"requirements"),{title:r.trim(),category:t,description:o.trim(),completedBy:[],createdAt:Lc()}),e(""),l(""),p("Requirement added successfully!"),setTimeout(()=>p(""),3e3)}catch(w){console.error(w),p("Error adding requirement.")}};return U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl mx-auto shadow-xl",children:[U.jsx("h3",{className:"font-bold text-lg text-white mb-1",children:"Add Scout Requirement"}),U.jsx("p",{className:"text-xs text-slate-400 mb-6",children:"Create advancement checkpoints for your patrol members."}),h&&U.jsx("div",{className:"p-3 mb-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold",children:h}),U.jsxs("form",{onSubmit:g,className:"space-y-4",children:[U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Requirement Title"}),U.jsx("input",{type:"text",required:!0,value:r,onChange:_=>e(_.target.value),placeholder:"e.g. Tie a Clove Hitch & Taut-Line Hitch",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Category"}),U.jsxs("select",{value:t,onChange:_=>s(_.target.value),className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500",children:[U.jsx("option",{value:"Knots & Pioneering",children:"Knots & Pioneering"}),U.jsx("option",{value:"First Aid",children:"First Aid"}),U.jsx("option",{value:"Navigation & Camping",children:"Navigation & Camping"}),U.jsx("option",{value:"Leadership & Values",children:"Leadership & Values"})]})]}),U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Details / Notes"}),U.jsx("textarea",{rows:3,value:o,onChange:_=>l(_.target.value),placeholder:"Demonstrate tying the hitch around a timber spar...",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),U.jsx("button",{type:"submit",className:"w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30",children:"Publish Requirement"})]})]})}function ZR(r){return r.trim().toLowerCase().replace(/\s+/g,".")+Math.floor(100+Math.random()*900)}function eC({scout:r,leaderId:e,onBack:t}){const[s,o]=Pe.useState([]),[l,h]=Pe.useState(""),[p,g]=Pe.useState(""),[_,w]=Pe.useState(!0),[T,A]=Pe.useState(!1),[F,$]=Pe.useState("");Pe.useEffect(()=>{const J=Vc(ko(zn,"requirements")),Ee=bc(J,ue=>{o(ue.docs.map(k=>({id:k.id,...k.data()})))});return()=>Ee()},[]),Pe.useEffect(()=>{(async()=>{const Ee=xo(zn,"scout_notes",r.uid);try{const ue=await y0(Ee);if(ue.exists()){const I=ue.data()[e]||"";h(I),g(I)}}catch(ue){console.error("Failed to load notes:",ue)}finally{w(!1)}})()},[r.uid,e]);const G=async()=>{A(!0);try{const J=xo(zn,"scout_notes",r.uid);await v0(J,{[e]:l,updatedAt:Lc()},{merge:!0}),g(l),$("Notes saved."),setTimeout(()=>$(""),2500)}catch(J){console.error("Failed to save notes:",J),$("Error saving notes.")}finally{A(!1)}},B=s.filter(J=>{var Ee;return(Ee=J.completedBy)==null?void 0:Ee.includes(r.uid)}).length,fe=s.length,ce=fe>0?Math.round(B/fe*100):0,pe=s.reduce((J,Ee)=>{var k;const ue=Ee.category||"Core";return J[ue]||(J[ue]={total:0,done:0}),J[ue].total++,(k=Ee.completedBy)!=null&&k.includes(r.uid)&&J[ue].done++,J},{});return U.jsxs("div",{className:"space-y-6",children:[U.jsx("button",{onClick:t,className:"flex items-center gap-2 text-sm text-slate-400 hover:text-white transition cursor-pointer",children:"← Back to Roster"}),U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6",children:[U.jsxs("div",{className:"flex justify-between items-start mb-1",children:[U.jsxs("div",{children:[U.jsx("h3",{className:"font-bold text-lg text-white",children:r.fullName||r.username}),U.jsxs("p",{className:"text-xs text-slate-400",children:["@",r.username,r.rank?` · ${r.rank}`:""]})]}),U.jsxs("span",{className:"text-emerald-400 font-bold text-xl",children:[ce,"%"]})]}),U.jsx("div",{className:"w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-4 mt-3",children:U.jsx("div",{className:"bg-emerald-500 h-full transition-all duration-300 rounded-full",style:{width:`${ce}%`}})}),U.jsxs("p",{className:"text-xs text-slate-400",children:["Completed ",B," of ",fe," requirements"]})]}),Object.keys(pe).length>0&&U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4",children:[U.jsx("h4",{className:"font-semibold text-white text-sm mb-2",children:"Rank Completion Breakdown"}),Object.entries(pe).map(([J,{total:Ee,done:ue}])=>{const k=Ee>0?Math.round(ue/Ee*100):0;return U.jsxs("div",{children:[U.jsxs("div",{className:"flex justify-between text-xs mb-1",children:[U.jsx("span",{className:"text-slate-300",children:J}),U.jsxs("span",{className:"text-slate-400",children:[ue,"/",Ee," (",k,"%)"]})]}),U.jsx("div",{className:"w-full bg-slate-700 h-2 rounded-full overflow-hidden",children:U.jsx("div",{className:"bg-emerald-500 h-full rounded-full transition-all duration-300",style:{width:`${k}%`}})})]},J)})]}),U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6",children:[U.jsx("h4",{className:"font-semibold text-white text-sm mb-1",children:"Leader Private Notes"}),U.jsx("p",{className:"text-xs text-slate-500 mb-3",children:"Visible only to you. Never shown to the scout."}),_?U.jsx("p",{className:"text-xs text-slate-400",children:"Loading notes…"}):U.jsxs(U.Fragment,{children:[U.jsx("textarea",{rows:5,value:l,onChange:J=>h(J.target.value),placeholder:"Record observations, goals, or concerns here…",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"}),U.jsxs("div",{className:"flex items-center justify-between mt-3",children:[F&&U.jsx("span",{className:"text-xs text-emerald-400 font-semibold",children:F}),U.jsx("button",{onClick:G,disabled:T||l===p,className:"ml-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition cursor-pointer",children:T?"Saving…":"Save Notes"})]})]})]})]})}function tC({currentUser:r}){const[e,t]=Pe.useState([]),[s,o]=Pe.useState(null),[l,h]=Pe.useState(null),[p,g]=Pe.useState(!1),[_,w]=Pe.useState(""),[T,A]=Pe.useState(""),[F,$]=Pe.useState(!1),[G,B]=Pe.useState(""),[fe,ce]=Pe.useState("");Pe.useEffect(()=>{const J=Vc(ko(zn,"users"),zR("leaderId","==",r.uid)),Ee=bc(J,ue=>{t(ue.docs.map(k=>({uid:k.id,...k.data()})))});return()=>Ee()},[r.uid]);const pe=async J=>{if(J.preventDefault(),ce(""),B(""),!_.trim())return;$(!0);const Ee=ZR(_),ue=`${Ee}@talia.app`,k=`Scout${Math.floor(1e3+Math.random()*9e3)}!`;try{let I;try{I=rf("secondary")}catch{I=nf(T0,"secondary")}const C=L_(I),D=(await vI(C,ue,k)).user.uid;await C.signOut(),await v0(xo(zn,"users",D),{fullName:_.trim(),username:Ee,email:ue,role:"scout",leaderId:r.uid,patrolId:r.patrolId||r.uid,rank:T.trim(),meritBadges:[],createdAt:Lc()}),B(`Scout added! Username: ${Ee} · Temporary password: ${k}`),w(""),A(""),g(!1)}catch(I){console.error(I),ce(`Error: ${I.message}`)}finally{$(!1)}};return l?U.jsx(eC,{scout:l,leaderId:r.uid,onBack:()=>h(null)}):U.jsxs("div",{className:"space-y-6",children:[U.jsxs("div",{className:"flex justify-between items-center",children:[U.jsxs("div",{children:[U.jsx("h3",{className:"font-bold text-lg text-white",children:"Patrol Roster"}),U.jsxs("p",{className:"text-xs text-slate-400",children:[e.length," scout",e.length!==1?"s":""," assigned to you"]})]}),U.jsx("button",{onClick:()=>{g(J=>!J),B(""),ce("")},className:"bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer",children:p?"Cancel":"+ Add Scout"})]}),G&&U.jsx("div",{className:"p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold",children:G}),p&&U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-5",children:[U.jsx("h4",{className:"font-semibold text-white text-sm mb-3",children:"New Scout"}),fe&&U.jsx("div",{className:"p-3 mb-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl",children:fe}),U.jsxs("form",{onSubmit:pe,className:"space-y-3",children:[U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Full Name"}),U.jsx("input",{type:"text",required:!0,value:_,onChange:J=>w(J.target.value),placeholder:"e.g. Ahmad Al-Rashid",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),U.jsxs("div",{children:[U.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Rank (optional)"}),U.jsx("input",{type:"text",value:T,onChange:J=>A(J.target.value),placeholder:"e.g. Scout, Tenderfoot",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),U.jsx("button",{type:"submit",disabled:F,className:"w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm",children:F?"Creating account…":"Create Scout Account"})]})]}),U.jsx("div",{className:"space-y-2",children:e.length===0?U.jsx("div",{className:"text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800",children:"No scouts assigned yet. Add your first scout above."}):e.map(J=>{var Ee;return U.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden",children:[U.jsxs("button",{className:"w-full flex justify-between items-center px-5 py-4 text-left cursor-pointer hover:bg-slate-700/50 transition",onClick:()=>o(ue=>ue===J.uid?null:J.uid),children:[U.jsxs("div",{children:[U.jsx("p",{className:"font-semibold text-white text-sm",children:J.fullName||J.username}),U.jsxs("p",{className:"text-xs text-slate-400",children:["@",J.username,J.rank?` · ${J.rank}`:""]})]}),U.jsx("span",{className:"text-slate-400 text-lg",children:s===J.uid?"▲":"▼"})]}),s===J.uid&&U.jsxs("div",{className:"px-5 pb-4 border-t border-slate-700/60 pt-3 space-y-2",children:[((Ee=J.meritBadges)==null?void 0:Ee.length)>0&&U.jsxs("p",{className:"text-xs text-slate-400",children:["Merit badges: ",J.meritBadges.join(", ")]}),U.jsx("button",{onClick:()=>h(J),className:"mt-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer",children:"View Advancement & Notes →"})]})]},J.uid)})})]})}function nC(){const[r,e]=Pe.useState(null),[t,s]=Pe.useState("advancement"),o=async()=>{await II(S0),e(null)};if(!r)return U.jsx(QR,{onUserAuthenticated:h=>e(h)});const l=r.role==="leader";return U.jsxs("div",{className:"min-h-screen bg-slate-900 text-white flex flex-col font-sans",children:[U.jsxs("header",{className:"bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-50 flex justify-between items-center",children:[U.jsxs("div",{children:[U.jsx("h1",{className:"text-xl font-bold text-emerald-400",children:"Taliʿa Patrol Portal"}),U.jsxs("p",{className:"text-xs text-slate-400",children:["Logged in as ",U.jsx("span",{className:"text-white font-semibold",children:r.fullName||r.email}),U.jsx("span",{className:"ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-bold border border-emerald-500/30",children:l?"Leader":"Member"})]})]}),U.jsx("button",{onClick:o,className:"bg-slate-700 hover:bg-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer",children:"Sign Out"})]}),U.jsx("div",{className:"bg-slate-800/40 border-b border-slate-700/60 px-6",children:U.jsxs("div",{className:"max-w-4xl mx-auto flex gap-6",children:[U.jsx("button",{onClick:()=>s("advancement"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="advancement"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Advancement Tracker"}),U.jsx("button",{onClick:()=>s("chat"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="chat"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Patrol Stream"}),l&&U.jsx("button",{onClick:()=>s("roster"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="roster"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Patrol Roster"}),l&&U.jsx("button",{onClick:()=>s("admin"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="admin"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Add Requirements"})]})}),U.jsxs("main",{className:"flex-1 p-6 max-w-4xl mx-auto w-full",children:[t==="advancement"&&U.jsx(YR,{currentUser:r}),t==="chat"&&U.jsx(XR,{currentUser:r}),t==="roster"&&l&&U.jsx(tC,{currentUser:r}),t==="admin"&&l&&U.jsx(JR,{})]})]})}FE.createRoot(document.getElementById("root")).render(U.jsx(NE.StrictMode,{children:U.jsx(nC,{})}));
