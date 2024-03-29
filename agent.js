// Implementation of minimax
//-----------------------------------------------------------------------
// create a gamestate class to hold all info about game state

class GameState {
    constructor(currentBoard, changedTile, parent) {
        this.currentBoard = currentBoard;
        this.changedTile = changedTile;
        this.utility = 0;
        this.parent = parent;
        this.child = [];
    }
    getUtility() {
        return this.utility;
    }
    calculateUtility() {
        // only calculate utility if it has no child
        if (this.child.length === 0) {
            if (checkForWin(this.currentBoard)) {
                if (winner === 2) {
                    this.utility = this.currentBoard.length * 10;
                    console.log("there was win in" + this.toString());

                }
                if (winner === 1) {
                    this.utility = -(this.currentBoard.length * 10);
                    console.log("there was win in" + this.toString());

                }
            }
            else {
                this.utility = 0;
            }
        }
        else {
            this.child.sort(function (a, b) { return b.getUtility() - a.getUtility() })
            // console.log("child:" + this.child.toString())
            // pick minimum if it's player 1 turn 
            if (turnCopy === 0) {
                this.utility = this.child[0].getUtility();
            }
            else if (turnCopy === 1) {
                console.log("here")
                let last = this.child.length - 1;
                this.utility = this.child[last].getUtility();
            }
        }
    }
    getChangedTile() {
        return this.utility = this.changedTile;
    }
    addChild(child) {
        this.child.push(child);
    }
}
// to string method for gamestate for debugging purposes
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
    return boardString.concat("\n" + this.getUtility());
}
//-----------------------------------------------------------------------
// functions to get info for minimax algorithm

function getPossibleMoves(currentBoard) {
    var emptyTiles = [];
    var emptyTileCount = 0;
    // return an array of tiles that are empty
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (currentBoard[i][j].player === 0) {
                emptyTiles[emptyTileCount] = currentBoard[i][j];
                emptyTileCount++;
            }
        }
    }
    return emptyTiles;
}

function generateGameStates(gameState) {
    // so we can use the turn number without affecting the actual turn 
    let allPossibleStates = [];
    let maxUtility = -1000;
    let possibleMoves = getPossibleMoves(gameState.currentBoard);
    let cx, cy, i, j;
    for (let k = 0; k < possibleMoves.length; k++) {
        let oldBoard = copyBoard(gameState.currentBoard);
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
        // parent state for this is the current gamestate 
        let newState = new GameState(newBoard, possibleMoves[k], gameState);
        // console.log(newState.toString())
        gameState.addChild(newState);
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

//-----------------------------------------------------------------------
// helper methods used 

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
// currently not used
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