const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const startButton = document.getElementById("start-game");
const birdOptions = document.querySelectorAll(".bird-option");
const startMessage = document.getElementById("start-message");

canvas.width = 400;
canvas.height = 500;

let bird = {
    x: 50,
    y: canvas.height / 2 - 40,
    width: 50,
    height: 50,
    velocity: 0,
    gravity: 0.3,
    lift: -7
};

let birdImage = new Image();
let birdSelected = false;
let gameRunning = false;
let gameStarted = false;
let pipes = [];
let frame = 0;
let speed = 1.5;
let score = 0; // Variable para el puntaje

function showMessage(message) {
    let messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.innerText = message;
    document.body.appendChild(messageBox);
    setTimeout(() => { messageBox.remove(); }, 3000);
}

birdOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "gg") {
            showMessage("Este personaje se desbloqueará cuando su flaca le dé permiso");
            return;
        }
        birdImage.src = option.querySelector("img").src;
        birdSelected = true;
        startButton.classList.add("enabled");
        startButton.disabled = false;
    });
});

startButton.addEventListener("click", () => {
    if (birdSelected) {
        menu.style.display = "none";
        canvas.style.display = "block";
        startMessage.style.display = "block";
        gameRunning = true;
        gameStarted = false;
        bird.y = canvas.height / 2 - 40;
        bird.velocity = 0;
        pipes = [];
        speed = 1.5;
        frame = 0;
        score = 0; // Reiniciar score al empezar
        requestAnimationFrame(update);
    }
});

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function generatePipes() {
    let gap = 189;
    let minHeight = 189;
    let maxHeight = canvas.height - gap - 50;
    
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    let bottomHeight = canvas.height - gap - topHeight;

    pipes.push({
        x: canvas.width,
        width: 50,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false // Para contar puntos una sola vez
    });
}

function drawPipes() {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
    });
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            resetGame();
        }
    });

    if (bird.y + bird.height >= canvas.height) {
        resetGame();
    }
}

function resetGame() {
    gameRunning = false;
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawScore(); // Dibujar el score en pantalla
    
    if (gameStarted) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (frame % 120 === 0 || pipes.length === 0) {
            generatePipes();
        }

        pipes.forEach(pipe => {
            pipe.x -= speed;

            // Aumentar score cuando el pájaro pase un tubo
            if (pipe.x + pipe.width < bird.x && !pipe.passed) {
                score++;
                pipe.passed = true;
            }
        });

        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
        drawPipes();
        checkCollision();
    }

    frame++;
    requestAnimationFrame(update);
}

canvas.addEventListener("click", () => {
    if (!gameStarted) {
        gameStarted = true;
        startMessage.style.display = "none";
    } else {
        bird.velocity = bird.lift;
    }
});
