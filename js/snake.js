// Defining convas variable
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// Config color
let color = [];
color[0] = {
  b: "black",
  sb: "brown",
  snakeH: "green",
  snakeB: "white",
  snakeS: "red",
  appleC: "yellow",
  wallC: "blue",
  textC: "white"
};
color[1] = {
  b: "black",
  sb: "#9ACC99",
  snakeH: "black",
  snakeB: "black",
  snakeS: "#9ACC99",
  appleC: "red",
  wallC: "black",
  textC: "white"
};
color[2] = {
  b: "#444444",
  sb: "#333333",
  snakeH: "white",
  snakeB: "white",
  snakeS: "#333333",
  appleC: "#FF1C4A",
  wallC: "white",
  textC: "white"
};

let colorMode;
let speedMode;
let levelMode;

// Game status
let running = false;

// create the unit
const box = 32;

// load audio files
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake
let snake = [];

snake[0] = {
  x : 9 * box,
  y : 10 * box
};

// create the food
let food = {
  x : Math.floor(Math.random()*17+1) * box,
  y : Math.floor(Math.random()*15+3) * box
}

// Create wall
let wall = [
  [{x : 3*box, y : 5*box}, {x : 3*box, y : 6*box}, {x : 3*box, y : 7*box}],
  [{x : 15*box, y : 13*box}, {x : 15*box, y : 14*box}, {x : 15*box, y : 15*box}],
  [{x : 12*box, y : 6*box}, {x : 13*box, y : 6*box}, {x : 14*box, y : 6*box}],
  [{x : 4*box, y : 14*box}, {x : 5*box, y : 14*box}, {x : 6*box, y : 14*box}],
  [{x : 7*box, y : 8*box}, {x : 8*box, y : 8*box}, {x : 9*box, y : 8*box}],
  [{x : 9*box, y : 12*box}, {x : 10*box, y : 12*box}, {x : 11*box, y : 12*box}]
];

wallNum = [];

// create the score var
let score = 0;
let highScore = 0;

//control the snake
let d;

document.addEventListener("keydown",direction);

function direction(event){
  let key = event.keyCode;
  if( key == 37 && d != "RIGHT"){
    left.play();
    d = "LEFT";
  }else if(key == 38 && d != "DOWN"){
    d = "UP";
    up.play();
  }else if(key == 39 && d != "LEFT"){
    d = "RIGHT";
    right.play();
  }else if(key == 40 && d != "UP"){
    d = "DOWN";
    down.play();
  }else if(key == 32){
    console.log("Space press");
  }
}

// Store scores
function storeScore() {
  console.log("Storing Score");
  var storage = localStorage.getItem('Score');
  if(storage) storage = JSON.parse(storage);
  else storage = [];

  console.log("Before:");
  console.log(storage);

  // Push value to array
  storage.push(score);

  console.log("After:");
  console.log(storage);
  // Stringify the array into text to store.
  localStorage.setItem('Score',JSON.stringify(storage));
}

// Store high scores
function storeHighScore() {
  console.log("Storing High Score");

  console.log("HighScore:");
  console.log(highScore);
  // Stringify the array into text to store.
  localStorage.setItem('HighScore',highScore);
}

// cheack collision function
function collision(head,array){
  for(let i = 0; i < array.length; i++){
    if(head.x == array[i].x && head.y == array[i].y) return true;
  }
  return false;
}

// cheack collision wall function
function collisionWall(head){
  for( let i = 0; i < wallNum.length; i++){
    let temp = wallNum[i];
    if(head.x == wall[temp][0].x && head.y == wall[temp][0].y) return true;
    if(head.x == wall[temp][1].x && head.y == wall[temp][1].y) return true;
    if(head.x == wall[temp][2].x && head.y == wall[temp][2].y) return true;
  }
  return false;
}

// Check apple location
function appleLocation(){
  console.log("Apple location checking!");
  for( let i = 0; i < wallNum.length; i++){
    let temp = wallNum[i];
    if(food.x == wall[temp][0].x && food.y == wall[temp][0].y) return true;
    if(food.x == wall[temp][1].x && food.y == wall[temp][1].y) return true;
    if(food.x == wall[temp][2].x && food.y == wall[temp][2].y) return true;
  }
  return false;
}

// draw everything to the canvas
function draw(){

  // Background Color
  ctx.beginPath();
  ctx.fillStyle = color[colorMode].b;
  ctx.fillRect(0, 0, 19*box, 19*box);
  ctx.closePath();
  ctx.fill();

  // Sub Background Color
  ctx.beginPath();
  ctx.fillStyle = color[colorMode].sb;
  ctx.fillRect(box, 3*box, 17*box, 15*box);
  ctx.closePath();
  ctx.fill();

  // Draw color
  for( let i = 0; i < snake.length ; i++){
    ctx.beginPath();
    ctx.fillStyle = ( i==0 )? color[colorMode].snakeH : color[colorMode].snakeB;
    ctx.fillRect(snake[i].x,snake[i].y,box,box);

    ctx.strokeStyle = color[colorMode].snakeS;
    ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    ctx.closePath();
  }

  // Food color
  ctx.beginPath();
  ctx.fillStyle = color[colorMode].appleC;
  ctx.fillRect(food.x, food.y, box, box);
  ctx.closePath();
  ctx.fill();

  // Draw wall
  for( let i = 0; i < wallNum.length; i++){
    let temp = wallNum[i];
    ctx.fillStyle = color[colorMode].wallC;
    ctx.fillRect(wall[temp][0].x, wall[temp][0].y, box, box);
    ctx.fillRect(wall[temp][1].x, wall[temp][1].y, box, box);
    ctx.fillRect(wall[temp][2].x, wall[temp][2].y, box, box);
    ctx.fill();
    ctx.closePath();
  }

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if( d == "LEFT") snakeX -= box;
  if( d == "UP") snakeY -= box;
  if( d == "RIGHT") snakeX += box;
  if( d == "DOWN") snakeY += box;

  // if the snake eats the food
  if(snakeX == food.x && snakeY == food.y){
    score++;
    eat.play();
    food = {
      x : Math.floor(Math.random()*17+1) * box,
      y : Math.floor(Math.random()*15+3) * box
    }
    // Apple location
    while(true){
      if(appleLocation()){
        food = {
          x : Math.floor(Math.random()*17+1) * box,
          y : Math.floor(Math.random()*15+3) * box
        }
      }else{
        break;
      }
    }
    // we don't remove the tail
  }else{
    // remove the tail
    snake.pop();
  }

  // add new Head
  let newHead = {
    x : snakeX,
    y : snakeY
  }

  // game over
  if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box ||
     collision(newHead, snake) || collisionWall(newHead)){
    clearInterval(game);
    dead.play();
    reset();
  }else{
    snake.unshift(newHead);
  }

  // Showing score
  ctx.beginPath();
  ctx.fillStyle = color[colorMode].textC;
  ctx.font = "45px Changa one";
  ctx.fillText("Score: " + score, box, 1.6*box);
  ctx.closePath();
}

// Reset function
function reset(){
  snake = [];
  snake[0] = {
    x : 9 * box,
    y : 10 * box
  };

  d = "";

  console.log("Game Resetted!");
  menuButton.innerHTML = "Start";
  gameStatus.innerHTML = "Game status: not running!";
  storeScore(score);

  let storage = localStorage.getItem('Score'); // Get local storage
  storage = JSON.parse(storage);  // If it exist parse it

  let temp = "";
  for(let i=0; i < storage.length; i++){
    temp = temp + "Your score : " + storage[i] + "<br>";
  }
  gameScore.innerHTML = temp;
  if(score > highScore) highScore = score;

  storeHighScore();

  gameHighScore.innerHTML = "Your high score: " + highScore;
  score = 0;

  running = false;
}

let game;
let menuButton;
let gameStatus;
let gameScore;
let gameHighScore;
let colorRadio;
let speedRadio;
let levelRadio;

window.onload = function start(){
  console.log("Window loaded!");
  menuButton = document.getElementById("menu-button");
  gameStatus = document.getElementById("game-status");
  gameScore = document.getElementById("game-score");
  gameHighScore = document.getElementById("game-high-score");

  colorRadio = document.getElementsByName("color");
  speedRadio = document.getElementsByName("speed");
  levelRadio = document.getElementsByName("level");

  let storage = localStorage.getItem('HighScore'); // Get local storage
  if(storage) highScore = storage;
  else highScore = 0;

  gameHighScore.innerHTML = "Your high score: " + highScore;

  let storageS = [];
  localStorage.setItem('Score',JSON.stringify(storageS));

};

// Clear score
function clearScore() {
  localStorage.removeItem('Score');
  localStorage.removeItem('HighScore');
  gameScore.innerHTML = "";
  highScore = 0;
  gameHighScore.innerHTML = "Your high score: " + highScore;
  console.log("Scored cleared!");
}

// Start game
function startGame() {
  console.log("Started game called!");

  for (var i = 0; i < 3; i++) {
    if (colorRadio[i].checked) colorMode = colorRadio[i].value;
    if (speedRadio[i].checked) speedMode = speedRadio[i].value;
    if (levelRadio[i].checked) levelMode = levelRadio[i].value;
  }

  switch (levelMode) {
    case '1':
      wallNum = [0, 1];
      break;
    case '2':
      wallNum = [0, 1, 2, 3];
      break;
    case '3':
      wallNum = [0, 1, 2, 3, 4, 5];
      break;
  }

  console.log(colorMode + " -- " + speedMode + " -- " + wallNum);

  if(running){
    // Pause game
    clearInterval(game);
    running = false;
    console.log("Game Paused!");
    gameStatus.innerHTML = "Game status: paused!";
    menuButton.innerHTML = "Resume";
  } else{
    // Resume game
    game = setInterval(draw, speedMode);
    running = true;
    console.log("Game Resumed");
    gameStatus.innerHTML = "Game status: running!";
    menuButton.innerHTML = "Pause";
  }
}
