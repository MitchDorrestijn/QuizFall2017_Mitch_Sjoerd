let fs = require ("fs");
let path = require ("path");
let http = require ("http");
let express = require ("express");
let bodyParser = require ("body-parser");
let mongoose = require ("mongoose");
let reloadWebSockets = require ("./functions/reloadWebSockets.js");
let cors = require ("cors");

let config = JSON.parse (fs.readFileSync ("config.json"));

let port = config.port;
let questionsPerRound = config.questionsPerRound;

let app = express ();

console.log ("========================");
console.log ("|    Quizzer Server    |");
console.log ("========================");

// DB connection
mongoose.connect (`mongodb://${config.dbHost}/${config.dbName}`, {useMongoClient: true}, (err) => {
	if (err) {
		console.log ("Error: "+err);
	} else {
		console.log (`Connected to MongoDB at ${config.dbHost} using database "${config.dbName}"`);
	}
});

// Setup HTTP and WebSockets server
let server = http.createServer (app);
let io = require ("socket.io") (server);

// Reload Socket.IO namespaces for open games (in case of a server crash)
reloadWebSockets (io);

// Disable DeprecationWarning
mongoose.Promise = global.Promise;

// Allow AJAX requests from any host
app.use (cors ({
	origin: '*'
}));

app.use (bodyParser.json ());

let api = [];

// QuizzMaster
api.push (require ("./functions/api/categories/get.js") (app));
api.push (require ("./functions/api/games/post.js") (app, io));
api.push (require ("./functions/api/games/gameId/put.js") (app, io));
api.push (require ("./functions/api/games/gameId/exists/get.js") (app));
api.push (require ("./functions/api/games/gameId/teams/get.js") (app));
api.push (require ("./functions/api/games/gameId/teams/teamId/put.js") (app, io));
api.push (require ("./functions/api/games/gameId/rounds/post.js") (app, io));
api.push (require ("./functions/api/games/gameId/rounds/current/questions/post.js") (app, questionsPerRound));
api.push (require ("./functions/api/games/gameId/rounds/current/questions/get.js") (app));
api.push (require ("./functions/api/games/gameId/rounds/current/questions/current/put.js") (app, io));
api.push (require ("./functions/api/games/gameId/rounds/current/answers/current/get.js") (app));
api.push (require ("./functions/api/games/gameId/rounds/current/put.js") (app, io));

// QuizzApp
api.push (require ("./functions/api/games/gameId/teams/post.js") (app, io));
api.push (require ("./functions/api/games/gameId/teams/teamId/get.js") (app));
api.push (require ("./functions/api/games/gameId/rounds/current/get.js") (app));
api.push (require ("./functions/api/games/gameId/rounds/current/questions/current/get.js") (app));

// QuizzApp and QuizzMaster
api.push (require ("./functions/api/games/gameId/rounds/current/answers/current/put.js") (app, io));

// QuizzScore
api.push (require ("./functions/api/games/gameId/scores/get.js") (app, questionsPerRound));

// Serve client app from public folder
app.use (express.static (path.join (__dirname, "./public")));
app.use ("*", (req, res) => {
	res.sendFile (path.join (__dirname, "./public/index.html"));
});

// Start the server
server.listen (port, () => console.log (`Server listening on port ${port}`));
