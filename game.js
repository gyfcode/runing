//人物对象
//参数1canvas元素2canvas 2d对象3获取所有跑的图片4获取跳的图片5跑的音频6跳的音频7游戏人物碰到障碍物的音频
function person(canvas, cobj, runimg, jumpimg,audioobj,audioobj1,jumpbtn) {
    this.canvas = canvas;//canvas元素
    this.cobj = cobj;//canvas 2d对象
    this.runimg = runimg;//获取所有跑的图片
    this.jumpimg = jumpimg;//获取跳的图片
    this.x = 0;//人物初始x 轴的位置
    this.y = 0;//人物初始y 轴的位置
    this.width = 83;//人物的宽度
    this.height = 118;//人物的高度
    this.status = "runimg";//人物的的默认状态是跑
    this.state = 0;//人物的跑
	this.audioobj = audioobj;//跑的音频
    this.audioobj1 =audioobj1;//跳的音频；
    this.jumpbtn=jumpbtn;
}
person.prototype = {
    draw: function () {
        var cobj=this.cobj;
        cobj.save();//保存了画布状态
        cobj.translate(this.x,this.y);//人物初始位置
        //绘制人物的信息 跑还是跳的第几张
        cobj.drawImage(this[this.status][this.state],0,0,827,1181,0,0,this.width,this.height);
        cobj.restore();//恢复 canvas 2d状态
    },
    animate: function (num,speed) {//speed 背景图移动的步进值
           if(this.status=="runimg") {//如果是跑的状态
               this.state = num % 7;//切换跑的图片状态
             	this.audioobj.play();//跑的音频打开
             	this.audioobj1.pause();//关掉跳的音频
           }else{
               this.state=0;//
           }
           this.x+=speed;//跑起来的步进值
           if(this.x>this.canvas.width/3){//跑到画布的1/3处停下
               this.x=this.canvas.width/3
           }

    },
    jump: function () {//跳的事件
        var that=this;
        var flag=true;//防止2次跳跃
        touch.on(this.jumpbtn,"touchstart",function(e){//手机点击事件触发跳事件
        	e.preventDefault();
        	 that.audioobj.pause();//跳的时候让跑的视频停下 
        	 that.audioobj1.play();//让跳音频开启
            if(!flag){
                return;
            }
            flag=false;
            that.status="jumpimg";//人物的状态是跳
            that.state=0;//人物的状态是跳 的图片是第一张 且跳的图片只有一张
            var currenty=that.y;//人物当前在y轴方向的位置
            var inita=0;//用以计算 跳起的弧度
            var speeda=10;
            var r=100;
            var t=setInterval(function(){
                inita+=speeda;
                if(inita>=180){//防止人物掉“坑中”
                    that.status="runimg"//如果人物落地，人物的动作是跑的状态
                    clearInterval(t);
                    that.y=currenty;//人物当前在y轴方向的0位置
                    flag=true;
                }else{
					//让人物跳起来 ，计算y轴方向的值	
                    that.y=currenty- Math.sin(inita*Math.PI/180)*r;
                }

            },50)



        })
    }
}
//********************************** 障碍物********************************/
function hinder(canvas,cobj,hinderimg){
   this.canvas=canvas;//canvas 元素
   this.cobj=cobj;//canvas 2d对象
   this.hinderimg=hinderimg;//障碍物图片数组
   this.x=0;//障碍物x轴方向位置
   this.y=0;//障碍物y轴方向位置
   this.width=56;//障碍物宽度
   this.height=80;//障碍物高度40
   this.state=0;//当前的图片
}
hinder.prototype={
    draw:function(){
        var cobj=this.cobj;//2d对象
        cobj.save();//保存了画布状态
        cobj.translate(this.x,this.y);//障碍物x,y方向移动像素
        //绘制障碍物的信息  障碍物是第几张
        cobj.drawImage(this.hinderimg[this.state],0,0,564,400,0,0,this.width,this.height);
        cobj.restore();//恢复 canvas 2d状态
    },
    //障碍物移动方向及速度
    animate:function(speed){
        this.x-=speed;
    }
}

// 得分项



//粒子动画

function lizi(canvas,cobj,x,y){
    this.x=x;//血的x出血位置
    this.y=y;//血的y出血位置
    this.canvas=canvas;
    this.cobj=cobj;
    this.r=2+2*Math.random();//出血的半径是随机的
    this.speedx=8*Math.random()-4;//出血方向是x,y方向四处扩散的
    this.speedy=8*Math.random()-4;
    this.color="red";//血的颜色
    this.speedl=0.3;//血液小球半径减小的步进值
}
lizi.prototype={
    draw:function(){
        this.cobj.save();//保存2d对象位置
        this.cobj.translate(this.x,this.y);//使其出血效果想x,y方向
        this.cobj.fillStyle=this.color;//出血的颜色付给对象
        this.cobj.beginPath();//使图像独立起来 防止多次绘图
        this.cobj.arc(0,0,this.r,0,2*Math.PI);//血的圆球
        this.cobj.fill();//填充绘制
        this.cobj.restore();//恢复2d对象位置
    },
    animate:function(){
        this.x+=this.speedx;//使血液四周扩散
        this.y+=this.speedy;//使血液四周扩散
        this.r-=this.speedl;//出血的图像小球不断变小
    }

}

function xue(canvas,cobj,x,y){
    var arr=[];
    for(var i=0;i<20;i++){//每次出血的个数
        arr.push(new lizi(canvas,cobj,x,y));
    }

    var t=setInterval(function(){//

        for(var i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].animate();
            if(arr[i].r<0){
                arr.splice(i,1);//删除
            }
        }
        if(arr.length<1){//如果数组长小于0，出血停止
            clearInterval(t);
        }

    },50)
}

//*****************************************游戏对象对象构造函数************************************/
//参数1canvas元素2canvas 2d对象3获取所有跑的图片4获取跳的图片5障碍物图片6跑的音频7跳的音频8游戏人物碰到障碍物的音频 9跳跃按钮
function game(canvas, cobj, runimg, jumpimg,hinderimg,audioobj,audioobj1,audioobj2,jumpbtn,zidanbtn,imgs,audioobj3,one,two,three,progressInner,gameover,fenshuover,resize) {
    this.canvas=canvas;//参数canvas
    this.jumpbtn=jumpbtn;//跳跃按钮
    this.cobj=cobj;//canvas 2d对象
    this.hinderimg=hinderimg;//障碍物图片数组
    this.gameover=gameover;
    this.fenshuover=fenshuover;
    this.resize=resize;fullpage
    this.fullpage=fullpage;
    /*****************************实例化游戏人物********************/
   //参数1canvas元素2canvas 2d对象 3获取所有跑的图片4获取跳的图片5跑的音频6跳的音频7游戏人物碰到障碍物的音频 9跳跃按钮
    this.person = new person(canvas, cobj, runimg, jumpimg,audioobj,audioobj1,jumpbtn);
    this.speed=8;//背景图移动速度步进值
    this.hinderArr=[];////障碍物数组
    this.score=0;//总分数
    this.currentscore=0;//当前的分数
    this.life=3;//生命值
    this.step=2;//关卡分数上限
    this.audioobj=audioobj;//跑的音频
    this.audioobj1=audioobj1;//跳的音频
    this.audioobj2=audioobj2;//游戏人物碰到障碍物的音频
    this.audioobj3=audioobj3;//打枪的音频
    this.zidan=new zidan(canvas,cobj,imgs);//操作子弹
    this.zidanbtn=zidanbtn//操作子弹按钮
    this.imgs=imgs//操作子弹按钮
	this.flag= false;
	this.flag1= false;
	this.width=canvas.width;
	this.one=one;
	this.two=two;
	this.three=three;
	this.nowgq=0;
	this.progressInner=progressInner;
}

game.prototype = {
    play: function (start,banner,zidanbtn) {
        var that=this;
        start.style.cssText="display:none;"
        banner.style.cssText="animation:mask1 2s ease forwards;"
        var backpos=0;
        var personNum=0;
        var times=0;
		//计算时间 最少3秒最多9秒
        var randtime=Math.floor(3+6*Math.random())*1000;
        that.person.jump();//调用跳事件，当touchstart 跳起
         var t=setInterval(function(){
                times+=50;
                //清除画布信息，防止多次重汇
               that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);

               if(times%randtime==0) {
                   randtime=Math.floor(3+6*Math.random())*1000;
                   //实例化    障碍物  
                   var hidnderObj=new hinder(that.canvas, that.cobj, that.hinderimg);
                   hidnderObj.state=Math.floor(Math.random()*that.hinderimg.length);//随机获得障碍物图片
                   hidnderObj.y=that.canvas.height-hidnderObj.height;//障碍物y轴实际位置
                   hidnderObj.x=that.canvas.width;
                   that.hinderArr.push(hidnderObj);//得到障碍物的数组

	                if(that.hinderArr.length>5){//如果障碍物数量大于五，从数组里删除第一个
	                    that.hinderArr.shift();
	                }
               }

               for(var i=0;i<that.hinderArr.length;i++){
                   that.hinderArr[i].draw();//绘制障碍物到canvas中
                   that.hinderArr[i].animate(that.speed);//让每个障碍物跑起来
                   //hitPix.js  判断人物是否与障碍物相撞
                   if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                   		//此处相撞了   出血的位置在游戏人物的  中心位置
                   		that.audioobj2.play();//出血时的音频播放
                       xue(that.canvas,that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2);
                       if(!that.hinderArr[i].hits){//此处判断：撞到人物后不能生命值减下去

                           that.life--;
                           that.one.innerHTML= that.life;
                           if(that.life<0){//如果生命值小于0，游戏结束
								that.gameover.style.display="block"
    							that.fenshuover.innerHTML=that.score;
    							that.fullpage.style.display="block"
    							clearInterval(t)
    							setTimeout(function(){
	    							that.audioobj.pause()//跑的音频
								    that.audioobj1.pause();//跳的音频
								    that.audioobj2.pause();//游戏人物碰到障碍物的音频
								    that.audioobj3.pause();//打枪的音频fullpage
								    
    							})
    							
    							
    							that.resize.onclick=function(){
    								 location.reload();//重新加载页面
    							}
                           }
                           that.hinderArr[i].hits="hits";//生命值减掉后做开关处理，防止误减生命值
                       }


                   }else{
                   		setTimeout(function(){
                   			that.audioobj2.pause();
                   		},1000)
                   }

		/*************************************判断是否得分了***************************/
					//如果障碍物的x方向小于游戏人物的x方向并且没有被撞上
                   if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x&&!that.hinderArr[i].hits){
                       if(!that.hinderArr[i].score){//防止分数一直加加 开关处理
                           ++that.score;
                           ++that.currentscore;
                           var innerw=that.currentscore/that.step*100;
                           that.progressInner.style.width=innerw+'%';
                            that.three.innerHTML=that.score;//总分数	
                           if(that.currentscore%that.step==0){//如果当前的分数除以2=0;
                           	++that.nowgq;//当前关卡++
                           	that.two.innerHTML=that.nowgq;
                               that.step=that.currentscore*2;//第二次关卡分数临界点乘以2
                              
                               that.currentscore=0;//当前分数清零
                               that.progressInner.style.width='0%'
                               that.speed+=1;//背景图移动速度加1;
                           }
                           that.hinderArr[i].score="true"///防止分数一直加加 开关处理
                       }
                   
                   }
                   
/**********************************************操作子弹**************************************************/                  
              
//                     		 if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderArr[i])){
//			                    	
//			                    	console.log(9)
//			                    }
               
                     
                

              }
  //***************************************判断子弹是否击中障碍物***********************************************/              
			                if(that.flag){//开关true;
			                	
			                    if(that.zidan.x>that.width){//如果子弹的x位置大于canvas的宽
			                    	that.audioobj3.pause();
			                        that.flag=false;//开关关上
			                  		
			                    }
			                   
			                    that.audioobj3.play();
								that.zidan.x+=that.zidan.speedx;
								
								that.zidan.draw(imgs,function(){
									//if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderArr[0])){
		                    	console.log(9)
			                    	//}
								});
			                }
			            	
                
               
  /************************************操作子弹***********************************************/         
               personNum++//通过personNum++改变游戏人物图片
               that.person.draw();//绘制游戏人物
               that.person.animate(personNum,that.speed);
				
               backpos-=that.speed;//canvas 背景图动起来 的步进值 that.speed
				//canvas 背景图动起来 
               that.canvas.style.backgroundPositionX=backpos+"px";
           },50)
/***********************************子弹事件开始************************/
           touch.on(this.zidanbtn,"touchstart",function(e){//手机点击事件触发跳事件
           		e.preventDefault();
           		if(that.flag){
           			return false;
           			
           		}
	            that.zidan.x=that.person.x+that.person.width/2;///子弹的发出位置在游人物的身上
	            that.zidan.y=that.person.y+that.person.height/2;///子弹的发出位置在游人物的身上
	            that.zidan.speedx=70;///子弹步进值
	            that.flag=true;	
	          	
        })

     
       
       
       

    }
    
}
//**********************子弹函数****************************/
function zidan(canvas,cobj){
    this.x=0;//子弹的x方向
    this.y=0;;//子弹的y方向
    this.width=50;//子弹的宽
    this.height=10;//子弹的高
    this.cobj=cobj;//2d对象
    this.canvas=canvas;//canvas 元素
    this.speedx=5;//子弹动起来的步进值
    this.jia=1;
 
   
}
zidan.prototype={
  draw:function(imgs,fun){//绘制子弹
        var cobj=this.cobj;
        cobj.save();//保存信息
        cobj.translate(this.x,this.y);//让子弹动起来
        var pat=cobj.createPattern(imgs,"no-repeat");//子弹图片重汇到画布
        cobj.fillStyle=pat;
		cobj.fillRect(0,0,50,12);//绘制矩形
        cobj.restore();
		fun()
        
  }
}
