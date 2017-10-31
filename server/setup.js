let fs = require ("fs");
let mongoose = require ("mongoose");
let Question = require ("./schema/questions.js").model;

let config = JSON.parse (fs.readFileSync ("./config.json"));
let questions = JSON.parse (fs.readFileSync ("./questions.json"));

console.log ("--  Quizzer database installer  --\n");
console.log ("This script will install the questions from questions.json\ninto your database, using to the following configuration\nfrom config.json:\n");
console.log ("  host:       " + config.dbHost);
console.log ("  database:   " + config.dbName + "\n");
console.log ("Press to continue or Ctrl+C to cancel");

let loop = (round, maxRounds, prevPercent) => {
	if (round < maxRounds) {
		let percentage = parseInt (100 / maxRounds * round, 10);
		if (percentage === 25 || percentage === 50 || percentage === 75) {
			if (percentage !== prevPercent) {
				process.stdout.write (" "+percentage+"%...");
			}
		}
		let result = questions [0];
		result._id = new mongoose.Types.ObjectId ();
		let question = new Question (result);
		question.save ((err) => {
			if (err) {
				console.log (err.toString ());
			} else {
				loop (round+1, maxRounds, percentage);
			}
		});
	} else {
		console.log (` 100% done!`);
		console.log ("\nImported " + maxRounds + " questions");
		process.exit ();
	}
};

process.stdin.on ('data', () => {
	mongoose.Promise = global.Promise;
	mongoose.connect (`mongodb://${config.dbHost}/${config.dbName}`, {useMongoClient: true}, (err) => {
		if (err) {
			console.log ("Error: " + err);
		} else {
			process.stdout.write (`Importing questions...`);
			loop (0, questions.length, 0);
		}
	});
});

