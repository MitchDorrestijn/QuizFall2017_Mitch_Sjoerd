let express = require ("express");
let cors = require ("cors");

let port = 8080;

let app = express ();

// Allow AJAX requests from any host
app.use (cors ({
	origin: '*'
}));

// Start the server
app.listen (port, () => console.log (`Server listening on port ${port}`));
