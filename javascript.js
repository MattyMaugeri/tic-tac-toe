function GameBoard() {
    const cells = 9;
    const board = [];

    // Create the board
    for (let i = 0; i < cells; i++) {
        board.push(Cell());
    }

    const getBoard = () => board;

    const getNewBoard = () => {
        const newBoard = [];
        for (let i = 0; i < cells; i++) {
            newBoard.push(Cell());
        }
        board.splice(0, board.length, ...newBoard);
    }

    const placeMarker = (cell, player) => {
        board[cell].addMarker(player);
    }


    return { getBoard, placeMarker, getNewBoard };
}


function Cell() {
    let value = '';

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;


    return { getValue, addMarker };
}


function GameController() {
    let board = GameBoard();

    const players = [
        {
            name: '',
            marker: 'X',
            array: []
        },
        {
            name: '',
            marker: 'O',
            array: []
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const setPlayersNames = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
    }
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const resetPlayerChoices = () => {
        activePlayer = players[0];

        players[0].array.splice(0, players[0].array.length);
        players[1].array.splice(0, players[1].array.length);
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

    const gridDiv = document.querySelector('.grid');

    const startGame = () => {
        gridDiv.classList.remove('disabled');
        board.getNewBoard();
        resetPlayerChoices();
    }

    const isFull = (grid) => {
        return grid.every(item => item.getValue());
    }

    const playRound = (cell) => {
        if (board.getBoard()[cell].getValue() === '') {
            board.placeMarker(cell, getActivePlayer().marker);
            getActivePlayer().array.push(parseInt(cell));
        } else {
            return;
        }

        // Check for a tie
        if (isFull(board.getBoard())) {
            gridDiv.classList.add('disabled');
        }

        // Check for a win
        if (checkWin()) {
            const gridDiv = document.querySelector('.grid');
            gridDiv.classList.add('disabled');
        } else {
            switchPlayerTurn();
        }
    }

    return {
        getActivePlayer, playRound, getBoard: board.getBoard,
        getNewBoard: board.getNewBoard, resetPlayerChoices, startGame,
        setPlayersNames, checkWin, isFull
    }
}


function ScreenController() {
    const game = GameController();

    const boardDiv = document.querySelector('.board');
    const gridDiv = document.querySelector('.grid');
    const displayDiv = document.querySelector('.display');

    const updateScreen = () => {
        // Clear screen
        gridDiv.textContent = '';

        // Show most up-to-date board and player
        const board = game.getBoard();

        // Display current players name
        displayDiv.textContent = `${game.getActivePlayer().name}'s turn`;

        // Iterate through the board adding a button and id to each cell
        board.forEach((cell, index) => {
            const cellBtn = document.createElement('button');

            cellBtn.classList.add('cell');
            cellBtn.id = index;
            cellBtn.textContent = cell.getValue();
            gridDiv.appendChild(cellBtn);
        });
    }

    const clearScreen = () => {
        // Clear screen
        gridDiv.textContent = '';

        // Retrieve a new board
        game.getNewBoard();

        // Reset players choices
        game.resetPlayerChoices();

        updateScreen();

        // Reset display text
        displayDiv.textContent = 'Enter Players Details';

        // Disable buttons
        gridDiv.classList.add('disabled');
    }

    const form = document.getElementById('player-form');

    const winnerScreen = () => {
        displayDiv.textContent = `${game.getActivePlayer().name} has won!`;
        game.getNewBoard();
        form.classList.add('disabled');
    }

    const tieScreen = () => {
        displayDiv.textContent = 'Game is a Tie!';
        gridDiv.classList.add('disabled');
        game.getNewBoard();
        form.classList.add('disabled');
    }

    const clickHandlerBoard = (e) => {
        const target = e.target;
        const selectedCell = e.target.id;

        if (target.parentNode.id === 'restart-btn') {
            console.log('restart btn clicked');
            clearScreen();
            form.classList.remove('disabled');
            // Filter through each form input and empty it
            document.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
        }

        if (e.target.id === 'start-btn') {
            game.startGame();
        }

        if (!selectedCell) return;
        game.playRound(selectedCell);

        updateScreen();

        // Check for winner or tie scenario
        if (game.checkWin()) {
            winnerScreen();
        } else if (game.isFull(game.getBoard())) {
            tieScreen();
        }
    }

    // Retrieve names from the form
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let playerOne = document.getElementById('name1').value;
        let playerTwo = document.getElementById('name2').value;

        game.setPlayersNames(playerOne, playerTwo);

        // Initially set the display to first players name
        displayDiv.textContent = `${playerOne}'s turn`;
    })

    // Initially update screen content
    updateScreen();
    displayDiv.textContent = 'Enter Players Details'
    
    boardDiv.addEventListener('click', clickHandlerBoard);

}

ScreenController();