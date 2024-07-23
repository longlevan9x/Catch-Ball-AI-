const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    speed: 8,
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

let score = 0;
let speedIncreaseInterval = 5000; // 5 seconds

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
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 20, 30);
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

// Increase ball speed every 5 seconds
setInterval(increaseSpeed, speedIncreaseInterval);

update();
