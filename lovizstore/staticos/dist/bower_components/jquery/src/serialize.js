define(["./core","./manipulation/var/rcheckableType","./core/init","./traversing","./attributes/prop"],function(e,t){function o(t,r,i,s){var u;if(e.isArray(r))e.each(r,function(e,r){i||n.test(t)?s(t,r):o(t+"["+(typeof r=="object"&&r!=null?e:"")+"]",r,i,s)});else if(!i&&e.type(r)==="object")for(u in r)o(t+"["+u+"]",r[u],i,s);else s(t,r)}var n=/\[\]$/,r=/\r?\n/g,i=/^(?:submit|button|image|reset|file)$/i,s=/^(?:input|select|textarea|keygen)/i;return e.param=function(t,n){var r,i=[],s=function(t,n){var r=e.isFunction(n)?n():n;i[i.length]=encodeURIComponent(t)+"="+encodeURIComponent(r==null?"":r)};if(e.isArray(t)||t.jquery&&!e.isPlainObject(t))e.each(t,function(){s(this.name,this.value)});else for(r in t)o(r,t[r],n,s);return i.join("&")},e.fn.extend({serialize:function(){return e.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var t=e.prop(this,"elements");return t?e.makeArray(t):this}).filter(function(){var n=this.type;return this.name&&!e(this).is(":disabled")&&s.test(this.nodeName)&&!i.test(n)&&(this.checked||!t.test(n))}).map(function(t,n){var i=e(this).val();return i==null?null:e.isArray(i)?e.map(i,function(e){return{name:n.name,value:e.replace(r,"\r\n")}}):{name:n.name,value:i.replace(r,"\r\n")}}).get()}}),e});