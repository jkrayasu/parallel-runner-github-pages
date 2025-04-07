const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

// Load images
const playerImage = new Image();
playerImage.src = './images1/parallel2.png'; // Updated with the correct path

const obstacleImage = new Image();
obstacleImage.src = './images1/robot1.png'; // Updated with the correct path

let player = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    grounded: false
};

let obstacles = [];
let gameSpeed = 3;
let score = 0;
let gameOver = false;

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    if (Math.random() < 0.01) {
        obstacles.push({ x: canvas.width, y: canvas.height - player.height, width: 20, height: 20 }); //// Align obstacle y coordinate with player y coordinate
    }
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }
}

function jump() {
    if (player.grounded) {
        player.dy = player.jumpStrength;
    }
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
        }
    });
}

function updateScore() {
    score++;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
        restartButton.style.display = 'block'; // show the restart button
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObstacles();
    updatePlayer();
    updateObstacles();
    checkCollision();
    updateScore();

    requestAnimationFrame(gameLoop);
}

function restartGame() {
    player.y = 150;
    player.dy = 0;
    obstacles = [];
    score = 0;
    gameOver = false;
    restartButton.style.display = 'none'; // Hide the restart button
    gameLoop();
}

// Add event listeners for both keyboard and touch input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling on mobile
    jump();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

gameLoop();
