(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function By(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var od={exports:{}},Va={},ad={exports:{}},Ce={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eg;function Pw(){if(eg)return Ce;eg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),T=Symbol.iterator;function C(O){return O===null||typeof O!="object"?null:(O=T&&O[T]||O["@@iterator"],typeof O=="function"?O:null)}var U={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$=Object.assign,G={};function q(O,W,le){this.props=O,this.context=W,this.refs=G,this.updater=le||U}q.prototype.isReactComponent={},q.prototype.setState=function(O,W){if(typeof O!="object"&&typeof O!="function"&&O!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,O,W,"setState")},q.prototype.forceUpdate=function(O){this.updater.enqueueForceUpdate(this,O,"forceUpdate")};function me(){}me.prototype=q.prototype;function ce(O,W,le){this.props=O,this.context=W,this.refs=G,this.updater=le||U}var pe=ce.prototype=new me;pe.constructor=ce,$(pe,q.prototype),pe.isPureReactComponent=!0;var Ee=Array.isArray,Be=Object.prototype.hasOwnProperty,Te={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function A(O,W,le){var Ie,Re={},Ne=null,Le=null;if(W!=null)for(Ie in W.ref!==void 0&&(Le=W.ref),W.key!==void 0&&(Ne=""+W.key),W)Be.call(W,Ie)&&!D.hasOwnProperty(Ie)&&(Re[Ie]=W[Ie]);var Me=arguments.length-2;if(Me===1)Re.children=le;else if(1<Me){for(var qe=Array(Me),vt=0;vt<Me;vt++)qe[vt]=arguments[vt+2];Re.children=qe}if(O&&O.defaultProps)for(Ie in Me=O.defaultProps,Me)Re[Ie]===void 0&&(Re[Ie]=Me[Ie]);return{$$typeof:r,type:O,key:Ne,ref:Le,props:Re,_owner:Te.current}}function I(O,W){return{$$typeof:r,type:O.type,key:W,ref:O.ref,props:O.props,_owner:O._owner}}function P(O){return typeof O=="object"&&O!==null&&O.$$typeof===r}function x(O){var W={"=":"=0",":":"=2"};return"$"+O.replace(/[=:]/g,function(le){return W[le]})}var V=/\/+/g;function R(O,W){return typeof O=="object"&&O!==null&&O.key!=null?x(""+O.key):W.toString(36)}function $e(O,W,le,Ie,Re){var Ne=typeof O;(Ne==="undefined"||Ne==="boolean")&&(O=null);var Le=!1;if(O===null)Le=!0;else switch(Ne){case"string":case"number":Le=!0;break;case"object":switch(O.$$typeof){case r:case e:Le=!0}}if(Le)return Le=O,Re=Re(Le),O=Ie===""?"."+R(Le,0):Ie,Ee(Re)?(le="",O!=null&&(le=O.replace(V,"$&/")+"/"),$e(Re,W,le,"",function(vt){return vt})):Re!=null&&(P(Re)&&(Re=I(Re,le+(!Re.key||Le&&Le.key===Re.key?"":(""+Re.key).replace(V,"$&/")+"/")+O)),W.push(Re)),1;if(Le=0,Ie=Ie===""?".":Ie+":",Ee(O))for(var Me=0;Me<O.length;Me++){Ne=O[Me];var qe=Ie+R(Ne,Me);Le+=$e(Ne,W,le,qe,Re)}else if(qe=C(O),typeof qe=="function")for(O=qe.call(O),Me=0;!(Ne=O.next()).done;)Ne=Ne.value,qe=Ie+R(Ne,Me++),Le+=$e(Ne,W,le,qe,Re);else if(Ne==="object")throw W=String(O),Error("Objects are not valid as a React child (found: "+(W==="[object Object]"?"object with keys {"+Object.keys(O).join(", ")+"}":W)+"). If you meant to render a collection of children, use an array instead.");return Le}function _t(O,W,le){if(O==null)return O;var Ie=[],Re=0;return $e(O,Ie,"","",function(Ne){return W.call(le,Ne,Re++)}),Ie}function Rt(O){if(O._status===-1){var W=O._result;W=W(),W.then(function(le){(O._status===0||O._status===-1)&&(O._status=1,O._result=le)},function(le){(O._status===0||O._status===-1)&&(O._status=2,O._result=le)}),O._status===-1&&(O._status=0,O._result=W)}if(O._status===1)return O._result.default;throw O._result}var Fe={current:null},Z={transition:null},he={ReactCurrentDispatcher:Fe,ReactCurrentBatchConfig:Z,ReactCurrentOwner:Te};function re(){throw Error("act(...) is not supported in production builds of React.")}return Ce.Children={map:_t,forEach:function(O,W,le){_t(O,function(){W.apply(this,arguments)},le)},count:function(O){var W=0;return _t(O,function(){W++}),W},toArray:function(O){return _t(O,function(W){return W})||[]},only:function(O){if(!P(O))throw Error("React.Children.only expected to receive a single React element child.");return O}},Ce.Component=q,Ce.Fragment=t,Ce.Profiler=o,Ce.PureComponent=ce,Ce.StrictMode=s,Ce.Suspense=g,Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=he,Ce.act=re,Ce.cloneElement=function(O,W,le){if(O==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+O+".");var Ie=$({},O.props),Re=O.key,Ne=O.ref,Le=O._owner;if(W!=null){if(W.ref!==void 0&&(Ne=W.ref,Le=Te.current),W.key!==void 0&&(Re=""+W.key),O.type&&O.type.defaultProps)var Me=O.type.defaultProps;for(qe in W)Be.call(W,qe)&&!D.hasOwnProperty(qe)&&(Ie[qe]=W[qe]===void 0&&Me!==void 0?Me[qe]:W[qe])}var qe=arguments.length-2;if(qe===1)Ie.children=le;else if(1<qe){Me=Array(qe);for(var vt=0;vt<qe;vt++)Me[vt]=arguments[vt+2];Ie.children=Me}return{$$typeof:r,type:O.type,key:Re,ref:Ne,props:Ie,_owner:Le}},Ce.createContext=function(O){return O={$$typeof:h,_currentValue:O,_currentValue2:O,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},O.Provider={$$typeof:l,_context:O},O.Consumer=O},Ce.createElement=A,Ce.createFactory=function(O){var W=A.bind(null,O);return W.type=O,W},Ce.createRef=function(){return{current:null}},Ce.forwardRef=function(O){return{$$typeof:f,render:O}},Ce.isValidElement=P,Ce.lazy=function(O){return{$$typeof:E,_payload:{_status:-1,_result:O},_init:Rt}},Ce.memo=function(O,W){return{$$typeof:_,type:O,compare:W===void 0?null:W}},Ce.startTransition=function(O){var W=Z.transition;Z.transition={};try{O()}finally{Z.transition=W}},Ce.unstable_act=re,Ce.useCallback=function(O,W){return Fe.current.useCallback(O,W)},Ce.useContext=function(O){return Fe.current.useContext(O)},Ce.useDebugValue=function(){},Ce.useDeferredValue=function(O){return Fe.current.useDeferredValue(O)},Ce.useEffect=function(O,W){return Fe.current.useEffect(O,W)},Ce.useId=function(){return Fe.current.useId()},Ce.useImperativeHandle=function(O,W,le){return Fe.current.useImperativeHandle(O,W,le)},Ce.useInsertionEffect=function(O,W){return Fe.current.useInsertionEffect(O,W)},Ce.useLayoutEffect=function(O,W){return Fe.current.useLayoutEffect(O,W)},Ce.useMemo=function(O,W){return Fe.current.useMemo(O,W)},Ce.useReducer=function(O,W,le){return Fe.current.useReducer(O,W,le)},Ce.useRef=function(O){return Fe.current.useRef(O)},Ce.useState=function(O){return Fe.current.useState(O)},Ce.useSyncExternalStore=function(O,W,le){return Fe.current.useSyncExternalStore(O,W,le)},Ce.useTransition=function(){return Fe.current.useTransition()},Ce.version="18.3.1",Ce}var tg;function Qd(){return tg||(tg=1,ad.exports=Pw()),ad.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ng;function kw(){if(ng)return Va;ng=1;var r=Qd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(f,g,_){var E,T={},C=null,U=null;_!==void 0&&(C=""+_),g.key!==void 0&&(C=""+g.key),g.ref!==void 0&&(U=g.ref);for(E in g)s.call(g,E)&&!l.hasOwnProperty(E)&&(T[E]=g[E]);if(f&&f.defaultProps)for(E in g=f.defaultProps,g)T[E]===void 0&&(T[E]=g[E]);return{$$typeof:e,type:f,key:C,ref:U,props:T,_owner:o.current}}return Va.Fragment=t,Va.jsx=h,Va.jsxs=h,Va}var rg;function xw(){return rg||(rg=1,od.exports=kw()),od.exports}var b=xw(),Se=Qd();const Nw=By(Se);var ku={},ld={exports:{}},Zt={},ud={exports:{}},cd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ig;function Dw(){return ig||(ig=1,(function(r){function e(Z,he){var re=Z.length;Z.push(he);e:for(;0<re;){var O=re-1>>>1,W=Z[O];if(0<o(W,he))Z[O]=he,Z[re]=W,re=O;else break e}}function t(Z){return Z.length===0?null:Z[0]}function s(Z){if(Z.length===0)return null;var he=Z[0],re=Z.pop();if(re!==he){Z[0]=re;e:for(var O=0,W=Z.length,le=W>>>1;O<le;){var Ie=2*(O+1)-1,Re=Z[Ie],Ne=Ie+1,Le=Z[Ne];if(0>o(Re,re))Ne<W&&0>o(Le,Re)?(Z[O]=Le,Z[Ne]=re,O=Ne):(Z[O]=Re,Z[Ie]=re,O=Ie);else if(Ne<W&&0>o(Le,re))Z[O]=Le,Z[Ne]=re,O=Ne;else break e}}return he}function o(Z,he){var re=Z.sortIndex-he.sortIndex;return re!==0?re:Z.id-he.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,f=h.now();r.unstable_now=function(){return h.now()-f}}var g=[],_=[],E=1,T=null,C=3,U=!1,$=!1,G=!1,q=typeof setTimeout=="function"?setTimeout:null,me=typeof clearTimeout=="function"?clearTimeout:null,ce=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function pe(Z){for(var he=t(_);he!==null;){if(he.callback===null)s(_);else if(he.startTime<=Z)s(_),he.sortIndex=he.expirationTime,e(g,he);else break;he=t(_)}}function Ee(Z){if(G=!1,pe(Z),!$)if(t(g)!==null)$=!0,Rt(Be);else{var he=t(_);he!==null&&Fe(Ee,he.startTime-Z)}}function Be(Z,he){$=!1,G&&(G=!1,me(A),A=-1),U=!0;var re=C;try{for(pe(he),T=t(g);T!==null&&(!(T.expirationTime>he)||Z&&!x());){var O=T.callback;if(typeof O=="function"){T.callback=null,C=T.priorityLevel;var W=O(T.expirationTime<=he);he=r.unstable_now(),typeof W=="function"?T.callback=W:T===t(g)&&s(g),pe(he)}else s(g);T=t(g)}if(T!==null)var le=!0;else{var Ie=t(_);Ie!==null&&Fe(Ee,Ie.startTime-he),le=!1}return le}finally{T=null,C=re,U=!1}}var Te=!1,D=null,A=-1,I=5,P=-1;function x(){return!(r.unstable_now()-P<I)}function V(){if(D!==null){var Z=r.unstable_now();P=Z;var he=!0;try{he=D(!0,Z)}finally{he?R():(Te=!1,D=null)}}else Te=!1}var R;if(typeof ce=="function")R=function(){ce(V)};else if(typeof MessageChannel<"u"){var $e=new MessageChannel,_t=$e.port2;$e.port1.onmessage=V,R=function(){_t.postMessage(null)}}else R=function(){q(V,0)};function Rt(Z){D=Z,Te||(Te=!0,R())}function Fe(Z,he){A=q(function(){Z(r.unstable_now())},he)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(Z){Z.callback=null},r.unstable_continueExecution=function(){$||U||($=!0,Rt(Be))},r.unstable_forceFrameRate=function(Z){0>Z||125<Z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<Z?Math.floor(1e3/Z):5},r.unstable_getCurrentPriorityLevel=function(){return C},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(Z){switch(C){case 1:case 2:case 3:var he=3;break;default:he=C}var re=C;C=he;try{return Z()}finally{C=re}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(Z,he){switch(Z){case 1:case 2:case 3:case 4:case 5:break;default:Z=3}var re=C;C=Z;try{return he()}finally{C=re}},r.unstable_scheduleCallback=function(Z,he,re){var O=r.unstable_now();switch(typeof re=="object"&&re!==null?(re=re.delay,re=typeof re=="number"&&0<re?O+re:O):re=O,Z){case 1:var W=-1;break;case 2:W=250;break;case 5:W=1073741823;break;case 4:W=1e4;break;default:W=5e3}return W=re+W,Z={id:E++,callback:he,priorityLevel:Z,startTime:re,expirationTime:W,sortIndex:-1},re>O?(Z.sortIndex=re,e(_,Z),t(g)===null&&Z===t(_)&&(G?(me(A),A=-1):G=!0,Fe(Ee,re-O))):(Z.sortIndex=W,e(g,Z),$||U||($=!0,Rt(Be))),Z},r.unstable_shouldYield=x,r.unstable_wrapCallback=function(Z){var he=C;return function(){var re=C;C=he;try{return Z.apply(this,arguments)}finally{C=re}}}})(cd)),cd}var sg;function Vw(){return sg||(sg=1,ud.exports=Dw()),ud.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var og;function bw(){if(og)return Zt;og=1;var r=Qd(),e=Vw();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){h(n,i),h(n+"Capture",i)}function h(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,E={},T={};function C(n){return g.call(T,n)?!0:g.call(E,n)?!1:_.test(n)?T[n]=!0:(E[n]=!0,!1)}function U(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function $(n,i,a,c){if(i===null||typeof i>"u"||U(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function G(n,i,a,c,d,m,v){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=m,this.removeEmptyString=v}var q={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){q[n]=new G(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];q[i]=new G(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){q[n]=new G(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){q[n]=new G(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){q[n]=new G(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){q[n]=new G(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){q[n]=new G(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){q[n]=new G(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){q[n]=new G(n,5,!1,n.toLowerCase(),null,!1,!1)});var me=/[\-:]([a-z])/g;function ce(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(me,ce);q[i]=new G(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(me,ce);q[i]=new G(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(me,ce);q[i]=new G(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){q[n]=new G(n,1,!1,n.toLowerCase(),null,!1,!1)}),q.xlinkHref=new G("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){q[n]=new G(n,1,!1,n.toLowerCase(),null,!0,!0)});function pe(n,i,a,c){var d=q.hasOwnProperty(i)?q[i]:null;(d!==null?d.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&($(i,a,d,c)&&(a=null),c||d===null?C(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(i=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(i):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var Ee=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Be=Symbol.for("react.element"),Te=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),A=Symbol.for("react.strict_mode"),I=Symbol.for("react.profiler"),P=Symbol.for("react.provider"),x=Symbol.for("react.context"),V=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),$e=Symbol.for("react.suspense_list"),_t=Symbol.for("react.memo"),Rt=Symbol.for("react.lazy"),Fe=Symbol.for("react.offscreen"),Z=Symbol.iterator;function he(n){return n===null||typeof n!="object"?null:(n=Z&&n[Z]||n["@@iterator"],typeof n=="function"?n:null)}var re=Object.assign,O;function W(n){if(O===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);O=i&&i[1]||""}return`
`+O+n}var le=!1;function Ie(n,i){if(!n||le)return"";le=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(j){var c=j}Reflect.construct(n,[],i)}else{try{i.call()}catch(j){c=j}n.call(i.prototype)}else{try{throw Error()}catch(j){c=j}n()}}catch(j){if(j&&c&&typeof j.stack=="string"){for(var d=j.stack.split(`
`),m=c.stack.split(`
`),v=d.length-1,S=m.length-1;1<=v&&0<=S&&d[v]!==m[S];)S--;for(;1<=v&&0<=S;v--,S--)if(d[v]!==m[S]){if(v!==1||S!==1)do if(v--,S--,0>S||d[v]!==m[S]){var k=`
`+d[v].replace(" at new "," at ");return n.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",n.displayName)),k}while(1<=v&&0<=S);break}}}finally{le=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?W(n):""}function Re(n){switch(n.tag){case 5:return W(n.type);case 16:return W("Lazy");case 13:return W("Suspense");case 19:return W("SuspenseList");case 0:case 2:case 15:return n=Ie(n.type,!1),n;case 11:return n=Ie(n.type.render,!1),n;case 1:return n=Ie(n.type,!0),n;default:return""}}function Ne(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case D:return"Fragment";case Te:return"Portal";case I:return"Profiler";case A:return"StrictMode";case R:return"Suspense";case $e:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case x:return(n.displayName||"Context")+".Consumer";case P:return(n._context.displayName||"Context")+".Provider";case V:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case _t:return i=n.displayName||null,i!==null?i:Ne(n.type)||"Memo";case Rt:i=n._payload,n=n._init;try{return Ne(n(i))}catch{}}return null}function Le(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ne(i);case 8:return i===A?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Me(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function qe(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function vt(n){var i=qe(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,m=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,m.call(this,v)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function ur(n){n._valueTracker||(n._valueTracker=vt(n))}function ys(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=qe(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function Or(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function xi(n,i){var a=i.checked;return re({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function _s(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=Me(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function Uo(n,i){i=i.checked,i!=null&&pe(n,"checked",i,!1)}function jo(n,i){Uo(n,i);var a=Me(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?vs(n,i.type,a):i.hasOwnProperty("defaultValue")&&vs(n,i.type,Me(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function pl(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function vs(n,i,a){(i!=="number"||Or(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var cr=Array.isArray;function hr(n,i,a,c){if(n=n.options,i){i={};for(var d=0;d<a.length;d++)i["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=i.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+Me(a),i=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function zo(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return re({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function ws(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(cr(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:Me(a)}}function Es(n,i){var a=Me(i.value),c=Me(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Bo(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function dt(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ft(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?dt(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var dr,$o=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(dr=dr||document.createElement("div"),dr.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=dr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function Lr(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var Ni={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Di=["Webkit","ms","Moz","O"];Object.keys(Ni).forEach(function(n){Di.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),Ni[i]=Ni[n]})});function qo(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||Ni.hasOwnProperty(n)&&Ni[n]?(""+i).trim():i+"px"}function Ho(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=qo(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Wo=re({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Go(n,i){if(i){if(Wo[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function Ko(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Vi=null;function Ts(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Is=null,hn=null,qn=null;function Ss(n){if(n=_a(n)){if(typeof Is!="function")throw Error(t(280));var i=n.stateNode;i&&(i=ql(i),Is(n.stateNode,n.type,i))}}function Hn(n){hn?qn?qn.push(n):qn=[n]:hn=n}function Qo(){if(hn){var n=hn,i=qn;if(qn=hn=null,Ss(n),i)for(n=0;n<i.length;n++)Ss(i[n])}}function bi(n,i){return n(i)}function Yo(){}var fr=!1;function Xo(n,i,a){if(fr)return n(i,a);fr=!0;try{return bi(n,i,a)}finally{fr=!1,(hn!==null||qn!==null)&&(Yo(),Qo())}}function it(n,i){var a=n.stateNode;if(a===null)return null;var c=ql(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var As=!1;if(f)try{var Tn={};Object.defineProperty(Tn,"passive",{get:function(){As=!0}}),window.addEventListener("test",Tn,Tn),window.removeEventListener("test",Tn,Tn)}catch{As=!1}function Oi(n,i,a,c,d,m,v,S,k){var j=Array.prototype.slice.call(arguments,3);try{i.apply(a,j)}catch(Q){this.onError(Q)}}var Li=!1,Rs=null,In=!1,Jo=null,bc={onError:function(n){Li=!0,Rs=n}};function Cs(n,i,a,c,d,m,v,S,k){Li=!1,Rs=null,Oi.apply(bc,arguments)}function ml(n,i,a,c,d,m,v,S,k){if(Cs.apply(this,arguments),Li){if(Li){var j=Rs;Li=!1,Rs=null}else throw Error(t(198));In||(In=!0,Jo=j)}}function Sn(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Mi(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function An(n){if(Sn(n)!==n)throw Error(t(188))}function gl(n){var i=n.alternate;if(!i){if(i=Sn(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var d=a.return;if(d===null)break;var m=d.alternate;if(m===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===m.child){for(m=d.child;m;){if(m===a)return An(d),n;if(m===c)return An(d),i;m=m.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=m;else{for(var v=!1,S=d.child;S;){if(S===a){v=!0,a=d,c=m;break}if(S===c){v=!0,c=d,a=m;break}S=S.sibling}if(!v){for(S=m.child;S;){if(S===a){v=!0,a=m,c=d;break}if(S===c){v=!0,c=m,a=d;break}S=S.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function Zo(n){return n=gl(n),n!==null?Ps(n):null}function Ps(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Ps(n);if(i!==null)return i;n=n.sibling}return null}var ks=e.unstable_scheduleCallback,ea=e.unstable_cancelCallback,yl=e.unstable_shouldYield,Oc=e.unstable_requestPaint,He=e.unstable_now,_l=e.unstable_getCurrentPriorityLevel,Fi=e.unstable_ImmediatePriority,Mr=e.unstable_UserBlockingPriority,dn=e.unstable_NormalPriority,ta=e.unstable_LowPriority,vl=e.unstable_IdlePriority,Ui=null,nn=null;function wl(n){if(nn&&typeof nn.onCommitFiberRoot=="function")try{nn.onCommitFiberRoot(Ui,n,void 0,(n.current.flags&128)===128)}catch{}}var Bt=Math.clz32?Math.clz32:Tl,na=Math.log,El=Math.LN2;function Tl(n){return n>>>=0,n===0?32:31-(na(n)/El|0)|0}var xs=64,Ns=4194304;function Fr(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function ji(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,m=n.pingedLanes,v=a&268435455;if(v!==0){var S=v&~d;S!==0?c=Fr(S):(m&=v,m!==0&&(c=Fr(m)))}else v=a&~d,v!==0?c=Fr(v):m!==0&&(c=Fr(m));if(c===0)return 0;if(i!==0&&i!==c&&(i&d)===0&&(d=c&-c,m=i&-i,d>=m||d===16&&(m&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Bt(i),d=1<<a,c|=n[a],i&=~d;return c}function Lc(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function pr(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,m=n.pendingLanes;0<m;){var v=31-Bt(m),S=1<<v,k=d[v];k===-1?((S&a)===0||(S&c)!==0)&&(d[v]=Lc(S,i)):k<=i&&(n.expiredLanes|=S),m&=~S}}function rn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function zi(){var n=xs;return xs<<=1,(xs&4194240)===0&&(xs=64),n}function Ur(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function jr(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Bt(i),n[i]=a}function ze(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Bt(a),m=1<<d;i[d]=0,c[d]=-1,n[d]=-1,a&=~m}}function zr(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Bt(a),d=1<<c;d&i|n[c]&i&&(n[c]|=i),a&=~d}}var xe=0;function Br(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Il,Ds,Sl,Al,Rl,ra=!1,Wn=[],Ct=null,Rn=null,Cn=null,$r=new Map,fn=new Map,Gn=[],Mc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Cl(n,i){switch(n){case"focusin":case"focusout":Ct=null;break;case"dragenter":case"dragleave":Rn=null;break;case"mouseover":case"mouseout":Cn=null;break;case"pointerover":case"pointerout":$r.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":fn.delete(i.pointerId)}}function Wt(n,i,a,c,d,m){return n===null||n.nativeEvent!==m?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:m,targetContainers:[d]},i!==null&&(i=_a(i),i!==null&&Ds(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function Fc(n,i,a,c,d){switch(i){case"focusin":return Ct=Wt(Ct,n,i,a,c,d),!0;case"dragenter":return Rn=Wt(Rn,n,i,a,c,d),!0;case"mouseover":return Cn=Wt(Cn,n,i,a,c,d),!0;case"pointerover":var m=d.pointerId;return $r.set(m,Wt($r.get(m)||null,n,i,a,c,d)),!0;case"gotpointercapture":return m=d.pointerId,fn.set(m,Wt(fn.get(m)||null,n,i,a,c,d)),!0}return!1}function Pl(n){var i=Wi(n.target);if(i!==null){var a=Sn(i);if(a!==null){if(i=a.tag,i===13){if(i=Mi(a),i!==null){n.blockedOn=i,Rl(n.priority,function(){Sl(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function mr(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=Vs(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Vi=c,a.target.dispatchEvent(c),Vi=null}else return i=_a(a),i!==null&&Ds(i),n.blockedOn=a,!1;i.shift()}return!0}function Bi(n,i,a){mr(n)&&a.delete(i)}function kl(){ra=!1,Ct!==null&&mr(Ct)&&(Ct=null),Rn!==null&&mr(Rn)&&(Rn=null),Cn!==null&&mr(Cn)&&(Cn=null),$r.forEach(Bi),fn.forEach(Bi)}function Pn(n,i){n.blockedOn===i&&(n.blockedOn=null,ra||(ra=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,kl)))}function kn(n){function i(d){return Pn(d,n)}if(0<Wn.length){Pn(Wn[0],n);for(var a=1;a<Wn.length;a++){var c=Wn[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Ct!==null&&Pn(Ct,n),Rn!==null&&Pn(Rn,n),Cn!==null&&Pn(Cn,n),$r.forEach(i),fn.forEach(i),a=0;a<Gn.length;a++)c=Gn[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<Gn.length&&(a=Gn[0],a.blockedOn===null);)Pl(a),a.blockedOn===null&&Gn.shift()}var gr=Ee.ReactCurrentBatchConfig,qr=!0;function Xe(n,i,a,c){var d=xe,m=gr.transition;gr.transition=null;try{xe=1,ia(n,i,a,c)}finally{xe=d,gr.transition=m}}function Uc(n,i,a,c){var d=xe,m=gr.transition;gr.transition=null;try{xe=4,ia(n,i,a,c)}finally{xe=d,gr.transition=m}}function ia(n,i,a,c){if(qr){var d=Vs(n,i,a,c);if(d===null)Yc(n,i,c,$i,a),Cl(n,c);else if(Fc(d,n,i,a,c))c.stopPropagation();else if(Cl(n,c),i&4&&-1<Mc.indexOf(n)){for(;d!==null;){var m=_a(d);if(m!==null&&Il(m),m=Vs(n,i,a,c),m===null&&Yc(n,i,c,$i,a),m===d)break;d=m}d!==null&&c.stopPropagation()}else Yc(n,i,c,null,a)}}var $i=null;function Vs(n,i,a,c){if($i=null,n=Ts(c),n=Wi(n),n!==null)if(i=Sn(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Mi(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return $i=n,null}function sa(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(_l()){case Fi:return 1;case Mr:return 4;case dn:case ta:return 16;case vl:return 536870912;default:return 16}default:return 16}}var sn=null,bs=null,Gt=null;function oa(){if(Gt)return Gt;var n,i=bs,a=i.length,c,d="value"in sn?sn.value:sn.textContent,m=d.length;for(n=0;n<a&&i[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&i[a-c]===d[m-c];c++);return Gt=d.slice(n,1<c?1-c:void 0)}function Os(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function Kn(){return!0}function aa(){return!1}function Pt(n){function i(a,c,d,m,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=m,this.target=v,this.currentTarget=null;for(var S in n)n.hasOwnProperty(S)&&(a=n[S],this[S]=a?a(m):m[S]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?Kn:aa,this.isPropagationStopped=aa,this}return re(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Kn)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Kn)},persist:function(){},isPersistent:Kn}),i}var xn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ls=Pt(xn),Qn=re({},xn,{view:0,detail:0}),jc=Pt(Qn),Ms,yr,Hr,qi=re({},Qn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Yn,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Hr&&(Hr&&n.type==="mousemove"?(Ms=n.screenX-Hr.screenX,yr=n.screenY-Hr.screenY):yr=Ms=0,Hr=n),Ms)},movementY:function(n){return"movementY"in n?n.movementY:yr}}),Fs=Pt(qi),la=re({},qi,{dataTransfer:0}),xl=Pt(la),Us=re({},Qn,{relatedTarget:0}),js=Pt(Us),Nl=re({},xn,{animationName:0,elapsedTime:0,pseudoElement:0}),_r=Pt(Nl),Dl=re({},xn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Vl=Pt(Dl),bl=re({},xn,{data:0}),ua=Pt(bl),zs={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$t={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ol={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ll(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Ol[n])?!!i[n]:!1}function Yn(){return Ll}var u=re({},Qn,{key:function(n){if(n.key){var i=zs[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Os(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?$t[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Yn,charCode:function(n){return n.type==="keypress"?Os(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Os(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),p=Pt(u),y=re({},qi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),w=Pt(y),L=re({},Qn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Yn}),z=Pt(L),J=re({},xn,{propertyName:0,elapsedTime:0,pseudoElement:0}),je=Pt(J),pt=re({},qi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),De=Pt(pt),wt=[9,13,27,32],at=f&&"CompositionEvent"in window,pn=null;f&&"documentMode"in document&&(pn=document.documentMode);var on=f&&"TextEvent"in window&&!pn,Hi=f&&(!at||pn&&8<pn&&11>=pn),Bs=" ",Kf=!1;function Qf(n,i){switch(n){case"keyup":return wt.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Yf(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var $s=!1;function A0(n,i){switch(n){case"compositionend":return Yf(i);case"keypress":return i.which!==32?null:(Kf=!0,Bs);case"textInput":return n=i.data,n===Bs&&Kf?null:n;default:return null}}function R0(n,i){if($s)return n==="compositionend"||!at&&Qf(n,i)?(n=oa(),Gt=bs=sn=null,$s=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Hi&&i.locale!=="ko"?null:i.data;default:return null}}var C0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Xf(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!C0[n.type]:i==="textarea"}function Jf(n,i,a,c){Hn(c),i=zl(i,"onChange"),0<i.length&&(a=new Ls("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var ca=null,ha=null;function P0(n){gp(n,0)}function Ml(n){var i=Ks(n);if(ys(i))return n}function k0(n,i){if(n==="change")return i}var Zf=!1;if(f){var zc;if(f){var Bc="oninput"in document;if(!Bc){var ep=document.createElement("div");ep.setAttribute("oninput","return;"),Bc=typeof ep.oninput=="function"}zc=Bc}else zc=!1;Zf=zc&&(!document.documentMode||9<document.documentMode)}function tp(){ca&&(ca.detachEvent("onpropertychange",np),ha=ca=null)}function np(n){if(n.propertyName==="value"&&Ml(ha)){var i=[];Jf(i,ha,n,Ts(n)),Xo(P0,i)}}function x0(n,i,a){n==="focusin"?(tp(),ca=i,ha=a,ca.attachEvent("onpropertychange",np)):n==="focusout"&&tp()}function N0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Ml(ha)}function D0(n,i){if(n==="click")return Ml(i)}function V0(n,i){if(n==="input"||n==="change")return Ml(i)}function b0(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Nn=typeof Object.is=="function"?Object.is:b0;function da(n,i){if(Nn(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(i,d)||!Nn(n[d],i[d]))return!1}return!0}function rp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function ip(n,i){var a=rp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=rp(a)}}function sp(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?sp(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function op(){for(var n=window,i=Or();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=Or(n.document)}return i}function $c(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function O0(n){var i=op(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&sp(a.ownerDocument.documentElement,a)){if(c!==null&&$c(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,m=Math.min(c.start,d);c=c.end===void 0?m:Math.min(c.end,d),!n.extend&&m>c&&(d=c,c=m,m=d),d=ip(a,m);var v=ip(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),m>c?(n.addRange(i),n.extend(v.node,v.offset)):(i.setEnd(v.node,v.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var L0=f&&"documentMode"in document&&11>=document.documentMode,qs=null,qc=null,fa=null,Hc=!1;function ap(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Hc||qs==null||qs!==Or(c)||(c=qs,"selectionStart"in c&&$c(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),fa&&da(fa,c)||(fa=c,c=zl(qc,"onSelect"),0<c.length&&(i=new Ls("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=qs)))}function Fl(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var Hs={animationend:Fl("Animation","AnimationEnd"),animationiteration:Fl("Animation","AnimationIteration"),animationstart:Fl("Animation","AnimationStart"),transitionend:Fl("Transition","TransitionEnd")},Wc={},lp={};f&&(lp=document.createElement("div").style,"AnimationEvent"in window||(delete Hs.animationend.animation,delete Hs.animationiteration.animation,delete Hs.animationstart.animation),"TransitionEvent"in window||delete Hs.transitionend.transition);function Ul(n){if(Wc[n])return Wc[n];if(!Hs[n])return n;var i=Hs[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in lp)return Wc[n]=i[a];return n}var up=Ul("animationend"),cp=Ul("animationiteration"),hp=Ul("animationstart"),dp=Ul("transitionend"),fp=new Map,pp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Wr(n,i){fp.set(n,i),l(i,[n])}for(var Gc=0;Gc<pp.length;Gc++){var Kc=pp[Gc],M0=Kc.toLowerCase(),F0=Kc[0].toUpperCase()+Kc.slice(1);Wr(M0,"on"+F0)}Wr(up,"onAnimationEnd"),Wr(cp,"onAnimationIteration"),Wr(hp,"onAnimationStart"),Wr("dblclick","onDoubleClick"),Wr("focusin","onFocus"),Wr("focusout","onBlur"),Wr(dp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var pa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),U0=new Set("cancel close invalid load scroll toggle".split(" ").concat(pa));function mp(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,ml(c,i,void 0,n),n.currentTarget=null}function gp(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var m=void 0;if(i)for(var v=c.length-1;0<=v;v--){var S=c[v],k=S.instance,j=S.currentTarget;if(S=S.listener,k!==m&&d.isPropagationStopped())break e;mp(d,S,j),m=k}else for(v=0;v<c.length;v++){if(S=c[v],k=S.instance,j=S.currentTarget,S=S.listener,k!==m&&d.isPropagationStopped())break e;mp(d,S,j),m=k}}}if(In)throw n=Jo,In=!1,Jo=null,n}function Ke(n,i){var a=i[nh];a===void 0&&(a=i[nh]=new Set);var c=n+"__bubble";a.has(c)||(yp(i,n,2,!1),a.add(c))}function Qc(n,i,a){var c=0;i&&(c|=4),yp(a,n,c,i)}var jl="_reactListening"+Math.random().toString(36).slice(2);function ma(n){if(!n[jl]){n[jl]=!0,s.forEach(function(a){a!=="selectionchange"&&(U0.has(a)||Qc(a,!1,n),Qc(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[jl]||(i[jl]=!0,Qc("selectionchange",!1,i))}}function yp(n,i,a,c){switch(sa(i)){case 1:var d=Xe;break;case 4:d=Uc;break;default:d=ia}a=d.bind(null,i,a,n),d=void 0,!As||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(i,a,{capture:!0,passive:d}):n.addEventListener(i,a,!0):d!==void 0?n.addEventListener(i,a,{passive:d}):n.addEventListener(i,a,!1)}function Yc(n,i,a,c,d){var m=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var S=c.stateNode.containerInfo;if(S===d||S.nodeType===8&&S.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var k=v.tag;if((k===3||k===4)&&(k=v.stateNode.containerInfo,k===d||k.nodeType===8&&k.parentNode===d))return;v=v.return}for(;S!==null;){if(v=Wi(S),v===null)return;if(k=v.tag,k===5||k===6){c=m=v;continue e}S=S.parentNode}}c=c.return}Xo(function(){var j=m,Q=Ts(a),Y=[];e:{var K=fp.get(n);if(K!==void 0){var te=Ls,se=n;switch(n){case"keypress":if(Os(a)===0)break e;case"keydown":case"keyup":te=p;break;case"focusin":se="focus",te=js;break;case"focusout":se="blur",te=js;break;case"beforeblur":case"afterblur":te=js;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":te=Fs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":te=xl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":te=z;break;case up:case cp:case hp:te=_r;break;case dp:te=je;break;case"scroll":te=jc;break;case"wheel":te=De;break;case"copy":case"cut":case"paste":te=Vl;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":te=w}var oe=(i&4)!==0,st=!oe&&n==="scroll",M=oe?K!==null?K+"Capture":null:K;oe=[];for(var N=j,F;N!==null;){F=N;var X=F.stateNode;if(F.tag===5&&X!==null&&(F=X,M!==null&&(X=it(N,M),X!=null&&oe.push(ga(N,X,F)))),st)break;N=N.return}0<oe.length&&(K=new te(K,se,null,a,Q),Y.push({event:K,listeners:oe}))}}if((i&7)===0){e:{if(K=n==="mouseover"||n==="pointerover",te=n==="mouseout"||n==="pointerout",K&&a!==Vi&&(se=a.relatedTarget||a.fromElement)&&(Wi(se)||se[vr]))break e;if((te||K)&&(K=Q.window===Q?Q:(K=Q.ownerDocument)?K.defaultView||K.parentWindow:window,te?(se=a.relatedTarget||a.toElement,te=j,se=se?Wi(se):null,se!==null&&(st=Sn(se),se!==st||se.tag!==5&&se.tag!==6)&&(se=null)):(te=null,se=j),te!==se)){if(oe=Fs,X="onMouseLeave",M="onMouseEnter",N="mouse",(n==="pointerout"||n==="pointerover")&&(oe=w,X="onPointerLeave",M="onPointerEnter",N="pointer"),st=te==null?K:Ks(te),F=se==null?K:Ks(se),K=new oe(X,N+"leave",te,a,Q),K.target=st,K.relatedTarget=F,X=null,Wi(Q)===j&&(oe=new oe(M,N+"enter",se,a,Q),oe.target=F,oe.relatedTarget=st,X=oe),st=X,te&&se)t:{for(oe=te,M=se,N=0,F=oe;F;F=Ws(F))N++;for(F=0,X=M;X;X=Ws(X))F++;for(;0<N-F;)oe=Ws(oe),N--;for(;0<F-N;)M=Ws(M),F--;for(;N--;){if(oe===M||M!==null&&oe===M.alternate)break t;oe=Ws(oe),M=Ws(M)}oe=null}else oe=null;te!==null&&_p(Y,K,te,oe,!1),se!==null&&st!==null&&_p(Y,st,se,oe,!0)}}e:{if(K=j?Ks(j):window,te=K.nodeName&&K.nodeName.toLowerCase(),te==="select"||te==="input"&&K.type==="file")var ae=k0;else if(Xf(K))if(Zf)ae=V0;else{ae=N0;var de=x0}else(te=K.nodeName)&&te.toLowerCase()==="input"&&(K.type==="checkbox"||K.type==="radio")&&(ae=D0);if(ae&&(ae=ae(n,j))){Jf(Y,ae,a,Q);break e}de&&de(n,K,j),n==="focusout"&&(de=K._wrapperState)&&de.controlled&&K.type==="number"&&vs(K,"number",K.value)}switch(de=j?Ks(j):window,n){case"focusin":(Xf(de)||de.contentEditable==="true")&&(qs=de,qc=j,fa=null);break;case"focusout":fa=qc=qs=null;break;case"mousedown":Hc=!0;break;case"contextmenu":case"mouseup":case"dragend":Hc=!1,ap(Y,a,Q);break;case"selectionchange":if(L0)break;case"keydown":case"keyup":ap(Y,a,Q)}var fe;if(at)e:{switch(n){case"compositionstart":var _e="onCompositionStart";break e;case"compositionend":_e="onCompositionEnd";break e;case"compositionupdate":_e="onCompositionUpdate";break e}_e=void 0}else $s?Qf(n,a)&&(_e="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(_e="onCompositionStart");_e&&(Hi&&a.locale!=="ko"&&($s||_e!=="onCompositionStart"?_e==="onCompositionEnd"&&$s&&(fe=oa()):(sn=Q,bs="value"in sn?sn.value:sn.textContent,$s=!0)),de=zl(j,_e),0<de.length&&(_e=new ua(_e,n,null,a,Q),Y.push({event:_e,listeners:de}),fe?_e.data=fe:(fe=Yf(a),fe!==null&&(_e.data=fe)))),(fe=on?A0(n,a):R0(n,a))&&(j=zl(j,"onBeforeInput"),0<j.length&&(Q=new ua("onBeforeInput","beforeinput",null,a,Q),Y.push({event:Q,listeners:j}),Q.data=fe))}gp(Y,i)})}function ga(n,i,a){return{instance:n,listener:i,currentTarget:a}}function zl(n,i){for(var a=i+"Capture",c=[];n!==null;){var d=n,m=d.stateNode;d.tag===5&&m!==null&&(d=m,m=it(n,a),m!=null&&c.unshift(ga(n,m,d)),m=it(n,i),m!=null&&c.push(ga(n,m,d))),n=n.return}return c}function Ws(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function _p(n,i,a,c,d){for(var m=i._reactName,v=[];a!==null&&a!==c;){var S=a,k=S.alternate,j=S.stateNode;if(k!==null&&k===c)break;S.tag===5&&j!==null&&(S=j,d?(k=it(a,m),k!=null&&v.unshift(ga(a,k,S))):d||(k=it(a,m),k!=null&&v.push(ga(a,k,S)))),a=a.return}v.length!==0&&n.push({event:i,listeners:v})}var j0=/\r\n?/g,z0=/\u0000|\uFFFD/g;function vp(n){return(typeof n=="string"?n:""+n).replace(j0,`
`).replace(z0,"")}function Bl(n,i,a){if(i=vp(i),vp(n)!==i&&a)throw Error(t(425))}function $l(){}var Xc=null,Jc=null;function Zc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var eh=typeof setTimeout=="function"?setTimeout:void 0,B0=typeof clearTimeout=="function"?clearTimeout:void 0,wp=typeof Promise=="function"?Promise:void 0,$0=typeof queueMicrotask=="function"?queueMicrotask:typeof wp<"u"?function(n){return wp.resolve(null).then(n).catch(q0)}:eh;function q0(n){setTimeout(function(){throw n})}function th(n,i){var a=i,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),kn(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);kn(i)}function Gr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Ep(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var Gs=Math.random().toString(36).slice(2),Xn="__reactFiber$"+Gs,ya="__reactProps$"+Gs,vr="__reactContainer$"+Gs,nh="__reactEvents$"+Gs,H0="__reactListeners$"+Gs,W0="__reactHandles$"+Gs;function Wi(n){var i=n[Xn];if(i)return i;for(var a=n.parentNode;a;){if(i=a[vr]||a[Xn]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=Ep(n);n!==null;){if(a=n[Xn])return a;n=Ep(n)}return i}n=a,a=n.parentNode}return null}function _a(n){return n=n[Xn]||n[vr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ks(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function ql(n){return n[ya]||null}var rh=[],Qs=-1;function Kr(n){return{current:n}}function Qe(n){0>Qs||(n.current=rh[Qs],rh[Qs]=null,Qs--)}function We(n,i){Qs++,rh[Qs]=n.current,n.current=i}var Qr={},bt=Kr(Qr),Kt=Kr(!1),Gi=Qr;function Ys(n,i){var a=n.type.contextTypes;if(!a)return Qr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var d={},m;for(m in a)d[m]=i[m];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function Qt(n){return n=n.childContextTypes,n!=null}function Hl(){Qe(Kt),Qe(bt)}function Tp(n,i,a){if(bt.current!==Qr)throw Error(t(168));We(bt,i),We(Kt,a)}function Ip(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in i))throw Error(t(108,Le(n)||"Unknown",d));return re({},a,c)}function Wl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Qr,Gi=bt.current,We(bt,n),We(Kt,Kt.current),!0}function Sp(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Ip(n,i,Gi),c.__reactInternalMemoizedMergedChildContext=n,Qe(Kt),Qe(bt),We(bt,n)):Qe(Kt),We(Kt,a)}var wr=null,Gl=!1,ih=!1;function Ap(n){wr===null?wr=[n]:wr.push(n)}function G0(n){Gl=!0,Ap(n)}function Yr(){if(!ih&&wr!==null){ih=!0;var n=0,i=xe;try{var a=wr;for(xe=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}wr=null,Gl=!1}catch(d){throw wr!==null&&(wr=wr.slice(n+1)),ks(Fi,Yr),d}finally{xe=i,ih=!1}}return null}var Xs=[],Js=0,Kl=null,Ql=0,mn=[],gn=0,Ki=null,Er=1,Tr="";function Qi(n,i){Xs[Js++]=Ql,Xs[Js++]=Kl,Kl=n,Ql=i}function Rp(n,i,a){mn[gn++]=Er,mn[gn++]=Tr,mn[gn++]=Ki,Ki=n;var c=Er;n=Tr;var d=32-Bt(c)-1;c&=~(1<<d),a+=1;var m=32-Bt(i)+d;if(30<m){var v=d-d%5;m=(c&(1<<v)-1).toString(32),c>>=v,d-=v,Er=1<<32-Bt(i)+d|a<<d|c,Tr=m+n}else Er=1<<m|a<<d|c,Tr=n}function sh(n){n.return!==null&&(Qi(n,1),Rp(n,1,0))}function oh(n){for(;n===Kl;)Kl=Xs[--Js],Xs[Js]=null,Ql=Xs[--Js],Xs[Js]=null;for(;n===Ki;)Ki=mn[--gn],mn[gn]=null,Tr=mn[--gn],mn[gn]=null,Er=mn[--gn],mn[gn]=null}var an=null,ln=null,Je=!1,Dn=null;function Cp(n,i){var a=wn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Pp(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,an=n,ln=Gr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,an=n,ln=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=Ki!==null?{id:Er,overflow:Tr}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=wn(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,an=n,ln=null,!0):!1;default:return!1}}function ah(n){return(n.mode&1)!==0&&(n.flags&128)===0}function lh(n){if(Je){var i=ln;if(i){var a=i;if(!Pp(n,i)){if(ah(n))throw Error(t(418));i=Gr(a.nextSibling);var c=an;i&&Pp(n,i)?Cp(c,a):(n.flags=n.flags&-4097|2,Je=!1,an=n)}}else{if(ah(n))throw Error(t(418));n.flags=n.flags&-4097|2,Je=!1,an=n}}}function kp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;an=n}function Yl(n){if(n!==an)return!1;if(!Je)return kp(n),Je=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Zc(n.type,n.memoizedProps)),i&&(i=ln)){if(ah(n))throw xp(),Error(t(418));for(;i;)Cp(n,i),i=Gr(i.nextSibling)}if(kp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){ln=Gr(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}ln=null}}else ln=an?Gr(n.stateNode.nextSibling):null;return!0}function xp(){for(var n=ln;n;)n=Gr(n.nextSibling)}function Zs(){ln=an=null,Je=!1}function uh(n){Dn===null?Dn=[n]:Dn.push(n)}var K0=Ee.ReactCurrentBatchConfig;function va(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,m=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===m?i.ref:(i=function(v){var S=d.refs;v===null?delete S[m]:S[m]=v},i._stringRef=m,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Xl(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Np(n){var i=n._init;return i(n._payload)}function Dp(n){function i(M,N){if(n){var F=M.deletions;F===null?(M.deletions=[N],M.flags|=16):F.push(N)}}function a(M,N){if(!n)return null;for(;N!==null;)i(M,N),N=N.sibling;return null}function c(M,N){for(M=new Map;N!==null;)N.key!==null?M.set(N.key,N):M.set(N.index,N),N=N.sibling;return M}function d(M,N){return M=ii(M,N),M.index=0,M.sibling=null,M}function m(M,N,F){return M.index=F,n?(F=M.alternate,F!==null?(F=F.index,F<N?(M.flags|=2,N):F):(M.flags|=2,N)):(M.flags|=1048576,N)}function v(M){return n&&M.alternate===null&&(M.flags|=2),M}function S(M,N,F,X){return N===null||N.tag!==6?(N=ed(F,M.mode,X),N.return=M,N):(N=d(N,F),N.return=M,N)}function k(M,N,F,X){var ae=F.type;return ae===D?Q(M,N,F.props.children,X,F.key):N!==null&&(N.elementType===ae||typeof ae=="object"&&ae!==null&&ae.$$typeof===Rt&&Np(ae)===N.type)?(X=d(N,F.props),X.ref=va(M,N,F),X.return=M,X):(X=Eu(F.type,F.key,F.props,null,M.mode,X),X.ref=va(M,N,F),X.return=M,X)}function j(M,N,F,X){return N===null||N.tag!==4||N.stateNode.containerInfo!==F.containerInfo||N.stateNode.implementation!==F.implementation?(N=td(F,M.mode,X),N.return=M,N):(N=d(N,F.children||[]),N.return=M,N)}function Q(M,N,F,X,ae){return N===null||N.tag!==7?(N=rs(F,M.mode,X,ae),N.return=M,N):(N=d(N,F),N.return=M,N)}function Y(M,N,F){if(typeof N=="string"&&N!==""||typeof N=="number")return N=ed(""+N,M.mode,F),N.return=M,N;if(typeof N=="object"&&N!==null){switch(N.$$typeof){case Be:return F=Eu(N.type,N.key,N.props,null,M.mode,F),F.ref=va(M,null,N),F.return=M,F;case Te:return N=td(N,M.mode,F),N.return=M,N;case Rt:var X=N._init;return Y(M,X(N._payload),F)}if(cr(N)||he(N))return N=rs(N,M.mode,F,null),N.return=M,N;Xl(M,N)}return null}function K(M,N,F,X){var ae=N!==null?N.key:null;if(typeof F=="string"&&F!==""||typeof F=="number")return ae!==null?null:S(M,N,""+F,X);if(typeof F=="object"&&F!==null){switch(F.$$typeof){case Be:return F.key===ae?k(M,N,F,X):null;case Te:return F.key===ae?j(M,N,F,X):null;case Rt:return ae=F._init,K(M,N,ae(F._payload),X)}if(cr(F)||he(F))return ae!==null?null:Q(M,N,F,X,null);Xl(M,F)}return null}function te(M,N,F,X,ae){if(typeof X=="string"&&X!==""||typeof X=="number")return M=M.get(F)||null,S(N,M,""+X,ae);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case Be:return M=M.get(X.key===null?F:X.key)||null,k(N,M,X,ae);case Te:return M=M.get(X.key===null?F:X.key)||null,j(N,M,X,ae);case Rt:var de=X._init;return te(M,N,F,de(X._payload),ae)}if(cr(X)||he(X))return M=M.get(F)||null,Q(N,M,X,ae,null);Xl(N,X)}return null}function se(M,N,F,X){for(var ae=null,de=null,fe=N,_e=N=0,It=null;fe!==null&&_e<F.length;_e++){fe.index>_e?(It=fe,fe=null):It=fe.sibling;var Oe=K(M,fe,F[_e],X);if(Oe===null){fe===null&&(fe=It);break}n&&fe&&Oe.alternate===null&&i(M,fe),N=m(Oe,N,_e),de===null?ae=Oe:de.sibling=Oe,de=Oe,fe=It}if(_e===F.length)return a(M,fe),Je&&Qi(M,_e),ae;if(fe===null){for(;_e<F.length;_e++)fe=Y(M,F[_e],X),fe!==null&&(N=m(fe,N,_e),de===null?ae=fe:de.sibling=fe,de=fe);return Je&&Qi(M,_e),ae}for(fe=c(M,fe);_e<F.length;_e++)It=te(fe,M,_e,F[_e],X),It!==null&&(n&&It.alternate!==null&&fe.delete(It.key===null?_e:It.key),N=m(It,N,_e),de===null?ae=It:de.sibling=It,de=It);return n&&fe.forEach(function(si){return i(M,si)}),Je&&Qi(M,_e),ae}function oe(M,N,F,X){var ae=he(F);if(typeof ae!="function")throw Error(t(150));if(F=ae.call(F),F==null)throw Error(t(151));for(var de=ae=null,fe=N,_e=N=0,It=null,Oe=F.next();fe!==null&&!Oe.done;_e++,Oe=F.next()){fe.index>_e?(It=fe,fe=null):It=fe.sibling;var si=K(M,fe,Oe.value,X);if(si===null){fe===null&&(fe=It);break}n&&fe&&si.alternate===null&&i(M,fe),N=m(si,N,_e),de===null?ae=si:de.sibling=si,de=si,fe=It}if(Oe.done)return a(M,fe),Je&&Qi(M,_e),ae;if(fe===null){for(;!Oe.done;_e++,Oe=F.next())Oe=Y(M,Oe.value,X),Oe!==null&&(N=m(Oe,N,_e),de===null?ae=Oe:de.sibling=Oe,de=Oe);return Je&&Qi(M,_e),ae}for(fe=c(M,fe);!Oe.done;_e++,Oe=F.next())Oe=te(fe,M,_e,Oe.value,X),Oe!==null&&(n&&Oe.alternate!==null&&fe.delete(Oe.key===null?_e:Oe.key),N=m(Oe,N,_e),de===null?ae=Oe:de.sibling=Oe,de=Oe);return n&&fe.forEach(function(Cw){return i(M,Cw)}),Je&&Qi(M,_e),ae}function st(M,N,F,X){if(typeof F=="object"&&F!==null&&F.type===D&&F.key===null&&(F=F.props.children),typeof F=="object"&&F!==null){switch(F.$$typeof){case Be:e:{for(var ae=F.key,de=N;de!==null;){if(de.key===ae){if(ae=F.type,ae===D){if(de.tag===7){a(M,de.sibling),N=d(de,F.props.children),N.return=M,M=N;break e}}else if(de.elementType===ae||typeof ae=="object"&&ae!==null&&ae.$$typeof===Rt&&Np(ae)===de.type){a(M,de.sibling),N=d(de,F.props),N.ref=va(M,de,F),N.return=M,M=N;break e}a(M,de);break}else i(M,de);de=de.sibling}F.type===D?(N=rs(F.props.children,M.mode,X,F.key),N.return=M,M=N):(X=Eu(F.type,F.key,F.props,null,M.mode,X),X.ref=va(M,N,F),X.return=M,M=X)}return v(M);case Te:e:{for(de=F.key;N!==null;){if(N.key===de)if(N.tag===4&&N.stateNode.containerInfo===F.containerInfo&&N.stateNode.implementation===F.implementation){a(M,N.sibling),N=d(N,F.children||[]),N.return=M,M=N;break e}else{a(M,N);break}else i(M,N);N=N.sibling}N=td(F,M.mode,X),N.return=M,M=N}return v(M);case Rt:return de=F._init,st(M,N,de(F._payload),X)}if(cr(F))return se(M,N,F,X);if(he(F))return oe(M,N,F,X);Xl(M,F)}return typeof F=="string"&&F!==""||typeof F=="number"?(F=""+F,N!==null&&N.tag===6?(a(M,N.sibling),N=d(N,F),N.return=M,M=N):(a(M,N),N=ed(F,M.mode,X),N.return=M,M=N),v(M)):a(M,N)}return st}var eo=Dp(!0),Vp=Dp(!1),Jl=Kr(null),Zl=null,to=null,ch=null;function hh(){ch=to=Zl=null}function dh(n){var i=Jl.current;Qe(Jl),n._currentValue=i}function fh(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function no(n,i){Zl=n,ch=to=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(Yt=!0),n.firstContext=null)}function yn(n){var i=n._currentValue;if(ch!==n)if(n={context:n,memoizedValue:i,next:null},to===null){if(Zl===null)throw Error(t(308));to=n,Zl.dependencies={lanes:0,firstContext:n}}else to=to.next=n;return i}var Yi=null;function ph(n){Yi===null?Yi=[n]:Yi.push(n)}function bp(n,i,a,c){var d=i.interleaved;return d===null?(a.next=a,ph(i)):(a.next=d.next,d.next=a),i.interleaved=a,Ir(n,c)}function Ir(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var Xr=!1;function mh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Op(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Sr(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function Jr(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(be&2)!==0){var d=c.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),c.pending=i,Ir(n,a)}return d=c.interleaved,d===null?(i.next=i,ph(c)):(i.next=d.next,d.next=i),c.interleaved=i,Ir(n,a)}function eu(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,zr(n,a)}}function Lp(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,m=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};m===null?d=m=v:m=m.next=v,a=a.next}while(a!==null);m===null?d=m=i:m=m.next=i}else d=m=i;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:m,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function tu(n,i,a,c){var d=n.updateQueue;Xr=!1;var m=d.firstBaseUpdate,v=d.lastBaseUpdate,S=d.shared.pending;if(S!==null){d.shared.pending=null;var k=S,j=k.next;k.next=null,v===null?m=j:v.next=j,v=k;var Q=n.alternate;Q!==null&&(Q=Q.updateQueue,S=Q.lastBaseUpdate,S!==v&&(S===null?Q.firstBaseUpdate=j:S.next=j,Q.lastBaseUpdate=k))}if(m!==null){var Y=d.baseState;v=0,Q=j=k=null,S=m;do{var K=S.lane,te=S.eventTime;if((c&K)===K){Q!==null&&(Q=Q.next={eventTime:te,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var se=n,oe=S;switch(K=i,te=a,oe.tag){case 1:if(se=oe.payload,typeof se=="function"){Y=se.call(te,Y,K);break e}Y=se;break e;case 3:se.flags=se.flags&-65537|128;case 0:if(se=oe.payload,K=typeof se=="function"?se.call(te,Y,K):se,K==null)break e;Y=re({},Y,K);break e;case 2:Xr=!0}}S.callback!==null&&S.lane!==0&&(n.flags|=64,K=d.effects,K===null?d.effects=[S]:K.push(S))}else te={eventTime:te,lane:K,tag:S.tag,payload:S.payload,callback:S.callback,next:null},Q===null?(j=Q=te,k=Y):Q=Q.next=te,v|=K;if(S=S.next,S===null){if(S=d.shared.pending,S===null)break;K=S,S=K.next,K.next=null,d.lastBaseUpdate=K,d.shared.pending=null}}while(!0);if(Q===null&&(k=Y),d.baseState=k,d.firstBaseUpdate=j,d.lastBaseUpdate=Q,i=d.shared.interleaved,i!==null){d=i;do v|=d.lane,d=d.next;while(d!==i)}else m===null&&(d.shared.lanes=0);Zi|=v,n.lanes=v,n.memoizedState=Y}}function Mp(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var wa={},Jn=Kr(wa),Ea=Kr(wa),Ta=Kr(wa);function Xi(n){if(n===wa)throw Error(t(174));return n}function gh(n,i){switch(We(Ta,i),We(Ea,n),We(Jn,wa),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:ft(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=ft(i,n)}Qe(Jn),We(Jn,i)}function ro(){Qe(Jn),Qe(Ea),Qe(Ta)}function Fp(n){Xi(Ta.current);var i=Xi(Jn.current),a=ft(i,n.type);i!==a&&(We(Ea,n),We(Jn,a))}function yh(n){Ea.current===n&&(Qe(Jn),Qe(Ea))}var Ze=Kr(0);function nu(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var _h=[];function vh(){for(var n=0;n<_h.length;n++)_h[n]._workInProgressVersionPrimary=null;_h.length=0}var ru=Ee.ReactCurrentDispatcher,wh=Ee.ReactCurrentBatchConfig,Ji=0,et=null,mt=null,Et=null,iu=!1,Ia=!1,Sa=0,Q0=0;function Ot(){throw Error(t(321))}function Eh(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Nn(n[a],i[a]))return!1;return!0}function Th(n,i,a,c,d,m){if(Ji=m,et=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,ru.current=n===null||n.memoizedState===null?Z0:ew,n=a(c,d),Ia){m=0;do{if(Ia=!1,Sa=0,25<=m)throw Error(t(301));m+=1,Et=mt=null,i.updateQueue=null,ru.current=tw,n=a(c,d)}while(Ia)}if(ru.current=au,i=mt!==null&&mt.next!==null,Ji=0,Et=mt=et=null,iu=!1,i)throw Error(t(300));return n}function Ih(){var n=Sa!==0;return Sa=0,n}function Zn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Et===null?et.memoizedState=Et=n:Et=Et.next=n,Et}function _n(){if(mt===null){var n=et.alternate;n=n!==null?n.memoizedState:null}else n=mt.next;var i=Et===null?et.memoizedState:Et.next;if(i!==null)Et=i,mt=n;else{if(n===null)throw Error(t(310));mt=n,n={memoizedState:mt.memoizedState,baseState:mt.baseState,baseQueue:mt.baseQueue,queue:mt.queue,next:null},Et===null?et.memoizedState=Et=n:Et=Et.next=n}return Et}function Aa(n,i){return typeof i=="function"?i(n):i}function Sh(n){var i=_n(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=mt,d=c.baseQueue,m=a.pending;if(m!==null){if(d!==null){var v=d.next;d.next=m.next,m.next=v}c.baseQueue=d=m,a.pending=null}if(d!==null){m=d.next,c=c.baseState;var S=v=null,k=null,j=m;do{var Q=j.lane;if((Ji&Q)===Q)k!==null&&(k=k.next={lane:0,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null}),c=j.hasEagerState?j.eagerState:n(c,j.action);else{var Y={lane:Q,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null};k===null?(S=k=Y,v=c):k=k.next=Y,et.lanes|=Q,Zi|=Q}j=j.next}while(j!==null&&j!==m);k===null?v=c:k.next=S,Nn(c,i.memoizedState)||(Yt=!0),i.memoizedState=c,i.baseState=v,i.baseQueue=k,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do m=d.lane,et.lanes|=m,Zi|=m,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function Ah(n){var i=_n(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,m=i.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do m=n(m,v.action),v=v.next;while(v!==d);Nn(m,i.memoizedState)||(Yt=!0),i.memoizedState=m,i.baseQueue===null&&(i.baseState=m),a.lastRenderedState=m}return[m,c]}function Up(){}function jp(n,i){var a=et,c=_n(),d=i(),m=!Nn(c.memoizedState,d);if(m&&(c.memoizedState=d,Yt=!0),c=c.queue,Rh($p.bind(null,a,c,n),[n]),c.getSnapshot!==i||m||Et!==null&&Et.memoizedState.tag&1){if(a.flags|=2048,Ra(9,Bp.bind(null,a,c,d,i),void 0,null),Tt===null)throw Error(t(349));(Ji&30)!==0||zp(a,i,d)}return d}function zp(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=et.updateQueue,i===null?(i={lastEffect:null,stores:null},et.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function Bp(n,i,a,c){i.value=a,i.getSnapshot=c,qp(i)&&Hp(n)}function $p(n,i,a){return a(function(){qp(i)&&Hp(n)})}function qp(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Nn(n,a)}catch{return!0}}function Hp(n){var i=Ir(n,1);i!==null&&Ln(i,n,1,-1)}function Wp(n){var i=Zn();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Aa,lastRenderedState:n},i.queue=n,n=n.dispatch=J0.bind(null,et,n),[i.memoizedState,n]}function Ra(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=et.updateQueue,i===null?(i={lastEffect:null,stores:null},et.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function Gp(){return _n().memoizedState}function su(n,i,a,c){var d=Zn();et.flags|=n,d.memoizedState=Ra(1|i,a,void 0,c===void 0?null:c)}function ou(n,i,a,c){var d=_n();c=c===void 0?null:c;var m=void 0;if(mt!==null){var v=mt.memoizedState;if(m=v.destroy,c!==null&&Eh(c,v.deps)){d.memoizedState=Ra(i,a,m,c);return}}et.flags|=n,d.memoizedState=Ra(1|i,a,m,c)}function Kp(n,i){return su(8390656,8,n,i)}function Rh(n,i){return ou(2048,8,n,i)}function Qp(n,i){return ou(4,2,n,i)}function Yp(n,i){return ou(4,4,n,i)}function Xp(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Jp(n,i,a){return a=a!=null?a.concat([n]):null,ou(4,4,Xp.bind(null,i,n),a)}function Ch(){}function Zp(n,i){var a=_n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Eh(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function em(n,i){var a=_n();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Eh(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function tm(n,i,a){return(Ji&21)===0?(n.baseState&&(n.baseState=!1,Yt=!0),n.memoizedState=a):(Nn(a,i)||(a=zi(),et.lanes|=a,Zi|=a,n.baseState=!0),i)}function Y0(n,i){var a=xe;xe=a!==0&&4>a?a:4,n(!0);var c=wh.transition;wh.transition={};try{n(!1),i()}finally{xe=a,wh.transition=c}}function nm(){return _n().memoizedState}function X0(n,i,a){var c=ni(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},rm(n))im(i,a);else if(a=bp(n,i,a,c),a!==null){var d=Ht();Ln(a,n,c,d),sm(a,i,c)}}function J0(n,i,a){var c=ni(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(rm(n))im(i,d);else{var m=n.alternate;if(n.lanes===0&&(m===null||m.lanes===0)&&(m=i.lastRenderedReducer,m!==null))try{var v=i.lastRenderedState,S=m(v,a);if(d.hasEagerState=!0,d.eagerState=S,Nn(S,v)){var k=i.interleaved;k===null?(d.next=d,ph(i)):(d.next=k.next,k.next=d),i.interleaved=d;return}}catch{}finally{}a=bp(n,i,d,c),a!==null&&(d=Ht(),Ln(a,n,c,d),sm(a,i,c))}}function rm(n){var i=n.alternate;return n===et||i!==null&&i===et}function im(n,i){Ia=iu=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function sm(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,zr(n,a)}}var au={readContext:yn,useCallback:Ot,useContext:Ot,useEffect:Ot,useImperativeHandle:Ot,useInsertionEffect:Ot,useLayoutEffect:Ot,useMemo:Ot,useReducer:Ot,useRef:Ot,useState:Ot,useDebugValue:Ot,useDeferredValue:Ot,useTransition:Ot,useMutableSource:Ot,useSyncExternalStore:Ot,useId:Ot,unstable_isNewReconciler:!1},Z0={readContext:yn,useCallback:function(n,i){return Zn().memoizedState=[n,i===void 0?null:i],n},useContext:yn,useEffect:Kp,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,su(4194308,4,Xp.bind(null,i,n),a)},useLayoutEffect:function(n,i){return su(4194308,4,n,i)},useInsertionEffect:function(n,i){return su(4,2,n,i)},useMemo:function(n,i){var a=Zn();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=Zn();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=X0.bind(null,et,n),[c.memoizedState,n]},useRef:function(n){var i=Zn();return n={current:n},i.memoizedState=n},useState:Wp,useDebugValue:Ch,useDeferredValue:function(n){return Zn().memoizedState=n},useTransition:function(){var n=Wp(!1),i=n[0];return n=Y0.bind(null,n[1]),Zn().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=et,d=Zn();if(Je){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),Tt===null)throw Error(t(349));(Ji&30)!==0||zp(c,i,a)}d.memoizedState=a;var m={value:a,getSnapshot:i};return d.queue=m,Kp($p.bind(null,c,m,n),[n]),c.flags|=2048,Ra(9,Bp.bind(null,c,m,a,i),void 0,null),a},useId:function(){var n=Zn(),i=Tt.identifierPrefix;if(Je){var a=Tr,c=Er;a=(c&~(1<<32-Bt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Sa++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=Q0++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},ew={readContext:yn,useCallback:Zp,useContext:yn,useEffect:Rh,useImperativeHandle:Jp,useInsertionEffect:Qp,useLayoutEffect:Yp,useMemo:em,useReducer:Sh,useRef:Gp,useState:function(){return Sh(Aa)},useDebugValue:Ch,useDeferredValue:function(n){var i=_n();return tm(i,mt.memoizedState,n)},useTransition:function(){var n=Sh(Aa)[0],i=_n().memoizedState;return[n,i]},useMutableSource:Up,useSyncExternalStore:jp,useId:nm,unstable_isNewReconciler:!1},tw={readContext:yn,useCallback:Zp,useContext:yn,useEffect:Rh,useImperativeHandle:Jp,useInsertionEffect:Qp,useLayoutEffect:Yp,useMemo:em,useReducer:Ah,useRef:Gp,useState:function(){return Ah(Aa)},useDebugValue:Ch,useDeferredValue:function(n){var i=_n();return mt===null?i.memoizedState=n:tm(i,mt.memoizedState,n)},useTransition:function(){var n=Ah(Aa)[0],i=_n().memoizedState;return[n,i]},useMutableSource:Up,useSyncExternalStore:jp,useId:nm,unstable_isNewReconciler:!1};function Vn(n,i){if(n&&n.defaultProps){i=re({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function Ph(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:re({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var lu={isMounted:function(n){return(n=n._reactInternals)?Sn(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=Ht(),d=ni(n),m=Sr(c,d);m.payload=i,a!=null&&(m.callback=a),i=Jr(n,m,d),i!==null&&(Ln(i,n,d,c),eu(i,n,d))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=Ht(),d=ni(n),m=Sr(c,d);m.tag=1,m.payload=i,a!=null&&(m.callback=a),i=Jr(n,m,d),i!==null&&(Ln(i,n,d,c),eu(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=Ht(),c=ni(n),d=Sr(a,c);d.tag=2,i!=null&&(d.callback=i),i=Jr(n,d,c),i!==null&&(Ln(i,n,c,a),eu(i,n,c))}};function om(n,i,a,c,d,m,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,m,v):i.prototype&&i.prototype.isPureReactComponent?!da(a,c)||!da(d,m):!0}function am(n,i,a){var c=!1,d=Qr,m=i.contextType;return typeof m=="object"&&m!==null?m=yn(m):(d=Qt(i)?Gi:bt.current,c=i.contextTypes,m=(c=c!=null)?Ys(n,d):Qr),i=new i(a,m),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=lu,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=m),i}function lm(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&lu.enqueueReplaceState(i,i.state,null)}function kh(n,i,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},mh(n);var m=i.contextType;typeof m=="object"&&m!==null?d.context=yn(m):(m=Qt(i)?Gi:bt.current,d.context=Ys(n,m)),d.state=n.memoizedState,m=i.getDerivedStateFromProps,typeof m=="function"&&(Ph(n,i,m,a),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&lu.enqueueReplaceState(d,d.state,null),tu(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function io(n,i){try{var a="",c=i;do a+=Re(c),c=c.return;while(c);var d=a}catch(m){d=`
Error generating stack: `+m.message+`
`+m.stack}return{value:n,source:i,stack:d,digest:null}}function xh(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function Nh(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var nw=typeof WeakMap=="function"?WeakMap:Map;function um(n,i,a){a=Sr(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){mu||(mu=!0,Wh=c),Nh(n,i)},a}function cm(n,i,a){a=Sr(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=i.value;a.payload=function(){return c(d)},a.callback=function(){Nh(n,i)}}var m=n.stateNode;return m!==null&&typeof m.componentDidCatch=="function"&&(a.callback=function(){Nh(n,i),typeof c!="function"&&(ei===null?ei=new Set([this]):ei.add(this));var v=i.stack;this.componentDidCatch(i.value,{componentStack:v!==null?v:""})}),a}function hm(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new nw;var d=new Set;c.set(i,d)}else d=c.get(i),d===void 0&&(d=new Set,c.set(i,d));d.has(a)||(d.add(a),n=gw.bind(null,n,i,a),i.then(n,n))}function dm(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function fm(n,i,a,c,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Sr(-1,1),i.tag=2,Jr(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var rw=Ee.ReactCurrentOwner,Yt=!1;function qt(n,i,a,c){i.child=n===null?Vp(i,null,a,c):eo(i,n.child,a,c)}function pm(n,i,a,c,d){a=a.render;var m=i.ref;return no(i,d),c=Th(n,i,a,c,m,d),a=Ih(),n!==null&&!Yt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Ar(n,i,d)):(Je&&a&&sh(i),i.flags|=1,qt(n,i,c,d),i.child)}function mm(n,i,a,c,d){if(n===null){var m=a.type;return typeof m=="function"&&!Zh(m)&&m.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=m,gm(n,i,m,c,d)):(n=Eu(a.type,null,c,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(m=n.child,(n.lanes&d)===0){var v=m.memoizedProps;if(a=a.compare,a=a!==null?a:da,a(v,c)&&n.ref===i.ref)return Ar(n,i,d)}return i.flags|=1,n=ii(m,c),n.ref=i.ref,n.return=i,i.child=n}function gm(n,i,a,c,d){if(n!==null){var m=n.memoizedProps;if(da(m,c)&&n.ref===i.ref)if(Yt=!1,i.pendingProps=c=m,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Yt=!0);else return i.lanes=n.lanes,Ar(n,i,d)}return Dh(n,i,a,c,d)}function ym(n,i,a){var c=i.pendingProps,d=c.children,m=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},We(oo,un),un|=a;else{if((a&1073741824)===0)return n=m!==null?m.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,We(oo,un),un|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=m!==null?m.baseLanes:a,We(oo,un),un|=c}else m!==null?(c=m.baseLanes|a,i.memoizedState=null):c=a,We(oo,un),un|=c;return qt(n,i,d,a),i.child}function _m(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function Dh(n,i,a,c,d){var m=Qt(a)?Gi:bt.current;return m=Ys(i,m),no(i,d),a=Th(n,i,a,c,m,d),c=Ih(),n!==null&&!Yt?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Ar(n,i,d)):(Je&&c&&sh(i),i.flags|=1,qt(n,i,a,d),i.child)}function vm(n,i,a,c,d){if(Qt(a)){var m=!0;Wl(i)}else m=!1;if(no(i,d),i.stateNode===null)cu(n,i),am(i,a,c),kh(i,a,c,d),c=!0;else if(n===null){var v=i.stateNode,S=i.memoizedProps;v.props=S;var k=v.context,j=a.contextType;typeof j=="object"&&j!==null?j=yn(j):(j=Qt(a)?Gi:bt.current,j=Ys(i,j));var Q=a.getDerivedStateFromProps,Y=typeof Q=="function"||typeof v.getSnapshotBeforeUpdate=="function";Y||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==c||k!==j)&&lm(i,v,c,j),Xr=!1;var K=i.memoizedState;v.state=K,tu(i,c,v,d),k=i.memoizedState,S!==c||K!==k||Kt.current||Xr?(typeof Q=="function"&&(Ph(i,a,Q,c),k=i.memoizedState),(S=Xr||om(i,a,S,c,K,k,j))?(Y||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(i.flags|=4194308)):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=k),v.props=c,v.state=k,v.context=j,c=S):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{v=i.stateNode,Op(n,i),S=i.memoizedProps,j=i.type===i.elementType?S:Vn(i.type,S),v.props=j,Y=i.pendingProps,K=v.context,k=a.contextType,typeof k=="object"&&k!==null?k=yn(k):(k=Qt(a)?Gi:bt.current,k=Ys(i,k));var te=a.getDerivedStateFromProps;(Q=typeof te=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==Y||K!==k)&&lm(i,v,c,k),Xr=!1,K=i.memoizedState,v.state=K,tu(i,c,v,d);var se=i.memoizedState;S!==Y||K!==se||Kt.current||Xr?(typeof te=="function"&&(Ph(i,a,te,c),se=i.memoizedState),(j=Xr||om(i,a,j,c,K,se,k)||!1)?(Q||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,se,k),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,se,k)),typeof v.componentDidUpdate=="function"&&(i.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=se),v.props=c,v.state=se,v.context=k,c=j):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),c=!1)}return Vh(n,i,a,c,m,d)}function Vh(n,i,a,c,d,m){_m(n,i);var v=(i.flags&128)!==0;if(!c&&!v)return d&&Sp(i,a,!1),Ar(n,i,m);c=i.stateNode,rw.current=i;var S=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&v?(i.child=eo(i,n.child,null,m),i.child=eo(i,null,S,m)):qt(n,i,S,m),i.memoizedState=c.state,d&&Sp(i,a,!0),i.child}function wm(n){var i=n.stateNode;i.pendingContext?Tp(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Tp(n,i.context,!1),gh(n,i.containerInfo)}function Em(n,i,a,c,d){return Zs(),uh(d),i.flags|=256,qt(n,i,a,c),i.child}var bh={dehydrated:null,treeContext:null,retryLane:0};function Oh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Tm(n,i,a){var c=i.pendingProps,d=Ze.current,m=!1,v=(i.flags&128)!==0,S;if((S=v)||(S=n!==null&&n.memoizedState===null?!1:(d&2)!==0),S?(m=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),We(Ze,d&1),n===null)return lh(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(v=c.children,n=c.fallback,m?(c=i.mode,m=i.child,v={mode:"hidden",children:v},(c&1)===0&&m!==null?(m.childLanes=0,m.pendingProps=v):m=Tu(v,c,0,null),n=rs(n,c,a,null),m.return=i,n.return=i,m.sibling=n,i.child=m,i.child.memoizedState=Oh(a),i.memoizedState=bh,n):Lh(i,v));if(d=n.memoizedState,d!==null&&(S=d.dehydrated,S!==null))return iw(n,i,v,c,S,d,a);if(m){m=c.fallback,v=i.mode,d=n.child,S=d.sibling;var k={mode:"hidden",children:c.children};return(v&1)===0&&i.child!==d?(c=i.child,c.childLanes=0,c.pendingProps=k,i.deletions=null):(c=ii(d,k),c.subtreeFlags=d.subtreeFlags&14680064),S!==null?m=ii(S,m):(m=rs(m,v,a,null),m.flags|=2),m.return=i,c.return=i,c.sibling=m,i.child=c,c=m,m=i.child,v=n.child.memoizedState,v=v===null?Oh(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},m.memoizedState=v,m.childLanes=n.childLanes&~a,i.memoizedState=bh,c}return m=n.child,n=m.sibling,c=ii(m,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function Lh(n,i){return i=Tu({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function uu(n,i,a,c){return c!==null&&uh(c),eo(i,n.child,null,a),n=Lh(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function iw(n,i,a,c,d,m,v){if(a)return i.flags&256?(i.flags&=-257,c=xh(Error(t(422))),uu(n,i,v,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(m=c.fallback,d=i.mode,c=Tu({mode:"visible",children:c.children},d,0,null),m=rs(m,d,v,null),m.flags|=2,c.return=i,m.return=i,c.sibling=m,i.child=c,(i.mode&1)!==0&&eo(i,n.child,null,v),i.child.memoizedState=Oh(v),i.memoizedState=bh,m);if((i.mode&1)===0)return uu(n,i,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var S=c.dgst;return c=S,m=Error(t(419)),c=xh(m,c,void 0),uu(n,i,v,c)}if(S=(v&n.childLanes)!==0,Yt||S){if(c=Tt,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==m.retryLane&&(m.retryLane=d,Ir(n,d),Ln(c,n,d,-1))}return Jh(),c=xh(Error(t(421))),uu(n,i,v,c)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=yw.bind(null,n),d._reactRetry=i,null):(n=m.treeContext,ln=Gr(d.nextSibling),an=i,Je=!0,Dn=null,n!==null&&(mn[gn++]=Er,mn[gn++]=Tr,mn[gn++]=Ki,Er=n.id,Tr=n.overflow,Ki=i),i=Lh(i,c.children),i.flags|=4096,i)}function Im(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),fh(n.return,i,a)}function Mh(n,i,a,c,d){var m=n.memoizedState;m===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(m.isBackwards=i,m.rendering=null,m.renderingStartTime=0,m.last=c,m.tail=a,m.tailMode=d)}function Sm(n,i,a){var c=i.pendingProps,d=c.revealOrder,m=c.tail;if(qt(n,i,c.children,a),c=Ze.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Im(n,a,i);else if(n.tag===19)Im(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(We(Ze,c),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(a=i.child,d=null;a!==null;)n=a.alternate,n!==null&&nu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=i.child,i.child=null):(d=a.sibling,a.sibling=null),Mh(i,!1,d,a,m);break;case"backwards":for(a=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&nu(n)===null){i.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}Mh(i,!0,a,null,m);break;case"together":Mh(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function cu(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Ar(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Zi|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=ii(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=ii(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function sw(n,i,a){switch(i.tag){case 3:wm(i),Zs();break;case 5:Fp(i);break;case 1:Qt(i.type)&&Wl(i);break;case 4:gh(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,d=i.memoizedProps.value;We(Jl,c._currentValue),c._currentValue=d;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(We(Ze,Ze.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Tm(n,i,a):(We(Ze,Ze.current&1),n=Ar(n,i,a),n!==null?n.sibling:null);We(Ze,Ze.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Sm(n,i,a);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),We(Ze,Ze.current),c)break;return null;case 22:case 23:return i.lanes=0,ym(n,i,a)}return Ar(n,i,a)}var Am,Fh,Rm,Cm;Am=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},Fh=function(){},Rm=function(n,i,a,c){var d=n.memoizedProps;if(d!==c){n=i.stateNode,Xi(Jn.current);var m=null;switch(a){case"input":d=xi(n,d),c=xi(n,c),m=[];break;case"select":d=re({},d,{value:void 0}),c=re({},c,{value:void 0}),m=[];break;case"textarea":d=zo(n,d),c=zo(n,c),m=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=$l)}Go(a,c);var v;a=null;for(j in d)if(!c.hasOwnProperty(j)&&d.hasOwnProperty(j)&&d[j]!=null)if(j==="style"){var S=d[j];for(v in S)S.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else j!=="dangerouslySetInnerHTML"&&j!=="children"&&j!=="suppressContentEditableWarning"&&j!=="suppressHydrationWarning"&&j!=="autoFocus"&&(o.hasOwnProperty(j)?m||(m=[]):(m=m||[]).push(j,null));for(j in c){var k=c[j];if(S=d!=null?d[j]:void 0,c.hasOwnProperty(j)&&k!==S&&(k!=null||S!=null))if(j==="style")if(S){for(v in S)!S.hasOwnProperty(v)||k&&k.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in k)k.hasOwnProperty(v)&&S[v]!==k[v]&&(a||(a={}),a[v]=k[v])}else a||(m||(m=[]),m.push(j,a)),a=k;else j==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,S=S?S.__html:void 0,k!=null&&S!==k&&(m=m||[]).push(j,k)):j==="children"?typeof k!="string"&&typeof k!="number"||(m=m||[]).push(j,""+k):j!=="suppressContentEditableWarning"&&j!=="suppressHydrationWarning"&&(o.hasOwnProperty(j)?(k!=null&&j==="onScroll"&&Ke("scroll",n),m||S===k||(m=[])):(m=m||[]).push(j,k))}a&&(m=m||[]).push("style",a);var j=m;(i.updateQueue=j)&&(i.flags|=4)}},Cm=function(n,i,a,c){a!==c&&(i.flags|=4)};function Ca(n,i){if(!Je)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Lt(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function ow(n,i,a){var c=i.pendingProps;switch(oh(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Lt(i),null;case 1:return Qt(i.type)&&Hl(),Lt(i),null;case 3:return c=i.stateNode,ro(),Qe(Kt),Qe(bt),vh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Yl(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Dn!==null&&(Qh(Dn),Dn=null))),Fh(n,i),Lt(i),null;case 5:yh(i);var d=Xi(Ta.current);if(a=i.type,n!==null&&i.stateNode!=null)Rm(n,i,a,c,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return Lt(i),null}if(n=Xi(Jn.current),Yl(i)){c=i.stateNode,a=i.type;var m=i.memoizedProps;switch(c[Xn]=i,c[ya]=m,n=(i.mode&1)!==0,a){case"dialog":Ke("cancel",c),Ke("close",c);break;case"iframe":case"object":case"embed":Ke("load",c);break;case"video":case"audio":for(d=0;d<pa.length;d++)Ke(pa[d],c);break;case"source":Ke("error",c);break;case"img":case"image":case"link":Ke("error",c),Ke("load",c);break;case"details":Ke("toggle",c);break;case"input":_s(c,m),Ke("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!m.multiple},Ke("invalid",c);break;case"textarea":ws(c,m),Ke("invalid",c)}Go(a,m),d=null;for(var v in m)if(m.hasOwnProperty(v)){var S=m[v];v==="children"?typeof S=="string"?c.textContent!==S&&(m.suppressHydrationWarning!==!0&&Bl(c.textContent,S,n),d=["children",S]):typeof S=="number"&&c.textContent!==""+S&&(m.suppressHydrationWarning!==!0&&Bl(c.textContent,S,n),d=["children",""+S]):o.hasOwnProperty(v)&&S!=null&&v==="onScroll"&&Ke("scroll",c)}switch(a){case"input":ur(c),pl(c,m,!0);break;case"textarea":ur(c),Bo(c);break;case"select":case"option":break;default:typeof m.onClick=="function"&&(c.onclick=$l)}c=d,i.updateQueue=c,c!==null&&(i.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=dt(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[Xn]=i,n[ya]=c,Am(n,i,!1,!1),i.stateNode=n;e:{switch(v=Ko(a,c),a){case"dialog":Ke("cancel",n),Ke("close",n),d=c;break;case"iframe":case"object":case"embed":Ke("load",n),d=c;break;case"video":case"audio":for(d=0;d<pa.length;d++)Ke(pa[d],n);d=c;break;case"source":Ke("error",n),d=c;break;case"img":case"image":case"link":Ke("error",n),Ke("load",n),d=c;break;case"details":Ke("toggle",n),d=c;break;case"input":_s(n,c),d=xi(n,c),Ke("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=re({},c,{value:void 0}),Ke("invalid",n);break;case"textarea":ws(n,c),d=zo(n,c),Ke("invalid",n);break;default:d=c}Go(a,d),S=d;for(m in S)if(S.hasOwnProperty(m)){var k=S[m];m==="style"?Ho(n,k):m==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&$o(n,k)):m==="children"?typeof k=="string"?(a!=="textarea"||k!=="")&&Lr(n,k):typeof k=="number"&&Lr(n,""+k):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(o.hasOwnProperty(m)?k!=null&&m==="onScroll"&&Ke("scroll",n):k!=null&&pe(n,m,k,v))}switch(a){case"input":ur(n),pl(n,c,!1);break;case"textarea":ur(n),Bo(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Me(c.value));break;case"select":n.multiple=!!c.multiple,m=c.value,m!=null?hr(n,!!c.multiple,m,!1):c.defaultValue!=null&&hr(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=$l)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Lt(i),null;case 6:if(n&&i.stateNode!=null)Cm(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=Xi(Ta.current),Xi(Jn.current),Yl(i)){if(c=i.stateNode,a=i.memoizedProps,c[Xn]=i,(m=c.nodeValue!==a)&&(n=an,n!==null))switch(n.tag){case 3:Bl(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Bl(c.nodeValue,a,(n.mode&1)!==0)}m&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[Xn]=i,i.stateNode=c}return Lt(i),null;case 13:if(Qe(Ze),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Je&&ln!==null&&(i.mode&1)!==0&&(i.flags&128)===0)xp(),Zs(),i.flags|=98560,m=!1;else if(m=Yl(i),c!==null&&c.dehydrated!==null){if(n===null){if(!m)throw Error(t(318));if(m=i.memoizedState,m=m!==null?m.dehydrated:null,!m)throw Error(t(317));m[Xn]=i}else Zs(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Lt(i),m=!1}else Dn!==null&&(Qh(Dn),Dn=null),m=!0;if(!m)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Ze.current&1)!==0?gt===0&&(gt=3):Jh())),i.updateQueue!==null&&(i.flags|=4),Lt(i),null);case 4:return ro(),Fh(n,i),n===null&&ma(i.stateNode.containerInfo),Lt(i),null;case 10:return dh(i.type._context),Lt(i),null;case 17:return Qt(i.type)&&Hl(),Lt(i),null;case 19:if(Qe(Ze),m=i.memoizedState,m===null)return Lt(i),null;if(c=(i.flags&128)!==0,v=m.rendering,v===null)if(c)Ca(m,!1);else{if(gt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(v=nu(n),v!==null){for(i.flags|=128,Ca(m,!1),c=v.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)m=a,n=c,m.flags&=14680066,v=m.alternate,v===null?(m.childLanes=0,m.lanes=n,m.child=null,m.subtreeFlags=0,m.memoizedProps=null,m.memoizedState=null,m.updateQueue=null,m.dependencies=null,m.stateNode=null):(m.childLanes=v.childLanes,m.lanes=v.lanes,m.child=v.child,m.subtreeFlags=0,m.deletions=null,m.memoizedProps=v.memoizedProps,m.memoizedState=v.memoizedState,m.updateQueue=v.updateQueue,m.type=v.type,n=v.dependencies,m.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return We(Ze,Ze.current&1|2),i.child}n=n.sibling}m.tail!==null&&He()>ao&&(i.flags|=128,c=!0,Ca(m,!1),i.lanes=4194304)}else{if(!c)if(n=nu(v),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Ca(m,!0),m.tail===null&&m.tailMode==="hidden"&&!v.alternate&&!Je)return Lt(i),null}else 2*He()-m.renderingStartTime>ao&&a!==1073741824&&(i.flags|=128,c=!0,Ca(m,!1),i.lanes=4194304);m.isBackwards?(v.sibling=i.child,i.child=v):(a=m.last,a!==null?a.sibling=v:i.child=v,m.last=v)}return m.tail!==null?(i=m.tail,m.rendering=i,m.tail=i.sibling,m.renderingStartTime=He(),i.sibling=null,a=Ze.current,We(Ze,c?a&1|2:a&1),i):(Lt(i),null);case 22:case 23:return Xh(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(un&1073741824)!==0&&(Lt(i),i.subtreeFlags&6&&(i.flags|=8192)):Lt(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function aw(n,i){switch(oh(i),i.tag){case 1:return Qt(i.type)&&Hl(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return ro(),Qe(Kt),Qe(bt),vh(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return yh(i),null;case 13:if(Qe(Ze),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));Zs()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Qe(Ze),null;case 4:return ro(),null;case 10:return dh(i.type._context),null;case 22:case 23:return Xh(),null;case 24:return null;default:return null}}var hu=!1,Mt=!1,lw=typeof WeakSet=="function"?WeakSet:Set,ie=null;function so(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){nt(n,i,c)}else a.current=null}function Uh(n,i,a){try{a()}catch(c){nt(n,i,c)}}var Pm=!1;function uw(n,i){if(Xc=qr,n=op(),$c(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,m=c.focusNode;c=c.focusOffset;try{a.nodeType,m.nodeType}catch{a=null;break e}var v=0,S=-1,k=-1,j=0,Q=0,Y=n,K=null;t:for(;;){for(var te;Y!==a||d!==0&&Y.nodeType!==3||(S=v+d),Y!==m||c!==0&&Y.nodeType!==3||(k=v+c),Y.nodeType===3&&(v+=Y.nodeValue.length),(te=Y.firstChild)!==null;)K=Y,Y=te;for(;;){if(Y===n)break t;if(K===a&&++j===d&&(S=v),K===m&&++Q===c&&(k=v),(te=Y.nextSibling)!==null)break;Y=K,K=Y.parentNode}Y=te}a=S===-1||k===-1?null:{start:S,end:k}}else a=null}a=a||{start:0,end:0}}else a=null;for(Jc={focusedElem:n,selectionRange:a},qr=!1,ie=i;ie!==null;)if(i=ie,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,ie=n;else for(;ie!==null;){i=ie;try{var se=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(se!==null){var oe=se.memoizedProps,st=se.memoizedState,M=i.stateNode,N=M.getSnapshotBeforeUpdate(i.elementType===i.type?oe:Vn(i.type,oe),st);M.__reactInternalSnapshotBeforeUpdate=N}break;case 3:var F=i.stateNode.containerInfo;F.nodeType===1?F.textContent="":F.nodeType===9&&F.documentElement&&F.removeChild(F.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(X){nt(i,i.return,X)}if(n=i.sibling,n!==null){n.return=i.return,ie=n;break}ie=i.return}return se=Pm,Pm=!1,se}function Pa(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var m=d.destroy;d.destroy=void 0,m!==void 0&&Uh(i,a,m)}d=d.next}while(d!==c)}}function du(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function jh(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function km(n){var i=n.alternate;i!==null&&(n.alternate=null,km(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[Xn],delete i[ya],delete i[nh],delete i[H0],delete i[W0])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function xm(n){return n.tag===5||n.tag===3||n.tag===4}function Nm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||xm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function zh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=$l));else if(c!==4&&(n=n.child,n!==null))for(zh(n,i,a),n=n.sibling;n!==null;)zh(n,i,a),n=n.sibling}function Bh(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(Bh(n,i,a),n=n.sibling;n!==null;)Bh(n,i,a),n=n.sibling}var kt=null,bn=!1;function Zr(n,i,a){for(a=a.child;a!==null;)Dm(n,i,a),a=a.sibling}function Dm(n,i,a){if(nn&&typeof nn.onCommitFiberUnmount=="function")try{nn.onCommitFiberUnmount(Ui,a)}catch{}switch(a.tag){case 5:Mt||so(a,i);case 6:var c=kt,d=bn;kt=null,Zr(n,i,a),kt=c,bn=d,kt!==null&&(bn?(n=kt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):kt.removeChild(a.stateNode));break;case 18:kt!==null&&(bn?(n=kt,a=a.stateNode,n.nodeType===8?th(n.parentNode,a):n.nodeType===1&&th(n,a),kn(n)):th(kt,a.stateNode));break;case 4:c=kt,d=bn,kt=a.stateNode.containerInfo,bn=!0,Zr(n,i,a),kt=c,bn=d;break;case 0:case 11:case 14:case 15:if(!Mt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var m=d,v=m.destroy;m=m.tag,v!==void 0&&((m&2)!==0||(m&4)!==0)&&Uh(a,i,v),d=d.next}while(d!==c)}Zr(n,i,a);break;case 1:if(!Mt&&(so(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(S){nt(a,i,S)}Zr(n,i,a);break;case 21:Zr(n,i,a);break;case 22:a.mode&1?(Mt=(c=Mt)||a.memoizedState!==null,Zr(n,i,a),Mt=c):Zr(n,i,a);break;default:Zr(n,i,a)}}function Vm(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new lw),i.forEach(function(c){var d=_w.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function On(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var m=n,v=i,S=v;e:for(;S!==null;){switch(S.tag){case 5:kt=S.stateNode,bn=!1;break e;case 3:kt=S.stateNode.containerInfo,bn=!0;break e;case 4:kt=S.stateNode.containerInfo,bn=!0;break e}S=S.return}if(kt===null)throw Error(t(160));Dm(m,v,d),kt=null,bn=!1;var k=d.alternate;k!==null&&(k.return=null),d.return=null}catch(j){nt(d,i,j)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)bm(i,n),i=i.sibling}function bm(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(On(i,n),er(n),c&4){try{Pa(3,n,n.return),du(3,n)}catch(oe){nt(n,n.return,oe)}try{Pa(5,n,n.return)}catch(oe){nt(n,n.return,oe)}}break;case 1:On(i,n),er(n),c&512&&a!==null&&so(a,a.return);break;case 5:if(On(i,n),er(n),c&512&&a!==null&&so(a,a.return),n.flags&32){var d=n.stateNode;try{Lr(d,"")}catch(oe){nt(n,n.return,oe)}}if(c&4&&(d=n.stateNode,d!=null)){var m=n.memoizedProps,v=a!==null?a.memoizedProps:m,S=n.type,k=n.updateQueue;if(n.updateQueue=null,k!==null)try{S==="input"&&m.type==="radio"&&m.name!=null&&Uo(d,m),Ko(S,v);var j=Ko(S,m);for(v=0;v<k.length;v+=2){var Q=k[v],Y=k[v+1];Q==="style"?Ho(d,Y):Q==="dangerouslySetInnerHTML"?$o(d,Y):Q==="children"?Lr(d,Y):pe(d,Q,Y,j)}switch(S){case"input":jo(d,m);break;case"textarea":Es(d,m);break;case"select":var K=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!m.multiple;var te=m.value;te!=null?hr(d,!!m.multiple,te,!1):K!==!!m.multiple&&(m.defaultValue!=null?hr(d,!!m.multiple,m.defaultValue,!0):hr(d,!!m.multiple,m.multiple?[]:"",!1))}d[ya]=m}catch(oe){nt(n,n.return,oe)}}break;case 6:if(On(i,n),er(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,m=n.memoizedProps;try{d.nodeValue=m}catch(oe){nt(n,n.return,oe)}}break;case 3:if(On(i,n),er(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{kn(i.containerInfo)}catch(oe){nt(n,n.return,oe)}break;case 4:On(i,n),er(n);break;case 13:On(i,n),er(n),d=n.child,d.flags&8192&&(m=d.memoizedState!==null,d.stateNode.isHidden=m,!m||d.alternate!==null&&d.alternate.memoizedState!==null||(Hh=He())),c&4&&Vm(n);break;case 22:if(Q=a!==null&&a.memoizedState!==null,n.mode&1?(Mt=(j=Mt)||Q,On(i,n),Mt=j):On(i,n),er(n),c&8192){if(j=n.memoizedState!==null,(n.stateNode.isHidden=j)&&!Q&&(n.mode&1)!==0)for(ie=n,Q=n.child;Q!==null;){for(Y=ie=Q;ie!==null;){switch(K=ie,te=K.child,K.tag){case 0:case 11:case 14:case 15:Pa(4,K,K.return);break;case 1:so(K,K.return);var se=K.stateNode;if(typeof se.componentWillUnmount=="function"){c=K,a=K.return;try{i=c,se.props=i.memoizedProps,se.state=i.memoizedState,se.componentWillUnmount()}catch(oe){nt(c,a,oe)}}break;case 5:so(K,K.return);break;case 22:if(K.memoizedState!==null){Mm(Y);continue}}te!==null?(te.return=K,ie=te):Mm(Y)}Q=Q.sibling}e:for(Q=null,Y=n;;){if(Y.tag===5){if(Q===null){Q=Y;try{d=Y.stateNode,j?(m=d.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none"):(S=Y.stateNode,k=Y.memoizedProps.style,v=k!=null&&k.hasOwnProperty("display")?k.display:null,S.style.display=qo("display",v))}catch(oe){nt(n,n.return,oe)}}}else if(Y.tag===6){if(Q===null)try{Y.stateNode.nodeValue=j?"":Y.memoizedProps}catch(oe){nt(n,n.return,oe)}}else if((Y.tag!==22&&Y.tag!==23||Y.memoizedState===null||Y===n)&&Y.child!==null){Y.child.return=Y,Y=Y.child;continue}if(Y===n)break e;for(;Y.sibling===null;){if(Y.return===null||Y.return===n)break e;Q===Y&&(Q=null),Y=Y.return}Q===Y&&(Q=null),Y.sibling.return=Y.return,Y=Y.sibling}}break;case 19:On(i,n),er(n),c&4&&Vm(n);break;case 21:break;default:On(i,n),er(n)}}function er(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(xm(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Lr(d,""),c.flags&=-33);var m=Nm(n);Bh(n,m,d);break;case 3:case 4:var v=c.stateNode.containerInfo,S=Nm(n);zh(n,S,v);break;default:throw Error(t(161))}}catch(k){nt(n,n.return,k)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function cw(n,i,a){ie=n,Om(n)}function Om(n,i,a){for(var c=(n.mode&1)!==0;ie!==null;){var d=ie,m=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||hu;if(!v){var S=d.alternate,k=S!==null&&S.memoizedState!==null||Mt;S=hu;var j=Mt;if(hu=v,(Mt=k)&&!j)for(ie=d;ie!==null;)v=ie,k=v.child,v.tag===22&&v.memoizedState!==null?Fm(d):k!==null?(k.return=v,ie=k):Fm(d);for(;m!==null;)ie=m,Om(m),m=m.sibling;ie=d,hu=S,Mt=j}Lm(n)}else(d.subtreeFlags&8772)!==0&&m!==null?(m.return=d,ie=m):Lm(n)}}function Lm(n){for(;ie!==null;){var i=ie;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:Mt||du(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!Mt)if(a===null)c.componentDidMount();else{var d=i.elementType===i.type?a.memoizedProps:Vn(i.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var m=i.updateQueue;m!==null&&Mp(i,m,c);break;case 3:var v=i.updateQueue;if(v!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}Mp(i,v,a)}break;case 5:var S=i.stateNode;if(a===null&&i.flags&4){a=S;var k=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&a.focus();break;case"img":k.src&&(a.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var j=i.alternate;if(j!==null){var Q=j.memoizedState;if(Q!==null){var Y=Q.dehydrated;Y!==null&&kn(Y)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Mt||i.flags&512&&jh(i)}catch(K){nt(i,i.return,K)}}if(i===n){ie=null;break}if(a=i.sibling,a!==null){a.return=i.return,ie=a;break}ie=i.return}}function Mm(n){for(;ie!==null;){var i=ie;if(i===n){ie=null;break}var a=i.sibling;if(a!==null){a.return=i.return,ie=a;break}ie=i.return}}function Fm(n){for(;ie!==null;){var i=ie;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{du(4,i)}catch(k){nt(i,a,k)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var d=i.return;try{c.componentDidMount()}catch(k){nt(i,d,k)}}var m=i.return;try{jh(i)}catch(k){nt(i,m,k)}break;case 5:var v=i.return;try{jh(i)}catch(k){nt(i,v,k)}}}catch(k){nt(i,i.return,k)}if(i===n){ie=null;break}var S=i.sibling;if(S!==null){S.return=i.return,ie=S;break}ie=i.return}}var hw=Math.ceil,fu=Ee.ReactCurrentDispatcher,$h=Ee.ReactCurrentOwner,vn=Ee.ReactCurrentBatchConfig,be=0,Tt=null,lt=null,xt=0,un=0,oo=Kr(0),gt=0,ka=null,Zi=0,pu=0,qh=0,xa=null,Xt=null,Hh=0,ao=1/0,Rr=null,mu=!1,Wh=null,ei=null,gu=!1,ti=null,yu=0,Na=0,Gh=null,_u=-1,vu=0;function Ht(){return(be&6)!==0?He():_u!==-1?_u:_u=He()}function ni(n){return(n.mode&1)===0?1:(be&2)!==0&&xt!==0?xt&-xt:K0.transition!==null?(vu===0&&(vu=zi()),vu):(n=xe,n!==0||(n=window.event,n=n===void 0?16:sa(n.type)),n)}function Ln(n,i,a,c){if(50<Na)throw Na=0,Gh=null,Error(t(185));jr(n,a,c),((be&2)===0||n!==Tt)&&(n===Tt&&((be&2)===0&&(pu|=a),gt===4&&ri(n,xt)),Jt(n,c),a===1&&be===0&&(i.mode&1)===0&&(ao=He()+500,Gl&&Yr()))}function Jt(n,i){var a=n.callbackNode;pr(n,i);var c=ji(n,n===Tt?xt:0);if(c===0)a!==null&&ea(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&ea(a),i===1)n.tag===0?G0(jm.bind(null,n)):Ap(jm.bind(null,n)),$0(function(){(be&6)===0&&Yr()}),a=null;else{switch(Br(c)){case 1:a=Fi;break;case 4:a=Mr;break;case 16:a=dn;break;case 536870912:a=vl;break;default:a=dn}a=Km(a,Um.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function Um(n,i){if(_u=-1,vu=0,(be&6)!==0)throw Error(t(327));var a=n.callbackNode;if(lo()&&n.callbackNode!==a)return null;var c=ji(n,n===Tt?xt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=wu(n,c);else{i=c;var d=be;be|=2;var m=Bm();(Tt!==n||xt!==i)&&(Rr=null,ao=He()+500,ts(n,i));do try{pw();break}catch(S){zm(n,S)}while(!0);hh(),fu.current=m,be=d,lt!==null?i=0:(Tt=null,xt=0,i=gt)}if(i!==0){if(i===2&&(d=rn(n),d!==0&&(c=d,i=Kh(n,d))),i===1)throw a=ka,ts(n,0),ri(n,c),Jt(n,He()),a;if(i===6)ri(n,c);else{if(d=n.current.alternate,(c&30)===0&&!dw(d)&&(i=wu(n,c),i===2&&(m=rn(n),m!==0&&(c=m,i=Kh(n,m))),i===1))throw a=ka,ts(n,0),ri(n,c),Jt(n,He()),a;switch(n.finishedWork=d,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:ns(n,Xt,Rr);break;case 3:if(ri(n,c),(c&130023424)===c&&(i=Hh+500-He(),10<i)){if(ji(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Ht(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=eh(ns.bind(null,n,Xt,Rr),i);break}ns(n,Xt,Rr);break;case 4:if(ri(n,c),(c&4194240)===c)break;for(i=n.eventTimes,d=-1;0<c;){var v=31-Bt(c);m=1<<v,v=i[v],v>d&&(d=v),c&=~m}if(c=d,c=He()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*hw(c/1960))-c,10<c){n.timeoutHandle=eh(ns.bind(null,n,Xt,Rr),c);break}ns(n,Xt,Rr);break;case 5:ns(n,Xt,Rr);break;default:throw Error(t(329))}}}return Jt(n,He()),n.callbackNode===a?Um.bind(null,n):null}function Kh(n,i){var a=xa;return n.current.memoizedState.isDehydrated&&(ts(n,i).flags|=256),n=wu(n,i),n!==2&&(i=Xt,Xt=a,i!==null&&Qh(i)),n}function Qh(n){Xt===null?Xt=n:Xt.push.apply(Xt,n)}function dw(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],m=d.getSnapshot;d=d.value;try{if(!Nn(m(),d))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function ri(n,i){for(i&=~qh,i&=~pu,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Bt(i),c=1<<a;n[a]=-1,i&=~c}}function jm(n){if((be&6)!==0)throw Error(t(327));lo();var i=ji(n,0);if((i&1)===0)return Jt(n,He()),null;var a=wu(n,i);if(n.tag!==0&&a===2){var c=rn(n);c!==0&&(i=c,a=Kh(n,c))}if(a===1)throw a=ka,ts(n,0),ri(n,i),Jt(n,He()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,ns(n,Xt,Rr),Jt(n,He()),null}function Yh(n,i){var a=be;be|=1;try{return n(i)}finally{be=a,be===0&&(ao=He()+500,Gl&&Yr())}}function es(n){ti!==null&&ti.tag===0&&(be&6)===0&&lo();var i=be;be|=1;var a=vn.transition,c=xe;try{if(vn.transition=null,xe=1,n)return n()}finally{xe=c,vn.transition=a,be=i,(be&6)===0&&Yr()}}function Xh(){un=oo.current,Qe(oo)}function ts(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,B0(a)),lt!==null)for(a=lt.return;a!==null;){var c=a;switch(oh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&Hl();break;case 3:ro(),Qe(Kt),Qe(bt),vh();break;case 5:yh(c);break;case 4:ro();break;case 13:Qe(Ze);break;case 19:Qe(Ze);break;case 10:dh(c.type._context);break;case 22:case 23:Xh()}a=a.return}if(Tt=n,lt=n=ii(n.current,null),xt=un=i,gt=0,ka=null,qh=pu=Zi=0,Xt=xa=null,Yi!==null){for(i=0;i<Yi.length;i++)if(a=Yi[i],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,m=a.pending;if(m!==null){var v=m.next;m.next=d,c.next=v}a.pending=c}Yi=null}return n}function zm(n,i){do{var a=lt;try{if(hh(),ru.current=au,iu){for(var c=et.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}iu=!1}if(Ji=0,Et=mt=et=null,Ia=!1,Sa=0,$h.current=null,a===null||a.return===null){gt=1,ka=i,lt=null;break}e:{var m=n,v=a.return,S=a,k=i;if(i=xt,S.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var j=k,Q=S,Y=Q.tag;if((Q.mode&1)===0&&(Y===0||Y===11||Y===15)){var K=Q.alternate;K?(Q.updateQueue=K.updateQueue,Q.memoizedState=K.memoizedState,Q.lanes=K.lanes):(Q.updateQueue=null,Q.memoizedState=null)}var te=dm(v);if(te!==null){te.flags&=-257,fm(te,v,S,m,i),te.mode&1&&hm(m,j,i),i=te,k=j;var se=i.updateQueue;if(se===null){var oe=new Set;oe.add(k),i.updateQueue=oe}else se.add(k);break e}else{if((i&1)===0){hm(m,j,i),Jh();break e}k=Error(t(426))}}else if(Je&&S.mode&1){var st=dm(v);if(st!==null){(st.flags&65536)===0&&(st.flags|=256),fm(st,v,S,m,i),uh(io(k,S));break e}}m=k=io(k,S),gt!==4&&(gt=2),xa===null?xa=[m]:xa.push(m),m=v;do{switch(m.tag){case 3:m.flags|=65536,i&=-i,m.lanes|=i;var M=um(m,k,i);Lp(m,M);break e;case 1:S=k;var N=m.type,F=m.stateNode;if((m.flags&128)===0&&(typeof N.getDerivedStateFromError=="function"||F!==null&&typeof F.componentDidCatch=="function"&&(ei===null||!ei.has(F)))){m.flags|=65536,i&=-i,m.lanes|=i;var X=cm(m,S,i);Lp(m,X);break e}}m=m.return}while(m!==null)}qm(a)}catch(ae){i=ae,lt===a&&a!==null&&(lt=a=a.return);continue}break}while(!0)}function Bm(){var n=fu.current;return fu.current=au,n===null?au:n}function Jh(){(gt===0||gt===3||gt===2)&&(gt=4),Tt===null||(Zi&268435455)===0&&(pu&268435455)===0||ri(Tt,xt)}function wu(n,i){var a=be;be|=2;var c=Bm();(Tt!==n||xt!==i)&&(Rr=null,ts(n,i));do try{fw();break}catch(d){zm(n,d)}while(!0);if(hh(),be=a,fu.current=c,lt!==null)throw Error(t(261));return Tt=null,xt=0,gt}function fw(){for(;lt!==null;)$m(lt)}function pw(){for(;lt!==null&&!yl();)$m(lt)}function $m(n){var i=Gm(n.alternate,n,un);n.memoizedProps=n.pendingProps,i===null?qm(n):lt=i,$h.current=null}function qm(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=ow(a,i,un),a!==null){lt=a;return}}else{if(a=aw(a,i),a!==null){a.flags&=32767,lt=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{gt=6,lt=null;return}}if(i=i.sibling,i!==null){lt=i;return}lt=i=n}while(i!==null);gt===0&&(gt=5)}function ns(n,i,a){var c=xe,d=vn.transition;try{vn.transition=null,xe=1,mw(n,i,a,c)}finally{vn.transition=d,xe=c}return null}function mw(n,i,a,c){do lo();while(ti!==null);if((be&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var m=a.lanes|a.childLanes;if(ze(n,m),n===Tt&&(lt=Tt=null,xt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||gu||(gu=!0,Km(dn,function(){return lo(),null})),m=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||m){m=vn.transition,vn.transition=null;var v=xe;xe=1;var S=be;be|=4,$h.current=null,uw(n,a),bm(a,n),O0(Jc),qr=!!Xc,Jc=Xc=null,n.current=a,cw(a),Oc(),be=S,xe=v,vn.transition=m}else n.current=a;if(gu&&(gu=!1,ti=n,yu=d),m=n.pendingLanes,m===0&&(ei=null),wl(a.stateNode),Jt(n,He()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)d=i[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(mu)throw mu=!1,n=Wh,Wh=null,n;return(yu&1)!==0&&n.tag!==0&&lo(),m=n.pendingLanes,(m&1)!==0?n===Gh?Na++:(Na=0,Gh=n):Na=0,Yr(),null}function lo(){if(ti!==null){var n=Br(yu),i=vn.transition,a=xe;try{if(vn.transition=null,xe=16>n?16:n,ti===null)var c=!1;else{if(n=ti,ti=null,yu=0,(be&6)!==0)throw Error(t(331));var d=be;for(be|=4,ie=n.current;ie!==null;){var m=ie,v=m.child;if((ie.flags&16)!==0){var S=m.deletions;if(S!==null){for(var k=0;k<S.length;k++){var j=S[k];for(ie=j;ie!==null;){var Q=ie;switch(Q.tag){case 0:case 11:case 15:Pa(8,Q,m)}var Y=Q.child;if(Y!==null)Y.return=Q,ie=Y;else for(;ie!==null;){Q=ie;var K=Q.sibling,te=Q.return;if(km(Q),Q===j){ie=null;break}if(K!==null){K.return=te,ie=K;break}ie=te}}}var se=m.alternate;if(se!==null){var oe=se.child;if(oe!==null){se.child=null;do{var st=oe.sibling;oe.sibling=null,oe=st}while(oe!==null)}}ie=m}}if((m.subtreeFlags&2064)!==0&&v!==null)v.return=m,ie=v;else e:for(;ie!==null;){if(m=ie,(m.flags&2048)!==0)switch(m.tag){case 0:case 11:case 15:Pa(9,m,m.return)}var M=m.sibling;if(M!==null){M.return=m.return,ie=M;break e}ie=m.return}}var N=n.current;for(ie=N;ie!==null;){v=ie;var F=v.child;if((v.subtreeFlags&2064)!==0&&F!==null)F.return=v,ie=F;else e:for(v=N;ie!==null;){if(S=ie,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:du(9,S)}}catch(ae){nt(S,S.return,ae)}if(S===v){ie=null;break e}var X=S.sibling;if(X!==null){X.return=S.return,ie=X;break e}ie=S.return}}if(be=d,Yr(),nn&&typeof nn.onPostCommitFiberRoot=="function")try{nn.onPostCommitFiberRoot(Ui,n)}catch{}c=!0}return c}finally{xe=a,vn.transition=i}}return!1}function Hm(n,i,a){i=io(a,i),i=um(n,i,1),n=Jr(n,i,1),i=Ht(),n!==null&&(jr(n,1,i),Jt(n,i))}function nt(n,i,a){if(n.tag===3)Hm(n,n,a);else for(;i!==null;){if(i.tag===3){Hm(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(ei===null||!ei.has(c))){n=io(a,n),n=cm(i,n,1),i=Jr(i,n,1),n=Ht(),i!==null&&(jr(i,1,n),Jt(i,n));break}}i=i.return}}function gw(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=Ht(),n.pingedLanes|=n.suspendedLanes&a,Tt===n&&(xt&a)===a&&(gt===4||gt===3&&(xt&130023424)===xt&&500>He()-Hh?ts(n,0):qh|=a),Jt(n,i)}function Wm(n,i){i===0&&((n.mode&1)===0?i=1:(i=Ns,Ns<<=1,(Ns&130023424)===0&&(Ns=4194304)));var a=Ht();n=Ir(n,i),n!==null&&(jr(n,i,a),Jt(n,a))}function yw(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),Wm(n,a)}function _w(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),Wm(n,a)}var Gm;Gm=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||Kt.current)Yt=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return Yt=!1,sw(n,i,a);Yt=(n.flags&131072)!==0}else Yt=!1,Je&&(i.flags&1048576)!==0&&Rp(i,Ql,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;cu(n,i),n=i.pendingProps;var d=Ys(i,bt.current);no(i,a),d=Th(null,i,c,n,d,a);var m=Ih();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Qt(c)?(m=!0,Wl(i)):m=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,mh(i),d.updater=lu,i.stateNode=d,d._reactInternals=i,kh(i,c,n,a),i=Vh(null,i,c,!0,m,a)):(i.tag=0,Je&&m&&sh(i),qt(null,i,d,a),i=i.child),i;case 16:c=i.elementType;e:{switch(cu(n,i),n=i.pendingProps,d=c._init,c=d(c._payload),i.type=c,d=i.tag=ww(c),n=Vn(c,n),d){case 0:i=Dh(null,i,c,n,a);break e;case 1:i=vm(null,i,c,n,a);break e;case 11:i=pm(null,i,c,n,a);break e;case 14:i=mm(null,i,c,Vn(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Vn(c,d),Dh(n,i,c,d,a);case 1:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Vn(c,d),vm(n,i,c,d,a);case 3:e:{if(wm(i),n===null)throw Error(t(387));c=i.pendingProps,m=i.memoizedState,d=m.element,Op(n,i),tu(i,c,null,a);var v=i.memoizedState;if(c=v.element,m.isDehydrated)if(m={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},i.updateQueue.baseState=m,i.memoizedState=m,i.flags&256){d=io(Error(t(423)),i),i=Em(n,i,c,a,d);break e}else if(c!==d){d=io(Error(t(424)),i),i=Em(n,i,c,a,d);break e}else for(ln=Gr(i.stateNode.containerInfo.firstChild),an=i,Je=!0,Dn=null,a=Vp(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Zs(),c===d){i=Ar(n,i,a);break e}qt(n,i,c,a)}i=i.child}return i;case 5:return Fp(i),n===null&&lh(i),c=i.type,d=i.pendingProps,m=n!==null?n.memoizedProps:null,v=d.children,Zc(c,d)?v=null:m!==null&&Zc(c,m)&&(i.flags|=32),_m(n,i),qt(n,i,v,a),i.child;case 6:return n===null&&lh(i),null;case 13:return Tm(n,i,a);case 4:return gh(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=eo(i,null,c,a):qt(n,i,c,a),i.child;case 11:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Vn(c,d),pm(n,i,c,d,a);case 7:return qt(n,i,i.pendingProps,a),i.child;case 8:return qt(n,i,i.pendingProps.children,a),i.child;case 12:return qt(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,d=i.pendingProps,m=i.memoizedProps,v=d.value,We(Jl,c._currentValue),c._currentValue=v,m!==null)if(Nn(m.value,v)){if(m.children===d.children&&!Kt.current){i=Ar(n,i,a);break e}}else for(m=i.child,m!==null&&(m.return=i);m!==null;){var S=m.dependencies;if(S!==null){v=m.child;for(var k=S.firstContext;k!==null;){if(k.context===c){if(m.tag===1){k=Sr(-1,a&-a),k.tag=2;var j=m.updateQueue;if(j!==null){j=j.shared;var Q=j.pending;Q===null?k.next=k:(k.next=Q.next,Q.next=k),j.pending=k}}m.lanes|=a,k=m.alternate,k!==null&&(k.lanes|=a),fh(m.return,a,i),S.lanes|=a;break}k=k.next}}else if(m.tag===10)v=m.type===i.type?null:m.child;else if(m.tag===18){if(v=m.return,v===null)throw Error(t(341));v.lanes|=a,S=v.alternate,S!==null&&(S.lanes|=a),fh(v,a,i),v=m.sibling}else v=m.child;if(v!==null)v.return=m;else for(v=m;v!==null;){if(v===i){v=null;break}if(m=v.sibling,m!==null){m.return=v.return,v=m;break}v=v.return}m=v}qt(n,i,d.children,a),i=i.child}return i;case 9:return d=i.type,c=i.pendingProps.children,no(i,a),d=yn(d),c=c(d),i.flags|=1,qt(n,i,c,a),i.child;case 14:return c=i.type,d=Vn(c,i.pendingProps),d=Vn(c.type,d),mm(n,i,c,d,a);case 15:return gm(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:Vn(c,d),cu(n,i),i.tag=1,Qt(c)?(n=!0,Wl(i)):n=!1,no(i,a),am(i,c,d),kh(i,c,d,a),Vh(null,i,c,!0,n,a);case 19:return Sm(n,i,a);case 22:return ym(n,i,a)}throw Error(t(156,i.tag))};function Km(n,i){return ks(n,i)}function vw(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wn(n,i,a,c){return new vw(n,i,a,c)}function Zh(n){return n=n.prototype,!(!n||!n.isReactComponent)}function ww(n){if(typeof n=="function")return Zh(n)?1:0;if(n!=null){if(n=n.$$typeof,n===V)return 11;if(n===_t)return 14}return 2}function ii(n,i){var a=n.alternate;return a===null?(a=wn(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function Eu(n,i,a,c,d,m){var v=2;if(c=n,typeof n=="function")Zh(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case D:return rs(a.children,d,m,i);case A:v=8,d|=8;break;case I:return n=wn(12,a,i,d|2),n.elementType=I,n.lanes=m,n;case R:return n=wn(13,a,i,d),n.elementType=R,n.lanes=m,n;case $e:return n=wn(19,a,i,d),n.elementType=$e,n.lanes=m,n;case Fe:return Tu(a,d,m,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case P:v=10;break e;case x:v=9;break e;case V:v=11;break e;case _t:v=14;break e;case Rt:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=wn(v,a,i,d),i.elementType=n,i.type=c,i.lanes=m,i}function rs(n,i,a,c){return n=wn(7,n,c,i),n.lanes=a,n}function Tu(n,i,a,c){return n=wn(22,n,c,i),n.elementType=Fe,n.lanes=a,n.stateNode={isHidden:!1},n}function ed(n,i,a){return n=wn(6,n,null,i),n.lanes=a,n}function td(n,i,a){return i=wn(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Ew(n,i,a,c,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ur(0),this.expirationTimes=Ur(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ur(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function nd(n,i,a,c,d,m,v,S,k){return n=new Ew(n,i,a,S,k),i===1?(i=1,m===!0&&(i|=8)):i=0,m=wn(3,null,null,i),n.current=m,m.stateNode=n,m.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},mh(m),n}function Tw(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Te,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function Qm(n){if(!n)return Qr;n=n._reactInternals;e:{if(Sn(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Qt(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(Qt(a))return Ip(n,a,i)}return i}function Ym(n,i,a,c,d,m,v,S,k){return n=nd(a,c,!0,n,d,m,v,S,k),n.context=Qm(null),a=n.current,c=Ht(),d=ni(a),m=Sr(c,d),m.callback=i??null,Jr(a,m,d),n.current.lanes=d,jr(n,d,c),Jt(n,c),n}function Iu(n,i,a,c){var d=i.current,m=Ht(),v=ni(d);return a=Qm(a),i.context===null?i.context=a:i.pendingContext=a,i=Sr(m,v),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=Jr(d,i,v),n!==null&&(Ln(n,d,v,m),eu(n,d,v)),v}function Su(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Xm(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function rd(n,i){Xm(n,i),(n=n.alternate)&&Xm(n,i)}function Iw(){return null}var Jm=typeof reportError=="function"?reportError:function(n){console.error(n)};function id(n){this._internalRoot=n}Au.prototype.render=id.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));Iu(n,i,null,null)},Au.prototype.unmount=id.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;es(function(){Iu(null,n,null,null)}),i[vr]=null}};function Au(n){this._internalRoot=n}Au.prototype.unstable_scheduleHydration=function(n){if(n){var i=Al();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Gn.length&&i!==0&&i<Gn[a].priority;a++);Gn.splice(a,0,n),a===0&&Pl(n)}};function sd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Ru(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Zm(){}function Sw(n,i,a,c,d){if(d){if(typeof c=="function"){var m=c;c=function(){var j=Su(v);m.call(j)}}var v=Ym(i,c,n,0,null,!1,!1,"",Zm);return n._reactRootContainer=v,n[vr]=v.current,ma(n.nodeType===8?n.parentNode:n),es(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var S=c;c=function(){var j=Su(k);S.call(j)}}var k=nd(n,0,!1,null,null,!1,!1,"",Zm);return n._reactRootContainer=k,n[vr]=k.current,ma(n.nodeType===8?n.parentNode:n),es(function(){Iu(i,k,a,c)}),k}function Cu(n,i,a,c,d){var m=a._reactRootContainer;if(m){var v=m;if(typeof d=="function"){var S=d;d=function(){var k=Su(v);S.call(k)}}Iu(i,v,n,d)}else v=Sw(a,i,n,d,c);return Su(v)}Il=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Fr(i.pendingLanes);a!==0&&(zr(i,a|1),Jt(i,He()),(be&6)===0&&(ao=He()+500,Yr()))}break;case 13:es(function(){var c=Ir(n,1);if(c!==null){var d=Ht();Ln(c,n,1,d)}}),rd(n,1)}},Ds=function(n){if(n.tag===13){var i=Ir(n,134217728);if(i!==null){var a=Ht();Ln(i,n,134217728,a)}rd(n,134217728)}},Sl=function(n){if(n.tag===13){var i=ni(n),a=Ir(n,i);if(a!==null){var c=Ht();Ln(a,n,i,c)}rd(n,i)}},Al=function(){return xe},Rl=function(n,i){var a=xe;try{return xe=n,i()}finally{xe=a}},Is=function(n,i,a){switch(i){case"input":if(jo(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var d=ql(c);if(!d)throw Error(t(90));ys(c),jo(c,d)}}}break;case"textarea":Es(n,a);break;case"select":i=a.value,i!=null&&hr(n,!!a.multiple,i,!1)}},bi=Yh,Yo=es;var Aw={usingClientEntryPoint:!1,Events:[_a,Ks,ql,Hn,Qo,Yh]},Da={findFiberByHostInstance:Wi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Rw={bundleType:Da.bundleType,version:Da.version,rendererPackageName:Da.rendererPackageName,rendererConfig:Da.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ee.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Zo(n),n===null?null:n.stateNode},findFiberByHostInstance:Da.findFiberByHostInstance||Iw,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Pu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Pu.isDisabled&&Pu.supportsFiber)try{Ui=Pu.inject(Rw),nn=Pu}catch{}}return Zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Aw,Zt.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!sd(i))throw Error(t(200));return Tw(n,i,null,a)},Zt.createRoot=function(n,i){if(!sd(n))throw Error(t(299));var a=!1,c="",d=Jm;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=nd(n,1,!1,null,null,a,!1,c,d),n[vr]=i.current,ma(n.nodeType===8?n.parentNode:n),new id(i)},Zt.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=Zo(i),n=n===null?null:n.stateNode,n},Zt.flushSync=function(n){return es(n)},Zt.hydrate=function(n,i,a){if(!Ru(i))throw Error(t(200));return Cu(null,n,i,!0,a)},Zt.hydrateRoot=function(n,i,a){if(!sd(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,m="",v=Jm;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(m=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),i=Ym(i,null,n,1,a??null,d,!1,m,v),n[vr]=i.current,ma(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,d]:i.mutableSourceEagerHydrationData.push(a,d);return new Au(i)},Zt.render=function(n,i,a){if(!Ru(i))throw Error(t(200));return Cu(null,n,i,!1,a)},Zt.unmountComponentAtNode=function(n){if(!Ru(n))throw Error(t(40));return n._reactRootContainer?(es(function(){Cu(null,null,n,!1,function(){n._reactRootContainer=null,n[vr]=null})}),!0):!1},Zt.unstable_batchedUpdates=Yh,Zt.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!Ru(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Cu(n,i,a,!1,c)},Zt.version="18.3.1-next-f1338f8080-20240426",Zt}var ag;function Ow(){if(ag)return ld.exports;ag=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),ld.exports=bw(),ld.exports}var lg;function Lw(){if(lg)return ku;lg=1;var r=Ow();return ku.createRoot=r.createRoot,ku.hydrateRoot=r.hydrateRoot,ku}var Mw=Lw();const Fw=By(Mw),Uw=()=>{};var ug={};/**
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
 */const $y=function(r){const e=[];let t=0;for(let s=0;s<r.length;s++){let o=r.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},jw=function(r){const e=[];let t=0,s=0;for(;t<r.length;){const o=r[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[s++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],f=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|f&63)-65536;e[s++]=String.fromCharCode(55296+(g>>10)),e[s++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[s++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},qy={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,f=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,E=l>>2,T=(l&3)<<4|f>>4;let C=(f&15)<<2|_>>6,U=_&63;g||(U=64,h||(C=64)),s.push(t[E],t[T],t[C],t[U])}return s.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray($y(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):jw(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],f=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const T=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||f==null||_==null||T==null)throw new zw;const C=l<<2|f>>4;if(s.push(C),_!==64){const U=f<<4&240|_>>2;if(s.push(U),T!==64){const $=_<<6&192|T;s.push($)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class zw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Bw=function(r){const e=$y(r);return qy.encodeByteArray(e,!0)},Wu=function(r){return Bw(r).replace(/\./g,"")},Hy=function(r){try{return qy.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function $w(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const qw=()=>$w().__FIREBASE_DEFAULTS__,Hw=()=>{if(typeof process>"u"||typeof ug>"u")return;const r=ug.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Ww=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Hy(r[1]);return e&&JSON.parse(e)},hc=()=>{try{return Uw()||qw()||Hw()||Ww()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Wy=r=>{var e,t;return(t=(e=hc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},Gw=r=>{const e=Wy(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Gy=()=>{var r;return(r=hc())===null||r===void 0?void 0:r.config},Ky=r=>{var e;return(e=hc())===null||e===void 0?void 0:e[`_${r}`]};/**
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
 */class Kw{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function ko(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Qy(r){return(await fetch(r,{credentials:"include"})).ok}/**
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
 */function Qw(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Wu(JSON.stringify(t)),Wu(JSON.stringify(h)),""].join(".")}const ja={};function Yw(){const r={prod:[],emulator:[]};for(const e of Object.keys(ja))ja[e]?r.emulator.push(e):r.prod.push(e);return r}function Xw(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let cg=!1;function Yy(r,e){if(typeof window>"u"||typeof document>"u"||!ko(window.location.host)||ja[r]===e||ja[r]||cg)return;ja[r]=e;function t(C){return`__firebase__banner__${C}`}const s="__firebase__banner",l=Yw().prod.length>0;function h(){const C=document.getElementById(s);C&&C.remove()}function f(C){C.style.display="flex",C.style.background="#7faaf0",C.style.position="fixed",C.style.bottom="5px",C.style.left="5px",C.style.padding=".5em",C.style.borderRadius="5px",C.style.alignItems="center"}function g(C,U){C.setAttribute("width","24"),C.setAttribute("id",U),C.setAttribute("height","24"),C.setAttribute("viewBox","0 0 24 24"),C.setAttribute("fill","none"),C.style.marginLeft="-6px"}function _(){const C=document.createElement("span");return C.style.cursor="pointer",C.style.marginLeft="16px",C.style.fontSize="24px",C.innerHTML=" &times;",C.onclick=()=>{cg=!0,h()},C}function E(C,U){C.setAttribute("id",U),C.innerText="Learn more",C.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",C.setAttribute("target","__blank"),C.style.paddingLeft="5px",C.style.textDecoration="underline"}function T(){const C=Xw(s),U=t("text"),$=document.getElementById(U)||document.createElement("span"),G=t("learnmore"),q=document.getElementById(G)||document.createElement("a"),me=t("preprendIcon"),ce=document.getElementById(me)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(C.created){const pe=C.element;f(pe),E(q,G);const Ee=_();g(ce,me),pe.append(ce,$,q,Ee),document.body.appendChild(pe)}l?($.innerText="Preview backend disconnected.",ce.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
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
</defs>`,$.innerText="Preview backend running in this workspace."),$.setAttribute("id",U)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",T):T()}/**
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
 */function zt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Jw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(zt())}function Zw(){var r;const e=(r=hc())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function eE(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function tE(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function nE(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function rE(){const r=zt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function iE(){return!Zw()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function sE(){try{return typeof indexedDB=="object"}catch{return!1}}function oE(){return new Promise((r,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)===null||l===void 0?void 0:l.message)||"")}}catch(t){e(t)}})}/**
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
 */const aE="FirebaseError";class br extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=aE,Object.setPrototypeOf(this,br.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,rl.prototype.create)}}class rl{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?lE(l,s):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new br(o,f,s)}}function lE(r,e){return r.replace(uE,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const uE=/\{\$([^}]+)}/g;function cE(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function kr(r,e){if(r===e)return!0;const t=Object.keys(r),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const l=r[o],h=e[o];if(hg(l)&&hg(h)){if(!kr(l,h))return!1}else if(l!==h)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function hg(r){return r!==null&&typeof r=="object"}/**
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
 */function il(r){const e=[];for(const[t,s]of Object.entries(r))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function ba(r){const e={};return r.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[o,l]=s.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function Oa(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function hE(r,e){const t=new dE(r,e);return t.subscribe.bind(t)}class dE{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");fE(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=hd),o.error===void 0&&(o.error=hd),o.complete===void 0&&(o.complete=hd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fE(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function hd(){}/**
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
 */function At(r){return r&&r._delegate?r._delegate:r}class as{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const is="[DEFAULT]";/**
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
 */class pE{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Kw;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(l){if(o)return null;throw l}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(gE(e))try{this.getOrInitializeService({instanceIdentifier:is})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});s.resolve(l)}catch{}}}}clearInstance(e=is){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=is){return this.instances.has(e)}getOptions(e=is){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[l,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(l);s===f&&h.resolve(o)}return o}onInit(e,t){var s;const o=this.normalizeInstanceIdentifier(t),l=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;l.add(e),this.onInitCallbacks.set(o,l);const h=this.instances.get(o);return h&&e(h,o),()=>{l.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:mE(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=is){return this.component?this.component.multipleInstances?e:is:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function mE(r){return r===is?void 0:r}function gE(r){return r.instantiationMode==="EAGER"}/**
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
 */class yE{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new pE(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Pe;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Pe||(Pe={}));const _E={debug:Pe.DEBUG,verbose:Pe.VERBOSE,info:Pe.INFO,warn:Pe.WARN,error:Pe.ERROR,silent:Pe.SILENT},vE=Pe.INFO,wE={[Pe.DEBUG]:"log",[Pe.VERBOSE]:"log",[Pe.INFO]:"info",[Pe.WARN]:"warn",[Pe.ERROR]:"error"},EE=(r,e,...t)=>{if(e<r.logLevel)return;const s=new Date().toISOString(),o=wE[e];if(o)console[o](`[${s}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Yd{constructor(e){this.name=e,this._logLevel=vE,this._logHandler=EE,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Pe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?_E[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Pe.DEBUG,...e),this._logHandler(this,Pe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Pe.VERBOSE,...e),this._logHandler(this,Pe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Pe.INFO,...e),this._logHandler(this,Pe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Pe.WARN,...e),this._logHandler(this,Pe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Pe.ERROR,...e),this._logHandler(this,Pe.ERROR,...e)}}const TE=(r,e)=>e.some(t=>r instanceof t);let dg,fg;function IE(){return dg||(dg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function SE(){return fg||(fg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Xy=new WeakMap,Id=new WeakMap,Jy=new WeakMap,dd=new WeakMap,Xd=new WeakMap;function AE(r){const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(di(r.result)),o()},h=()=>{s(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&Xy.set(t,r)}).catch(()=>{}),Xd.set(e,r),e}function RE(r){if(Id.has(r))return;const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{s(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});Id.set(r,e)}let Sd={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Id.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Jy.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return di(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function CE(r){Sd=r(Sd)}function PE(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=r.call(fd(this),e,...t);return Jy.set(s,e.sort?e.sort():[e]),di(s)}:SE().includes(r)?function(...e){return r.apply(fd(this),e),di(Xy.get(this))}:function(...e){return di(r.apply(fd(this),e))}}function kE(r){return typeof r=="function"?PE(r):(r instanceof IDBTransaction&&RE(r),TE(r,IE())?new Proxy(r,Sd):r)}function di(r){if(r instanceof IDBRequest)return AE(r);if(dd.has(r))return dd.get(r);const e=kE(r);return e!==r&&(dd.set(r,e),Xd.set(e,r)),e}const fd=r=>Xd.get(r);function xE(r,e,{blocked:t,upgrade:s,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),f=di(h);return s&&h.addEventListener("upgradeneeded",g=>{s(di(h.result),g.oldVersion,g.newVersion,di(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),f}const NE=["get","getKey","getAll","getAllKeys","count"],DE=["put","add","delete","clear"],pd=new Map;function pg(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(pd.get(e))return pd.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=DE.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||NE.includes(t)))return;const l=async function(h,...f){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return s&&(_=_.index(f.shift())),(await Promise.all([_[t](...f),o&&g.done]))[0]};return pd.set(e,l),l}CE(r=>({...r,get:(e,t,s)=>pg(e,t)||r.get(e,t,s),has:(e,t)=>!!pg(e,t)||r.has(e,t)}));/**
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
 */class VE{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(bE(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function bE(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ad="@firebase/app",mg="0.13.2";/**
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
 */const xr=new Yd("@firebase/app"),OE="@firebase/app-compat",LE="@firebase/analytics-compat",ME="@firebase/analytics",FE="@firebase/app-check-compat",UE="@firebase/app-check",jE="@firebase/auth",zE="@firebase/auth-compat",BE="@firebase/database",$E="@firebase/data-connect",qE="@firebase/database-compat",HE="@firebase/functions",WE="@firebase/functions-compat",GE="@firebase/installations",KE="@firebase/installations-compat",QE="@firebase/messaging",YE="@firebase/messaging-compat",XE="@firebase/performance",JE="@firebase/performance-compat",ZE="@firebase/remote-config",eT="@firebase/remote-config-compat",tT="@firebase/storage",nT="@firebase/storage-compat",rT="@firebase/firestore",iT="@firebase/ai",sT="@firebase/firestore-compat",oT="firebase",aT="11.10.0";/**
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
 */const Rd="[DEFAULT]",lT={[Ad]:"fire-core",[OE]:"fire-core-compat",[ME]:"fire-analytics",[LE]:"fire-analytics-compat",[UE]:"fire-app-check",[FE]:"fire-app-check-compat",[jE]:"fire-auth",[zE]:"fire-auth-compat",[BE]:"fire-rtdb",[$E]:"fire-data-connect",[qE]:"fire-rtdb-compat",[HE]:"fire-fn",[WE]:"fire-fn-compat",[GE]:"fire-iid",[KE]:"fire-iid-compat",[QE]:"fire-fcm",[YE]:"fire-fcm-compat",[XE]:"fire-perf",[JE]:"fire-perf-compat",[ZE]:"fire-rc",[eT]:"fire-rc-compat",[tT]:"fire-gcs",[nT]:"fire-gcs-compat",[rT]:"fire-fst",[sT]:"fire-fst-compat",[iT]:"fire-vertex","fire-js":"fire-js",[oT]:"fire-js-all"};/**
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
 */const Gu=new Map,uT=new Map,Cd=new Map;function gg(r,e){try{r.container.addComponent(e)}catch(t){xr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function wo(r){const e=r.name;if(Cd.has(e))return xr.debug(`There were multiple attempts to register component ${e}.`),!1;Cd.set(e,r);for(const t of Gu.values())gg(t,r);for(const t of uT.values())gg(t,r);return!0}function Jd(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Mn(r){return r==null?!1:r.settings!==void 0}/**
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
 */const cT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},fi=new rl("app","Firebase",cT);/**
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
 */class hT{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new as("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw fi.create("app-deleted",{appName:this._name})}}/**
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
 */const xo=aT;function Zy(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Rd,automaticDataCollectionEnabled:!0},e),o=s.name;if(typeof o!="string"||!o)throw fi.create("bad-app-name",{appName:String(o)});if(t||(t=Gy()),!t)throw fi.create("no-options");const l=Gu.get(o);if(l){if(kr(t,l.options)&&kr(s,l.config))return l;throw fi.create("duplicate-app",{appName:o})}const h=new yE(o);for(const g of Cd.values())h.addComponent(g);const f=new hT(t,s,h);return Gu.set(o,f),f}function e_(r=Rd){const e=Gu.get(r);if(!e&&r===Rd&&Gy())return Zy();if(!e)throw fi.create("no-app",{appName:r});return e}function pi(r,e,t){var s;let o=(s=lT[r])!==null&&s!==void 0?s:r;t&&(o+=`-${t}`);const l=o.match(/\s|\//),h=e.match(/\s|\//);if(l||h){const f=[`Unable to register library "${o}" with version "${e}":`];l&&f.push(`library name "${o}" contains illegal characters (whitespace or "/")`),l&&h&&f.push("and"),h&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),xr.warn(f.join(" "));return}wo(new as(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
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
 */const dT="firebase-heartbeat-database",fT=1,Wa="firebase-heartbeat-store";let md=null;function t_(){return md||(md=xE(dT,fT,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(Wa)}catch(t){console.warn(t)}}}}).catch(r=>{throw fi.create("idb-open",{originalErrorMessage:r.message})})),md}async function pT(r){try{const t=(await t_()).transaction(Wa),s=await t.objectStore(Wa).get(n_(r));return await t.done,s}catch(e){if(e instanceof br)xr.warn(e.message);else{const t=fi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});xr.warn(t.message)}}}async function yg(r,e){try{const s=(await t_()).transaction(Wa,"readwrite");await s.objectStore(Wa).put(e,n_(r)),await s.done}catch(t){if(t instanceof br)xr.warn(t.message);else{const s=fi.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});xr.warn(s.message)}}}function n_(r){return`${r.name}!${r.options.appId}`}/**
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
 */const mT=1024,gT=30;class yT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new vT(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=_g();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>gT){const h=wT(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){xr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=_g(),{heartbeatsToSend:s,unsentEntries:o}=_T(this._heartbeatsCache.heartbeats),l=Wu(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return xr.warn(t),""}}}function _g(){return new Date().toISOString().substring(0,10)}function _T(r,e=mT){const t=[];let s=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),vg(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),vg(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class vT{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return sE()?oE().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await pT(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return yg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return yg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function vg(r){return Wu(JSON.stringify({version:2,heartbeats:r})).length}function wT(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let s=1;s<r.length;s++)r[s].date<t&&(t=r[s].date,e=s);return e}/**
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
 */function ET(r){wo(new as("platform-logger",e=>new VE(e),"PRIVATE")),wo(new as("heartbeat",e=>new yT(e),"PRIVATE")),pi(Ad,mg,r),pi(Ad,mg,"esm2017"),pi("fire-js","")}ET("");function Zd(r,e){var t={};for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(r);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(r,s[o])&&(t[s[o]]=r[s[o]]);return t}function r_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const TT=r_,i_=new rl("auth","Firebase",r_());/**
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
 */const Ku=new Yd("@firebase/auth");function IT(r,...e){Ku.logLevel<=Pe.WARN&&Ku.warn(`Auth (${xo}): ${r}`,...e)}function Lu(r,...e){Ku.logLevel<=Pe.ERROR&&Ku.error(`Auth (${xo}): ${r}`,...e)}/**
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
 */function Bn(r,...e){throw ef(r,...e)}function nr(r,...e){return ef(r,...e)}function s_(r,e,t){const s=Object.assign(Object.assign({},TT()),{[e]:t});return new rl("auth","Firebase",s).create(e,{appName:r.name})}function mi(r){return s_(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ef(r,...e){if(typeof r!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(t,...s)}return i_.create(r,...e)}function ge(r,e,...t){if(!r)throw ef(e,...t)}function Cr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Lu(e),new Error(e)}function Nr(r,e){r||Cr(e)}/**
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
 */function Pd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function ST(){return wg()==="http:"||wg()==="https:"}function wg(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
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
 */function AT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ST()||tE()||"connection"in navigator)?navigator.onLine:!0}function RT(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
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
 */class sl{constructor(e,t){this.shortDelay=e,this.longDelay=t,Nr(t>e,"Short delay should be less than long delay!"),this.isMobile=Jw()||nE()}get(){return AT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function tf(r,e){Nr(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class o_{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Cr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Cr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Cr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const PT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],kT=new sl(3e4,6e4);function fs(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Ri(r,e,t,s,o={}){return a_(r,o,async()=>{let l={},h={};s&&(e==="GET"?h=s:l={body:JSON.stringify(s)});const f=il(Object.assign({key:r.config.apiKey},h)).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _=Object.assign({method:e,headers:g},l);return eE()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&ko(r.emulatorConfig.host)&&(_.credentials="include"),o_.fetch()(await l_(r,r.config.apiHost,t,f),_)})}async function a_(r,e,t){r._canInitEmulator=!1;const s=Object.assign(Object.assign({},CT),e);try{const o=new NT(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw xu(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const f=l.ok?h.errorMessage:h.error.message,[g,_]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw xu(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw xu(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw xu(r,"user-disabled",h);const E=s[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw s_(r,E,_);Bn(r,E)}}catch(o){if(o instanceof br)throw o;Bn(r,"network-request-failed",{message:String(o)})}}async function dc(r,e,t,s,o={}){const l=await Ri(r,e,t,s,o);return"mfaPendingCredential"in l&&Bn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function l_(r,e,t,s){const o=`${e}${t}?${s}`,l=r,h=l.config.emulator?tf(r.config,o):`${r.config.apiScheme}://${o}`;return PT.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function xT(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class NT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(nr(this.auth,"network-request-failed")),kT.get())})}}function xu(r,e,t){const s={appName:r.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=nr(r,e,s);return o.customData._tokenResponse=t,o}function Eg(r){return r!==void 0&&r.enterprise!==void 0}class DT{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return xT(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function VT(r,e){return Ri(r,"GET","/v2/recaptchaConfig",fs(r,e))}/**
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
 */async function bT(r,e){return Ri(r,"POST","/v1/accounts:delete",e)}async function Qu(r,e){return Ri(r,"POST","/v1/accounts:lookup",e)}/**
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
 */function za(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function OT(r,e=!1){const t=At(r),s=await t.getIdToken(e),o=nf(s);ge(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:s,authTime:za(gd(o.auth_time)),issuedAtTime:za(gd(o.iat)),expirationTime:za(gd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function gd(r){return Number(r)*1e3}function nf(r){const[e,t,s]=r.split(".");if(e===void 0||t===void 0||s===void 0)return Lu("JWT malformed, contained fewer than 3 sections"),null;try{const o=Hy(t);return o?JSON.parse(o):(Lu("Failed to decode base64 JWT payload"),null)}catch(o){return Lu("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function Tg(r){const e=nf(r);return ge(e,"internal-error"),ge(typeof e.exp<"u","internal-error"),ge(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Ga(r,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof br&&LT(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function LT({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
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
 */class kd{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=za(this.lastLoginAt),this.creationTime=za(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Yu(r){var e;const t=r.auth,s=await r.getIdToken(),o=await Ga(r,Qu(t,{idToken:s}));ge(o==null?void 0:o.users.length,t,"internal-error");const l=o.users[0];r._notifyReloadListener(l);const h=!((e=l.providerUserInfo)===null||e===void 0)&&e.length?u_(l.providerUserInfo):[],f=UT(r.providerData,h),g=r.isAnonymous,_=!(r.email&&l.passwordHash)&&!(f!=null&&f.length),E=g?_:!1,T={uid:l.localId,displayName:l.displayName||null,photoURL:l.photoUrl||null,email:l.email||null,emailVerified:l.emailVerified||!1,phoneNumber:l.phoneNumber||null,tenantId:l.tenantId||null,providerData:f,metadata:new kd(l.createdAt,l.lastLoginAt),isAnonymous:E};Object.assign(r,T)}async function FT(r){const e=At(r);await Yu(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function UT(r,e){return[...r.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function u_(r){return r.map(e=>{var{providerId:t}=e,s=Zd(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function jT(r,e){const t=await a_(r,{},async()=>{const s=il({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await l_(r,o,"/v1/token",`key=${l}`),f=await r._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:s};return r.emulatorConfig&&ko(r.emulatorConfig.host)&&(g.credentials="include"),o_.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function zT(r,e){return Ri(r,"POST","/v2/accounts:revokeToken",fs(r,e))}/**
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
 */class mo{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ge(e.idToken,"internal-error"),ge(typeof e.idToken<"u","internal-error"),ge(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Tg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ge(e.length!==0,"internal-error");const t=Tg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ge(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:l}=await jT(e,t);this.updateTokensAndExpiration(s,o,Number(l))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:l}=t,h=new mo;return s&&(ge(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),o&&(ge(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(ge(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new mo,this.toJSON())}_performRefresh(){return Cr("not implemented")}}/**
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
 */function oi(r,e){ge(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Fn{constructor(e){var{uid:t,auth:s,stsTokenManager:o}=e,l=Zd(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new MT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=l.displayName||null,this.email=l.email||null,this.emailVerified=l.emailVerified||!1,this.phoneNumber=l.phoneNumber||null,this.photoURL=l.photoURL||null,this.isAnonymous=l.isAnonymous||!1,this.tenantId=l.tenantId||null,this.providerData=l.providerData?[...l.providerData]:[],this.metadata=new kd(l.createdAt||void 0,l.lastLoginAt||void 0)}async getIdToken(e){const t=await Ga(this,this.stsTokenManager.getToken(this.auth,e));return ge(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return OT(this,e)}reload(){return FT(this)}_assign(e){this!==e&&(ge(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Fn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){ge(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Yu(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Mn(this.auth.app))return Promise.reject(mi(this.auth));const e=await this.getIdToken();return await Ga(this,bT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,o,l,h,f,g,_,E;const T=(s=t.displayName)!==null&&s!==void 0?s:void 0,C=(o=t.email)!==null&&o!==void 0?o:void 0,U=(l=t.phoneNumber)!==null&&l!==void 0?l:void 0,$=(h=t.photoURL)!==null&&h!==void 0?h:void 0,G=(f=t.tenantId)!==null&&f!==void 0?f:void 0,q=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,me=(_=t.createdAt)!==null&&_!==void 0?_:void 0,ce=(E=t.lastLoginAt)!==null&&E!==void 0?E:void 0,{uid:pe,emailVerified:Ee,isAnonymous:Be,providerData:Te,stsTokenManager:D}=t;ge(pe&&D,e,"internal-error");const A=mo.fromJSON(this.name,D);ge(typeof pe=="string",e,"internal-error"),oi(T,e.name),oi(C,e.name),ge(typeof Ee=="boolean",e,"internal-error"),ge(typeof Be=="boolean",e,"internal-error"),oi(U,e.name),oi($,e.name),oi(G,e.name),oi(q,e.name),oi(me,e.name),oi(ce,e.name);const I=new Fn({uid:pe,auth:e,email:C,emailVerified:Ee,displayName:T,isAnonymous:Be,photoURL:$,phoneNumber:U,tenantId:G,stsTokenManager:A,createdAt:me,lastLoginAt:ce});return Te&&Array.isArray(Te)&&(I.providerData=Te.map(P=>Object.assign({},P))),q&&(I._redirectEventId=q),I}static async _fromIdTokenResponse(e,t,s=!1){const o=new mo;o.updateFromServerResponse(t);const l=new Fn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await Yu(l),l}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];ge(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?u_(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),f=new mo;f.updateFromIdToken(s);const g=new Fn({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new kd(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
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
 */const Ig=new Map;function Pr(r){Nr(r instanceof Function,"Expected a class definition");let e=Ig.get(r);return e?(Nr(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Ig.set(r,e),e)}/**
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
 */class c_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}c_.type="NONE";const Sg=c_;/**
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
 */function Mu(r,e,t){return`firebase:${r}:${e}:${t}`}class go{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:l}=this.auth;this.fullUserKey=Mu(this.userKey,o.apiKey,l),this.fullPersistenceKey=Mu("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Qu(this.auth,{idToken:e}).catch(()=>{});return t?Fn._fromGetAccountInfoResponse(this.auth,t,e):null}return Fn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new go(Pr(Sg),e,s);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Pr(Sg);const h=Mu(s,e.config.apiKey,e.name);let f=null;for(const _ of t)try{const E=await _._get(h);if(E){let T;if(typeof E=="string"){const C=await Qu(e,{idToken:E}).catch(()=>{});if(!C)break;T=await Fn._fromGetAccountInfoResponse(e,C,E)}else T=Fn._fromJSON(e,E);_!==l&&(f=T),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new go(l,e,s):(l=g[0],f&&await l._set(h,f.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new go(l,e,s))}}/**
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
 */function Ag(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(p_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(h_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(g_(e))return"Blackberry";if(y_(e))return"Webos";if(d_(e))return"Safari";if((e.includes("chrome/")||f_(e))&&!e.includes("edge/"))return"Chrome";if(m_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function h_(r=zt()){return/firefox\//i.test(r)}function d_(r=zt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function f_(r=zt()){return/crios\//i.test(r)}function p_(r=zt()){return/iemobile/i.test(r)}function m_(r=zt()){return/android/i.test(r)}function g_(r=zt()){return/blackberry/i.test(r)}function y_(r=zt()){return/webos/i.test(r)}function rf(r=zt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function BT(r=zt()){var e;return rf(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $T(){return rE()&&document.documentMode===10}function __(r=zt()){return rf(r)||m_(r)||y_(r)||g_(r)||/windows phone/i.test(r)||p_(r)}/**
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
 */function v_(r,e=[]){let t;switch(r){case"Browser":t=Ag(zt());break;case"Worker":t=`${Ag(zt())}-${r}`;break;default:t=r}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${xo}/${s}`}/**
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
 */class qT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=l=>new Promise((h,f)=>{try{const g=e(l);h(g)}catch(g){f(g)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function HT(r,e={}){return Ri(r,"GET","/v2/passwordPolicy",fs(r,e))}/**
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
 */const WT=6;class GT{constructor(e){var t,s,o,l;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:WT,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(l=e.forceUpgradeOnSignin)!==null&&l!==void 0?l:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,o,l,h,f;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(s=g.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(l=g.containsUppercaseLetter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(f=g.containsNonAlphanumericCharacter)!==null&&f!==void 0?f:!0),g}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
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
 */class KT{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Rg(this),this.idTokenSubscription=new Rg(this),this.beforeStateQueue=new qT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=i_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Pr(t)),this._initializationPromise=this.queue(async()=>{var s,o,l;if(!this._deleted&&(this.persistenceManager=await go.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)===null||l===void 0?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Qu(this,{idToken:e}),s=await Fn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Mn(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,l=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,f=o==null?void 0:o._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===f)&&(g!=null&&g.user)&&(o=g.user,l=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(l)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return ge(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Yu(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=RT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Mn(this.app))return Promise.reject(mi(this));const t=e?At(e):null;return t&&ge(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ge(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Mn(this.app)?Promise.reject(mi(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Mn(this.app)?Promise.reject(mi(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Pr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await HT(this),t=new GT(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new rl("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await zT(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Pr(e)||this._popupRedirectResolver;ge(t,this,"argument-error"),this.redirectPersistenceManager=await go.create(this,[Pr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(ge(f,this,"internal-error"),f.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,s,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ge(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=v_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(Mn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&IT(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function No(r){return At(r)}class Rg{constructor(e){this.auth=e,this.observer=null,this.addObserver=hE(t=>this.observer=t)}get next(){return ge(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let fc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function QT(r){fc=r}function w_(r){return fc.loadJS(r)}function YT(){return fc.recaptchaEnterpriseScript}function XT(){return fc.gapiScript}function JT(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class ZT{constructor(){this.enterprise=new eI}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class eI{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const tI="recaptcha-enterprise",E_="NO_RECAPTCHA";class nI{constructor(e){this.type=tI,this.auth=No(e)}async verify(e="verify",t=!1){async function s(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,f)=>{VT(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const _=new DT(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{f(g)})})}function o(l,h,f){const g=window.grecaptcha;Eg(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(E_)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ZT().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{s(this.auth).then(f=>{if(!t&&Eg(window.grecaptcha))o(f,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=YT();g.length!==0&&(g+=f),w_(g).then(()=>{o(f,l,h)}).catch(_=>{h(_)})}}).catch(f=>{h(f)})})}}async function Cg(r,e,t,s=!1,o=!1){const l=new nI(r);let h;if(o)h=E_;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const f=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const g=f.phoneEnrollmentInfo.phoneNumber,_=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const g=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return s?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function Pg(r,e,t,s,o){var l;if(!((l=r._getRecaptchaConfig())===null||l===void 0)&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await Cg(r,e,t,t==="getOobCode");return s(r,h)}else return s(r,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const f=await Cg(r,e,t,t==="getOobCode");return s(r,f)}else return Promise.reject(h)})}/**
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
 */function rI(r,e){const t=Jd(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(kr(l,e??{}))return o;Bn(o,"already-initialized")}return t.initialize({options:e})}function iI(r,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Pr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function sI(r,e,t){const s=No(r);ge(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,l=T_(e),{host:h,port:f}=oI(e),g=f===null?"":`:${f}`,_={url:`${l}//${h}${g}/`},E=Object.freeze({host:h,port:f,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){ge(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),ge(kr(_,s.config.emulator)&&kr(E,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=_,s.emulatorConfig=E,s.settings.appVerificationDisabledForTesting=!0,ko(h)?(Qy(`${l}//${h}${g}`),Yy("Auth",!0)):aI()}function T_(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function oI(r){const e=T_(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const l=o[1];return{host:l,port:kg(s.substr(l.length+1))}}else{const[l,h]=s.split(":");return{host:l,port:kg(h)}}}function kg(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function aI(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
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
 */class sf{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Cr("not implemented")}_getIdTokenResponse(e){return Cr("not implemented")}_linkToIdToken(e,t){return Cr("not implemented")}_getReauthenticationResolver(e){return Cr("not implemented")}}async function lI(r,e){return Ri(r,"POST","/v1/accounts:signUp",e)}/**
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
 */async function uI(r,e){return dc(r,"POST","/v1/accounts:signInWithPassword",fs(r,e))}/**
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
 */async function cI(r,e){return dc(r,"POST","/v1/accounts:signInWithEmailLink",fs(r,e))}async function hI(r,e){return dc(r,"POST","/v1/accounts:signInWithEmailLink",fs(r,e))}/**
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
 */class Ka extends sf{constructor(e,t,s,o=null){super("password",s),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new Ka(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new Ka(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Pg(e,t,"signInWithPassword",uI);case"emailLink":return cI(e,{email:this._email,oobCode:this._password});default:Bn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Pg(e,s,"signUpPassword",lI);case"emailLink":return hI(e,{idToken:t,email:this._email,oobCode:this._password});default:Bn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function yo(r,e){return dc(r,"POST","/v1/accounts:signInWithIdp",fs(r,e))}/**
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
 */const dI="http://localhost";class ls extends sf{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ls(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Bn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o}=t,l=Zd(t,["providerId","signInMethod"]);if(!s||!o)return null;const h=new ls(s,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return yo(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,yo(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,yo(e,t)}buildRequest(){const e={requestUri:dI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=il(t)}return e}}/**
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
 */function fI(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function pI(r){const e=ba(Oa(r)).link,t=e?ba(Oa(e)).deep_link_id:null,s=ba(Oa(r)).deep_link_id;return(s?ba(Oa(s)).link:null)||s||t||e||r}class of{constructor(e){var t,s,o,l,h,f;const g=ba(Oa(e)),_=(t=g.apiKey)!==null&&t!==void 0?t:null,E=(s=g.oobCode)!==null&&s!==void 0?s:null,T=fI((o=g.mode)!==null&&o!==void 0?o:null);ge(_&&E&&T,"argument-error"),this.apiKey=_,this.operation=T,this.code=E,this.continueUrl=(l=g.continueUrl)!==null&&l!==void 0?l:null,this.languageCode=(h=g.lang)!==null&&h!==void 0?h:null,this.tenantId=(f=g.tenantId)!==null&&f!==void 0?f:null}static parseLink(e){const t=pI(e);try{return new of(t)}catch{return null}}}/**
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
 */class Do{constructor(){this.providerId=Do.PROVIDER_ID}static credential(e,t){return Ka._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=of.parseLink(t);return ge(s,"argument-error"),Ka._fromEmailAndCode(e,s.code,s.tenantId)}}Do.PROVIDER_ID="password";Do.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Do.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class I_{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ol extends I_{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class ai extends ol{constructor(){super("facebook.com")}static credential(e){return ls._fromParams({providerId:ai.PROVIDER_ID,signInMethod:ai.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ai.credentialFromTaggedObject(e)}static credentialFromError(e){return ai.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ai.credential(e.oauthAccessToken)}catch{return null}}}ai.FACEBOOK_SIGN_IN_METHOD="facebook.com";ai.PROVIDER_ID="facebook.com";/**
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
 */class li extends ol{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ls._fromParams({providerId:li.PROVIDER_ID,signInMethod:li.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return li.credentialFromTaggedObject(e)}static credentialFromError(e){return li.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return li.credential(t,s)}catch{return null}}}li.GOOGLE_SIGN_IN_METHOD="google.com";li.PROVIDER_ID="google.com";/**
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
 */class ui extends ol{constructor(){super("github.com")}static credential(e){return ls._fromParams({providerId:ui.PROVIDER_ID,signInMethod:ui.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ui.credentialFromTaggedObject(e)}static credentialFromError(e){return ui.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ui.credential(e.oauthAccessToken)}catch{return null}}}ui.GITHUB_SIGN_IN_METHOD="github.com";ui.PROVIDER_ID="github.com";/**
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
 */class ci extends ol{constructor(){super("twitter.com")}static credential(e,t){return ls._fromParams({providerId:ci.PROVIDER_ID,signInMethod:ci.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ci.credentialFromTaggedObject(e)}static credentialFromError(e){return ci.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return ci.credential(t,s)}catch{return null}}}ci.TWITTER_SIGN_IN_METHOD="twitter.com";ci.PROVIDER_ID="twitter.com";/**
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
 */class Eo{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const l=await Fn._fromIdTokenResponse(e,s,o),h=xg(s);return new Eo({user:l,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=xg(s);return new Eo({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function xg(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
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
 */class Xu extends br{constructor(e,t,s,o){var l;super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,Xu.prototype),this.customData={appName:e.name,tenantId:(l=e.tenantId)!==null&&l!==void 0?l:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new Xu(e,t,s,o)}}function S_(r,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?Xu._fromErrorAndOperation(r,l,e,s):l})}async function mI(r,e,t=!1){const s=await Ga(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return Eo._forOperation(r,"link",s)}/**
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
 */async function gI(r,e,t=!1){const{auth:s}=r;if(Mn(s.app))return Promise.reject(mi(s));const o="reauthenticate";try{const l=await Ga(r,S_(s,o,e,r),t);ge(l.idToken,s,"internal-error");const h=nf(l.idToken);ge(h,s,"internal-error");const{sub:f}=h;return ge(r.uid===f,s,"user-mismatch"),Eo._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Bn(s,"user-mismatch"),l}}/**
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
 */async function A_(r,e,t=!1){if(Mn(r.app))return Promise.reject(mi(r));const s="signIn",o=await S_(r,s,e),l=await Eo._fromIdTokenResponse(r,s,o);return t||await r._updateCurrentUser(l.user),l}async function yI(r,e){return A_(No(r),e)}/**
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
 */async function _I(r){const e=No(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function vI(r,e,t){return Mn(r.app)?Promise.reject(mi(r)):yI(At(r),Do.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&_I(r),s})}function wI(r,e,t,s){return At(r).onIdTokenChanged(e,t,s)}function EI(r,e,t){return At(r).beforeAuthStateChanged(e,t)}function TI(r){return At(r).signOut()}const Ju="__sak";/**
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
 */class R_{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ju,"1"),this.storage.removeItem(Ju),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const II=1e3,SI=10;class C_ extends R_{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=__(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,g)=>{this.notifyListeners(h,g)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},l=this.storage.getItem(s);$T()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,SI):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},II)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}C_.type="LOCAL";const AI=C_;/**
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
 */function RI(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class pc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new pc(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const f=Array.from(h).map(async _=>_(t.origin,l)),g=await RI(f);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}pc.receivers=[];/**
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
 */function af(r="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return r+t}/**
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
 */class CI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((f,g)=>{const _=af("",20);o.port1.start();const E=setTimeout(()=>{g(new Error("unsupported_event"))},s);h={messageChannel:o,onMessage(T){const C=T;if(C.data.eventId===_)switch(C.data.status){case"ack":clearTimeout(E),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),f(C.data.response);break;default:clearTimeout(E),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
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
 */function rr(){return window}function PI(r){rr().location.href=r}/**
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
 */function x_(){return typeof rr().WorkerGlobalScope<"u"&&typeof rr().importScripts=="function"}async function kI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function xI(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function NI(){return x_()?self:null}/**
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
 */const N_="firebaseLocalStorageDb",DI=1,Zu="firebaseLocalStorage",D_="fbase_key";class al{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function mc(r,e){return r.transaction([Zu],e?"readwrite":"readonly").objectStore(Zu)}function VI(){const r=indexedDB.deleteDatabase(N_);return new al(r).toPromise()}function xd(){const r=indexedDB.open(N_,DI);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(Zu,{keyPath:D_})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(Zu)?e(s):(s.close(),await VI(),e(await xd()))})})}async function Ng(r,e,t){const s=mc(r,!0).put({[D_]:e,value:t});return new al(s).toPromise()}async function bI(r,e){const t=mc(r,!1).get(e),s=await new al(t).toPromise();return s===void 0?null:s.value}function Dg(r,e){const t=mc(r,!0).delete(e);return new al(t).toPromise()}const OI=800,LI=3;class V_{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await xd(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>LI)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return x_()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=pc._getInstance(NI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await kI(),!this.activeServiceWorker)return;this.sender=new CI(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||xI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await xd();return await Ng(e,Ju,"1"),await Dg(e,Ju),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Ng(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>bI(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Dg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=mc(o,!1).getAll();return new al(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),OI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}V_.type="LOCAL";const MI=V_;new sl(3e4,6e4);/**
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
 */function FI(r,e){return e?Pr(e):(ge(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
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
 */class lf extends sf{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return yo(e,this._buildIdpRequest())}_linkToIdToken(e,t){return yo(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return yo(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function UI(r){return A_(r.auth,new lf(r),r.bypassAuthState)}function jI(r){const{auth:e,user:t}=r;return ge(t,e,"internal-error"),gI(t,new lf(r),r.bypassAuthState)}async function zI(r){const{auth:e,user:t}=r;return ge(t,e,"internal-error"),mI(t,new lf(r),r.bypassAuthState)}/**
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
 */class b_{constructor(e,t,s,o,l=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:l,error:h,type:f}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:s,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return UI;case"linkViaPopup":case"linkViaRedirect":return zI;case"reauthViaPopup":case"reauthViaRedirect":return jI;default:Bn(this.auth,"internal-error")}}resolve(e){Nr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Nr(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const BI=new sl(2e3,1e4);class po extends b_{constructor(e,t,s,o,l){super(e,t,o,l),this.provider=s,this.authWindow=null,this.pollId=null,po.currentPopupAction&&po.currentPopupAction.cancel(),po.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ge(e,this.auth,"internal-error"),e}async onExecution(){Nr(this.filter.length===1,"Popup operations only handle one event");const e=af();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(nr(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(nr(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,po.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(nr(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,BI.get())};e()}}po.currentPopupAction=null;/**
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
 */const $I="pendingRedirect",Fu=new Map;class qI extends b_{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Fu.get(this.auth._key());if(!e){try{const s=await HI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Fu.set(this.auth._key(),e)}return this.bypassAuthState||Fu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function HI(r,e){const t=KI(e),s=GI(r);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function WI(r,e){Fu.set(r._key(),e)}function GI(r){return Pr(r._redirectPersistence)}function KI(r){return Mu($I,r.config.apiKey,r.name)}async function QI(r,e,t=!1){if(Mn(r.app))return Promise.reject(mi(r));const s=No(r),o=FI(s,e),h=await new qI(s,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
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
 */const YI=600*1e3;class XI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!JI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!O_(e)){const o=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(nr(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=YI&&this.cachedEventUids.clear(),this.cachedEventUids.has(Vg(e))}saveEventToCache(e){this.cachedEventUids.add(Vg(e)),this.lastProcessedEventTime=Date.now()}}function Vg(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function O_({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function JI(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return O_(r);default:return!1}}/**
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
 */async function ZI(r,e={}){return Ri(r,"GET","/v1/projects",e)}/**
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
 */const eS=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tS=/^https?/;async function nS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await ZI(r);for(const t of e)try{if(rS(t))return}catch{}Bn(r,"unauthorized-domain")}function rS(r){const e=Pd(),{protocol:t,hostname:s}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&s===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!tS.test(t))return!1;if(eS.test(r))return s===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
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
 */const iS=new sl(3e4,6e4);function bg(){const r=rr().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function sS(r){return new Promise((e,t)=>{var s,o,l;function h(){bg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{bg(),t(nr(r,"network-request-failed"))},timeout:iS.get()})}if(!((o=(s=rr().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((l=rr().gapi)===null||l===void 0)&&l.load)h();else{const f=JT("iframefcb");return rr()[f]=()=>{gapi.load?h():t(nr(r,"network-request-failed"))},w_(`${XT()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw Uu=null,e})}let Uu=null;function oS(r){return Uu=Uu||sS(r),Uu}/**
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
 */const aS=new sl(5e3,15e3),lS="__/auth/iframe",uS="emulator/auth/iframe",cS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},hS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function dS(r){const e=r.config;ge(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?tf(e,uS):`https://${r.config.authDomain}/${lS}`,s={apiKey:e.apiKey,appName:r.name,v:xo},o=hS.get(r.config.apiHost);o&&(s.eid=o);const l=r._getFrameworks();return l.length&&(s.fw=l.join(",")),`${t}?${il(s).slice(1)}`}async function fS(r){const e=await oS(r),t=rr().gapi;return ge(t,r,"internal-error"),e.open({where:document.body,url:dS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:cS,dontclear:!0},s=>new Promise(async(o,l)=>{await s.restyle({setHideOnLeave:!1});const h=nr(r,"network-request-failed"),f=rr().setTimeout(()=>{l(h)},aS.get());function g(){rr().clearTimeout(f),o(s)}s.ping(g).then(g,()=>{l(h)})}))}/**
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
 */const pS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mS=500,gS=600,yS="_blank",_S="http://localhost";class Og{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function vS(r,e,t,s=mS,o=gS){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let f="";const g=Object.assign(Object.assign({},pS),{width:s.toString(),height:o.toString(),top:l,left:h}),_=zt().toLowerCase();t&&(f=f_(_)?yS:t),h_(_)&&(e=e||_S,g.scrollbars="yes");const E=Object.entries(g).reduce((C,[U,$])=>`${C}${U}=${$},`,"");if(BT(_)&&f!=="_self")return wS(e||"",f),new Og(null);const T=window.open(e||"",f,E);ge(T,r,"popup-blocked");try{T.focus()}catch{}return new Og(T)}function wS(r,e){const t=document.createElement("a");t.href=r,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const ES="__/auth/handler",TS="emulator/auth/handler",IS=encodeURIComponent("fac");async function Lg(r,e,t,s,o,l){ge(r.config.authDomain,r,"auth-domain-config-required"),ge(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:s,v:xo,eventId:o};if(e instanceof I_){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",cE(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[E,T]of Object.entries({}))h[E]=T}if(e instanceof ol){const E=e.getScopes().filter(T=>T!=="");E.length>0&&(h.scopes=E.join(","))}r.tenantId&&(h.tid=r.tenantId);const f=h;for(const E of Object.keys(f))f[E]===void 0&&delete f[E];const g=await r._getAppCheckToken(),_=g?`#${IS}=${encodeURIComponent(g)}`:"";return`${SS(r)}?${il(f).slice(1)}${_}`}function SS({config:r}){return r.emulator?tf(r,TS):`https://${r.authDomain}/${ES}`}/**
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
 */const yd="webStorageSupport";class AS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=k_,this._completeRedirectFn=QI,this._overrideRedirectResult=WI}async _openPopup(e,t,s,o){var l;Nr((l=this.eventManagers[e._key()])===null||l===void 0?void 0:l.manager,"_initialize() not called before _openPopup()");const h=await Lg(e,t,s,Pd(),o);return vS(e,h,af())}async _openRedirect(e,t,s,o){await this._originValidation(e);const l=await Lg(e,t,s,Pd(),o);return PI(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Nr(l,"If manager is not set, promise should be"),l)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await fS(e),s=new XI(e);return t.register("authEvent",o=>(ge(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(yd,{type:yd},o=>{var l;const h=(l=o==null?void 0:o[0])===null||l===void 0?void 0:l[yd];h!==void 0&&t(!!h),Bn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=nS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return __()||d_()||rf()}}const RS=AS;var Mg="@firebase/auth",Fg="1.10.8";/**
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
 */class CS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ge(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function PS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function kS(r){wo(new as("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=s.options;ge(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const g={apiKey:h,authDomain:f,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:v_(r)},_=new KT(s,o,l,g);return iI(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),wo(new as("auth-internal",e=>{const t=No(e.getProvider("auth").getImmediate());return(s=>new CS(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),pi(Mg,Fg,PS(r)),pi(Mg,Fg,"esm2017")}/**
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
 */const xS=300,NS=Ky("authIdTokenMaxAge")||xS;let Ug=null;const DS=r=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>NS)return;const o=t==null?void 0:t.token;Ug!==o&&(Ug=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function VS(r=e_()){const e=Jd(r,"auth");if(e.isInitialized())return e.getImmediate();const t=rI(r,{popupRedirectResolver:RS,persistence:[MI,AI,k_]}),s=Ky("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(s,location.origin);if(location.origin===l.origin){const h=DS(l.toString());EI(t,h,()=>h(t.currentUser)),wI(t,f=>h(f))}}const o=Wy("auth");return o&&sI(t,`http://${o}`),t}function bS(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}QT({loadJS(r){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=e,s.onerror=o=>{const l=nr("internal-error");l.customData=o,t(l)},s.type="text/javascript",s.charset="UTF-8",bS().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});kS("Browser");var OS="firebase",LS="11.10.0";/**
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
 */pi(OS,LS,"app");var jg=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gi,L_;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(D,A){function I(){}I.prototype=A.prototype,D.D=A.prototype,D.prototype=new I,D.prototype.constructor=D,D.C=function(P,x,V){for(var R=Array(arguments.length-2),$e=2;$e<arguments.length;$e++)R[$e-2]=arguments[$e];return A.prototype[x].apply(P,R)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(D,A,I){I||(I=0);var P=Array(16);if(typeof A=="string")for(var x=0;16>x;++x)P[x]=A.charCodeAt(I++)|A.charCodeAt(I++)<<8|A.charCodeAt(I++)<<16|A.charCodeAt(I++)<<24;else for(x=0;16>x;++x)P[x]=A[I++]|A[I++]<<8|A[I++]<<16|A[I++]<<24;A=D.g[0],I=D.g[1],x=D.g[2];var V=D.g[3],R=A+(V^I&(x^V))+P[0]+3614090360&4294967295;A=I+(R<<7&4294967295|R>>>25),R=V+(x^A&(I^x))+P[1]+3905402710&4294967295,V=A+(R<<12&4294967295|R>>>20),R=x+(I^V&(A^I))+P[2]+606105819&4294967295,x=V+(R<<17&4294967295|R>>>15),R=I+(A^x&(V^A))+P[3]+3250441966&4294967295,I=x+(R<<22&4294967295|R>>>10),R=A+(V^I&(x^V))+P[4]+4118548399&4294967295,A=I+(R<<7&4294967295|R>>>25),R=V+(x^A&(I^x))+P[5]+1200080426&4294967295,V=A+(R<<12&4294967295|R>>>20),R=x+(I^V&(A^I))+P[6]+2821735955&4294967295,x=V+(R<<17&4294967295|R>>>15),R=I+(A^x&(V^A))+P[7]+4249261313&4294967295,I=x+(R<<22&4294967295|R>>>10),R=A+(V^I&(x^V))+P[8]+1770035416&4294967295,A=I+(R<<7&4294967295|R>>>25),R=V+(x^A&(I^x))+P[9]+2336552879&4294967295,V=A+(R<<12&4294967295|R>>>20),R=x+(I^V&(A^I))+P[10]+4294925233&4294967295,x=V+(R<<17&4294967295|R>>>15),R=I+(A^x&(V^A))+P[11]+2304563134&4294967295,I=x+(R<<22&4294967295|R>>>10),R=A+(V^I&(x^V))+P[12]+1804603682&4294967295,A=I+(R<<7&4294967295|R>>>25),R=V+(x^A&(I^x))+P[13]+4254626195&4294967295,V=A+(R<<12&4294967295|R>>>20),R=x+(I^V&(A^I))+P[14]+2792965006&4294967295,x=V+(R<<17&4294967295|R>>>15),R=I+(A^x&(V^A))+P[15]+1236535329&4294967295,I=x+(R<<22&4294967295|R>>>10),R=A+(x^V&(I^x))+P[1]+4129170786&4294967295,A=I+(R<<5&4294967295|R>>>27),R=V+(I^x&(A^I))+P[6]+3225465664&4294967295,V=A+(R<<9&4294967295|R>>>23),R=x+(A^I&(V^A))+P[11]+643717713&4294967295,x=V+(R<<14&4294967295|R>>>18),R=I+(V^A&(x^V))+P[0]+3921069994&4294967295,I=x+(R<<20&4294967295|R>>>12),R=A+(x^V&(I^x))+P[5]+3593408605&4294967295,A=I+(R<<5&4294967295|R>>>27),R=V+(I^x&(A^I))+P[10]+38016083&4294967295,V=A+(R<<9&4294967295|R>>>23),R=x+(A^I&(V^A))+P[15]+3634488961&4294967295,x=V+(R<<14&4294967295|R>>>18),R=I+(V^A&(x^V))+P[4]+3889429448&4294967295,I=x+(R<<20&4294967295|R>>>12),R=A+(x^V&(I^x))+P[9]+568446438&4294967295,A=I+(R<<5&4294967295|R>>>27),R=V+(I^x&(A^I))+P[14]+3275163606&4294967295,V=A+(R<<9&4294967295|R>>>23),R=x+(A^I&(V^A))+P[3]+4107603335&4294967295,x=V+(R<<14&4294967295|R>>>18),R=I+(V^A&(x^V))+P[8]+1163531501&4294967295,I=x+(R<<20&4294967295|R>>>12),R=A+(x^V&(I^x))+P[13]+2850285829&4294967295,A=I+(R<<5&4294967295|R>>>27),R=V+(I^x&(A^I))+P[2]+4243563512&4294967295,V=A+(R<<9&4294967295|R>>>23),R=x+(A^I&(V^A))+P[7]+1735328473&4294967295,x=V+(R<<14&4294967295|R>>>18),R=I+(V^A&(x^V))+P[12]+2368359562&4294967295,I=x+(R<<20&4294967295|R>>>12),R=A+(I^x^V)+P[5]+4294588738&4294967295,A=I+(R<<4&4294967295|R>>>28),R=V+(A^I^x)+P[8]+2272392833&4294967295,V=A+(R<<11&4294967295|R>>>21),R=x+(V^A^I)+P[11]+1839030562&4294967295,x=V+(R<<16&4294967295|R>>>16),R=I+(x^V^A)+P[14]+4259657740&4294967295,I=x+(R<<23&4294967295|R>>>9),R=A+(I^x^V)+P[1]+2763975236&4294967295,A=I+(R<<4&4294967295|R>>>28),R=V+(A^I^x)+P[4]+1272893353&4294967295,V=A+(R<<11&4294967295|R>>>21),R=x+(V^A^I)+P[7]+4139469664&4294967295,x=V+(R<<16&4294967295|R>>>16),R=I+(x^V^A)+P[10]+3200236656&4294967295,I=x+(R<<23&4294967295|R>>>9),R=A+(I^x^V)+P[13]+681279174&4294967295,A=I+(R<<4&4294967295|R>>>28),R=V+(A^I^x)+P[0]+3936430074&4294967295,V=A+(R<<11&4294967295|R>>>21),R=x+(V^A^I)+P[3]+3572445317&4294967295,x=V+(R<<16&4294967295|R>>>16),R=I+(x^V^A)+P[6]+76029189&4294967295,I=x+(R<<23&4294967295|R>>>9),R=A+(I^x^V)+P[9]+3654602809&4294967295,A=I+(R<<4&4294967295|R>>>28),R=V+(A^I^x)+P[12]+3873151461&4294967295,V=A+(R<<11&4294967295|R>>>21),R=x+(V^A^I)+P[15]+530742520&4294967295,x=V+(R<<16&4294967295|R>>>16),R=I+(x^V^A)+P[2]+3299628645&4294967295,I=x+(R<<23&4294967295|R>>>9),R=A+(x^(I|~V))+P[0]+4096336452&4294967295,A=I+(R<<6&4294967295|R>>>26),R=V+(I^(A|~x))+P[7]+1126891415&4294967295,V=A+(R<<10&4294967295|R>>>22),R=x+(A^(V|~I))+P[14]+2878612391&4294967295,x=V+(R<<15&4294967295|R>>>17),R=I+(V^(x|~A))+P[5]+4237533241&4294967295,I=x+(R<<21&4294967295|R>>>11),R=A+(x^(I|~V))+P[12]+1700485571&4294967295,A=I+(R<<6&4294967295|R>>>26),R=V+(I^(A|~x))+P[3]+2399980690&4294967295,V=A+(R<<10&4294967295|R>>>22),R=x+(A^(V|~I))+P[10]+4293915773&4294967295,x=V+(R<<15&4294967295|R>>>17),R=I+(V^(x|~A))+P[1]+2240044497&4294967295,I=x+(R<<21&4294967295|R>>>11),R=A+(x^(I|~V))+P[8]+1873313359&4294967295,A=I+(R<<6&4294967295|R>>>26),R=V+(I^(A|~x))+P[15]+4264355552&4294967295,V=A+(R<<10&4294967295|R>>>22),R=x+(A^(V|~I))+P[6]+2734768916&4294967295,x=V+(R<<15&4294967295|R>>>17),R=I+(V^(x|~A))+P[13]+1309151649&4294967295,I=x+(R<<21&4294967295|R>>>11),R=A+(x^(I|~V))+P[4]+4149444226&4294967295,A=I+(R<<6&4294967295|R>>>26),R=V+(I^(A|~x))+P[11]+3174756917&4294967295,V=A+(R<<10&4294967295|R>>>22),R=x+(A^(V|~I))+P[2]+718787259&4294967295,x=V+(R<<15&4294967295|R>>>17),R=I+(V^(x|~A))+P[9]+3951481745&4294967295,D.g[0]=D.g[0]+A&4294967295,D.g[1]=D.g[1]+(x+(R<<21&4294967295|R>>>11))&4294967295,D.g[2]=D.g[2]+x&4294967295,D.g[3]=D.g[3]+V&4294967295}s.prototype.u=function(D,A){A===void 0&&(A=D.length);for(var I=A-this.blockSize,P=this.B,x=this.h,V=0;V<A;){if(x==0)for(;V<=I;)o(this,D,V),V+=this.blockSize;if(typeof D=="string"){for(;V<A;)if(P[x++]=D.charCodeAt(V++),x==this.blockSize){o(this,P),x=0;break}}else for(;V<A;)if(P[x++]=D[V++],x==this.blockSize){o(this,P),x=0;break}}this.h=x,this.o+=A},s.prototype.v=function(){var D=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);D[0]=128;for(var A=1;A<D.length-8;++A)D[A]=0;var I=8*this.o;for(A=D.length-8;A<D.length;++A)D[A]=I&255,I/=256;for(this.u(D),D=Array(16),A=I=0;4>A;++A)for(var P=0;32>P;P+=8)D[I++]=this.g[A]>>>P&255;return D};function l(D,A){var I=f;return Object.prototype.hasOwnProperty.call(I,D)?I[D]:I[D]=A(D)}function h(D,A){this.h=A;for(var I=[],P=!0,x=D.length-1;0<=x;x--){var V=D[x]|0;P&&V==A||(I[x]=V,P=!1)}this.g=I}var f={};function g(D){return-128<=D&&128>D?l(D,function(A){return new h([A|0],0>A?-1:0)}):new h([D|0],0>D?-1:0)}function _(D){if(isNaN(D)||!isFinite(D))return T;if(0>D)return q(_(-D));for(var A=[],I=1,P=0;D>=I;P++)A[P]=D/I|0,I*=4294967296;return new h(A,0)}function E(D,A){if(D.length==0)throw Error("number format error: empty string");if(A=A||10,2>A||36<A)throw Error("radix out of range: "+A);if(D.charAt(0)=="-")return q(E(D.substring(1),A));if(0<=D.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=_(Math.pow(A,8)),P=T,x=0;x<D.length;x+=8){var V=Math.min(8,D.length-x),R=parseInt(D.substring(x,x+V),A);8>V?(V=_(Math.pow(A,V)),P=P.j(V).add(_(R))):(P=P.j(I),P=P.add(_(R)))}return P}var T=g(0),C=g(1),U=g(16777216);r=h.prototype,r.m=function(){if(G(this))return-q(this).m();for(var D=0,A=1,I=0;I<this.g.length;I++){var P=this.i(I);D+=(0<=P?P:4294967296+P)*A,A*=4294967296}return D},r.toString=function(D){if(D=D||10,2>D||36<D)throw Error("radix out of range: "+D);if($(this))return"0";if(G(this))return"-"+q(this).toString(D);for(var A=_(Math.pow(D,6)),I=this,P="";;){var x=Ee(I,A).g;I=me(I,x.j(A));var V=((0<I.g.length?I.g[0]:I.h)>>>0).toString(D);if(I=x,$(I))return V+P;for(;6>V.length;)V="0"+V;P=V+P}},r.i=function(D){return 0>D?0:D<this.g.length?this.g[D]:this.h};function $(D){if(D.h!=0)return!1;for(var A=0;A<D.g.length;A++)if(D.g[A]!=0)return!1;return!0}function G(D){return D.h==-1}r.l=function(D){return D=me(this,D),G(D)?-1:$(D)?0:1};function q(D){for(var A=D.g.length,I=[],P=0;P<A;P++)I[P]=~D.g[P];return new h(I,~D.h).add(C)}r.abs=function(){return G(this)?q(this):this},r.add=function(D){for(var A=Math.max(this.g.length,D.g.length),I=[],P=0,x=0;x<=A;x++){var V=P+(this.i(x)&65535)+(D.i(x)&65535),R=(V>>>16)+(this.i(x)>>>16)+(D.i(x)>>>16);P=R>>>16,V&=65535,R&=65535,I[x]=R<<16|V}return new h(I,I[I.length-1]&-2147483648?-1:0)};function me(D,A){return D.add(q(A))}r.j=function(D){if($(this)||$(D))return T;if(G(this))return G(D)?q(this).j(q(D)):q(q(this).j(D));if(G(D))return q(this.j(q(D)));if(0>this.l(U)&&0>D.l(U))return _(this.m()*D.m());for(var A=this.g.length+D.g.length,I=[],P=0;P<2*A;P++)I[P]=0;for(P=0;P<this.g.length;P++)for(var x=0;x<D.g.length;x++){var V=this.i(P)>>>16,R=this.i(P)&65535,$e=D.i(x)>>>16,_t=D.i(x)&65535;I[2*P+2*x]+=R*_t,ce(I,2*P+2*x),I[2*P+2*x+1]+=V*_t,ce(I,2*P+2*x+1),I[2*P+2*x+1]+=R*$e,ce(I,2*P+2*x+1),I[2*P+2*x+2]+=V*$e,ce(I,2*P+2*x+2)}for(P=0;P<A;P++)I[P]=I[2*P+1]<<16|I[2*P];for(P=A;P<2*A;P++)I[P]=0;return new h(I,0)};function ce(D,A){for(;(D[A]&65535)!=D[A];)D[A+1]+=D[A]>>>16,D[A]&=65535,A++}function pe(D,A){this.g=D,this.h=A}function Ee(D,A){if($(A))throw Error("division by zero");if($(D))return new pe(T,T);if(G(D))return A=Ee(q(D),A),new pe(q(A.g),q(A.h));if(G(A))return A=Ee(D,q(A)),new pe(q(A.g),A.h);if(30<D.g.length){if(G(D)||G(A))throw Error("slowDivide_ only works with positive integers.");for(var I=C,P=A;0>=P.l(D);)I=Be(I),P=Be(P);var x=Te(I,1),V=Te(P,1);for(P=Te(P,2),I=Te(I,2);!$(P);){var R=V.add(P);0>=R.l(D)&&(x=x.add(I),V=R),P=Te(P,1),I=Te(I,1)}return A=me(D,x.j(A)),new pe(x,A)}for(x=T;0<=D.l(A);){for(I=Math.max(1,Math.floor(D.m()/A.m())),P=Math.ceil(Math.log(I)/Math.LN2),P=48>=P?1:Math.pow(2,P-48),V=_(I),R=V.j(A);G(R)||0<R.l(D);)I-=P,V=_(I),R=V.j(A);$(V)&&(V=C),x=x.add(V),D=me(D,R)}return new pe(x,D)}r.A=function(D){return Ee(this,D).h},r.and=function(D){for(var A=Math.max(this.g.length,D.g.length),I=[],P=0;P<A;P++)I[P]=this.i(P)&D.i(P);return new h(I,this.h&D.h)},r.or=function(D){for(var A=Math.max(this.g.length,D.g.length),I=[],P=0;P<A;P++)I[P]=this.i(P)|D.i(P);return new h(I,this.h|D.h)},r.xor=function(D){for(var A=Math.max(this.g.length,D.g.length),I=[],P=0;P<A;P++)I[P]=this.i(P)^D.i(P);return new h(I,this.h^D.h)};function Be(D){for(var A=D.g.length+1,I=[],P=0;P<A;P++)I[P]=D.i(P)<<1|D.i(P-1)>>>31;return new h(I,D.h)}function Te(D,A){var I=A>>5;A%=32;for(var P=D.g.length-I,x=[],V=0;V<P;V++)x[V]=0<A?D.i(V+I)>>>A|D.i(V+I+1)<<32-A:D.i(V+I);return new h(x,D.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,L_=s,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=E,gi=h}).apply(typeof jg<"u"?jg:typeof self<"u"?self:typeof window<"u"?window:{});var Nu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var M_,La,F_,ju,Nd,U_,j_,z_;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(u,p,y){return u==Array.prototype||u==Object.prototype||(u[p]=y.value),u};function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof Nu=="object"&&Nu];for(var p=0;p<u.length;++p){var y=u[p];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var s=t(this);function o(u,p){if(p)e:{var y=s;u=u.split(".");for(var w=0;w<u.length-1;w++){var L=u[w];if(!(L in y))break e;y=y[L]}u=u[u.length-1],w=y[u],p=p(w),p!=w&&p!=null&&e(y,u,{configurable:!0,writable:!0,value:p})}}function l(u,p){u instanceof String&&(u+="");var y=0,w=!1,L={next:function(){if(!w&&y<u.length){var z=y++;return{value:p(z,u[z]),done:!1}}return w=!0,{done:!0,value:void 0}}};return L[Symbol.iterator]=function(){return L},L}o("Array.prototype.values",function(u){return u||function(){return l(this,function(p,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},f=this||self;function g(u){var p=typeof u;return p=p!="object"?p:u?Array.isArray(u)?"array":p:"null",p=="array"||p=="object"&&typeof u.length=="number"}function _(u){var p=typeof u;return p=="object"&&u!=null||p=="function"}function E(u,p,y){return u.call.apply(u.bind,arguments)}function T(u,p,y){if(!u)throw Error();if(2<arguments.length){var w=Array.prototype.slice.call(arguments,2);return function(){var L=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(L,w),u.apply(p,L)}}return function(){return u.apply(p,arguments)}}function C(u,p,y){return C=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?E:T,C.apply(null,arguments)}function U(u,p){var y=Array.prototype.slice.call(arguments,1);return function(){var w=y.slice();return w.push.apply(w,arguments),u.apply(this,w)}}function $(u,p){function y(){}y.prototype=p.prototype,u.aa=p.prototype,u.prototype=new y,u.prototype.constructor=u,u.Qb=function(w,L,z){for(var J=Array(arguments.length-2),je=2;je<arguments.length;je++)J[je-2]=arguments[je];return p.prototype[L].apply(w,J)}}function G(u){const p=u.length;if(0<p){const y=Array(p);for(let w=0;w<p;w++)y[w]=u[w];return y}return[]}function q(u,p){for(let y=1;y<arguments.length;y++){const w=arguments[y];if(g(w)){const L=u.length||0,z=w.length||0;u.length=L+z;for(let J=0;J<z;J++)u[L+J]=w[J]}else u.push(w)}}class me{constructor(p,y){this.i=p,this.j=y,this.h=0,this.g=null}get(){let p;return 0<this.h?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function ce(u){return/^[\s\xa0]*$/.test(u)}function pe(){var u=f.navigator;return u&&(u=u.userAgent)?u:""}function Ee(u){return Ee[" "](u),u}Ee[" "]=function(){};var Be=pe().indexOf("Gecko")!=-1&&!(pe().toLowerCase().indexOf("webkit")!=-1&&pe().indexOf("Edge")==-1)&&!(pe().indexOf("Trident")!=-1||pe().indexOf("MSIE")!=-1)&&pe().indexOf("Edge")==-1;function Te(u,p,y){for(const w in u)p.call(y,u[w],w,u)}function D(u,p){for(const y in u)p.call(void 0,u[y],y,u)}function A(u){const p={};for(const y in u)p[y]=u[y];return p}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function P(u,p){let y,w;for(let L=1;L<arguments.length;L++){w=arguments[L];for(y in w)u[y]=w[y];for(let z=0;z<I.length;z++)y=I[z],Object.prototype.hasOwnProperty.call(w,y)&&(u[y]=w[y])}}function x(u){var p=1;u=u.split(":");const y=[];for(;0<p&&u.length;)y.push(u.shift()),p--;return u.length&&y.push(u.join(":")),y}function V(u){f.setTimeout(()=>{throw u},0)}function R(){var u=he;let p=null;return u.g&&(p=u.g,u.g=u.g.next,u.g||(u.h=null),p.next=null),p}class $e{constructor(){this.h=this.g=null}add(p,y){const w=_t.get();w.set(p,y),this.h?this.h.next=w:this.g=w,this.h=w}}var _t=new me(()=>new Rt,u=>u.reset());class Rt{constructor(){this.next=this.g=this.h=null}set(p,y){this.h=p,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let Fe,Z=!1,he=new $e,re=()=>{const u=f.Promise.resolve(void 0);Fe=()=>{u.then(O)}};var O=()=>{for(var u;u=R();){try{u.h.call(u.g)}catch(y){V(y)}var p=_t;p.j(u),100>p.h&&(p.h++,u.next=p.g,p.g=u)}Z=!1};function W(){this.s=this.s,this.C=this.C}W.prototype.s=!1,W.prototype.ma=function(){this.s||(this.s=!0,this.N())},W.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function le(u,p){this.type=u,this.g=this.target=p,this.defaultPrevented=!1}le.prototype.h=function(){this.defaultPrevented=!0};var Ie=(function(){if(!f.addEventListener||!Object.defineProperty)return!1;var u=!1,p=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};f.addEventListener("test",y,p),f.removeEventListener("test",y,p)}catch{}return u})();function Re(u,p){if(le.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u){var y=this.type=u.type,w=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;if(this.target=u.target||u.srcElement,this.g=p,p=u.relatedTarget){if(Be){e:{try{Ee(p.nodeName);var L=!0;break e}catch{}L=!1}L||(p=null)}}else y=="mouseover"?p=u.fromElement:y=="mouseout"&&(p=u.toElement);this.relatedTarget=p,w?(this.clientX=w.clientX!==void 0?w.clientX:w.pageX,this.clientY=w.clientY!==void 0?w.clientY:w.pageY,this.screenX=w.screenX||0,this.screenY=w.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=typeof u.pointerType=="string"?u.pointerType:Ne[u.pointerType]||"",this.state=u.state,this.i=u,u.defaultPrevented&&Re.aa.h.call(this)}}$(Re,le);var Ne={2:"touch",3:"pen",4:"mouse"};Re.prototype.h=function(){Re.aa.h.call(this);var u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var Le="closure_listenable_"+(1e6*Math.random()|0),Me=0;function qe(u,p,y,w,L){this.listener=u,this.proxy=null,this.src=p,this.type=y,this.capture=!!w,this.ha=L,this.key=++Me,this.da=this.fa=!1}function vt(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function ur(u){this.src=u,this.g={},this.h=0}ur.prototype.add=function(u,p,y,w,L){var z=u.toString();u=this.g[z],u||(u=this.g[z]=[],this.h++);var J=Or(u,p,w,L);return-1<J?(p=u[J],y||(p.fa=!1)):(p=new qe(p,this.src,z,!!w,L),p.fa=y,u.push(p)),p};function ys(u,p){var y=p.type;if(y in u.g){var w=u.g[y],L=Array.prototype.indexOf.call(w,p,void 0),z;(z=0<=L)&&Array.prototype.splice.call(w,L,1),z&&(vt(p),u.g[y].length==0&&(delete u.g[y],u.h--))}}function Or(u,p,y,w){for(var L=0;L<u.length;++L){var z=u[L];if(!z.da&&z.listener==p&&z.capture==!!y&&z.ha==w)return L}return-1}var xi="closure_lm_"+(1e6*Math.random()|0),_s={};function Uo(u,p,y,w,L){if(Array.isArray(p)){for(var z=0;z<p.length;z++)Uo(u,p[z],y,w,L);return null}return y=Bo(y),u&&u[Le]?u.K(p,y,_(w)?!!w.capture:!1,L):jo(u,p,y,!1,w,L)}function jo(u,p,y,w,L,z){if(!p)throw Error("Invalid event type");var J=_(L)?!!L.capture:!!L,je=ws(u);if(je||(u[xi]=je=new ur(u)),y=je.add(p,y,w,J,z),y.proxy)return y;if(w=pl(),y.proxy=w,w.src=u,w.listener=y,u.addEventListener)Ie||(L=J),L===void 0&&(L=!1),u.addEventListener(p.toString(),w,L);else if(u.attachEvent)u.attachEvent(hr(p.toString()),w);else if(u.addListener&&u.removeListener)u.addListener(w);else throw Error("addEventListener and attachEvent are unavailable.");return y}function pl(){function u(y){return p.call(u.src,u.listener,y)}const p=zo;return u}function vs(u,p,y,w,L){if(Array.isArray(p))for(var z=0;z<p.length;z++)vs(u,p[z],y,w,L);else w=_(w)?!!w.capture:!!w,y=Bo(y),u&&u[Le]?(u=u.i,p=String(p).toString(),p in u.g&&(z=u.g[p],y=Or(z,y,w,L),-1<y&&(vt(z[y]),Array.prototype.splice.call(z,y,1),z.length==0&&(delete u.g[p],u.h--)))):u&&(u=ws(u))&&(p=u.g[p.toString()],u=-1,p&&(u=Or(p,y,w,L)),(y=-1<u?p[u]:null)&&cr(y))}function cr(u){if(typeof u!="number"&&u&&!u.da){var p=u.src;if(p&&p[Le])ys(p.i,u);else{var y=u.type,w=u.proxy;p.removeEventListener?p.removeEventListener(y,w,u.capture):p.detachEvent?p.detachEvent(hr(y),w):p.addListener&&p.removeListener&&p.removeListener(w),(y=ws(p))?(ys(y,u),y.h==0&&(y.src=null,p[xi]=null)):vt(u)}}}function hr(u){return u in _s?_s[u]:_s[u]="on"+u}function zo(u,p){if(u.da)u=!0;else{p=new Re(p,this);var y=u.listener,w=u.ha||u.src;u.fa&&cr(u),u=y.call(w,p)}return u}function ws(u){return u=u[xi],u instanceof ur?u:null}var Es="__closure_events_fn_"+(1e9*Math.random()>>>0);function Bo(u){return typeof u=="function"?u:(u[Es]||(u[Es]=function(p){return u.handleEvent(p)}),u[Es])}function dt(){W.call(this),this.i=new ur(this),this.M=this,this.F=null}$(dt,W),dt.prototype[Le]=!0,dt.prototype.removeEventListener=function(u,p,y,w){vs(this,u,p,y,w)};function ft(u,p){var y,w=u.F;if(w)for(y=[];w;w=w.F)y.push(w);if(u=u.M,w=p.type||p,typeof p=="string")p=new le(p,u);else if(p instanceof le)p.target=p.target||u;else{var L=p;p=new le(w,u),P(p,L)}if(L=!0,y)for(var z=y.length-1;0<=z;z--){var J=p.g=y[z];L=dr(J,w,!0,p)&&L}if(J=p.g=u,L=dr(J,w,!0,p)&&L,L=dr(J,w,!1,p)&&L,y)for(z=0;z<y.length;z++)J=p.g=y[z],L=dr(J,w,!1,p)&&L}dt.prototype.N=function(){if(dt.aa.N.call(this),this.i){var u=this.i,p;for(p in u.g){for(var y=u.g[p],w=0;w<y.length;w++)vt(y[w]);delete u.g[p],u.h--}}this.F=null},dt.prototype.K=function(u,p,y,w){return this.i.add(String(u),p,!1,y,w)},dt.prototype.L=function(u,p,y,w){return this.i.add(String(u),p,!0,y,w)};function dr(u,p,y,w){if(p=u.i.g[String(p)],!p)return!0;p=p.concat();for(var L=!0,z=0;z<p.length;++z){var J=p[z];if(J&&!J.da&&J.capture==y){var je=J.listener,pt=J.ha||J.src;J.fa&&ys(u.i,J),L=je.call(pt,w)!==!1&&L}}return L&&!w.defaultPrevented}function $o(u,p,y){if(typeof u=="function")y&&(u=C(u,y));else if(u&&typeof u.handleEvent=="function")u=C(u.handleEvent,u);else throw Error("Invalid listener argument");return 2147483647<Number(p)?-1:f.setTimeout(u,p||0)}function Lr(u){u.g=$o(()=>{u.g=null,u.i&&(u.i=!1,Lr(u))},u.l);const p=u.h;u.h=null,u.m.apply(null,p)}class Ni extends W{constructor(p,y){super(),this.m=p,this.l=y,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:Lr(this)}N(){super.N(),this.g&&(f.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Di(u){W.call(this),this.h=u,this.g={}}$(Di,W);var qo=[];function Ho(u){Te(u.g,function(p,y){this.g.hasOwnProperty(y)&&cr(p)},u),u.g={}}Di.prototype.N=function(){Di.aa.N.call(this),Ho(this)},Di.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Wo=f.JSON.stringify,Go=f.JSON.parse,Ko=class{stringify(u){return f.JSON.stringify(u,void 0)}parse(u){return f.JSON.parse(u,void 0)}};function Vi(){}Vi.prototype.h=null;function Ts(u){return u.h||(u.h=u.i())}function Is(){}var hn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function qn(){le.call(this,"d")}$(qn,le);function Ss(){le.call(this,"c")}$(Ss,le);var Hn={},Qo=null;function bi(){return Qo=Qo||new dt}Hn.La="serverreachability";function Yo(u){le.call(this,Hn.La,u)}$(Yo,le);function fr(u){const p=bi();ft(p,new Yo(p))}Hn.STAT_EVENT="statevent";function Xo(u,p){le.call(this,Hn.STAT_EVENT,u),this.stat=p}$(Xo,le);function it(u){const p=bi();ft(p,new Xo(p,u))}Hn.Ma="timingevent";function As(u,p){le.call(this,Hn.Ma,u),this.size=p}$(As,le);function Tn(u,p){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return f.setTimeout(function(){u()},p)}function Oi(){this.g=!0}Oi.prototype.xa=function(){this.g=!1};function Li(u,p,y,w,L,z){u.info(function(){if(u.g)if(z)for(var J="",je=z.split("&"),pt=0;pt<je.length;pt++){var De=je[pt].split("=");if(1<De.length){var wt=De[0];De=De[1];var at=wt.split("_");J=2<=at.length&&at[1]=="type"?J+(wt+"="+De+"&"):J+(wt+"=redacted&")}}else J=null;else J=z;return"XMLHTTP REQ ("+w+") [attempt "+L+"]: "+p+`
`+y+`
`+J})}function Rs(u,p,y,w,L,z,J){u.info(function(){return"XMLHTTP RESP ("+w+") [ attempt "+L+"]: "+p+`
`+y+`
`+z+" "+J})}function In(u,p,y,w){u.info(function(){return"XMLHTTP TEXT ("+p+"): "+bc(u,y)+(w?" "+w:"")})}function Jo(u,p){u.info(function(){return"TIMEOUT: "+p})}Oi.prototype.info=function(){};function bc(u,p){if(!u.g)return p;if(!p)return null;try{var y=JSON.parse(p);if(y){for(u=0;u<y.length;u++)if(Array.isArray(y[u])){var w=y[u];if(!(2>w.length)){var L=w[1];if(Array.isArray(L)&&!(1>L.length)){var z=L[0];if(z!="noop"&&z!="stop"&&z!="close")for(var J=1;J<L.length;J++)L[J]=""}}}}return Wo(y)}catch{return p}}var Cs={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ml={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Sn;function Mi(){}$(Mi,Vi),Mi.prototype.g=function(){return new XMLHttpRequest},Mi.prototype.i=function(){return{}},Sn=new Mi;function An(u,p,y,w){this.j=u,this.i=p,this.l=y,this.R=w||1,this.U=new Di(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new gl}function gl(){this.i=null,this.g="",this.h=!1}var Zo={},Ps={};function ks(u,p,y){u.L=1,u.v=zr(rn(p)),u.m=y,u.P=!0,ea(u,null)}function ea(u,p){u.F=Date.now(),He(u),u.A=rn(u.v);var y=u.A,w=u.R;Array.isArray(w)||(w=[String(w)]),$r(y.i,"t",w),u.C=0,y=u.j.J,u.h=new gl,u.g=bl(u.j,y?p:null,!u.m),0<u.O&&(u.M=new Ni(C(u.Y,u,u.g),u.O)),p=u.U,y=u.g,w=u.ca;var L="readystatechange";Array.isArray(L)||(L&&(qo[0]=L.toString()),L=qo);for(var z=0;z<L.length;z++){var J=Uo(y,L[z],w||p.handleEvent,!1,p.h||p);if(!J)break;p.g[J.key]=J}p=u.H?A(u.H):{},u.m?(u.u||(u.u="POST"),p["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.A,u.u,u.m,p)):(u.u="GET",u.g.ea(u.A,u.u,null,p)),fr(),Li(u.i,u.u,u.A,u.l,u.R,u.m)}An.prototype.ca=function(u){u=u.target;const p=this.M;p&&Gt(u)==3?p.j():this.Y(u)},An.prototype.Y=function(u){try{if(u==this.g)e:{const at=Gt(this.g);var p=this.g.Ba();const pn=this.g.Z();if(!(3>at)&&(at!=3||this.g&&(this.h.h||this.g.oa()||oa(this.g)))){this.J||at!=4||p==7||(p==8||0>=pn?fr(3):fr(2)),Fi(this);var y=this.g.Z();this.X=y;t:if(yl(this)){var w=oa(this.g);u="";var L=w.length,z=Gt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){dn(this),Mr(this);var J="";break t}this.h.i=new f.TextDecoder}for(p=0;p<L;p++)this.h.h=!0,u+=this.h.i.decode(w[p],{stream:!(z&&p==L-1)});w.length=0,this.h.g+=u,this.C=0,J=this.h.g}else J=this.g.oa();if(this.o=y==200,Rs(this.i,this.u,this.A,this.l,this.R,at,y),this.o){if(this.T&&!this.K){t:{if(this.g){var je,pt=this.g;if((je=pt.g?pt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ce(je)){var De=je;break t}}De=null}if(y=De)In(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ta(this,y);else{this.o=!1,this.s=3,it(12),dn(this),Mr(this);break e}}if(this.P){y=!0;let on;for(;!this.J&&this.C<J.length;)if(on=Oc(this,J),on==Ps){at==4&&(this.s=4,it(14),y=!1),In(this.i,this.l,null,"[Incomplete Response]");break}else if(on==Zo){this.s=4,it(15),In(this.i,this.l,J,"[Invalid Chunk]"),y=!1;break}else In(this.i,this.l,on,null),ta(this,on);if(yl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),at!=4||J.length!=0||this.h.h||(this.s=1,it(16),y=!1),this.o=this.o&&y,!y)In(this.i,this.l,J,"[Invalid Chunked Response]"),dn(this),Mr(this);else if(0<J.length&&!this.W){this.W=!0;var wt=this.j;wt.g==this&&wt.ba&&!wt.M&&(wt.j.info("Great, no buffering proxy detected. Bytes received: "+J.length),la(wt),wt.M=!0,it(11))}}else In(this.i,this.l,J,null),ta(this,J);at==4&&dn(this),this.o&&!this.J&&(at==4?js(this.j,this):(this.o=!1,He(this)))}else Os(this.g),y==400&&0<J.indexOf("Unknown SID")?(this.s=3,it(12)):(this.s=0,it(13)),dn(this),Mr(this)}}}catch{}finally{}};function yl(u){return u.g?u.u=="GET"&&u.L!=2&&u.j.Ca:!1}function Oc(u,p){var y=u.C,w=p.indexOf(`
`,y);return w==-1?Ps:(y=Number(p.substring(y,w)),isNaN(y)?Zo:(w+=1,w+y>p.length?Ps:(p=p.slice(w,w+y),u.C=w+y,p)))}An.prototype.cancel=function(){this.J=!0,dn(this)};function He(u){u.S=Date.now()+u.I,_l(u,u.I)}function _l(u,p){if(u.B!=null)throw Error("WatchDog timer not null");u.B=Tn(C(u.ba,u),p)}function Fi(u){u.B&&(f.clearTimeout(u.B),u.B=null)}An.prototype.ba=function(){this.B=null;const u=Date.now();0<=u-this.S?(Jo(this.i,this.A),this.L!=2&&(fr(),it(17)),dn(this),this.s=2,Mr(this)):_l(this,this.S-u)};function Mr(u){u.j.G==0||u.J||js(u.j,u)}function dn(u){Fi(u);var p=u.M;p&&typeof p.ma=="function"&&p.ma(),u.M=null,Ho(u.U),u.g&&(p=u.g,u.g=null,p.abort(),p.ma())}function ta(u,p){try{var y=u.j;if(y.G!=0&&(y.g==u||Bt(y.h,u))){if(!u.K&&Bt(y.h,u)&&y.G==3){try{var w=y.Da.g.parse(p)}catch{w=null}if(Array.isArray(w)&&w.length==3){var L=w;if(L[0]==0){e:if(!y.u){if(y.g)if(y.g.F+3e3<u.F)Us(y),xn(y);else break e;Fs(y),it(18)}}else y.za=L[1],0<y.za-y.T&&37500>L[2]&&y.F&&y.v==0&&!y.C&&(y.C=Tn(C(y.Za,y),6e3));if(1>=wl(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else _r(y,11)}else if((u.K||y.g==u)&&Us(y),!ce(p))for(L=y.Da.g.parse(p),p=0;p<L.length;p++){let De=L[p];if(y.T=De[0],De=De[1],y.G==2)if(De[0]=="c"){y.K=De[1],y.ia=De[2];const wt=De[3];wt!=null&&(y.la=wt,y.j.info("VER="+y.la));const at=De[4];at!=null&&(y.Aa=at,y.j.info("SVER="+y.Aa));const pn=De[5];pn!=null&&typeof pn=="number"&&0<pn&&(w=1.5*pn,y.L=w,y.j.info("backChannelRequestTimeoutMs_="+w)),w=y;const on=u.g;if(on){const Hi=on.g?on.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Hi){var z=w.h;z.g||Hi.indexOf("spdy")==-1&&Hi.indexOf("quic")==-1&&Hi.indexOf("h2")==-1||(z.j=z.l,z.g=new Set,z.h&&(na(z,z.h),z.h=null))}if(w.D){const Bs=on.g?on.g.getResponseHeader("X-HTTP-Session-Id"):null;Bs&&(w.ya=Bs,ze(w.I,w.D,Bs))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-u.F,y.j.info("Handshake RTT: "+y.R+"ms")),w=y;var J=u;if(w.qa=Vl(w,w.J?w.ia:null,w.W),J.K){El(w.h,J);var je=J,pt=w.L;pt&&(je.I=pt),je.B&&(Fi(je),He(je)),w.g=J}else qi(w);0<y.i.length&&Qn(y)}else De[0]!="stop"&&De[0]!="close"||_r(y,7);else y.G==3&&(De[0]=="stop"||De[0]=="close"?De[0]=="stop"?_r(y,7):Pt(y):De[0]!="noop"&&y.l&&y.l.ta(De),y.v=0)}}fr(4)}catch{}}var vl=class{constructor(u,p){this.g=u,this.map=p}};function Ui(u){this.l=u||10,f.PerformanceNavigationTiming?(u=f.performance.getEntriesByType("navigation"),u=0<u.length&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(f.chrome&&f.chrome.loadTimes&&f.chrome.loadTimes()&&f.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function nn(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function wl(u){return u.h?1:u.g?u.g.size:0}function Bt(u,p){return u.h?u.h==p:u.g?u.g.has(p):!1}function na(u,p){u.g?u.g.add(p):u.h=p}function El(u,p){u.h&&u.h==p?u.h=null:u.g&&u.g.has(p)&&u.g.delete(p)}Ui.prototype.cancel=function(){if(this.i=Tl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function Tl(u){if(u.h!=null)return u.i.concat(u.h.D);if(u.g!=null&&u.g.size!==0){let p=u.i;for(const y of u.g.values())p=p.concat(y.D);return p}return G(u.i)}function xs(u){if(u.V&&typeof u.V=="function")return u.V();if(typeof Map<"u"&&u instanceof Map||typeof Set<"u"&&u instanceof Set)return Array.from(u.values());if(typeof u=="string")return u.split("");if(g(u)){for(var p=[],y=u.length,w=0;w<y;w++)p.push(u[w]);return p}p=[],y=0;for(w in u)p[y++]=u[w];return p}function Ns(u){if(u.na&&typeof u.na=="function")return u.na();if(!u.V||typeof u.V!="function"){if(typeof Map<"u"&&u instanceof Map)return Array.from(u.keys());if(!(typeof Set<"u"&&u instanceof Set)){if(g(u)||typeof u=="string"){var p=[];u=u.length;for(var y=0;y<u;y++)p.push(y);return p}p=[],y=0;for(const w in u)p[y++]=w;return p}}}function Fr(u,p){if(u.forEach&&typeof u.forEach=="function")u.forEach(p,void 0);else if(g(u)||typeof u=="string")Array.prototype.forEach.call(u,p,void 0);else for(var y=Ns(u),w=xs(u),L=w.length,z=0;z<L;z++)p.call(void 0,w[z],y&&y[z],u)}var ji=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Lc(u,p){if(u){u=u.split("&");for(var y=0;y<u.length;y++){var w=u[y].indexOf("="),L=null;if(0<=w){var z=u[y].substring(0,w);L=u[y].substring(w+1)}else z=u[y];p(z,L?decodeURIComponent(L.replace(/\+/g," ")):"")}}}function pr(u){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,u instanceof pr){this.h=u.h,zi(this,u.j),this.o=u.o,this.g=u.g,Ur(this,u.s),this.l=u.l;var p=u.i,y=new Wn;y.i=p.i,p.g&&(y.g=new Map(p.g),y.h=p.h),jr(this,y),this.m=u.m}else u&&(p=String(u).match(ji))?(this.h=!1,zi(this,p[1]||"",!0),this.o=xe(p[2]||""),this.g=xe(p[3]||"",!0),Ur(this,p[4]),this.l=xe(p[5]||"",!0),jr(this,p[6]||"",!0),this.m=xe(p[7]||"")):(this.h=!1,this.i=new Wn(null,this.h))}pr.prototype.toString=function(){var u=[],p=this.j;p&&u.push(Br(p,Ds,!0),":");var y=this.g;return(y||p=="file")&&(u.push("//"),(p=this.o)&&u.push(Br(p,Ds,!0),"@"),u.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&u.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push(Br(y,y.charAt(0)=="/"?Al:Sl,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",Br(y,ra)),u.join("")};function rn(u){return new pr(u)}function zi(u,p,y){u.j=y?xe(p,!0):p,u.j&&(u.j=u.j.replace(/:$/,""))}function Ur(u,p){if(p){if(p=Number(p),isNaN(p)||0>p)throw Error("Bad port number "+p);u.s=p}else u.s=null}function jr(u,p,y){p instanceof Wn?(u.i=p,Gn(u.i,u.h)):(y||(p=Br(p,Rl)),u.i=new Wn(p,u.h))}function ze(u,p,y){u.i.set(p,y)}function zr(u){return ze(u,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),u}function xe(u,p){return u?p?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Br(u,p,y){return typeof u=="string"?(u=encodeURI(u).replace(p,Il),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function Il(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var Ds=/[#\/\?@]/g,Sl=/[#\?:]/g,Al=/[#\?]/g,Rl=/[#\?@]/g,ra=/#/g;function Wn(u,p){this.h=this.g=null,this.i=u||null,this.j=!!p}function Ct(u){u.g||(u.g=new Map,u.h=0,u.i&&Lc(u.i,function(p,y){u.add(decodeURIComponent(p.replace(/\+/g," ")),y)}))}r=Wn.prototype,r.add=function(u,p){Ct(this),this.i=null,u=fn(this,u);var y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(p),this.h+=1,this};function Rn(u,p){Ct(u),p=fn(u,p),u.g.has(p)&&(u.i=null,u.h-=u.g.get(p).length,u.g.delete(p))}function Cn(u,p){return Ct(u),p=fn(u,p),u.g.has(p)}r.forEach=function(u,p){Ct(this),this.g.forEach(function(y,w){y.forEach(function(L){u.call(p,L,w,this)},this)},this)},r.na=function(){Ct(this);const u=Array.from(this.g.values()),p=Array.from(this.g.keys()),y=[];for(let w=0;w<p.length;w++){const L=u[w];for(let z=0;z<L.length;z++)y.push(p[w])}return y},r.V=function(u){Ct(this);let p=[];if(typeof u=="string")Cn(this,u)&&(p=p.concat(this.g.get(fn(this,u))));else{u=Array.from(this.g.values());for(let y=0;y<u.length;y++)p=p.concat(u[y])}return p},r.set=function(u,p){return Ct(this),this.i=null,u=fn(this,u),Cn(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[p]),this.h+=1,this},r.get=function(u,p){return u?(u=this.V(u),0<u.length?String(u[0]):p):p};function $r(u,p,y){Rn(u,p),0<y.length&&(u.i=null,u.g.set(fn(u,p),G(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],p=Array.from(this.g.keys());for(var y=0;y<p.length;y++){var w=p[y];const z=encodeURIComponent(String(w)),J=this.V(w);for(w=0;w<J.length;w++){var L=z;J[w]!==""&&(L+="="+encodeURIComponent(String(J[w]))),u.push(L)}}return this.i=u.join("&")};function fn(u,p){return p=String(p),u.j&&(p=p.toLowerCase()),p}function Gn(u,p){p&&!u.j&&(Ct(u),u.i=null,u.g.forEach(function(y,w){var L=w.toLowerCase();w!=L&&(Rn(this,w),$r(this,L,y))},u)),u.j=p}function Mc(u,p){const y=new Oi;if(f.Image){const w=new Image;w.onload=U(Wt,y,"TestLoadImage: loaded",!0,p,w),w.onerror=U(Wt,y,"TestLoadImage: error",!1,p,w),w.onabort=U(Wt,y,"TestLoadImage: abort",!1,p,w),w.ontimeout=U(Wt,y,"TestLoadImage: timeout",!1,p,w),f.setTimeout(function(){w.ontimeout&&w.ontimeout()},1e4),w.src=u}else p(!1)}function Cl(u,p){const y=new Oi,w=new AbortController,L=setTimeout(()=>{w.abort(),Wt(y,"TestPingServer: timeout",!1,p)},1e4);fetch(u,{signal:w.signal}).then(z=>{clearTimeout(L),z.ok?Wt(y,"TestPingServer: ok",!0,p):Wt(y,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(L),Wt(y,"TestPingServer: error",!1,p)})}function Wt(u,p,y,w,L){try{L&&(L.onload=null,L.onerror=null,L.onabort=null,L.ontimeout=null),w(y)}catch{}}function Fc(){this.g=new Ko}function Pl(u,p,y){const w=y||"";try{Fr(u,function(L,z){let J=L;_(L)&&(J=Wo(L)),p.push(w+z+"="+encodeURIComponent(J))})}catch(L){throw p.push(w+"type="+encodeURIComponent("_badmap")),L}}function mr(u){this.l=u.Ub||null,this.j=u.eb||!1}$(mr,Vi),mr.prototype.g=function(){return new Bi(this.l,this.j)},mr.prototype.i=(function(u){return function(){return u}})({});function Bi(u,p){dt.call(this),this.D=u,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}$(Bi,dt),r=Bi.prototype,r.open=function(u,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=u,this.A=p,this.readyState=1,kn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const p={headers:this.u,method:this.B,credentials:this.m,cache:void 0};u&&(p.body=u),(this.D||f).fetch(new Request(this.A,p)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Pn(this)),this.readyState=0},r.Sa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,kn(this)),this.g&&(this.readyState=3,kn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof f.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;kl(this)}else u.text().then(this.Ra.bind(this),this.ga.bind(this))};function kl(u){u.j.read().then(u.Pa.bind(u)).catch(u.ga.bind(u))}r.Pa=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var p=u.value?u.value:new Uint8Array(0);(p=this.v.decode(p,{stream:!u.done}))&&(this.response=this.responseText+=p)}u.done?Pn(this):kn(this),this.readyState==3&&kl(this)}},r.Ra=function(u){this.g&&(this.response=this.responseText=u,Pn(this))},r.Qa=function(u){this.g&&(this.response=u,Pn(this))},r.ga=function(){this.g&&Pn(this)};function Pn(u){u.readyState=4,u.l=null,u.j=null,u.v=null,kn(u)}r.setRequestHeader=function(u,p){this.u.append(u,p)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],p=this.h.entries();for(var y=p.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=p.next();return u.join(`\r
`)};function kn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(Bi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function gr(u){let p="";return Te(u,function(y,w){p+=w,p+=":",p+=y,p+=`\r
`}),p}function qr(u,p,y){e:{for(w in y){var w=!1;break e}w=!0}w||(y=gr(y),typeof u=="string"?y!=null&&encodeURIComponent(String(y)):ze(u,p,y))}function Xe(u){dt.call(this),this.headers=new Map,this.o=u||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}$(Xe,dt);var Uc=/^https?$/i,ia=["POST","PUT"];r=Xe.prototype,r.Ha=function(u){this.J=u},r.ea=function(u,p,y,w){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);p=p?p.toUpperCase():"GET",this.D=u,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Sn.g(),this.v=this.o?Ts(this.o):Ts(Sn),this.g.onreadystatechange=C(this.Ea,this);try{this.B=!0,this.g.open(p,String(u),!0),this.B=!1}catch(z){$i(this,z);return}if(u=y||"",y=new Map(this.headers),w)if(Object.getPrototypeOf(w)===Object.prototype)for(var L in w)y.set(L,w[L]);else if(typeof w.keys=="function"&&typeof w.get=="function")for(const z of w.keys())y.set(z,w.get(z));else throw Error("Unknown input type for opt_headers: "+String(w));w=Array.from(y.keys()).find(z=>z.toLowerCase()=="content-type"),L=f.FormData&&u instanceof f.FormData,!(0<=Array.prototype.indexOf.call(ia,p,void 0))||w||L||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[z,J]of y)this.g.setRequestHeader(z,J);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{bs(this),this.u=!0,this.g.send(u),this.u=!1}catch(z){$i(this,z)}};function $i(u,p){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=p,u.m=5,Vs(u),sn(u)}function Vs(u){u.A||(u.A=!0,ft(u,"complete"),ft(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=u||7,ft(this,"complete"),ft(this,"abort"),sn(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),sn(this,!0)),Xe.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?sa(this):this.bb())},r.bb=function(){sa(this)};function sa(u){if(u.h&&typeof h<"u"&&(!u.v[1]||Gt(u)!=4||u.Z()!=2)){if(u.u&&Gt(u)==4)$o(u.Ea,0,u);else if(ft(u,"readystatechange"),Gt(u)==4){u.h=!1;try{const J=u.Z();e:switch(J){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break e;default:p=!1}var y;if(!(y=p)){var w;if(w=J===0){var L=String(u.D).match(ji)[1]||null;!L&&f.self&&f.self.location&&(L=f.self.location.protocol.slice(0,-1)),w=!Uc.test(L?L.toLowerCase():"")}y=w}if(y)ft(u,"complete"),ft(u,"success");else{u.m=6;try{var z=2<Gt(u)?u.g.statusText:""}catch{z=""}u.l=z+" ["+u.Z()+"]",Vs(u)}}finally{sn(u)}}}}function sn(u,p){if(u.g){bs(u);const y=u.g,w=u.v[0]?()=>{}:null;u.g=null,u.v=null,p||ft(u,"ready");try{y.onreadystatechange=w}catch{}}}function bs(u){u.I&&(f.clearTimeout(u.I),u.I=null)}r.isActive=function(){return!!this.g};function Gt(u){return u.g?u.g.readyState:0}r.Z=function(){try{return 2<Gt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(u){if(this.g){var p=this.g.responseText;return u&&p.indexOf(u)==0&&(p=p.substring(u.length)),Go(p)}};function oa(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.H){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function Os(u){const p={};u=(u.g&&2<=Gt(u)&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let w=0;w<u.length;w++){if(ce(u[w]))continue;var y=x(u[w]);const L=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const z=p[L]||[];p[L]=z,z.push(y)}D(p,function(w){return w.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Kn(u,p,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||p}function aa(u){this.Aa=0,this.i=[],this.j=new Oi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Kn("failFast",!1,u),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Kn("baseRetryDelayMs",5e3,u),this.cb=Kn("retryDelaySeedMs",1e4,u),this.Wa=Kn("forwardChannelMaxRetries",2,u),this.wa=Kn("forwardChannelRequestTimeoutMs",2e4,u),this.pa=u&&u.xmlHttpFactory||void 0,this.Xa=u&&u.Tb||void 0,this.Ca=u&&u.useFetchStreams||!1,this.L=void 0,this.J=u&&u.supportsCrossDomainXhr||!1,this.K="",this.h=new Ui(u&&u.concurrentRequestLimit),this.Da=new Fc,this.P=u&&u.fastHandshake||!1,this.O=u&&u.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=u&&u.Rb||!1,u&&u.xa&&this.j.xa(),u&&u.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&u&&u.detectBufferingProxy||!1,this.ja=void 0,u&&u.longPollingTimeout&&0<u.longPollingTimeout&&(this.ja=u.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=aa.prototype,r.la=8,r.G=1,r.connect=function(u,p,y,w){it(0),this.W=u,this.H=p||{},y&&w!==void 0&&(this.H.OSID=y,this.H.OAID=w),this.F=this.X,this.I=Vl(this,null,this.W),Qn(this)};function Pt(u){if(Ls(u),u.G==3){var p=u.U++,y=rn(u.I);if(ze(y,"SID",u.K),ze(y,"RID",p),ze(y,"TYPE","terminate"),yr(u,y),p=new An(u,u.j,p),p.L=2,p.v=zr(rn(y)),y=!1,f.navigator&&f.navigator.sendBeacon)try{y=f.navigator.sendBeacon(p.v.toString(),"")}catch{}!y&&f.Image&&(new Image().src=p.v,y=!0),y||(p.g=bl(p.j,null),p.g.ea(p.v)),p.F=Date.now(),He(p)}Dl(u)}function xn(u){u.g&&(la(u),u.g.cancel(),u.g=null)}function Ls(u){xn(u),u.u&&(f.clearTimeout(u.u),u.u=null),Us(u),u.h.cancel(),u.s&&(typeof u.s=="number"&&f.clearTimeout(u.s),u.s=null)}function Qn(u){if(!nn(u.h)&&!u.s){u.s=!0;var p=u.Ga;Fe||re(),Z||(Fe(),Z=!0),he.add(p,u),u.B=0}}function jc(u,p){return wl(u.h)>=u.h.j-(u.s?1:0)?!1:u.s?(u.i=p.D.concat(u.i),!0):u.G==1||u.G==2||u.B>=(u.Va?0:u.Wa)?!1:(u.s=Tn(C(u.Ga,u,p),Nl(u,u.B)),u.B++,!0)}r.Ga=function(u){if(this.s)if(this.s=null,this.G==1){if(!u){this.U=Math.floor(1e5*Math.random()),u=this.U++;const L=new An(this,this.j,u);let z=this.o;if(this.S&&(z?(z=A(z),P(z,this.S)):z=this.S),this.m!==null||this.O||(L.H=z,z=null),this.P)e:{for(var p=0,y=0;y<this.i.length;y++){t:{var w=this.i[y];if("__data__"in w.map&&(w=w.map.__data__,typeof w=="string")){w=w.length;break t}w=void 0}if(w===void 0)break;if(p+=w,4096<p){p=y;break e}if(p===4096||y===this.i.length-1){p=y+1;break e}}p=1e3}else p=1e3;p=Hr(this,L,p),y=rn(this.I),ze(y,"RID",u),ze(y,"CVER",22),this.D&&ze(y,"X-HTTP-Session-Id",this.D),yr(this,y),z&&(this.O?p="headers="+encodeURIComponent(String(gr(z)))+"&"+p:this.m&&qr(y,this.m,z)),na(this.h,L),this.Ua&&ze(y,"TYPE","init"),this.P?(ze(y,"$req",p),ze(y,"SID","null"),L.T=!0,ks(L,y,null)):ks(L,y,p),this.G=2}}else this.G==3&&(u?Ms(this,u):this.i.length==0||nn(this.h)||Ms(this))};function Ms(u,p){var y;p?y=p.l:y=u.U++;const w=rn(u.I);ze(w,"SID",u.K),ze(w,"RID",y),ze(w,"AID",u.T),yr(u,w),u.m&&u.o&&qr(w,u.m,u.o),y=new An(u,u.j,y,u.B+1),u.m===null&&(y.H=u.o),p&&(u.i=p.D.concat(u.i)),p=Hr(u,y,1e3),y.I=Math.round(.5*u.wa)+Math.round(.5*u.wa*Math.random()),na(u.h,y),ks(y,w,p)}function yr(u,p){u.H&&Te(u.H,function(y,w){ze(p,w,y)}),u.l&&Fr({},function(y,w){ze(p,w,y)})}function Hr(u,p,y){y=Math.min(u.i.length,y);var w=u.l?C(u.l.Na,u.l,u):null;e:{var L=u.i;let z=-1;for(;;){const J=["count="+y];z==-1?0<y?(z=L[0].g,J.push("ofs="+z)):z=0:J.push("ofs="+z);let je=!0;for(let pt=0;pt<y;pt++){let De=L[pt].g;const wt=L[pt].map;if(De-=z,0>De)z=Math.max(0,L[pt].g-100),je=!1;else try{Pl(wt,J,"req"+De+"_")}catch{w&&w(wt)}}if(je){w=J.join("&");break e}}}return u=u.i.splice(0,y),p.D=u,w}function qi(u){if(!u.g&&!u.u){u.Y=1;var p=u.Fa;Fe||re(),Z||(Fe(),Z=!0),he.add(p,u),u.v=0}}function Fs(u){return u.g||u.u||3<=u.v?!1:(u.Y++,u.u=Tn(C(u.Fa,u),Nl(u,u.v)),u.v++,!0)}r.Fa=function(){if(this.u=null,xl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var u=2*this.R;this.j.info("BP detection timer enabled: "+u),this.A=Tn(C(this.ab,this),u)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,it(10),xn(this),xl(this))};function la(u){u.A!=null&&(f.clearTimeout(u.A),u.A=null)}function xl(u){u.g=new An(u,u.j,"rpc",u.Y),u.m===null&&(u.g.H=u.o),u.g.O=0;var p=rn(u.qa);ze(p,"RID","rpc"),ze(p,"SID",u.K),ze(p,"AID",u.T),ze(p,"CI",u.F?"0":"1"),!u.F&&u.ja&&ze(p,"TO",u.ja),ze(p,"TYPE","xmlhttp"),yr(u,p),u.m&&u.o&&qr(p,u.m,u.o),u.L&&(u.g.I=u.L);var y=u.g;u=u.ia,y.L=1,y.v=zr(rn(p)),y.m=null,y.P=!0,ea(y,u)}r.Za=function(){this.C!=null&&(this.C=null,xn(this),Fs(this),it(19))};function Us(u){u.C!=null&&(f.clearTimeout(u.C),u.C=null)}function js(u,p){var y=null;if(u.g==p){Us(u),la(u),u.g=null;var w=2}else if(Bt(u.h,p))y=p.D,El(u.h,p),w=1;else return;if(u.G!=0){if(p.o)if(w==1){y=p.m?p.m.length:0,p=Date.now()-p.F;var L=u.B;w=bi(),ft(w,new As(w,y)),Qn(u)}else qi(u);else if(L=p.s,L==3||L==0&&0<p.X||!(w==1&&jc(u,p)||w==2&&Fs(u)))switch(y&&0<y.length&&(p=u.h,p.i=p.i.concat(y)),L){case 1:_r(u,5);break;case 4:_r(u,10);break;case 3:_r(u,6);break;default:_r(u,2)}}}function Nl(u,p){let y=u.Ta+Math.floor(Math.random()*u.cb);return u.isActive()||(y*=2),y*p}function _r(u,p){if(u.j.info("Error code "+p),p==2){var y=C(u.fb,u),w=u.Xa;const L=!w;w=new pr(w||"//www.google.com/images/cleardot.gif"),f.location&&f.location.protocol=="http"||zi(w,"https"),zr(w),L?Mc(w.toString(),y):Cl(w.toString(),y)}else it(2);u.G=0,u.l&&u.l.sa(p),Dl(u),Ls(u)}r.fb=function(u){u?(this.j.info("Successfully pinged google.com"),it(2)):(this.j.info("Failed to ping google.com"),it(1))};function Dl(u){if(u.G=0,u.ka=[],u.l){const p=Tl(u.h);(p.length!=0||u.i.length!=0)&&(q(u.ka,p),q(u.ka,u.i),u.h.i.length=0,G(u.i),u.i.length=0),u.l.ra()}}function Vl(u,p,y){var w=y instanceof pr?rn(y):new pr(y);if(w.g!="")p&&(w.g=p+"."+w.g),Ur(w,w.s);else{var L=f.location;w=L.protocol,p=p?p+"."+L.hostname:L.hostname,L=+L.port;var z=new pr(null);w&&zi(z,w),p&&(z.g=p),L&&Ur(z,L),y&&(z.l=y),w=z}return y=u.D,p=u.ya,y&&p&&ze(w,y,p),ze(w,"VER",u.la),yr(u,w),w}function bl(u,p,y){if(p&&!u.J)throw Error("Can't create secondary domain capable XhrIo object.");return p=u.Ca&&!u.pa?new Xe(new mr({eb:y})):new Xe(u.pa),p.Ha(u.J),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function ua(){}r=ua.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function zs(){}zs.prototype.g=function(u,p){return new $t(u,p)};function $t(u,p){dt.call(this),this.g=new aa(p),this.l=u,this.h=p&&p.messageUrlParams||null,u=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(u?u["X-WebChannel-Content-Type"]=p.messageContentType:u={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.va&&(u?u["X-WebChannel-Client-Profile"]=p.va:u={"X-WebChannel-Client-Profile":p.va}),this.g.S=u,(u=p&&p.Sb)&&!ce(u)&&(this.g.m=u),this.v=p&&p.supportsCrossDomainXhr||!1,this.u=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!ce(p)&&(this.g.D=p,u=this.h,u!==null&&p in u&&(u=this.h,p in u&&delete u[p])),this.j=new Yn(this)}$($t,dt),$t.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},$t.prototype.close=function(){Pt(this.g)},$t.prototype.o=function(u){var p=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.u&&(y={},y.__data__=Wo(u),u=y);p.i.push(new vl(p.Ya++,u)),p.G==3&&Qn(p)},$t.prototype.N=function(){this.g.l=null,delete this.j,Pt(this.g),delete this.g,$t.aa.N.call(this)};function Ol(u){qn.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var p=u.__sm__;if(p){e:{for(const y in p){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,p=p!==null&&u in p?p[u]:void 0),this.data=p}else this.data=u}$(Ol,qn);function Ll(){Ss.call(this),this.status=1}$(Ll,Ss);function Yn(u){this.g=u}$(Yn,ua),Yn.prototype.ua=function(){ft(this.g,"a")},Yn.prototype.ta=function(u){ft(this.g,new Ol(u))},Yn.prototype.sa=function(u){ft(this.g,new Ll)},Yn.prototype.ra=function(){ft(this.g,"b")},zs.prototype.createWebChannel=zs.prototype.g,$t.prototype.send=$t.prototype.o,$t.prototype.open=$t.prototype.m,$t.prototype.close=$t.prototype.close,z_=function(){return new zs},j_=function(){return bi()},U_=Hn,Nd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Cs.NO_ERROR=0,Cs.TIMEOUT=8,Cs.HTTP_ERROR=6,ju=Cs,ml.COMPLETE="complete",F_=ml,Is.EventType=hn,hn.OPEN="a",hn.CLOSE="b",hn.ERROR="c",hn.MESSAGE="d",dt.prototype.listen=dt.prototype.K,La=Is,Xe.prototype.listenOnce=Xe.prototype.L,Xe.prototype.getLastError=Xe.prototype.Ka,Xe.prototype.getLastErrorCode=Xe.prototype.Ba,Xe.prototype.getStatus=Xe.prototype.Z,Xe.prototype.getResponseJson=Xe.prototype.Oa,Xe.prototype.getResponseText=Xe.prototype.oa,Xe.prototype.send=Xe.prototype.ea,Xe.prototype.setWithCredentials=Xe.prototype.Ha,M_=Xe}).apply(typeof Nu<"u"?Nu:typeof self<"u"?self:typeof window<"u"?window:{});const zg="@firebase/firestore",Bg="4.8.0";/**
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
 */let Vo="11.10.0";/**
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
 */const us=new Yd("@firebase/firestore");function uo(){return us.logLevel}function ne(r,...e){if(us.logLevel<=Pe.DEBUG){const t=e.map(uf);us.debug(`Firestore (${Vo}): ${r}`,...t)}}function Dr(r,...e){if(us.logLevel<=Pe.ERROR){const t=e.map(uf);us.error(`Firestore (${Vo}): ${r}`,...t)}}function vi(r,...e){if(us.logLevel<=Pe.WARN){const t=e.map(uf);us.warn(`Firestore (${Vo}): ${r}`,...t)}}function uf(r){if(typeof r=="string")return r;try{/**
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
 */function ye(r,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,B_(r,s,t)}function B_(r,e,t){let s=`FIRESTORE (${Vo}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Dr(s),new Error(s)}function Ue(r,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,r||B_(e,o,s)}function we(r,e){return r}/**
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
 */const B={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ee extends br{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class $_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class MS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ut.UNAUTHENTICATED)))}shutdown(){}}class FS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class US{constructor(e){this.t=e,this.currentUser=Ut.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ue(this.o===void 0,42304);let s=this.i;const o=g=>this.i!==s?(s=this.i,t(g)):Promise.resolve();let l=new yi;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new yi,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{ne("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(ne("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new yi)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(ne("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Ue(typeof s.accessToken=="string",31837,{l:s}),new $_(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ue(e===null||typeof e=="string",2055,{h:e}),new Ut(e)}}class jS{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Ut.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class zS{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new jS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ut.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class $g{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class BS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Mn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Ue(this.o===void 0,3512);const s=l=>{l.error!=null&&ne("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,ne("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>s(l)))};const o=l=>{ne("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):ne("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new $g(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Ue(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new $g(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function q_(){return new TextEncoder}/**
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
 */class cf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=$S(40);for(let l=0;l<o.length;++l)s.length<20&&o[l]<t&&(s+=e.charAt(o[l]%62))}return s}}function Ae(r,e){return r<e?-1:r>e?1:0}function Dd(r,e){let t=0;for(;t<r.length&&t<e.length;){const s=r.codePointAt(t),o=e.codePointAt(t);if(s!==o){if(s<128&&o<128)return Ae(s,o);{const l=q_(),h=qS(l.encode(qg(r,t)),l.encode(qg(e,t)));return h!==0?h:Ae(s,o)}}t+=s>65535?2:1}return Ae(r.length,e.length)}function qg(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function qS(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return Ae(r[t],e[t]);return Ae(r.length,e.length)}function To(r,e,t){return r.length===e.length&&r.every(((s,o)=>t(s,e[o])))}/**
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
 */const Hg="__name__";class tr{constructor(e,t,s){t===void 0?t=0:t>e.length&&ye(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&ye(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return tr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof tr?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const l=tr.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return Ae(e.length,t.length)}static compareSegments(e,t){const s=tr.isNumericId(e),o=tr.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?tr.extractNumericId(e).compare(tr.extractNumericId(t)):Dd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return gi.fromString(e.substring(4,e.length-2))}}class Ge extends tr{construct(e,t,s){return new Ge(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new ee(B.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new Ge(t)}static emptyPath(){return new Ge([])}}const HS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Dt extends tr{construct(e,t,s){return new Dt(e,t,s)}static isValidIdentifier(e){return HS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Dt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Hg}static keyField(){return new Dt([Hg])}static fromServerFormat(e){const t=[];let s="",o=0;const l=()=>{if(s.length===0)throw new ee(B.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new ee(B.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new ee(B.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=g,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(s+=f,o++):(l(),o++)}if(l(),h)throw new ee(B.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Dt(t)}static emptyPath(){return new Dt([])}}/**
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
 */class ue{constructor(e){this.path=e}static fromPath(e){return new ue(Ge.fromString(e))}static fromName(e){return new ue(Ge.fromString(e).popFirst(5))}static empty(){return new ue(Ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ge.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ue(new Ge(e.slice()))}}/**
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
 */function H_(r,e,t){if(!t)throw new ee(B.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function WS(r,e,t,s){if(e===!0&&s===!0)throw new ee(B.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Wg(r){if(!ue.isDocumentKey(r))throw new ee(B.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Gg(r){if(ue.isDocumentKey(r))throw new ee(B.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function W_(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function gc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":ye(12329,{type:typeof r})}function jn(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ee(B.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=gc(r);throw new ee(B.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
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
 */function ht(r,e){const t={typeString:r};return e&&(t.value=e),t}function ll(r,e){if(!W_(r))throw new ee(B.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,l="value"in e[s]?{value:e[s].value}:void 0;if(!(s in r)){t=`JSON missing required field: '${s}'`;break}const h=r[s];if(o&&typeof h!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${s}' field to equal '${l.value}'`;break}}if(t)throw new ee(B.INVALID_ARGUMENT,t);return!0}/**
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
 */const Kg=-62135596800,Qg=1e6;class Ye{static now(){return Ye.fromMillis(Date.now())}static fromDate(e){return Ye.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Qg);return new Ye(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ee(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ee(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Kg)throw new ee(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ee(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Qg}_compareTo(e){return this.seconds===e.seconds?Ae(this.nanoseconds,e.nanoseconds):Ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ye._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ll(e,Ye._jsonSchema))return new Ye(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Kg;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ye._jsonSchemaVersion="firestore/timestamp/1.0",Ye._jsonSchema={type:ht("string",Ye._jsonSchemaVersion),seconds:ht("number"),nanoseconds:ht("number")};/**
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
 */class ve{static fromTimestamp(e){return new ve(e)}static min(){return new ve(new Ye(0,0))}static max(){return new ve(new Ye(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const Qa=-1;function GS(r,e){const t=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,o=ve.fromTimestamp(s===1e9?new Ye(t+1,0):new Ye(t,s));return new wi(o,ue.empty(),e)}function KS(r){return new wi(r.readTime,r.key,Qa)}class wi{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new wi(ve.min(),ue.empty(),Qa)}static max(){return new wi(ve.max(),ue.empty(),Qa)}}function QS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=ue.comparator(r.documentKey,e.documentKey),t!==0?t:Ae(r.largestBatchId,e.largestBatchId))}/**
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
 */async function bo(r){if(r.code!==B.FAILED_PRECONDITION||r.message!==YS)throw r;ne("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class H{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ye(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new H(((s,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(s,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(s,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof H?t:H.resolve(t)}catch(t){return H.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):H.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):H.reject(t)}static resolve(e){return new H(((t,s)=>{t(e)}))}static reject(e){return new H(((t,s)=>{s(e)}))}static waitFor(e){return new H(((t,s)=>{let o=0,l=0,h=!1;e.forEach((f=>{++o,f.next((()=>{++l,h&&l===o&&t()}),(g=>s(g)))})),h=!0,l===o&&t()}))}static or(e){let t=H.resolve(!1);for(const s of e)t=t.next((o=>o?H.resolve(o):s()));return t}static forEach(e,t){const s=[];return e.forEach(((o,l)=>{s.push(t.call(this,o,l))})),this.waitFor(s)}static mapArray(e,t){return new H(((s,o)=>{const l=e.length,h=new Array(l);let f=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((E=>{h[_]=E,++f,f===l&&s(h)}),(E=>o(E)))}}))}static doWhile(e,t){return new H(((s,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):s()};l()}))}}function JS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Oo(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class yc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}yc.ue=-1;/**
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
 */const hf=-1;function _c(r){return r==null}function ec(r){return r===0&&1/r==-1/0}function ZS(r){return typeof r=="number"&&Number.isInteger(r)&&!ec(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const G_="";function e1(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Yg(e)),e=t1(r.get(t),e);return Yg(e)}function t1(r,e){let t=e;const s=r.length;for(let o=0;o<s;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case G_:t+="";break;default:t+=l}}return t}function Yg(r){return r+G_+""}/**
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
 */function Xg(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Ci(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function K_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class tt{constructor(e,t){this.comparator=e,this.root=t||Nt.EMPTY}insert(e,t){return new tt(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Nt.BLACK,null,null))}remove(e){return new tt(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Nt.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return t+s.left.size;o<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Du(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Du(this.root,e,this.comparator,!1)}getReverseIterator(){return new Du(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Du(this.root,e,this.comparator,!0)}}class Du{constructor(e,t,s,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?s(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Nt{constructor(e,t,s,o,l){this.key=e,this.value=t,this.color=s??Nt.RED,this.left=o??Nt.EMPTY,this.right=l??Nt.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,o,l){return new Nt(e??this.key,t??this.value,s??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let o=this;const l=s(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,s),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Nt.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Nt.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Nt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Nt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ye(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ye(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ye(27949);return e+(this.isRed()?0:1)}}Nt.EMPTY=null,Nt.RED=!0,Nt.BLACK=!1;Nt.EMPTY=new class{constructor(){this.size=0}get key(){throw ye(57766)}get value(){throw ye(16141)}get color(){throw ye(16727)}get left(){throw ye(29726)}get right(){throw ye(36894)}copy(e,t,s,o,l){return this}insert(e,t,s){return new Nt(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class yt{constructor(e){this.comparator=e,this.data=new tt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Jg(this.data.getIterator())}getIteratorFrom(e){return new Jg(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof yt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new yt(this.comparator);return t.data=e,t}}class Jg{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class cn{constructor(e){this.fields=e,e.sort(Dt.comparator)}static empty(){return new cn([])}unionWith(e){let t=new yt(Dt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new cn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return To(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
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
 */class Q_ extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Vt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Q_("Invalid base64 string: "+l):l}})(e);return new Vt(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new Vt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Vt.EMPTY_BYTE_STRING=new Vt("");const n1=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ei(r){if(Ue(!!r,39018),typeof r=="string"){let e=0;const t=n1.exec(r);if(Ue(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:ot(r.seconds),nanos:ot(r.nanos)}}function ot(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ti(r){return typeof r=="string"?Vt.fromBase64String(r):Vt.fromUint8Array(r)}/**
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
 */const Y_="server_timestamp",X_="__type__",J_="__previous_value__",Z_="__local_write_time__";function df(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[X_])===null||t===void 0?void 0:t.stringValue)===Y_}function vc(r){const e=r.mapValue.fields[J_];return df(e)?vc(e):e}function Ya(r){const e=Ei(r.mapValue.fields[Z_].timestampValue);return new Ye(e.seconds,e.nanos)}/**
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
 */class r1{constructor(e,t,s,o,l,h,f,g,_,E){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=E}}const tc="(default)";class Xa{constructor(e,t){this.projectId=e,this.database=t||tc}static empty(){return new Xa("","")}get isDefaultDatabase(){return this.database===tc}isEqual(e){return e instanceof Xa&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const ev="__type__",i1="__max__",Vu={mapValue:{}},tv="__vector__",nc="value";function Ii(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?df(r)?4:o1(r)?9007199254740991:s1(r)?10:11:ye(28295,{value:r})}function lr(r,e){if(r===e)return!0;const t=Ii(r);if(t!==Ii(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Ya(r).isEqual(Ya(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=Ei(o.timestampValue),f=Ei(l.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return Ti(o.bytesValue).isEqual(Ti(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ot(o.geoPointValue.latitude)===ot(l.geoPointValue.latitude)&&ot(o.geoPointValue.longitude)===ot(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ot(o.integerValue)===ot(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ot(o.doubleValue),f=ot(l.doubleValue);return h===f?ec(h)===ec(f):isNaN(h)&&isNaN(f)}return!1})(r,e);case 9:return To(r.arrayValue.values||[],e.arrayValue.values||[],lr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},f=l.mapValue.fields||{};if(Xg(h)!==Xg(f))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(f[g]===void 0||!lr(h[g],f[g])))return!1;return!0})(r,e);default:return ye(52216,{left:r})}}function Ja(r,e){return(r.values||[]).find((t=>lr(t,e)))!==void 0}function Io(r,e){if(r===e)return 0;const t=Ii(r),s=Ii(e);if(t!==s)return Ae(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return Ae(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const f=ot(l.integerValue||l.doubleValue),g=ot(h.integerValue||h.doubleValue);return f<g?-1:f>g?1:f===g?0:isNaN(f)?isNaN(g)?0:-1:1})(r,e);case 3:return Zg(r.timestampValue,e.timestampValue);case 4:return Zg(Ya(r),Ya(e));case 5:return Dd(r.stringValue,e.stringValue);case 6:return(function(l,h){const f=Ti(l),g=Ti(h);return f.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const f=l.split("/"),g=h.split("/");for(let _=0;_<f.length&&_<g.length;_++){const E=Ae(f[_],g[_]);if(E!==0)return E}return Ae(f.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const f=Ae(ot(l.latitude),ot(h.latitude));return f!==0?f:Ae(ot(l.longitude),ot(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ey(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var f,g,_,E;const T=l.fields||{},C=h.fields||{},U=(f=T[nc])===null||f===void 0?void 0:f.arrayValue,$=(g=C[nc])===null||g===void 0?void 0:g.arrayValue,G=Ae(((_=U==null?void 0:U.values)===null||_===void 0?void 0:_.length)||0,((E=$==null?void 0:$.values)===null||E===void 0?void 0:E.length)||0);return G!==0?G:ey(U,$)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===Vu.mapValue&&h===Vu.mapValue)return 0;if(l===Vu.mapValue)return 1;if(h===Vu.mapValue)return-1;const f=l.fields||{},g=Object.keys(f),_=h.fields||{},E=Object.keys(_);g.sort(),E.sort();for(let T=0;T<g.length&&T<E.length;++T){const C=Dd(g[T],E[T]);if(C!==0)return C;const U=Io(f[g[T]],_[E[T]]);if(U!==0)return U}return Ae(g.length,E.length)})(r.mapValue,e.mapValue);default:throw ye(23264,{le:t})}}function Zg(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Ae(r,e);const t=Ei(r),s=Ei(e),o=Ae(t.seconds,s.seconds);return o!==0?o:Ae(t.nanos,s.nanos)}function ey(r,e){const t=r.values||[],s=e.values||[];for(let o=0;o<t.length&&o<s.length;++o){const l=Io(t[o],s[o]);if(l)return l}return Ae(t.length,s.length)}function So(r){return Vd(r)}function Vd(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const s=Ei(t);return`time(${s.seconds},${s.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Ti(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return ue.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let s="[",o=!0;for(const l of t.values||[])o?o=!1:s+=",",s+=Vd(l);return s+"]"})(r.arrayValue):"mapValue"in r?(function(t){const s=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of s)l?l=!1:o+=",",o+=`${h}:${Vd(t.fields[h])}`;return o+"}"})(r.mapValue):ye(61005,{value:r})}function zu(r){switch(Ii(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=vc(r);return e?16+zu(e):16;case 5:return 2*r.stringValue.length;case 6:return Ti(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((o,l)=>o+zu(l)),0)})(r.arrayValue);case 10:case 11:return(function(s){let o=0;return Ci(s.fields,((l,h)=>{o+=l.length+zu(h)})),o})(r.mapValue);default:throw ye(13486,{value:r})}}function ty(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function bd(r){return!!r&&"integerValue"in r}function ff(r){return!!r&&"arrayValue"in r}function ny(r){return!!r&&"nullValue"in r}function ry(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Bu(r){return!!r&&"mapValue"in r}function s1(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[ev])===null||t===void 0?void 0:t.stringValue)===tv}function Ba(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Ci(r.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Ba(s))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ba(r.arrayValue.values[t]);return e}return Object.assign({},r)}function o1(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===i1}/**
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
 */class tn{constructor(e){this.value=e}static empty(){return new tn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!Bu(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ba(t)}setAll(e){let t=Dt.emptyPath(),s={},o=[];e.forEach(((h,f)=>{if(!t.isImmediateParentOf(f)){const g=this.getFieldsMap(t);this.applyChanges(g,s,o),s={},o=[],t=f.popLast()}h?s[f.lastSegment()]=Ba(h):o.push(f.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,s,o)}delete(e){const t=this.field(e.popLast());Bu(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return lr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=t.mapValue.fields[e.get(s)];Bu(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,s){Ci(t,((o,l)=>e[o]=l));for(const o of s)delete e[o]}clone(){return new tn(Ba(this.value))}}function nv(r){const e=[];return Ci(r.fields,((t,s)=>{const o=new Dt([t]);if(Bu(s)){const l=nv(s.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new cn(e)}/**
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
 */class jt{constructor(e,t,s,o,l,h,f){this.key=e,this.documentType=t,this.version=s,this.readTime=o,this.createTime=l,this.data=h,this.documentState=f}static newInvalidDocument(e){return new jt(e,0,ve.min(),ve.min(),ve.min(),tn.empty(),0)}static newFoundDocument(e,t,s,o){return new jt(e,1,t,ve.min(),s,o,0)}static newNoDocument(e,t){return new jt(e,2,t,ve.min(),ve.min(),tn.empty(),0)}static newUnknownDocument(e,t){return new jt(e,3,t,ve.min(),ve.min(),tn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ve.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=tn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=tn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ve.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof jt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new jt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class rc{constructor(e,t){this.position=e,this.inclusive=t}}function iy(r,e,t){let s=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?s=ue.comparator(ue.fromName(h.referenceValue),t.key):s=Io(h,t.data.field(l.field)),l.dir==="desc"&&(s*=-1),s!==0)break}return s}function sy(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!lr(r.position[t],e.position[t]))return!1;return!0}/**
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
 */class Za{constructor(e,t="asc"){this.field=e,this.dir=t}}function a1(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
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
 */class rv{}class ct extends rv{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new u1(e,t,s):t==="array-contains"?new d1(e,s):t==="in"?new f1(e,s):t==="not-in"?new p1(e,s):t==="array-contains-any"?new m1(e,s):new ct(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new c1(e,s):new h1(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Io(t,this.value)):t!==null&&Ii(this.value)===Ii(t)&&this.matchesComparison(Io(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ye(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $n extends rv{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new $n(e,t)}matches(e){return iv(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function iv(r){return r.op==="and"}function sv(r){return l1(r)&&iv(r)}function l1(r){for(const e of r.filters)if(e instanceof $n)return!1;return!0}function Od(r){if(r instanceof ct)return r.field.canonicalString()+r.op.toString()+So(r.value);if(sv(r))return r.filters.map((e=>Od(e))).join(",");{const e=r.filters.map((t=>Od(t))).join(",");return`${r.op}(${e})`}}function ov(r,e){return r instanceof ct?(function(s,o){return o instanceof ct&&s.op===o.op&&s.field.isEqual(o.field)&&lr(s.value,o.value)})(r,e):r instanceof $n?(function(s,o){return o instanceof $n&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce(((l,h,f)=>l&&ov(h,o.filters[f])),!0):!1})(r,e):void ye(19439)}function av(r){return r instanceof ct?(function(t){return`${t.field.canonicalString()} ${t.op} ${So(t.value)}`})(r):r instanceof $n?(function(t){return t.op.toString()+" {"+t.getFilters().map(av).join(" ,")+"}"})(r):"Filter"}class u1 extends ct{constructor(e,t,s){super(e,t,s),this.key=ue.fromName(s.referenceValue)}matches(e){const t=ue.comparator(e.key,this.key);return this.matchesComparison(t)}}class c1 extends ct{constructor(e,t){super(e,"in",t),this.keys=lv("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class h1 extends ct{constructor(e,t){super(e,"not-in",t),this.keys=lv("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function lv(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>ue.fromName(s.referenceValue)))}class d1 extends ct{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ff(t)&&Ja(t.arrayValue,this.value)}}class f1 extends ct{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ja(this.value.arrayValue,t)}}class p1 extends ct{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ja(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ja(this.value.arrayValue,t)}}class m1 extends ct{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ff(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>Ja(this.value.arrayValue,s)))}}/**
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
 */class g1{constructor(e,t=null,s=[],o=[],l=null,h=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=o,this.limit=l,this.startAt=h,this.endAt=f,this.Pe=null}}function oy(r,e=null,t=[],s=[],o=null,l=null,h=null){return new g1(r,e,t,s,o,l,h)}function pf(r){const e=we(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Od(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(l){return l.field.canonicalString()+l.dir})(s))).join(","),_c(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>So(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>So(s))).join(",")),e.Pe=t}return e.Pe}function mf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!a1(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!ov(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!sy(r.startAt,e.startAt)&&sy(r.endAt,e.endAt)}function Ld(r){return ue.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class Lo{constructor(e,t=null,s=[],o=[],l=null,h="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=l,this.limitType=h,this.startAt=f,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function y1(r,e,t,s,o,l,h,f){return new Lo(r,e,t,s,o,l,h,f)}function wc(r){return new Lo(r)}function ay(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function uv(r){return r.collectionGroup!==null}function $a(r){const e=we(r);if(e.Te===null){e.Te=[];const t=new Set;for(const l of e.explicitOrderBy)e.Te.push(l),t.add(l.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new yt(Dt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(f=f.add(_.field))}))})),f})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Te.push(new Za(l,s))})),t.has(Dt.keyField().canonicalString())||e.Te.push(new Za(Dt.keyField(),s))}return e.Te}function ir(r){const e=we(r);return e.Ie||(e.Ie=_1(e,$a(r))),e.Ie}function _1(r,e){if(r.limitType==="F")return oy(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new Za(o.field,l)}));const t=r.endAt?new rc(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new rc(r.startAt.position,r.startAt.inclusive):null;return oy(r.path,r.collectionGroup,e,r.filters,r.limit,t,s)}}function Md(r,e){const t=r.filters.concat([e]);return new Lo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function ic(r,e,t){return new Lo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Ec(r,e){return mf(ir(r),ir(e))&&r.limitType===e.limitType}function cv(r){return`${pf(ir(r))}|lt:${r.limitType}`}function co(r){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((o=>av(o))).join(", ")}]`),_c(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((o=>So(o))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((o=>So(o))).join(",")),`Target(${s})`})(ir(r))}; limitType=${r.limitType})`}function Tc(r,e){return e.isFoundDocument()&&(function(s,o){const l=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(l):ue.isDocumentKey(s.path)?s.path.isEqual(l):s.path.isImmediateParentOf(l)})(r,e)&&(function(s,o){for(const l of $a(s))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(s,o){for(const l of s.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(s,o){return!(s.startAt&&!(function(h,f,g){const _=iy(h,f,g);return h.inclusive?_<=0:_<0})(s.startAt,$a(s),o)||s.endAt&&!(function(h,f,g){const _=iy(h,f,g);return h.inclusive?_>=0:_>0})(s.endAt,$a(s),o))})(r,e)}function v1(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function hv(r){return(e,t)=>{let s=!1;for(const o of $a(r)){const l=w1(o,e,t);if(l!==0)return l;s=s||o.field.isKeyField()}return 0}}function w1(r,e,t){const s=r.field.isKeyField()?ue.comparator(e.key,t.key):(function(l,h,f){const g=h.data.field(l),_=f.data.field(l);return g!==null&&_!==null?Io(g,_):ye(42886)})(r.field,e,t);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return ye(19790,{direction:r.dir})}}/**
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
 */class ps{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[o,l]of s)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[t]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Ci(this.inner,((t,s)=>{for(const[o,l]of s)e(o,l)}))}isEmpty(){return K_(this.inner)}size(){return this.innerSize}}/**
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
 */const E1=new tt(ue.comparator);function Vr(){return E1}const dv=new tt(ue.comparator);function Ma(...r){let e=dv;for(const t of r)e=e.insert(t.key,t);return e}function fv(r){let e=dv;return r.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function ss(){return qa()}function pv(){return qa()}function qa(){return new ps((r=>r.toString()),((r,e)=>r.isEqual(e)))}const T1=new tt(ue.comparator),I1=new yt(ue.comparator);function ke(...r){let e=I1;for(const t of r)e=e.add(t);return e}const S1=new yt(Ae);function A1(){return S1}/**
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
 */function gf(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ec(e)?"-0":e}}function mv(r){return{integerValue:""+r}}function R1(r,e){return ZS(e)?mv(e):gf(r,e)}/**
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
 */class Ic{constructor(){this._=void 0}}function C1(r,e,t){return r instanceof el?(function(o,l){const h={fields:{[X_]:{stringValue:Y_},[Z_]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&df(l)&&(l=vc(l)),l&&(h.fields[J_]=l),{mapValue:h}})(t,e):r instanceof Ao?yv(r,e):r instanceof Ro?_v(r,e):(function(o,l){const h=gv(o,l),f=ly(h)+ly(o.Ee);return bd(h)&&bd(o.Ee)?mv(f):gf(o.serializer,f)})(r,e)}function P1(r,e,t){return r instanceof Ao?yv(r,e):r instanceof Ro?_v(r,e):t}function gv(r,e){return r instanceof sc?(function(s){return bd(s)||(function(l){return!!l&&"doubleValue"in l})(s)})(e)?e:{integerValue:0}:null}class el extends Ic{}class Ao extends Ic{constructor(e){super(),this.elements=e}}function yv(r,e){const t=vv(e);for(const s of r.elements)t.some((o=>lr(o,s)))||t.push(s);return{arrayValue:{values:t}}}class Ro extends Ic{constructor(e){super(),this.elements=e}}function _v(r,e){let t=vv(e);for(const s of r.elements)t=t.filter((o=>!lr(o,s)));return{arrayValue:{values:t}}}class sc extends Ic{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function ly(r){return ot(r.integerValue||r.doubleValue)}function vv(r){return ff(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class yf{constructor(e,t){this.field=e,this.transform=t}}function k1(r,e){return r.field.isEqual(e.field)&&(function(s,o){return s instanceof Ao&&o instanceof Ao||s instanceof Ro&&o instanceof Ro?To(s.elements,o.elements,lr):s instanceof sc&&o instanceof sc?lr(s.Ee,o.Ee):s instanceof el&&o instanceof el})(r.transform,e.transform)}class x1{constructor(e,t){this.version=e,this.transformResults=t}}class zn{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new zn}static exists(e){return new zn(void 0,e)}static updateTime(e){return new zn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function $u(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Sc{}function wv(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Tv(r.key,zn.none()):new ul(r.key,r.data,zn.none());{const t=r.data,s=tn.empty();let o=new yt(Dt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?s.delete(l):s.set(l,h),o=o.add(l)}return new Pi(r.key,s,new cn(o.toArray()),zn.none())}}function N1(r,e,t){r instanceof ul?(function(o,l,h){const f=o.value.clone(),g=cy(o.fieldTransforms,l,h.transformResults);f.setAll(g),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):r instanceof Pi?(function(o,l,h){if(!$u(o.precondition,l))return void l.convertToUnknownDocument(h.version);const f=cy(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(Ev(o)),g.setAll(f),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function Ha(r,e,t,s){return r instanceof ul?(function(l,h,f,g){if(!$u(l.precondition,h))return f;const _=l.value.clone(),E=hy(l.fieldTransforms,g,h);return _.setAll(E),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,s):r instanceof Pi?(function(l,h,f,g){if(!$u(l.precondition,h))return f;const _=hy(l.fieldTransforms,g,h),E=h.data;return E.setAll(Ev(l)),E.setAll(_),h.convertToFoundDocument(h.version,E).setHasLocalMutations(),f===null?null:f.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((T=>T.field)))})(r,e,t,s):(function(l,h,f){return $u(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f})(r,e,t)}function D1(r,e){let t=null;for(const s of r.fieldTransforms){const o=e.data.field(s.field),l=gv(s.transform,o||null);l!=null&&(t===null&&(t=tn.empty()),t.set(s.field,l))}return t||null}function uy(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&To(s,o,((l,h)=>k1(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class ul extends Sc{constructor(e,t,s,o=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Pi extends Sc{constructor(e,t,s,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function Ev(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=r.data.field(t);e.set(t,s)}})),e}function cy(r,e,t){const s=new Map;Ue(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,f=e.data.field(l.field);s.set(l.field,P1(h,f,t[o]))}return s}function hy(r,e,t){const s=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);s.set(o.field,C1(l,h,e))}return s}class Tv extends Sc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class V1 extends Sc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class b1{constructor(e,t,s,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&N1(l,e,s[o])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Ha(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Ha(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=pv();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let f=this.applyToLocalView(h,l.mutatedFields);f=t.has(o.key)?null:f;const g=wv(h,f);g!==null&&s.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(ve.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),ke())}isEqual(e){return this.batchId===e.batchId&&To(this.mutations,e.mutations,((t,s)=>uy(t,s)))&&To(this.baseMutations,e.baseMutations,((t,s)=>uy(t,s)))}}class _f{constructor(e,t,s,o){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=o}static from(e,t,s){Ue(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let o=(function(){return T1})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,s[h].version);return new _f(e,t,s,o)}}/**
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
 */class O1{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */var ut,Ve;function M1(r){switch(r){case B.OK:return ye(64938);case B.CANCELLED:case B.UNKNOWN:case B.DEADLINE_EXCEEDED:case B.RESOURCE_EXHAUSTED:case B.INTERNAL:case B.UNAVAILABLE:case B.UNAUTHENTICATED:return!1;case B.INVALID_ARGUMENT:case B.NOT_FOUND:case B.ALREADY_EXISTS:case B.PERMISSION_DENIED:case B.FAILED_PRECONDITION:case B.ABORTED:case B.OUT_OF_RANGE:case B.UNIMPLEMENTED:case B.DATA_LOSS:return!0;default:return ye(15467,{code:r})}}function Iv(r){if(r===void 0)return Dr("GRPC error has no .code"),B.UNKNOWN;switch(r){case ut.OK:return B.OK;case ut.CANCELLED:return B.CANCELLED;case ut.UNKNOWN:return B.UNKNOWN;case ut.DEADLINE_EXCEEDED:return B.DEADLINE_EXCEEDED;case ut.RESOURCE_EXHAUSTED:return B.RESOURCE_EXHAUSTED;case ut.INTERNAL:return B.INTERNAL;case ut.UNAVAILABLE:return B.UNAVAILABLE;case ut.UNAUTHENTICATED:return B.UNAUTHENTICATED;case ut.INVALID_ARGUMENT:return B.INVALID_ARGUMENT;case ut.NOT_FOUND:return B.NOT_FOUND;case ut.ALREADY_EXISTS:return B.ALREADY_EXISTS;case ut.PERMISSION_DENIED:return B.PERMISSION_DENIED;case ut.FAILED_PRECONDITION:return B.FAILED_PRECONDITION;case ut.ABORTED:return B.ABORTED;case ut.OUT_OF_RANGE:return B.OUT_OF_RANGE;case ut.UNIMPLEMENTED:return B.UNIMPLEMENTED;case ut.DATA_LOSS:return B.DATA_LOSS;default:return ye(39323,{code:r})}}(Ve=ut||(ut={}))[Ve.OK=0]="OK",Ve[Ve.CANCELLED=1]="CANCELLED",Ve[Ve.UNKNOWN=2]="UNKNOWN",Ve[Ve.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ve[Ve.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ve[Ve.NOT_FOUND=5]="NOT_FOUND",Ve[Ve.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ve[Ve.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ve[Ve.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ve[Ve.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ve[Ve.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ve[Ve.ABORTED=10]="ABORTED",Ve[Ve.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ve[Ve.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ve[Ve.INTERNAL=13]="INTERNAL",Ve[Ve.UNAVAILABLE=14]="UNAVAILABLE",Ve[Ve.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const F1=new gi([4294967295,4294967295],0);function dy(r){const e=q_().encode(r),t=new L_;return t.update(e),new Uint8Array(t.digest())}function fy(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new gi([t,s],0),new gi([o,l],0)]}class vf{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Fa(`Invalid padding: ${t}`);if(s<0)throw new Fa(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Fa(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Fa(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=gi.fromNumber(this.fe)}pe(e,t,s){let o=e.add(t.multiply(gi.fromNumber(s)));return o.compare(F1)===1&&(o=new gi([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=dy(e),[s,o]=fy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);if(!this.ye(h))return!1}return!0}static create(e,t,s){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new vf(l,o,t);return s.forEach((f=>h.insert(f))),h}insert(e){if(this.fe===0)return;const t=dy(e),[s,o]=fy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);this.we(h)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Fa extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Ac{constructor(e,t,s,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const o=new Map;return o.set(e,cl.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Ac(ve.min(),o,new tt(Ae),Vr(),ke())}}class cl{constructor(e,t,s,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new cl(s,t,ke(),ke(),ke())}}/**
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
 */class qu{constructor(e,t,s,o){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=o}}class Sv{constructor(e,t){this.targetId=e,this.De=t}}class Av{constructor(e,t,s=Vt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=o}}class py{constructor(){this.ve=0,this.Ce=my(),this.Fe=Vt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=ke(),t=ke(),s=ke();return this.Ce.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:s=s.add(o);break;default:ye(38017,{changeType:l})}})),new cl(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=my()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Ue(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class U1{constructor(e){this.We=e,this.Ge=new Map,this.ze=Vr(),this.je=bu(),this.Je=bu(),this.He=new tt(Ae)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:ye(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,s=e.De.count,o=this.st(t);if(o){const l=o.target;if(Ld(l))if(s===0){const h=new ue(l.path);this.Xe(t,h,jt.newNoDocument(h,ve.min()))}else Ue(s===1,20013,{expectedCount:s});else{const h=this.ot(t);if(h!==s){const f=this._t(e),g=f?this.ut(f,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,_)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:l=0}=t;let h,f;try{h=Ti(s).toUint8Array()}catch(g){if(g instanceof Q_)return vi("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{f=new vf(h,o,l)}catch(g){return vi(g instanceof Fa?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return f.fe===0?null:f}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let o=0;return s.forEach((l=>{const h=this.We.lt(),f=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(f)||(this.Xe(t,l,null),o++)})),o}Pt(e){const t=new Map;this.Ge.forEach(((l,h)=>{const f=this.st(h);if(f){if(l.current&&Ld(f.target)){const g=new ue(f.target.path);this.Tt(g).has(h)||this.It(h,g)||this.Xe(h,g,jt.newNoDocument(g,e))}l.Ne&&(t.set(h,l.Le()),l.ke())}}));let s=ke();this.Je.forEach(((l,h)=>{let f=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)})),f&&(s=s.add(l))})),this.ze.forEach(((l,h)=>h.setReadTime(e)));const o=new Ac(e,t,this.He,this.ze,s);return this.ze=Vr(),this.je=bu(),this.Je=bu(),this.He=new tt(Ae),o}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const o=this.tt(e);this.It(e,t)?o.qe(t,1):o.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new py,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new yt(Ae),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new yt(Ae),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ne("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new py),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function bu(){return new tt(ue.comparator)}function my(){return new tt(ue.comparator)}const j1={asc:"ASCENDING",desc:"DESCENDING"},z1={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},B1={and:"AND",or:"OR"};class $1{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Fd(r,e){return r.useProto3Json||_c(e)?e:{value:e}}function oc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Rv(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function q1(r,e){return oc(r,e.toTimestamp())}function sr(r){return Ue(!!r,49232),ve.fromTimestamp((function(t){const s=Ei(t);return new Ye(s.seconds,s.nanos)})(r))}function wf(r,e){return Ud(r,e).canonicalString()}function Ud(r,e){const t=(function(o){return new Ge(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Cv(r){const e=Ge.fromString(r);return Ue(Dv(e),10190,{key:e.toString()}),e}function jd(r,e){return wf(r.databaseId,e.path)}function _d(r,e){const t=Cv(e);if(t.get(1)!==r.databaseId.projectId)throw new ee(B.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ee(B.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new ue(kv(t))}function Pv(r,e){return wf(r.databaseId,e)}function H1(r){const e=Cv(r);return e.length===4?Ge.emptyPath():kv(e)}function zd(r){return new Ge(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function kv(r){return Ue(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function gy(r,e,t){return{name:jd(r,e),fields:t.value.mapValue.fields}}function W1(r,e){let t;if("targetChange"in e){e.targetChange;const s=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:ye(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,E){return _.useProto3Json?(Ue(E===void 0||typeof E=="string",58123),Vt.fromBase64String(E||"")):(Ue(E===void 0||E instanceof Buffer||E instanceof Uint8Array,16193),Vt.fromUint8Array(E||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,f=h&&(function(_){const E=_.code===void 0?B.UNKNOWN:Iv(_.code);return new ee(E,_.message||"")})(h);t=new Av(s,o,l,f||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=_d(r,s.document.name),l=sr(s.document.updateTime),h=s.document.createTime?sr(s.document.createTime):ve.min(),f=new tn({mapValue:{fields:s.document.fields}}),g=jt.newFoundDocument(o,l,h,f),_=s.targetIds||[],E=s.removedTargetIds||[];t=new qu(_,E,g.key,g)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=_d(r,s.document),l=s.readTime?sr(s.readTime):ve.min(),h=jt.newNoDocument(o,l),f=s.removedTargetIds||[];t=new qu([],f,h.key,h)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=_d(r,s.document),l=s.removedTargetIds||[];t=new qu([],l,o,null)}else{if(!("filter"in e))return ye(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:l}=s,h=new L1(o,l),f=s.targetId;t=new Sv(f,h)}}return t}function G1(r,e){let t;if(e instanceof ul)t={update:gy(r,e.key,e.value)};else if(e instanceof Tv)t={delete:jd(r,e.key)};else if(e instanceof Pi)t={update:gy(r,e.key,e.data),updateMask:nA(e.fieldMask)};else{if(!(e instanceof V1))return ye(16599,{Rt:e.type});t={verify:jd(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(l,h){const f=h.transform;if(f instanceof el)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof Ao)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof Ro)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof sc)return{fieldPath:h.field.canonicalString(),increment:f.Ee};throw ye(20930,{transform:h.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:q1(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:ye(27497)})(r,e.precondition)),t}function K1(r,e){return r&&r.length>0?(Ue(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?sr(o.updateTime):sr(l);return h.isEqual(ve.min())&&(h=sr(l)),new x1(h,o.transformResults||[])})(t,e)))):[]}function Q1(r,e){return{documents:[Pv(r,e.path)]}}function Y1(r,e){const t={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Pv(r,o);const l=(function(_){if(_.length!==0)return Nv($n.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((E=>(function(C){return{field:ho(C.field),direction:Z1(C.dir)}})(E)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const f=Fd(r,e.limit);return f!==null&&(t.structuredQuery.limit=f),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{Vt:t,parent:o}}function X1(r){let e=H1(r.parent);const t=r.structuredQuery,s=t.from?t.from.length:0;let o=null;if(s>0){Ue(s===1,65062);const E=t.from[0];E.allDescendants?o=E.collectionId:e=e.child(E.collectionId)}let l=[];t.where&&(l=(function(T){const C=xv(T);return C instanceof $n&&sv(C)?C.getFilters():[C]})(t.where));let h=[];t.orderBy&&(h=(function(T){return T.map((C=>(function($){return new Za(fo($.field),(function(q){switch(q){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})($.direction))})(C)))})(t.orderBy));let f=null;t.limit&&(f=(function(T){let C;return C=typeof T=="object"?T.value:T,_c(C)?null:C})(t.limit));let g=null;t.startAt&&(g=(function(T){const C=!!T.before,U=T.values||[];return new rc(U,C)})(t.startAt));let _=null;return t.endAt&&(_=(function(T){const C=!T.before,U=T.values||[];return new rc(U,C)})(t.endAt)),y1(e,o,h,l,f,"F",g,_)}function J1(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ye(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function xv(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=fo(t.unaryFilter.field);return ct.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=fo(t.unaryFilter.field);return ct.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=fo(t.unaryFilter.field);return ct.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=fo(t.unaryFilter.field);return ct.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ye(61313);default:return ye(60726)}})(r):r.fieldFilter!==void 0?(function(t){return ct.create(fo(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ye(58110);default:return ye(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return $n.create(t.compositeFilter.filters.map((s=>xv(s))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return ye(1026)}})(t.compositeFilter.op))})(r):ye(30097,{filter:r})}function Z1(r){return j1[r]}function eA(r){return z1[r]}function tA(r){return B1[r]}function ho(r){return{fieldPath:r.canonicalString()}}function fo(r){return Dt.fromServerFormat(r.fieldPath)}function Nv(r){return r instanceof ct?(function(t){if(t.op==="=="){if(ry(t.value))return{unaryFilter:{field:ho(t.field),op:"IS_NAN"}};if(ny(t.value))return{unaryFilter:{field:ho(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(ry(t.value))return{unaryFilter:{field:ho(t.field),op:"IS_NOT_NAN"}};if(ny(t.value))return{unaryFilter:{field:ho(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ho(t.field),op:eA(t.op),value:t.value}}})(r):r instanceof $n?(function(t){const s=t.getFilters().map((o=>Nv(o)));return s.length===1?s[0]:{compositeFilter:{op:tA(t.op),filters:s}}})(r):ye(54877,{filter:r})}function nA(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Dv(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
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
 */class hi{constructor(e,t,s,o,l=ve.min(),h=ve.min(),f=Vt.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=g}withSequenceNumber(e){return new hi(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class rA{constructor(e){this.gt=e}}function iA(r){const e=X1({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?ic(e,e.limit,"L"):e}/**
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
 */class sA{constructor(){this.Dn=new oA}addToCollectionParentIndex(e,t){return this.Dn.add(t),H.resolve()}getCollectionParents(e,t){return H.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return H.resolve()}deleteFieldIndex(e,t){return H.resolve()}deleteAllFieldIndexes(e){return H.resolve()}createTargetIndexes(e,t){return H.resolve()}getDocumentsMatchingTarget(e,t){return H.resolve(null)}getIndexType(e,t){return H.resolve(0)}getFieldIndexes(e,t){return H.resolve([])}getNextCollectionGroupToUpdate(e){return H.resolve(null)}getMinOffset(e,t){return H.resolve(wi.min())}getMinOffsetFromCollectionGroup(e,t){return H.resolve(wi.min())}updateCollectionGroup(e,t,s){return H.resolve()}updateIndexEntries(e,t){return H.resolve()}}class oA{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t]||new yt(Ge.comparator),l=!o.has(s);return this.index[t]=o.add(s),l}has(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t];return o&&o.has(s)}getEntries(e){return(this.index[e]||new yt(Ge.comparator)).toArray()}}/**
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
 */const yy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Vv=41943040;class en{static withCacheSize(e){return new en(e,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
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
 */en.DEFAULT_COLLECTION_PERCENTILE=10,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,en.DEFAULT=new en(Vv,en.DEFAULT_COLLECTION_PERCENTILE,en.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),en.DISABLED=new en(-1,0,0);/**
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
 */const _y="LruGarbageCollector",aA=1048576;function vy([r,e],[t,s]){const o=Ae(r,t);return o===0?Ae(e,s):o}class lA{constructor(e){this.Tr=e,this.buffer=new yt(vy),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();vy(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class uA{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){ne(_y,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Oo(t)?ne(_y,"Ignoring IndexedDB error during garbage collection: ",t):await bo(t)}await this.Rr(3e5)}))}}class cA{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return H.resolve(yc.ue);const s=new lA(t);return this.Vr.forEachTarget(e,(o=>s.Er(o.sequenceNumber))).next((()=>this.Vr.gr(e,(o=>s.Er(o))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ne("LruGarbageCollector","Garbage collection skipped; disabled"),H.resolve(yy)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(ne("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),yy):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,o,l,h,f,g,_;const E=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((T=>(T>this.params.maximumSequenceNumbersToCollect?(ne("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${T}`),o=this.params.maximumSequenceNumbersToCollect):o=T,h=Date.now(),this.nthSequenceNumber(e,o)))).next((T=>(s=T,f=Date.now(),this.removeTargets(e,s,t)))).next((T=>(l=T,g=Date.now(),this.removeOrphanedDocuments(e,s)))).next((T=>(_=Date.now(),uo()<=Pe.DEBUG&&ne("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-E}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${l} targets in `+(g-f)+`ms
	Removed ${T} documents in `+(_-g)+`ms
Total Duration: ${_-E}ms`),H.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:T}))))}}function hA(r,e){return new cA(r,e)}/**
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
 */class dA{constructor(){this.changes=new ps((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,jt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?H.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class pA{constructor(e,t,s,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(s=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(s!==null&&Ha(s.mutation,o,cn.empty(),Ye.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,ke()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=ke()){const o=ss();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,s).next((l=>{let h=Ma();return l.forEach(((f,g)=>{h=h.insert(f,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const s=ss();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,ke())))}populateOverlays(e,t,s){const o=[];return s.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,f)=>{t.set(h,f)}))}))}computeViews(e,t,s,o){let l=Vr();const h=qa(),f=(function(){return qa()})();return t.forEach(((g,_)=>{const E=s.get(_.key);o.has(_.key)&&(E===void 0||E.mutation instanceof Pi)?l=l.insert(_.key,_):E!==void 0?(h.set(_.key,E.mutation.getFieldMask()),Ha(E.mutation,_,E.mutation.getFieldMask(),Ye.now())):h.set(_.key,cn.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,E)=>h.set(_,E))),t.forEach(((_,E)=>{var T;return f.set(_,new fA(E,(T=h.get(_))!==null&&T!==void 0?T:null))})),f)))}recalculateAndSaveOverlays(e,t){const s=qa();let o=new tt(((h,f)=>h-f)),l=ke();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const f of h)f.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let E=s.get(g)||cn.empty();E=f.applyToLocalView(_,E),s.set(g,E);const T=(o.get(f.batchId)||ke()).add(g);o=o.insert(f.batchId,T)}))})).next((()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const g=f.getNext(),_=g.key,E=g.value,T=pv();E.forEach((C=>{if(!l.has(C)){const U=wv(t.get(C),s.get(C));U!==null&&T.set(C,U),l=l.add(C)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,T))}return H.waitFor(h)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,o){return(function(h){return ue.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):uv(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,o):this.getDocumentsMatchingCollectionQuery(e,t,s,o)}getNextDocuments(e,t,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,o-l.size):H.resolve(ss());let f=Qa,g=l;return h.next((_=>H.forEach(_,((E,T)=>(f<T.largestBatchId&&(f=T.largestBatchId),l.get(E)?H.resolve():this.remoteDocumentCache.getEntry(e,E).next((C=>{g=g.insert(E,C)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,ke()))).next((E=>({batchId:f,changes:fv(E)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ue(t)).next((s=>{let o=Ma();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,o){const l=t.collectionGroup;let h=Ma();return this.indexManager.getCollectionParents(e,l).next((f=>H.forEach(f,(g=>{const _=(function(T,C){return new Lo(C,null,T.explicitOrderBy.slice(),T.filters.slice(),T.limit,T.limitType,T.startAt,T.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,s,o).next((E=>{E.forEach(((T,C)=>{h=h.insert(T,C)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,s,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,l,o)))).next((h=>{l.forEach(((g,_)=>{const E=_.getKey();h.get(E)===null&&(h=h.insert(E,jt.newInvalidDocument(E)))}));let f=Ma();return h.forEach(((g,_)=>{const E=l.get(g);E!==void 0&&Ha(E.mutation,_,cn.empty(),Ye.now()),Tc(t,_)&&(f=f.insert(g,_))})),f}))}}/**
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
 */class gA{constructor(){this.overlays=new tt(ue.comparator),this.kr=new Map}getOverlay(e,t){return H.resolve(this.overlays.get(t))}getOverlays(e,t){const s=ss();return H.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&s.set(o,l)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((o,l)=>{this.wt(e,t,l)})),H.resolve()}removeOverlaysForBatchId(e,t,s){const o=this.kr.get(s);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.kr.delete(s)),H.resolve()}getOverlaysForCollection(e,t,s){const o=ss(),l=t.length+1,h=new ue(t.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const g=f.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>s&&o.set(g.getKey(),g)}return H.resolve(o)}getOverlaysForCollectionGroup(e,t,s,o){let l=new tt(((_,E)=>_-E));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>s){let E=l.get(_.largestBatchId);E===null&&(E=ss(),l=l.insert(_.largestBatchId,E)),E.set(_.getKey(),_)}}const f=ss(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,E)=>f.set(_,E))),!(f.size()>=o)););return H.resolve(f)}wt(e,t,s){const o=this.overlays.get(s.key);if(o!==null){const h=this.kr.get(o.largestBatchId).delete(s.key);this.kr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(s.key,new O1(t,s));let l=this.kr.get(t);l===void 0&&(l=ke(),this.kr.set(t,l)),this.kr.set(t,l.add(s.key))}}/**
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
 */class yA{constructor(){this.sessionToken=Vt.EMPTY_BYTE_STRING}getSessionToken(e){return H.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,H.resolve()}}/**
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
 */class Ef{constructor(){this.qr=new yt(St.Qr),this.$r=new yt(St.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new St(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new St(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new ue(new Ge([])),s=new St(t,e),o=new St(t,e+1),l=[];return this.$r.forEachInRange([s,o],(h=>{this.Wr(h),l.push(h.key)})),l}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new ue(new Ge([])),s=new St(t,e),o=new St(t,e+1);let l=ke();return this.$r.forEachInRange([s,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new St(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class St{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return ue.comparator(e.key,t.key)||Ae(e.Hr,t.Hr)}static Ur(e,t){return Ae(e.Hr,t.Hr)||ue.comparator(e.key,t.key)}}/**
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
 */class _A{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new yt(St.Qr)}checkEmpty(e){return H.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,o){const l=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new b1(l,t,s,o);this.mutationQueue.push(h);for(const f of o)this.Yr=this.Yr.add(new St(f.key,l)),this.indexManager.addToCollectionParentIndex(e,f.key.path.popLast());return H.resolve(h)}lookupMutationBatch(e,t){return H.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,o=this.Xr(s),l=o<0?0:o;return H.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return H.resolve(this.mutationQueue.length===0?hf:this.er-1)}getAllMutationBatches(e){return H.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new St(t,0),o=new St(t,Number.POSITIVE_INFINITY),l=[];return this.Yr.forEachInRange([s,o],(h=>{const f=this.Zr(h.Hr);l.push(f)})),H.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new yt(Ae);return t.forEach((o=>{const l=new St(o,0),h=new St(o,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([l,h],(f=>{s=s.add(f.Hr)}))})),H.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,o=s.length+1;let l=s;ue.isDocumentKey(l)||(l=l.child(""));const h=new St(new ue(l),0);let f=new yt(Ae);return this.Yr.forEachWhile((g=>{const _=g.key.path;return!!s.isPrefixOf(_)&&(_.length===o&&(f=f.add(g.Hr)),!0)}),h),H.resolve(this.ei(f))}ei(e){const t=[];return e.forEach((s=>{const o=this.Zr(s);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){Ue(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return H.forEach(t.mutations,(o=>{const l=new St(o.key,t.batchId);return s=s.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new St(t,0),o=this.Yr.firstAfterOrEqual(s);return H.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,H.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class vA{constructor(e){this.ni=e,this.docs=(function(){return new tt(ue.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,o=this.docs.get(s),l=o?o.size:0,h=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return H.resolve(s?s.document.mutableCopy():jt.newInvalidDocument(t))}getEntries(e,t){let s=Vr();return t.forEach((o=>{const l=this.docs.get(o);s=s.insert(o,l?l.document.mutableCopy():jt.newInvalidDocument(o))})),H.resolve(s)}getDocumentsMatchingQuery(e,t,s,o){let l=Vr();const h=t.path,f=new ue(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(f);for(;g.hasNext();){const{key:_,value:{document:E}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||QS(KS(E),s)<=0||(o.has(E.key)||Tc(t,E))&&(l=l.insert(E.key,E.mutableCopy()))}return H.resolve(l)}getAllFromCollectionGroup(e,t,s,o){ye(9500)}ri(e,t){return H.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new wA(this)}getSize(e){return H.resolve(this.size)}}class wA extends dA{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,o)=>{o.isValidDocument()?t.push(this.Or.addEntry(e,o)):this.Or.removeEntry(s)})),H.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
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
 */class EA{constructor(e){this.persistence=e,this.ii=new ps((t=>pf(t)),mf),this.lastRemoteSnapshotVersion=ve.min(),this.highestTargetId=0,this.si=0,this.oi=new Ef,this.targetCount=0,this._i=Co.ar()}forEachTarget(e,t){return this.ii.forEach(((s,o)=>t(o))),H.resolve()}getLastRemoteSnapshotVersion(e){return H.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return H.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),H.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),H.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Co(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,H.resolve()}updateTargetData(e,t){return this.hr(t),H.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,H.resolve()}removeTargets(e,t,s){let o=0;const l=[];return this.ii.forEach(((h,f)=>{f.sequenceNumber<=t&&s.get(f.targetId)===null&&(this.ii.delete(h),l.push(this.removeMatchingKeysForTargetId(e,f.targetId)),o++)})),H.waitFor(l).next((()=>o))}getTargetCount(e){return H.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return H.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),H.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),H.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),H.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return H.resolve(s)}containsKey(e,t){return H.resolve(this.oi.containsKey(t))}}/**
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
 */class bv{constructor(e,t){this.ai={},this.overlays={},this.ui=new yc(0),this.ci=!1,this.ci=!0,this.li=new yA,this.referenceDelegate=e(this),this.hi=new EA(this),this.indexManager=new sA,this.remoteDocumentCache=(function(o){return new vA(o)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new rA(t),this.Ti=new mA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new gA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new _A(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){ne("MemoryPersistence","Starting transaction:",e);const o=new TA(this.ui.next());return this.referenceDelegate.Ii(),s(o).next((l=>this.referenceDelegate.di(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ei(e,t){return H.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class TA extends XS{constructor(e){super(),this.currentSequenceNumber=e}}class Tf{constructor(e){this.persistence=e,this.Ai=new Ef,this.Ri=null}static Vi(e){return new Tf(e)}get mi(){if(this.Ri)return this.Ri;throw ye(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),H.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),H.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),H.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((o=>this.mi.add(o.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.mi.add(l.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return H.forEach(this.mi,(s=>{const o=ue.fromPath(s);return this.fi(e,o).next((l=>{l||t.removeEntry(o,ve.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return H.or([()=>H.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class ac{constructor(e,t){this.persistence=e,this.gi=new ps((s=>e1(s.path)),((s,o)=>s.isEqual(o))),this.garbageCollector=hA(this,t)}static Vi(e,t){return new ac(e,t)}Ii(){}di(e){return H.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((o=>s+o))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return H.forEach(this.gi,((s,o)=>this.Sr(e,s,o).next((l=>l?H.resolve():t(o)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ri(e,(h=>this.Sr(e,h,t).next((f=>{f||(s++,l.removeEntry(h,ve.min()))})))).next((()=>l.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),H.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),H.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),H.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),H.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=zu(e.data.value)),t}Sr(e,t,s){return H.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.gi.get(t);return H.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class If{constructor(e,t,s,o){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=o}static Es(e,t){let s=ke(),o=ke();for(const l of t.docChanges)switch(l.type){case 0:s=s.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new If(e,t.fromCache,s,o)}}/**
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
 */class SA{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return iE()?8:JS(zt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,o){const l={result:null};return this.ps(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.ys(e,t,o,s).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new IA;return this.ws(e,t,h).next((f=>{if(l.result=f,this.Rs)return this.Ss(e,t,h,f.size)}))})).next((()=>l.result))}Ss(e,t,s,o){return s.documentReadCount<this.Vs?(uo()<=Pe.DEBUG&&ne("QueryEngine","SDK will not create cache indexes for query:",co(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),H.resolve()):(uo()<=Pe.DEBUG&&ne("QueryEngine","Query:",co(t),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.fs*o?(uo()<=Pe.DEBUG&&ne("QueryEngine","The SDK decides to create cache indexes for query:",co(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ir(t))):H.resolve())}ps(e,t){if(ay(t))return H.resolve(null);let s=ir(t);return this.indexManager.getIndexType(e,s).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=ic(t,null,"F"),s=ir(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((l=>{const h=ke(...l);return this.gs.getDocuments(e,h).next((f=>this.indexManager.getMinOffset(e,s).next((g=>{const _=this.bs(t,f);return this.Ds(t,_,h,g.readTime)?this.ps(e,ic(t,null,"F")):this.vs(e,_,t,g)}))))})))))}ys(e,t,s,o){return ay(t)||o.isEqual(ve.min())?H.resolve(null):this.gs.getDocuments(e,s).next((l=>{const h=this.bs(t,l);return this.Ds(t,h,s,o)?H.resolve(null):(uo()<=Pe.DEBUG&&ne("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),co(t)),this.vs(e,h,t,GS(o,Qa)).next((f=>f)))}))}bs(e,t){let s=new yt(hv(e));return t.forEach(((o,l)=>{Tc(e,l)&&(s=s.add(l))})),s}Ds(e,t,s,o){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ws(e,t,s){return uo()<=Pe.DEBUG&&ne("QueryEngine","Using full collection scan to execute query:",co(t)),this.gs.getDocumentsMatchingQuery(e,t,wi.min(),s)}vs(e,t,s,o){return this.gs.getDocumentsMatchingQuery(e,s,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
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
 */const Sf="LocalStore",AA=3e8;class RA{constructor(e,t,s,o){this.persistence=e,this.Cs=t,this.serializer=o,this.Fs=new tt(Ae),this.Ms=new ps((l=>pf(l)),mf),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new pA(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function CA(r,e,t,s){return new RA(r,e,t,s)}async function Ov(r,e){const t=we(r);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let o;return t.mutationQueue.getAllMutationBatches(s).next((l=>(o=l,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((l=>{const h=[],f=[];let g=ke();for(const _ of o){h.push(_.batchId);for(const E of _.mutations)g=g.add(E.key)}for(const _ of l){f.push(_.batchId);for(const E of _.mutations)g=g.add(E.key)}return t.localDocuments.getDocuments(s,g).next((_=>({Bs:_,removedBatchIds:h,addedBatchIds:f})))}))}))}function PA(r,e){const t=we(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const o=e.batch.keys(),l=t.Os.newChangeBuffer({trackRemovals:!0});return(function(f,g,_,E){const T=_.batch,C=T.keys();let U=H.resolve();return C.forEach(($=>{U=U.next((()=>E.getEntry(g,$))).next((G=>{const q=_.docVersions.get($);Ue(q!==null,48541),G.version.compareTo(q)<0&&(T.applyToRemoteDocument(G,_),G.isValidDocument()&&(G.setReadTime(_.commitVersion),E.addEntry(G)))}))})),U.next((()=>f.mutationQueue.removeMutationBatch(g,T)))})(t,s,e,l).next((()=>l.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(f){let g=ke();for(let _=0;_<f.mutationResults.length;++_)f.mutationResults[_].transformResults.length>0&&(g=g.add(f.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(s,o)))}))}function Lv(r){const e=we(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function kA(r,e){const t=we(r),s=e.snapshotVersion;let o=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Os.newChangeBuffer({trackRemovals:!0});o=t.Fs;const f=[];e.targetChanges.forEach(((E,T)=>{const C=o.get(T);if(!C)return;f.push(t.hi.removeMatchingKeys(l,E.removedDocuments,T).next((()=>t.hi.addMatchingKeys(l,E.addedDocuments,T))));let U=C.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(T)!==null?U=U.withResumeToken(Vt.EMPTY_BYTE_STRING,ve.min()).withLastLimboFreeSnapshotVersion(ve.min()):E.resumeToken.approximateByteSize()>0&&(U=U.withResumeToken(E.resumeToken,s)),o=o.insert(T,U),(function(G,q,me){return G.resumeToken.approximateByteSize()===0||q.snapshotVersion.toMicroseconds()-G.snapshotVersion.toMicroseconds()>=AA?!0:me.addedDocuments.size+me.modifiedDocuments.size+me.removedDocuments.size>0})(C,U,E)&&f.push(t.hi.updateTargetData(l,U))}));let g=Vr(),_=ke();if(e.documentUpdates.forEach((E=>{e.resolvedLimboDocuments.has(E)&&f.push(t.persistence.referenceDelegate.updateLimboDocument(l,E))})),f.push(xA(l,h,e.documentUpdates).next((E=>{g=E.Ls,_=E.ks}))),!s.isEqual(ve.min())){const E=t.hi.getLastRemoteSnapshotVersion(l).next((T=>t.hi.setTargetsMetadata(l,l.currentSequenceNumber,s)));f.push(E)}return H.waitFor(f).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Fs=o,l)))}function xA(r,e,t){let s=ke(),o=ke();return t.forEach((l=>s=s.add(l))),e.getEntries(r,s).next((l=>{let h=Vr();return t.forEach(((f,g)=>{const _=l.get(f);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(f)),g.isNoDocument()&&g.version.isEqual(ve.min())?(e.removeEntry(f,g.readTime),h=h.insert(f,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(f,g)):ne(Sf,"Ignoring outdated watch update for ",f,". Current version:",_.version," Watch version:",g.version)})),{Ls:h,ks:o}}))}function NA(r,e){const t=we(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=hf),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function DA(r,e){const t=we(r);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let o;return t.hi.getTargetData(s,e).next((l=>l?(o=l,H.resolve(o)):t.hi.allocateTargetId(s).next((h=>(o=new hi(e,h,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,o).next((()=>o)))))))})).then((s=>{const o=t.Fs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function Bd(r,e,t){const s=we(r),o=s.Fs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",l,(h=>s.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!Oo(h))throw h;ne(Sf,`Failed to update sequence numbers for target ${e}: ${h}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(o.target)}function wy(r,e,t){const s=we(r);let o=ve.min(),l=ke();return s.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,E){const T=we(g),C=T.Ms.get(E);return C!==void 0?H.resolve(T.Fs.get(C)):T.hi.getTargetData(_,E)})(s,h,ir(e)).next((f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(h,f.targetId).next((g=>{l=g}))})).next((()=>s.Cs.getDocumentsMatchingQuery(h,e,t?o:ve.min(),t?l:ke()))).next((f=>(VA(s,v1(e),f),{documents:f,qs:l})))))}function VA(r,e,t){let s=r.xs.get(e)||ve.min();t.forEach(((o,l)=>{l.readTime.compareTo(s)>0&&(s=l.readTime)})),r.xs.set(e,s)}class Ey{constructor(){this.activeTargetIds=A1()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class bA{constructor(){this.Fo=new Ey,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Ey,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class OA{xo(e){}shutdown(){}}/**
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
 */const Ty="ConnectivityMonitor";class Iy{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){ne(Ty,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){ne(Ty,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ou=null;function $d(){return Ou===null?Ou=(function(){return 268435456+Math.round(2147483648*Math.random())})():Ou++,"0x"+Ou.toString(16)}/**
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
 */const vd="RestConnection",LA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class MA{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${o}`,this.Ko=this.databaseId.database===tc?`project_id=${s}`:`project_id=${s}&database_id=${o}`}Wo(e,t,s,o,l){const h=$d(),f=this.Go(e,t.toUriEncodedString());ne(vd,`Sending RPC '${e}' ${h}:`,f,s);const g={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(g,o,l);const{host:_}=new URL(f),E=ko(_);return this.jo(e,f,g,s,E).then((T=>(ne(vd,`Received RPC '${e}' ${h}: `,T),T)),(T=>{throw vi(vd,`RPC '${e}' ${h} failed with error: `,T,"url: ",f,"request:",s),T}))}Jo(e,t,s,o,l,h){return this.Wo(e,t,s,o,l)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Vo})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),s&&s.headers.forEach(((o,l)=>e[l]=o))}Go(e,t){const s=LA[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
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
 */const Ft="WebChannelConnection";class UA extends MA{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,o,l){const h=$d();return new Promise(((f,g)=>{const _=new M_;_.setWithCredentials(!0),_.listenOnce(F_.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case ju.NO_ERROR:const T=_.getResponseJson();ne(Ft,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(T)),f(T);break;case ju.TIMEOUT:ne(Ft,`RPC '${e}' ${h} timed out`),g(new ee(B.DEADLINE_EXCEEDED,"Request time out"));break;case ju.HTTP_ERROR:const C=_.getStatus();if(ne(Ft,`RPC '${e}' ${h} failed with status:`,C,"response text:",_.getResponseText()),C>0){let U=_.getResponseJson();Array.isArray(U)&&(U=U[0]);const $=U==null?void 0:U.error;if($&&$.status&&$.message){const G=(function(me){const ce=me.toLowerCase().replace(/_/g,"-");return Object.values(B).indexOf(ce)>=0?ce:B.UNKNOWN})($.status);g(new ee(G,$.message))}else g(new ee(B.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new ee(B.UNAVAILABLE,"Connection failed."));break;default:ye(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{ne(Ft,`RPC '${e}' ${h} completed.`)}}));const E=JSON.stringify(o);ne(Ft,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",E,s,15)}))}P_(e,t,s){const o=$d(),l=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=z_(),f=j_(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;_!==void 0&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.useFetchStreams=!0),this.zo(g.initMessageHeaders,t,s),g.encodeInitMessageHeaders=!0;const E=l.join("");ne(Ft,`Creating RPC '${e}' stream ${o}: ${E}`,g);const T=h.createWebChannel(E,g);this.T_(T);let C=!1,U=!1;const $=new FA({Ho:q=>{U?ne(Ft,`Not sending because RPC '${e}' stream ${o} is closed:`,q):(C||(ne(Ft,`Opening RPC '${e}' stream ${o} transport.`),T.open(),C=!0),ne(Ft,`RPC '${e}' stream ${o} sending:`,q),T.send(q))},Yo:()=>T.close()}),G=(q,me,ce)=>{q.listen(me,(pe=>{try{ce(pe)}catch(Ee){setTimeout((()=>{throw Ee}),0)}}))};return G(T,La.EventType.OPEN,(()=>{U||(ne(Ft,`RPC '${e}' stream ${o} transport opened.`),$.s_())})),G(T,La.EventType.CLOSE,(()=>{U||(U=!0,ne(Ft,`RPC '${e}' stream ${o} transport closed`),$.__(),this.I_(T))})),G(T,La.EventType.ERROR,(q=>{U||(U=!0,vi(Ft,`RPC '${e}' stream ${o} transport errored. Name:`,q.name,"Message:",q.message),$.__(new ee(B.UNAVAILABLE,"The operation could not be completed")))})),G(T,La.EventType.MESSAGE,(q=>{var me;if(!U){const ce=q.data[0];Ue(!!ce,16349);const pe=ce,Ee=(pe==null?void 0:pe.error)||((me=pe[0])===null||me===void 0?void 0:me.error);if(Ee){ne(Ft,`RPC '${e}' stream ${o} received error:`,Ee);const Be=Ee.status;let Te=(function(I){const P=ut[I];if(P!==void 0)return Iv(P)})(Be),D=Ee.message;Te===void 0&&(Te=B.INTERNAL,D="Unknown error status: "+Be+" with message "+Ee.message),U=!0,$.__(new ee(Te,D)),T.close()}else ne(Ft,`RPC '${e}' stream ${o} received:`,ce),$.a_(ce)}})),G(f,U_.STAT_EVENT,(q=>{q.stat===Nd.PROXY?ne(Ft,`RPC '${e}' stream ${o} detected buffering proxy`):q.stat===Nd.NOPROXY&&ne(Ft,`RPC '${e}' stream ${o} detected no buffering proxy`)})),setTimeout((()=>{$.o_()}),0),$}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function wd(){return typeof document<"u"?document:null}/**
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
 */function Rc(r){return new $1(r,!0)}/**
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
 */class Mv{constructor(e,t,s=1e3,o=1.5,l=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=o,this.A_=l,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-s);o>0&&ne("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */const Sy="PersistentStream";class Fv{constructor(e,t,s,o,l,h,f,g){this.Fi=e,this.w_=s,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new Mv(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===B.RESOURCE_EXHAUSTED?(Dr(t.toString()),Dr("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===B.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,o])=>{this.b_===t&&this.W_(s,o)}),(s=>{e((()=>{const o=new ee(B.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(o)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((o=>{s((()=>this.G_(o)))})),this.stream.onMessage((o=>{s((()=>++this.C_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return ne(Sy,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(ne(Sy,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class jA extends Fv{constructor(e,t,s,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=W1(this.serializer,e),s=(function(l){if(!("targetChange"in l))return ve.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?ve.min():h.readTime?sr(h.readTime):ve.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=zd(this.serializer),t.addTarget=(function(l,h){let f;const g=h.target;if(f=Ld(g)?{documents:Q1(l,g)}:{query:Y1(l,g).Vt},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=Rv(l,h.resumeToken);const _=Fd(l,h.expectedCount);_!==null&&(f.expectedCount=_)}else if(h.snapshotVersion.compareTo(ve.min())>0){f.readTime=oc(l,h.snapshotVersion.toTimestamp());const _=Fd(l,h.expectedCount);_!==null&&(f.expectedCount=_)}return f})(this.serializer,e);const s=J1(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=zd(this.serializer),t.removeTarget=e,this.k_(t)}}class zA extends Fv{constructor(e,t,s,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Ue(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Ue(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Ue(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=K1(e.writeResults,e.commitTime),s=sr(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=zd(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>G1(this.serializer,s)))};this.k_(t)}}/**
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
 */class BA{}class $A extends BA{constructor(e,t,s,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new ee(B.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Wo(e,Ud(t,s),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new ee(B.UNKNOWN,l.toString())}))}Jo(e,t,s,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,f])=>this.connection.Jo(e,Ud(t,s),o,h,f,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new ee(B.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class qA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Dr(t),this._a=!1):ne("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const cs="RemoteStore";class HA{constructor(e,t,s,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=l,this.Ea.xo((h=>{s.enqueueAndForget((async()=>{ms(this)&&(ne(cs,"Restarting streams for network reachability change."),await(async function(g){const _=we(g);_.Ia.add(4),await hl(_),_.Aa.set("Unknown"),_.Ia.delete(4),await Cc(_)})(this))}))})),this.Aa=new qA(s,o)}}async function Cc(r){if(ms(r))for(const e of r.da)await e(!0)}async function hl(r){for(const e of r.da)await e(!1)}function Uv(r,e){const t=we(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Pf(t)?Cf(t):Mo(t).x_()&&Rf(t,e))}function Af(r,e){const t=we(r),s=Mo(t);t.Ta.delete(e),s.x_()&&jv(t,e),t.Ta.size===0&&(s.x_()?s.B_():ms(t)&&t.Aa.set("Unknown"))}function Rf(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ve.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Mo(r).H_(e)}function jv(r,e){r.Ra.$e(e),Mo(r).Y_(e)}function Cf(r){r.Ra=new U1({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Mo(r).start(),r.Aa.aa()}function Pf(r){return ms(r)&&!Mo(r).M_()&&r.Ta.size>0}function ms(r){return we(r).Ia.size===0}function zv(r){r.Ra=void 0}async function WA(r){r.Aa.set("Online")}async function GA(r){r.Ta.forEach(((e,t)=>{Rf(r,e)}))}async function KA(r,e){zv(r),Pf(r)?(r.Aa.la(e),Cf(r)):r.Aa.set("Unknown")}async function QA(r,e,t){if(r.Aa.set("Online"),e instanceof Av&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const f of l.targetIds)o.Ta.has(f)&&(await o.remoteSyncer.rejectListen(f,h),o.Ta.delete(f),o.Ra.removeTarget(f))})(r,e)}catch(s){ne(cs,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await lc(r,s)}else if(e instanceof qu?r.Ra.Ye(e):e instanceof Sv?r.Ra.it(e):r.Ra.et(e),!t.isEqual(ve.min()))try{const s=await Lv(r.localStore);t.compareTo(s)>=0&&await(function(l,h){const f=l.Ra.Pt(h);return f.targetChanges.forEach(((g,_)=>{if(g.resumeToken.approximateByteSize()>0){const E=l.Ta.get(_);E&&l.Ta.set(_,E.withResumeToken(g.resumeToken,h))}})),f.targetMismatches.forEach(((g,_)=>{const E=l.Ta.get(g);if(!E)return;l.Ta.set(g,E.withResumeToken(Vt.EMPTY_BYTE_STRING,E.snapshotVersion)),jv(l,g);const T=new hi(E.target,g,_,E.sequenceNumber);Rf(l,T)})),l.remoteSyncer.applyRemoteEvent(f)})(r,t)}catch(s){ne(cs,"Failed to raise snapshot:",s),await lc(r,s)}}async function lc(r,e,t){if(!Oo(e))throw e;r.Ia.add(1),await hl(r),r.Aa.set("Offline"),t||(t=()=>Lv(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{ne(cs,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await Cc(r)}))}function Bv(r,e){return e().catch((t=>lc(r,t,e)))}async function Pc(r){const e=we(r),t=Si(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:hf;for(;YA(e);)try{const o=await NA(e.localStore,s);if(o===null){e.Pa.length===0&&t.B_();break}s=o.batchId,XA(e,o)}catch(o){await lc(e,o)}$v(e)&&qv(e)}function YA(r){return ms(r)&&r.Pa.length<10}function XA(r,e){r.Pa.push(e);const t=Si(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function $v(r){return ms(r)&&!Si(r).M_()&&r.Pa.length>0}function qv(r){Si(r).start()}async function JA(r){Si(r).na()}async function ZA(r){const e=Si(r);for(const t of r.Pa)e.X_(t.mutations)}async function eR(r,e,t){const s=r.Pa.shift(),o=_f.from(s,e,t);await Bv(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Pc(r)}async function tR(r,e){e&&Si(r).Z_&&await(async function(s,o){if((function(h){return M1(h)&&h!==B.ABORTED})(o.code)){const l=s.Pa.shift();Si(s).N_(),await Bv(s,(()=>s.remoteSyncer.rejectFailedWrite(l.batchId,o))),await Pc(s)}})(r,e),$v(r)&&qv(r)}async function Ay(r,e){const t=we(r);t.asyncQueue.verifyOperationInProgress(),ne(cs,"RemoteStore received new credentials");const s=ms(t);t.Ia.add(3),await hl(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Cc(t)}async function nR(r,e){const t=we(r);e?(t.Ia.delete(2),await Cc(t)):e||(t.Ia.add(2),await hl(t),t.Aa.set("Unknown"))}function Mo(r){return r.Va||(r.Va=(function(t,s,o){const l=we(t);return l.ia(),new jA(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:WA.bind(null,r),e_:GA.bind(null,r),n_:KA.bind(null,r),J_:QA.bind(null,r)}),r.da.push((async e=>{e?(r.Va.N_(),Pf(r)?Cf(r):r.Aa.set("Unknown")):(await r.Va.stop(),zv(r))}))),r.Va}function Si(r){return r.ma||(r.ma=(function(t,s,o){const l=we(t);return l.ia(),new zA(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:JA.bind(null,r),n_:tR.bind(null,r),ea:ZA.bind(null,r),ta:eR.bind(null,r)}),r.da.push((async e=>{e?(r.ma.N_(),await Pc(r)):(await r.ma.stop(),r.Pa.length>0&&(ne(cs,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ma}/**
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
 */class kf{constructor(e,t,s,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=l,this.deferred=new yi,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,l){const h=Date.now()+s,f=new kf(e,t,h,o,l);return f.start(s),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ee(B.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function xf(r,e){if(Dr("AsyncQueue",`${e}: ${r}`),Oo(r))return new ee(B.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class _o{static emptySet(e){return new _o(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||ue.comparator(t.key,s.key):(t,s)=>ue.comparator(t.key,s.key),this.keyedMap=Ma(),this.sortedSet=new tt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof _o)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new _o;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class Ry{constructor(){this.fa=new tt(ue.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ye(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Po{constructor(e,t,s,o,l,h,f,g,_){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,s,o,l){const h=[];return t.forEach((f=>{h.push({type:0,doc:f})})),new Po(e,t,_o.emptySet(t),h,s,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ec(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==s[o].type||!t[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
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
 */class rR{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class iR{constructor(){this.queries=Cy(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const o=we(t),l=o.queries;o.queries=Cy(),l.forEach(((h,f)=>{for(const g of f.wa)g.onError(s)}))})(this,new ee(B.ABORTED,"Firestore shutting down"))}}function Cy(){return new ps((r=>cv(r)),Ec)}async function Hv(r,e){const t=we(r);let s=3;const o=e.query;let l=t.queries.get(o);l?!l.Sa()&&e.ba()&&(s=2):(l=new rR,s=e.ba()?0:1);try{switch(s){case 0:l.ya=await t.onListen(o,!0);break;case 1:l.ya=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const f=xf(h,`Initialization of query '${co(e.query)}' failed`);return void e.onError(f)}t.queries.set(o,l),l.wa.push(e),e.va(t.onlineState),l.ya&&e.Ca(l.ya)&&Nf(t)}async function Wv(r,e){const t=we(r),s=e.query;let o=3;const l=t.queries.get(s);if(l){const h=l.wa.indexOf(e);h>=0&&(l.wa.splice(h,1),l.wa.length===0?o=e.ba()?0:1:!l.Sa()&&e.ba()&&(o=2))}switch(o){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function sR(r,e){const t=we(r);let s=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const f of h.wa)f.Ca(o)&&(s=!0);h.ya=o}}s&&Nf(t)}function oR(r,e,t){const s=we(r),o=s.queries.get(e);if(o)for(const l of o.wa)l.onError(t);s.queries.delete(e)}function Nf(r){r.Da.forEach((e=>{e.next()}))}var qd,Py;(Py=qd||(qd={})).Fa="default",Py.Cache="cache";class Gv{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new Po(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Po.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==qd.Cache}}/**
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
 */class Kv{constructor(e){this.key=e}}class Qv{constructor(e){this.key=e}}class aR{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=ke(),this.mutatedKeys=ke(),this.Xa=hv(e),this.eu=new _o(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new Ry,o=t?t.eu:this.eu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,f=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((E,T)=>{const C=o.get(E),U=Tc(this.query,T)?T:null,$=!!C&&this.mutatedKeys.has(C.key),G=!!U&&(U.hasLocalMutations||this.mutatedKeys.has(U.key)&&U.hasCommittedMutations);let q=!1;C&&U?C.data.isEqual(U.data)?$!==G&&(s.track({type:3,doc:U}),q=!0):this.iu(C,U)||(s.track({type:2,doc:U}),q=!0,(g&&this.Xa(U,g)>0||_&&this.Xa(U,_)<0)&&(f=!0)):!C&&U?(s.track({type:0,doc:U}),q=!0):C&&!U&&(s.track({type:1,doc:C}),q=!0,(g||_)&&(f=!0)),q&&(U?(h=h.add(U),l=G?l.add(E):l.delete(E)):(h=h.delete(E),l=l.delete(E)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const E=this.query.limitType==="F"?h.last():h.first();h=h.delete(E.key),l=l.delete(E.key),s.track({type:1,doc:E})}return{eu:h,ru:s,Ds:f,mutatedKeys:l}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,o){const l=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const h=e.ru.pa();h.sort(((E,T)=>(function(U,$){const G=q=>{switch(q){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ye(20277,{At:q})}};return G(U)-G($)})(E.type,T.type)||this.Xa(E.doc,T.doc))),this.su(s),o=o!=null&&o;const f=t&&!o?this.ou():[],g=this.Za.size===0&&this.current&&!o?1:0,_=g!==this.Ya;return this.Ya=g,h.length!==0||_?{snapshot:new Po(this.query,e.eu,l,h,e.mutatedKeys,g===0,_,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:f}:{_u:f}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Ry,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=ke(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Qv(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new Kv(s))})),t}uu(e){this.Ha=e.qs,this.Za=ke();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Po.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Df="SyncEngine";class lR{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class uR{constructor(e){this.key=e,this.lu=!1}}class cR{constructor(e,t,s,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.hu={},this.Pu=new ps((f=>cv(f)),Ec),this.Tu=new Map,this.Iu=new Set,this.du=new tt(ue.comparator),this.Eu=new Map,this.Au=new Ef,this.Ru={},this.Vu=new Map,this.mu=Co.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function hR(r,e,t=!0){const s=t0(r);let o;const l=s.Pu.get(e);return l?(s.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.cu()):o=await Yv(s,e,t,!0),o}async function dR(r,e){const t=t0(r);await Yv(t,e,!0,!1)}async function Yv(r,e,t,s){const o=await DA(r.localStore,ir(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let f;return s&&(f=await fR(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&Uv(r.remoteStore,o),f}async function fR(r,e,t,s,o){r.gu=(T,C,U)=>(async function(G,q,me,ce){let pe=q.view.nu(me);pe.Ds&&(pe=await wy(G.localStore,q.query,!1).then((({documents:D})=>q.view.nu(D,pe))));const Ee=ce&&ce.targetChanges.get(q.targetId),Be=ce&&ce.targetMismatches.get(q.targetId)!=null,Te=q.view.applyChanges(pe,G.isPrimaryClient,Ee,Be);return xy(G,q.targetId,Te._u),Te.snapshot})(r,T,C,U);const l=await wy(r.localStore,e,!0),h=new aR(e,l.qs),f=h.nu(l.documents),g=cl.createSynthesizedTargetChangeForCurrentChange(t,s&&r.onlineState!=="Offline",o),_=h.applyChanges(f,r.isPrimaryClient,g);xy(r,t,_._u);const E=new lR(e,t,h);return r.Pu.set(e,E),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),_.snapshot}async function pR(r,e,t){const s=we(r),o=s.Pu.get(e),l=s.Tu.get(o.targetId);if(l.length>1)return s.Tu.set(o.targetId,l.filter((h=>!Ec(h,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await Bd(s.localStore,o.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(o.targetId),t&&Af(s.remoteStore,o.targetId),Hd(s,o.targetId)})).catch(bo)):(Hd(s,o.targetId),await Bd(s.localStore,o.targetId,!0))}async function mR(r,e){const t=we(r),s=t.Pu.get(e),o=t.Tu.get(s.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Af(t.remoteStore,s.targetId))}async function gR(r,e,t){const s=IR(r);try{const o=await(function(h,f){const g=we(h),_=Ye.now(),E=f.reduce(((U,$)=>U.add($.key)),ke());let T,C;return g.persistence.runTransaction("Locally write mutations","readwrite",(U=>{let $=Vr(),G=ke();return g.Os.getEntries(U,E).next((q=>{$=q,$.forEach(((me,ce)=>{ce.isValidDocument()||(G=G.add(me))}))})).next((()=>g.localDocuments.getOverlayedDocuments(U,$))).next((q=>{T=q;const me=[];for(const ce of f){const pe=D1(ce,T.get(ce.key).overlayedDocument);pe!=null&&me.push(new Pi(ce.key,pe,nv(pe.value.mapValue),zn.exists(!0)))}return g.mutationQueue.addMutationBatch(U,_,me,f)})).next((q=>{C=q;const me=q.applyToLocalDocumentSet(T,G);return g.documentOverlayCache.saveOverlays(U,q.batchId,me)}))})).then((()=>({batchId:C.batchId,changes:fv(T)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),(function(h,f,g){let _=h.Ru[h.currentUser.toKey()];_||(_=new tt(Ae)),_=_.insert(f,g),h.Ru[h.currentUser.toKey()]=_})(s,o.batchId,t),await dl(s,o.changes),await Pc(s.remoteStore)}catch(o){const l=xf(o,"Failed to persist write");t.reject(l)}}async function Xv(r,e){const t=we(r);try{const s=await kA(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.Eu.get(l);h&&(Ue(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.lu=!0:o.modifiedDocuments.size>0?Ue(h.lu,14607):o.removedDocuments.size>0&&(Ue(h.lu,42227),h.lu=!1))})),await dl(t,s,e)}catch(s){await bo(s)}}function ky(r,e,t){const s=we(r);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const o=[];s.Pu.forEach(((l,h)=>{const f=h.view.va(e);f.snapshot&&o.push(f.snapshot)})),(function(h,f){const g=we(h);g.onlineState=f;let _=!1;g.queries.forEach(((E,T)=>{for(const C of T.wa)C.va(f)&&(_=!0)})),_&&Nf(g)})(s.eventManager,e),o.length&&s.hu.J_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function yR(r,e,t){const s=we(r);s.sharedClientState.updateQueryState(e,"rejected",t);const o=s.Eu.get(e),l=o&&o.key;if(l){let h=new tt(ue.comparator);h=h.insert(l,jt.newNoDocument(l,ve.min()));const f=ke().add(l),g=new Ac(ve.min(),new Map,new tt(Ae),h,f);await Xv(s,g),s.du=s.du.remove(l),s.Eu.delete(e),Vf(s)}else await Bd(s.localStore,e,!1).then((()=>Hd(s,e,t))).catch(bo)}async function _R(r,e){const t=we(r),s=e.batch.batchId;try{const o=await PA(t.localStore,e);Zv(t,s,null),Jv(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await dl(t,o)}catch(o){await bo(o)}}async function vR(r,e,t){const s=we(r);try{const o=await(function(h,f){const g=we(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let E;return g.mutationQueue.lookupMutationBatch(_,f).next((T=>(Ue(T!==null,37113),E=T.keys(),g.mutationQueue.removeMutationBatch(_,T)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,E,f))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,E))).next((()=>g.localDocuments.getDocuments(_,E)))}))})(s.localStore,e);Zv(s,e,t),Jv(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await dl(s,o)}catch(o){await bo(o)}}function Jv(r,e){(r.Vu.get(e)||[]).forEach((t=>{t.resolve()})),r.Vu.delete(e)}function Zv(r,e,t){const s=we(r);let o=s.Ru[s.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),s.Ru[s.currentUser.toKey()]=o}}function Hd(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const s of r.Tu.get(e))r.Pu.delete(s),t&&r.hu.pu(s,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach((s=>{r.Au.containsKey(s)||e0(r,s)}))}function e0(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Af(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),Vf(r))}function xy(r,e,t){for(const s of t)s instanceof Kv?(r.Au.addReference(s.key,e),wR(r,s)):s instanceof Qv?(ne(Df,"Document no longer in limbo: "+s.key),r.Au.removeReference(s.key,e),r.Au.containsKey(s.key)||e0(r,s.key)):ye(19791,{yu:s})}function wR(r,e){const t=e.key,s=t.path.canonicalString();r.du.get(t)||r.Iu.has(s)||(ne(Df,"New document in limbo: "+t),r.Iu.add(s),Vf(r))}function Vf(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new ue(Ge.fromString(e)),s=r.mu.next();r.Eu.set(s,new uR(t)),r.du=r.du.insert(t,s),Uv(r.remoteStore,new hi(ir(wc(t.path)),s,"TargetPurposeLimboResolution",yc.ue))}}async function dl(r,e,t){const s=we(r),o=[],l=[],h=[];s.Pu.isEmpty()||(s.Pu.forEach(((f,g)=>{h.push(s.gu(g,e,t).then((_=>{var E;if((_||t)&&s.isPrimaryClient){const T=_?!_.fromCache:(E=t==null?void 0:t.targetChanges.get(g.targetId))===null||E===void 0?void 0:E.current;s.sharedClientState.updateQueryState(g.targetId,T?"current":"not-current")}if(_){o.push(_);const T=If.Es(g.targetId,_);l.push(T)}})))})),await Promise.all(h),s.hu.J_(o),await(async function(g,_){const E=we(g);try{await E.persistence.runTransaction("notifyLocalViewChanges","readwrite",(T=>H.forEach(_,(C=>H.forEach(C.Is,(U=>E.persistence.referenceDelegate.addReference(T,C.targetId,U))).next((()=>H.forEach(C.ds,(U=>E.persistence.referenceDelegate.removeReference(T,C.targetId,U)))))))))}catch(T){if(!Oo(T))throw T;ne(Sf,"Failed to update sequence numbers: "+T)}for(const T of _){const C=T.targetId;if(!T.fromCache){const U=E.Fs.get(C),$=U.snapshotVersion,G=U.withLastLimboFreeSnapshotVersion($);E.Fs=E.Fs.insert(C,G)}}})(s.localStore,l))}async function ER(r,e){const t=we(r);if(!t.currentUser.isEqual(e)){ne(Df,"User change. New user:",e.toKey());const s=await Ov(t.localStore,e);t.currentUser=e,(function(l,h){l.Vu.forEach((f=>{f.forEach((g=>{g.reject(new ee(B.CANCELLED,h))}))})),l.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await dl(t,s.Bs)}}function TR(r,e){const t=we(r),s=t.Eu.get(e);if(s&&s.lu)return ke().add(s.key);{let o=ke();const l=t.Tu.get(e);if(!l)return o;for(const h of l){const f=t.Pu.get(h);o=o.unionWith(f.view.tu)}return o}}function t0(r){const e=we(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Xv.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=TR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=yR.bind(null,e),e.hu.J_=sR.bind(null,e.eventManager),e.hu.pu=oR.bind(null,e.eventManager),e}function IR(r){const e=we(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=_R.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=vR.bind(null,e),e}class uc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Rc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return CA(this.persistence,new SA,e.initialUser,this.serializer)}Du(e){return new bv(Tf.Vi,this.serializer)}bu(e){return new bA}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}uc.provider={build:()=>new uc};class SR extends uc{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Ue(this.persistence.referenceDelegate instanceof ac,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new uA(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?en.withCacheSize(this.cacheSizeBytes):en.DEFAULT;return new bv((s=>ac.Vi(s,t)),this.serializer)}}class Wd{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>ky(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=ER.bind(null,this.syncEngine),await nR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new iR})()}createDatastore(e){const t=Rc(e.databaseInfo.databaseId),s=(function(l){return new UA(l)})(e.databaseInfo);return(function(l,h,f,g){return new $A(l,h,f,g)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,o,l,h,f){return new HA(s,o,l,h,f)})(this.localStore,this.datastore,e.asyncQueue,(t=>ky(this.syncEngine,t,0)),(function(){return Iy.C()?new Iy:new OA})())}createSyncEngine(e,t){return(function(o,l,h,f,g,_,E){const T=new cR(o,l,h,f,g,_);return E&&(T.fu=!0),T})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=we(o);ne(cs,"RemoteStore shutting down."),l.Ia.add(5),await hl(l),l.Ea.shutdown(),l.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Wd.provider={build:()=>new Wd};/**
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
 */class n0{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):Dr("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Ai="FirestoreClient";class AR{constructor(e,t,s,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=o,this.user=Ut.UNAUTHENTICATED,this.clientId=cf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(s,(async h=>{ne(Ai,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(s,(h=>(ne(Ai,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new yi;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=xf(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Ed(r,e){r.asyncQueue.verifyOperationInProgress(),ne(Ai,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let s=t.initialUser;r.setCredentialChangeListener((async o=>{s.isEqual(o)||(await Ov(e.localStore,o),s=o)})),e.persistence.setDatabaseDeletedListener((()=>{vi("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then((()=>{ne("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((o=>{vi("Terminating Firestore due to IndexedDb database deletion failed",o)}))})),r._offlineComponents=e}async function Ny(r,e){r.asyncQueue.verifyOperationInProgress();const t=await RR(r);ne(Ai,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((s=>Ay(e.remoteStore,s))),r.setAppCheckTokenChangeListener(((s,o)=>Ay(e.remoteStore,o))),r._onlineComponents=e}async function RR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ne(Ai,"Using user provided OfflineComponentProvider");try{await Ed(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===B.FAILED_PRECONDITION||o.code===B.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;vi("Error using user provided cache. Falling back to memory cache: "+t),await Ed(r,new uc)}}else ne(Ai,"Using default OfflineComponentProvider"),await Ed(r,new SR(void 0));return r._offlineComponents}async function r0(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ne(Ai,"Using user provided OnlineComponentProvider"),await Ny(r,r._uninitializedComponentsProvider._online)):(ne(Ai,"Using default OnlineComponentProvider"),await Ny(r,new Wd))),r._onlineComponents}function CR(r){return r0(r).then((e=>e.syncEngine))}async function Gd(r){const e=await r0(r),t=e.eventManager;return t.onListen=hR.bind(null,e.syncEngine),t.onUnlisten=pR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=dR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=mR.bind(null,e.syncEngine),t}function PR(r,e,t={}){const s=new yi;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const E=new n0({next:C=>{E.Ou(),h.enqueueAndForget((()=>Wv(l,T)));const U=C.docs.has(f);!U&&C.fromCache?_.reject(new ee(B.UNAVAILABLE,"Failed to get document because the client is offline.")):U&&C.fromCache&&g&&g.source==="server"?_.reject(new ee(B.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):_.resolve(C)},error:C=>_.reject(C)}),T=new Gv(wc(f.path),E,{includeMetadataChanges:!0,ka:!0});return Hv(l,T)})(await Gd(r),r.asyncQueue,e,t,s))),s.promise}/**
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
 */function i0(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const Dy=new Map;/**
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
 */const s0="firestore.googleapis.com",Vy=!0;class by{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new ee(B.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=s0,this.ssl=Vy}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Vy;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Vv;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<aA)throw new ee(B.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}WS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=i0((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(l){if(l.timeoutSeconds!==void 0){if(isNaN(l.timeoutSeconds))throw new ee(B.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (must not be NaN)`);if(l.timeoutSeconds<5)throw new ee(B.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (minimum allowed value is 5)`);if(l.timeoutSeconds>30)throw new ee(B.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class kc{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new by({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ee(B.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ee(B.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new by(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new MS;switch(s.type){case"firstParty":return new zS(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new ee(B.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Dy.get(t);s&&(ne("ComponentProvider","Removing Datastore"),Dy.delete(t),s.terminate())})(this),Promise.resolve()}}function kR(r,e,t,s={}){var o;r=jn(r,kc);const l=ko(e),h=r._getSettings(),f=Object.assign(Object.assign({},h),{emulatorOptions:r._getEmulatorOptions()}),g=`${e}:${t}`;l&&(Qy(`https://${g}`),Yy("Firestore",!0)),h.host!==s0&&h.host!==g&&vi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const _=Object.assign(Object.assign({},h),{host:g,ssl:l,emulatorOptions:s});if(!kr(_,f)&&(r._setSettings(_),s.mockUserToken)){let E,T;if(typeof s.mockUserToken=="string")E=s.mockUserToken,T=Ut.MOCK_USER;else{E=Qw(s.mockUserToken,(o=r._app)===null||o===void 0?void 0:o.options.projectId);const C=s.mockUserToken.sub||s.mockUserToken.user_id;if(!C)throw new ee(B.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");T=new Ut(C)}r._authCredentials=new FS(new $_(E,T))}}/**
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
 */class ki{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ki(this.firestore,e,this._query)}}class rt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _i(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new rt(this.firestore,e,this._key)}toJSON(){return{type:rt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(ll(t,rt._jsonSchema))return new rt(e,s||null,new ue(Ge.fromString(t.referencePath)))}}rt._jsonSchemaVersion="firestore/documentReference/1.0",rt._jsonSchema={type:ht("string",rt._jsonSchemaVersion),referencePath:ht("string")};class _i extends ki{constructor(e,t,s){super(e,t,wc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new rt(this.firestore,null,new ue(e))}withConverter(e){return new _i(this.firestore,e,this._path)}}function hs(r,e,...t){if(r=At(r),H_("collection","path",e),r instanceof kc){const s=Ge.fromString(e,...t);return Gg(s),new _i(r,null,s)}{if(!(r instanceof rt||r instanceof _i))throw new ee(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(Ge.fromString(e,...t));return Gg(s),new _i(r.firestore,null,s)}}function tl(r,e,...t){if(r=At(r),arguments.length===1&&(e=cf.newId()),H_("doc","path",e),r instanceof kc){const s=Ge.fromString(e,...t);return Wg(s),new rt(r,null,new ue(s))}{if(!(r instanceof rt||r instanceof _i))throw new ee(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(Ge.fromString(e,...t));return Wg(s),new rt(r.firestore,r instanceof _i?r.converter:null,new ue(s))}}/**
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
 */const Oy="AsyncQueue";class Ly{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Mv(this,"async_queue_retry"),this.oc=()=>{const s=wd();s&&ne(Oy,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=wd();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=wd();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new yi;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Oo(e))throw e;ne(Oy,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,Dr("INTERNAL UNHANDLED ERROR: ",My(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=kf.createAndSchedule(this,e,t,s,(l=>this.lc(l)));return this.ec.push(o),o}ac(){this.tc&&ye(47125,{hc:My(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function My(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
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
 */function Fy(r){return(function(t,s){if(typeof t!="object"||t===null)return!1;const o=t;for(const l of s)if(l in o&&typeof o[l]=="function")return!0;return!1})(r,["next","error","complete"])}class ds extends kc{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new Ly,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ly(e),this._firestoreClient=void 0,await e}}}function xR(r,e){const t=typeof r=="object"?r:e_(),s=typeof r=="string"?r:tc,o=Jd(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const l=Gw("firestore");l&&kR(o,...l)}return o}function bf(r){if(r._terminated)throw new ee(B.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||NR(r),r._firestoreClient}function NR(r){var e,t,s;const o=r._freezeSettings(),l=(function(f,g,_,E){return new r1(f,g,_,E.host,E.ssl,E.experimentalForceLongPolling,E.experimentalAutoDetectLongPolling,i0(E.experimentalLongPollingOptions),E.useFetchStreams,E.isUsingEmulator)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,o);r._componentsProvider||!((t=o.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(r._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),r._firestoreClient=new AR(r._authCredentials,r._appCheckCredentials,r._queue,l,r._componentsProvider&&(function(f){const g=f==null?void 0:f._online.build();return{_offline:f==null?void 0:f._offline.build(g),_online:g}})(r._componentsProvider))}/**
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
 */class En{constructor(e){this._byteString=e}static fromBase64String(e){try{return new En(Vt.fromBase64String(e))}catch(t){throw new ee(B.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new En(Vt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:En._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ll(e,En._jsonSchema))return En.fromBase64String(e.bytes)}}En._jsonSchemaVersion="firestore/bytes/1.0",En._jsonSchema={type:ht("string",En._jsonSchemaVersion),bytes:ht("string")};/**
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
 */class xc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ee(B.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Dt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Fo{constructor(e){this._methodName=e}}/**
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
 */class or{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ee(B.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ee(B.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ae(this._lat,e._lat)||Ae(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:or._jsonSchemaVersion}}static fromJSON(e){if(ll(e,or._jsonSchema))return new or(e.latitude,e.longitude)}}or._jsonSchemaVersion="firestore/geoPoint/1.0",or._jsonSchema={type:ht("string",or._jsonSchemaVersion),latitude:ht("number"),longitude:ht("number")};/**
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
 */class ar{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let l=0;l<s.length;++l)if(s[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ar._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ll(e,ar._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ar(e.vectorValues);throw new ee(B.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ar._jsonSchemaVersion="firestore/vectorValue/1.0",ar._jsonSchema={type:ht("string",ar._jsonSchemaVersion),vectorValues:ht("object")};/**
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
 */const DR=/^__.*__$/;class VR{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Pi(e,this.data,this.fieldMask,t,this.fieldTransforms):new ul(e,this.data,t,this.fieldTransforms)}}class o0{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Pi(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function a0(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ye(40011,{Ec:r})}}class Nc{constructor(e,t,s,o,l,h){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=o,l===void 0&&this.Ac(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Nc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.fc(e),o}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.Ac(),o}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return cc(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(a0(this.Ec)&&DR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class bR{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Rc(e)}Dc(e,t,s,o=!1){return new Nc({Ec:e,methodName:t,bc:s,path:Dt.emptyPath(),mc:!1,Sc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Dc(r){const e=r._freezeSettings(),t=Rc(r._databaseId);return new bR(r._databaseId,!!e.ignoreUndefinedProperties,t)}function l0(r,e,t,s,o,l={}){const h=r.Dc(l.merge||l.mergeFields?2:0,e,t,o);Ff("Data must be an object, but it was:",h,s);const f=c0(s,h);let g,_;if(l.merge)g=new cn(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const E=[];for(const T of l.mergeFields){const C=Kd(e,T,t);if(!h.contains(C))throw new ee(B.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);d0(E,C)||E.push(C)}g=new cn(E),_=h.fieldTransforms.filter((T=>g.covers(T.field)))}else g=null,_=h.fieldTransforms;return new VR(new tn(f),g,_)}class Vc extends Fo{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Vc}}function u0(r,e,t){return new Nc({Ec:3,bc:e.settings.bc,methodName:r._methodName,mc:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Of extends Fo{_toFieldTransform(e){return new yf(e.path,new el)}isEqual(e){return e instanceof Of}}class Lf extends Fo{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=u0(this,e,!0),s=this.vc.map((l=>gs(l,t))),o=new Ao(s);return new yf(e.path,o)}isEqual(e){return e instanceof Lf&&kr(this.vc,e.vc)}}class Mf extends Fo{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=u0(this,e,!0),s=this.vc.map((l=>gs(l,t))),o=new Ro(s);return new yf(e.path,o)}isEqual(e){return e instanceof Mf&&kr(this.vc,e.vc)}}function OR(r,e,t,s){const o=r.Dc(1,e,t);Ff("Data must be an object, but it was:",o,s);const l=[],h=tn.empty();Ci(s,((g,_)=>{const E=Uf(e,g,t);_=At(_);const T=o.gc(E);if(_ instanceof Vc)l.push(E);else{const C=gs(_,T);C!=null&&(l.push(E),h.set(E,C))}}));const f=new cn(l);return new o0(h,f,o.fieldTransforms)}function LR(r,e,t,s,o,l){const h=r.Dc(1,e,t),f=[Kd(e,s,t)],g=[o];if(l.length%2!=0)throw new ee(B.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let C=0;C<l.length;C+=2)f.push(Kd(e,l[C])),g.push(l[C+1]);const _=[],E=tn.empty();for(let C=f.length-1;C>=0;--C)if(!d0(_,f[C])){const U=f[C];let $=g[C];$=At($);const G=h.gc(U);if($ instanceof Vc)_.push(U);else{const q=gs($,G);q!=null&&(_.push(U),E.set(U,q))}}const T=new cn(_);return new o0(E,T,h.fieldTransforms)}function MR(r,e,t,s=!1){return gs(t,r.Dc(s?4:3,e))}function gs(r,e){if(h0(r=At(r)))return Ff("Unsupported field value:",e,r),c0(r,e);if(r instanceof Fo)return(function(s,o){if(!a0(o.Ec))throw o.wc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.wc(`${s._methodName}() is not currently supported inside arrays`);const l=s._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,o){const l=[];let h=0;for(const f of s){let g=gs(f,o.yc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(s,o){if((s=At(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return R1(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const l=Ye.fromDate(s);return{timestampValue:oc(o.serializer,l)}}if(s instanceof Ye){const l=new Ye(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:oc(o.serializer,l)}}if(s instanceof or)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof En)return{bytesValue:Rv(o.serializer,s._byteString)};if(s instanceof rt){const l=o.databaseId,h=s.firestore._databaseId;if(!h.isEqual(l))throw o.wc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:wf(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof ar)return(function(h,f){return{mapValue:{fields:{[ev]:{stringValue:tv},[nc]:{arrayValue:{values:h.toArray().map((_=>{if(typeof _!="number")throw f.wc("VectorValues must only contain numeric values.");return gf(f.serializer,_)}))}}}}}})(s,o);throw o.wc(`Unsupported field value: ${gc(s)}`)})(r,e)}function c0(r,e){const t={};return K_(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ci(r,((s,o)=>{const l=gs(o,e.Vc(s));l!=null&&(t[s]=l)})),{mapValue:{fields:t}}}function h0(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ye||r instanceof or||r instanceof En||r instanceof rt||r instanceof Fo||r instanceof ar)}function Ff(r,e,t){if(!h0(t)||!W_(t)){const s=gc(t);throw s==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+s)}}function Kd(r,e,t){if((e=At(e))instanceof xc)return e._internalPath;if(typeof e=="string")return Uf(r,e);throw cc("Field path arguments must be of type string or ",r,!1,void 0,t)}const FR=new RegExp("[~\\*/\\[\\]]");function Uf(r,e,t){if(e.search(FR)>=0)throw cc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new xc(...e.split("."))._internalPath}catch{throw cc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function cc(r,e,t,s,o){const l=s&&!s.isEmpty(),h=o!==void 0;let f=`Function ${e}() called with invalid data`;t&&(f+=" (via `toFirestore()`)"),f+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${s}`),h&&(g+=` in document ${o}`),g+=")"),new ee(B.INVALID_ARGUMENT,f+r+g)}function d0(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class f0{constructor(e,t,s,o,l){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new rt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new UR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(jf("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class UR extends f0{data(){return super.data()}}function jf(r,e){return typeof e=="string"?Uf(r,e):e instanceof xc?e._internalPath:e._delegate._internalPath}/**
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
 */function jR(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ee(B.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class zf{}class Bf extends zf{}function p0(r,e,...t){let s=[];e instanceof zf&&s.push(e),s=s.concat(t),(function(l){const h=l.filter((g=>g instanceof qf)).length,f=l.filter((g=>g instanceof $f)).length;if(h>1||h>0&&f>0)throw new ee(B.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const o of s)r=o._apply(r);return r}class $f extends Bf{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new $f(e,t,s)}_apply(e){const t=this._parse(e);return m0(e._query,t),new ki(e.firestore,e.converter,Md(e._query,t))}_parse(e){const t=Dc(e.firestore);return(function(l,h,f,g,_,E,T){let C;if(_.isKeyField()){if(E==="array-contains"||E==="array-contains-any")throw new ee(B.INVALID_ARGUMENT,`Invalid Query. You can't perform '${E}' queries on documentId().`);if(E==="in"||E==="not-in"){jy(T,E);const $=[];for(const G of T)$.push(Uy(g,l,G));C={arrayValue:{values:$}}}else C=Uy(g,l,T)}else E!=="in"&&E!=="not-in"&&E!=="array-contains-any"||jy(T,E),C=MR(f,h,T,E==="in"||E==="not-in");return ct.create(_,E,C)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class qf extends zf{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new qf(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:$n.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const f=l.getFlattenedFilters();for(const g of f)m0(h,g),h=Md(h,g)})(e._query,t),new ki(e.firestore,e.converter,Md(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Hf extends Bf{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Hf(e,t)}_apply(e){const t=(function(o,l,h){if(o.startAt!==null)throw new ee(B.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(o.endAt!==null)throw new ee(B.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Za(l,h)})(e._query,this._field,this._direction);return new ki(e.firestore,e.converter,(function(o,l){const h=o.explicitOrderBy.concat([l]);return new Lo(o.path,o.collectionGroup,h,o.filters.slice(),o.limit,o.limitType,o.startAt,o.endAt)})(e._query,t))}}function zR(r,e="asc"){const t=e,s=jf("orderBy",r);return Hf._create(s,t)}class Wf extends Bf{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new Wf(e,t,s)}_apply(e){return new ki(e.firestore,e.converter,ic(e._query,this._limit,this._limitType))}}function BR(r){return Wf._create("limit",r,"F")}function Uy(r,e,t){if(typeof(t=At(t))=="string"){if(t==="")throw new ee(B.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!uv(e)&&t.indexOf("/")!==-1)throw new ee(B.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(Ge.fromString(t));if(!ue.isDocumentKey(s))throw new ee(B.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return ty(r,new ue(s))}if(t instanceof rt)return ty(r,t._key);throw new ee(B.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${gc(t)}.`)}function jy(r,e){if(!Array.isArray(r)||r.length===0)throw new ee(B.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function m0(r,e){const t=(function(o,l){for(const h of o)for(const f of h.getFlattenedFilters())if(l.indexOf(f.op)>=0)return f.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ee(B.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ee(B.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class $R{convertValue(e,t="none"){switch(Ii(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ot(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ti(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ye(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return Ci(e,((o,l)=>{s[o]=this.convertValue(l,t)})),s}convertVectorValue(e){var t,s,o;const l=(o=(s=(t=e.fields)===null||t===void 0?void 0:t[nc].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map((h=>ot(h.doubleValue)));return new ar(l)}convertGeoPoint(e){return new or(ot(e.latitude),ot(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=vc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Ya(e));default:return null}}convertTimestamp(e){const t=Ei(e);return new Ye(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=Ge.fromString(e);Ue(Dv(s),9688,{name:e});const o=new Xa(s.get(1),s.get(3)),l=new ue(s.popFirst(5));return o.isEqual(t)||Dr(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
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
 */function g0(r,e,t){let s;return s=r?r.toFirestore(e):e,s}class Ua{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class os extends f0{constructor(e,t,s,o,l,h){super(e,t,s,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Hu(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(jf("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ee(B.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=os._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}os._jsonSchemaVersion="firestore/documentSnapshot/1.0",os._jsonSchema={type:ht("string",os._jsonSchemaVersion),bundleSource:ht("string","DocumentSnapshot"),bundleName:ht("string"),bundle:ht("string")};class Hu extends os{data(e={}){return super.data(e)}}class vo{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Ua(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new Hu(this._firestore,this._userDataWriter,s.key,s,new Ua(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ee(B.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((f=>{const g=new Hu(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ua(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>l||f.type!==3)).map((f=>{const g=new Hu(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ua(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,E=-1;return f.type!==0&&(_=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),E=h.indexOf(f.doc.key)),{type:qR(f.type),doc:g,oldIndex:_,newIndex:E}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ee(B.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=vo._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=cf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),s.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function qR(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ye(61501,{type:r})}}/**
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
 */function y0(r){r=jn(r,rt);const e=jn(r.firestore,ds);return PR(bf(e),r._key).then((t=>w0(e,r,t)))}vo._jsonSchemaVersion="firestore/querySnapshot/1.0",vo._jsonSchema={type:ht("string",vo._jsonSchemaVersion),bundleSource:ht("string","QuerySnapshot"),bundleName:ht("string"),bundle:ht("string")};class _0 extends $R{constructor(e){super(),this.firestore=e}convertBytes(e){return new En(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new rt(this.firestore,null,t)}}function HR(r,e,t){r=jn(r,rt);const s=jn(r.firestore,ds),o=g0(r.converter,e);return Gf(s,[l0(Dc(s),"setDoc",r._key,o,r.converter!==null,t).toMutation(r._key,zn.none())])}function WR(r,e,t,...s){r=jn(r,rt);const o=jn(r.firestore,ds),l=Dc(o);let h;return h=typeof(e=At(e))=="string"||e instanceof xc?LR(l,"updateDoc",r._key,e,t,s):OR(l,"updateDoc",r._key,e),Gf(o,[h.toMutation(r._key,zn.exists(!0))])}function v0(r,e){const t=jn(r.firestore,ds),s=tl(r),o=g0(r.converter,e);return Gf(t,[l0(Dc(r.firestore),"addDoc",s._key,o,r.converter!==null,{}).toMutation(s._key,zn.exists(!1))]).then((()=>s))}function nl(r,...e){var t,s,o;r=At(r);let l={includeMetadataChanges:!1,source:"default"},h=0;typeof e[h]!="object"||Fy(e[h])||(l=e[h++]);const f={includeMetadataChanges:l.includeMetadataChanges,source:l.source};if(Fy(e[h])){const T=e[h];e[h]=(t=T.next)===null||t===void 0?void 0:t.bind(T),e[h+1]=(s=T.error)===null||s===void 0?void 0:s.bind(T),e[h+2]=(o=T.complete)===null||o===void 0?void 0:o.bind(T)}let g,_,E;if(r instanceof rt)_=jn(r.firestore,ds),E=wc(r._key.path),g={next:T=>{e[h]&&e[h](w0(_,r,T))},error:e[h+1],complete:e[h+2]};else{const T=jn(r,ki);_=jn(T.firestore,ds),E=T._query;const C=new _0(_);g={next:U=>{e[h]&&e[h](new vo(_,C,T,U))},error:e[h+1],complete:e[h+2]},jR(r._query)}return(function(C,U,$,G){const q=new n0(G),me=new Gv(U,q,$);return C.asyncQueue.enqueueAndForget((async()=>Hv(await Gd(C),me))),()=>{q.Ou(),C.asyncQueue.enqueueAndForget((async()=>Wv(await Gd(C),me)))}})(bf(_),E,f,g)}function Gf(r,e){return(function(s,o){const l=new yi;return s.asyncQueue.enqueueAndForget((async()=>gR(await CR(s),o,l))),l.promise})(bf(r),e)}function w0(r,e,t){const s=t.docs.get(e._key),o=new _0(r);return new os(r,o,e._key,s,new Ua(t.hasPendingWrites,t.fromCache),e.converter)}function E0(){return new Of("serverTimestamp")}function GR(...r){return new Lf("arrayUnion",r)}function KR(...r){return new Mf("arrayRemove",r)}(function(e,t=!0){(function(o){Vo=o})(xo),wo(new as("firestore",((s,{instanceIdentifier:o,options:l})=>{const h=s.getProvider("app").getImmediate(),f=new ds(new US(s.getProvider("auth-internal")),new BS(h,s.getProvider("app-check-internal")),(function(_,E){if(!Object.prototype.hasOwnProperty.apply(_.options,["projectId"]))throw new ee(B.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Xa(_.options.projectId,E)})(h,o),h);return l=Object.assign({useFetchStreams:t},l),f._setSettings(l),f}),"PUBLIC").setMultipleInstances(!0)),pi(zg,Bg,e),pi(zg,Bg,"esm2017")})();const QR={apiKey:"AIzaSyCpcSwYcwUQ_f7_0BgYtQzKxSMnsZ2e6CE",authDomain:"taliat-portal.firebaseapp.com",projectId:"taliat-portal",storageBucket:"taliat-portal.firebasestorage.app",messagingSenderId:"258276231531",appId:"1:258276231531:web:035f8c04d21a68f33ca42e",measurementId:"G-VQSJ9ZFKLY"},T0=Zy(QR),I0=VS(T0),Un=xR(T0);function YR({onUserAuthenticated:r}){const[e,t]=Se.useState(""),[s,o]=Se.useState(""),[l,h]=Se.useState(""),[f,g]=Se.useState(!1),_=async E=>{E.preventDefault(),h(""),g(!0);const T=e.trim().toLowerCase(),C=T.includes("@")?T:`${T}@talia.app`;try{const $=(await vI(I0,C,s)).user;try{const G=await y0(tl(Un,"users",$.uid));G.exists()?r({uid:$.uid,...G.data()}):r({uid:$.uid,fullName:T.split("@")[0],role:"leader"})}catch(G){console.warn("Firestore fetch failed, logging in with auth profile:",G),r({uid:$.uid,fullName:$.email,role:"leader"})}}catch(U){console.error("Login error:",U),h(`[${U.code||"error"}] ${U.message}`)}finally{g(!1)}};return b.jsx("div",{className:"min-h-screen bg-slate-900 flex items-center justify-center p-4",children:b.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-8 shadow-2xl",children:[b.jsx("h2",{className:"text-2xl font-bold text-center text-white mb-2",children:"Taliʿa Portal"}),b.jsx("p",{className:"text-sm text-slate-400 text-center mb-6",children:"Log in to track requirements and chat"}),l&&b.jsx("div",{className:"p-3 mb-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-xs break-words",children:l}),b.jsxs("form",{onSubmit:_,className:"space-y-4",children:[b.jsxs("div",{children:[b.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Username or Email"}),b.jsx("input",{type:"text",required:!0,value:e,onChange:E=>t(E.target.value),placeholder:"e.g. neoissa@gmail.com",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"})]}),b.jsxs("div",{children:[b.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Password"}),b.jsx("input",{type:"password",required:!0,value:s,onChange:E=>o(E.target.value),placeholder:"••••••••",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"})]}),b.jsx("button",{type:"submit",disabled:f,className:"w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer",children:f?"Logging in...":"Enter Portal"})]})]})})}function XR({currentUser:r}){const[e,t]=Se.useState([]),[s,o]=Se.useState("all"),[l,h]=Se.useState(!0);Se.useEffect(()=>{const T=p0(hs(Un,"requirements")),C=nl(T,U=>{const $=U.docs.map(G=>({id:G.id,...G.data()}));t($),h(!1)},U=>{console.error(U),h(!1)});return()=>C()},[]);const f=async T=>{var $;const C=($=T.completedBy)==null?void 0:$.includes(r.uid),U=tl(Un,"requirements",T.id);try{await WR(U,{completedBy:C?KR(r.uid):GR(r.uid)})}catch(G){console.error("Failed to update task:",G)}},g=e.filter(T=>{var C;return(C=T.completedBy)==null?void 0:C.includes(r.uid)}).length,_=e.length>0?Math.round(g/e.length*100):0,E=e.filter(T=>{var U;const C=(U=T.completedBy)==null?void 0:U.includes(r.uid);return s==="completed"?C:s==="remaining"?!C:!0});return b.jsxs("div",{className:"space-y-6",children:[b.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6",children:[b.jsxs("div",{className:"flex justify-between items-center mb-2",children:[b.jsx("h3",{className:"font-bold text-lg text-white",children:"Patrol Advancement Progress"}),b.jsxs("span",{className:"text-emerald-400 font-bold",children:[_,"% Completed"]})]}),b.jsx("div",{className:"w-full bg-slate-700 h-3 rounded-full overflow-hidden mb-4",children:b.jsx("div",{className:"bg-emerald-500 h-full transition-all duration-300 rounded-full",style:{width:`${_}%`}})}),b.jsxs("p",{className:"text-xs text-slate-400",children:["Completed ",g," of ",e.length," requirements."]})]}),b.jsx("div",{className:"flex gap-2",children:["all","remaining","completed"].map(T=>b.jsx("button",{onClick:()=>o(T),className:`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${s===T?"bg-emerald-600 text-white shadow-md":"bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"}`,children:T==="all"?"All Tasks":T},T))}),b.jsx("div",{className:"space-y-3",children:l?b.jsx("div",{className:"text-center py-8 text-slate-400 text-sm",children:"Loading requirements..."}):E.length===0?b.jsx("div",{className:"text-center py-8 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800",children:"No requirements found in this category."}):E.map(T=>{var U;const C=(U=T.completedBy)==null?void 0:U.includes(r.uid);return b.jsxs("div",{onClick:()=>f(T),className:`p-4 rounded-xl border transition flex items-start gap-4 cursor-pointer select-none ${C?"bg-emerald-950/20 border-emerald-800/50 text-slate-300":"bg-slate-800 border-slate-700 text-white hover:border-slate-600"}`,children:[b.jsx("input",{type:"checkbox",checked:!!C,readOnly:!0,className:"mt-1 w-5 h-5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"}),b.jsxs("div",{className:"flex-1",children:[b.jsxs("div",{className:"flex justify-between items-center mb-1",children:[b.jsx("span",{className:`font-semibold ${C?"line-through text-slate-400":"text-white"}`,children:T.title}),b.jsx("span",{className:"text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 uppercase",children:T.category||"Core"})]}),T.description&&b.jsx("p",{className:"text-xs text-slate-400",children:T.description})]})]},T.id)})})]})}function JR({currentUser:r}){const[e,t]=Se.useState([]),[s,o]=Se.useState(""),l=Se.useRef();Se.useEffect(()=>{const f=p0(hs(Un,"patrol_messages"),zR("timestamp","asc"),BR(50)),g=nl(f,_=>{const E=_.docs.map(T=>({id:T.id,...T.data()}));t(E),setTimeout(()=>{var T;return(T=l.current)==null?void 0:T.scrollIntoView({behavior:"smooth"})},100)});return()=>g()},[]);const h=async f=>{if(f.preventDefault(),!s.trim())return;const g=s;o("");try{await v0(hs(Un,"patrol_messages"),{text:g,senderId:r.uid,senderName:r.fullName||r.email.split("@")[0],role:r.role||"member",timestamp:E0()})}catch(_){console.error("Failed to send message:",_)}};return b.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden",children:[b.jsxs("div",{className:"p-4 border-b border-slate-700 bg-slate-800/80",children:[b.jsx("h3",{className:"font-bold text-white text-base",children:"Patrol Stream"}),b.jsx("p",{className:"text-xs text-slate-400",children:"Live communication channel for members & leaders"})]}),b.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-3",children:[e.length===0?b.jsx("div",{className:"text-center py-12 text-slate-500 text-xs",children:"No messages yet. Send the first update!"}):e.map(f=>{const g=f.senderId===r.uid;return b.jsxs("div",{className:`flex flex-col ${g?"items-end":"items-start"}`,children:[b.jsxs("div",{className:"flex items-center gap-1.5 mb-1 px-1",children:[b.jsx("span",{className:"text-xs font-semibold text-slate-300",children:f.senderName}),f.role==="leader"&&b.jsx("span",{className:"text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30",children:"Leader"})]}),b.jsx("div",{className:`p-3 rounded-2xl max-w-[80%] text-sm break-words ${g?"bg-emerald-600 text-white rounded-tr-none":"bg-slate-700 text-slate-100 rounded-tl-none"}`,children:f.text})]},f.id)}),b.jsx("div",{ref:l})]}),b.jsxs("form",{onSubmit:h,className:"p-3 bg-slate-900 border-t border-slate-700 flex gap-2",children:[b.jsx("input",{type:"text",value:s,onChange:f=>o(f.target.value),placeholder:"Share an update or question...",className:"flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"}),b.jsx("button",{type:"submit",className:"bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer",children:"Send"})]})]})}function ZR(){const[r,e]=Se.useState(""),[t,s]=Se.useState("Knots & Pioneering"),[o,l]=Se.useState(""),[h,f]=Se.useState(""),g=async _=>{if(_.preventDefault(),!!r.trim())try{await v0(hs(Un,"requirements"),{title:r.trim(),category:t,description:o.trim(),completedBy:[],createdAt:E0()}),e(""),l(""),f("Requirement added successfully!"),setTimeout(()=>f(""),3e3)}catch(E){console.error(E),f("Error adding requirement.")}};return b.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-xl mx-auto shadow-xl",children:[b.jsx("h3",{className:"font-bold text-lg text-white mb-1",children:"Add Scout Requirement"}),b.jsx("p",{className:"text-xs text-slate-400 mb-6",children:"Create advancement checkpoints for your patrol members."}),h&&b.jsx("div",{className:"p-3 mb-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold",children:h}),b.jsxs("form",{onSubmit:g,className:"space-y-4",children:[b.jsxs("div",{children:[b.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Requirement Title"}),b.jsx("input",{type:"text",required:!0,value:r,onChange:_=>e(_.target.value),placeholder:"e.g. Tie a Clove Hitch & Taut-Line Hitch",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),b.jsxs("div",{children:[b.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Category"}),b.jsxs("select",{value:t,onChange:_=>s(_.target.value),className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500",children:[b.jsx("option",{value:"Knots & Pioneering",children:"Knots & Pioneering"}),b.jsx("option",{value:"First Aid",children:"First Aid"}),b.jsx("option",{value:"Navigation & Camping",children:"Navigation & Camping"}),b.jsx("option",{value:"Leadership & Values",children:"Leadership & Values"})]})]}),b.jsxs("div",{children:[b.jsx("label",{className:"block text-xs font-semibold text-slate-300 uppercase mb-1",children:"Details / Notes"}),b.jsx("textarea",{rows:3,value:o,onChange:_=>l(_.target.value),placeholder:"Demonstrate tying the hitch around a timber spar...",className:"w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"})]}),b.jsx("button",{type:"submit",className:"w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30",children:"Publish Requirement"})]})]})}/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S0=(...r)=>r.filter((e,t,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eC=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tC=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,s)=>s?s.toUpperCase():t.toLowerCase());/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zy=r=>{const e=tC(r);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Td={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nC=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},rC=Se.createContext({}),iC=()=>Se.useContext(rC),sC=Se.forwardRef(({color:r,size:e,strokeWidth:t,absoluteStrokeWidth:s,className:o="",children:l,iconNode:h,...f},g)=>{const{size:_=24,strokeWidth:E=2,absoluteStrokeWidth:T=!1,color:C="currentColor",className:U=""}=iC()??{},$=s??T?Number(t??E)*24/Number(e??_):t??E;return Se.createElement("svg",{ref:g,...Td,width:e??_??Td.width,height:e??_??Td.height,stroke:r??C,strokeWidth:$,className:S0("lucide",U,o),...!l&&!nC(f)&&{"aria-hidden":"true"},...f},[...h.map(([G,q])=>Se.createElement(G,q)),...Array.isArray(l)?l:[l]])});/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fl=(r,e)=>{const t=Se.forwardRef(({className:s,...o},l)=>Se.createElement(sC,{ref:l,iconNode:e,className:S0(`lucide-${eC(zy(r))}`,`lucide-${r}`,s),...o}));return t.displayName=zy(r),t};/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oC=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],aC=fl("arrow-left",oC);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lC=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],uC=fl("chevron-right",lC);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cC=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],hC=fl("printer",cC);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dC=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],fC=fl("save",dC);/**
 * @license lucide-react v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pC=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],mC=fl("users",pC);function gC({scout:r,currentUser:e,onBack:t}){const[s,o]=Se.useState([]),[l,h]=Se.useState({}),[f,g]=Se.useState(""),[_,E]=Se.useState(""),[T,C]=Se.useState(!1),[U,$]=Se.useState(!0),G=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});Se.useEffect(()=>{const I=nl(hs(Un,"requirements"),P=>{const x=P.docs.map(V=>({id:V.id,...V.data()}));x.sort((V,R)=>(V.category||"").localeCompare(R.category||"")||(V.title||"").localeCompare(R.title||"")),o(x),$(!1)});return()=>I()},[]),Se.useEffect(()=>{const I=nl(hs(Un,`users/${r.uid}/progress`),P=>{const x={};P.docs.forEach(V=>{x[V.id]=V.data()}),h(x)});return()=>I()},[r.uid]),Se.useEffect(()=>{const I=tl(Un,"leaderNotes",r.uid);y0(I).then(P=>{if(P.exists()){const x=P.data().note||"";g(x),E(x)}})},[r.uid]);const q=async()=>{try{await HR(tl(Un,"leaderNotes",r.uid),{note:f,updatedAt:new Date().toISOString(),updatedBy:e.uid}),E(f),C(!0),setTimeout(()=>C(!1),2500)}catch(I){console.error("Failed to save note:",I)}},me=s.length,ce=s.filter(I=>{var P;return((P=I.completedBy)==null?void 0:P.includes(r.uid))||!!l[I.id]}),pe=ce.length,Ee=me>0?Math.round(pe/me*100):0,Be=ce.filter(I=>(I.category||"").toLowerCase().includes("merit")||(I.category||"").toLowerCase().includes("badge")).length,Te={};let D={};s.forEach((I,P)=>{const x=I.category||"General";D[x]=(D[x]||0)+1,Te[I.id]=D[x]});const A=s.reduce((I,P)=>{const x=P.category||"General";return I[x]||(I[x]=[]),I[x].push(P),I},{});return b.jsxs("div",{className:"space-y-6",children:[b.jsxs("div",{className:"print-hide flex items-center justify-between",children:[b.jsxs("button",{onClick:t,className:"flex items-center gap-2 text-slate-400 hover:text-white transition text-sm cursor-pointer",children:[b.jsx(aC,{size:16}),"Back to Scout List"]}),b.jsxs("button",{onClick:()=>window.print(),className:"flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer text-sm shadow-lg shadow-emerald-900/30",children:[b.jsx(hC,{size:16}),"Print Progress Report"]})]}),b.jsxs("div",{id:"print-report",className:"bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6",children:[b.jsx("div",{className:"report-header border-b border-slate-600 pb-4",children:b.jsxs("div",{className:"flex justify-between items-start",children:[b.jsxs("div",{children:[b.jsx("h1",{className:"text-2xl font-black text-white",children:r.fullName||r.email}),b.jsxs("p",{className:"text-sm text-slate-400 mt-0.5",children:[b.jsx("span",{className:"font-semibold text-emerald-400",children:r.rank||"Scout"}),r.patrol&&b.jsxs(b.Fragment,{children:[" • ",b.jsxs("span",{children:[r.patrol," Patrol"]})]})]})]}),b.jsxs("div",{className:"text-right",children:[b.jsx("p",{className:"text-xs text-slate-400 uppercase font-semibold tracking-wide",children:"Progress Report"}),b.jsx("p",{className:"text-sm text-white mt-1",children:G}),b.jsxs("p",{className:"text-xs text-slate-400 mt-0.5",children:["Leader: ",b.jsx("span",{className:"text-white",children:e.fullName||e.email})]})]})]})}),b.jsxs("div",{children:[b.jsx("h2",{className:"text-sm font-bold uppercase tracking-widest text-slate-400 mb-3",children:"Summary"}),b.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[b.jsxs("div",{className:"bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center",children:[b.jsxs("p",{className:"text-3xl font-black text-emerald-400",children:[Ee,"%"]}),b.jsx("p",{className:"text-xs text-slate-400 mt-1",children:"Rank Progress"})]}),b.jsxs("div",{className:"bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center",children:[b.jsx("p",{className:"text-3xl font-black text-white",children:pe}),b.jsxs("p",{className:"text-xs text-slate-400 mt-1",children:["of ",me," Requirements"]})]}),b.jsxs("div",{className:"bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-center",children:[b.jsx("p",{className:"text-3xl font-black text-amber-400",children:Be}),b.jsx("p",{className:"text-xs text-slate-400 mt-1",children:"Merit Badges Earned"})]})]}),b.jsx("div",{className:"mt-4 w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700",children:b.jsx("div",{className:"bg-emerald-500 h-full rounded-full transition-all duration-500",style:{width:`${Ee}%`}})})]}),b.jsxs("div",{children:[b.jsx("h2",{className:"text-sm font-bold uppercase tracking-widest text-slate-400 mb-3",children:"Requirement Breakdown"}),U?b.jsx("p",{className:"text-slate-400 text-sm",children:"Loading requirements…"}):b.jsx("div",{className:"space-y-4",children:Object.entries(A).map(([I,P])=>b.jsxs("div",{children:[b.jsx("h3",{className:"text-xs font-bold uppercase text-slate-300 bg-slate-900/60 border border-slate-700 rounded-t-lg px-3 py-2",children:I}),b.jsxs("table",{className:"w-full text-sm border border-t-0 border-slate-700 rounded-b-lg overflow-hidden",children:[b.jsx("thead",{children:b.jsxs("tr",{className:"bg-slate-900/40 text-left text-xs text-slate-400",children:[b.jsx("th",{className:"px-3 py-2 w-10",children:"#"}),b.jsx("th",{className:"px-3 py-2",children:"Requirement"}),b.jsx("th",{className:"px-3 py-2 w-28 text-center",children:"Status"}),b.jsx("th",{className:"px-3 py-2 w-36",children:"Date Completed"})]})}),b.jsx("tbody",{children:P.map((x,V)=>{var Z;const R=((Z=x.completedBy)==null?void 0:Z.includes(r.uid))||!!l[x.id],$e=l[x.id],_t=$e!=null&&$e.completedAt?new Date($e.completedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):null,Fe=`${(I.charAt(0)||"R").toUpperCase()}${V+1}`;return b.jsxs("tr",{className:`border-t border-slate-700/50 ${R?"bg-emerald-950/10":"bg-slate-800/30"}`,children:[b.jsx("td",{className:"px-3 py-2 text-slate-400 font-mono text-xs",children:Fe}),b.jsxs("td",{className:"px-3 py-2",children:[b.jsx("p",{className:`font-medium ${R?"text-slate-400 line-through":"text-white"}`,children:x.title}),x.description&&b.jsx("p",{className:"text-xs text-slate-500 mt-0.5",children:x.description})]}),b.jsx("td",{className:"px-3 py-2 text-center",children:R?b.jsx("span",{className:"inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30",children:"Complete"}):b.jsx("span",{className:"inline-block px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 text-xs font-semibold border border-slate-600/30",children:"Pending"})}),b.jsx("td",{className:"px-3 py-2 text-slate-400 text-xs",children:_t||(R?"—":"")})]},x.id)})})]})]},I))})]}),b.jsxs("div",{children:[b.jsxs("h2",{className:"text-sm font-bold uppercase tracking-widest text-slate-400 mb-3",children:["Leader Notes",b.jsx("span",{className:"ml-2 text-[10px] font-normal normal-case text-slate-600 border border-slate-700 rounded px-1.5 py-0.5",children:"Private — visible to leaders only"})]}),b.jsxs("div",{className:"border border-slate-600 rounded-xl overflow-hidden",children:[b.jsx("textarea",{value:f,onChange:I=>g(I.target.value),rows:5,placeholder:"Add discussion points, observations, or goals for the parent conference…",className:"print-hide w-full bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none resize-none"}),b.jsx("div",{className:"print-only bg-slate-900/30 px-4 py-3 min-h-[6rem] text-sm text-slate-200 whitespace-pre-wrap",children:_||b.jsx("span",{className:"text-slate-500 italic",children:"No notes recorded."})}),b.jsxs("div",{className:"print-hide flex items-center justify-between bg-slate-900/40 px-4 py-2 border-t border-slate-700/50",children:[T&&b.jsx("span",{className:"text-xs text-emerald-400 font-semibold",children:"Notes saved!"}),b.jsx("div",{className:"ml-auto",children:b.jsxs("button",{onClick:q,disabled:f===_,className:"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition cursor-pointer",children:[b.jsx(fC,{size:12}),"Save Notes"]})})]})]})]})]})]})}function yC({currentUser:r}){const[e,t]=Se.useState([]),[s,o]=Se.useState(null),[l,h]=Se.useState(!0);return Se.useEffect(()=>{const f=nl(hs(Un,"users"),g=>{const E=g.docs.map(T=>({uid:T.id,...T.data()})).filter(T=>T.role!=="leader");t(E),h(!1)});return()=>f()},[]),s?b.jsx(gC,{scout:s,currentUser:r,onBack:()=>o(null)}):b.jsxs("div",{className:"space-y-4",children:[b.jsxs("div",{className:"bg-slate-800 border border-slate-700 rounded-2xl p-6",children:[b.jsxs("h2",{className:"text-lg font-bold text-white flex items-center gap-2 mb-1",children:[b.jsx(mC,{className:"text-emerald-400",size:22}),"Scout Roster"]}),b.jsx("p",{className:"text-xs text-slate-400",children:"Select a scout to view their progress report and print for parent conferences."})]}),l?b.jsx("div",{className:"text-center py-10 text-slate-400 text-sm",children:"Loading scouts…"}):e.length===0?b.jsxs("div",{className:"text-center py-10 text-slate-400 text-sm bg-slate-800/40 rounded-xl border border-slate-800",children:["No scouts found. Make sure scout accounts exist in the"," ",b.jsx("span",{className:"font-mono text-xs text-slate-300",children:"users"})," Firestore collection with ",b.jsx("span",{className:"font-mono text-xs text-slate-300",children:'role: "member"'}),"."]}):b.jsx("div",{className:"space-y-2",children:e.map(f=>b.jsxs("button",{onClick:()=>o(f),className:"w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 text-left transition cursor-pointer group",children:[b.jsxs("div",{children:[b.jsx("p",{className:"font-semibold text-white group-hover:text-emerald-300 transition",children:f.fullName||f.email}),b.jsxs("p",{className:"text-xs text-slate-400 mt-0.5",children:[f.rank&&b.jsx("span",{className:"mr-2 text-emerald-400 font-medium",children:f.rank}),f.patrol&&b.jsxs("span",{children:[f.patrol," Patrol"]})]})]}),b.jsx(uC,{size:18,className:"text-slate-500 group-hover:text-emerald-400 transition"})]},f.uid))})]})}function _C(){var h;const[r,e]=Se.useState(null),[t,s]=Se.useState("advancement"),o=async()=>{await TI(I0),e(null)};if(!r)return b.jsx(YR,{onUserAuthenticated:f=>e(f)});const l=r.role==="leader"||((h=r.email)==null?void 0:h.includes("neoissa"));return b.jsxs("div",{className:"min-h-screen bg-slate-900 text-white flex flex-col font-sans",children:[b.jsxs("header",{className:"bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-50 flex justify-between items-center",children:[b.jsxs("div",{children:[b.jsx("h1",{className:"text-xl font-bold text-emerald-400",children:"Taliʿa Patrol Portal"}),b.jsxs("p",{className:"text-xs text-slate-400",children:["Logged in as ",b.jsx("span",{className:"text-white font-semibold",children:r.fullName||r.email}),b.jsx("span",{className:"ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-bold border border-emerald-500/30",children:l?"Leader":"Member"})]})]}),b.jsx("button",{onClick:o,className:"bg-slate-700 hover:bg-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer",children:"Sign Out"})]}),b.jsx("div",{className:"bg-slate-800/40 border-b border-slate-700/60 px-6",children:b.jsxs("div",{className:"max-w-4xl mx-auto flex gap-6",children:[b.jsx("button",{onClick:()=>s("advancement"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="advancement"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Advancement Tracker"}),b.jsx("button",{onClick:()=>s("chat"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="chat"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Patrol Stream"}),l&&b.jsx("button",{onClick:()=>s("scouts"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="scouts"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Scout Progress"}),l&&b.jsx("button",{onClick:()=>s("admin"),className:`py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${t==="admin"?"border-emerald-500 text-emerald-400":"border-transparent text-slate-400 hover:text-slate-200"}`,children:"Add Requirements"})]})}),b.jsxs("main",{className:"flex-1 p-6 max-w-4xl mx-auto w-full",children:[t==="advancement"&&b.jsx(XR,{currentUser:r}),t==="chat"&&b.jsx(JR,{currentUser:r}),t==="scouts"&&l&&b.jsx(yC,{currentUser:r}),t==="admin"&&l&&b.jsx(ZR,{})]})]})}Fw.createRoot(document.getElementById("root")).render(b.jsx(Nw.StrictMode,{children:b.jsx(_C,{})}));
