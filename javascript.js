
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // create the board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Method to retrive the board outside this function
    const getBoard = () => board;


    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    }

    const placeMarker = (row, column, player) => {
        board[row][column].addMarker(player);
    }

    return { getBoard, printBoard, placeMarker };
}

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { getValue, addMarker };
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    let board = GameBoard();

    const players = [
        {
            name: playerOneName,
            marker: 1
        },
        {
            name: playerTwoName,
            marker: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`Active player is: ${activePlayer.name}`);
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const winCondition = () => {
        const winConditions = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Left diagonal
            [2, 4, 6]  // Right diagonal
        ];

        
    }

    const playRound = (row, column) => {
        // might need to put this check in placeMarker() above
        if (board.getBoard()[row][column].getValue() === 0) {
            console.log(`Placing ${getActivePlayer().name}'s marker into row: ${row}; column: ${column}..`);
            board.placeMarker(row, column, getActivePlayer().marker);
            switchPlayerTurn();
        } else {
            console.log('Cell already taken, chose again ...');
        }

        // check for a win condition

        printNewRound();
    }


    return { getActivePlayer, playRound }

}


const game = GameController();
