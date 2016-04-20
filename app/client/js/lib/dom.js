var dom = {

	//封装getElementById方法
	$: function(id) {
		return document.getElementById(id);
	},
	
	//封装绑定事件方法
	addEvent: (function() {
        if (document.addEventListener) {
          	return function(el, type, fn) {
            	el.addEventListener(type, fn, false);
          	};
        } else {
          	return function(el, type, fn) {
	            el.attachEvent('on' + type, function () {
	              return fn.call(el, window.event);
	            });
          	}
        }
    })()
};

module.exports = dom;