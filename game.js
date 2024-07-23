const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    adjustSizes();
}
window.addEventListener('resize', resizeCanvas);

let player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    speed: 8,
    dx: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

let score = 0;
let speedIncreaseInterval = 5000; // 5 seconds

const obstacles = [
    { x: 200, y: 300, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 400, width: 100, height: 20 }
];

function adjustSizes() {
    // Adjust player size
    player.width = canvas.width * 0.1;
    player.height = canvas.height * 0.03;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;

    // Adjust ball size
    ball.size = canvas.width * 0.02;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    document.getElementById('score').innerText = score;
}

function drawObstacles() {
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
    player.x += player.dx;

    // Wall detection
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left/right)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Wall collision (top)
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (
        ball.y + ball.size > player.y &&
        ball.x > player.x &&
        ball.x < player.x + player.width
    ) {
        ball.dy = -ball.speed;
        score++;
    }

    // Obstacle collision
    obstacles.forEach(obstacle => {
        if (
            ball.x + ball.size > obstacle.x &&
            ball.x - ball.size < obstacle.x + obstacle.width &&
            ball.y + ball.size > obstacle.y &&
            ball.y - ball.size < obstacle.y + obstacle.height
        ) {
            ball.dy *= -1;
        }
    });

    // Bottom wall collision - Game Over
    if (ball.y + ball.size > canvas.height) {
        document.location.reload();
    }
}

function increaseSpeed() {
    ball.speed += 1;
    if (ball.dx > 0) {
        ball.dx += 1;
    } else {
        ball.dx -= 1;
    }
    if (ball.dy > 0) {
        ball.dy += 1;
    } else {
        ball.dy -= 1;
    }
}

function update() {
    clear();
    drawPlayer();
    drawBall();
    drawScore();
    drawObstacles();
    movePlayer();
    moveBall();

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Touch event handlers
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(e) {
    const touch = e.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    if (touchX < player.x + player.width / 2) {
        player.dx = -player.speed;
    } else {
        player.dx = player.speed;
    }
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    player.x = touchX - player.width / 2;

    // Wall detection
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function handleTouchEnd(e) {
    player.dx = 0;
}

// Increase ball speed every 5 seconds
setInterval(increaseSpeed, speedIncreaseInterval);

update();
