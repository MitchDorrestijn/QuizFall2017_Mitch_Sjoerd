let request = require ("superagent");
let assert = require ("assert");
let fs = require ("fs");
let path = require ("path");
let config = JSON.parse (fs.readFileSync (path.join (__dirname, "../config.json")));

describe ('API', () => {

	let url = `http://localhost:${config.port}/api`;
	let gameId;
	let teamIds = [];
	let questionId;
	let question;

	it ("Start a game", (done) => {
		request
			.post (url + '/games')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							gameId = res.body.password;
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Apply for a game 1/2", (done) => {
		request
			.post (url + '/games/' + gameId + '/teams')
			.send ({name: "Henk"})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							teamIds.push (res.body.teamId);
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Apply for a game 2/2", (done) => {
		request
			.post (url + '/games/' + gameId + '/teams')
			.send ({name: "Sjon"})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							teamIds.push (res.body.teamId);
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Approve team 1/2", (done) => {
		request
			.put (url + '/games/' + gameId + '/teams/' + teamIds [0])
			.send ({approved: true})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Approve team 2/2", (done) => {
		request
			.put (url + '/games/' + gameId + '/teams/' + teamIds [1])
			.send ({approved: true})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Start a new round", (done) => {
		request
			.post (url + '/games/' + gameId + '/rounds')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Get current round", (done) => {
		request
			.get (url + '/games/' + gameId + '/rounds/current')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						if (res.body.activeRound === 0) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					}
				}
			});
	});

	it ("Add questions to a round", (done) => {
		request
			.post (url + '/games/' + gameId + '/rounds/current/questions')
			.send ({categories: ["Algemeen", "Muziek", "Geschiedenis"]})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Get questions", (done) => {
		request
			.get (url + '/games/' + gameId + '/rounds/current/questions')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						questionId = res.body [0].questionId;
						question = res.body [0].question;
						done ();
					}
				}
			});
	});

	it ("Go to next question", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current')
			.send ({nextQuestion: questionId})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Get current question", (done) => {
		request
			.get (url + '/games/' + gameId + '/rounds/current/questions/current')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						if (res.body.question === question) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					}
				}
			});
	});

	it ("Answer question 1/2", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current/answers/current')
			.send ({team: "Henk", answer: "Right answer"})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Answer question 2/2", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current/answers/current')
			.send ({team: "Sjon", answer: "Wrong answer"})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Close question", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current/questions/current')
			.send ({close: true})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Get answers", (done) => {
		request
			.get (url + '/games/' + gameId + '/rounds/current/answers/current')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						let success = 0;
						for (let elem of res.body.teamAnswers) {
							if (elem.team === "Henk" && elem.answer === "Right answer") {
								success++;
							} if (elem.team === "Sjon" && elem.answer === "Wrong answer") {
								success++;
							}
						}
						if (success === 2) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					}
				}
			});
	});

	it ("Validate right answer", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current/answers/current')
			.send ({team: "Henk", correct: true})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Invalidate wrong answer", (done) => {
		request
			.put (url + '/games/' + gameId + '/rounds/current/answers/current')
			.send ({team: "Sjon", correct: false})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Validate scores 1/2", (done) => {
		request
			.get (url + '/games/' + gameId + '/scores')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						let success = 0;
						for (let elem of res.body.scores) {
							if (elem.team === "Henk" && elem.correctAnswers === 1) {
								success++;
							} else if (elem.team === "Sjon" && elem.correctAnswers === 0) {
								success++;
							}
						}
						if (success === 2) {
							done ();
						} else {
							assert.ok (false);
							done ();
						}
					}
				}
			});
	});

	it ("Close game", (done) => {
		request
			.put (url + '/games/' + gameId)
			.send ({closed: true})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						done ();
					}
				}
			});
	});

	it ("Validate scores 2/2", (done) => {
		request
			.get (url + '/games/' + gameId + '/scores')
			.send ({})
			.set ('Content-Type', 'application/json')
			.end ((err, res) => {
				if (err || !res.ok) {
					console.log (err);
					assert.ok (false);
					done ();
				} else {
					if (res.body.hasOwnProperty ('success')) {
						if (res.body.success) {
							done ();
						} else {
							console.log (res.body);
							assert.ok (false);
							done ();
						}
					} else {
						let success = 0;
						for (let elem of res.body.scores) {
							if (elem.team === "Henk" && elem.roundPoints === 4) {
								success++;
							} else if (elem.team === "Sjon" && elem.roundPoints === 2) {
								success++;
							}
						}
						if (success === 2) {
							done ();
						} else {
							assert.ok (false);
							done ();
						}
					}
				}
			});
	});
});