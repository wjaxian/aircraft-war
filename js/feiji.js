window.onload=function(){
			Game.init();
		};
		var Game = {
				'box': document.getElementById('box'),

				//图片预加载
				'img' : function(){
					Game.oPlane = new Image();
					Game.oPlane.src='images/plane.png';
					Game.oPlane.className='plane';
				},

				//场景初始化
				'init':function(){
					setTimeout(function(){
						Game.box.style.background='url(images/1.jpg)';
						var oTitle = Game.ctE('h3');
							oTitle.innerHTML='Js飞机大战v1.0-Betrs版';		
						var oDiv = Game.ctE('div');
							oDiv.innerHTML = '<p class="ac">简单</p><p class="ac">一般</p><p class="ac">困难</p>';
						Game.box.appendChild(oTitle);
						Game.box.appendChild(oDiv);
						Game.img();
						var oP = oDiv.children;
						for(var i=0;i<oP.length;i++){
							oP[i].index=[i];
							oP[i].onmouseover=function(){
								this.className='on';
							};
							oP[i].onmouseout=function(){
								this.className='ac';
							};
							oP[i].onclick=Game.start;
						};
					},3000);
				},

				//开始游戏
				'start' : function(ev){
					ev = ev||event;
					var s =0;//s是背景移动速度
					var t =0;//t是子弹生成速度
					var c = 0;//c是子弹运行速度
					var d = 0;//敌机生成速度
					function bg(i){
						Game.box.style.background='url(images/'+i+'.jpg)';
						setInterval(function(){
							s+=1;
							Game.box.style.backgroundPosition='0px'+' '+s+'px';
						},30);
					};
					if(this.index==0){
						bg(3);
						t=100;
						c=6;
						d=500;
					}else if(this.index==1){
						bg(4);
						t=150;
						c=15;
						d=400;
					}else if(this.index==2){						
						bg(5);
						t=200;
						c=20;
						d=300;
					};
					Game.box.innerHTML='';
					Game.plane(ev,t,c);
					Game.start.timer=setInterval(function(){Game.enemy();},d);
					Game.score();
				},

				//我方站机
				'plane' : function(ev,t,c){
					Game.box.appendChild(Game.oPlane);
					var bT = Game.box.offsetTop + Game.oPlane.clientHeight/2 + (Game.box.offsetHeight-Game.getstyle(Game.box,'height'))/2;
					var bL = Game.box.offsetLeft + Game.oPlane.clientWidth/2 + (Game.box.offsetWidth-Game.getstyle(Game.box,'width'))/2;
					var top = ev.pageY - bT;
					var left = ev.pageX - bL;
					Game.oPlane.style.cssText='top:'+top+'px;left:'+left+'px;';	

					var topMax = Game.getstyle(Game.box,'height')-Game.oPlane.clientHeight/2;
					var leftMin = -Game.oPlane.clientWidth/2;
					var leftMax = Game.getstyle(Game.box,'width')-Game.oPlane.clientWidth/2;
					document.onmousemove = function(ev){
						ev = ev||event;
						top = ev.pageY - bT;
						left = ev.pageX - bL;
						if(top<0){
							top=0;
						}else if(top>topMax){
							top = topMax;
						};
						if(left<leftMin){
							left = leftMin;
						}else if(left>leftMax){
							left = leftMax;
						};
						Game.oPlane.style.cssText='top:'+top+'px;left:'+left+'px;';	
					};
					
					/*子弹生成速度 */
					Game.bTimer=setInterval(function(){Game.bullet(top,left,c);},t);

				},

				//子弹
				'bullet' : function(pTop,pLeft,c){
					var oB = Game.ctE('img');
					oB.src='images/bullet.png';
					oB.className='bullet';
					Game.box.appendChild(oB);
					var top = (pTop-Game.getstyle(oB,'height')+5);
					var left = (pLeft+Game.oPlane.clientWidth/2-Game.getstyle(oB,'width')/2);
					oB.style.cssText='top:'+top+'px;left:'+left+'px;';
					oB.timer=setInterval(function(){
						/*子弹运行速度*/
						if(!oB.parentNode){
							clearInterval(oB.timer);
							return;
						}
						top -= c;
						oB.style.top=top+'px';
						if(top<-22){
							clearInterval(oB.timer);
							oB.parentNode.removeChild(oB);
						};

					},30);
				},

				//敌方战机
				'enemy' : function(){
					var oEnemy = Game.ctE('img');
					oEnemy.src='images/enemy.png';
					oEnemy.className='enemy';
					Game.box.appendChild(oEnemy);
					var left = Math.random()*(Game.box.clientWidth-Game.getstyle(oEnemy,'width')/2);
					var top = Game.getstyle(oEnemy,'top');
					oEnemy.style.left=left+'px';
					oEnemy.timer=setInterval(function(){
						/*敌军下落速度*/
						top+=3;
						oEnemy.style.top=top+'px';
						if(top>Game.box.clientHeight){
							clearInterval(oEnemy.tiamr);
							if(!oEnemy.parentNode){
								return;
							}else{
								oEnemy.parentNode.removeChild(oEnemy);
							};
						}else{
							var allB = Game.getclass(Game.box,'img','bullet');
							for(var i=0;i<allB.length;i++){
								if(Game.pz(oEnemy,allB[i])){
									allB[i].parentNode.removeChild(allB[i]);
									oEnemy.src='images/boom.png';
									clearInterval(oEnemy.timer);
									setTimeout(function(){
										if(!oEnemy.parentNode){
											return;
										}else{
											oEnemy.parentNode.removeChild(oEnemy);
										};
									},500);
									Game.num+=10;
									Game.oScore.innerHTML=Game.num+'分';
								};	
							};
							if(Game.pz(oEnemy,Game.oPlane)){
								oEnemy.src='images/boom.png';
								clearInterval(oEnemy.timer);
								setTimeout(function(){
									if(!oEnemy.parentNode){
										return;
									}else{
										oEnemy.parentNode.removeChild(oEnemy);
									};
								},500);
								Game.oPlane.src='images/boom2.png';
								clearInterval(Game.bTimer);
								clearInterval(Game.start.timer);
								document.onmousemove=null;
								setTimeout(function(){
									Game.over();
								},3000);
							};
						};
					},30);
				},

				//游戏结束
				'over' : function(){
					Game.box.innerHTML='';
					var oOvar = Game.ctE('div');
					var oP1 = Game.ctE('p');
					var reStart = Game.ctE('p');
					var oSpan = Game.ctE('p');
					oP1.innerHTML='Game Over!';
					oSpan.innerHTML='最后得分:'+Game.oScore.innerHTML;
					reStart.innerHTML='重新开始';
					oP1.className='op1';
					oOvar.className='over';
					oSpan.className='oSpan';
					reStart.className='reStart';
					reStart.id='reStart';
					Game.box.appendChild(oOvar);
					oOvar.appendChild(oP1);
					oOvar.appendChild(oSpan);
					oOvar.appendChild(reStart);
					document.getElementById('reStart').onclick=function(){
						oOvar.parentNode.removeChild(oOvar);
						window.open('index.html','_self');
					};
				},

				//游戏分数
				'score' : function(){
					Game.oScore = Game.ctE('span');
					Game.oScore.className='score';
					Game.num=0;
					Game.oScore.innerHTML=Game.num+'分';
					Game.box.appendChild(Game.oScore);
				},

				//碰撞检测
				'pz' : function(obj1,obj2){
					var T1 = Game.getstyle(obj1,'top');
					var B1 = T1+Game.getstyle(obj1,'height');
					var L1 = Game.getstyle(obj1,'left');
					var R1 = L1+Game.getstyle(obj1,'width');

					var T2 = Game.getstyle(obj2,'top');
					var B2 = T2+Game.getstyle(obj2,'height');
					var L2 = Game.getstyle(obj2,'left');
					var R2 = L2+Game.getstyle(obj2,'width');

					if(T1>B2||L1>R2||B1<T2||R1<L2){
						return false;
					}else{
						return true;
					};
				},

				'getclass':function(Element,TagName,className){
					var aElements = Element.getElementsByTagName(TagName);
					var arr =[];
					var aClass = '';

					for(var i = 0; i<aElements.length;i++){
						aClass = aElements[i].className.split(' ');
						for(var j =0;j<aClass.length;j++){
							if(aClass[j] == className){
								arr.push(aElements[i]);
								break;
								};
							};	
						};
					return arr;
				},


				'ctE' : function(tagName){
					return document.createElement(tagName);
				},

				'getstyle' : function(obj,attr){
					return obj.currentstyle?parseInt(obj.currentstyle[attr]):parseInt(getComputedStyle(obj)[attr]);
				}
			};
