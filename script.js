const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const topScoreElement = document.getElementById("topScore");

const grid = 20;
const canvasSize = 400;
let count = 0;
let applesCollected = 0;
let topScore = localStorage.getItem("topScore") || 0;
let speed = 4; // Initial speed
let gameOver = false; // Flag to indicate game over

topScoreElement.textContent = `Top Score: ${topScore}`;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4,
};

let apple = {
  x: getRandomInt(0, canvasSize / grid) * grid,
  y: getRandomInt(0, canvasSize / grid) * grid,
};

const gameOverSound = new Audio("gameover.mp3"); // Path to game over sound

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateApple() {
  let newApple;
  while (true) {
    newApple = {
      x: getRandomInt(0, canvasSize / grid) * grid,
      y: getRandomInt(0, canvasSize / grid) * grid,
    };
    // Ensure the new apple is not on the snake
    if (
      !snake.cells.some(
        (cell) => cell.x === newApple.x && cell.y === newApple.y
      )
    ) {
      break;
    }
  }
  apple = newApple;
  console.log(`New apple at (${apple.x}, ${apple.y})`);
}

function loop() {
  if (gameOver) return; // Stop the game loop if game is over

  requestAnimationFrame(loop);

  if (++count < speed) {
    return;
  }

  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  snake.cells.forEach(function (cell, index) {
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      applesCollected++;
      console.log(`Apple collected! Total: ${applesCollected}`);
      generateApple();

      // Increase speed every 10 apples collected
      if (applesCollected % 10 === 0) {
        speed = Math.max(1, speed - 0.5); // Decrease the interval to increase speed
      }
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        if (applesCollected > topScore) {
          topScore = applesCollected;
          localStorage.setItem("topScore", topScore);
          topScoreElement.textContent = `Top Score: ${topScore}`;
        }
        gameOverSound.play();
        gameOver = true; // Set game over flag
        setTimeout(() => {
          alert(`Game Over! Apples collected: ${applesCollected}`);
          document.location.reload();
        }, 500); // Delay to allow the game over sound to play
      }
    }
  });

  ctx.fillStyle = "green";
  snake.cells.forEach(function (cell) {
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
  });
}

document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      }
      break;
    case "ArrowUp":
      if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      }
      break;
    case "ArrowRight":
      if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      }
      break;
    case "ArrowDown":
      if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
      break;
  }
});

generateApple();
requestAnimationFrame(loop);
