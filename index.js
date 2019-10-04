let defaultBoard;

const humanPlayer = 'O';
const aiPlayer = 'X';
const endModal = document.querySelector('.endgame')

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll('.cell');

const declareWinner = (who) => {
  document.querySelector('.endgame').style.display = 'block';
  document.querySelector('.endgame .message').innerText = who;
}

const emptySquares = () => defaultBoard.filter(square => typeof square === 'number');

const checkTie = () => {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].removeEventListener('click', turnClick, false)
    };
    declareWinner('Tie Game!');
    return true;
  } return false;
}

const minimax = (newBoard, player) => {
	let availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			let result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(player === aiPlayer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
const bestSpot = () => {
  return minimax(defaultBoard,aiPlayer).index;
}

const checkWin = (curentBoard, player) => {
  let plays = curentBoard.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, [])

    let gameWon = null;
    for (let [index, combo] of winCombos.entries()) {
      if (combo.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index, player};
      }
    }
    return gameWon;
  }

  const turn = (squareId, player) => {
    defaultBoard[squareId] = player;
    document.getElementById(squareId).textContent = player;

    let gameWon = checkWin(defaultBoard, player);

    const gameOver = (gameWon) => {
      winCombos[gameWon.index].map((index) => {
        document.getElementById(index).style.backgroundColor =
        gameWon.player === humanPlayer ? 'blue' : 'red';
      })

      cells.forEach((cell) => {
        cell.removeEventListener('click', turnClick, false);
      });
      declareWinner(gameWon.player === humanPlayer ? 'You win!' : 'You lose!');
    }

    if(gameWon) gameOver(gameWon);
  }

  const turnClick = (square) => {
    if (typeof defaultBoard[square.target.id] === 'number') {
      turn(square.target.id, humanPlayer);
      if (!checkWin(defaultBoard, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer)
    }
  }

const startGame = () => {
  endModal.style.display = 'none';
  defaultBoard = Array.from(Array(9).keys());

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', turnClick, false);
  })
}

startGame();