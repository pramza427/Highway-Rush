playerPos = {x: 100, y:300};
enemyPos = [];
fuelCanPos = {x:-50, y:0};
direction = { left: false, right: false, up: false, down: false};
currentSpeed = 7;
playerSpeed = 10;
score = 0;
fuel = 200;
gameOver = false;
lives = 3;
frameCounter = 0;
width = window.innerWidth;
const gasImage = new Image(40, 50);
gasImage.src = "https://pramza427.github.io/Highway-Rush/pngs/can.png"
const playerImage = new Image(40, 50);
playerImage.src = "https://pramza427.github.io/Highway-Rush/pngs/playerCar.png"
enemyImages = []
// set canvas to window width
document.querySelector("#canvas").width = width;
// hide the game over div
document.querySelector("#gameOver").style.display = "none";

// Start the animation
function init() {
  // add enemy sprites to array
  for(var i = 0; i < 6; i++){
  	const enemyImage = new Image(100, 50);
  	enemyImage.src = "https://pramza427.github.io/Highway-Rush/pngs/enemy" + i + ".png";
  	enemyImages.push(enemyImage);
  }
  window.requestAnimationFrame(draw);
}

// heavy lifting animation function
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, width, 600); // clear canvas

  // spawn enemies based on current speed and frmae count
  enemyCount = Math.floor(currentSpeed/2);
  if(enemyPos.length <= enemyCount && frameCounter%(Math.floor((2400/currentSpeed)/enemyCount)) === 0){
    spawnEnemy();
  }
  // spawn fuel cans based on frame count
  if(frameCounter%700 === 0){
  	spawnFuel();
  }
  // change speed based on frame count
  if(frameCounter%1200 === 0){
  	if(currentSpeed < 15){
  		currentSpeed++;
  		console.log("Current Speed: " + currentSpeed);
  	}
  }

  updatePlayerPos();

  // draw and update enemies
  enemyPos.forEach(pos => {
	pos.x -= currentSpeed-4;
	// color and draw each enemy
    ctx.fillStyle = pos.color;
    ctx.drawImage(enemyImages[pos.color], pos.x, pos.y, 110, 50);
    // remove enemies that are off the screen
    if(pos.x < -110){
      index = enemyPos.indexOf(pos)
      enemyPos.splice(index, 1);
    }
  });
  
  // move and draw fuel can
  fuelCanPos.x -= currentSpeed-4
  ctx.drawImage(gasImage, fuelCanPos.x, fuelCanPos.y, 40, 50);

  // remove 1 life if player hits enemy
  if(enemyCollision(playerPos)){
  	lives--;
  	if(lives === 0)
  		gameOver = true;
  }
  
  // check if player is hitting fuel can
  fuelCollision();

  // Draw player
  ctx.drawImage(playerImage, playerPos.x, playerPos.y, 110, 50);

  drawBackground(ctx);

  // keep animating if game is not over
  if(!gameOver){
  	frameCounter++;  // keep track of game frames
    window.requestAnimationFrame(draw);
  }
  // otherwise stop animation and show game over div
  if(gameOver)
    document.querySelector("#gameOver").style.display = "block";  
}

// updates player Position depending on what keys are clicked
function updatePlayerPos(){
  if(direction.right == true){
    if(playerPos.x < canvas.width-100)
      playerPos.x += 12;
  }
  if(direction.left == true){
    if(playerPos.x > 0)
      playerPos.x -= 12;
  }
  if(direction.up == true){
    if(playerPos.y > 100)
      playerPos.y -= 12;
  }
  if(direction.down == true){
    if(playerPos.y < 450)
      playerPos.y += 12;
  }

  score += currentSpeed;
}

// spawns an enemy on a random lane at a random position in the lane
// with a random color
lastEnemyLane = 0; // keep track of last spawn to not overlap
function spawnEnemy(){
  // choose a lane, if it was the last one used then dont use it
  let lane = Math.floor(Math.random()*4); 
  if(lane == lastEnemyLane){
    lane++;
    if(lane > 3)
      lane = 0;
  }
  lastEnemyLane = lane;
  // set a vertical position in that lane
  let positionInLane = Math.floor(Math.random()*50);
  // then a little math to get the enemy y position
  let enemyY = 100 + lane*100 + positionInLane;
  // offset the x position to make the road feel more natural
  let xOffset = Math.floor(Math.random()*100);
  // set car color
  let carColor = Math.floor(Math.random()*5);
  // add enemy to enemy list
  enemyPos.push({x: width+xOffset, y: enemyY, color: carColor}); 
}

// check if pos object is hitting enemy
function enemyCollision(pos){
	hit = false;
	enemyPos.forEach( enemy => {
		xdist = Math.abs(enemy.x - pos.x);
		ydist = Math.abs(enemy.y - pos.y);
		// if distances are less than enemy size, its a hit
		// move enemy to off screen where they will be removed in draw
		if(xdist < 100 && ydist < 50){
			hit = true;
			enemy.x = -150;
		}
	});
	return hit;
}

// check gas can and player collisison
function fuelCollision(){
	xcan = Math.abs(fuelCanPos.x - playerPos.x);
	ycan = Math.abs(fuelCanPos.y - playerPos.y);
	// if colliding then remove gas can from screen,
	// then add value to fuel 
	if(xcan < 100 && ycan < 50){
		fuelCanPos = {x: -50, y:0}
		newfuel = fuel + 90;  // add fuel
		if(newfuel > 200)  // don't overshoot max 200
			fuel = 200;
		else 
			fuel = newfuel;
	}
}

// Spawns dark green rect for fuel and checks for enemy collision
function spawnFuel(){
	let lane = Math.floor(Math.random()*4);
  	fuelCanPos = {x: width+50, y: 130+lane*100}
  	if(enemyCollision(fuelCanPos))  // if colliding, move so it's not
  		fuelCollision.x += 130;
  	
}

// Draws the background and animates it
function drawBackground(ctx){
  // Draw lines on road
  for(let i = 2; i < 5; i++){
    for(let j = 0; j < width/10; j ++){
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = "5";
      ctx.beginPath();
      ctx.moveTo(j*100-score%100, i*100);
      ctx.lineTo(j*100+70-score%100, i*100);
      ctx.stroke();
    }
  }
  // Draw road
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 100, width, 400);
  ctx.fillStyle = "darkgray";
  ctx.fillRect(0, 80, width, 440);
  
  // Draw Score
  ctx.font = "30px Arial";
  ctx.fillText("Score: "+Math.floor(score/100), 50, 50);

  // Draw Lives
  ctx.fillText("Lives: "+lives, width-200, 50);

  // Draw Fuel
  ctx.font = "30px Arial";
  ctx.fillText("Fuel", width/2 - 200, 50);
  ctx.strokeStyle = "black";
  ctx.strokeRect(width/2 - 100, 20, 200, 40);

  // change fuel color depending on amount
  if(fuel > 50)
    ctx.fillStyle = "green";
  else
    ctx.fillStyle = "red";
  ctx.fillRect(width/2 - 100, 20, fuel, 40);

  // Decrement Fuel
  if(fuel > 0)
    fuel -= 0.1;
  if(fuel <= 0.1)
    gameOver = true;

}

// --------------- Start button Clicked -------------------- //
// Remove welcome div, show canvas, start animation
document.querySelector("#playGame").addEventListener("click", event => {
  document.querySelector("#welcome").style.display = "none";
  document.querySelector("#canvas").style.display = "block";
  init();
});

// --------------- Restart button Clicked -------------------- //
// Reset all values
document.querySelector("#restart").addEventListener("click", event => {
  document.querySelector("#gameOver").style.display = "none";
  fuel = 200;
  gameOver = false;
  playerPos = {x: 100, y:300};
  enemyPos = [];
  lives = 3;
  score = 0;
  currentSpeed = 7;
  init();
});

// --------------- keyboard listeners ---------------------- //
window.addEventListener('keydown', event => {
  if(event.key == "ArrowLeft" || event.key == "a")
      direction.left = true;
  if(event.key ==  "ArrowUp" || event.key == "w") // up arrow
      direction.up = true;
  if(event.key == "ArrowRight" || event.key == "d") // right arrow
      direction.right = true;
  if(event.key == "ArrowDown" || event.key == "s") // down arrow
      direction.down = true;
});

window.addEventListener('keyup', event => {
  if(event.key == "ArrowLeft" || event.key == "a")
      direction.left = false;
  if(event.key ==  "ArrowUp" || event.key == "w") // up arrow
      direction.up = false;
  if(event.key == "ArrowRight" || event.key == "d") // right arrow
      direction.right = false;
  if(event.key == "ArrowDown" || event.key == "s") // down arrow
      direction.down = false;
});
// --------------- keyboard listeners ---------------------- //

// --------------- window resize listener ------------------ //
window.addEventListener('resize', event =>{
	width = window.innerWidth;
	document.querySelector("#canvas").width = width;
});
