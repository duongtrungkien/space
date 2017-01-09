// get canvas element by id
// get context of canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gunX = canvas.width / 2 - 20;
var gunY = canvas.height - 30;
var box = [];
var flies = [];
var islose = false;
var spaceship = document.createElement("img");
spaceship.src = "spaceship.png";
var background = document.createElement("img");
background.src = "background.jpg";
var bullet = document.createElement("img");
bullet.src = "bullet.png";
var meteor = document.createElement("img");
meteor.src = "meteor.png";

// TODO create the score

var gun = {
	x 		: gunX,
	y 	 	: gunY,
	draw 	: function () {
		if (this.x < 0){
			this.x = 0;
		}
		else if (this.x + 40 > canvas.width){
			this.x = canvas.width - 40;
		}
		ctx.drawImage(spaceship , this.x , this.y , 40 , 30);
	}
}


/* Bullet class object function which has:
 * x, y, start at the top center of gun 
 * w = h = 10px
 * speed
 * method draw():
 * 	when bullet draw(), update new position of x and y by speed
 * 	Check if the bullet hits the canvas border, 
 * 	delete bullet from bullets array by "array splice" method
 */
	
var Bullet = function (x, y) {
	this.x = x ;
	this.y = y ;
	this.speed = 3;

	this.draw  = function () {
		this.y = this.y - this.speed;

		if (this.y < 0){
			var index = box.indexOf(this);
			box.splice(index , 1);
		}
		ctx.drawImage (bullet , this.x , this.y , 10 , 10);
	}
}

// Draw each bullet by looping through array bullets
function drawBullet () {
	
	for (var i = 0; i < box.length ; i++) {
		var shoot = box[i];
		shoot.draw();
	};
}


/* Fly class object function which has:
 * x, y
 * w = h = 10
 * speed
 * method draw:
 * 	When fly draw(), update x and y
 * 	If the fly hit the ground, remove fly from flies array
 */
var Fly = function (x , y){
	this.x = x ;
	this.y = y ;
	this.speed = 3;

	this.draw = function () {
		ctx.drawImage (meteor , this.x , this.y , 10 , 10);

		this.y = this.y + this.speed;
		if (this.y + 10 > canvas.height){
	
			var index = flies.indexOf(this);
			flies.splice(index,1);
			//console.log(flies.length);
		}
	} 
}

function drawFly () {
	for (var i = 0 ; i < flies.length; i++) {
		var fly = flies[i];
		fly.draw();
	}
}


/* TODO: create function checkCollision
 * 1. create loop i through array flies
 * 2. In side loop i, create another loop j, through array box
 * 3. Compare the x, y to check if there is collision 
 * 4. If yes, remove that fly and that bullets from array
 * 5. Becareful, after remove fly or bullets, the array length is changed
 *    need to change the i or j somehow to continue next loop correctly
 *
 * 6. Compare the x, y of fly with the x, y of gun to check collision
 *	  If yes, console "Game Over"
 */

 function checkCollision () {
 	for (var i = 0 ; i < flies.length ; i++){

 		var fly = flies[i];

 		for (var j = 0 ; j < box.length ; j++){
 			
 			
 			var bullet = box[j];

 			if ((bullet.x + 10 >= fly.x
				&& bullet.x + 10 <= fly.x + 10
				&& bullet.y + 10 >= fly.y
				&& bullet.y + 10 <= fly.y + 10)
				||(bullet.x + 10 >= fly.x
				&& bullet.x + 10 <= fly.x + 10
				&& bullet.y >= fly.y
				&& bullet.y <= fly.y + 10)
				||(bullet.x >= fly.x
				&& bullet.x <= fly.x + 10
				&& bullet.y + 10 >= fly.y
				&& bullet.y + 10 <= fly.y + 10)
				||(bullet.x >= fly.x
				&& bullet.x <= fly.x + 10
				&& bullet.y >= fly.y
				&& bullet.y <= fly.y + 10)
				)
			{
			
 				var index = flies.indexOf(fly);
				flies.splice(index,1);
				var index = box.indexOf(bullet);
				box.splice(index,1);
				console.log('collision' , flies.length , box.length);
				i--;
				break;
 			}

 		}

 		if ((fly.x + 10 >= gun.x
			&& fly.x + 10 <= gun.x + 40
			&& fly.y + 10 >= gun.y
			&& fly.y + 10 <= gun.y + 30)
			||(fly.x + 10 >= gun.x
			&& fly.x + 10 <= gun.x + 40
			&& fly.y >= gun.y
			&& fly.y <= gun.y + 30)
			||(fly.x >= gun.x
			&& fly.x <= gun.x + 40
			&& fly.y + 10 >= gun.y
			&& fly.y + 10 <= gun.y + 30)
			||(fly.x >= gun.x
			&& fly.x <= gun.x + 40
			&& fly.y >= gun.y
			&& fly.y <= gun.y + 30)

 			)

 		{
 			islose = true;
 		}


	}
 }



/* function draw,  
 * which call itself after 30ms
 * Handle the drawing of gun and flies
 */

function draw () {

	if(islose){
		lose();
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(background , 0 , 0 , canvas.width , canvas.height);
	gun.draw();
	drawBullet();
	drawFly();
	checkCollision();
	// TODO call checkShot here

	setTimeout(function () {
		draw();
	}, 30);
}


/* function createFly,
 * which call itself after 1 second
 * This function will create a new Fly with random x position
 * Use Math.random, y = 0 (start from top of canvas)
 * new fly object will be added into array flies[]
 */
function createFly () {

	var bird = new Fly (Math.random() * canvas.width , 0);
	flies.push(bird);
	//console.log(flies.length);

	setTimeout(function(){
		createFly();
	},1000);
}


function lose(){
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.font = "60px Arial";
	ctx.fillText("YOU LOSE!!!", canvas.width / 2,canvas.height / 2);
}




/* function control
 * the gun can only move in left, right direction
 * When press space, the gun will console "fired"
 */
function control () {
	// listen to window event, when the key pressed
	window.onkeydown = function(e) {

		// get the key code from event e
	   	var key = e.keyCode;

	   	if (key == 39){
	   		gun.x = gun.x + 40;
	   	}

	   	else if (key == 37){
	   		gun.x = gun.x - 40;
	   	}
	}
	window.onkeyup = function(e) {

		var key = e.keyCode;

	   	if (key == 32){
	   		// When press space, create a new bullet object
	   		// add it to the bullets array
	   		var bullet = new Bullet (gun.x + 15 , gun.y - 10);
	   		box.push(bullet);
	   		console.log(box.length);
	   	}
	}  	
	
}


// init game
function init () {
	draw();
	control();
	createFly();
}


init();