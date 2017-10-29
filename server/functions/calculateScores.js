let calculateScores = (game) => {
	let roundId = game.activeRound;
	let scores = [];
	for (let elem of game.teams) {
		scores.push ({team: elem.name, correctAnswers: 0});
	}
	for (let i = 0; i < game.rounds [roundId].answers.length; i++) {
		for (let j = 0; j < game.rounds [roundId].answers [i].answers.length; j++) {
			if (game.rounds [roundId].answers [i].answers [j].approved) {
				for (let k = 0; k < scores.length; k++) {
					if (game.rounds [roundId].answers [i].answers [j].team === scores [k].team) {
						scores [k].correctAnswers++;
					}
				}
			}
		}
	}
	let first = 0;
	let second = 0;
	let third = 0;
	for (let i = 0; i < scores.length; i++) {
		if (scores [i].correctAnswers > first) {
			first = scores [i].correctAnswers;
		}
	}
	for (let i = 0; i < scores.length; i++) {
		if (scores [i].correctAnswers > second && scores [i].correctAnswers < first) {
			second = scores [i].correctAnswers;
		}
	}
	for (let i = 0; i < scores.length; i++) {
		if (scores [i].correctAnswers > third && scores [i].correctAnswers < second) {
			third = scores [i].correctAnswers;
		}
	}
	for (let i = 0; i < scores.length; i++) {
		for (let j = 0; j < game.teams.length; j++) {
			if (scores [i].team === game.teams [j].name) {
				if (scores [i].correctAnswers === first) {
					game.teams [j].roundPoints += 4;
				} else if (scores [i].correctAnswers === second) {
					game.teams [j].roundPoints += 2;
				} else if (scores [i].correctAnswers === third) {
					game.teams [j].roundPoints += 1;
				} else {
					game.teams [j].roundPoints += 0.1;
				}
			}
		}
	}
	return game;
};

module.exports = calculateScores;