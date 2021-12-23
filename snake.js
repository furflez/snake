const readline = require('readline');
start();
const snake = [];
const food = {
    x: null,
    y: null
}

const maxX = 30;
const maxY = 10;

let lastDirection = 'right';

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
        if (key == '\u001B\u005B\u0041') {
            lastDirection = 'up';
        }
        if (key == '\u001B\u005B\u0043') {
            lastDirection = 'right';
        }
        if (key == '\u001B\u005B\u0042') {
            lastDirection = 'down';
        }
        if (key == '\u001B\u005B\u0044') {
            lastDirection = 'left';
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

    if (lastDirection === 'up') {
        snake[0].y -= 1;
    } else if (lastDirection === 'down') {
        snake[0].y += 1;
    } else if (lastDirection === 'left') {
        snake[0].x -= 1;
    } else if (lastDirection === 'right') {
        snake[0].x += 1;
    }



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
            } else if (y === 0 || y === maxY - 1) {
                line += '-';
            } else {
                // ☐◉
                if (snake.find((piece) => {
                    return piece.x === x && piece.y === y
                })) {
                    line += '☐';
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
        arrowInput();
        gameEngine();

        // updateSnake();


    }
}

function arrowInput(){
setTimeout(() =>{
    getArrowPressed();
    arrowInput();
}, 10);
}

function gameEngine() {
    setTimeout(() => {
        drawMap();
        updateSnake();
        if (gameOver) {
            return;
        } else {
            gameEngine();
        }
    }, 200);
}