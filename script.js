// Definindo os elementos do HTML
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Definir as variaveis do jogo
const gridSize = 20
let snake = [{x:10, y:10}]; //x10, y10 = meio do board
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Desenhar o mapa do jogo, a cobrinha e a comida
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Desenhar a cobra
function drawSnake(){
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
    })
}

// Criando a cobra ou comida
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className
    return element;
}

// Settando a posicao da cobra ou comida
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Testando a funcao de desenhar
// draw()

// Desenhar a comida
function drawFood(){
    if(gameStarted){
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement)
    }
}

// Cirar comida
function generateFood(){
    const x = Math.floor(Math.random() * gridSize ) + 1;
    const y = Math.floor(Math.random() * gridSize ) + 1;
    return {x, y}
}

// Mexer a cobrona :)
function move(){
    const head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head)
    if (head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // limpando intervalo
        eatAudio();
        gameInterval =  setInterval(() => {
            move();
            checkColission();
            draw();
        }, gameSpeedDelay);
    } else{
        snake.pop();
    }
}

// Teste mexer a cobra
/* setInterval(() => {
    move(); // mexe
    draw(); // redesenha com a posicao certa
}, 200) */

// Startar o jogo
function startGame(){
    gameStarted = true; // ficando de olho no jogo rodando  
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkColission();
        draw();
    }, gameSpeedDelay);
}

// teclado !
function handleKeyPress(event){
    if ((!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === '')){
        startGame();
    } else{
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break
            case 'ArrowDown':
                direction = 'down'
                break
            case 'ArrowLeft':
                direction = 'left'
                break
            case 'ArrowRight':
                direction = 'right'
                break
        }
    }
}
document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkColission(){
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    for (let i = 1;i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0')
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block';
}

function eatAudio(){
    var audio = document.getElementById('audio');
    audio.play();
}