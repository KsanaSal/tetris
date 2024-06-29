const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;

const TETROMINO_NAMES = ["O", "L", "I", "T", "U", "Z", "M"];

const TETROMINOS = {
    O: [
        [1, 1],
        [1, 1],
    ],
    L: [
        [1, 1],
        [1, 1],
    ],
    I: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [1, 1],
        [1, 1],
    ],
    U: [
        [1, 1],
        [1, 1],
    ],
    Z: [
        [1, 1],
        [1, 1],
    ],
    M: [
        [1, 1],
        [1, 1],
    ],
};

let tetromino = {
    name: "",
    matrix: [],
    column: 0,
    row: 0,
};

function generateTetromino() {
    const nameTetro = TETROMINO_NAMES[0];
    const matrix = TETROMINOS[0];
    const columnTetro = 5;
    const rowTetro = 4;

    tetromino = {
        name: nameTetro,
        column: columnTetro,
        row: rowTetro,
        matrix: matrix,
    };
}

function drawPlayfield() {
    // const name = tetromino.name;
    // const tetrominoMatrixSize = tetromino.matrix;
    // const column = tetromino.column;
    // const row = tetromino.row;
    playfield[4][3] = "O";

    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if (!playfield[row][column]) continue;
            const nameFigure = "O";
            const cellIndex = convertPosotionToIndex(row, column);
            cells[cellIndex].classList.add(nameFigure);
        }
    }
}

function convertPosotionToIndex(row, col) {
    return row * PLAYFILED_COLUMNS + col;
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

generatePlayfield();

let cells = document.querySelectorAll(".tetris div");

generateTetromino();

drawPlayfield();
