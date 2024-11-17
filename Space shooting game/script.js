const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');

let player = { x: 575, y: 750, width: 50, height: 50, bullets: [] };
let enemies = [];
let enemyFrequency = 1000; // milliseconds
let score = 0;
let gameOver = false;

// Load images
const playerImage = new Image();
playerImage.src = 'space.png'; // Replace with your image path
const enemyImage = new Image();
enemyImage.src = 'alien.png'; // Replace with your image path
const backgroundImage = new Image();

// Event Listener for Mouse Movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left - player.width / 2; // Center the player on the cursor
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
});

// Event Listener for Key Press to shoot
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        shoot();
    }
});

// Shoot bullets
function shoot() {
    const bullet = { x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 20 };
    player.bullets.push(bullet);
}

// Create enemies
function createEnemy() {
    const enemy = { x: Math.random() * (canvas.width - 50), y: 0, width: 50, height: 50 };
    enemies.push(enemy);
}

// Reset the game state
function resetGame() {
    player = { x: 575, y: 750, width: 50, height: 50, bullets: [] };
    enemies = [];
    score = 0;
    gameOver = false;
    restartButton.style.display = 'none';
    gameOverDisplay.style.display = 'none'; // Hide game over display
    scoreDisplay.style.display = 'block'; // Show score display
    scoreDisplay.textContent = `Score: ${score}`; // Initialize score display
    update();
}

// Update the game state
function update() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20); // Centered Game Over
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20); // Centered Score
        restartButton.style.display = 'block'; // Show restart button
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = 'yellow';
    player.bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }
    });

    // Draw enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.y += 2;
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        if (enemy.y + enemy.height > player.y && enemy.x < player.x + player.width && enemy.x + enemy.width > player.x) {
            gameOver = true;
        }
        player.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.y < enemy.y + enemy.height && bullet.x > enemy.x && bullet.x < enemy.x + enemy.width) {
                enemies.splice(enemyIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                score++; // Increase score on hit
                scoreDisplay.textContent = `Score: ${score}`; // Update score display
            }
        });
    });

    enemies = enemies.filter(enemy => enemy.y < canvas.height);

    requestAnimationFrame(update);
}

// Start the game loop and enemy creation
setInterval(createEnemy, enemyFrequency);
update();

// Restart button functionality
restartButton.addEventListener('click', resetGame);
