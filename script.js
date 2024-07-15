const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;
let cells;
let paused = false;
let timedId;
let isGameOver = false;
let overlay = document.querySelector(".overlay");
let btnRestart = document.querySelector(".btn-restart");
let infoScoreValue = document.querySelector(".scores");
let scoreElement = document.querySelector(".score");
let score = 0;

const TETROMINO_NAMES = [
    "O",
    "R",
    "D",
    "L",
    "J",
    "I",
    "T",
    "U",
    "Z",
    "S",
    "M",
    "X",
];

const TETROMINOS = {
    O: [
        [1, 1],
        [1, 1],
    ],
    R: [
        [1, 1],
        [1, 0],
    ],
    D: [
        [1, 0],
        [0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    U: [
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 1],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    M: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    X: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
};

let tetromino = {
    name: "",
    matrix: [],
    column: 0,
    row: 0,
};

// Common functions

function init() {
    score = 0;
    scoreElement.innerHTML = score;
    isGameOver = false;
    generatePlayfield();
    cells = document.querySelectorAll(".tetris div");
    generateTetromino();

    moveDown();

    draw();
}

function convertPositionToIndex(row, col) {
    return row * PLAYFILED_COLUMNS + col;
}

function randomFigure(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// Generation functions

function generateTetromino() {
    const nameTetro = randomFigure(TETROMINO_NAMES);
    const matrix = TETROMINOS[nameTetro];
    const columnTetro = Math.floor(PLAYFILED_COLUMNS / 2 - matrix.length / 2);
    const rowTetro = -2;

    tetromino = {
        name: nameTetro,
        column: columnTetro,
        row: rowTetro,
        matrix: matrix,
    };
}

function generatePlayfield() {
    for (let i = 0; i < PLAYFILED_COLUMNS * PLAYFILED_ROWS; i++) {
        const div = document.createElement("div");
        document.querySelector(".tetris").append(div);
    }

    playfield = new Array(PLAYFILED_ROWS)
        .fill()
        .map(() => new Array(PLAYFILED_COLUMNS).fill(0));
}

// Keyboard and click functions

btnRestart.addEventListener("click", function () {
    document.querySelector(".tetris").innerHTML = "";
    overlay.style.display = "none";

    init();
});

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    // console.log(event);
    if (event.key == " ") {
        togglePaused();
    }
    if (!paused) {
        if (event.key == "Enter") {
            dropTetrominoDown();
        }
        if (event.key == "ArrowUp") {
            rotate();
        }
        if (event.key == "ArrowLeft") {
            moveTetrminoLeft();
        }
        if (event.key == "ArrowRight") {
            moveTetrminoRight();
        }
        if (event.key == "ArrowDown") {
            moveTetrminoDown();
        }
    }

    draw();
}

function moveTetrminoDown() {
    tetromino.row += 1;
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetromino();
    }
}
function moveTetrminoLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1;
    }
}
function moveTetrminoRight() {
    tetromino.column += 1;
    if (!isValid()) {
        tetromino.column -= 1;
    }
}

function draw() {
    cells.forEach((el) => el.removeAttribute("class"));
    drawPlayfield();
    drawTetromino();
}

function dropTetrominoDown() {
    while (isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
}

function togglePaused() {
    if (paused) {
        startGameLoop();
    } else {
        stopGameLoop();
    }
    // stopGameLoop();
    paused = !paused;
}

// Rotation functions

function rotate() {
    rotateTetromino();
    draw();
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino) {
    const M = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < M; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < M; j++) {
            rotateMatrix[i][j] = matrixTetromino[M - j - 1][i];
        }
    }
    return rotateMatrix;
}

// Collision functions

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (isOutsideOfGameboard(row, column)) {
                return false;
            }
            if (hasCollisions(row, column)) {
                return false;
            }
        }
    }

    return true;
}

function isOutsideOfTopGameboard(row) {
    return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column) {
    return (
        tetromino.matrix[row][column] &&
        (tetromino.row + row >= PLAYFILED_ROWS ||
            tetromino.column + column < 0 ||
            tetromino.column + column >= PLAYFILED_COLUMNS)
    );
}

function hasCollisions(row, column) {
    return (
        tetromino.matrix[row][column] &&
        playfield[tetromino.row + row]?.[tetromino.column + column]
    );
}

// Drawing functions

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (isOutsideOfTopGameboard(row)) {
                continue;
            }
            if (!tetromino.matrix[row][column]) {
                continue;
            }
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );

            cells[cellIndex].classList.add(name);
        }
    }
}

function drawPlayfield() {
    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if (!playfield[row][column]) {
                continue;
            }
            const nameFigure = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);

            cells[cellIndex].classList.add(nameFigure);
        }
    }
}

function countScore(destroyRows) {
    if (destroyRows == 1) {
        score += 50;
    }
    if (destroyRows == 2) {
        score += 100;
    }
    if (destroyRows == 3) {
        score += 200;
    }
    if (destroyRows == 4) {
        score += 500;
    }
    scoreElement.innerHTML = score;
}

function placeTetromino() {
    const tetrominoMatrixSize = tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (isOutsideOfTopGameboard(row)) {
                isGameOver = true;
                overlay.style.display = "flex";
                return;
            }
            if (tetromino.matrix[row][column] && tetromino.row + row >= 0) {
                playfield[tetromino.row + row][tetromino.column + column] =
                    tetromino.name;
            }
        }
    }

    let filledRows = findFilledRows();
    removeFilledRows(filledRows);
    countScore(filledRows.length);
    generateTetromino();
}

// Found filled functions

function findFilledRows() {
    const fillRows = [];
    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if (playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if (filledColumns == PLAYFILED_COLUMNS) {
            fillRows.push(row);
        }
    }

    return fillRows;
}

function removeFilledRows(filledRows) {
    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFILED_COLUMNS).fill(0);
}

function moveDown() {
    moveTetrminoDown();
    draw();
    stopGameLoop();
    startGameLoop();
}

function startGameLoop() {
    timedId = setTimeout(() => {
        requestAnimationFrame(moveDown);
    }, 700);
}

function stopGameLoop() {
    clearTimeout(timedId);
    timedId = null;
}

init();
