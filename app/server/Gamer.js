var state = require('../common/state'),
	utils = require('../common/utils');

var Gamer = function(o) {
	this.id = o.id || '0';
	this.pokers = o.pokers || [];
	this.totalNumber = o.totalNumber || 0;
	this.state = o.state || state.WATING;
};

Gamer.prototype = {

	//为玩家分牌
	addPoker: function(num, game) {
		this.pokers = this.pokers.concat(game.pokers.get(num));
	},

	//设置玩家状态
	setState: function(state) {
		this.state = state;
	},

	//重置gamer对象
	restart: function(o) {
		this.pokers = o.pokers || [];
		this.totalNumber = o.totalNumber || 0;
		this.state = o.state || '';
	}
};

module.exports = Gamer;