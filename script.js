let canvas; //this is gonna be a handle on info about dimensions of our display area
let canvasContext; //underline graphical infromation about that we can draw rectangles and circles etc
let ballX = 50; //x-axis, horizontal of ball\
let ballSpeedX = 7;
let ballY = 50; //y-axis, vertical of ball\
let ballSpeedY = 4;

let paddle1Y = 210;
const PADDLE_HEIGHT = 100;

let paddle2Y = 210;
const PADDLE_HEIGHT_2 = 100;

const PADDLE_WIDTH = 10;

let player1Score = 0;
let player2Score = 0;

const WINNING_SCORE = 5;

let winScreen = false;
let WHO_WON = 'Click to Continue';


//as soon as window finishes loading, do this function
//this function draws the canvas up on the screen of black color
//which is 2d and has black color and width and height are given in html
//now we can draw things on this canvas
window.onload = function () {

	console.log("Hello World!");
	//getting canvas
	//making it 2d
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext ('2d');
	// canvasContext.fillStyle = 'black';
	// canvasContext.fillRect(0,0,canvas.width,canvas.height);//x and y are 0
	// canvasContext.fillStyle = 'yellow';
	// canvasContext.fillRect(100, 200, 50, 25); //100px from left, 200px from top, and width of box= 50 and height of box = 25
	// canvasContext.fillStyle = 'white';
	// canvasContext.fillRect(400, 300, 100,100); //we gave coordinates for rectangle to come in center, it takes top left corner and center that in the cneter of screen
	// canvasContext.fillStyle = 'green';
	// canvasContext.fillRect(300, 200, 100,100); // for acutal mid, we subtract the x and y by 100 so it comes on origin with its center
	//can also do above line of code as
	// canvasContext.fillRect((canvas.width/2 - 100), (canvas.height/2 - 100), 100,100);
//drawing order is cascading here also... 
//the shape coming after will be on top of previous shape
//we want all separate drawing in their separate function/blocks of codes
	
	//these function just reposition our shape becuase it's happening so much fast
	// drawEverything();	
	// drawEverything();
	// drawEverything();
	//we need animation
	//now...
	let fps = 60; //(animation)
	setInterval(drawAndMove, 1000/fps);


	canvas.addEventListener('mousedown', clickToContinue);

	//now we'll add eventListener for movement of our paddle with mouse function
	canvas.addEventListener('mousemove', 
		function(evt) {
			let mousePos = calcMousePos(evt);
			paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
	});
}

//moving ball in x(horizontal) with addition of speed ballSpeedX per fps
function moveEverything () {

	if(winScreen == true) {
		return;
	}

	enemyAiMovement();

	//each time we update screen we do, increase -- to horizontal
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

//bounce back ball if gets hit by paddle
//top of paddle is paddle1Y, where paddle starts
//and end of it is paddle1Y+PADDLE_HEIGHT


	//now changing direaction of ball when hit horizontally
	//reset ball and bounce ball at right wall
	if(ballX > canvas.width -20) {
		// ballSpeedX = -ballSpeedX;
		if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT_2) {
			ballSpeedX = -ballSpeedX
			//implementing ball control (have to change directions vertically)
			let ballCtrl = ballY - (paddle2Y+PADDLE_HEIGHT_2/2);
			ballSpeedY = ballCtrl * 0.25;
		} else if (ballX > canvas.width){
			player1Score++; //must be before ballRest()
			ballRest();
		}
	}
	//reset ball if hits left side
	if(ballX < 20) {
		// ballSpeedX = -ballSpeedX; //-ve becomes positive
		if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX
			//implementing ball control (have to change directions vertically)
			let ballCtrl = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = ballCtrl * 0.25;

		} else if (ballX < 0){
			player2Score++; //must be before ballRest()
			ballRest();
		}	
	} 
	//for vertical
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}

}

//drawing canvas, ball and players
function drawEverything () {

	//black canvas
	colorRect (0,0, canvas.width, canvas.height, 'black');
		
		if(winScreen == true) {
			canvasContext.fillStyle = 'white';
			if(player1Score >= WINNING_SCORE) {
				canvasContext.fillText("WOW, You Won!", 350, 200);
			} else if (player2Score >= WINNING_SCORE) {
				canvasContext.fillText("Oh, Enemy Won!", 350, 200);
			}
			canvasContext.fillText(WHO_WON, 350, 500);
			console.log(WHO_WON);
		return;
	}

	drawNet(); 	//net

	//making left player, paddle1
	colorRect(0, paddle1Y , PADDLE_WIDTH,PADDLE_HEIGHT, 'blue'); // for acutal mid, we subtract the x and y by 100 so it comes on origin with its center
	//right player paddle
	colorRect(canvas.width-PADDLE_WIDTH, paddle2Y , PADDLE_WIDTH,PADDLE_HEIGHT_2, 'green');
	//ball
	makeCircle(ballX, ballY, 8, 'red');
	canvasContext.fillStyle = 'white'
	//score of player1(left)
	canvasContext.fillText(player1Score + ` ` + ` / ${WINNING_SCORE}`,92,100);
	//score of player2(right)
	canvasContext.fillText(player2Score +` `+ ` / ${WINNING_SCORE}`, canvas.width - 108,100);
	canvasContext.fillText("Player", 90,50);
	canvasContext.fillText("Enemy", canvas.width - 110, 50);
}

function drawAndMove () {
	moveEverything();
	drawEverything();
}

//making shapes --> taking horizontal, then vertial,  then width-height of shape and then it's color
function colorRect (leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect (leftX, topY, width, height);
}

function makeCircle (centerX, centerY, radius, colorBall) {
	//making of ball
	canvasContext.fillStyle = colorBall; //giving color
	//beginPath is necessary built-in to draw circle
	canvasContext.beginPath();
	//arc is meant for filling in circle, it accepts arguments
	//ballX = X position(horizontal)
	//100 = Y (vertical/top)
	//10px = radius of circle -- circle will be 20 px wide and 20 px tall
	//2PI radian is the complete circle  
	//if we do MATH.PI -- gives half circle
	//true gives upper half and false gives lower half
	canvasContext.arc(centerX , centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}
//now moving player paddles with computer mouse
function calcMousePos (evt) {
	let rect = canvas.getBoundingClientRect(); //store our canvas black area in variable rect
	let root = document.documentElement; //handle on document that is html page
	let mouseX = evt.clientX - rect.left - root.scrollLeft; //it is taking position of mouse, by subtracting scroll we are restricting it to our canvas
	let mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY //JS object Literal
	};
}

//ball reset function if hits side walls
//will spawn at center of canvas
function ballRest() {

	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) { //if user wins
		winScreen = true;
	}

	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = -ballSpeedX;
}

//now we'll make right paddly chase the ball's vertical poistion
function enemyAiMovement () {

	let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT_2/2);

	//if paddle is above the ball's vertical
	if(paddle2YCenter < ballY-35) {
		paddle2Y = paddle2Y + 6; //if paddle is above the ball move it down addition of six
	} else if(paddle2YCenter > ballY+35) { //if paddle is below the ball
		paddle2Y = paddle2Y - 6; //move is up the canvas
	} 

}

function clickToContinue (evt) {
	if(winScreen == true) {
		player1Score = 0;
		player2Score = 0;
		winScreen = false; //do it false so that we can back out or win screen and show our game again
	}
}

let drawNet = () => {
	for(let i = 0; i < canvas.height; i+=34) { //draw net 40 px apart
		colorRect(canvas.width/2 - 1,i,2,20,'white');
	}
}

//Ball Control is important (having player influence with ball)
//stop game when either one wins
//we'll reset the game by adding an other event listener of click
//Draw net
