const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const rows = 8, cols = 8;
const cellSize = canvas.width / cols;
let board = Array.from({ length: rows }, () => Array(cols).fill(null));
let currentTurn = "black";

const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellSize, 0);
        ctx.lineTo(j * cellSize, canvas.height);
        ctx.stroke();
    }
    drawAllPieces();
}

function drawCircle(row, col, color) {
    ctx.beginPath();
    ctx.arc(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    if (color === "white") {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawAllPieces() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col]) drawCircle(row, col, board[row][col]);
        }
    }
}

function initializeBoard() {
    board[3][3] = "white";
    board[4][4] = "white";
    board[3][4] = "black";
    board[4][3] = "black";
    drawGrid();
}

function isValidMove(row, col, color) {
    if (board[row][col] !== null) return false;
    const opponent = color === "black" ? "white" : "black";
    for (let [dx, dy] of directions) {
        let r = row + dy;
        let c = col + dx;
        let foundOpponent = false;
        while (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (board[r][c] === opponent) {
                foundOpponent = true;
            } else if (board[r][c] === color && foundOpponent) {
                return true;
            } else {
                break;
            }
            r += dy;
            c += dx;
        }
    }
    return false;
}

function flipPieces(row, col, color) {
    const opponent = color === "black" ? "white" : "black";
    for (let [dx, dy] of directions) {
        let r = row + dy;
        let c = col + dx;
        let positions = [];
        while (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (board[r][c] === opponent) {
                positions.push([r, c]);
            } else if (board[r][c] === color && positions.length > 0) {
                for (let [fr, fc] of positions) {
                    board[fr][fc] = color;
                }
                break;
            } else {
                break;
            }
            r += dy;
            c += dx;
        }
    }
}

function hasValidMove(color) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (isValidMove(row, col, color)) return true;
        }
    }
    return false;
}

function countPieces() {
    let black = 0, white = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] === "black") black++;
            else if (board[row][col] === "white") white++;
        }
    }
    return { black, white };
}

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (!isValidMove(row, col, currentTurn)) return;
    board[row][col] = currentTurn;
    flipPieces(row, col, currentTurn);

    currentTurn = currentTurn === "black" ? "white" : "black";

    if (!hasValidMove(currentTurn)) {
        currentTurn = currentTurn === "black" ? "white" : "black";
        if (!hasValidMove(currentTurn)) {
            let result = countPieces();
            setTimeout(() => alert(`ゲーム終了\n黒:${result.black} 白:${result.white}\n勝者: ${result.black > result.white ? '黒' : result.white > result.black ? '白' : '引き分け'}`), 100);
        } else {
            alert(`${currentTurn} はパス`);
        }
    }

    drawGrid();
});

initializeBoard();
