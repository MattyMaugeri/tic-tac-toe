
function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create the board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Function methods
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

    // Function methods
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

    // Function methods
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
            [[0, 0], [0, 1], [0, 2]], // Top row
            [[1, 0], [1, 1], [1, 2]], // Middle row
            [[2, 0], [2, 1], [2, 2]], // Bottom row
            [[0, 0], [1, 0], [2, 2]]  // Left column
            [[0, 1], [1, 1], [2, 1]]  // Middle column
            [[0, 2], [1, 2], [2, 2]]  // Right column
            [[0, 0], [1, 1], [2, 2]]  // Left diagonal
            [[0, 2], [1, 1], [2, 0]]  // Right diagonal
        ];
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() === 0) {
            console.log(`Placing ${getActivePlayer().name}'s marker into row: ${row}; column: ${column}..`);
            board.placeMarker(row, column, getActivePlayer().marker);
            switchPlayerTurn();
        } else {
            console.log('Cell already taken, chose again ...');
        }

        // check for a win condition here

        printNewRound();
    }


    return { getActivePlayer, playRound, getBoard: board.getBoard }
}


function ScreenController() {
    const game = GameController();

    const gridDiv = document.querySelector('.grid');
    const displayDiv = document.querySelector('.display');

    // Function methods
    const updateScreen = () => {
        // Clear screen
        gridDiv.textContent = '';

        // Show most up-to-date board and player
        const board = game.getBoard();
        const currentPlayer = game.getActivePlayer();

        displayDiv.textContent = `${currentPlayer.name}'s turn ...`;

        // Iterate through board adding button to each cell
        // dataset attributes help determine which cell was clicked on
        let rowCount = 0;
        board.forEach((row) => {
            row.forEach((cell, index) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cell');

                cellBtn.dataset.row = rowCount;
                cellBtn.dataset.column = index;
                cellBtn.textContent = cell.getValue();
                gridDiv.appendChild(cellBtn);
            });
            rowCount++;
        });

    }

    const clickHandlerBoard = (e) => {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        // Ensure valid cell was selected
        if (!selectedColumn) return;
        if (!selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        
        updateScreen();
    }

    gridDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
}

ScreenController();