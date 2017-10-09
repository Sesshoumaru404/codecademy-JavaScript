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


const checkValue = (value) => {
	if (value < 1 || value > 99 || value === undefined ){
		return true;
	} else {
		return false;
	}
}

const checkType = (type) => {
	if (type === undefined){
		return true;
	}
	if (['rock', 'paper', 'scissors'].indexOf(type) < 0){
		return true ;
	}
	return false;
}

const setPlayerMoves = (player, type1, value1, type2, value2, type3, value3) => {
	const types = [type1, type2, type3];
	const values = [value1, value2, value3];
	for (i =0; i< values.length; i++){
		if (checkValue(values[i])){
			return;
		}
	}
	for (i =0; i< types.length; i++){
		if (checkType(types[i])){
			return 
		}
		types[i] = types[i].toLowerCase()
	}
	if ((value1 + value2 + value3) > 99){
		return;
	}
	if (player === 'Player One'){
		playerOneMoveOneType = types[0];
		playerOneMoveTwoType = types[1];
		playerOneMoveThreeType = types[2];
		playerOneMoveOneValue = value1;
		playerOneMoveTwoValue = value2;
		playerOneMoveThreeValue = value3;
	}	else if (player === 'Player Two') {
		playerTwoMoveOneType = types[0];
		playerTwoMoveTwoType = types[1];
		playerTwoMoveThreeType = types[2];
		playerTwoMoveOneValue = value1;
		playerTwoMoveTwoValue = value2;
		playerTwoMoveThreeValue = value3;
	}
};

const getRoundWinner = (round) => {
	const gameLogic = (pOneType, pOneValue, pTwoType, pTwoValue) => {
		if (checkValue(pOneValue) || checkValue(pTwoValue) ){
			return null;
		}
		if (checkType(pOneType) || checkType(pTwoType) ){
			return null;
		}
		if ( pOneType === pTwoType) {
			if (pOneValue === pTwoValue){
				return 'Tie';
			} else if ( pOneValue > pTwoValue) {
				return 'Player One';
			} else {
				return 'Player Two';
			}
		} else if ( pOneType === 'rock' && pTwoType === 'scissors' ) {
			return 'Player One';
		} else if ( pOneType === 'scissors' && pTwoType === 'paper' ) {
			return 'Player One';
		} else if ( pOneType === 'paper' && pTwoType === 'rock' ) {
			return 'Player One';
		} else {
			return 'Player Two';
		}
	};
	let winner;
	switch (round){
		case 1:
			winner = gameLogic(playerOneMoveOneType,playerOneMoveOneValue,playerTwoMoveOneType,playerTwoMoveOneValue);
			break;
		case 2:
			winner =  gameLogic(playerOneMoveTwoType,playerOneMoveTwoValue,playerTwoMoveTwoType,playerTwoMoveTwoValue);
			break;
		case 3:
			winner = gameLogic(playerOneMoveThreeType,playerOneMoveThreeValue,playerTwoMoveThreeType,playerTwoMoveThreeValue);
			break;
		default:
			winner = null;
			break;
	}

	return winner;

};


getGameWinner  = () => {

}


