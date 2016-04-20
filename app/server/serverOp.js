var Game = require('./Game'),
	Gamer = require('./Gamer'),
	Pokers = require('./Pokers'),
	utils = require('../common/utils'),
	state = require('../common/state');

var game = new Game({});

var serverOp = {
	//玩家结束要牌
	stand: function(socket, io) {
		socket.on('stand', function(data) {
			utils.map(function(x, i) {
				if(x.id == data) {
					x.state = state.END;
					game.setCurrentGamer(i + 1);

					var gamer = game.getGamer(game.currentGamer);

					game.state != state.END && gamer[0].setState(state.PLAYING);
				} 
				return x;
			})(game.gamers);

			io.emit('send Poker', game);
			game.state == state.END && game.restart({});
		});
	},

	//玩家要牌
	hint: function(socket, io) {
		socket.on('hint', function(data) {
			utils.map(function(x, i) {
				if(x.id == data) {
					x.addPoker(1, game);
					x.totalNumber = Pokers.calTotalNumber(x.pokers);
					x.totalNumber > 21 && x.setState(state.BUST);
					x.state == state.READY && x.setState(state.QUEUING);

					if(x.state == state.BUST) {
						game.setCurrentGamer(i + 1);
						var gamer = game.getGamer(game.currentGamer);
						game.state != state.END && gamer[0].setState(state.PLAYING);
					}
				} 
				return x;
			})(game.gamers);

			io.emit('send Poker', game);
			game.state == state.END && game.restart({});
		});
	},

	//判断是否所有用户都已准备好
	allReady: function(io) {
		var result = utils.filter(function(x) {
			return x.state == state.READY;
		})(game.gamers);

		if(result.length　>　0 &&　result.length == game.gamers.length) {
			game.allAddPoker();
			game.setCurrentGamer(0);
			game.setState(state.PLAYING);
			game.gamers[0].setState(state.PLAYING);

			io.emit('send Poker', game);
		}
	},

	//玩家准备游戏
	ready: function(socket, io) {
		socket.on('ready', function(data) {
			var id = data;

			utils.map(function(x) {
				if(x.id == id) {
					x.state = state.READY;
				}
				return x;
			})(game.gamers);

			utils.map(function(x) {
				if(x.id == id) {
					x.state = state.READY;
				}
				return x;
			})(game.others);

			this.allReady(io);
		}.bind(this));
	},

	//玩家退出或刷新
	disconnect: function(socket, io) {
		socket.on('disconnect', function() {
			if(game.state == state.PLAYING) {
				utils.each(function(x, i) {
					if(x.id == socket.id && x.state == state.PLAYING) {
						game.setCurrentGamer(i + 1);

						var gamer = game.getGamer(game.currentGamer);

						game.state != state.END && gamer[0].setState(state.PLAYING);
						x.state = state.LEAVE;

						io.emit('send Poker', game);
					} else if(x.id == socket.id) {
						x.state = state.LEAVE;
						io.emit('send Poker', game);
					}
				})(game.gamers);

				if(game.state == state.END) {
					game.restart({});
				}
			} else {
				game.gamers = utils.filter(function(x) {
					return x.id != socket.id;
				})(game.gamers);

				this.allReady(io);
			}		
			game.others = utils.filter(function(x) {
				return x.id != socket.id;
			})(game.others);

			//所有玩家退出，重置游戏
			game.gamers.length == 0 && game.restart({});
		}.bind(this));
	},

	//玩家登入
	connection: function(io) {
		io.on('connection', function(socket) {
			var gamer;

			if(game.state == state.WATING) {
				gamer = game.join(socket, game.gamers);

				socket.emit('connection', gamer);
				io.emit('new Gamer', game);
			} else {
				gamer = game.join(socket, game.others);
				socket.emit('not Start', gamer);
			}

			this.ready(socket, io);
			this.disconnect(socket, io);
			this.hint(socket, io);
			this.stand(socket, io);
		}.bind(this));
	},

	//初始化
	init: function(io) {
		this.connection(io);
	}
}

module.exports = serverOp;
