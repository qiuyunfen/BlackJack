var dom = require('./lib/dom');

//玩家准备
function readyClick(socket, clientOp, id) {
	socket.emit('ready', clientOp.gamer.id);

	dom.$(id).disabled = true;
	dom.$(id).innerHTML = '请等待';
	if(id == 'nextGame') {
		dom.$('winner').innerText = '';
		dom.$('pokers').innerHTML = '';
		dom.$('myPoker').innerHTML = '';
	}
}

//玩家要牌
function hintClick(socket, clientOp) {
	socket.emit('hint', clientOp.gamer.id);
}

//玩家结束要牌
function standClick(socket, clientOp) {
	socket.emit('stand', clientOp.gamer.id);
}

//事件委托
exports.init = function(socket, clientOp) {
	dom.addEvent(dom.$('content'), 'click', function(e) {
		var ev = e || window.event,
			target = e.target || e.srcElement,
			id = target.getAttribute('id');

		if(id == 'ready') {
			readyClick(socket, clientOp, id);
		} else if(id == 'nextGame') {
			readyClick(socket, clientOp, id);
		} else if(id == 'hint') {
			hintClick(socket, clientOp);
		} else if(id == 'stand') {
			standClick(socket, clientOp);
		}
	});
};
