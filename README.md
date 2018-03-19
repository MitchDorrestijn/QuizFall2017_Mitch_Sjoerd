<h1 align="center">
  <br>
  <img src="https://github.com/MitchDorrestijn/QuizFall2017_Mitch_Sjoerd/blob/master/quizzerLogo.png?raw=true" alt="Quizzer" width="500">
  <br><br>
  fall2017-quizz-MitchEnSjoerd
  <br>
</h1>

<h4 align="center">A quiz application built with React, Express and MongoDB.</h4>

---

## Key Features

* Build with modern techniques
  - React, SCSS, Express and MongoDB
* Create multiple quizzes
* Approve or reject teams
* Select your own categories
* Separate scoreboard
* User friendly
* Adjustable to your preferences
* API based
* No page refresh between questions
* Cross browser
  - Safari, Chrome, Firefox and Opera ready
* Challenging questions :blush:


## How To Use

You need a Mongo DB server (without authentication) to run this application.

To clone this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.
From your command line:
```bash
# Clone the repo
$ git clone https://github.com/MitchDorrestijn/QuizFall2017_Mitch_Sjoerd.git

# Go into the server directory
$ cd fall2017-quizz-MitchEnSjoerd/server

# Install dependencies
$ npm install
```

By default, the application runs on port 8080, and expects a local Mongo database to be running by the name of `quizzer`. One round in a game has twelve questions. To change this behaviour, edit the `config.json` file in the server directory.

After setting up `config.json` you can install the questions to the Mongo server by running:
```bash
$ node setup.js
```

Finally, to run the application:
```bash
$ node app.js
```

If you want to run tests for the Mongoose schemas and the API, you need to have `mocha` installed. Make sure the server is running and run:
```bash
$ mocha
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` / `yarn` from the command prompt.


## Download

You can [download](https://github.com/HANICA-DWA/fall2017-quizz-MitchEnSjoerd/releases) latest installable version of this Quizzer for Windows, macOS and Linux.

## Credits

This software uses code from several open source packages.
- [React](https://reactjs.org/) - The client side framework used.
- [Express](https://expressjs.com/) - The server side framework used.
- [SCSS](http://sass-lang.com/) - The CSS preprocessor used.
- [MongoDB](https://www.mongodb.com/) - The database behind the Quizzer app.
- [Mongoose](http://mongoosejs.com/) - The object modeling package for MongoDB.
- [Socket.IO](https://socket.io/) - The extension used for real-time bidirectional event-based communication.
- [Babeljs](https://babeljs.io/) - The javascript compiler used.
- [Webpack](https://webpack.js.org/) - The module bundler used.



## Why these packages?

- [React](https://reactjs.org/) - Was required for the assignment.
- [Express](https://expressjs.com/) - Was required for the assignment.
- [SCSS](http://sass-lang.com/) - To organize CSS and for variable support.
- [MongoDB](https://www.mongodb.com/) - Was required for the assignment.
- [Mongoose](http://mongoosejs.com/) - To add data validation and because it will abstract away most of the mongoDB code.
- [Socket.IO](https://socket.io/) - For backwards compatibility with AJAX, easier socket management, and automatic reconnection.
- [Babeljs](https://babeljs.io/) - To convert React and ES6 code to es5 so non-ES6 browsers can use it.
- [Webpack](https://webpack.js.org/) - To make the app faster.

## Authors

* Mitch Dorrestijn - *Mostly client-side development* - [MitchDorrestijn](https://github.com/MitchDorrestijn)
* Sjoerd Scheffer - *Mostly server-side development* - [ixnas](https://github.com/ixnas)

## Sidenotes
The Quizzer application is created in commissioned by the Hogeschool van Arnhem en Nijmegen for the SWD/CWD courses.
