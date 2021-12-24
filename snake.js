const readline = require('readline');
start();
const snake = [];
const food = {
}
const maxX = 30;
const maxY = 10;

let direction = 'right';
let lastMove = 'right'

let gameOver = false;

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

function getArrowPressed() {
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.on('data', function (key) {
        if (key == '\u001B\u005B\u0041' && lastMove !== 'down') {
            direction = 'up';
        }
        if (key == '\u001B\u005B\u0043' && lastMove !== 'left') {
            direction = 'right';
        }
        if (key == '\u001B\u005B\u0042' && lastMove !== 'up') {
            direction = 'down';
        }
        if (key == '\u001B\u005B\u0044' && lastMove !== 'right') {
            direction = 'left';
        }

        if (key == '\u0003') { process.exit(); }    // ctrl-c
    });

}

function createSnake() {
    for (let index = 0; index < 4; index++) {
        snake[index] = {
            x: parseInt((maxX / 4)) + (4 - index),
            y: parseInt((maxY / 2))
        }
    }
}

function updateSnake() {

    for (let index = snake.length; index > 1; index--) {
        snake[index - 1].x = snake[index - 2].x;
        snake[index - 1].y = snake[index - 2].y;

    }

    if (direction === 'up') {
        lastMove = 'up';
        snake[0].y -= 1;
    } else if (direction === 'down') {
        lastMove = 'down';
        snake[0].y += 1;
    } else if (direction === 'left') {
        lastMove = 'left';
        snake[0].x -= 1;
    } else if (direction === 'right') {
        lastMove = 'right';
        snake[0].x += 1;
    }
    if (snake[0].x >= maxX - 1 || snake[0].x <= 0 || snake[0].y >= maxY - 1 || snake[0].y <= 0) {
        gameOver = true;
    }
    const collision = snake.slice(1, snake.length).find((piece) => {
        return piece.x === snake[0].x && piece.y === snake[0].y
    })
    if (collision) {
        gameOver = true;
    }

    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }

}

function addFood() {
    let added = false;
    do {
        food.x = Math.floor(Math.random() * (maxX - 1 + 1)) + 1;
        food.y = Math.floor(Math.random() * (maxY - 1 + 1)) + 1;

        if (food.x <= 0 || food.x >= maxX - 1 || food.y <= 0 || food.y >= maxY - 1) {
            added = false;
        } else {
            added = !snake.find((piece) => {
                return piece.x === food.x && piece.y === food.y;
            })
        }

    } while (!added);
}

function eatFood() {
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    addFood();
}

function drawMap() {
    console.clear();
    for (let y = 0; y < maxY; y++) {
        let line = ''
        for (let x = 0; x < maxX; x++) {
            if ((x === 0 && y === 0) ||
                (x === maxX - 1 && y === 0) ||
                (x === 0 && y === maxY - 1) ||
                (x === maxX - 1 && y === maxY - 1)) {
                line += ' ';
            } else if (x === 0 || x === maxX - 1) {
                line += '|';
            } else if (y === 0) {
                line += '_';
            } else if (y === maxY - 1) {
                line += '¨';

            } else {
                // ☐◉
                if (snake.find((piece) => {
                    return piece.x === x && piece.y === y
                })) {
                    line += '\u25A0';
                } else if (food.x === x && food.y === y) {
                    line += '◉';
                } else {
                    line += ' ';
                }
            }

        }
        console.log(line);

    }

}


async function start() {
    const startResponse = await askQuestion('iniciar? S/N: ');
    if (startResponse.toLowerCase() === 's') {
        createSnake();
        addFood();
        arrowInput();
        gameEngine();

        // updateSnake();


    }
}

function arrowInput() {
    setTimeout(() => {
        getArrowPressed();
        arrowInput();
    }, 10);
}

function gameEngine() {
    setTimeout(() => {
        drawMap();
        updateSnake();
        if (gameOver) {
            console.log('Game Over!')
            process.exit();
        } else {
            gameEngine();
        }
    }, 100);
}