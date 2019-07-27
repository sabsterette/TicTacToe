// MINIMAX BEETCH 

// create a gamestate class  
class GameState {
    constructor(board, changedTile) {
        this.board = board;
        this.changedTile = changedTile;
        this.utility = function () {
            // if win give 50 points
            // first look over will look over agent's move
            // second look over will look at player's move

            // first look //
            if (checkForWin(board)) {
                return board.length * 10;
            }
            else {
                return 0;
            }
        }
    }
    getUtility() {
        return this.utility;
    }
    getChangedTile() {
        return this.changedTile;
    }
}

GameState.prototype.toString = function gameStateToString() {
    var boardString = "board \n";
    for (let j = 0; j < this.board.length; j++) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i][j].player === 0) {
                boardString.concat("|   |");
            }
            if (this.board[i][j].player === 1) {
                boardString.concat("| x |");
            }
            if (this.board[i][j].player === 2) {
                prinboardString.concat("| o |");
            }
            boardString.conCat("\n");
        }
    }
    return boardString;
}

function generateGameState(board) {
    var allPossibleStates = [];
    var possibleMoves = getPossibleMoves();
    var cx;
    var cy;
    var i;
    var j;
    for (let k = 0; k < possibleMoves.length; k++) {
        var oldBoard = board;
        // get the tile on the grid
        cx = possibleMoves[k].getX();
        cy = possibleMoves[k].getY();
        i = cx / w;
        j = cy / w;
        // change the tile on the board to be this possible move 
        oldBoard[i][j] = possibleMoves[k];
        var newBoard = oldBoard;
        var newState = new GameState(newBoard, possibleMoves[k]);
        allPossibleStates[k] = newState;
    }
    return allPossibleStates;
}