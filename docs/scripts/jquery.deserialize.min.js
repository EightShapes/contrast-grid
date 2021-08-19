/**
 * Copyright (C) 2017 Kyle Florence
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.3.7
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
!function(a){"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a(window.jQuery)}(function(a){function g(b,c){return b.map(function(){return this.elements?a.makeArray(this.elements):this}).filter(c||":input:not(:disabled)").get()}function h(b){var c,d={};return a.each(b,function(a,b){c=d[b.name],void 0===c&&(d[b.name]=[]),d[b.name].push(b)}),d}var b=Array.prototype.push,c=/^(?:radio|checkbox)$/i,d=/\+/g,e=/^(?:option|select-one|select-multiple)$/i,f=/^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;a.fn.deserialize=function(i,j){var k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A=a.noop,B=a.noop,C={},D=[];if(j=j||{},a.isFunction(j)?B=j:(A=a.isFunction(j.change)?j.change:A,B=a.isFunction(j.complete)?j.complete:B),m=g(this,j.filter),!i||!m.length)return this;if(a.isArray(i))D=i;else if(a.isPlainObject(i))for(r in i)a.isArray(z=i[r])?b.apply(D,a.map(z,function(a){return{name:r,value:a}})):b.call(D,{name:r,value:z});else if("string"==typeof i){var E;for(i=i.split("&"),o=0,t=i.length;o<t;o++)E=i[o].split("="),b.call(D,{name:decodeURIComponent(E[0].replace(d,"%20")),value:decodeURIComponent(E[1].replace(d,"%20"))})}if(!(t=D.length))return this;for(m=h(m),o=0;o<t;o++)if(k=D[o],u=k.name,z=k.value,n=m[u],n&&0!==n.length)if(void 0===C[u]&&(C[u]=0),v=C[u]++,n[v]&&(l=n[v],y=(l.type||l.nodeName).toLowerCase(),f.test(y)))A.call(l,l.value=z);else for(p=0,s=n.length;p<s;p++)if(l=n[p],y=(l.type||l.nodeName).toLowerCase(),x=null,c.test(y)?x="checked":e.test(y)&&(x="selected"),x){if(w=[],l.options)for(q=0;q<l.options.length;q++)w.push(l.options[q]);else w.push(l);for(q=0;q<w.length;q++)k=w[q],k.value==z&&A.call(k,(k[x]=!0)&&z)}return B.call(this),this}});
