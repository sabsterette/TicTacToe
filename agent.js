// MINIMAX BEETCH 

// create a gamestate class  
class GameState {
    constructor(currentBoard, changedTile) {
        // REMEMBER TO CHANGE COPY METHOD IF THIS CHANGED
        this.currentBoard = currentBoard;
        this.changedTile = changedTile;
        this.utility = 0;
    }
    getUtility() {
        return this.utility;
    }
    calculateUtility() {
        if (checkForWin(this.currentBoard)) {
            console.log("there was win in" + this.toString())
            this.utility = this.currentBoard.length * 10;
        }
        else {
            this.utility = 0;
        }
    }
    getChangedTile() {
        return this.utility = this.changedTile;
    }
}

GameState.prototype.toString = function gameStateToString() {
    var boardString = "board \n";
    for (let j = 0; j < boardSize; j++) {
        for (let i = 0; i < boardSize; i++) {
            if (this.currentBoard[i][j].player === 0) {
                boardString = boardString.concat("|   |");
            }
            if (this.currentBoard[i][j].player === 1) {
                boardString = boardString.concat("| x |");
            }
            if (this.currentBoard[i][j].player === 2) {
                boardString = boardString.concat("| o |");
            }
        }
        boardString = boardString.concat("\n");
    }
    return boardString;
}

function generateGameStates(currentBoard) {
    // so we can use the turn number without affecting the actual turn 
    let turnCopy = Object.assign(turn);
    let allPossibleStates = [];
    let maxUtility = -1000;
    let possibleMoves = getPossibleMoves();
    let cx;
    let cy;
    let i;
    let j;
    for (let k = 0; k < possibleMoves.length; k++) {
        let oldBoard = copyBoard(currentBoard);
        // get the tile on the grid
        cx = possibleMoves[k].getX();
        cy = possibleMoves[k].getY();
        i = cx / w;
        j = cy / w;
        // change the tile on the board to be this possible move 
        oldBoard[i][j] = copyTiles(possibleMoves[k]);
        if (turnCopy % 2 === 0) {
            oldBoard[i][j].player = 2;
        }
        else {
            oldBoard[i][j].player = 1;
        }
        let newBoard = copyBoard(oldBoard);
        let newState = new GameState(newBoard, possibleMoves[k]);
        newState.calculateUtility();
        if (newState.getUtility() > maxUtility) {
            allPossibleStates.unshift(newState);
            maxUtility = newState.getUtility();
        }
        else {
            allPossibleStates[k] = newState;
        }
    }
    return allPossibleStates;
}

function copyTiles(srcTile) {
    let x = Object.assign(srcTile.x);
    let y = Object.assign(srcTile.y);
    let tileCopy = new Tile(x, y);
    tileCopy.player = Object.assign(srcTile.player)
    return tileCopy;
}
function copyBoard(srcBoard) {
    let copyBoard = [];
    for (let i = 0; i < srcBoard.length; i++) {
        copyBoard[i] = [];
        for (let j = 0; j < srcBoard.length; j++) {
            copyBoard[i][j] = Object.assign(srcBoard[i][j])
        }
    }
    return copyBoard;
}

function copyGameState(gameState) {
    let copyBoard = [];
    for (let i = 0; i < gameState.length; i++) {
        copyBoard[i] = [];
        for (let j = 0; j < gameState.length; j++) {
            copyBoard[i][j] = Object.assign(gameState.currentBoard[i][j])
        }
    }
    let copyTile = copyTiles(gameState.changedTile);
    let copy = new GameState(copyBoard, copyTile);
    copy.currentBoard = copyBoard;
    return copy;
}