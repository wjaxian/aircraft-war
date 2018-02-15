window.onload = function() {
	oGame.init();
};

var oGame = {

	"gameWrap": document.getElementById("game_wrap"),

	//整个游戏的初始化
	"init": function() {
		var otitle = oGame.createDom("h3");
		otitle.className = "title";
		otitle.innerHTML = "飞机大战游戏";
		oGame.gameWrap.appendChild(otitle);

		var btns = ["简单", "一般", "困难"];
		var imgName = ['3.jpg', "5.jpg", "8.jpg"];
		var i = 0;
		var oBtn = null;

		for (; i < btns.length; i++) {
			oBtn = oGame.createDom("button");
			oBtn.className = "btn";
			oBtn.innerHTML = btns[i];
			oGame.gameWrap.appendChild(oBtn);
		};

		var btnArr = oGame.$(".btn");

		//简单难度控制
		btnArr[0].enemyspeed = 1000;
		btnArr[0].bulletspeed = 200;
		btnArr[0].downspeed = 3;
		btnArr[0].missnum = 1;

		//一般难度控制
		btnArr[1].enemyspeed = 800;
		btnArr[1].bulletspeed = 200;
		btnArr[1].downspeed = 4;
		btnArr[1].missnum = 3;

		//困难难度控制
		btnArr[2].enemyspeed = 600;
		btnArr[2].bulletspeed = 150;
		btnArr[2].downspeed = 5;
		btnArr[2].missnum = 5;

		for (var j = 0; j < btns.length; j++) {

			//(function(j){
			btnArr[j].index = j;
			btnArr[j].onclick = function(event) {
				var ev = event || window.event;
				//console.log(this.index)
				oGame.startGame(ev, imgName[this.index], this.enemyspeed, this.bulletspeed, this.downspeed, this.missnum);
				//计算分数
				oGame.score();
				//当前miss次数
				oGame.amount = 0;
				//初始化miss次数
				oGame.missnumber(this.missnum);
			};
			//})(j);
		};

	},

	/*
		enemyspeed:  敌机生成速度
		bulletspeed：子弹生成速度
		downspeed:   敌机下落速度
		missnum:     控制miss次数
	*/

	//开始游戏方法
	"startGame": function(ev, imgName, enemyspeed, bulletspeed, downspeed, missnum) {
		oGame.gameWrap.innerHTML = "";
		oGame.gameWrap.style.backgroundImage = "url(images/" + imgName + ")";
		var i = 0;
		oGame.bgTimer = setInterval(function() {
			i++;
			oGame.gameWrap.style.backgroundPosition = "0 " + i + "px";
		}, 30);
		oGame.oPlane(ev, bulletspeed);

		//敌方飞机生成速度
		oGame.enemyTimer = setInterval(function() {
			oGame.enemy(downspeed, missnum);
		}, enemyspeed);
	},

	//我方飞机
	oPlane: function(ev, bulletspeed) {
		oGame.plane = oGame.createDom("img");
		oGame.plane.src = "images/plane.png";
		oGame.plane.className = "plane";
		oGame.gameWrap.appendChild(oGame.plane);
		var top1 = oGame.gameWrap.offsetTop + oGame.plane.offsetHeight / 2 +
			((oGame.gameWrap.offsetHeight - oGame.getStyle(oGame.gameWrap, "height")) / 2);

		var left1 = oGame.gameWrap.offsetLeft + oGame.plane.offsetWidth / 2 +
			((oGame.gameWrap.offsetWidth - oGame.getStyle(oGame.gameWrap, "width")) / 2);

		var top = ev.pageY - top1;
		var left = ev.pageX - left1;

		oGame.plane.style.top = top + "px";
		oGame.plane.style.left = left + "px";

		//我方战机随鼠标移动
		document.onmousemove = function(event) {
			var ev = event || window.event;
			top = ev.pageY - top1;
			left = ev.pageX - left1;

			if (top < 0) {
				top = 0;
			} else if (top > oGame.getStyle(oGame.gameWrap, "height") - oGame.getStyle(oGame.plane, "height") / 2) {
				top = oGame.getStyle(oGame.gameWrap, "height") - oGame.getStyle(oGame.plane, "height") / 2;
			};

			if (left < -oGame.plane.offsetWidth / 2) {
				left = -oGame.plane.offsetWidth / 2;
			} else if (left > oGame.getStyle(oGame.gameWrap, "width") - oGame.plane.offsetWidth / 2) {
				left = oGame.getStyle(oGame.gameWrap, "width") - oGame.plane.offsetWidth / 2;
			};

			oGame.plane.style.top = top + "px";
			oGame.plane.style.left = left + "px";
		};

		//生成子弹的速度
		oGame.btimer = setInterval(function() {
			oGame.bullets(left, top);
		}, bulletspeed);
	},

	//生成子弹
	"bullets": function(left, top, speed) {
		//生成子弹的时候不能放在oGame对象下面，
		//因为那样每次生成的子弹都会与上次生成子弹发生冲突，
		//造成子弹无法向上移动
		var obullet = oGame.createDom("img");
		obullet.src = "images/bullet.png";
		obullet.className = "bullet";
		oGame.gameWrap.appendChild(obullet);
		var top1 = top - obullet.offsetHeight;
		var left1 = left + oGame.plane.offsetWidth / 2 - obullet.offsetWidth / 2;

		obullet.style.left = left1 + "px";
		obullet.style.top = top1 + "px";

		//定时器需要绑定到每一颗子弹 而不是 oGame对象上
		//该定时器是控制子弹移动速度
		obullet.stimer = setInterval(function() {
			if (!obullet.parentNode) {
				clearInterval(obullet.stimer);
				return;
			};
			if (top1 < obullet.offsetHeight) {
				clearInterval(obullet.stimer);
				obullet.parentNode.removeChild(obullet);
			};
			top1 -= 6; //子弹速度（speed）
			obullet.style.top = top1 + "px";
		}, 30);
	},

	//敌方飞机
	"enemy": function(downspeed, missnum) {
		var oenemy = oGame.createDom("img");
		oenemy.src = "images/enemy.png";
		oenemy.className = "enemy";
		oGame.gameWrap.appendChild(oenemy);
		var top = -oenemy.offsetHeight;
		//Math.random()方法随机生成0-1之间的小数。包括0和1
		var left = parseInt(Math.random() * 340);
		oenemy.style.top = top + "px";
		oenemy.style.left = left + "px";

		//敌方飞机下落定时器
		oenemy.timer = setInterval(function() {
			//!oenemy.parentNode 如果敌方飞机的父元素不存在就让清除定时器
			if (!oenemy.parentNode) {
				clearInterval(oenemy.timer);
				return;
			};

			//敌机下落速度
			top += downspeed;
			oenemy.style.top = top + "px";
			if (top > oGame.gameWrap.offsetHeight) {
				oGame.amount++;

				clearInterval(oenemy.timer);
				oenemy.parentNode.removeChild(oenemy);
				oGame.miss.innerHTML = "miss : " + oGame.amount + "/" + missnum;

				if (oGame.amount >= missnum) {
					//清除鼠标移动我方飞机跟着移动事件
					document.onmousemove = null;
					//清除 敌机下落定时器
					clearInterval(oenemy.timer);
					//清除 我方战机子弹生成定时器
					clearInterval(oGame.btimer);
					//清除 敌方飞机生成定时器
					clearInterval(oGame.enemyTimer);
					//清除 背景移动定时器
					clearInterval(oGame.bgTimer);

					//2秒后结束游戏
					oGame.gameOver();
				};
			} else {
				//检测如果敌方飞机与我方飞机相撞，爆炸
				if (oGame.Pz(oenemy, oGame.plane)) {
					oenemy.src = "images/boom.png";
					oGame.plane.src = "images/boom2.png";
					//清除鼠标移动我方飞机跟着移动事件
					document.onmousemove = null;
					//清除 敌机下落定时器
					clearInterval(oenemy.timer);
					//清除 我方战机子弹生成定时器
					clearInterval(oGame.btimer);
					//清除 敌方飞机生成定时器
					clearInterval(oGame.enemyTimer);
					//清除 背景移动定时器
					clearInterval(oGame.bgTimer);

					//2秒后结束游戏
					setTimeout(function() {
						oGame.gameOver();
					}, 2000);
				};
				var allbullet = oGame.$(".bullet");
				for (var i = 0; i < allbullet.length; i++) {
					if (oGame.Pz(oenemy, allbullet[i])) {
						oenemy.src = "images/boom.png";
						allbullet[i].parentNode.removeChild(allbullet[i]);
						setTimeout(function() {
							if (!oenemy.parentNode) {
								clearInterval(oenemy.timer);
								return;
							}
							oenemy.parentNode.removeChild(oenemy);
						}, 500);
						oGame.num += 10;
						oGame.oScore.innerHTML = oGame.num + "分";
					};
				};
			};
		}, 30);
	},

	//控制miss次数
	"missnumber": function(missnum) {
		oGame.miss = oGame.createDom("span");
		oGame.miss.className = "miss";
		oGame.miss.innerHTML = "miss : 0 / " + missnum;
		oGame.gameWrap.appendChild(oGame.miss);
	},

	//碰撞检测
	"Pz": function(obj1, obj2) {
		var bL1 = oGame.getStyle(obj1, "left");
		var bT1 = oGame.getStyle(obj1, "top");
		var bW1 = oGame.getStyle(obj1, "width") + bL1;
		var bH1 = oGame.getStyle(obj1, "height") + bT1;

		var bL2 = oGame.getStyle(obj2, "left");
		var bT2 = oGame.getStyle(obj2, "top");
		var bW2 = oGame.getStyle(obj2, "width") + bL2;
		var bH2 = oGame.getStyle(obj2, "height") + bT2;

		if (bT1 > bH2 || bL1 > bW2 || bW1 < bL2 || bH1 < bT2) {
			return false;
		} else {
			return true;
		};
	},

	//游戏得分
	"score": function() {
		oGame.oScore = oGame.createDom("span");
		oGame.oScore.className = "score";
		oGame.num = 0;
		oGame.oScore.innerHTML = oGame.num + "分";
		oGame.gameWrap.appendChild(oGame.oScore);
	},

	//游戏结束
	"gameOver": function() {
		oGame.gameWrap.innerHTML = "<h3 class='over'>Game Over!</h3><p class='total'>总计" + oGame.num + "分<p><button class='resetGame'>重新选择游戏</button>";
		oGame.$(".resetGame")[0].onclick = function() {
			oGame.gameWrap.innerHTML = "";
			oGame.gameWrap.style.background = "url(images/1.jpg)";
			oGame.init();
		};
	},

	//$获取元素方法
	"$": function(oEl) {
		//获取所有元素，返回的是一个数组
		return document.querySelectorAll(oEl);
		//只获取一个元素，返回的是一个节点对象
		//return document.querySelector(oEl);
	},

	//创建节点方法
	"createDom": function(str) {
		return document.createElement(str);
	},

	//获取元素属性值
	"getStyle": function(oEl, attr) {
		if (oEl.currentStyle) {
			return parseInt(oEl.currentStyle[attr]);
		} else {
			return parseInt(getComputedStyle(oEl, false)[attr]);
		};
	}

};

//console.log("50px"-30)  NaN

/*function $(id){
	return document.getElementById(id);
};*/

//console.log($("game_wrap"));

//console.log(oGame.$("div")[0]);