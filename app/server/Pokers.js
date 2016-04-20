var Poker = require('./Poker'),
	utils = require('../common/utils');

var Pokers = function() {
	this.pokers = [];
};

//计算点数
Pokers.calTotalNumber = function(pokers) {
	var count = 0,
		totalNumber = 0;

	utils.each(function(x, i) {			
		if(isNaN(x.number)) {
			totalNumber += 10;
		} else {
			if(x.number == '1'){
				if(totalNumber + 11 <= 21) {
					totalNumber += 11;
					count++;
				} else {
					totalNumber += 1;
				}
			} else {
				totalNumber += (+x.number);
			}
		}
	})(pokers);

	while(totalNumber > 21) {
		if(count > 0) {
			count--;
			totalNumber -= 10;
		} else {
			break;
		}
	}
	return totalNumber;
};

Pokers.prototype = {

	//生成牌
	create: function() {
		var colors = ['spade', 'heart', 'diamond', 'club'],//黑桃,红桃,方块,梅花
			numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
			self = this;
		
		utils.each(function(x, i) {
			utils.each(function(y, j) {
				var poker = new Poker({color: y, number: x});
				self.pokers.push(poker);
			})(colors);
		})(numbers);
	},

	//洗牌
	sortCards: function(arr) {
		arr.sort(function (a, b) {
            return 0.5 - Math.random();
        })
        return arr;
	},

	//初始化
	init: function() {
		this.create();
		this.pokers = this.sortCards(this.pokers);
		//this.pokers = [{color:'red',number:1}, {color:'red',number:1}, {color:'red',number:1}, {color:'red',number:1}];
		return this;
	},

	//获取num张牌
	get: function(num) {
		return this.pokers.splice(0, num);
	}
};

module.exports = Pokers;