const images = {};
const imageSources = {
  player: "img/player.png",
  rabbit: "img/rabbit.png",
  carrot: "img/carrot.png",
  potato: "img/potato.png",
  rotten: "img/rotten_potato.png",
  tile: "img/tile.png"
};

let loadedImages = 0;
const totalImages = Object.keys(imageSources).length;

for (let key in imageSources) {
  images[key] = new Image();
  images[key].src = imageSources[key];
  images[key].onload = () => {
    loadedImages++;
    if (loadedImages === totalImages) startGame();
  };
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 100;
const gridSize = 5;
let score = 0;
let gameSpeed = 1000; // Rabbit move every X ms
let gameOver = false;

// Characters
let player = { x: 0, y: 0 };
let rabbit = { x: 4, y: 4 };

// Items
let carrots = [];
let potatoes = [];
let rottenPotatoes = [];

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x * tileSize + 20, player.y * tileSize + 20, 60, 60);
}

function drawRabbit() {
  ctx.fillStyle = "brown";
  ctx.fillRect(rabbit.x * tileSize + 20, rabbit.y * tileSize + 20, 60, 60);
}

function drawItems() {
  carrots.forEach(pos => {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(pos.x * tileSize + 50, pos.y * tileSize + 50, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
  potatoes.forEach(pos => {
    ctx.fillStyle = "goldenrod";
    ctx.beginPath();
    ctx.arc(pos.x * tileSize + 50, pos.y * tileSize + 50, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
  rottenPotatoes.forEach(pos => {
    ctx.fillStyle = "darkgreen";
    ctx.beginPath();
    ctx.arc(pos.x * tileSize + 50, pos.y * tileSize + 50, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function spawnItem(list, avoidList) {
  let x = Math.floor(Math.random() * gridSize);
  let y = Math.floor(Math.random() * gridSize);
  if (
    !carrots.concat(potatoes, rottenPotatoes).some(p => p.x === x && p.y === y) &&
    !(player.x === x && player.y === y) &&
    !(rabbit.x === x && rabbit.y === y)
  ) {
    list.push({ x, y });
  }
}

function moveRabbit() {
  let dx = player.x - rabbit.x;
  let dy = player.y - rabbit.y;

  if (Math.abs(dx) > Math.abs(dy)) rabbit.x += Math.sign(dx);
  else rabbit.y += Math.sign(dy);

  // Check for potato collision
  for (let i = 0; i < potatoes.length; i++) {
    if (rabbit.x === potatoes[i].x && rabbit.y === potatoes[i].y) {
      rottenPotatoes.push(potatoes[i]);
      potatoes.splice(i, 1);
      break;
    }
  }

  // Game over check
  if (rabbit.x === player.x && rabbit.y === player.y) {
    alert("Game Over! Final score: " + score);
    gameOver = true;
  }
}

function collectItems() {
  for (let i = 0; i < carrots.length; i++) {
    if (player.x === carrots[i].x && player.y === carrots[i].y) {
      carrots.splice(i, 1);
      score += 1;
      break;
    }
  }
  for (let i = 0; i < potatoes.length; i++) {
    if (player.x === potatoes[i].x && player.y === potatoes[i].y) {
      potatoes.splice(i, 1);
      score += 3;
      break;
    }
  }
  for (let i = 0; i < rottenPotatoes.length; i++) {
    if (player.x === rottenPotatoes[i].x && player.y === rottenPotatoes[i].y) {
      rottenPotatoes.splice(i, 1); // No points
      break;
    }
  }
  document.getElementById("score").innerText = "Score: " + score;
}

function gameLoop() {
  if (gameOver) return;
  drawGrid();
  drawItems();
  drawPlayer();
  drawRabbit();
  collectItems();
}

setInterval(gameLoop, 100);

setInterval(() => {
  if (gameOver) return;
  spawnItem(carrots, []);
}, 1000);

setInterval(() => {
  if (gameOver) return;
  spawnItem(potatoes, []);
}, 5000);

setInterval(() => {
  if (gameOver) return;
  moveRabbit();
  gameSpeed *= 0.98; // Increase rabbit speed slowly
}, gameSpeed);

document.addEventListener("keydown", e => {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowUp":
      if (player.y > 0) player.y--;
      break;
    case "ArrowDown":
      if (player.y < gridSize - 1) player.y++;
      break;
    case "ArrowLeft":
      if (player.x > 0) player.x--;
      break;
    case "ArrowRight":
      if (player.x < gridSize - 1) player.x++;
      break;
  }
});
