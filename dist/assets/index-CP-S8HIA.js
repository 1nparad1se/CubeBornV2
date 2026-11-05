(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=2,t=[`k...............`,`kk..............`,`kwk.............`,`kwgk............`,`kwggk...........`,`kwgggk..........`,`kwggggk.........`,`kwgggggk........`,`kwggggggk.......`,`kwgggggddk......`,`kwggdkkkkkk.....`,`kwgdk...........`,`kwdk............`,`kdk.............`,`kk..............`,`k...............`],n=[`kkk.............`,`kwsk............`,`kswsk...........`,`.kswsk..........`,`..kswsk.........`,`...kswsk........`,`....kswsk.......`,`.....kswsk.kk...`,`......kswskRk...`,`.......ksskRk...`,`........kkRk....`,`.......kRRrbk...`,`......kRk.kbbk..`,`.......k...kbbk.`,`............kbk.`,`.............k..`],r=[`.....kk.........`,`....kwwk........`,`....kwgk........`,`....kwgk........`,`....kwgkkk......`,`....kwgkwwkk....`,`.kk.kwgkwgkwk...`,`kwwkkwgkwgkwgk..`,`kwggkwggggggwk..`,`.kwgggggggggwk..`,`..kwggggggggdk..`,`..kwgggggggdk...`,`...kwgggggdk....`,`....kdddddk.....`,`....kkkkkkk.....`,`................`],i={k:`#120c06`,w:`#fff4d0`,g:`#e8b23a`,d:`#9a6a18`,r:`#ff4a3a`,R:`#8a1a14`,s:`#c8d4e0`,b:`#6a4422`};function a(t){let n=document.createElement(`canvas`);n.width=n.height=32;let r=n.getContext(`2d`);return r?(t.forEach((t,n)=>{for(let a=0;a<t.length;a++){let o=i[t[a]];o&&(r.fillStyle=o,r.fillRect(a*e,n*e,e,e))}}),n.toDataURL(`image/png`)):``}var o={},s=null,c=null;function l(){let e=a(t),i=a(n),s=a(r);if(!e)return;o.default=`url(${e}) 1 1, auto`,o.attack=`url(${i}) 2 2, crosshair`,o.pointer=`url(${s}) 10 1, pointer`;let l=document.createElement(`style`);l.textContent=`html, body { cursor: ${o.default}; }
button, a, [role=button], .btn, select, input[type=range], .clickable, [onclick] { cursor: ${o.pointer} !important; }`,document.head.append(l),c=document.body}function u(e,t){if(e===s)return;s=e;let n=t??c;n&&o[e]&&(n.style.cursor=e==="default"?``:o[e])}function d(e){"@babel/helpers - typeof";return d=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},d(e)}function f(e,t){if(d(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(d(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function p(e){var t=f(e,`string`);return d(t)==`symbol`?t:t+``}function m(e,t,n){return(t=p(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var h=1440,g=1,_=480,v=[{p:`dawn`,from:300,to:420},{p:`day`,from:420,to:1080},{p:`dusk`,from:1080,to:1200},{p:`night`,from:1200,to:1740}];function y(e){if(!Number.isFinite(e))return _;let t=e%h;return t<0?t+h:t}function b(e){let t=y(e);for(let e of v){let n=t<e.from?t+h:t;if(n>=e.from&&n<e.to)return{p:e.p,k:(n-e.from)/(e.to-e.from)}}return{p:`night`,k:0}}function x(e){let t=Math.floor(y(e)),n=Math.floor(t/60),r=t%60;return`${n<10?`0`:``}${n}:${r<10?`0`:``}${r}`}var S=class e{constructor(e=_,t=0){m(this,`minutes`,void 0),m(this,`days`,0),this.minutes=y(e),this.days=Number.isFinite(t)&&t>0?Math.floor(t):0}advance(e){if(!(e>0))return;let t=this.minutes+e*g;this.days+=Math.floor(t/h),this.minutes=y(t)}get hhmm(){return x(this.minutes)}get phase(){return b(this.minutes).p}toSave(){return{minutes:Math.round(this.minutes*1e3)/1e3,days:this.days}}static fromSave(t){if(t&&typeof t==`object`){let n=t;if(typeof n.minutes==`number`&&Number.isFinite(n.minutes))return new e(n.minutes,typeof n.days==`number`?n.days:0)}return new e}},C={burst(){},number(){},text(){},shake(){},light(){},sound(){},vibrate(){},emit(){},level:()=>-1},w=1e3,T=1001,E=1002,D=1003,O=1004,k=1005,A=1006,j=1007,ee=1008,te=1009,M=1010,N=1011,P=1012,ne=1013,re=1014,ie=1015,ae=1016,oe=1017,se=1018,ce=1020,le=35902,ue=35899,de=1021,F=1022,fe=1023,I=1026,pe=1027,L=1028,me=1029,he=1030,ge=1031,R=1033,_e=33776,z=33777,ve=33778,ye=33779,be=35840,xe=35841,Se=35842,Ce=35843,we=36196,Te=37492,Ee=37496,De=37808,Oe=37809,ke=37810,Ae=37811,je=37812,Me=37813,Ne=37814,Pe=37815,Fe=37816,Ie=37817,Le=37818,Re=37819,ze=37820,Be=37821,Ve=36492,He=36494,Ue=36495,We=36283,Ge=36284,Ke=36285,qe=36286,Je=2300,Ye=2301,Xe=2302,Ze=2400,Qe=2401,$e=2402,et=3200,tt=3201,nt=`srgb`,rt=`srgb-linear`,it=`linear`,at=`srgb`,ot=7680,st=35044,ct=35048,lt=2e3,ut=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},dt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ft=Math.PI/180,pt=180/Math.PI;function mt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(dt[e&255]+dt[e>>8&255]+dt[e>>16&255]+dt[e>>24&255]+`-`+dt[t&255]+dt[t>>8&255]+`-`+dt[t>>16&15|64]+dt[t>>24&255]+`-`+dt[n&63|128]+dt[n>>8&255]+`-`+dt[n>>16&255]+dt[n>>24&255]+dt[r&255]+dt[r>>8&255]+dt[r>>16&255]+dt[r>>24&255]).toLowerCase()}function B(e,t,n){return Math.max(t,Math.min(n,e))}function ht(e,t){return(e%t+t)%t}function gt(e,t,n){return(1-n)*e+n*t}function _t(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function vt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var V=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(B(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},yt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0)e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;else if(o===1)e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;else{if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(B(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class e{constructor(t=0,n=0,r=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=r}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this.z=B(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this.z=B(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return bt.copy(this).projectOnVector(e),this.sub(bt)}reflect(e){return this.sub(bt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(B(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},bt=new H,xt=new yt,U=class e{constructor(t,n,r,i,a,o,s,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(St.makeScale(e,t)),this}rotate(e){return this.premultiply(St.makeRotation(-e)),this}translate(e,t){return this.premultiply(St.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},St=new U;function Ct(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function wt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Tt(){let e=wt(`canvas`);return e.style.display=`block`,e}var Et={};function Dt(e){e in Et||(Et[e]=!0,console.warn(e))}function Ot(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var kt=new U().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),At=new U().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jt(){let e={enabled:!0,workingColorSpace:rt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Nt(e.r),e.g=Nt(e.g),e.b=Nt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Pt(e.r),e.g=Pt(e.g),e.b=Pt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?it:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Dt(`THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Dt(`THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[rt]:{primaries:t,whitePoint:r,transfer:it,toXYZ:kt,fromXYZ:At,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:nt},outputColorSpaceConfig:{drawingBufferColorSpace:nt}},[nt]:{primaries:t,whitePoint:r,transfer:at,toXYZ:kt,fromXYZ:At,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:nt}}}),e}var Mt=jt();function Nt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Pt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Ft,It=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ft===void 0&&(Ft=wt(`canvas`)),Ft.width=e.width,Ft.height=e.height;let t=Ft.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Ft}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=wt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Nt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Nt(t[e]/255)*255):t[e]=Nt(t[e]);return{data:t,width:e.width,height:e.height}}return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Lt=0,Rt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lt++}),this.uuid=mt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(zt(r[t].image)):e.push(zt(r[t]))}else e=zt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function zt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?It.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var Bt=0,Vt=new H,Ht=class e extends ut{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=T,i=T,a=A,o=ee,s=fe,c=te,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bt++}),this.uuid=mt(),this.name=``,this.source=new Rt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new V(0,0),this.repeat=new V(1,1),this.center=new V(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new U,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Vt).x}get height(){return this.source.getSize(Vt).y}get depth(){return this.source.getSize(Vt).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case w:e.x-=Math.floor(e.x);break;case T:e.x=e.x<0?0:1;break;case E:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case w:e.y-=Math.floor(e.y);break;case T:e.y=e.y<0?0:1;break;case E:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ht.DEFAULT_IMAGE=null,Ht.DEFAULT_MAPPING=300,Ht.DEFAULT_ANISOTROPY=1;var Ut=class e{constructor(t=0,n=0,r=0,i=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=r,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=B(this.x,e.x,t.x),this.y=B(this.y,e.y,t.y),this.z=B(this.z,e.z,t.z),this.w=B(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=B(this.x,e,t),this.y=B(this.y,e,t),this.z=B(this.z,e,t),this.w=B(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(B(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Wt=class extends ut{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:A,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ut(0,0,e,t),this.scissorTest=!1,this.viewport=new Ut(0,0,e,t);let r=new Ht({width:e,height:t,depth:n.depth});this.textures=[];let i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:A,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Rt(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:`dispose`})}},Gt=class extends Wt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Kt=class extends Ht{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=D,this.minFilter=D,this.wrapR=T,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},qt=class extends Ht{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=D,this.minFilter=D,this.wrapR=T,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Jt=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Xt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Xt):Xt.fromBufferAttribute(r,t),Xt.applyMatrix4(e.matrixWorld),this.expandByPoint(Xt);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Zt.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Zt.copy(e.boundingBox)),Zt.applyMatrix4(e.matrixWorld),this.union(Zt)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xt),Xt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(an),on.subVectors(this.max,an),Qt.subVectors(e.a,an),$t.subVectors(e.b,an),en.subVectors(e.c,an),tn.subVectors($t,Qt),nn.subVectors(en,$t),rn.subVectors(Qt,en);let t=[0,-tn.z,tn.y,0,-nn.z,nn.y,0,-rn.z,rn.y,tn.z,0,-tn.x,nn.z,0,-nn.x,rn.z,0,-rn.x,-tn.y,tn.x,0,-nn.y,nn.x,0,-rn.y,rn.x,0];return!ln(t,Qt,$t,en,on)||(t=[1,0,0,0,1,0,0,0,1],!ln(t,Qt,$t,en,on))?!1:(sn.crossVectors(tn,nn),t=[sn.x,sn.y,sn.z],ln(t,Qt,$t,en,on))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Yt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Yt=[new H,new H,new H,new H,new H,new H,new H,new H],Xt=new H,Zt=new Jt,Qt=new H,$t=new H,en=new H,tn=new H,nn=new H,rn=new H,an=new H,on=new H,sn=new H,cn=new H;function ln(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){cn.fromArray(e,a);let o=i.x*Math.abs(cn.x)+i.y*Math.abs(cn.y)+i.z*Math.abs(cn.z),s=t.dot(cn),c=n.dot(cn),l=r.dot(cn);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var un=new Jt,dn=new H,fn=new H,pn=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?un.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;dn.subVectors(e,this.center);let t=dn.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(dn,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fn.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(dn.copy(e.center).add(fn)),this.expandByPoint(dn.copy(e.center).sub(fn))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},mn=new H,hn=new H,gn=new H,_n=new H,vn=new H,yn=new H,bn=new H,xn=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mn.copy(this.origin).addScaledVector(this.direction,t),mn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){hn.copy(e).add(t).multiplyScalar(.5),gn.copy(t).sub(e).normalize(),_n.copy(this.origin).sub(hn);let i=e.distanceTo(t)*.5,a=-this.direction.dot(gn),o=_n.dot(this.direction),s=-_n.dot(gn),c=_n.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(hn).addScaledVector(gn,d),f}intersectSphere(e,t){mn.subVectors(e.center,this.origin);let n=mn.dot(this.direction),r=mn.dot(mn)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,mn)!==null}intersectTriangle(e,t,n,r,i){vn.subVectors(t,e),yn.subVectors(n,e),bn.crossVectors(vn,yn);let a=this.direction.dot(bn),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;_n.subVectors(this.origin,e);let s=o*this.direction.dot(yn.crossVectors(_n,yn));if(s<0)return null;let c=o*this.direction.dot(vn.cross(_n));if(c<0||s+c>a)return null;let l=-o*_n.dot(bn);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Sn=class e{constructor(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Cn.setFromMatrixColumn(e,0).length(),i=1/Cn.setFromMatrixColumn(e,1).length(),a=1/Cn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tn,e,En)}lookAt(e,t,n){let r=this.elements;return kn.subVectors(e,t),kn.lengthSq()===0&&(kn.z=1),kn.normalize(),Dn.crossVectors(n,kn),Dn.lengthSq()===0&&(Math.abs(n.z)===1?kn.x+=1e-4:kn.z+=1e-4,kn.normalize(),Dn.crossVectors(n,kn)),Dn.normalize(),On.crossVectors(kn,Dn),r[0]=Dn.x,r[4]=On.x,r[8]=kn.x,r[1]=Dn.y,r[5]=On.y,r[9]=kn.y,r[2]=Dn.z,r[6]=On.z,r[10]=kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],te=r[3],M=r[7],N=r[11],P=r[15];return i[0]=a*x+o*T+s*k+c*te,i[4]=a*S+o*E+s*A+c*M,i[8]=a*C+o*D+s*j+c*N,i[12]=a*w+o*O+s*ee+c*P,i[1]=l*x+u*T+d*k+f*te,i[5]=l*S+u*E+d*A+f*M,i[9]=l*C+u*D+d*j+f*N,i[13]=l*w+u*O+d*ee+f*P,i[2]=p*x+m*T+h*k+g*te,i[6]=p*S+m*E+h*A+g*M,i[10]=p*C+m*D+h*j+g*N,i[14]=p*w+m*O+h*ee+g*P,i[3]=_*x+v*T+y*k+b*te,i[7]=_*S+v*E+y*A+b*M,i[11]=_*C+v*D+y*j+b*N,i[15]=_*w+v*O+y*ee+b*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=Cn.set(r[0],r[1],r[2]).length(),a=Cn.set(r[4],r[5],r[6]).length(),o=Cn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],wn.copy(this);let s=1/i,c=1/a,l=1/o;return wn.elements[0]*=s,wn.elements[1]*=s,wn.elements[2]*=s,wn.elements[4]*=c,wn.elements[5]*=c,wn.elements[6]*=c,wn.elements[8]*=l,wn.elements[9]*=l,wn.elements[10]*=l,t.setFromRotationMatrix(wn),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a,o=lt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=lt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Cn=new H,wn=new Sn,Tn=new H(0,0,0),En=new H(1,1,1),Dn=new H,On=new H,kn=new H,An=new Sn,jn=new yt,Mn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(B(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-B(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(B(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-B(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(B(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-B(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return An.makeRotationFromQuaternion(e),this.setFromRotationMatrix(An,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return jn.setFromEuler(this),this.setFromQuaternion(jn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mn.DEFAULT_ORDER=`XYZ`;var Nn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Pn=0,Fn=new H,In=new yt,Ln=new Sn,Rn=new H,zn=new H,Bn=new H,Vn=new yt,Hn=new H(1,0,0),Un=new H(0,1,0),Wn=new H(0,0,1),Gn={type:`added`},Kn={type:`removed`},qn={type:`childadded`,child:null},Jn={type:`childremoved`,child:null},Yn=class e extends ut{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pn++}),this.uuid=mt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new Mn,r=new yt,i=new H(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Sn},normalMatrix:{value:new U}}),this.matrix=new Sn,this.matrixWorld=new Sn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.multiply(In),this}rotateOnWorldAxis(e,t){return In.setFromAxisAngle(e,t),this.quaternion.premultiply(In),this}rotateX(e){return this.rotateOnAxis(Hn,e)}rotateY(e){return this.rotateOnAxis(Un,e)}rotateZ(e){return this.rotateOnAxis(Wn,e)}translateOnAxis(e,t){return Fn.copy(e).applyQuaternion(this.quaternion),this.position.add(Fn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hn,e)}translateY(e){return this.translateOnAxis(Un,e)}translateZ(e){return this.translateOnAxis(Wn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Rn.copy(e):Rn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),zn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(zn,Rn,this.up):Ln.lookAt(Rn,zn,this.up),this.quaternion.setFromRotationMatrix(Ln),r&&(Ln.extractRotation(r.matrixWorld),In.setFromRotationMatrix(Ln),this.quaternion.premultiply(In.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gn),qn.child=e,this.dispatchEvent(qn),qn.child=null):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Kn),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gn),qn.child=e,this.dispatchEvent(qn),qn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zn,e,Bn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zn,Vn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++)e[t].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Yn.DEFAULT_UP=new H(0,1,0),Yn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Yn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Xn=new H,Zn=new H,Qn=new H,$n=new H,er=new H,tr=new H,nr=new H,rr=new H,ir=new H,ar=new H,or=new Ut,sr=new Ut,cr=new Ut,lr=class e{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Xn.subVectors(e,t),r.cross(Xn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Xn.subVectors(r,t),Zn.subVectors(n,t),Qn.subVectors(e,t);let a=Xn.dot(Xn),o=Xn.dot(Zn),s=Xn.dot(Qn),c=Zn.dot(Zn),l=Zn.dot(Qn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,$n)!==null&&$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,$n)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,$n.x),s.addScaledVector(a,$n.y),s.addScaledVector(o,$n.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return or.setScalar(0),sr.setScalar(0),cr.setScalar(0),or.fromBufferAttribute(e,t),sr.fromBufferAttribute(e,n),cr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(or,i.x),a.addScaledVector(sr,i.y),a.addScaledVector(cr,i.z),a}static isFrontFacing(e,t,n,r){return Xn.subVectors(n,t),Zn.subVectors(e,t),Xn.cross(Zn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),Xn.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;er.subVectors(r,n),tr.subVectors(i,n),rr.subVectors(e,n);let s=er.dot(rr),c=tr.dot(rr);if(s<=0&&c<=0)return t.copy(n);ir.subVectors(e,r);let l=er.dot(ir),u=tr.dot(ir);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(er,a);ar.subVectors(e,i);let f=er.dot(ar),p=tr.dot(ar);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(tr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return nr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(nr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(er,a).addScaledVector(tr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ur={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},dr={h:0,s:0,l:0},fr={h:0,s:0,l:0};function pr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var W=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Mt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Mt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Mt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Mt.workingColorSpace){if(e=ht(e,1),t=B(t,0,1),n=B(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=pr(i,r,e+1/3),this.g=pr(i,r,e),this.b=pr(i,r,e-1/3)}return Mt.colorSpaceToWorking(this,r),this}setStyle(e,t=nt){function n(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:console.warn(`THREE.Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);console.warn(`THREE.Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nt){let n=ur[e.toLowerCase()];return n===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nt(e.r),this.g=Nt(e.g),this.b=Nt(e.b),this}copyLinearToSRGB(e){return this.r=Pt(e.r),this.g=Pt(e.g),this.b=Pt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nt){return Mt.workingToColorSpace(mr.copy(this),e),Math.round(B(mr.r*255,0,255))*65536+Math.round(B(mr.g*255,0,255))*256+Math.round(B(mr.b*255,0,255))}getHexString(e=nt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Mt.workingColorSpace){Mt.workingToColorSpace(mr.copy(this),t);let n=mr.r,r=mr.g,i=mr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Mt.workingColorSpace){return Mt.workingToColorSpace(mr.copy(this),t),e.r=mr.r,e.g=mr.g,e.b=mr.b,e}getStyle(e=nt){Mt.workingToColorSpace(mr.copy(this),e);let t=mr.r,n=mr.g,r=mr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(dr),this.setHSL(dr.h+e,dr.s+t,dr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(dr),e.getHSL(fr);let n=gt(dr.h,fr.h,t),r=gt(dr.s,fr.s,t),i=gt(dr.l,fr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mr=new W;W.NAMES=ur;var hr=0,gr=class extends ut{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hr++}),this.uuid=mt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ot,this.stencilZFail=ot,this.stencilZPass=ot,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},_r=class extends gr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},vr=new H,yr=new V,br=0,xr=class{constructor(e,t,n=!1){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:br++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=st,this.updateRanges=[],this.gpuType=ie,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)yr.fromBufferAttribute(this,t),yr.applyMatrix3(e),this.setXY(t,yr.x,yr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix3(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix4(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyNormalMatrix(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.transformDirection(e),this.setXYZ(t,vr.x,vr.y,vr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_t(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_t(t,this.array)),t}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_t(t,this.array)),t}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_t(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_t(t,this.array)),t}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),r=vt(r,this.array),i=vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}},Sr=class extends xr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Cr=class extends xr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},G=class extends xr{constructor(e,t,n){super(new Float32Array(e),t,n)}},wr=0,Tr=new Sn,Er=new Yn,Dr=new H,Or=new Jt,kr=new Jt,Ar=new H,jr=class e extends ut{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wr++}),this.uuid=mt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ct(e)?Cr:Sr)(e,1):e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new U().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tr.makeRotationFromQuaternion(e),this.applyMatrix4(Tr),this}rotateX(e){return Tr.makeRotationX(e),this.applyMatrix4(Tr),this}rotateY(e){return Tr.makeRotationY(e),this.applyMatrix4(Tr),this}rotateZ(e){return Tr.makeRotationZ(e),this.applyMatrix4(Tr),this}translate(e,t,n){return Tr.makeTranslation(e,t,n),this.applyMatrix4(Tr),this}scale(e,t,n){return Tr.makeScale(e,t,n),this.applyMatrix4(Tr),this}lookAt(e){return Er.lookAt(e),Er.updateMatrix(),this.applyMatrix4(Er.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Dr).negate(),this.translate(Dr.x,Dr.y,Dr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new G(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&console.warn(`THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Or.setFromBufferAttribute(n),this.morphTargetsRelative?(Ar.addVectors(this.boundingBox.min,Or.min),this.boundingBox.expandByPoint(Ar),Ar.addVectors(this.boundingBox.max,Or.max),this.boundingBox.expandByPoint(Ar)):(this.boundingBox.expandByPoint(Or.min),this.boundingBox.expandByPoint(Or.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new H,1/0);else if(e){let n=this.boundingSphere.center;if(Or.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];kr.setFromBufferAttribute(n),this.morphTargetsRelative?(Ar.addVectors(Or.min,kr.min),Or.expandByPoint(Ar),Ar.addVectors(Or.max,kr.max),Or.expandByPoint(Ar)):(Or.expandByPoint(kr.min),Or.expandByPoint(kr.max))}Or.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Ar.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Ar));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Ar.fromBufferAttribute(a,t),o&&(Dr.fromBufferAttribute(e,t),Ar.add(Dr)),r=Math.max(r,n.distanceToSquared(Ar))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new xr(new Float32Array(4*n.count),4));let a=this.getAttribute(`tangent`),o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new H,s[e]=new H;let c=new H,l=new H,u=new H,d=new V,f=new V,p=new V,m=new H,h=new H;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new H,y=new H,b=new H,x=new H;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new xr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ar.fromBufferAttribute(e,t),Ar.normalize(),e.setXYZ(t,Ar.x,Ar.y,Ar.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new xr(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Mr=new Sn,Nr=new xn,Pr=new pn,Fr=new H,Ir=new H,Lr=new H,Rr=new H,zr=new H,Br=new H,Vr=new H,Hr=new H,Ur=class extends Yn{constructor(e=new jr,t=new _r){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Br.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(zr.fromBufferAttribute(s,e),a?Br.addScaledVector(zr,r):Br.addScaledVector(zr.sub(t),r))}t.add(Br)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(i),Nr.copy(e.ray).recast(e.near),Pr.containsPoint(Nr.origin)===!1&&(Nr.intersectSphere(Pr,Fr)===null||Nr.origin.distanceToSquared(Fr)>(e.far-e.near)**2)||(Mr.copy(i).invert(),Nr.copy(e.ray).applyMatrix4(Mr),(n.boundingBox===null||Nr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Nr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Gr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Gr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Gr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Gr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Wr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Hr.copy(s),Hr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Hr);return l<n.near||l>n.far?null:{distance:l,point:Hr.clone(),object:e}}function Gr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ir),e.getVertexPosition(c,Lr),e.getVertexPosition(l,Rr);let u=Wr(e,t,n,r,Ir,Lr,Rr,Vr);if(u){let e=new H;lr.getBarycoord(Vr,Ir,Lr,Rr,e),i&&(u.uv=lr.getInterpolatedAttribute(i,s,c,l,e,new V)),a&&(u.uv1=lr.getInterpolatedAttribute(a,s,c,l,e,new V)),o&&(u.normal=lr.getInterpolatedAttribute(o,s,c,l,e,new H),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new H,materialIndex:0};lr.getNormal(Ir,Lr,Rr,t.normal),u.face=t,u.barycoord=e}return u}var Kr=class e extends jr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new G(c,3)),this.setAttribute(`normal`,new G(l,3)),this.setAttribute(`uv`,new G(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new H;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function qr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function Jr(e){let t={};for(let n=0;n<e.length;n++){let r=qr(e[n]);for(let e in r)t[e]=r[e]}return t}function Yr(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Xr(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Mt.workingColorSpace}var Zr={clone:qr,merge:Jr},Qr=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$r=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ei=class extends gr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qr,this.fragmentShader=$r,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qr(e.uniforms),this.uniformsGroups=Yr(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ti=class extends Yn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Sn,this.projectionMatrix=new Sn,this.projectionMatrixInverse=new Sn,this.coordinateSystem=lt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ni=new H,ri=new V,ii=new V,ai=class extends ti{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=pt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ft*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return pt*2*Math.atan(Math.tan(ft*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ni.x,ni.y).multiplyScalar(-e/ni.z),ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ni.x,ni.y).multiplyScalar(-e/ni.z)}getViewSize(e,t){return this.getViewBounds(e,ri,ii),t.subVectors(ii,ri)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ft*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},oi=-90,si=1,ci=class extends Yn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ai(oi,si,e,t);r.layers=this.layers,this.add(r);let i=new ai(oi,si,e,t);i.layers=this.layers,this.add(i);let a=new ai(oi,si,e,t);a.layers=this.layers,this.add(a);let o=new ai(oi,si,e,t);o.layers=this.layers,this.add(o);let s=new ai(oi,si,e,t);s.layers=this.layers,this.add(s);let c=new ai(oi,si,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,i),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,s),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},li=class extends Ht{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ui=class extends Gt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new li(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Kr(5,5,5),i=new ei({name:`CubemapFromEquirect`,uniforms:qr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ur(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=A),new ci(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},di=class extends Yn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},fi={type:`move`},pi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new di,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new di,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new di,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new di;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},mi=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new W(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},hi=class extends Yn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},gi=class extends Ht{constructor(e=null,t=1,n=1,r,i,a,o,s,c=D,l=D,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},_i=class extends xr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},vi=new Sn,yi=new Sn,bi=[],xi=new Jt,Si=new Sn,Ci=new Ur,wi=new pn,Ti=class extends Ur{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _i(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Si)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Jt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vi),xi.copy(e.boundingBox).applyMatrix4(vi),this.boundingBox.union(xi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vi),wi.copy(e.boundingSphere).applyMatrix4(vi),this.boundingSphere.union(wi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ci.geometry=this.geometry,Ci.material=this.material,Ci.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wi.copy(this.boundingSphere),wi.applyMatrix4(n),e.ray.intersectsSphere(wi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,vi),yi.multiplyMatrices(n,vi),Ci.matrixWorld=yi,Ci.raycast(e,bi);for(let e=0,n=bi.length;e<n;e++){let n=bi[e];n.instanceId=i,n.object=this,t.push(n)}bi.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new _i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new gi(new Float32Array(r*this.count),r,this.count,L,ie));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;i[s]=o,i.set(n,s+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ei=new H,Di=new H,Oi=new U,ki=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ei.subVectors(n,t).cross(Di.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ei),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(e.start).addScaledVector(n,i)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Oi.getNormalMatrix(e),r=this.coplanarPoint(Ei).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ai=new pn,ji=new V(.5,.5),Mi=new H,Ni=class{constructor(e=new ki,t=new ki,n=new ki,r=new ki,i=new ki,a=new ki){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=lt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ai)}intersectsSprite(e){return Ai.center.set(0,0,0),Ai.radius=.7071067811865476+ji.distanceTo(e.center),Ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ai)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Mi.x=r.normal.x>0?e.max.x:e.min.x,Mi.y=r.normal.y>0?e.max.y:e.min.y,Mi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Mi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Pi=class extends gr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new W(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Fi=new H,Ii=new H,Li=new Sn,Ri=new xn,zi=new pn,Bi=new H,Vi=new H,Hi=class extends Yn{constructor(e=new jr,t=new Pi){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Fi.fromBufferAttribute(t,e-1),Ii.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Fi.distanceTo(Ii);e.setAttribute(`lineDistance`,new G(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zi.copy(n.boundingSphere),zi.applyMatrix4(r),zi.radius+=i,e.ray.intersectsSphere(zi)===!1)return;Li.copy(r).invert(),Ri.copy(e.ray).applyMatrix4(Li);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Ui(this,e,Ri,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Ui(this,e,Ri,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Ui(this,e,Ri,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Ui(this,e,Ri,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Ui(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Fi.fromBufferAttribute(s,i),Ii.fromBufferAttribute(s,a),n.distanceSqToSegment(Fi,Ii,Bi,Vi)>r)return;Bi.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Bi);if(!(c<t.near||c>t.far))return{distance:c,point:Vi.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Wi=new H,Gi=new H,Ki=class extends Hi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Wi.fromBufferAttribute(t,e),Gi.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Wi.distanceTo(Gi);e.setAttribute(`lineDistance`,new G(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},qi=class extends gr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new W(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ji=new Sn,Yi=new xn,Xi=new pn,Zi=new H,Qi=class extends Yn{constructor(e=new jr,t=new qi){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xi.copy(n.boundingSphere),Xi.applyMatrix4(r),Xi.radius+=i,e.ray.intersectsSphere(Xi)===!1)return;Ji.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(Ji);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Zi.fromBufferAttribute(l,n),$i(Zi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Zi.fromBufferAttribute(l,a),$i(Zi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function $i(e,t,n,r,i,a,o){let s=Yi.distanceSqToPoint(e);if(s<n){let n=new H;Yi.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ea=class extends Ht{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ta=class extends Ht{constructor(e,t,n=re,r,i,a,o=D,s=D,c,l=I,u=1){if(l!==1026&&l!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Rt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},na=class extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ra=new H,ia=new H,aa=new H,oa=new lr,sa=class extends jr{constructor(e=null,t=1){if(super(),this.type=`EdgesGeometry`,this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=1e4,r=Math.cos(ft*t),i=e.getIndex(),a=e.getAttribute(`position`),o=i?i.count:a.count,s=[0,0,0],c=[`a`,`b`,`c`],l=[,,,],u={},d=[];for(let e=0;e<o;e+=3){i?(s[0]=i.getX(e),s[1]=i.getX(e+1),s[2]=i.getX(e+2)):(s[0]=e,s[1]=e+1,s[2]=e+2);let{a:t,b:o,c:f}=oa;if(t.fromBufferAttribute(a,s[0]),o.fromBufferAttribute(a,s[1]),f.fromBufferAttribute(a,s[2]),oa.getNormal(aa),l[0]=`${Math.round(t.x*n)},${Math.round(t.y*n)},${Math.round(t.z*n)}`,l[1]=`${Math.round(o.x*n)},${Math.round(o.y*n)},${Math.round(o.z*n)}`,l[2]=`${Math.round(f.x*n)},${Math.round(f.y*n)},${Math.round(f.z*n)}`,l[0]!==l[1]&&l[1]!==l[2]&&l[2]!==l[0])for(let e=0;e<3;e++){let t=(e+1)%3,n=l[e],i=l[t],a=oa[c[e]],o=oa[c[t]],f=`${n}_${i}`,p=`${i}_${n}`;p in u&&u[p]?(aa.dot(u[p].normal)<=r&&(d.push(a.x,a.y,a.z),d.push(o.x,o.y,o.z)),u[p]=null):f in u||(u[f]={index0:s[e],index1:s[t],normal:aa.clone()})}}for(let e in u)if(u[e]){let{index0:t,index1:n}=u[e];ra.fromBufferAttribute(a,t),ia.fromBufferAttribute(a,n),d.push(ra.x,ra.y,ra.z),d.push(ia.x,ia.y,ia.z)}this.setAttribute(`position`,new G(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},ca=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn(`THREE.Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new V:new H);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new H,r=[],i=[],a=[],o=new H,s=new Sn;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new H)}i[0]=new H,a[0]=new H;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(B(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(B(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},la=class extends ca{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new V){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ua=class extends la{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function da(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var fa=new H,pa=new da,ma=new da,ha=new da,ga=class extends ca{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new H){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(fa.subVectors(r[0],r[1]).add(r[0]),c=fa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(fa.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=fa),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),pa.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),ma.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),ha.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(pa.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),ma.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),ha.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(pa.calc(s),ma.calc(s),ha.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new H().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function _a(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function va(e,t){let n=1-e;return n*n*t}function ya(e,t){return 2*(1-e)*e*t}function ba(e,t){return e*e*t}function xa(e,t,n,r){return va(e,t)+ya(e,n)+ba(e,r)}function Sa(e,t){let n=1-e;return n*n*n*t}function Ca(e,t){let n=1-e;return 3*n*n*e*t}function wa(e,t){return 3*(1-e)*e*e*t}function Ta(e,t){return e*e*e*t}function Ea(e,t,n,r,i){return Sa(e,t)+Ca(e,n)+wa(e,r)+Ta(e,i)}var Da=class extends ca{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ea(e,r.x,i.x,a.x,o.x),Ea(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Oa=class extends ca{constructor(e=new H,t=new H,n=new H,r=new H){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ea(e,r.x,i.x,a.x,o.x),Ea(e,r.y,i.y,a.y,o.y),Ea(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ka=class extends ca{constructor(e=new V,t=new V){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Aa=class extends ca{constructor(e=new H,t=new H){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new H){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new H){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends ca{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(xa(e,r.x,i.x,a.x),xa(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ma=class extends ca{constructor(e=new H,t=new H,n=new H){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(xa(e,r.x,i.x,a.x),xa(e,r.y,i.y,a.y),xa(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Na=class extends ca{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new V){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(_a(o,s.x,c.x,l.x,u.x),_a(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this}},Pa=Object.freeze({__proto__:null,ArcCurve:ua,CatmullRomCurve3:ga,CubicBezierCurve:Da,CubicBezierCurve3:Oa,EllipseCurve:la,LineCurve:ka,LineCurve3:Aa,QuadraticBezierCurve:ja,QuadraticBezierCurve3:Ma,SplineCurve:Na}),Fa=class extends ca{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Pa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Pa[n.type]().fromJSON(n))}return this}},Ia=class extends Fa{constructor(e){super(),this.type=`Path`,this.currentPoint=new V,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ka(this.currentPoint.clone(),new V(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ja(this.currentPoint.clone(),new V(e,t),new V(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Da(this.currentPoint.clone(),new V(e,t),new V(n,r),new V(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new Na([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new la(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},La=class extends Ia{constructor(e){super(e),this.uuid=mt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Ia().fromJSON(n))}return this}};function Ra(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=za(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Ka(e,t,a,n)),e.length>80*n){s=1/0,c=1/0;let t=-1/0,r=-1/0;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Va(a,o,n,s,c,l,0),o}function za(e,t,n,r,i){let a;if(i===_o(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=mo(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=mo(i/r|0,e[i],e[i+1],a);return a&&ao(a,a.next)&&(ho(a),a=a.next),a}function Ba(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(ao(n,n.next)||io(n.prev,n,n.next)===0)){if(ho(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Va(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Za(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Ua(e,r,i,a):Ha(e))t.push(c.i,e.i,l.i),ho(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Wa(Ba(e),t),Va(e,t,n,r,i,a,2)):o===2&&Ga(e,t,n,r,i,a):Va(Ba(e),t,n,r,i,a,1);break}}}function Ha(e){let t=e.prev,n=e,r=e.next;if(io(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&no(i,s,a,c,o,l,m.x,m.y)&&io(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ua(e,t,n,r){let i=e.prev,a=e,o=e.next;if(io(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=$a(p,m,t,n,r),v=$a(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&no(s,u,c,d,l,f,y.x,y.y)&&io(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&no(s,u,c,d,l,f,b.x,b.y)&&io(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&no(s,u,c,d,l,f,y.x,y.y)&&io(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&no(s,u,c,d,l,f,b.x,b.y)&&io(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Wa(e,t){let n=e;do{let r=n.prev,i=n.next.next;!ao(r,i)&&oo(r,n,n.next,i)&&uo(r,i)&&uo(i,r)&&(t.push(r.i,n.i,i.i),ho(n),ho(n.next),n=e=i),n=n.next}while(n!==e);return Ba(n)}function Ga(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&ro(o,e)){let s=po(o,e);o=Ba(o,o.next),s=Ba(s,s.next),Va(o,t,n,r,i,a,0),Va(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Ka(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=za(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(eo(o))}i.sort(qa);for(let e=0;e<i.length;e++)n=Ja(i[e],n);return n}function qa(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Ja(e,t){let n=Ya(e,t);if(!n)return t;let r=po(n,e);return Ba(r,r.next),Ba(n,n.next)}function Ya(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(ao(e,n))return n;do{if(ao(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&to(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);uo(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Xa(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Xa(e,t){return io(e.prev,e,t.prev)<0&&io(t.next,e,e.next)<0}function Za(e,t,n,r){let i=e;do i.z===0&&(i.z=$a(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Qa(i)}function Qa(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function $a(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function eo(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function to(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function no(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&to(e,t,n,r,i,a,o,s)}function ro(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!lo(e,t)&&(uo(e,t)&&uo(t,e)&&fo(e,t)&&(io(e.prev,e,t.prev)||io(e,t.prev,t))||ao(e,t)&&io(e.prev,e,e.next)>0&&io(t.prev,t,t.next)>0)}function io(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function ao(e,t){return e.x===t.x&&e.y===t.y}function oo(e,t,n,r){let i=co(io(e,t,n)),a=co(io(e,t,r)),o=co(io(n,r,e)),s=co(io(n,r,t));return!!(i!==a&&o!==s||i===0&&so(e,n,t)||a===0&&so(e,r,t)||o===0&&so(n,e,r)||s===0&&so(n,t,r))}function so(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function co(e){return e>0?1:e<0?-1:0}function lo(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&oo(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function uo(e,t){return io(e.prev,e,e.next)<0?io(e,t,e.next)>=0&&io(e,e.prev,t)>=0:io(e,t,e.prev)<0||io(e,e.next,t)<0}function fo(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function po(e,t){let n=go(e.i,e.x,e.y),r=go(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function mo(e,t,n,r){let i=go(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function ho(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function go(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function _o(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var vo=class{static triangulate(e,t,n=2){return Ra(e,t,n)}},yo=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];bo(e),xo(n,e);let a=e.length;t.forEach(bo);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,xo(n,t[e]);let o=vo.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function bo(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function xo(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var So=class e extends jr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new G(p,3)),this.setAttribute(`normal`,new G(m,3)),this.setAttribute(`uv`,new G(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Co=class e extends jr{constructor(e=new La([new V(0,.5),new V(-.5,-.5),new V(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new G(r,3)),this.setAttribute(`normal`,new G(i,3)),this.setAttribute(`uv`,new G(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;yo.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];yo.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=yo.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return wo(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function wo(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var To=class extends ei{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Eo=class extends gr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Do=class extends gr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=et,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Oo=class extends gr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ko(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Ao(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}var jo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},Mo=class extends jo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ze,endingEnd:Ze}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Qe:i=e,o=2*t-n;break;case $e:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Qe:a=e,s=2*n-t;break;case $e:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},No=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Po=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Fo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ko(t,this.TimeBufferType),this.values=ko(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ko(e.times,Array),values:ko(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Po(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new No(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Mo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Je:t=this.InterpolantFactoryMethodDiscrete;break;case Ye:t=this.InterpolantFactoryMethodLinear;break;case Xe:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Je;case this.InterpolantFactoryMethodLinear:return Ye;case this.InterpolantFactoryMethodSmooth:return Xe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ao(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Xe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Fo.prototype.ValueTypeName=``,Fo.prototype.TimeBufferType=Float32Array,Fo.prototype.ValueBufferType=Float32Array,Fo.prototype.DefaultInterpolation=Ye;var Io=class extends Fo{constructor(e,t,n){super(e,t,n)}};Io.prototype.ValueTypeName=`bool`,Io.prototype.ValueBufferType=Array,Io.prototype.DefaultInterpolation=Je,Io.prototype.InterpolantFactoryMethodLinear=void 0,Io.prototype.InterpolantFactoryMethodSmooth=void 0;var Lo=class extends Fo{constructor(e,t,n,r){super(e,t,n,r)}};Lo.prototype.ValueTypeName=`color`;var Ro=class extends Fo{constructor(e,t,n,r){super(e,t,n,r)}};Ro.prototype.ValueTypeName=`number`;var zo=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)yt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Bo=class extends Fo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new zo(this.times,this.values,this.getValueSize(),e)}};Bo.prototype.ValueTypeName=`quaternion`,Bo.prototype.InterpolantFactoryMethodSmooth=void 0;var Vo=class extends Fo{constructor(e,t,n){super(e,t,n)}};Vo.prototype.ValueTypeName=`string`,Vo.prototype.ValueBufferType=Array,Vo.prototype.DefaultInterpolation=Je,Vo.prototype.InterpolantFactoryMethodLinear=void 0,Vo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ho=class extends Fo{constructor(e,t,n,r){super(e,t,n,r)}};Ho.prototype.ValueTypeName=`vector`;var Uo=class extends Yn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new W(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Wo=class extends Uo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Yn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new W(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Go=new Sn,Ko=new H,qo=new H,Jo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new V(512,512),this.mapType=te,this.map=null,this.mapPass=null,this.matrix=new Sn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ni,this._frameExtents=new V(1,1),this._viewportCount=1,this._viewports=[new Ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ko.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ko),qo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qo),t.updateMatrixWorld(),Go.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Go,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Go)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Yo=new Sn,Xo=new H,Zo=new H,Qo=class extends Jo{constructor(){super(new ai(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new V(4,2),this._viewportCount=6,this._viewports=[new Ut(2,1,1,1),new Ut(0,1,1,1),new Ut(3,1,1,1),new Ut(1,1,1,1),new Ut(3,0,1,1),new Ut(1,0,1,1)],this._cubeDirections=[new H(1,0,0),new H(-1,0,0),new H(0,0,1),new H(0,0,-1),new H(0,1,0),new H(0,-1,0)],this._cubeUps=[new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,0,1),new H(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),Xo.setFromMatrixPosition(e.matrixWorld),n.position.copy(Xo),Zo.copy(n.position),Zo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Zo),n.updateMatrixWorld(),r.makeTranslation(-Xo.x,-Xo.y,-Xo.z),Yo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yo,n.coordinateSystem,n.reversedDepth)}},$o=class extends Uo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Qo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},es=class extends ti{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ts=class extends Jo{constructor(){super(new es(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ns=class extends Uo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Yn.DEFAULT_UP),this.updateMatrix(),this.target=new Yn,this.shadow=new ts}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},rs=class extends ai{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},is=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},as=`\\[\\]\\.:\\/`,os=RegExp(`[\\[\\]\\.:\\/]`,`g`),ss=`[^\\[\\]\\.:\\/]`,cs=`[^`+as.replace(`\\.`,``)+`]`,ls=`((?:WC+[\\/:])*)`.replace(`WC`,ss),us=`(WCOD+)?`.replace(`WCOD`,cs),ds=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,ss),fs=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,ss),ps=RegExp(`^`+ls+us+ds+fs+`$`),ms=[`material`,`materials`,`bones`,`map`],hs=class{constructor(e,t,n){let r=n||gs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},gs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(os,``)}static parseTrackName(e){let t=ps.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ms.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn(`THREE.PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};gs.Composite=hs,gs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},gs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},gs.prototype.GetterByBindingType=[gs.prototype._getValue_direct,gs.prototype._getValue_array,gs.prototype._getValue_arrayElement,gs.prototype._getValue_toArray],gs.prototype.SetterByBindingTypeAndVersioning=[[gs.prototype._setValue_direct,gs.prototype._setValue_direct_setNeedsUpdate,gs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_array,gs.prototype._setValue_array_setNeedsUpdate,gs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_arrayElement,gs.prototype._setValue_arrayElement_setNeedsUpdate,gs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gs.prototype._setValue_fromArray,gs.prototype._setValue_fromArray_setNeedsUpdate,gs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var _s=new Sn,vs=class{constructor(e,t,n=0,r=1/0){this.ray=new xn(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Nn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error(`THREE.Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return _s.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(_s),this}intersectObject(e,t=!0,n=[]){return bs(e,this,n,t),n.sort(ys),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)bs(e[r],this,n,t);return n.sort(ys),n}};function ys(e,t){return e.distance-t.distance}function bs(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)bs(r[e],t,n,!0)}}function xs(e,t,n,r){let i=Ss(r);switch(n){case de:return e*t;case L:return e*t/i.components*i.byteLength;case me:return e*t/i.components*i.byteLength;case he:return e*t*2/i.components*i.byteLength;case ge:return e*t*2/i.components*i.byteLength;case F:return e*t*3/i.components*i.byteLength;case fe:return e*t*4/i.components*i.byteLength;case R:return e*t*4/i.components*i.byteLength;case _e:case z:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ve:case ye:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xe:case Ce:return Math.max(e,16)*Math.max(t,8)/4;case be:case Se:return Math.max(e,8)*Math.max(t,8)/2;case we:case Te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case De:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Oe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ke:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ae:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case je:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Me:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ne:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Pe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Fe:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ie:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Le:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Re:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case ze:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Be:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ve:case He:case Ue:return Math.ceil(e/4)*Math.ceil(t/4)*16;case We:case Ge:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Ke:case qe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ss(e){switch(e){case te:case M:return{byteLength:1,components:1};case P:case N:case ae:return{byteLength:2,components:1};case oe:case se:return{byteLength:2,components:4};case re:case ne:case ie:return{byteLength:4,components:1};case le:case ue:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`180`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`180`);function Cs(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function ws(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var K={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},q={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new U}},envmap:{envMap:{value:null},envMapRotation:{value:new U},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new U}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new U}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new U},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new U},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new U},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new U}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new U}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new U}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0},uvTransform:{value:new U}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}}},Ts={basic:{uniforms:Jr([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.fog]),vertexShader:K.meshbasic_vert,fragmentShader:K.meshbasic_frag},lambert:{uniforms:Jr([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new W(0)}}]),vertexShader:K.meshlambert_vert,fragmentShader:K.meshlambert_frag},phong:{uniforms:Jr([q.common,q.specularmap,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.fog,q.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30}}]),vertexShader:K.meshphong_vert,fragmentShader:K.meshphong_frag},standard:{uniforms:Jr([q.common,q.envmap,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.roughnessmap,q.metalnessmap,q.fog,q.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag},toon:{uniforms:Jr([q.common,q.aomap,q.lightmap,q.emissivemap,q.bumpmap,q.normalmap,q.displacementmap,q.gradientmap,q.fog,q.lights,{emissive:{value:new W(0)}}]),vertexShader:K.meshtoon_vert,fragmentShader:K.meshtoon_frag},matcap:{uniforms:Jr([q.common,q.bumpmap,q.normalmap,q.displacementmap,q.fog,{matcap:{value:null}}]),vertexShader:K.meshmatcap_vert,fragmentShader:K.meshmatcap_frag},points:{uniforms:Jr([q.points,q.fog]),vertexShader:K.points_vert,fragmentShader:K.points_frag},dashed:{uniforms:Jr([q.common,q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:K.linedashed_vert,fragmentShader:K.linedashed_frag},depth:{uniforms:Jr([q.common,q.displacementmap]),vertexShader:K.depth_vert,fragmentShader:K.depth_frag},normal:{uniforms:Jr([q.common,q.bumpmap,q.normalmap,q.displacementmap,{opacity:{value:1}}]),vertexShader:K.meshnormal_vert,fragmentShader:K.meshnormal_frag},sprite:{uniforms:Jr([q.sprite,q.fog]),vertexShader:K.sprite_vert,fragmentShader:K.sprite_frag},background:{uniforms:{uvTransform:{value:new U},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:K.background_vert,fragmentShader:K.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new U}},vertexShader:K.backgroundCube_vert,fragmentShader:K.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:K.cube_vert,fragmentShader:K.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:K.equirect_vert,fragmentShader:K.equirect_frag},distanceRGBA:{uniforms:Jr([q.common,q.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:K.distanceRGBA_vert,fragmentShader:K.distanceRGBA_frag},shadow:{uniforms:Jr([q.lights,q.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:K.shadow_vert,fragmentShader:K.shadow_frag}};Ts.physical={uniforms:Jr([Ts.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new U},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new U},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new U},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new U},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new U},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new U},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new U},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new U},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new U},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new U},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new U},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new U}}]),vertexShader:K.meshphysical_vert,fragmentShader:K.meshphysical_frag};var Es={r:0,b:0,g:0},Ds=new Mn,Os=new Sn;function ks(e,t,n,r,i,a,o){let s=new W(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let r=e.isScene===!0?e.background:null;return r&&r.isTexture&&(r=(e.backgroundBlurriness>0?n:t).get(r)),r}function h(t){let n=!1,i=m(t);i===null?_(s,c):i&&i.isColor&&(_(i,1),n=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(t,n){let r=m(n);r&&(r.isCubeTexture||r.mapping===306)?(u===void 0&&(u=new Ur(new Kr(1,1,1),new ei({name:`BackgroundCubeMaterial`,uniforms:qr(Ts.backgroundCube.uniforms),vertexShader:Ts.backgroundCube.vertexShader,fragmentShader:Ts.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),Ds.copy(n.backgroundRotation),Ds.x*=-1,Ds.y*=-1,Ds.z*=-1,r.isCubeTexture&&r.isRenderTargetTexture===!1&&(Ds.y*=-1,Ds.z*=-1),u.material.uniforms.envMap.value=r,u.material.uniforms.flipEnvMap.value=r.isCubeTexture&&r.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Os.makeRotationFromEuler(Ds)),u.material.toneMapped=Mt.getTransfer(r.colorSpace)!==at,(d!==r||f!==r.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):r&&r.isTexture&&(l===void 0&&(l=new Ur(new So(2,2),new ei({name:`BackgroundMaterial`,uniforms:qr(Ts.background.uniforms),vertexShader:Ts.background.vertexShader,fragmentShader:Ts.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=r,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.toneMapped=Mt.getTransfer(r.colorSpace)!==at,r.matrixAutoUpdate===!0&&r.updateMatrix(),l.material.uniforms.uvTransform.value.copy(r.matrix),(d!==r||f!==r.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=r,f=r.version,p=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))}function _(t,n){t.getRGB(Es,Xr(e)),r.buffers.color.setClear(Es.r,Es.g,Es.b,n,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,_(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,_(s,c)},render:h,addToRenderList:g,dispose:v}}function As(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n){let i=n.wireframe===!0,a=r[e.id];a===void 0&&(a={},r[e.id]=a);let o=a[t.id];o===void 0&&(o={},a[t.id]=o);let s=o[i];return s===void 0&&(s=f(c()),o[i]=s),s}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){w();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n)u(n[e].object),delete n[e];delete t[e]}delete r[e.id]}function C(e){for(let t in r){let n=r[t];if(n[e.id]===void 0)continue;let i=n[e.id];for(let e in i)u(i[e].object),delete i[e];delete n[e.id]}}function w(){T(),o=!0,a!==i&&(a=i,l(a.object))}function T(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:w,resetDefaultState:T,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function js(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}function c(e,i,a,s){if(a===0)return;let c=t.get(`WEBGL_multi_draw`);if(c===null)for(let t=0;t<e.length;t++)o(e[t],i[t],s[t]);else{c.multiDrawArraysInstancedWEBGL(r,e,0,i,0,s,0,a);let t=0;for(let e=0;e<a;e++)t+=i[e]*s[e];n.update(t,r,1)}}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=c}function Ms(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(console.warn(`THREE.WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=m>0,S=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,vertexTextures:x,maxSamples:S}}function Ns(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ki,s=new U,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function Ps(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=new ui(a.height);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var Fs=4,Is=[.125,.215,.35,.446,.526,.582],Ls=20,Rs=new es,zs=new W,Bs=null,Vs=0,Hs=0,Us=!1,Ws=(1+Math.sqrt(5))/2,Gs=1/Ws,Ks=[new H(-Ws,Gs,0),new H(Ws,Gs,0),new H(-Gs,0,Ws),new H(Gs,0,Ws),new H(0,Ws,-Gs),new H(0,Ws,Gs),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)],qs=new H,Js=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=qs}=i;Bs=this._renderer.getRenderTarget(),Vs=this._renderer.getActiveCubeFace(),Hs=this._renderer.getActiveMipmapLevel(),Us=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ec(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$s(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Bs,Vs,Hs),this._renderer.xr.enabled=Us,e.scissorTest=!1,Zs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bs=this._renderer.getRenderTarget(),Vs=this._renderer.getActiveCubeFace(),Hs=this._renderer.getActiveMipmapLevel(),Us=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:A,minFilter:A,generateMipmaps:!1,type:ae,format:fe,colorSpace:rt,depthBuffer:!1},r=Xs(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xs(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ys(r)),this._blurMaterial=Qs(r,e,t)}return r}_compileMaterial(e){let t=new Ur(this._lodPlanes[0],e);this._renderer.compile(t,Rs)}_sceneToCubeUV(e,t,n,r,i){let a=new ai(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(zs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null));let d=new _r({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),f=new Ur(new Kr,d),p=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,p=!0):(d.color.copy(zs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Zs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(f,a),c.render(e,a)}f.geometry.dispose(),f.material.dispose(),c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ec()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$s());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new Ur(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Zs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Rs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let t=1;t<r;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),i=Ks[(r-t-1)%Ks.length];this._blur(e,t-1,t,n,i)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new Ur(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Ls;m>Ls&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ls}`);let h=[],g=0;for(let e=0;e<Ls;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Zs(t,3*v*(r>_-Fs?r-_+Fs:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Rs)}};function Ys(e){let t=[],n=[],r=[],i=e,a=e-Fs+1+Is.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-Fs?s=Is[o-e+Fs-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new jr;h.setAttribute(`position`,new xr(f,3)),h.setAttribute(`uv`,new xr(p,2)),h.setAttribute(`faceIndex`,new xr(m,1)),t.push(h),i>Fs&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function Xs(e,t,n){let r=new Gt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Zs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Qs(e,t,n){let r=new Float32Array(Ls),i=new H(0,1,0);return new ei({name:`SphericalGaussianBlur`,defines:{n:Ls,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function $s(){return new ei({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ec(){return new ei({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function tc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function nc(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c){let o=t.get(r),l=o===void 0?0:o.texture.pmremVersion;if(r.isRenderTargetTexture&&r.pmremVersion!==l)return n===null&&(n=new Js(e)),o=s?n.fromEquirectangular(r,o):n.fromCubemap(r,o),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),o.texture;if(o!==void 0)return o.texture;{let l=r.image;return s&&l&&l.height>0||c&&l&&i(l)?(n===null&&(n=new Js(e)),o=s?n.fromEquirectangular(r):n.fromCubemap(r),o.texture.pmremVersion=r.pmremVersion,t.set(r,o),r.addEventListener(`dispose`,a),o.texture):null}}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function rc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Dt(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function ic(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else if(i!==void 0){let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}else return;let s=new(Ct(n)?Cr:Sr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function ac(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}function d(e,i,s,c){if(s===0)return;let u=t.get(`WEBGL_multi_draw`);if(u===null)for(let t=0;t<e.length;t++)l(e[t]/o,i[t],c[t]);else{u.multiDrawElementsInstancedWEBGL(r,i,0,a,e,0,c,0,s);let t=0;for(let e=0;e<s;e++)t+=i[e]*c[e];n.update(t,r,1)}}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function oc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function sc(e,t,n){let r=new WeakMap,i=new Ut;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Kt(h,p,m,u);g.type=ie,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new V(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function cc(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var lc=new Ht,uc=new ta(1,1),dc=new Kt,fc=new qt,pc=new li,mc=[],hc=[],gc=new Float32Array(16),_c=new Float32Array(9),vc=new Float32Array(4);function yc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=mc[i];if(a===void 0&&(a=new Float32Array(i),mc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function bc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function xc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Sc(e,t){let n=hc[t];n===void 0&&(n=new Int32Array(t),hc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Cc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function wc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bc(n,t))return;e.uniform2fv(this.addr,t),xc(n,t)}}function Tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(bc(n,t))return;e.uniform3fv(this.addr,t),xc(n,t)}}function Ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bc(n,t))return;e.uniform4fv(this.addr,t),xc(n,t)}}function Dc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),xc(n,t)}else{if(bc(n,r))return;vc.set(r),e.uniformMatrix2fv(this.addr,!1,vc),xc(n,r)}}function Oc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),xc(n,t)}else{if(bc(n,r))return;_c.set(r),e.uniformMatrix3fv(this.addr,!1,_c),xc(n,r)}}function kc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),xc(n,t)}else{if(bc(n,r))return;gc.set(r),e.uniformMatrix4fv(this.addr,!1,gc),xc(n,r)}}function Ac(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function jc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bc(n,t))return;e.uniform2iv(this.addr,t),xc(n,t)}}function Mc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bc(n,t))return;e.uniform3iv(this.addr,t),xc(n,t)}}function Nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bc(n,t))return;e.uniform4iv(this.addr,t),xc(n,t)}}function Pc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bc(n,t))return;e.uniform2uiv(this.addr,t),xc(n,t)}}function Ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bc(n,t))return;e.uniform3uiv(this.addr,t),xc(n,t)}}function Lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bc(n,t))return;e.uniform4uiv(this.addr,t),xc(n,t)}}function Rc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(uc.compareFunction=515,a=uc):a=lc,n.setTexture2D(t||a,i)}function zc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||fc,i)}function Bc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||pc,i)}function Vc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||dc,i)}function Hc(e){switch(e){case 5126:return Cc;case 35664:return wc;case 35665:return Tc;case 35666:return Ec;case 35674:return Dc;case 35675:return Oc;case 35676:return kc;case 5124:case 35670:return Ac;case 35667:case 35671:return jc;case 35668:case 35672:return Mc;case 35669:case 35673:return Nc;case 5125:return Pc;case 36294:return Fc;case 36295:return Ic;case 36296:return Lc;case 35678:case 36198:case 36298:case 36306:case 35682:return Rc;case 35679:case 36299:case 36307:return zc;case 35680:case 36300:case 36308:case 36293:return Bc;case 36289:case 36303:case 36311:case 36292:return Vc}}function Uc(e,t){e.uniform1fv(this.addr,t)}function Wc(e,t){let n=yc(t,this.size,2);e.uniform2fv(this.addr,n)}function Gc(e,t){let n=yc(t,this.size,3);e.uniform3fv(this.addr,n)}function Kc(e,t){let n=yc(t,this.size,4);e.uniform4fv(this.addr,n)}function qc(e,t){let n=yc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Jc(e,t){let n=yc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Yc(e,t){let n=yc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Xc(e,t){e.uniform1iv(this.addr,t)}function Zc(e,t){e.uniform2iv(this.addr,t)}function Qc(e,t){e.uniform3iv(this.addr,t)}function $c(e,t){e.uniform4iv(this.addr,t)}function el(e,t){e.uniform1uiv(this.addr,t)}function tl(e,t){e.uniform2uiv(this.addr,t)}function nl(e,t){e.uniform3uiv(this.addr,t)}function rl(e,t){e.uniform4uiv(this.addr,t)}function il(e,t,n){let r=this.cache,i=t.length,a=Sc(n,i);bc(r,a)||(e.uniform1iv(this.addr,a),xc(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||lc,a[e])}function al(e,t,n){let r=this.cache,i=t.length,a=Sc(n,i);bc(r,a)||(e.uniform1iv(this.addr,a),xc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||fc,a[e])}function ol(e,t,n){let r=this.cache,i=t.length,a=Sc(n,i);bc(r,a)||(e.uniform1iv(this.addr,a),xc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||pc,a[e])}function sl(e,t,n){let r=this.cache,i=t.length,a=Sc(n,i);bc(r,a)||(e.uniform1iv(this.addr,a),xc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||dc,a[e])}function cl(e){switch(e){case 5126:return Uc;case 35664:return Wc;case 35665:return Gc;case 35666:return Kc;case 35674:return qc;case 35675:return Jc;case 35676:return Yc;case 5124:case 35670:return Xc;case 35667:case 35671:return Zc;case 35668:case 35672:return Qc;case 35669:case 35673:return $c;case 5125:return el;case 36294:return tl;case 36295:return nl;case 36296:return rl;case 35678:case 36198:case 36298:case 36306:case 35682:return il;case 35679:case 36299:case 36307:return al;case 35680:case 36300:case 36308:case 36293:return ol;case 36289:case 36303:case 36311:case 36292:return sl}}var ll=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Hc(t.type)}},ul=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cl(t.type)}},dl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},fl=/(\w+)(\])?(\[|\.)?/g;function pl(e,t){e.seq.push(t),e.map[t.id]=t}function ml(e,t,n){let r=e.name,i=r.length;for(fl.lastIndex=0;;){let a=fl.exec(r),o=fl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){pl(n,l===void 0?new ll(s,e,t):new ul(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new dl(s),pl(n,e)),n=e}}}var hl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);ml(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function gl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var _l=37297,vl=0;function yl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var bl=new U;function xl(e){Mt._getMatrix(bl,Mt.workingColorSpace,e);let t=`mat3( ${bl.elements.map(e=>e.toFixed(4))} )`;switch(Mt.getTransfer(e)){case it:return[t,`LinearTransferOETF`];case at:return[t,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Sl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+yl(e.getShaderSource(t),r)}return i}function Cl(e,t){let n=xl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}function wl(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`Cineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 7:n=`Neutral`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Tl=new H;function El(){return Mt.getLuminanceCoefficients(Tl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Tl.x.toFixed(4)}, ${Tl.y.toFixed(4)}, ${Tl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Dl(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Al).join(`
`)}function Ol(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function kl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Al(e){return e!==``}function jl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ml(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Nl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pl(e){return e.replace(Nl,Il)}var Fl=new Map;function Il(e,t){let n=K[t];if(n===void 0){let e=Fl.get(t);if(e!==void 0)n=K[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return Pl(n)}var Ll=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rl(e){return e.replace(Ll,zl)}function zl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Bl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function Vl(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function Hl(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`}return t}function Ul(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`}return t}function Wl(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function Gl(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Kl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Vl(n),l=Hl(n),u=Ul(n),d=Wl(n),f=Gl(n),p=Dl(n),m=Ol(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Al).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Al).join(`
`),_.length>0&&(_+=`
`)):(g=[Bl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Al).join(`
`),_=[Bl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor||n.batchingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:K.tonemapping_pars_fragment,n.toneMapping===0?``:wl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,K.colorspace_pars_fragment,Cl(`linearToOutputTexel`,n.outputColorSpace),El(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Al).join(`
`)),o=Pl(o),o=jl(o,n),o=Ml(o,n),s=Pl(s),s=jl(s,n),s=Ml(s,n),o=Rl(o),s=Rl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=gl(i,i.VERTEX_SHADER,y),S=gl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Sl(i,x,`vertex`),n=Sl(i,S,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new hl(i,h),T=kl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,_l)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=vl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var ql=0,Jl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Yl(e),t.set(e,n)),n}},Yl=class{constructor(e){this.id=ql++,this.code=e,this.usedTimes=0}};function Xl(e,t,n,r,i,a,o){let s=new Nn,c=new Jl,l=new Set,u=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function h(e){return l.add(e),e===0?`uv`:`uv${e}`}function g(a,s,u,g,_){let v=g.fog,y=_.geometry,b=a.isMeshStandardMaterial?g.environment:null,x=(a.isMeshStandardMaterial?n:t).get(a.envMap||b),S=x&&x.mapping===306?x.image.height:null,C=m[a.type];a.precision!==null&&(p=i.getMaxPrecision(a.precision),p!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,p,`instead.`));let w=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,T=w===void 0?0:w.length,E=0;y.morphAttributes.position!==void 0&&(E=1),y.morphAttributes.normal!==void 0&&(E=2),y.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Ts[C];D=e.vertexShader,O=e.fragmentShader}else D=a.vertexShader,O=a.fragmentShader,c.update(a),k=c.getVertexShaderID(a),A=c.getFragmentShaderID(a);let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),te=_.isInstancedMesh===!0,M=_.isBatchedMesh===!0,N=!!a.map,P=!!a.matcap,ne=!!x,re=!!a.aoMap,ie=!!a.lightMap,ae=!!a.bumpMap,oe=!!a.normalMap,se=!!a.displacementMap,ce=!!a.emissiveMap,le=!!a.metalnessMap,ue=!!a.roughnessMap,de=a.anisotropy>0,F=a.clearcoat>0,fe=a.dispersion>0,I=a.iridescence>0,pe=a.sheen>0,L=a.transmission>0,me=de&&!!a.anisotropyMap,he=F&&!!a.clearcoatMap,ge=F&&!!a.clearcoatNormalMap,R=F&&!!a.clearcoatRoughnessMap,_e=I&&!!a.iridescenceMap,z=I&&!!a.iridescenceThicknessMap,ve=pe&&!!a.sheenColorMap,ye=pe&&!!a.sheenRoughnessMap,be=!!a.specularMap,xe=!!a.specularColorMap,Se=!!a.specularIntensityMap,Ce=L&&!!a.transmissionMap,we=L&&!!a.thicknessMap,Te=!!a.gradientMap,Ee=!!a.alphaMap,De=a.alphaTest>0,Oe=!!a.alphaHash,ke=!!a.extensions,Ae=0;a.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ae=e.toneMapping);let je={shaderID:C,shaderType:a.type,shaderName:a.name,vertexShader:D,fragmentShader:O,defines:a.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:p,batching:M,batchingColor:M&&_._colorsTexture!==null,instancing:te,instancingColor:te&&_.instanceColor!==null,instancingMorph:te&&_.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:rt,alphaToCoverage:!!a.alphaToCoverage,map:N,matcap:P,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:oe,displacementMap:f&&se,emissiveMap:ce,normalMapObjectSpace:oe&&a.normalMapType===1,normalMapTangentSpace:oe&&a.normalMapType===0,metalnessMap:le,roughnessMap:ue,anisotropy:de,anisotropyMap:me,clearcoat:F,clearcoatMap:he,clearcoatNormalMap:ge,clearcoatRoughnessMap:R,dispersion:fe,iridescence:I,iridescenceMap:_e,iridescenceThicknessMap:z,sheen:pe,sheenColorMap:ve,sheenRoughnessMap:ye,specularMap:be,specularColorMap:xe,specularIntensityMap:Se,transmission:L,transmissionMap:Ce,thicknessMap:we,gradientMap:Te,opaque:a.transparent===!1&&a.blending===1&&a.alphaToCoverage===!1,alphaMap:Ee,alphaTest:De,alphaHash:Oe,combine:a.combine,mapUv:N&&h(a.map.channel),aoMapUv:re&&h(a.aoMap.channel),lightMapUv:ie&&h(a.lightMap.channel),bumpMapUv:ae&&h(a.bumpMap.channel),normalMapUv:oe&&h(a.normalMap.channel),displacementMapUv:se&&h(a.displacementMap.channel),emissiveMapUv:ce&&h(a.emissiveMap.channel),metalnessMapUv:le&&h(a.metalnessMap.channel),roughnessMapUv:ue&&h(a.roughnessMap.channel),anisotropyMapUv:me&&h(a.anisotropyMap.channel),clearcoatMapUv:he&&h(a.clearcoatMap.channel),clearcoatNormalMapUv:ge&&h(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:R&&h(a.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&h(a.iridescenceMap.channel),iridescenceThicknessMapUv:z&&h(a.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&h(a.sheenColorMap.channel),sheenRoughnessMapUv:ye&&h(a.sheenRoughnessMap.channel),specularMapUv:be&&h(a.specularMap.channel),specularColorMapUv:xe&&h(a.specularColorMap.channel),specularIntensityMapUv:Se&&h(a.specularIntensityMap.channel),transmissionMapUv:Ce&&h(a.transmissionMap.channel),thicknessMapUv:we&&h(a.thicknessMap.channel),alphaMapUv:Ee&&h(a.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(oe||de),vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,pointsUvs:_.isPoints===!0&&!!y.attributes.uv&&(N||Ee),fog:!!v,useFog:a.fog===!0,fogExp2:!!v&&v.isFogExp2,flatShading:a.flatShading===!0&&a.wireframe===!1,sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:_.isSkinnedMesh===!0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&u.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ae,decodeVideoTexture:N&&a.map.isVideoTexture===!0&&Mt.getTransfer(a.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&a.emissiveMap.isVideoTexture===!0&&Mt.getTransfer(a.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionClipCullDistance:ke&&a.extensions.clipCullDistance===!0&&r.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ke&&a.extensions.multiDraw===!0||M)&&r.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()};return je.vertexUv1s=l.has(1),je.vertexUv2s=l.has(2),je.vertexUv3s=l.has(3),l.clear(),je}function _(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(v(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function v(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){s.disableAll(),t.supportsVertexTextures&&s.enable(0),t.instancing&&s.enable(1),t.instancingColor&&s.enable(2),t.instancingMorph&&s.enable(3),t.matcap&&s.enable(4),t.envMap&&s.enable(5),t.normalMapObjectSpace&&s.enable(6),t.normalMapTangentSpace&&s.enable(7),t.clearcoat&&s.enable(8),t.iridescence&&s.enable(9),t.alphaTest&&s.enable(10),t.vertexColors&&s.enable(11),t.vertexAlphas&&s.enable(12),t.vertexUv1s&&s.enable(13),t.vertexUv2s&&s.enable(14),t.vertexUv3s&&s.enable(15),t.vertexTangents&&s.enable(16),t.anisotropy&&s.enable(17),t.alphaHash&&s.enable(18),t.batching&&s.enable(19),t.dispersion&&s.enable(20),t.batchingColor&&s.enable(21),t.gradientMap&&s.enable(22),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.reversedDepthBuffer&&s.enable(4),t.skinning&&s.enable(5),t.morphTargets&&s.enable(6),t.morphNormals&&s.enable(7),t.morphColors&&s.enable(8),t.premultipliedAlpha&&s.enable(9),t.shadowMapEnabled&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),t.decodeVideoTextureEmissive&&s.enable(20),t.alphaToCoverage&&s.enable(21),e.push(s.mask)}function b(e){let t=m[e.type],n;if(t){let e=Ts[t];n=Zr.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r;for(let e=0,t=u.length;e<t;e++){let t=u[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new Kl(e,n,t,a),u.push(r)),r}function S(e){if(--e.usedTimes===0){let t=u.indexOf(e);u[t]=u[u.length-1],u.pop(),e.destroy()}}function C(e){c.remove(e)}function w(){c.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:u,dispose:w}}function Zl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Ql(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function $l(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function eu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||Ql),r.length>1&&r.sort(t||$l),i.length>1&&i.sort(t||$l)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function tu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new eu,e.set(t,[i])):n>=r.length?(i=new eu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function nu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new H,color:new W};break;case`SpotLight`:n={position:new H,direction:new H,color:new W,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new H,color:new W,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new H,skyColor:new W,groundColor:new W};break;case`RectAreaLight`:n={color:new W,position:new H,halfWidth:new H,halfHeight:new H}}return e[t.id]=n,n}}}function ru(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var iu=0;function au(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ou(e){let t=new nu,n=ru(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new H);let i=new H,a=new Sn,o=new Sn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(au);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=q.LTC_FLOAT_1,r.rectAreaLTC2=q.LTC_FLOAT_2):(r.rectAreaLTC1=q.LTC_HALF_1,r.rectAreaLTC2=q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=iu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function su(e){let t=new ou(e),n=[],r=[];function i(e){l.camera=e,n.length=0,r.length=0}function a(e){n.push(e)}function o(e){r.push(e)}function s(){t.setup(n)}function c(e){t.setupView(n,e)}let l={lightsArray:n,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:s,setupLightsView:c,pushLight:a,pushShadow:o}}function cu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new su(e),t.set(n,[a])):r>=i.length?(a=new su(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var lu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function du(e,t,n){let r=new Ni,i=new V,a=new V,o=new Ut,s=new Do({depthPacking:tt}),c=new Oo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:lu,fragmentShader:uu}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new jr;m.setAttribute(`position`,new xr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ur(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==3&&this.type===3,m=_===3&&this.type!==3;for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){console.warn(`THREE.WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let h=d.getFrameExtents();if(i.multiply(h),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/h.x),i.x=a.x*h.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/h.y),i.y=a.y*h.y,d.mapSize.y=a.y)),d.map===null||p===!0||m===!0){let e=this.type===3?{}:{minFilter:D,magFilter:D};d.map!==null&&d.map.dispose(),d.map=new Gt(i.x,i.y,e),d.map.texture.name=l.name+`.shadowMap`,d.camera.updateProjectionMatrix()}e.setRenderTarget(d.map),e.clear();let g=d.getViewportCount();for(let e=0;e<g;e++){let t=d.getViewport(e);o.set(a.x*t.x,a.y*t.y,a.x*t.z,a.y*t.w),f.viewport(o),d.updateMatrices(l,e),r=d.getFrustum(),b(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Gt(i.x,i.y)),f.uniforms.shadow_pass.value=n.map.texture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}var fu={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function pu(e,t){function n(){let t=!1,n=new Ut,r=null,i=new Ut(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ce(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=fu[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(r&&(t=1-t),e.clearDepth(t),o=t)},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ce(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new W(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ee=!1,te=0,M=e.getParameter(e.VERSION);M.indexOf(`WebGL`)===-1?M.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(M)[1]),ee=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(M)[1]),ee=te>=1);let N=null,P={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new Ut().fromArray(ne),ae=new Ut().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ce(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),ce(e.CULL_FACE),pe(0);function ce(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return d[t]!==n&&(e.bindFramebuffer(t,n),d[t]=n,t===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=p,i=!1;if(t){r=f.get(n),r===void 0&&(r=[],f.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function F(t){return m!==t&&(e.useProgram(t),m=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let I={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function pe(t,n,r,i,a,o,s,c,l,u){if(t===0)h===!0&&(le(e.BLEND),h=!1);else if(h===!1&&(ce(e.BLEND),h=!0),t!==5){if(t!==g||u!==T){if((_!==100||b!==100)&&(e.blendEquation(e.FUNC_ADD),_=100,b=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:console.error(`THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:console.error(`THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}v=null,y=null,x=null,S=null,C.set(0,0,0),w=0,g=t,T=u}}else a=a||n,o=o||r,s=s||i,(n!==_||a!==b)&&(e.blendEquationSeparate(fe[n],fe[a]),_=n,b=a),(r!==v||i!==y||o!==x||s!==S)&&(e.blendFuncSeparate(I[r],I[i],I[o],I[s]),v=r,y=i,x=o,S=s),(c.equals(C)===!1||l!==w)&&(e.blendColor(c.r,c.g,c.b,l),C.copy(c),w=l),g=t,T=!1}function L(t,n){t.side===2?le(e.CULL_FACE):ce(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?pe(0):pe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),R(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ce(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){E!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),E=t)}function he(t){t===0?le(e.CULL_FACE):(ce(e.CULL_FACE),t!==D&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),D=t}function ge(t){t!==O&&(ee&&e.lineWidth(t),O=t)}function R(t,n,r){t?(ce(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(e.polygonOffset(n,r),k=n,A=r)):le(e.POLYGON_OFFSET_FILL)}function _e(t){t?ce(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function z(t){t===void 0&&(t=e.TEXTURE0+j-1),N!==t&&(e.activeTexture(t),N=t)}function ve(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+j-1:N);let i=P[r];i===void 0&&(i={type:void 0,texture:void 0},P[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function ye(){let t=P[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function be(){try{e.compressedTexImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function xe(){try{e.compressedTexImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Se(){try{e.texSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ce(){try{e.texSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function we(){try{e.compressedTexSubImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Te(){try{e.compressedTexSubImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(){try{e.texStorage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function De(){try{e.texStorage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Oe(){try{e.texImage2D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ke(){try{e.texImage3D(...arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ae(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function je(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function Me(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ne(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),u={},N=null,P={},d={},f=new WeakMap,p=[],m=null,h=!1,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=new W(0,0,0),w=0,T=!1,E=null,D=null,O=null,k=null,A=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ce,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:F,setBlending:pe,setMaterial:L,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:R,setScissorTest:_e,activeTexture:z,bindTexture:ve,unbindTexture:ye,compressedTexImage2D:be,compressedTexImage3D:xe,texImage2D:Oe,texImage3D:ke,updateUBOMapping:Me,uniformBlockBinding:Ne,texStorage2D:Ee,texStorage3D:De,texSubImage2D:Se,texSubImage3D:Ce,compressedTexSubImage2D:we,compressedTexSubImage3D:Te,scissor:Ae,viewport:je,reset:Pe}}function mu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new V,u=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function m(e,t){return p?new OffscreenCanvas(e,t):wt(`canvas`)}function h(e,t,n){let r=1,i=Oe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);d===void 0&&(d=m(n,a));let o=t?m(n,a):d;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function g(e){return e.generateMipmaps}function _(t){e.generateMipmap(t)}function v(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function y(n,r,i,a,o=!1){if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let s=r;if(r===e.RED&&(i===e.FLOAT&&(s=e.R32F),i===e.HALF_FLOAT&&(s=e.R16F),i===e.UNSIGNED_BYTE&&(s=e.R8)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.R8UI),i===e.UNSIGNED_SHORT&&(s=e.R16UI),i===e.UNSIGNED_INT&&(s=e.R32UI),i===e.BYTE&&(s=e.R8I),i===e.SHORT&&(s=e.R16I),i===e.INT&&(s=e.R32I)),r===e.RG&&(i===e.FLOAT&&(s=e.RG32F),i===e.HALF_FLOAT&&(s=e.RG16F),i===e.UNSIGNED_BYTE&&(s=e.RG8)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RG8UI),i===e.UNSIGNED_SHORT&&(s=e.RG16UI),i===e.UNSIGNED_INT&&(s=e.RG32UI),i===e.BYTE&&(s=e.RG8I),i===e.SHORT&&(s=e.RG16I),i===e.INT&&(s=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGB8UI),i===e.UNSIGNED_SHORT&&(s=e.RGB16UI),i===e.UNSIGNED_INT&&(s=e.RGB32UI),i===e.BYTE&&(s=e.RGB8I),i===e.SHORT&&(s=e.RGB16I),i===e.INT&&(s=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(s=e.RGBA16UI),i===e.UNSIGNED_INT&&(s=e.RGBA32UI),i===e.BYTE&&(s=e.RGBA8I),i===e.SHORT&&(s=e.RGBA16I),i===e.INT&&(s=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_INT_5_9_9_9_REV&&(s=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(s=e.R11F_G11F_B10F)),r===e.RGBA){let t=o?it:Mt.getTransfer(a);i===e.FLOAT&&(s=e.RGBA32F),i===e.HALF_FLOAT&&(s=e.RGBA16F),i===e.UNSIGNED_BYTE&&(s=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT_4_4_4_4&&(s=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(s=e.RGB5_A1)}return(s===e.R16F||s===e.R32F||s===e.RG16F||s===e.RG32F||s===e.RGBA16F||s===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),s}function b(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,console.warn(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function x(e,t){return g(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function S(e){let t=e.target;t.removeEventListener(`dispose`,S),te(t),t.isVideoTexture&&u.delete(t)}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),N(t)}function te(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=f.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&M(e),Object.keys(i).length===0&&f.delete(n)}r.remove(e)}function M(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=f.get(i);delete a[n.__cacheKey],o.memory.textures--}function N(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let P=0;function ne(){P=0}function re(){let e=P;return e>=i.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),P+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&Ee(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{me(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?he(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let le={[w]:e.REPEAT,[T]:e.CLAMP_TO_EDGE,[E]:e.MIRRORED_REPEAT},ue={[D]:e.NEAREST,[O]:e.NEAREST_MIPMAP_NEAREST,[k]:e.NEAREST_MIPMAP_LINEAR,[A]:e.LINEAR,[j]:e.LINEAR_MIPMAP_NEAREST,[ee]:e.LINEAR_MIPMAP_LINEAR},de={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function F(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&console.warn(`THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,de[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function fe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,S));let i=n.source,a=f.get(i);a===void 0&&(a={},f.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&M(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function I(e,t,n){return Math.floor(Math.floor(e/n)/t)}function L(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=I(n.start,r.width,4),c=I(t.start,r.width,4);n.start<=i+1&&a===c&&I(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=e.getParameter(e.UNPACK_ROW_LENGTH),l=e.getParameter(e.UNPACK_SKIP_PIXELS),u=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;e.pixelStorei(e.UNPACK_SKIP_PIXELS,u),e.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,c),e.pixelStorei(e.UNPACK_SKIP_PIXELS,l),e.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function me(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=fe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){n.activeTexture(e.TEXTURE0+s);let t=Mt.getPrimaries(Mt.workingColorSpace),r=o.colorSpace===``?null:Mt.getPrimaries(o.colorSpace),f=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,f);let p=h(o.image,!1,i.maxTextureSize);p=De(o,p);let m=a.convert(o.format,o.colorSpace),v=a.convert(o.type),S=y(o.internalFormat,m,v,o.colorSpace,o.isVideoTexture);F(c,o);let C,w=o.mipmaps,T=o.isVideoTexture!==!0,E=d.__version===void 0||l===!0,D=u.dataReady,O=x(o,p);if(o.isDepthTexture)S=b(o.format===pe,o.type),E&&(T?n.texStorage2D(e.TEXTURE_2D,1,S,p.width,p.height):n.texImage2D(e.TEXTURE_2D,0,S,p.width,p.height,0,m,v,null));else if(o.isDataTexture){if(w.length>0){T&&E&&n.texStorage2D(e.TEXTURE_2D,O,S,w[0].width,w[0].height);for(let t=0,r=w.length;t<r;t++)C=w[t],T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,v,C.data):n.texImage2D(e.TEXTURE_2D,t,S,C.width,C.height,0,m,v,C.data);o.generateMipmaps=!1}else T?(E&&n.texStorage2D(e.TEXTURE_2D,O,S,p.width,p.height),D&&L(o,p,m,v)):n.texImage2D(e.TEXTURE_2D,0,S,p.width,p.height,0,m,v,p.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){T&&E&&n.texStorage3D(e.TEXTURE_2D_ARRAY,O,S,w[0].width,w[0].height,p.depth);for(let t=0,r=w.length;t<r;t++)if(C=w[t],o.format!==1023){if(m!==null){if(T){if(D){if(o.layerUpdates.size>0){let r=xs(C.width,C.height,o.format,o.type);for(let i of o.layerUpdates){let a=C.data.subarray(i*r/C.data.BYTES_PER_ELEMENT,(i+1)*r/C.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,i,C.width,C.height,1,m,a)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,C.width,C.height,p.depth,m,C.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,S,C.width,C.height,p.depth,0,C.data,0,0)}else console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else T?D&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,C.width,C.height,p.depth,m,v,C.data):n.texImage3D(e.TEXTURE_2D_ARRAY,t,S,C.width,C.height,p.depth,0,m,v,C.data)}else{T&&E&&n.texStorage2D(e.TEXTURE_2D,O,S,w[0].width,w[0].height);for(let t=0,r=w.length;t<r;t++)C=w[t],o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,v,C.data):n.texImage2D(e.TEXTURE_2D,t,S,C.width,C.height,0,m,v,C.data):m===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,C.width,C.height,m,C.data):n.compressedTexImage2D(e.TEXTURE_2D,t,S,C.width,C.height,0,C.data)}}else if(o.isDataArrayTexture){if(T){if(E&&n.texStorage3D(e.TEXTURE_2D_ARRAY,O,S,p.width,p.height,p.depth),D){if(o.layerUpdates.size>0){let t=xs(p.width,p.height,o.format,o.type);for(let r of o.layerUpdates){let i=p.data.subarray(r*t/p.data.BYTES_PER_ELEMENT,(r+1)*t/p.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,r,p.width,p.height,1,m,v,i)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,p.width,p.height,p.depth,m,v,p.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,S,p.width,p.height,p.depth,0,m,v,p.data)}else if(o.isData3DTexture)T?(E&&n.texStorage3D(e.TEXTURE_3D,O,S,p.width,p.height,p.depth),D&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,p.width,p.height,p.depth,m,v,p.data)):n.texImage3D(e.TEXTURE_3D,0,S,p.width,p.height,p.depth,0,m,v,p.data);else if(o.isFramebufferTexture){if(E){if(T)n.texStorage2D(e.TEXTURE_2D,O,S,p.width,p.height);else{let t=p.width,r=p.height;for(let i=0;i<O;i++)n.texImage2D(e.TEXTURE_2D,i,S,t,r,0,m,v,null),t>>=1,r>>=1}}}else if(w.length>0){if(T&&E){let t=Oe(w[0]);n.texStorage2D(e.TEXTURE_2D,O,S,t.width,t.height)}for(let t=0,r=w.length;t<r;t++)C=w[t],T?D&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m,v,C):n.texImage2D(e.TEXTURE_2D,t,S,m,v,C);o.generateMipmaps=!1}else if(T){if(E){let t=Oe(p);n.texStorage2D(e.TEXTURE_2D,O,S,t.width,t.height)}D&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,m,v,p)}else n.texImage2D(e.TEXTURE_2D,0,S,m,v,p);g(o)&&_(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,o,s){if(o.image.length!==6)return;let c=fe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Mt.getPrimaries(Mt.workingColorSpace),r=o.colorSpace===``?null:Mt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=h(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=De(o,m[e]);let v=m[0],b=a.convert(o.format,o.colorSpace),S=a.convert(o.type),C=y(o.internalFormat,b,S,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=x(o,v);F(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,v.width,v.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,b,S,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,b,S,i.data):b===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,b,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Oe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,b,S,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,b,S,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,b,S,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,b,S,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,b,S,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,b,S,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,b,S,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,b,S,i.image[t])}}}g(o)&&_(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ge(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=y(o.internalFormat,d,f,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,we(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function R(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=b(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=we(n);Te(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,l,o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,l,o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=y(o.internalFormat,c,l,o.colorSpace),d=we(n);r&&Te(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,d,u,n.width,n.height):Te(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,d,u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function _e(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let a=r.get(i.depthTexture);a.__renderTarget=i,a.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),ae(i.depthTexture,0);let o=a.__webglTexture,c=we(i);if(i.depthTexture.format===1026)Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,o,0);else if(i.depthTexture.format===1027)Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,o,0);else throw Error(`Unknown depthTexture format`)}function z(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);let e=t.texture.mipmaps;e&&e.length>0?_e(i.__webglFramebuffer[0],t):_e(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),R(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),R(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function ve(t,n,i){let a=r.get(t);n!==void 0&&ge(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&z(t)}function ye(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,C);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Te(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=y(r.internalFormat,i,o,r.colorSpace,t.isXRRenderTarget===!0),u=we(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),R(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),F(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ge(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);g(i)&&_(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),F(c,a),ge(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),g(a)&&_(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),F(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ge(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);g(i)&&_(r),n.unbindTexture()}t.depthBuffer&&z(t)}function be(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(g(a)){let t=v(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),_(t),n.unbindTexture()}}}let xe=[],Se=[];function Ce(t){if(t.samples>0){if(Te(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(xe.length=0,Se.length=0,xe.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(xe.push(l),Se.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Se)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,xe))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function we(e){return Math.min(i.maxSamples,e.samples)}function Te(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Ee(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function De(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Mt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,n)),t}function Oe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=re,this.resetTextureUnits=ne,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=ve,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=z,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=Te}function hu(e,t){function n(n,r=``){let i,a=Mt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var gu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_u=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,vu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new na(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ei({vertexShader:gu,fragmentShader:_u,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ur(new So(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},yu=class extends ut{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new vu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new V,C=null,w=new ai;w.viewport=new Ut;let T=new ai;T.viewport=new Ut;let E=[w,T],D=new rs,O=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new pi,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new pi,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new pi,b[e]=t),t.getHandSpace()};function A(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function j(){r.removeEventListener(`select`,A),r.removeEventListener(`selectstart`,A),r.removeEventListener(`selectend`,A),r.removeEventListener(`squeeze`,A),r.removeEventListener(`squeezestart`,A),r.removeEventListener(`squeezeend`,A),r.removeEventListener(`end`,j),r.removeEventListener(`inputsourceschange`,ee);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}O=null,k=null,h.reset();for(let e in g)delete g[e];e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,A),r.addEventListener(`selectstart`,A),r.addEventListener(`selectend`,A),r.addEventListener(`squeeze`,A),r.addEventListener(`squeezestart`,A),r.addEventListener(`squeezeend`,A),r.addEventListener(`end`,j),r.addEventListener(`inputsourceschange`,ee),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?pe:I,a=_.stencil?ce:re);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Gt(d.textureWidth,d.textureHeight,{format:fe,type:te,depthTexture:new ta(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Gt(f.framebufferWidth,f.framebufferHeight,{format:fe,type:te,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ee(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let M=new H,N=new H;function P(e,t,n){M.setFromMatrixPosition(t.matrixWorld),N.setFromMatrixPosition(n.matrixWorld);let r=M.distanceTo(N),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ne(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),D.near=T.near=w.near=t,D.far=T.far=w.far=n,(O!==D.near||k!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),O=D.near,k=D.far),D.layers.mask=e.layers.mask|6,w.layers.mask=D.layers.mask&3,T.layers.mask=D.layers.mask&5;let i=e.parent,a=D.cameras;ne(D,i);for(let e=0;e<a.length;e++)ne(a[e],i);a.length===2?P(D,w,T):D.projectionMatrix.copy(w.projectionMatrix),ie(e,D,i)};function ie(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=pt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(D)},this.getCameraTexture=function(e){return g[e]};let ae=null;function oe(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==D.cameras.length&&(D.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=E[n];o===void 0&&(o=new ai,o.layers.enable(n),o.viewport=new Ut,E[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(D.matrix.copy(o.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),i===!0&&D.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new na,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ae&&ae(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let se=new Cs;se.setAnimationLoop(oe),this.setAnimationLoop=function(e){ae=e},this.dispose=function(){}}},bu=new Mn,xu=new Sn;function Su(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Xr(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,bu.copy(o),bu.x*=-1,bu.y*=-1,bu.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(bu.y*=-1,bu.z*=-1),e.envMapRotation.value.setFromMatrix4(xu.makeRotationFromEuler(bu)),e.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Cu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var wu=class{constructor(e={}){let{canvas:t=Tt(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);f=n.getContextAttributes().alpha}else f=a;let p=new Uint32Array(4),m=new Int32Array(4),h=null,g=null,_=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,b=!1;this._outputColorSpace=nt;let x=0,S=0,C=null,w=-1,T=null,E=new Ut,D=new Ut,O=null,k=new W(0),A=0,j=t.width,M=t.height,N=1,P=null,ne=null,re=new Ut(0,0,j,M),ie=new Ut(0,0,j,M),oe=!1,se=new Ni,ce=!1,le=!1,ue=new Sn,de=new H,F=new Ut,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},I=!1;function pe(){return C===null?N:1}let L=n;function me(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r180`),t.addEventListener(`webglcontextlost`,ze,!1),t.addEventListener(`webglcontextrestored`,Be,!1),t.addEventListener(`webglcontextcreationerror`,Ve,!1),L===null){let t=`webgl2`;if(L=me(t,e),L===null)throw me(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let he,ge,R,_e,z,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie;function Le(){he=new rc(L),he.init(),Pe=new hu(L,he),ge=new Ms(L,he,e,Pe),R=new pu(L,he),ge.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),_e=new oc(L),z=new Zl,ve=new mu(L,he,R,z,ge,Pe,_e),ye=new Ps(y),be=new nc(y),xe=new ws(L),Fe=new As(L,xe),Se=new ic(L,xe,_e,Fe),Ce=new cc(L,Se,xe,_e),je=new sc(L,ge,ve),Oe=new Ns(z),we=new Xl(y,ye,be,he,ge,Fe,Oe),Te=new Su(y,z),Ee=new tu,De=new cu(he),Ae=new ks(y,ye,be,R,Ce,f,s),ke=new du(y,Ce,ge),Ie=new Cu(L,_e,ge,R),Me=new js(L,he,_e),Ne=new ac(L,he,_e),_e.programs=we.programs,y.capabilities=ge,y.extensions=he,y.properties=z,y.renderLists=Ee,y.shadowMap=ke,y.state=R,y.info=_e}Le();let Re=new yu(y,L);this.xr=Re,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=he.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=he.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(e){e!==void 0&&(N=e,this.setSize(j,M,!1))},this.getSize=function(e){return e.set(j,M)},this.setSize=function(e,n,r=!0){Re.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(j=e,M=n,t.width=Math.floor(e*N),t.height=Math.floor(n*N),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(j*N,M*N).floor()},this.setDrawingBufferSize=function(e,n,r){j=e,M=n,N=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e.copy(E)},this.getViewport=function(e){return e.copy(re)},this.setViewport=function(e,t,n,r){e.isVector4?re.set(e.x,e.y,e.z,e.w):re.set(e,t,n,r),R.viewport(E.copy(re).multiplyScalar(N).round())},this.getScissor=function(e){return e.copy(ie)},this.setScissor=function(e,t,n,r){e.isVector4?ie.set(e.x,e.y,e.z,e.w):ie.set(e,t,n,r),R.scissor(D.copy(ie).multiplyScalar(N).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(e){R.setScissorTest(oe=e)},this.setOpaqueSort=function(e){P=e},this.setTransparentSort=function(e){ne=e},this.getClearColor=function(e){return e.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(C!==null){let t=C.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=C.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=Ae.getClearColor(),r=Ae.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(p[0]=i,p[1]=a,p[2]=o,p[3]=r,L.clearBufferuiv(L.COLOR,0,p)):(m[0]=i,m[1]=a,m[2]=o,m[3]=r,L.clearBufferiv(L.COLOR,0,m))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ze,!1),t.removeEventListener(`webglcontextrestored`,Be,!1),t.removeEventListener(`webglcontextcreationerror`,Ve,!1),Ae.dispose(),Ee.dispose(),De.dispose(),z.dispose(),ye.dispose(),be.dispose(),Ce.dispose(),Fe.dispose(),Ie.dispose(),we.dispose(),Re.dispose(),Re.removeEventListener(`sessionstart`,Je),Re.removeEventListener(`sessionend`,Ye),Xe.stop()};function ze(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),b=!0}function Be(){console.log(`THREE.WebGLRenderer: Context Restored.`),b=!1;let e=_e.autoReset,t=ke.enabled,n=ke.autoUpdate,r=ke.needsUpdate,i=ke.type;Le(),_e.autoReset=e,ke.enabled=t,ke.autoUpdate=n,ke.needsUpdate=r,ke.type=i}function Ve(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function He(e){let t=e.target;t.removeEventListener(`dispose`,He),Ue(t)}function Ue(e){We(e),z.remove(e)}function We(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){we.releaseProgram(e)}),e.isShaderMaterial&&we.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=fe);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=st(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Se.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Fe.setup(i,r,s,n,c);let h,g=Me;if(c!==null&&(h=xe.get(c),g=Ne,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*pe()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*pe()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(i._multiDrawInstances!==null)Dt(`THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection.`),g.renderMultiDrawInstances(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount,i._multiDrawInstances);else if(he.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?xe.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ge(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,it(e,t,n),e.side=0,e.needsUpdate=!0,it(e,t,n),e.side=2):it(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),g=De.get(n),g.init(t),v.push(g),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(g.pushLight(e),e.castShadow&&g.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(g.pushLight(e),e.castShadow&&g.pushShadow(e))}),g.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];Ge(a,n,e),r.add(a)}else Ge(t,n,e),r.add(t)}}),g=v.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){z.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}he.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Ke=null;function qe(e){Ke&&Ke(e)}function Je(){Xe.stop()}function Ye(){Xe.start()}let Xe=new Cs;Xe.setAnimationLoop(qe),typeof self<`u`&&Xe.setContext(self),this.setAnimationLoop=function(e){Ke=e,Re.setAnimationLoop(e),e===null?Xe.stop():Xe.start()},Re.addEventListener(`sessionstart`,Je),Re.addEventListener(`sessionend`,Ye),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(b===!0)return;if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Re.enabled===!0&&Re.isPresenting===!0&&(Re.cameraAutoUpdate===!0&&Re.updateCamera(t),t=Re.getCamera()),e.isScene===!0&&e.onBeforeRender(y,e,t,C),g=De.get(e,v.length),g.init(t),v.push(g),ue.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),se.setFromProjectionMatrix(ue,lt,t.reversedDepth),le=this.localClippingEnabled,ce=Oe.init(this.clippingPlanes,le),h=Ee.get(e,_.length),h.init(),_.push(h),Re.enabled===!0&&Re.isPresenting===!0){let e=y.xr.getDepthSensingMesh();e!==null&&Ze(e,t,-1/0,y.sortObjects)}Ze(e,t,0,y.sortObjects),h.finish(),y.sortObjects===!0&&h.sort(P,ne),I=Re.enabled===!1||Re.isPresenting===!1||Re.hasDepthSensing()===!1,I&&Ae.addToRenderList(h,e),this.info.render.frame++,ce===!0&&Oe.beginShadows();let n=g.state.shadowsArray;ke.render(n,e,t),ce===!0&&Oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let r=h.opaque,i=h.transmissive;if(g.setupLights(),t.isArrayCamera){let n=t.cameras;if(i.length>0)for(let t=0,a=n.length;t<a;t++){let a=n[t];$e(r,i,e,a)}I&&Ae.render(e);for(let t=0,r=n.length;t<r;t++){let r=n[t];Qe(h,e,r,r.viewport)}}else i.length>0&&$e(r,i,e,t),I&&Ae.render(e),Qe(h,e,t);C!==null&&S===0&&(ve.updateMultisampleRenderTarget(C),ve.updateRenderTargetMipmap(C)),e.isScene===!0&&e.onAfterRender(y,e,t),Fe.resetDefaultState(),w=-1,T=null,v.pop(),v.length>0?(g=v[v.length-1],ce===!0&&Oe.setGlobalState(y.clippingPlanes,g.state.camera)):g=null,_.pop(),h=_.length>0?_[_.length-1]:null};function Ze(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)g.pushLight(e),e.castShadow&&g.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||se.intersectsSprite(e)){r&&F.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ue);let t=Ce.update(e),i=e.material;i.visible&&h.push(e,t,i,n,F.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||se.intersectsObject(e))){let t=Ce.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),F.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),F.copy(e.boundingSphere.center)),F.applyMatrix4(e.matrixWorld).applyMatrix4(ue)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&h.push(e,t,s,n,F.z,o)}}else i.visible&&h.push(e,t,i,n,F.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)Ze(i[e],t,n,r)}function Qe(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;g.setupLightsView(n),ce===!0&&Oe.setGlobalState(y.clippingPlanes,n),r&&R.viewport(E.copy(r)),i.length>0&&et(i,t,n),a.length>0&&et(a,t,n),o.length>0&&et(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function $e(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[r.id]===void 0&&(g.state.transmissionRenderTarget[r.id]=new Gt(1,1,{generateMipmaps:!0,type:he.has(`EXT_color_buffer_half_float`)||he.has(`EXT_color_buffer_float`)?ae:te,minFilter:ee,samples:4,stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Mt.workingColorSpace}));let a=g.state.transmissionRenderTarget[r.id],o=r.viewport||E;a.setSize(o.z*y.transmissionResolutionScale,o.w*y.transmissionResolutionScale);let s=y.getRenderTarget(),c=y.getActiveCubeFace(),l=y.getActiveMipmapLevel();y.setRenderTarget(a),y.getClearColor(k),A=y.getClearAlpha(),A<1&&y.setClearColor(16777215,.5),y.clear(),I&&Ae.render(n);let u=y.toneMapping;y.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),g.setupLightsView(r),ce===!0&&Oe.setGlobalState(y.clippingPlanes,r),et(e,n,r),ve.updateMultisampleRenderTarget(a),ve.updateRenderTargetMipmap(a),he.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=a.object,s=a.geometry,c=a.material,l=a.group;if(c.side===2&&o.layers.test(r.layers)){let t=c.side;c.side=1,c.needsUpdate=!0,tt(o,n,r,s,c,l),c.side=t,c.needsUpdate=!0,e=!0}}e===!0&&(ve.updateMultisampleRenderTarget(a),ve.updateRenderTargetMipmap(a))}y.setRenderTarget(s,c,l),y.setClearColor(k,A),d!==void 0&&(r.viewport=d),y.toneMapping=u}function et(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=a.group,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&tt(o,t,n,s,l,c)}}function tt(e,t,n,r,i,a){e.onBeforeRender(y,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(y,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,y.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,y.renderBufferDirect(n,t,r,i,e,a),i.side=2):y.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(y,t,n,r,i,a)}function it(e,t,n){t.isScene!==!0&&(t=fe);let r=z.get(e),i=g.state.lights,a=g.state.shadowsArray,o=i.state.version,s=we.getParameters(e,i.state,a,t,n),c=we.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?be:ye).get(e.envMap||r.environment),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,He),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return ot(e,s),u}else s.uniforms=we.getUniforms(e),e.onBeforeCompile(s,y),u=we.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Oe.uniform),ot(e,s),r.needsLights=ut(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function at(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=hl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ot(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function st(e,t,n,r,i){t.isScene!==!0&&(t=fe),ve.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial?t.environment:null,s=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:rt,c=(r.isMeshStandardMaterial?be:ye).get(r.envMap||o),l=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,u=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),d=!!n.morphAttributes.position,f=!!n.morphAttributes.normal,p=!!n.morphAttributes.color,m=0;r.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(m=y.toneMapping);let h=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=h===void 0?0:h.length,v=z.get(r),b=g.state.lights;if(ce===!0&&(le===!0||e!==T)){let t=e===T&&r.id===w;Oe.setState(r,e,t)}let x=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version?x=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?x=!0:v.envMap===c?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Oe.numPlanes||v.numIntersection!==Oe.numIntersection)?x=!0:v.vertexAlphas===l&&v.vertexTangents===u&&v.morphTargets===d&&v.morphNormals===f&&v.morphColors===p&&v.toneMapping===m?v.morphTargetsCount!==_&&(x=!0):x=!0:x=!0:x=!0:(x=!0,v.__version=r.version);let S=v.currentProgram;x===!0&&(S=it(r,t,i));let E=!1,D=!1,O=!1,k=S.getUniforms(),A=v.uniforms;if(R.useProgram(S.program)&&(E=!0,D=!0,O=!0),r.id!==w&&(w=r.id,D=!0),E||T!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),k.setValue(L,`projectionMatrix`,e.projectionMatrix),k.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=k.map.cameraPosition;t!==void 0&&t.setValue(L,de.setFromMatrixPosition(e.matrixWorld)),ge.logarithmicDepthBuffer&&k.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&k.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),T!==e&&(T=e,D=!0,O=!0)}if(i.isSkinnedMesh){k.setOptional(L,i,`bindMatrix`),k.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),k.setValue(L,`boneTexture`,e.boneTexture,ve))}i.isBatchedMesh&&(k.setOptional(L,i,`batchingTexture`),k.setValue(L,`batchingTexture`,i._matricesTexture,ve),k.setOptional(L,i,`batchingIdTexture`),k.setValue(L,`batchingIdTexture`,i._indirectTexture,ve),k.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&k.setValue(L,`batchingColorTexture`,i._colorsTexture,ve));let j=n.morphAttributes;if((j.position!==void 0||j.normal!==void 0||j.color!==void 0)&&je.update(i,n,S),(D||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,k.setValue(L,`receiveShadow`,i.receiveShadow)),r.isMeshGouraudMaterial&&r.envMap!==null&&(A.envMap.value=c,A.flipEnvMap.value=c.isCubeTexture&&c.isRenderTargetTexture===!1?-1:1),r.isMeshStandardMaterial&&r.envMap===null&&t.environment!==null&&(A.envMapIntensity.value=t.environmentIntensity),D&&(k.setValue(L,`toneMappingExposure`,y.toneMappingExposure),v.needsLights&&ct(A,O),a&&r.fog===!0&&Te.refreshFogUniforms(A,a),Te.refreshMaterialUniforms(A,r,N,M,g.state.transmissionRenderTarget[e.id]),hl.upload(L,at(v),A,ve)),r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(hl.upload(L,at(v),A,ve),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&k.setValue(L,`center`,i.center),k.setValue(L,`modelViewMatrix`,i.modelViewMatrix),k.setValue(L,`normalMatrix`,i.normalMatrix),k.setValue(L,`modelMatrix`,i.matrixWorld),r.isShaderMaterial||r.isRawShaderMaterial){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ie.update(n,S),Ie.bind(n,S)}}return S}function ct(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function ut(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return x},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let dt=L.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){C=e,x=t,S=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=z.get(e);if(s.__useDefaultFramebuffer!==void 0)R.bindFramebuffer(L.FRAMEBUFFER,null),r=!1;else if(s.__webglFramebuffer===void 0)ve.setupRenderTarget(e);else if(s.__hasExternalTextures)ve.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(s.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);ve.setupDepthRenderbuffer(e)}}let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=e.samples>0&&ve.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,E.copy(e.viewport),D.copy(e.scissor),O=e.scissorTest}else E.copy(re).multiplyScalar(N).floor(),D.copy(ie).multiplyScalar(N).floor(),O=oe;if(n!==0&&(i=dt),R.bindFramebuffer(L.FRAMEBUFFER,i)&&r&&R.drawBuffers(e,i),R.viewport(E),R.scissor(D),R.setScissorTest(O),a){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}w=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(!ge.textureFormatReadable(c)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!ge.textureTypeReadable(l)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&(e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s),L.readPixels(t,n,r,i,Pe.convert(c),Pe.convert(l),a))}finally{let e=C===null?null:z.get(C).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(!ge.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!ge.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,d),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s),L.readPixels(t,n,r,i,Pe.convert(l),Pe.convert(u),0);let f=C===null?null:z.get(C).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,f);let p=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Ot(L,p,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,d),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.deleteBuffer(d),L.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;ve.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()};let ft=L.createFramebuffer(),pt=L.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=null){a===null&&(i===0?a=0:(Dt(`WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels.`),a=i,i=0));let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Pe.convert(t.format),_=Pe.convert(t.type),v;t.isData3DTexture?(ve.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(ve.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(ve.setTexture2D(t,0),v=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=L.getParameter(L.UNPACK_ROW_LENGTH),b=L.getParameter(L.UNPACK_IMAGE_HEIGHT),x=L.getParameter(L.UNPACK_SKIP_PIXELS),S=L.getParameter(L.UNPACK_SKIP_ROWS),C=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,l),L.pixelStorei(L.UNPACK_SKIP_ROWS,u),L.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,o,s,f,p,o,s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,ft),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,pt);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,o,s,f,p,o,s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);L.pixelStorei(L.UNPACK_ROW_LENGTH,y),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),L.pixelStorei(L.UNPACK_SKIP_PIXELS,x),L.pixelStorei(L.UNPACK_SKIP_ROWS,S),L.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&ve.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?ve.setTextureCube(e,0):e.isData3DTexture?ve.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?ve.setTexture2DArray(e,0):ve.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){x=0,S=0,C=null,R.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return lt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Mt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Mt._getUnpackColorSpace()}},Tu={minHeight:2,passBehaviors:[`orbit`,`strike`,`meteor`,`summon`],impactParticles:6},J={floor:0,solid:1,liquid:2,hazard:3,ice:4,wall:5,shallow:6};function Eu(e){return e===J.liquid||e===J.shallow}var Du={walk:1.01,air:.8},Ou={maxTan:Math.tan(40*Math.PI/180),lip:.55,fall:.6,jump:1.2,doubleJump:2.2},ku=class{constructor(e,t=!1){m(this,`size`,void 0),m(this,`cell`,void 0),m(this,`tile`,void 0),m(this,`height`,void 0),m(this,`elev`,void 0),m(this,`ox`,0),m(this,`oz`,0),m(this,`shadeElev`,null),m(this,`reach`,null),m(this,`tileNames`,[]),m(this,`corner`,null),m(this,`surf`,null),m(this,`top`,null),m(this,`flow`,null),this.size=e,this.cell=new Uint8Array(e*e),this.tile=new Uint8Array(e*e),this.height=new Uint8Array(e*e),this.elev=t?new Uint16Array(e*e):new Uint8Array(e*e)}inLocal(e,t){return e>=0&&t>=0&&e<this.size&&t<this.size}blocksLocal(e,t){if(!this.inLocal(e,t))return!0;let n=this.cell[t*this.size+e];return n===J.solid||n===J.liquid||n===J.wall}elevAt(e,t){let n=Math.floor(e-this.ox),r=Math.floor(t-this.oz);return this.inLocal(n,r)?this.elev[r*this.size+n]:0}cornersOf(e){return this.corner?this.corner.subarray(e*4,e*4+4):null}groundY(e,t){return this.groundL(e-this.ox,t-this.oz)}groundL(e,t){let n=Math.floor(e),r=Math.floor(t);if(!this.inLocal(n,r))return 0;let i=r*this.size+n;if(this.top)return this.top[i];let a=this.cornersOf(i);if(!a)return this.elev[i];let o=e-n,s=t-r,c=a[0]+(a[1]-a[0])*o;return c+(a[2]+(a[3]-a[2])*o-c)*s}slopeAt(e,t){return this.slopeL(e-this.ox,t-this.oz)}slopeL(e,t){let n=Math.floor(e),r=Math.floor(t);if(!this.inLocal(n,r)||this.top)return[0,0];let i=this.cornersOf(r*this.size+n);if(!i)return[0,0];let a=e-n,o=t-r;return[(i[1]-i[0])*(1-o)+(i[3]-i[2])*o,(i[2]-i[0])*(1-a)+(i[3]-i[1])*a]}centerY(e){if(this.top)return this.top[e];let t=this.cornersOf(e);return t?(t[0]+t[1]+t[2]+t[3])*.25:this.elev[e]}minCorner(e){if(this.top)return this.top[e];let t=this.cornersOf(e);return t?Math.min(t[0],t[1],t[2],t[3]):this.elev[e]}maxCorner(e){if(this.top)return this.top[e];let t=this.cornersOf(e);return t?Math.max(t[0],t[1],t[2],t[3]):this.elev[e]}canWalk(e,t,n,r,i,a=!1){e-=this.ox,n-=this.ox,t-=this.oz,r-=this.oz;let o=Math.floor(n),s=Math.floor(r);if(this.blocksLocal(o,s))return!1;let c=this.groundL(n,r);if(a)return c<=i+Du.air;let l=c-i;if(l<=.02)return!0;if(l>Ou.lip)return!1;let[u,d]=this.slopeL(n,r),f=n-e,p=r-t,m=Math.hypot(f,p);return m<1e-6||(u*f+d*p)/m<=.02||Math.hypot(u,d)<=Ou.maxTan}canEnter(e,t,n,r=!1){return e-=this.ox,t-=this.oz,!this.blocksLocal(e,t)&&this.centerY(t*this.size+e)<=n+(r?Du.air:Ou.lip+Ou.maxTan*.5)}passable(e,t){let n=this.size,r=e%n,i=e/n|0,a=t%n,o=t/n|0;if(this.blocksLocal(r,i)||this.blocksLocal(a,o))return!1;let s=a-r,c=o-i,l=this.centerY(e),u=this.centerY(t),d=s&&c?Math.SQRT2:1;if(Math.abs(l-u)>Ou.maxTan*d+.04)return!1;if(this.top)return Math.abs(l-u)<=Ou.lip;let f=this.cornersOf(e),p=this.cornersOf(t);if(!f||!p)return Math.abs(this.elev[e]-this.elev[t])<=1;let m=(e,t)=>e+2*t;if(s&&c){let e=+(s>0),t=+(c>0);return Math.abs(f[m(e,t)]-p[m(1-e,1-t)])<=Ou.lip}if(s){let e=+(s>0),t=1-e;return Math.abs(f[m(e,0)]+f[m(e,1)]-p[m(t,0)]-p[m(t,1)])*.5<=Ou.lip}let h=+(c>0),g=1-h;return Math.abs(f[m(0,h)]+f[m(1,h)]-p[m(0,g)]-p[m(1,g)])*.5<=Ou.lip}stepOk(e,t,n,r){return e-=this.ox,n-=this.ox,t-=this.oz,r-=this.oz,!this.inLocal(e,t)||!this.inLocal(n,r)?!1:e===n&&t===r?!0:Math.abs(e-n)>1||Math.abs(t-r)>1?!1:this.passable(t*this.size+e,r*this.size+n)}computeReach(e,t){let n=this.size,r=new Uint8Array(n*n),i=new Int32Array(n*n),a=0,o=0,s=Math.floor(t-this.oz)*n+Math.floor(e-this.ox);for(r[s]=1,i[o++]=s;a<o;){let e=i[a++],t=e%n,s=e/n|0;for(let[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){let l=t+a,u=s+c;if(l<0||u<0||l>=n||u>=n)continue;let d=u*n+l;!r[d]&&this.passable(e,d)&&this.passable(d,e)&&(r[d]=1,i[o++]=d)}}return r}linked(e,t){return this.cell[e]===J.liquid||this.cell[t]===J.liquid?!1:Math.abs(this.elev[e]-this.elev[t])<=1}buildSurface(e={}){let t=this.size,n=new Float32Array(t*t);for(let r=0;r<t*t;r++)n[r]=this.elev[r]+(e.relief&&this.cell[r]!==J.liquid?e.relief[r]:0);let r=new Uint8Array(t*t),i=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];for(let e=0;e<t;e++)for(let n=0;n<t;n++){let a=e*t+n,o=0;i.forEach(([r,i],s)=>{let c=n+r,l=e+i;c>=0&&l>=0&&c<t&&l<t&&this.linked(a,l*t+c)&&(o|=1<<s)}),r[a]=o}let a=new Float32Array(t*t),o=e.iters??7;for(let e=0;e<o;e++){for(let e=0;e<t;e++)for(let o=0;o<t;o++){let s=e*t+o,c=r[s],l=n[s]*2,u=2;if(c){for(let r=0;r<8;r++)if(c&1<<r){let a=r<4?1:.7;l+=n[(e+i[r][1])*t+o+i[r][0]]*a,u+=a}}a[s]=l/u}[n,a]=[a,n]}for(let e=0;e<t*t;e++)this.cell[e]===J.liquid&&(n[e]=this.elev[e]);for(let e=0;e<t;e++)for(let r=0;r<t;r++){let i=e*t+r;if(this.cell[i]!==J.liquid)for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++){let s=r+o,c=e+a;if(s<0||c<0||s>=t||c>=t)continue;let l=c*t+s;this.cell[l]===J.liquid&&(n[i]=Math.max(n[i],this.elev[l]-.3))}}this.surf=n,this.corner=new Float32Array(t*t*4),this.recomputeCorners(0,0,t-1,t-1)}recomputeCorners(e,t,n,r){let i=this.surf,a=this.corner;if(!i||!a)return;let o=this.size,s=[0,0,0,0],c=[0,1,2,3],l=e=>c[e]===e?e:c[e]=l(c[e]);for(let u=Math.max(0,t);u<=Math.min(o,r+1);u++)for(let t=Math.max(0,e);t<=Math.min(o,n+1);t++){for(let e=0;e<4;e++){let n=t-1+(e&1),r=u-1+(e>>1);s[e]=n>=0&&r>=0&&n<o&&r<o?r*o+n:-1,c[e]=e}for(let[e,t]of[[0,1],[0,2],[1,3],[2,3],[0,3],[1,2]])s[e]<0||s[t]<0||!this.linked(s[e],s[t])||(c[l(e)]=l(t));for(let e=0;e<4;e++){if(s[e]<0)continue;let t=l(e),n=0,r=0;for(let e=0;e<4;e++)s[e]>=0&&l(e)===t&&(n+=i[s[e]],r++);a[s[e]*4+(3-e)]=n/r}}}setVertex(e,t,n,r){let i=this.corner;if(!i)return;let a=this.size,o=r%a,s=r/a|0,c=i[r*4+(e-o)+2*(t-s)];for(let r=0;r<4;r++){let o=e-1+(r&1),s=t-1+(r>>1);if(o<0||s<0||o>=a||s>=a)continue;let l=(s*a+o)*4+(3-r);Math.abs(i[l]-c)<1e-4&&(i[l]=n)}}flattenPad(e,t){if(!this.corner)return;let n=this.size;for(let r of e){let e=r%n,i=r/n|0;if(this.cell[r]!==J.liquid){for(let n=0;n<4;n++)this.setVertex(e+(n&1),i+(n>>1),t,r);this.surf&&(this.surf[r]=t)}}}idx(e,t){return(t-this.oz)*this.size+e-this.ox}inBounds(e,t){return this.inLocal(e-this.ox,t-this.oz)}cellAt(e,t){let n=Math.floor(e-this.ox),r=Math.floor(t-this.oz);return this.inLocal(n,r)?this.cell[r*this.size+n]:J.wall}blocksWalker(e,t){return this.blocksLocal(e-this.ox,t-this.oz)}blocksFlyer(e,t){return e-=this.ox,t-=this.oz,!this.inLocal(e,t)||this.cell[t*this.size+e]===J.wall}blocksShot(e,t,n=1/0){return this.shotL(e-this.ox,t-this.oz,n)}shotL(e,t,n){if(!this.inLocal(e,t))return!0;let r=t*this.size+e;if((this.corner||this.top?this.maxCorner(r):this.elev[r])>n)return!0;let i=this.cell[r];if(i===J.wall)return!0;if(i!==J.solid)return!1;let a=this.height[r];return a===0||a>=Tu.minHeight}shotRay(e,t,n,r,i=!1,a=1/0){e-=this.ox,n-=this.ox,t-=this.oz,r-=this.oz;let o=Math.floor(e),s=Math.floor(t),c=Math.floor(n),l=Math.floor(r);if(o===c&&s===l)return 1;let u=n-e,d=r-t,f=u>0?1:-1,p=d>0?1:-1,m=u===0?1/0:Math.abs(1/u),h=d===0?1/0:Math.abs(1/d),g=u===0?1/0:(u>0?o+1-e:e-o)*m,_=d===0?1/0:(d>0?s+1-t:t-s)*h;for(let e=0;e<512;e++){let e;if(g<_?(e=g,g+=m,o+=f):(e=_,_+=h,s+=p),e>1)return 1;let t=o===c&&s===l;if(t&&i)return 1;if(this.shotL(o,s,a))return e;if(t)return 1}return 1}los(e,t,n,r){let i=Math.max(this.groundY(e,t),this.groundY(n,r))+1.5;return this.shotRay(e,t,n,r,!0,i)>=1}walkableAt(e,t){return!this.blocksWalker(Math.floor(e),Math.floor(t))}tileId(e){let t=this.tileNames.indexOf(e);return t<0&&(t=this.tileNames.length,this.tileNames.push(e)),t}setTile(e,t,n,r){if(!this.inBounds(e,t))return;let i=this.idx(e,t);this.cell[i]!==J.wall&&(this.tile[i]=this.tileId(n),r!==void 0&&(this.cell[i]=r))}setCell(e,t,n){if(!this.inBounds(e,t))return;let r=this.idx(e,t);this.cell[r]!==J.wall&&(this.cell[r]=n)}isFree(e,t){return this.inBounds(e,t)&&this.cell[this.idx(e,t)]===J.floor}areaFree(e,t,n){for(let r=t-n;r<=t+n;r++)for(let t=e-n;t<=e+n;t++)if(!this.isFree(t,r))return!1;return!0}},Au=2.2,ju=class{constructor(e){m(this,`camera`,void 0),m(this,`trauma`,0),m(this,`tx`,0),m(this,`tz`,0),m(this,`ty`,0),m(this,`pitch`,50*Math.PI/180),m(this,`baseDist`,34),m(this,`baseFov`,30),m(this,`height`,34*Math.sin(50*Math.PI/180)),m(this,`back`,34*Math.cos(50*Math.PI/180)),m(this,`yaw`,Math.PI/4),m(this,`toCam`,{x:Math.sin(Math.PI/4),z:Math.cos(Math.PI/4)}),m(this,`block`,1),m(this,`viewPitch`,50*Math.PI/180),m(this,`shake`,1),m(this,`zoom`,1),m(this,`autoZoom`,1),m(this,`autoTarget`,1),m(this,`ray`,new vs),m(this,`ndc`,new V),m(this,`plane`,new ki(new H(0,1,0),0)),m(this,`hit`,new H),this.camera=new ai(this.baseFov,e,1,240)}resize(e,t){let n=e/t;this.camera.aspect=n;let r=this.baseFov;this.camera.fov=n<1?r*1.55:n<1.4?r*1.2:r,this.camera.updateProjectionMatrix()}get distance(){return Math.hypot(this.height,this.back)*this.zoom}orbit(e,t){this.yaw=((this.yaw+e)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);let n=25*Math.PI/180,r=50*Math.PI/180;this.pitch=Math.max(n,Math.min(r,this.pitch+t));let i=this.baseDist;this.height=i*Math.sin(this.pitch),this.back=i*Math.cos(this.pitch),this.toCam.x=Math.sin(this.yaw),this.toCam.z=Math.cos(this.yaw)}addShake(e){this.shake<=0||(this.trauma=Math.min(1,this.trauma+e*this.shake))}snap(e,t,n=this.ty){this.tx=e,this.tz=t,this.ty=n}update(e,t,n,r={x:0,z:0},i=0,a,o){let s=1-Math.exp(-8*e);this.tx+=(t+r.x-this.tx)*s,this.tz+=(n+r.z-this.tz)*s,this.ty+=(i-this.ty)*(1-Math.exp(-4*e)),this.trauma=Math.max(0,this.trauma-e*1.6);let c=this.trauma*this.trauma*.6,l=(Math.random()*2-1)*c,u=(Math.random()*2-1)*c;this.autoZoom+=(this.autoTarget-this.autoZoom)*(1-Math.exp(-1.5*e));let d=this.baseDist*this.zoom*this.autoZoom,f=this.pitch,p=1;if(a){let e=50*Math.PI/180,t=-1;for(let n=this.pitch;;n=Math.min(e,n+5*Math.PI/180)){let r=this.clearance(a,n,d);if(o&&r>0){let t=Math.cos(n)*d*r,i=this.ty+1.2+(Math.sin(n)*d-1.2)*r;o(this.tx+this.toCam.x*t,this.tz+this.toCam.z*t)+1>i&&n<e&&(r=Math.min(r,.999))}if(r>t+.001&&(t=r,f=n),r>=1||n>=e)break}p=t}let m=1-Math.exp((p>=1&&f===this.pitch?-20:f>this.viewPitch?-12:-3)*e);this.viewPitch+=(f-this.viewPitch)*m,this.block+=(p-this.block)*(1-Math.exp((p<this.block?-25:-3)*e));let h=d*this.block,g=1.2+(Math.sin(this.viewPitch)*d-1.2)*this.block,_=Math.cos(this.viewPitch)*h;this.camera.position.set(this.tx+this.toCam.x*_+l,this.ty+g,this.tz+this.toCam.z*_+u),this.camera.lookAt(this.tx+l*.5,this.ty,this.tz+u*.5)}clearance(e,t,n){let r=Math.sin(t)*n,i=Math.cos(t)*n,a=this.ty+1.2;for(let t=1;t<=48;t++){let o=t/48;if(e(this.tx+this.toCam.x*i*o,this.tz+this.toCam.z*i*o)+1>a+(r-1.2)*o)return Math.max(Au/n,(t-2)/48)}return 1}screenToWorld(e,t){let n=Math.cos(this.yaw),r=Math.sin(this.yaw);return[e*n+t*r,-e*r+t*n]}groundPoint(e,t,n,r,i=0){this.ndc.set(e/n*2-1,-(t/r)*2+1),this.ray.setFromCamera(this.ndc,this.camera),this.plane.constant=-i;let a=this.ray.ray.intersectPlane(this.plane,this.hit);return a?[a.x,a.z]:null}terrainPoint(e,t,n,r,i,a=0){this.ndc.set(e/n*2-1,-(t/r)*2+1),this.ray.setFromCamera(this.ndc,this.camera);let o=this.ray.ray.origin,s=this.ray.ray.direction;if(s.y>=-.01)return this.groundPoint(e,t,n,r,this.ty+a);let c=0;for(let e=0;e<400;e+=.35){let t=o.x+s.x*e,n=o.y+s.y*e;if(n<=i(t,o.z+s.z*e)+a){let t=c,n=e;for(let e=0;e<6;e++){let e=(t+n)/2;o.y+s.y*e<=i(o.x+s.x*e,o.z+s.z*e)+a?n=e:t=e}return[o.x+s.x*n,o.z+s.z*n]}if(c=e,n<-2)break}return this.groundPoint(e,t,n,r,a)}get target(){return{x:this.tx,y:this.ty,z:this.tz}}};function Y(e,t,n=0){let r=e*374761393+t*668265263+n*2147483647|0;return r=Math.imul(r^r>>>13,1274126177),r^=r>>>16,(r>>>0)/4294967296}function Mu(e,t,n=0){let r=Math.floor(e),i=Math.floor(t),a=e-r,o=t-i;a=a*a*(3-2*a),o=o*o*(3-2*o);let s=Y(r,i,n),c=Y(r+1,i,n),l=Y(r,i+1,n),u=Y(r+1,i+1,n);return s+(c-s)*a+(l-s)*o+(s-c-l+u)*a*o}function Nu(e,t,n=0){return Mu(e,t,n)*.68+Mu(e*2.3+17.1,t*2.3-5.3,n+1)*.32}function Pu(e=8){let t=new Uint8Array(e*e*4);for(let n=0;n<e;n++)for(let r=0;r<e;r++){let i=r===0||n===0||r===e-1||n===e-1,a=.86+Y(r,n,7)*.14;i&&(a*=.82),r===1&&n===1&&(a=Math.min(1,a*1.08));let o=(n*e+r)*4;t[o]=t[o+1]=t[o+2]=Math.round(a*255),t[o+3]=255}let n=new gi(t,e,e,fe);return n.magFilter=D,n.minFilter=D,n.wrapS=n.wrapT=w,n.colorSpace=nt,n.needsUpdate=!0,n}function Fu(){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.6,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),new ea(e)}var Iu=16,X=(e,t,n)=>Y((e%16+16)%16,(t%16+16)%16,n);function Lu(e){return/moss_stone|mossy/.test(e)?`mossy`:/gravel/.test(e)?`gravel`:/clay/.test(e)?`clay`:/tuff/.test(e)?`tuff`:/sandstone/.test(e)?`sandstone`:/grass|moss/.test(e)?`grass`:/^dirt/.test(e)?`dirt`:/path|trail/.test(e)?`path`:/cobble|road/.test(e)?`cobble`:/plaza|marble|floor/.test(e)?`slab`:/tile/.test(e)?`tile`:/snow/.test(e)?`snow`:/sand/.test(e)?`sand`:/ash|scorch/.test(e)?`ash`:/basalt/.test(e)?`basalt`:/rock|stone/.test(e)?`rock`:/sulfur/.test(e)?`sulfur`:/ice/.test(e)?`ice`:/water/.test(e)?`water`:/lava/.test(e)?`lava`:/bog/.test(e)?`bog`:/void/.test(e)?`void`:/rune/.test(e)?`rune`:/bone/.test(e)?`bone`:`rock`}function Ru(e,t,n){let r=99,i=99,a=0;for(let o=-1;o<=4;o++)for(let s=-1;s<=4;s++){let c=(s%4+4)%4,l=(o%4+4)%4,u=s*4+.5+Y(c,l,n)*3,d=o*4+.5+Y(c,l,n+1)*3,f=Math.hypot((e-u)*1,(t-d)*1.15);f<r?(i=r,r=f,a=l*4+c):f<i&&(i=f)}return[a,i-r]}var zu={grass:e=>(t,n)=>{let r=X(t,n,e),i=r<.1?.8:r<.32?.9:r<.84?1:1.1;return X(t,n+1,e)>.9&&r>.5&&(i=1.12),i*(.96+X(t>>1,n>>1,e+1)*.08)},dirt:e=>(t,n)=>{let r=X(t,n,e),i=.9+X(t>>1,n>>1,e+2)*.12;return r<.1?i=.76:r>.95?i=1.24:r>.9&&(i=1.12),i},path:e=>(t,n)=>{let r=X(t>>1,n>>1,e+3),i=.9+X(t,n,e)*.12;return r>.78?i=(t&1)+(n&1)==2?.86:1.16:X(t,n,e+4)<.08&&(i=.74),i},cobble:e=>(t,n)=>{let[r,i]=Ru(t,n,e);if(i<.9)return .62;let[a]=Ru(t-1,n-1,e),o=.84+Y(r,0,e+5)*.22+X(t,n,e+6)*.06;return a!==r&&(o*=1.1),o},slab:e=>(t,n)=>{if(t===15||n===15)return .72;if(t===0||n===0)return 1.06;let r=.93+X(t,n,e)*.07;return X(t>>2,n>>2,e+7)>.85&&X(t,n,e+8)>.6&&(r*=.9),r},tile:e=>(t,n)=>{let r=t&7,i=n&7;return r===7||i===7?.7:r===0||i===0?1.05:.9+Y(t>>3,n>>3,e+9)*.1+X(t,n,e)*.05},snow:e=>(t,n)=>{let r=X(t,n,e);return r<.08?.92:r>.94?1.03:.97+X(t>>1,n>>1,e+1)*.03},sand:e=>(t,n)=>{let r=X(t,n,e),i=.94+X(t>>1,n,e+1)*.07;return r<.07?i=.86:r>.95&&(i=1.07),i},ash:e=>(t,n)=>{let r=.86+X(t>>1,n,e)*.18;return X(t>>2,n,e+1)>.78&&(r=.74),X(t,n,e+2)>.92&&(r=1.14),r},basalt:e=>(t,n)=>{let r=.86+X(t,n>>2,e)*.16;return(t+(X(0,n>>3,e+1)>.5?2:0))%4==0&&(r*=.84),X(t,n,e+2)>.94&&(r=1.1),r},rock:e=>(t,n)=>{let r=.92+X(t>>1,n,e)*.1;return X(t>>2,n>>1,e+1)>.8&&(r=.8),X(t,n,e+2)>.93&&(r=1.1),r},sulfur:e=>(t,n)=>{let r=X(t,n,e);return r>.86?1.22:r<.12?.8:.92+X(t>>1,n>>1,e+1)*.1},ice:e=>(t,n)=>{let r=.97+X(t,n,e)*.04;return(t+n)%11==0&&(r=1.1),(t-n+32)%13==0&&(r=1.06),r},water:e=>(t,n)=>{let r=.92+X(t,n,e)*.06;return(t+(n>>1)*3+(n&1))%9<2&&(r=1.1),r},lava:e=>(t,n)=>{let r=X(t>>1,n>>1,e);return r>.72?1.22:r<.2?.78:.96+X(t,n,e+1)*.08},bog:e=>(t,n)=>{let r=X(t,n,e);return r<.15?.8:r>.9?1.15:.9+X(t>>1,n>>1,e+1)*.12},void:e=>(t,n)=>.8+X(t,n,e)*.3,rune:e=>(t,n)=>t===7||t===8||n===7||n===8?1.35:.88+X(t,n,e)*.1,bone:e=>(t,n)=>n%5==0?.86:.92+X(t,n,e)*.1,gravel:e=>(t,n)=>{let r=X(t>>1,n>>1,e);if(X(t,n,e+1)<.14)return .6;let i=.76+r*.42;return!(t&1)&&!(n&1)&&(i*=1.07),i},clay:e=>(t,n)=>{let r=.95+X(t>>2,n,e)*.07;return n%6==0&&(r*=.95),X(t,n,e+1)>.95&&(r=1.1),r},tuff:e=>(t,n)=>{let r=X(t,n,e);return r<.09?.7:r>.93?1.14:.92+X(t>>1,n>>1,e+1)*.1},mossy:e=>(t,n)=>{let r=.9+X(t>>1,n,e)*.12;return X(t>>2,n>>1,e+1)>.82&&(r=.78),r},sandstone:e=>(t,n)=>{let r=n>>2;return(n&3)==3?.84:(t+(r&1)*4&7)==7?.88:n&3?.95+X(t,n>>1,e)*.05:1.05}};function Bu(e,t,n,r){return X(e>>2,t>>2,n+9)*.6+X(e>>1,t>>1,n+10)*.4>(r?.42:.55)}var Vu={grass_lush:e=>(t,n)=>{let r=X(t,n,e),i=r<.18?.8:r<.4?.9:r<.86?1:1.08;return X(t,n+1,e+2)>.82&&r>.45&&(i=1.1),i*(.95+X(t>>1,n>>1,e+1)*.08)},grass_sun:e=>(t,n)=>{let r=X(t,n,e),i=r<.08?.86:r<.3?.95:r<.88?1.02:1.12;return X(t,n+1,e+2)>.93&&(i=1.14),i*(.97+X(t>>2,n>>1,e+1)*.06)},grass_dry:e=>(t,n)=>{let r=X(t,n,e),i=r<.06?.74:r<.25?.92:r<.9?1:1.16;return X(t>>1,n,e+3)>.9&&(i=1.2),i*(.95+X(t>>1,n>>1,e+1)*.09)},grass_clover:e=>{let t=zu.grass(e);return(n,r)=>{for(let t=0;t<4;t++){let i=2+Math.floor(Y(t,0,e+7)*12),a=2+Math.floor(Y(t,1,e+7)*12),o=n-i,s=r-a;if(o===0&&s===0)return .86;if(Math.abs(o)===1&&s===0||o===0&&s===-1)return 1.2}return t(n,r)}}},Hu=new Set([`grass`,`snow`,`bog`]),Uu=new Set([`gravel`,`clay`,`tuff`,`mossy`,`sandstone`,`ice`]);function Wu(e,t,n){let r=t.cliff?.[0];return e===`grass`||e===`dirt`||e===`path`||e===`bog`||e===`snow`&&t.snowSoil?[`dirt`,t.soil?.[0]??n.dirt?.[0]??8017462,r??8422538]:e===`snow`||e===`ice`||e===`rock`?[`rock`,r??n.rock?.[0]??8028812,t.soil?.[0]??6186094]:e===`sand`||e===`rune`||e===`void`?[`sandstone`,t.soil?.[0]??t.sandstone?.[0]??12098154,r??10125400]:e===`ash`||e===`basalt`||e===`sulfur`||e===`lava`?[`basalt`,t.soil?.[0]??t.basalt?.[0]??5392974,r??3024950]:[`rock`,r??7829375,r??6974066]}var Gu={dirt:zu.dirt,rock:zu.rock,basalt:zu.basalt,sandstone:e=>(t,n)=>n%8==0?.84:n%8==1?1.04:.92+X(t,n>>1,e)*.06};function Ku(e,t,n){let r=Math.max(1,e.length),i=document.createElement(`canvas`);i.width=r*Iu,i.height=128;let a=i.getContext(`2d`),o=a.createImageData(i.width,i.height),s=new W,c=(e,t,n,r,a,c)=>{s.setHex(a);let l=((t*Iu+r)*i.width+e*Iu+n)*4,u=1+(c-1)*.85;o.data[l]=Math.min(255,s.r*255*u),o.data[l+1]=Math.min(255,s.g*255*u),o.data[l+2]=Math.min(255,s.b*255*u),o.data[l+3]=255};e.forEach((e,r)=>{let i=t[e]??[7829367],a=Lu(e),o=a===`grass`&&Vu[e]||zu[a],[s,l,u]=Wu(a,n,t),d=Uu.has(a)||(a===`rock`||a===`basalt`)&&!!n.selfRock,f=d?new W(i[0]).multiplyScalar(.92).getHex():l,p=d?new W(i[0]).multiplyScalar(.8).getHex():u,m=d?o:Gu[s],h=a===`mossy`?i[i.length-1]:-1,g=a===`mossy`?i.slice(0,-1):i,_=new W;for(let e=0;e<4;e++){let t=o(11+r*7+e*131),n=_.setHex(g[0]).lerp(new W(g[e%g.length]),.45).getHex();for(let i=0;i<Iu;i++)for(let a=0;a<Iu;a++)h>=0&&Bu(a,i,e*13+r,!0)?c(r,e,a,i,h,.9+X(a,i,e+5)*.2):c(r,e,a,i,n,t(a,i))}let v=o(17+r*7),y=m(23+r);for(let e=0;e<Iu;e++){let t=0;Hu.has(a)?(t=3+Math.floor(Y(e,0,29+r)*2.6),Y(e,1,29+r)>.82&&(t+=2)):h>=0?t=1+Math.floor(Y(e,0,31+r)*3):d?t=0:(s===`sandstone`||s===`basalt`)&&(t=a===`sand`||a===`ash`?2:1);for(let n=0;n<Iu;n++)n<t?c(r,4,e,n,h>=0?h:i[0],v(e,n)*(n===t-1?.88:1)):c(r,4,e,n,f,y(e,n)*(n===t?.84:1))}for(let e=0;e<2;e++){let t=m(41+r*3+e*17);for(let n=0;n<Iu;n++)for(let i=0;i<Iu;i++)h>=0&&Bu(i,n,e*7+r,!1)?c(r,5+e,i,n,h,.82+X(i,n,e+3)*.2):c(r,5+e,i,n,f,t(i,n))}let b=(d?o:s===`basalt`?zu.basalt:zu.rock)(53+r);for(let e=0;e<Iu;e++)for(let t=0;t<Iu;t++)c(r,7,t,e,p,b(t,e))}),a.putImageData(o,0,0);let l=new ea(i);return l.magFilter=D,l.minFilter=D,l.generateMipmaps=!1,l.colorSpace=nt,l}var Z={grass:0,tallGrass:1,fern:2,poppy:3,dandelion:4,cornflower:5,bluet:6,tulip:7,deadBush:8,allium:9,mushroom:10,dryGrass:11,daisy:12,shortGrass:13,thickGrass:14,sedge:15,seedGrass:16,clover:17,bush:18,berryBush:19,shrub:20,bushTop:21,berryBushTop:22,shrubTop:23},qu=new Set([3,4,5,6,7,8,9,10,12,19,22]),Ju=new Set([18,19,20]);function Yu(){let e=document.createElement(`canvas`);e.width=384,e.height=Iu;let t=e.getContext(`2d`),n=t.createImageData(384,Iu),r=(e,t,r,i,a=1)=>{if(t<0||r<0||t>15||r>15)return;let o=(r*384+e*Iu+t)*4;n.data[o]=Math.min(255,(i>>16&255)*a),n.data[o+1]=Math.min(255,(i>>8&255)*a),n.data[o+2]=Math.min(255,(i&255)*a),n.data[o+3]=255},i=e=>{let t=Math.round(Math.min(1,e)*255);return t<<16|t<<8|t},a=(e,t,n,a,o)=>{for(let s=0;s<t;s++){let t=1+Math.floor(Y(s,0,o)*14),c=n+Math.floor(Y(s,1,o)*(a-n+1)),l=Y(s,2,o)<.5?-1:1;for(let n=0;n<c;n++){let a=t+(n>c*.6?l:0);r(e,a,15-n,i(.6+n/c*.42+Y(s,n,o+1)*.06))}}},o=(e,t,n,i=5212724)=>{for(let a=n;a<16;a++)r(e,t,a,i,.9+(a&1)*.1)};a(Z.grass,9,3,7,1),a(Z.tallGrass,9,8,14,2);for(let[e,t,n]of[[7,0,12],[4,-1,8],[11,1,9]])for(let a=0;a<n;a++){let o=e+Math.round(a/n*t*3);r(Z.fern,o,15-a,i(.66+a*.025)),a%2==1&&a<n-1&&(r(Z.fern,o-1,15-a,i(.82)),r(Z.fern,o+1,15-a,i(.82)))}a(Z.dryGrass,7,4,9,3);let s=4160044,c=(e,t,n,i)=>{o(e,t,n),r(e,t-1,12,s),r(e,t+1,13,s);for(let[a,o,s]of i)r(e,t+a,n+o,s)},l=14166058,u=10097688,d=16767034,f=14196768,p=4877032,m=8035071,h=16053488,g=16747200,_=14703258;c(Z.poppy,7,7,[[-1,-1,l],[0,-1,l],[1,-1,l],[-1,0,l],[0,0,2759184],[1,0,l],[0,-2,u],[-1,1,u],[1,1,u]]),c(Z.dandelion,8,9,[[-1,-1,d],[0,-1,d],[1,-1,f],[0,-2,d],[0,0,f]]),c(Z.cornflower,7,8,[[-1,-1,p],[0,-2,m],[1,-1,p],[0,-1,2763370],[-1,-2,m],[1,-2,m],[0,0,p]]);for(let[e,t]of[[4,10],[8,8],[12,11]])o(Z.bluet,e,t+1),r(Z.bluet,e,t,16769136),r(Z.bluet,e-1,t,h),r(Z.bluet,e+1,t,h),r(Z.bluet,e,t-1,h);c(Z.tulip,7,7,[[-1,-2,g],[1,-2,g],[-1,-1,g],[0,-1,_],[1,-1,g],[-1,0,_],[0,0,_],[1,0,_],[0,-2,_]]),c(Z.daisy,8,8,[[0,-1,16764992],[-1,-1,h],[1,-1,h],[0,-2,h],[0,0,h],[-2,-1,h],[2,-1,h]]),o(Z.allium,8,6);for(let e=-2;e<=1;e++)for(let t=-2;t<=1;t++)Math.abs(t+.5)+Math.abs(e+.5)<3&&r(Z.allium,8+t,4+e,t+e&1?11819752:9059016);for(let[e,t,n]of[[8,0,10],[8,-1,7],[8,1,8],[8,-2,5],[8,2,6]])for(let i=0;i<n;i++)r(Z.deadBush,e+Math.round(i/n*t*4),15-i,9067050,.85+(i&1)*.15);for(let e=12;e<16;e++)r(Z.mushroom,8,e,15260864);for(let e=-3;e<=3;e++)r(Z.mushroom,8+e,11,10119748,Math.abs(e)===3?.8:1);for(let e=-2;e<=2;e++)r(Z.mushroom,8+e,10,11565648);a(Z.shortGrass,6,2,5,4);for(let e=0;e<16;e++){let t=3+Math.floor(Y(e,0,5)*10),n=5+Math.floor(Y(e,1,5)*7)-Math.abs(t-8)/2,a=Y(e,2,5)<.5?-1:1;for(let o=0;o<n;o++)r(Z.thickGrass,t+(o>n*.55?a:0),15-o,i(.55+o/n*.45+Y(e,o,6)*.06))}for(let[e,t,n]of[[7,13,0],[5,10,-1],[10,11,1],[3,7,-1],[12,8,1]])for(let a=0;a<t;a++){let o=e+Math.round(a/t*n*(a/t)*4),s=i(.58+a/t*.36);r(Z.sedge,o,15-a,s),a<t-2&&r(Z.sedge,o+1,15-a,s,.88)}for(let[e,t]of[[4,13],[8,15],[11,12],[6,9]])for(let n=0;n<t;n++){let a=n>=t-4;r(Z.seedGrass,e+ +(n>t*.7),15-n,i(a?1+(n&1)*.04:.62+n/t*.3)),a&&n&1&&r(Z.seedGrass,e+2,15-n,i(.96))}for(let[e,t]of[[4,11],[9,9],[12,12],[6,13]]){for(let n=t+1;n<16;n++)r(Z.clover,e,n,i(.62));for(let[n,a]of[[-1,0],[1,0],[0,-1],[-1,-1],[1,-1]])r(Z.clover,e+n,t+a,i(a?.98:.88));r(Z.clover,e,t,i(.74))}let v=(e,t,n,a,o,s,c)=>{for(let l=0;l<16;l++)for(let u=0;u<16;u++){if(((u-t)/a)**2+((l-n)/o)**2>1+(Y(u,l,s)-.5)*.5)continue;let d=.62+(1-(l-(n-o))/(2*o))*.3+Y(u,l,s+1)*.12,f=c?c(u,l):i(Math.min(1,d*(Y(u>>1,l>>1,s+2)>.8?1.12:1)));r(e,u,l,f,c?d*1.15:1)}};v(Z.bush,8,9.5,7,6.2,11);for(let[e,t]of[[7,15],[9,15],[8,14]])r(Z.bush,e,t,6965802);let y=[4160044,4885044,3500582];v(Z.berryBush,8,9.5,7,6.2,13,(e,t)=>y[Math.floor(Y(e,t,14)*3)]);for(let e=0;e<9;e++){let t=2+Math.floor(Y(e,0,15)*12),n=5+Math.floor(Y(e,1,15)*9);r(Z.berryBush,t,n,14168122),r(Z.berryBush,t,n-1,16740464)}for(let[e,t,n]of[[8,0,14],[8,-1,11],[8,1,12],[7,-2,8],[9,2,9]])for(let i=0;i<n;i++)r(Z.shrub,e+Math.round(i/n*t*3),15-i,5914662,.85+(i&1)*.15);for(let[e,t,n]of[[8,3,3],[4,6,2.6],[12,5,2.8],[6,10,2.2],[11,9,2.4]])v(Z.shrub,e,t,n,n*.9,17+e);let b=(e,t,n,a)=>{for(let o=0;o<16;o++)for(let s=0;s<16;s++){let c=Math.hypot(s-7.5,o-7.5)/t;if(c>1+(Y(s,o,n)-.5)*.35)continue;let l=.72+(1-c)*.25+Y(s,o,n+1)*.12;a?r(e,s,o,a(s,o),l*1.1):r(e,s,o,i(Math.min(1,l*(Y(s>>1,o>>1,n+2)>.8?1.12:1))))}};b(Z.bushTop,7.4,21),b(Z.berryBushTop,7.4,23,(e,t)=>y[Math.floor(Y(e,t,24)*3)]);for(let e=0;e<8;e++){let t=3+Math.floor(Y(e,0,25)*10),n=3+Math.floor(Y(e,1,25)*10);r(Z.berryBushTop,t,n,14168122)}for(let[e,t,n]of[[5,5,3],[11,6,2.8],[8,11,3.2]])for(let a=0;a<16;a++)for(let o=0;o<16;o++)Math.hypot(o-e,a-t)<n+(Y(o,a,26)-.5)&&r(Z.shrubTop,o,a,i(.76+Y(o,a,27)*.2));t.putImageData(n,0,0);let x=new ea(e);return x.magFilter=D,x.minFilter=D,x.generateMipmaps=!1,x.colorSpace=nt,x}var Xu={id:`training`,name:{ru:`Тренировочная поляна`,en:`Training Meadow`},desc:{ru:`Поле 100 × 100 с тремя манекенами.`,en:`100 × 100 field with three dummies.`},size:100,generator:`meadow`,palette:{sky:10474220,fog:11063496,fogNear:34,fogFar:72,ambient:14085375,ambientIntensity:.6,sun:16773590,sunIntensity:1.2,hemiGround:5929524,tiles:{grass:[6989890,7384390,6595135],grass2:[7910476,8304978],grass_lush:[6463548,6726719,6200378],grass_sun:[8172618,8566863,7909447],grass_dry:[8695372,9089618,8432201],grass_clover:[6793799,7188556,6464579]},blocks:{soil:[10119746],cliff:[9079954]}},music:{root:45,scale:`dorian`,tempo:100,mood:`forest`}},Zu={x:50,z:60},Qu=[{id:`dummy_a`,name:`Манекен А`,x:47.3,z:50},{id:`dummy_b`,name:`Манекен Б`,x:48.7,z:50},{id:`dummy_c`,name:`Манекен В`,x:56,z:50}],$u=4,ed=[[10,30,12,30],[86,68,87,69],[20,84,20,84],[70,12,72,12]];function td(e,t){let n=Nu(e/15,t/15,301),r=Nu(e/9,t/9,302),i=Nu(e/5,t/5,303);return n>.56&&r>.62?`grass_dry`:n<.5&&i>.7?`grass_clover`:n<.36?`grass_lush`:n<.5?`grass`:n<.62?`grass2`:`grass_sun`}var nd={x:51,z:55,r:10,edge:7},rd=(e,t,n)=>{let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)};function id(e,t,n){let r=2.6+(Nu(e/13,t/13,501)-.5)*8+(Mu(e/5,t/5,504)-.5)*1.2,i=Nu(e/24,t/24,502);i<.42&&(r-=(.42-i)*10);let a=1-Math.abs(Mu(e/9,t/9,503)*2-1),o=rd(11,4,Math.min(e,t,n-1-e,n-1-t)),s=rd(17,4,Math.hypot(e-78,t-22));r+=(o*.8+s)*(3.5+a*5.5);let c=rd(nd.r,nd.r+nd.edge,Math.hypot(e-nd.x,t-nd.z));return r=2.5*(1-c)+r*c,Math.max(0,r)}function ad(e,t,n){let r=id(e+.5,t+.5,n),i=id(e+1.5,t+.5,n)-id(e-.5,t+.5,n),a=id(e+.5,t+1.5,n)-id(e+.5,t-.5,n),o=Math.hypot(i,a)*.5,s=o<.32?.25:o<.8?.5:1,c=(Y(e,t,507)-.5)*.5*s;return Math.max(0,Math.round((r+c)/s)*s)}function od(){let e=Xu.size,t=new ku(e);for(let e of Object.keys(Xu.palette.tiles))t.tileId(e);let n=new Float32Array(e*e);for(let r=0;r<e;r++)for(let i=0;i<e;i++){let a=r*e+i;t.tile[a]=t.tileId(td(i,r)),Math.min(i,r,e-1-i,e-1-r)<$u&&(t.cell[a]=J.wall),n[a]=ad(i,r,e)}for(let[t,r,i,a]of ed){let o=n[Math.round((r+a)/2)*e+Math.round((t+i)/2)];for(let s=r-4;s<=a+4;s++)for(let r=t-4;r<=i+4;r++)n[s*e+r]=o;for(let s=r;s<=a;s++)for(let r=t;r<=i;r++)n[s*e+r]=o+1}t.top=n,t.shadeElev=new Uint8Array(e*e);for(let r=0;r<e*e;r++)t.elev[r]=Math.floor(n[r]),t.shadeElev[r]=Math.round(n[r]*4)&255;return t}function sd(e){let t=e.size,n=[],r=(n,r)=>{if(Math.hypot(n-Zu.x,r-Zu.z)<3.5)return!1;for(let e of Qu)if(Math.hypot(n-e.x,r-e.z)<2.2)return!1;for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){let o=Math.floor(n)+a,s=Math.floor(r)+i;if(o<0||s<0||o>=t||s>=t)return!1;let c=s*t+o;if(e.cell[c]!==J.floor||e.centerY(c)!==e.centerY(Math.floor(r)*t+Math.floor(n)))return!1}return!0};for(let e=0;e<t;e++)for(let i=0;i<t;i++){let t=Nu(i/11,e/11,411),a=t>.6?(t-.6)*.9:.004;if(Y(i,e,412)>=a)continue;let o=i+.2+Y(i,e,413)*.6,s=e+.2+Y(i,e,414)*.6;if(!r(o,s))continue;let c=Y(i,e,415),l=c<.58?Z.bush:c<.8?Z.shrub:Z.berryBush;n.push({x:o,z:s,sprite:l,s:.95+Y(i,e,416)*.45})}return n}var cd=`
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}`,ld={plain:0,deep:1,shallow:2,fast:3,fall:4,lake:5,swamp:6,sea:7,frozen:8};function ud(e){let t=/^water_([a-z]+)/.exec(e)?.[1]??``;return t===`sea`?ld.sea:t===`lake`||t===`lagoon`?ld.lake:t===`swamp`?ld.swamp:t===`fast`||t===`mountain`?ld.fast:ld.plain}function dd(e,t){let n=ud(e),r=n===ld.sea?[`sand`,`gravel`]:n===ld.lake?[`sand`,`clay`,`gravel`]:n===ld.swamp?[`clay`,`grass_lush`]:n===ld.fast?[`stone`,`gravel`]:[`gravel`,`sand`];for(let e of r)if(t.includes(e))return e;return t.find(e=>/sand|gravel|stone|dirt/.test(e))??null}var fd=.3;function pd(e,t){let n=e.size,r=new Uint8Array(n*n*4),i=new Uint8Array(n*n),a=e.tileNames.map(ud),o=new Float32Array(n*n);for(let r=0;r<n*n;r++){if(!Eu(e.cell[r]))continue;let i=r%n,a=r/n|0;for(let[s,c]of[[1,0],[-1,0],[0,1],[0,-1]]){let l=i+s,u=a+c;if(l<0||u<0||l>=n||u>=n)continue;let d=u*n+l;Eu(e.cell[d])&&t[d]-t[r]>=fd&&(o[r]=Math.max(o[r],Math.min(1,.45+(t[d]-t[r])*.25)))}}for(let s=0;s<n*n;s++){let n=e.cell[s];if(!Eu(n))continue;let c=e.top?e.top[s]:t[s]-1;r[s*4]=Math.max(1,Math.min(255,Math.round((t[s]-c)*32))),r[s*4+1]=Math.round(o[s]*255);let l=e.flow?e.flow[s]:0;if(l){let e=l/256*Math.PI*2;r[s*4+2]=Math.round(128+Math.cos(e)*127),r[s*4+3]=Math.round(128+Math.sin(e)*127)}else r[s*4+2]=r[s*4+3]=128;i[s]=a[e.tile[s]]+1}for(let e=0;e<n*n;e++)i[e]||(r[e*4+2]=r[e*4+3]=128);let s=new gi(r,n,n,fe);s.magFilter=s.minFilter=A,s.needsUpdate=!0;let c=new gi(i,n,n,L);return c.magFilter=c.minFilter=D,c.needsUpdate=!0,{lin:s,body:c}}var md=`
uniform sampler2D uWLin;
uniform sampler2D uWBody;
float waterDepth(vec2 xz) { return texture2D(uWLin, xz / uSize).r * 255.0 / 32.0; }
`;function hd(e,t,n,r){let i=new Eo({color:16777215,transparent:!0,depthWrite:!1,side:2});return i.onBeforeCompile=i=>{i.uniforms.uTime=e.uTime,i.uniforms.uOrigin=e.uOrigin,i.uniforms.uCells={value:t},i.uniforms.uWLin={value:n.lin},i.uniforms.uWBody={value:n.body},i.uniforms.uSize={value:r},i.vertexShader=i.vertexShader.replace(`#include <common>`,`#include <common>
attribute float aFall;
attribute float aTopY;
attribute float aBotY;
varying vec3 vWPos;
varying vec3 vWN;
varying float vFall;
varying float vTopY;
varying float vBotY;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vWPos = (modelMatrix * vec4(position, 1.0)).xyz;
vWN = normal;
vFall = aFall;
vTopY = aTopY;
vBotY = aBotY;`),i.fragmentShader=i.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vWPos;
varying vec3 vWN;
varying float vFall;
varying float vTopY;
varying float vBotY;
uniform float uTime;
uniform vec2 uOrigin;
uniform sampler2D uCells;
uniform float uSize;
vec3 wEmit = vec3(0.0);
${cd}
${md}
bool dryAt(vec2 c) { return texture2D(uCells, (c + 0.5) / uSize).b < 0.05; }
vec3 lin3(vec3 c) { return pow(c, vec3(2.2)); }
float ripple(vec2 q) { return vnoise(q * 1.7) * 0.62 + vnoise(q * 3.9 + 11.0) * 0.38; }`).replace(`#include <map_fragment>`,`{
  vec3 col;
  float alpha;
  vec3 foamC = vec3(0.9, 0.96, 1.0);
  if (vFall > 1.5) {
    // spray at the foot of a fall: white puffs drifting up and thinning out
    float along = dot(vWPos.xz, vec2(-vWN.z, vWN.x));
    vec2 sp = floor(vec2(along, vWPos.y) * 12.0);
    float hf = clamp((vWPos.y - vBotY) / max(0.1, vTopY - vBotY), 0.0, 1.0);
    float puff = vnoise(sp * 0.33 + vec2(0.0, -uTime * 5.0)) * 0.7 + h21(sp + floor(uTime * 9.0)) * 0.3;
    alpha = smoothstep(0.35, 0.72, puff) * pow(1.0 - hf, 1.3) * 0.85;
    if (alpha < 0.04) discard;
    col = lin3(vec3(0.86, 0.93, 0.98));
    wEmit = col * 0.35;
  } else if (vFall > 0.5) {
    // a falling sheet: lanes of water pouring down at their own speeds, bright streaks, a glassy
    // lip at the top and white foam where it hits the pool
    float along = dot(vWPos.xz, vec2(-vWN.z, vWN.x));
    float lx = floor(along * 16.0);
    float lane = h21(vec2(lx, 3.0));
    float py = floor(vWPos.y * 16.0) / 16.0;
    float spd = 2.4 + lane * 1.6;
    float s = fract(py * 0.7 + uTime * spd * 0.55 + lane * 5.0);
    float n = vnoise(vec2(lx * 0.5, py * 3.0 + uTime * spd * 1.6));
    col = mix(lin3(vec3(0.34, 0.58, 0.74)), lin3(vec3(0.52, 0.74, 0.86)), n);
    col = mix(col, lin3(foamC), smoothstep(0.72, 0.92, s) * 0.75);
    float dt = vTopY - vWPos.y;
    col = mix(col, lin3(vec3(0.7, 0.86, 0.94)), (1.0 - smoothstep(0.0, 0.2, dt)) * 0.5);
    float db = vWPos.y - vBotY;
    float foot = 1.0 - smoothstep(0.0, 0.45, db + (h21(vec2(lx, floor(uTime * 10.0))) - 0.5) * 0.25);
    col = mix(col, lin3(foamC), foot * 0.9);
    alpha = 0.72 + 0.14 * smoothstep(0.72, 0.92, s) + foot * 0.14;
    wEmit = col * 0.15;
  } else {
    vec2 xz = vWPos.xz - uOrigin;
    vec2 cell = floor(xz);
    float body = floor(texture2D(uWBody, (cell + 0.5) / uSize).r * 255.0 + 0.5) - 1.0;
    // the surface is drawn in pixels of 1/16 block, like the blocks around it
    vec2 pq = (floor(xz * 16.0) + 0.5) / 16.0;
    vec4 wl = texture2D(uWLin, pq / uSize);
    float depth = wl.r * 255.0 / 32.0;
    float churn = wl.g;
    vec2 fv = wl.ba * 2.0 - 1.0;
    // per body: colours by the shore and in the depths, opacity range, how fast light fades
    vec3 cS; vec3 cD; float aS; float aD; float absorb; float spd;
    if (body == 7.0) { cS = vec3(0.33, 0.66, 0.68); cD = vec3(0.06, 0.2, 0.42); aS = 0.3; aD = 0.93; absorb = 0.45; spd = 0.22; }
    else if (body == 5.0) { cS = vec3(0.36, 0.62, 0.62); cD = vec3(0.07, 0.23, 0.38); aS = 0.24; aD = 0.9; absorb = 0.62; spd = 0.12; }
    else if (body == 6.0) { cS = vec3(0.34, 0.36, 0.2); cD = vec3(0.2, 0.23, 0.12); aS = 0.6; aD = 0.9; absorb = 2.6; spd = 0.04; }
    else if (body == 3.0) { cS = vec3(0.52, 0.74, 0.8); cD = vec3(0.22, 0.46, 0.62); aS = 0.36; aD = 0.78; absorb = 1.2; spd = 2.6; }
    else { cS = vec3(0.38, 0.64, 0.68); cD = vec3(0.12, 0.34, 0.5); aS = 0.26; aD = 0.82; absorb = 1.0; spd = 0.9; }
    float dk = 1.0 - exp(-depth * absorb);
    col = mix(cS, cD, dk);
    alpha = mix(aS, aD, dk);
    // deep water (lakes and the sea past ~2.5 blocks) darkens further
    float deep = smoothstep(2.0, 4.0, depth) * step(4.5, body);
    col *= 1.0 - deep * 0.25;
    alpha = mix(alpha, 0.95, deep);
    // ripples carried along the flow (two phases cross-faded, so the pattern never stretches);
    // still water drifts slowly
    vec2 dir = length(fv) > 0.25 ? normalize(fv) : vec2(0.8, 0.45);
    float ph = uTime * spd * 0.5;
    float p0 = fract(ph);
    float p1 = fract(ph + 0.5);
    float w0 = 1.0 - abs(1.0 - 2.0 * p0);
    float rp = mix(ripple(pq * 1.4 - dir * p1 * 2.0 + 5.3), ripple(pq * 1.4 - dir * p0 * 2.0), w0);
    // a few flat brightness steps, no glossy highlights
    col *= 0.9 + floor(rp * 4.0) / 4.0 * 0.18;
    if (rp > 0.74) col = mix(col, vec3(0.78, 0.9, 0.95), body == 6.0 ? 0.08 : 0.2);
    // shallow water: the light on the bed shows through in thin bright lines
    float shallow = 1.0 - smoothstep(0.25, 0.6, depth);
    if (body != 6.0) {
      float ca = abs(vnoise(pq * 2.3 + vec2(uTime * 0.35, -uTime * 0.25)) - vnoise(pq * 2.1 - vec2(uTime * 0.3, 0.2 * uTime)));
      col = mix(col, vec3(0.75, 0.9, 0.92), shallow * step(ca, 0.05) * 0.35);
    }
    if (body == 3.0) {
      // rapids: white streaks racing downstream, broken water on the stones
      vec2 side = vec2(-dir.y, dir.x);
      float ln = floor(dot(pq, side) * 16.0);
      float st = fract(dot(pq, dir) * 0.9 - uTime * 1.6 + h21(vec2(ln, 7.0)) * 9.0);
      float sk = smoothstep(0.82, 0.95, st) * (0.5 + 0.5 * step(0.4, h21(vec2(ln, 2.0))));
      col = mix(col, foamC, sk * 0.65);
      alpha = max(alpha, sk * 0.85);
    }
    if (body == 6.0) {
      // swamp: duckweed specks and a slow bubble now and then
      float weed = step(0.8, vnoise(pq * 1.3 + 3.0)) * step(0.45, h21(floor(pq * 16.0)));
      col = mix(col, vec3(0.36, 0.5, 0.16), weed * 0.85);
      alpha = max(alpha, weed * 0.95);
      float bub = step(0.992, h21(floor(pq * 8.0) + floor(uTime * 0.7 + h21(cell) * 5.0)));
      col = mix(col, vec3(0.55, 0.6, 0.4), bub * 0.6);
    }
    // foam along the banks (none on the swamp; a wide slow surf on the sea)
    if (body != 6.0) {
      vec2 lp = fract(pq);
      float ed = 1.0;
      if (dryAt(cell + vec2(-1.0, 0.0))) ed = min(ed, lp.x);
      if (dryAt(cell + vec2(1.0, 0.0))) ed = min(ed, 1.0 - lp.x);
      if (dryAt(cell + vec2(0.0, -1.0))) ed = min(ed, lp.y);
      if (dryAt(cell + vec2(0.0, 1.0))) ed = min(ed, 1.0 - lp.y);
      float sea = body == 7.0 ? 1.0 : 0.0;
      float fw = mix(0.05, 0.13, sea) + mix(0.03, 0.06, sea) * (0.5 + 0.5 * sin(uTime * mix(2.0, 0.9, sea) + (pq.x - pq.y) * 4.0));
      float fm = 0.0;
      if (ed < fw) fm = 0.7;
      else if (ed < fw + 0.08 && h21(floor(pq * 16.0) + floor(uTime * mix(3.0, 1.5, sea))) > 0.62) fm = 0.4;
      col = mix(col, foamC, fm);
      alpha = max(alpha, fm);
    }
    // churning white water where a fall lands
    float ch = churn * smoothstep(0.25, 0.75, vnoise(pq * 3.0 + vec2(uTime * 2.3, -uTime * 1.7)) + churn * 0.3);
    col = mix(col, foamC, ch * 0.85);
    alpha = max(alpha, ch * 0.9);
    col = lin3(col);
    wEmit = col * 0.1;
  }
  diffuseColor.rgb *= col;
  diffuseColor.a *= alpha;
}`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
totalEmissiveRadiance += wEmit;`)},i}function gd(e,t,n,r,i,a){let o=e.size,s=(t,n)=>t>=0&&n>=0&&t<o&&n<o&&Eu(e.cell[n*o+t]),c={pos:[],nor:[],fall:[],topY:[],botY:[],idx:[]},l=(e,t,n,r,i,a,o)=>{let s=c.pos.length/3;c.pos.push(...e);for(let e=0;e<4;e++)c.nor.push(t,n,r),c.fall.push(i),c.topY.push(a),c.botY.push(o);c.idx.push(s,s+2,s+1,s,s+3,s+2)};for(let e=r;e<a;e++){let r=n;for(;r<i;){if(!s(r,e)){r++;continue}let n=t[e*o+r],a=r+1;for(;a<i&&s(a,e)&&t[e*o+a]===n;)a++;l([r,n,e,a,n,e,a,n,e+1,r,n,e+1],0,1,0,0,n,n),r=a}for(let r=n;r<i;r++){if(!s(r,e))continue;let n=t[e*o+r];for(let[i,a]of[[1,0],[-1,0],[0,1],[0,-1]]){if(!s(r+i,e+a))continue;let c=t[(e+a)*o+r+i],u=n-c;if(u<fd)continue;let d=i>0?r+1:i<0?r:null,f=a>0?e+1:a<0?e:null,p=Math.min(.35,.06+u*.06),m=d===null?[r,f+a*.02,r+1,f+a*.02]:[d+i*.02,e,d+i*.02,e+1],h=d===null?[r,f+a*p,r+1,f+a*p]:[d+i*p,e,d+i*p,e+1];if(l([m[0],n,m[1],m[2],n,m[3],h[2],c-.05,h[3],h[0],c-.05,h[1]],i,0,a,1,n,c),u>=1.2){let e=(h[0]+h[2])/2+i*.45,t=(h[1]+h[3])/2+a*.45,n=Math.min(2.4,.6+u*.35),r=.85;l([e-r,c,t-r*.3,e+r,c,t+r*.3,e+r,c+n,t+r*.3,e-r,c+n,t-r*.3],-.3,0,1,2,c+n,c),l([e-r*.3,c,t+r,e+r*.3,c,t-r,e+r*.3,c+n,t-r,e-r*.3,c+n,t+r],1,0,.3,2,c+n,c)}}}}if(!c.idx.length)return null;let u=new jr;return u.setAttribute(`position`,new G(c.pos,3)),u.setAttribute(`normal`,new G(c.nor,3)),u.setAttribute(`aFall`,new G(c.fall,1)),u.setAttribute(`aTopY`,new G(c.topY,1)),u.setAttribute(`aBotY`,new G(c.botY,1)),u.setIndex(c.idx),u.computeBoundingSphere(),u}var _d=32,vd=new H,yd=new H,bd=new H,xd=-14;function Sd(e){return/water/.test(e)?1:/lava/.test(e)?2:/bog/.test(e)?3:/void/.test(e)?4:/rune/.test(e)?5:/ice/.test(e)?6:0}function Cd(e){let t=/^water_([a-z]+)_(\d)$/.exec(e),n=t?.[1]??``;return{kind:n===`swamp`?1:n===`fast`||n===`mountain`?2:n===`sea`?3:n===`lake`||n===`lagoon`?4:0,depth:t?Number(t[2]):0}}function wd(e){return/void/.test(e)?-6:/lava/.test(e)?-.5:-.62}var Td=[[Z.poppy,3],[Z.dandelion,3],[Z.cornflower,2],[Z.bluet,3],[Z.tulip,1.5],[Z.daisy,2.5],[Z.allium,1]],Ed=[[Z.grass,40],[Z.tallGrass,16],[Z.shortGrass,9],[Z.thickGrass,6],[Z.seedGrass,4],[Z.fern,5],[Z.sedge,3],...Td],Dd=[[Z.grass,70],[Z.tallGrass,20],[Z.fern,10]],Od={grass:{density:1.7,sprites:Ed},grass2:{density:1.6,sprites:[[Z.grass,38],[Z.shortGrass,16],[Z.tallGrass,12],[Z.seedGrass,6],[Z.thickGrass,4],...Td]},grass_lush:{density:2.3,sprites:[[Z.grass,28],[Z.tallGrass,24],[Z.thickGrass,16],[Z.fern,10],[Z.sedge,9],[Z.seedGrass,4],[Z.cornflower,1],[Z.allium,1]]},grass_sun:{density:1.45,sprites:[[Z.shortGrass,30],[Z.grass,28],[Z.seedGrass,10],[Z.tallGrass,6],...Td,...Td]},grass_dry:{density:1.05,sprites:[[Z.dryGrass,30],[Z.shortGrass,28],[Z.grass,14],[Z.seedGrass,12],[Z.dandelion,2],[Z.deadBush,1]]},grass_clover:{density:1.6,sprites:[[Z.clover,40],[Z.shortGrass,24],[Z.grass,18],[Z.bluet,3],[Z.daisy,4]]}},kd={[Z.shortGrass]:.8,[Z.clover]:.75,[Z.seedGrass]:1.18,[Z.sedge]:1.08,[Z.thickGrass]:1.05},Ad=8,jd=1.6,Md=[[Z.bush,6],[Z.berryBush,1]],Nd={grass:{...Od.grass,bush:.02,bushes:Md},grass2:{...Od.grass2,bush:.015,bushes:Md},grass_lush:{...Od.grass_lush,bush:.03,bushes:Md},grass_sun:{...Od.grass_sun,bush:.01,bushes:[[Z.bush,2],[Z.shrub,1]]},grass_dry:{...Od.grass_dry,density:.9,bush:.025,bushes:[[Z.shrub,4],[Z.deadBush,1]]},grass_clover:Od.grass_clover,grass_cold:{density:1.5,sprites:[[Z.grass,36],[Z.tallGrass,18],[Z.fern,14],[Z.shortGrass,10],[Z.sedge,6],[Z.bluet,1]],bush:.015,bushes:Md},snow:{density:.2,sprites:[[Z.dryGrass,2],[Z.shortGrass,1]],tint:12108984},sand:{density:.05,sprites:[[Z.dryGrass,3],[Z.deadBush,1]]},sandstone:{density:.02,sprites:[[Z.deadBush,1]]},gravel:{density:.25,sprites:[[Z.shortGrass,3],[Z.dryGrass,1]],tint:9087072},clay:{density:.6,sprites:Dd,tint:6987840},moss_stone:{density:.5,sprites:[[Z.fern,2],[Z.shortGrass,2],[Z.grass,1]],tint:6199866},tuff:{density:.08,sprites:[[Z.dryGrass,1]],tint:10133600},stone:{density:.06,sprites:[[Z.shortGrass,1]],tint:8034896}};function Pd(e,t){let n=/grass/.test(t);if(e===`wild`)return Nd[t]??null;if(e===`meadow`){if(Od[t])return Od[t];if(n)return{density:1.7,sprites:Ed};if(/bank/.test(t))return{density:.7,sprites:Dd};if(/sand/.test(t))return{density:.06,sprites:Dd}}else if(n)return{density:1,sprites:Dd};return null}function Fd(e,t){let n=0;for(let[,t]of e)n+=t;let r=t*n;for(let[t,n]of e)if(r-=n,r<=0)return t;return e[e.length-1][0]}var Id=class{constructor(e,t,n,r,i=e.size>420){m(this,`group`,new di),m(this,`uniforms`,{uTime:{value:0},uSurge:{value:0},uFocus:{value:new H(0,0,9999)},uCamDir:{value:new V(Math.SQRT1_2,Math.SQRT1_2)},uNight:{value:0},uOrigin:{value:new V(0,0)},uOcc:{value:0},uHeroNdc:{value:new V},uHeroDist:{value:0},uOccR:{value:new V(.1,.1)},uHeroFeet:{value:new H}}),m(this,`ghostMats`,[]),m(this,`ghosts`,[]),m(this,`flora`,{uTrail:{value:Array.from({length:Ad},()=>new Ut(0,0,0,0))}}),m(this,`trailNext`,1),m(this,`trailLife`,new Float32Array(Ad)),m(this,`trailK`,new Float32Array(Ad)),m(this,`trailLast`,[-99,-99]),m(this,`ox`,void 0),m(this,`oz`,void 0),m(this,`disposables`,[]),m(this,`chunks`,[]),m(this,`level`,void 0),m(this,`lazy`,void 0),m(this,`slots`,[]),m(this,`cur`,null),m(this,`stats`,{built:0,freed:0,live:0}),this.lazy=i,this.ox=e.ox,this.oz=e.oz,this.group.position.set(this.ox,0,this.oz),this.uniforms.uOrigin.value.set(this.ox,this.oz),this.level=this.computeLevels(e),this.buildGround(e,t,r),this.buildFoliage(e,t,r)}defer(e,t,n){this.lazy?this.slots.push({x:e,z:t,build:n,objs:null}):n()}place(e,t,n){this.group.add(e),this.cur?this.cur.push(e):(this.disposables.push(e.geometry),e instanceof Ti&&this.disposables.push(e),this.chunks.push({mesh:e,x:t,z:n}))}computeLevels(e){let t=e.size,n=new Float32Array(t*t);for(let r=0;r<t*t;r++)Eu(e.cell[r])?n[r]=e.elev[r]+wd(e.tileNames[e.tile[r]]??``):n[r]=e.top?e.top[r]:e.elev[r];return n}buildGround(e,t,n){let r=e.size,i=this.level,a=new Uint8Array(r*r),o=new Int32Array(r*r),s=0,c=0,l=t=>Eu(e.cell[t]);for(let e=0;e<r*r;e++)if(l(e)){let t=e%r,n=e/r|0,i=(e,t)=>e>=0&&t>=0&&e<r&&t<r&&!l(t*r+e);(i(t+1,n)||i(t-1,n)||i(t,n+1)||i(t,n-1))&&(a[e]=1,o[c++]=e)}for(;s<c;){let e=o[s++];if(a[e]>=5)continue;let t=e%r,n=e/r|0;for(let[i,s]of[[1,0],[-1,0],[0,1],[0,-1]]){let u=t+i,d=n+s;if(u<0||d<0||u>=r||d>=r)continue;let f=d*r+u;l(f)&&!a[f]&&(a[f]=a[e]+1,o[c++]=f)}}let u=new Uint8Array(r*r*4);for(let t=0;t<r*r;t++){let n=t%r,i=t/r|0;u[t*4]=e.tile[t],u[t*4+1]=Math.floor(Y(n+e.ox,i+e.oz,5)*4),u[t*4+2]=l(t)?40*Math.max(1,a[t]||5):0,u[t*4+3]=e.shadeElev?e.shadeElev[t]:Math.min(255,e.elev[t]*16)}let d=new gi(u,r,r,fe);d.magFilter=d.minFilter=D,d.needsUpdate=!0;let f=new Float32Array(r*r),p=e.corner||e.top;for(let t=0;t<r*r;t++){let n=e.cell[t];f[t]=p?e.centerY(t):e.elev[t],(n===J.solid||n===J.wall)&&(f[t]+=e.height[t]?Math.min(2,e.height[t]):0)}let m=new Uint8Array(r*r*4);for(let e=0;e<r;e++)for(let t=0;t<r;t++){let n=e*r+t,i=f[n],a=0;for(let n=-2;n<=2;n++)for(let o=-2;o<=2;o++){if(!o&&!n)continue;let s=Math.min(r-1,Math.max(0,t+o)),c=Math.min(r-1,Math.max(0,e+n)),l=Math.abs(o)<=1&&Math.abs(n)<=1?1:.45;a+=Math.min(2.2,Math.max(0,f[c*r+s]-i-(p?.45*Math.max(Math.abs(o),Math.abs(n)):0)))*l}let o=Math.round(255*(1-Math.min(.5,a/15.2*.75)));m[n*4]=m[n*4+1]=m[n*4+2]=o,m[n*4+3]=255}let h=new gi(m,r,r,fe);h.magFilter=h.minFilter=A,h.needsUpdate=!0;let g=Ku(e.tileNames,t.palette.tiles,t.palette.blocks??{}),_=Math.max(1,e.tileNames.length),v=new Uint8Array(_*8);e.tileNames.forEach((t,n)=>{let r=Cd(t);v[n*4]=Sd(t),v[n*4+1]=r.kind,v[n*4+2]=r.depth,v[n*4+3]=/grass|moss/.test(t)?255:0;let i=/water/.test(t)?dd(t,e.tileNames):null;v[(_+n)*4]=i?e.tileNames.indexOf(i):n});let y=new gi(v,_,2,fe);y.magFilter=y.minFilter=D,y.needsUpdate=!0;let b=!!e.top,x=pd(e,i),S=hd(this.uniforms,d,x,r);this.disposables.push(x.lin,x.body,S);let C=this.uniforms,w=e=>t=>{t.uniforms.uOcc=C.uOcc,t.uniforms.uHeroNdc=C.uHeroNdc,t.uniforms.uHeroDist=C.uHeroDist,t.uniforms.uOccR=C.uOccR,t.uniforms.uHeroFeet=C.uHeroFeet,t.uniforms.uCells={value:d},t.uniforms.uWLin={value:x.lin},t.uniforms.uWBody={value:x.body},t.uniforms.uBeds={value:+!!b},t.uniforms.uAtlas={value:g},t.uniforms.uAO={value:h},t.uniforms.uTime=C.uTime,t.uniforms.uSurge=C.uSurge,t.uniforms.uFocus=C.uFocus,t.uniforms.uOrigin=C.uOrigin,t.uniforms.uCamDir=C.uCamDir,t.uniforms.uInfo={value:y},t.uniforms.uSize={value:r},t.uniforms.uTiles={value:_},t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
attribute float aTop;
attribute float aSide;
varying vec4 vClip;
varying vec3 vWPos;
varying vec3 vN;
varying float vTop;
varying float vSide;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vWPos = (modelMatrix * vec4(position, 1.0)).xyz;
vN = normal;
vTop = aTop;
vSide = aSide;`).replace(`#include <project_vertex>`,`#include <project_vertex>
vClip = gl_Position;`),t.fragmentShader=`#define OCC_MODE ${e}\n`+t.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uOcc;
uniform vec2 uHeroNdc;
uniform float uHeroDist;
uniform vec2 uOccR;
uniform vec3 uHeroFeet;
varying vec4 vClip;
varying vec3 vWPos;
varying vec3 vN;
varying float vTop;
varying float vSide;
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform sampler2D uAO;
uniform float uTime;
uniform float uSurge;
uniform vec3 uFocus;
uniform vec2 uOrigin;
uniform vec2 uCamDir;
uniform sampler2D uInfo;
uniform float uSize;
uniform float uTiles;
uniform float uBeds;
vec3 gEmit = vec3(0.0);
${cd}
${md}
vec4 cellAt(vec2 c) { return texture2D(uCells, (c + 0.5) / uSize); }
vec3 atlasAt(float tile, float row, vec2 l) {
  l = clamp(l, 0.001, 0.999);
  return texture2D(uAtlas, vec2((tile + l.x) / uTiles, 1.0 - (row + l.y) / ${8 .toFixed(1)})).rgb;
}
vec3 infoOf(float tile) { return floor(texture2D(uInfo, vec2((tile + 0.5) / uTiles, 0.25)).rgb * 255.0 + 0.5); }
float animOf(float tile) { return infoOf(tile).r; }
float bedOf(float tile) { return floor(texture2D(uInfo, vec2((tile + 0.5) / uTiles, 0.75)).r * 255.0 + 0.5); }
bool grassOf(float tile) { return texture2D(uInfo, vec2((tile + 0.5) / uTiles, 0.25)).a > 0.5; }
float tileOf(vec4 c) { return floor(c.r * 255.0 + 0.5); }
bool isLand(vec2 c) { return cellAt(c).b < 0.05; }`).replace(`#include <map_fragment>`,`{
  // the window around the hero: ground nearer to the camera than the hero, over it on screen
  float occK = 0.0;
  if (uOcc > 0.001) {
    vec2 dd = (vClip.xy / vClip.w - uHeroNdc) / uOccR;
    // only what rises above the line from the camera down to the hero's feet stands in the way
    vec2 sxz = uHeroFeet.xz - cameraPosition.xz;
    float tl = clamp(dot(vWPos.xz - cameraPosition.xz, sxz) / max(dot(sxz, sxz), 1e-4), 0.0, 1.0);
    float lineY = mix(cameraPosition.y, uHeroFeet.y, tl);
    if (vClip.w < uHeroDist - 0.9 && vWPos.y > lineY - 0.05) occK = uOcc * (1.0 - smoothstep(0.7, 1.0, length(dd)));
  }
#if OCC_MODE == 0
  if (occK > 0.01) discard;
#else
  if (occK <= 0.01) discard;
#endif
  bool side = vSide > 0.5;
  vec2 xz = (side ? vWPos.xz - vN.xz * 0.05 : vWPos.xz) - uOrigin;
  vec2 cell = floor(xz);
  vec4 cd = cellAt(cell);
  bool liquid = cd.b > 0.05;
  vec2 pxc = (floor(xz * 32.0) + 0.5) / 32.0;
  float tile = tileOf(cd);
  float variant = floor(cd.g * 255.0 + 0.5);
  float anim = animOf(tile);
  vec2 local = fract(xz);
  vec3 col;
  float elev = cd.a * 255.0 / 16.0;
  // under water: the bed's own ground (sand, gravel, mud), the water is drawn over it
  bool bedCell = liquid && anim == 1.0 && uBeds > 0.5;
  if (bedCell) tile = bedOf(tile);
  if (side) {
    // cliff face: block-aligned rim (top layer hanging over), soil, then stone deeper down
    float along = dot(vWPos.xz, vec2(-vN.z, vN.x));
    float d = max(0.0, vTop - vWPos.y);
    vec2 sb = vec2(along, d) * 2.0;
    vec2 bk = floor(sb);
    vec2 sl = fract(sb);
    float hb = h21(bk + cell * 3.7);
    if (hb > 0.5) sl.x = 1.0 - sl.x;
    float row;
    if (bk.y < 0.5) row = ${4 .toFixed(1)};
    else row = h21(bk * 1.31 + cell) < smoothstep(0.3, 1.6, d) ? ${7 .toFixed(1)} : ${5 .toFixed(1)} + step(0.5, hb);
    col = atlasAt(tile, row, sl);
    col *= 0.94 + h21(bk + 17.0) * 0.08;
    col *= mix(1.0, 0.72, clamp(d / 6.0, 0.0, 1.0));
    col *= 0.8 + 0.2 * smoothstep(-0.2, 0.9, vWPos.y);
    // the earth of the terrace sides stays readable in the shade of its own step
    gEmit = col * 0.4;
    if (anim == 4.0) col = mix(col, vec3(0.12, 0.06, 0.25), clamp(d / 4.0, 0.0, 1.0));
    if (bedCell) col *= 0.8;
  } else if (bedCell) {
    vec2 bp = xz * 2.0;
    vec2 blk = floor(bp);
    vec2 l = fract(bp);
    if (h21(blk + 5.0) > 0.5) l.x = 1.0 - l.x;
    col = atlasAt(tile, floor(h21(blk * 1.37 + tile) * ${4 .toFixed(1)}), l) * 0.8;
    float dep = waterDepth(pxc);
    col *= 1.0 - clamp(dep * 0.1, 0.0, 0.3);
    col *= 0.94 + vnoise(xz * 0.4) * 0.12;
    // sunlight dancing on a shallow bed
    float ca = abs(vnoise(pxc * 2.3 + vec2(uTime * 0.35, -uTime * 0.25)) - vnoise(pxc * 2.1 - vec2(uTime * 0.3, uTime * 0.2)));
    gEmit = vec3(0.55, 0.7, 0.75) * step(ca, 0.06) * 0.22 * (1.0 - smoothstep(0.3, 1.5, dep));
  } else if (liquid) {
    float shore = cd.b * 255.0 / 40.0;
    float ed = 1.0;
    vec2 lp = fract(pxc);
    if (isLand(cell + vec2(-1.0, 0.0))) ed = min(ed, lp.x);
    if (isLand(cell + vec2(1.0, 0.0))) ed = min(ed, 1.0 - lp.x);
    if (isLand(cell + vec2(0.0, -1.0))) ed = min(ed, lp.y);
    if (isLand(cell + vec2(0.0, 1.0))) ed = min(ed, 1.0 - lp.y);
    vec3 tinfo = infoOf(tile);
    float wk = tinfo.g;
    float wd = tinfo.b;
    float depth = clamp((shore - 1.0 + ed) / 2.5, 0.0, 1.0);
    // explicit depth level from the tile name: 1 light .. 5 dark, still lighter right at the bank
    if (wd > 0.5) depth = clamp((wd - 1.0) / 4.0, 0.0, 1.0) * (0.55 + 0.45 * smoothstep(0.0, 0.5, ed + (shore - 1.0)));
    // churning foam at the foot of a waterfall (a neighbouring water cell high above)
    float fallEd = 1.0;
    if (cellAt(cell + vec2(-1.0, 0.0)).a > cd.a + 0.05) fallEd = min(fallEd, lp.x);
    if (cellAt(cell + vec2(1.0, 0.0)).a > cd.a + 0.05) fallEd = min(fallEd, 1.0 - lp.x);
    if (cellAt(cell + vec2(0.0, -1.0)).a > cd.a + 0.05) fallEd = min(fallEd, lp.y);
    if (cellAt(cell + vec2(0.0, 1.0)).a > cd.a + 0.05) fallEd = min(fallEd, 1.0 - lp.y);
    vec2 bp = xz * 2.0;
    vec2 flow = fract(bp);
    // flow speed per water kind: swamp creeps, rapids rush, lakes and the sea barely drift
    float fs = anim == 2.0 ? 5.0 : wk == 1.0 ? 2.0 : wk == 2.0 ? 16.0 : wk == 3.0 ? 3.0 : wk == 4.0 ? 4.0 : 9.0;
    if (anim == 1.0 || anim == 2.0) flow = fract(bp + vec2(floor(uTime * fs) / 16.0, 0.0));
    vec3 base = atlasAt(tile, mod(variant + floor(h21(floor(bp)) * 2.0), 4.0), flow);
    if (anim == 1.0) {
      col = wd > 0.5 ? base * (1.12 - 0.22 * depth) : mix(base * 1.15, base * 0.62, depth);
      float rip = sin((pxc.x + pxc.y) * 5.0 + uTime * 1.4 + vnoise(pxc * 1.7) * 6.0);
      if (rip > (wk == 2.0 ? 0.9 : 0.975)) col += vec3(0.09, 0.11, 0.13);
      if (wk == 2.0) {
        // rapids: bright streaks racing downstream
        float sl = fract(pxc.x * 1.3 + uTime * 1.9 + h21(vec2(floor(pxc.y * 16.0), 5.0)) * 7.0);
        if (sl > 0.86) col = mix(col, vec3(0.86, 0.94, 1.0), 0.55);
      }
      if (wk != 1.0) {
        // swamp water has no foam; the sea has a wide, slow surf band
        float sea = wk == 3.0 ? 1.0 : 0.0;
        float foamW = mix(0.06, 0.15, sea) + mix(0.04, 0.06, sea) * (0.5 + 0.5 * sin(uTime * mix(2.2, 0.9, sea) + (pxc.x - pxc.y) * 4.0));
        if (ed < foamW) col = mix(col, vec3(0.9, 0.96, 1.0), 0.75);
        else if (ed < foamW + 0.07 && h21(floor(pxc * 16.0) + floor(uTime * mix(3.0, 1.5, sea))) > 0.6) col = mix(col, vec3(0.85, 0.92, 1.0), 0.4);
      }
      float churn = (1.0 - smoothstep(0.0, 1.6, fallEd + h21(floor(pxc * 16.0) + floor(uTime * 8.0)) * 0.9));
      col = mix(col, vec3(0.92, 0.97, 1.0), churn * 0.9);
      gEmit = col * 0.16;
    } else if (anim == 2.0) {
      col = base * (1.0 - depth * 0.15);
      if (ed < 0.1) col = vec3(0.25, 0.08, 0.04);
      float glow = 0.8 + 0.2 * sin(uTime * 2.0 + cell.x * 0.7 + cell.y * 0.4);
      gEmit = col * glow * (ed < 0.1 ? 0.2 : 1.0);
    } else if (anim == 4.0) {
      col = base * 0.6;
      float star = step(0.985, h21(floor(pxc * 16.0) + floor(uTime * 2.0)));
      gEmit = vec3(0.35, 0.15, 0.8) * star + base * 0.25;
    } else {
      col = mix(base, base * 0.6, depth);
      gEmit = col * 0.1;
    }
  } else {
    // ground top: one 16px texture per half-unit block, ragged pixel borders between tiles
    vec2 bp = xz * 2.0;
    vec2 blk = floor(bp);
    vec2 l = fract(bp);
    float ut = tile;
    vec2 clump = floor(xz * 16.0);
    float W = 0.22;
    float ex = min(local.x, 1.0 - local.x);
    float ez = min(local.y, 1.0 - local.y);
    vec4 nx = cellAt(cell + vec2(local.x < 0.5 ? -1.0 : 1.0, 0.0));
    vec4 nz = cellAt(cell + vec2(0.0, local.y < 0.5 ? -1.0 : 1.0));
    float tx = tileOf(nx);
    float tz = tileOf(nz);
    // two meadow grounds meet in a wide colour blend (stepped per texture pixel, a little noisy)
    // instead of a ragged seam; other neighbours keep the ragged pixel border
    bool gMe = grassOf(tile);
    vec2 lq = fract(pxc);
    float qx = min(lq.x, 1.0 - lq.x);
    float qz = min(lq.y, 1.0 - lq.y);
    float jit = (h21(clump + 13.7) - 0.5) * 0.16;
    float wx = (gMe && tx != tile && nx.b < 0.05 && abs(nx.a - cd.a) < 0.01 && grassOf(tx)) ? clamp(0.5 * (1.0 - qx / 0.5) + jit, 0.0, 0.5) : 0.0;
    float wz = (gMe && tz != tile && nz.b < 0.05 && abs(nz.a - cd.a) < 0.01 && grassOf(tz)) ? clamp(0.5 * (1.0 - qz / 0.5) + jit, 0.0, 0.5) : 0.0;
    if (wx == 0.0 && tx != tile && nx.b < 0.05 && abs(nx.a - cd.a) < 0.01 && ex < W && !(gMe && grassOf(tx)) && h21(clump + 3.1) < 0.55 * (1.0 - ex / W)) ut = tx;
    else if (wz == 0.0 && tz != tile && nz.b < 0.05 && abs(nz.a - cd.a) < 0.01 && ez < W && !(gMe && grassOf(tz)) && h21(clump + 7.3) < 0.55 * (1.0 - ez / W)) ut = tz;
    float bh = h21(blk * 1.37 + ut);
    float v = floor(bh * ${4 .toFixed(1)});
    if (h21(blk + 5.0) > 0.5) l.x = 1.0 - l.x;
    float ua = animOf(ut);
    if (ua > 0.5 && ua < 4.5) {
      float sp = ua == 2.0 ? 2.0 : 3.0;
      l = fract(l + vec2(floor(uTime * sp) / 16.0, floor(uTime * sp * 0.5) / 16.0));
    }
    col = atlasAt(ut, v, l);
    if (wx > 0.0) col = mix(col, atlasAt(tx, floor(h21(blk * 1.37 + tx) * ${4 .toFixed(1)}), l), wx);
    if (wz > 0.0) col = mix(col, atlasAt(tz, floor(h21(blk * 1.37 + tz) * ${4 .toFixed(1)}), l), wz);
    // slopes: worn earth where the ground tilts, bare stone where it is steep (pixel-dithered)
    float tilt = 1.0 - normalize(vN).y;
    float dith = h21(clump + 23.0);
    if (!liquid && ua < 0.5) {
      if (dith < smoothstep(0.1, 0.2, tilt) * 0.85) col = atlasAt(ut, ${5 .toFixed(1)} + step(0.5, bh), l);
      if (dith < smoothstep(0.24, 0.36, tilt)) col = atlasAt(ut, ${7 .toFixed(1)}, l);
    }
    col *= 0.97 + h21(blk + 11.0) * 0.05;
    // broad painted patches of lighter and darker ground
    float m = vnoise(xz * 0.07) * 0.6 + vnoise(xz * 0.23) * 0.4;
    col *= 0.9 + m * 0.2;
    col *= texture2D(uAO, xz / uSize).r;
    float spark = step(0.985, h21(floor(pxc * 16.0) + cell * 17.0 + floor(uTime * 2.0)));
    if (ua == 2.0) gEmit = col * (0.85 + 0.15 * sin(uTime * 2.0 + cell.x * 0.7)) + vec3(1.0, 0.8, 0.3) * spark * 0.6;
    if (ua == 3.0) {
      float bub = step(0.965, h21(floor(pxc * 8.0) + cell * 5.0 + floor(uTime * 0.8 + h21(cell) * 4.0)));
      col = mix(col, col * 1.35 + vec3(0.05, 0.12, 0.0), bub);
      gEmit = col * 0.22 + vec3(0.3, 0.55, 0.15) * bub * 0.15;
    }
    if (ua == 5.0) gEmit = col * (0.5 + 0.5 * sin(uTime * 3.0)) * (0.6 + uSurge * 1.5);
    if (ua == 6.0) {
      // frozen water: dark water seen through clear patches, white cracks, trapped bubbles
      float clear = smoothstep(0.55, 0.75, vnoise(xz * 0.35 + 4.0));
      col = mix(col, col * vec3(0.5, 0.66, 0.86), clear * 0.65);
      float cr = abs(vnoise(pxc * 1.3 + 9.0) - 0.5);
      if (cr < 0.022) col = mix(col, vec3(0.95, 0.98, 1.0), 0.75);
      col = mix(col, vec3(0.92, 0.96, 1.0), step(0.986, h21(floor(pxc * 16.0) + 3.0)) * 0.6);
      gEmit = vec3(0.8, 0.95, 1.0) * spark * 0.3;
    }
  }
  diffuseColor.rgb *= col;
#if OCC_MODE == 2
  diffuseColor.a = 1.0 - occK * 0.68;
#endif
}`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
totalEmissiveRadiance += gEmit;`)},T=new Eo({color:16777215});T.onBeforeCompile=w(0),T.customProgramCacheKey=()=>`ground0`;let E=new Eo({colorWrite:!1,transparent:!0});E.onBeforeCompile=w(1),E.customProgramCacheKey=()=>`ground1`;let O=new Eo({color:16777215,transparent:!0,depthWrite:!1});O.onBeforeCompile=w(2),O.customProgramCacheKey=()=>`ground2`,this.ghostMats=[E,O],this.disposables.push(T,E,O,d,g,h);let k=Math.ceil(r/_d),j=e.corner,ee=t=>Eu(e.cell[t]),te=(t,n,a)=>{if(t<0||n<0||t>=r||n>=r)return e.shadeElev?te(Math.max(0,Math.min(r-1,t)),Math.max(0,Math.min(r-1,n)),a)-6:xd;let o=n*r+t;return ee(o)?b?e.top[o]:i[o]:j?j[o*4+a]:e.top?e.top[o]:i[o]},M=new Float32Array(r*r*2);if(j)for(let e=0;e<r*r;e++)ee(e)||(M[e*2]=(j[e*4+1]-j[e*4]+j[e*4+3]-j[e*4+2])*.5,M[e*2+1]=(j[e*4+2]-j[e*4]+j[e*4+3]-j[e*4+1])*.5);let N=(e,t,n,i)=>{let a=te(e,t,n),o=e+(n&1),s=t+(n>>1),c=0,l=0,u=0;for(let e=0;e<4;e++){let t=o-1+(e&1),n=s-1+(e>>1);if(t<0||n<0||t>=r||n>=r)continue;let i=n*r+t;ee(i)||Math.abs(te(t,n,3-e)-a)>.001||(c+=M[i*2],l+=M[i*2+1],u++)}u&&(c/=u,l/=u);let d=Math.hypot(c,1,l);i.push(-c/d,1/d,-l/d)},P=n!==`low`;for(let t=0;t<k;t++)for(let n=0;n<k;n++)this.defer((n+.5)*_d,(t+.5)*_d,()=>{let a=[0,1].map(()=>({pos:[],nor:[],top:[],side:[],idx:[]})),o=[],s=(e,t,n)=>{let r=a[+!!n],i=r.pos.length/3;r.pos.push(...e),r.nor.push(...t);for(let t=0;t<4;t++)r.top.push(e[t*3+1]),r.side.push(0);Math.abs(e[1]-e[7])<=Math.abs(e[4]-e[10])?r.idx.push(i,i+2,i+1,i,i+3,i+2):r.idx.push(i,i+3,i+1,i+1,i+3,i+2)},c=(e,t,n,r,i)=>{let o=a[1],s=o.pos.length/3;o.pos.push(...e);for(let e=0;e<4;e++)o.nor.push(t,0,n),o.side.push(1);o.top.push(r,i,i,r);let c=e[3]-e[0],l=e[4]-e[1],u=e[5]-e[2],d=e[6]-e[0],f=e[7]-e[1],p=l*(e[8]-e[2])-u*f,m=c*f-l*d;p*t+m*n>=0?o.idx.push(s,s+1,s+2,s,s+2,s+3):o.idx.push(s,s+2,s+1,s,s+3,s+2)},l=n*_d,u=t*_d,d=Math.min(r,l+_d),f=Math.min(r,u+_d),p=(e,t)=>{let n=te(e,t,0);return te(e,t,1)===n&&te(e,t,2)===n&&te(e,t,3)===n?n:NaN};for(let e=u;e<f;e++){let t=l;for(;t<d;){let n=p(t,e);if(!Number.isNaN(n)){let r=t+1;for(;r<d&&p(r,e)===n;)r++;s([t,n,e,r,n,e,r,n,e+1,t,n,e+1],[0,1,0,0,1,0,0,1,0,0,1,0],n>.01),t=r;continue}o.length=0,N(t,e,0,o),N(t,e,1,o),N(t,e,3,o),N(t,e,2,o);let r=te(t,e,0),i=te(t,e,1),a=te(t,e,3),c=te(t,e,2);s([t,r,e,t+1,i,e,t+1,a,e+1,t,c,e+1],o.slice(),Math.max(r,i,a,c)>.01),t++}for(let t=l;t<d;t++){let n=[[1,0,1,3,0,2,[t+1,e,t+1,e+1]],[-1,0,2,0,3,1,[t,e+1,t,e]],[0,1,3,2,1,0,[t+1,e+1,t,e+1]],[0,-1,0,1,2,3,[t,e,t+1,e]]];for(let[r,i,a,o,s,l,u]of n){let n=te(t,e,a),d=te(t,e,o),f=te(t+r,e+i,s),p=te(t+r,e+i,l);if(n<=f+.001&&d<=p+.001)continue;let m=Math.min(n,f),h=Math.min(d,p);c([u[0],n,u[1],u[2],d,u[3],u[2],h,u[3],u[0],m,u[1]],r,i,n,d)}}}a.forEach((e,t)=>{if(!e.idx.length)return;let n=new jr;n.setAttribute(`position`,new G(e.pos,3)),n.setAttribute(`normal`,new G(e.nor,3)),n.setAttribute(`aTop`,new G(e.top,1)),n.setAttribute(`aSide`,new G(e.side,1)),n.setIndex(e.idx),n.computeBoundingSphere();let r=new Ur(n,T);r.receiveShadow=!0,r.castShadow=t===1&&P,r.userData.ground=[l+_d/2,u+_d/2],this.place(r,l+_d/2,u+_d/2)});let m=b?gd(e,i,l,u,d,f):null;if(m){let e=new Ur(m,S);e.receiveShadow=!0,this.place(e,l+_d/2,u+_d/2)}})}buildFoliage(e,t,n){let r=n===`low`?.3:n===`medium`?.6:1,i=e.size,a=e.tileNames.map(e=>Pd(t.generator,e)),o=t.palette.tiles,s=e=>{let t=new So(1,1);t.translate(0,.5,0),t.rotateY(e);let n=t.attributes.normal;for(let e=0;e<n.count;e++)n.setXYZ(e,0,1,0);return t},c=(e,t=0)=>{let n=e.map(s);if(t){let e=new So(.82,.82);e.rotateX(-Math.PI/2),e.translate(0,t,0),n.push(e)}let r=new jr;for(let[e,t]of[[`position`,3],[`normal`,3],[`uv`,2]])r.setAttribute(e,new G(n.flatMap(t=>Array.from(t.attributes[e].array)),t));r.setAttribute(`aTop`,new G(n.flatMap((e,r)=>[0,0,0,0].map(()=>t&&r===n.length-1?1:0)),1));let i=Array.from(n[0].index.array);return r.setIndex(n.flatMap((e,t)=>i.map(e=>e+t*4))),n.forEach(e=>e.dispose()),r},l=c([Math.PI/4,-Math.PI/4]),u=c([0,Math.PI/3,-Math.PI/3],.6),d=Yu(),f=this.uniforms,p=new Eo({map:d,alphaTest:.5,side:2});p.onBeforeCompile=e=>{e.uniforms.uTime=f.uTime,e.uniforms.uTrail=this.flora.uTrail,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\nuniform float uTime;\nuniform vec4 uTrail[${Ad}];\nattribute float aSprite;\nattribute float aBend;\nattribute float aTop;\nvarying float vSpr;\nvarying float vH;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
// a bush crown (aTop) shows the bush's top-view sprite and is lit like the upper leaves
vSpr = aSprite + aTop * ${3 .toFixed(1)};
vH = mix(uv.y, 0.95, aTop);
vec3 ip = instanceMatrix[3].xyz;
mat3 fim = mat3(instanceMatrix);
// the root stays put, the tips move most; bushes are stiffer than grass
float bend = position.y * position.y * aBend;
// no wind: plants stand still unless the hero pushes through them
vec2 off = vec2(0.0);
// the hero and the spots it just left push the blades aside; they spring back as those fade
vec2 push = vec2(0.0);
for (int i = 0; i < ${Ad}; i++) {
  vec2 rel = ip.xz - uTrail[i].xy;
  float d = length(rel);
  push += rel / max(d, 0.06) * (1.0 - smoothstep(0.2, 0.95, d)) * uTrail[i].z;
}
float pl = length(push);
if (pl > 1.0) push /= pl;
off += push * 0.4;
// leaning blades also dip, so they bend rather than stretch
vec3 wo = vec3(off.x, -min(pl, 1.0) * 0.16 - dot(off, off) * 0.9, off.y) * bend;
// world-space offset into the instance's own rotated and scaled frame
transformed += transpose(fim) * wo / dot(fim[0], fim[0]);`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vSpr;
varying float vH;`).replace(`#include <normal_fragment_begin>`,`#include <normal_fragment_begin>
normal = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);`).replace(`#include <map_fragment>`,`vec4 sampledDiffuseColor = texture2D(map, vec2((clamp(vMapUv.x, 0.001, 0.999) + vSpr) / 24.0, vMapUv.y));
diffuseColor *= sampledDiffuseColor;
diffuseColor.rgb *= 0.78 + 0.22 * vH;`)},this.disposables.push(l,u,d,p);let m=Math.ceil(i/32),h=Array.from({length:m*m},()=>[]),g=new W;if(t.generator===`meadow`)for(let t of sd(e)){let n=e=>Y(Math.floor(t.x*7),Math.floor(t.z*7),e),r=g.setHex(5212724).multiplyScalar(.92+n(1)*.2).getHex();h[Math.floor(t.z/32)*m+Math.floor(t.x/32)].push({x:t.x,y:e.groundY(t.x,t.z)-.04,z:t.z,s:t.s,sp:t.sprite,c:r,a:n(2)})}let _=(t,n,s)=>{for(let c=s;c<Math.min(i,s+32);c++)for(let s=n;s<Math.min(i,n+32);s++){let n=c*i+s,l=a[e.tile[n]];if(!l)continue;let u=e.cell[n],d=e.elev[n];if(u!==J.floor&&u!==J.hazard&&u!==J.ice||d>=8&&!e.top)continue;let[f,p]=e.slopeAt(s+.5,c+.5);if(Math.hypot(f,p)>.75)continue;let m=l.density*r,h=Math.floor(m);Y(s,c,91)<m-h&&h++;let _=o[e.tileNames[e.tile[n]]]?.[0]??6263872;for(let n=0;n<h;n++){let r=e=>Y(s*3+n,c*5+n*7,e),i=Fd(l.sprites,r(1)),a=1.08+r(2)*.2+(Mu(s/6,c/6,97)-.5)*.14,o=qu.has(i)?16777215:l.tint??g.setHex(_).multiplyScalar(a).getHex(),u=s+.12+r(3)*.76,d=c+.12+r(4)*.76;t({x:u,y:e.groundY(u,d)-.03,z:d,s:.6*(.8+r(5)*.5)*(kd[i]??1),sp:i,c:o,a:r(6)})}if(l.bush&&l.bushes&&Y(s,c,92)<l.bush*r){let n=e=>Y(s*5+1,c*3+2,e),r=Fd(l.bushes,n(1)),i=qu.has(r)?16777215:g.setHex(r===Z.deadBush?16777215:5212724).multiplyScalar(.9+n(2)*.2).getHex(),a=s+.3+n(3)*.4,o=c+.3+n(4)*.4;t({x:a,y:e.groundY(a,o)-.04,z:o,s:.85+n(5)*.4,sp:r,c:i,a:n(6)})}if(d&&l.sprites.some(([e])=>e===Z.grass)&&r>.5){let r=this.level;for(let[a,o]of[[1,0],[-1,0],[0,1],[0,-1]]){let l=s+a,u=c+o;if(l<0||u<0||l>=i||u>=i)continue;let d=u*i+l;if(!((Eu(e.cell[d])?r[d]:e.centerY(d))>e.centerY(n)-.9))for(let n=0;n<2;n++){let r=e=>Y(s*7+n+a*3,c*11+n+o*5,e),i=.15+(n+r(1))*.35,l=a?s+(a>0?.92:.08):s+i,u=o?c+(o>0?.92:.08):c+i;t({x:l,y:e.groundY(l,u)-.04,z:u,s:.62*(.85+r(2)*.4),sp:r(3)<.6?Z.tallGrass:Z.grass,c:g.setHex(_).multiplyScalar(1.1+r(4)*.2).getHex(),a:r(5)})}}}}},v=new Sn,y=new Sn;h.forEach((e,t)=>this.defer((t%m+.5)*32,(Math.floor(t/m)+.5)*32,()=>{let n=e.slice();_(e=>n.push(e),t%m*32,Math.floor(t/m)*32);for(let e of[!1,!0]){let r=n.filter(t=>Ju.has(t.sp)===e);if(!r.length)continue;let i=(e?u:l).clone(),a=new Ti(i,p,r.length),o=new Float32Array(r.length),s=new Float32Array(r.length);r.forEach((t,n)=>{y.makeRotationY(t.a*Math.PI),v.makeScale(t.s,t.s,t.s).premultiply(y),v.setPosition(t.x,t.y,t.z),a.setMatrixAt(n,v),a.setColorAt(n,g.setHex(t.c)),o[n]=t.sp,s[n]=e?.45:1}),i.setAttribute(`aSprite`,new _i(o,1)),i.setAttribute(`aBend`,new _i(s,1)),a.receiveShadow=!0,a.computeBoundingSphere(),this.place(a,(t%m+.5)*32,(Math.floor(t/m)+.5)*32)}}))}cull(e,t,n,r=6){e-=this.ox,t-=this.oz;let i=(n+24)**2;for(let n of this.chunks)n.mesh.visible=(n.x-e)**2+(n.z-t)**2<i;if(!this.lazy)return;let a=(n+90)**2,o=[];for(let n of this.slots){let r=(n.x-e)**2+(n.z-t)**2;n.objs?r>a&&this.free(n):r<i&&o.push({s:n,d:r})}o.sort((e,t)=>e.d-t.d);let s=performance.now();for(let e of o)if(this.cur=[],e.s.build(),e.s.objs=this.cur,this.cur=null,this.stats.built++,this.stats.live++,r>0&&performance.now()-s>r)break}free(e){for(let t of e.objs??[])this.group.remove(t),t.geometry.dispose(),t instanceof Ti&&t.dispose();e.objs=null,this.stats.freed++,this.stats.live--}occlude(e,t,n){let r=this.uniforms;r.uOcc.value=e;for(let e of this.ghosts)e.visible=!1;if(e<.005)return;r.uHeroFeet.value.set(n.x,n.y-.9,n.z);let i=vd.copy(n).applyMatrix4(t.matrixWorldInverse);r.uHeroDist.value=-i.z;let a=yd.copy(n).project(t);r.uHeroNdc.value.set(a.x,a.y);let o=bd.copy(i).setX(i.x+1.5).applyMatrix4(t.matrixWorld).project(t),s=Math.abs(o.x-a.x);r.uOccR.value.set(s,s*t.aspect);let c=0,l=t.position.x,u=t.position.z;for(let e of this.group.children){let t=e.userData.ground;if(!t||!e.visible)continue;let r=t[0]+this.ox,i=t[1]+this.oz,a=n.x-l,o=n.z-u,s=a*a+o*o||1,d=Math.max(0,Math.min(1,((r-l)*a+(i-u)*o)/s));if(!(Math.hypot(r-l-a*d,i-u-o*d)>_d*.75))for(let t of this.ghostMats){let n=this.ghosts[c];n||(n=this.ghosts[c]=new Ur,n.matrixAutoUpdate=!1,n.renderOrder=18,this.group.add(n)),n.geometry=e.geometry,n.material=t,n.renderOrder=t===this.ghostMats[0]?18:19,n.matrix.copy(e.matrix),n.visible=!0,c++}}}update(e,t){this.uniforms.uTime.value=e,this.uniforms.uSurge.value=t}hideVoxelGround(e,t){let n=new Sn;for(let r of this.group.children){let i=r.userData.ground;i&&e.has(`${Math.floor((i[0]+this.ox)/32)},${Math.floor((i[1]+this.oz)/32)}`)&&(r.visible=!1);let a=r;if(a.isInstancedMesh&&a.geometry.getAttribute(`aSprite`)&&a.userData.voxelColumns!==t.size){for(let e=0;e<a.count;e++){a.getMatrixAt(e,n);let r=Math.floor(n.elements[12]+this.ox),i=Math.floor(n.elements[14]+this.oz);t.has(`${r},${i}`)&&(n.makeScale(0,0,0),a.setMatrixAt(e,n))}a.instanceMatrix.needsUpdate=!0,a.userData.voxelColumns=t.size}}}trackHero(e,t,n,r){let i=this.flora.uTrail.value,a=this.trailLife,o=e-this.ox,s=t-this.oz,c=1-Math.min(1,Math.max(0,(n-.2)/.7));for(let e=1;e<Ad;e++)a[e]=Math.max(0,a[e]-r/jd),i[e].z=a[e]*a[e]*(3-2*a[e])*this.trailK[e];if(Math.hypot(o-this.trailLast[0],s-this.trailLast[1])>.35){let e=this.trailNext;i[e].set(o,s,c,0),a[e]=1,this.trailK[e]=c,this.trailLast=[o,s],this.trailNext=e+1>=Ad?1:e+1}i[0].set(o,s,c,0)}dispose(){for(let e of this.slots)e.objs&&this.free(e);for(let e of this.disposables)e.dispose();this.group.clear()}},Ld={fn:null};function Rd(e,t){return Ld.fn?Ld.fn(e,t):0}var zd=(e,t,n,r,i,a,o={})=>({id:e,name:t,category:n,handSeconds:r,toolSeconds:i,tool:a,drop:e,solid:!0,transparent:!1,replaceable:!1,gravity:!1,stackSize:64,...o}),Bd=[zd(`dirt`,`Земля`,`ground`,.8,.25,`shovel`),...[`grass`,`grass2`,`grass_lush`,`grass_sun`,`grass_dry`,`grass_clover`,`grass_cold`].map(e=>zd(e,`Травяной блок`,`ground`,.8,.25,`shovel`,{drop:`dirt`})),zd(`sand`,`Песок`,`ground`,.7,.2,`shovel`,{gravity:!0}),zd(`gravel`,`Гравий`,`ground`,.8,.25,`shovel`,{gravity:!0}),zd(`clay`,`Глина`,`ground`,.8,.25,`shovel`),zd(`snow`,`Снег`,`ground`,.6,.2,`shovel`),zd(`ice`,`Лёд`,`ground`,1.5,.6,`pickaxe`,{transparent:!0}),...[[`stone`,`Камень`],[`basalt`,`Базальт`],[`tuff`,`Туф`],[`moss_stone`,`Замшелый камень`],[`sandstone`,`Песчаник`],[`cobblestone`,`Булыжник`],[`granite`,`Гранит`],[`andesite`,`Андезит`],[`diorite`,`Диорит`]].map(([e,t])=>zd(e,t,`stone`,8,1.2,`pickaxe`)),...[[`oak_log`,`Дубовое бревно`],[`birch_log`,`Берёзовое бревно`],[`spruce_log`,`Еловое бревно`],[`pine_log`,`Сосновое бревно`],[`planks`,`Доски`]].map(([e,t])=>zd(e,t,`wood`,3,.8,`axe`)),...[[`coal_ore`,`Угольная руда`,1],[`copper_ore`,`Медная руда`,2],[`iron_ore`,`Железная руда`,2],[`gold_ore`,`Золотая руда`,3],[`diamond_ore`,`Алмазная руда`,3]].map(([e,t,n])=>zd(e,t,`ore`,12,2,`pickaxe`,{minimumTier:n})),zd(`glass`,`Стекло`,`building`,.5,.5,void 0,{transparent:!0}),zd(`workbench`,`Верстак`,`utility`,3,.8,`axe`),zd(`furnace`,`Печь`,`utility`,8,1.2,`pickaxe`),zd(`chest`,`Сундук`,`utility`,3,.8,`axe`)],Vd=new Map(Bd.map(e=>[e.id,e]));function Hd(e,t){let n=!!t&&t.kind===e.tool&&t.durability>0,r=n?Math.max(.01,t.speed):1;return{seconds:n?e.toolSeconds/r:e.handSeconds,drop:!e.minimumTier||n&&t.tier>=e.minimumTier?e.drop:null}}var Ud=[`main`,`off`,`head`,`hands`,`feet`,`body`],Wd={main:`Основная рука`,off:`Вторая рука`,head:`Шлем`,hands:`Перчатки`,feet:`Ботинки`,body:`Доспех`},Gd=[{id:`sword_recruit`,name:`Железный меч новобранца`,type:`Одноручный меч`,desc:`Быстрые удары по одной цели. Можно взять щит во вторую руку.`,slot:`main`,weapon:{kind:`sword1h`,dmgType:`phys`,shape:`melee`,damage:14,interval:.6,hitAt:.45,range:2.3},stats:{}},{id:`sword_guard2h`,name:`Двуручный меч стражника`,type:`Двуручный меч`,desc:`Медленный тяжёлый удар по одной цели. Занимает обе руки.`,slot:`main`,twoHanded:!0,weapon:{kind:`sword2h`,dmgType:`phys`,shape:`melee`,damage:40,interval:1.55,hitAt:.55,range:2.6},stats:{}},{id:`spear_militia`,name:`Железная пика ополченца`,type:`Пика`,desc:`Длинный выпад: задевает все цели в полосе перед собой. Занимает обе руки.`,slot:`main`,twoHanded:!0,weapon:{kind:`spear`,dmgType:`phys`,shape:`sweep`,damage:24,interval:1.15,hitAt:.5,range:3.6,halfWidth:1},stats:{}},{id:`staff_spark`,name:`Малый посох искры`,type:`Одноручный магический посох`,desc:`Быстро выпускает искру — снаряд с небольшим магическим уроном. Можно взять щит.`,slot:`main`,weapon:{kind:`staff1h`,dmgType:`magic`,shape:`projectile`,damage:12,interval:.7,hitAt:.5,range:12,projSpeed:16,proj:`spark`},stats:{}},{id:`staff_apprentice`,name:`Посох ученика`,type:`Двуручный магический посох`,desc:`Долгое заклинание: тяжёлая магическая сфера. Занимает обе руки.`,slot:`main`,twoHanded:!0,weapon:{kind:`staff2h`,dmgType:`magic`,shape:`projectile`,damage:36,interval:1.8,hitAt:.62,range:14,projSpeed:12,proj:`orb`},stats:{}},{id:`bow_hunter`,name:`Охотничий лук`,type:`Лук`,desc:`Натянуть и выстрелить: стреляет чаще арбалета, но слабее. Занимает обе руки.`,slot:`main`,twoHanded:!0,weapon:{kind:`bow`,dmgType:`phys`,shape:`projectile`,damage:15,interval:.8,hitAt:.6,range:16,projSpeed:24,proj:`arrow`},stats:{}},{id:`crossbow_light`,name:`Лёгкий арбалет`,type:`Арбалет`,desc:`Мощный выстрел и долгая перезарядка после него. Занимает обе руки.`,slot:`main`,twoHanded:!0,weapon:{kind:`crossbow`,dmgType:`phys`,shape:`projectile`,damage:38,interval:1.95,hitAt:.14,range:18,projSpeed:30,proj:`bolt`},stats:{}},{id:`shield_wood`,name:`Деревянный щит с железным ободом`,type:`Щит`,desc:`Вторая рука. Повышает физическую защиту. Совместим с одноручным мечом и одноручным посохом.`,slot:`off`,stats:{physDef:10}},{id:`app_hood`,name:`Капюшон ученика`,type:`Шлем`,desc:`Комплект ученика.`,slot:`head`,armorSet:`apprentice`,armorClass:`Магическая`,stats:{physDef:1,magicDmg:.04,castSpeed:.03}},{id:`app_gloves`,name:`Перчатки ученика`,type:`Перчатки`,desc:`Комплект ученика.`,slot:`hands`,armorSet:`apprentice`,armorClass:`Магическая`,stats:{physDef:1,castSpeed:.06}},{id:`app_boots`,name:`Ботинки ученика`,type:`Ботинки`,desc:`Комплект ученика.`,slot:`feet`,armorSet:`apprentice`,armorClass:`Магическая`,stats:{physDef:1,magicDmg:.03}},{id:`app_robe`,name:`Одеяние ученика`,type:`Доспех`,desc:`Комплект ученика.`,slot:`body`,armorSet:`apprentice`,armorClass:`Магическая`,stats:{physDef:3,magicDmg:.08,castSpeed:.04}},{id:`scout_helm`,name:`Кожаный шлем разведчика`,type:`Шлем`,desc:`Комплект разведчика.`,slot:`head`,armorSet:`scout`,armorClass:`Лёгкая`,stats:{physDef:3,atkSpeed:.02}},{id:`scout_gloves`,name:`Перчатки разведчика`,type:`Перчатки`,desc:`Комплект разведчика.`,slot:`hands`,armorSet:`scout`,armorClass:`Лёгкая`,stats:{physDef:2,atkSpeed:.05}},{id:`scout_boots`,name:`Ботинки разведчика`,type:`Ботинки`,desc:`Комплект разведчика.`,slot:`feet`,armorSet:`scout`,armorClass:`Лёгкая`,stats:{physDef:2,moveSpeed:.04}},{id:`scout_armor`,name:`Доспех разведчика`,type:`Доспех`,desc:`Комплект разведчика.`,slot:`body`,armorSet:`scout`,armorClass:`Лёгкая`,stats:{physDef:6,moveSpeed:.02,atkSpeed:.03}},{id:`guard_helm`,name:`Железный шлем стражника`,type:`Шлем`,desc:`Комплект стражника.`,slot:`head`,armorSet:`guard`,armorClass:`Тяжёлая`,stats:{physDef:6,moveSpeed:-.01}},{id:`guard_gloves`,name:`Перчатки стражника`,type:`Перчатки`,desc:`Комплект стражника.`,slot:`hands`,armorSet:`guard`,armorClass:`Тяжёлая`,stats:{physDef:4}},{id:`guard_boots`,name:`Ботинки стражника`,type:`Ботинки`,desc:`Комплект стражника.`,slot:`feet`,armorSet:`guard`,armorClass:`Тяжёлая`,stats:{physDef:5,moveSpeed:-.02}},{id:`guard_cuirass`,name:`Кираса стражника`,type:`Доспех`,desc:`Комплект стражника.`,slot:`body`,armorSet:`guard`,armorClass:`Тяжёлая`,stats:{physDef:12,moveSpeed:-.03}}],Kd=Gd.map(e=>e.id);for(let e of Bd)Gd.push({id:`block:`+e.id,name:e.name,type:`Блок`,desc:`Выберите в сумке, затем F и ПКМ — поставить.`,slot:`main`,stats:{},block:e.id});for(let[e,t]of[[`pickaxe`,`Кирка`],[`axe`,`Топор`],[`shovel`,`Лопата`],[`hoe`,`Мотыга`]])Gd.push({id:`tool:`+e,name:t+` (железная)`,type:`Инструмент`,desc:`Выберите в сумке. F — добыча, удержание ЛКМ — работать.`,slot:`main`,stats:{},tool:{kind:e,tier:3,speed:2.5,durability:250}});var qd=Object.fromEntries(Gd.map(e=>[e.id,e]));function Jd(e){return e&&qd[e]||null}var Yd=Kd,Xd={oak:0,spruce:1,birch:2,willow:3,dead:4,fruit:5,small:6,pine:7},Zd=[{name:`Дуб`,height:6.5,heightStep:.5,trunk:2},{name:`Ель`,height:8.5,heightStep:1,trunk:1},{name:`Берёза`,height:6.5,heightStep:.6,trunk:1},{name:`Ива`,height:6,heightStep:.4,trunk:2},{name:`Сухое дерево`,height:4.5,heightStep:.6,trunk:1},{name:`Фруктовое дерево`,height:4,heightStep:.35,trunk:1},{name:`Небольшое дерево`,height:2.8,heightStep:.35,trunk:1},{name:`Сосна обыкновенная высокая`,height:12,heightStep:1.3,trunk:1}];function Qd(e,t){let n=Zd[e];return n.height+n.heightStep*t}var $d=2e3,ef=4,tf={ocean:0,beach:1,desert:2,steppe:3,plains:4,forest:5,conifer:6,tundra:7,alpine:8,volcanic:9},nf={id:`wild`,name:{ru:`Дикие земли`,en:`The Wild Lands`},desc:{ru:`Открытый мир 2000 × 2000: горы, реки, леса и пустыни.`,en:`An open world of 2000 × 2000 blocks.`},size:$d,generator:`wild`,palette:{sky:10474220,fog:11063496,fogNear:40,fogFar:92,ambient:14085375,ambientIntensity:.6,sun:16773590,sunIntensity:1.2,hemiGround:5929524,tiles:{grass:[6989890,7384390,6595135],grass2:[7910476,8304978],grass_lush:[6069306,6332476,5806138],grass_sun:[8696906,9091151,8433223],grass_dry:[10268242,10794072,9873484],grass_clover:[6793799,7188556,6464579],grass_cold:[6199890,6463574,5936206],snow:[15660024,16185852,15002868],gravel:[9079436,8289922,9868954],clay:[11039832,11566176,10382416],basalt:[5657692,4999762,6315622],tuff:[10262664,10789008,9736318],moss_stone:[8290948,7633018,5933620],ice:[10275056,11063540,9486572],sandstone:[14205066,14468754,13809792],sand:[14996124,15259812,14601108],stone:[9079952,8422026,9606298],water_sea_4:[3108792,3504064],water_lake_3:[3834568,4229840],water_river_2:[4887252,5413592],water_fast_2:[5939420,6465760],water_swamp_1:[5660730,6055488]},blocks:{soil:[10119746],cliff:[9079954],snowSoil:[1],selfRock:[1]}},music:{root:45,scale:`dorian`,tempo:100,mood:`forest`}},rf=(e,t,n)=>{let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)},af=(e,t,n)=>1-Math.abs(Mu(e,t,n)*2-1);function of(e,t,n){let r=e/n,i=t/n,a=(Nu(e/420,t/420,11)-.5)*.5,o=(Nu(e/420+31,t/420-17,12)-.5)*.5,s=(r-.5+a)*2,c=(i-.52+o)*2,l=1-Math.hypot(s*.86,c*.98);l+=(Nu(e/150,t/150,13)-.5)*.38,l+=(Nu(e/55,t/55,14)-.5)*.08;let u=Math.max(Math.abs(r-.5),Math.abs(i-.5))*2+(Nu(e/90,t/90,15)-.5)*.12;return l-=rf(.86,1,u)*.9,l}function sf(e,t){let n=e+(Nu(e/300,t/300,21)-.5)*260,r=t+(Nu(e/300+9,t/300+4,22)-.5)*260,i=af(n/560,r/560,23),a=af(r/380+5,n/380-3,24),o=rf(.76,.99,i)*rf(.3,.55,Nu(e/650,t/650,25)),s=rf(.8,.99,a)*rf(.4,.62,Nu(e/500+7,t/500,26))*.78;return Math.max(o,s)}function cf(e,t){return rf(.66,.76,Nu(e/380+13,t/380-8,27))}function lf(e,t,n){let r=of(e,t,n),i=rf(.12,.5,r),a=sf(e,t)*rf(.1,.3,r),o=7+i*12+(Nu(e/220,t/220,31)-.5)*16*i+(Nu(e/70,t/70,32)-.5)*5*i,s=rf(.6,.67,Nu(e/260,t/260,33))*i;o+=s*12,o+=(Nu(e/45,t/45,35)-.5)*4*i,o-=rf(.7,.84,Nu(e/110,t/110,36))*9*i*(1-sf(e,t));let c=a**1.5*72+a*af(e/70,t/70,34)*20;return{h:r<.04?2-(.04-r)*40:2+(o+c-2)*rf(.04,.17,r),mtn:a,land:r}}var uf=class{constructor(e){m(this,`ids`,void 0),m(this,`keys`,void 0),m(this,`size`,0),this.ids=new Int32Array(e),this.keys=new Float32Array(e)}push(e,t){let n=this.size++;for(;n>0;){let e=n-1>>1;if(this.keys[e]<=t)break;this.ids[n]=this.ids[e],this.keys[n]=this.keys[e],n=e}this.ids[n]=e,this.keys[n]=t}pop(){let e=this.ids[0],t=this.ids[--this.size],n=this.keys[this.size],r=0;for(;;){let e=r*2+1;if(e>=this.size)break;let t=e+1,i=t<this.size&&this.keys[t]<this.keys[e]?t:e;if(this.keys[i]>=n)break;this.ids[r]=this.ids[i],this.keys[r]=this.keys[i],r=i}return this.ids[r]=t,this.keys[r]=n,e}},df=[1,-1,0,0,1,1,-1,-1],ff=[0,0,1,-1,1,-1,1,-1];function pf(e,t,n,r){let i=new Float32Array(e*e),a=new Uint8Array(e*e),o=new uf(e*e);for(let n=0;n<e*e;n++){let s=n%e,c=n/e|0;(r(n)||s===0||c===0||s===e-1||c===e-1)&&(i[n]=t[n],a[n]=1,o.push(n,t[n]))}let s=new Int32Array(e*e),c=0;for(;o.size;){let n=o.pop();s[c++]=n;let r=n%e,l=n/e|0;for(let s=0;s<8;s++){let c=r+df[s],u=l+ff[s];if(c<0||u<0||c>=e||u>=e)continue;let d=u*e+c;a[d]||(a[d]=1,i[d]=Math.max(t[d],i[n]+.004+Y(c,u,7)*.03),o.push(d,i[d]))}}let l=new Int32Array(e*e).fill(-1);for(let t=0;t<e*e;t++){if(r(t))continue;let n=t%e,a=t/e|0,o=-1,s=i[t];for(let r=0;r<8;r++){let c=n+df[r],l=a+ff[r];if(c<0||l<0||c>=e||l>=e)continue;let u=l*e+c,d=(i[t]-i[u])/(r<4?1:Math.SQRT2);i[u]<s&&d>0&&(o<0||i[u]<s)&&(s=i[u],o=u)}l[t]=o}let u=new Float32Array(e*e);for(let e=c-1;e>=0;e--){let t=s[e];u[t]+=n[t],l[t]>=0&&(u[l[t]]+=u[t])}return{fill:i,down:l,flow:u,order:s.subarray(0,c)}}function mf(e,t){return(n,r)=>{let i=Math.max(0,Math.min(e-1.001,n/ef-.5)),a=Math.max(0,Math.min(e-1.001,r/ef-.5)),o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=s*e+o,d=t[u]+(t[u+1]-t[u])*c;return d+(t[u+e]+(t[u+e+1]-t[u+e])*c-d)*l}}function hf(e=$d){let t=typeof performance<`u`?performance.now():Date.now(),n=e/ef,r=new Float32Array(n*n),i=new Float32Array(n*n),a=new Float32Array(n*n);for(let t=0;t<n;t++)for(let o=0;o<n;o++){let s=lf(o*ef+ef/2,t*ef+ef/2,e),c=t*n+o;r[c]=s.h,i[c]=s.mtn,a[c]=s.land}let o=e=>r[e]<5.5,s=new Float32Array(n*n);for(let e=0;e<n;e++)for(let t=0;t<n;t++){let i=e*n+t,a=.06+e/n*.86,o=(Nu(t/70,e/70,63)-.5)*.34+(Nu(t/20,e/20,61)-.5)*.1;s[i]=Math.max(0,Math.min(1,a-Math.max(0,r[i]-6)*.0105+o))}let c=new Float32Array(n*n);{let e=new Float32Array(n).fill(1),t=new Float32Array(n).fill(6),i=new Float32Array(n);for(let a=0;a<n;a++){for(let i=0;i<n;i++){let s=i*n+a,l=Math.max(6,r[s]);if(o(s))e[i]=Math.min(1,e[i]+.06),c[s]=e[i]*.7;else{let n=Math.max(0,l-t[i]),r=e[i]*(.0011+n*.022);e[i]=Math.max(0,e[i]-r),c[s]=Math.min(1,e[i]*.85+n*.04*(e[i]+.2))}t[i]=l}for(let t=0;t<3;t++){for(let t=0;t<n;t++)i[t]=(e[Math.max(0,t-1)]+e[t]*2+e[Math.min(n-1,t+1)])*.25;e.set(i)}}}let l=vf(n,c,5);for(let e=0;e<n*n;e++)l[e]=Math.max(0,Math.min(1,l[e]*1.15+(Nu(e%n/60,(e/n|0)/60,62)-.5)*.18));let u=pf(n,r,l,o),d=new Float32Array(n*n);for(let e=0;e<n*n;e++){if(o(e))continue;let t=u.down[e],n=t>=0?Math.max(0,r[e]-r[t]):0;d[e]=Math.min(26,Math.sqrt(u.flow[e])*(.35+Math.min(1,n/6)*.9))}let f=vf(n,d,1),p=new Float32Array(n*n);for(let e=0;e<n*n;e++)p[e]=o(e)?r[e]:Math.max(5.7,r[e]-Math.max(d[e],f[e]*.8));u=pf(n,p,l,o);let{fill:m,down:h,order:g}=u,_=new Float32Array(n*n);for(let e=g.length-1;e>=0;e--){let t=g[e];_[t]+=l[t]*(1+2.5*rf(20,51,p[t])),h[t]>=0&&(_[h[t]]+=_[t])}let v=new Uint8Array(n*n);for(let e=0;e<n*n;e++)!o(e)&&m[e]-p[e]>1.1&&(v[e]=1);{let e=new Uint8Array(n*n),t=[];for(let r=0;r<n*n;r++){if(!v[r]||e[r])continue;t.length=0,t.push(r),e[r]=1;let i=1/0;for(let r=0;r<t.length;r++){let a=t[r];i=Math.min(i,m[a]);let o=a%n,s=a/n|0;for(let r=0;r<8;r++){let i=o+df[r],a=s+ff[r];if(i<0||a<0||i>=n||a>=n)continue;let c=a*n+i;v[c]&&!e[c]&&(e[c]=1,t.push(c))}}for(let e of t)m[e]=i}for(let e=g.length-1;e>=0;e--){let t=g[e],n=h[t];n>=0&&m[n]>m[t]&&(m[n]=m[t])}}let y=new Uint8Array(n*n);for(let e=0;e<n*n;e++){let t=s[e],r=l[e],c=p[e]-6;o(e)?y[e]=tf.ocean:i[e]>.35&&cf(e%n*ef,(e/n|0)*ef)>.5?y[e]=tf.volcanic:t<.17?y[e]=tf.tundra:c>34&&i[e]>.3?y[e]=tf.alpine:c<1.6&&a[e]<.2?y[e]=tf.beach:r<.2&&t>.52?y[e]=tf.desert:r<.32?y[e]=tf.steppe:t<.36?y[e]=tf.conifer:r>.5?y[e]=tf.forest:y[e]=tf.plains}let b=new Uint8Array(n*n);for(let e=0;e<n*n;e++)!o(e)&&_[e]>=44*(3.6-3.2*rf(12,36,p[e]))&&(b[e]=1);for(let e=0;e<n*n;e++)!o(e)&&p[e]>30&&_[e]>=9&&l[e]>.2&&(b[e]=1);for(let e=g.length-1;e>=0;e--){let t=g[e];b[t]&&h[t]>=0&&!o(h[t])&&(b[h[t]]=1)}let x=e/2,S=new Float32Array(x*x),C=new Float32Array(x*x);for(let e=0;e<x;e++)for(let t=0;t<x;t++){let n=t*2,r=e*2;S[e*x+t]=(Nu(n/95,r/95,78)-.5)*30+(Nu(n/24,r/24,76)-.5)*10,C[e*x+t]=(Nu(n/95+21,r/95-9,79)-.5)*30+(Nu(n/24+40,r/24-30,77)-.5)*10}let w=(e,t)=>S[(t>>1)*x+(e>>1)],T=(e,t)=>C[(t>>1)*x+(e>>1)],E=e*e,D=new Uint8Array(E).fill(255),O=new Float32Array(E),k=new Uint8Array(E),A=new Uint8Array(E),j=new Float32Array(E),ee=(e,t)=>(Y(e%n,e/n|0,71+t)-.5)*2.2,te=e=>[e%n*ef+ef/2+ee(e,0),(e/n|0)*ef+ef/2+ee(e,1)];for(let t=0;t<n*n;t++){if(!b[t]||v[t])continue;let n=h[t];if(n<0)continue;let[r,a]=te(t),[o,s]=te(n),c=.7+Math.min(3.6,Math.sqrt(Math.max(0,_[t]-17.6))/9),l=m[t],u=m[n],d=l-u>=2.2,f=c+10+c*2+i[t]*8+22,p=Math.max(0,Math.floor(Math.min(r,o)-f)),g=Math.min(e-1,Math.ceil(Math.max(r,o)+f)),y=Math.max(0,Math.floor(Math.min(a,s)-f)),x=Math.min(e-1,Math.ceil(Math.max(a,s)+f)),S=o-r,C=s-a,E=S*S+C*C||1;for(let t=y;t<=x;t++)for(let n=p;n<=g;n++){let i=n+.5+w(n,t),o=t+.5+T(n,t),s=Math.max(0,Math.min(1,((i-r)*S+(o-a)*C)/E)),p=Math.hypot(i-(r+S*s),o-(a+C*s));if(p>f-22)continue;let m=t*e+n,h=Math.min(254,Math.round(p*8));h>=D[m]||(D[m]=h,O[m]=Math.max(5.38,d?s<.5?l:u:l+(u-l)*s),k[m]=Math.round(c*8),A[m]=Math.round(Math.atan2(C,S)/(Math.PI*2)*256)&255||1,j[m]=(l-u)/Math.sqrt(E))}}let M=new ku(e,!0),N=Object.keys(nf.palette.tiles);for(let e of N)M.tileId(e);let P=e=>M.tileId(e),ne=mf(n,p),re=mf(n,m),ie=mf(n,i),ae=mf(n,s),oe=mf(n,l),se=mf(n,a),ce=new Float32Array(E),le=new Uint8Array(E),ue=new Float32Array(E),de=new Uint8Array(E);for(let t=0;t<e;t++)for(let r=0;r<e;r++){let i=t*e+r,a=ie(r,t),s=ne(r,t)+(Nu(r/22,t/22,41)-.5)*(1.6+a*7)+(Mu(r/7,t/7,42)-.5)*(.4+a*2.5),c=Math.min(n-1,Math.floor(r/ef)),l=Math.min(n-1,Math.floor(t/ef)),u=l*n+c;if(v[u]){let e=m[u];s<e+.3&&(le[i]=2,ue[i]=e,s=Math.min(s-.5,e-.3))}else if(re(r,t)-s>1.4&&!o(u)){let e=!1;for(let t=-1;t<=1&&!e;t++)for(let r=-1;r<=1;r++)v[Math.max(0,Math.min(n-1,l+t))*n+Math.max(0,Math.min(n-1,c+r))]&&(e=!0);e&&(s=Math.max(s,re(r,t)+.2))}let d=D[i];if(d!==255&&le[i]===0){let e=d/8,t=k[i]/8,n=Math.round(O[i]+.62)-.62;if(e<t)le[i]=1,ue[i]=O[i],s=n-.3-.6*(1-e/t)*Math.min(1,Math.max(0,(t-.8)/2));else if(e<t+1.2)s=n+.13,de[i]=1;else{let r=n+.13+(e-t-1.2)*(.22+a*1.3);s=Math.max(n+.13,Math.min(s,r))}}le[i]===0&&s<5.5&&(le[i]=3,ue[i]=5.38),ce[i]=s}let F=new Float32Array(E);for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=t*e+n,i=ce[r];if(le[r]===1){F[r]=Math.floor(i*4)/4;continue}let a=ce[t*e+Math.min(e-1,n+1)]-ce[t*e+Math.max(0,n-1)],o=ce[Math.min(e-1,t+1)*e+n]-ce[Math.max(0,t-1)*e+n],s=Math.hypot(a,o)*.5,c=de[r]||s<.3?.25:s<.8?.5:1,l=de[r]?0:(Y(n,t,507)-.5)*.5*c;F[r]=Math.max(0,(de[r]?Math.floor:Math.round)((i+l)/c)*c)}let fe={riverCells:0,lakeCells:0,oceanCells:0,swampCells:0,waterfalls:0,land:0,ms:0},I={grass:P(`grass`),grass2:P(`grass2`),lush:P(`grass_lush`),sun:P(`grass_sun`),dry:P(`grass_dry`),clover:P(`grass_clover`),cold:P(`grass_cold`),snow:P(`snow`),gravel:P(`gravel`),clay:P(`clay`),basalt:P(`basalt`),tuff:P(`tuff`),moss:P(`moss_stone`),ice:P(`ice`),sandstone:P(`sandstone`),sand:P(`sand`),stone:P(`stone`),sea:P(`water_sea_4`),lake:P(`water_lake_3`),river:P(`water_river_2`),fast:P(`water_fast_2`),swamp:P(`water_swamp_1`)};M.top=F;let pe=new Uint8Array(E);M.flow=pe,M.shadeElev=new Uint8Array(E);for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=t*e+n,i=F[r],a=ae(n,t)+(Y(n,t,81)-.5)*.05+(Mu(n/9,t/9,82)-.5)*.05,o=oe(n,t)+(Y(n,t,83)-.5)*.05+(Mu(n/11,t/11,84)-.5)*.06,s=ie(n,t),c=le[r];if(c){let e=a<.13,i=c===3?6:Math.round(ue[r]+.62);M.elev[r]=i,e&&c!==3||e&&a<.08&&se(n,t)>0?(M.cell[r]=J.ice,M.tile[r]=I.ice,F[r]=Math.floor((i-.62)*4)/4):(M.cell[r]=c===1?J.shallow:J.liquid,M.tile[r]=c===3?I.sea:c===2?I.lake:s>.3||j[r]>.1?I.fast:I.river,F[r]=Math.max(0,Math.min(F[r],Math.floor((i-.62-.25)*4)/4)),c===1&&(pe[r]=A[r])),c===1?fe.riverCells++:c===2?fe.lakeCells++:fe.oceanCells++,M.shadeElev[r]=Math.round(F[r]*4)&255;continue}fe.land++,M.elev[r]=Math.floor(i),M.shadeElev[r]=Math.round(i*4)&255;let l=F[t*e+Math.min(e-1,n+1)]-F[t*e+Math.max(0,n-1)],u=F[Math.min(e-1,t+1)*e+n]-F[Math.max(0,t-1)*e+n],d=Math.hypot(l,u)*.5,f=i-6,p=D[r]/8,m=D[r]!==255&&p<k[r]/8+1.6,h=se(n,t)<.2&&f<2,g=s>.3?cf(n,t):0,_=Y(n,t,85),v;v=a<.15||a<.2&&_<(.2-a)*20?d>1.4&&_<.6?I.stone:I.snow:g>.5&&s>.3?d>.8||f>40?I.basalt:_<.15?I.gravel:I.tuff:d>.8&&f>18?o>.58&&_<.7?I.moss:I.stone:f>36&&s>.3?_<.55?I.gravel:d>.4?I.stone:I.dry:h?a>.35?I.sand:I.gravel:m?s>.3||a<.3?I.gravel:o<.3?_<.6?I.sand:I.gravel:_<.6?I.clay:I.lush:o<.18&&a>.5?d>.45||f>22?I.sandstone:I.sand:o<.24&&a>.48?_<(.24-o)*14?I.sand:I.dry:o<.32?I.dry:a<.3?o>.5&&d>.6?I.moss:I.cold:o<.4?I.sun:o<.5?Nu(n/5,t/5,303)>.72?I.clover:I.grass2:o<.64?I.grass:I.lush,M.tile[r]=v}gf(M,e,F,le,ae,oe,ie,I.swamp,I.lush,I.moss,I.clay,fe);for(let t=1;t<e-1;t++)for(let n=1;n<e-1;n++){let r=t*e+n;if(!_f(M.cell[r])||M.cell[r]===J.ice)continue;let i=M.elev[r]-.62;for(let t of[1,-1,e,-e,e+1,e-1,-e+1,-e-1]){let e=r+t;M.cell[e]!==J.floor||F[e]>=i+.1||(F[e]=Math.ceil((i+.1)*4)/4,M.elev[e]=Math.floor(F[e]),M.shadeElev[e]=Math.round(F[e]*4)&255)}}for(let t=1;t<e-1;t++)for(let n=1;n<e-1;n++){let r=t*e+n;if(M.cell[r]===J.shallow)for(let t of[1,-1,e,-e]){let e=r+t;if((M.cell[e]===J.shallow||M.cell[e]===J.liquid)&&M.elev[r]-M.elev[e]>=2){fe.waterfalls++;break}}}let L=yf(M,e,n,y,s,l,D),me={x:L.x+1,z:L.z-5,r:13};{let t=F[Math.floor(L.z)*e+Math.floor(L.x)];for(let n=Math.floor(me.z-me.r-6);n<=me.z+me.r+6;n++)for(let r=Math.floor(me.x-me.r-6);r<=me.x+me.r+6;r++){let i=n*e+r,a=Math.hypot(r+.5-me.x,n+.5-me.z);if(a>me.r+6||_f(M.cell[i]))continue;let o=rf(me.r,me.r+6,a);F[i]=Math.round((t*(1-o)+F[i]*o)*4)/4,M.elev[i]=Math.floor(F[i]),M.shadeElev[i]=Math.round(F[i]*4)&255,a<me.r&&(M.tile[i]=I.grass)}}let he=[{id:`dummy_a`,name:`Манекен А`,x:L.x-2.7,z:L.z-10},{id:`dummy_b`,name:`Манекен Б`,x:L.x-1.3,z:L.z-10},{id:`dummy_c`,name:`Манекен В`,x:L.x+6,z:L.z-10}],ge=bf(M,e,n,{BIO:y,TEMP:s,RAIN:l,MTN:i,rDist:D,kind:le},me);return fe.ms=Math.round((typeof performance<`u`?performance.now():Date.now())-t),{map:nf,terrain:M,spawn:L,dummies:he,trees:ge,coarse:{m:n,biome:y,temp:s,rain:l,flow:_,level:m,down:h,river:b},stats:fe}}function gf(e,t,n,r,i,a,o,s,c,l,u,d){let f=new Float32Array(t*t).fill(NaN),p=e=>{let n=e%t,r=e/t|0;return n>1&&r>1&&n<t-2&&r<t-2};for(let r=2;r<t-2;r++)for(let s=2;s<t-2;s++){let c=r*t+s;if(e.cell[c]!==J.floor)continue;let l=n[c]-6;if(l<.5||l>14)continue;let u=a(s,r),d=i(s,r);if(u<.6||d<.3||d>.8||o(s,r)>.15)continue;let p=Nu(s/70,r/70,611)+(u-.6)*.8;if(p<.6||Mu(s/6,r/6,612)*.7+Mu(s/2.5,r/2.5,613)*.3<.52-(p-.6)*.6)continue;let m=!0;for(let e of[1,-1,t,-t])Math.abs(n[c+e]-n[c])>.5&&(m=!1);m&&(f[c]=Math.floor(n[c]+.62+.05)-.62,f[c]<n[c]-.65&&(f[c]=NaN))}for(let r=0;r<4;r++)for(let r=0;r<t*t;r++)if(!Number.isNaN(f[r])&&p(r))for(let i of[1,-1,t,-t,t+1,t-1,-t+1,-t-1]){let t=r+i,a=!Number.isNaN(f[t]);if(a&&f[t]!==f[r]||!a&&(_f(e.cell[t])||n[t]<f[r]+.1)){f[r]=NaN;break}}for(let i=0;i<t*t;i++){if(Number.isNaN(f[i]))continue;let a=i%t,o=i/t|0;e.cell[i]=J.shallow,e.tile[i]=s,e.elev[i]=Math.round(f[i]+.62),n[i]=Math.floor((f[i]-.3)*4)/4,e.shadeElev[i]=Math.round(n[i]*4)&255,r[i]=1,d.swampCells++;for(let n of[1,-1,t,-t,2,-2,2*t,-2*t]){let t=i+n;if(e.cell[t]!==J.floor||!Number.isNaN(f[t]))continue;let r=Y(a+n,o,614);e.tile[t]=r<.45?c:r<.75?u:l}}}function _f(e){return e===J.liquid||e===J.shallow||e===J.ice}function vf(e,t,n){let r=t;for(let t=0;t<2;t++){let i=new Float32Array(e*e);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let s=0,c=0;for(let i=-n;i<=n;i++){let n=t===0?o+i:o,l=t===0?a:a+i;n<0||l<0||n>=e||l>=e||(s+=r[l*e+n],c++)}i[a*e+o]=s/c}r=i}return r}function yf(e,t,n,r,i,a,o){let s=-1,c=-1e9;for(let o=20;o<n-20;o+=2)for(let l=20;l<n-20;l+=2){let u=o*n+l;if(r[u]!==tf.plains&&tf.forest!==r[u])continue;let d=l*ef+2,f=o*ef+2,p=1e9,m=-1e9,h=!0;for(let n=-16;n<=12&&h;n+=2)for(let r=-14;r<=16;r+=2){let i=(f+n)*t+d+r;if(e.cell[i]!==J.floor){h=!1;break}p=Math.min(p,e.top[i]),m=Math.max(m,e.top[i])}if(!h||m-p>2.5)continue;let g=99;for(let n=14;n<60&&g===99;n+=4)for(let r=0;r<16;r++){let i=Math.round(d+Math.cos(r/16*Math.PI*2)*n),a=Math.round(f+Math.sin(r/16*Math.PI*2)*n);if(!(i<0||a<0||i>=t||a>=t)&&e.cell[a*t+i]===J.shallow){g=n;break}}let _=-Math.hypot(l-n/2,o-n/2)*.5-Math.abs(i[u]-.55)*120-Math.abs(a[u]-.5)*60-(m-p)*10-(g===99?60:g*.3);_>c&&(c=_,s=u)}return s<0?{x:t/2+.5,z:t/2+.5}:{x:s%n*ef+2.5,z:(s/n|0)*ef+2.5}}function bf(e,t,n,r,i){let a=[],o=[],s=[],c=[],l=[],u=[],d=e.top,f=new Uint8Array(n*n).fill(255);{let e=[];for(let i=0;i<n*n;i++){let a=i%n*ef+2,o=((i/n|0)*ef+2)*t+a;(r.kind[o]===1||r.kind[o]===2)&&(f[i]=0,e.push(i))}for(let t=0;t<e.length;t++){let r=e[t],i=r%n,a=r/n|0;for(let t=0;t<4;t++){let o=i+df[t],s=a+ff[t];if(o<0||s<0||o>=n||s>=n)continue;let c=s*n+o;f[c]!==255||f[r]>=12||(f[c]=f[r]+1,e.push(c))}}}for(let p=0;p<t/2;p++)for(let m=0;m<t/2;m++){let h=Math.min(t-1,m*2+Math.floor(Y(m,p,91)*2)),g=Math.min(t-1,p*2+Math.floor(Y(m,p,92)*2)),_=g*t+h;if(e.cell[_]!==J.floor||Math.hypot(h+.5-i.x,g+.5-i.z)<i.r+3)continue;let v=Math.min(n-1,g/ef|0)*n+Math.min(n-1,h/ef|0),y=r.BIO[v],b=r.TEMP[v],x=r.RAIN[v],S=d[_]-6,C=!0;for(let n of[1,-1,t,-t]){let r=_+n;(r<0||r>=t*t||e.cell[r]!==J.floor||Math.abs(d[r]-d[_])>.5)&&(C=!1)}if(!C)continue;let w=f[v],T=Nu(h/90,g/90,93),E=Nu(h/28,g/28,94),D=0;switch(y){case tf.forest:D=.2+rf(.5,.8,x)*.14-rf(.42,.3,T)*.2;break;case tf.conifer:D=.18+x*.15-rf(.42,.3,T)*.17;break;case tf.tundra:D=b>.1?.14*rf(.45,.62,T)+.015:.005;break;case tf.plains:D=rf(.58,.7,E)*.28+rf(.62,.75,T)*.2+.006;break;case tf.steppe:D=.006+rf(.68,.78,E)*.07;break;case tf.desert:D=.002;break;case tf.alpine:D=.035*(1-rf(36,55,S));break;case tf.volcanic:D=.01;break;case tf.beach:D=.01}if(D*=1-rf(30,60,S),w<=3&&y!==tf.desert&&y!==tf.tundra&&(D+=.1),D*=1.04,D*=1-rf(.6,.68,Nu(h/26,g/26,101))*(1-rf(.6,.75,T)),Y(h,g,95)>=D)continue;let O=!1;for(let n=-2;n<=2&&!O;n++)for(let r=-2;r<=2;r++){let i=_+n*t+r;if((r||n)&&i>=0&&i<t*t&&e.cell[i]===J.solid&&(Math.max(Math.abs(r),Math.abs(n))<2||Y(h+r,g+n,102)<.08)){O=!0;break}}if(O)continue;let k=Nu(h/40,g/40,96),A=Y(h,g,97),j;w<=2&&b>.3&&A<.65&&y!==tf.desert?j=Xd.willow:y===tf.desert||y===tf.steppe||y===tf.volcanic||y===tf.beach?j=A<.7?Xd.dead:Xd.small:y===tf.tundra?j=A<.8?Xd.spruce:Xd.pine:y===tf.conifer||y===tf.alpine?j=k<.5?A<.75?Xd.spruce:Xd.pine:A<.75?Xd.pine:Xd.spruce:y===tf.forest?(j=T<.47&&A<.3?Xd.fruit:A<.18?Xd.small:k<.45?A<.8?Xd.oak:Xd.birch:A<.75?Xd.birch:Xd.oak,b<.42&&A>.85&&(j=Xd.spruce)):j=A<.32?Xd.fruit:A<.62?Xd.oak:A<.82?Xd.small:Xd.birch;let ee=Math.floor(Y(h,g,98)*4),te=.88+Y(h,g,99)*.26;a.push(h+.5),o.push(g+.5),s.push(j),c.push(ee),l.push(te),u.push(Math.floor(Y(h,g,100)*4)),e.cell[_]=J.solid,e.height[_]=Math.min(255,Math.round(Qd(j,ee)*te))}let p=Math.ceil(t/32),m=a.length,h=e=>Math.floor(o[e]/32)*p+Math.floor(a[e]/32),g=new Int32Array(p*p+1);for(let e=0;e<m;e++)g[h(e)+1]++;for(let e=0;e<p*p;e++)g[e+1]+=g[e];let _=g.slice(),v={count:m,x:new Float32Array(m),z:new Float32Array(m),y:new Float32Array(m),kind:new Uint8Array(m),variant:new Uint8Array(m),turn:new Uint8Array(m),scale:new Float32Array(m),per:p,chunkStart:g};for(let e=0;e<m;e++){let n=_[h(e)]++;v.x[n]=a[e],v.z[n]=o[e],v.y[n]=d[Math.floor(o[e])*t+Math.floor(a[e])],v.kind[n]=s[e],v.variant[n]=c[e],v.turn[n]=u[e],v.scale[n]=l[e]}return v}function xf(e){let t=new di,n=[],r=[],i=[],a=Jd(e),o=Pu();i.push(o);let s=(e,i,a,s,c,l,u)=>{let d=new Kr(e,i,a),f=new Eo({color:u,map:o});n.push(d),r.push(f);let p=new Ur(d,f);return p.position.set(s,c,l),t.add(p),p};if(a?.block){let e=a.block,t=Ku([e],{[e]:nf.palette.tiles[e]??[10123604]},nf.palette.blocks??{});t.repeat.set(1,1/8),t.offset.y=7/8,i.push(t);let n=s(.32,.32,.32,0,0,.12,16777215).material;n.map=t}else a?.tool&&(s(.065,.6,.065,0,.15,0,9134137),a.tool.kind===`pickaxe`?(s(.46,.09,.09,0,.48,0,11450810),s(.08,.15,.09,.2,.43,0,11450810)):a.tool.kind===`axe`?s(.25,.25,.08,.1,.43,0,11450810):a.tool.kind===`shovel`?s(.2,.26,.055,0,.5,0,11450810):s(.25,.08,.08,.1,.45,0,11450810));return{root:t,dispose(){n.forEach(e=>e.dispose()),r.forEach(e=>e.dispose()),i.forEach(e=>e.dispose())}}}var Sf=`Ближний бой`,Cf=`Магия (снаряд)`,wf=`Дальний бой (снаряд)`,Tf={sword1h:{kind:`sword1h`,family:`sword`,style:`melee`,hands:1,grip:`one`,shape:`melee`,swingSound:`slash`,attackLabel:Sf},sword2h:{kind:`sword2h`,family:`sword`,style:`melee`,hands:2,grip:`two`,shape:`melee`,swingSound:`slash`,attackLabel:Sf,leftHand:{min:-3.6,max:-1.6,pref:-2.6}},spear:{kind:`spear`,family:`spear`,style:`melee`,hands:2,grip:`two`,shape:`sweep`,swingSound:`thrust`,attackLabel:`${Sf}, по площади`,leftHand:{min:-6,max:9,pref:5}},staff1h:{kind:`staff1h`,family:`staff`,style:`magic`,hands:1,grip:`one`,shape:`projectile`,swingSound:null,attackLabel:Cf},staff2h:{kind:`staff2h`,family:`staff`,style:`magic`,hands:2,grip:`two`,shape:`projectile`,swingSound:null,attackLabel:Cf,leftHand:{min:-5,max:9,pref:5}},bow:{kind:`bow`,family:`bow`,style:`ranged`,hands:2,grip:`bow`,shape:`projectile`,swingSound:null,attackLabel:wf},crossbow:{kind:`crossbow`,family:`crossbow`,style:`ranged`,hands:2,grip:`crossbow`,shape:`projectile`,swingSound:null,attackLabel:wf}};function Ef(e){return e?Tf[e]:null}var Df=1.8/32,Of=.06,kf=class{constructor(e=128){m(this,`size`,void 0),m(this,`canvas`,void 0),m(this,`g`,void 0),m(this,`texture`,void 0),m(this,`cx`,0),m(this,`cy`,0),m(this,`rowH`,0),this.size=e;let t=typeof document<`u`?document.createElement(`canvas`):null;if(this.canvas=t,t){t.width=t.height=e,this.g=t.getContext(`2d`);let n=new ea(t);n.magFilter=D,n.minFilter=D,n.generateMipmaps=!1,n.colorSpace=nt,this.texture=n}else this.g=null,this.texture=null}alloc(e,t){this.cx+e>this.size&&(this.cx=0,this.cy+=this.rowH,this.rowH=0);let n=[this.cx,this.cy];if(this.cx+=e,this.rowH=Math.max(this.rowH,t),this.cy+t>this.size)throw Error(`skin atlas full`);return n}box(e,t,n,r,i=0){let[a,o]=this.alloc(2*n+2*e,n+t),s={top:[a+n,o,e,n],bottom:[a+n+e,o,e,n],right:[a,o+n,n,t],front:[a+n,o+n,e,t],left:[a+n+e,o+n,n,t],back:[a+2*n+e,o+n,e,t]},c=this.g;if(c)for(let e of Object.keys(s)){let[t,n,i,a]=s[e];for(let o=0;o<a;o++)for(let s=0;s<i;s++){let l=r(e,s,o,i,a);l&&(c.fillStyle=l,c.fillRect(t+s,n+o,1,1))}}this.texture&&(this.texture.needsUpdate=!0);let l=new Kr((e+2*i)*Df,(t+2*i)*Df,(n+2*i)*Df),u=[`left`,`right`,`top`,`bottom`,`front`,`back`],d=l.getAttribute(`uv`),f=this.size;for(let e=0;e<6;e++){let[t,n,r,i]=s[u[e]];for(let a=0;a<4;a++){let o=e*4+a,s=Of+d.getX(o)*(r-2*Of),c=Of+(1-d.getY(o))*(i-2*Of);d.setXY(o,(t+s)/f,1-(n+c)/f)}}return d.needsUpdate=!0,l}material(){let e=new Eo({map:this.texture,alphaTest:.5,side:0});return e.onBeforeCompile=e=>{let t=e=>K[e].replace(`varying vec2 vMapUv;`,`centroid varying vec2 vMapUv;`);e.vertexShader=e.vertexShader.replace(`#include <uv_pars_vertex>`,t(`uv_pars_vertex`)),e.fragmentShader=e.fragmentShader.replace(`#include <uv_pars_fragment>`,t(`uv_pars_fragment`))},e.customProgramCacheKey=()=>`skin-centroid`,e}dispose(){this.texture?.dispose()}};function Af(e,t,n){let r=e*374761393+t*668265263+n*1442695041|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296}function jf(e,t,n,r){let i=Af(t,n,r);return i<.7?e[0]:i<.88?e[1%e.length]:e[2%e.length]}function Mf(e,t){let n=[];for(let r=0;r<e;r++)for(let i=0;i<e;i++){let a=(i+(e-1-r))/2,o=i-(e-1-r);n.push(t(i,r,a,o))}return{n:e,px:n}}function Nf(e,t){let{n,px:r}=e,i=[...r];for(let e=0;e<n;e++)for(let a=0;a<n;a++)r[e*n+a]||[[1,0],[-1,0],[0,1],[0,-1]].some(([i,o])=>{let s=a+i,c=e+o;return s>=0&&c>=0&&s<n&&c<n&&r[c*n+s]&&r[c*n+s]!==t})&&(i[e*n+a]=t);return{n,px:i}}var Pf={hi:`#eef0f4`,mid:`#c4c8d0`,lo:`#8a8e98`,dark:`#4a4c56`},Ff={hi:`#a8763e`,mid:`#835a2c`,lo:`#5e3e1c`},If={hi:`#ffe27a`,mid:`#e0b034`,lo:`#a07818`},Lf=`#2a2026`;function Rf(e){return e<0?Pf.hi:e===0?Pf.mid:Pf.lo}var zf=Nf(Mf(16,(e,t,n,r)=>{let i=Math.abs(r);return n>=14.5?i<=0?Pf.hi:``:n>=5.5&&i<=1?Rf(r):n>=4&&n<5.5&&i<=3?i===3?If.lo:If.mid:n>=1.5&&n<4&&i<=0?n<2.5?Ff.lo:Ff.mid:n>=1.5&&n<4&&i===1?Ff.lo:n>=.5&&n<1.5&&i<=1?If.mid:``}),Lf),Bf=Nf(Mf(24,(e,t,n,r)=>{let i=Math.abs(r);return n>=22?i<=0?Pf.hi:``:n>=21&&i<=1?Rf(r):n>=7.5&&i<=2?r===0?Pf.dark:r<0?Pf.hi:i===2?Pf.lo:Pf.mid:n>=6&&n<7.5&&i<=4?i===4?Pf.dark:Pf.lo:n>=2&&n<6&&i<=1?Math.round(n*2)%2==0?Ff.lo:`#3a2a20`:n>=.5&&n<2&&i<=2?Pf.lo:``}),Lf),Vf=Nf(Mf(30,(e,t,n,r)=>{let i=Math.abs(r);return n>=28.5?i===0?Pf.hi:``:n>=25&&i<=1||n>=23&&n<25&&i<=2?Rf(r):n>=22&&n<23&&i<=1?Pf.dark:n>=20.5&&n<22&&i<=1?`#d8d0b8`:n>=.5&&n<20.5&&i<=0?Math.floor(n)%5==0?Ff.lo:Ff.hi:n>=.5&&n<20.5&&i===1&&r>0?Ff.mid:``}),Lf),Hf=Nf(Mf(16,(e,t,n,r)=>{let i=Math.abs(r);return n>=12&&n<=14.5&&i<=1?r<0||n>14?`#ffe090`:`#ff9a30`:n>=11&&n<12&&i<=2?i===2?If.lo:If.mid:n>=1&&n<11&&i<=0?Math.floor(n)%4==0?Ff.lo:Ff.hi:n>=1&&n<11&&i===1&&r>0?Ff.lo:``}),Lf),Uf=Nf(Mf(26,(e,t,n,r)=>{let i=Math.abs(r);return n>=21&&n<=24.5&&i<=2&&!(i===2&&(n<21.5||n>24))?r<0?`#c8ecff`:i===2?`#2a64c0`:`#4aa0f0`:n>=19.5&&n<21&&i<=3?i>=2?If.lo:If.mid:n>=.5&&n<19.5&&i<=0?Math.floor(n)%6==0?If.mid:Ff.mid:n>=.5&&n<19.5&&i===1&&r>0?Ff.lo:``}),Lf);function Wf(e){let t=Array(400).fill(``),n=(e,n,r)=>{e>=0&&n>=0&&e<20&&n<20&&(t[n*20+e]=r)};for(let t=1;t<19;t++){let r=(t-9.5)/9,i=Math.round(5+r*r*5);n(i,t,Math.abs(r)<.18?`#3a2a20`:Ff.mid),n(i+1,t,Math.abs(r)<.18?`#5a4030`:Ff.lo),e&&n(11,t,`#f0ece0`)}return Nf({n:20,px:t},Lf)}function Gf(e){let t=Array(400).fill(``),n=(e,n,r)=>{e>=0&&n>=0&&e<20&&n<20&&(t[n*20+e]=r)};for(let e=3;e<=18;e++)n(e,9,Ff.hi),n(e,10,Ff.mid);for(let e=14;e<=18;e++)n(e,11,Ff.lo);n(17,12,Ff.lo),n(18,12,Ff.lo),n(12,11,Pf.dark),n(12,12,Pf.dark);for(let e=4;e<=15;e++)n(4,e,e===9||e===10?Pf.dark:Pf.lo);for(let e=5;e<=14;e++)n(5,e,Pf.mid);if(e){for(let e=5;e<=10;e++)n(e,8,`#e8e4d8`);for(let e=1;e<=10;e++)n(e,7,e<=2?Pf.hi:e>=9?`#4070c0`:Ff.lo)}else for(let e=5;e<=14;e++)n(6,e,`#e8e4d8`);return Nf({n:20,px:t},Lf)}var Kf=Wf(!0),qf=Wf(!1),Jf=Gf(!0),Yf=Gf(!1);function Xf(e,t,n,r){if(e===0||t===0||e===n-1||t===r-1)return(e+t)%3==0?Pf.hi:Pf.lo;let i=(n-1)/2,a=(r-1)/2;if(Math.abs(e-i)<=1&&Math.abs(t-a)<=1)return Math.abs(e-i)<1&&Math.abs(t-a)<1?Pf.hi:Pf.mid;if(t===3||t===r-4)return Pf.dark;let o=Math.floor((e-1)/3);return e%3==0?Ff.lo:o%2?Ff.mid:Ff.hi}var Zf={apprentice:{a:`#3c4ea6`,b:`#5a70cc`,c:`#26306c`,d:`#e0b440`},scout:{a:`#8a5a32`,b:`#a8743e`,c:`#5a3a1e`,d:`#4e6e30`},guard:{a:`#b8bcc6`,b:`#e4e6ec`,c:`#62666e`,d:`#8a6a3a`}};function Qf(e,t){let n=Zf[t]??Zf.guard,r={head:[`................`,`................`,`.....bbbbbb.....`,`....baaaaaab....`,`...baaaaaaaab...`,`...aaddddddaa...`,`...aa......aa...`,`...aa......aa...`,`...aa......aa...`,`...ac......ca...`,`...cc......cc...`,`................`,`................`,`................`,`................`,`................`],body:[`................`,`..bbbb....bbbb..`,`.baaaabbbbaaaab.`,`.aaaaaadaaaaaaa.`,`.aaa.aadaaa.aaa.`,`.cc..aadaaa..cc.`,`.....aadaaa.....`,`.....aadaaa.....`,`.....dddddd.....`,`.....aaaaaa.....`,`.....aaaaaa.....`,`.....cccccc.....`,`................`,`................`,`................`,`................`],hands:[`................`,`................`,`................`,`..bbb.....bbb...`,`..aaa.....aaa...`,`..aaa.....aaa...`,`..ddd.....ddd...`,`.baaab...baaab..`,`.aaaaa...aaaaa..`,`.aaaac...caaaa..`,`.aacc.....ccaa..`,`................`,`................`,`................`,`................`,`................`],feet:[`................`,`................`,`................`,`..bbb.....bbb...`,`..aaa.....aaa...`,`..aaa.....aaa...`,`..ddd.....ddd...`,`..aaa.....aaa...`,`..aaa.....aaa...`,`..aaabb...aaabb.`,`..aaaaa...aaaaa.`,`..ccccc...ccccc.`,`................`,`................`,`................`,`................`]}[e],i=[];for(let e of r)for(let t of e)i.push(t===`.`?``:n[t]);return Nf({n:16,px:i},Lf)}function $f(e,t=3){let n=document.createElement(`canvas`);n.width=n.height=e.n*t;let r=n.getContext(`2d`);for(let n=0;n<e.n;n++)for(let i=0;i<e.n;i++){let a=e.px[n*e.n+i];a&&(r.fillStyle=a,r.fillRect(i*t,n*t,t,t))}return n}var ep=[`#c8916a`,`#bf8862`,`#cf9a72`],tp=`#a8744f`,np=[`#4a3020`,`#553826`,`#3e281a`],rp=[`#d8cfb4`,`#cfc6aa`,`#e0d8c0`],ip=`#b0a68c`,ap=[`#6a4a2e`,`#614329`,`#725034`],op=[`#3a2a1e`,`#33251a`],sp=`#4a321c`;function cp(e,t,n){return e===`left`&&t===0||e===`right`&&t===n-1}var lp=(e,t,n,r)=>{let i=jf(ep,t,n,e.length*7);if(e===`top`)return jf(np,t,n,3);if(e===`bottom`)return tp;if(e===`back`)return n<7?jf(np,t,n,5):i;if(e===`left`||e===`right`)return n<2||(e===`left`?t>=5:t<=2)&&n<6?jf(np,t,n,9):n===4&&(e===`left`?t===3:t===4)?tp:i;if(n<2)return jf(np,t,n,11);if(n===2&&(t===0||t===7))return np[0];if(n===4){if(t===1||t===6)return`#f4f0ea`;if(t===2||t===5)return`#3a2a5a`}return n===3&&(t===1||t===2||t===5||t===6)?`#5a3a24`:n===5&&(t===3||t===4)?tp:n===6&&t>=3&&t<=4?`#8a4a3a`:i},up=(e,t,n,r)=>{if(e===`top`||e===`bottom`)return e===`top`?rp[0]:ap[0];if(n>=10)return n===10?sp:jf(ap,t,n,13);if(e===`front`){if(n===0&&t>=3&&t<=4)return ep[0];if(n===1&&t>=3&&t<=4)return tp;if((n===2||n===4)&&t===4)return ip;if(n===10&&t===4)return`#c0a050`}return cp(e,t,r)&&n>0?ip:jf(rp,t,n,17)};function dp(e){return(t,n,r)=>t===`top`?rp[0]:t===`bottom`?tp:r<4?jf(rp,n,r,e):r===4?ip:jf(ep,n,r,e+3)}function fp(e){return(t,n,r)=>t===`top`?ap[0]:t===`bottom`?op[1]:r>=10?jf(op,n,r,e):r===9?`#4e3826`:jf(ap,n,r,e+5)}var pp={human:{head:lp,torso:up,armR:dp(21),armL:dp(23),legR:fp(31),legL:fp(37)}};function mp(e,t){return Af(e,t,99)>.93}function hp(e){let t=Zf[e]??Zf.guard;t.a,t.b,t.c;let n=(e,n,r)=>Af(e,n,r)<.82?t.a:Af(e,n,r+1)<.6?t.b:t.c,r=e===`guard`,i=e===`apprentice`;return{helmet:(e,a,o,s,c)=>{if(e===`bottom`)return``;if(e===`top`)return n(a,o,1);if(e===`front`)return o===0?t.c:o===1?t.d:i&&(a===0||a===s-1)&&o<c?t.c:r&&(a===0||a===s-1)&&o<7?t.a:r&&o>=2&&o<=5&&(a===3||a===4)?o===2?t.b:t.a:!r&&!i&&(a===0||a===s-1)&&o<6?t.c:``;if(e===`back`)return o<(i?c:7)?o===1?t.d:n(a,o,3):``;let l=cp(e,a,s);return o===1?t.d:i?l?t.c:n(a,o,5):r?o<7?mp(a,o)?t.b:n(a,o,5):``:o<6?n(a,o,5):``},torso:(e,a,o,s)=>e===`top`?n(a,o,7):e===`bottom`?t.c:o===9?i?t.d:r?t.c:t.d:e===`front`||e===`back`?i&&(a===3||a===4)&&e===`front`?t.d:r&&o===0?t.b:r&&(a===0||a===s-1)||!r&&!i&&e===`front`&&(a+o)%5==0&&o<9?t.c:r&&mp(a,o)?t.b:n(a,o,e===`front`?9:10):n(a,o,11),shoulder:(e,a,o)=>e===`top`?r?t.b:n(a,o,13):e===`bottom`?``:o===0?r?t.b:t.d:o===5?i?t.d:t.c:n(a,o,15),glove:(e,a,o)=>e===`top`?``:e===`bottom`?t.c:o===0?t.d:o===1?i?t.d:t.c:r&&mp(a,o)?t.b:n(a,o,17),boot:(e,i,a,o,s)=>e===`top`?``:e===`bottom`?t.c:a===0?t.d:a===s-1?t.c:r&&a===2?t.b:n(i,a,19)}}var gp=.048,_p=.064,vp=new W;function yp(e,t,n,r=gp,i=1){let{n:a}=e,o=[],s=[],c=[],l=(t,n)=>t>=0&&n>=0&&t<a&&n<a&&!!e.px[n*a+t],u=(e,t,n,r,i,a)=>{for(let l of[e,t,n,e,n,r])o.push(l[0],l[1],l[2]),s.push(i[0],i[1],i[2]),c.push(vp.r*a,vp.g*a,vp.b*a)},d=i*r/2;for(let i=0;i<a;i++)for(let o=0;o<a;o++){let s=e.px[i*a+o];if(!s)continue;vp.set(s).convertSRGBToLinear();let c=(o-t-.5)*r,f=c+r,p=(n-i+.5)*r,m=p-r;u([c,m,d],[f,m,d],[f,p,d],[c,p,d],[0,0,1],1),u([f,m,-d],[c,m,-d],[c,p,-d],[f,p,-d],[0,0,-1],.92),l(o+1,i)||u([f,m,d],[f,m,-d],[f,p,-d],[f,p,d],[1,0,0],.8),l(o-1,i)||u([c,m,-d],[c,m,d],[c,p,d],[c,p,-d],[-1,0,0],.8),l(o,i-1)||u([c,p,d],[f,p,d],[f,p,-d],[c,p,-d],[0,1,0],1.05),l(o,i+1)||u([c,m,-d],[f,m,-d],[f,m,d],[c,m,d],[0,-1,0],.7)}let f=new jr;return f.setAttribute(`position`,new G(o,3)),f.setAttribute(`normal`,new G(s,3)),f.setAttribute(`color`,new G(c,3)),f.computeBoundingSphere(),f}var bp=null;function xp(){return bp??(bp=new Eo({vertexColors:!0}))}var Sp={sword1h:{s:zf,g:[3,12]},sword2h:{s:Bf,g:[4,19]},spear:{s:Vf,g:[10,19]},staff1h:{s:Hf,g:[3,12]},staff2h:{s:Uf,g:[7,18]}};function Cp(e){let t=new Ur(e,xp());return t.castShadow=!0,t}var wp=new H(0,9*_p,-4.6*_p),Tp=new H(0,-8*_p,-4.6*_p),Ep=new H(.9*_p,.5*_p,0),Dp=.3,Op=null;function kp(e){let t=new di,n=[],r=e=>{n.push(e);let r=Cp(e);return t.add(r),r},i=()=>{},a=()=>{},o=Sp[e];if(o){let e=r(yp(o.s,o.g[0],o.g[1]));e.rotation.order=`YZX`,e.rotation.set(0,Math.PI/2,Math.PI/4)}else if(e===`bow`){let e=r(yp(qf,6,10,_p));e.rotation.set(0,Math.PI/2,0);let i=new Kr(1,1,1);n.push(i);let o=Op??(Op=new Eo({color:15789280})),s=[0,1].map(()=>{let e=new Ur(i,o);return e.castShadow=!0,t.add(e),e}),c=jp(!1);n.push(c);let l=Cp(c);l.visible=!1,t.add(l);let u=new H,d=new H,f=new H,p=new H,m=new H(0,0,1),h=new H(0,1,0),g=.55*gp,_=(e,t,n)=>{p.subVectors(n,t);let r=p.length();e.position.addVectors(t,n).multiplyScalar(.5),e.quaternion.setFromUnitVectors(h,p.multiplyScalar(1/(r||1))),e.scale.set(g,r+g,g)};a=(t,n,r)=>{let i=Math.max(0,Math.min(1,r));e.scale.set(1,1-.05*i,1+.25*i),u.copy(wp).multiply(e.scale),d.copy(Tp).multiply(e.scale),f.lerpVectors(u,d,.5),f.y=Ep.y;let a=t&&t.z<f.z?t:f;_(s[0],u,a),_(s[1],a,d),l.visible=n,n&&(p.subVectors(Ep,a).normalize(),l.quaternion.setFromUnitVectors(m,p),l.position.copy(a).addScaledVector(p,Dp))},a(null,!1,0)}else if(e===`crossbow`){let e=r(yp(Jf,12,11,gp,3)),t=r(yp(Yf,12,11,gp,3));for(let n of[e,t])n.rotation.set(0,Math.PI/2,0);t.visible=!1,i=n=>{e.visible=n!==`empty`,t.visible=n===`empty`}}return{root:t,setState:i,setDraw:a,dispose:()=>n.forEach(e=>e.dispose())}}function Ap(){let e={n:12,px:[]};for(let t=0;t<12;t++)for(let n=0;n<12;n++)e.px.push(n<10?Xf(n,t,10,12):``);let t=yp(e,9/2,11/2,Df,1.2),n=new di,r=Cp(t);return n.add(r),{root:n,dispose:()=>t.dispose()}}function jp(e){let t=Array(256).fill(``),n=e?11:14,r=Math.round((16-n)/2);for(let i=r;i<r+n;i++)t[128+i]=i>=r+n-2?`#d8dce4`:e?`#5a3e22`:`#a8763e`;let i=e?`#4070c0`:`#e8e4e0`;t[112+r]=i,t[144+r]=i,t[112+r+1]=i,t[144+r+1]=i,t[112+r+n-2]=`#9a9ea8`,t[144+r+n-2]=`#9a9ea8`;let a=yp({n:16,px:t},8,8,.04),o=a.clone().rotateY(-Math.PI/2),s=a.clone().rotateY(-Math.PI/2).rotateZ(Math.PI/2);a.dispose();let c=Mp([o,s]);return o.dispose(),s.dispose(),c}function Mp(e){let t=[],n=[],r=[];for(let i of e){let e=i.index?i.toNonIndexed():i;t.push(...e.getAttribute(`position`).array),n.push(...e.getAttribute(`normal`).array);let a=e.getAttribute(`color`);if(a)r.push(...a.array);else for(let t=0;t<e.getAttribute(`position`).count;t++)r.push(1,1,1)}let i=new jr;return i.setAttribute(`position`,new G(t,3)),i.setAttribute(`normal`,new G(n,3)),i.setAttribute(`color`,new G(r,3)),i.computeBoundingSphere(),i}var Np=e=>{let t=Math.max(0,Math.min(1,e));return t*t*(3-2*t)},Pp=Math.PI/180,Fp=(e,t,n,r,i)=>({g:new H(e,t,n),el:r*Pp,yaw:i*Pp});function Ip(e,t,n,r){return e.g.lerpVectors(t.g,n.g,r),e.el=t.el+(n.el-t.el)*r,e.yaw=t.yaw+(n.yaw-t.yaw)*r,e}var Lp=new H(-6,22,0),Rp=new H(6,22,0),zp=9,Bp=17*Df,Vp={sword2h:{idle:Fp(.5,16.5,5.5,58,-12),run:Fp(.5,16,6,36,-24),a:Fp(.5,26.5,2.5,140,-4),b:Fp(.5,14,8,-28,0)},spear:{idle:Fp(-1.5,15,4.5,8,6),run:Fp(-1.5,15.5,4.5,18,8),a:Fp(-2.5,16,1.5,4,4),b:Fp(-.5,16.5,8.5,2,0)},staff2h:{idle:Fp(-2.5,14.5,4.5,78,10),run:Fp(-2,15,5,55,15),a:Fp(-1,24,4,95,4),b:Fp(0,19,8.5,15,0)}},Hp={g:new H,el:0,yaw:0},Up={g:new H,el:0,yaw:0},Wp=new H,Gp=new H,Kp=new H,qp=new H,Jp=new H,Yp=new H,Xp=new H,Zp=new H,Qp=new H,$p=new H,em=new H,tm=new H,nm=new yt,rm=new Sn,im=1.35,am=class{setBuildItem(e){e!==this.buildId&&(this.buildId=e,this.buildHeld?.root.removeFromParent(),this.buildHeld?.dispose(),this.buildHeld=e?xf(e):null,this.buildHeld&&this.holderR.add(this.buildHeld.root))}buildPose(e,t,n){this.parts.armR.rotation.x=-.65+Math.max(-.7,Math.min(.7,n*.2))-(e?(Math.sin(t*13)+1)*.55:0),this.parts.head.rotation.x=-Math.max(-.5,Math.min(.5,n*.12))}constructor(e=`human`,t=!0){m(this,`shadows`,void 0),m(this,`root`,new di),m(this,`body`,new di),m(this,`tumble`,new di),m(this,`parts`,{}),m(this,`atlas`,void 0),m(this,`mat`,void 0),m(this,`geos`,[]),m(this,`armor`,{}),m(this,`equipIds`,{}),m(this,`weapon`,null),m(this,`weaponKind`,null),m(this,`wtype`,null),m(this,`shield`,null),m(this,`holderR`,new di),m(this,`buildHeld`,null),m(this,`buildId`,null),m(this,`holderL`,new di),m(this,`shieldMount`,new di),this.shadows=t;let n=pp[e]??pp.human;this.atlas=new kf(128),this.mat=this.atlas.material(),this.root.add(this.tumble),this.tumble.add(this.body);let r=(e,t)=>{let n=new di;return n.position.set(t[0]*Df,t[1]*Df,t[2]*Df),this.body.add(n),this.parts[e]=n,n},i=(e,n,r,i,a,o)=>{let s=this.atlas.box(n,r,i,a);this.geos.push(s);let c=new Ur(s,this.mat);return c.position.set(o[0]*Df,o[1]*Df,o[2]*Df),c.castShadow=t,e.add(c),c};i(r(`legR`,[-2,12,0]),4,12,4,n.legR,[0,-6,0]),i(r(`legL`,[2,12,0]),4,12,4,n.legL,[0,-6,0]),i(r(`torso`,[0,12,0]),8,12,4,n.torso,[0,6,0]),i(r(`head`,[0,24,0]),8,8,8,n.head,[0,4,0]),i(r(`armR`,[-6,22,0]),4,12,4,n.armR,[0,-4,0]),i(r(`armL`,[6,22,0]),4,12,4,n.armL,[0,-4,0]),this.holderR.position.set(0,-9*Df,0),this.parts.armR.add(this.holderR),this.holderL.position.set(0,-9*Df,0),this.parts.armL.add(this.holderL),this.shieldMount.position.set(2.9*Df,-6*Df,0),this.parts.armL.add(this.shieldMount)}setEquip(e){for(let t of[`head`,`hands`,`feet`,`body`]){if(this.equipIds[t]===e[t])continue;this.equipIds[t]=e[t],this.clearArmor(t);let n=Jd(e[t]);n?.armorSet&&this.buildArmor(t,n.armorSet)}if(this.equipIds.main!==e.main){this.equipIds.main=e.main,this.weapon?.dispose(),this.weapon&&this.weapon.root.removeFromParent(),this.weapon=null,this.weaponKind=null,this.wtype=null;let t=Jd(e.main)?.weapon;t&&(this.weapon=kp(t.kind),this.weaponKind=t.kind,this.wtype=Ef(t.kind),this.mountWeapon())}this.equipIds.off!==e.off&&(this.equipIds.off=e.off,this.shield&&(this.shield.root.removeFromParent(),this.shield.dispose(),this.shield=null),e.off&&(this.shield=Ap(),this.shield.root.rotation.set(0,Math.PI/2,0),this.shieldMount.add(this.shield.root))),this.shadows&&this.root.traverse(e=>e.isMesh?e.castShadow=!0:null)}get weaponType(){return this.weaponKind}mountWeapon(){let e=this.weapon;if(!e)return;let t=this.weaponKind,n=e.root;n.position.set(0,0,0),n.rotation.set(0,0,0),t===`bow`||this.wtype?.grip===`two`?this.body.add(n):t===`crossbow`?(n.rotation.set(Math.PI/2,0,0),n.position.set(.5*Df,0,0),this.holderR.add(n)):(n.rotation.set(Math.PI/2,0,0),this.holderR.add(n))}buildArmor(e,t){let n=hp(t),r=new kf(64),i=r.material(),a=[],o=[],s=(e,t,n,s,c,l,u)=>{let d=r.box(t,n,s,c,l);a.push(d);let f=new Ur(d,i);f.position.set(u[0]*Df,u[1]*Df,u[2]*Df),f.castShadow=this.shadows,this.parts[e].add(f),o.push(f)},c=t===`guard`;e===`head`&&s(`head`,8,8,8,n.helmet,c?.85:.65,[0,4,0]),e===`body`&&(s(`torso`,8,10,4,n.torso,c?.7:.55,[0,7,0]),s(`armR`,4,6,4,n.shoulder,c?.75:.6,[0,-1,0]),s(`armL`,4,6,4,n.shoulder,c?.75:.6,[0,-1,0])),e===`hands`&&(s(`armR`,4,5,4,n.glove,.4,[0,-7.5,0]),s(`armL`,4,5,4,n.glove,.4,[0,-7.5,0])),e===`feet`&&(s(`legR`,4,5,4,n.boot,.4,[0,-9.5,0]),s(`legL`,4,5,4,n.boot,.4,[0,-9.5,0])),this.armor[e]={meshes:o,atlas:r,mat:i,geos:a}}clearArmor(e){let t=this.armor[e];if(t){for(let e of t.meshes)e.removeFromParent();t.geos.forEach(e=>e.dispose()),t.mat.dispose(),t.atlas.dispose(),delete this.armor[e]}}pose(e){let t=this.parts;for(let e of Object.keys(t))t[e].rotation.set(0,0,0);t.torso.position.set(0,12*Df,0),this.body.position.set(0,0,0),this.body.rotation.set(0,0,0);let n=this.weaponKind,r=this.wtype?.grip??null,i=Math.sin(e.walk),a=e.moving,o=i*.75*a;t.legR.rotation.x=o,t.legL.rotation.x=-o;let s=-i*.6*a,c=i*.6*a,l=Math.sin(e.time*1.6)*.03;if(t.armR.rotation.z=-.04-l,t.armL.rotation.z=.04+l,r===`one`?s=this.oneHandStance(n,i,a,l):n&&(s=s*.5-.3),n===`bow`&&(s=-i*.4*a),n===`crossbow`&&(s=-1.1,c=-1.1,t.armL.rotation.y=.5),this.shield&&(c=c*.5-.2),e.airborne){let n=Math.max(-1,Math.min(1,e.vy/4));t.legR.rotation.x=-.35+n*.15,t.legL.rotation.x=.2-n*.1,t.armR.rotation.z-=.35,t.armL.rotation.z+=.35}if(t.armR.rotation.x=s,t.armL.rotation.x=c,t.head.rotation.x=0,this.weapon&&n===`crossbow`&&this.weapon.setState(`loaded`),this.weapon&&n===`bow`&&!e.attack){let n=Math.abs(Math.cos(e.walk))*.5*a,r=Qp.set(1,15.5+n,6.5);this.aimArm(t.armL,Xp.set(6,22,0),r,1),this.placeBow(r,0),this.weapon.setDraw(null,!1,0)}r===`two`?this.twoHandPose(e,l):e.attack&&this.attackPose(e.attack.t,e.attack.hitAt),this.flipPose(e.flip??0,r===`two`)}oneHandStance(e,t,n,r){let i=this.weapon?.root;return e===`staff1h`?(i&&(i.rotation.set(.15+.75*n,0,0),i.position.set(0,0,2.4*Df)),-.12-r*2+(-.18-t*.3)*n):(i&&(i.rotation.set(Math.PI/2+.42-.6*n,0,0),i.position.set(0,0,0)),-.28-r*2+(-.24-t*.25)*n)}twoHandPose(e,t){let n=this.weaponKind,r=Vp[n];if(!r)return;let i=this.parts,a=e.moving,o=Ip(Hp,r.idle,r.run,a);o.g.y+=Math.abs(Math.cos(e.walk))*.7*a+t*8*(1-a);let s=o,c=e.attack;if(c){let e=c.t,t=c.hitAt,a=Math.min(1,e/Math.max(.01,t)),l=e<=t?0:Math.min(1,(e-t)/Math.max(.01,1-t)),u=Np(a/.7),d=Np((a-.7)/.3),f=e<=t?0:Np((l-.2)/.8);s=e<=t?Ip(Up,Ip(Up,o,r.a,u),r.b,d):Ip(Up,r.b,o,f);let p=e<=t?d:1-f,m=e<=t?u*(1-d):0;n===`sword2h`?(this.body.rotation.x=-m*.08+p*.18,i.legR.rotation.x+=-p*.3,i.legL.rotation.x+=p*.3):n===`spear`?(this.body.position.z=(p*3-m*1.5)*Df,this.body.rotation.y=m*.2,i.legR.rotation.x+=-p*.35,i.legL.rotation.x+=p*.25):(this.body.rotation.x=-m*.06+p*.12,i.head.rotation.x=-m*.15)}this.holdTwoHanded(s)}holdTwoHanded(e){let t=this.parts,n=this.weapon?.root,r=this.wtype?.leftHand;if(!n||!r)return;let i=Wp.set(Math.cos(e.el)*Math.sin(e.yaw),Math.sin(e.el),Math.cos(e.el)*Math.cos(e.yaw)),a=$p.subVectors(e.g,Lp).setLength(zp).add(Lp),o=qp.subVectors(a,Rp),s=i.dot(o),c=s*s-(o.lengthSq()-81),l=Math.max(r.min,Math.min(r.max,-s));if(c>=0){let e=Math.sqrt(c),t=1/0;for(let n of[-s-e,-s+e]){let e=Math.max(r.min,Math.min(r.max,n)),i=Math.abs(e-n)*10+Math.abs(e-r.pref);i<t&&(t=i,l=e)}}let u=tm.copy(a).addScaledVector(i,l);this.aimArm(t.armR,Lp,a,1),this.aimArm(t.armL,Rp,u,1);let d=Gp.set(1,0,0).addScaledVector(i,-i.x);d.lengthSq()<1e-4&&d.set(0,0,1).addScaledVector(i,-i.z),d.normalize();let f=Kp.crossVectors(d,i);n.quaternion.setFromRotationMatrix(rm.makeBasis(d,i,f)),n.position.copy(a).multiplyScalar(Df),n.scale.setScalar(1)}flipPose(e,t){let n=this.tumble;if(e<=0||e>=1){n.rotation.set(0,0,0),n.position.set(0,0,0);return}let r=Np(e)*Math.PI*2;n.rotation.set(r,0,0),n.position.set(0,Bp*(1-Math.cos(r)),-Bp*Math.sin(r));let i=Math.sin(Math.PI*e),a=this.parts;a.legR.rotation.x=a.legR.rotation.x*(1-i)-1.25*i,a.legL.rotation.x=a.legL.rotation.x*(1-i)-1.1*i,a.head.rotation.x+=.35*i,!t&&this.weaponKind!==`bow`&&(a.armR.rotation.x=a.armR.rotation.x*(1-i)-.9*i,a.armL.rotation.x=a.armL.rotation.x*(1-i)-.9*i,a.armR.rotation.z*=1-i,a.armL.rotation.z*=1-i)}aimArm(e,t,n,r){let i=qp.subVectors(t,n).normalize(),a=Jp.set(0,1,0).addScaledVector(i,-i.y).normalize(),o=Yp.crossVectors(i,a);nm.setFromRotationMatrix(rm.makeBasis(o,i,a)),e.quaternion.slerp(nm,r)}placeBow(e,t){let n=this.weapon.root;n.position.copy(e).multiplyScalar(Df),n.rotation.set(-t,0,Math.PI/2,`XYZ`),n.scale.setScalar(im)}bowPose(e,t){let n=this.parts,r=e=>{let t=Math.max(0,Math.min(1,e));return t*t*(3-2*t)},i=Math.min(1,e/Math.max(.01,t)),a=e<=t?0:Math.min(1,(e-t)/Math.max(.01,1-t)),o=e<=t,s=o?r(i/.25):1-r((a-.3)/.7),c=o?r((i-.25)/.75):0,l=o?0:r(a/.25);n.legL.rotation.x+=-.12*s,n.legR.rotation.x+=.1*s,n.head.rotation.x=.08*s;let u=Qp.set(1,15.5,6.5).lerp(em.set(1,20,9.5),s);this.aimArm(n.armL,Xp.set(6,22,0),u,1),this.placeBow(u,0);let d=this.weapon?.root;if(!d)return;this.root.updateMatrixWorld(!0);let f=o&&i>.12,p=4.8+2.7*c,m=tm.set(u.x-.5,u.y+.9,u.z-p),h=$p.copy(m);o||h.set(u.x-2-3*l,u.y+.5,u.z-4.6-2.5*l);let g=o?Math.min(1,i/.15):s;this.aimArm(n.armR,Zp.set(-6,22,0),h,g);let _=this.body.localToWorld(m.multiplyScalar(Df));d.worldToLocal(_),this.weapon.setDraw(f?_:null,f,c)}attackPose(e,t){let n=this.parts,r=this.weaponKind,i=Math.min(1,e/Math.max(.01,t)),a=e<=t?0:Math.min(1,(e-t)/Math.max(.01,1-t)),o=e=>e*e*(3-2*e),s=e<=t?o(i):1-o(a),c=this.weapon?.root;switch(r){case null:case`sword1h`:{c&&(c.rotation.x=Math.PI/2+(c.rotation.x-Math.PI/2)*(e<=t?1-Math.min(1,i*3):a));let r=e<=t?o(i):0,s=e<=t?0:1-o(a);n.armR.rotation.x=-.3-r*2.1-s*.9+0,n.armR.rotation.z=-.04-r*.5+s*.35,n.armR.rotation.y=s*.5,this.body.rotation.y=-r*.25+s*.3,e>t&&a<.25&&(n.armR.rotation.x=-1.4+a*2);break}case`staff1h`:c&&(c.rotation.x+=(Math.PI/2-c.rotation.x)*s,c.position.z*=1-s),n.armR.rotation.x=-.3-s*1.15,n.armR.rotation.z=-.04+s*.12,this.body.rotation.y=-s*.1;break;case`bow`:this.bowPose(e,t);break;case`crossbow`:{let r=e>t?a:0,i=Math.sin(Math.min(1,r)*Math.PI);n.armR.rotation.x=-Math.PI/2+i*.9+0,n.armL.rotation.x=-Math.PI/2+i*1.2,n.armL.rotation.y=.55-i*.2,e>t&&a<.08&&(this.body.rotation.x=-.06),this.weapon&&this.weapon.setState(e<=t||r>.8?`loaded`:`empty`);break}}}dispose(){for(let e of Object.keys(this.armor))this.clearArmor(e);this.weapon?.dispose(),this.buildHeld?.dispose(),this.shield?.dispose(),this.geos.forEach(e=>e.dispose()),this.mat.dispose(),this.atlas.dispose()}},om=[`#d8b85a`,`#cca94c`,`#e4c86c`],sm=`#8a6a3a`,cm=[`#8a5e30`,`#7a5228`,`#966838`],lm=[`#8e8e94`,`#82828a`,`#9a9aa0`],um=[`#c8b48a`,`#bca87e`,`#d4c096`],dm=(e,t,n)=>e===`top`||e===`bottom`?jf(om,t,n,3):n===2||n===7?sm:jf(om,t,n,e.length),fm=(e,t,n)=>jf(cm,t,n,e.length+5),pm=(e,t,n,r,i)=>e===`top`&&(t===0||n===0||t===r-1||n===i-1)?`#6e6e74`:jf(lm,t,n,e.length+9),mm=(e,t,n)=>{if(e===`front`){if(n===2&&(t===1||t===3)||n===3&&t===2||n===2&&(t===4||t===6)||n===3&&t===5)return`#3a2a1e`;if(n===5&&t>=2&&t<=4)return`#6a5030`}return e===`top`&&(t===3||n===3)?sm:jf(um,t,n,e.length+13)},hm=class{constructor(e=!0){m(this,`root`,new di),m(this,`pivot`,new di),m(this,`atlas`,new kf(64)),m(this,`mat`,void 0),m(this,`geos`,[]),this.mat=this.atlas.material(),this.root.add(this.pivot);let t=(t,n,r,i,a,o=0)=>{let s=this.atlas.box(t,n,r,i);this.geos.push(s);let c=new Ur(s,this.mat);return c.position.set(o*Df,(a+n/2)*Df,0),c.castShadow=e,c.receiveShadow=!0,c};this.root.add(t(12,2,12,pm,0)),this.pivot.add(t(2,11,2,fm,2)),this.pivot.add(t(8,10,6,dm,12)),this.pivot.add(t(18,2,2,fm,18)),this.pivot.add(t(7,7,7,mm,22)),this.pivot.position.y=2*Df;for(let e of this.pivot.children)e.position.y-=2*Df}wobble(e,t,n,r){let i=Math.sin(e*Math.PI*4+r*0)*e*.22;this.pivot.rotation.set(n*i,0,-t*i)}dispose(){this.geos.forEach(e=>e.dispose()),this.mat.dispose(),this.atlas.dispose()}},gm=[{id:`human`,name:`Человек`,desc:`Выносливые и разносторонние. Владеют любым оружием и доспехом без штрафов.`,available:!0,base:{maxHp:100,physDef:0,moveSpeed:4.6,physPower:1,magicPower:1},skin:`human`},{id:`orc`,name:`Орк`,desc:`Скоро.`,available:!1,base:{maxHp:120,physDef:2,moveSpeed:4.4,physPower:1.05,magicPower:.9},skin:`human`},{id:`light_elf`,name:`Светлый эльф`,desc:`Скоро.`,available:!1,base:{maxHp:90,physDef:0,moveSpeed:4.8,physPower:.95,magicPower:1.1},skin:`human`},{id:`dark_elf`,name:`Тёмный эльф`,desc:`Скоро.`,available:!1,base:{maxHp:92,physDef:0,moveSpeed:4.8,physPower:1.05,magicPower:1.05},skin:`human`},{id:`dwarf`,name:`Гном`,desc:`Скоро.`,available:!1,base:{maxHp:115,physDef:3,moveSpeed:4.3,physPower:1,magicPower:.95},skin:`human`}],_m=Object.fromEntries(gm.map(e=>[e.id,e]));function vm(){return gm.filter(e=>e.available)}function ym(e,t,n){return e<t?t:e>n?n:e}var bm=[1,-1,0,0,1,1,-1,-1],xm=[0,0,1,-1,1,-1,1,-1],Sm=[1,1,1,1,Math.SQRT2,Math.SQRT2,Math.SQRT2,Math.SQRT2],Cm=new Float32Array,wm=new Int32Array,Tm=new Uint32Array,Em=new Uint32Array,Dm=0,Om=class{constructor(){m(this,`ids`,[]),m(this,`fs`,[])}push(e,t){let n=this.ids,r=this.fs,i=n.length;for(n.push(e),r.push(t);i>0;){let e=i-1>>1;if(r[e]<=t)break;n[i]=n[e],r[i]=r[e],i=e}n[i]=e,r[i]=t}pop(){let e=this.ids,t=this.fs,n=e[0],r=e.pop(),i=t.pop(),a=e.length;if(a>0){let n=0;for(;;){let r=n*2+1;if(r>=a)break;let o=r+1,s=o<a&&t[o]<t[r]?o:r;if(t[s]>=i)break;e[n]=e[s],t[n]=t[s],n=s}e[n]=r,t[n]=i}return n}get size(){return this.ids.length}};function km(e,t,n){return!e.blocksLocal(t,n)}function Am(e,t,n,r){if(!km(e,n,r))return!1;let i=r*e.size+n;if(i===t)return!0;let a=t%e.size,o=t/e.size|0;if(Math.abs(a-n)>1||Math.abs(o-r)>1)return!1;if(e.passable(t,i))return!0;let s=e.centerY(i)-e.centerY(t);return s<-Ou.lip||s>0&&s<=Ou.doubleJump}function jm(e,t,n){let r=e.centerY(n)-e.centerY(t);return r<=Ou.lip?0:r<=Ou.jump?2:5}function Mm(e,t,n,r,i,a=.35){return Nm(e,t-e.ox,n-e.oz,r-e.ox,i-e.oz,a)}function Nm(e,t,n,r,i,a=.35){let o=Math.hypot(r-t,i-n),s=Math.max(1,Math.ceil(o/.25)),c=o>0?-(i-n)/o:0,l=o>0?(r-t)/o:0,u=e.size,d=Math.floor(n+l*a)*u+Math.floor(t+c*a),f=Math.floor(n-l*a)*u+Math.floor(t-c*a);for(let o=0;o<=s;o++){let p=o/s,m=t+(r-t)*p,h=n+(i-n)*p,g=Math.floor(m+c*a),_=Math.floor(h+l*a),v=Math.floor(m-c*a),y=Math.floor(h-l*a);if(!e.inLocal(g,_)||!e.inLocal(v,y)||!Am(e,d,g,_)||!Am(e,f,v,y))return!1;d=_*u+g,f=y*u+v}return!0}function Pm(e,t,n,r=5){let i=Math.floor(t),a=Math.floor(n);if(km(e,i,a))return[t,n];for(let o=1;o<=r;o++){let r=null,s=1/0;for(let c=-o;c<=o;c++)for(let l=-o;l<=o;l++){if(Math.max(Math.abs(l),Math.abs(c))!==o||!km(e,i+l,a+c))continue;let u=i+l+.5,d=a+c+.5,f=(u-t)**2+(d-n)**2;f<s&&(s=f,r=[u,d])}if(r)return r}return null}function Fm(e,t,n,r,i,a=6e3){let o=Im(e,t-e.ox,n-e.oz,r-e.ox,i-e.oz,a);for(let t=0;t<o.length;t+=2)o[t]+=e.ox,o[t+1]+=e.oz;return o}function Im(e,t,n,r,i,a){let o=Pm(e,r,i);if(!o)return[];if([r,i]=o,Nm(e,t,n,r,i))return[r,i];let s=e.size,c=Math.max(0,Math.min(Math.floor(t),Math.floor(r))-48),l=Math.max(0,Math.min(Math.floor(n),Math.floor(i))-48),u=Math.min(s-1,Math.max(Math.floor(t),Math.floor(r))+48),d=Math.min(s-1,Math.max(Math.floor(n),Math.floor(i))+48),f=u-c+1,p=f*(d-l+1);Cm.length<p&&(Cm=new Float32Array(p),wm=new Int32Array(p),Tm=new Uint32Array(p),Em=new Uint32Array(p),Dm=0),Dm++;let m=(e,t)=>(t-l)*f+(e-c),h=e=>((e/f|0)+l)*s+e%f+c,g=m(Math.floor(t),Math.floor(n)),_=Math.floor(r),v=Math.floor(i),y=m(_,v),b=e=>{let t=Math.abs(e%f+c-_),n=Math.abs((e/f|0)+l-v);return Math.max(t,n)+(Math.SQRT2-1)*Math.min(t,n)},x=new Om;Tm[g]=Dm,Cm[g]=0,wm[g]=-1,x.push(g,b(g));let S=g,C=b(g),w=!1,T=0;for(;x.size&&T++<a;){let t=x.pop();if(Em[t]===Dm)continue;if(Em[t]=Dm,t===y){w=!0;break}let n=b(t);n<C&&(C=n,S=t);let r=t%f+c,i=(t/f|0)+l,a=h(t);for(let n=0;n<8;n++){let o=r+bm[n],s=i+xm[n];if(o<c||s<l||o>u||s>d||!Am(e,a,o,s)||n>=4&&(!Am(e,a,r+bm[n],i)||!Am(e,a,r,i+xm[n])))continue;let f=m(o,s);if(Em[f]===Dm)continue;let p=Cm[t]+Sm[n]+jm(e,a,h(f));Tm[f]===Dm&&p>=Cm[f]||(Tm[f]=Dm,Cm[f]=p,wm[f]=t,x.push(f,p+b(f)))}}let E=w?y:S,D=[];for(let e=E;e!==-1&&e!==g;e=wm[e])D.push(e);D.reverse();let O=[];for(let e of D)O.push(e%f+c+.5,(e/f|0)+l+.5);w&&(O[O.length-2]=r,O[O.length-1]=i);let k=[],A=t,j=n,ee=0;for(;ee<O.length/2;){let t=O.length/2-1;for(;t>ee&&!Nm(e,A,j,O[t*2],O[t*2+1]);)t--;k.push(O[t*2],O[t*2+1]),A=O[t*2],j=O[t*2+1],ee=t+1}return k}function Lm(e,t,n,r,i,a){let o=Math.floor(i),s=Math.floor(a),c={x:Math.floor(t),z:Math.floor(n),y:r,cost:0,parent:-1},l=[c],u=[0],d=new Map,f=-1;for(;u.length&&l.length<6e3;){let t=0,n=1/0;for(let e=0;e<u.length;e++){let r=l[u[e]],i=r.cost+Math.abs(o-r.x)+Math.abs(s-r.z);i<n&&(n=i,t=e)}let r=u.splice(t,1)[0],i=l[r];if(i.x===o&&i.z===s){f=r;break}for(let[t,n]of[[1,0],[-1,0],[0,1],[0,-1]]){let a=i.x+t,o=i.z+n;if(Math.abs(a-c.x)>50||Math.abs(o-c.z)>50||e.terrain.blocksWalker(a,o))continue;let s=i.y+2.2,f=e.floorAt(a+.5,o+.5,s),p=!1;for(let t=0;t<8;t++){if(f<=s&&e.canStand(a+.5,o+.5,f)){p=!0;break}if(s=f-.01,s<i.y-8)break;f=e.support(a+.5,o+.5,s)??-100}if(!p||f<0||f-i.y>2.2)continue;let m=i.cost+1+(f>i.y+.55?2:0),h=`${a},${o},${f}`;(d.get(h)??1/0)<=m||(d.set(h,m),l.push({x:a,z:o,y:f,cost:m,parent:r}),u.push(l.length-1))}}if(f<0)return[];let p=[];for(;l[f].parent>=0;){let e=l[f];p.unshift(e.x+.5,e.z+.5),f=e.parent}return p}var Rm={height:1.35,airTime:.56,airHeight:1.1,airJumps:1,flipTime:.46,buffer:.14,landLag:.08},zm=8*Rm.height/(Rm.airTime*Rm.airTime),Bm=class{constructor(e,t,n){m(this,`w`,void 0),m(this,`x`,void 0),m(this,`z`,void 0),m(this,`y`,void 0),m(this,`vx`,0),m(this,`vz`,0),m(this,`fx`,0),m(this,`fz`,-1),m(this,`radius`,.32),m(this,`moving`,!1),m(this,`anim`,0),m(this,`jumpPhase`,`ground`),m(this,`jumpT`,0),m(this,`jumpV`,0),m(this,`jumpBuf`,0),m(this,`airY0`,0),m(this,`airV0`,0),m(this,`airJumps`,0),m(this,`airJumpT`,-1),m(this,`stepY`,0),m(this,`stuckT`,0),m(this,`stuckX`,0),m(this,`stuckZ`,0),m(this,`stuckRetry`,!1),m(this,`path`,[]),m(this,`pathI`,0),m(this,`attack`,null),m(this,`seq`,0),m(this,`cooldown`,0),m(this,`repath`,0),m(this,`climbTo`,-1/0),this.w=e,this.x=t,this.z=n,this.y=e.terrain.groundY(t,n)}get ground(){return this.w.blocks.floorAt(this.x,this.z,this.y+.55)}support(e,t=this.y){let n=this.radius*.7,r=-1/0;for(let[i,a]of[[0,0],[n,n],[-n,n],[n,-n],[-n,-n]]){let n=this.w.blocks.floorAt(this.x+i,this.z+a,t+e);n<=t+e&&n>r&&(r=n)}return r===-1/0?this.ground:r}get airborne(){return this.jumpPhase===`air`}get jumpY(){return Math.max(0,this.y-this.ground)}requestJump(){this.jumpBuf=Rm.buffer}cancelAttack(){this.attack=null,this.cooldown=0}update(e){let t=this.w,n=t.ctl;this.updateJump(e),this.cooldown>0&&(this.cooldown-=e);let r=n.moveX,i=n.moveZ,a=Math.hypot(r,i)>.08;(a||n.clickMove)&&(t.autoAttack=!1,this.attack&&!this.attack.done&&(this.attack=null)),n.clickMove&&(this.setPath(n.clickMove.x,n.clickMove.z),n.clickMove=null),a&&(this.path.length=0);let o=t.target,s=!1,c=this.fx,l=this.fz;if(o&&(t.autoAttack||n.attackHeld)){let e=t.stats.range+o.radius-.1,n=Math.hypot(o.x-this.x,o.z-this.z);c=(o.x-this.x)/(n||1),l=(o.z-this.z)/(n||1),n>e?!a&&!this.attack&&(!this.path.length||this.repath<=0)&&(this.setPath(o.x-c*(e-.3),o.z-l*(e-.3)),this.repath=.3):(this.path.length=0,s=!a)}else if(n.attackHeld&&!a){let e=n.aimX-this.x,t=n.aimZ-this.z,r=Math.hypot(e,t);r>.05&&(c=e/r,l=t/r),this.path.length=0,s=!0}this.repath-=e,!a&&this.path.length?([r,i]=this.steer(),this.checkStuck(e),this.autoJump(r,i)):this.stuckT=0,s&&!this.attack&&this.cooldown<=0&&this.startAttack(c,l);let u=this.attack;u&&(u.t+=e,this.fx=u.dirX,this.fz=u.dirZ,!u.done&&u.t>=u.dur*u.hitAt&&(u.done=!0,t.resolveAttack(u.weapon,t.stats.hitDamage,u.dirX,u.dirZ)),u.t>=u.dur&&(this.attack=null),u.done||(r=i=0));let d=Math.hypot(r,i);d>1&&(r/=d,i/=d),this.moving=d>.08,this.moving&&!this.attack&&(this.fx=r/Math.max(d,1e-6),this.fz=i/Math.max(d,1e-6));let f=t.stats.moveSpeed,p=1-Math.exp(-30*e);this.vx+=(r*f-this.vx)*p,this.vz+=(i*f-this.vz)*p,this.moveWithTerrain(this.vx*e,this.vz*e),this.followGround(e),(this.moving||Math.hypot(this.vx,this.vz)>.3)&&(this.anim+=e*f*2.2)}autoJump(e,t){let n=Math.hypot(e,t);if(n<.1)return;let r=e/n,i=t/n,a=this.radius+.3,o=-1/0;for(let e of[0,-.8,.8]){let t=this.x+r*a-i*this.radius*e,n=this.z+i*a+r*this.radius*e;o=Math.max(o,this.w.blocks.floorAt(t,n,this.y+Ou.doubleJump))}let s=o-this.y;this.jumpPhase===`ground`&&s>Ou.lip+.01&&s<=Ou.doubleJump?(this.requestJump(),this.climbTo=s>Ou.jump?o:-1/0):this.airborne&&this.airJumps===0&&this.climbTo>this.y&&this.jumpV<1.2&&(this.requestJump(),this.climbTo=-1/0)}checkStuck(e){if(this.stuckT+=e,this.stuckT<.6)return;let t=Math.hypot(this.x-this.stuckX,this.z-this.stuckZ);if(this.stuckX=this.x,this.stuckZ=this.z,this.stuckT=0,t>.25){this.stuckRetry=!1;return}if(this.stuckRetry){this.path.length=0,this.stuckRetry=!1;return}this.stuckRetry=!0;let n=this.path[this.path.length-2],r=this.path[this.path.length-1];this.path=this.w.blocks.columns.size?Lm(this.w.blocks,this.x,this.z,this.y,n,r):Fm(this.w.terrain,this.x,this.z,n,r),this.pathI=0}startAttack(e,t){let n=this.w,r=n.stats,i=r.weapon;this.attack={weapon:i,t:0,dur:r.interval,hitAt:i?.hitAt??.45,done:!1,dirX:e,dirZ:t,seq:++this.seq},this.cooldown=r.interval,this.fx=e,this.fz=t;let a=i?Ef(i.kind)?.swingSound:`slash`;a&&n.fx.sound(a,a===`thrust`?.5:.45)}setPath(e,t){let n=this.w.terrain;Math.hypot(e-this.x,t-this.z)<.2?this.path.length=0:(this.path=this.w.blocks.columns.size?Lm(this.w.blocks,this.x,this.z,this.y,e,t):Mm(n,this.x,this.z,e,t)?[e,t]:Fm(n,this.x,this.z,e,t),this.pathI=0,this.stuckT=0,this.stuckRetry=!1,this.stuckX=this.x,this.stuckZ=this.z)}steer(){for(;this.pathI<this.path.length;){let e=this.path[this.pathI],t=this.path[this.pathI+1],n=e-this.x,r=t-this.z,i=Math.hypot(n,r),a=this.pathI+2>=this.path.length;if(i<(a?.12:.35)){this.pathI+=2;continue}let o=a?Math.min(1,i/.6+.25):1;return[n/i*o,r/i*o]}return this.path.length=0,[0,0]}updateJump(e){this.jumpBuf>0&&this.jumpPhase!==`land`&&(this.jumpBuf-=e),this.jumpT+=e,this.airJumpT>=0&&(this.airJumpT+=e,this.airJumpT>Rm.flipTime&&(this.airJumpT=-1));let t=this.ground;switch(this.jumpPhase){case`ground`:this.jumpBuf>0&&(this.jumpBuf=0,this.w.jumps++,this.takeOff(4*Rm.height/Rm.airTime),this.w.fx.sound(`jump`,.5));break;case`air`:{this.jumpBuf>0&&this.airJumps<Rm.airJumps&&(this.jumpBuf=0,this.airJumps++,this.w.jumps++,this.takeOff(Math.sqrt(2*zm*Rm.airHeight)),this.airJumpT=0,this.w.fx.burst(this.x,this.y-t+.1,this.z,15266040,6,1.6,.1,.3,`smoke`),this.w.fx.sound(`jump`,.42));let e=this.y,n=this.jumpT;this.y=this.airY0+this.airV0*n-.5*zm*n*n,this.jumpV=this.airV0-zm*n,this.jumpV>0&&!this.w.blocks.canStand(this.x,this.z,this.y,this.radius*.8)&&(this.y=e,this.takeOff(0));let r=this.support(.02,e);this.jumpV<=0&&this.y<=r&&(this.y=r,this.land());break}case`land`:this.jumpT>=Rm.landLag&&(this.jumpPhase=`ground`)}}followGround(e){let t=this.support(Ou.lip);this.jumpPhase===`air`?this.stepY=0:t>this.y?(this.stepY-=t-this.y,this.y=t):this.y>t&&(this.y-t>Ou.fall?this.takeOff(0):(this.stepY+=this.y-t,this.y=t)),this.stepY*=Math.exp(-30*e),Math.abs(this.stepY)<.001&&(this.stepY=0)}takeOff(e){this.jumpPhase=`air`,this.jumpT=0,this.airY0=this.y,this.airV0=e,this.jumpV=e}land(){this.jumpV=0,this.airJumps=0,this.jumpPhase=`land`,this.jumpT=0,this.w.fx.burst(this.x,.1,this.z,12101768,8,2.2,.14,.4,`smoke`),this.w.fx.sound(`land`,.5)}moveWithTerrain(e,t){let n=this.w.terrain,r=this.radius,i=this.jumpPhase===`air`,a=this.y,o=(e,t)=>{if(this.w.blocks.changedAt(e,t)||this.w.blocks.changedAt(this.x,this.z)){if(n.blocksLocal(Math.floor(e-n.ox),Math.floor(t-n.oz)))return!1;let r=this.w.blocks.floorAt(e,t,a+(i?.02:Ou.lip));return r<=a+(i?.02:Ou.lip)&&this.w.blocks.canStand(e,t,Math.max(a,r),.02)}return i?!n.blocksLocal(Math.floor(e-n.ox),Math.floor(t-n.oz))&&n.groundY(e,t)<=a+.02:n.canWalk(this.x,this.z,e,t,a,!1)},s=this.x+e,c=e>0?r:-r;e===0||o(s+c,this.z-r*.8)&&o(s+c,this.z+r*.8)?this.x=s:this.vx=0;let l=this.z+t,u=t>0?r:-r;t===0||o(this.x-r*.8,l+u)&&o(this.x+r*.8,l+u)?this.z=l:this.vz=0,this.x=ym(this.x,n.ox+1,n.ox+n.size-1),this.z=ym(this.z,n.oz+1,n.oz+n.size-1)}};function Vm(e,t){let n=new La;n.moveTo(-e,-e),n.lineTo(e,-e),n.lineTo(e,e),n.lineTo(-e,e),n.lineTo(-e,-e);let r=new Ia,i=e-t;r.moveTo(-i,-i),r.lineTo(-i,i),r.lineTo(i,i),r.lineTo(i,-i),r.lineTo(-i,-i),n.holes.push(r);let a=new Co(n);return a.rotateX(-Math.PI/2),a}var Hm=class{constructor(e,t){m(this,`world`,void 0),m(this,`group`,new di),m(this,`hero`,void 0),m(this,`dummies`,[]),m(this,`yaw`,0),m(this,`proj`,new Map),m(this,`arrowGeo`,jp(!1)),m(this,`boltGeo`,jp(!0)),m(this,`sparkGeo`,new Kr(.14,.14,.14)),m(this,`orbGeo`,new Kr(.24,.24,.24)),m(this,`sparkMat`,new _r({color:16756800})),m(this,`orbMat`,new _r({color:6994175})),m(this,`ring`,void 0),m(this,`ringMat`,new _r({color:16732224,transparent:!0,opacity:.9,depthWrite:!1})),m(this,`equipKey`,``),m(this,`mark`,void 0),m(this,`markMat`,new _r({color:15269840,transparent:!0,opacity:.9,depthWrite:!1})),m(this,`markLife`,0),this.world=e,this.hero=new am(_m[e.raceId]?.skin??`human`,t),this.group.add(this.hero.root);for(let n of e.dummies){let r=new hm(t);r.root.position.set(n.x,e.terrain.groundY(n.x,n.z),n.z),this.group.add(r.root),this.dummies.push(r)}this.ring=new Ur(Vm(.62,.1),this.ringMat),this.ring.renderOrder=2,this.group.add(this.ring),this.mark=new Ur(Vm(.32,.07),this.markMat),this.mark.renderOrder=2,this.mark.visible=!1,this.group.add(this.mark),this.yaw=Math.atan2(e.player.fx,e.player.fz)}update(e){let t=this.world,n=t.player,r=t.building.enabled,i=r?{...t.gear.equip,main:null,off:null}:t.gear.equip,a=JSON.stringify(i);a!==this.equipKey&&(this.equipKey=a,this.hero.setEquip(i));let o=Math.atan2(n.fx,n.fz)-this.yaw;o=Math.atan2(Math.sin(o),Math.cos(o)),this.yaw+=o*(1-Math.exp(-18*e));let s=this.hero;s.root.position.set(n.x,n.y+n.stepY,n.z),s.body.rotation.y=0,s.root.rotation.y=this.yaw;let c=Math.hypot(n.vx,n.vz),l=n.attack;s.pose({walk:n.anim,moving:Math.min(1,c/Math.max(1,t.stats.moveSpeed)),airborne:n.airborne,vy:n.jumpV,attack:l?{t:Math.min(1,l.t/l.dur),hitAt:l.hitAt}:null,time:t.time,flip:n.airJumpT>=0?n.airJumpT/Rm.flipTime:0}),s.setBuildItem(r?t.gear.bag[t.building.active]??null:null),r&&s.buildPose(t.building.swinging||t.building.placePulse>0,t.time,(t.building.hit?.pos.y??n.y+1)-n.y-1),t.dummies.forEach((e,n)=>this.dummies[n].wobble(e.wobble,e.wobX,e.wobZ,t.time));let u=t.target;if(this.ring.visible=!!u,u){let e=t.autoAttack;this.ring.position.set(u.x,t.terrain.groundY(u.x,u.z)+.03,u.z),this.ringMat.color.setHex(e?16726576:16764992),this.ringMat.opacity=.7+Math.sin(t.time*(e?10:5))*.25,this.ring.rotation.y=e?t.time*1.5:0,this.ring.scale.setScalar(1+Math.sin(t.time*(e?10:5))*.06)}if(this.markLife>0){this.markLife=n.path.length?Math.max(.35,this.markLife-e*.6):this.markLife-e*3;let t=Math.max(0,this.markLife);this.mark.visible=t>0,this.markMat.opacity=Math.min(1,t)*.9,this.mark.scale.setScalar(.7+t*.5)}this.syncProjectiles()}markMove(e,t){this.mark.position.set(e,this.world.terrain.groundY(e,t)+.04,t),this.markLife=1,this.mark.visible=!0}syncProjectiles(){let e=this.world,t=new Set(e.projectiles);for(let[e,n]of this.proj)t.has(e)||(this.group.remove(n),this.proj.delete(e));for(let t of e.projectiles){let e=this.proj.get(t);e||(e=t.kind===`arrow`?new Ur(this.arrowGeo,xp()):t.kind===`bolt`?new Ur(this.boltGeo,xp()):new Ur(t.kind===`orb`?this.orbGeo:this.sparkGeo,t.kind===`orb`?this.orbMat:this.sparkMat),this.group.add(e),this.proj.set(t,e)),e.position.set(t.x,t.y,t.z),t.kind===`arrow`||t.kind===`bolt`?e.lookAt(t.x+t.dx,t.y+t.dy,t.z+t.dz):e.rotation.set(t.age*7,t.age*9,0)}}dispose(){this.hero.dispose(),this.dummies.forEach(e=>e.dispose());for(let e of[this.arrowGeo,this.boltGeo,this.sparkGeo,this.orbGeo])e.dispose();this.sparkMat.dispose(),this.orbMat.dispose(),this.ring.geometry.dispose(),this.ringMat.dispose(),this.mark.geometry.dispose(),this.markMat.dispose()}},Um=new Sn,Wm=new yt,Gm=new Mn,Km=new H,qm=new H,Jm=new W,Ym=class{constructor(e,t,n,r=64,i=!1,a=!1){m(this,`geometry`,void 0),m(this,`material`,void 0),m(this,`scene`,void 0),m(this,`withFlash`,void 0),m(this,`castShadow`,void 0),m(this,`mesh`,void 0),m(this,`flash`,null),m(this,`count`,0),m(this,`cap`,void 0),m(this,`lift`,!1),this.geometry=e,this.material=t,this.scene=n,this.withFlash=i,this.castShadow=a,this.cap=r,this.mesh=this.create(r)}create(e){let t=new Ti(this.geometry,this.material,e);return t.instanceMatrix.setUsage(ct),t.instanceColor=new _i(new Float32Array(e*3).fill(1),3),t.instanceColor.setUsage(ct),this.withFlash&&(this.flash=new _i(new Float32Array(e),1),this.flash.setUsage(ct),this.geometry.setAttribute(`aFlash`,this.flash)),t.frustumCulled=!1,t.castShadow=this.castShadow,t.receiveShadow=!1,t.count=0,this.scene.add(t),t}begin(){this.count=0}ensure(){if(this.count<this.cap)return;let e=this.mesh,t=this.flash;this.cap*=2,this.scene.remove(e);let n=this.create(this.cap);n.instanceMatrix.array.set(e.instanceMatrix.array),n.instanceColor.array.set(e.instanceColor.array),t&&this.flash&&this.flash.array.set(t.array),e.dispose(),this.mesh=n}push(e,t,n,r,i,a,o,s=16777215,c=0,l=0,u=0,d=1){this.lift&&(t+=Rd(e,n)),this.ensure();let f=this.count++;Km.set(e,t,n),Gm.set(u,r,l,`YXZ`),Wm.setFromEuler(Gm),qm.set(i,a,o),Um.compose(Km,Wm,qm),Um.toArray(this.mesh.instanceMatrix.array,f*16),Jm.setHex(s);let p=this.mesh.instanceColor.array;p[f*3]=Jm.r*d,p[f*3+1]=Jm.g*d,p[f*3+2]=Jm.b*d,this.flash&&(this.flash.array[f]=c)}pushFast(e,t,n,r,i,a,o,s,c,l=0){this.lift&&(t+=Rd(e,n)),this.ensure();let u=this.count++,d=this.mesh.instanceMatrix.array,f=u*16,p=Math.cos(r),m=Math.sin(r);d[f]=p*i,d[f+1]=0,d[f+2]=-m*i,d[f+3]=0,d[f+4]=0,d[f+5]=a,d[f+6]=0,d[f+7]=0,d[f+8]=m*i,d[f+9]=0,d[f+10]=p*i,d[f+11]=0,d[f+12]=e,d[f+13]=t,d[f+14]=n,d[f+15]=1;let h=this.mesh.instanceColor.array;h[u*3]=o,h[u*3+1]=s,h[u*3+2]=c,this.flash&&(this.flash.array[u]=l)}pushAxis(e,t,n,r,i,a,o,s,c,l){this.lift&&(t+=Rd(e,n)),this.ensure();let u=this.count++,d=this.mesh.instanceMatrix.array,f=u*16,p=Math.cos(r),m=Math.sin(r);d[f]=p*i,d[f+1]=0,d[f+2]=-m*i,d[f+3]=0,d[f+4]=0,d[f+5]=a,d[f+6]=0,d[f+7]=0,d[f+8]=m*o,d[f+9]=0,d[f+10]=p*o,d[f+11]=0,d[f+12]=e,d[f+13]=t,d[f+14]=n,d[f+15]=1;let h=this.mesh.instanceColor.array;h[u*3]=s,h[u*3+1]=c,h[u*3+2]=l,this.flash&&(this.flash.array[u]=0)}end(){this.mesh.count=this.count,this.count>0&&(this.mesh.instanceMatrix.clearUpdateRanges(),this.mesh.instanceMatrix.addUpdateRange(0,this.count*16),this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor.clearUpdateRanges(),this.mesh.instanceColor.addUpdateRange(0,this.count*3),this.mesh.instanceColor.needsUpdate=!0,this.flash&&(this.flash.clearUpdateRanges(),this.flash.addUpdateRange(0,this.count),this.flash.needsUpdate=!0))}dispose(){this.scene.remove(this.mesh),this.mesh.dispose()}};function Xm(e={}){let t=new Eo({vertexColors:!0,map:e.map??null,transparent:!!e.transparent,opacity:e.opacity??1}),n=e.rim===void 0?null:typeof e.rim==`number`?{value:e.rim}:e.rim;return t.onBeforeCompile=t=>{e.flashUniform&&(t.uniforms.uFlash=e.flashUniform),n&&(t.uniforms.uRim=n),t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
attribute float aGlow;
varying float vGlow;
varying float vFlash;
${e.instanced?`attribute float aFlash;`:``}
${e.flashUniform?`uniform float uFlash;`:``}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vGlow = aGlow;
vFlash = ${e.instanced?`aFlash`:e.flashUniform?`uFlash`:`0.0`};`),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nvarying float vGlow;\nvarying float vFlash;${n?`
uniform float uRim;`:``}`).replace(`#include <opaque_fragment>`,`#include <opaque_fragment>
gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb * 1.35, vGlow);
${n?`float rimF = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.2);
gl_FragColor.rgb += vec3(1.0, 0.95, 0.85) * rimF * uRim;`:``}
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.97, 0.92), clamp(vFlash, 0.0, 1.0));`)},t.customProgramCacheKey=()=>`vox-${e.instanced?`i`:`m`}-${e.flashUniform?`u`:``}-${n?`r`:``}`,t}function Zm(e,t=!0){return new _r({color:16777215,map:e??null,transparent:!0,blending:2,depthWrite:!1,depthTest:t,side:2})}var Qm={glow:0,debris:1,smoke:2,spark:6,ember:7,shard:8,bubble:9,wisp:10,gather:11,pixel:12,flame:13,puff:2};function $m(e,t=1){let n=new _r({color:16777215,transparent:e||t<1,opacity:t,blending:e?2:1,depthWrite:!e&&t>=1,side:2});return n.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`vec4 mvPosition = modelViewMatrix * vec4(instanceMatrix[3].xyz, 1.0);
vec3 bbC0 = instanceMatrix[0].xyz;
float bbS = length(bbC0);
float bbA = atan(-bbC0.z, bbC0.x);
float bbCa = cos(bbA);
float bbSa = sin(bbA);
vec2 bbP = position.xy * vec2(bbS, instanceMatrix[1].y);
mvPosition.xy += vec2(bbP.x * bbCa - bbP.y * bbSa, bbP.x * bbSa + bbP.y * bbCa);
gl_Position = projectionMatrix * mvPosition;`)},n.customProgramCacheKey=()=>`bbsq-${e?`a`:`o`}-${t<1?`t`:``}`,n}var eh=class{constructor(e,t,n,r,i=!0){m(this,`list`,[]),m(this,`n`,0),m(this,`glow`,void 0),m(this,`glowSq`,void 0),m(this,`solid`,void 0),m(this,`puff`,void 0),m(this,`debris`,void 0),m(this,`max`,void 0),this.max=r===`low`?900:r===`medium`?1800:3e3;for(let e=0;e<this.max;e++)this.list.push({x:0,y:0,z:0,vx:0,vy:0,vz:0,r:1,g:1,b:1,r2:1,g2:1,b2:1,size:1,life:0,max:1,rot:0,spin:0,kind:0});this.glow=new Ym(new Kr(1,1,1),Zm(),e,256),this.glow.mesh.renderOrder=7;let a=new So(1,1);this.glowSq=new Ym(a,$m(!0),e,512),this.glowSq.mesh.renderOrder=7,this.solid=new Ym(a,$m(!1),e,512),this.solid.mesh.renderOrder=3,this.puff=new Ym(a,$m(!1,.7),e,128),this.puff.mesh.renderOrder=4;let o=new Kr(1,1,1),s=o.getAttribute(`position`).count;o.setAttribute(`color`,new G(Array(s*3).fill(1),3)),o.setAttribute(`aGlow`,new G(Array(s).fill(0),1)),this.debris=new Ym(o,Xm({map:t,instanced:!0}),e,256,!0);for(let e of[this.glow,this.glowSq,this.solid,this.puff,this.debris])e.lift=i}take(){return this.n<this.max?this.list[this.n++]:null}burst(e,t,n,r,i,a,o,s,c=`glow`){let l=c===`glow`?0:c===`debris`?1:2,u=(r>>16&255)/255,d=(r>>8&255)/255,f=(r&255)/255;for(let r=0;r<i;r++){let i=this.take();if(!i)return;let c=Math.random()*Math.PI*2,p=a*(.35+Math.random()*.65);i.x=e,i.y=t,i.z=n,i.vx=Math.cos(c)*p,i.vz=Math.sin(c)*p,i.vy=l===1?2+Math.random()*a:l===2?.6+Math.random():(Math.random()-.2)*a*.8,i.r=i.r2=u,i.g=i.g2=d,i.b=i.b2=f,i.size=o*(.6+Math.random()*.8),i.life=i.max=s*(.6+Math.random()*.6),i.rot=Math.random()*6,i.spin=(Math.random()-.5)*12,i.kind=l===0?r%3==0?0:12:l,l===2&&(i.size*=.8,i.spin=(Math.random()-.5)*3)}if(l===1&&i>=6){let r=Math.min(8,Math.round(i/3));for(let i=0;i<r;i++){let r=this.take();if(!r)return;let i=Math.random()*Math.PI*2,a=.8+Math.random()*1.6;r.x=e+Math.cos(i)*.2,r.y=t+Math.random()*.4,r.z=n+Math.sin(i)*.2,r.vx=Math.cos(i)*a,r.vz=Math.sin(i)*a,r.vy=.5+Math.random()*.8,r.r=r.r2=.74+Math.random()*.08,r.g=r.g2=.72+Math.random()*.08,r.b=r.b2=.7+Math.random()*.08,r.size=Math.min(.42,Math.max(.24,o*1.8))*(.7+Math.random()*.5),r.life=r.max=.45+Math.random()*.3,r.rot=Math.random()*6,r.spin=(Math.random()-.5)*3,r.kind=2}}}emit(e,t,n,r,i,a,o){let s=Math.round(r.count*o+Math.random()*.5);if(s<=0)return;let c=Qm[r.kind],l=r.color2??r.color,u=(r.color>>16&255)/255,d=(r.color>>8&255)/255,f=(r.color&255)/255,p=(l>>16&255)/255,m=(l>>8&255)/255,h=(l&255)/255,g=i!==0||a!==0,_=g?Math.atan2(a,i):0,v=r.jitter??0;for(let i=0;i<s;i++){let i=this.take();if(!i)return;let a=g?_+(Math.random()*2-1)*r.spread:Math.random()*Math.PI*2;if(c===13)i.r=u,i.g=d,i.b=f,i.r2=p,i.g2=m,i.b2=h;else{let e=Math.random();i.r=i.r2=u+(p-u)*e,i.g=i.g2=d+(m-d)*e,i.b=i.b2=f+(h-f)*e}if(i.size=r.size*(.65+Math.random()*.7),i.life=i.max=r.life*(.7+Math.random()*.6),i.rot=Math.random()*6,i.kind=c,c===11){let o=r.speed*(.7+Math.random()*.6),s=(Math.random()-.3)*o*.8;i.x=e+Math.cos(a)*o,i.z=n+Math.sin(a)*o,i.y=t+s,i.vx=-Math.cos(a)*o/i.life,i.vz=-Math.sin(a)*o/i.life,i.vy=-s/i.life,i.spin=0;continue}let o=r.speed*(.4+Math.random()*.6),s=Math.random()*Math.PI*2,l=v*Math.sqrt(Math.random());i.x=e+Math.cos(s)*l,i.y=t+(v>0?Math.random()*v*.3:0),i.z=n+Math.sin(s)*l,i.vx=Math.cos(a)*o,i.vz=Math.sin(a)*o,i.vy=(r.up??0)*(.5+Math.random()*.7)+(c===1?2+Math.random()*r.speed:c===2?.4+Math.random()*.6:c===13?.6:(Math.random()-.4)*o*.4),i.spin=c===10?(Math.random()<.5?-1:1)*(4+Math.random()*4):c===2||c===13?(Math.random()-.5)*2:(Math.random()-.5)*12}}update(e){this.glow.begin(),this.glowSq.begin(),this.solid.begin(),this.puff.begin(),this.debris.begin();let t=0;for(let n=0;n<this.n;n++){let r=this.list[n];if(r.life-=e,r.life<=0)continue;r.x+=r.vx*e,r.y+=r.vy*e,r.z+=r.vz*e,r.rot+=r.spin*e;let i=r.life/r.max;switch(r.kind){case 0:{r.vx*=1-e*3,r.vz*=1-e*3,r.vy-=e*2;let t=r.size*(.25+i*.75),n=.8*Math.min(1,i*2);this.glowSq.pushFast(r.x,r.y,r.z,r.rot*.2,t,t,r.r*n,r.g*n,r.b*n);break}case 1:{r.vy-=e*22,r.y<r.size*.5&&(r.y=r.size*.5,r.vy*=-.35,r.vx*=.6,r.vz*=.6,r.spin*=.6);let t=r.size*Math.min(1,i*3);this.debris.pushFast(r.x,r.y,r.z,r.rot,t,t,r.r,r.g,r.b,0);break}case 2:{r.vx*=1-e*3,r.vz*=1-e*3,r.vy*=1-e*1.5;let t=1-i,n=r.size*(t<.2?.5+t*2.5:1-(t-.2)*1.1),a=1-t*.25;this.puff.pushFast(r.x,r.y,r.z,r.rot,n,n,r.r*a,r.g*a,r.b*a);break}case 3:{let e=Math.sin(i*Math.PI),t=r.size*(.6+e*.4);this.glowSq.pushFast(r.x,r.y,r.z,0,t,t,r.r*e,r.g*e,r.b*e);break}case 4:{r.y<.05&&(r.life=Math.min(r.life,.3),r.vx=r.vy=r.vz=0,r.y=.05);let e=Math.min(1,i*4);this.glowSq.pushFast(r.x,r.y,r.z,r.rot*.3,r.size,r.size,.7*e,.75*e,.8*e);break}case 5:if(r.y<=.02){r.vy!==0&&(r.vx=r.vy=r.vz=0,r.y=.02,r.life=Math.min(r.life,.18),r.max=.18);let e=.12+(1-r.life/.18)*.18;this.glow.pushFast(r.x,r.y,r.z,.785,e,.02,.22,.26,.3)}else this.glow.pushFast(r.x,r.y,r.z,.785,r.size,.55,.2,.24,.3);break;case 6:{r.vx*=1-e*6,r.vz*=1-e*6,r.vy-=e*7;let t=Math.hypot(r.vx,r.vz),n=r.size*1.2+t*.025,a=1.4*Math.min(1,i*1.8);this.glow.pushAxis(r.x,r.y,r.z,Math.atan2(-r.vz,r.vx),n,r.size*.7,r.size*.7,r.r*a,r.g*a,r.b*a);let o=r.size*1.3*i;this.solid.pushFast(r.x,r.y,r.z,.785,o,o,r.r,r.g,r.b);break}case 7:{r.vx*=1-e*2.5,r.vz*=1-e*2.5,r.vy=Math.max(r.vy-e*.6,.3),r.x+=Math.sin(r.rot*1.7+r.life*9)*e*.4;let t=Math.sin(r.life*30+r.rot*5)>-.6?1:.4,n=r.size*(.4+i*.6)*t;this.solid.pushFast(r.x,r.y,r.z,0,n,n,r.r*1,r.g*1,r.b*1);break}case 8:{r.vy-=e*16,r.y<r.size*.8&&(r.y=r.size*.8,r.vy*=-.3,r.vx*=.5,r.vz*=.5,r.spin*=.5);let t=r.size*Math.min(1,i*2.5);this.debris.pushFast(r.x,r.y,r.z,r.rot,t*.8,t*1.6,r.r,r.g,r.b,.45);break}case 9:if(r.vx*=1-e*4,r.vz*=1-e*4,r.vy=Math.max(.25,r.vy-e*.5),i<.12){let e=r.size*.35,t=r.size*(1.8-i*6);for(let n=0;n<4;n++){let i=n*1.5708+.785;this.solid.pushFast(r.x+Math.cos(i)*t*.7,r.y+Math.sin(i)*t*.7,r.z,0,e,e,r.r*1.1,r.g*1.1,r.b*1.1)}}else{let e=r.size*(.6+(1-i)*.9);this.solid.pushFast(r.x,r.y,r.z,0,e,e,r.r,r.g,r.b),this.solid.pushFast(r.x-e*.18,r.y+e*.18,r.z,0,e*.3,e*.3,.95,1,.9)}break;case 10:{let t=Math.cos(r.spin*e),n=Math.sin(r.spin*e),a=r.vx*t-r.vz*n;r.vz=r.vx*n+r.vz*t,r.vx=a,r.vx*=1-e*1.2,r.vz*=1-e*1.2,r.vy=r.vy*(1-e)+e*.8;let o=r.size*(.3+i*.9),s=Math.min(1,Math.sin(i*Math.PI)*2);this.solid.pushFast(r.x,r.y,r.z,0,o,o,r.r*s,r.g*s,r.b*s),this.glowSq.pushFast(r.x,r.y,r.z,0,o*1.8,o*1.8,r.r*s*.3,r.g*s*.3,r.b*s*.3);break}case 11:{let e=.4+(1-i)*1.1,t=r.size*(.5+(1-i)*.7);this.glowSq.pushFast(r.x,r.y,r.z,0,t,t,r.r*e,r.g*e,r.b*e);break}case 12:{r.vx*=1-e*4,r.vz*=1-e*4,r.vy=r.vy*(1-e*3)-e*3;let t=r.size*Math.min(1,i*1.6);this.solid.pushFast(r.x,r.y,r.z,0,t,t,r.r,r.g,r.b);break}case 13:{r.vx*=1-e*3,r.vz*=1-e*3,r.vy+=e*3.2;let t=1-i,n=r.size*(t<.15?.6+t*2.6:1-(t-.15)*.95),a=1-t*.25;this.solid.pushFast(r.x,r.y,r.z,0,n,n,(r.r+(r.r2-r.r)*t)*a,(r.g+(r.g2-r.g)*t)*a,(r.b+(r.b2-r.b)*t)*a);break}}if(t!==n){let e=this.list[t];this.list[t]=r,this.list[n]=e}t++}this.n=t,this.glow.end(),this.glowSq.end(),this.solid.end(),this.puff.end(),this.debris.end()}clear(){this.n=0}dispose(){this.glow.dispose(),this.glowSq.dispose(),this.solid.dispose(),this.puff.dispose(),this.debris.dispose()}},th=new H;function nh(e){return`#`+e.toString(16).padStart(6,`0`)}var rh=class{constructor(e){m(this,`canvas`,void 0),m(this,`ctx`,void 0),m(this,`nums`,[]),m(this,`w`,1),m(this,`h`,1),m(this,`dpr`,1),m(this,`showNumbers`,!0),this.canvas=document.createElement(`canvas`),this.canvas.className=`overlay-canvas`,e.appendChild(this.canvas),this.ctx=this.canvas.getContext(`2d`)}resize(e,t,n){this.w=e,this.h=t,this.dpr=Math.min(n,2),this.canvas.width=Math.floor(e*this.dpr),this.canvas.height=Math.floor(t*this.dpr),this.canvas.style.width=e+`px`,this.canvas.style.height=t+`px`}number(e,t,n,r,i){if(!this.showNumbers&&i===void 0||!r&&i===void 0&&this.nums.length>30&&Math.random()<(this.nums.length-30)/40)return;if(this.nums.length>90){let e=this.nums.findIndex(e=>!e.big);if(e>=0)this.nums.splice(e,1);else return}let a=Math.round(n);a<=0||this.nums.push({x:e+(Math.random()-.5)*.5,y:1.6+Rd(e,t),z:t,text:String(a),color:i===void 0?r?`#ffd23d`:`#f0ecf8`:nh(i),size:r?14:i===void 0?9:12,life:r?.8:.6,max:r?.8:.6,vx:(Math.random()-.5)*.6,big:r||i!==void 0})}text(e,t,n,r){this.nums.push({x:e,y:2.4+Rd(e,t),z:t,text:n,color:nh(r),size:12,life:1.2,max:1.2,vx:0,big:!0})}clear(){this.nums.length=0}draw(e,t,n){let r=this.ctx;if(r.setTransform(this.dpr,0,0,this.dpr,0,0),r.clearRect(0,0,this.w,this.h),!n)return;r.textAlign=`center`,r.textBaseline=`middle`,r.lineJoin=`round`;let i=n.player.x,a=n.player.z;for(let e of n.dummies){if((e.x-i)**2+(e.z-a)**2>784||!this.project(t,e.x,Rd(e.x,e.z)+e.height+.35,e.z))continue;let o=n.target===e;if(o){let e=Math.sin(n.time*5)*3,t=th.y-30+e;r.beginPath(),r.moveTo(th.x-8,t-9),r.lineTo(th.x+8,t-9),r.lineTo(th.x,t),r.closePath(),r.lineWidth=3,r.strokeStyle=`rgba(0,0,0,0.85)`,r.stroke(),r.fillStyle=n.autoAttack?`#ff4a3a`:`#ffd040`,r.fill()}if(r.font=`600 11px "Russo One", sans-serif`,r.lineWidth=3,r.strokeStyle=`rgba(0,0,0,0.85)`,r.strokeText(e.name,th.x,th.y-10),r.fillStyle=o?`#ffd040`:`#ffffff`,r.fillText(e.name,th.x,th.y-10),e.total>0){let t=`Σ ${e.total}  ·  ${Math.round(e.dps(n.time))} DPS`;r.font=`600 10px "Russo One", sans-serif`,r.strokeText(t,th.x,th.y+4),r.fillStyle=`#ffe9a0`,r.fillText(t,th.x,th.y+4)}}for(let n=this.nums.length-1;n>=0;n--){let i=this.nums[n];if(i.life-=e,i.life<=0){this.nums.splice(n,1);continue}let a=i.life/i.max;if(i.y+=e*(.8+a*1.6),i.x+=i.vx*e,!this.project(t,i.x,i.y,i.z))continue;let o=a>.8?1+(a-.8)*2.5:1,s=Math.round(i.size*o);r.globalAlpha=Math.min(1,a*3);let c=Math.max(8,Math.round(s*1.1));r.font=`${c}px "Press Start 2P", "Russo One", monospace`,r.lineJoin=`miter`;let l=Math.max(2,Math.round(c/8));r.fillStyle=`rgba(0,0,0,0.85)`,r.fillText(i.text,th.x+l,th.y+l),r.lineWidth=Math.max(3,Math.round(c/5)),r.strokeStyle=`rgba(8,8,12,0.95)`,r.strokeText(i.text,th.x,th.y),r.fillStyle=i.color,r.fillText(i.text,th.x,th.y),r.lineJoin=`round`}r.globalAlpha=1}project(e,t,n,r){return th.set(t,n,r).project(e),th.z>1?!1:(th.x=(th.x*.5+.5)*this.w,th.y=(-th.y*.5+.5)*this.h,th.x>-40&&th.x<this.w+40&&th.y>-40&&th.y<this.h+40)}},ih=class{constructor(e,t){m(this,`lights`,[]),m(this,`reqs`,[]),m(this,`nReq`,0),m(this,`flashes`,[]);for(let n=0;n<t;n++){let t=new $o(16777215,0,6,1.6);t.castShadow=!1,e.add(t),this.lights.push(t)}for(let e=0;e<256;e++)this.reqs.push({x:0,y:0,z:0,color:0,intensity:0,radius:0,score:0})}begin(){this.nReq=0}request(e,t,n,r,i,a,o,s){if(this.nReq>=this.reqs.length||this.lights.length===0)return;let c=(e-o)**2+(n-s)**2;if(c>676)return;let l=this.reqs[this.nReq++];l.x=e,l.y=t+Rd(e,n),l.z=n,l.color=r,l.intensity=i,l.radius=a,l.score=i/(1+c*.02)}flash(e,t,n,r,i,a){this.flashes.length>24&&this.flashes.shift(),this.flashes.push({x:e,z:t,color:n,intensity:r,radius:i,t:a,dur:a})}end(e,t,n){for(let r=this.flashes.length-1;r>=0;r--){let i=this.flashes[r];i.t-=e,i.t<=0?this.flashes.splice(r,1):this.request(i.x,1.2,i.z,i.color,i.intensity*(i.t/i.dur)*1.5,i.radius,t,n)}let r=this.reqs.slice(0,this.nReq).sort((e,t)=>t.score-e.score),i=[];for(let e of r){let t=null;for(let n of i)if((n.x-e.x)**2+(n.z-e.z)**2<2.6*2.6){t=n;break}t?(t.intensity=Math.min(t.intensity*1.6,t.intensity+e.intensity*.35),t.radius=Math.max(t.radius,e.radius)+.4):i.length<this.lights.length&&i.push({...e})}for(let e=0;e<this.lights.length;e++){let t=this.lights[e],n=i[e];n?(t.position.set(n.x,n.y,n.z),t.color.setHex(n.color),t.intensity=n.intensity*3,t.distance=n.radius):t.intensity=0}}},ah={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},oh=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},sh=new es(-1,1,1,-1,0,1),ch=new class extends jr{constructor(){super(),this.setAttribute(`position`,new G([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new G([0,2,0,0,2,0],2))}},lh=class{constructor(e){this._mesh=new Ur(ch,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,sh)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},uh=class extends oh{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof ei?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Zr.clone(e.uniforms),this.material=new ei({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new lh(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},dh=class extends oh{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},fh=class extends oh{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ph=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new V);this._width=n.width,this._height=n.height,t=new Gt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ae}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new uh(ah),this.copyPass.material.blending=0,this.clock=new is}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}dh!==void 0&&(r instanceof dh?n=!0:r instanceof fh&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new V);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},mh=class extends oh{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new W}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},hh={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new W(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},gh=class e extends oh{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new V(256,256):new V(e.x,e.y),this.clearColor=new W(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Gt(i,a,{type:ae}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Gt(i,a,{type:ae});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Gt(i,a,{type:ae});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=hh;this.highPassUniforms=Zr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ei({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[3,5,7,9,11];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new V(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Zr.clone(ah.uniforms),this.blendMaterial=new ei({uniforms:this.copyUniforms,vertexShader:ah.vertexShader,fragmentShader:ah.fragmentShader,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new W,this._oldClearAlpha=1,this._basic=new _r,this._fsQuad=new lh(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new V(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new ei({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new V(.5,.5)},direction:{value:new V(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new ei({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};gh.BlurDirectionX=new V(1,0),gh.BlurDirectionY=new V(0,1);var _h={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},vh=class extends oh{constructor(){super(),this.uniforms=Zr.clone(_h.uniforms),this.material=new To({name:_h.name,uniforms:this.uniforms,vertexShader:_h.vertexShader,fragmentShader:_h.fragmentShader}),this._fsQuad=new lh(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Mt.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},yh={meadow:[{count:200,size:.07,colors:[16774344,16777215],glow:!0,bright:1.1,motion:`drift`,vel:[.35,.04,.12],sway:.6,freq:.25,y:[.3,4.5],alpha:.85,night:-.75,blink:.25},{count:70,size:.16,colors:[8307258,14266940],glow:!1,motion:`fall`,vel:[.55,-.45,.2],sway:.8,freq:.6,y:[0,7],alpha:.95,night:-.4,blink:0},{count:120,size:.13,colors:[14221162,16769658],glow:!0,bright:3.2,motion:`wander`,vel:[.05,0,.03],sway:.9,freq:.35,y:[.3,3.2],alpha:0,night:1,blink:1,alpha:.12,night:.88}]},bh=`
attribute vec4 aSeed;
uniform float uTime;
uniform vec3 uCenter;
uniform float uBox;
uniform vec3 uVel;
uniform float uSway;
uniform float uFreq;
uniform vec2 uY;
uniform float uSize;
uniform float uPx;
uniform float uAlpha;
uniform float uBlink;
uniform vec3 uColA;
uniform vec3 uColB;
uniform float uWander;
varying vec3 vCol;
varying float vA;
void main() {
  float t = uTime;
  float sp = 0.6 + 0.8 * aSeed.x;
  vec3 p = position + uVel * t * sp;
  float f = uFreq * (0.7 + 0.6 * aSeed.w);
  vec3 sw = vec3(sin(t * f * 6.2832 + aSeed.y * 6.2832), sin(t * f * 4.1 + aSeed.z * 6.2832) * (0.35 + uWander * 0.65), cos(t * f * 5.3 + aSeed.w * 6.2832));
  // fireflies loop around in little lazy figure-eights
  sw += uWander * vec3(sin(t * f * 2.7 + aSeed.z * 9.0), 0.0, sin(t * f * 3.3 + aSeed.x * 9.0)) * 1.4;
  p += sw * uSway;
  // wrap height and the horizontal box around the camera target
  float hy = uY.y - uY.x;
  float fy = fract((p.y - uY.x) / hy);
  p.y = uY.x + fy * hy + uCenter.y;
  vec2 rel = mod(p.xz - uCenter.xz + 0.5 * uBox, uBox) - 0.5 * uBox;
  p.xz = uCenter.xz + rel;
  float edge = 1.0 - smoothstep(0.32 * uBox, 0.5 * uBox, length(rel));
  float band = smoothstep(0.0, 0.12, fy) * (1.0 - smoothstep(0.85, 1.0, fy));
  float tw = 0.5 + 0.5 * sin(t * (1.3 + aSeed.x * 2.2) + aSeed.y * 40.0);
  tw = mix(1.0, tw * tw * 1.6, uBlink);
  vA = uAlpha * edge * band * tw;
  vCol = mix(uColA, uColB, aSeed.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, uSize * (0.65 + 0.7 * aSeed.w) * uPx / -mv.z);
  if (vA < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,xh=`
uniform float uBright;
varying vec3 vCol;
varying float vA;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q) * 2.0;
  float core = 1.0 - smoothstep(0.0, 0.45, r);
  float halo = (1.0 - smoothstep(0.2, 1.0, r)) * 0.35;
  float a = (core + halo) * vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vCol * uBright * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Sh=`
varying vec3 vCol;
varying float vA;
void main() {
  if (vA < 0.01) discard;
  // a crisp pixel square with a darker lower-right edge, like a Minecraft particle
  vec2 q = gl_PointCoord;
  float shade = (q.x > 0.7 || q.y > 0.7) ? 0.72 : 1.0;
  gl_FragColor = vec4(vCol * shade, vA);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,Ch=class{constructor(e,t,n,r){m(this,`scene`,void 0),m(this,`layers`,[]),m(this,`time`,0),m(this,`box`,void 0),this.scene=e,this.box=n===`low`?38:46;let i=(n===`low`?.4:n===`medium`?.7:1)*r,a=yh[t]??yh.meadow;for(let t of a){let n=Math.max(8,Math.round(t.count*i*(this.box/46)**2)),r=new Float32Array(n*3),a=new Float32Array(n*4);for(let e=0;e<n;e++){r[e*3]=Math.random()*this.box,r[e*3+1]=t.y[0]+Math.random()*(t.y[1]-t.y[0]),r[e*3+2]=Math.random()*this.box;for(let t=0;t<4;t++)a[e*4+t]=Math.random()}let o=new jr;o.setAttribute(`position`,new xr(r,3)),o.setAttribute(`aSeed`,new xr(a,4)),o.boundingSphere=new pn(new H,1e6);let s=new ei({vertexShader:bh,fragmentShader:t.glow?xh:Sh,uniforms:{uTime:{value:0},uCenter:{value:new H},uBox:{value:this.box},uVel:{value:new H(...t.vel)},uSway:{value:t.sway},uFreq:{value:t.freq},uY:{value:new V(t.y[0],t.y[1])},uSize:{value:t.size},uPx:{value:600},uAlpha:{value:0},uBlink:{value:t.blink},uColA:{value:new W(t.colors[0])},uColB:{value:new W(t.colors[1])},uWander:{value:+(t.motion===`wander`)},uBright:{value:t.bright??1}},transparent:!0,depthWrite:!1,blending:t.glow?2:1}),c=new Qi(o,s);c.frustumCulled=!1,c.renderOrder=6,e.add(c),this.layers.push({def:t,points:c,mat:s})}}update(e,t,n,r,i,a=0,o=0){this.time+=e;let s=this.time%3600;for(let e of this.layers){let c=e.mat.uniforms;c.uTime.value=s,c.uCenter.value.set(t,o,n),c.uPx.value=i;let l=e.def,u=Math.max(0,Math.min(1,l.alpha+l.night*r));l.glow||(u*=1-a*.3),c.uAlpha.value=u,e.points.visible=u>.01}}dispose(){for(let e of this.layers)this.scene.remove(e.points),e.points.geometry.dispose(),e.mat.dispose();this.layers.length=0}},wh=1/6,Th=1/8,Eh=[wh,.5,1];function Dh(e,t,n,r){let i=Math.imul(e|0,374761393)^Math.imul(t|0,668265263)^Math.imul(n|0,1274126177)^Math.imul(r|0,2246822519)|0;return i=Math.imul(i^i>>>13,1274126177),i^=i>>>16,(i>>>0)/4294967296}function Oh(e,t,n,r){let i=Math.floor(e),a=Math.floor(t),o=Math.floor(n),s=e-i,c=t-a,l=n-o;s=s*s*(3-2*s),c=c*c*(3-2*c),l=l*l*(3-2*l);let u=Dh(i,a,o,r),d=Dh(i+1,a,o,r),f=Dh(i,a+1,o,r),p=Dh(i+1,a+1,o,r),m=Dh(i,a,o+1,r),h=Dh(i+1,a,o+1,r),g=Dh(i,a+1,o+1,r),_=Dh(i+1,a+1,o+1,r),v=u+(d-u)*s,y=f+(p-f)*s,b=m+(h-m)*s,x=g+(_-g)*s,S=v+(y-v)*c;return S+(b+(x-b)*c-S)*l}function kh(e){let t=e>>>0||1;return()=>(t=Math.imul(t^t>>>15,2246822519)+2654435769>>>0,t^=t>>>13,(t>>>0)/4294967296)}var Ah=(e,t)=>e[Math.min(e.length-1,Math.floor(t*e.length))];function jh(e,t){let n=Math.min(255,Math.round((e>>16&255)*t)),r=Math.min(255,Math.round((e>>8&255)*t)),i=Math.min(255,Math.round((e&255)*t));return n<<16|r<<8|i}var Mh=-1,Nh=1,Ph=2,Fh=class{constructor(e,t,n,r){m(this,`res`,void 0),m(this,`sh`,void 0),m(this,`i0`,void 0),m(this,`k0`,void 0),m(this,`nx`,void 0),m(this,`ny`,void 0),m(this,`nz`,void 0),m(this,`c`,void 0),m(this,`kind`,void 0),this.res=e,this.sh=t?.5:0,this.i0=Math.floor(-n/e+this.sh)-1,this.k0=this.i0,this.nx=this.nz=Math.ceil(n/e+this.sh)+1-this.i0,this.ny=Math.ceil(r/e)+2,this.c=new Int32Array(this.nx*this.ny*this.nz).fill(Mh),this.kind=new Uint8Array(this.nx*this.ny*this.nz)}ix(e){return Math.floor(e/this.res+this.sh)-this.i0}iy(e){return Math.floor(e/this.res)}cx(e){return(e+this.i0-this.sh+.5)*this.res}cy(e){return(e+.5)*this.res}idx(e,t,n){return(t*this.nz+n)*this.nx+e}inside(e,t,n){return e>=0&&t>=0&&n>=0&&e<this.nx&&t<this.ny&&n<this.nz}get(e,t,n){return this.inside(e,t,n)?this.c[this.idx(e,t,n)]:Mh}put(e,t,n,r,i,a){if(!this.inside(e,t,n))return;let o=this.idx(e,t,n);(a||this.c[o]===Mh)&&(this.c[o]=r,this.kind[o]=i)}span(e,t,n){let r=n?0:this.sh,i=n?0:this.i0,a=Math.ceil(e/this.res+r-.5-1e-6),o=Math.floor(t/this.res+r-.5+1e-6);return o<a&&(a=o=Math.round((e+t)/2/this.res+r-.5)),[a-i,o-i]}};function Ih(e,t){let[n,r]=e.span(t.min[0],t.max[0],!1),[i,a]=e.span(Math.max(0,t.min[1]),t.max[1],!0),[o,s]=e.span(t.min[2],t.max[2],!1);for(let c=i;c<=a;c++)for(let i=o;i<=s;i++)for(let a=n;a<=r;a++)e.put(a,c,i,t.color(e.cx(a),e.cy(c),e.cx(i)),Nh,!0)}function Lh(e,t){let n=Math.max(1,Math.round(t.w/e.res)),r=Math.floor((n-1)/2),[i,a,o]=t.a,[s,c,l]=t.b,u=Math.hypot(s-i,c-a,l-o),d=Math.max(1,Math.ceil(u/(e.res*.4))),f=t.leaf?Ph:Nh,p=NaN,m=NaN,h=NaN,g=(i,a,o)=>{let s=t.color(e.cx(i),e.cy(a),e.cx(o));for(let c=0;c<n;c++)for(let l=0;l<n;l++)for(let u=0;u<n;u++)e.put(i-r+u,a-r+c,o-r+l,s,f,!t.leaf)};for(let t=0;t<=d;t++){let n=t/d,r=e.ix(i+(s-i)*n),u=e.iy(a+(c-a)*n),f=e.ix(o+(l-o)*n);(r!==p||u!==m||f!==h)&&(Number.isNaN(p)?(p=r,m=u,h=f,g(r,u,f)):(r!==p&&g(p=r,m,h),u!==m&&g(p,m=u,h),f!==h&&g(p,m,h=f)))}}function Rh(e,t,n,r,i,a,o){return jh(Ah(e,Dh(Math.floor(n*2+64),Math.floor(r*2.4),Math.floor(i*2+64),t)),o?.7:.88+Math.round(Math.min(1,Math.max(0,a))*3)*.06)}function zh(e,t){let[n,r,i]=t.c,[a,o,s]=t.r,c=e.res<.3,l=1+t.rough*.6,[u,d]=e.span(n-a*l,n+a*l,!1),[f,p]=e.span(Math.max(0,r-o*l),r+o*l,!0),[m,h]=e.span(i-s*l,i+s*l,!1);for(let g=f;g<=p;g++){let f=e.cy(g);for(let p=m;p<=h;p++){let m=e.cx(p);for(let h=u;h<=d;h++){let u=e.cx(h),d=Math.sqrt(((u-n)/a)**2+((f-r)/o)**2+((m-i)/s)**2);if(d>l)continue;let _=1+(Oh(u/.8,f/.8,m/.8,t.seed)-.5)*t.rough*1.3;if(_+=c?(Oh(u/.28,f/.28,m/.28,t.seed+3)-.5)*.22:.04,d>_||c&&t.gaps>0&&(d>_-.32&&Oh(u/.42,f/.42,m/.42,t.seed+7)<t.gaps||d>.35&&Oh(u/.9,f/.9,m/.9,t.seed+9)<t.gaps*.45))continue;let v=d<_-.42;e.put(h,g,p,Rh(t.pal,t.seed,u,f,m,(f-(r-o))/(2*o),v),Ph,!1)}}}}function Bh(e,t){let n=e.res<.3,r=t.r*1.25,[i,a]=e.span(-r,r,!1),[o,s]=e.span(t.y0,t.y1,!0);for(let r=o;r<=s;r++){let o=e.cy(r),s=(o-t.y0)/(t.y1-t.y0);for(let c=i;c<=a;c++){let l=e.cx(c);for(let u=i;u<=a;u++){let i=e.cx(u),a=Math.hypot(i,l),d=((o+a*.28-t.y0)/t.tier%1+1)%1,f=t.r*(1-s)*(1-d*.45)+.28;if(f+=(Oh(i/.7,o/.5,l/.7,t.seed)-.5)*.7,n&&(f+=(Oh(i/.25,o/.25,l/.25,t.seed+1)-.5)*.3),a>f||n&&a>f-.35&&Oh(i/.4,o/.4,l/.4,t.seed+5)<.3)continue;let p=a<f-.5;e.put(u,r,c,Rh(t.pal,t.seed,i,o,l,.35+(1-d)*.65,p),Ph,!1)}}}}function Vh(e,t){let n=e.res<.3?2:1,r=[];for(let i=0;i<e.ny;i++)for(let a=0;a<e.nz;a++)for(let o=0;o<e.nx;o++){let s=e.idx(o,i,a);if(e.kind[s]!==Ph)continue;let c=Math.floor((o+e.i0)/n),l=Math.floor(i/n),u=Math.floor((a+e.k0)/n);Dh(c,l,u,77)>=t.rate*(n===2?.5:1)||e.get(o+1,i,a)>=0&&e.get(o-1,i,a)>=0&&e.get(o,i,a+1)>=0&&e.get(o,i,a-1)>=0&&e.get(o,i-1,a)>=0||r.push(s,Ah(t.pal,Dh(c,l,u,78)))}for(let t=0;t<r.length;t+=2)e.c[r[t]]=r[t+1]}var Hh=[8411194,7359536,9068608],Uh=[5414970,6204996,4887092,5809728],Wh=[3438666,3042370,3834960,3306566],Gh=[10275924,9355338,10933342,9881168],Kh=[10931282,9880134,11588700,10405966],qh=[9075304,8023130,9864818],Jh=[5940798,5282358,6467654],Yh=[4885056,4226104,5412424],Xh=Uh.map(e=>e+658948),Zh=(e,t)=>(n,r,i)=>Ah(e,Dh(Math.floor(n*6+50),Math.floor(r*3),Math.floor(i*6+50),t)),Qh=e=>()=>e;function $h(e,t){let n=kh(e*977+t*131+7),r=Qd(e,t),i=e*31+t*7,a=[],o={prims:a},s=(e,t,n,r)=>a.push({t:`box`,min:[-e/2,t,-e/2],max:[e/2,n,e/2],color:r}),c=(e,t,n,r)=>a.push({t:`seg`,a:e,b:t,w:n,color:r}),l=(e,t,n,r,i=.32,o=.3)=>a.push({t:`blob`,c:e,r:t,pal:n,seed:r,rough:i,gaps:o}),u=(e,t,r,i=2)=>{let a=[e[0]+(t[0]-e[0])*.55,e[1]+(t[1]-e[1])*.55,e[2]+(t[2]-e[2])*.55];c(e,a,.25,r),c(a,t,.125,r);for(let e=0;e<i;e++){let i=e?t:a,o=n()*Math.PI*2,s=.35+n()*.45;c(i,[i[0]+Math.cos(o)*s,i[1]+.2+n()*.35,i[2]+Math.sin(o)*s],.125,r)}},d=(e,t,r,a,o)=>{for(let s=0;s<r;s++){let r=n()*Math.PI*2,c=(n()-.35)*1.2,u=[e[0]+Math.cos(r)*t[0]*.9,e[1]+c*t[1]*.8,e[2]+Math.sin(r)*t[2]*.9],d=o*(.7+n()*.5);l(u,[d,d*.8,d],a,i+40+s,.4,.2)}};switch(e){case Xd.oak:{let e=r*.5,o=Zh(Hh,3);s(1,0,e,o),s(2/3,e-.5,e+.7,o);for(let e=0;e<4;e++){let t=e/4*Math.PI*2+n()*.6,r=Math.cos(t)*.55,i=Math.sin(t)*.55;a.push({t:`box`,min:[r-.17,0,i-.17],max:[r+.17,.2+n()*.25,i+.17],color:o})}let c=3+(t&1),f=1.6+t*.15;for(let t=0;t<c;t++){let r=t/c*Math.PI*2+n()*.8,a=Math.cos(r)*f,s=Math.sin(r)*f,d=e+1+n()*1.5;u([0,e-1-t*.5,0],[a,d,s],o),l([a,d+.75,s],[1.5+n()*.6,1.1+n()*.3,1.5+n()*.6],Uh,i+t)}let p=[.25,r-1.75,.25],m=[2+t*.15,1.5,2+t*.15];l(p,m,Uh,i+9),d(p,m,5,Uh,.7);break}case Xd.spruce:{s(.5,0,r,Zh(Hh.map(e=>jh(e,.9)),4));let e=1+(t&1)*.5,o=2.3+t*.18;a.push({t:`cone`,y0:e,y1:r+.2,r:o,tier:1.5,pal:Wh,seed:i});for(let t=e;t<r*.6;t+=.75){let i=n()*Math.PI*2,a=o*(1-(t-e)/(r-e))*.8;c([0,t,0],[Math.cos(i)*a,t-.25,Math.sin(i)*a],.125,Qh(Hh[1]))}a.push({t:`box`,min:[-.09,r,-.09],max:[.09,r+.6,.09],color:Qh(Wh[2])});break}case Xd.birch:{let e=r*.72;s(.5,0,e,(e,t,n)=>{let r=Math.floor(t*4),a=Math.floor((e+n)*6+50);return Dh(r,a,0,i)<.24?2763306:Dh(r,a,1,i)<.15?12368044:15263452});let a=[0,r-1.5,0],o=[1.3+(t&1)*.25,2+t*.15,1.3+(t>>1)*.25];l(a,o,Gh,i,.38,.34),d(a,o,4,Gh,.55);let c=n()<.5?1:-1,f=n()<.5?.5:-.5;l([c,r-3,f],[.8,.7,.8],Gh,i+2,.4,.3),u([0,e-2,0],[c,r-3.2,f],Qh(14736850),1),u([0,e-1.2,0],[-c*.9,e+.2,-f],Qh(14736850),1);break}case Xd.willow:{let e=r*.5,o=Zh(Hh,5);s(1,0,e,o);let c=2.7+t*.15,f=r-1;for(let t=0;t<4;t++){let r=t/4*Math.PI*2+n();u([0,e-.3,0],[Math.cos(r)*c*.6,f-.2,Math.sin(r)*c*.6],o,1)}l([0,f,0],[c,1.4,c],Kh,i,.3,.26),d([0,f,0],[c,1.4,c],4,Kh,.8);for(let e=0;e<46;e++){let t=n()*Math.PI*2,r=c*(.5+n()*.55),o=Math.cos(t)*r,s=Math.sin(t)*r,l=1.5+n()*(f-3.2),u=n()<.6?1/6:1/3,d=(n()-.5)*.3,p=Kh.map(e=>jh(e,.92+n()*.12)),m=[o+d,f-.5-l*.5,s-d],h={t:`seg`,w:u,leaf:!0,color:(t,n,r)=>Ah(p,Dh(Math.floor(t*3),Math.floor(n*2),e,i))};a.push({...h,a:[o,f-.3,s],b:m},{...h,a:m,b:[o+d*2,Math.max(.6,f-.5-l),s-d]})}break}case Xd.dead:{let e=Zh(qh,6);s(.5,0,r-1,e);let i=3+t%3;for(let t=0;t<i;t++){let a=r*(.35+t/i*.5),o=n()*Math.PI*2,s=1.25+n()*1.25,l=[Math.cos(o)*s,a+.75+n(),Math.sin(o)*s],u=[l[0]*.5,(a+l[1])/2+(n()-.3)*.3,l[2]*.5];c([0,a,0],u,.25,e),c(u,l,.25,e);let d=o+(n()-.5)*1.6;c(l,[l[0]+Math.cos(d)*.8,l[1]+1,l[2]+Math.sin(d)*.8],.125,e);let f=o-(n()-.2)*1.4;c(l,[l[0]+Math.cos(f)*.6,l[1]+.4,l[2]+Math.sin(f)*.6],.125,e);let p=o+(n()-.5)*2;c(u,[u[0]+Math.cos(p)*.6,u[1]+.6,u[2]+Math.sin(p)*.6],.125,e)}c([0,r-1,0],[(n()-.5)*.8,r-.1,(n()-.5)*.8],.125,e);break}case Xd.fruit:{let e=r*.45,a=Zh(Hh,7);s(.5,0,e,a);let c=1.5+t*.1,f=[0,e+c-.25,0];for(let t=0;t<3;t++){let r=t/3*Math.PI*2+n();u([0,e-.3,0],[Math.cos(r)*c*.6,f[1]+.2,Math.sin(r)*c*.6],a,1)}l(f,[c,c*.85,c],Jh,i,.34,.26),d(f,[c,c*.85,c],4,Jh,.55),o.fruit={pal:t%2?[15764004,15235612]:[14168106,12854304],rate:.1};break}case Xd.small:{let e=r*.55,n=Zh(Hh.map(e=>jh(e,1.06)),8);s(1/3,0,e,n);let a=[0,r-.75,0],o=[.95+(t&1)*.2,.95,.95+(t>>1)*.2];u([0,e-.5,0],[.5,e+.4,.2],n,1),l(a,o,Xh,i,.36,.26),d(a,o,3,Xh,.4);break}case Xd.pine:{s(1,0,1.5,Zh([9077368,8287852,9735296],9));let e=Zh([10509868,11824180,11036208],10),a=Zh([9077368,10123866,9077368],11);s(.5,1.5,r,(t,n,i)=>n<r*.45?a(t,n,i):e(t,n,i));for(let e=0;e<4;e++){let t=r*(.38+e*.09),i=n()*Math.PI*2;c([0,t,0],[Math.cos(i)*.9,t+.3,Math.sin(i)*.9],.125,Qh(9071178))}let o=4+t%2;for(let t=0;t<o;t++){let a=t/o,s=r*(.68+a*.27),c=n()*Math.PI*2,d=(1-a)*(1+n()*.75),f=Math.cos(c)*d,p=Math.sin(c)*d;u([0,s-.5,0],[f,s,p],e,1);let m=1.3-a*.5+n()*.4;l([f,s+.25,p],[m,.6+n()*.2,m],Yh,i+t,.45,.3)}l([0,r+.5,0],[.7,.8,.7],Yh,i+20,.4,.2);break}}return o}var eg=[.86,.86,1,.7,.92,.92];function tg(e,t){let n=[e.nx,e.ny,e.nz],r=[e.nx,e.ny,e.nz],i=[-1,-1,-1];for(let t=0;t<e.ny;t++)for(let n=0;n<e.nz;n++)for(let a=0;a<e.nx;a++)e.c[e.idx(a,t,n)]<0||(a<r[0]&&(r[0]=a),a>i[0]&&(i[0]=a),t<r[1]&&(r[1]=t),t>i[1]&&(i[1]=t),n<r[2]&&(r[2]=n),n>i[2]&&(i[2]=n));if(i[0]<0)return;let a=e.res,o=[1,e.nz*e.nx,e.nx],s=[(e.i0-e.sh)*a,0,(e.k0-e.sh)*a],c=new W,l=e.c;for(let e=0;e<3;e++){let u=(e+1)%3,d=(e+2)%3,f=i[u]-r[u]+1,p=i[d]-r[d]+1,m=new Float64Array(f*p),h=o[e],g=o[u],_=o[d];for(let o=r[e]-1;o<=i[e];o++){let i=o>=0,v=o+1<n[e],y=0;for(let e=0;e<p;e++){let t=o*h+(r[d]+e)*_+r[u]*g;for(let e=0;e<f;e++,t+=g){let e=i?l[t]:Mh,n=v?l[t+h]:Mh;m[y++]=e>=0==n>=0?0:e>=0?e+1:-(n+1)}}y=0;for(let n=0;n<p;n++)for(let i=0;i<f;){let l=m[y];if(!l){i++,y++;continue}let h=1;for(;i+h<f&&m[y+h]===l;)h++;let g=1;grow:for(;n+g<p;g++)for(let e=0;e<h;e++)if(m[y+e+g*f]!==l)break grow;let _=[0,0,0];_[e]=o+1,_[u]=r[u]+i,_[d]=r[d]+n;let v=[0,0,0],b=[0,0,0];v[u]=h,b[d]=g;let x=l>0,S=(x?l:-l)-1,C=e*2+ +!x;c.setHex(S).convertSRGBToLinear();let w=eg[C],T=x?[_,ng(_,v),ng(ng(_,v),b),ng(_,b)]:[_,ng(_,b),ng(ng(_,v),b),ng(_,v)],E=t.pos.length/3,D=x?1:-1;for(let n of T)t.pos.push(s[0]+n[0]*a,s[1]+n[1]*a,s[2]+n[2]*a),t.nor.push(e===0?D:0,e===1?D:0,e===2?D:0),t.col.push(c.r*w,c.g*w,c.b*w);t.idx.push(E,E+1,E+2,E,E+2,E+3);for(let e=0;e<g;e++)for(let t=0;t<h;t++)m[y+t+e*f]=0;i+=h,y+=h}}}}var ng=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]];function rg(e){let t=1,n=1,r=(e,r)=>{t=Math.max(t,Math.abs(e[0])+r,Math.abs(e[2])+r),n=Math.max(n,e[1]+r)};for(let n of e.prims)n.t===`box`?(r(n.min,.1),r(n.max,.1)):n.t===`seg`?(r(n.a,n.w+.1),r(n.b,n.w+.1)):n.t===`blob`?r(n.c,Math.max(...n.r)*1.3+.2):(r([0,n.y1,0],.4),t=Math.max(t,n.r*1.3+.8));return[t+1,n+1]}var ig=new Map;function ag(e,t,n=0){let r=e*16+t,i=ig.get(r);i||ig.set(r,i=$h(e,t));let[a,o]=rg(i),s=Zd[e].trunk*.5,c=Eh[n],l=e=>Math.max(1,Math.round(s/e))%2==1,u=new Fh(c,l(c),a,o),d=n===0?new Fh(Th,l(Th),a,o):u;for(let e of i.prims)if(e.t===`box`)Ih(u,e);else if(e.t===`seg`){if(n>0&&e.w<.2&&!e.leaf)continue;Lh(e.leaf?u:d,e)}for(let e of i.prims)e.t===`blob`?zh(u,e):e.t===`cone`&&Bh(u,e);i.fruit&&Vh(u,i.fruit);let f={pos:[],nor:[],col:[],idx:[]};tg(u,f),d!==u&&tg(d,f);let p=new jr;return p.setAttribute(`position`,new G(f.pos,3)),p.setAttribute(`normal`,new G(f.nor,3)),p.setAttribute(`color`,new G(f.col,3)),p.setIndex(f.idx),p.computeBoundingSphere(),p.computeBoundingBox(),p}var og=new Sn,sg=new Sn,cg=new W,lg=new Sn().makeScale(0,0,0),ug=new Jt,dg=new xn,fg=new H,pg=new H,mg=.32,hg=4,gg=class{constructor(e,t){m(this,`trees`,void 0),m(this,`shadows`,void 0),m(this,`group`,new di),m(this,`mat`,new Eo({vertexColors:!0})),m(this,`shadowMat`,new _r({colorWrite:!1,depthWrite:!1})),m(this,`near`,void 0),m(this,`mid`,void 0),m(this,`far`,void 0),m(this,`proxy`,void 0),m(this,`slot`,new Map),m(this,`nearList`,[]),m(this,`ghosts`,[]),m(this,`ghostDepthMat`,new _r({colorWrite:!1,transparent:!0,opacity:0})),m(this,`lastX`,1e9),m(this,`lastZ`,1e9),m(this,`lastR`,0),m(this,`drawn`,0),this.trees=e,this.shadows=t,this.ghostDepthMat.depthWrite=!0,this.near=this.makeSet(0,!1,this.mat),this.mid=this.makeSet(1,t,this.mat),this.far=this.makeSet(2,!1,this.mat),this.proxy=this.makeSet(1,t,this.shadowMat,this.mid.geos),t||this.proxy.meshes.forEach(e=>e.visible=!1)}makeSet(e,t,n,r){let i=[];for(let t=0;t<8;t++)for(let n=0;n<4;n++)i.push(r?r[t*4+n]:ag(t,n,e));let a={lod:e,geos:i,shadows:t,mat:n,meshes:[]};return a.meshes=i.map(e=>this.makeMesh(a,e,128)),a}makeMesh(e,t,n){let r=new Ti(t,e.mat,n);return r.count=0,r.castShadow=e.shadows,r.receiveShadow=!1,r.frustumCulled=!1,r.instanceMatrix.setUsage(ct),this.group.add(r),r}update(e,t,n){if(Math.hypot(e-this.lastX,t-this.lastZ)<6&&Math.abs(n-this.lastR)<8)return;this.lastX=e,this.lastZ=t,this.lastR=n;let r=this.trees,i=[0,1,2].map(()=>Array.from({length:32},()=>[])),a=Math.max(0,Math.floor((e-n)/32)),o=Math.min(r.per-1,Math.floor((e+n)/32)),s=Math.max(0,Math.floor((t-n)/32)),c=Math.min(r.per-1,Math.floor((t+n)/32)),l=n*n;for(let n=s;n<=c;n++)for(let s=a;s<=o;s++){let a=n*r.per+s;for(let n=r.chunkStart[a];n<r.chunkStart[a+1];n++){let a=r.x[n]-e,o=r.z[n]-t,s=a*a+o*o;s>l||i[s<256?0:s<2304?1:2][r.kind[n]*4+r.variant[n]].push(n)}}this.drawn=0,this.slot.clear(),this.nearList=i[0].flat(),this.fill(this.near,i[0],!0),this.fill(this.proxy,i[0],!1),this.fill(this.mid,i[1],!1),this.fill(this.far,i[2],!1);for(let e of this.ghosts)this.hide(e.tree)}fill(e,t,n){t.forEach((t,r)=>{let i=e.meshes[r];t.length>i.instanceMatrix.count&&(this.group.remove(i),i.dispose(),i=e.meshes[r]=this.makeMesh(e,e.geos[r],Math.ceil(t.length*1.5)),e===this.proxy&&!this.shadows&&(i.visible=!1)),t.forEach((e,t)=>{this.matrix(e,og),i.setMatrixAt(t,og),i.setColorAt(t,cg.setScalar(this.tint(e))),n&&this.slot.set(e,r*65536+t)}),i.count=t.length,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0),e!==this.proxy&&(this.drawn+=t.length)})}matrix(e,t){let n=this.trees,r=n.scale[e];return sg.makeRotationY(n.turn[e]*Math.PI/2),t.makeScale(r,r,r).premultiply(sg),t.setPosition(n.x[e],n.y[e],n.z[e]),t}tint(e){return .9+(e*2654435761>>>0)/4294967296*.2}hide(e,t=!1){let n=this.slot.get(e);if(n===void 0)return;let r=this.near.meshes[n>>16];r.setMatrixAt(n&65535,t?this.matrix(e,og):lg),r.instanceMatrix.needsUpdate=!0}bounds(e,t){let n=this.trees,r=this.near.geos[n.kind[e]*4+n.variant[e]];t.copy(r.boundingBox).applyMatrix4(this.matrix(e,og));let i=(t.max.x-t.min.x)*.1,a=(t.max.z-t.min.z)*.1;return t.min.x+=i,t.max.x-=i,t.min.z+=a,t.max.z-=a,t}occlude(e,t,n,r){let i=new Set;for(let r of this.nearList){let a=this.trees.x[r]-t.x,o=this.trees.z[r]-t.z;if(!(a*(e.x-t.x)+o*(e.z-t.z)<-4)&&!(a*a+o*o>400)){this.bounds(r,ug);for(let a of[.25,.55,.9]){pg.set(t.x,t.y+n*a,t.z);let o=pg.distanceTo(e);if(dg.set(e,fg.subVectors(pg,e).normalize()),dg.intersectBox(ug,fg)&&fg.distanceTo(e)<o-.2){i.add(r);break}}}}for(let e of i)!this.ghosts.some(t=>t.tree===e)&&this.slot.has(e)&&this.ghosts.push(this.makeGhost(e));for(let e=this.ghosts.length-1;e>=0;e--){let t=this.ghosts[e];t.target=i.has(t.tree)?mg:1;let n=hg*r*.6799999999999999;t.alpha=t.alpha<t.target?Math.min(t.target,t.alpha+n):Math.max(t.target,t.alpha-n),t.color.material.opacity=t.alpha,(t.alpha>=1||!this.slot.has(t.tree))&&(this.hide(t.tree,!0),this.group.remove(t.depth,t.color),t.color.material.dispose(),this.ghosts.splice(e,1))}}makeGhost(e){let t=this.trees,n=this.near.geos[t.kind[e]*4+t.variant[e]],r=this.tint(e),i=new Eo({vertexColors:!0,transparent:!0,depthWrite:!1,opacity:1});i.color.setScalar(r);let a=new Ur(n,this.ghostDepthMat),o=new Ur(n,i);for(let t of[a,o])this.matrix(e,t.matrix),t.matrixAutoUpdate=!1,t.castShadow=!1,t.frustumCulled=!1;return a.renderOrder=20,o.renderOrder=21,this.group.add(a,o),this.hide(e),{tree:e,alpha:1,target:mg,depth:a,color:o}}get ghostCount(){return this.ghosts.length}dispose(){for(let e of[this.near,this.mid,this.far,this.proxy])for(let t of e.meshes)t.dispose();for(let e of[this.near,this.mid,this.far])for(let t of e.geos)t.dispose();for(let e of this.ghosts)e.color.material.dispose();this.mat.dispose(),this.shadowMat.dispose(),this.ghostDepthMat.dispose(),this.group.clear()}};function _g(e,t,n,r=5){let i=Math.hypot(n.x,n.y,n.z);if(!Number.isFinite(i)||i===0||!Number.isFinite(r)||r<0||![t.x,t.y,t.z].every(Number.isFinite))return null;let a={x:n.x/i,y:n.y/i,z:n.z/i},o={x:Math.floor(t.x),y:Math.floor(t.y),z:Math.floor(t.z)},s={x:Math.sign(a.x),y:Math.sign(a.y),z:Math.sign(a.z)},c={x:a.x?Math.abs(1/a.x):1/0,y:a.y?Math.abs(1/a.y):1/0,z:a.z?Math.abs(1/a.z):1/0},l=(e,t,n)=>n===0?1/0:(t>0?Math.floor(e)+1-e:e-Math.floor(e))/Math.abs(n),u={x:l(t.x,s.x,a.x),y:l(t.y,s.y,a.y),z:l(t.z,s.z,a.z)},d=0,f={x:0,y:0,z:0};for(;d<=r;){if(e.get(o)!==null){let n=e.top(o),i=0,s=r,c={...f},l=!0;for(let e of[`x`,`y`,`z`]){let r=o[e],u=e===`y`?n:o[e]+1;if(a[e]===0){(t[e]<r||t[e]>u)&&(l=!1);continue}let d=(r-t[e])/a[e],f=(u-t[e])/a[e],p=Math.min(d,f),m=Math.max(d,f);p>i&&(i=p,c={x:0,y:0,z:0},c[e]=a[e]>0?-1:1),s=Math.min(s,m)}if(l&&i<=s&&s>=0)return{pos:{...o},normal:c,distance:i}}let n=u.x<=u.y&&u.x<=u.z?`x`:u.y<=u.z?`y`:`z`;if(d=u[n],d>r||!Number.isFinite(d))break;o[n]+=s[n],u[n]+=c[n],f={x:0,y:0,z:0},f[n]=-s[n]}return null}var vg=class{constructor(){m(this,`target`,null),m(this,`targetId`,null),m(this,`toolKey`,``),m(this,`elapsed`,0),m(this,`duration`,1)}cancel(){this.target=null,this.targetId=null,this.toolKey=``,this.elapsed=0}get progress(){return this.targetId?Math.min(1,this.elapsed/this.duration):0}advance(e,t,n,r){let i=e.get(t),a=i?Vd.get(i):void 0;if(!a||!Number.isFinite(r)||r<0)return this.cancel(),{progress:0,broken:null,drop:null};let o=n?`${n.kind}:${n.tier}:${n.speed}:${n.durability>0}`:`hand`;this.target&&this.target.x===t.x&&this.target.y===t.y&&this.target.z===t.z&&this.targetId===i&&this.toolKey===o||(this.elapsed=0,this.target={...t},this.targetId=i,this.toolKey=o);let s=Hd(a,n);this.duration=s.seconds,this.elapsed+=r;let c=this.progress;if(c<1)return{progress:c,broken:null,drop:null};let l=e.remove(t);return this.cancel(),{progress:+!!l,broken:l,drop:l?s.drop:null}}},yg=class{constructor(e){m(this,`w`,void 0),m(this,`group`,new di),m(this,`chunks`,new Map),m(this,`revision`,-1),m(this,`atlas`,void 0),m(this,`mat`,void 0),m(this,`names`,Bd.map(e=>e.id)),m(this,`indices`,new Map(this.names.map((e,t)=>[e,t]))),m(this,`box`,new Kr(1,1,1)),m(this,`outline`,new Ki(new sa(this.box),new Pi({color:16772235,depthTest:!0}))),m(this,`previewMat`,new _r({color:7859882,transparent:!0,opacity:.35,depthWrite:!1})),m(this,`preview`,new Ur(this.box,this.previewMat)),m(this,`crackTex`,[]),m(this,`crackMat`,new _r({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})),m(this,`crack`,new Ur(this.box,this.crackMat)),m(this,`dropMat`,new Eo({map:Pu(),color:16777215})),m(this,`dropMesh`,new Ti(this.box,this.dropMat,4096)),m(this,`ray`,new vs),m(this,`dummy`,new Yn),this.w=e;let t={...e.map.palette.tiles,dirt:[10119746,9330747],oak_log:[8409903],birch_log:[12958370],spruce_log:[6770740],pine_log:[8610106],planks:[11897682],glass:[13166571],workbench:[10318140],furnace:[6448234],chest:[11041088]};this.atlas=Ku(this.names,t,e.map.palette.blocks??{}),this.mat=new Eo({map:this.atlas}),this.outline.visible=this.preview.visible=this.crack.visible=!1,this.outline.renderOrder=3,this.crack.renderOrder=4,this.group.add(this.outline,this.preview,this.crack,this.dropMesh),this.dropMesh.count=0,this.dropMesh.frustumCulled=!1;for(let e=0;e<10;e++){let t=document.createElement(`canvas`);t.width=t.height=64;let n=t.getContext(`2d`);n.strokeStyle=`#211c18`,n.lineWidth=1+e*.12;for(let t=0;t<=e;t++){n.beginPath(),n.moveTo(32,32);for(let e=1;e<5;e++){let r=t*2.399+e*.2;n.lineTo(32+Math.cos(r)*e*8,32+Math.sin(r)*e*8)}n.stroke()}let r=new ea(t);r.magFilter=D,this.crackTex.push(r)}}pick(e,t,n,r,i){return this.ray.setFromCamera(new V(t/r*2-1,-n/i*2+1),e),_g(this.w.blocks,this.ray.ray.origin,this.ray.ray.direction,180)}rebuild(e){let[t,n]=e.split(`,`).map(Number),r=t*32,i=n*32,a=this.w.terrain.size;if(r<0||i<0||r>=a||i>=a)return;let o=this.chunks.get(e);o&&(o.removeFromParent(),o.geometry.dispose());let s=[],c=[],l=[],u=[],d=new Map;for(let e of this.w.blocks.serialize().edits)e.id&&d.set(`${e.x},${e.z}`,Math.max(d.get(`${e.x},${e.z}`)??0,e.y+1));let f=this.w.blocks,p=(e,t,n,r)=>{let i=s.length/3;s.push(...e);for(let e=0;e<4;e++)c.push(...t);let a=this.indices.get(n)??this.indices.get(`stone`),o=(a+.015)/this.names.length,d=(a+.985)/this.names.length,f=1-(r+.985)/8,p=1-(r+.015)/8;l.push(o,f,d,f,d,p,o,p),u.push(i,i+1,i+2,i,i+2,i+3)};for(let e=i;e<Math.min(a,i+32);e++)for(let t=r;t<Math.min(a,r+32);t++){let n=this.w.terrain.groundY(t+.5,e+.5),r=Math.max(Math.ceil(n),d.get(`${t},${e}`)??0);for(let n=0;n<r;n++){let r={x:t,y:n,z:e},i=f.get(r);if(!i)continue;let a=f.top(r),o=f.get({x:t,y:n+1,z:e}),s=f.get({x:t,y:n-1,z:e}),c=t*13+e*7&3;(!o||a<n+1)&&p([t,a,e+1,t+1,a,e+1,t+1,a,e,t,a,e],[0,1,0],i,c),!s&&n>0&&p([t,n,e,t+1,n,e,t+1,n,e+1,t,n,e+1],[0,-1,0],i,5);for(let[r,o]of[[1,0],[-1,0],[0,1],[0,-1]]){let s={x:t+r,y:n,z:e+o},l=f.get(s)?Math.min(a,f.top(s)):n;if(l>=a-.001)continue;let u=/grass|snow/.test(i)?4:c;r===1&&p([t+1,l,e+1,t+1,l,e,t+1,a,e,t+1,a,e+1],[1,0,0],i,u),r===-1&&p([t,l,e,t,l,e+1,t,a,e+1,t,a,e],[-1,0,0],i,u),o===1&&p([t,l,e+1,t+1,l,e+1,t+1,a,e+1,t,a,e+1],[0,0,1],i,u),o===-1&&p([t+1,l,e,t,l,e,t,a,e,t+1,a,e],[0,0,-1],i,u)}}}let m=new jr;m.setAttribute(`position`,new G(s,3)),m.setAttribute(`normal`,new G(c,3)),m.setAttribute(`uv`,new G(l,2)),m.setIndex(u),m.computeBoundingSphere();let h=new Ur(m,this.mat);h.receiveShadow=h.castShadow=!0,this.group.add(h),this.chunks.set(e,h)}update(){let e=this.w.blocks,t=this.w.player;if(this.revision!==e.revision){this.revision=e.revision;for(let t of e.renderChunks)this.rebuild(t)}for(let[e,n]of this.chunks){let[r,i]=e.split(`,`).map(Number);n.visible=Math.hypot(r*32+16-t.x,i*32+16-t.z)<160}let n=this.w.building,r=n.enabled?n.hit:null;this.outline.visible=this.crack.visible=!!r,r&&(this.fit(this.outline,r.pos),this.fit(this.crack,r.pos,1.003),this.crack.visible=n.progress>0,this.crackMat.map=this.crackTex[Math.min(9,Math.floor(n.progress*10))]);let i=n.enabled&&n.selected?.block?n.placement():null;this.preview.visible=!!i,i&&(this.preview.position.set(i.x+.5,i.y+.5,i.z+.5),this.previewMat.color.setHex(n.canPlace(i)?6750122:16729173));let a=0;for(let e of n.drops){if(a>=4096)break;this.dummy.position.set(e.x,e.y+.07+Math.sin(e.age*3)*.035,e.z),this.dummy.scale.setScalar(.22),this.dummy.rotation.set(.15,e.age,.1),this.dummy.updateMatrix(),this.dropMesh.setMatrixAt(a,this.dummy.matrix);let t=Jd(e.id)?.block??`stone`;this.dropMesh.setColorAt(a,new W(this.w.map.palette.tiles[t]?.[0]??10123604)),a++}this.dropMesh.count=a,this.dropMesh.instanceMatrix.needsUpdate=!0,this.dropMesh.instanceColor&&(this.dropMesh.instanceColor.needsUpdate=!0)}fit(e,t,n=1){let r=this.w.blocks.top(t),i=Math.max(.01,r-t.y);e.position.set(t.x+.5,t.y+i/2,t.z+.5),e.scale.set(n,i*n,n)}dispose(){for(let e of this.chunks.values())e.geometry.dispose();this.box.dispose(),this.outline.geometry.dispose(),this.outline.material.dispose(),this.previewMat.dispose(),this.crackMat.dispose(),this.crackTex.forEach(e=>e.dispose()),this.atlas.dispose(),this.mat.dispose(),this.dropMat.map?.dispose(),this.dropMat.dispose(),this.dropMesh.dispose(),this.group.clear()}},bg={uniforms:{tDiffuse:{value:null}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  bool bad = !(c.r == c.r && c.g == c.g && c.b == c.b) || max(max(c.r, c.g), c.b) > 6e4;
  gl_FragColor = bad ? vec4(0.0, 0.0, 0.0, 1.0) : vec4(min(c.rgb, vec3(64.0)), c.a);
}`},xg={uniforms:{tDiffuse:{value:null},uSat:{value:1.06},uWarm:{value:.04},uRes:{value:new V(1,1)},uBlur:{value:0},uHaze:{value:new W(9417626)},uHazeK:{value:.1},uShadow:{value:new H(.9,1,1.12)},uHigh:{value:new H(1.06,1,.92)},uVig:{value:.22}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform sampler2D tDiffuse; uniform float uSat; uniform float uWarm; uniform vec2 uRes; uniform float uBlur;
uniform vec3 uHaze; uniform float uHazeK; uniform vec3 uShadow; uniform vec3 uHigh; uniform float uVig; varying vec2 vUv;
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  // tilt-shift: sharp band around the hero, growing blur toward the top (far) and bottom edges
  float dy = vUv.y - 0.47;
  float b = uBlur * smoothstep(0.1, 0.5, abs(dy) * (dy > 0.0 ? 1.0 : 0.85));
  if (b > 0.35) {
    vec3 acc = c.rgb;
    float wsum = 1.0;
    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 12.0) * b;
      float a = fi * 2.39996;
      vec2 o = vec2(cos(a), sin(a)) * r / uRes;
      acc += texture2D(tDiffuse, vUv + o).rgb;
      wsum += 1.0;
    }
    c.rgb = acc / wsum;
  }
  // distance haze toward the top of the screen
  c.rgb = mix(c.rgb, uHaze, uHazeK * smoothstep(0.55, 1.0, vUv.y));
  // split tone + saturation + temperature
  float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  c.rgb *= mix(uShadow, uHigh, smoothstep(0.02, 0.7, l));
  l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  c.rgb = max(vec3(0.0), mix(vec3(l), c.rgb, uSat));
  c.rgb *= vec3(1.0 + uWarm, 1.0, 1.0 - uWarm);
  vec2 q = (vUv - 0.5) * vec2(1.0, 0.8);
  c.rgb *= 1.0 - uVig * smoothstep(0.08, 0.5, dot(q, q) * 1.6);
  gl_FragColor = c;
}`},Sg={uniforms:{tDiffuse:{value:null},tDepth:{value:null},uNear:{value:1},uFar:{value:200},uRes:{value:new V(1,1)},uProj:{value:600},uRadius:{value:1.2},uStrength:{value:.8},uTint:{value:new H(.2,.27,.36)},uSteps:{value:2}},vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`#include <packing>
uniform sampler2D tDiffuse; uniform sampler2D tDepth; uniform float uNear; uniform float uFar; uniform vec2 uRes;
uniform float uProj; uniform float uRadius; uniform float uStrength; uniform vec3 uTint; uniform int uSteps; varying vec2 vUv;
float invZ(vec2 uv) { return -1.0 / perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar); }
void main() {
  vec4 c = texture2D(tDiffuse, vUv);
  float d = texture2D(tDepth, vUv).x;
  if (d >= 0.99999) { gl_FragColor = c; return; }
  float z0 = -perspectiveDepthToViewZ(d, uNear, uFar);
  float iz0 = 1.0 / z0;
  float rpx = clamp(uRadius * uProj / z0, 3.0, 80.0);
  float occ = 0.0;
  float n = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 0.5236 + 0.26;
    vec2 dir = vec2(cos(a), sin(a)) * rpx / uRes;
    for (int s = 1; s <= 2; s++) {
      if (s > uSteps) break;
      float k = float(s) / float(uSteps);
      float za = invZ(vUv + dir * k);
      float zb = invZ(vUv - dir * k);
      // positive when both neighbours are nearer than the plane through them: a concave crease
      float crease = (0.5 * (za + zb) - iz0) * z0 * z0;
      float dz = max(abs(1.0 / za - z0), abs(1.0 / zb - z0));
      float range = 1.0 - smoothstep(uRadius * 0.9, uRadius * 1.8, dz);
      occ += clamp(crease / (uRadius * 0.35 * k), 0.0, 1.0) * range;
      n += 1.0;
    }
  }
  occ = clamp(occ / n * 3.0, 0.0, 1.0) * uStrength;
  c.rgb *= mix(vec3(1.0), uTint, occ);
  gl_FragColor = c;
}`},Cg=class extends oh{constructor(e){super(),m(this,`camera`,void 0),m(this,`material`,new ei(Sg)),m(this,`quad`,new lh(this.material)),this.camera=e}render(e,t,n){let r=this.material.uniforms;r.tDiffuse.value=n.texture,r.tDepth.value=n.depthTexture,r.uNear.value=this.camera.near,r.uFar.value=this.camera.far,r.uRes.value.set(n.width,n.height),r.uProj.value=n.height/(2*Math.tan(this.camera.fov*Math.PI/360)),e.setRenderTarget(this.renderToScreen?null:t),this.quad.render(e)}dispose(){this.material.dispose(),this.quad.dispose()}},wg={sky:11065576,skyMix:.3,ground:2640986,groundMix:.45,sun:16769200,sunMix:.35,sunMul:1.12,ambMul:.88},Tg=class{pickBlock(e,t,n,r){return this.voxels?.pick(this.rig.camera,e,t,n,r)??null}constructor(e,t){m(this,`container`,void 0),m(this,`voxels`,null),m(this,`gl`,void 0),m(this,`overlay`,void 0),m(this,`rig`,void 0),m(this,`scene`,new hi),m(this,`hemi`,void 0),m(this,`sun`,void 0),m(this,`blockTex`,Pu()),m(this,`blobTex`,Fu()),m(this,`world`,null),m(this,`entities`,null),m(this,`particles`,null),m(this,`lights`,void 0),m(this,`run`,null),m(this,`quality`,`medium`),m(this,`s`,void 0),m(this,`msaa`,void 0),m(this,`viewMul`,1),m(this,`cullT`,0),m(this,`zoomLevel`,1),m(this,`time`,0),m(this,`menuTerrain`,null),m(this,`showHero`,null),m(this,`menuMode`,!1),m(this,`menuX`,0),m(this,`menuZ`,0),m(this,`menuAngle`,0),m(this,`menuShift`,0),m(this,`photo`,null),m(this,`menuShiftNow`,0),m(this,`w`,1),m(this,`h`,1),m(this,`composer`,null),m(this,`bloom`,null),m(this,`grade`,null),m(this,`ao`,null),m(this,`ambient`,null),m(this,`trees`,null),m(this,`heroAt`,new H),m(this,`heroMid`,new H),m(this,`occ`,0),m(this,`cA`,new W),m(this,`cB`,new W),this.container=e,this.s=t,this.quality=t.effects,this.msaa=t.antiAliasing!==`off`,this.gl=new wu({antialias:this.msaa,powerPreference:`high-performance`,alpha:!1}),this.gl.outputColorSpace=nt,this.gl.shadowMap.type=2,this.gl.domElement.className=`game-canvas`,e.appendChild(this.gl.domElement),this.overlay=new rh(e),this.rig=new ju(1),this.hemi=new Wo(16777215,4210752,.6),this.sun=new ns(16777215,1.2),this.sun.shadow.camera.left=-20,this.sun.shadow.camera.right=20,this.sun.shadow.camera.top=20,this.sun.shadow.camera.bottom=-20,this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=70,this.sun.shadow.bias=-8e-4,this.sun.shadow.normalBias=.03,this.scene.add(this.hemi,this.sun,this.sun.target),this.lights=new ih(this.scene,this.lightCount()),this.applySettings(t),this.resize(),window.addEventListener(`resize`,()=>this.resize())}lightCount(){return this.quality===`low`?2:this.quality===`medium`?5:8}get particleMul(){return this.s.particles===`low`?.4:this.s.particles===`medium`?.75:1}applySettings(e){this.s=e;let t=e.effects,n=t!==this.quality;this.quality=t;let r=e.shadows;this.gl.shadowMap.enabled=r!==`off`,this.sun.castShadow=r!==`off`,this.gl.shadowMap.type=r===`low`?1:2;let i=r===`high`?4096:r===`medium`?2048:1024;this.sun.shadow.mapSize.x!==i&&(this.sun.shadow.mapSize.set(i,i),this.sun.shadow.map?.dispose(),this.sun.shadow.map=null);for(let t of[this.blockTex,this.blobTex]){let n=e.textures!==`low`;t.generateMipmaps=n,t.minFilter=n?k:D,t.anisotropy=e.textures===`high`?Math.min(16,this.gl.capabilities.getMaxAnisotropy()):e.textures===`medium`?4:1,t.needsUpdate=!0}if(this.gl.toneMapping=e.postProcessing?4:0,this.gl.toneMappingExposure=e.postProcessing?1.2:1,e.postProcessing&&!this.composer?this.makeComposer():!e.postProcessing&&this.composer&&(this.composer.dispose(),this.composer=null,this.bloom=null,this.grade=null,this.ao=null),this.bloom&&(this.bloom.strength=e.effects===`low`?.3:.5),this.ao&&(this.ao.enabled=e.effects!==`low`),this.ao&&(this.ao.material.uniforms.uSteps.value=e.effects===`high`?2:1),this.viewMul={near:.8,medium:1,far:1.3,max:1.7}[e.viewDistance]??1,this.applyFar(),this.rig.camera.updateProjectionMatrix(),this.rig.shake=e.screenShake,this.overlay.showNumbers=e.damageNumbers,n){for(let e of this.lights.lights)this.scene.remove(e);this.lights=new ih(this.scene,this.lightCount())}this.scene.fog&&this.run&&this.setAtmosphere(this.run.map),this.resize()}makeComposer(){let e=new Gt(1,1,{type:ae,samples:this.msaa?4:0});e.depthTexture=new ta(1,1,re);let t=new ph(this.gl,e);t.addPass(new mh(this.scene,this.rig.camera)),this.ao=new Cg(this.rig.camera),this.ao.enabled=this.s.effects!==`low`,this.ao.material.uniforms.uSteps.value=this.s.effects===`high`?2:1,t.addPass(this.ao),t.addPass(new uh(bg)),this.bloom=new gh(new V(256,256),.5,.5,1.05),t.addPass(this.bloom),this.grade=new uh(xg),t.addPass(this.grade),t.addPass(new vh),this.composer=t}setZoom(e){this.zoomLevel=e}get detail(){return this.s.shadows===`off`?`low`:this.quality}get currentQuality(){return this.quality}resize(){let e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.w=e,this.h=t;let n=window.devicePixelRatio||1,r=this.quality===`low`?Math.min(n,1):Math.min(n,2),i=this.s.resolution;if(i&&i!==`native`){let[n,a]=i.split(`x`).map(Number);n>0&&a>0&&(r=Math.min(n/e,a/t))}if(this.s.antiAliasing===`ssaa`&&(r*=1.5),this.gl.setPixelRatio(Math.max(.5,Math.min(3,r))),this.gl.setSize(e,t,!1),this.composer&&(this.composer.setPixelRatio(this.gl.getPixelRatio()),this.composer.setSize(e,t)),this.grade){let n=this.gl.getPixelRatio();this.grade.uniforms.uRes.value.set(e*n,t*n),this.grade.uniforms.uBlur.value=this.quality===`low`?0:(this.quality===`high`?3.2:2.4)*n*(t/900)}this.gl.domElement.style.width=e+`px`,this.gl.domElement.style.height=t+`px`,this.rig.resize(e,t),this.overlay.resize(e,t,window.devicePixelRatio||1)}applyFar(){this.rig.camera.far=240*this.viewMul,this.rig.camera.updateProjectionMatrix()}setAtmosphere(e){let t=e.palette;this.scene.background=new W(t.fog),this.scene.fog=new mi(t.fog,(t.fogNear+8)*this.viewMul,(t.fogFar+12)*this.viewMul),this.hemi.color.setHex(t.ambient).lerp(this.cA.setHex(wg.sky),wg.skyMix),this.hemi.groundColor.setHex(t.hemiGround).lerp(this.cA.setHex(wg.ground),wg.groundMix),this.hemi.intensity=t.ambientIntensity*3*wg.ambMul,this.sun.color.setHex(t.sun).lerp(this.cA.setHex(wg.sun),wg.sunMix),this.sun.intensity=t.sunIntensity*2.4*wg.sunMul}buildWorld(e,t){this.disposeWorld(),this.setAtmosphere(t),this.world=new Id(e,t,this.blockTex,this.detail),this.scene.add(this.world.group),this.menuTerrain=e}snapTo(e,t){this.rig.snap(e,t,this.run?this.run.terrain.groundY(e,t):0),this.world?.cull(e,t,70,0)}startRun(e,t){return this.menuMode=!1,this.clearMenuHero(),this.run=e,Ld.fn=(t,n)=>e.terrain.groundY(t,n),this.buildWorld(e.terrain,e.map),this.voxels=new yg(e),this.scene.add(this.voxels.group),this.applyFar(),this.entities=new Hm(e,this.s.shadows!==`off`),this.scene.add(this.entities.group),e.trees&&(this.trees=new gg(e.trees,this.s.shadows!==`off`),this.scene.add(this.trees.group),this.trees.update(e.player.x,e.player.z,110)),this.particles=new eh(this.scene,this.blockTex,this.blobTex,this.s.particles),this.ambient=new Ch(this.scene,e.map.generator,this.quality,this.particleMul),this.overlay.clear(),this.rig.snap(e.player.x,e.player.z,e.player.y),this.world?.cull(e.player.x,e.player.z,70,0),this.makeFx(t)}markMove(e,t){this.entities?.markMove(e,t)}get heroModel(){return this.entities?.hero??null}makeFx(e){let t=this;return{burst(e,n,r,i,a,o,s,c,l){let u=t.particleMul;t.particles?.burst(e,n,r,i,Math.max(1,Math.round(a*u)),o,s,c,l)},number(e,n,r,i,a){t.overlay.number(e,n,r,i,a)},text(e,n,r,i){t.overlay.text(e,n,r,i)},shake(e){t.rig.addShake(e)},light(e,n,r,i,a,o){t.lights.flash(e,n,r,i,a,o)},sound:e.sound,vibrate:e.vibrate,emit(e,n,r,i,a=0,o=0,s=1){t.particles?.emit(e,n,r,i,a,o,s*t.particleMul)},level(){return t.s.effects===`low`?0:t.s.effects===`medium`?1:2}}}endRun(){this.voxels&&(this.voxels.group.removeFromParent(),this.voxels.dispose(),this.voxels=null),this.entities&&(this.scene.remove(this.entities.group),this.entities.dispose(),this.entities=null),this.particles?.dispose(),this.particles=null,this.trees&&(this.scene.remove(this.trees.group),this.trees.dispose(),this.trees=null),this.ambient?.dispose(),this.ambient=null,this.disposeWorld(),this.run=null,this.applyFar(),Ld.fn=null,this.overlay.clear()}disposeWorld(){this.world&&(this.scene.remove(this.world.group),this.world.dispose(),this.world=null),this.menuTerrain=null}showMenu(e,t,n,r){this.endRun(),this.menuMode=!0,this.menuX=n,this.menuZ=r,Ld.fn=(e,n)=>t.groundY(e,n),this.buildWorld(t,e),this.scene.fog=new mi(e.palette.fog,14,44),this.world?.cull(n,r,60,0),this.clearMenuHero(),this.showHero=new am(`human`,!0),this.scene.add(this.showHero.root)}clearMenuHero(){this.showHero&&(this.scene.remove(this.showHero.root),this.showHero.dispose(),this.showHero=null)}frame(e){this.time+=e;let t=this.lights;t.begin(),this.menuMode?this.menuFrame(e):this.run&&this.runFrame(e);let n=this.rig.target;t.end(e,n.x,n.z),this.world?.update(this.time,0),this.composer?this.composer.render(e):this.gl.render(this.scene,this.rig.camera),this.overlay.draw(e,this.rig.camera,this.menuMode?null:this.run)}menuFrame(e){let t=this.menuX,n=this.menuZ,r=this.menuTerrain?this.menuTerrain.groundY(t,n):0;this.menuAngle+=e*.12;let i=this.rig.camera,a=this.h>this.w,o=a?9:7;this.menuShiftNow+=(this.menuShift-this.menuShiftNow)*(1-Math.exp(-6*e));let s=a?0:this.menuShiftNow*o*Math.tan(i.fov*Math.PI/360)*i.aspect*.58,c=-Math.sin(this.menuAngle),l=-Math.cos(this.menuAngle)*s,u=-c*s;i.position.set(t+Math.sin(this.menuAngle)*o+l,r+(a?4.5:3.6),n+Math.cos(this.menuAngle)*o+u),i.lookAt(t+l,r+1.1,n+u),this.sun.position.set(t+10,25,n+6),this.sun.target.position.set(t,0,n);let d=this.showHero;d&&(d.root.position.set(t,r,n),d.root.rotation.y=this.menuAngle+Math.sin(this.time*.5)*.3,d.pose({walk:0,moving:0,airborne:!1,vy:0,attack:null,time:this.time})),this.lights.request(t+1.5,r+2.5,n+1.5,16760944,1,9,t,n)}runFrame(e){let t=this.run,n=t.player;if(this.rig.zoom+=(this.zoomLevel-this.rig.zoom)*(1-Math.exp(-10*Math.max(e,1/120))),this.rig.update(e,n.x,n.z,void 0,n.airborne?Math.min(n.y,n.ground+.5):n.ground,(e,n)=>t.terrain.groundY(e,n),(e,n)=>this.canopy(t.terrain,e,n)),this.photo){let e=this.photo;this.rig.camera.position.set(e.x,e.y,e.z),this.rig.camera.lookAt(e.lx,e.ly,e.lz)}let r=this.rig.zoom,i=this.rig.target,a=t.map.palette,o=t.dayNight.light,s=t.dayNight.night;this.hemi.intensity=a.ambientIntensity*3*wg.ambMul*o.ambient,this.sun.intensity=a.sunIntensity*2.4*wg.sunMul*o.sun,this.hemi.color.setHex(a.ambient).lerp(this.cA.setHex(wg.sky),wg.skyMix*(1-o.tint)).lerp(this.cA.setHex(o.ambientColor),o.tint),this.hemi.groundColor.setHex(a.hemiGround).lerp(this.cA.setHex(wg.ground),wg.groundMix),this.sun.color.setHex(a.sun).lerp(this.cA.setHex(wg.sun),wg.sunMix*(1-o.tint)).lerp(this.cA.setHex(o.sunColor),o.tint);let c=this.scene.fog;if(c.color.setHex(a.fog).lerp(this.cB.setHex(o.fogColor),o.fogTint),this.scene.background instanceof W&&this.scene.background.copy(c.color),this.grade){let e=this.grade.uniforms;e.uWarm.value=o.warm,e.uSat.value=o.sat*.82,e.uHaze.value.copy(c.color),e.uHazeK.value=.08+s*.08,e.uShadow.value.set(.9-s*.18,1-s*.04,1.12+s*.28)}let l=this.rig.distance*this.rig.autoZoom,u=this.viewMul,d=o.fog,f=.35+.65*o.fog;c.near=Math.max(l*.75,l-6+(a.fogNear-18)*u*d),c.far=Math.max(l+12,l-6+(a.fogFar-6)*u*f),this.photo?.noFog&&(c.near=400,c.far=900);let p=26*Math.max(1,r*this.rig.autoZoom),m=this.sun.shadow.camera;m.right!==p&&(m.left=m.bottom=-p,m.right=m.top=p,m.updateProjectionMatrix()),this.cullT-=e,this.cullT<=0&&(this.cullT=.25,this.world?.cull(i.x,i.z,c.far+6),this.trees?.update(i.x,i.z,Math.min(c.far+4,84)));let h=t.dayNight.sunArc,g=Math.atan2(.22,-.97)+h*.55,_=26-Math.abs(h)*6,v=i.x-this.rig.toCam.x*3,y=i.z-this.rig.toCam.z*3;this.sun.position.set(v+Math.cos(g)*17,i.y+_,y+Math.sin(g)*17),this.sun.target.position.set(v,i.y,y),this.world?.uniforms.uFocus.value.set(n.x,n.y,n.z),this.world?.trackHero(n.x,n.z,n.y-n.ground,e),this.world&&(this.world.uniforms.uNight.value=s),this.world?.uniforms.uCamDir.value.set(this.rig.toCam.x,this.rig.toCam.z),a.heroLight?this.lights.request(n.x,2.6,n.z,a.heroLight,1.6+s*.4,9,i.x,i.z):s>.05&&this.lights.request(n.x,2.6,n.z,16767136,2.6*s,10,i.x,i.z),this.entities.update(e),this.particles.update(e),this.trees?.occlude(this.rig.camera.position,this.heroAt.set(n.x,n.y,n.z),1.8,e),this.voxels?.update(),this.world?.hideVoxelGround(t.blocks.renderChunks,t.blocks.columns),this.world?.occlude(this.groundOcc(t.terrain,n,e),this.rig.camera,this.heroMid.set(n.x,n.y+.9,n.z));let b=this.rig.camera,x=this.h*this.gl.getPixelRatio()/(2*Math.tan(b.fov*Math.PI/360));this.ambient?.update(e,i.x,i.z,s,x,0,i.y)}groundOcc(e,t,n){let r=this.rig.camera.position,i=!1;for(let n of[.3,.9,1.6]){let a=t.y+n,o=Math.hypot(t.x-r.x,a-r.y,t.z-r.z),s=Math.ceil(o/.25);for(let n=1;n<s&&!i;n++){let c=n/s;if((1-c)*o<.7)break;i=e.groundY(r.x+(t.x-r.x)*c,r.z+(t.z-r.z)*c)>r.y+(a-r.y)*c+.05}if(i)break}return this.occ+=(+!!i-this.occ)*(1-Math.exp(-6*n)),!i&&this.occ<.01&&(this.occ=0),this.occ}canopy(e,t,n){let r=0,i=Math.floor(t-e.ox),a=Math.floor(n-e.oz);for(let t=-3;t<=3;t++)for(let n=-3;n<=3;n++){let o=i+n,s=a+t;if(!e.inLocal(o,s))continue;let c=s*e.size+o;e.cell[c]===J.solid&&e.height[c]&&(r=Math.max(r,e.centerY(c)+e.height[c]))}return r}dispose(){this.clearMenuHero(),this.endRun(),this.gl.dispose()}},Eg=class{btn(e){return this.swapMouse&&(e===0||e===2)?2-e:e}constructor(e,t){m(this,`keys`,new Set),m(this,`enabled`,!1),m(this,`binds`,void 0),m(this,`onPause`,null),m(this,`onZoom`,null),m(this,`swapMouse`,!1),m(this,`invertWheel`,!1),m(this,`onInventory`,null),m(this,`onMap`,null),m(this,`onJump`,null),m(this,`onBuild`,null),m(this,`capture`,null),m(this,`mx`,-1),m(this,`my`,-1),m(this,`lmb`,!1),m(this,`rmb`,!1),m(this,`lmbPressed`,!1),m(this,`rmbPressed`,!1),m(this,`dragX`,0),m(this,`dragY`,0),m(this,`padPause`,!1),m(this,`padJump`,!1),this.binds=t,window.addEventListener(`keydown`,e=>{if(this.capture){e.preventDefault();let t=this.capture;this.capture=null,t(e.code);return}e.code===`Tab`&&this.enabled&&e.preventDefault();let t=e.target;if((!t||t.tagName!==`INPUT`&&t.tagName!==`SELECT`&&t.tagName!==`TEXTAREA`)&&!e.repeat){if(e.code===`Escape`||this.is(`pause`,e.code))this.onPause?.();else{if(this.enabled){if(this.is(`build`,e.code)){e.preventDefault(),this.onBuild?.();return}this.is(`zoomIn`,e.code)?this.onZoom?.(-1):this.is(`zoomOut`,e.code)&&this.onZoom?.(1),this.is(`jump`,e.code)&&(e.preventDefault(),this.onJump?.())}this.is(`inventory`,e.code)?this.onInventory?.():this.is(`map`,e.code)&&this.onMap?.(),this.keys.add(e.code)}}}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.lmb=this.rmb=!1}),e.addEventListener(`wheel`,e=>{this.enabled&&(e.preventDefault(),Math.abs(e.deltaY)>.5&&this.onZoom?.(Math.sign(e.deltaY)*(this.invertWheel?-1:1)))},{passive:!1}),e.addEventListener(`contextmenu`,e=>e.preventDefault());let n=t=>{let n=e.getBoundingClientRect();this.mx=t.clientX-n.left,this.my=t.clientY-n.top};e.addEventListener(`pointermove`,e=>{n(e),this.enabled&&this.rmb&&(this.dragX+=e.movementX,this.dragY+=e.movementY)}),e.addEventListener(`pointerdown`,t=>{if(n(t),!this.enabled)return;let r=this.btn(t.button);r===0?(this.lmb=!0,this.lmbPressed=!0):r===2&&(this.rmb=!0,this.rmbPressed=!0),e.setPointerCapture?.(t.pointerId)}),e.addEventListener(`pointerup`,e=>{let t=this.btn(e.button);t===0?this.lmb=!1:t===2&&(this.rmb=!1)}),e.addEventListener(`pointercancel`,()=>this.lmb=this.rmb=!1)}is(e,t){return this.binds[e]?.includes(t)??!1}held(e){for(let t of this.binds[e]??[])if(this.keys.has(t))return!0;return!1}update(){let e=navigator.getGamepads?.()??[];for(let t of e)t&&(t.buttons[9]?.pressed&&!this.padPause?(this.padPause=!0,this.enabled&&this.onPause?.()):t.buttons[9]?.pressed||(this.padPause=!1),t.buttons[0]?.pressed&&!this.padJump?(this.padJump=!0,this.enabled&&this.onJump?.()):t.buttons[0]?.pressed||(this.padJump=!1))}setEnabled(e){this.enabled=e,e||(this.keys.clear(),this.lmb=this.rmb=this.lmbPressed=this.rmbPressed=!1,this.dragX=this.dragY=0)}};function Dg(e){return e?e.startsWith(`Key`)?e.slice(3):e.startsWith(`Digit`)?e.slice(5):{ArrowUp:`↑`,ArrowDown:`↓`,ArrowLeft:`←`,ArrowRight:`→`,Escape:`Esc`,Space:`Space`,Equal:`=`,Minus:`-`,NumpadAdd:`Num +`,NumpadSubtract:`Num -`,ShiftLeft:`L-Shift`,ShiftRight:`R-Shift`,ControlLeft:`L-Ctrl`,ControlRight:`R-Ctrl`,AltLeft:`L-Alt`,AltRight:`R-Alt`,Tab:`Tab`,Enter:`Enter`,Backquote:"`",Comma:`,`,Period:`.`,Slash:`/`,Semicolon:`;`,Quote:`'`,BracketLeft:`[`,BracketRight:`]`,Backslash:`\\`,CapsLock:`Caps`}[e]??e.replace(`Numpad`,`Num `):`—`}var Og=[0,2,3,5,7,9,10],kg={menu:{bpm:84,root:50,scale:Og,prog:[0,5,3,4],lead:`triangle`,pad:`sine`,drums:0,swing:0,arp:[0,-1,1,-1,2,-1,1,-1,0,-1,2,-1,3,-1,2,-1],bassPat:[0,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1],bright:1800},forest:{bpm:112,root:45,scale:Og,prog:[0,6,5,4],lead:`square`,pad:`triangle`,drums:1,swing:.08,arp:[0,1,2,1,3,2,1,2,0,1,2,3,4,3,2,1],bassPat:[0,-1,0,-1,-1,-1,0,-1,0,-1,-1,0,-1,-1,0,-1],bright:2400}},Ag=e=>440*2**((e-69)/12),jg=new Set([`ui`,`uiBack`,`select`,`denied`]),Mg=class{constructor(){m(this,`ctx`,null),m(this,`master`,void 0),m(this,`sfxBus`,void 0),m(this,`uiBus`,void 0),m(this,`bus`,void 0),m(this,`musicBus`,void 0),m(this,`comp`,void 0),m(this,`noiseBuf`,void 0),m(this,`last`,{}),m(this,`voices`,0),m(this,`sfxVol`,.8),m(this,`musicVol`,.6),m(this,`uiVol`,.8),m(this,`ambVol`,.7),m(this,`masterVol`,1),m(this,`ambBus`,void 0),m(this,`windGain`,null),m(this,`waterGain`,null),m(this,`critterT`,0),m(this,`song`,null),m(this,`songId`,``),m(this,`step`,0),m(this,`nextTime`,0),m(this,`timer`,null),m(this,`musicFilter`,void 0),m(this,`intensity`,0)}unlock(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.comp=this.ctx.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=6,this.master=this.ctx.createGain(),this.master.gain.value=.9,this.sfxBus=this.ctx.createGain(),this.uiBus=this.ctx.createGain(),this.bus=this.sfxBus,this.musicBus=this.ctx.createGain(),this.ambBus=this.ctx.createGain(),this.ambBus.connect(this.master),this.musicFilter=this.ctx.createBiquadFilter(),this.musicFilter.type=`lowpass`,this.musicFilter.frequency.value=2400,this.sfxBus.connect(this.comp),this.uiBus.connect(this.comp),this.musicBus.connect(this.musicFilter),this.musicFilter.connect(this.comp),this.comp.connect(this.master),this.master.connect(this.ctx.destination);let t=this.ctx.sampleRate;this.noiseBuf=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noiseBuf.getChannelData(0);for(let e=0;e<t;e++)n[e]=Math.random()*2-1;if(this.setVolumes(this.masterVol,this.sfxVol,this.musicVol,this.uiVol,this.ambVol),this.songId){let e=this.songId;this.songId=``,this.playMusic(e)}}this.ctx.state===`suspended`&&this.ctx.resume()}setVolumes(e,t,n,r,i=this.ambVol){this.masterVol=e,this.sfxVol=t,this.musicVol=n,this.uiVol=r,this.ambVol=i,this.ctx&&(this.ambBus.gain.value=i*.9,this.master.gain.value=.9*e,this.uiBus.gain.value=r*.9,this.sfxBus.gain.value=t*.9,this.musicBus.gain.value=n*.32)}suspend(e){this.ctx&&(e?this.ctx.suspend():this.ctx.resume())}tone(e,t,n,r,i,a,o=.005,s){let c=this.ctx,l=c.createOscillator(),u=c.createGain();l.type=t,l.frequency.setValueAtTime(n,e),r!==n&&l.frequency.exponentialRampToValueAtTime(Math.max(20,r),e+i),u.gain.setValueAtTime(1e-4,e),u.gain.exponentialRampToValueAtTime(a,e+o),u.gain.exponentialRampToValueAtTime(1e-4,e+i),l.connect(u),u.connect(s??this.bus),l.start(e),l.stop(e+i+.02)}noise(e,t,n,r,i,a,o=1,s){let c=this.ctx,l=c.createBufferSource();l.buffer=this.noiseBuf,l.playbackRate.value=.8+Math.random()*.4;let u=c.createBiquadFilter();u.type=r,u.Q.value=o,u.frequency.setValueAtTime(i,e),u.frequency.exponentialRampToValueAtTime(Math.max(30,a),e+t);let d=c.createGain();d.gain.setValueAtTime(1e-4,e),d.gain.exponentialRampToValueAtTime(n,e+.004),d.gain.exponentialRampToValueAtTime(1e-4,e+t),l.connect(u),u.connect(d),d.connect(s??this.bus),l.start(e,Math.random()*.5),l.stop(e+t+.02)}play(e,t=1){let n=jg.has(e);if(!this.ctx||this.ctx.state!==`running`||(n?this.uiVol:this.sfxVol)<=0||this.masterVol<=0)return;let r=this.ctx.currentTime,i=Ng[e]??.045;if(r-(this.last[e]??-1)<i||this.voices>28)return;this.last[e]=r;let a=Pg[e];a&&(this.voices++,setTimeout(()=>this.voices--,250),this.bus=n?this.uiBus:this.sfxBus,a(this,r,Math.min(1.2,t)),this.bus=this.sfxBus)}bed(e,t,n,r){let i=this.ctx,a=i.createBufferSource();a.buffer=this.noiseBuf,a.loop=!0;let o=i.createBiquadFilter();o.type=e,o.frequency.value=t,o.Q.value=n;let s=i.createOscillator();s.frequency.value=r;let c=i.createGain();c.gain.value=t*.35,s.connect(c),c.connect(o.frequency),s.start();let l=i.createGain();return l.gain.value=0,a.connect(o),o.connect(l),l.connect(this.ambBus),a.start(),l}setAmbience(e,t,n,r,i){if(!this.ctx||this.ctx.state!==`running`)return;this.windGain||(this.windGain=this.bed(`bandpass`,420,.6,.07),this.waterGain=this.bed(`highpass`,1800,.4,.9));let a=this.ctx.currentTime;if(this.windGain.gain.setTargetAtTime(e?.05+t*.08:0,a,.6),this.waterGain.gain.setTargetAtTime(e?n*.11:0,a,.4),!e||this.ambVol<=0||this.masterVol<=0||(this.critterT-=i,this.critterT>0))return;this.critterT=r?.25+Math.random()*.6:1.5+Math.random()*4;let o=this.ambBus;if(r){let e=4200+Math.random()*500;for(let t=0;t<3;t++)this.tone(a+t*.045,`sine`,e,e,.03,.012,.003,o)}else{let e=2+(Math.random()*2|0),t=2400+Math.random()*1400;for(let n=0;n<e;n++)this.tone(a+n*.11,`sine`,t*(1.15-n*.06),t*.8,.08,.02,.005,o)}}playMusic(e){this.songId!==e&&(this.songId=e,this.song=kg[e]??null,this.ctx&&(this.step=0,this.nextTime=this.ctx.currentTime+.1,this.musicFilter.frequency.setTargetAtTime(this.song?.bright??2e3,this.ctx.currentTime,.5),this.timer===null&&(this.timer=window.setInterval(()=>this.schedule(),50))))}setIntensity(e){this.intensity=e,this.ctx&&this.song&&this.musicFilter.frequency.setTargetAtTime(this.song.bright*(.8+e*.5),this.ctx.currentTime,1)}stopMusic(){this.songId=``,this.song=null}schedule(){if(!this.ctx||!this.song||this.musicVol<=0||this.ctx.state!==`running`){this.ctx&&(this.nextTime=Math.max(this.nextTime,this.ctx.currentTime+.05));return}let e=this.song,t=60/e.bpm/4;for(;this.nextTime<this.ctx.currentTime+.25;){let n=this.step%16,r=Math.floor(this.step/16)%e.prog.length,i=this.nextTime+(n%2==1?e.swing*t:0);this.musicStep(e,i,n,r,t),this.nextTime+=t,this.step++}}note(e,t,n=0){let r=e.scale.length,i=Math.floor(t/r),a=(t%r+r)%r;return e.root+e.scale[a]+12*(i+n)}musicStep(e,t,n,r,i){let a=this.musicBus,o=e.prog[r];if(n===0)for(let n of[0,2,4])this.tone(t,e.pad,Ag(this.note(e,o+n,1)),Ag(this.note(e,o+n,1)),i*16,.05,.4,a);e.bassPat[n]>=0&&this.tone(t,`triangle`,Ag(this.note(e,o,0)),Ag(this.note(e,o,0))*.98,i*1.8,.22,.005,a);let s=e.arp[n];if(s>=0&&(this.step>>6)%4!=3){let n=Ag(this.note(e,o+s,2));this.tone(t,e.lead,n,n,i*1.4,e.lead===`sawtooth`||e.lead===`square`?.035:.06,.004,a)}let c=e.drums+ +(this.intensity>.6);c>0&&((n%8==0||c>1&&n%8==6&&Math.random()<.5)&&this.tone(t,`sine`,120,40,.18,.4,.002,a),n%8==4&&this.noise(t,.12,.16,`bandpass`,1800,900,.8,a),c>1&&n%2==0&&this.noise(t,.04,.05,`highpass`,7e3,6e3,1,a),c>2&&n%2==1&&this.noise(t,.03,.035,`highpass`,8e3,7e3,1,a))}},Ng={slash:.06,hit:.03},Pg={slash:(e,t,n)=>e.noise(t,.12,.25*n,`bandpass`,3200,900,1.4),thrust:(e,t,n)=>e.noise(t,.16,.25*n,`bandpass`,1400,4e3,2),magic:(e,t,n)=>{e.tone(t,`triangle`,660,1320,.15,.12*n),e.tone(t+.03,`sine`,990,1980,.12,.08*n)},bow:(e,t,n)=>{e.tone(t,`triangle`,300,120,.1,.18*n),e.noise(t,.06,.1*n,`highpass`,2500,5e3)},jump:(e,t,n)=>{e.noise(t,.12,.12*n,`bandpass`,900,2600,1.2),e.tone(t,`sine`,260,420,.08,.08*n)},land:(e,t,n)=>{e.noise(t,.12,.22*n,`lowpass`,900,200,.8),e.tone(t,`sine`,120,60,.08,.16*n)},nightfall:(e,t,n)=>[392,311,262,196].forEach((r,i)=>e.tone(t+i*.18,`triangle`,r,r*.99,.6,.1*n)),dawn:(e,t,n)=>[392,494,587,784].forEach((r,i)=>e.tone(t+i*.12,`sine`,r,r*1.01,.5,.09*n)),hit:(e,t,n)=>e.noise(t,.04,.1*n,`bandpass`,1800,900,2),ui:(e,t,n)=>e.tone(t,`square`,880,880,.04,.05*n),uiBack:(e,t,n)=>e.tone(t,`square`,520,440,.06,.05*n),select:(e,t,n)=>{e.tone(t,`square`,660,660,.05,.05*n),e.tone(t+.05,`square`,990,990,.08,.05*n)},denied:(e,t,n)=>e.tone(t,`square`,160,140,.15,.08*n)},Fg=new Mg;function Ig(){return{main:null,off:null,head:null,hands:null,feet:null,body:null}}function Lg(e){let t=Array(48).fill(null);return e.slice(0,48).forEach((e,n)=>t[n]=e),{equip:Ig(),bag:t}}function Rg(e){return{...e,equip:{...e.equip},bag:[...e.bag],...e.amounts?{amounts:[...e.amounts]}:{},...e.wear?{wear:[...e.wear]}:{}}}function zg(e){return e.slot}function Bg(e){return!!Jd(e)?.twoHanded}function Vg(e,t=-1){for(let n=0;n<e.length;n++)if(n!==t&&e[n]===null)return n;return-1}function Hg(e,t){let n=e.bag[t],r=Jd(n);if(!n||!r)return{ok:!1,error:`Пустая ячейка`};if(r.block||r.tool){let n=Rg(e);return n.active=t,{ok:!0,gear:n}}let i=Rg(e),a=zg(r);i.bag[t]=null;let o=[],s=i.equip[a];s&&o.push(s),i.equip[a]=n,a===`main`&&r.twoHanded&&i.equip.off&&(o.push(i.equip.off),i.equip.off=null),a===`off`&&Bg(i.equip.main)&&(o.push(i.equip.main),i.equip.main=null);for(let e of o){let n=i.bag[t]===null?t:Vg(i.bag);if(n<0)return{ok:!1,error:`Нет места в инвентаре`};i.bag[n]=e}return{ok:!0,gear:i}}function Ug(e,t,n=-1){let r=e.equip[t];if(!r)return{ok:!1,error:`Слот пуст`};let i=Rg(e),a=n>=0&&n<i.bag.length&&i.bag[n]===null?n:Vg(i.bag);return a<0?{ok:!1,error:`Нет места в инвентаре`}:(i.bag[a]=r,i.equip[t]=null,{ok:!0,gear:i})}function Wg(e,t,n){let r=Jd(e.bag[t]);return r?zg(r)===n?Hg(e,t):{ok:!1,error:`Этот предмет сюда не надевается`}:{ok:!1,error:`Пустая ячейка`}}function Gg(e,t,n){let r=Rg(e);return[r.bag[t],r.bag[n]]=[r.bag[n],r.bag[t]],r.amounts&&([r.amounts[t],r.amounts[n]]=[r.amounts[n],r.amounts[t]]),r.wear&&([r.wear[t],r.wear[n]]=[r.wear[n],r.wear[t]]),r.active===t?r.active=n:r.active===n&&(r.active=t),r}function Kg(e,t){if(!e||typeof e!=`object`||!Array.isArray(e.bag)||!e.equip)return t;let n={equip:Ig(),bag:Array(48).fill(null)};n.amounts=Array.from({length:48},(t,n)=>Math.max(1,Math.min(64,Math.floor(Number(e.amounts?.[n])||1)))),n.wear=Array.from({length:48},(t,n)=>Math.max(0,Math.min(250,Math.floor(Number(e.wear?.[n])??250)||0))),e.wear||n.wear.fill(250),n.active=Number.isInteger(e.active)&&e.active>=0&&e.active<48?e.active:0;let r=[];e.bag.slice(0,48).forEach((e,t)=>{typeof e==`string`&&qd[e]&&(n.bag[t]=e)});for(let t of Ud){let i=e.equip[t];typeof i==`string`&&qd[i]&&(qd[i].slot===t?n.equip[t]=i:r.push(i))}Bg(n.equip.main)&&n.equip.off&&(r.push(n.equip.off),n.equip.off=null);for(let e of r){let t=Vg(n.bag);t>=0&&(n.bag[t]=e)}return n}var qg={kind:`sword1h`,dmgType:`phys`,shape:`melee`,damage:4,interval:.6,hitAt:.45,range:1.6};function Jg(e,t){let n=(_m[e]??_m.human).base,r=n.physDef,i=0,a=0,o=0,s=0;for(let e of Ud){let n=Jd(t.equip[e]);n&&(r+=n.stats.physDef??0,i+=n.stats.magicDmg??0,a+=n.stats.castSpeed??0,o+=n.stats.atkSpeed??0,s+=n.stats.moveSpeed??0)}let c=Jd(t.equip.main),l=c?.weapon??qg,u=l.dmgType===`magic`,d=u?l.damage*n.magicPower*(1+i):l.damage*n.physPower,f=l.interval/(1+(u?a:o));return{maxHp:n.maxHp,physDef:r,physReduce:r/(r+50),magicDmg:i,castSpeed:a,atkSpeed:o,moveBonus:s,moveSpeed:n.moveSpeed*(1+s),weapon:c?.weapon??null,weaponName:c?.name??`Без оружия`,hitDamage:d,interval:f,attacksPerSec:1/f,dps:d/f,range:l.range}}function Yg(e,t){let n=Date.now();return{id:n.toString(36)+Math.random().toString(36).slice(2,6),name:e.trim().slice(0,16)||`Герой`,race:_m[t]?.available?t:`human`,level:1,xp:0,gear:Lg(Yd),created:n,playTime:0,lastPlayed:n}}function Xg(e){if(!e||typeof e!=`object`||typeof e.race!=`string`||!_m[e.race]?.available)return null;let t=Yg(String(e.name??`Герой`),e.race),n=(e,t)=>Number.isFinite(Number(e))?Number(e):t;return{...t,id:typeof e.id==`string`&&e.id?e.id:t.id,level:Math.max(1,Math.floor(n(e.level,1))),xp:Math.max(0,n(e.xp,0)),gear:Kg(e.gear,t.gear),created:n(e.created,t.created),playTime:Math.max(0,n(e.playTime,0)),lastPlayed:n(e.lastPlayed,n(e.created,t.created)),...e.blockChanges===void 0?{}:{blockChanges:e.blockChanges},...Array.isArray(e.blockDrops)?{blockDrops:e.blockDrops}:{},buildingStarted:e.buildingStarted===!0,...e.position&&[e.position.x,e.position.y,e.position.z].every(Number.isFinite)?{position:{x:e.position.x,y:e.position.y,z:e.position.z}}:{}}}function Zg(){return{jump:[`Space`],attack:[`KeyR`],build:[`KeyF`],inventory:[`KeyI`,`Tab`],map:[`KeyM`],pause:[`Escape`,`KeyP`],zoomIn:[`Equal`,`NumpadAdd`],zoomOut:[`Minus`,`NumpadSubtract`]}}var Qg={low:{shadows:`off`,effects:`low`,particles:`low`,viewDistance:`near`,antiAliasing:`off`,textures:`low`,postProcessing:!1},medium:{shadows:`low`,effects:`medium`,particles:`medium`,viewDistance:`medium`,antiAliasing:`msaa`,textures:`medium`,postProcessing:!1},high:{shadows:`medium`,effects:`high`,particles:`high`,viewDistance:`far`,antiAliasing:`msaa`,textures:`high`,postProcessing:!0},ultra:{shadows:`high`,effects:`high`,particles:`high`,viewDistance:`max`,antiAliasing:`ssaa`,textures:`high`,postProcessing:!0}},$g=`cubeborn.save.v1`,e_=`cubeborn.save.backup.v7`,t_=`cubeborn.save.backup.v8`;function n_(){let e=(navigator.language||`ru`).toLowerCase().startsWith(`ru`)?`ru`:`en`;return{master:1,music:.6,sfx:.8,ui:.8,ambient:.7,displayMode:`windowed`,resolution:`native`,vsync:!0,fpsLimit:0,quality:`high`,...Qg.high,screenShake:1,damageNumbers:!0,showFps:!1,autoPause:!0,cameraZoom:1,uiScale:1,showHints:!0,swapMouse:!1,invertWheel:!1,lang:e,keybinds:Zg()}}function r_(){return{version:9,settings:n_(),chars:[],activeChar:null}}function i_(e){let t=r_();if(!e||typeof e!=`object`)return t;let n=typeof e.version==`number`?e.version:1,r={...e.settings||{}};if(n<2){let e=r.quality===`low`||r.quality===`medium`||r.quality===`high`?r.quality:`high`;Object.assign(r,{quality:e},Qg[e]),typeof r.screenShake==`boolean`&&(r.screenShake=+!!r.screenShake)}n<8&&delete r.keybinds;let i={...r.keybinds||{}},a=Zg();for(let e of Object.keys(a))Array.isArray(i[e])&&(a[e]=i[e].filter(e=>typeof e==`string`));a.inventory.length===2&&a.inventory[0]===`KeyI`&&a.inventory[1]===`KeyB`&&!Object.values(a).some(e=>e.includes(`Tab`))&&(a.inventory=[`KeyI`,`Tab`]);let o={...t.settings,...r,keybinds:a};!i.build&&a.attack.length===1&&a.attack[0]===`KeyF`&&(a.attack=[`KeyR`]);for(let e of Object.keys(o))e in t.settings||delete o[e];let s=n<8||!Array.isArray(e.chars)?[]:e.chars.map(Xg).filter(Boolean);return{version:9,settings:o,chars:s,activeChar:s.some(t=>t.id===e.activeChar)?e.activeChar:s[0]?.id??null,...e.clock&&typeof e.clock==`object`&&Number.isFinite(e.clock.minutes)?{clock:{minutes:(e.clock.minutes%1440+1440)%1440,days:Number.isFinite(e.clock.days)?Math.max(0,Math.floor(e.clock.days)):0}}:{}}}function a_(e){return!!e&&typeof e==`object`&&(typeof e.version!=`number`||e.version<9)}var o_=()=>localStorage;function s_(e=o_()){let t=null;try{if(t=e.getItem($g),!t)return r_();let n=JSON.parse(t),r=n?.version===8?t_:e_;a_(n)&&e.getItem(r)===null&&e.setItem(r,t);let i=i_(n);return a_(n)&&e.setItem($g,JSON.stringify(i)),i}catch{try{t&&e.setItem($g+`.unreadable`,t)}catch{}return r_()}}function c_(e,t=o_()){try{return t.setItem($g,JSON.stringify(e)),!0}catch{return!1}}var l_=class{constructor(){m(this,`data`,void 0),m(this,`saveTimer`,0),m(this,`committedSettings`,null),this.data=s_()}save(){return c_(this.committedSettings?{...this.data,settings:this.committedSettings}:this.data)}saveSoon(){clearTimeout(this.saveTimer),this.saveTimer=window.setTimeout(()=>this.save(),300)}get char(){let e=this.data;return e.chars.find(t=>t.id===e.activeChar)??null}get chars(){return[...this.data.chars].sort((e,t)=>t.lastPlayed-e.lastPlayed)}selectChar(e){this.data.chars.some(t=>t.id===e)&&(this.data.activeChar=e,this.save())}createChar(e,t){let n=this.data;if(n.chars.length>=12)return null;let r=Yg(e,t);for(;n.chars.some(e=>e.id===r.id);)r.id+=`x`;return n.chars.push(r),n.activeChar=r.id,this.save(),r}deleteChar(e){let t=this.data;t.chars=t.chars.filter(t=>t.id!==e),t.activeChar===e&&(t.activeChar=t.chars[0]?.id??null),this.save()}};function Q(e,t,...n){let[r,...i]=e.split(`.`),a=document.createElement(r||`div`);if(i.length&&(a.className=i.join(` `)),t&&typeof t==`object`&&!(t instanceof Node)&&!Array.isArray(t))for(let e in t){let n=t[e];n!=null&&n!==!1&&(e===`class`?a.className+=(a.className?` `:``)+n:e===`style`?a.setAttribute(`style`,String(n)):e.startsWith(`on`)&&typeof n==`function`?a.addEventListener(e.slice(2),n):e===`html`?a.innerHTML=String(n):a.setAttribute(e,n===!0?``:String(n)))}else t!==void 0&&n.unshift(t);return u_(a,n),a}function u_(e,t){if(t!=null&&t!==!1){if(Array.isArray(t))for(let n of t)u_(e,n);else e.appendChild(typeof t==`string`||typeof t==`number`?document.createTextNode(String(t)):t)}}function d_(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var f_={ru:{game_subtitle:`Воксельная RPG`,tap_to_start:`Нажмите любую клавишу или кликните`,splash_note:`Оригинальная игра. Звук и музыка синтезируются в реальном времени.`,menu_settings:`Настройки`,dn_dusk:`Закат: скоро стемнеет`,dn_night:`Наступила ночь`,dn_dawn:`Рассвет`},en:{game_subtitle:`A voxel RPG`,tap_to_start:`Press any key or click`,splash_note:`An original game. Sound and music are synthesised in real time.`,menu_settings:`Settings`,dn_dusk:`Dusk: darkness is coming`,dn_night:`Night has fallen`,dn_dawn:`Dawn`}},p_=`ru`;function m_(e){p_=f_[e]?e:`ru`,typeof document<`u`&&(document.documentElement.lang=p_)}function h_(){return p_}var g_=[{id:`ru`,name:`Русский`},{id:`en`,name:`English`}];function __(e,t){let n=f_[p_][e]??f_.en[e]??e;if(t)for(let e in t)n=n.split(`{${e}}`).join(String(t[e]));return n}function v_(e){return e?e[p_]??e.en:``}function y_(e){let t=Jd(e);if(!t)return null;let n=t.weapon?.kind;if(n===`sword1h`)return zf;if(n===`sword2h`)return Bf;if(n===`spear`)return Vf;if(n===`staff1h`)return Hf;if(n===`staff2h`)return Uf;if(n===`bow`)return Kf;if(n===`crossbow`)return Jf;if(t.slot===`off`){let e=[];for(let t=0;t<16;t++)for(let n=0;n<16;n++){let r=n-3,i=t-2;e.push(r>=0&&r<10&&i>=0&&i<12?Xf(r,i,10,12):``)}return{n:16,px:e}}return t.armorSet&&t.slot!==`main`?Qf(t.slot,t.armorSet):null}var b_=new Map;function x_(e,t=3,n=40){let r=e+`:`+t,i=b_.get(r);if(!i){let n=Jd(e);if(n?.block||n?.tool){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`);if(t.imageSmoothingEnabled=!1,n.block){let e=Ku([n.block],{[n.block]:nf.palette.tiles[n.block]??[10123604]},nf.palette.blocks??{});t.drawImage(e.image,0,0,16,16,3,3,26,26),e.dispose()}else t.fillStyle=`#987345`,t.fillRect(14,9,4,21),t.fillStyle=`#b8c9cb`,n.tool?.kind===`pickaxe`?(t.fillRect(4,5,25,5),t.fillRect(25,9,4,5)):n.tool?.kind===`axe`?t.fillRect(16,3,13,14):n.tool?.kind===`shovel`?t.fillRect(10,2,12,13):t.fillRect(14,4,15,6);i=e.toDataURL()}else{let n=y_(e);i=n?$f(n,t).toDataURL():``}b_.set(r,i)}let a=document.createElement(`img`);return a.className=`item-icon`,a.src=i,a.alt=Jd(e)?.name??``,a.draggable=!1,a.style.width=a.style.height=n+`px`,a}function S_(e){return e>400?1:4}function C_(e,t){return/path|trail|road|cobble/.test(e)?11044698:/water_sea/.test(e)?2909866:/water_swamp/.test(e)?5925436:/water/.test(e)?4163276:t.palette.tiles[e]?.[0]??6989890}var w_=new WeakMap;function T_(e,t,n){let r=w_.get(e);if(r)return r;let i=e.size,a=S_(i),o=i*a,s=document.createElement(`canvas`);s.width=s.height=o;let c=s.getContext(`2d`),l=c.createImageData(o,o),u=l.data,d=e.tileNames.map(e=>C_(e,t)),f=(t,n)=>e.centerY(Math.max(0,Math.min(i-1,n))*i+Math.max(0,Math.min(i-1,t))),p=(e,t,n,r)=>{let i=(t*o+e)*4;u[i]=Math.min(255,(n>>16&255)*r),u[i+1]=Math.min(255,(n>>8&255)*r),u[i+2]=Math.min(255,(n&255)*r),u[i+3]=255};for(let t=0;t<i;t++)for(let n=0;n<i;n++){let r=t*i+n,o=e.cell[r],s,c;if(o===J.wall)s=7237752,c=.9+Y(n,t,3)*.12;else{if(s=d[e.tile[r]]??6989890,Eu(o))c=.95+Y(n,t,4)*.04;else{let e=f(n,t),r=f(n-1,t-1)-e;c=.9+Y(n,t,5)*.05+Math.max(-.35,Math.min(.2,-r*.12))+Math.min(e,90)*(i>400?.002:.04),e-f(n+1,t)>=.99||e-f(n,t+1)>=.99?c*=.72:i<=400&&(e-f(n+1,t)>=.49||e-f(n,t+1)>=.49)&&(c*=.86)}o===J.solid&&(s=3037732,c=1)}for(let e=0;e<a;e++)for(let r=0;r<a;r++)p(n*a+r,t*a+e,s,c)}if(n)for(let e=0;e<n.count;e++){let t=Math.floor(n.x[e]),r=Math.floor(n.z[e]),o=n.kind[e]===4;for(let[s,c]of[[0,0],[1,0],[0,1],[-1,0],[0,-1]]){let l=t+s,u=r+c;l<0||u<0||l>=i||u>=i||p(l*a,u*a,o?7233618:n.kind[e]===1||n.kind[e]===7?2377770:3107366,s||c?.95:.75)}}if(c.putImageData(l,0,0),t.generator===`meadow`)for(let t of sd(e)){let e=Math.max(1.5,t.s*a*.42),n=Math.round(t.x*a),r=Math.round(t.z*a);c.fillStyle=`rgba(16,40,12,0.55)`,c.fillRect(n-e+1,r-e+1,e*2,e*2),c.fillStyle=t.sprite===Z.shrub?`#3f6e2a`:`#356a26`,c.fillRect(n-e,r-e,e*2,e*2),t.sprite===Z.berryBush&&(c.fillStyle=`#d8303a`,c.fillRect(n,r-1,1,1))}return w_.set(e,s),s}function E_(e,t,n,r,i){e.save(),e.translate(t,n),e.rotate(r),e.beginPath(),e.moveTo(0,-i),e.lineTo(i*.72,i*.75),e.lineTo(0,i*.35),e.lineTo(-i*.72,i*.75),e.closePath(),e.fillStyle=`#ffffff`,e.strokeStyle=`#141018`,e.lineWidth=Math.max(1.5,i*.28),e.lineJoin=`miter`,e.stroke(),e.fill(),e.fillStyle=`#ffd040`,e.beginPath(),e.moveTo(0,-i*.55),e.lineTo(i*.32,i*.3),e.lineTo(0,i*.1),e.lineTo(-i*.32,i*.3),e.closePath(),e.fill(),e.restore()}function D_(e){let t=Math.cos(e),n=Math.sin(e);return(e,r)=>[t*e-n*r,n*e+t*r]}function O_(e,t,n,r,i=!1){let a=[];for(let o of t.dummies){let[s,c]=n(o.x,o.z),l=t.target===o;if(e.fillStyle=`#141018`,e.fillRect(s-r-1,c-r-1,r*2+2,r*2+2),e.fillStyle=l?`#ffd040`:`#e0503a`,e.fillRect(s-r,c-r,r*2,r*2),l&&(e.strokeStyle=t.autoAttack?`#ff5040`:`#ffd040`,e.lineWidth=2,e.strokeRect(s-r-4,c-r-4,r*2+8,r*2+8)),i){let t=Math.round(r*2.6);e.font=`600 ${t}px "Russo One", sans-serif`,e.textAlign=`center`;let n=e.measureText(o.name).width,i=e=>a.some(([r,i,a,o])=>Math.abs(r-s)<(a+n)/2&&Math.abs(i-e)<(o+t)/2),u=c-r-5-t/2;i(u)&&(u=c+r+5+t/2),a.push([s,u,n,t]),e.textBaseline=`middle`,e.lineWidth=3,e.strokeStyle=`rgba(0,0,0,0.85)`,e.strokeText(o.name,s,u),e.fillStyle=l?`#ffd040`:`#ffffff`,e.fillText(o.name,s,u)}}}var k_=22,A_=[[`С`,0,-1],[`В`,1,0],[`Ю`,0,1],[`З`,-1,0]],j_=class{constructor(e=156){m(this,`size`,void 0),m(this,`root`,void 0),m(this,`canvas`,void 0),m(this,`g`,void 0),m(this,`img`,null),m(this,`imgFor`,null),m(this,`px`,0),m(this,`yaw`,Math.PI/4),this.size=e,this.canvas=Q(`canvas.mm-canvas`),this.g=this.canvas.getContext(`2d`),this.root=Q(`div.rh-minimap`,{title:`Миникарта (M — карта мира)`},this.canvas)}fit(){let e=Math.min(2,window.devicePixelRatio||1),t=Math.round(this.size*e);t!==this.px&&(this.px=t,this.canvas.width=this.canvas.height=t,this.canvas.style.width=this.canvas.style.height=`${this.size}px`)}draw(e){this.fit(),this.imgFor!==e.terrain&&(this.img=T_(e.terrain,e.map,e.trees),this.imgFor=e.terrain);let t=this.g,n=this.px,r=n/2,i=n*.075,a=r-i,o=a/k_,s=e.player,c=e.terrain;t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,n,n),t.save(),t.beginPath(),t.arc(r,r,a,0,Math.PI*2),t.clip(),t.fillStyle=`#4a4c52`,t.fillRect(0,0,n,n),t.translate(r,r),t.rotate(this.yaw),t.scale(o,o),t.translate(-s.x,-s.z),t.imageSmoothingEnabled=!1,this.img&&t.drawImage(this.img,c.ox,c.oz,c.size,c.size),t.setTransform(1,0,0,1,0,0);let l=D_(this.yaw);O_(t,e,(e,t)=>{let[n,i]=l(e-s.x,t-s.z);return[r+n*o,r+i*o]},Math.max(2.5,n*.022));let[u,d]=l(s.fx,s.fz);E_(t,r,r,Math.atan2(u,-d),n*.06);let f=t.createRadialGradient(r,r,a*.7,r,r,a);f.addColorStop(0,`rgba(0,0,0,0)`),f.addColorStop(1,`rgba(0,0,0,0.35)`),t.fillStyle=f,t.fillRect(0,0,n,n),t.restore(),t.lineWidth=i,t.strokeStyle=`rgba(26, 22, 30, 0.9)`,t.beginPath(),t.arc(r,r,r-i/2,0,Math.PI*2),t.stroke(),t.lineWidth=Math.max(1,n*.012),t.strokeStyle=`rgba(255,255,255,0.18)`,t.beginPath(),t.arc(r,r,r-t.lineWidth/2,Math.PI*.75,Math.PI*1.75),t.stroke(),t.strokeStyle=`#0c0a10`,t.beginPath(),t.arc(r,r,a,0,Math.PI*2),t.stroke();for(let e=0;e<8;e++){let[n,a]=l(Math.sin(e*Math.PI/4),-Math.cos(e*Math.PI/4)),o=r-i*.5;t.strokeStyle=e%2?`rgba(255,255,255,0.35)`:`rgba(255,255,255,0)`,t.beginPath(),t.moveTo(r+n*(o-i*.18),r+a*(o-i*.18)),t.lineTo(r+n*(o+i*.18),r+a*(o+i*.18)),t.stroke()}t.font=`${Math.round(i*.95)}px "Russo One", sans-serif`,t.textAlign=`center`,t.textBaseline=`middle`;for(let[e,n,a]of A_){let[o,s]=l(n,a),c=r+o*(r-i/2),u=r+s*(r-i/2)+i*.05;t.fillStyle=e===`С`?`#ff5a4a`:`#f4efe2`,t.lineWidth=Math.max(2,i*.22),t.strokeStyle=`#0c0a10`,t.strokeText(e,c,u),t.fillText(e,c,u)}}},M_=class{constructor(e){m(this,`root`,void 0),m(this,`clockBox`,void 0),m(this,`clockTime`,Q(`div.ck-time`)),m(this,`clockName`,Q(`div.ck-name`)),m(this,`banner`,void 0),m(this,`bannerSub`,void 0),m(this,`bannerBox`,void 0),m(this,`fps`,void 0),m(this,`hint`,void 0),m(this,`heroName`,Q(`b`)),m(this,`heroSub`,Q(`span`)),m(this,`heroHp`,Q(`i`)),m(this,`heroHpText`,Q(`em`)),m(this,`target`,void 0),m(this,`tName`,Q(`b`)),m(this,`tTotal`,Q(`span`)),m(this,`tDps`,Q(`span`)),m(this,`tHits`,Q(`span`)),m(this,`weaponIcon`,Q(`div.rh-wicon`)),m(this,`weaponName`,Q(`b`)),m(this,`weaponInfo`,Q(`span`)),m(this,`cd`,Q(`i`)),m(this,`minimap`,new j_),m(this,`skillSlots`,[]),m(this,`last`,{}),m(this,`bannerT`,0),m(this,`fpsAcc`,0),m(this,`fpsN`,0),m(this,`opts`,{fps:!1}),m(this,`onInventory`,null),m(this,`onClearTarget`,null),this.clockBox=Q(`div.clock`,Q(`div.ck-icon`,F_()),Q(`div.ck-text`,this.clockTime,this.clockName)),this.banner=Q(`div.banner-main`),this.bannerSub=Q(`div.banner-sub`),this.bannerBox=Q(`div.banner`,this.banner,this.bannerSub),this.fps=Q(`div.fps.hidden`),this.hint=Q(`div.rh-hint.hidden`),this.target=Q(`div.rh-target.hidden`,Q(`div.rh-tname`,this.tName,Q(`button.rh-tx`,{title:`Снять цель`,onclick:()=>this.onClearTarget?.()},`×`)),Q(`div.rh-tbar`,Q(`i`)),Q(`div.rh-tstats`,this.tTotal,this.tDps,this.tHits),Q(`small`,`Манекен не атакует и не погибает`));let t=Q(`button.rh-inv`,{title:`Инвентарь и снаряжение (Tab / I)`,onclick:()=>this.onInventory?.()},Q(`i.rh-bag`),Q(`span`,`Инвентарь`),Q(`kbd`,`Tab / I`));for(let e=0;e<6;e++)this.skillSlots.push(Q(`div.rh-skill.empty`,{title:`Пустая ячейка навыка`},Q(`kbd`,String(e+1))));this.root=Q(`div.hud.rpg-hud`,Q(`div.rh-tl`,Q(`div.rh-hero`,Q(`div.rh-hero-txt`,this.heroName,this.heroSub),Q(`div.rh-hp`,this.heroHp,this.heroHpText)),this.fps),Q(`div.rh-top`,this.target),Q(`div.rh-tr`,this.minimap.root,this.clockBox),this.bannerBox,this.hint,Q(`div.rh-bottom`,Q(`div.rh-skills`,this.skillSlots),Q(`div.rh-bottom-row`,Q(`div.rh-weapon`,this.weaponIcon,Q(`div.rh-wtxt`,this.weaponName,this.weaponInfo),Q(`div.rh-cd`,this.cd)),t))),e.appendChild(this.root)}reset(){this.last={},this.bannerBox.classList.remove(`show`)}setOptions(e){this.opts=e,this.fps.classList.toggle(`hidden`,!e.fps)}set(e,t,n){this.last[e]!==t&&(this.last[e]=t,n())}showBanner(e,t=`#ffd23d`,n=2.6,r=``){this.banner.textContent=e,this.banner.style.color=t,this.bannerSub.textContent=r,this.bannerBox.classList.remove(`show`),this.bannerBox.offsetWidth,this.bannerBox.classList.add(`show`),this.bannerT=n}showHint(e){this.hint.classList.toggle(`hidden`,!e),e&&(d_(this.hint),this.hint.append(Q(`div`,Q(`kbd`,`ЛКМ`),` по земле — идти, `,Q(`kbd`,`Пробел`),` — прыжок (ещё раз в воздухе — двойной)`),Q(`div`,Q(`kbd`,`ЛКМ`),` по манекену — выбрать цель, ещё раз по цели — автоатака, `,Q(`kbd`,`R`),` — атака; F — строительство`),Q(`div`,`Зажать `,Q(`kbd`,`ПКМ`),` и вести мышь — повернуть и наклонить камеру`),Q(`div`,Q(`kbd`,`Tab`),` / `,Q(`kbd`,`I`),` — инвентарь, `,Q(`kbd`,`M`),` — карта мира, `,Q(`kbd`,`Esc`),` — пауза`)))}update(e,t,n,r){let i=e.stats;this.set(`hn`,n,()=>this.heroName.textContent=n);let a=`${_m[e.raceId]?.name??``} · Уровень ${r}`;this.set(`hs`,a,()=>this.heroSub.textContent=a),this.set(`hp`,i.maxHp,()=>{this.heroHp.style.width=`100%`,this.heroHpText.textContent=`${i.maxHp} / ${i.maxHp}`});let o=e.target;if(this.set(`tg`,o?o.id:``,()=>{this.target.classList.toggle(`hidden`,!o),o&&(this.tName.textContent=o.name)}),o){let t=`Всего: ${o.total}`,n=`DPS: ${Math.round(o.dps(e.time))}`,r=`Ударов: ${o.hits}`;this.set(`tt`,t,()=>this.tTotal.textContent=t),this.set(`td`,n,()=>this.tDps.textContent=n),this.set(`th`,r,()=>this.tHits.textContent=r)}let s=e.gear.equip.main;this.set(`wp`,`${s}|${i.hitDamage}|${i.interval}`,()=>{d_(this.weaponIcon);let e=Jd(s);e&&this.weaponIcon.append(x_(e.id,2)),this.weaponName.textContent=e?.name??`Без оружия`;let t=i.weapon?.dmgType===`magic`?`маг.`:`физ.`;this.weaponInfo.textContent=`${Math.round(i.hitDamage)} ${t} урона · раз в ${i.interval.toFixed(2)} с · дальность ${i.range}`});let c=e.player,l=i.interval>0?Math.max(0,Math.min(1,c.cooldown/i.interval)):0;this.cd.style.width=`${Math.round((1-l)*100)}%`,this.minimap.draw(e);let u=e.dayNight,d=u.clock.hhmm;this.set(`ckT`,d,()=>this.clockTime.textContent=d),this.set(`ckP`,u.period,()=>{this.clockName.textContent={day:`День`,dusk:`Закат`,night:`Ночь`,dawn:`Рассвет`}[u.period]??``,this.clockBox.dataset.period=u.period}),this.bannerT>0&&(this.bannerT-=t,this.bannerT<=0&&this.bannerBox.classList.remove(`show`)),this.fpsAcc+=t,this.fpsN++,this.fpsAcc>.5&&(this.opts.fps&&(this.fps.textContent=`FPS: ${Math.round(this.fpsN/this.fpsAcc)}`),this.fpsAcc=0,this.fpsN=0)}setVisible(e){this.root.classList.toggle(`hidden`,!e)}},N_=`http://www.w3.org/2000/svg`;function P_(e){let t=document.createElement(`div`);return t.innerHTML=e,t.firstElementChild}function F_(){let e=``;for(let t=0;t<8;t++){let n=t/8*Math.PI*2,r=Math.cos(n),i=Math.sin(n);e+=`<line x1="${(16+r*10.5).toFixed(2)}" y1="${(16+i*10.5).toFixed(2)}" x2="${(16+r*14.5).toFixed(2)}" y2="${(16+i*14.5).toFixed(2)}"/>`}return P_(`<svg xmlns="${N_}" viewBox="0 0 32 32" class="ck-svg"><defs><radialGradient id="ckSun" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#fff6b0"/><stop offset="0.55" stop-color="#ffc83a"/><stop offset="1" stop-color="#f08a10"/></radialGradient></defs><g class="ck-sun"><g class="ck-rays" stroke-width="2.6" stroke-linecap="round">${e}</g><circle cx="16" cy="16" r="7.6" fill="url(#ckSun)" stroke="#a85a08" stroke-width="1"/></g><g class="ck-moon"><path d="M20.5 5.5a11 11 0 1 0 6 18.6A9 9 0 0 1 20.5 5.5z" fill="#e6ecff" stroke="#7a88b8" stroke-width="1"/><circle cx="12" cy="17" r="1.6" fill="#c0c8e8"/><circle cx="16" cy="23" r="1.1" fill="#c0c8e8"/></g></svg>`)}var I_=(e,t)=>e.bag[t]?e.amounts?.[t]??1:0;function L_(e,t,n){let r=Jd(t)?.block?64:1;e.amounts??(e.amounts=e.bag.map(e=>+!!e)),e.wear??(e.wear=e.bag.map(()=>250));for(let i=0;i<e.bag.length&&n>0;i++)if(e.bag[i]===t&&I_(e,i)<r){let t=Math.min(n,r-I_(e,i));e.amounts[i]+=t,n-=t}for(let i=0;i<e.bag.length&&n>0;i++)if(!e.bag[i]){let a=Math.min(n,r);e.bag[i]=t,e.amounts[i]=a,e.wear[i]=Jd(t)?.tool?.durability??0,n-=a}return n}function R_(e,t){return e.bag[t]?(e.amounts??(e.amounts=e.bag.map(e=>+!!e)),--e.amounts[t]<=0&&(e.bag[t]=null,e.amounts[t]=0),!0):!1}var z_=class{constructor(e){m(this,`w`,void 0),m(this,`enabled`,!1),m(this,`hit`,null),m(this,`progress`,0),m(this,`swinging`,!1),m(this,`placePulse`,0),m(this,`revision`,0),m(this,`drops`,[]),m(this,`mining`,new vg),m(this,`message`,`F — добыча и строительство`),this.w=e}get active(){return this.w.gear.active??0}get selected(){return Jd(this.w.gear.bag[this.active])}toggle(e=!this.enabled){this.enabled=e,this.cancel(),this.w.player.path=[],this.w.player.cancelAttack(),this.w.autoAttack=!1,this.w.ctl.clickMove=null,this.w.ctl.attackHeld=!1,this.message=e?`ЛКМ удерживать — добыть · ПКМ — поставить · F / Esc — выйти`:`F — добыча и строительство`}cancel(){this.mining.cancel(),this.progress=0,this.swinging=!1,this.hit=null}select(e){this.w.gear.active=e,this.cancel(),this.revision++}cycle(e){let t=this.w.gear.bag.map((e,t)=>Jd(e)?.block||Jd(e)?.tool?t:-1).filter(e=>e>=0);if(t.length){let n=t.indexOf(this.active);this.select(t[(n+e+t.length)%t.length])}}reachable(e){let t=this.w.player;return Math.hypot(e.x+.5-t.x,e.y+.5-(t.y+1),e.z+.5-t.z)<=5}protected(e){return this.w.dummies.some(t=>Math.hypot(e.x+.5-t.x,e.z+.5-t.z)<1)}placement(){let e=this.hit;return e?{x:e.pos.x+e.normal.x,y:e.pos.y+e.normal.y,z:e.pos.z+e.normal.z}:null}canPlace(e){let t=this.w.player,n=this.w.blocks;return!!this.selected?.block&&this.reachable(e)&&n.inBounds(e)&&n.get(e)===null&&!this.protected(e)&&!(e.x<t.x+t.radius&&e.x+1>t.x-t.radius&&e.z<t.z+t.radius&&e.z+1>t.z-t.radius&&e.y<t.y+1.8&&e.y+1>t.y+.02)}input(e,t,n,r){this.hit=e&&this.reachable(e.pos)?e:null;let i=this.w.player,a=this.hit;if(!this.enabled||!a){this.mining.cancel(),this.progress=0,this.swinging=!1;return}if(n){let e=this.placement(),t=this.selected?.block;e&&t&&this.canPlace(e)&&this.w.blocks.place(e,t)?(R_(this.w.gear,this.active),this.placePulse=.25,this.revision++,this.w.fx.sound(`hit`,.3)):this.message=`Нельзя поставить: место занято, слишком далеко или внутри персонажа`}if(!t){this.mining.cancel(),this.progress=0,this.swinging=!1;return}if(this.protected(a.pos)||a.pos.y===0){this.message=`Этот блок защищён`,this.mining.cancel();return}let o=a.pos.x+.5-i.x,s=a.pos.z+.5-i.z,c=Math.hypot(o,s)||1;i.fx=o/c,i.fz=s/c;let l=this.selected?.tool,u=l?{...l,durability:this.w.gear.wear?.[this.active]??l.durability}:null,d=this.mining.advance(this.w.blocks,a.pos,u,r);if(this.progress=d.progress,this.swinging=!0,this.message=(Vd.get(this.w.blocks.get(a.pos)??``)?.name??`Блок`)+` · `+Math.round(this.progress*100)+`%`,d.broken){if(d.drop&&this.drops.push({id:`block:`+d.drop,x:a.pos.x+.5,y:a.pos.y+.5,z:a.pos.z+.5,vy:2,age:0,count:1}),u&&u.durability>0){var f;(f=this.w.gear).wear??(f.wear=this.w.gear.bag.map(()=>250)),--this.w.gear.wear[this.active]<=0&&R_(this.w.gear,this.active)}this.w.fx.sound(`hit`,.5),this.revision++,this.progress=0}}update(e){this.placePulse=Math.max(0,this.placePulse-e);for(let t=this.drops.length-1;t>=0;t--){let n=this.drops[t];n.age+=e,n.vy-=12*e;let r=n.y;n.y+=n.vy*e;let i=this.w.blocks.support(n.x,n.z,r+.2)??0;n.y<i+.15&&(n.y=i+.15,n.vy=0);let a=this.w.player;if(n.age>.6&&Math.hypot(n.x-a.x,n.z-a.z,n.y-(a.y+.6))<1.7){let e=L_(this.w.gear,n.id,n.count);e!==n.count&&(n.count=e,this.revision++,this.w.fx.sound(`select`,.3)),e||this.drops.splice(t,1)}}}loadDrops(e){if(Array.isArray(e))for(let t of e)t&&Jd(t.id)?.block&&[t.x,t.y,t.z,t.vy,t.age,t.count].every(Number.isFinite)&&t.count>0&&t.count<=64&&t.x>=0&&t.z>=0&&t.x<this.w.terrain.size&&t.z<this.w.terrain.size&&this.drops.push({...t,count:Math.floor(t.count)})}},B_=e=>`${e>0?`+`:``}${Math.round(e*100)}%`;function V_(e){let t=[],n=e.weapon;if(n){let r=Ef(n.kind);r&&t.push(`Атака: ${r.attackLabel}`),t.push(`${n.dmgType===`magic`?`Магический`:`Физический`} урон: ${n.damage}`),t.push(`Скорость: удар раз в ${n.interval.toFixed(2)} с (${(1/n.interval).toFixed(2)}/с)`),t.push(`Урон в секунду: ${(n.damage/n.interval).toFixed(1)}`),t.push(n.shape===`projectile`?`Дальность выстрела: ${n.range}`:`Досягаемость: ${n.range}`),n.shape===`sweep`&&t.push(`Бьёт все цели в полосе шириной ${(n.halfWidth??.9)*2}`),t.push(e.twoHanded?`Двуручное — занимает обе руки`:`Одноручное — можно взять щит`)}let r=e.stats;return r.physDef&&t.push(`Физическая защита: +${r.physDef}`),r.magicDmg&&t.push(`Магический урон: ${B_(r.magicDmg)}`),r.castSpeed&&t.push(`Скорость заклинаний: ${B_(r.castSpeed)}`),r.atkSpeed&&t.push(`Скорость физических атак: ${B_(r.atkSpeed)}`),r.moveSpeed&&t.push(`Скорость передвижения: ${B_(r.moveSpeed)}`),t}var H_=class{constructor(e){m(this,`root`,void 0),m(this,`slots`,Q(`div.inv-slots`)),m(this,`bag`,Q(`div.inv-bag`)),m(this,`stats`,Q(`div.inv-stats`)),m(this,`msg`,Q(`div.inv-msg`)),m(this,`tip`,Q(`div.inv-tip.hidden`)),m(this,`gear`,null),m(this,`race`,`human`),m(this,`name`,``),m(this,`onChange`,null),m(this,`onSfx`,null),m(this,`onClose`,null),this.root=Q(`div.inv.hidden`,Q(`div.inv-win`,Q(`div.inv-head`,Q(`h2`,`Инвентарь и снаряжение`),Q(`button.inv-x`,{title:`Закрыть (Tab / I / Esc)`,onclick:()=>this.onClose?.()},`×`)),Q(`div.inv-body`,Q(`div.inv-col`,Q(`h3`,`Снаряжение`),this.slots),Q(`div.inv-col`,Q(`h3`,`Сумка`),this.bag,Q(`p.inv-help`,`Щелчок — надеть / снять. Можно перетаскивать предметы между сумкой и слотами.`),this.msg),Q(`div.inv-col`,Q(`h3`,`Характеристики`),this.stats))),this.tip),e.appendChild(this.root)}get isOpen(){return!this.root.classList.contains(`hidden`)}open(e,t,n){this.gear=e,this.race=t,this.name=n,this.msg.textContent=``,this.root.classList.remove(`hidden`),this.render()}close(){this.root.classList.add(`hidden`),this.tip.classList.add(`hidden`)}apply(e){e.ok?(this.gear=e.gear,this.msg.textContent=``,this.onSfx?.(`select`),this.onChange?.(e.gear),this.render()):(this.msg.textContent=e.error,this.onSfx?.(`denied`))}showTip(e,t){d_(this.tip),this.tip.append(Q(`b`,e.name),Q(`div.inv-tip-type`,e.armorClass?`${e.type} · ${e.armorClass} броня`:e.type),...V_(e).map(e=>Q(`div`,e)),Q(`p`,e.desc)),this.tip.classList.remove(`hidden`);let n=t.getBoundingClientRect(),r=this.root.getBoundingClientRect();this.tip.style.left=`${Math.round(n.right-r.left+8)}px`,this.tip.style.top=`${Math.round(n.top-r.top)}px`}cell(e,t,n,r,i){let a=Jd(e),o=Q(`div.inv-cell`+t+(a?`.full`:``),{...r,title:``},a?x_(a.id,3,40):Q(`span.inv-ph`,n));return o.addEventListener(`click`,i),a&&(o.draggable=!0,o.addEventListener(`dragstart`,e=>{e.dataTransfer?.setData(`text/plain`,JSON.stringify(r)),this.tip.classList.add(`hidden`)}),o.addEventListener(`mouseenter`,()=>this.showTip(a,o)),o.addEventListener(`mouseleave`,()=>this.tip.classList.add(`hidden`))),o.addEventListener(`dragover`,e=>e.preventDefault()),o.addEventListener(`drop`,e=>{e.preventDefault();let t=e.dataTransfer?.getData(`text/plain`);t&&this.drop(JSON.parse(t),r)}),o}drop(e,t){let n=this.gear;e[`data-bag`]!==void 0&&t[`data-slot`]!==void 0?this.apply(Wg(n,+e[`data-bag`],t[`data-slot`])):e[`data-bag`]!==void 0&&t[`data-bag`]!==void 0?this.apply({ok:!0,gear:Gg(n,+e[`data-bag`],+t[`data-bag`])}):e[`data-slot`]!==void 0&&t[`data-bag`]!==void 0&&this.apply(Ug(n,e[`data-slot`],+t[`data-bag`]))}render(){let e=this.gear;if(e){d_(this.slots);for(let t of Ud){let n=e.equip[t],r=t===`off`&&!!Jd(e.equip.main)?.twoHanded,i=this.cell(n,`.slot`+(r?`.blocked`:``),r?`2H`:``,{"data-slot":t},()=>{n&&this.apply(Ug(e,t))});this.slots.append(Q(`div.inv-slot`,Q(`label`,Wd[t]),i,Q(`span.inv-slot-name`,n?Jd(n).name:r?`Занята двуручным оружием`:`Пусто`)))}d_(this.bag),e.bag.forEach((t,n)=>{let r=this.cell(t,n===e.active?`.build-selected`:``,``,{"data-bag":String(n)},()=>{t&&this.apply(Hg(e,n))}),i=Jd(t);(i?.block||i?.tool)&&r.append(Q(`b.block-amount`,i.tool?`${e.wear?.[n]??250}`:String(I_(e,n)))),this.bag.append(r)}),this.renderStats()}}renderStats(){let e=Jg(this.race,this.gear),t=(e,t)=>Q(`div.inv-stat`,Q(`span`,e),Q(`b`,t));d_(this.stats),this.stats.append(Q(`div.inv-who`,Q(`b`,this.name),Q(`span`,`${_m[this.race]?.name??``} · Уровень 1`)),t(`Здоровье`,String(e.maxHp)),t(`Физическая защита`,`${e.physDef} (−${Math.round(e.physReduce*100)}% урона)`),t(`Оружие`,e.weaponName),t(`Урон за удар`,`${e.hitDamage.toFixed(1)} ${e.weapon?.dmgType===`magic`?`маг.`:`физ.`}`),t(`Атак в секунду`,e.attacksPerSec.toFixed(2)),t(`Урон в секунду`,e.dps.toFixed(1)),t(`Дальность`,String(e.range)),t(`Магический урон`,B_(e.magicDmg)),t(`Скорость заклинаний`,B_(e.castSpeed)),t(`Скорость атаки`,B_(e.atkSpeed)),t(`Скорость передвижения`,`${e.moveSpeed.toFixed(2)} бл/с (${B_(e.moveBonus)})`))}},U_=class{constructor(e){m(this,`root`,void 0),m(this,`canvas`,void 0),m(this,`g`,void 0),m(this,`title`,Q(`h2`)),m(this,`coords`,Q(`span.wm-coords`)),m(this,`extra`,Q(`span.wm-extra`)),m(this,`img`,null),m(this,`imgFor`,null),m(this,`px`,0),m(this,`yaw`,Math.PI/4),m(this,`onClose`,null),this.canvas=Q(`canvas.wm-canvas`),this.g=this.canvas.getContext(`2d`);let t=(e,t)=>Q(`span.wm-key`,Q(`i.`+e),t);this.root=Q(`div.wmap.hidden`,{onclick:e=>e.target===this.root&&this.onClose?.()},Q(`div.inv-win.wm-win`,Q(`div.inv-head`,this.title,Q(`button.inv-x`,{title:`Закрыть (M / Esc)`,onclick:()=>this.onClose?.()},`×`)),this.canvas,Q(`div.wm-legend`,t(`wk-hero`,`Вы`),t(`wk-dummy`,`Манекен`),t(`wk-target`,`Цель`),this.extra,this.coords))),e.appendChild(this.root)}get isOpen(){return!this.root.classList.contains(`hidden`)}open(e){this.title.textContent=`Карта: ${v_(e.map.name)}`;let t=(e,t)=>Q(`span.wm-key`,Q(`i.`+e),t);this.extra.replaceChildren(...e.map.generator===`wild`?[t(`wk-forest`,`Лес`),t(`wk-water`,`Реки и озёра`),t(`wk-swamp`,`Болота`),t(`wk-snow`,`Снег`),t(`wk-sand`,`Пустыня, пляж`),t(`wk-rock`,`Горы, скалы`)]:[t(`wk-bush`,`Кусты`),t(`wk-block`,`Возвышение`),t(`wk-rock`,`Скалы (край)`)]),this.root.classList.remove(`hidden`),this.draw(e)}close(){this.root.classList.add(`hidden`)}fit(){let e=Math.max(240,Math.min(720,window.innerHeight-170,window.innerWidth-80)),t=Math.min(2,window.devicePixelRatio||1),n=Math.round(e*t);return n!==this.px&&(this.px=n,this.canvas.width=this.canvas.height=n,this.canvas.style.width=this.canvas.style.height=`${e}px`),n}draw(e){if(!this.isOpen)return;let t=this.fit(),n=e.terrain;this.imgFor!==n&&(this.img=T_(n,e.map,e.trees),this.imgFor=n);let r=this.g,i=n.size,a=i*(Math.abs(Math.cos(this.yaw))+Math.abs(Math.sin(this.yaw))),o=t*.94/a,s=n.ox+i/2,c=n.oz+i/2;r.setTransform(1,0,0,1,0,0),r.fillStyle=`#2a2630`,r.fillRect(0,0,t,t),r.translate(t/2,t/2),r.rotate(this.yaw),r.scale(o,o),r.translate(-s,-c),r.imageSmoothingEnabled=i>400,this.img&&r.drawImage(this.img,n.ox,n.oz,i,i),r.strokeStyle=`rgba(0,0,0,0.12)`,r.lineWidth=1/o,r.beginPath();let l=i>400?100:10;for(let e=l;e<i;e+=l)r.moveTo(n.ox+e,n.oz),r.lineTo(n.ox+e,n.oz+i),r.moveTo(n.ox,n.oz+e),r.lineTo(n.ox+i,n.oz+e);r.stroke(),r.setTransform(1,0,0,1,0,0);let u=D_(this.yaw),d=(e,n)=>{let[r,i]=u(e-s,n-c);return[t/2+r*o,t/2+i*o]};O_(r,e,d,Math.max(3,o*.45),!0);let f=e.player,[p,m]=d(f.x,f.z),[h,g]=u(f.fx,f.fz),_=.5+.5*Math.sin(e.time*4);r.strokeStyle=`rgba(255,255,255,${.25+_*.35})`,r.lineWidth=Math.max(2,t*.004),r.beginPath(),r.arc(p,m,t*(.022+_*.008),0,Math.PI*2),r.stroke(),E_(r,p,m,Math.atan2(h,-g),Math.max(7,t*.016)),this.compass(r,t);let v=`Вы: ${Math.floor(f.x-n.ox)}, ${Math.floor(f.z-n.oz)}`;this.coords.textContent!==v&&(this.coords.textContent=v)}compass(e,t){let n=t*.05,r=t-n*1.6,i=n*1.6,a=D_(this.yaw);e.fillStyle=`rgba(26,22,30,0.75)`,e.beginPath(),e.arc(r,i,n*1.3,0,Math.PI*2),e.fill();let[o,s]=a(0,-1),c=Math.atan2(o,-s);e.save(),e.translate(r,i),e.rotate(c),e.fillStyle=`#ff5a4a`,e.beginPath(),e.moveTo(0,-n*.62),e.lineTo(n*.26,0),e.lineTo(-n*.26,0),e.fill(),e.fillStyle=`#f4efe2`,e.beginPath(),e.moveTo(0,n*.62),e.lineTo(n*.3,0),e.lineTo(-n*.3,0),e.fill(),e.restore(),e.font=`${Math.round(n*.6)}px "Russo One", sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillStyle=`#ff5a4a`,e.fillText(`С`,r+o*n*.98,i+s*n*.98)}};function $(e,t){return h_()===`en`?t:e}var W_=[[1280,720],[1600,900],[1920,1080],[2560,1440],[3840,2160]];function G_(){let e=window.devicePixelRatio||1,t=Math.round((window.screen?.width||1920)*e),n=Math.round((window.screen?.height||1080)*e),r=W_.filter(([e,r])=>e<=t&&r<=n).map(([e,t])=>`${e}x${t}`);return r.length?r:[`1280x720`]}var K_=[{id:`screen`,icon:`monitor`,ru:`Экран`,en:`Display`},{id:`graphics`,icon:`gem`,ru:`Графика`,en:`Graphics`},{id:`game`,icon:`sword`,ru:`Игра`,en:`Gameplay`},{id:`audio`,icon:`note`,ru:`Звук`,en:`Audio`},{id:`controls`,icon:`keys`,ru:`Управление`,en:`Controls`},{id:`other`,icon:`dots`,ru:`Прочее`,en:`Other`}],q_={screen:[`displayMode`,`resolution`,`vsync`,`fpsLimit`,`uiScale`],graphics:[`quality`,`shadows`,`effects`,`particles`,`viewDistance`,`antiAliasing`,`textures`,`postProcessing`],game:[`cameraZoom`,`screenShake`,`damageNumbers`,`showFps`,`showHints`,`autoPause`],audio:[`master`,`music`,`sfx`,`ambient`,`ui`],controls:[`keybinds`,`swapMouse`,`invertWheel`],other:[`lang`]},J_={jump:[`Прыжок`,`Jump`],attack:[`Базовая атака (по цели)`,`Basic attack`],build:[`Добыча и строительство`,`Mining and building`],inventory:[`Инвентарь и снаряжение`,`Inventory`],map:[`Карта мира`,`World map`],pause:[`Пауза`,`Pause`],zoomIn:[`Приблизить камеру`,`Zoom in`],zoomOut:[`Отдалить камеру`,`Zoom out`]},Y_=e=>$(...J_[e]),X_=[[`Передвижение (ходьба — ЛКМ)`,`Movement (walk: left click)`,[`jump`]],[`Бой и строительство`,`Combat and building`,[`attack`,`build`]],[`Экраны и камера`,`Screens and camera`,[`inventory`,`map`,`pause`,`zoomIn`,`zoomOut`]]],Z_=[`jump`,`attack`,`inventory`],Q_=`screen`,$_=null,ev=e=>JSON.parse(JSON.stringify(e)),tv=(e,t)=>JSON.stringify(e)===JSON.stringify(t);function nv(e){return!!$_&&!tv($_,e.profile.data.settings)}function rv(e,t,n){nv(e)?sv(t,$(`Есть изменения, которые не применены.`,`Some changes are not applied.`),[{label:$(`Отмена`,`Cancel`)},{label:$(`Не сохранять`,`Discard`),fn:()=>{av(e),n()}},{label:$(`Применить`,`Apply`),primary:!0,fn:()=>{iv(e),ov(e),n()}}]):(ov(e),n())}function iv(e){let t=e.profile.data.settings;$_=ev(t),e.profile.committedSettings=null,e.profile.save(),e.profile.committedSettings=$_}function av(e){if($_){let t=ev($_);e.profile.data.settings=t,m_(t.lang),e.applySettings()}ov(e)}function ov(e){$_=null,e.profile.committedSettings=null}function sv(e,t,n){let r=Q(`div.st-dialog`,Q(`div.st-dialog-box`,Q(`p`,t),Q(`div.st-dialog-btns`,...n.map(e=>Q(`button.st-btn`+(e.primary?`.primary`:``),{onclick:()=>{r.remove(),e.fn?.()}},e.label)))));(e.closest(`.app`)??e).appendChild(r)}function cv(e,t,n){$_||($_=ev(e.profile.data.settings),e.profile.committedSettings=$_);let r=()=>e.profile.data.settings,i=Q(`nav.st-nav`),a=Q(`div.st-body`),o=Q(`div.st-head`),s=Q(`button.st-btn.primary`,{onclick:()=>{nv(e)&&(e.sfx(`select`),iv(e),u($(`Настройки применены и сохранены.`,`Settings applied and saved.`)),f())}},$(`Применить`,`Apply`)),c=Q(`div.st-status`),l=0,u=e=>{c.textContent=e,c.classList.add(`show`),clearTimeout(l),l=window.setTimeout(()=>c.classList.remove(`show`),2400)},d=()=>{e.applySettings(),f()},f=()=>{let t=nv(e);s.toggleAttribute(`disabled`,!t),D.classList.toggle(`dirty`,t)},p=(e,t,n)=>Q(`div.st-row`,Q(`div.st-label`,Q(`span`,e),n?Q(`small`,n):null),Q(`div.st-ctl`,t)),m=e=>Q(`div.st-group`,e),h=(e,t,n,r={})=>{let i=r.k??100,a=r.fmt??(e=>Math.round(e*100)+`%`),o=Q(`span.st-val`,a(t())),s=Q(`input.st-range`,{type:`range`,min:r.min??0,max:r.max??100,value:Math.round(t()*i)}),c=()=>s.style.setProperty(`--p`,(Number(s.value)-Number(s.min))/(Number(s.max)-Number(s.min))*100+`%`);return c(),s.addEventListener(`input`,()=>{n(Number(s.value)/i),o.textContent=a(t()),c(),d()}),p(e,Q(`div.st-slider`,s,o),r.hint)},g=(t,n,r,i)=>{let a=Q(`button.st-toggle`+(n()?`.on`:``),{role:`switch`,onclick:()=>{r(!n()),a.classList.toggle(`on`,n()),o.textContent=n()?$(`Вкл`,`On`):$(`Выкл`,`Off`),e.sfx(`ui`),d()}},Q(`i`)),o=Q(`span.st-toggle-txt`,n()?$(`Вкл`,`On`):$(`Выкл`,`Off`));return p(t,Q(`div.st-toggle-wrap`,a,o),i)},_=(t,n,r,i,a)=>{let o=Q(`div.st-seg`),s=()=>{d_(o);for(let t of n)o.append(Q(`button`+(t.id===r()?`.sel`:``),{onclick:()=>{t.id!==r()&&(e.sfx(`ui`),i(t.id),s(),d())}},t.name))};return s(),p(t,o,a)},v=()=>[{id:`low`,name:$(`Низко`,`Low`)},{id:`medium`,name:$(`Средне`,`Medium`)},{id:`high`,name:$(`Высоко`,`High`)}],y=()=>$(`Выкл`,`Off`),b=e=>t=>{r()[e]=t,r().quality=`custom`,C()},x=``,S=(t,n)=>{let i=r(),a=Object.keys(Zg()),o=Q(`div.st-binds`);for(let r=0;r<2;r++){let s=i.keybinds[t][r]??``,c=Q(`button.st-key`+(s?``:`.empty`)+(s&&n.has(s)?`.conflict`:``),{onclick:()=>{e.sfx(`ui`),c.textContent=$(`Нажмите клавишу…`,`Press a key…`),c.classList.add(`wait`),e.captureKey(e=>{if(x=``,e!==`Escape`||t===`pause`){if(e===`Backspace`||e===`Delete`)i.keybinds[t].splice(r,1);else{let n=a.filter(n=>n!==t&&i.keybinds[n].includes(e));for(let n of a)n!==t&&(i.keybinds[n]=i.keybinds[n].filter(t=>t!==e));let o=[...i.keybinds[t]];r<o.length?o[r]=e:o.push(e),i.keybinds[t]=o.filter((e,t)=>o.indexOf(e)===t),n.length&&(x=$(`Клавиша ${Dg(e)} переназначена на «${Y_(t)}» и снята с: ${n.map(Y_).join(`, `)}.`,`${Dg(e)} now does "${Y_(t)}" and was removed from: ${n.map(Y_).join(`, `)}.`))}d()}C()})}},s?Dg(s):`—`);o.append(c)}return p(Y_(t),o)},C=()=>{let n=r();d_(a);let i=K_.find(e=>e.id===Q_);switch(d_(o),o.append(Q(`h2`,$(i.ru,i.en))),Q_){case`screen`:{let e=G_();a.append(_($(`Режим окна`,`Window mode`),[{id:`windowed`,name:$(`В окне`,`Windowed`)},{id:`fullscreen`,name:$(`Полный экран`,`Fullscreen`)},{id:`borderless`,name:$(`Без рамки`,`Borderless`)}],()=>n.displayMode,e=>n.displayMode=e,$(`В браузере полный экран и режим без рамки работают одинаково: игра занимает весь экран без панелей браузера.`,`In a browser, fullscreen and borderless behave the same: the game fills the screen without browser bars.`)),_($(`Разрешение`,`Resolution`),[{id:`native`,name:$(`Родное`,`Native`)},...e.map(e=>({id:e,name:e.replace(`x`,`×`)}))],()=>n.resolution===`native`||e.includes(n.resolution)?n.resolution:`native`,e=>n.resolution=e,$(`Разрешение отрисовки 3D-сцены; показаны только подходящие вашему монитору.`,`Render resolution of the 3D scene; only ones that fit your monitor are listed.`)),g($(`Вертикальная синхронизация`,`Vertical sync`),()=>n.vsync,e=>n.vsync=e),_($(`Ограничение кадров`,`Frame limit`),[30,60,120,144,165,240,0].map(e=>({id:e,name:e?String(e):`∞`})),()=>n.fpsLimit,e=>n.fpsLimit=e),h($(`Масштаб интерфейса`,`Interface scale`),()=>n.uiScale,e=>n.uiScale=e,{min:80,max:130,hint:$(`Размер меню, панелей и подсказок.`,`Size of menus, panels and hints.`)}));break}case`graphics`:a.append(_($(`Общее качество`,`Overall quality`),[{id:`low`,name:$(`Низкое`,`Low`)},{id:`medium`,name:$(`Среднее`,`Medium`)},{id:`high`,name:$(`Высокое`,`High`)},{id:`ultra`,name:$(`Ультра`,`Ultra`)},...n.quality===`custom`?[{id:`custom`,name:$(`Своё`,`Custom`)}]:[]],()=>n.quality,e=>{n.quality=e,e!==`custom`&&Object.assign(n,Qg[e]),C()},$(`«Ультра» включает все параметры на максимум.`,`Ultra turns every option to the maximum.`)),m($(`Детали`,`Details`)),_($(`Качество текстур`,`Texture quality`),v(),()=>n.textures,b(`textures`),$(`Фильтрация и мипмапы текстур блоков.`,`Filtering and mipmaps of block textures.`)),_($(`Тени`,`Shadows`),[{id:`off`,name:y()},...v()],()=>n.shadows,b(`shadows`),$(`Размер карты теней: 1024, 2048 или 4096.`,`Shadow map size: 1024, 2048 or 4096.`)),_($(`Освещение и эффекты`,`Lighting and effects`),v(),()=>n.effects,b(`effects`),$(`Число динамических источников света (2, 4 или 6), сила свечения и затенение (AO).`,`Dynamic light count (2, 4 or 6), glow strength and ambient occlusion.`)),_($(`Частицы`,`Particles`),v(),()=>n.particles,b(`particles`),$(`Количество частиц в эффектах ударов и окружения.`,`How many particles hits and the world spawn.`)),_($(`Дальность прорисовки`,`View distance`),[{id:`near`,name:$(`Близко`,`Near`)},{id:`medium`,name:$(`Средне`,`Medium`)},{id:`far`,name:$(`Далеко`,`Far`)},{id:`max`,name:$(`Макс.`,`Max`)}],()=>n.viewDistance,b(`viewDistance`)),_($(`Сглаживание`,`Anti-aliasing`),[{id:`off`,name:y()},{id:`msaa`,name:`MSAA`},{id:`ssaa`,name:`MSAA + SSAA`}],()=>n.antiAliasing,b(`antiAliasing`),$(`MSAA включается или выключается после перезапуска игры.`,`MSAA turns on or off after restarting the game.`)),g($(`Постобработка`,`Post-processing`),()=>n.postProcessing,b(`postProcessing`),$(`Свечение, цветокоррекция, тональная компрессия и виньетка.`,`Bloom, color grading, tone mapping and vignette.`)));break;case`game`:a.append(m($(`Камера`,`Camera`)),h($(`Отдаление камеры`,`Camera distance`),()=>n.cameraZoom,e=>n.cameraZoom=e,{min:75,max:135,hint:$(`Также меняется колесом мыши в игре.`,`Also changes with the mouse wheel in game.`)}),h($(`Тряска экрана`,`Screen shake`),()=>n.screenShake,e=>n.screenShake=e),m($(`Интерфейс`,`Interface`)),g($(`Цифры урона`,`Damage numbers`),()=>n.damageNumbers,e=>n.damageNumbers=e),g($(`Подсказки управления`,`Control hints`),()=>n.showHints,e=>n.showHints=e,$(`Подсказка по клавишам в начале игры новым персонажем.`,`Key hints when a new character starts.`)),g($(`Счётчик кадров`,`FPS counter`),()=>n.showFps,e=>n.showFps=e),m($(`Мир`,`World`)),g($(`Пауза при сворачивании`,`Pause when the window loses focus`),()=>n.autoPause,e=>n.autoPause=e));break;case`audio`:a.append(h($(`Общая громкость`,`Master volume`),()=>n.master,e=>n.master=e),h($(`Музыка`,`Music`),()=>n.music,e=>n.music=e),h($(`Звуковые эффекты`,`Sound effects`),()=>n.sfx,e=>n.sfx=e),h($(`Окружение`,`Ambience`),()=>n.ambient,e=>n.ambient=e,{hint:$(`Ветер, река, птицы днём и сверчки ночью.`,`Wind, the river, birds by day and crickets at night.`)}),h($(`Интерфейс`,`Interface`),()=>n.ui,e=>n.ui=e));break;case`controls`:{let e=Object.keys(Zg()),t=new Map;for(let r of e)for(let e of n.keybinds[r])t.set(e,[...t.get(e)??[],r]);let r=new Set([...t].filter(([,e])=>e.length>1).map(([e])=>e)),i=[...r].map(e=>$(`Клавиша ${Dg(e)} назначена сразу на: ${t.get(e).map(Y_).join(`, `)}.`,`${Dg(e)} is bound to several actions: ${t.get(e).map(Y_).join(`, `)}.`)),o=Z_.filter(e=>!n.keybinds[e].length);o.length&&i.push($(`Без клавиши: ${o.map(Y_).join(`, `)}.`,`No key: ${o.map(Y_).join(`, `)}.`)),a.append(m($(`Мышь`,`Mouse`)),g($(`Поменять кнопки мыши местами`,`Swap mouse buttons`),()=>n.swapMouse,e=>n.swapMouse=e,$(`Обычно: левая — идти и выбирать цель, правая — атаковать.`,`Default: left moves and picks a target, right attacks.`)),g($(`Обратное направление колеса`,`Reverse wheel zoom`),()=>n.invertWheel,e=>n.invertWheel=e),Q(`div.st-hint`,$(`Чувствительности мыши нет: курсор системный и указывает точку в мире напрямую.`,`There is no mouse sensitivity: the system cursor points at the world directly.`))),x&&a.append(Q(`div.st-note`,x));for(let e of i)a.append(Q(`div.st-warn`,e));for(let[e,t,n]of X_){a.append(m($(e,t)));for(let e of n)a.append(S(e,r))}a.append(Q(`div.st-hint`,$(`Щёлкните по клавише и нажмите новую. Backspace очищает слот, Esc отменяет.`,`Click a key and press a new one. Backspace clears the slot, Esc cancels.`)));break}case`other`:a.append(_($(`Язык`,`Language`),g_,()=>n.lang,e=>{n.lang=e,m_(e),t()}),p($(`Все настройки`,`All settings`),Q(`button.st-btn.danger`,{onclick:()=>{e.sfx(`ui`),sv(D,$(`Вернуть все настройки и клавиши к значениям по умолчанию? Персонажи не пострадают.`,`Restore every setting and key to the defaults? Characters are not affected.`),[{label:$(`Отмена`,`Cancel`)},{label:$(`Сбросить`,`Reset`),primary:!0,fn:()=>{let n=r().lang;e.profile.data.settings={...n_(),lang:n},d(),t()}}])}},$(`Сбросить всё`,`Reset everything`)),$(`Изменение нужно применить кнопкой «Применить».`,`Press Apply to keep the change.`)),Q(`div.st-credits`,$(`Cubeborn — оригинальная игра. Вся графика, модели, звуки и музыка созданы процедурно. Шрифты: Russo One, Rubik и Press Start 2P (SIL OFL).`,`Cubeborn is an original game. All graphics, models, sounds and music are procedural. Fonts: Russo One, Rubik and Press Start 2P (SIL OFL).`),Q(`br`),e.version))}e.needsRestart()&&a.prepend(Q(`div.st-note`,$(`Изменение сглаживания вступит в силу после перезапуска игры.`,`The anti-aliasing change takes effect after restarting the game.`))),f()},w=()=>{d_(i);for(let t of K_)i.append(Q(`button.st-tab`+(Q_===t.id?`.sel`:``),{onclick:()=>{Q_!==t.id&&(e.sfx(`ui`),Q_=t.id,w(),C())}},Q(`i.st-ico.i-`+t.icon),Q(`span`,$(t.ru,t.en))))},T=Q(`button.st-btn`,{onclick:()=>{e.sfx(`ui`);let n=n_(),i=r();for(let e of q_[Q_])i[e]=JSON.parse(JSON.stringify(n[e]));Q_===`other`&&m_(r().lang),u($(`Раздел возвращён к значениям по умолчанию. Нажмите «Применить», чтобы сохранить.`,`Section restored to defaults. Press Apply to keep it.`)),d(),Q_===`other`?t():C()}},$(`По умолчанию`,`Defaults`)),E=Q(`button.st-btn`,{onclick:()=>rv(e,D,n)},$(`Назад`,`Back`)),D=Q(`div.st`,Q(`div.st-side`,i),Q(`div.st-main`,o,Q(`div.st-scroll`,a),Q(`div.st-foot`,c,Q(`div.st-foot-btns`,T,E,s))));return w(),C(),D}var lv=[{id:`continue`,icon:`play`,ru:`Продолжить игру`,en:`Continue`},{id:`create`,icon:`helm`,ru:`Создать персонажа`,en:`Create character`},{id:`settings`,icon:`gear`,ru:`Настройки`,en:`Settings`},{id:`exit`,icon:`door`,ru:`Выход`,en:`Exit`}],uv=e=>Q(`i.mm-glyph.g-`+e);function dv(e){let t=Math.floor(e/60);return t<60?$(`${t} мин`,`${t} min`):$(`${Math.floor(t/60)} ч ${t%60} мин`,`${Math.floor(t/60)} h ${t%60} min`)}function fv(e,t){let n=t.trim();return n.length<2?$(`Имя должно содержать минимум 2 символа`,`The name needs at least 2 characters`):n.length>16?$(`Имя не длиннее 16 символов`,`The name must be at most 16 characters`):/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(n)?e.data.chars.some(e=>e.name.toLowerCase()===n.toLowerCase())?$(`Персонаж с таким именем уже есть`,`A character with this name already exists`):null:$(`Только буквы, цифры, пробел, «-» и «_»`,`Letters, digits, space, "-" and "_" only`)}var pv=class{constructor(e,t){m(this,`api`,void 0),m(this,`root`,void 0),m(this,`stack`,[`main`]),m(this,`cleanup`,null),m(this,`sel`,null),this.api=t,this.root=Q(`div.menus`),e.appendChild(this.root)}setVisible(e){this.root.classList.toggle(`hidden`,!e),e||(this.cleanup?.(),this.cleanup=null)}get current(){return this.stack[this.stack.length-1]}get canGoBack(){return this.current!==`main`||!!this.root.querySelector(`.mm-dialog`)}open(e){this.stack=e===`main`?[`main`]:[`main`,e],this.render()}back(){let e=this.root.querySelector(`.mm-dialog`),t=this.root.closest(`.app`)?.querySelector(`.st-dialog`);t?t.remove():this.current===`settings`?rv(this.api,this.root,()=>{this.api.sfx(`uiBack`),this.open(`main`)}):e?e.remove():(this.api.sfx(`uiBack`),this.open(`main`))}home(){this.open(`main`)}render(){this.cleanup?.(),this.cleanup=null,d_(this.root);let e=this.current,t=this.build(e);t.classList.add(`screen`,`screen-`+e),this.root.appendChild(t),this.api.setMenuShift(e===`main`?.35:e===`continue`?.75:1)}build(e){switch(e){case`main`:return this.mainScreen();case`continue`:return this.continueScreen();case`create`:return this.createScreen();case`settings`:return this.frame(__(`menu_settings`),cv(this.api,()=>this.render(),()=>this.open(`main`)),`.mm-full`)}}go(e){this.api.sfx(`ui`);let t=()=>e===`exit`?this.exitDialog():this.open(e);this.current===`settings`?rv(this.api,this.root,t):t()}mainScreen(){let e=this.api.profile,t=e.data.chars.length>0,n=Q(`nav.mm-nav`),r=Q(`div.mm-note`);for(let e of lv){let i=e.id===`continue`&&!t;n.append(Q(`button.mm-btn`+(i?`.off`:``)+(e.id===`continue`&&t||e.id===`create`&&!t?`.primary`:``),{onclick:()=>{i?(this.api.sfx(`denied`),r.textContent=$(`Сохранённых персонажей пока нет. Создайте первого.`,`No saved characters yet. Create your first one.`),r.classList.add(`show`)):this.go(e.id)}},uv(e.icon),Q(`span.mm-label`,$(e.ru,e.en)),Q(`span.mm-arrow`,`›`)))}let i=e.char;return Q(`div.mm`,Q(`div.mm-side`,Q(`div.mm-logo`,Q(`div.mm-logo-title`,`CUBEBORN`),Q(`div.mm-logo-sub`,__(`game_subtitle`))),n,r,i?Q(`div.mm-last`,$(`Последний персонаж: `,`Last character: `),Q(`b`,i.name),` · ${_m[i.race]?.name??``}`):null),Q(`div.mm-ver`,this.api.version))}frame(e,t,n=``){let r=Q(`div.mm-tabs`);for(let e of lv){let t=e.id===`continue`&&!this.api.profile.data.chars.length;r.append(Q(`button.mm-tab`+(e.id===this.current?`.sel`:``)+(t?`.off`:``),{onclick:()=>{e.id===this.current||t||this.go(e.id)}},uv(e.icon),Q(`span`,$(e.ru,e.en))))}return Q(`div.mm-frame`+n,Q(`div.mm-top`,Q(`button.mm-back`,{title:`Esc`,onclick:()=>this.back()},`←`),Q(`h1.mm-title`,e),r),Q(`div.mm-body`,t))}continueScreen(){let e=this.api.profile,t=Q(`div.mc`),n=()=>{d_(t);let r=e.chars;if(!r.length){t.append(Q(`div.mc-empty`,Q(`p`,$(`Сохранённых персонажей пока нет.`,`There are no saved characters yet.`)),Q(`button.mm-big`,{onclick:()=>this.go(`create`)},$(`Создать персонажа`,`Create character`))));return}this.sel&&r.some(e=>e.id===this.sel)||(this.sel=e.char?.id??r[0].id);let i=Q(`div.mc-list`);for(let t of r)i.append(Q(`button.mc-row`+(t.id===this.sel?`.sel`:``),{onclick:()=>{t.id!==this.sel&&(this.api.sfx(`select`),this.sel=t.id,e.selectChar(t.id),n())},ondblclick:()=>this.api.play(t.id)},Q(`div.mc-txt`,Q(`b`,t.name),Q(`span`,`${_m[t.race]?.name??``} · ${$(`Уровень`,`Level`)} ${t.level}`),Q(`small`,`${v_(nf.name)} · ${dv(t.playTime)}`))));let a=r.find(e=>e.id===this.sel)??r[0],o=Q(`div.mc-detail`,Q(`div.mc-head`,Q(`div`,Q(`h2`,a.name),Q(`span`,`${_m[a.race]?.name??``} · ${$(`Уровень`,`Level`)} ${a.level}`))),Q(`div.mc-kv`,Q(`span`,$(`Локация`,`Location`)),Q(`b`,v_(nf.name))),Q(`div.mc-kv`,Q(`span`,$(`Время в игре`,`Play time`)),Q(`b`,dv(a.playTime))),Q(`div.mc-kv`,Q(`span`,$(`Последняя игра`,`Last played`)),Q(`b`,new Date(a.lastPlayed).toLocaleDateString())),Q(`button.mm-big`,{onclick:()=>this.api.play(a.id)},$(`Играть`,`Play`)),Q(`button.mm-small.danger`,{onclick:()=>this.deleteDialog(a,n)},$(`Удалить персонажа`,`Delete character`)));t.append(Q(`div.mc-col`,Q(`div.mc-count`,$(`Персонажи: ${r.length} / 12`,`Characters: ${r.length} / 12`)),i),o)};return n(),this.frame($(`Продолжить игру`,`Continue`),t,`.mm-left`)}deleteDialog(e,t){this.dialog($(`Удалить персонажа «${e.name}» (${_m[e.race]?.name??``}, ур. ${e.level})? Он и его снаряжение будут потеряны навсегда.`,`Delete "${e.name}"? The character and its gear are lost for good.`),[{label:$(`Отмена`,`Cancel`)},{label:$(`Удалить`,`Delete`),cls:`.danger`,fn:()=>{this.api.profile.deleteChar(e.id),this.sel=null,t()}}])}dialog(e,t){let n=Q(`div.mm-dialog`,Q(`div.mm-dialog-box`,Q(`p`,e),Q(`div.mm-dialog-btns`,...t.map(e=>Q(`button.mm-small`+(e.cls??``),{onclick:()=>{this.api.sfx(`ui`),n.remove(),e.fn?.()}},e.label)))));this.root.appendChild(n)}exitDialog(){this.dialog($(`Выйти из игры? Все персонажи и настройки уже сохранены.`,`Quit the game? All characters and settings are saved.`),[{label:$(`Отмена`,`Cancel`)},{label:$(`Выйти`,`Quit`),cls:`.primary`,fn:()=>{this.api.profile.save(),window.close(),setTimeout(()=>{window.closed||this.dialog($(`Браузер не даёт странице закрыть себя. Закройте вкладку, чтобы выйти, — прогресс сохранён.`,`The browser does not let a page close itself. Close the tab to quit — your progress is saved.`),[{label:$(`Понятно`,`OK`)}])},250)}}])}createScreen(){let e=this.api.profile,t=e=>this.api.sfx(e),n=vm(),r=n[0],i=Q(`div.cc-err`),a=Q(`input.cc-name`,{type:`text`,maxlength:`16`,placeholder:$(`Имя персонажа`,`Character name`),spellcheck:`false`,autocomplete:`off`}),o=e.data.chars.length>=12,s=()=>{if(o)return;let n=fv(e,a.value);if(i.textContent=n??``,n){t(`denied`),a.focus();return}let s=e.createChar(a.value.trim(),r.id);s&&(t(`select`),this.sel=s.id,this.api.play(s.id))};a.addEventListener(`input`,()=>i.textContent=a.value.trim()?fv(e,a.value)??``:``),a.addEventListener(`keydown`,e=>{e.code!==`Escape`&&e.stopPropagation(),(e.code===`Enter`||e.code===`NumpadEnter`)&&(e.preventDefault(),s())});let c=Q(`p.cc-desc`),l=Q(`div.cc-races`),u=e=>{r=e,c.textContent=e.desc;for(let t of l.children)t.classList.toggle(`sel`,t.dataset.id===e.id)};for(let e of n)l.append(Q(`button.cc-race`,{"data-id":e.id,onclick:()=>(t(`select`),u(e))},Q(`i.cc-race-ico`),Q(`b`,e.name),Q(`small`,$(`Доступна`,`Available`))));u(r);let d=r.base,f=Q(`div.cc-panel`,Q(`div.cc-sec`,$(`Раса`,`Race`)),l,c,Q(`div.cc-base`,Q(`div`,Q(`span`,`Здоровье`),Q(`b`,String(d.maxHp))),Q(`div`,Q(`span`,`Скорость`),Q(`b`,`${d.moveSpeed} бл/с`)),Q(`div`,Q(`span`,`Защита`),Q(`b`,String(d.physDef)))),Q(`p.cc-note`,`Класса нет: стиль боя определяет оружие. Все стартовые предметы уже лежат в сумке.`),Q(`div.cc-sec`,$(`Имя персонажа`,`Character name`),Q(`small`,` · ${e.data.chars.length} / 12`)),a,i,o?Q(`div.cc-err`,$(`Достигнут предел персонажей — удалите одного в «Продолжить игру».`,`Character limit reached.`)):Q(`button.mm-big.cc-go`,{onclick:s},$(`Подтвердить`,`Confirm`)));return setTimeout(()=>a.focus(),60),this.frame($(`Создание персонажа`,`Create character`),Q(`div.cc`,f),`.mm-left`)}},mv=class{constructor(e,t){m(this,`api`,void 0),m(this,`root`,void 0),m(this,`escape`,()=>!1),this.api=t,this.root=Q(`div.run-modals`),e.appendChild(this.root)}close(){d_(this.root),this.root.classList.remove(`open`)}get isOpen(){return this.root.classList.contains(`open`)}open(e){d_(this.root),this.root.append(e),this.root.classList.add(`open`)}pause(e,t){let n=Q(`div.pz-side`),r=Q(`div.mm-note`),i=(e,t,n,r=!1)=>Q(`button.mm-btn`+(r?`.primary`:``),{onclick:n},Q(`i.mm-glyph.g-`+e),Q(`span.mm-label`,t),Q(`span.mm-arrow`,`›`)),a=()=>{this.escape=()=>!1,d_(n),n.append(Q(`h1.pz-title`,$(`ПАУЗА`,`PAUSED`)),Q(`div.pz-rule`,Q(`i`)),Q(`nav.mm-nav`,i(`play`,$(`Продолжить игру`,`Resume`),()=>t.resume(),!0),i(`gear`,$(`Настройки`,`Settings`),()=>{this.api.sfx(`ui`),o()}),i(`disk`,$(`Сохранить игру`,`Save game`),()=>{let e=t.save();this.api.sfx(e?`select`:`denied`),r.textContent=e?$(`Игра сохранена.`,`Game saved.`):$(`Не удалось сохранить: браузер запретил запись.`,`Could not save: the browser refused to write.`),r.classList.remove(`show`),r.offsetWidth,r.classList.add(`show`)}),i(`door`,$(`Выйти в главное меню`,`Exit to main menu`),()=>{this.api.sfx(`ui`),t.exit()})),r)},o=()=>{d_(n),n.append(Q(`div.pz-settings`,cv(this.api,o,a))),this.escape=()=>{let e=this.root.closest(`.app`)?.querySelector(`.st-dialog`);return e?e.remove():rv(this.api,this.root,a),!0}};a(),this.open(Q(`div.pz`,n))}},hv=class{constructor(){m(this,`map`,new Map)}on(e,t){let n=this.map.get(e);return n||this.map.set(e,n=new Set),n.add(t),()=>n.delete(t)}emit(e,t){let n=this.map.get(e);if(n)for(let e of n)e(t)}clear(){this.map.clear()}},gv={light:{dawn:{sun:.85,sunColor:16762010,ambient:.9,ambientColor:13158640,tint:.45,fog:.92,fogColor:15250600,fogTint:.3,warm:.06,sat:1.04},day:{sun:1,sunColor:16773336,ambient:1,ambientColor:16777215,tint:0,fog:1,fogColor:16777215,fogTint:0,warm:.035,sat:1.08},dusk:{sun:.72,sunColor:16748624,ambient:.75,ambientColor:11571408,tint:.55,fog:.88,fogColor:8014456,fogTint:.38,warm:.08,sat:1.08},night:{sun:.58,sunColor:5930239,ambient:.7,ambientColor:3823832,tint:.9,fog:.74,fogColor:661056,fogTint:.72,warm:-.06,sat:1}},darkMapNightStrength:.55};function _v(e){let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)}function vv(e,t,n){let r=e>>16&255,i=e>>8&255,a=e&255,o=Math.round(r+((t>>16&255)-r)*n),s=Math.round(i+((t>>8&255)-i)*n),c=Math.round(a+((t&255)-a)*n);return o<<16|s<<8|c}function yv(e,t,n,r){return r.sun=e.sun+(t.sun-e.sun)*n,r.ambient=e.ambient+(t.ambient-e.ambient)*n,r.tint=e.tint+(t.tint-e.tint)*n,r.fog=e.fog+(t.fog-e.fog)*n,r.fogTint=e.fogTint+(t.fogTint-e.fogTint)*n,r.warm=e.warm+(t.warm-e.warm)*n,r.sat=e.sat+(t.sat-e.sat)*n,r.sunColor=vv(e.tint>0?e.sunColor:t.sunColor,t.tint>0?t.sunColor:e.sunColor,n),r.ambientColor=vv(e.tint>0?e.ambientColor:t.ambientColor,t.tint>0?t.ambientColor:e.ambientColor,n),r.fogColor=vv(e.fogTint>0?e.fogColor:t.fogColor,t.fogTint>0?t.fogColor:e.fogColor,n),r}var bv=class{constructor(e,t){m(this,`run`,void 0),m(this,`clock`,void 0),m(this,`nights`,0),m(this,`period`,`day`),m(this,`phaseK`,0),m(this,`night`,0),m(this,`light`,{...gv.light.day}),this.run=e,this.clock=t,this.compute()}get enabled(){return!0}get isNight(){return this.night>=.5}get minutes(){return this.clock.minutes}get sunArc(){let e=this.clock.minutes,t=1200;return e>=300&&e<t?(e-300)/900*2-1:(e>=t?e-t:e+h-t)/(h-900)*2-1}compute(){let{p:e,k:t}=b(this.clock.minutes);this.period=e,this.phaseK=t;let n=gv.light;switch(e){case`day`:this.night=0,yv(n.day,n.dusk,_v((t-.85)/.15)*.5,this.light);break;case`dusk`:this.night=_v(t),t<.5?yv(n.day,n.dusk,.5+t,this.light):yv(n.dusk,n.night,_v((t-.5)*2),this.light);break;case`night`:this.night=1,yv(n.night,n.dawn,_v((t-.9)/.1)*.4,this.light);break;case`dawn`:this.night=1-_v(t),t<.5?yv(n.night,n.dawn,.4+.6*_v(t*2),this.light):yv(n.dawn,n.day,_v((t-.5)*2),this.light)}if(this.run.map.palette.heroLight){let e=gv.darkMapNightStrength,t=gv.light.day;this.light.sun=t.sun+(this.light.sun-t.sun)*e,this.light.ambient=t.ambient+(this.light.ambient-t.ambient)*e,this.light.tint*=e,this.light.fogTint*=e,this.light.fog=t.fog+(this.light.fog-t.fog)*e}}update(){let e=this.period;this.compute(),this.period!==e&&this.onPeriod(this.period)}onPeriod(e){let t=this.run;t.events.emit(`dayPeriod`,e),e===`dusk`?t.events.emit(`banner`,`dn_dusk`):e===`night`?(this.nights++,t.events.emit(`banner`,`dn_night`),t.fx.sound(`nightfall`,.8)):e===`dawn`&&(t.events.emit(`banner`,`dn_dawn`),t.fx.sound(`dawn`,.7))}},xv=e=>`${e.x},${e.y},${e.z}`,Sv=(e,t)=>`${Math.floor(e/16)},${Math.floor(t/16)}`,Cv=e=>Number.isSafeInteger(e),wv=class{constructor(e,t=256){m(this,`terrain`,void 0),m(this,`maxY`,void 0),m(this,`edits`,new Map),m(this,`changedChunks`,new Set),m(this,`revision`,0),m(this,`columns`,new Set),m(this,`renderChunks`,new Set),this.terrain=e,this.maxY=t}inBounds(e){return Cv(e.x)&&Cv(e.y)&&Cv(e.z)&&e.y>=0&&e.y<this.maxY&&e.x>=this.terrain.ox&&e.z>=this.terrain.oz&&e.x<this.terrain.ox+this.terrain.size&&e.z<this.terrain.oz+this.terrain.size}original(e){if(!this.inBounds(e))return null;let t=this.terrain,n=e.x-t.ox,r=(e.z-t.oz)*t.size+n,i=t.cell[r];if(i!==J.floor&&i!==J.ice&&i!==J.solid&&i!==J.wall&&!Eu(i))return null;let a=t.top?t.top[r]:t.elev[r];if(e.y>=a)return null;let o=Math.ceil(a)-1,s=t.tileNames[t.tile[r]];return e.y<o-3?`stone`:e.y<o?/stone|basalt|tuff|gravel|sand|clay/.test(s)?s:`dirt`:Eu(i)?`gravel`:Vd.has(s)?s:`dirt`}get(e){if(!this.inBounds(e))return null;let t=this.edits.get(xv(e));return t?t.id:this.original(e)}top(e){if(!this.get(e))return e.y;if(this.edits.has(xv(e)))return e.y+1;let t=this.terrain,n=(e.z-t.oz)*t.size+e.x-t.ox;return Math.min(e.y+1,t.top?t.top[n]:t.elev[n])}intersects(e,t){if(![e.x,e.y,e.z,t.x,t.y,t.z].every(Number.isFinite))return!0;for(let n=Math.floor(e.z);n<Math.ceil(t.z);n++)for(let r=Math.floor(e.x);r<Math.ceil(t.x);r++)for(let i=Math.max(0,Math.floor(e.y));i<Math.min(this.maxY,Math.ceil(t.y));i++){let a={x:r,y:i,z:n},o=this.get(a);if(o&&Vd.get(o)?.solid&&this.top(a)>e.y&&i<t.y)return!0}return!1}support(e,t,n){if(![e,t,n].every(Number.isFinite))return null;for(let r=Math.min(this.maxY-1,Math.floor(n));r>=0;r--){let i={x:Math.floor(e),y:r,z:Math.floor(t)},a=this.get(i);if(a&&Vd.get(a)?.solid){let e=this.top(i);if(e<=n+1e-6)return e}}return null}place(e,t){return!this.inBounds(e)||!Vd.has(t)||this.get(e)!==null||this.protectedColumn(e)?!1:(this.write(e,t),!0)}remove(e){if(!this.inBounds(e)||e.y===0||this.protectedColumn(e))return null;let t=this.get(e);return t===null?null:(this.write(e,null),t)}protectedColumn(e){let t=this.terrain,n=(e.z-t.oz)*t.size+(e.x-t.ox),r=t.cell[n];return Eu(r)||r!==J.floor&&r!==J.ice}write(e,t){this.revision++,this.columns.add(`${e.x},${e.z}`),this.renderChunks.add(`${Math.floor(e.x/32)},${Math.floor(e.z/32)}`);for(let[t,n]of[[1,0],[-1,0],[0,1],[0,-1]])this.renderChunks.add(`${Math.floor((e.x+t)/32)},${Math.floor((e.z+n)/32)}`);let n=xv(e);this.original(e)===t?this.edits.delete(n):this.edits.set(n,{...e,id:t});let r=Math.floor(e.x/16),i=Math.floor(e.z/16);this.changedChunks.add(Sv(e.x,e.z));let a=(e.x%16+16)%16,o=(e.z%16+16)%16;a===0&&this.changedChunks.add(`${r-1},${i}`),a===15&&this.changedChunks.add(`${r+1},${i}`),o===0&&this.changedChunks.add(`${r},${i-1}`),o===15&&this.changedChunks.add(`${r},${i+1}`)}takeDirtyChunks(){let e=[...this.changedChunks];return this.changedChunks.clear(),e}changedAt(e,t){return this.columns.has(`${Math.floor(e)},${Math.floor(t)}`)}floorAt(e,t,n){return this.changedAt(e,t)?this.support(e,t,n)??0:this.terrain.groundY(e,t)}canStand(e,t,n,r=.3){return!this.intersects({x:e-r,y:n+.025,z:t-r},{x:e+r,y:n+1.75,z:t+r})}serialize(){return{version:1,edits:[...this.edits.values()].map(e=>({...e}))}}load(e){if(!e||typeof e!=`object`)return!1;let t=e;if(t.version!==1||!Array.isArray(t.edits))return!1;let n=new Map;for(let e of t.edits){if(!e||!this.inBounds(e)||this.protectedColumn(e)||e.id!==null&&(typeof e.id!=`string`||!Vd.has(e.id))||n.has(xv(e)))return!1;n.set(xv(e),{x:e.x,y:e.y,z:e.z,id:e.id})}for(let e of this.edits.values())this.write(e,this.original(e));this.edits.clear();for(let e of n.values())this.write(e,e.id);return!0}};function Tv(e){return{map:Xu,terrain:e??od(),spawn:Zu,dummies:Qu}}var Ev=class{constructor(e,t,n,r){m(this,`id`,void 0),m(this,`name`,void 0),m(this,`x`,void 0),m(this,`z`,void 0),m(this,`radius`,.45),m(this,`height`,1.7),m(this,`total`,0),m(this,`hits`,0),m(this,`log`,[]),m(this,`lastHit`,-99),m(this,`wobble`,0),m(this,`wobX`,0),m(this,`wobZ`,0),this.id=e,this.name=t,this.x=n,this.z=r}dps(e){let t=e-5,n=0,r=e;for(let e of this.log)e.t>=t&&(n+=e.d,r=Math.min(r,e.t));return n<=0?0:n/Math.max(1,e-r)}},Dv=class{constructor(e,t,n,r,i=Tv()){m(this,`fx`,void 0),m(this,`raceId`,void 0),m(this,`gear`,void 0),m(this,`map`,void 0),m(this,`terrain`,void 0),m(this,`blocks`,void 0),m(this,`building`,void 0),m(this,`trees`,void 0),m(this,`events`,new hv),m(this,`dayNight`,void 0),m(this,`player`,void 0),m(this,`dummies`,void 0),m(this,`projectiles`,[]),m(this,`ctl`,{moveX:0,moveZ:0,clickMove:null,attackHeld:!1,aimX:0,aimZ:0}),m(this,`target`,null),m(this,`autoAttack`,!1),m(this,`time`,0),m(this,`stats`,void 0),m(this,`jumps`,0),this.fx=e,this.raceId=n,this.gear=r,this.map=i.map,this.terrain=i.terrain,this.blocks=new wv(this.terrain),this.trees=i.trees??null,this.dummies=i.dummies.map(e=>new Ev(e.id,e.name,e.x,e.z)),this.stats=Jg(n,r),this.player=new Bm(this,i.spawn.x,i.spawn.z),this.building=new z_(this),this.dayNight=new bv(this,t)}setGear(e){this.gear=e,this.stats=Jg(this.raceId,e),this.player.cancelAttack()}select(e,t=!1){this.target=e,this.autoAttack=!!e&&t}clickTarget(e){this.target===e?this.autoAttack=!0:this.select(e,!1)}dummyAt(e,t,n=.35){let r=null,i=1e9;for(let a of this.dummies){let o=Math.hypot(a.x-e,a.z-t)-a.radius;o<n&&o<i&&(i=o,r=a)}return r}update(e){this.time+=e,this.target&&!this.dummies.includes(this.target)&&this.select(null),this.dayNight.update(),this.player.update(e),this.building.update(e),this.updateProjectiles(e);for(let t of this.dummies){for(t.wobble=Math.max(0,t.wobble-e*2.2);t.log.length&&t.log[0].t<this.time-6;)t.log.shift();t.total>0&&this.time-t.lastHit>10&&(t.total=0,t.hits=0)}}damage(e,t,n,r,i){let a=Math.round(t);e.total+=a,e.hits++,e.lastHit=this.time,e.log.push({t:this.time,d:a}),e.wobble=1;let o=Math.hypot(e.x-r,e.z-i)||1;e.wobX=(e.x-r)/o,e.wobZ=(e.z-i)/o,this.fx.number(e.x,e.z,a,!1,n?13143295:16777215),this.fx.burst(e.x,1.1,e.z,n?11563263:14205040,n?10:7,2.4,.12,.4,n?`glow`:`debris`),this.fx.sound(n?`magic`:`hit`,.6),this.events.emit(`hit`,{dummy:e,damage:a})}resolveAttack(e,t,n,r){let i=this.player,a=this.stats.range,o=e?.shape??`melee`,s=e?.dmgType===`magic`;if(o===`projectile`&&e){this.spawnProjectile(e,t,n,r);return}if(o===`sweep`&&e){let o=e.halfWidth??.9,s=0;for(let e of this.dummies){let c=e.x-i.x,l=e.z-i.z,u=c*n+l*r,d=Math.abs(c*r-l*n);u>-e.radius&&u<=a+e.radius&&d<=o+e.radius&&(this.damage(e,t,!1,i.x,i.z),s++)}this.fx.burst(i.x+n*a*.8,1.1,i.z+r*a*.8,15263984,6,3,.08,.25,`glow`),s||this.fx.sound(`thrust`,.5);return}let c=e=>Math.hypot(e.x-i.x,e.z-i.z)-e.radius<=a+.15,l=this.target&&c(this.target)?this.target:null;if(!l){let e=1e9;for(let t of this.dummies){let a=t.x-i.x,o=t.z-i.z,s=Math.hypot(a,o);!c(t)||(a*n+o*r)/(s||1)<.5||s<e&&(e=s,l=t)}}l?this.damage(l,t,s,i.x,i.z):this.fx.sound(`slash`,.4)}spawnProjectile(e,t,n,r){let i=this.player,a=e.proj??`arrow`,o=a===`arrow`,s=i.y+(o?1.28:1.25),c=i.x+n*(o?.62:.5),l=i.z+r*(o?.62:.5),u=this.target&&Math.hypot(this.target.x-i.x,this.target.z-i.z)<=e.range+1?this.target:null,d=n,f=r,p=0;if(u){let e=u.x-c,t=u.z-l,n=Math.hypot(e,t)||1;d=e/n,f=t/n,p=(this.terrain.groundY(u.x,u.z)+u.height*.6-s)/n}let m=Math.hypot(d,p,f)||1;this.projectiles.push({kind:a,x:c,y:s,z:l,dx:d/m,dy:p/m,dz:f/m,speed:e.projSpeed??20,left:e.range*1.15,damage:t,magic:e.dmgType===`magic`,target:u,dead:!1,age:0}),this.fx.sound(a===`arrow`||a===`bolt`?`bow`:`magic`,.6)}updateProjectiles(e){let t=this.projectiles;for(let n of t){if(n.dead)continue;n.age+=e;let t=n.speed*e,r=Math.max(1,Math.ceil(t/.3));for(let e=0;e<r&&!n.dead;e++){let e=t/r;n.x+=n.dx*e,n.y+=n.dy*e,n.z+=n.dz*e,n.left-=e;for(let e of this.dummies){let t=this.terrain.groundY(e.x,e.z);if(Math.hypot(n.x-e.x,n.z-e.z)<=e.radius+.12&&n.y>=t-.1&&n.y<=t+e.height+.2){this.damage(e,n.damage,n.magic,n.x-n.dx,n.z-n.dz),n.dead=!0;break}}if(n.dead)break;let i=Math.floor(n.x),a=Math.floor(n.z);(n.left<=0||n.y<this.terrain.groundY(n.x,n.z)||this.terrain.blocksShot(i,a,n.y))&&(n.dead=!0,n.magic&&this.fx.burst(n.x,n.y-this.terrain.groundY(n.x,n.z),n.z,n.kind===`orb`?6994175:16756800,6,2,.1,.3,`glow`))}n.magic&&!n.dead&&this.fx.burst(n.x,n.y-this.terrain.groundY(n.x,n.z),n.z,n.kind===`orb`?6994175:16756800,1,.3,.07,.25,`glow`)}for(let e=t.length-1;e>=0;e--)t[e].dead&&t.splice(e,1)}},Ov=class{constructor(e,t){m(this,`root`,document.createElement(`div`)),m(this,`mode`,document.createElement(`button`)),m(this,`status`,document.createElement(`div`)),m(this,`slots`,document.createElement(`div`)),m(this,`key`,``),this.root.className=`building-ui`,this.mode.className=`building-toggle`,this.mode.textContent=`⛏ Добыча / строительство · F`,this.mode.onclick=t,this.status.className=`building-status`,this.slots.className=`building-slots`,this.root.append(this.mode,this.status,this.slots),e.append(this.root)}update(e,t){if(this.root.hidden=!e||!t,!e)return;let n=e.building;this.mode.textContent=n.enabled?`✓ Режим строительства · F — выйти`:`⛏ Добыча / строительство · F`,this.status.hidden=this.slots.hidden=!n.enabled,this.status.textContent=n.message;let r=JSON.stringify([e.gear.bag,e.gear.amounts,e.gear.wear,e.gear.active]);r!==this.key&&(this.key=r,this.slots.replaceChildren(),e.gear.bag.forEach((t,r)=>{let i=Jd(t);if(!i?.block&&!i?.tool)return;let a=document.createElement(`button`);a.className=`building-slot`+(r===n.active?` active`:``),a.title=i.name,a.append(x_(t,2,28));let o=document.createElement(`span`);o.textContent=i.name;let s=document.createElement(`b`);s.textContent=i.tool?`${e.gear.wear?.[r]??250}/250`:String(I_(e.gear,r)),a.append(o,s),a.onclick=()=>n.select(r),this.slots.append(a)}))}},kv=`v6.0.0`,Av=[.75,.88,1,1.15,1.35],jv=30,Mv=class{constructor(){m(this,`target`,C)}burst(...e){this.target.burst(...e)}number(...e){this.target.number(...e)}text(...e){this.target.text(...e)}shake(e){this.target.shake(e)}light(...e){this.target.light(...e)}sound(e,t){this.target.sound(e,t)}vibrate(e){this.target.vibrate(e)}emit(...e){this.target.emit(...e)}level(){return this.target.level()}},Nv=class{constructor(e){m(this,`profile`,new l_),m(this,`version`,kv),m(this,`root`,void 0),m(this,`view`,void 0),m(this,`renderer`,void 0),m(this,`input`,void 0),m(this,`hud`,void 0),m(this,`buildingHud`,void 0),m(this,`buildSaveKey`,``),m(this,`buildSaveT`,0),m(this,`inventory`,void 0),m(this,`worldMap`,void 0),m(this,`menus`,void 0),m(this,`modals`,void 0),m(this,`toasts`,void 0),m(this,`world`,null),m(this,`runChar`,null),m(this,`postVignette`,void 0),m(this,`frameDue`,0),m(this,`paused`,!1),m(this,`mode`,`splash`),m(this,`last`,performance.now()),m(this,`charTime`,0),m(this,`firstMove`,null),m(this,`steerHeld`,!1),m(this,`steerT`,0),m(this,`autosaveT`,jv),m(this,`clock`,void 0),m(this,`terrain`,null),m(this,`wild`,null),m(this,`loading`,!1),m(this,`blockChangesValid`,!0),m(this,`channel`,null),m(this,`loop`,e=>{this.schedule();let t=this.profile.data.settings.fpsLimit;if(t>0){if(e<this.frameDue-1)return;this.frameDue=Math.max(this.frameDue+1e3/t,e)}else if(!this.profile.data.settings.vsync&&e-this.last<1)return;let n=Math.min(.1,Math.max(0,(e-this.last)/1e3));this.last=e;let r=Math.min(n,1/20),i=this.world;if(i&&this.mode===`run`){this.input.update();let e=!this.paused&&!this.modals.isOpen&&!this.inventory.isOpen&&!this.worldMap.isOpen;this.readMouse(i,e,n),i.ctl.moveX=i.ctl.moveZ=0;let t=e;if(t){this.clock.advance(n);let e=Math.max(1,Math.ceil(r/(1/60)));for(let t=0;t<e;t++)i.update(r/e);this.autosaveT-=r,this.autosaveT<=0&&(this.autosaveT=jv,this.saveChar()),this.buildSaveT+=r;let t=`${i.blocks.revision}:${i.building.revision}`;t!==this.buildSaveKey&&this.buildSaveT>.5&&(this.buildSaveT=0,this.saveChar()?this.buildSaveKey=t:this.toast(`Не удалось сохранить: проверьте доступное место в браузере`,`#ffb088`))}this.renderer.frame(t?r:0);let a=this.currentChar();this.hud.update(i,n,a?.name??``,a?.level??1),this.worldMap.draw(i),this.buildingHud.update(i,!this.paused&&!this.inventory.isOpen&&!this.worldMap.isOpen),Fg.setAmbience(!this.paused,.5,0,i.dayNight.period===`night`,n)}else this.buildingHud.update(null,!1),Fg.setAmbience(!1,0,0,!1,n),this.renderer.frame(n)}),l(),this.root=e,e.classList.add(`app`);let t=this.profile.data.settings;m_(t.lang),this.clock=S.fromSave(this.profile.data.clock),this.view=Q(`div.view`),e.appendChild(this.view),this.renderer=new Tg(this.view,t),this.postVignette=Q(`div.post-vignette.hidden`),this.view.appendChild(this.postVignette),this.input=new Eg(this.view,t.keybinds),this.input.onPause=()=>this.handleEscape(),this.input.onZoom=e=>this.world?.building.enabled?this.world.building.cycle(e):this.stepZoom(e),this.input.onBuild=()=>this.toggleBuilding(),this.input.onJump=()=>{this.world&&this.mode===`run`&&!this.paused&&this.world.player.requestJump()},this.input.onInventory=()=>this.toggleInventory(),this.input.onMap=()=>this.toggleMap(),this.hud=new M_(e),this.buildingHud=new Ov(e,()=>this.toggleBuilding()),this.hud.minimap.yaw=this.renderer.rig.yaw,this.hud.setVisible(!1),this.hud.onInventory=()=>this.toggleInventory(),this.hud.onClearTarget=()=>this.world?.select(null),this.inventory=new H_(e),this.inventory.onSfx=e=>this.sfx(e),this.inventory.onClose=()=>this.toggleInventory(!1),this.inventory.onChange=e=>this.setGear(e),this.worldMap=new U_(e),this.worldMap.yaw=this.renderer.rig.yaw,this.worldMap.onClose=()=>this.toggleMap(!1),this.menus=new pv(e,this),this.menus.setVisible(!1),this.modals=new mv(e,this),this.toasts=Q(`div.toasts`),e.appendChild(this.toasts),this.applySettings(),document.addEventListener(`visibilitychange`,()=>{document.hidden?(this.autoPause(),this.saveChar(),Fg.suspend(!0)):Fg.suspend(!1)}),window.addEventListener(`blur`,()=>this.autoPause()),window.addEventListener(`pagehide`,()=>this.saveChar()),document.addEventListener(`fullscreenchange`,()=>{!document.fullscreenElement&&t.displayMode!==`windowed`&&(t.displayMode=`windowed`,this.profile.saveSoon())}),this.showMenuBackdrop(),this.splash(),this.schedule()}sfx(e){Fg.play(e)}setMenuShift(e){this.renderer.menuShift=e}applySettings(){let e=this.profile.data.settings;Fg.setVolumes(e.master,e.sfx,e.music,e.ui,e.ambient),this.input.swapMouse=e.swapMouse,this.input.invertWheel=e.invertWheel,this.root.style.setProperty(`--ui-scale`,String(e.uiScale));let t=e.effects!==this.renderer.currentQuality;this.renderer.applySettings(e),t&&this.mode===`menu`&&this.showMenuBackdrop(),this.renderer.setZoom(e.cameraZoom),this.hud.setOptions({fps:e.showFps}),this.postVignette.classList.toggle(`hidden`,!e.postProcessing),this.input.binds=e.keybinds,this.applyDisplayMode()}resetSettings(){this.profile.data.settings=n_(),m_(this.profile.data.settings.lang),this.profile.save(),this.applySettings(),this.mode===`menu`&&this.menus.render()}applyDisplayMode(){let e=this.profile.data.settings.displayMode!==`windowed`;try{e&&!document.fullscreenElement?document.documentElement.requestFullscreen?.({navigationUI:`hide`}).catch(()=>{}):!e&&document.fullscreenElement&&document.exitFullscreen?.().catch(()=>{})}catch{}}captureKey(e){this.input.capture=e}needsRestart(){return this.renderer.msaa!==(this.profile.data.settings.antiAliasing!==`off`)}stepZoom(e){let t=this.profile.data.settings,n=0;for(let e=0;e<Av.length;e++)Math.abs(Av[e]-t.cameraZoom)<Math.abs(Av[n]-t.cameraZoom)&&(n=e);let r=Av[Math.max(0,Math.min(Av.length-1,n+e))];r!==t.cameraZoom&&(t.cameraZoom=r,this.renderer.setZoom(r),this.profile.saveSoon())}autoPause(){this.profile.data.settings.autoPause&&this.mode===`run`&&!this.paused&&this.togglePause()}handleEscape(){let e=this.root.querySelector(`.modal-back.confirm`);if(e)e.remove();else if(this.mode===`run`){if(this.paused&&this.modals.escape())return;if(this.inventory.isOpen){this.toggleInventory(!1);return}if(this.worldMap.isOpen){this.toggleMap(!1);return}if(this.world?.building.enabled){this.toggleBuilding();return}this.togglePause()}else this.mode===`menu`&&this.menus.canGoBack&&this.menus.back()}toggleBuilding(){this.mode!==`run`||!this.world||this.paused||this.inventory.isOpen||this.worldMap.isOpen||!this.blockChangesValid||(this.world.building.toggle(),this.steerHeld=!1,this.input.setEnabled(!1),this.input.setEnabled(!0))}toggleInventory(e){let t=this.world;if(!t||this.mode!==`run`||this.paused)return;let n=e??!this.inventory.isOpen;if(n===this.inventory.isOpen)return;let r=this.currentChar();n&&r?(this.worldMap.close(),this.inventory.open(Rg(t.gear),t.raceId,r.name)):this.inventory.close(),this.sfx(`ui`)}toggleMap(e){let t=this.world;if(!t||this.mode!==`run`||this.paused)return;let n=e??!this.worldMap.isOpen;n!==this.worldMap.isOpen&&(n?(this.inventory.close(),this.worldMap.open(t)):this.worldMap.close(),this.sfx(`ui`))}setGear(e){let t=this.world,n=this.currentChar();t&&n&&(t.setGear(Rg(e)),n.gear=Rg(e),this.profile.saveSoon())}currentChar(){return this.runChar?this.profile.data.chars.find(e=>e.id===this.runChar)??null:null}splash(){this.mode=`splash`;let e=Q(`div.splash`,Q(`div.logo`,Q(`div.logo-cubes`,Q(`i`),Q(`i`),Q(`i`)),Q(`div.logo-title`,`CUBEBORN`),Q(`div.logo-sub`,__(`game_subtitle`))),Q(`div.tap`,__(`tap_to_start`)),Q(`div.splash-foot`,__(`splash_note`))),t=()=>{this.mode===`splash`&&(Fg.unlock(),Fg.play(`select`),e.classList.add(`out`),setTimeout(()=>e.remove(),450),this.toMenu())};e.addEventListener(`pointerup`,t,{once:!0}),window.addEventListener(`keydown`,e=>{this.mode===`splash`&&(e.key===`Enter`||e.key===` `)&&t()}),this.root.appendChild(e)}testTerrain(){return this.terrain??(this.terrain=od())}showMenuBackdrop(){this.renderer.showMenu(Xu,this.testTerrain(),Zu.x,Zu.z+3)}toMenu(){this.mode=`menu`,this.input.setEnabled(!1),this.hud.setVisible(!1),this.inventory.close(),this.worldMap.close(),this.modals.close(),this.menus.setVisible(!0),this.menus.home(),Fg.playMusic(`menu`)}play(e){let t=this.profile,n=t.data.chars.find(t=>t.id===e);if(!n||this.loading)return;if(!this.wild){this.loading=!0,this.menus.setVisible(!1);let t=Q(`div.world-loading`,Q(`div.logo-cubes`,Q(`i`),Q(`i`),Q(`i`)),Q(`b`,`Создание мира…`),Q(`span`,`Горы, реки, леса и климат Диких земель`));this.root.appendChild(t),setTimeout(()=>{try{this.wild=hf()}finally{t.remove(),this.loading=!1}this.play(e)},60);return}t.selectChar(n.id),this.menus.setVisible(!1),this.modals.close(),this.renderer.endRun();let r=new Mv,i=t.data.settings,a=new Dv(r,this.clock,n.race,Rg(n.gear),this.wild);if(this.blockChangesValid=n.blockChanges===void 0||a.blocks.load(n.blockChanges),this.blockChangesValid||this.toast(`Изменения мира повреждены: сохранённые данные оставлены без изменений`,`#ffb0a0`),a.building.loadDrops(n.blockDrops),!n.buildingStarted){for(let e of[`tool:pickaxe`,`tool:axe`,`tool:shovel`,`tool:hoe`])L_(a.gear,e,1);n.buildingStarted=!0,a.gear.active=a.gear.bag.indexOf(`tool:pickaxe`)}let o=n.position;o&&o.x>=1&&o.z>=1&&o.x<a.terrain.size-1&&o.z<a.terrain.size-1&&o.y>=0&&o.y<256&&a.blocks.canStand(o.x,o.z,o.y)&&(a.player.x=o.x,a.player.y=o.y,a.player.z=o.z),this.buildSaveKey=``,this.buildSaveT=0,this.world=a,this.runChar=n.id,this.charTime=0,this.autosaveT=jv,r.target=this.renderer.startRun(a,{sound:(e,t)=>Fg.play(e,t),vibrate:()=>{}}),this.renderer.setZoom(i.cameraZoom),this.paused=!1,this.hud.reset(),this.hud.setVisible(!0),this.input.setEnabled(!0),this.mode=`run`,a.events.on(`banner`,e=>this.hud.showBanner(__(e),e===`dn_dawn`?`#ffd08a`:`#9ab8ff`)),Fg.playMusic(`forest`),this.hud.showBanner(v_(a.map.name),`#ffffff`,2.2,`${n.name} · Уровень ${n.level}`),this.hud.showHint(i.showHints&&n.playTime<60),this.firstMove=i.showHints?()=>setTimeout(()=>this.hud.showHint(!1),6e3):null,this.saveChar()}saveChar(){let e=this.world,t=this.currentChar();return!e||!t?!1:(this.blockChangesValid&&(t.blockChanges=e.blocks.serialize()),t.blockDrops=e.building.drops.map(e=>({...e})),t.position={x:e.player.x,y:e.player.y,z:e.player.z},t.gear=Rg(e.gear),t.playTime+=Math.round(e.time-this.charTime),this.charTime=Math.round(e.time),t.lastPlayed=Date.now(),this.profile.data.clock=this.clock.toSave(),this.profile.save())}togglePause(){let e=this.world;this.mode===`run`&&e&&(this.paused?(this.paused=!1,this.modals.close(),this.input.setEnabled(!0),Fg.play(`ui`)):(this.paused=!0,this.inventory.close(),this.worldMap.close(),this.input.setEnabled(!1),Fg.play(`ui`),this.modals.pause(e,{resume:()=>this.togglePause(),save:()=>this.saveChar(),exit:()=>this.exitToMenu()})))}exitToMenu(){this.saveChar(),this.paused=!1,this.inventory.close(),this.worldMap.close(),this.renderer.endRun(),this.world=null,this.runChar=null,this.showMenuBackdrop(),this.toMenu()}toast(e,t=`#ffffff`){let n=Q(`div.toast`,{style:`--tc:${t}`},e);this.toasts.appendChild(n),setTimeout(()=>n.classList.add(`out`),2600),setTimeout(()=>n.remove(),3100)}schedule(){this.profile.data.settings.vsync||document.hidden?requestAnimationFrame(this.loop):(this.channel||(this.channel=new MessageChannel,this.channel.port1.onmessage=()=>this.loop(performance.now())),this.channel.port2.postMessage(0))}readMouse(e,t,n){let r=this.input,i=e.ctl,a=this.renderer.rig,o=this.view.clientWidth||1,s=this.view.clientHeight||1;if(e.building.enabled){if(i.attackHeld=!1,i.clickMove=null,this.steerHeld=!1,t){let t=r.mx>=0?this.renderer.pickBlock(r.mx,r.my,o,s):null;e.building.input(t,r.lmb,r.rmbPressed,n)}else e.building.cancel();r.rmbPressed=r.lmbPressed=!1,r.dragX=r.dragY=0;return}let c=null,l=null;if(r.mx>=0){l=a.terrainPoint(r.mx,r.my,o,s,(t,n)=>e.terrain.groundY(t,n),0),l&&(i.aimX=l[0],i.aimZ=l[1]);for(let t of[1.2,.7,.2]){let n=a.terrainPoint(r.mx,r.my,o,s,(t,n)=>e.terrain.groundY(t,n),t);if(n&&(c=e.dummyAt(n[0],n[1],.3)),c)break}}if(u(c?`attack`:`default`),(r.dragX||r.dragY)&&(t&&a.orbit(-r.dragX*.006,r.dragY*.004),r.dragX=r.dragY=0),r.rmbPressed=!1,this.hud.minimap.yaw=a.yaw,this.worldMap.yaw=a.yaw,!t)r.lmbPressed=!1,this.steerHeld=!1,i.attackHeld=!1,i.moveX=i.moveZ=0;else{if(r.lmbPressed){if(r.lmbPressed=!1,this.steerHeld=!1,c)e.clickTarget(c);else if(l&&(i.clickMove={x:l[0],z:l[1]},this.steerHeld=!0,this.steerT=.25,this.renderer.markMove(l[0],l[1]),this.firstMove)){let e=this.firstMove;this.firstMove=null,e()}}else this.steerHeld&&r.lmb&&l&&(this.steerT-=n,this.steerT<=0&&(this.steerT=.2,i.clickMove={x:l[0],z:l[1]},this.renderer.markMove(l[0],l[1])));r.lmb||(this.steerHeld=!1),i.attackHeld=r.held(`attack`),r.held(`attack`)&&e.target&&(e.autoAttack=!0)}}};document.addEventListener(`gesturestart`,e=>e.preventDefault()),document.addEventListener(`contextmenu`,e=>e.preventDefault()),document.addEventListener(`dblclick`,e=>e.preventDefault());var Pv=document.getElementById(`app`);try{window.app=new Nv(Pv)}catch(e){console.error(e),Pv.innerHTML=`<div class="fatal">Не удалось запустить игру / Failed to start.<br><small>${String(e?.message??e)}</small></div>`}