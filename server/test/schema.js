let assert = require ("assert");
let mongoose = require ("mongoose");
let Schema = mongoose.Schema;
let Team = require ("../schema/teams.js").model;
let TeamAnswer = require ("../schema/teamAnswers.js").model;
let Answer = require ("../schema/answers.js").model;
let Question = require ("../schema/questions.js").model;
let Round = require ("../schema/rounds.js").model;
let Game = require ("../schema/games.js").model;

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

describe ('Schema', () => {

	let objectIdMock = mongoose.Types.ObjectId ("59ef07d7aadfa2616a17bbd3");

	describe ('Team', () => {

		it ("Names can not be null", (done) => {
			let team = new Team ({
				appliedGame: objectIdMock,
				name: null
			});
			team.validate ((err) => {
				assert.ok (err.errors.name);
				done ();
			});
		});

		it ("Applied game can not be null", (done) => {
			let team = new Team ({
				appliedGame: null,
				name: "Teamnaam"
			});
			team.validate ((err) => {
				assert.ok (err.errors.appliedGame);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let team = new Team ({
				appliedGame: objectIdMock,
				name: "Teamnaam"
			});
			team.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

	});

	describe ("Question", () => {

		it ("Question can not be null", (done) => {
			let question = new Question ({
				question: null,
				answer: "An answer",
				category: "A category"
			});
			question.validate ((err) => {
				assert.ok (err.errors.question);
				done ();
			});
		});

		it ("Answer can not be null", (done) => {
			let question = new Question ({
				question: "A question?",
				answer: null,
				category: "A category"
			});
			question.validate ((err) => {
				assert.ok (err.errors.answer);
				done ();
			});
		});

		it ("Category can not be null", (done) => {
			let question = new Question ({
				question: "A question?",
				answer: "An answer",
				category: null
			});
			question.validate ((err) => {
				assert.ok (err.errors.category);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let question = new Question ({
				question: "A question?",
				answer: "An answer",
				category: "A category"
			});
			question.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

	});

	describe ("TeamAnswer", () => {

		it ("Team can not be null", (done) => {
			let teamAnswer = new TeamAnswer ({
				team: null,
				answer: "Een antwoord",
				approved: false,
			});
			teamAnswer.validate ((err) => {
				assert.ok (err.errors.team);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let teamAnswer = new TeamAnswer ({
				team: "Een team"
			});
			teamAnswer.validate ((err, res) => {
				assert.ok (!err);
				done ();
			});
		});

	});

	describe ("Answer", () => {

		let teamAnswer = new TeamAnswer ({
			team: objectIdMock,
			answer: "Een antwoord",
			approved: false,
		});

		it ("Question can not be null", (done) => {
			let answer = Answer ({
				question: null,
				closed: false,
				answers: [teamAnswer]
			});
			answer.validate ((err) => {
				assert.ok (err.errors.question);
				done ();
			});
		});

		it ("Closed can not be null", (done) => {
			let answer = Answer ({
				question: objectIdMock,
				closed: null,
				answers: [teamAnswer]
			});
			answer.validate ((err) => {
				assert.ok (err.errors.closed);
				done ();
			});
		});

		it ("Answers may be empty", (done) => {
			let answer = Answer ({
				question: objectIdMock,
				closed: false,
				answers: []
			});
			answer.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let answer = Answer ({
				question: objectIdMock,
				closed: false,
				answers: [teamAnswer]
			});
			answer.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

	});

	describe ("Round", () => {

		it ("Answers may not be Strings", (done) => {
			let round = new Round ({
				answers: ["A string"],
				activeAnswer: "A string"
			});
			round.validate ((err) => {
				assert.ok (typeof round.answers [0] !== "string");
				assert.ok (err.errors.activeAnswer);
				done ();
			});
		});

		it ("Answers may be null", (done) => {
			let round = new Round ({
				answers: [],
				activeAnswer: null
			});
			round.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let round = new Round ({
				answers: [{
					question: objectIdMock,
					closed: false,
					answers: [{
						team: "Een team"
					}]
				}],
				activeAnswer: 0
			});
			round.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

	});

	describe ("Game", () => {

		it ("Closed may not be null", (done) => {
			let game = new Game ({
				_id: "A string",
				closed: null,
				playedQuestions: [objectIdMock],
				teams: [objectIdMock],
				rounds: [objectIdMock],
				activeRound: objectIdMock
			});
			game.validate ((err) => {
				assert.ok (err.errors.closed);
				done ();
			});
		});

		it ("ID must be specified", (done) => {
			let game = new Game ({
				playedQuestions: [objectIdMock],
				teams: [objectIdMock],
				rounds: [objectIdMock],
				activeRound: objectIdMock
			});
			game.validate ((err) => {
				assert.ok (err.errors._id);
				done ();
			});
		});

		it ("Valid case", (done) => {
			let game = new Game ({
				_id: "A string",
				playedQuestions: [objectIdMock],
				teams: [{
					_id: objectIdMock,
					name: "Een team"
				}],
				rounds: [{
					answers: [{
						question: objectIdMock,
						closed: false,
						answers: [{
							team: "Een team"
						}]
					}],
					activeAnswer: 0
				}],
				activeRound: 0
			});
			game.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

		it ("Other fields may not be Strings", (done) => {
			let game = new Game ({
				_id: "A string",
				playedQuestions: ["A string"],
				teams: ["A string"],
				rounds: ["A string"],
				activeRound: "A string"
			});
			game.validate ((err) => {
				assert.ok (typeof game.playedQuestions [0] !== "string");
				assert.ok (typeof game.teams [0] !== "string");
				assert.ok (typeof game.rounds [0] !== "string");
				assert.ok (err.errors.activeRound);
				done ();
			});
		});

		it ("Other fields may be null", (done) => {
			let game = new Game ({
				_id: "A string",
				playedQuestions: [],
				teams: [],
				rounds: [],
				activeRound: null
			});
			game.validate ((err) => {
				assert.ok (!err);
				done ();
			});
		});

	});

});
