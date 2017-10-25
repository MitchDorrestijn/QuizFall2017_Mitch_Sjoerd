let express = require ("express");
let mongoose = require ("mongoose");
let questions = require ("./schema/questions.js").model;
let cors = require ("cors");

let port = 8080;

let app = express ();

mongoose.connect ("mongodb://localhost/quizzr", {useMongoClient: true}, (err) => {
	if (err) {
		console.log ("Error: "+err);
	} else {
		console.log ("Connected to MongoDB");
	}
});

// Allow AJAX requests from any host
app.use (cors ({
	origin: '*'
}));

app.get ("/api/categories", (req, res) => {
	questions.find ().distinct ('category', (err, categories) => {
		res.json (categories);
	});
});

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
