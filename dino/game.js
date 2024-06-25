const gameCanvas = document.getElementById('gameCanvas');
const gameContext = gameCanvas.getContext('2d');
const bgMusic = document.getElementById('ambientSound');
const gameOverSound = document.getElementById('failSound');

const dinoRestingImage = new Image();
const dinoCollisionImage = new Image();
const dinoBackImage = new Image();
const dinoFrontImage = new Image();
const obstacleImage = new Image();
const cloudImage = new Image();

cloudImage.src = "images/nuvem.png";
obstacleImage.src = "images/obstaculo.png";
dinoRestingImage.src = "images/resting.png";
dinoCollisionImage.src = "images/colisao.png";
dinoBackImage.src = "images/back.png";
dinoFrontImage.src = "images/front.png";

// Variáveis do jogo
let dinoCharacter = {
    x: 50,
    y: 150,
    width: 40,
    height: 60,
    dy: 0,
    jumpStrength: 10,
    gravity: 0.5,
    grounded: false,
    image: dinoFrontImage,
};

let gameObstacles = [];
let gameClouds = [];
let gameSpeed = 5;
let playerScore = 0;
let frameCount = 0;

// Função para desenhar o dinossauro
function drawDino() {
    gameContext.drawImage(dinoCharacter.image, dinoCharacter.x, dinoCharacter.y, dinoCharacter.width, dinoCharacter.height);
}

// Função para desenhar obstáculos
function drawObstacles() {
    gameObstacles.forEach(obstacle => {
        gameContext.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para desenhar nuvens
function drawClouds() {
    gameClouds.forEach(cloud => {
        gameContext.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);
    });
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Função para atualizar obstáculos
function updateObstacles() {
    gameObstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    if (gameObstacles.length === 0 || gameObstacles[gameObstacles.length - 1].x < gameCanvas.width - 200) {
        let newObstacle = {
            x: gameCanvas.width,
            y: 160,
            width: randomIntFromRange(20, 40),
            height: randomIntFromRange(20, 40)
        };
        gameObstacles.push(newObstacle);
    }

    if (gameObstacles[0].x + gameObstacles[0].width < 0) {
        gameObstacles.shift();
        playerScore++;
    }
}

// Função para atualizar nuvens
function updateClouds() {
    gameClouds.forEach(cloud => {
        cloud.x -= 1;
    });

    if (gameClouds.length === 0 || gameClouds[gameClouds.length - 1].x < gameCanvas.width - 200) {
        let newCloud = {
            x: gameCanvas.width,
            y: randomIntFromRange(40, 80),
            width: 48,
            height: 20,
        };
        gameClouds.push(newCloud);
    }

    if (gameClouds[0].x + gameClouds[0].width < 0) {
        gameClouds.shift();
    }
}

// Função para detectar colisão
function detectCollision() {
    gameObstacles.forEach(obstacle => {
        if (
            dinoCharacter.x < obstacle.x + obstacle.width &&
            dinoCharacter.x + dinoCharacter.width > obstacle.x &&
            dinoCharacter.y < obstacle.y + obstacle.height &&
            dinoCharacter.y + dinoCharacter.height > obstacle.y
        ) {
            // Colisão detectada
            dinoCharacter.image = dinoCollisionImage;
            bgMusic.pause();
            gameOverSound.play();
            alert('Game Over! Score: ' + playerScore);
            document.location.reload();
        }
    });
}

// Função para atualizar o dinossauro
function updateDino() {
    if (dinoCharacter.grounded && dinoCharacter.dy === 0 && isJumping) {
        dinoCharacter.dy = -dinoCharacter.jumpStrength;
        dinoCharacter.grounded = false;
    }

    dinoCharacter.dy += dinoCharacter.gravity;
    dinoCharacter.y += dinoCharacter.dy;

    if (dinoCharacter.y + dinoCharacter.height > gameCanvas.height - 10) {
        dinoCharacter.y = gameCanvas.height - 10 - dinoCharacter.height;
        dinoCharacter.dy = 0;
        dinoCharacter.grounded = true;
    }

    if (frameCount == 10) {
        if (dinoCharacter.image == dinoFrontImage) {
            dinoCharacter.image = dinoBackImage;
        } else {
            dinoCharacter.image = dinoFrontImage;
        }
        frameCount = 0;
        playerScore++;
    }
}

// Variável para detectar se o jogador está tentando pular
let isJumping = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = false;
    }
});

// Função para desenhar o jogo
function draw() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawDino();
    drawObstacles();
    drawClouds();
}

// Função para atualizar o jogo
function update() {
    updateDino();
    updateObstacles();
    updateClouds();
    detectCollision();
    gameContext.fillStyle = "#505050";
    gameContext.font = "15px 'Press Start 2P'";
    gameContext.fillText(playerScore, 730, 80);
}

// Função principal do jogo
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
    frameCount++;
}

// Iniciar o loop do jogo
gameLoop();

