var dom = require('./lib/dom'),
	utils = require('../../common/utils'),
	state = require('../../common/state');

var clientOp = {

	//玩家登入
	connection: function(socket) {
		socket.on('connection', function(g) {
			this.gamer = g;
		}.bind(this));
	},

	//当前玩家没在游戏中
	notStart: function(socket) {
		socket.on('not Start', function(g) {
			this.gamer = g;
		}.bind(this));
	},

	//其他玩家登入
	newGamer: function(socket) {
		socket.on('new Gamer', function(game) {
		
		}.bind(this));
	},

	//获取牌
	sendPoker: function(socket) {
		socket.on('send Poker', function(game) {
			var pokers = '',
				mypoker = '',
				self = this;

			utils.each(function(x, i) {
				if(self.gamer.id == x.id) {
					mypoker += '<div class="player clearfix">';
					if(game.currentGamer == x.id) {
						mypoker += '<div class="fl current-gamer">玩家'+ (i + 1) +':</div>';
					} else {
						mypoker += '<div class="fl">玩家'+ (i + 1) +':</div>';
					}
					mypoker += '<ul class="clearfix">';
				} else {
					pokers += '<div class="player clearfix">';
					if(game.currentGamer == x.id) {
						pokers += '<div class="fl current-gamer">玩家'+ (i + 1) +':</div>';
					} else {
						pokers += '<div class="fl">玩家'+ (i + 1) +':</div>';
					}
					pokers += '<ul class="clearfix">';	
				}

				utils.each(function(y, j) {
					if(self.gamer.id == x.id) {
						mypoker += '<li class="fl poker '+ y.color + '-' + y.number +'-poker"></li>';
					} else if(game.winner.length > 0 || game.state == state.END) {
						pokers += '<li class="fl poker '+ y.color + '-' + y.number +'-poker"></li>';
					} else if(j < 1) {
						pokers += '<li class="fl poker '+ y.color + '-' + y.number +'-poker"></li>';
					} else {
						pokers += '<li class="fl poker poker-back"></li>';
					}
				})(x.pokers);
				
				if(self.gamer.id == x.id) {
					if(x.state == state.BUST) {
						mypoker += '<li class="fl bust"></li>';
					}

					mypoker += '</ul>';
				} else {
					if(x.state == state.BUST) {
						pokers += '<li class="fl bust"></li>';
					} else if(x.state == state.LEAVE) {
						pokers += '<h2 id="warning">已离开</h2>';
					}
					pokers += '</ul>';
				}
			
				if(game.currentGamer == self.gamer.id && game.currentGamer == x.id) {
					mypoker += '<div class="btns"><div id="hint" class="btn">要牌</div><div id="stand" class="btn">结束</div><div>';
				}
				if(self.gamer.id == x.id) {
					mypoker += '</div>';
				} else {
					pokers += '</div>';
				}
			})(game.gamers);

			if(game.state == state.END) {
				var winner = '赢家是';

				if(game.winner.length > 0) {
					utils.each(function(x, i) {
						utils.each(function(y, j) {
							if(x.id == y.id) {
								winner += '玩家' + (i + 1) + ' ';
							}
						})(game.winner);
					})(game.gamers);

					dom.$('winner').innerText = winner;
				} else {
					dom.$('winner').innerText = winner + 'nobody';
				}

				dom.$('result').style.display = 'block';
				dom.$('nextGame').innerText = '再来一局';
			} else {
				dom.$('result').style.display = 'none';
			}
			mypoker == '' ? mypoker = '<h2>正在观战</h2>' : mypoker;
			dom.$('myPoker').innerHTML = mypoker;
			dom.$('pokers').innerHTML = pokers;
			dom.$('wapper').style.display = 'none';
		}.bind(this));
	},

	//初始化
	init: function(socket) {
		this.gamer = {};

		this.connection(socket);
		this.notStart(socket);
		this.newGamer(socket);
		this.sendPoker(socket);
	}
}

module.exports = clientOp;
