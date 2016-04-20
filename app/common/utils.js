var utils = {
	each: function(cb) {
		return function(arr) {
			for(var i = 0, ii = arr.length; i < ii; i++) {
				cb.call(null, arr[i], i);
			}
			return arr;
		}
	},

	map: function(cb) {
		return function(arr) {
			for(var i = 0, ii = arr.length; i < ii; i++) {
				arr[i] = cb.call(null, arr[i], i);
			}
			return arr;
		}
	},

	filter: function(cb) {
		return function(arr) {
			var result = [];

			for(var i = 0, ii = arr.length; i < ii; i++) {
				if(cb.call(null, arr[i], i)) {
					result.push(arr[i]);
				}
			}
			return result;
		}
	}
}

module.exports = utils;