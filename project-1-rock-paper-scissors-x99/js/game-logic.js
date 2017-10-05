// All code should be written in this file.
//
let playerOneMoveOneType;
let playerOneMoveTwoType;
let playerOneMoveThreeType;
let playerTwoMoveOneType;
let playerTwoMoveTwoType;
let playerTwoMoveThreeType;
let playerOneMoveOneValue;
let playerOneMoveTwoValue;
let playerOneMoveThreeValue;
let playerTwoMoveOneValue;
let playerTwoMoveTwoValue;
let playerTwoMoveThreeValue;

const setPlayerMoves = (player, type1, value1, type2, value2, type3, value3) => {
	if (player === 'Player One'){
		playerOneMoveOneType = type1;
		playerOneMoveTwoType = type2;
		playerOneMoveThreeType = type3;
		playerOneMoveOneValue = value1;
		playerOneMoveTwoValue = value2;
		playerOneMoveThreeValue = value3;
	}	else if (player === 'Player Two') {
		playerTwoMoveOneType = type1;
		playerTwoMoveTwoType = type2;
		playerTwoMoveThreeType = type3;
		playerTwoMoveOneValue = value1;
		playerTwoMoveTwoValue = value2;
		playerTwoMoveThreeValue = value3;
	}
};

