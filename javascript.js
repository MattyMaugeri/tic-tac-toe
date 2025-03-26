
function GameBoard() {
    const cells = 9;
    const board = [];

    // Create the board
    for (let i = 0; i < cells; i++) {
        board.push(Cell());
    }

    // Function methods
    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map((cell) => cell.getValue()));
    }

    const placeMarker = (cell, player) => {
        board[cell].addMarker(player);
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
            marker: 1,
            array: []
        },
        {
            name: playerTwoName,
            marker: 2,
            array: []
        }
    ];

    let activePlayer = players[0];

    // Function methods
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    }

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2],  // Top row
            [3, 4, 5],  // Middle row
            [6, 7, 8],  // Bottom row
            [0, 3, 6],  // Left column
            [1, 4, 7],  // Middle column
            [2, 5, 8],  // Right column
            [0, 4, 8],  // Left diagonal
            [2, 4, 6]   // Right diagonal
        ];

        return winConditions.some(combination =>
            combination.every(value => getActivePlayer().array.includes(value)
            )
        );

    }

    const playRound = (cell) => {
        if (board.getBoard()[cell].getValue() === 0) {
            board.placeMarker(cell, getActivePlayer().marker);
            getActivePlayer().array.push(parseInt(cell));
        } else {
            console.log('Cell already taken, chose again ...');
        }

        // check for a win condition here
        if (checkWin()) {
            console.log(`${getActivePlayer().name} WON !!!`);
            return;
        } else {
            switchPlayerTurn();            
        }

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

        // Iterate through the board adding a button and id to each cell
        board.forEach((cell, index) => {
            const cellBtn = document.createElement('button');

            cellBtn.classList.add('cell');
            cellBtn.id = index;
            cellBtn.textContent = cell.getValue();
            gridDiv.appendChild(cellBtn);
        });
    }

    const clickHandlerBoard = (e) => {
        const selectedCell = e.target.id;

        if (!selectedCell) return;
        game.playRound(selectedCell);

        updateScreen();
    }

    gridDiv.addEventListener('click', clickHandlerBoard);
    updateScreen();
}

ScreenController();