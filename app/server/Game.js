var Gamer = require('./Gamer'),
	Pokers = require('./Pokers'),
	utils = require('../common/utils'),
	state = require('../common/state');

var Game = function(o) {
	this.gamers = o.gamers || [];
	this.others = o.others || [];
	this.currentGamer = o.currentGamer || 0;
	this.winner = o.winner || [];
	this.state = o.state || state.WATING;
	this.pokers = o.pokers || new Pokers().init();
};

Game.prototype = {

	//新建玩家，并加入Gamers
	join: function(socket, gamers) {
		var gamer = new Gamer({
			id: socket.id
		});

		gamers.push(gamer);

		return gamer;
	},

	//为每个玩家分配两张牌
	allAddPoker: function() {
		utils.map(function(x) {
			x.addPoker(2, this);
			x.totalNumber = Pokers.calTotalNumber(x.pokers);

			x.totalNumber > 21 && x.setState(state.BUST);
			x.state == state.READY && x.setState(state.QUEUING);

			return x;
		}.bind(this))(this.gamers);
	},

	//结束
	over: function() {
		utils.each(function(x) {
			if(x.state == state.END) {
				if(this.winner.length == 0) {
					this.winner.push(x);
				} else if(x.totalNumber > this.winner[0].totalNumber) {
					this.winner = [];
					this.winner.push(x);
				} else if(x.totalNumber == this.winner[0].totalNumber) {
					this.winner.push(x);
				}
			}
		}.bind(this))(this.gamers);
	},

	//重新开始
	restart: function(o) {
		this.gamers = utils.filter(function(x) {
			return x.state != state.LEAVE;
		})(this.gamers);

		utils.each(function(x, i) {
			x.restart({});
		})(this.gamers);
		
		this.gamers = this.gamers.concat(this.others);
		this.others = o.others || [];
		this.currentGamer = o.currentGamer || 0;
		this.winner = o.winner || [];
		this.state = o.state || state.WATING;
		this.pokers = o.pokers || new Pokers().init();
	},

	//设置当前玩家id
	setCurrentGamer: function(index) {
		if(index < this.gamers.length) {
			var arr = this.gamers.slice(index, this.gamers.length);
			var	arr1 = utils.filter(function(x, i) {
					return x.state == state.QUEUING
				})(arr);

			if(arr1.length > 0) {
				this.currentGamer = arr1[0].id;
			} else {
				this.state = state.END;
				this.currentGamer = '';
				this.over();
			}
		} else {
			this.state = state.END;
			this.currentGamer = '';
			this.over();
		}
	},

	//设置游戏状态
	setState: function(state) {
		this.state = state;
	},

	//根据玩家id返回玩家对象
	getGamer: function(id) {
		var result = utils.filter(function(x) {
			return x.id == id;
		})(this.gamers);
		return result;
	}
};

module.exports = Game;