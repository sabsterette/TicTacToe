var canvas = document.getElementById("ticTacToeCanvas");
var ctx = canvas.getContext("2d");
canvas.addEventListener("click", onmousedown, false);

var boardSize = 5;
var w = canvas.width / boardSize;
var board = [];

var canvasRect = canvas.getBoundingClientRect();
canvasX = canvasRect.x;
canvasY = canvasRect.y;
// sets who's turn it is 
var turn = 1;
var winner = 0;
var win = false;
// need tile class to control what shows on each space of the board 
// x, y are the top left corner of the tile
class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.player = 0;
    }
    drawTile() {
        ctx.beginPath();
        ctx.strokeRect(this.x, this.y, w, w);
        // ctx.beginPath();
        ctx.strokeStyle = "#FFFFFF";
        ctx.fill();
        if (this.player === 1) {
            ctx.moveTo(this.x + w / 4, this.y + w / 4);
            ctx.lineTo((this.x + w) - w / 4, (this.y + w) - w / 4);
            ctx.moveTo(this.x + w / 4, (this.y + w) - w / 4);
            ctx.lineTo((this.x + w) - w / 4, this.y + w / 4);
            ctx.stroke();
        }
        if (this.player === 2) {
            ctx.arc(this.x + w / 2, this.y + w / 2, w / 4, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.closePath();
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}

for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
        board[i][j] = new Tile(i * w, j * w);
        board[i][j].player = 0;
    }
}

function getPossibleMoves() {
    var emptyTiles = [];
    var emptyTileCount = 0;
    // return an array of tiles that are empty
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].player === 0) {
                emptyTiles[emptyTileCount] = board[i][j];
                emptyTileCount++;
            }
        }
    }
    return emptyTiles;
}

function selectRandomTile(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}


function checkBoardFull() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].player === 0) {
                return false;
            }
        }
    }
    return true;
}

function checkRow(boardArr, j) {
    var toMatch = boardArr[0][j].player;
    for (let i = 1; i < boardSize; i++) {
        if (boardArr[i][j].player !== toMatch) {
            return false;
        }
    }
    if (toMatch === 0) {
        return false;
    }
    winner = toMatch;
    return true;
}

function checkCol(boardArr, i) {
    var toMatch = boardArr[i][0].player;
    for (let j = 1; j < boardSize; j++) {
        if (boardArr[i][j].player !== toMatch) {
            return false;
        }
    }
    if (toMatch === 0) {
        return false;
    }
    winner = toMatch;
    return true;
}

function checkDiagDown(boardArr) {
    var toMatch = boardArr[0][0].player;
    for (let i = 1; i < boardSize; i++) {
        if (boardArr[i][i].player !== toMatch) {
            return false;
        }
    }
    if (toMatch === 0) {
        return false;
    }
    winner = toMatch;
    return true;
}
function checkDiagUp(boardArr) {
    var toMatch = boardArr[0][boardSize - 1].player;
    for (let i = 1; i < boardSize; i++) {
        if (boardArr[i][boardSize - 1 - i].player !== toMatch) {
            return false;
        }
    }
    if (toMatch === 0) {
        return false;
    }
    winner = toMatch
    return true;
}

function checkForWin(boardArr) {
    for (let j = 0; j < boardSize; j++) {
        if (checkRow(boardArr, j)) {
            return true;
        }
    }
    for (let i = 0; i < boardSize; i++) {
        if (checkCol(boardArr, i)) {
            return true;
        }
    }
    if (checkDiagDown(boardArr)) {
        return true;
    }
    if (checkDiagUp(boardArr)) {
        return true;
    }
    return false;
}
// player move 
function onmousedown(event) {
    if (turn % 2 === 1 && !win) {
        cx = event.x;
        cy = event.y;
        xOnCanvas = cx - canvasX;
        yOnCanvas = cy - canvasY;
        console.log("human" + Math.floor(xOnCanvas / w) + "," + (Math.floor(yOnCanvas / w)));
        i = Math.floor(xOnCanvas / w);
        j = Math.floor(yOnCanvas / w);
        if (board[i][j].player === 0) {
            board[i][j].player = 1;
            turn++;
        }
        if (turn > 5) {
            if (checkForWin(board)) {
                turn = 0;
                win = true;
            }
        }
    }
    else if (!win && !checkBoardFull()) {
        console.log("bot turn");
        botTurn();
        turn++;
    }
}

function botTurn() {
    let possibleStates = generateGameStates(board);
    console.log(possibleStates);
    if (possibleStates[0].getUtility() === 0) {
        var selectedState = selectRandomTile(possibleStates);
        let i = selectedState.changedTile.x / w;
        let j = selectedState.changedTile.y / w;
        board[i][j].player = 2;
    }
    else {
        // the first one has highest utility
        // need to apply the changedTile back onto the board's tile
        let i = possibleStates[0].changedTile.x / w;
        let j = possibleStates[0].changedTile.y / w;
        board[i][j].player = 2;
    }
    if (turn > 5) {
        if (checkForWin(board)) {
            turn = 0;
            win = true;
        }
    }
}

function draw() {
    // if (turn % 2 === 0 && !checkBoardFull() && !win) {
    //     console.log("bot turn");
    //     botTurn();
    //     turn++;
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.width);
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            board[i][j].drawTile();
        }
    }

    if (win) {
        alert("GAME OVER! Winner is: " + winner);
    }

    if (checkBoardFull()) {
        alert("IZZA TIE")
    }

}
setInterval(draw, 100);


