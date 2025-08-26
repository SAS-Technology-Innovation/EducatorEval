import{r as fe,a as xl,g as Tp,R as wp}from"./client.CcI2PaBY.js";var Ir=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(n){return this.listeners.add(n),this.onSubscribe(),()=>{this.listeners.delete(n),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},zt=typeof window>"u"||"Deno"in globalThis;function Se(){}function Ap(n,e){return typeof n=="function"?n(e):n}function to(n){return typeof n=="number"&&n>=0&&n!==1/0}function Fl(n,e){return Math.max(n+(e||0)-Date.now(),0)}function wt(n,e){return typeof n=="function"?n(e):n}function Me(n,e){return typeof n=="function"?n(e):n}function jc(n,e){const{type:t="all",exact:r,fetchStatus:s,predicate:i,queryKey:a,stale:c}=n;if(a){if(r){if(e.queryHash!==Oo(a,e.options))return!1}else if(!ar(e.queryKey,a))return!1}if(t!=="all"){const u=e.isActive();if(t==="active"&&!u||t==="inactive"&&u)return!1}return!(typeof c=="boolean"&&e.isStale()!==c||s&&s!==e.state.fetchStatus||i&&!i(e))}function $c(n,e){const{exact:t,status:r,predicate:s,mutationKey:i}=n;if(i){if(!e.options.mutationKey)return!1;if(t){if(or(e.options.mutationKey)!==or(i))return!1}else if(!ar(e.options.mutationKey,i))return!1}return!(r&&e.state.status!==r||s&&!s(e))}function Oo(n,e){return(e?.queryKeyHashFn||or)(n)}function or(n){return JSON.stringify(n,(e,t)=>ro(t)?Object.keys(t).sort().reduce((r,s)=>(r[s]=t[s],r),{}):t)}function ar(n,e){return n===e?!0:typeof n!=typeof e?!1:n&&e&&typeof n=="object"&&typeof e=="object"?Object.keys(e).every(t=>ar(n[t],e[t])):!1}function Ul(n,e){if(n===e)return n;const t=zc(n)&&zc(e);if(t||ro(n)&&ro(e)){const r=t?n:Object.keys(n),s=r.length,i=t?e:Object.keys(e),a=i.length,c=t?[]:{},u=new Set(r);let d=0;for(let f=0;f<a;f++){const m=t?f:i[f];(!t&&u.has(m)||t)&&n[m]===void 0&&e[m]===void 0?(c[m]=void 0,d++):(c[m]=Ul(n[m],e[m]),c[m]===n[m]&&n[m]!==void 0&&d++)}return s===a&&d===s?n:c}return e}function no(n,e){if(!e||Object.keys(n).length!==Object.keys(e).length)return!1;for(const t in n)if(n[t]!==e[t])return!1;return!0}function zc(n){return Array.isArray(n)&&n.length===Object.keys(n).length}function ro(n){if(!Hc(n))return!1;const e=n.constructor;if(e===void 0)return!0;const t=e.prototype;return!(!Hc(t)||!t.hasOwnProperty("isPrototypeOf")||Object.getPrototypeOf(n)!==Object.prototype)}function Hc(n){return Object.prototype.toString.call(n)==="[object Object]"}function Rp(n){return new Promise(e=>{setTimeout(e,n)})}function so(n,e,t){return typeof t.structuralSharing=="function"?t.structuralSharing(n,e):t.structuralSharing!==!1?Ul(n,e):e}function bp(n,e,t=0){const r=[...n,e];return t&&r.length>t?r.slice(1):r}function Sp(n,e,t=0){const r=[e,...n];return t&&r.length>t?r.slice(0,-1):r}var No=Symbol();function Bl(n,e){return!n.queryFn&&e?.initialPromise?()=>e.initialPromise:!n.queryFn||n.queryFn===No?()=>Promise.reject(new Error(`Missing queryFn: '${n.queryHash}'`)):n.queryFn}function Pp(n,e){return typeof n=="function"?n(...e):!!n}var Cp=class extends Ir{#t;#e;#n;constructor(){super(),this.#n=n=>{if(!zt&&window.addEventListener){const e=()=>n();return window.addEventListener("visibilitychange",e,!1),()=>{window.removeEventListener("visibilitychange",e)}}}}onSubscribe(){this.#e||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(n){this.#n=n,this.#e?.(),this.#e=n(e=>{typeof e=="boolean"?this.setFocused(e):this.onFocus()})}setFocused(n){this.#t!==n&&(this.#t=n,this.onFocus())}onFocus(){const n=this.isFocused();this.listeners.forEach(e=>{e(n)})}isFocused(){return typeof this.#t=="boolean"?this.#t:globalThis.document?.visibilityState!=="hidden"}},Vo=new Cp,kp=class extends Ir{#t=!0;#e;#n;constructor(){super(),this.#n=n=>{if(!zt&&window.addEventListener){const e=()=>n(!0),t=()=>n(!1);return window.addEventListener("online",e,!1),window.addEventListener("offline",t,!1),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",t)}}}}onSubscribe(){this.#e||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#e?.(),this.#e=void 0)}setEventListener(n){this.#n=n,this.#e?.(),this.#e=n(this.setOnline.bind(this))}setOnline(n){this.#t!==n&&(this.#t=n,this.listeners.forEach(t=>{t(n)}))}isOnline(){return this.#t}},ms=new kp;function io(){let n,e;const t=new Promise((s,i)=>{n=s,e=i});t.status="pending",t.catch(()=>{});function r(s){Object.assign(t,s),delete t.resolve,delete t.reject}return t.resolve=s=>{r({status:"fulfilled",value:s}),n(s)},t.reject=s=>{r({status:"rejected",reason:s}),e(s)},t}function Dp(n){return Math.min(1e3*2**n,3e4)}function ql(n){return(n??"online")==="online"?ms.isOnline():!0}var jl=class extends Error{constructor(n){super("CancelledError"),this.revert=n?.revert,this.silent=n?.silent}};function $l(n){let e=!1,t=0,r;const s=io(),i=()=>s.status!=="pending",a=k=>{i()||(y(new jl(k)),n.abort?.())},c=()=>{e=!0},u=()=>{e=!1},d=()=>Vo.isFocused()&&(n.networkMode==="always"||ms.isOnline())&&n.canRun(),f=()=>ql(n.networkMode)&&n.canRun(),m=k=>{i()||(r?.(),s.resolve(k))},y=k=>{i()||(r?.(),s.reject(k))},R=()=>new Promise(k=>{r=C=>{(i()||d())&&k(C)},n.onPause?.()}).then(()=>{r=void 0,i()||n.onContinue?.()}),S=()=>{if(i())return;let k;const C=t===0?n.initialPromise:void 0;try{k=C??n.fn()}catch(M){k=Promise.reject(M)}Promise.resolve(k).then(m).catch(M=>{if(i())return;const F=n.retry??(zt?0:3),x=n.retryDelay??Dp,B=typeof x=="function"?x(t,M):x,J=F===!0||typeof F=="number"&&t<F||typeof F=="function"&&F(t,M);if(e||!J){y(M);return}t++,n.onFail?.(t,M),Rp(B).then(()=>d()?void 0:R()).then(()=>{e?y(M):S()})})};return{promise:s,status:()=>s.status,cancel:a,continue:()=>(r?.(),s),cancelRetry:c,continueRetry:u,canStart:f,start:()=>(f()?S():R().then(S),s)}}var Op=n=>setTimeout(n,0);function Np(){let n=[],e=0,t=c=>{c()},r=c=>{c()},s=Op;const i=c=>{e?n.push(c):s(()=>{t(c)})},a=()=>{const c=n;n=[],c.length&&s(()=>{r(()=>{c.forEach(u=>{t(u)})})})};return{batch:c=>{let u;e++;try{u=c()}finally{e--,e||a()}return u},batchCalls:c=>(...u)=>{i(()=>{c(...u)})},schedule:i,setNotifyFunction:c=>{t=c},setBatchNotifyFunction:c=>{r=c},setScheduler:c=>{s=c}}}var he=Np(),zl=class{#t;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),to(this.gcTime)&&(this.#t=setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(n){this.gcTime=Math.max(this.gcTime||0,n??(zt?1/0:300*1e3))}clearGcTimeout(){this.#t&&(clearTimeout(this.#t),this.#t=void 0)}},Vp=class extends zl{#t;#e;#n;#r;#s;#a;#o;constructor(e){super(),this.#o=!1,this.#a=e.defaultOptions,this.setOptions(e.options),this.observers=[],this.#r=e.client,this.#n=this.#r.getQueryCache(),this.queryKey=e.queryKey,this.queryHash=e.queryHash,this.#t=Mp(this.options),this.state=e.state??this.#t,this.scheduleGc()}get meta(){return this.options.meta}get promise(){return this.#s?.promise}setOptions(e){this.options={...this.#a,...e},this.updateGcTime(this.options.gcTime)}optionalRemove(){!this.observers.length&&this.state.fetchStatus==="idle"&&this.#n.remove(this)}setData(e,t){const r=so(this.state.data,e,this.options);return this.#i({data:r,type:"success",dataUpdatedAt:t?.updatedAt,manual:t?.manual}),r}setState(e,t){this.#i({type:"setState",state:e,setStateOptions:t})}cancel(e){const t=this.#s?.promise;return this.#s?.cancel(e),t?t.then(Se).catch(Se):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(this.#t)}isActive(){return this.observers.some(e=>Me(e.options.enabled,this)!==!1)}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===No||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStatic(){return this.getObserversCount()>0?this.observers.some(e=>wt(e.options.staleTime,this)==="static"):!1}isStale(){return this.getObserversCount()>0?this.observers.some(e=>e.getCurrentResult().isStale):this.state.data===void 0||this.state.isInvalidated}isStaleByTime(e=0){return this.state.data===void 0?!0:e==="static"?!1:this.state.isInvalidated?!0:!Fl(this.state.dataUpdatedAt,e)}onFocus(){this.observers.find(t=>t.shouldFetchOnWindowFocus())?.refetch({cancelRefetch:!1}),this.#s?.continue()}onOnline(){this.observers.find(t=>t.shouldFetchOnReconnect())?.refetch({cancelRefetch:!1}),this.#s?.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),this.#n.notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter(t=>t!==e),this.observers.length||(this.#s&&(this.#o?this.#s.cancel({revert:!0}):this.#s.cancelRetry()),this.scheduleGc()),this.#n.notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||this.#i({type:"invalidate"})}async fetch(e,t){if(this.state.fetchStatus!=="idle"&&this.#s?.status()!=="rejected"){if(this.state.data!==void 0&&t?.cancelRefetch)this.cancel({silent:!0});else if(this.#s)return this.#s.continueRetry(),this.#s.promise}if(e&&this.setOptions(e),!this.options.queryFn){const u=this.observers.find(d=>d.options.queryFn);u&&this.setOptions(u.options)}const r=new AbortController,s=u=>{Object.defineProperty(u,"signal",{enumerable:!0,get:()=>(this.#o=!0,r.signal)})},i=()=>{const u=Bl(this.options,t),f=(()=>{const m={client:this.#r,queryKey:this.queryKey,meta:this.meta};return s(m),m})();return this.#o=!1,this.options.persister?this.options.persister(u,f,this):u(f)},c=(()=>{const u={fetchOptions:t,options:this.options,queryKey:this.queryKey,client:this.#r,state:this.state,fetchFn:i};return s(u),u})();this.options.behavior?.onFetch(c,this),this.#e=this.state,(this.state.fetchStatus==="idle"||this.state.fetchMeta!==c.fetchOptions?.meta)&&this.#i({type:"fetch",meta:c.fetchOptions?.meta}),this.#s=$l({initialPromise:t?.initialPromise,fn:c.fetchFn,abort:r.abort.bind(r),onFail:(u,d)=>{this.#i({type:"failed",failureCount:u,error:d})},onPause:()=>{this.#i({type:"pause"})},onContinue:()=>{this.#i({type:"continue"})},retry:c.options.retry,retryDelay:c.options.retryDelay,networkMode:c.options.networkMode,canRun:()=>!0});try{const u=await this.#s.start();if(u===void 0)throw new Error(`${this.queryHash} data is undefined`);return this.setData(u),this.#n.config.onSuccess?.(u,this),this.#n.config.onSettled?.(u,this.state.error,this),u}catch(u){if(u instanceof jl){if(u.silent)return this.#s.promise;if(u.revert){if(this.setState({...this.#e,fetchStatus:"idle"}),this.state.data===void 0)throw u;return this.state.data}}throw this.#i({type:"error",error:u}),this.#n.config.onError?.(u,this),this.#n.config.onSettled?.(this.state.data,u,this),u}finally{this.scheduleGc()}}#i(e){const t=r=>{switch(e.type){case"failed":return{...r,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...r,fetchStatus:"paused"};case"continue":return{...r,fetchStatus:"fetching"};case"fetch":return{...r,...Hl(r.data,this.options),fetchMeta:e.meta??null};case"success":const s={...r,data:e.data,dataUpdateCount:r.dataUpdateCount+1,dataUpdatedAt:e.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#e=e.manual?s:void 0,s;case"error":const i=e.error;return{...r,error:i,errorUpdateCount:r.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:r.fetchFailureCount+1,fetchFailureReason:i,fetchStatus:"idle",status:"error"};case"invalidate":return{...r,isInvalidated:!0};case"setState":return{...r,...e.state}}};this.state=t(this.state),he.batch(()=>{this.observers.forEach(r=>{r.onQueryUpdate()}),this.#n.notify({query:this,type:"updated",action:e})})}};function Hl(n,e){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:ql(e.networkMode)?"fetching":"paused",...n===void 0&&{error:null,status:"pending"}}}function Mp(n){const e=typeof n.initialData=="function"?n.initialData():n.initialData,t=e!==void 0,r=t?typeof n.initialDataUpdatedAt=="function"?n.initialDataUpdatedAt():n.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:t?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:t?"success":"pending",fetchStatus:"idle"}}var Lp=class extends Ir{constructor(n={}){super(),this.config=n,this.#t=new Map}#t;build(n,e,t){const r=e.queryKey,s=e.queryHash??Oo(r,e);let i=this.get(s);return i||(i=new Vp({client:n,queryKey:r,queryHash:s,options:n.defaultQueryOptions(e),state:t,defaultOptions:n.getQueryDefaults(r)}),this.add(i)),i}add(n){this.#t.has(n.queryHash)||(this.#t.set(n.queryHash,n),this.notify({type:"added",query:n}))}remove(n){const e=this.#t.get(n.queryHash);e&&(n.destroy(),e===n&&this.#t.delete(n.queryHash),this.notify({type:"removed",query:n}))}clear(){he.batch(()=>{this.getAll().forEach(n=>{this.remove(n)})})}get(n){return this.#t.get(n)}getAll(){return[...this.#t.values()]}find(n){const e={exact:!0,...n};return this.getAll().find(t=>jc(e,t))}findAll(n={}){const e=this.getAll();return Object.keys(n).length>0?e.filter(t=>jc(n,t)):e}notify(n){he.batch(()=>{this.listeners.forEach(e=>{e(n)})})}onFocus(){he.batch(()=>{this.getAll().forEach(n=>{n.onFocus()})})}onOnline(){he.batch(()=>{this.getAll().forEach(n=>{n.onOnline()})})}},xp=class extends zl{#t;#e;#n;constructor(e){super(),this.mutationId=e.mutationId,this.#e=e.mutationCache,this.#t=[],this.state=e.state||Fp(),this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){this.#t.includes(e)||(this.#t.push(e),this.clearGcTimeout(),this.#e.notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){this.#t=this.#t.filter(t=>t!==e),this.scheduleGc(),this.#e.notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){this.#t.length||(this.state.status==="pending"?this.scheduleGc():this.#e.remove(this))}continue(){return this.#n?.continue()??this.execute(this.state.variables)}async execute(e){const t=()=>{this.#r({type:"continue"})};this.#n=$l({fn:()=>this.options.mutationFn?this.options.mutationFn(e):Promise.reject(new Error("No mutationFn found")),onFail:(i,a)=>{this.#r({type:"failed",failureCount:i,error:a})},onPause:()=>{this.#r({type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#e.canRun(this)});const r=this.state.status==="pending",s=!this.#n.canStart();try{if(r)t();else{this.#r({type:"pending",variables:e,isPaused:s}),await this.#e.config.onMutate?.(e,this);const a=await this.options.onMutate?.(e);a!==this.state.context&&this.#r({type:"pending",context:a,variables:e,isPaused:s})}const i=await this.#n.start();return await this.#e.config.onSuccess?.(i,e,this.state.context,this),await this.options.onSuccess?.(i,e,this.state.context),await this.#e.config.onSettled?.(i,null,this.state.variables,this.state.context,this),await this.options.onSettled?.(i,null,e,this.state.context),this.#r({type:"success",data:i}),i}catch(i){try{throw await this.#e.config.onError?.(i,e,this.state.context,this),await this.options.onError?.(i,e,this.state.context),await this.#e.config.onSettled?.(void 0,i,this.state.variables,this.state.context,this),await this.options.onSettled?.(void 0,i,e,this.state.context),i}finally{this.#r({type:"error",error:i})}}finally{this.#e.runNext(this)}}#r(e){const t=r=>{switch(e.type){case"failed":return{...r,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...r,isPaused:!0};case"continue":return{...r,isPaused:!1};case"pending":return{...r,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...r,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...r,data:void 0,error:e.error,failureCount:r.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}};this.state=t(this.state),he.batch(()=>{this.#t.forEach(r=>{r.onMutationUpdate(e)}),this.#e.notify({mutation:this,type:"updated",action:e})})}};function Fp(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}var Up=class extends Ir{constructor(n={}){super(),this.config=n,this.#t=new Set,this.#e=new Map,this.#n=0}#t;#e;#n;build(n,e,t){const r=new xp({mutationCache:this,mutationId:++this.#n,options:n.defaultMutationOptions(e),state:t});return this.add(r),r}add(n){this.#t.add(n);const e=Zr(n);if(typeof e=="string"){const t=this.#e.get(e);t?t.push(n):this.#e.set(e,[n])}this.notify({type:"added",mutation:n})}remove(n){if(this.#t.delete(n)){const e=Zr(n);if(typeof e=="string"){const t=this.#e.get(e);if(t)if(t.length>1){const r=t.indexOf(n);r!==-1&&t.splice(r,1)}else t[0]===n&&this.#e.delete(e)}}this.notify({type:"removed",mutation:n})}canRun(n){const e=Zr(n);if(typeof e=="string"){const r=this.#e.get(e)?.find(s=>s.state.status==="pending");return!r||r===n}else return!0}runNext(n){const e=Zr(n);return typeof e=="string"?this.#e.get(e)?.find(r=>r!==n&&r.state.isPaused)?.continue()??Promise.resolve():Promise.resolve()}clear(){he.batch(()=>{this.#t.forEach(n=>{this.notify({type:"removed",mutation:n})}),this.#t.clear(),this.#e.clear()})}getAll(){return Array.from(this.#t)}find(n){const e={exact:!0,...n};return this.getAll().find(t=>$c(e,t))}findAll(n={}){return this.getAll().filter(e=>$c(n,e))}notify(n){he.batch(()=>{this.listeners.forEach(e=>{e(n)})})}resumePausedMutations(){const n=this.getAll().filter(e=>e.state.isPaused);return he.batch(()=>Promise.all(n.map(e=>e.continue().catch(Se))))}};function Zr(n){return n.options.scope?.id}function Wc(n){return{onFetch:(e,t)=>{const r=e.options,s=e.fetchOptions?.meta?.fetchMore?.direction,i=e.state.data?.pages||[],a=e.state.data?.pageParams||[];let c={pages:[],pageParams:[]},u=0;const d=async()=>{let f=!1;const m=S=>{Object.defineProperty(S,"signal",{enumerable:!0,get:()=>(e.signal.aborted?f=!0:e.signal.addEventListener("abort",()=>{f=!0}),e.signal)})},y=Bl(e.options,e.fetchOptions),R=async(S,k,C)=>{if(f)return Promise.reject();if(k==null&&S.pages.length)return Promise.resolve(S);const F=(()=>{const z={client:e.client,queryKey:e.queryKey,pageParam:k,direction:C?"backward":"forward",meta:e.options.meta};return m(z),z})(),x=await y(F),{maxPages:B}=e.options,J=C?Sp:bp;return{pages:J(S.pages,x,B),pageParams:J(S.pageParams,k,B)}};if(s&&i.length){const S=s==="backward",k=S?Bp:Kc,C={pages:i,pageParams:a},M=k(r,C);c=await R(C,M,S)}else{const S=n??i.length;do{const k=u===0?a[0]??r.initialPageParam:Kc(r,c);if(u>0&&k==null)break;c=await R(c,k),u++}while(u<S)}return c};e.options.persister?e.fetchFn=()=>e.options.persister?.(d,{client:e.client,queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},t):e.fetchFn=d}}}function Kc(n,{pages:e,pageParams:t}){const r=e.length-1;return e.length>0?n.getNextPageParam(e[r],e,t[r],t):void 0}function Bp(n,{pages:e,pageParams:t}){return e.length>0?n.getPreviousPageParam?.(e[0],e,t[0],t):void 0}var vA=class{#t;#e;#n;#r;#s;#a;#o;#i;constructor(n={}){this.#t=n.queryCache||new Lp,this.#e=n.mutationCache||new Up,this.#n=n.defaultOptions||{},this.#r=new Map,this.#s=new Map,this.#a=0}mount(){this.#a++,this.#a===1&&(this.#o=Vo.subscribe(async n=>{n&&(await this.resumePausedMutations(),this.#t.onFocus())}),this.#i=ms.subscribe(async n=>{n&&(await this.resumePausedMutations(),this.#t.onOnline())}))}unmount(){this.#a--,this.#a===0&&(this.#o?.(),this.#o=void 0,this.#i?.(),this.#i=void 0)}isFetching(n){return this.#t.findAll({...n,fetchStatus:"fetching"}).length}isMutating(n){return this.#e.findAll({...n,status:"pending"}).length}getQueryData(n){const e=this.defaultQueryOptions({queryKey:n});return this.#t.get(e.queryHash)?.state.data}ensureQueryData(n){const e=this.defaultQueryOptions(n),t=this.#t.build(this,e),r=t.state.data;return r===void 0?this.fetchQuery(n):(n.revalidateIfStale&&t.isStaleByTime(wt(e.staleTime,t))&&this.prefetchQuery(e),Promise.resolve(r))}getQueriesData(n){return this.#t.findAll(n).map(({queryKey:e,state:t})=>{const r=t.data;return[e,r]})}setQueryData(n,e,t){const r=this.defaultQueryOptions({queryKey:n}),i=this.#t.get(r.queryHash)?.state.data,a=Ap(e,i);if(a!==void 0)return this.#t.build(this,r).setData(a,{...t,manual:!0})}setQueriesData(n,e,t){return he.batch(()=>this.#t.findAll(n).map(({queryKey:r})=>[r,this.setQueryData(r,e,t)]))}getQueryState(n){const e=this.defaultQueryOptions({queryKey:n});return this.#t.get(e.queryHash)?.state}removeQueries(n){const e=this.#t;he.batch(()=>{e.findAll(n).forEach(t=>{e.remove(t)})})}resetQueries(n,e){const t=this.#t;return he.batch(()=>(t.findAll(n).forEach(r=>{r.reset()}),this.refetchQueries({type:"active",...n},e)))}cancelQueries(n,e={}){const t={revert:!0,...e},r=he.batch(()=>this.#t.findAll(n).map(s=>s.cancel(t)));return Promise.all(r).then(Se).catch(Se)}invalidateQueries(n,e={}){return he.batch(()=>(this.#t.findAll(n).forEach(t=>{t.invalidate()}),n?.refetchType==="none"?Promise.resolve():this.refetchQueries({...n,type:n?.refetchType??n?.type??"active"},e)))}refetchQueries(n,e={}){const t={...e,cancelRefetch:e.cancelRefetch??!0},r=he.batch(()=>this.#t.findAll(n).filter(s=>!s.isDisabled()&&!s.isStatic()).map(s=>{let i=s.fetch(void 0,t);return t.throwOnError||(i=i.catch(Se)),s.state.fetchStatus==="paused"?Promise.resolve():i}));return Promise.all(r).then(Se)}fetchQuery(n){const e=this.defaultQueryOptions(n);e.retry===void 0&&(e.retry=!1);const t=this.#t.build(this,e);return t.isStaleByTime(wt(e.staleTime,t))?t.fetch(e):Promise.resolve(t.state.data)}prefetchQuery(n){return this.fetchQuery(n).then(Se).catch(Se)}fetchInfiniteQuery(n){return n.behavior=Wc(n.pages),this.fetchQuery(n)}prefetchInfiniteQuery(n){return this.fetchInfiniteQuery(n).then(Se).catch(Se)}ensureInfiniteQueryData(n){return n.behavior=Wc(n.pages),this.ensureQueryData(n)}resumePausedMutations(){return ms.isOnline()?this.#e.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#t}getMutationCache(){return this.#e}getDefaultOptions(){return this.#n}setDefaultOptions(n){this.#n=n}setQueryDefaults(n,e){this.#r.set(or(n),{queryKey:n,defaultOptions:e})}getQueryDefaults(n){const e=[...this.#r.values()],t={};return e.forEach(r=>{ar(n,r.queryKey)&&Object.assign(t,r.defaultOptions)}),t}setMutationDefaults(n,e){this.#s.set(or(n),{mutationKey:n,defaultOptions:e})}getMutationDefaults(n){const e=[...this.#s.values()],t={};return e.forEach(r=>{ar(n,r.mutationKey)&&Object.assign(t,r.defaultOptions)}),t}defaultQueryOptions(n){if(n._defaulted)return n;const e={...this.#n.queries,...this.getQueryDefaults(n.queryKey),...n,_defaulted:!0};return e.queryHash||(e.queryHash=Oo(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.queryFn===No&&(e.enabled=!1),e}defaultMutationOptions(n){return n?._defaulted?n:{...this.#n.mutations,...n?.mutationKey&&this.getMutationDefaults(n.mutationKey),...n,_defaulted:!0}}clear(){this.#t.clear(),this.#e.clear()}},qp=class extends Ir{constructor(n,e){super(),this.options=e,this.#t=n,this.#i=null,this.#o=io(),this.bindMethods(),this.setOptions(e)}#t;#e=void 0;#n=void 0;#r=void 0;#s;#a;#o;#i;#m;#d;#f;#u;#l;#c;#p=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(this.#e.addObserver(this),Gc(this.#e,this.options)?this.#h():this.updateResult(),this.#v())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return oo(this.#e,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return oo(this.#e,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#E(),this.#I(),this.#e.removeObserver(this)}setOptions(n){const e=this.options,t=this.#e;if(this.options=this.#t.defaultQueryOptions(n),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof Me(this.options.enabled,this.#e)!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#T(),this.#e.setOptions(this.options),e._defaulted&&!no(this.options,e)&&this.#t.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#e,observer:this});const r=this.hasListeners();r&&Qc(this.#e,t,this.options,e)&&this.#h(),this.updateResult(),r&&(this.#e!==t||Me(this.options.enabled,this.#e)!==Me(e.enabled,this.#e)||wt(this.options.staleTime,this.#e)!==wt(e.staleTime,this.#e))&&this.#g();const s=this.#_();r&&(this.#e!==t||Me(this.options.enabled,this.#e)!==Me(e.enabled,this.#e)||s!==this.#c)&&this.#y(s)}getOptimisticResult(n){const e=this.#t.getQueryCache().build(this.#t,n),t=this.createResult(e,n);return $p(this,t)&&(this.#r=t,this.#a=this.options,this.#s=this.#e.state),t}getCurrentResult(){return this.#r}trackResult(n,e){return new Proxy(n,{get:(t,r)=>(this.trackProp(r),e?.(r),r==="promise"&&!this.options.experimental_prefetchInRender&&this.#o.status==="pending"&&this.#o.reject(new Error("experimental_prefetchInRender feature flag is not enabled")),Reflect.get(t,r))})}trackProp(n){this.#p.add(n)}getCurrentQuery(){return this.#e}refetch({...n}={}){return this.fetch({...n})}fetchOptimistic(n){const e=this.#t.defaultQueryOptions(n),t=this.#t.getQueryCache().build(this.#t,e);return t.fetch().then(()=>this.createResult(t,e))}fetch(n){return this.#h({...n,cancelRefetch:n.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#r))}#h(n){this.#T();let e=this.#e.fetch(this.options,n);return n?.throwOnError||(e=e.catch(Se)),e}#g(){this.#E();const n=wt(this.options.staleTime,this.#e);if(zt||this.#r.isStale||!to(n))return;const t=Fl(this.#r.dataUpdatedAt,n)+1;this.#u=setTimeout(()=>{this.#r.isStale||this.updateResult()},t)}#_(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(this.#e):this.options.refetchInterval)??!1}#y(n){this.#I(),this.#c=n,!(zt||Me(this.options.enabled,this.#e)===!1||!to(this.#c)||this.#c===0)&&(this.#l=setInterval(()=>{(this.options.refetchIntervalInBackground||Vo.isFocused())&&this.#h()},this.#c))}#v(){this.#g(),this.#y(this.#_())}#E(){this.#u&&(clearTimeout(this.#u),this.#u=void 0)}#I(){this.#l&&(clearInterval(this.#l),this.#l=void 0)}createResult(n,e){const t=this.#e,r=this.options,s=this.#r,i=this.#s,a=this.#a,u=n!==t?n.state:this.#n,{state:d}=n;let f={...d},m=!1,y;if(e._optimisticResults){const g=this.hasListeners(),_=!g&&Gc(n,e),I=g&&Qc(n,t,e,r);(_||I)&&(f={...f,...Hl(d.data,n.options)}),e._optimisticResults==="isRestoring"&&(f.fetchStatus="idle")}let{error:R,errorUpdatedAt:S,status:k}=f;y=f.data;let C=!1;if(e.placeholderData!==void 0&&y===void 0&&k==="pending"){let g;s?.isPlaceholderData&&e.placeholderData===a?.placeholderData?(g=s.data,C=!0):g=typeof e.placeholderData=="function"?e.placeholderData(this.#f?.state.data,this.#f):e.placeholderData,g!==void 0&&(k="success",y=so(s?.data,g,e),m=!0)}if(e.select&&y!==void 0&&!C)if(s&&y===i?.data&&e.select===this.#m)y=this.#d;else try{this.#m=e.select,y=e.select(y),y=so(s?.data,y,e),this.#d=y,this.#i=null}catch(g){this.#i=g}this.#i&&(R=this.#i,y=this.#d,S=Date.now(),k="error");const M=f.fetchStatus==="fetching",F=k==="pending",x=k==="error",B=F&&M,J=y!==void 0,E={status:k,fetchStatus:f.fetchStatus,isPending:F,isSuccess:k==="success",isError:x,isInitialLoading:B,isLoading:B,data:y,dataUpdatedAt:f.dataUpdatedAt,error:R,errorUpdatedAt:S,failureCount:f.fetchFailureCount,failureReason:f.fetchFailureReason,errorUpdateCount:f.errorUpdateCount,isFetched:f.dataUpdateCount>0||f.errorUpdateCount>0,isFetchedAfterMount:f.dataUpdateCount>u.dataUpdateCount||f.errorUpdateCount>u.errorUpdateCount,isFetching:M,isRefetching:M&&!F,isLoadingError:x&&!J,isPaused:f.fetchStatus==="paused",isPlaceholderData:m,isRefetchError:x&&J,isStale:Mo(n,e),refetch:this.refetch,promise:this.#o,isEnabled:Me(e.enabled,n)!==!1};if(this.options.experimental_prefetchInRender){const g=T=>{E.status==="error"?T.reject(E.error):E.data!==void 0&&T.resolve(E.data)},_=()=>{const T=this.#o=E.promise=io();g(T)},I=this.#o;switch(I.status){case"pending":n.queryHash===t.queryHash&&g(I);break;case"fulfilled":(E.status==="error"||E.data!==I.value)&&_();break;case"rejected":(E.status!=="error"||E.error!==I.reason)&&_();break}}return E}updateResult(){const n=this.#r,e=this.createResult(this.#e,this.options);if(this.#s=this.#e.state,this.#a=this.options,this.#s.data!==void 0&&(this.#f=this.#e),no(e,n))return;this.#r=e;const t=()=>{if(!n)return!0;const{notifyOnChangeProps:r}=this.options,s=typeof r=="function"?r():r;if(s==="all"||!s&&!this.#p.size)return!0;const i=new Set(s??this.#p);return this.options.throwOnError&&i.add("error"),Object.keys(this.#r).some(a=>{const c=a;return this.#r[c]!==n[c]&&i.has(c)})};this.#w({listeners:t()})}#T(){const n=this.#t.getQueryCache().build(this.#t,this.options);if(n===this.#e)return;const e=this.#e;this.#e=n,this.#n=n.state,this.hasListeners()&&(e?.removeObserver(this),n.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#v()}#w(n){he.batch(()=>{n.listeners&&this.listeners.forEach(e=>{e(this.#r)}),this.#t.getQueryCache().notify({query:this.#e,type:"observerResultsUpdated"})})}};function jp(n,e){return Me(e.enabled,n)!==!1&&n.state.data===void 0&&!(n.state.status==="error"&&e.retryOnMount===!1)}function Gc(n,e){return jp(n,e)||n.state.data!==void 0&&oo(n,e,e.refetchOnMount)}function oo(n,e,t){if(Me(e.enabled,n)!==!1&&wt(e.staleTime,n)!=="static"){const r=typeof t=="function"?t(n):t;return r==="always"||r!==!1&&Mo(n,e)}return!1}function Qc(n,e,t,r){return(n!==e||Me(r.enabled,n)===!1)&&(!t.suspense||n.state.status!=="error")&&Mo(n,t)}function Mo(n,e){return Me(e.enabled,n)!==!1&&n.isStaleByTime(wt(e.staleTime,n))}function $p(n,e){return!no(n.getCurrentResult(),e)}var Vi={exports:{}},Wn={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yc;function zp(){if(Yc)return Wn;Yc=1;var n=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function t(r,s,i){var a=null;if(i!==void 0&&(a=""+i),s.key!==void 0&&(a=""+s.key),"key"in s){i={};for(var c in s)c!=="key"&&(i[c]=s[c])}else i=s;return s=i.ref,{$$typeof:n,type:r,key:a,ref:s!==void 0?s:null,props:i}}return Wn.Fragment=e,Wn.jsx=t,Wn.jsxs=t,Wn}var Jc;function Hp(){return Jc||(Jc=1,Vi.exports=zp()),Vi.exports}var Wp=Hp(),Wl=fe.createContext(void 0),Kp=n=>{const e=fe.useContext(Wl);if(!e)throw new Error("No QueryClient set, use QueryClientProvider to set one");return e},EA=({client:n,children:e})=>(fe.useEffect(()=>(n.mount(),()=>{n.unmount()}),[n]),Wp.jsx(Wl.Provider,{value:n,children:e})),Kl=fe.createContext(!1),Gp=()=>fe.useContext(Kl);Kl.Provider;function Qp(){let n=!1;return{clearReset:()=>{n=!1},reset:()=>{n=!0},isReset:()=>n}}var Yp=fe.createContext(Qp()),Jp=()=>fe.useContext(Yp),Xp=(n,e)=>{(n.suspense||n.throwOnError||n.experimental_prefetchInRender)&&(e.isReset()||(n.retryOnMount=!1))},Zp=n=>{fe.useEffect(()=>{n.clearReset()},[n])},em=({result:n,errorResetBoundary:e,throwOnError:t,query:r,suspense:s})=>n.isError&&!e.isReset()&&!n.isFetching&&r&&(s&&n.data===void 0||Pp(t,[n.error,r])),tm=n=>{if(n.suspense){const e=r=>r==="static"?r:Math.max(r??1e3,1e3),t=n.staleTime;n.staleTime=typeof t=="function"?(...r)=>e(t(...r)):e(t),typeof n.gcTime=="number"&&(n.gcTime=Math.max(n.gcTime,1e3))}},nm=(n,e)=>n.isLoading&&n.isFetching&&!e,rm=(n,e)=>n?.suspense&&e.isPending,Xc=(n,e,t)=>e.fetchOptimistic(n).catch(()=>{t.clearReset()});function sm(n,e,t){const r=Gp(),s=Jp(),i=Kp(),a=i.defaultQueryOptions(n);i.getDefaultOptions().queries?._experimental_beforeQuery?.(a),a._optimisticResults=r?"isRestoring":"optimistic",tm(a),Xp(a,s),Zp(s);const c=!i.getQueryCache().get(a.queryHash),[u]=fe.useState(()=>new e(i,a)),d=u.getOptimisticResult(a),f=!r&&n.subscribed!==!1;if(fe.useSyncExternalStore(fe.useCallback(m=>{const y=f?u.subscribe(he.batchCalls(m)):Se;return u.updateResult(),y},[u,f]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),fe.useEffect(()=>{u.setOptions(a)},[a,u]),rm(a,d))throw Xc(a,u,s);if(em({result:d,errorResetBoundary:s,throwOnError:a.throwOnError,query:i.getQueryCache().get(a.queryHash),suspense:a.suspense}))throw d.error;return i.getDefaultOptions().queries?._experimental_afterQuery?.(a,d),a.experimental_prefetchInRender&&!zt&&nm(d,r)&&(c?Xc(a,u,s):i.getQueryCache().get(a.queryHash)?.promise)?.catch(Se).finally(()=>{u.updateResult()}),a.notifyOnChangeProps?d:u.trackResult(d)}function Gl(n,e){return sm(n,qp)}const im={},Zc=n=>{let e;const t=new Set,r=(f,m)=>{const y=typeof f=="function"?f(e):f;if(!Object.is(y,e)){const R=e;e=m??(typeof y!="object"||y===null)?y:Object.assign({},e,y),t.forEach(S=>S(e,R))}},s=()=>e,u={setState:r,getState:s,getInitialState:()=>d,subscribe:f=>(t.add(f),()=>t.delete(f)),destroy:()=>{(im?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),t.clear()}},d=e=n(r,s,u);return u},om=n=>n?Zc(n):Zc;var Mi={exports:{}},Li={},xi={exports:{}},Fi={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eu;function am(){if(eu)return Fi;eu=1;var n=xl();function e(m,y){return m===y&&(m!==0||1/m===1/y)||m!==m&&y!==y}var t=typeof Object.is=="function"?Object.is:e,r=n.useState,s=n.useEffect,i=n.useLayoutEffect,a=n.useDebugValue;function c(m,y){var R=y(),S=r({inst:{value:R,getSnapshot:y}}),k=S[0].inst,C=S[1];return i(function(){k.value=R,k.getSnapshot=y,u(k)&&C({inst:k})},[m,R,y]),s(function(){return u(k)&&C({inst:k}),m(function(){u(k)&&C({inst:k})})},[m]),a(R),R}function u(m){var y=m.getSnapshot;m=m.value;try{var R=y();return!t(m,R)}catch{return!0}}function d(m,y){return y()}var f=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?d:c;return Fi.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:f,Fi}var tu;function cm(){return tu||(tu=1,xi.exports=am()),xi.exports}/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nu;function um(){if(nu)return Li;nu=1;var n=xl(),e=cm();function t(d,f){return d===f&&(d!==0||1/d===1/f)||d!==d&&f!==f}var r=typeof Object.is=="function"?Object.is:t,s=e.useSyncExternalStore,i=n.useRef,a=n.useEffect,c=n.useMemo,u=n.useDebugValue;return Li.useSyncExternalStoreWithSelector=function(d,f,m,y,R){var S=i(null);if(S.current===null){var k={hasValue:!1,value:null};S.current=k}else k=S.current;S=c(function(){function M(z){if(!F){if(F=!0,x=z,z=y(z),R!==void 0&&k.hasValue){var E=k.value;if(R(E,z))return B=E}return B=z}if(E=B,r(x,z))return E;var g=y(z);return R!==void 0&&R(E,g)?(x=z,E):(x=z,B=g)}var F=!1,x,B,J=m===void 0?null:m;return[function(){return M(f())},J===null?void 0:function(){return M(J())}]},[f,m,y,R]);var C=s(d,S[0],S[1]);return a(function(){k.hasValue=!0,k.value=C},[C]),u(C),C},Li}var ru;function lm(){return ru||(ru=1,Mi.exports=um()),Mi.exports}var hm=lm();const dm=Tp(hm),Ql={},{useDebugValue:fm}=wp,{useSyncExternalStoreWithSelector:pm}=dm;let su=!1;const mm=n=>n;function gm(n,e=mm,t){(Ql?"production":void 0)!=="production"&&t&&!su&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),su=!0);const r=pm(n.subscribe,n.getState,n.getServerState||n.getInitialState,e,t);return fm(r),r}const _m=n=>{(Ql?"production":void 0)!=="production"&&typeof n!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof n=="function"?om(n):n,t=(r,s)=>gm(e,r,s);return Object.assign(t,e),t},ym=n=>_m,vm=n=>(e,t,r)=>{const s=r.subscribe;return r.subscribe=(a,c,u)=>{let d=a;if(c){const f=u?.equalityFn||Object.is;let m=a(r.getState());d=y=>{const R=a(y);if(!f(m,R)){const S=m;c(m=R,S)}},u?.fireImmediately&&c(m,m)}return s(d)},n(e,t,r)},Em=vm;var iu={};/**
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
 */const Yl=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Im=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Jl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,c=a?n[s+1]:0,u=s+2<n.length,d=u?n[s+2]:0,f=i>>2,m=(i&3)<<4|c>>4;let y=(c&15)<<2|d>>6,R=d&63;u||(R=64,a||(y=64)),r.push(t[f],t[m],t[y],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Yl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Im(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||d==null||m==null)throw new Tm;const y=i<<2|c>>4;if(r.push(y),d!==64){const R=c<<4&240|d>>2;if(r.push(R),m!==64){const S=d<<6&192|m;r.push(S)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Tm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wm=function(n){const e=Yl(n);return Jl.encodeByteArray(e,!0)},gs=function(n){return wm(n).replace(/\./g,"")},Xl=function(n){try{return Jl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Am(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Rm=()=>Am().__FIREBASE_DEFAULTS__,bm=()=>{if(typeof process>"u"||typeof iu>"u")return;const n=iu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Sm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Xl(n[1]);return e&&JSON.parse(e)},Ls=()=>{try{return Rm()||bm()||Sm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Zl=n=>{var e,t;return(t=(e=Ls())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},eh=n=>{const e=Zl(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},th=()=>{var n;return(n=Ls())===null||n===void 0?void 0:n.config},nh=n=>{var e;return(e=Ls())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class Pm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function rh(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[gs(JSON.stringify(t)),gs(JSON.stringify(a)),""].join(".")}/**
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
 */function we(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Cm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(we())}function km(){var n;const e=(n=Ls())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Dm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function sh(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Om(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Nm(){const n=we();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Vm(){return!km()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function ih(){try{return typeof indexedDB=="object"}catch{return!1}}function oh(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}function Mm(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const Lm="FirebaseError";class Fe extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Lm,Object.setPrototypeOf(this,Fe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Jt.prototype.create)}}class Jt{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?xm(i,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new Fe(s,c,r)}}function xm(n,e){return n.replace(Fm,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Fm=/\{\$([^}]+)}/g;function Um(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function cr(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(ou(i)&&ou(a)){if(!cr(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function ou(n){return n!==null&&typeof n=="object"}/**
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
 */function Tr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Gn(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Qn(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Bm(n,e){const t=new qm(n,e);return t.subscribe.bind(t)}class qm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");jm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Ui),s.error===void 0&&(s.error=Ui),s.complete===void 0&&(s.complete=Ui);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function jm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ui(){}/**
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
 */const $m=1e3,zm=2,Hm=14400*1e3,Wm=.5;function au(n,e=$m,t=zm){const r=e*Math.pow(t,n),s=Math.round(Wm*r*(Math.random()-.5)*2);return Math.min(Hm,r+s)}/**
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
 */function re(n){return n&&n._delegate?n._delegate:n}class xe{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Ut="[DEFAULT]";/**
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
 */class Km{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Pm;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e?.identifier),s=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Qm(e))try{this.getOrInitializeService({instanceIdentifier:Ut})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Ut){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ut){return this.instances.has(e)}getOptions(e=Ut){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Gm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ut){return this.component?this.component.multipleInstances?e:Ut:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Gm(n){return n===Ut?void 0:n}function Qm(n){return n.instantiationMode==="EAGER"}/**
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
 */class Ym{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Km(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var W;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(W||(W={}));const Jm={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},Xm=W.INFO,Zm={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},eg=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Zm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class xs{constructor(e){this.name=e,this._logLevel=Xm,this._logHandler=eg,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Jm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const tg=(n,e)=>e.some(t=>n instanceof t);let cu,uu;function ng(){return cu||(cu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function rg(){return uu||(uu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ah=new WeakMap,ao=new WeakMap,ch=new WeakMap,Bi=new WeakMap,Lo=new WeakMap;function sg(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(At(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&ah.set(t,n)}).catch(()=>{}),Lo.set(e,n),e}function ig(n){if(ao.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});ao.set(n,e)}let co={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return ao.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ch.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return At(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function og(n){co=n(co)}function ag(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(qi(this),e,...t);return ch.set(r,e.sort?e.sort():[e]),At(r)}:rg().includes(n)?function(...e){return n.apply(qi(this),e),At(ah.get(this))}:function(...e){return At(n.apply(qi(this),e))}}function cg(n){return typeof n=="function"?ag(n):(n instanceof IDBTransaction&&ig(n),tg(n,ng())?new Proxy(n,co):n)}function At(n){if(n instanceof IDBRequest)return sg(n);if(Bi.has(n))return Bi.get(n);const e=cg(n);return e!==n&&(Bi.set(n,e),Lo.set(e,n)),e}const qi=n=>Lo.get(n);function uh(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),c=At(a);return r&&a.addEventListener("upgradeneeded",u=>{r(At(a.result),u.oldVersion,u.newVersion,At(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const ug=["get","getKey","getAll","getAllKeys","count"],lg=["put","add","delete","clear"],ji=new Map;function lu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(ji.get(e))return ji.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=lg.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||ug.includes(t)))return;const i=async function(a,...c){const u=this.transaction(a,s?"readwrite":"readonly");let d=u.store;return r&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),s&&u.done]))[0]};return ji.set(e,i),i}og(n=>({...n,get:(e,t,r)=>lu(e,t)||n.get(e,t,r),has:(e,t)=>!!lu(e,t)||n.has(e,t)}));/**
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
 */class hg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(dg(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function dg(n){const e=n.getComponent();return e?.type==="VERSION"}const uo="@firebase/app",hu="0.10.13";/**
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
 */const at=new xs("@firebase/app"),fg="@firebase/app-compat",pg="@firebase/analytics-compat",mg="@firebase/analytics",gg="@firebase/app-check-compat",_g="@firebase/app-check",yg="@firebase/auth",vg="@firebase/auth-compat",Eg="@firebase/database",Ig="@firebase/data-connect",Tg="@firebase/database-compat",wg="@firebase/functions",Ag="@firebase/functions-compat",Rg="@firebase/installations",bg="@firebase/installations-compat",Sg="@firebase/messaging",Pg="@firebase/messaging-compat",Cg="@firebase/performance",kg="@firebase/performance-compat",Dg="@firebase/remote-config",Og="@firebase/remote-config-compat",Ng="@firebase/storage",Vg="@firebase/storage-compat",Mg="@firebase/firestore",Lg="@firebase/vertexai-preview",xg="@firebase/firestore-compat",Fg="firebase",Ug="10.14.1";/**
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
 */const lo="[DEFAULT]",Bg={[uo]:"fire-core",[fg]:"fire-core-compat",[mg]:"fire-analytics",[pg]:"fire-analytics-compat",[_g]:"fire-app-check",[gg]:"fire-app-check-compat",[yg]:"fire-auth",[vg]:"fire-auth-compat",[Eg]:"fire-rtdb",[Ig]:"fire-data-connect",[Tg]:"fire-rtdb-compat",[wg]:"fire-fn",[Ag]:"fire-fn-compat",[Rg]:"fire-iid",[bg]:"fire-iid-compat",[Sg]:"fire-fcm",[Pg]:"fire-fcm-compat",[Cg]:"fire-perf",[kg]:"fire-perf-compat",[Dg]:"fire-rc",[Og]:"fire-rc-compat",[Ng]:"fire-gcs",[Vg]:"fire-gcs-compat",[Mg]:"fire-fst",[xg]:"fire-fst-compat",[Lg]:"fire-vertex","fire-js":"fire-js",[Fg]:"fire-js-all"};/**
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
 */const _s=new Map,qg=new Map,ho=new Map;function du(n,e){try{n.container.addComponent(e)}catch(t){at.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function je(n){const e=n.name;if(ho.has(e))return at.debug(`There were multiple attempts to register component ${e}.`),!1;ho.set(e,n);for(const t of _s.values())du(t,n);for(const t of qg.values())du(t,n);return!0}function Ot(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function nt(n){return n.settings!==void 0}/**
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
 */const jg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Rt=new Jt("app","Firebase",jg);/**
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
 */class $g{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new xe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Rt.create("app-deleted",{appName:this._name})}}/**
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
 */const Xt=Ug;function lh(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:lo,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw Rt.create("bad-app-name",{appName:String(s)});if(t||(t=th()),!t)throw Rt.create("no-options");const i=_s.get(s);if(i){if(cr(t,i.options)&&cr(r,i.config))return i;throw Rt.create("duplicate-app",{appName:s})}const a=new Ym(s);for(const u of ho.values())a.addComponent(u);const c=new $g(t,r,a);return _s.set(s,c),c}function Fs(n=lo){const e=_s.get(n);if(!e&&n===lo&&th())return lh();if(!e)throw Rt.create("no-app",{appName:n});return e}function ke(n,e,t){var r;let s=(r=Bg[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const c=[`Unable to register library "${s}" with version "${e}":`];i&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),at.warn(c.join(" "));return}je(new xe(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const zg="firebase-heartbeat-database",Hg=1,ur="firebase-heartbeat-store";let $i=null;function hh(){return $i||($i=uh(zg,Hg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(ur)}catch(t){console.warn(t)}}}}).catch(n=>{throw Rt.create("idb-open",{originalErrorMessage:n.message})})),$i}async function Wg(n){try{const t=(await hh()).transaction(ur),r=await t.objectStore(ur).get(dh(n));return await t.done,r}catch(e){if(e instanceof Fe)at.warn(e.message);else{const t=Rt.create("idb-get",{originalErrorMessage:e?.message});at.warn(t.message)}}}async function fu(n,e){try{const r=(await hh()).transaction(ur,"readwrite");await r.objectStore(ur).put(e,dh(n)),await r.done}catch(t){if(t instanceof Fe)at.warn(t.message);else{const r=Rt.create("idb-set",{originalErrorMessage:t?.message});at.warn(r.message)}}}function dh(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Kg=1024,Gg=720*60*60*1e3;class Qg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Jg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=pu();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=Gg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){at.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=pu(),{heartbeatsToSend:r,unsentEntries:s}=Yg(this._heartbeatsCache.heartbeats),i=gs(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return at.warn(t),""}}}function pu(){return new Date().toISOString().substring(0,10)}function Yg(n,e=Kg){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),mu(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),mu(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Jg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ih()?oh().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Wg(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return fu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return fu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function mu(n){return gs(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Xg(n){je(new xe("platform-logger",e=>new hg(e),"PRIVATE")),je(new xe("heartbeat",e=>new Qg(e),"PRIVATE")),ke(uo,hu,n),ke(uo,hu,"esm2017"),ke("fire-js","")}Xg("");function xo(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function fh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Zg=fh,ph=new Jt("auth","Firebase",fh());/**
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
 */const ys=new xs("@firebase/auth");function e_(n,...e){ys.logLevel<=W.WARN&&ys.warn(`Auth (${Xt}): ${n}`,...e)}function os(n,...e){ys.logLevel<=W.ERROR&&ys.error(`Auth (${Xt}): ${n}`,...e)}/**
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
 */function $e(n,...e){throw Fo(n,...e)}function We(n,...e){return Fo(n,...e)}function mh(n,e,t){const r=Object.assign(Object.assign({},Zg()),{[e]:t});return new Jt("auth","Firebase",r).create(e,{appName:n.name})}function bt(n){return mh(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fo(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return ph.create(n,...e)}function U(n,e,...t){if(!n)throw Fo(e,...t)}function rt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw os(e),new Error(e)}function ct(n,e){n||rt(e)}/**
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
 */function fo(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function t_(){return gu()==="http:"||gu()==="https:"}function gu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function n_(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(t_()||sh()||"connection"in navigator)?navigator.onLine:!0}function r_(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class wr{constructor(e,t){this.shortDelay=e,this.longDelay=t,ct(t>e,"Short delay should be less than long delay!"),this.isMobile=Cm()||Om()}get(){return n_()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Uo(n,e){ct(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class gh{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;rt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;rt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;rt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const s_={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const i_=new wr(3e4,6e4);function Zt(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Nt(n,e,t,r,s={}){return _h(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const c=Tr(Object.assign({key:n.config.apiKey},a)).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:u},i);return Dm()||(d.referrerPolicy="no-referrer"),gh.fetch()(yh(n,n.config.apiHost,t,c),d)})}async function _h(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},s_),e);try{const s=new a_(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw es(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[u,d]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw es(n,"credential-already-in-use",a);if(u==="EMAIL_EXISTS")throw es(n,"email-already-in-use",a);if(u==="USER_DISABLED")throw es(n,"user-disabled",a);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw mh(n,f,d);$e(n,f)}}catch(s){if(s instanceof Fe)throw s;$e(n,"network-request-failed",{message:String(s)})}}async function Us(n,e,t,r,s={}){const i=await Nt(n,e,t,r,s);return"mfaPendingCredential"in i&&$e(n,"multi-factor-auth-required",{_serverResponse:i}),i}function yh(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?Uo(n.config,s):`${n.config.apiScheme}://${s}`}function o_(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class a_{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(We(this.auth,"network-request-failed")),i_.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function es(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=We(n,e,r);return s.customData._tokenResponse=t,s}function _u(n){return n!==void 0&&n.enterprise!==void 0}class c_{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return o_(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function u_(n,e){return Nt(n,"GET","/v2/recaptchaConfig",Zt(n,e))}/**
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
 */async function l_(n,e){return Nt(n,"POST","/v1/accounts:delete",e)}async function vh(n,e){return Nt(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function er(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function h_(n,e=!1){const t=re(n),r=await t.getIdToken(e),s=Bo(r);U(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i?.sign_in_provider;return{claims:s,token:r,authTime:er(zi(s.auth_time)),issuedAtTime:er(zi(s.iat)),expirationTime:er(zi(s.exp)),signInProvider:a||null,signInSecondFactor:i?.sign_in_second_factor||null}}function zi(n){return Number(n)*1e3}function Bo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return os("JWT malformed, contained fewer than 3 sections"),null;try{const s=Xl(t);return s?JSON.parse(s):(os("Failed to decode base64 JWT payload"),null)}catch(s){return os("Caught error parsing JWT payload as JSON",s?.toString()),null}}function yu(n){const e=Bo(n);return U(e,"internal-error"),U(typeof e.exp<"u","internal-error"),U(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function lr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Fe&&d_(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function d_({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class f_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class po{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=er(this.lastLoginAt),this.creationTime=er(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function vs(n){var e;const t=n.auth,r=await n.getIdToken(),s=await lr(n,vh(t,{idToken:r}));U(s?.users.length,t,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Eh(i.providerUserInfo):[],c=m_(n.providerData,a),u=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!c?.length,f=u?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new po(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function p_(n){const e=re(n);await vs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function m_(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Eh(n){return n.map(e=>{var{providerId:t}=e,r=xo(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function g_(n,e){const t=await _h(n,{},async()=>{const r=Tr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=yh(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",gh.fetch()(a,{method:"POST",headers:c,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function __(n,e){return Nt(n,"POST","/v2/accounts:revokeToken",Zt(n,e))}/**
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
 */class hn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){U(e.idToken,"internal-error"),U(typeof e.idToken<"u","internal-error"),U(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):yu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){U(e.length!==0,"internal-error");const t=yu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(U(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await g_(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new hn;return r&&(U(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(U(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(U(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new hn,this.toJSON())}_performRefresh(){return rt("not implemented")}}/**
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
 */function gt(n,e){U(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class st{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,i=xo(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new f_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new po(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await lr(this,this.stsTokenManager.getToken(this.auth,e));return U(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return h_(this,e)}reload(){return p_(this)}_assign(e){this!==e&&(U(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new st(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){U(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await vs(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(nt(this.auth.app))return Promise.reject(bt(this.auth));const e=await this.getIdToken();return await lr(this,l_(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,i,a,c,u,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,y=(s=t.email)!==null&&s!==void 0?s:void 0,R=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,S=(a=t.photoURL)!==null&&a!==void 0?a:void 0,k=(c=t.tenantId)!==null&&c!==void 0?c:void 0,C=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,M=(d=t.createdAt)!==null&&d!==void 0?d:void 0,F=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:x,emailVerified:B,isAnonymous:J,providerData:z,stsTokenManager:E}=t;U(x&&E,e,"internal-error");const g=hn.fromJSON(this.name,E);U(typeof x=="string",e,"internal-error"),gt(m,e.name),gt(y,e.name),U(typeof B=="boolean",e,"internal-error"),U(typeof J=="boolean",e,"internal-error"),gt(R,e.name),gt(S,e.name),gt(k,e.name),gt(C,e.name),gt(M,e.name),gt(F,e.name);const _=new st({uid:x,auth:e,email:y,emailVerified:B,displayName:m,isAnonymous:J,photoURL:S,phoneNumber:R,tenantId:k,stsTokenManager:g,createdAt:M,lastLoginAt:F});return z&&Array.isArray(z)&&(_.providerData=z.map(I=>Object.assign({},I))),C&&(_._redirectEventId=C),_}static async _fromIdTokenResponse(e,t,r=!1){const s=new hn;s.updateFromServerResponse(t);const i=new st({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await vs(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];U(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Eh(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!i?.length,c=new hn;c.updateFromIdToken(r);const u=new st({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new po(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(u,d),u}}/**
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
 */const vu=new Map;function it(n){ct(n instanceof Function,"Expected a class definition");let e=vu.get(n);return e?(ct(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,vu.set(n,e),e)}/**
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
 */class Ih{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Ih.type="NONE";const Eu=Ih;/**
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
 */function as(n,e,t){return`firebase:${n}:${e}:${t}`}class dn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=as(this.userKey,s.apiKey,i),this.fullPersistenceKey=as("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?st._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new dn(it(Eu),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||it(Eu);const a=as(r,e.config.apiKey,e.name);let c=null;for(const d of t)try{const f=await d._get(a);if(f){const m=st._fromJSON(e,f);d!==i&&(c=m),i=d;break}}catch{}const u=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new dn(i,e,r):(i=u[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new dn(i,e,r))}}/**
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
 */function Iu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Rh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Th(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Sh(e))return"Blackberry";if(Ph(e))return"Webos";if(wh(e))return"Safari";if((e.includes("chrome/")||Ah(e))&&!e.includes("edge/"))return"Chrome";if(bh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Th(n=we()){return/firefox\//i.test(n)}function wh(n=we()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ah(n=we()){return/crios\//i.test(n)}function Rh(n=we()){return/iemobile/i.test(n)}function bh(n=we()){return/android/i.test(n)}function Sh(n=we()){return/blackberry/i.test(n)}function Ph(n=we()){return/webos/i.test(n)}function qo(n=we()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function y_(n=we()){var e;return qo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function v_(){return Nm()&&document.documentMode===10}function Ch(n=we()){return qo(n)||bh(n)||Ph(n)||Sh(n)||/windows phone/i.test(n)||Rh(n)}/**
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
 */function kh(n,e=[]){let t;switch(n){case"Browser":t=Iu(we());break;case"Worker":t=`${Iu(we())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Xt}/${r}`}/**
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
 */class E_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,c)=>{try{const u=e(i);a(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
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
 */async function I_(n,e={}){return Nt(n,"GET","/v2/passwordPolicy",Zt(n,e))}/**
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
 */const T_=6;class w_{constructor(e){var t,r,s,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:T_,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,i,a,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(r=u.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),u.isValid&&(u.isValid=(s=u.containsLowercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(i=u.containsUppercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(a=u.containsNumericCharacter)!==null&&a!==void 0?a:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
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
 */class A_{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Tu(this),this.idTokenSubscription=new Tu(this),this.beforeStateQueue=new E_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ph,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=it(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await dn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await vh(this,{idToken:e}),r=await st._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(nt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=s?._redirectEventId,u=await this.tryRedirectSignIn(e);(!a||a===c)&&u?.user&&(s=u.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return U(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await vs(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=r_()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(nt(this.app))return Promise.reject(bt(this));const t=e?re(e):null;return t&&U(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&U(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return nt(this.app)?Promise.reject(bt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return nt(this.app)?Promise.reject(bt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(it(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await I_(this),t=new w_(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Jt("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await __(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&it(e)||this._popupRedirectResolver;U(t,this,"argument-error"),this.redirectPersistenceManager=await dn.create(this,[it(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(U(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,s);return()=>{a=!0,u()}}else{const u=e.addObserver(t);return()=>{a=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return U(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=kh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&e_(`Error while retrieving App Check token: ${t.error}`),t?.token}}function wn(n){return re(n)}class Tu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Bm(t=>this.observer=t)}get next(){return U(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let Bs={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function R_(n){Bs=n}function Dh(n){return Bs.loadJS(n)}function b_(){return Bs.recaptchaEnterpriseScript}function S_(){return Bs.gapiScript}function P_(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const C_="recaptcha-enterprise",k_="NO_RECAPTCHA";class D_{constructor(e){this.type=C_,this.auth=wn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,c)=>{u_(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const d=new c_(u);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(u=>{c(u)})})}function s(i,a,c){const u=window.grecaptcha;_u(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(k_)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(c=>{if(!t&&_u(window.grecaptcha))s(c,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let u=b_();u.length!==0&&(u+=c),Dh(u).then(()=>{s(c,i,a)}).catch(d=>{a(d)})}}).catch(c=>{a(c)})})}}async function wu(n,e,t,r=!1){const s=new D_(n);let i;try{i=await s.verify(t)}catch{i=await s.verify(t,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Au(n,e,t,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await wu(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await wu(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
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
 */function O_(n,e){const t=Ot(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(cr(i,e??{}))return s;$e(s,"already-initialized")}return t.initialize({options:e})}function N_(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(it);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function V_(n,e,t){const r=wn(n);U(r._canInitEmulator,r,"emulator-config-failed"),U(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Oh(e),{host:a,port:c}=M_(e),u=c===null?"":`:${c}`;r.config.emulator={url:`${i}//${a}${u}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),L_()}function Oh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function M_(n){const e=Oh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:Ru(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:Ru(a)}}}function Ru(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function L_(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class jo{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return rt("not implemented")}_getIdTokenResponse(e){return rt("not implemented")}_linkToIdToken(e,t){return rt("not implemented")}_getReauthenticationResolver(e){return rt("not implemented")}}async function x_(n,e){return Nt(n,"POST","/v1/accounts:signUp",e)}/**
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
 */async function F_(n,e){return Us(n,"POST","/v1/accounts:signInWithPassword",Zt(n,e))}/**
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
 */async function U_(n,e){return Us(n,"POST","/v1/accounts:signInWithEmailLink",Zt(n,e))}async function B_(n,e){return Us(n,"POST","/v1/accounts:signInWithEmailLink",Zt(n,e))}/**
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
 */class hr extends jo{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new hr(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new hr(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Au(e,t,"signInWithPassword",F_);case"emailLink":return U_(e,{email:this._email,oobCode:this._password});default:$e(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Au(e,r,"signUpPassword",x_);case"emailLink":return B_(e,{idToken:t,email:this._email,oobCode:this._password});default:$e(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
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
 */async function fn(n,e){return Us(n,"POST","/v1/accounts:signInWithIdp",Zt(n,e))}/**
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
 */const q_="http://localhost";class Ht extends jo{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ht(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):$e("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,i=xo(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new Ht(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return fn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,fn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,fn(e,t)}buildRequest(){const e={requestUri:q_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Tr(t)}return e}}/**
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
 */function j_(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function $_(n){const e=Gn(Qn(n)).link,t=e?Gn(Qn(e)).deep_link_id:null,r=Gn(Qn(n)).deep_link_id;return(r?Gn(Qn(r)).link:null)||r||t||e||n}class $o{constructor(e){var t,r,s,i,a,c;const u=Gn(Qn(e)),d=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(r=u.oobCode)!==null&&r!==void 0?r:null,m=j_((s=u.mode)!==null&&s!==void 0?s:null);U(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=u.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=u.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=$_(e);try{return new $o(t)}catch{return null}}}/**
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
 */class An{constructor(){this.providerId=An.PROVIDER_ID}static credential(e,t){return hr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=$o.parseLink(t);return U(r,"argument-error"),hr._fromEmailAndCode(e,r.code,r.tenantId)}}An.PROVIDER_ID="password";An.EMAIL_PASSWORD_SIGN_IN_METHOD="password";An.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */class Nh{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ar extends Nh{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class yt extends Ar{constructor(){super("facebook.com")}static credential(e){return Ht._fromParams({providerId:yt.PROVIDER_ID,signInMethod:yt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yt.credentialFromTaggedObject(e)}static credentialFromError(e){return yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yt.credential(e.oauthAccessToken)}catch{return null}}}yt.FACEBOOK_SIGN_IN_METHOD="facebook.com";yt.PROVIDER_ID="facebook.com";/**
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
 */class vt extends Ar{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ht._fromParams({providerId:vt.PROVIDER_ID,signInMethod:vt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return vt.credentialFromTaggedObject(e)}static credentialFromError(e){return vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return vt.credential(t,r)}catch{return null}}}vt.GOOGLE_SIGN_IN_METHOD="google.com";vt.PROVIDER_ID="google.com";/**
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
 */class Et extends Ar{constructor(){super("github.com")}static credential(e){return Ht._fromParams({providerId:Et.PROVIDER_ID,signInMethod:Et.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Et.credentialFromTaggedObject(e)}static credentialFromError(e){return Et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Et.credential(e.oauthAccessToken)}catch{return null}}}Et.GITHUB_SIGN_IN_METHOD="github.com";Et.PROVIDER_ID="github.com";/**
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
 */class It extends Ar{constructor(){super("twitter.com")}static credential(e,t){return Ht._fromParams({providerId:It.PROVIDER_ID,signInMethod:It.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return It.credentialFromTaggedObject(e)}static credentialFromError(e){return It.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return It.credential(t,r)}catch{return null}}}It.TWITTER_SIGN_IN_METHOD="twitter.com";It.PROVIDER_ID="twitter.com";/**
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
 */class mn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await st._fromIdTokenResponse(e,r,s),a=bu(r);return new mn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=bu(r);return new mn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function bu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Es extends Fe{constructor(e,t,r,s){var i;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Es.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Es(e,t,r,s)}}function Vh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Es._fromErrorAndOperation(n,i,e,r):i})}async function z_(n,e,t=!1){const r=await lr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return mn._forOperation(n,"link",r)}/**
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
 */async function H_(n,e,t=!1){const{auth:r}=n;if(nt(r.app))return Promise.reject(bt(r));const s="reauthenticate";try{const i=await lr(n,Vh(r,s,e,n),t);U(i.idToken,r,"internal-error");const a=Bo(i.idToken);U(a,r,"internal-error");const{sub:c}=a;return U(n.uid===c,r,"user-mismatch"),mn._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&$e(r,"user-mismatch"),i}}/**
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
 */async function Mh(n,e,t=!1){if(nt(n.app))return Promise.reject(bt(n));const r="signIn",s=await Vh(n,r,e),i=await mn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function W_(n,e){return Mh(wn(n),e)}/**
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
 */async function K_(n){const e=wn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function G_(n,e,t){return nt(n.app)?Promise.reject(bt(n)):W_(re(n),An.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&K_(n),r})}function Q_(n,e,t,r){return re(n).onIdTokenChanged(e,t,r)}function Y_(n,e,t){return re(n).beforeAuthStateChanged(e,t)}function J_(n,e,t,r){return re(n).onAuthStateChanged(e,t,r)}function X_(n){return re(n).signOut()}const Is="__sak";/**
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
 */class Lh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Is,"1"),this.storage.removeItem(Is),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Z_=1e3,ey=10;class xh extends Lh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ch(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,u)=>{this.notifyListeners(a,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);v_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,ey):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Z_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}xh.type="LOCAL";const ty=xh;/**
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
 */class Fh extends Lh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Fh.type="SESSION";const Uh=Fh;/**
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
 */function ny(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class qs{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new qs(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(a).map(async d=>d(t.origin,i)),u=await ny(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}qs.receivers=[];/**
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
 */function zo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class ry{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((c,u)=>{const d=zo("",20);s.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const y=m;if(y.data.eventId===d)switch(y.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(y.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Ke(){return window}function sy(n){Ke().location.href=n}/**
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
 */function Bh(){return typeof Ke().WorkerGlobalScope<"u"&&typeof Ke().importScripts=="function"}async function iy(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function oy(){var n;return((n=navigator?.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function ay(){return Bh()?self:null}/**
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
 */const qh="firebaseLocalStorageDb",cy=1,Ts="firebaseLocalStorage",jh="fbase_key";class Rr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function js(n,e){return n.transaction([Ts],e?"readwrite":"readonly").objectStore(Ts)}function uy(){const n=indexedDB.deleteDatabase(qh);return new Rr(n).toPromise()}function mo(){const n=indexedDB.open(qh,cy);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Ts,{keyPath:jh})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Ts)?e(r):(r.close(),await uy(),e(await mo()))})})}async function Su(n,e,t){const r=js(n,!0).put({[jh]:e,value:t});return new Rr(r).toPromise()}async function ly(n,e){const t=js(n,!1).get(e),r=await new Rr(t).toPromise();return r===void 0?null:r.value}function Pu(n,e){const t=js(n,!0).delete(e);return new Rr(t).toPromise()}const hy=800,dy=3;class $h{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await mo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>dy)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Bh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=qs._getInstance(ay()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await iy(),!this.activeServiceWorker)return;this.sender=new ry(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||oy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await mo();return await Su(e,Is,"1"),await Pu(e,Is),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Su(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ly(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Pu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=js(s,!1).getAll();return new Rr(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}$h.type="LOCAL";const fy=$h;new wr(3e4,6e4);/**
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
 */function py(n,e){return e?it(e):(U(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Ho extends jo{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return fn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return fn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return fn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function my(n){return Mh(n.auth,new Ho(n),n.bypassAuthState)}function gy(n){const{auth:e,user:t}=n;return U(t,e,"internal-error"),H_(t,new Ho(n),n.bypassAuthState)}async function _y(n){const{auth:e,user:t}=n;return U(t,e,"internal-error"),z_(t,new Ho(n),n.bypassAuthState)}/**
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
 */class zh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return my;case"linkViaPopup":case"linkViaRedirect":return _y;case"reauthViaPopup":case"reauthViaRedirect":return gy;default:$e(this.auth,"internal-error")}}resolve(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const yy=new wr(2e3,1e4);class ln extends zh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,ln.currentPopupAction&&ln.currentPopupAction.cancel(),ln.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return U(e,this.auth,"internal-error"),e}async onExecution(){ct(this.filter.length===1,"Popup operations only handle one event");const e=zo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(We(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(We(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ln.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(We(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,yy.get())};e()}}ln.currentPopupAction=null;/**
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
 */const vy="pendingRedirect",cs=new Map;class Ey extends zh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=cs.get(this.auth._key());if(!e){try{const r=await Iy(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}cs.set(this.auth._key(),e)}return this.bypassAuthState||cs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Iy(n,e){const t=Ay(e),r=wy(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function Ty(n,e){cs.set(n._key(),e)}function wy(n){return it(n._redirectPersistence)}function Ay(n){return as(vy,n.config.apiKey,n.name)}async function Ry(n,e,t=!1){if(nt(n.app))return Promise.reject(bt(n));const r=wn(n),s=py(r,e),a=await new Ey(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const by=600*1e3;class Sy{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Py(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Hh(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(We(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=by&&this.cachedEventUids.clear(),this.cachedEventUids.has(Cu(e))}saveEventToCache(e){this.cachedEventUids.add(Cu(e)),this.lastProcessedEventTime=Date.now()}}function Cu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Hh({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Py(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Hh(n);default:return!1}}/**
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
 */async function Cy(n,e={}){return Nt(n,"GET","/v1/projects",e)}/**
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
 */const ky=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Dy=/^https?/;async function Oy(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Cy(n);for(const t of e)try{if(Ny(t))return}catch{}$e(n,"unauthorized-domain")}function Ny(n){const e=fo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Dy.test(t))return!1;if(ky.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const Vy=new wr(3e4,6e4);function ku(){const n=Ke().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function My(n){return new Promise((e,t)=>{var r,s,i;function a(){ku(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ku(),t(We(n,"network-request-failed"))},timeout:Vy.get()})}if(!((s=(r=Ke().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Ke().gapi)===null||i===void 0)&&i.load)a();else{const c=P_("iframefcb");return Ke()[c]=()=>{gapi.load?a():t(We(n,"network-request-failed"))},Dh(`${S_()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw us=null,e})}let us=null;function Ly(n){return us=us||My(n),us}/**
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
 */const xy=new wr(5e3,15e3),Fy="__/auth/iframe",Uy="emulator/auth/iframe",By={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},qy=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function jy(n){const e=n.config;U(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Uo(e,Uy):`https://${n.config.authDomain}/${Fy}`,r={apiKey:e.apiKey,appName:n.name,v:Xt},s=qy.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Tr(r).slice(1)}`}async function $y(n){const e=await Ly(n),t=Ke().gapi;return U(t,n,"internal-error"),e.open({where:document.body,url:jy(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:By,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=We(n,"network-request-failed"),c=Ke().setTimeout(()=>{i(a)},xy.get());function u(){Ke().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(a)})}))}/**
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
 */const zy={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Hy=500,Wy=600,Ky="_blank",Gy="http://localhost";class Du{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Qy(n,e,t,r=Hy,s=Wy){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const u=Object.assign(Object.assign({},zy),{width:r.toString(),height:s.toString(),top:i,left:a}),d=we().toLowerCase();t&&(c=Ah(d)?Ky:t),Th(d)&&(e=e||Gy,u.scrollbars="yes");const f=Object.entries(u).reduce((y,[R,S])=>`${y}${R}=${S},`,"");if(y_(d)&&c!=="_self")return Yy(e||"",c),new Du(null);const m=window.open(e||"",c,f);U(m,n,"popup-blocked");try{m.focus()}catch{}return new Du(m)}function Yy(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const Jy="__/auth/handler",Xy="emulator/auth/handler",Zy=encodeURIComponent("fac");async function Ou(n,e,t,r,s,i){U(n.config.authDomain,n,"auth-domain-config-required"),U(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Xt,eventId:s};if(e instanceof Nh){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Um(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof Ar){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await n._getAppCheckToken(),d=u?`#${Zy}=${encodeURIComponent(u)}`:"";return`${ev(n)}?${Tr(c).slice(1)}${d}`}function ev({config:n}){return n.emulator?Uo(n,Xy):`https://${n.authDomain}/${Jy}`}/**
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
 */const Hi="webStorageSupport";class tv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Uh,this._completeRedirectFn=Ry,this._overrideRedirectResult=Ty}async _openPopup(e,t,r,s){var i;ct((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Ou(e,t,r,fo(),s);return Qy(e,a,zo())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await Ou(e,t,r,fo(),s);return sy(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(ct(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await $y(e),r=new Sy(e);return t.register("authEvent",s=>(U(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Hi,{type:Hi},s=>{var i;const a=(i=s?.[0])===null||i===void 0?void 0:i[Hi];a!==void 0&&t(!!a),$e(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Oy(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Ch()||wh()||qo()}}const nv=tv;var Nu="@firebase/auth",Vu="1.7.9";/**
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
 */class rv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){U(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function sv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function iv(n){je(new xe("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;U(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:kh(n)},d=new A_(r,s,i,u);return N_(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),je(new xe("auth-internal",e=>{const t=wn(e.getProvider("auth").getImmediate());return(r=>new rv(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ke(Nu,Vu,sv(n)),ke(Nu,Vu,"esm2017")}/**
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
 */const ov=300,av=nh("authIdTokenMaxAge")||ov;let Mu=null;const cv=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>av)return;const s=t?.token;Mu!==s&&(Mu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function uv(n=Fs()){const e=Ot(n,"auth");if(e.isInitialized())return e.getImmediate();const t=O_(n,{popupRedirectResolver:nv,persistence:[fy,ty,Uh]}),r=nh("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=cv(i.toString());Y_(t,a,()=>a(t.currentUser)),Q_(t,c=>a(c))}}const s=Zl("auth");return s&&V_(t,`http://${s}`),t}function lv(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}R_({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=We("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",lv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});iv("Browser");var hv="firebase",dv="10.14.1";/**
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
 */ke(hv,dv,"app");var Lu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var $t,Wh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function _(){}_.prototype=g.prototype,E.D=g.prototype,E.prototype=new _,E.prototype.constructor=E,E.C=function(I,T,A){for(var v=Array(arguments.length-2),Ze=2;Ze<arguments.length;Ze++)v[Ze-2]=arguments[Ze];return g.prototype[T].apply(I,v)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,g,_){_||(_=0);var I=Array(16);if(typeof g=="string")for(var T=0;16>T;++T)I[T]=g.charCodeAt(_++)|g.charCodeAt(_++)<<8|g.charCodeAt(_++)<<16|g.charCodeAt(_++)<<24;else for(T=0;16>T;++T)I[T]=g[_++]|g[_++]<<8|g[_++]<<16|g[_++]<<24;g=E.g[0],_=E.g[1],T=E.g[2];var A=E.g[3],v=g+(A^_&(T^A))+I[0]+3614090360&4294967295;g=_+(v<<7&4294967295|v>>>25),v=A+(T^g&(_^T))+I[1]+3905402710&4294967295,A=g+(v<<12&4294967295|v>>>20),v=T+(_^A&(g^_))+I[2]+606105819&4294967295,T=A+(v<<17&4294967295|v>>>15),v=_+(g^T&(A^g))+I[3]+3250441966&4294967295,_=T+(v<<22&4294967295|v>>>10),v=g+(A^_&(T^A))+I[4]+4118548399&4294967295,g=_+(v<<7&4294967295|v>>>25),v=A+(T^g&(_^T))+I[5]+1200080426&4294967295,A=g+(v<<12&4294967295|v>>>20),v=T+(_^A&(g^_))+I[6]+2821735955&4294967295,T=A+(v<<17&4294967295|v>>>15),v=_+(g^T&(A^g))+I[7]+4249261313&4294967295,_=T+(v<<22&4294967295|v>>>10),v=g+(A^_&(T^A))+I[8]+1770035416&4294967295,g=_+(v<<7&4294967295|v>>>25),v=A+(T^g&(_^T))+I[9]+2336552879&4294967295,A=g+(v<<12&4294967295|v>>>20),v=T+(_^A&(g^_))+I[10]+4294925233&4294967295,T=A+(v<<17&4294967295|v>>>15),v=_+(g^T&(A^g))+I[11]+2304563134&4294967295,_=T+(v<<22&4294967295|v>>>10),v=g+(A^_&(T^A))+I[12]+1804603682&4294967295,g=_+(v<<7&4294967295|v>>>25),v=A+(T^g&(_^T))+I[13]+4254626195&4294967295,A=g+(v<<12&4294967295|v>>>20),v=T+(_^A&(g^_))+I[14]+2792965006&4294967295,T=A+(v<<17&4294967295|v>>>15),v=_+(g^T&(A^g))+I[15]+1236535329&4294967295,_=T+(v<<22&4294967295|v>>>10),v=g+(T^A&(_^T))+I[1]+4129170786&4294967295,g=_+(v<<5&4294967295|v>>>27),v=A+(_^T&(g^_))+I[6]+3225465664&4294967295,A=g+(v<<9&4294967295|v>>>23),v=T+(g^_&(A^g))+I[11]+643717713&4294967295,T=A+(v<<14&4294967295|v>>>18),v=_+(A^g&(T^A))+I[0]+3921069994&4294967295,_=T+(v<<20&4294967295|v>>>12),v=g+(T^A&(_^T))+I[5]+3593408605&4294967295,g=_+(v<<5&4294967295|v>>>27),v=A+(_^T&(g^_))+I[10]+38016083&4294967295,A=g+(v<<9&4294967295|v>>>23),v=T+(g^_&(A^g))+I[15]+3634488961&4294967295,T=A+(v<<14&4294967295|v>>>18),v=_+(A^g&(T^A))+I[4]+3889429448&4294967295,_=T+(v<<20&4294967295|v>>>12),v=g+(T^A&(_^T))+I[9]+568446438&4294967295,g=_+(v<<5&4294967295|v>>>27),v=A+(_^T&(g^_))+I[14]+3275163606&4294967295,A=g+(v<<9&4294967295|v>>>23),v=T+(g^_&(A^g))+I[3]+4107603335&4294967295,T=A+(v<<14&4294967295|v>>>18),v=_+(A^g&(T^A))+I[8]+1163531501&4294967295,_=T+(v<<20&4294967295|v>>>12),v=g+(T^A&(_^T))+I[13]+2850285829&4294967295,g=_+(v<<5&4294967295|v>>>27),v=A+(_^T&(g^_))+I[2]+4243563512&4294967295,A=g+(v<<9&4294967295|v>>>23),v=T+(g^_&(A^g))+I[7]+1735328473&4294967295,T=A+(v<<14&4294967295|v>>>18),v=_+(A^g&(T^A))+I[12]+2368359562&4294967295,_=T+(v<<20&4294967295|v>>>12),v=g+(_^T^A)+I[5]+4294588738&4294967295,g=_+(v<<4&4294967295|v>>>28),v=A+(g^_^T)+I[8]+2272392833&4294967295,A=g+(v<<11&4294967295|v>>>21),v=T+(A^g^_)+I[11]+1839030562&4294967295,T=A+(v<<16&4294967295|v>>>16),v=_+(T^A^g)+I[14]+4259657740&4294967295,_=T+(v<<23&4294967295|v>>>9),v=g+(_^T^A)+I[1]+2763975236&4294967295,g=_+(v<<4&4294967295|v>>>28),v=A+(g^_^T)+I[4]+1272893353&4294967295,A=g+(v<<11&4294967295|v>>>21),v=T+(A^g^_)+I[7]+4139469664&4294967295,T=A+(v<<16&4294967295|v>>>16),v=_+(T^A^g)+I[10]+3200236656&4294967295,_=T+(v<<23&4294967295|v>>>9),v=g+(_^T^A)+I[13]+681279174&4294967295,g=_+(v<<4&4294967295|v>>>28),v=A+(g^_^T)+I[0]+3936430074&4294967295,A=g+(v<<11&4294967295|v>>>21),v=T+(A^g^_)+I[3]+3572445317&4294967295,T=A+(v<<16&4294967295|v>>>16),v=_+(T^A^g)+I[6]+76029189&4294967295,_=T+(v<<23&4294967295|v>>>9),v=g+(_^T^A)+I[9]+3654602809&4294967295,g=_+(v<<4&4294967295|v>>>28),v=A+(g^_^T)+I[12]+3873151461&4294967295,A=g+(v<<11&4294967295|v>>>21),v=T+(A^g^_)+I[15]+530742520&4294967295,T=A+(v<<16&4294967295|v>>>16),v=_+(T^A^g)+I[2]+3299628645&4294967295,_=T+(v<<23&4294967295|v>>>9),v=g+(T^(_|~A))+I[0]+4096336452&4294967295,g=_+(v<<6&4294967295|v>>>26),v=A+(_^(g|~T))+I[7]+1126891415&4294967295,A=g+(v<<10&4294967295|v>>>22),v=T+(g^(A|~_))+I[14]+2878612391&4294967295,T=A+(v<<15&4294967295|v>>>17),v=_+(A^(T|~g))+I[5]+4237533241&4294967295,_=T+(v<<21&4294967295|v>>>11),v=g+(T^(_|~A))+I[12]+1700485571&4294967295,g=_+(v<<6&4294967295|v>>>26),v=A+(_^(g|~T))+I[3]+2399980690&4294967295,A=g+(v<<10&4294967295|v>>>22),v=T+(g^(A|~_))+I[10]+4293915773&4294967295,T=A+(v<<15&4294967295|v>>>17),v=_+(A^(T|~g))+I[1]+2240044497&4294967295,_=T+(v<<21&4294967295|v>>>11),v=g+(T^(_|~A))+I[8]+1873313359&4294967295,g=_+(v<<6&4294967295|v>>>26),v=A+(_^(g|~T))+I[15]+4264355552&4294967295,A=g+(v<<10&4294967295|v>>>22),v=T+(g^(A|~_))+I[6]+2734768916&4294967295,T=A+(v<<15&4294967295|v>>>17),v=_+(A^(T|~g))+I[13]+1309151649&4294967295,_=T+(v<<21&4294967295|v>>>11),v=g+(T^(_|~A))+I[4]+4149444226&4294967295,g=_+(v<<6&4294967295|v>>>26),v=A+(_^(g|~T))+I[11]+3174756917&4294967295,A=g+(v<<10&4294967295|v>>>22),v=T+(g^(A|~_))+I[2]+718787259&4294967295,T=A+(v<<15&4294967295|v>>>17),v=_+(A^(T|~g))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(T+(v<<21&4294967295|v>>>11))&4294967295,E.g[2]=E.g[2]+T&4294967295,E.g[3]=E.g[3]+A&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var _=g-this.blockSize,I=this.B,T=this.h,A=0;A<g;){if(T==0)for(;A<=_;)s(this,E,A),A+=this.blockSize;if(typeof E=="string"){for(;A<g;)if(I[T++]=E.charCodeAt(A++),T==this.blockSize){s(this,I),T=0;break}}else for(;A<g;)if(I[T++]=E[A++],T==this.blockSize){s(this,I),T=0;break}}this.h=T,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var _=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=_&255,_/=256;for(this.u(E),E=Array(16),g=_=0;4>g;++g)for(var I=0;32>I;I+=8)E[_++]=this.g[g]>>>I&255;return E};function i(E,g){var _=c;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=g(E)}function a(E,g){this.h=g;for(var _=[],I=!0,T=E.length-1;0<=T;T--){var A=E[T]|0;I&&A==g||(_[T]=A,I=!1)}this.g=_}var c={};function u(E){return-128<=E&&128>E?i(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return C(d(-E));for(var g=[],_=1,I=0;E>=_;I++)g[I]=E/_|0,_*=4294967296;return new a(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return C(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(g,8)),I=m,T=0;T<E.length;T+=8){var A=Math.min(8,E.length-T),v=parseInt(E.substring(T,T+A),g);8>A?(A=d(Math.pow(g,A)),I=I.j(A).add(d(v))):(I=I.j(_),I=I.add(d(v)))}return I}var m=u(0),y=u(1),R=u(16777216);n=a.prototype,n.m=function(){if(k(this))return-C(this).m();for(var E=0,g=1,_=0;_<this.g.length;_++){var I=this.i(_);E+=(0<=I?I:4294967296+I)*g,g*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(S(this))return"0";if(k(this))return"-"+C(this).toString(E);for(var g=d(Math.pow(E,6)),_=this,I="";;){var T=B(_,g).g;_=M(_,T.j(g));var A=((0<_.g.length?_.g[0]:_.h)>>>0).toString(E);if(_=T,S(_))return A+I;for(;6>A.length;)A="0"+A;I=A+I}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function S(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function k(E){return E.h==-1}n.l=function(E){return E=M(this,E),k(E)?-1:S(E)?0:1};function C(E){for(var g=E.g.length,_=[],I=0;I<g;I++)_[I]=~E.g[I];return new a(_,~E.h).add(y)}n.abs=function(){return k(this)?C(this):this},n.add=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0,T=0;T<=g;T++){var A=I+(this.i(T)&65535)+(E.i(T)&65535),v=(A>>>16)+(this.i(T)>>>16)+(E.i(T)>>>16);I=v>>>16,A&=65535,v&=65535,_[T]=v<<16|A}return new a(_,_[_.length-1]&-2147483648?-1:0)};function M(E,g){return E.add(C(g))}n.j=function(E){if(S(this)||S(E))return m;if(k(this))return k(E)?C(this).j(C(E)):C(C(this).j(E));if(k(E))return C(this.j(C(E)));if(0>this.l(R)&&0>E.l(R))return d(this.m()*E.m());for(var g=this.g.length+E.g.length,_=[],I=0;I<2*g;I++)_[I]=0;for(I=0;I<this.g.length;I++)for(var T=0;T<E.g.length;T++){var A=this.i(I)>>>16,v=this.i(I)&65535,Ze=E.i(T)>>>16,Cn=E.i(T)&65535;_[2*I+2*T]+=v*Cn,F(_,2*I+2*T),_[2*I+2*T+1]+=A*Cn,F(_,2*I+2*T+1),_[2*I+2*T+1]+=v*Ze,F(_,2*I+2*T+1),_[2*I+2*T+2]+=A*Ze,F(_,2*I+2*T+2)}for(I=0;I<g;I++)_[I]=_[2*I+1]<<16|_[2*I];for(I=g;I<2*g;I++)_[I]=0;return new a(_,0)};function F(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function x(E,g){this.g=E,this.h=g}function B(E,g){if(S(g))throw Error("division by zero");if(S(E))return new x(m,m);if(k(E))return g=B(C(E),g),new x(C(g.g),C(g.h));if(k(g))return g=B(E,C(g)),new x(C(g.g),g.h);if(30<E.g.length){if(k(E)||k(g))throw Error("slowDivide_ only works with positive integers.");for(var _=y,I=g;0>=I.l(E);)_=J(_),I=J(I);var T=z(_,1),A=z(I,1);for(I=z(I,2),_=z(_,2);!S(I);){var v=A.add(I);0>=v.l(E)&&(T=T.add(_),A=v),I=z(I,1),_=z(_,1)}return g=M(E,T.j(g)),new x(T,g)}for(T=m;0<=E.l(g);){for(_=Math.max(1,Math.floor(E.m()/g.m())),I=Math.ceil(Math.log(_)/Math.LN2),I=48>=I?1:Math.pow(2,I-48),A=d(_),v=A.j(g);k(v)||0<v.l(E);)_-=I,A=d(_),v=A.j(g);S(A)&&(A=y),T=T.add(A),E=M(E,v)}return new x(T,E)}n.A=function(E){return B(this,E).h},n.and=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)&E.i(I);return new a(_,this.h&E.h)},n.or=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)|E.i(I);return new a(_,this.h|E.h)},n.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),_=[],I=0;I<g;I++)_[I]=this.i(I)^E.i(I);return new a(_,this.h^E.h)};function J(E){for(var g=E.g.length+1,_=[],I=0;I<g;I++)_[I]=E.i(I)<<1|E.i(I-1)>>>31;return new a(_,E.h)}function z(E,g){var _=g>>5;g%=32;for(var I=E.g.length-_,T=[],A=0;A<I;A++)T[A]=0<g?E.i(A+_)>>>g|E.i(A+_+1)<<32-g:E.i(A+_);return new a(T,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Wh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,$t=a}).apply(typeof Lu<"u"?Lu:typeof self<"u"?self:typeof window<"u"?window:{});var ts=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Kh,Yn,Gh,ls,go,Qh,Yh,Jh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,l,h){return o==Array.prototype||o==Object.prototype||(o[l]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ts=="object"&&ts];for(var l=0;l<o.length;++l){var h=o[l];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,l){if(l)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var w=o[p];if(!(w in h))break e;h=h[w]}o=o[o.length-1],p=h[o],l=l(p),l!=p&&l!=null&&e(h,o,{configurable:!0,writable:!0,value:l})}}function i(o,l){o instanceof String&&(o+="");var h=0,p=!1,w={next:function(){if(!p&&h<o.length){var b=h++;return{value:l(b,o[b]),done:!1}}return p=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(o){return o||function(){return i(this,function(l,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function u(o){var l=typeof o;return l=l!="object"?l:o?Array.isArray(o)?"array":l:"null",l=="array"||l=="object"&&typeof o.length=="number"}function d(o){var l=typeof o;return l=="object"&&o!=null||l=="function"}function f(o,l,h){return o.call.apply(o.bind,arguments)}function m(o,l,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,p),o.apply(l,w)}}return function(){return o.apply(l,arguments)}}function y(o,l,h){return y=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,y.apply(null,arguments)}function R(o,l){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function S(o,l){function h(){}h.prototype=l.prototype,o.aa=l.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,w,b){for(var O=Array(arguments.length-2),X=2;X<arguments.length;X++)O[X-2]=arguments[X];return l.prototype[w].apply(p,O)}}function k(o){const l=o.length;if(0<l){const h=Array(l);for(let p=0;p<l;p++)h[p]=o[p];return h}return[]}function C(o,l){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(u(p)){const w=o.length||0,b=p.length||0;o.length=w+b;for(let O=0;O<b;O++)o[w+O]=p[O]}else o.push(p)}}class M{constructor(l,h){this.i=l,this.j=h,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function F(o){return/^[\s\xa0]*$/.test(o)}function x(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function B(o){return B[" "](o),o}B[" "]=function(){};var J=x().indexOf("Gecko")!=-1&&!(x().toLowerCase().indexOf("webkit")!=-1&&x().indexOf("Edge")==-1)&&!(x().indexOf("Trident")!=-1||x().indexOf("MSIE")!=-1)&&x().indexOf("Edge")==-1;function z(o,l,h){for(const p in o)l.call(h,o[p],p,o)}function E(o,l){for(const h in o)l.call(void 0,o[h],h,o)}function g(o){const l={};for(const h in o)l[h]=o[h];return l}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(o,l){let h,p;for(let w=1;w<arguments.length;w++){p=arguments[w];for(h in p)o[h]=p[h];for(let b=0;b<_.length;b++)h=_[b],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function T(o){var l=1;o=o.split(":");const h=[];for(;0<l&&o.length;)h.push(o.shift()),l--;return o.length&&h.push(o.join(":")),h}function A(o){c.setTimeout(()=>{throw o},0)}function v(){var o=li;let l=null;return o.g&&(l=o.g,o.g=o.g.next,o.g||(o.h=null),l.next=null),l}class Ze{constructor(){this.h=this.g=null}add(l,h){const p=Cn.get();p.set(l,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Cn=new M(()=>new qf,o=>o.reset());class qf{constructor(){this.next=this.g=this.h=null}set(l,h){this.h=l,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let kn,Dn=!1,li=new Ze,ja=()=>{const o=c.Promise.resolve(void 0);kn=()=>{o.then(jf)}};var jf=()=>{for(var o;o=v();){try{o.h.call(o.g)}catch(h){A(h)}var l=Cn;l.j(o),100>l.h&&(l.h++,o.next=l.g,l.g=o)}Dn=!1};function dt(){this.s=this.s,this.C=this.C}dt.prototype.s=!1,dt.prototype.ma=function(){this.s||(this.s=!0,this.N())},dt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ge(o,l){this.type=o,this.g=this.target=l,this.defaultPrevented=!1}ge.prototype.h=function(){this.defaultPrevented=!0};var $f=(function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,l=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};c.addEventListener("test",h,l),c.removeEventListener("test",h,l)}catch{}return o})();function On(o,l){if(ge.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=l,l=o.relatedTarget){if(J){e:{try{B(l.nodeName);var w=!0;break e}catch{}w=!1}w||(l=null)}}else h=="mouseover"?l=o.fromElement:h=="mouseout"&&(l=o.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:zf[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&On.aa.h.call(this)}}S(On,ge);var zf={2:"touch",3:"pen",4:"mouse"};On.prototype.h=function(){On.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Vr="closure_listenable_"+(1e6*Math.random()|0),Hf=0;function Wf(o,l,h,p,w){this.listener=o,this.proxy=null,this.src=l,this.type=h,this.capture=!!p,this.ha=w,this.key=++Hf,this.da=this.fa=!1}function Mr(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Lr(o){this.src=o,this.g={},this.h=0}Lr.prototype.add=function(o,l,h,p,w){var b=o.toString();o=this.g[b],o||(o=this.g[b]=[],this.h++);var O=di(o,l,p,w);return-1<O?(l=o[O],h||(l.fa=!1)):(l=new Wf(l,this.src,b,!!p,w),l.fa=h,o.push(l)),l};function hi(o,l){var h=l.type;if(h in o.g){var p=o.g[h],w=Array.prototype.indexOf.call(p,l,void 0),b;(b=0<=w)&&Array.prototype.splice.call(p,w,1),b&&(Mr(l),o.g[h].length==0&&(delete o.g[h],o.h--))}}function di(o,l,h,p){for(var w=0;w<o.length;++w){var b=o[w];if(!b.da&&b.listener==l&&b.capture==!!h&&b.ha==p)return w}return-1}var fi="closure_lm_"+(1e6*Math.random()|0),pi={};function $a(o,l,h,p,w){if(Array.isArray(l)){for(var b=0;b<l.length;b++)$a(o,l[b],h,p,w);return null}return h=Wa(h),o&&o[Vr]?o.K(l,h,d(p)?!!p.capture:!1,w):Kf(o,l,h,!1,p,w)}function Kf(o,l,h,p,w,b){if(!l)throw Error("Invalid event type");var O=d(w)?!!w.capture:!!w,X=gi(o);if(X||(o[fi]=X=new Lr(o)),h=X.add(l,h,p,O,b),h.proxy)return h;if(p=Gf(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)$f||(w=O),w===void 0&&(w=!1),o.addEventListener(l.toString(),p,w);else if(o.attachEvent)o.attachEvent(Ha(l.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Gf(){function o(h){return l.call(o.src,o.listener,h)}const l=Qf;return o}function za(o,l,h,p,w){if(Array.isArray(l))for(var b=0;b<l.length;b++)za(o,l[b],h,p,w);else p=d(p)?!!p.capture:!!p,h=Wa(h),o&&o[Vr]?(o=o.i,l=String(l).toString(),l in o.g&&(b=o.g[l],h=di(b,h,p,w),-1<h&&(Mr(b[h]),Array.prototype.splice.call(b,h,1),b.length==0&&(delete o.g[l],o.h--)))):o&&(o=gi(o))&&(l=o.g[l.toString()],o=-1,l&&(o=di(l,h,p,w)),(h=-1<o?l[o]:null)&&mi(h))}function mi(o){if(typeof o!="number"&&o&&!o.da){var l=o.src;if(l&&l[Vr])hi(l.i,o);else{var h=o.type,p=o.proxy;l.removeEventListener?l.removeEventListener(h,p,o.capture):l.detachEvent?l.detachEvent(Ha(h),p):l.addListener&&l.removeListener&&l.removeListener(p),(h=gi(l))?(hi(h,o),h.h==0&&(h.src=null,l[fi]=null)):Mr(o)}}}function Ha(o){return o in pi?pi[o]:pi[o]="on"+o}function Qf(o,l){if(o.da)o=!0;else{l=new On(l,this);var h=o.listener,p=o.ha||o.src;o.fa&&mi(o),o=h.call(p,l)}return o}function gi(o){return o=o[fi],o instanceof Lr?o:null}var _i="__closure_events_fn_"+(1e9*Math.random()>>>0);function Wa(o){return typeof o=="function"?o:(o[_i]||(o[_i]=function(l){return o.handleEvent(l)}),o[_i])}function _e(){dt.call(this),this.i=new Lr(this),this.M=this,this.F=null}S(_e,dt),_e.prototype[Vr]=!0,_e.prototype.removeEventListener=function(o,l,h,p){za(this,o,l,h,p)};function Ae(o,l){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=l.type||l,typeof l=="string")l=new ge(l,o);else if(l instanceof ge)l.target=l.target||o;else{var w=l;l=new ge(p,o),I(l,w)}if(w=!0,h)for(var b=h.length-1;0<=b;b--){var O=l.g=h[b];w=xr(O,p,!0,l)&&w}if(O=l.g=o,w=xr(O,p,!0,l)&&w,w=xr(O,p,!1,l)&&w,h)for(b=0;b<h.length;b++)O=l.g=h[b],w=xr(O,p,!1,l)&&w}_e.prototype.N=function(){if(_e.aa.N.call(this),this.i){var o=this.i,l;for(l in o.g){for(var h=o.g[l],p=0;p<h.length;p++)Mr(h[p]);delete o.g[l],o.h--}}this.F=null},_e.prototype.K=function(o,l,h,p){return this.i.add(String(o),l,!1,h,p)},_e.prototype.L=function(o,l,h,p){return this.i.add(String(o),l,!0,h,p)};function xr(o,l,h,p){if(l=o.i.g[String(l)],!l)return!0;l=l.concat();for(var w=!0,b=0;b<l.length;++b){var O=l[b];if(O&&!O.da&&O.capture==h){var X=O.listener,ue=O.ha||O.src;O.fa&&hi(o.i,O),w=X.call(ue,p)!==!1&&w}}return w&&!p.defaultPrevented}function Ka(o,l,h){if(typeof o=="function")h&&(o=y(o,h));else if(o&&typeof o.handleEvent=="function")o=y(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(o,l||0)}function Ga(o){o.g=Ka(()=>{o.g=null,o.i&&(o.i=!1,Ga(o))},o.l);const l=o.h;o.h=null,o.m.apply(null,l)}class Yf extends dt{constructor(l,h){super(),this.m=l,this.l=h,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Ga(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Nn(o){dt.call(this),this.h=o,this.g={}}S(Nn,dt);var Qa=[];function Ya(o){z(o.g,function(l,h){this.g.hasOwnProperty(h)&&mi(l)},o),o.g={}}Nn.prototype.N=function(){Nn.aa.N.call(this),Ya(this)},Nn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var yi=c.JSON.stringify,Jf=c.JSON.parse,Xf=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function vi(){}vi.prototype.h=null;function Ja(o){return o.h||(o.h=o.i())}function Xa(){}var Vn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ei(){ge.call(this,"d")}S(Ei,ge);function Ii(){ge.call(this,"c")}S(Ii,ge);var Mt={},Za=null;function Fr(){return Za=Za||new _e}Mt.La="serverreachability";function ec(o){ge.call(this,Mt.La,o)}S(ec,ge);function Mn(o){const l=Fr();Ae(l,new ec(l))}Mt.STAT_EVENT="statevent";function tc(o,l){ge.call(this,Mt.STAT_EVENT,o),this.stat=l}S(tc,ge);function Re(o){const l=Fr();Ae(l,new tc(l,o))}Mt.Ma="timingevent";function nc(o,l){ge.call(this,Mt.Ma,o),this.size=l}S(nc,ge);function Ln(o,l){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},l)}function xn(){this.g=!0}xn.prototype.xa=function(){this.g=!1};function Zf(o,l,h,p,w,b){o.info(function(){if(o.g)if(b)for(var O="",X=b.split("&"),ue=0;ue<X.length;ue++){var G=X[ue].split("=");if(1<G.length){var ye=G[0];G=G[1];var ve=ye.split("_");O=2<=ve.length&&ve[1]=="type"?O+(ye+"="+G+"&"):O+(ye+"=redacted&")}}else O=null;else O=b;return"XMLHTTP REQ ("+p+") [attempt "+w+"]: "+l+`
`+h+`
`+O})}function ep(o,l,h,p,w,b,O){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+w+"]: "+l+`
`+h+`
`+b+" "+O})}function nn(o,l,h,p){o.info(function(){return"XMLHTTP TEXT ("+l+"): "+np(o,h)+(p?" "+p:"")})}function tp(o,l){o.info(function(){return"TIMEOUT: "+l})}xn.prototype.info=function(){};function np(o,l){if(!o.g)return l;if(!l)return null;try{var h=JSON.parse(l);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var w=p[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var O=1;O<w.length;O++)w[O]=""}}}}return yi(h)}catch{return l}}var Ur={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},rc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ti;function Br(){}S(Br,vi),Br.prototype.g=function(){return new XMLHttpRequest},Br.prototype.i=function(){return{}},Ti=new Br;function ft(o,l,h,p){this.j=o,this.i=l,this.l=h,this.R=p||1,this.U=new Nn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new sc}function sc(){this.i=null,this.g="",this.h=!1}var ic={},wi={};function Ai(o,l,h){o.L=1,o.v=zr(et(l)),o.m=h,o.P=!0,oc(o,null)}function oc(o,l){o.F=Date.now(),qr(o),o.A=et(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Ec(h.i,"t",p),o.C=0,h=o.j.J,o.h=new sc,o.g=Fc(o.j,h?l:null,!o.m),0<o.O&&(o.M=new Yf(y(o.Y,o,o.g),o.O)),l=o.U,h=o.g,p=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(Qa[0]=w.toString()),w=Qa);for(var b=0;b<w.length;b++){var O=$a(h,w[b],p||l.handleEvent,!1,l.h||l);if(!O)break;l.g[O.key]=O}l=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,l)):(o.u="GET",o.g.ea(o.A,o.u,null,l)),Mn(),Zf(o.i,o.u,o.A,o.l,o.R,o.m)}ft.prototype.ca=function(o){o=o.target;const l=this.M;l&&tt(o)==3?l.j():this.Y(o)},ft.prototype.Y=function(o){try{if(o==this.g)e:{const ve=tt(this.g);var l=this.g.Ba();const on=this.g.Z();if(!(3>ve)&&(ve!=3||this.g&&(this.h.h||this.g.oa()||Sc(this.g)))){this.J||ve!=4||l==7||(l==8||0>=on?Mn(3):Mn(2)),Ri(this);var h=this.g.Z();this.X=h;t:if(ac(this)){var p=Sc(this.g);o="";var w=p.length,b=tt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Lt(this),Fn(this);var O="";break t}this.h.i=new c.TextDecoder}for(l=0;l<w;l++)this.h.h=!0,o+=this.h.i.decode(p[l],{stream:!(b&&l==w-1)});p.length=0,this.h.g+=o,this.C=0,O=this.h.g}else O=this.g.oa();if(this.o=h==200,ep(this.i,this.u,this.A,this.l,this.R,ve,h),this.o){if(this.T&&!this.K){t:{if(this.g){var X,ue=this.g;if((X=ue.g?ue.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!F(X)){var G=X;break t}}G=null}if(h=G)nn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,bi(this,h);else{this.o=!1,this.s=3,Re(12),Lt(this),Fn(this);break e}}if(this.P){h=!0;let Ue;for(;!this.J&&this.C<O.length;)if(Ue=rp(this,O),Ue==wi){ve==4&&(this.s=4,Re(14),h=!1),nn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ue==ic){this.s=4,Re(15),nn(this.i,this.l,O,"[Invalid Chunk]"),h=!1;break}else nn(this.i,this.l,Ue,null),bi(this,Ue);if(ac(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ve!=4||O.length!=0||this.h.h||(this.s=1,Re(16),h=!1),this.o=this.o&&h,!h)nn(this.i,this.l,O,"[Invalid Chunked Response]"),Lt(this),Fn(this);else if(0<O.length&&!this.W){this.W=!0;var ye=this.j;ye.g==this&&ye.ba&&!ye.M&&(ye.j.info("Great, no buffering proxy detected. Bytes received: "+O.length),Oi(ye),ye.M=!0,Re(11))}}else nn(this.i,this.l,O,null),bi(this,O);ve==4&&Lt(this),this.o&&!this.J&&(ve==4?Vc(this.j,this):(this.o=!1,qr(this)))}else Ep(this.g),h==400&&0<O.indexOf("Unknown SID")?(this.s=3,Re(12)):(this.s=0,Re(13)),Lt(this),Fn(this)}}}catch{}finally{}};function ac(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function rp(o,l){var h=o.C,p=l.indexOf(`
`,h);return p==-1?wi:(h=Number(l.substring(h,p)),isNaN(h)?ic:(p+=1,p+h>l.length?wi:(l=l.slice(p,p+h),o.C=p+h,l)))}ft.prototype.cancel=function(){this.J=!0,Lt(this)};function qr(o){o.S=Date.now()+o.I,cc(o,o.I)}function cc(o,l){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Ln(y(o.ba,o),l)}function Ri(o){o.B&&(c.clearTimeout(o.B),o.B=null)}ft.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(tp(this.i,this.A),this.L!=2&&(Mn(),Re(17)),Lt(this),this.s=2,Fn(this)):cc(this,this.S-o)};function Fn(o){o.j.G==0||o.J||Vc(o.j,o)}function Lt(o){Ri(o);var l=o.M;l&&typeof l.ma=="function"&&l.ma(),o.M=null,Ya(o.U),o.g&&(l=o.g,o.g=null,l.abort(),l.ma())}function bi(o,l){try{var h=o.j;if(h.G!=0&&(h.g==o||Si(h.h,o))){if(!o.K&&Si(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var w=p;if(w[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Yr(h),Gr(h);else break e;Di(h),Re(18)}}else h.za=w[1],0<h.za-h.T&&37500>w[2]&&h.F&&h.v==0&&!h.C&&(h.C=Ln(y(h.Za,h),6e3));if(1>=hc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Ft(h,11)}else if((o.K||h.g==o)&&Yr(h),!F(l))for(w=h.Da.g.parse(l),l=0;l<w.length;l++){let G=w[l];if(h.T=G[0],G=G[1],h.G==2)if(G[0]=="c"){h.K=G[1],h.ia=G[2];const ye=G[3];ye!=null&&(h.la=ye,h.j.info("VER="+h.la));const ve=G[4];ve!=null&&(h.Aa=ve,h.j.info("SVER="+h.Aa));const on=G[5];on!=null&&typeof on=="number"&&0<on&&(p=1.5*on,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const Ue=o.g;if(Ue){const Xr=Ue.g?Ue.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xr){var b=p.h;b.g||Xr.indexOf("spdy")==-1&&Xr.indexOf("quic")==-1&&Xr.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Pi(b,b.h),b.h=null))}if(p.D){const Ni=Ue.g?Ue.g.getResponseHeader("X-HTTP-Session-Id"):null;Ni&&(p.ya=Ni,Z(p.I,p.D,Ni))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var O=o;if(p.qa=xc(p,p.J?p.ia:null,p.W),O.K){dc(p.h,O);var X=O,ue=p.L;ue&&(X.I=ue),X.B&&(Ri(X),qr(X)),p.g=O}else Oc(p);0<h.i.length&&Qr(h)}else G[0]!="stop"&&G[0]!="close"||Ft(h,7);else h.G==3&&(G[0]=="stop"||G[0]=="close"?G[0]=="stop"?Ft(h,7):ki(h):G[0]!="noop"&&h.l&&h.l.ta(G),h.v=0)}}Mn(4)}catch{}}var sp=class{constructor(o,l){this.g=o,this.map=l}};function uc(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function lc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function hc(o){return o.h?1:o.g?o.g.size:0}function Si(o,l){return o.h?o.h==l:o.g?o.g.has(l):!1}function Pi(o,l){o.g?o.g.add(l):o.h=l}function dc(o,l){o.h&&o.h==l?o.h=null:o.g&&o.g.has(l)&&o.g.delete(l)}uc.prototype.cancel=function(){if(this.i=fc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function fc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let l=o.i;for(const h of o.g.values())l=l.concat(h.D);return l}return k(o.i)}function ip(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(u(o)){for(var l=[],h=o.length,p=0;p<h;p++)l.push(o[p]);return l}l=[],h=0;for(p in o)l[h++]=o[p];return l}function op(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(u(o)||typeof o=="string"){var l=[];o=o.length;for(var h=0;h<o;h++)l.push(h);return l}l=[],h=0;for(const p in o)l[h++]=p;return l}}}function pc(o,l){if(o.forEach&&typeof o.forEach=="function")o.forEach(l,void 0);else if(u(o)||typeof o=="string")Array.prototype.forEach.call(o,l,void 0);else for(var h=op(o),p=ip(o),w=p.length,b=0;b<w;b++)l.call(void 0,p[b],h&&h[b],o)}var mc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ap(o,l){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),w=null;if(0<=p){var b=o[h].substring(0,p);w=o[h].substring(p+1)}else b=o[h];l(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function xt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof xt){this.h=o.h,jr(this,o.j),this.o=o.o,this.g=o.g,$r(this,o.s),this.l=o.l;var l=o.i,h=new qn;h.i=l.i,l.g&&(h.g=new Map(l.g),h.h=l.h),gc(this,h),this.m=o.m}else o&&(l=String(o).match(mc))?(this.h=!1,jr(this,l[1]||"",!0),this.o=Un(l[2]||""),this.g=Un(l[3]||"",!0),$r(this,l[4]),this.l=Un(l[5]||"",!0),gc(this,l[6]||"",!0),this.m=Un(l[7]||"")):(this.h=!1,this.i=new qn(null,this.h))}xt.prototype.toString=function(){var o=[],l=this.j;l&&o.push(Bn(l,_c,!0),":");var h=this.g;return(h||l=="file")&&(o.push("//"),(l=this.o)&&o.push(Bn(l,_c,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Bn(h,h.charAt(0)=="/"?lp:up,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Bn(h,dp)),o.join("")};function et(o){return new xt(o)}function jr(o,l,h){o.j=h?Un(l,!0):l,o.j&&(o.j=o.j.replace(/:$/,""))}function $r(o,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);o.s=l}else o.s=null}function gc(o,l,h){l instanceof qn?(o.i=l,fp(o.i,o.h)):(h||(l=Bn(l,hp)),o.i=new qn(l,o.h))}function Z(o,l,h){o.i.set(l,h)}function zr(o){return Z(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Un(o,l){return o?l?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Bn(o,l,h){return typeof o=="string"?(o=encodeURI(o).replace(l,cp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function cp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var _c=/[#\/\?@]/g,up=/[#\?:]/g,lp=/[#\?]/g,hp=/[#\?@]/g,dp=/#/g;function qn(o,l){this.h=this.g=null,this.i=o||null,this.j=!!l}function pt(o){o.g||(o.g=new Map,o.h=0,o.i&&ap(o.i,function(l,h){o.add(decodeURIComponent(l.replace(/\+/g," ")),h)}))}n=qn.prototype,n.add=function(o,l){pt(this),this.i=null,o=rn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(l),this.h+=1,this};function yc(o,l){pt(o),l=rn(o,l),o.g.has(l)&&(o.i=null,o.h-=o.g.get(l).length,o.g.delete(l))}function vc(o,l){return pt(o),l=rn(o,l),o.g.has(l)}n.forEach=function(o,l){pt(this),this.g.forEach(function(h,p){h.forEach(function(w){o.call(l,w,p,this)},this)},this)},n.na=function(){pt(this);const o=Array.from(this.g.values()),l=Array.from(this.g.keys()),h=[];for(let p=0;p<l.length;p++){const w=o[p];for(let b=0;b<w.length;b++)h.push(l[p])}return h},n.V=function(o){pt(this);let l=[];if(typeof o=="string")vc(this,o)&&(l=l.concat(this.g.get(rn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)l=l.concat(o[h])}return l},n.set=function(o,l){return pt(this),this.i=null,o=rn(this,o),vc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[l]),this.h+=1,this},n.get=function(o,l){return o?(o=this.V(o),0<o.length?String(o[0]):l):l};function Ec(o,l,h){yc(o,l),0<h.length&&(o.i=null,o.g.set(rn(o,l),k(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],l=Array.from(this.g.keys());for(var h=0;h<l.length;h++){var p=l[h];const b=encodeURIComponent(String(p)),O=this.V(p);for(p=0;p<O.length;p++){var w=b;O[p]!==""&&(w+="="+encodeURIComponent(String(O[p]))),o.push(w)}}return this.i=o.join("&")};function rn(o,l){return l=String(l),o.j&&(l=l.toLowerCase()),l}function fp(o,l){l&&!o.j&&(pt(o),o.i=null,o.g.forEach(function(h,p){var w=p.toLowerCase();p!=w&&(yc(this,p),Ec(this,w,h))},o)),o.j=l}function pp(o,l){const h=new xn;if(c.Image){const p=new Image;p.onload=R(mt,h,"TestLoadImage: loaded",!0,l,p),p.onerror=R(mt,h,"TestLoadImage: error",!1,l,p),p.onabort=R(mt,h,"TestLoadImage: abort",!1,l,p),p.ontimeout=R(mt,h,"TestLoadImage: timeout",!1,l,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else l(!1)}function mp(o,l){const h=new xn,p=new AbortController,w=setTimeout(()=>{p.abort(),mt(h,"TestPingServer: timeout",!1,l)},1e4);fetch(o,{signal:p.signal}).then(b=>{clearTimeout(w),b.ok?mt(h,"TestPingServer: ok",!0,l):mt(h,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(w),mt(h,"TestPingServer: error",!1,l)})}function mt(o,l,h,p,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),p(h)}catch{}}function gp(){this.g=new Xf}function _p(o,l,h){const p=h||"";try{pc(o,function(w,b){let O=w;d(w)&&(O=yi(w)),l.push(p+b+"="+encodeURIComponent(O))})}catch(w){throw l.push(p+"type="+encodeURIComponent("_badmap")),w}}function Hr(o){this.l=o.Ub||null,this.j=o.eb||!1}S(Hr,vi),Hr.prototype.g=function(){return new Wr(this.l,this.j)},Hr.prototype.i=(function(o){return function(){return o}})({});function Wr(o,l){_e.call(this),this.D=o,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(Wr,_e),n=Wr.prototype,n.open=function(o,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=l,this.readyState=1,$n(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(l.body=o),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,jn(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,$n(this)),this.g&&(this.readyState=3,$n(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ic(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ic(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var l=o.value?o.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!o.done}))&&(this.response=this.responseText+=l)}o.done?jn(this):$n(this),this.readyState==3&&Ic(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,jn(this))},n.Qa=function(o){this.g&&(this.response=o,jn(this))},n.ga=function(){this.g&&jn(this)};function jn(o){o.readyState=4,o.l=null,o.j=null,o.v=null,$n(o)}n.setRequestHeader=function(o,l){this.u.append(o,l)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],l=this.h.entries();for(var h=l.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=l.next();return o.join(`\r
`)};function $n(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Wr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Tc(o){let l="";return z(o,function(h,p){l+=p,l+=":",l+=h,l+=`\r
`}),l}function Ci(o,l,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Tc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):Z(o,l,h))}function ne(o){_e.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(ne,_e);var yp=/^https?$/i,vp=["POST","PUT"];n=ne.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,l,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);l=l?l.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ti.g(),this.v=this.o?Ja(this.o):Ja(Ti),this.g.onreadystatechange=y(this.Ea,this);try{this.B=!0,this.g.open(l,String(o),!0),this.B=!1}catch(b){wc(this,b);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var w in p)h.set(w,p[w]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const b of p.keys())h.set(b,p.get(b));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(b=>b.toLowerCase()=="content-type"),w=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(vp,l,void 0))||p||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,O]of h)this.g.setRequestHeader(b,O);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{bc(this),this.u=!0,this.g.send(o),this.u=!1}catch(b){wc(this,b)}};function wc(o,l){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=l,o.m=5,Ac(o),Kr(o)}function Ac(o){o.A||(o.A=!0,Ae(o,"complete"),Ae(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Ae(this,"complete"),Ae(this,"abort"),Kr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Kr(this,!0)),ne.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Rc(this):this.bb())},n.bb=function(){Rc(this)};function Rc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||tt(o)!=4||o.Z()!=2)){if(o.u&&tt(o)==4)Ka(o.Ea,0,o);else if(Ae(o,"readystatechange"),tt(o)==4){o.h=!1;try{const O=o.Z();e:switch(O){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var h;if(!(h=l)){var p;if(p=O===0){var w=String(o.D).match(mc)[1]||null;!w&&c.self&&c.self.location&&(w=c.self.location.protocol.slice(0,-1)),p=!yp.test(w?w.toLowerCase():"")}h=p}if(h)Ae(o,"complete"),Ae(o,"success");else{o.m=6;try{var b=2<tt(o)?o.g.statusText:""}catch{b=""}o.l=b+" ["+o.Z()+"]",Ac(o)}}finally{Kr(o)}}}}function Kr(o,l){if(o.g){bc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,l||Ae(o,"ready");try{h.onreadystatechange=p}catch{}}}function bc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function tt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<tt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var l=this.g.responseText;return o&&l.indexOf(o)==0&&(l=l.substring(o.length)),Jf(l)}};function Sc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Ep(o){const l={};o=(o.g&&2<=tt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(F(o[p]))continue;var h=T(o[p]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const b=l[w]||[];l[w]=b,b.push(h)}E(l,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function zn(o,l,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||l}function Pc(o){this.Aa=0,this.i=[],this.j=new xn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=zn("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=zn("baseRetryDelayMs",5e3,o),this.cb=zn("retryDelaySeedMs",1e4,o),this.Wa=zn("forwardChannelMaxRetries",2,o),this.wa=zn("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new uc(o&&o.concurrentRequestLimit),this.Da=new gp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Pc.prototype,n.la=8,n.G=1,n.connect=function(o,l,h,p){Re(0),this.W=o,this.H=l||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=xc(this,null,this.W),Qr(this)};function ki(o){if(Cc(o),o.G==3){var l=o.U++,h=et(o.I);if(Z(h,"SID",o.K),Z(h,"RID",l),Z(h,"TYPE","terminate"),Hn(o,h),l=new ft(o,o.j,l),l.L=2,l.v=zr(et(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=l.v,h=!0),h||(l.g=Fc(l.j,null),l.g.ea(l.v)),l.F=Date.now(),qr(l)}Lc(o)}function Gr(o){o.g&&(Oi(o),o.g.cancel(),o.g=null)}function Cc(o){Gr(o),o.u&&(c.clearTimeout(o.u),o.u=null),Yr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function Qr(o){if(!lc(o.h)&&!o.s){o.s=!0;var l=o.Ga;kn||ja(),Dn||(kn(),Dn=!0),li.add(l,o),o.B=0}}function Ip(o,l){return hc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=l.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Ln(y(o.Ga,o,l),Mc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new ft(this,this.j,o);let b=this.o;if(this.S&&(b?(b=g(b),I(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var l=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=h;break e}if(l===4096||h===this.i.length-1){l=h+1;break e}}l=1e3}else l=1e3;l=Dc(this,w,l),h=et(this.I),Z(h,"RID",o),Z(h,"CVER",22),this.D&&Z(h,"X-HTTP-Session-Id",this.D),Hn(this,h),b&&(this.O?l="headers="+encodeURIComponent(String(Tc(b)))+"&"+l:this.m&&Ci(h,this.m,b)),Pi(this.h,w),this.Ua&&Z(h,"TYPE","init"),this.P?(Z(h,"$req",l),Z(h,"SID","null"),w.T=!0,Ai(w,h,null)):Ai(w,h,l),this.G=2}}else this.G==3&&(o?kc(this,o):this.i.length==0||lc(this.h)||kc(this))};function kc(o,l){var h;l?h=l.l:h=o.U++;const p=et(o.I);Z(p,"SID",o.K),Z(p,"RID",h),Z(p,"AID",o.T),Hn(o,p),o.m&&o.o&&Ci(p,o.m,o.o),h=new ft(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),l&&(o.i=l.D.concat(o.i)),l=Dc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Pi(o.h,h),Ai(h,p,l)}function Hn(o,l){o.H&&z(o.H,function(h,p){Z(l,p,h)}),o.l&&pc({},function(h,p){Z(l,p,h)})}function Dc(o,l,h){h=Math.min(o.i.length,h);var p=o.l?y(o.l.Na,o.l,o):null;e:{var w=o.i;let b=-1;for(;;){const O=["count="+h];b==-1?0<h?(b=w[0].g,O.push("ofs="+b)):b=0:O.push("ofs="+b);let X=!0;for(let ue=0;ue<h;ue++){let G=w[ue].g;const ye=w[ue].map;if(G-=b,0>G)b=Math.max(0,w[ue].g-100),X=!1;else try{_p(ye,O,"req"+G+"_")}catch{p&&p(ye)}}if(X){p=O.join("&");break e}}}return o=o.i.splice(0,h),l.D=o,p}function Oc(o){if(!o.g&&!o.u){o.Y=1;var l=o.Fa;kn||ja(),Dn||(kn(),Dn=!0),li.add(l,o),o.v=0}}function Di(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Ln(y(o.Fa,o),Mc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Nc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Ln(y(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Re(10),Gr(this),Nc(this))};function Oi(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function Nc(o){o.g=new ft(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var l=et(o.qa);Z(l,"RID","rpc"),Z(l,"SID",o.K),Z(l,"AID",o.T),Z(l,"CI",o.F?"0":"1"),!o.F&&o.ja&&Z(l,"TO",o.ja),Z(l,"TYPE","xmlhttp"),Hn(o,l),o.m&&o.o&&Ci(l,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=zr(et(l)),h.m=null,h.P=!0,oc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Gr(this),Di(this),Re(19))};function Yr(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function Vc(o,l){var h=null;if(o.g==l){Yr(o),Oi(o),o.g=null;var p=2}else if(Si(o.h,l))h=l.D,dc(o.h,l),p=1;else return;if(o.G!=0){if(l.o)if(p==1){h=l.m?l.m.length:0,l=Date.now()-l.F;var w=o.B;p=Fr(),Ae(p,new nc(p,h)),Qr(o)}else Oc(o);else if(w=l.s,w==3||w==0&&0<l.X||!(p==1&&Ip(o,l)||p==2&&Di(o)))switch(h&&0<h.length&&(l=o.h,l.i=l.i.concat(h)),w){case 1:Ft(o,5);break;case 4:Ft(o,10);break;case 3:Ft(o,6);break;default:Ft(o,2)}}}function Mc(o,l){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*l}function Ft(o,l){if(o.j.info("Error code "+l),l==2){var h=y(o.fb,o),p=o.Xa;const w=!p;p=new xt(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||jr(p,"https"),zr(p),w?pp(p.toString(),h):mp(p.toString(),h)}else Re(2);o.G=0,o.l&&o.l.sa(l),Lc(o),Cc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Re(2)):(this.j.info("Failed to ping google.com"),Re(1))};function Lc(o){if(o.G=0,o.ka=[],o.l){const l=fc(o.h);(l.length!=0||o.i.length!=0)&&(C(o.ka,l),C(o.ka,o.i),o.h.i.length=0,k(o.i),o.i.length=0),o.l.ra()}}function xc(o,l,h){var p=h instanceof xt?et(h):new xt(h);if(p.g!="")l&&(p.g=l+"."+p.g),$r(p,p.s);else{var w=c.location;p=w.protocol,l=l?l+"."+w.hostname:w.hostname,w=+w.port;var b=new xt(null);p&&jr(b,p),l&&(b.g=l),w&&$r(b,w),h&&(b.l=h),p=b}return h=o.D,l=o.ya,h&&l&&Z(p,h,l),Z(p,"VER",o.la),Hn(o,p),p}function Fc(o,l,h){if(l&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=o.Ca&&!o.pa?new ne(new Hr({eb:h})):new ne(o.pa),l.Ha(o.J),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Uc(){}n=Uc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Jr(){}Jr.prototype.g=function(o,l){return new Oe(o,l)};function Oe(o,l){_e.call(this),this.g=new Pc(l),this.l=o,this.h=l&&l.messageUrlParams||null,o=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(o?o["X-WebChannel-Content-Type"]=l.messageContentType:o={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(o?o["X-WebChannel-Client-Profile"]=l.va:o={"X-WebChannel-Client-Profile":l.va}),this.g.S=o,(o=l&&l.Sb)&&!F(o)&&(this.g.m=o),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!F(l)&&(this.g.D=l,o=this.h,o!==null&&l in o&&(o=this.h,l in o&&delete o[l])),this.j=new sn(this)}S(Oe,_e),Oe.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Oe.prototype.close=function(){ki(this.g)},Oe.prototype.o=function(o){var l=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=yi(o),o=h);l.i.push(new sp(l.Ya++,o)),l.G==3&&Qr(l)},Oe.prototype.N=function(){this.g.l=null,delete this.j,ki(this.g),delete this.g,Oe.aa.N.call(this)};function Bc(o){Ei.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var l=o.__sm__;if(l){e:{for(const h in l){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,l=l!==null&&o in l?l[o]:void 0),this.data=l}else this.data=o}S(Bc,Ei);function qc(){Ii.call(this),this.status=1}S(qc,Ii);function sn(o){this.g=o}S(sn,Uc),sn.prototype.ua=function(){Ae(this.g,"a")},sn.prototype.ta=function(o){Ae(this.g,new Bc(o))},sn.prototype.sa=function(o){Ae(this.g,new qc)},sn.prototype.ra=function(){Ae(this.g,"b")},Jr.prototype.createWebChannel=Jr.prototype.g,Oe.prototype.send=Oe.prototype.o,Oe.prototype.open=Oe.prototype.m,Oe.prototype.close=Oe.prototype.close,Jh=function(){return new Jr},Yh=function(){return Fr()},Qh=Mt,go={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ur.NO_ERROR=0,Ur.TIMEOUT=8,Ur.HTTP_ERROR=6,ls=Ur,rc.COMPLETE="complete",Gh=rc,Xa.EventType=Vn,Vn.OPEN="a",Vn.CLOSE="b",Vn.ERROR="c",Vn.MESSAGE="d",_e.prototype.listen=_e.prototype.K,Yn=Xa,ne.prototype.listenOnce=ne.prototype.L,ne.prototype.getLastError=ne.prototype.Ka,ne.prototype.getLastErrorCode=ne.prototype.Ba,ne.prototype.getStatus=ne.prototype.Z,ne.prototype.getResponseJson=ne.prototype.Oa,ne.prototype.getResponseText=ne.prototype.oa,ne.prototype.send=ne.prototype.ea,ne.prototype.setWithCredentials=ne.prototype.Ha,Kh=ne}).apply(typeof ts<"u"?ts:typeof self<"u"?self:typeof window<"u"?window:{});const xu="@firebase/firestore";/**
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
 */class Ie{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ie.UNAUTHENTICATED=new Ie(null),Ie.GOOGLE_CREDENTIALS=new Ie("google-credentials-uid"),Ie.FIRST_PARTY=new Ie("first-party-uid"),Ie.MOCK_USER=new Ie("mock-user");/**
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
 */let Rn="10.14.0";/**
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
 */const Wt=new xs("@firebase/firestore");function Kn(){return Wt.logLevel}function V(n,...e){if(Wt.logLevel<=W.DEBUG){const t=e.map(Wo);Wt.debug(`Firestore (${Rn}): ${n}`,...t)}}function ut(n,...e){if(Wt.logLevel<=W.ERROR){const t=e.map(Wo);Wt.error(`Firestore (${Rn}): ${n}`,...t)}}function gn(n,...e){if(Wt.logLevel<=W.WARN){const t=e.map(Wo);Wt.warn(`Firestore (${Rn}): ${n}`,...t)}}function Wo(n){if(typeof n=="string")return n;try{/**
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
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function q(n="Unexpected state"){const e=`FIRESTORE (${Rn}) INTERNAL ASSERTION FAILED: `+n;throw ut(e),new Error(e)}function Y(n,e){n||q()}function $(n,e){return n}/**
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
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends Fe{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class ot{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Xh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class fv{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ie.UNAUTHENTICATED)))}shutdown(){}}class pv{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class mv{constructor(e){this.t=e,this.currentUser=Ie.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Y(this.o===void 0);let r=this.i;const s=u=>this.i!==r?(r=this.i,t(u)):Promise.resolve();let i=new ot;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ot,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ot)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Y(typeof r.accessToken=="string"),new Xh(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Y(e===null||typeof e=="string"),new Ie(e)}}class gv{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Ie.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class _v{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new gv(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable((()=>t(Ie.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class yv{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class vv{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Y(this.o===void 0);const r=i=>{i.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Y(typeof t.token=="string"),this.R=t.token,new yv(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Ev(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class Zh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Ev(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%e.length))}return r}}function Q(n,e){return n<e?-1:n>e?1:0}function _n(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
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
 */class ae{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ae.fromMillis(Date.now())}static fromDate(e){return ae.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ae(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?Q(this.nanoseconds,e.nanoseconds):Q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class j{constructor(e){this.timestamp=e}static fromTimestamp(e){return new j(e)}static min(){return new j(new ae(0,0))}static max(){return new j(new ae(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class dr{constructor(e,t,r){t===void 0?t=0:t>e.length&&q(),r===void 0?r=e.length-t:r>e.length-t&&q(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return dr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof dr?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=e.get(s),a=t.get(s);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ee extends dr{construct(e,t,r){return new ee(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(P.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new ee(t)}static emptyPath(){return new ee([])}}const Iv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class de extends dr{construct(e,t,r){return new de(e,t,r)}static isValidIdentifier(e){return Iv.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),de.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new de(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new N(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new N(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new N(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(i(),s++)}if(i(),a)throw new N(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new de(t)}static emptyPath(){return new de([])}}/**
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
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(ee.fromString(e))}static fromName(e){return new L(ee.fromString(e).popFirst(5))}static empty(){return new L(ee.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ee.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ee.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new ee(e.slice()))}}function Tv(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=j.fromTimestamp(r===1e9?new ae(t+1,0):new ae(t,r));return new Pt(s,L.empty(),e)}function wv(n){return new Pt(n.readTime,n.key,-1)}class Pt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Pt(j.min(),L.empty(),-1)}static max(){return new Pt(j.max(),L.empty(),-1)}}function Av(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:Q(n.largestBatchId,e.largestBatchId))}/**
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
 */const Rv="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class bv{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function br(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==Rv)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class D{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&q(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new D(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof D?t:D.resolve(t)}catch(t){return D.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):D.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):D.reject(t)}static resolve(e){return new D(((t,r)=>{t(e)}))}static reject(e){return new D(((t,r)=>{r(e)}))}static waitFor(e){return new D(((t,r)=>{let s=0,i=0,a=!1;e.forEach((c=>{++s,c.next((()=>{++i,a&&i===s&&t()}),(u=>r(u)))})),a=!0,i===s&&t()}))}static or(e){let t=D.resolve(!1);for(const r of e)t=t.next((s=>s?D.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new D(((r,s)=>{const i=e.length,a=new Array(i);let c=0;for(let u=0;u<i;u++){const d=u;t(e[d]).next((f=>{a[d]=f,++c,c===i&&r(a)}),(f=>s(f)))}}))}static doWhile(e,t){return new D(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function Sv(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Sr(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Ko{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ko.oe=-1;function $s(n){return n==null}function ws(n){return n===0&&1/n==-1/0}function Pv(n){return typeof n=="number"&&Number.isInteger(n)&&!ws(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function Fu(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function en(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function ed(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class te{constructor(e,t){this.comparator=e,this.root=t||le.EMPTY}insert(e,t){return new te(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,le.BLACK,null,null))}remove(e){return new te(this.comparator,this.root.remove(e,this.comparator).copy(null,null,le.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ns(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ns(this.root,e,this.comparator,!1)}getReverseIterator(){return new ns(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ns(this.root,e,this.comparator,!0)}}class ns{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class le{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??le.RED,this.left=s??le.EMPTY,this.right=i??le.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new le(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return le.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return le.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,le.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,le.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw q();const e=this.left.check();if(e!==this.right.check())throw q();return e+(this.isRed()?0:1)}}le.EMPTY=null,le.RED=!0,le.BLACK=!1;le.EMPTY=new class{constructor(){this.size=0}get key(){throw q()}get value(){throw q()}get color(){throw q()}get left(){throw q()}get right(){throw q()}copy(e,t,r,s,i){return this}insert(e,t,r){return new le(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class pe{constructor(e){this.comparator=e,this.data=new te(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Uu(this.data.getIterator())}getIteratorFrom(e){return new Uu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof pe)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new pe(this.comparator);return t.data=e,t}}class Uu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Ne{constructor(e){this.fields=e,e.sort(de.comparator)}static empty(){return new Ne([])}unionWith(e){let t=new pe(de.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Ne(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return _n(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
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
 */class td extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class me{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new td("Invalid base64 string: "+i):i}})(e);return new me(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new me(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}me.EMPTY_BYTE_STRING=new me("");const Cv=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ct(n){if(Y(!!n),typeof n=="string"){let e=0;const t=Cv.exec(n);if(Y(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:se(n.seconds),nanos:se(n.nanos)}}function se(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Kt(n){return typeof n=="string"?me.fromBase64String(n):me.fromUint8Array(n)}/**
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
 */function Go(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Qo(n){const e=n.mapValue.fields.__previous_value__;return Go(e)?Qo(e):e}function fr(n){const e=Ct(n.mapValue.fields.__local_write_time__.timestampValue);return new ae(e.seconds,e.nanos)}/**
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
 */class kv{constructor(e,t,r,s,i,a,c,u,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=d}}class pr{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new pr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof pr&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const rs={mapValue:{}};function Gt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Go(n)?4:Ov(n)?9007199254740991:Dv(n)?10:11:q()}function Ye(n,e){if(n===e)return!0;const t=Gt(n);if(t!==Gt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return fr(n).isEqual(fr(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=Ct(s.timestampValue),c=Ct(i.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(s,i){return Kt(s.bytesValue).isEqual(Kt(i.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(s,i){return se(s.geoPointValue.latitude)===se(i.geoPointValue.latitude)&&se(s.geoPointValue.longitude)===se(i.geoPointValue.longitude)})(n,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return se(s.integerValue)===se(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=se(s.doubleValue),c=se(i.doubleValue);return a===c?ws(a)===ws(c):isNaN(a)&&isNaN(c)}return!1})(n,e);case 9:return _n(n.arrayValue.values||[],e.arrayValue.values||[],Ye);case 10:case 11:return(function(s,i){const a=s.mapValue.fields||{},c=i.mapValue.fields||{};if(Fu(a)!==Fu(c))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(c[u]===void 0||!Ye(a[u],c[u])))return!1;return!0})(n,e);default:return q()}}function mr(n,e){return(n.values||[]).find((t=>Ye(t,e)))!==void 0}function yn(n,e){if(n===e)return 0;const t=Gt(n),r=Gt(e);if(t!==r)return Q(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return Q(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const c=se(i.integerValue||i.doubleValue),u=se(a.integerValue||a.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return Bu(n.timestampValue,e.timestampValue);case 4:return Bu(fr(n),fr(e));case 5:return Q(n.stringValue,e.stringValue);case 6:return(function(i,a){const c=Kt(i),u=Kt(a);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const c=i.split("/"),u=a.split("/");for(let d=0;d<c.length&&d<u.length;d++){const f=Q(c[d],u[d]);if(f!==0)return f}return Q(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const c=Q(se(i.latitude),se(a.latitude));return c!==0?c:Q(se(i.longitude),se(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return qu(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var c,u,d,f;const m=i.fields||{},y=a.fields||{},R=(c=m.value)===null||c===void 0?void 0:c.arrayValue,S=(u=y.value)===null||u===void 0?void 0:u.arrayValue,k=Q(((d=R?.values)===null||d===void 0?void 0:d.length)||0,((f=S?.values)===null||f===void 0?void 0:f.length)||0);return k!==0?k:qu(R,S)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===rs.mapValue&&a===rs.mapValue)return 0;if(i===rs.mapValue)return 1;if(a===rs.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),d=a.fields||{},f=Object.keys(d);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const y=Q(u[m],f[m]);if(y!==0)return y;const R=yn(c[u[m]],d[f[m]]);if(R!==0)return R}return Q(u.length,f.length)})(n.mapValue,e.mapValue);default:throw q()}}function Bu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Q(n,e);const t=Ct(n),r=Ct(e),s=Q(t.seconds,r.seconds);return s!==0?s:Q(t.nanos,r.nanos)}function qu(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=yn(t[s],r[s]);if(i)return i}return Q(t.length,r.length)}function vn(n){return _o(n)}function _o(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Ct(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Kt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return L.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=_o(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${_o(t.fields[a])}`;return s+"}"})(n.mapValue):q()}function ju(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function yo(n){return!!n&&"integerValue"in n}function Yo(n){return!!n&&"arrayValue"in n}function $u(n){return!!n&&"nullValue"in n}function zu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function hs(n){return!!n&&"mapValue"in n}function Dv(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function tr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return en(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=tr(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=tr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Ov(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class Ce{constructor(e){this.value=e}static empty(){return new Ce({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!hs(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tr(t)}setAll(e){let t=de.emptyPath(),r={},s=[];e.forEach(((a,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=tr(a):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());hs(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ye(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];hs(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){en(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new Ce(tr(this.value))}}function nd(n){const e=[];return en(n.fields,((t,r)=>{const s=new de([t]);if(hs(r)){const i=nd(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new Ne(e)}/**
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
 */class Te{constructor(e,t,r,s,i,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Te(e,0,j.min(),j.min(),j.min(),Ce.empty(),0)}static newFoundDocument(e,t,r,s){return new Te(e,1,t,j.min(),r,s,0)}static newNoDocument(e,t){return new Te(e,2,t,j.min(),j.min(),Ce.empty(),0)}static newUnknownDocument(e,t){return new Te(e,3,t,j.min(),j.min(),Ce.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(j.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ce.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ce.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=j.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Te&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Te(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class As{constructor(e,t){this.position=e,this.inclusive=t}}function Hu(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=yn(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Wu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ye(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class gr{constructor(e,t="asc"){this.field=e,this.dir=t}}function Nv(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */let rd=class{};class oe extends rd{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Mv(e,t,r):t==="array-contains"?new Fv(e,r):t==="in"?new Uv(e,r):t==="not-in"?new Bv(e,r):t==="array-contains-any"?new qv(e,r):new oe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Lv(e,r):new xv(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(yn(t,this.value)):t!==null&&Gt(this.value)===Gt(t)&&this.matchesComparison(yn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return q()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ze extends rd{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new ze(e,t)}matches(e){return sd(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function sd(n){return n.op==="and"}function id(n){return Vv(n)&&sd(n)}function Vv(n){for(const e of n.filters)if(e instanceof ze)return!1;return!0}function vo(n){if(n instanceof oe)return n.field.canonicalString()+n.op.toString()+vn(n.value);if(id(n))return n.filters.map((e=>vo(e))).join(",");{const e=n.filters.map((t=>vo(t))).join(",");return`${n.op}(${e})`}}function od(n,e){return n instanceof oe?(function(r,s){return s instanceof oe&&r.op===s.op&&r.field.isEqual(s.field)&&Ye(r.value,s.value)})(n,e):n instanceof ze?(function(r,s){return s instanceof ze&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,c)=>i&&od(a,s.filters[c])),!0):!1})(n,e):void q()}function ad(n){return n instanceof oe?(function(t){return`${t.field.canonicalString()} ${t.op} ${vn(t.value)}`})(n):n instanceof ze?(function(t){return t.op.toString()+" {"+t.getFilters().map(ad).join(" ,")+"}"})(n):"Filter"}class Mv extends oe{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class Lv extends oe{constructor(e,t){super(e,"in",t),this.keys=cd("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class xv extends oe{constructor(e,t){super(e,"not-in",t),this.keys=cd("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function cd(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((r=>L.fromName(r.referenceValue)))}class Fv extends oe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Yo(t)&&mr(t.arrayValue,this.value)}}class Uv extends oe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&mr(this.value.arrayValue,t)}}class Bv extends oe{constructor(e,t){super(e,"not-in",t)}matches(e){if(mr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!mr(this.value.arrayValue,t)}}class qv extends oe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Yo(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>mr(this.value.arrayValue,r)))}}/**
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
 */class jv{constructor(e,t=null,r=[],s=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=c,this.ue=null}}function Ku(n,e=null,t=[],r=[],s=null,i=null,a=null){return new jv(n,e,t,r,s,i,a)}function Jo(n){const e=$(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>vo(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),$s(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>vn(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>vn(r))).join(",")),e.ue=t}return e.ue}function Xo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Nv(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!od(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Wu(n.startAt,e.startAt)&&Wu(n.endAt,e.endAt)}function Eo(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class bn{constructor(e,t=null,r=[],s=[],i=null,a="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function $v(n,e,t,r,s,i,a,c){return new bn(n,e,t,r,s,i,a,c)}function zs(n){return new bn(n)}function Gu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function ud(n){return n.collectionGroup!==null}function nr(n){const e=$(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new pe(de.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((d=>{d.isInequality()&&(c=c.add(d.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new gr(i,r))})),t.has(de.keyField().canonicalString())||e.ce.push(new gr(de.keyField(),r))}return e.ce}function Ge(n){const e=$(n);return e.le||(e.le=zv(e,nr(n))),e.le}function zv(n,e){if(n.limitType==="F")return Ku(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new gr(s.field,i)}));const t=n.endAt?new As(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new As(n.startAt.position,n.startAt.inclusive):null;return Ku(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Io(n,e){const t=n.filters.concat([e]);return new bn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Rs(n,e,t){return new bn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Hs(n,e){return Xo(Ge(n),Ge(e))&&n.limitType===e.limitType}function ld(n){return`${Jo(Ge(n))}|lt:${n.limitType}`}function an(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>ad(s))).join(", ")}]`),$s(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>vn(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>vn(s))).join(",")),`Target(${r})`})(Ge(n))}; limitType=${n.limitType})`}function Ws(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):L.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of nr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,c,u){const d=Hu(a,c,u);return a.inclusive?d<=0:d<0})(r.startAt,nr(r),s)||r.endAt&&!(function(a,c,u){const d=Hu(a,c,u);return a.inclusive?d>=0:d>0})(r.endAt,nr(r),s))})(n,e)}function Hv(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function hd(n){return(e,t)=>{let r=!1;for(const s of nr(n)){const i=Wv(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function Wv(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):(function(i,a,c){const u=a.data.field(i),d=c.data.field(i);return u!==null&&d!==null?yn(u,d):q()})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return q()}}/**
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
 */class Sn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){en(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return ed(this.inner)}size(){return this.innerSize}}/**
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
 */const Kv=new te(L.comparator);function lt(){return Kv}const dd=new te(L.comparator);function Jn(...n){let e=dd;for(const t of n)e=e.insert(t.key,t);return e}function fd(n){let e=dd;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Bt(){return rr()}function pd(){return rr()}function rr(){return new Sn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const Gv=new te(L.comparator),Qv=new pe(L.comparator);function H(...n){let e=Qv;for(const t of n)e=e.add(t);return e}const Yv=new pe(Q);function Jv(){return Yv}/**
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
 */function Zo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ws(e)?"-0":e}}function md(n){return{integerValue:""+n}}function gd(n,e){return Pv(e)?md(e):Zo(n,e)}/**
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
 */class Ks{constructor(){this._=void 0}}function Xv(n,e,t){return n instanceof bs?(function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Go(i)&&(i=Qo(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}})(t,e):n instanceof _r?yd(n,e):n instanceof yr?vd(n,e):(function(s,i){const a=_d(s,i),c=Qu(a)+Qu(s.Pe);return yo(a)&&yo(s.Pe)?md(c):Zo(s.serializer,c)})(n,e)}function Zv(n,e,t){return n instanceof _r?yd(n,e):n instanceof yr?vd(n,e):t}function _d(n,e){return n instanceof vr?(function(r){return yo(r)||(function(i){return!!i&&"doubleValue"in i})(r)})(e)?e:{integerValue:0}:null}class bs extends Ks{}class _r extends Ks{constructor(e){super(),this.elements=e}}function yd(n,e){const t=Ed(e);for(const r of n.elements)t.some((s=>Ye(s,r)))||t.push(r);return{arrayValue:{values:t}}}class yr extends Ks{constructor(e){super(),this.elements=e}}function vd(n,e){let t=Ed(e);for(const r of n.elements)t=t.filter((s=>!Ye(s,r)));return{arrayValue:{values:t}}}class vr extends Ks{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Qu(n){return se(n.integerValue||n.doubleValue)}function Ed(n){return Yo(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class eE{constructor(e,t){this.field=e,this.transform=t}}function tE(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof _r&&s instanceof _r||r instanceof yr&&s instanceof yr?_n(r.elements,s.elements,Ye):r instanceof vr&&s instanceof vr?Ye(r.Pe,s.Pe):r instanceof bs&&s instanceof bs})(n.transform,e.transform)}class nE{constructor(e,t){this.version=e,this.transformResults=t}}class qe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new qe}static exists(e){return new qe(void 0,e)}static updateTime(e){return new qe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ds(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Gs{}function Id(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new ea(n.key,qe.none()):new Pr(n.key,n.data,qe.none());{const t=n.data,r=Ce.empty();let s=new pe(de.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new Vt(n.key,r,new Ne(s.toArray()),qe.none())}}function rE(n,e,t){n instanceof Pr?(function(s,i,a){const c=s.value.clone(),u=Ju(s.fieldTransforms,i,a.transformResults);c.setAll(u),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):n instanceof Vt?(function(s,i,a){if(!ds(s.precondition,i))return void i.convertToUnknownDocument(a.version);const c=Ju(s.fieldTransforms,i,a.transformResults),u=i.data;u.setAll(Td(s)),u.setAll(c),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function sr(n,e,t,r){return n instanceof Pr?(function(i,a,c,u){if(!ds(i.precondition,a))return c;const d=i.value.clone(),f=Xu(i.fieldTransforms,u,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,r):n instanceof Vt?(function(i,a,c,u){if(!ds(i.precondition,a))return c;const d=Xu(i.fieldTransforms,u,a),f=a.data;return f.setAll(Td(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,r):(function(i,a,c){return ds(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c})(n,e,t)}function sE(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=_d(r.transform,s||null);i!=null&&(t===null&&(t=Ce.empty()),t.set(r.field,i))}return t||null}function Yu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&_n(r,s,((i,a)=>tE(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Pr extends Gs{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Vt extends Gs{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Td(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Ju(n,e,t){const r=new Map;Y(n.length===t.length);for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,c=e.data.field(i.field);r.set(i.field,Zv(a,c,t[s]))}return r}function Xu(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,Xv(i,a,e))}return r}class ea extends Gs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class iE extends Gs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class oE{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&rE(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=sr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=sr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=pd();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(s.key)?null:c;const u=Id(a,c);u!==null&&r.set(s.key,u),a.isValidDocument()||a.convertToNoDocument(j.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),H())}isEqual(e){return this.batchId===e.batchId&&_n(this.mutations,e.mutations,((t,r)=>Yu(t,r)))&&_n(this.baseMutations,e.baseMutations,((t,r)=>Yu(t,r)))}}class ta{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Y(e.mutations.length===r.length);let s=(function(){return Gv})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new ta(e,t,r,s)}}/**
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
 */class aE{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class cE{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var ie,K;function uE(n){switch(n){default:return q();case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0}}function wd(n){if(n===void 0)return ut("GRPC error has no .code"),P.UNKNOWN;switch(n){case ie.OK:return P.OK;case ie.CANCELLED:return P.CANCELLED;case ie.UNKNOWN:return P.UNKNOWN;case ie.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case ie.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case ie.INTERNAL:return P.INTERNAL;case ie.UNAVAILABLE:return P.UNAVAILABLE;case ie.UNAUTHENTICATED:return P.UNAUTHENTICATED;case ie.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case ie.NOT_FOUND:return P.NOT_FOUND;case ie.ALREADY_EXISTS:return P.ALREADY_EXISTS;case ie.PERMISSION_DENIED:return P.PERMISSION_DENIED;case ie.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case ie.ABORTED:return P.ABORTED;case ie.OUT_OF_RANGE:return P.OUT_OF_RANGE;case ie.UNIMPLEMENTED:return P.UNIMPLEMENTED;case ie.DATA_LOSS:return P.DATA_LOSS;default:return q()}}(K=ie||(ie={}))[K.OK=0]="OK",K[K.CANCELLED=1]="CANCELLED",K[K.UNKNOWN=2]="UNKNOWN",K[K.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",K[K.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",K[K.NOT_FOUND=5]="NOT_FOUND",K[K.ALREADY_EXISTS=6]="ALREADY_EXISTS",K[K.PERMISSION_DENIED=7]="PERMISSION_DENIED",K[K.UNAUTHENTICATED=16]="UNAUTHENTICATED",K[K.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",K[K.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",K[K.ABORTED=10]="ABORTED",K[K.OUT_OF_RANGE=11]="OUT_OF_RANGE",K[K.UNIMPLEMENTED=12]="UNIMPLEMENTED",K[K.INTERNAL=13]="INTERNAL",K[K.UNAVAILABLE=14]="UNAVAILABLE",K[K.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function lE(){return new TextEncoder}/**
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
 */const hE=new $t([4294967295,4294967295],0);function Zu(n){const e=lE().encode(n),t=new Wh;return t.update(e),new Uint8Array(t.digest())}function el(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new $t([t,r],0),new $t([s,i],0)]}class na{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Xn(`Invalid padding: ${t}`);if(r<0)throw new Xn(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Xn(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Xn(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=$t.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply($t.fromNumber(r)));return s.compare(hE)===1&&(s=new $t([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Zu(e),[r,s]=el(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new na(i,s,t);return r.forEach((c=>a.insert(c))),a}insert(e){if(this.Ie===0)return;const t=Zu(e),[r,s]=el(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Xn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Qs{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Cr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Qs(j.min(),s,new te(Q),lt(),H())}}class Cr{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Cr(r,t,H(),H(),H())}}/**
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
 */class fs{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class Ad{constructor(e,t){this.targetId=e,this.me=t}}class Rd{constructor(e,t,r=me.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class tl{constructor(){this.fe=0,this.ge=rl(),this.pe=me.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=H(),t=H(),r=H();return this.ge.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:q()}})),new Cr(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=rl()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Y(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class dE{constructor(e){this.Le=e,this.Be=new Map,this.ke=lt(),this.qe=nl(),this.Qe=new te(Q)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,(t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:q()}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach(((r,s)=>{this.ze(s)&&t(s)}))}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const i=s.target;if(Eo(i))if(r===0){const a=new L(i.path);this.Ue(t,a,Te.newNoDocument(a,j.min()))}else Y(r===1);else{const a=this.Ye(t);if(a!==r){const c=this.Ze(e),u=c?this.Xe(c,e,a):1;if(u!==0){this.je(t);const d=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,c;try{a=Kt(r).toUint8Array()}catch(u){if(u instanceof td)return gn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new na(a,s,i)}catch(u){return gn(u instanceof Xn?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.Ie===0?null:c}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.Le.tt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,i,null),s++)})),s}rt(e){const t=new Map;this.Be.forEach(((i,a)=>{const c=this.Je(a);if(c){if(i.current&&Eo(c.target)){const u=new L(c.target.path);this.ke.get(u)!==null||this.it(a,u)||this.Ue(a,u,Te.newNoDocument(u,e))}i.be&&(t.set(a,i.ve()),i.Ce())}}));let r=H();this.qe.forEach(((i,a)=>{let c=!0;a.forEachWhile((u=>{const d=this.Je(u);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.ke.forEach(((i,a)=>a.setReadTime(e)));const s=new Qs(e,t,this.Qe,this.ke,r);return this.ke=lt(),this.qe=nl(),this.Qe=new te(Q),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new tl,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new pe(Q),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||V("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new tl),this.Le.getRemoteKeysForTarget(e).forEach((t=>{this.Ue(e,t,null)}))}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function nl(){return new te(L.comparator)}function rl(){return new te(L.comparator)}const fE={asc:"ASCENDING",desc:"DESCENDING"},pE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},mE={and:"AND",or:"OR"};class gE{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function To(n,e){return n.useProto3Json||$s(e)?e:{value:e}}function Ss(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function bd(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function _E(n,e){return Ss(n,e.toTimestamp())}function Qe(n){return Y(!!n),j.fromTimestamp((function(t){const r=Ct(t);return new ae(r.seconds,r.nanos)})(n))}function ra(n,e){return wo(n,e).canonicalString()}function wo(n,e){const t=(function(s){return new ee(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Sd(n){const e=ee.fromString(n);return Y(Od(e)),e}function Ao(n,e){return ra(n.databaseId,e.path)}function Wi(n,e){const t=Sd(e);if(t.get(1)!==n.databaseId.projectId)throw new N(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new N(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Cd(t))}function Pd(n,e){return ra(n.databaseId,e)}function yE(n){const e=Sd(n);return e.length===4?ee.emptyPath():Cd(e)}function Ro(n){return new ee(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Cd(n){return Y(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function sl(n,e,t){return{name:Ao(n,e),fields:t.value.mapValue.fields}}function vE(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:q()})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(d,f){return d.useProto3Json?(Y(f===void 0||typeof f=="string"),me.fromBase64String(f||"")):(Y(f===void 0||f instanceof Buffer||f instanceof Uint8Array),me.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&(function(d){const f=d.code===void 0?P.UNKNOWN:wd(d.code);return new N(f,d.message||"")})(a);t=new Rd(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Wi(n,r.document.name),i=Qe(r.document.updateTime),a=r.document.createTime?Qe(r.document.createTime):j.min(),c=new Ce({mapValue:{fields:r.document.fields}}),u=Te.newFoundDocument(s,i,a,c),d=r.targetIds||[],f=r.removedTargetIds||[];t=new fs(d,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Wi(n,r.document),i=r.readTime?Qe(r.readTime):j.min(),a=Te.newNoDocument(s,i),c=r.removedTargetIds||[];t=new fs([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Wi(n,r.document),i=r.removedTargetIds||[];t=new fs([],i,s,null)}else{if(!("filter"in e))return q();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new cE(s,i),c=r.targetId;t=new Ad(c,a)}}return t}function EE(n,e){let t;if(e instanceof Pr)t={update:sl(n,e.key,e.value)};else if(e instanceof ea)t={delete:Ao(n,e.key)};else if(e instanceof Vt)t={update:sl(n,e.key,e.data),updateMask:CE(e.fieldMask)};else{if(!(e instanceof iE))return q();t={verify:Ao(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const c=a.transform;if(c instanceof bs)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof _r)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof yr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof vr)return{fieldPath:a.field.canonicalString(),increment:c.Pe};throw q()})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:_E(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:q()})(n,e.precondition)),t}function IE(n,e){return n&&n.length>0?(Y(e!==void 0),n.map((t=>(function(s,i){let a=s.updateTime?Qe(s.updateTime):Qe(i);return a.isEqual(j.min())&&(a=Qe(i)),new nE(a,s.transformResults||[])})(t,e)))):[]}function TE(n,e){return{documents:[Pd(n,e.path)]}}function wE(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Pd(n,s);const i=(function(d){if(d.length!==0)return Dd(ze.create(d,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(d){if(d.length!==0)return d.map((f=>(function(y){return{field:cn(y.field),direction:bE(y.dir)}})(f)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=To(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{_t:t,parent:s}}function AE(n){let e=yE(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Y(r===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(m){const y=kd(m);return y instanceof ze&&id(y)?y.getFilters():[y]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((y=>(function(S){return new gr(un(S.field),(function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(S.direction))})(y)))})(t.orderBy));let c=null;t.limit&&(c=(function(m){let y;return y=typeof m=="object"?m.value:m,$s(y)?null:y})(t.limit));let u=null;t.startAt&&(u=(function(m){const y=!!m.before,R=m.values||[];return new As(R,y)})(t.startAt));let d=null;return t.endAt&&(d=(function(m){const y=!m.before,R=m.values||[];return new As(R,y)})(t.endAt)),$v(e,s,a,i,c,"F",u,d)}function RE(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return q()}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function kd(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=un(t.unaryFilter.field);return oe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=un(t.unaryFilter.field);return oe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=un(t.unaryFilter.field);return oe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=un(t.unaryFilter.field);return oe.create(a,"!=",{nullValue:"NULL_VALUE"});default:return q()}})(n):n.fieldFilter!==void 0?(function(t){return oe.create(un(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return q()}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return ze.create(t.compositeFilter.filters.map((r=>kd(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return q()}})(t.compositeFilter.op))})(n):q()}function bE(n){return fE[n]}function SE(n){return pE[n]}function PE(n){return mE[n]}function cn(n){return{fieldPath:n.canonicalString()}}function un(n){return de.fromServerFormat(n.fieldPath)}function Dd(n){return n instanceof oe?(function(t){if(t.op==="=="){if(zu(t.value))return{unaryFilter:{field:cn(t.field),op:"IS_NAN"}};if($u(t.value))return{unaryFilter:{field:cn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(zu(t.value))return{unaryFilter:{field:cn(t.field),op:"IS_NOT_NAN"}};if($u(t.value))return{unaryFilter:{field:cn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:cn(t.field),op:SE(t.op),value:t.value}}})(n):n instanceof ze?(function(t){const r=t.getFilters().map((s=>Dd(s)));return r.length===1?r[0]:{compositeFilter:{op:PE(t.op),filters:r}}})(n):q()}function CE(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Od(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class Tt{constructor(e,t,r,s,i=j.min(),a=j.min(),c=me.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Tt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class kE{constructor(e){this.ct=e}}function DE(n){const e=AE({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Rs(e,e.limit,"L"):e}/**
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
 */class OE{constructor(){this.un=new NE}addToCollectionParentIndex(e,t){return this.un.add(t),D.resolve()}getCollectionParents(e,t){return D.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return D.resolve()}deleteFieldIndex(e,t){return D.resolve()}deleteAllFieldIndexes(e){return D.resolve()}createTargetIndexes(e,t){return D.resolve()}getDocumentsMatchingTarget(e,t){return D.resolve(null)}getIndexType(e,t){return D.resolve(0)}getFieldIndexes(e,t){return D.resolve([])}getNextCollectionGroupToUpdate(e){return D.resolve(null)}getMinOffset(e,t){return D.resolve(Pt.min())}getMinOffsetFromCollectionGroup(e,t){return D.resolve(Pt.min())}updateCollectionGroup(e,t,r){return D.resolve()}updateIndexEntries(e,t){return D.resolve()}}class NE{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new pe(ee.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new pe(ee.comparator)).toArray()}}/**
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
 */class En{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new En(0)}static kn(){return new En(-1)}}/**
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
 */class VE{constructor(){this.changes=new Sn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Te.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?D.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class ME{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class LE{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&sr(r.mutation,s,Ne.empty(),ae.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,H()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=H()){const s=Bt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=Jn();return i.forEach(((c,u)=>{a=a.insert(c,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Bt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,H())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,c)=>{t.set(a,c)}))}))}computeViews(e,t,r,s){let i=lt();const a=rr(),c=(function(){return rr()})();return t.forEach(((u,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof Vt)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),sr(f.mutation,d,f.mutation.getFieldMask(),ae.now())):a.set(d.key,Ne.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((d,f)=>a.set(d,f))),t.forEach(((d,f)=>{var m;return c.set(d,new ME(f,(m=a.get(d))!==null&&m!==void 0?m:null))})),c)))}recalculateAndSaveOverlays(e,t){const r=rr();let s=new te(((a,c)=>a-c)),i=H();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const c of a)c.keys().forEach((u=>{const d=t.get(u);if(d===null)return;let f=r.get(u)||Ne.empty();f=c.applyToLocalView(d,f),r.set(u,f);const m=(s.get(c.batchId)||H()).add(u);s=s.insert(c.batchId,m)}))})).next((()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),d=u.key,f=u.value,m=pd();f.forEach((y=>{if(!i.has(y)){const R=Id(t.get(y),r.get(y));R!==null&&m.set(y,R),i=i.add(y)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return D.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return(function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ud(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):D.resolve(Bt());let c=-1,u=i;return a.next((d=>D.forEach(d,((f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(f)?D.resolve():this.remoteDocumentCache.getEntry(e,f).next((y=>{u=u.insert(f,y)}))))).next((()=>this.populateOverlays(e,d,i))).next((()=>this.computeViews(e,u,d,H()))).next((f=>({batchId:c,changes:fd(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next((r=>{let s=Jn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Jn();return this.indexManager.getCollectionParents(e,i).next((c=>D.forEach(c,(u=>{const d=(function(m,y){return new bn(y,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next((f=>{f.forEach(((m,y)=>{a=a.insert(m,y)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>{i.forEach(((u,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Te.newInvalidDocument(f)))}));let c=Jn();return a.forEach(((u,d)=>{const f=i.get(u);f!==void 0&&sr(f.mutation,d,Ne.empty(),ae.now()),Ws(t,d)&&(c=c.insert(u,d))})),c}))}}/**
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
 */class xE{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return D.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Qe(s.createTime)}})(t)),D.resolve()}getNamedQuery(e,t){return D.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,(function(s){return{name:s.name,query:DE(s.bundledQuery),readTime:Qe(s.readTime)}})(t)),D.resolve()}}/**
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
 */class FE{constructor(){this.overlays=new te(L.comparator),this.Ir=new Map}getOverlay(e,t){return D.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Bt();return D.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.ht(e,t,i)})),D.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ir.delete(r)),D.resolve()}getOverlaysForCollection(e,t,r){const s=Bt(),i=t.length+1,a=new L(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const u=c.getNext().value,d=u.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return D.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new te(((d,f)=>d-f));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=Bt(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const c=Bt(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((d,f)=>c.set(d,f))),!(c.size()>=s)););return D.resolve(c)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new aE(t,r));let i=this.Ir.get(t);i===void 0&&(i=H(),this.Ir.set(t,i)),this.Ir.set(t,i.add(r.key))}}/**
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
 */class UE{constructor(){this.sessionToken=me.EMPTY_BYTE_STRING}getSessionToken(e){return D.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,D.resolve()}}/**
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
 */class sa{constructor(){this.Tr=new pe(ce.Er),this.dr=new pe(ce.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new ce(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Vr(new ce(e,t))}mr(e,t){e.forEach((r=>this.removeReference(r,t)))}gr(e){const t=new L(new ee([])),r=new ce(t,e),s=new ce(t,e+1),i=[];return this.dr.forEachInRange([r,s],(a=>{this.Vr(a),i.push(a.key)})),i}pr(){this.Tr.forEach((e=>this.Vr(e)))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new L(new ee([])),r=new ce(t,e),s=new ce(t,e+1);let i=H();return this.dr.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new ce(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class ce{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return L.comparator(e.key,t.key)||Q(e.wr,t.wr)}static Ar(e,t){return Q(e.wr,t.wr)||L.comparator(e.key,t.key)}}/**
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
 */class BE{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new pe(ce.Er)}checkEmpty(e){return D.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new oE(i,t,r,s);this.mutationQueue.push(a);for(const c of s)this.br=this.br.add(new ce(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return D.resolve(a)}lookupMutationBatch(e,t){return D.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),i=s<0?0:s;return D.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return D.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return D.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new ce(t,0),s=new ce(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],(a=>{const c=this.Dr(a.wr);i.push(c)})),D.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new pe(Q);return t.forEach((s=>{const i=new ce(s,0),a=new ce(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],(c=>{r=r.add(c.wr)}))})),D.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;L.isDocumentKey(i)||(i=i.child(""));const a=new ce(new L(i),0);let c=new pe(Q);return this.br.forEachWhile((u=>{const d=u.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(c=c.add(u.wr)),!0)}),a),D.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach((r=>{const s=this.Dr(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){Y(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return D.forEach(t.mutations,(s=>{const i=new ce(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.br=r}))}On(e){}containsKey(e,t){const r=new ce(t,0),s=this.br.firstAfterOrEqual(r);return D.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,D.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class qE{constructor(e){this.Mr=e,this.docs=(function(){return new te(L.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return D.resolve(r?r.document.mutableCopy():Te.newInvalidDocument(t))}getEntries(e,t){let r=lt();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Te.newInvalidDocument(s))})),D.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=lt();const a=t.path,c=new L(a.child("")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:d,value:{document:f}}=u.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Av(wv(f),r)<=0||(s.has(f.key)||Ws(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return D.resolve(i)}getAllFromCollectionGroup(e,t,r,s){q()}Or(e,t){return D.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new jE(this)}getSize(e){return D.resolve(this.size)}}class jE extends VE{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)})),D.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class $E{constructor(e){this.persistence=e,this.Nr=new Sn((t=>Jo(t)),Xo),this.lastRemoteSnapshotVersion=j.min(),this.highestTargetId=0,this.Lr=0,this.Br=new sa,this.targetCount=0,this.kr=En.Bn()}forEachTarget(e,t){return this.Nr.forEach(((r,s)=>t(s))),D.resolve()}getLastRemoteSnapshotVersion(e){return D.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return D.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),D.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),D.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new En(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,D.resolve()}updateTargetData(e,t){return this.Kn(t),D.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,D.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.Nr.forEach(((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),D.waitFor(i).next((()=>s))}getTargetCount(e){return D.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return D.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),D.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),D.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),D.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return D.resolve(r)}containsKey(e,t){return D.resolve(this.Br.containsKey(t))}}/**
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
 */class zE{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Ko(0),this.Kr=!1,this.Kr=!0,this.$r=new UE,this.referenceDelegate=e(this),this.Ur=new $E(this),this.indexManager=new OE,this.remoteDocumentCache=(function(s){return new qE(s)})((r=>this.referenceDelegate.Wr(r))),this.serializer=new kE(t),this.Gr=new xE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new FE,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new BE(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);const s=new HE(this.Qr.next());return this.referenceDelegate.zr(),r(s).next((i=>this.referenceDelegate.jr(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Hr(e,t){return D.or(Object.values(this.qr).map((r=>()=>r.containsKey(e,t))))}}class HE extends bv{constructor(e){super(),this.currentSequenceNumber=e}}class ia{constructor(e){this.persistence=e,this.Jr=new sa,this.Yr=null}static Zr(e){return new ia(e)}get Xr(){if(this.Yr)return this.Yr;throw q()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),D.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),D.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),D.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach((s=>this.Xr.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.Xr.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return D.forEach(this.Xr,(r=>{const s=L.fromPath(r);return this.ei(e,s).next((i=>{i||t.removeEntry(s,j.min())}))})).next((()=>(this.Yr=null,t.apply(e))))}updateLimboDocument(e,t){return this.ei(e,t).next((r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())}))}Wr(e){return 0}ei(e,t){return D.or([()=>D.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class oa{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=H(),s=H();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new oa(e,t.fromCache,r,s)}}/**
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
 */class WE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class KE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=(function(){return Vm()?8:Sv(we())>0?6:4})()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.Yi(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.Zi(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new WE;return this.Xi(e,t,a).next((c=>{if(i.result=c,this.zi)return this.es(e,t,a,c.size)}))})).next((()=>i.result))}es(e,t,r,s){return r.documentReadCount<this.ji?(Kn()<=W.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",an(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),D.resolve()):(Kn()<=W.DEBUG&&V("QueryEngine","Query:",an(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(Kn()<=W.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",an(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ge(t))):D.resolve())}Yi(e,t){if(Gu(t))return D.resolve(null);let r=Ge(t);return this.indexManager.getIndexType(e,r).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Rs(t,null,"F"),r=Ge(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next((i=>{const a=H(...i);return this.Ji.getDocuments(e,a).next((c=>this.indexManager.getMinOffset(e,r).next((u=>{const d=this.ts(t,c);return this.ns(t,d,a,u.readTime)?this.Yi(e,Rs(t,null,"F")):this.rs(e,d,t,u)}))))})))))}Zi(e,t,r,s){return Gu(t)||s.isEqual(j.min())?D.resolve(null):this.Ji.getDocuments(e,r).next((i=>{const a=this.ts(t,i);return this.ns(t,a,r,s)?D.resolve(null):(Kn()<=W.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),an(t)),this.rs(e,a,t,Tv(s,-1)).next((c=>c)))}))}ts(e,t){let r=new pe(hd(e));return t.forEach(((s,i)=>{Ws(e,i)&&(r=r.add(i))})),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,r){return Kn()<=W.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",an(t)),this.Ji.getDocumentsMatchingQuery(e,t,Pt.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
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
 */class GE{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new te(Q),this._s=new Sn((i=>Jo(i)),Xo),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new LE(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.os)))}}function QE(n,e,t,r){return new GE(n,e,t,r)}async function Nd(n,e){const t=$(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],c=[];let u=H();for(const d of s){a.push(d.batchId);for(const f of d.mutations)u=u.add(f.key)}for(const d of i){c.push(d.batchId);for(const f of d.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(r,u).next((d=>({hs:d,removedBatchIds:a,addedBatchIds:c})))}))}))}function YE(n,e){const t=$(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return(function(c,u,d,f){const m=d.batch,y=m.keys();let R=D.resolve();return y.forEach((S=>{R=R.next((()=>f.getEntry(u,S))).next((k=>{const C=d.docVersions.get(S);Y(C!==null),k.version.compareTo(C)<0&&(m.applyToRemoteDocument(k,d),k.isValidDocument()&&(k.setReadTime(d.commitVersion),f.addEntry(k)))}))})),R.next((()=>c.mutationQueue.removeMutationBatch(u,m)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let u=H();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(u=u.add(c.batch.mutations[d].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function Vd(n){const e=$(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.Ur.getLastRemoteSnapshotVersion(t)))}function JE(n,e){const t=$(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const c=[];e.targetChanges.forEach(((f,m)=>{const y=s.get(m);if(!y)return;c.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next((()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m))));let R=y.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?R=R.withResumeToken(me.EMPTY_BYTE_STRING,j.min()).withLastLimboFreeSnapshotVersion(j.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,r)),s=s.insert(m,R),(function(k,C,M){return k.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=3e8?!0:M.addedDocuments.size+M.modifiedDocuments.size+M.removedDocuments.size>0})(y,R,f)&&c.push(t.Ur.updateTargetData(i,R))}));let u=lt(),d=H();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(XE(i,a,e.documentUpdates).next((f=>{u=f.Ps,d=f.Is}))),!r.isEqual(j.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next((m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(f)}return D.waitFor(c).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,d))).next((()=>u))})).then((i=>(t.os=s,i)))}function XE(n,e,t){let r=H(),s=H();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=lt();return t.forEach(((c,u)=>{const d=i.get(c);u.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(j.min())?(e.removeEntry(c,u.readTime),a=a.insert(c,u)):!d.isValidDocument()||u.version.compareTo(d.version)>0||u.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(u),a=a.insert(c,u)):V("LocalStore","Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",u.version)})),{Ps:a,Is:s}}))}function ZE(n,e){const t=$(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function eI(n,e){const t=$(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.Ur.getTargetData(r,e).next((i=>i?(s=i,D.resolve(s)):t.Ur.allocateTargetId(r).next((a=>(s=new Tt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r}))}async function bo(n,e,t){const r=$(n),s=r.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!Sr(a))throw a;V("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function il(n,e,t){const r=$(n);let s=j.min(),i=H();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,d,f){const m=$(u),y=m._s.get(f);return y!==void 0?D.resolve(m.os.get(y)):m.Ur.getTargetData(d,f)})(r,a,Ge(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,c.targetId).next((u=>{i=u}))})).next((()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:j.min(),t?i:H()))).next((c=>(tI(r,Hv(e),c),{documents:c,Ts:i})))))}function tI(n,e,t){let r=n.us.get(e)||j.min();t.forEach(((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)})),n.us.set(e,r)}class ol{constructor(){this.activeTargetIds=Jv()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nI{constructor(){this.so=new ol,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new ol,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class rI{_o(e){}shutdown(){}}/**
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
 */class al{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){V("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){V("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ss=null;function Ki(){return ss===null?ss=(function(){return 268435456+Math.round(2147483648*Math.random())})():ss++,"0x"+ss.toString(16)}/**
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
 */const sI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class iI{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const Ee="WebChannelConnection";class oI extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,r,s,i,a){const c=Ki(),u=this.xo(t,r.toUriEncodedString());V("RestConnection",`Sending RPC '${t}' ${c}:`,u,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,u,d,s).then((f=>(V("RestConnection",`Received RPC '${t}' ${c}: `,f),f)),(f=>{throw gn("RestConnection",`RPC '${t}' ${c} failed with error: `,f,"url: ",u,"request:",s),f}))}Lo(t,r,s,i,a,c){return this.Mo(t,r,s,i,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Rn})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach(((i,a)=>t[a]=i)),s&&s.headers.forEach(((i,a)=>t[a]=i))}xo(t,r){const s=sI[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const i=Ki();return new Promise(((a,c)=>{const u=new Kh;u.setWithCredentials(!0),u.listenOnce(Gh.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case ls.NO_ERROR:const f=u.getResponseJson();V(Ee,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case ls.TIMEOUT:V(Ee,`RPC '${e}' ${i} timed out`),c(new N(P.DEADLINE_EXCEEDED,"Request time out"));break;case ls.HTTP_ERROR:const m=u.getStatus();if(V(Ee,`RPC '${e}' ${i} failed with status:`,m,"response text:",u.getResponseText()),m>0){let y=u.getResponseJson();Array.isArray(y)&&(y=y[0]);const R=y?.error;if(R&&R.status&&R.message){const S=(function(C){const M=C.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(M)>=0?M:P.UNKNOWN})(R.status);c(new N(S,R.message))}else c(new N(P.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new N(P.UNAVAILABLE,"Connection failed."));break;default:q()}}finally{V(Ee,`RPC '${e}' ${i} completed.`)}}));const d=JSON.stringify(s);V(Ee,`RPC '${e}' ${i} sending request:`,s),u.send(t,"POST",d,r,15)}))}Bo(e,t,r){const s=Ki(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Jh(),c=Yh(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(u.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Oo(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const f=i.join("");V(Ee,`Creating RPC '${e}' stream ${s}: ${f}`,u);const m=a.createWebChannel(f,u);let y=!1,R=!1;const S=new iI({Io:C=>{R?V(Ee,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(y||(V(Ee,`Opening RPC '${e}' stream ${s} transport.`),m.open(),y=!0),V(Ee,`RPC '${e}' stream ${s} sending:`,C),m.send(C))},To:()=>m.close()}),k=(C,M,F)=>{C.listen(M,(x=>{try{F(x)}catch(B){setTimeout((()=>{throw B}),0)}}))};return k(m,Yn.EventType.OPEN,(()=>{R||(V(Ee,`RPC '${e}' stream ${s} transport opened.`),S.yo())})),k(m,Yn.EventType.CLOSE,(()=>{R||(R=!0,V(Ee,`RPC '${e}' stream ${s} transport closed`),S.So())})),k(m,Yn.EventType.ERROR,(C=>{R||(R=!0,gn(Ee,`RPC '${e}' stream ${s} transport errored:`,C),S.So(new N(P.UNAVAILABLE,"The operation could not be completed")))})),k(m,Yn.EventType.MESSAGE,(C=>{var M;if(!R){const F=C.data[0];Y(!!F);const x=F,B=x.error||((M=x[0])===null||M===void 0?void 0:M.error);if(B){V(Ee,`RPC '${e}' stream ${s} received error:`,B);const J=B.status;let z=(function(_){const I=ie[_];if(I!==void 0)return wd(I)})(J),E=B.message;z===void 0&&(z=P.INTERNAL,E="Unknown error status: "+J+" with message "+B.message),R=!0,S.So(new N(z,E)),m.close()}else V(Ee,`RPC '${e}' stream ${s} received:`,F),S.bo(F)}})),k(c,Qh.STAT_EVENT,(C=>{C.stat===go.PROXY?V(Ee,`RPC '${e}' stream ${s} detected buffering proxy`):C.stat===go.NOPROXY&&V(Ee,`RPC '${e}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{S.wo()}),0),S}}function Gi(){return typeof document<"u"?document:null}/**
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
 */function Ys(n){return new gE(n,!0)}/**
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
 */class Md{constructor(e,t,r=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,(()=>(this.Uo=Date.now(),e()))),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class Ld{constructor(e,t,r,s,i,a,c,u){this.ui=e,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Md(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,(()=>this.__())))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(ut(t.toString()),ut("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Yo===t&&this.P_(r,s)}),(r=>{e((()=>{const s=new N(P.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)}))}))}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo((()=>{r((()=>this.listener.Eo()))})),this.stream.Ro((()=>{r((()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,(()=>(this.r_()&&(this.state=3),Promise.resolve()))),this.listener.Ro())))})),this.stream.mo((s=>{r((()=>this.I_(s)))})),this.stream.onMessage((s=>{r((()=>++this.e_==1?this.E_(s):this.onNext(s)))}))}i_(){this.state=5,this.t_.Go((async()=>{this.state=0,this.start()}))}I_(e){return V("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget((()=>this.Yo===e?t():(V("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class aI extends Ld{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=vE(this.serializer,e),r=(function(i){if(!("targetChange"in i))return j.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?j.min():a.readTime?Qe(a.readTime):j.min()})(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=Ro(this.serializer),t.addTarget=(function(i,a){let c;const u=a.target;if(c=Eo(u)?{documents:TE(i,u)}:{query:wE(i,u)._t},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=bd(i,a.resumeToken);const d=To(i,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(j.min())>0){c.readTime=Ss(i,a.snapshotVersion.toTimestamp());const d=To(i,a.expectedCount);d!==null&&(c.expectedCount=d)}return c})(this.serializer,e);const r=RE(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=Ro(this.serializer),t.removeTarget=e,this.a_(t)}}class cI extends Ld{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Y(!!e.streamToken),this.lastStreamToken=e.streamToken,Y(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Y(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=IE(e.writeResults,e.commitTime),r=Qe(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ro(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>EE(this.serializer,r)))};this.a_(t)}}/**
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
 */class uI extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new N(P.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.Mo(e,wo(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new N(P.UNKNOWN,i.toString())}))}Lo(e,t,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,c])=>this.connection.Lo(e,wo(t,r),s,a,c,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(P.UNKNOWN,a.toString())}))}terminate(){this.y_=!0,this.connection.terminate()}}class lI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve()))))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(ut(t),this.D_=!1):V("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class hI{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o((a=>{r.enqueueAndForget((async()=>{tn(this)&&(V("RemoteStore","Restarting streams for network reachability change."),await(async function(u){const d=$(u);d.L_.add(4),await kr(d),d.q_.set("Unknown"),d.L_.delete(4),await Js(d)})(this))}))})),this.q_=new lI(r,s)}}async function Js(n){if(tn(n))for(const e of n.B_)await e(!0)}async function kr(n){for(const e of n.B_)await e(!1)}function xd(n,e){const t=$(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),la(t)?ua(t):Pn(t).r_()&&ca(t,e))}function aa(n,e){const t=$(n),r=Pn(t);t.N_.delete(e),r.r_()&&Fd(t,e),t.N_.size===0&&(r.r_()?r.o_():tn(t)&&t.q_.set("Unknown"))}function ca(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(j.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Pn(n).A_(e)}function Fd(n,e){n.Q_.xe(e),Pn(n).R_(e)}function ua(n){n.Q_=new dE({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),Pn(n).start(),n.q_.v_()}function la(n){return tn(n)&&!Pn(n).n_()&&n.N_.size>0}function tn(n){return $(n).L_.size===0}function Ud(n){n.Q_=void 0}async function dI(n){n.q_.set("Online")}async function fI(n){n.N_.forEach(((e,t)=>{ca(n,e)}))}async function pI(n,e){Ud(n),la(n)?(n.q_.M_(e),ua(n)):n.q_.set("Unknown")}async function mI(n,e,t){if(n.q_.set("Online"),e instanceof Rd&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const c of i.targetIds)s.N_.has(c)&&(await s.remoteSyncer.rejectListen(c,a),s.N_.delete(c),s.Q_.removeTarget(c))})(n,e)}catch(r){V("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Ps(n,r)}else if(e instanceof fs?n.Q_.Ke(e):e instanceof Ad?n.Q_.He(e):n.Q_.We(e),!t.isEqual(j.min()))try{const r=await Vd(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const c=i.Q_.rt(a);return c.targetChanges.forEach(((u,d)=>{if(u.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(u.resumeToken,a))}})),c.targetMismatches.forEach(((u,d)=>{const f=i.N_.get(u);if(!f)return;i.N_.set(u,f.withResumeToken(me.EMPTY_BYTE_STRING,f.snapshotVersion)),Fd(i,u);const m=new Tt(f.target,u,d,f.sequenceNumber);ca(i,m)})),i.remoteSyncer.applyRemoteEvent(c)})(n,t)}catch(r){V("RemoteStore","Failed to raise snapshot:",r),await Ps(n,r)}}async function Ps(n,e,t){if(!Sr(e))throw e;n.L_.add(1),await kr(n),n.q_.set("Offline"),t||(t=()=>Vd(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{V("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Js(n)}))}function Bd(n,e){return e().catch((t=>Ps(n,t,e)))}async function Xs(n){const e=$(n),t=kt(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;gI(e);)try{const s=await ZE(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,_I(e,s)}catch(s){await Ps(e,s)}qd(e)&&jd(e)}function gI(n){return tn(n)&&n.O_.length<10}function _I(n,e){n.O_.push(e);const t=kt(n);t.r_()&&t.V_&&t.m_(e.mutations)}function qd(n){return tn(n)&&!kt(n).n_()&&n.O_.length>0}function jd(n){kt(n).start()}async function yI(n){kt(n).p_()}async function vI(n){const e=kt(n);for(const t of n.O_)e.m_(t.mutations)}async function EI(n,e,t){const r=n.O_.shift(),s=ta.from(r,e,t);await Bd(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await Xs(n)}async function II(n,e){e&&kt(n).V_&&await(async function(r,s){if((function(a){return uE(a)&&a!==P.ABORTED})(s.code)){const i=r.O_.shift();kt(r).s_(),await Bd(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Xs(r)}})(n,e),qd(n)&&jd(n)}async function cl(n,e){const t=$(n);t.asyncQueue.verifyOperationInProgress(),V("RemoteStore","RemoteStore received new credentials");const r=tn(t);t.L_.add(3),await kr(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Js(t)}async function TI(n,e){const t=$(n);e?(t.L_.delete(2),await Js(t)):e||(t.L_.add(2),await kr(t),t.q_.set("Unknown"))}function Pn(n){return n.K_||(n.K_=(function(t,r,s){const i=$(t);return i.w_(),new aI(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Eo:dI.bind(null,n),Ro:fI.bind(null,n),mo:pI.bind(null,n),d_:mI.bind(null,n)}),n.B_.push((async e=>{e?(n.K_.s_(),la(n)?ua(n):n.q_.set("Unknown")):(await n.K_.stop(),Ud(n))}))),n.K_}function kt(n){return n.U_||(n.U_=(function(t,r,s){const i=$(t);return i.w_(),new cI(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:yI.bind(null,n),mo:II.bind(null,n),f_:vI.bind(null,n),g_:EI.bind(null,n)}),n.B_.push((async e=>{e?(n.U_.s_(),await Xs(n)):(await n.U_.stop(),n.O_.length>0&&(V("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))}))),n.U_}/**
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
 */class ha{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new ot,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,c=new ha(e,t,a,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function da(n,e){if(ut("AsyncQueue",`${e}: ${n}`),Sr(n))return new N(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class pn{constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=Jn(),this.sortedSet=new te(this.comparator)}static emptySet(e){return new pn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof pn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new pn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
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
 */class ul{constructor(){this.W_=new te(L.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):q():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal(((t,r)=>{e.push(r)})),e}}class In{constructor(e,t,r,s,i,a,c,u,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((c=>{a.push({type:0,doc:c})})),new In(e,t,pn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Hs(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class wI{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some((e=>e.J_()))}}class AI{constructor(){this.queries=ll(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=$(t),i=s.queries;s.queries=ll(),i.forEach(((a,c)=>{for(const u of c.j_)u.onError(r)}))})(this,new N(P.ABORTED,"Firestore shutting down"))}}function ll(){return new Sn((n=>ld(n)),Hs)}async function fa(n,e){const t=$(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(r=2):(i=new wI,r=e.J_()?0:1);try{switch(r){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=da(a,`Initialization of query '${an(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&ma(t)}async function pa(n,e){const t=$(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function RI(n,e){const t=$(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const c of a.j_)c.X_(s)&&(r=!0);a.z_=s}}r&&ma(t)}function bI(n,e,t){const r=$(n),s=r.queries.get(e);if(s)for(const i of s.j_)i.onError(t);r.queries.delete(e)}function ma(n){n.Y_.forEach((e=>{e.next()}))}var So,hl;(hl=So||(So={})).ea="default",hl.Cache="cache";class ga{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new In(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=In.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==So.Cache}}/**
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
 */class $d{constructor(e){this.key=e}}class zd{constructor(e){this.key=e}}class SI{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=H(),this.mutatedKeys=H(),this.Aa=hd(e),this.Ra=new pn(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new ul,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((f,m)=>{const y=s.get(f),R=Ws(this.query,m)?m:null,S=!!y&&this.mutatedKeys.has(y.key),k=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;y&&R?y.data.isEqual(R.data)?S!==k&&(r.track({type:3,doc:R}),C=!0):this.ga(y,R)||(r.track({type:2,doc:R}),C=!0,(u&&this.Aa(R,u)>0||d&&this.Aa(R,d)<0)&&(c=!0)):!y&&R?(r.track({type:0,doc:R}),C=!0):y&&!R&&(r.track({type:1,doc:y}),C=!0,(u||d)&&(c=!0)),C&&(R?(a=a.add(R),i=k?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:c,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort(((f,m)=>(function(R,S){const k=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return q()}};return k(R)-k(S)})(f.type,m.type)||this.Aa(f.doc,m.doc))),this.pa(r),s=s!=null&&s;const c=t&&!s?this.ya():[],u=this.da.size===0&&this.current&&!s?1:0,d=u!==this.Ea;return this.Ea=u,a.length!==0||d?{snapshot:new In(this.query,e.Ra,i,a,e.mutatedKeys,u===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new ul,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach((t=>this.Ta=this.Ta.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ta=this.Ta.delete(t))),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=H(),this.Ra.forEach((r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))}));const t=[];return e.forEach((r=>{this.da.has(r)||t.push(new zd(r))})),this.da.forEach((r=>{e.has(r)||t.push(new $d(r))})),t}ba(e){this.Ta=e.Ts,this.da=H();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return In.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class PI{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class CI{constructor(e){this.key=e,this.va=!1}}class kI{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new Sn((c=>ld(c)),Hs),this.Ma=new Map,this.xa=new Set,this.Oa=new te(L.comparator),this.Na=new Map,this.La=new sa,this.Ba={},this.ka=new Map,this.qa=En.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function DI(n,e,t=!0){const r=Yd(n);let s;const i=r.Fa.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await Hd(r,e,t,!0),s}async function OI(n,e){const t=Yd(n);await Hd(t,e,!0,!1)}async function Hd(n,e,t,r){const s=await eI(n.localStore,Ge(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await NI(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&xd(n.remoteStore,s),c}async function NI(n,e,t,r,s){n.Ka=(m,y,R)=>(async function(k,C,M,F){let x=C.view.ma(M);x.ns&&(x=await il(k.localStore,C.query,!1).then((({documents:E})=>C.view.ma(E,x))));const B=F&&F.targetChanges.get(C.targetId),J=F&&F.targetMismatches.get(C.targetId)!=null,z=C.view.applyChanges(x,k.isPrimaryClient,B,J);return fl(k,C.targetId,z.wa),z.snapshot})(n,m,y,R);const i=await il(n.localStore,e,!0),a=new SI(e,i.Ts),c=a.ma(i.documents),u=Cr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(c,n.isPrimaryClient,u);fl(n,t,d.wa);const f=new PI(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function VI(n,e,t){const r=$(n),s=r.Fa.get(e),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter((a=>!Hs(a,e)))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await bo(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&aa(r.remoteStore,s.targetId),Po(r,s.targetId)})).catch(br)):(Po(r,s.targetId),await bo(r.localStore,s.targetId,!0))}async function MI(n,e){const t=$(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),aa(t.remoteStore,r.targetId))}async function LI(n,e,t){const r=$I(n);try{const s=await(function(a,c){const u=$(a),d=ae.now(),f=c.reduce(((R,S)=>R.add(S.key)),H());let m,y;return u.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let S=lt(),k=H();return u.cs.getEntries(R,f).next((C=>{S=C,S.forEach(((M,F)=>{F.isValidDocument()||(k=k.add(M))}))})).next((()=>u.localDocuments.getOverlayedDocuments(R,S))).next((C=>{m=C;const M=[];for(const F of c){const x=sE(F,m.get(F.key).overlayedDocument);x!=null&&M.push(new Vt(F.key,x,nd(x.value.mapValue),qe.exists(!0)))}return u.mutationQueue.addMutationBatch(R,d,M,c)})).next((C=>{y=C;const M=C.applyToLocalDocumentSet(m,k);return u.documentOverlayCache.saveOverlays(R,C.batchId,M)}))})).then((()=>({batchId:y.batchId,changes:fd(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,c,u){let d=a.Ba[a.currentUser.toKey()];d||(d=new te(Q)),d=d.insert(c,u),a.Ba[a.currentUser.toKey()]=d})(r,s.batchId,t),await Dr(r,s.changes),await Xs(r.remoteStore)}catch(s){const i=da(s,"Failed to persist write");t.reject(i)}}async function Wd(n,e){const t=$(n);try{const r=await JE(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Na.get(i);a&&(Y(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?Y(a.va):s.removedDocuments.size>0&&(Y(a.va),a.va=!1))})),await Dr(t,r,e)}catch(r){await br(r)}}function dl(n,e,t){const r=$(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach(((i,a)=>{const c=a.view.Z_(e);c.snapshot&&s.push(c.snapshot)})),(function(a,c){const u=$(a);u.onlineState=c;let d=!1;u.queries.forEach(((f,m)=>{for(const y of m.j_)y.Z_(c)&&(d=!0)})),d&&ma(u)})(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function xI(n,e,t){const r=$(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),i=s&&s.key;if(i){let a=new te(L.comparator);a=a.insert(i,Te.newNoDocument(i,j.min()));const c=H().add(i),u=new Qs(j.min(),new Map,new te(Q),a,c);await Wd(r,u),r.Oa=r.Oa.remove(i),r.Na.delete(e),_a(r)}else await bo(r.localStore,e,!1).then((()=>Po(r,e,t))).catch(br)}async function FI(n,e){const t=$(n),r=e.batch.batchId;try{const s=await YE(t.localStore,e);Gd(t,r,null),Kd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Dr(t,s)}catch(s){await br(s)}}async function UI(n,e,t){const r=$(n);try{const s=await(function(a,c){const u=$(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let f;return u.mutationQueue.lookupMutationBatch(d,c).next((m=>(Y(m!==null),f=m.keys(),u.mutationQueue.removeMutationBatch(d,m)))).next((()=>u.mutationQueue.performConsistencyCheck(d))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(d,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f))).next((()=>u.localDocuments.getDocuments(d,f)))}))})(r.localStore,e);Gd(r,e,t),Kd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Dr(r,s)}catch(s){await br(s)}}function Kd(n,e){(n.ka.get(e)||[]).forEach((t=>{t.resolve()})),n.ka.delete(e)}function Gd(n,e,t){const r=$(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function Po(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach((r=>{n.La.containsKey(r)||Qd(n,r)}))}function Qd(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(aa(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),_a(n))}function fl(n,e,t){for(const r of t)r instanceof $d?(n.La.addReference(r.key,e),BI(n,r)):r instanceof zd?(V("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||Qd(n,r.key)):q()}function BI(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(V("SyncEngine","New document in limbo: "+t),n.xa.add(r),_a(n))}function _a(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new L(ee.fromString(e)),r=n.qa.next();n.Na.set(r,new CI(t)),n.Oa=n.Oa.insert(t,r),xd(n.remoteStore,new Tt(Ge(zs(t.path)),r,"TargetPurposeLimboResolution",Ko.oe))}}async function Dr(n,e,t){const r=$(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach(((c,u)=>{a.push(r.Ka(u,e,t).then((d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t?.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(d){s.push(d);const m=oa.Wi(u.targetId,d);i.push(m)}})))})),await Promise.all(a),r.Ca.d_(s),await(async function(u,d){const f=$(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>D.forEach(d,(y=>D.forEach(y.$i,(R=>f.persistence.referenceDelegate.addReference(m,y.targetId,R))).next((()=>D.forEach(y.Ui,(R=>f.persistence.referenceDelegate.removeReference(m,y.targetId,R)))))))))}catch(m){if(!Sr(m))throw m;V("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const y=m.targetId;if(!m.fromCache){const R=f.os.get(y),S=R.snapshotVersion,k=R.withLastLimboFreeSnapshotVersion(S);f.os=f.os.insert(y,k)}}})(r.localStore,i))}async function qI(n,e){const t=$(n);if(!t.currentUser.isEqual(e)){V("SyncEngine","User change. New user:",e.toKey());const r=await Nd(t.localStore,e);t.currentUser=e,(function(i,a){i.ka.forEach((c=>{c.forEach((u=>{u.reject(new N(P.CANCELLED,a))}))})),i.ka.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Dr(t,r.hs)}}function jI(n,e){const t=$(n),r=t.Na.get(e);if(r&&r.va)return H().add(r.key);{let s=H();const i=t.Ma.get(e);if(!i)return s;for(const a of i){const c=t.Fa.get(a);s=s.unionWith(c.view.Va)}return s}}function Yd(n){const e=$(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Wd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=jI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=xI.bind(null,e),e.Ca.d_=RI.bind(null,e.eventManager),e.Ca.$a=bI.bind(null,e.eventManager),e}function $I(n){const e=$(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=FI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=UI.bind(null,e),e}class Cs{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ys(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return QE(this.persistence,new KE,e.initialUser,this.serializer)}Ga(e){return new zE(ia.Zr,this.serializer)}Wa(e){return new nI}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Cs.provider={build:()=>new Cs};class Co{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>dl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=qI.bind(null,this.syncEngine),await TI(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new AI})()}createDatastore(e){const t=Ys(e.databaseInfo.databaseId),r=(function(i){return new oI(i)})(e.databaseInfo);return(function(i,a,c,u){return new uI(i,a,c,u)})(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,c){return new hI(r,s,i,a,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>dl(this.syncEngine,t,0)),(function(){return al.D()?new al:new rI})())}createSyncEngine(e,t){return(function(s,i,a,c,u,d,f){const m=new kI(s,i,a,c,u,d);return f&&(m.Qa=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=$(s);V("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await kr(i),i.k_.shutdown(),i.q_.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Co.provider={build:()=>new Co};/**
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
 */class ya{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):ut("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */class zI{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Ie.UNAUTHENTICATED,this.clientId=Zh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{V("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(V("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ot;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=da(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Qi(n,e){n.asyncQueue.verifyOperationInProgress(),V("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await Nd(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function pl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await HI(n);V("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>cl(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>cl(e.remoteStore,s))),n._onlineComponents=e}async function HI(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V("FirestoreClient","Using user provided OfflineComponentProvider");try{await Qi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;gn("Error using user provided cache. Falling back to memory cache: "+t),await Qi(n,new Cs)}}else V("FirestoreClient","Using default OfflineComponentProvider"),await Qi(n,new Cs);return n._offlineComponents}async function Jd(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V("FirestoreClient","Using user provided OnlineComponentProvider"),await pl(n,n._uninitializedComponentsProvider._online)):(V("FirestoreClient","Using default OnlineComponentProvider"),await pl(n,new Co))),n._onlineComponents}function WI(n){return Jd(n).then((e=>e.syncEngine))}async function ks(n){const e=await Jd(n),t=e.eventManager;return t.onListen=DI.bind(null,e.syncEngine),t.onUnlisten=VI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=OI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=MI.bind(null,e.syncEngine),t}function KI(n,e,t={}){const r=new ot;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,u,d){const f=new ya({next:y=>{f.Za(),a.enqueueAndForget((()=>pa(i,m)));const R=y.docs.has(c);!R&&y.fromCache?d.reject(new N(P.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&y.fromCache&&u&&u.source==="server"?d.reject(new N(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new ga(zs(c.path),f,{includeMetadataChanges:!0,_a:!0});return fa(i,m)})(await ks(n),n.asyncQueue,e,t,r))),r.promise}function GI(n,e,t={}){const r=new ot;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,u,d){const f=new ya({next:y=>{f.Za(),a.enqueueAndForget((()=>pa(i,m))),y.fromCache&&u.source==="server"?d.reject(new N(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new ga(c,f,{includeMetadataChanges:!0,_a:!0});return fa(i,m)})(await ks(n),n.asyncQueue,e,t,r))),r.promise}/**
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
 */function Xd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const ml=new Map;/**
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
 */function Zd(n,e,t){if(!t)throw new N(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function QI(n,e,t,r){if(e===!0&&r===!0)throw new N(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function gl(n){if(!L.isDocumentKey(n))throw new N(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function _l(n){if(L.isDocumentKey(n))throw new N(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Zs(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":q()}function Le(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Zs(n);throw new N(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function YI(n,e){if(e<=0)throw new N(P.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
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
 */class yl{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new N(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new N(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}QI("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Xd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ei{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new yl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new yl(e),e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new fv;switch(r.type){case"firstParty":return new _v(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=ml.get(t);r&&(V("ComponentProvider","Removing Datastore"),ml.delete(t),r.terminate())})(this),Promise.resolve()}}function JI(n,e,t,r={}){var s;const i=(n=Le(n,ei))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&gn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let c,u;if(typeof r.mockUserToken=="string")c=r.mockUserToken,u=Ie.MOCK_USER;else{c=rh(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new N(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ie(d)}n._authCredentials=new pv(new Xh(c,u))}}/**
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
 */class ht{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ht(this.firestore,e,this._query)}}class be{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new St(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new be(this.firestore,e,this._key)}}class St extends ht{constructor(e,t,r){super(e,t,zs(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new be(this.firestore,null,new L(e))}withConverter(e){return new St(this.firestore,e,this._path)}}function Er(n,e,...t){if(n=re(n),Zd("collection","path",e),n instanceof ei){const r=ee.fromString(e,...t);return _l(r),new St(n,null,r)}{if(!(n instanceof be||n instanceof St))throw new N(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ee.fromString(e,...t));return _l(r),new St(n.firestore,null,r)}}function He(n,e,...t){if(n=re(n),arguments.length===1&&(e=Zh.newId()),Zd("doc","path",e),n instanceof ei){const r=ee.fromString(e,...t);return gl(r),new be(n,null,new L(r))}{if(!(n instanceof be||n instanceof St))throw new N(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(ee.fromString(e,...t));return gl(r),new be(n.firestore,n instanceof St?n.converter:null,new L(r))}}/**
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
 */class vl{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Md(this,"async_queue_retry"),this.Vu=()=>{const r=Gi();r&&V("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Gi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Gi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise((()=>{}));const t=new ot;return this.gu((()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Pu.push(e),this.pu())))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Sr(e))throw e;V("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go((()=>this.pu()))}}gu(e){const t=this.mu.then((()=>(this.du=!0,e().catch((r=>{this.Eu=r,this.du=!1;const s=(function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c})(r);throw ut("INTERNAL UNHANDLED ERROR: ",s),r})).then((r=>(this.du=!1,r))))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=ha.createAndSchedule(this,e,t,r,(i=>this.yu(i)));return this.Tu.push(s),s}fu(){this.Eu&&q()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then((()=>{this.Tu.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()}))}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function El(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}class Dt extends ei{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new vl,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new vl(e),this._firestoreClient=void 0,await e}}}function XI(n,e){const t=typeof n=="object"?n:Fs(),r=typeof n=="string"?n:"(default)",s=Ot(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=eh("firestore");i&&JI(s,...i)}return s}function ti(n){if(n._terminated)throw new N(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||ZI(n),n._firestoreClient}function ZI(n){var e,t,r;const s=n._freezeSettings(),i=(function(c,u,d,f){return new kv(c,u,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Xd(f.experimentalLongPollingOptions),f.useFetchStreams)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new zI(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&(function(c){const u=c?._online.build();return{_offline:c?._offline.build(u),_online:u}})(n._componentsProvider))}/**
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
 */class Tn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Tn(me.fromBase64String(e))}catch(t){throw new N(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Tn(me.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class ni{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new de(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class ri{constructor(e){this._methodName=e}}/**
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
 */class va{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Q(this._lat,e._lat)||Q(this._long,e._long)}}/**
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
 */class Ea{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}}/**
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
 */const eT=/^__.*__$/;class tT{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Vt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Pr(e,this.data,t,this.fieldTransforms)}}class ef{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Vt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function tf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw q()}}class Ia{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Ia(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Ds(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(tf(this.Cu)&&eT.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class nT{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Ys(e)}Qu(e,t,r,s=!1){return new Ia({Cu:e,methodName:t,qu:r,path:de.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ta(n){const e=n._freezeSettings(),t=Ys(n._databaseId);return new nT(n._databaseId,!!e.ignoreUndefinedProperties,t)}function rT(n,e,t,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,s);Aa("Data must be an object, but it was:",a,r);const c=nf(r,a);let u,d;if(i.merge)u=new Ne(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const y=ko(e,m,t);if(!a.contains(y))throw new N(P.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);sf(f,y)||f.push(y)}u=new Ne(f),d=a.fieldTransforms.filter((m=>u.covers(m.field)))}else u=null,d=a.fieldTransforms;return new tT(new Ce(c),u,d)}class si extends ri{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof si}}class wa extends ri{constructor(e,t){super(e),this.$u=t}_toFieldTransform(e){const t=new vr(e.serializer,gd(e.serializer,this.$u));return new eE(e.path,t)}isEqual(e){return e instanceof wa&&this.$u===e.$u}}function sT(n,e,t,r){const s=n.Qu(1,e,t);Aa("Data must be an object, but it was:",s,r);const i=[],a=Ce.empty();en(r,((u,d)=>{const f=Ra(e,u,t);d=re(d);const m=s.Nu(f);if(d instanceof si)i.push(f);else{const y=Or(d,m);y!=null&&(i.push(f),a.set(f,y))}}));const c=new Ne(i);return new ef(a,c,s.fieldTransforms)}function iT(n,e,t,r,s,i){const a=n.Qu(1,e,t),c=[ko(e,r,t)],u=[s];if(i.length%2!=0)throw new N(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let y=0;y<i.length;y+=2)c.push(ko(e,i[y])),u.push(i[y+1]);const d=[],f=Ce.empty();for(let y=c.length-1;y>=0;--y)if(!sf(d,c[y])){const R=c[y];let S=u[y];S=re(S);const k=a.Nu(R);if(S instanceof si)d.push(R);else{const C=Or(S,k);C!=null&&(d.push(R),f.set(R,C))}}const m=new Ne(d);return new ef(f,m,a.fieldTransforms)}function oT(n,e,t,r=!1){return Or(t,n.Qu(r?4:3,e))}function Or(n,e){if(rf(n=re(n)))return Aa("Unsupported field value:",e,n),nf(n,e);if(n instanceof ri)return(function(r,s){if(!tf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return(function(r,s){const i=[];let a=0;for(const c of r){let u=Or(c,s.Lu(a));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),a++}return{arrayValue:{values:i}}})(n,e)}return(function(r,s){if((r=re(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return gd(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=ae.fromDate(r);return{timestampValue:Ss(s.serializer,i)}}if(r instanceof ae){const i=new ae(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Ss(s.serializer,i)}}if(r instanceof va)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Tn)return{bytesValue:bd(s.serializer,r._byteString)};if(r instanceof be){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:ra(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Ea)return(function(a,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map((u=>{if(typeof u!="number")throw c.Bu("VectorValues must only contain numeric values.");return Zo(c.serializer,u)}))}}}}}})(r,s);throw s.Bu(`Unsupported field value: ${Zs(r)}`)})(n,e)}function nf(n,e){const t={};return ed(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):en(n,((r,s)=>{const i=Or(s,e.Mu(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function rf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ae||n instanceof va||n instanceof Tn||n instanceof be||n instanceof ri||n instanceof Ea)}function Aa(n,e,t){if(!rf(t)||!(function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)})(t)){const r=Zs(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function ko(n,e,t){if((e=re(e))instanceof ni)return e._internalPath;if(typeof e=="string")return Ra(n,e);throw Ds("Field path arguments must be of type string or ",n,!1,void 0,t)}const aT=new RegExp("[~\\*/\\[\\]]");function Ra(n,e,t){if(e.search(aT)>=0)throw Ds(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ni(...e.split("."))._internalPath}catch{throw Ds(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Ds(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||a)&&(u+=" (found",i&&(u+=` in field ${r}`),a&&(u+=` in document ${s}`),u+=")"),new N(P.INVALID_ARGUMENT,c+n+u)}function sf(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class of{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new be(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new cT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ii("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class cT extends of{data(){return super.data()}}function ii(n,e){return typeof e=="string"?Ra(n,e):e instanceof ni?e._internalPath:e._delegate._internalPath}/**
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
 */function af(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ba{}class Sa extends ba{}function _t(n,e,...t){let r=[];e instanceof ba&&r.push(e),r=r.concat(t),(function(i){const a=i.filter((u=>u instanceof Pa)).length,c=i.filter((u=>u instanceof oi)).length;if(a>1||a>0&&c>0)throw new N(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class oi extends Sa{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new oi(e,t,r)}_apply(e){const t=this._parse(e);return cf(e._query,t),new ht(e.firestore,e.converter,Io(e._query,t))}_parse(e){const t=Ta(e.firestore);return(function(i,a,c,u,d,f,m){let y;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new N(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Tl(m,f);const R=[];for(const S of m)R.push(Il(u,i,S));y={arrayValue:{values:R}}}else y=Il(u,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Tl(m,f),y=oT(c,a,m,f==="in"||f==="not-in");return oe.create(d,f,y)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function qt(n,e,t){const r=e,s=ii("where",n);return oi._create(s,r,t)}class Pa extends ba{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Pa(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:ze.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const c=i.getFlattenedFilters();for(const u of c)cf(a,u),a=Io(a,u)})(e._query,t),new ht(e.firestore,e.converter,Io(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Ca extends Sa{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Ca(e,t)}_apply(e){const t=(function(s,i,a){if(s.startAt!==null)throw new N(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new gr(i,a)})(e._query,this._field,this._direction);return new ht(e.firestore,e.converter,(function(s,i){const a=s.explicitOrderBy.concat([i]);return new bn(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(e._query,t))}}function ka(n,e="asc"){const t=e,r=ii("orderBy",n);return Ca._create(r,t)}class Da extends Sa{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Da(e,t,r)}_apply(e){return new ht(e.firestore,e.converter,Rs(e._query,this._limit,this._limitType))}}function uT(n){return YI("limit",n),Da._create("limit",n,"F")}function Il(n,e,t){if(typeof(t=re(t))=="string"){if(t==="")throw new N(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ud(e)&&t.indexOf("/")!==-1)throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(ee.fromString(t));if(!L.isDocumentKey(r))throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ju(n,new L(r))}if(t instanceof be)return ju(n,t._key);throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Zs(t)}.`)}function Tl(n,e){if(!Array.isArray(n)||n.length===0)throw new N(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function cf(n,e){const t=(function(s,i){for(const a of s)for(const c of a.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new N(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class lT{convertValue(e,t="none"){switch(Gt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Kt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw q()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return en(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var t,r,s;const i=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map((a=>se(a.doubleValue)));return new Ea(i)}convertGeoPoint(e){return new va(se(e.latitude),se(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Qo(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(fr(e));default:return null}}convertTimestamp(e){const t=Ct(e);return new ae(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=ee.fromString(e);Y(Od(r));const s=new pr(r.get(1),r.get(3)),i=new L(r.popFirst(5));return s.isEqual(t)||ut(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */function hT(n,e,t){let r;return r=n?n.toFirestore(e):e,r}/**
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
 */class Zn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class uf extends of{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ps(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ii("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class ps extends uf{data(e={}){return super.data(e)}}class lf{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Zn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new ps(this._firestore,this._userDataWriter,r.key,r,new Zn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((c=>{const u=new ps(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Zn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new ps(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Zn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),f=a.indexOf(c.doc.key)),{type:dT(c.type),doc:u,oldIndex:d,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function dT(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return q()}}/**
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
 */function Oa(n){n=Le(n,be);const e=Le(n.firestore,Dt);return KI(ti(e),n._key).then((t=>ff(e,n,t)))}class Na extends lT{constructor(e){super(),this.firestore=e}convertBytes(e){return new Tn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new be(this.firestore,null,t)}}function Va(n){n=Le(n,ht);const e=Le(n.firestore,Dt),t=ti(e),r=new Na(e);return af(n._query),GI(t,n._query).then((s=>new lf(e,r,n,s)))}function Ma(n,e,t,...r){n=Le(n,be);const s=Le(n.firestore,Dt),i=Ta(s);let a;return a=typeof(e=re(e))=="string"||e instanceof ni?iT(i,"updateDoc",n._key,e,t,r):sT(i,"updateDoc",n._key,e),La(s,[a.toMutation(n._key,qe.exists(!0))])}function hf(n){return La(Le(n.firestore,Dt),[new ea(n._key,qe.none())])}function df(n,e){const t=Le(n.firestore,Dt),r=He(n),s=hT(n.converter,e);return La(t,[rT(Ta(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,qe.exists(!1))]).then((()=>r))}function fT(n,...e){var t,r,s;n=re(n);let i={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||El(e[a])||(i=e[a],a++);const c={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(El(e[a])){const m=e[a];e[a]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[a+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[a+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let u,d,f;if(n instanceof be)d=Le(n.firestore,Dt),f=zs(n._key.path),u={next:m=>{e[a]&&e[a](ff(d,n,m))},error:e[a+1],complete:e[a+2]};else{const m=Le(n,ht);d=Le(m.firestore,Dt),f=m._query;const y=new Na(d);u={next:R=>{e[a]&&e[a](new lf(d,y,m,R))},error:e[a+1],complete:e[a+2]},af(n._query)}return(function(y,R,S,k){const C=new ya(k),M=new ga(R,C,S);return y.asyncQueue.enqueueAndForget((async()=>fa(await ks(y),M))),()=>{C.Za(),y.asyncQueue.enqueueAndForget((async()=>pa(await ks(y),M)))}})(ti(d),f,c,u)}function La(n,e){return(function(r,s){const i=new ot;return r.asyncQueue.enqueueAndForget((async()=>LI(await WI(r),s,i))),i.promise})(ti(n),e)}function ff(n,e,t){const r=t.docs.get(e._key),s=new Na(n);return new uf(n,s,e._key,r,new Zn(t.hasPendingWrites,t.fromCache),e.converter)}function pT(n){return new wa("increment",n)}(function(e,t=!0){(function(s){Rn=s})(Xt),je(new xe("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),c=new Dt(new mv(r.getProvider("auth-internal")),new vv(r.getProvider("app-check-internal")),(function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new N(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new pr(d.options.projectId,f)})(a,s),a);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),ke(xu,"4.7.3",e),ke(xu,"4.7.3","esm2017")})();/**
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
 */const pf="firebasestorage.googleapis.com",mT="storageBucket",gT=120*1e3,_T=600*1e3;/**
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
 */class Xe extends Fe{constructor(e,t,r=0){super(Yi(e),`Firebase Storage: ${t} (${Yi(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Xe.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Yi(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Je;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Je||(Je={}));function Yi(n){return"storage/"+n}function yT(){const n="An unknown error occurred, please check the error payload for server response.";return new Xe(Je.UNKNOWN,n)}function vT(){return new Xe(Je.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function ET(){return new Xe(Je.CANCELED,"User canceled the upload/download.")}function IT(n){return new Xe(Je.INVALID_URL,"Invalid URL '"+n+"'.")}function TT(n){return new Xe(Je.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function wl(n){return new Xe(Je.INVALID_ARGUMENT,n)}function mf(){return new Xe(Je.APP_DELETED,"The Firebase app was deleted.")}function wT(n){return new Xe(Je.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
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
 */class Be{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Be.makeFromUrl(e,t)}catch{return new Be(e,"")}if(r.path==="")return r;throw TT(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function i(B){B.path.charAt(B.path.length-1)==="/"&&(B.path_=B.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),u={bucket:1,path:3};function d(B){B.path_=decodeURIComponent(B.path)}const f="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),y="(/([^?#]*).*)?$",R=new RegExp(`^https?://${m}/${f}/b/${s}/o${y}`,"i"),S={bucket:1,path:3},k=t===pf?"(?:storage.googleapis.com|storage.cloud.google.com)":t,C="([^?#]*)",M=new RegExp(`^https?://${k}/${s}/${C}`,"i"),x=[{regex:c,indices:u,postModify:i},{regex:R,indices:S,postModify:d},{regex:M,indices:{bucket:1,path:2},postModify:d}];for(let B=0;B<x.length;B++){const J=x[B],z=J.regex.exec(e);if(z){const E=z[J.indices.bucket];let g=z[J.indices.path];g||(g=""),r=new Be(E,g),J.postModify(r);break}}if(r==null)throw IT(e);return r}}class AT{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function RT(n,e,t){let r=1,s=null,i=null,a=!1,c=0;function u(){return c===2}let d=!1;function f(...C){d||(d=!0,e.apply(null,C))}function m(C){s=setTimeout(()=>{s=null,n(R,u())},C)}function y(){i&&clearTimeout(i)}function R(C,...M){if(d){y();return}if(C){y(),f.call(null,C,...M);return}if(u()||a){y(),f.call(null,C,...M);return}r<64&&(r*=2);let x;c===1?(c=2,x=0):x=(r+Math.random())*1e3,m(x)}let S=!1;function k(C){S||(S=!0,y(),!d&&(s!==null?(C||(c=2),clearTimeout(s),m(0)):C||(c=1)))}return m(0),i=setTimeout(()=>{a=!0,k(!0)},t),k}function bT(n){n(!1)}/**
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
 */function ST(n){return n!==void 0}function Al(n,e,t,r){if(r<e)throw wl(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw wl(`Invalid value for '${n}'. Expected ${t} or less.`)}function PT(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var Os;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Os||(Os={}));/**
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
 */function CT(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,i=e.indexOf(n)!==-1;return t||s||i}/**
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
 */class kT{constructor(e,t,r,s,i,a,c,u,d,f,m,y=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=u,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=m,this.retry=y,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,S)=>{this.resolve_=R,this.reject_=S,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new is(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const a=c=>{const u=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,d)};this.progressCallback_!==null&&i.addUploadProgressListener(a),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(a),this.pendingConnection_=null;const c=i.getErrorCode()===Os.NO_ERROR,u=i.getStatus();if(!c||CT(u,this.additionalRetryCodes_)&&this.retry){const f=i.getErrorCode()===Os.ABORT;r(!1,new is(!1,null,f));return}const d=this.successCodes_.indexOf(u)!==-1;r(!0,new is(d,i))})},t=(r,s)=>{const i=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(c,c.getResponse());ST(u)?i(u):i()}catch(u){a(u)}else if(c!==null){const u=yT();u.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,u)):a(u)}else if(s.canceled){const u=this.appDelete_?mf():ET();a(u)}else{const u=vT();a(u)}};this.canceled_?t(!1,new is(!1,null,!0)):this.backoffId_=RT(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&bT(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class is{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function DT(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function OT(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function NT(n,e){e&&(n["X-Firebase-GMPID"]=e)}function VT(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function MT(n,e,t,r,s,i,a=!0){const c=PT(n.urlParams),u=n.url+c,d=Object.assign({},n.headers);return NT(d,e),DT(d,t),OT(d,i),VT(d,r),new kT(u,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a)}/**
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
 */function LT(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function xT(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
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
 */class Ns{constructor(e,t){this._service=e,t instanceof Be?this._location=t:this._location=Be.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Ns(e,t)}get root(){const e=new Be(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return xT(this._location.path)}get storage(){return this._service}get parent(){const e=LT(this._location.path);if(e===null)return null;const t=new Be(this._location.bucket,e);return new Ns(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw wT(e)}}function Rl(n,e){const t=e?.[mT];return t==null?null:Be.makeFromBucketSpec(t,n)}function FT(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:s}=r;s&&(n._overrideAuthToken=typeof s=="string"?s:rh(s,n.app.options.projectId))}class UT{constructor(e,t,r,s,i){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._bucket=null,this._host=pf,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=gT,this._maxUploadRetryTime=_T,this._requests=new Set,s!=null?this._bucket=Be.makeFromBucketSpec(s,this._host):this._bucket=Rl(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Be.makeFromBucketSpec(this._url,e):this._bucket=Rl(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Al("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Al("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Ns(this,e)}_makeRequest(e,t,r,s,i=!0){if(this._deleted)return new AT(mf());{const a=MT(e,this._appId,r,s,t,this._firebaseVersion,i);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const bl="@firebase/storage",Sl="0.13.2";/**
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
 */const gf="storage";function BT(n=Fs(),e){n=re(n);const r=Ot(n,gf).getImmediate({identifier:e}),s=eh("storage");return s&&qT(r,...s),r}function qT(n,e,t,r={}){FT(n,e,t,r)}function jT(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new UT(t,r,s,e,Xt)}function $T(){je(new xe(gf,jT,"PUBLIC").setMultipleInstances(!0)),ke(bl,Sl,""),ke(bl,Sl,"esm2017")}$T();const _f="@firebase/installations",xa="0.6.9";/**
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
 */const yf=1e4,vf=`w:${xa}`,Ef="FIS_v2",zT="https://firebaseinstallations.googleapis.com/v1",HT=3600*1e3,WT="installations",KT="Installations";/**
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
 */const GT={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Qt=new Jt(WT,KT,GT);function If(n){return n instanceof Fe&&n.code.includes("request-failed")}/**
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
 */function Tf({projectId:n}){return`${zT}/projects/${n}/installations`}function wf(n){return{token:n.token,requestStatus:2,expiresIn:YT(n.expiresIn),creationTime:Date.now()}}async function Af(n,e){const r=(await e.json()).error;return Qt.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Rf({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function QT(n,{refreshToken:e}){const t=Rf(n);return t.append("Authorization",JT(e)),t}async function bf(n){const e=await n();return e.status>=500&&e.status<600?n():e}function YT(n){return Number(n.replace("s","000"))}function JT(n){return`${Ef} ${n}`}/**
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
 */async function XT({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Tf(n),s=Rf(n),i=e.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={fid:t,authVersion:Ef,appId:n.appId,sdkVersion:vf},c={method:"POST",headers:s,body:JSON.stringify(a)},u=await bf(()=>fetch(r,c));if(u.ok){const d=await u.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:wf(d.authToken)}}else throw await Af("Create Installation",u)}/**
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
 */function Sf(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */function ZT(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const ew=/^[cdef][\w-]{21}$/,Do="";function tw(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=nw(n);return ew.test(t)?t:Do}catch{return Do}}function nw(n){return ZT(n).substr(0,22)}/**
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
 */function ai(n){return`${n.appName}!${n.appId}`}/**
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
 */const Pf=new Map;function Cf(n,e){const t=ai(n);kf(t,e),rw(t,e)}function kf(n,e){const t=Pf.get(n);if(t)for(const r of t)r(e)}function rw(n,e){const t=sw();t&&t.postMessage({key:n,fid:e}),iw()}let jt=null;function sw(){return!jt&&"BroadcastChannel"in self&&(jt=new BroadcastChannel("[Firebase] FID Change"),jt.onmessage=n=>{kf(n.data.key,n.data.fid)}),jt}function iw(){Pf.size===0&&jt&&(jt.close(),jt=null)}/**
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
 */const ow="firebase-installations-database",aw=1,Yt="firebase-installations-store";let Ji=null;function Fa(){return Ji||(Ji=uh(ow,aw,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Yt)}}})),Ji}async function Vs(n,e){const t=ai(n),s=(await Fa()).transaction(Yt,"readwrite"),i=s.objectStore(Yt),a=await i.get(t);return await i.put(e,t),await s.done,(!a||a.fid!==e.fid)&&Cf(n,e.fid),e}async function Df(n){const e=ai(n),r=(await Fa()).transaction(Yt,"readwrite");await r.objectStore(Yt).delete(e),await r.done}async function ci(n,e){const t=ai(n),s=(await Fa()).transaction(Yt,"readwrite"),i=s.objectStore(Yt),a=await i.get(t),c=e(a);return c===void 0?await i.delete(t):await i.put(c,t),await s.done,c&&(!a||a.fid!==c.fid)&&Cf(n,c.fid),c}/**
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
 */async function Ua(n){let e;const t=await ci(n.appConfig,r=>{const s=cw(r),i=uw(n,s);return e=i.registrationPromise,i.installationEntry});return t.fid===Do?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function cw(n){const e=n||{fid:tw(),registrationStatus:0};return Of(e)}function uw(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Qt.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=lw(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:hw(n)}:{installationEntry:e}}async function lw(n,e){try{const t=await XT(n,e);return Vs(n.appConfig,t)}catch(t){throw If(t)&&t.customData.serverCode===409?await Df(n.appConfig):await Vs(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function hw(n){let e=await Pl(n.appConfig);for(;e.registrationStatus===1;)await Sf(100),e=await Pl(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await Ua(n);return r||t}return e}function Pl(n){return ci(n,e=>{if(!e)throw Qt.create("installation-not-found");return Of(e)})}function Of(n){return dw(n)?{fid:n.fid,registrationStatus:0}:n}function dw(n){return n.registrationStatus===1&&n.registrationTime+yf<Date.now()}/**
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
 */async function fw({appConfig:n,heartbeatServiceProvider:e},t){const r=pw(n,t),s=QT(n,t),i=e.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={installation:{sdkVersion:vf,appId:n.appId}},c={method:"POST",headers:s,body:JSON.stringify(a)},u=await bf(()=>fetch(r,c));if(u.ok){const d=await u.json();return wf(d)}else throw await Af("Generate Auth Token",u)}function pw(n,{fid:e}){return`${Tf(n)}/${e}/authTokens:generate`}/**
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
 */async function Ba(n,e=!1){let t;const r=await ci(n.appConfig,i=>{if(!Nf(i))throw Qt.create("not-registered");const a=i.authToken;if(!e&&_w(a))return i;if(a.requestStatus===1)return t=mw(n,e),i;{if(!navigator.onLine)throw Qt.create("app-offline");const c=vw(i);return t=gw(n,c),c}});return t?await t:r.authToken}async function mw(n,e){let t=await Cl(n.appConfig);for(;t.authToken.requestStatus===1;)await Sf(100),t=await Cl(n.appConfig);const r=t.authToken;return r.requestStatus===0?Ba(n,e):r}function Cl(n){return ci(n,e=>{if(!Nf(e))throw Qt.create("not-registered");const t=e.authToken;return Ew(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function gw(n,e){try{const t=await fw(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await Vs(n.appConfig,r),t}catch(t){if(If(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Df(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Vs(n.appConfig,r)}throw t}}function Nf(n){return n!==void 0&&n.registrationStatus===2}function _w(n){return n.requestStatus===2&&!yw(n)}function yw(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+HT}function vw(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function Ew(n){return n.requestStatus===1&&n.requestTime+yf<Date.now()}/**
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
 */async function Iw(n){const e=n,{installationEntry:t,registrationPromise:r}=await Ua(e);return r?r.catch(console.error):Ba(e).catch(console.error),t.fid}/**
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
 */async function Tw(n,e=!1){const t=n;return await ww(t),(await Ba(t,e)).token}async function ww(n){const{registrationPromise:e}=await Ua(n);e&&await e}/**
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
 */function Aw(n){if(!n||!n.options)throw Xi("App Configuration");if(!n.name)throw Xi("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Xi(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Xi(n){return Qt.create("missing-app-config-values",{valueName:n})}/**
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
 */const Vf="installations",Rw="installations-internal",bw=n=>{const e=n.getProvider("app").getImmediate(),t=Aw(e),r=Ot(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Sw=n=>{const e=n.getProvider("app").getImmediate(),t=Ot(e,Vf).getImmediate();return{getId:()=>Iw(t),getToken:s=>Tw(t,s)}};function Pw(){je(new xe(Vf,bw,"PUBLIC")),je(new xe(Rw,Sw,"PRIVATE"))}Pw();ke(_f,xa);ke(_f,xa,"esm2017");/**
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
 */const Ms="analytics",Cw="firebase_id",kw="origin",Dw=60*1e3,Ow="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",qa="https://www.googletagmanager.com/gtag/js";/**
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
 */const De=new xs("@firebase/analytics");/**
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
 */const Nw={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Ve=new Jt("analytics","Analytics",Nw);/**
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
 */function Vw(n){if(!n.startsWith(qa)){const e=Ve.create("invalid-gtag-resource",{gtagURL:n});return De.warn(e.message),""}return n}function Mf(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Mw(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Lw(n,e){const t=Mw("firebase-js-sdk-policy",{createScriptURL:Vw}),r=document.createElement("script"),s=`${qa}?l=${n}&id=${e}`;r.src=t?t?.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function xw(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function Fw(n,e,t,r,s,i){const a=r[s];try{if(a)await e[a];else{const u=(await Mf(t)).find(d=>d.measurementId===s);u&&await e[u.appId]}}catch(c){De.error(c)}n("config",s,i)}async function Uw(n,e,t,r,s){try{let i=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const c=await Mf(t);for(const u of a){const d=c.find(m=>m.measurementId===u),f=d&&e[d.appId];if(f)i.push(f);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),n("event",r,s||{})}catch(i){De.error(i)}}function Bw(n,e,t,r){async function s(i,...a){try{if(i==="event"){const[c,u]=a;await Uw(n,e,t,c,u)}else if(i==="config"){const[c,u]=a;await Fw(n,e,t,r,c,u)}else if(i==="consent"){const[c,u]=a;n("consent",c,u)}else if(i==="get"){const[c,u,d]=a;n("get",c,u,d)}else if(i==="set"){const[c]=a;n("set",c)}else n(i,...a)}catch(c){De.error(c)}}return s}function qw(n,e,t,r,s){let i=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=Bw(i,n,e,t),{gtagCore:i,wrappedGtag:window[s]}}function jw(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(qa)&&t.src.includes(n))return t;return null}/**
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
 */const $w=30,zw=1e3;class Hw{constructor(e={},t=zw){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Lf=new Hw;function Ww(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Kw(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:Ww(r)},i=Ow.replace("{app-id}",t),a=await fetch(i,s);if(a.status!==200&&a.status!==304){let c="";try{const u=await a.json();!((e=u.error)===null||e===void 0)&&e.message&&(c=u.error.message)}catch{}throw Ve.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function Gw(n,e=Lf,t){const{appId:r,apiKey:s,measurementId:i}=n.options;if(!r)throw Ve.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:r};throw Ve.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new Jw;return setTimeout(async()=>{c.abort()},Dw),xf({appId:r,apiKey:s,measurementId:i},a,c,e)}async function xf(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=Lf){var i;const{appId:a,measurementId:c}=n;try{await Qw(r,e)}catch(u){if(c)return De.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${u?.message}]`),{appId:a,measurementId:c};throw u}try{const u=await Kw(n);return s.deleteThrottleMetadata(a),u}catch(u){const d=u;if(!Yw(d)){if(s.deleteThrottleMetadata(a),c)return De.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d?.message}]`),{appId:a,measurementId:c};throw u}const f=Number((i=d?.customData)===null||i===void 0?void 0:i.httpStatus)===503?au(t,s.intervalMillis,$w):au(t,s.intervalMillis),m={throttleEndTimeMillis:Date.now()+f,backoffCount:t+1};return s.setThrottleMetadata(a,m),De.debug(`Calling attemptFetch again in ${f} millis`),xf(n,m,r,s)}}function Qw(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(i),r(Ve.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Yw(n){if(!(n instanceof Fe)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Jw{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Xw(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const i=await e,a=Object.assign(Object.assign({},r),{send_to:i});n("event",t,a)}}/**
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
 */async function Zw(){if(ih())try{await oh()}catch(n){return De.warn(Ve.create("indexeddb-unavailable",{errorInfo:n?.toString()}).message),!1}else return De.warn(Ve.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function eA(n,e,t,r,s,i,a){var c;const u=Gw(n);u.then(R=>{t[R.measurementId]=R.appId,n.options.measurementId&&R.measurementId!==n.options.measurementId&&De.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${R.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(R=>De.error(R)),e.push(u);const d=Zw().then(R=>{if(R)return r.getId()}),[f,m]=await Promise.all([u,d]);jw(i)||Lw(i,f.measurementId),s("js",new Date);const y=(c=a?.config)!==null&&c!==void 0?c:{};return y[kw]="firebase",y.update=!0,m!=null&&(y[Cw]=m),s("config",f.measurementId,y),f.measurementId}/**
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
 */class tA{constructor(e){this.app=e}_delete(){return delete ir[this.app.options.appId],Promise.resolve()}}let ir={},kl=[];const Dl={};let Zi="dataLayer",nA="gtag",Ol,Ff,Nl=!1;function rA(){const n=[];if(sh()&&n.push("This is a browser extension environment."),Mm()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=Ve.create("invalid-analytics-context",{errorInfo:e});De.warn(t.message)}}function sA(n,e,t){rA();const r=n.options.appId;if(!r)throw Ve.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)De.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Ve.create("no-api-key");if(ir[r]!=null)throw Ve.create("already-exists",{id:r});if(!Nl){xw(Zi);const{wrappedGtag:i,gtagCore:a}=qw(ir,kl,Dl,Zi,nA);Ff=i,Ol=a,Nl=!0}return ir[r]=eA(n,kl,Dl,e,Ol,Zi,t),new tA(n)}function iA(n=Fs()){n=re(n);const e=Ot(n,Ms);return e.isInitialized()?e.getImmediate():oA(n)}function oA(n,e={}){const t=Ot(n,Ms);if(t.isInitialized()){const s=t.getImmediate();if(cr(e,t.getOptions()))return s;throw Ve.create("already-initialized")}return t.initialize({options:e})}function aA(n,e,t,r){n=re(n),Xw(Ff,ir[n.app.options.appId],e,t,r).catch(s=>De.error(s))}const Vl="@firebase/analytics",Ml="0.10.8";function cA(){je(new xe(Ms,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return sA(r,s,t)},"PUBLIC")),je(new xe("analytics-internal",n,"PRIVATE")),ke(Vl,Ml),ke(Vl,Ml,"esm2017");function n(e){try{const t=e.getProvider(Ms).getImmediate();return{logEvent:(r,s,i)=>aA(t,r,s,i)}}catch(t){throw Ve.create("interop-component-reg-failed",{reason:t})}}}cA();var uA={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:""};const lA=uA,ui=lh(lA),eo=uv(ui),Pe=XI(ui);BT(ui);typeof window<"u"&&iA(ui);const hA={list:async n=>{let e=Er(Pe,"crp_observations");return n?.organizationId&&(e=_t(e,qt("organizationId","==",n.organizationId))),n?.teacherId&&(e=_t(e,qt("teacherId","==",n.teacherId))),n?.observerId&&(e=_t(e,qt("observerId","==",n.observerId))),n?.status&&(e=_t(e,qt("status","==",n.status))),e=_t(e,ka("createdAt","desc")),n?.limit&&(e=_t(e,uT(n.limit))),(await Va(e)).docs.map(r=>({id:r.id,...r.data(),date:r.data().date?.toDate(),startTime:r.data().startTime?.toDate(),endTime:r.data().endTime?.toDate(),createdAt:r.data().createdAt?.toDate(),updatedAt:r.data().updatedAt?.toDate()}))},getById:async n=>{const e=He(Pe,"crp_observations",n),t=await Oa(e);if(t.exists()){const r=t.data();return{id:t.id,...r,date:r.date?.toDate(),startTime:r.startTime?.toDate(),endTime:r.endTime?.toDate(),createdAt:r.createdAt?.toDate(),updatedAt:r.updatedAt?.toDate()}}throw new Error("Observation not found")},create:async n=>{const e=new Date;return{id:(await df(Er(Pe,"crp_observations"),{...n,createdAt:e,updatedAt:e,version:1,status:n.status||"draft"})).id,...n,createdAt:e,updatedAt:e,version:1,status:n.status||"draft"}},update:async(n,e)=>{const t=He(Pe,"crp_observations",n);await Ma(t,{...e,updatedAt:new Date,version:pT(1)})},delete:async n=>{const e=He(Pe,"crp_observations",n);await hf(e)},subscribe:(n,e)=>{const t=He(Pe,"crp_observations",n);return fT(t,r=>{if(r.exists()){const s=r.data();e({id:r.id,...s,date:s.date?.toDate(),startTime:s.startTime?.toDate(),endTime:s.endTime?.toDate(),createdAt:s.createdAt?.toDate(),updatedAt:s.updatedAt?.toDate()})}else e(null)})}},dA={list:async()=>{const n=_t(Er(Pe,"crp_frameworks"),qt("status","==","active"),ka("name"));return(await Va(n)).docs.map(t=>({id:t.id,...t.data(),createdAt:t.data().createdAt?.toDate(),updatedAt:t.data().updatedAt?.toDate(),approvedAt:t.data().approvedAt?.toDate(),lastUsed:t.data().lastUsed?.toDate()}))},getById:async n=>{const e=He(Pe,"crp_frameworks",n),t=await Oa(e);if(t.exists()){const r=t.data();return{id:t.id,...r,createdAt:r.createdAt?.toDate(),updatedAt:r.updatedAt?.toDate(),approvedAt:r.approvedAt?.toDate(),lastUsed:r.lastUsed?.toDate()}}throw new Error("Framework not found")},create:async n=>{const e=new Date;return{id:(await df(Er(Pe,"crp_frameworks"),{...n,createdAt:e,updatedAt:e,status:n.status||"draft",usageCount:0,averageCompletionTime:0,averageCRPEvidence:0,versionHistory:[]})).id,...n,createdAt:e,updatedAt:e,status:n.status||"draft",usageCount:0,averageCompletionTime:0,averageCRPEvidence:0,versionHistory:[]}},update:async(n,e)=>{const t=He(Pe,"crp_frameworks",n);await Ma(t,{...e,updatedAt:new Date})},delete:async n=>{const e=He(Pe,"crp_frameworks",n);await hf(e)}},Ll={getById:async n=>{const e=He(Pe,"users",n),t=await Oa(e);if(t.exists()){const r=t.data();return{id:t.id,...r,lastLogin:r.lastLogin?.toDate(),createdAt:r.createdAt?.toDate(),updatedAt:r.updatedAt?.toDate()}}throw new Error("User not found")},update:async(n,e)=>{const t=He(Pe,"users",n);await Ma(t,{...e,updatedAt:new Date})},list:async n=>{const e=_t(Er(Pe,"users"),qt("organizationId","==",n),qt("isActive","==",!0),ka("lastName"));return(await Va(e)).docs.map(r=>({id:r.id,...r.data(),lastLogin:r.data().lastLogin?.toDate(),createdAt:r.data().createdAt?.toDate(),updatedAt:r.data().updatedAt?.toDate()}))}},Uf=ym()(Em((n,e)=>({firebaseUser:null,user:null,isLoading:!0,isAuthenticated:!1,error:null,signIn:async(t,r)=>{try{n({isLoading:!0,error:null}),await G_(eo,t,r)}catch(s){throw n({error:s instanceof Error?s.message:"Sign in failed",isLoading:!1}),s}},signOut:async()=>{try{await X_(eo),n({firebaseUser:null,user:null,isAuthenticated:!1,error:null})}catch(t){throw n({error:t instanceof Error?t.message:"Sign out failed"}),t}},initialize:()=>J_(eo,async r=>{if(n({isLoading:!0,error:null}),r)try{const s=await Ll.getById(r.uid);n({firebaseUser:r,user:s,isAuthenticated:!0,isLoading:!1})}catch(s){console.error("Failed to load user data:",s),n({firebaseUser:r,user:null,isAuthenticated:!1,isLoading:!1,error:"Failed to load user profile"})}else n({firebaseUser:null,user:null,isAuthenticated:!1,isLoading:!1})}),clearError:()=>n({error:null}),updateUser:async t=>{const{user:r}=e();if(!r)throw new Error("No user to update");try{await Ll.update(r.id,t),n({user:{...r,...t}})}catch(s){throw n({error:s instanceof Error?s.message:"Update failed"}),s}},hasRole:t=>{const{user:r}=e();return r?r.primaryRole===t||r.secondaryRoles.includes(t):!1},hasPermission:t=>{const{user:r}=e();return r?r.permissions.includes(t):!1},isAdmin:()=>{const{hasRole:t}=e();return t("super_admin")||t("district_admin")||t("school_admin")||t("principal")},canObserve:()=>{const{hasRole:t}=e();return t("observer")||t("principal")||t("assistant_principal")||t("instructional_coach")||t("plc_coach")||t("dei_specialist")}}))),RA=()=>{const n=Uf(e=>e.user);return Gl({queryKey:["observations",n?.id],queryFn:()=>hA.list(),enabled:!!n,staleTime:1e3*60*5})},bA=()=>{const n=Uf(e=>e.user);return Gl({queryKey:["frameworks",n?.id],queryFn:()=>dA.list(),enabled:!!n,staleTime:1e3*60*10})};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fA=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Bf=(...n)=>n.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var pA={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mA=fe.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:s="",children:i,iconNode:a,...c},u)=>fe.createElement("svg",{ref:u,...pA,width:e,height:e,stroke:n,strokeWidth:r?Number(t)*24/Number(e):t,className:Bf("lucide",s),...c},[...a.map(([d,f])=>fe.createElement(d,f)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=(n,e)=>{const t=fe.forwardRef(({className:r,...s},i)=>fe.createElement(mA,{ref:i,iconNode:e,className:Bf(`lucide-${fA(n)}`,r),...s}));return t.displayName=`${n}`,t};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SA=Nr("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PA=Nr("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CA=Nr("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kA=Nr("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DA=Nr("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);export{SA as C,PA as F,CA as P,vA as Q,kA as T,DA as U,RA as a,bA as b,Nr as c,EA as d,Wp as j,Uf as u};
