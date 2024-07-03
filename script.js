const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;

const TETROMINO_NAMES = ["O", "L", "J", "I", "T", "U", "Z", "S", "M"];

const TETROMINOS = {
    O: [
        [1, 1],
        [1, 1],
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
};

let tetromino = {
    name: "",
    matrix: [],
    column: 0,
    row: 0,
};

// Common functions

function convertPositionToIndex(row, col) {
    return row * PLAYFILED_COLUMNS + col;
}

function randomFigure() {
    return TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
}

// Generation functions

function generateTetromino() {
    const nameTetro = randomFigure(TETROMINO_NAMES);
    const matrix = TETROMINOS[nameTetro];
    const columnTetro = Math.floor(PLAYFILED_COLUMNS / 2 - matrix.length / 2);
    const rowTetro = 4;

    tetromino = {
        name: nameTetro,
        column: columnTetro,
        row: rowTetro,
        matrix: matrix,
    };
}

function generatePlayfield() {
    for (let i = 0; i < PLAYFILED_ROWS * PLAYFILED_COLUMNS; i++) {
        const div = document.createElement("div");
        document.querySelector(".tetris").appendChild(div);
    }

    playfield = new Array(PLAYFILED_ROWS)
        .fill()
        .map(() => new Array(PLAYFILED_COLUMNS).fill(0));
}

// Keyboard functions

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    if (event.key == "ArrowLeft") {
        tetromino.column -= 1;
        if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
            tetromino.column += 1;
        }
    }
    if (event.key == "ArrowRight") {
        tetromino.column += 1;
        if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
            tetromino.column -= 1;
        }
    }
    if (event.key == "ArrowDown") {
        tetromino.row += 1;
        if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
            tetromino.row -= 1;
        }
    }

    draw();
}

function draw() {
    drawPlayfield();
    cells.forEach((el) => el.removeAttribute("class"));
    drawTetromino();
}

// Collision functions

function isOutsideOfGameboard(row, column) {
    return (
        row + tetromino.matrix.length > PLAYFILED_ROWS ||
        column < 0 ||
        column > PLAYFILED_COLUMNS - tetromino.matrix.length
    );
}

// Drawing functions

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawPlayfield() {
    // playfield[4][3] = "O";

    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if (!playfield[row][column]) continue;
            const nameFigure = tetromino.name;
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(nameFigure);
        }
    }
}

generatePlayfield();
let cells = document.querySelectorAll(".tetris div");
generateTetromino();

draw();

// drawPlayfield();

// drawTetromino();
