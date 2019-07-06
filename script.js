/**
 * 
 */


//var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
ctx.scale(1, 1);

const gridWidth=40;
const pixelWidth=(canvas.width-200)/gridWidth;//10
var player;
var apple;
var started=false;
var highscore=0;
var cookieStr=document.cookie
var skipframe=false;

if(cookieStr.includes("score")){
	highscore=cookieStr.substring(cookieStr.indexOf("score=")+"score=".length);
	for(var i=0; i<highscore.length; i++){
		if(highscore.charCodeAt(i)<48 || highscore.charCodeAt(i) > 57){//not 0-9
			highscore=highscore.substring(0,i);
			break;
		}
	}
}

function draw(){
	if(!skipframe){
		var immuneFrame=false;
		ctx.fillStyle="#FFFFFF"//white
		ctx.fillRect(0,0,canvas.width,canvas.height);
		
		ctx.fillStyle="#EEEEEE";//grey
		ctx.fillRect(100,100,410,410);
		
		ctx.fillStyle="#000000";//blacc
		ctx.font="24px sans-serif";
		ctx.fillText("Score: "+player.score, 100,50);
		ctx.fillText("Highscore: "+highscore, 300, 50);
		
		if(!apple){
			apple= Apple();
		}
		
		ctx.fillStyle="red";
		let ax=100+pixelWidth*apple.x;
		let ay=100+pixelWidth*apple.y;
		ctx.fillRect(ax,ay,pixelWidth,pixelWidth);
		
		
		
		if(player.dir==0){
			player.x++;
		}else if(player.dir==90){
			player.y--;
		}else if(player.dir==180){
			player.x--;
		}else if(player.dir==270){
			player.y++;
		}
		
		player.tail=player.tail.concat([[player.x,player.y]])
		player.tail=player.tail.slice(1,player.tail.length);
		//console.log(player.tail);
		
		ctx.fillStyle="lime";
		player.tail.forEach(function(item, i) {
			if(item[0]>=0 && item[0]<=gridWidth && item[1]>=0 && item[1]<=gridWidth){
				let x=100+pixelWidth*item[0];
				let y=100+pixelWidth*item[1];
				ctx.fillRect(x,y,pixelWidth,pixelWidth);
				//console.log(x);
			}
		});
		
		
		
		
		if(player.tail[player.tail.length-1][0]==apple.x && player.tail[player.tail.length-1][1]==apple.y){
			immuneFrame=true;//So apple isn't murderous
			player.tail=[[apple.x,apple.y]].concat(player.tail);
			apple=null;
			//console.log(player.tail.length);
			player.score++;
			if(player.score>highscore){
				highscore=player.score;
				document.cookie="score="+highscore;
			}
			
			//console.log(player.score+"\t\t"+highscore);
		}
		
		if(player.x==-1 || player.y==-1 || player.x==gridWidth+1 || player.y==gridWidth+1){
			//console.log(player.x +"\t" + player.y);
			player=new Player();
		}
		
		player.tail.forEach(function(item, i) {
			if(item[0]==player.x && item[1]==player.y && i<player.tail.length-1 && !immuneFrame){
				player=new Player();
			}
		});
	}
	
	skipframe=false;
}


function init(){
	
	ctx.fillStyle="#EEEEEE";//grey
	ctx.fillRect(100,100,410,410);
	
	ctx.fillStyle="#000000";//blacc
	ctx.font="24px sans-serif";
	ctx.fillText("Press any key to play", 100, 50);
	
	player=new Player();
	
	window.addEventListener("keydown", function(e){
		if(!started){
			window.setInterval(function(){
				draw();
			}, 80);
			started=true;
		}

		
		if((e.key=="w" || e.key=="ArrowUp") && player.dir!=90 && player.dir!=270){
			player.dir=90;
			draw();
			skipframe=true;
		}else if((e.key=="s" || e.key=="ArrowDown") && player.dir!=270 && player.dir!=90){
			player.dir=270;
			draw();
			skipframe=true;
		}else if((e.key=="a" || e.key=="ArrowLeft") && player.dir!=180 && player.dir!=0){
			player.dir=180;
			draw();
			skipframe=true;
		}else if((e.key=="d" || e.key=="ArrowRight") && player.dir!=0 && player.dir!=180){
			player.dir=0;
			draw();
			skipframe=true;
		}
		
	});
	
	
}

function Player() {
	this.x=gridWidth/2;//head
	this.y=gridWidth/2;//head
	var x=this.x;
	var y=this.y;
	this.dir=0;//degrees, 0 being +x, going CCW
	this.tail=[[x-2,y],[x-1,y],[x,y]];
	this.score=0;
}

function Apple(){
	let x=Math.floor(Math.random()*40);
	let y=Math.floor(Math.random()*40);
	
	
	player.tail.forEach(function(item, i) {
		if(this.x==item[0] || this.y==item[1]){
			return Apple();
		}
	});
	
	return {x:x, y:y};
}



init();