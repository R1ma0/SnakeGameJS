let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scoreCounter = document.getElementById("scoreValue");
let topScoreValue = document.getElementById("topScoreValue");

let blockSize = 25;
let colNumber = 15;
let rowNumber = 15;

let currentFrameStep = 0;
let defaultMaxFrameStep = 25;
let maxFrameStep = 25;

let gameScore = 0;
let topGameScore = 0;
let applePosition;
let snakeSegments = [[0, 0]];
let deltaX = 1;
let deltaY = 0;
let snakeHeadColor = "#02eb29";
let snakeTailColor = "#00ff2a";
let appleColor = "red";

window.onload = function() {
    canvas.width = colNumber * blockSize;
    canvas.height = rowNumber * blockSize;
    document.addEventListener("keydown", changeMovementDirection);
    applePosition = placeRectangleAtRandomCoordinates();
    loadTopScoreValue();
    displayTopGameScore();
    requestAnimationFrame(startGameLoop);
}

function drawGrid() {
    for (let i = 0; i < canvas.width; i += blockSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += blockSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function startGameLoop() {
    requestAnimationFrame(startGameLoop);
    
    if (++currentFrameStep < maxFrameStep) {
        return;
    }
    currentFrameStep = 0;
    
    clearCanvas();
    drawGrid();
    drawApple();
    drawSnake();
    moveSnake();
    checkSnakeCollisions();
    checkAppleCollision();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snakeSegments.forEach((segment, index) => {
        let segmentColor = (index === 0) ? snakeHeadColor : snakeTailColor;
        drawRect(segment[0], segment[1], segmentColor);
    });
}

function drawApple() {
    drawRect(applePosition[0], applePosition[1], appleColor);
}

function moveSnake() {
    let x = snakeSegments[0][0] + deltaX;
    let y = snakeSegments[0][1] + deltaY;

    snakeSegments.unshift([x, y]);
    snakeSegments.pop();
}

function checkAppleCollision() {
    let isXPositionsEqual = snakeSegments[0][0] - deltaX === applePosition[0];
    let isYPositionsEqual = snakeSegments[0][1] - deltaY === applePosition[1];
    
    if (isXPositionsEqual && isYPositionsEqual) {
        increaseSnake();
        placeAppleAtNewPosition();
        increaseScoreCounter();
    }
}

function placeAppleAtNewPosition() {
    applePosition = placeRectangleAtRandomCoordinates();
    
    snakeSegments.forEach(segment => {
        if (applePosition[0] === segment[0] && applePosition[1] === segment[1]) {
            placeAppleAtNewPosition();
        }
    });
}

function placeRectangleAtRandomCoordinates() {
    return [
        getRandomInteger(0, colNumber - 1), 
        getRandomInteger(0, rowNumber - 1)
    ];
}

function checkSnakeCollisions() {
    let headX = snakeSegments[0][0];
    let headY = snakeSegments[0][1];
    
    // Collision with border
    let borderCollisionByX = headX < 0 || headX >= colNumber;
    let borderCollisionByY = headY < 0 || headY >= rowNumber;
    
    if (borderCollisionByX || borderCollisionByY) {
        resetGame();
    }
    
    // Collision with tail
    for(let i = 1; i < snakeSegments.length; i++) {
        if (headX === snakeSegments[i][0] && headY === snakeSegments[i][1]) {
            resetGame();
        }
    }
}

function resetGame() {
    applePosition = placeRectangleAtRandomCoordinates();
    snakeSegments = [[0, 0]];
    deltaX = 1;
    deltaY = 0;
    maxFrameStep = defaultMaxFrameStep;
    resetScore();
}

function increaseScoreCounter() {
    scoreCounter.innerHTML = ++gameScore;
    increaseSnakeSpeed();
    updateTopScoreValue();
}

function increaseSnakeSpeed() {
    if (maxFrameStep > 0) {
        maxFrameStep -= 0.25;
    }
}

function increaseSnake() {
    let lastSegmentPosition = snakeSegments[snakeSegments.length - 1];
    snakeSegments.push([lastSegmentPosition[0], lastSegmentPosition[1]]);
}

function resetScore() {
    gameScore = 0;
    scoreCounter.innerHTML = gameScore;
}

function drawRect(column, row, color) {
    ctx.fillStyle = color;
    ctx.fillRect(column * blockSize, row * blockSize, blockSize, blockSize);
}

function loadTopScoreValue() {
    topGameScore = localStorage.getItem("snakeTopScore");
}

function updateTopScoreValue() {
    if (gameScore > topGameScore) {
        localStorage.setItem("snakeTopScore", gameScore);
        displayTopGameScore();
    }
}

function displayTopGameScore() {
    topScoreValue.innerHTML = localStorage.getItem("snakeTopScore");
}

function getRandomInteger(min, max) {
    let number = min + Math.random() * (max + 1 - min);
    return Math.floor(number);
}

function changeMovementDirection(event) {
    if (event.code == "ArrowUp" && deltaY != 1) {
        deltaX = 0;
        deltaY = -1;
    }
    
    if (event.code == "ArrowDown" && deltaY != -1) {
        deltaX = 0;
        deltaY = 1;
    }
    
    if (event.code == "ArrowLeft" && deltaX != 1) {
        deltaX = -1;
        deltaY = 0;
    }
    
    if (event.code == "ArrowRight" && deltaX != -1) {
        deltaX = 1;
        deltaY = 0;
    }
}