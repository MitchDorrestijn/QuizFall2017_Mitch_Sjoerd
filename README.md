# fall2017-quizz-MitchEnSjoerd

The Quizzer is a web application that can be used in bars, sports canteens and maybe even prisons to play quizzes as a team. A pub quiz, basically.

## Getting Started

To get up and running download the latest Quizzer from this repository. Once downloaded navigate to the folder and run:
```
npm install
```
or
```
yarn install
```

Once all dependencies are installed start the Quizzer by typing:
```
npm run dev-server
```
or (if you use Yarn)
```
yarn run dev-server
```

### Dependencies

The Quizzer app currently uses the following dependencies:
```babel-cli``` version ```^6.24.1```: gives you access to the Babel command line.
```babel-core``` version ```^6.25.0```: adds the core of the Babel compiler.
```babel-loader``` version ```^7.1.1```: allows transpiling JavaScript files using Babel and webpack.
```babel-preset-env``` version ```1.5.2```: a Babel preset that compiles ES2015+ down to ES5.
```babel-preset-react``` version ```6.24.1```: a Babel preset for all React plugins.
```css-loader``` version ```^0.28.4```: required by sass-loader to load the converted css files.
```live-server``` version ```^1.2.0```: little development server with live reload capability (used for development purposes).
```node-sass``` version ```^4.5.3```: natively compiles .scss files to .css.
```normalize.css``` version ```^7.0.0```: resets the default browser styling.
```react``` version ```^15.6.1```: gives the Quizzer access to React.
```react-dom``` version ```^15.6.1```: serves as the entry point of the DOM-related rendering paths.
```sass-loader``` version ```^6.0.6```: loads a SASS/SCSS file and compiles it to CSS.
```style-loader``` version ```^0.18.2```: adds CSS to the DOM by injecting a <style> tag.
```webpack``` version ```^3.1.0```: bundles the Quizzer app assets.
```webpack-dev-server``` version ```^2.5.1```: a development server that provides live reloading.


## Commands

Currently you can run the following commands:
```serve```: serves the Quizzer app using the live-server dependency.
```build```: builds the webpack bundle file.
```dev-server```: runs the webpack development server and compiles the assets in bundle.js


## Deployment

[GIT server explaination]

## Built With

* [React](https://reactjs.org/) - The client side framework used.
* [Express](https://expressjs.com/) - The server side framework used (in the future).
* [SCSS](http://sass-lang.com/) - The CSS preprocessor used.
* [MongoDB](https://www.mongodb.com/) - The database behind the Quizzer app (in the future).
* [Mongoose](http://mongoosejs.com/) - The object modeling package for MongoDB (in the future).
* [SocketIO](https://socket.io/) - The extention used for real-time bidirectional event-based communication.


## Versioning

Currently this is the first stable release of the Quizzer app.

## Authors

* **Mitch Dorrestijn** - *Mostly client-side development* - [MitchDorrestijn](https://github.com/MitchDorrestijn)
* **Sjoerd Scheffer** - *Mostly server-side development* - [ixnas](https://github.com/ixnas)


## License

Copyright 2017 all rights reserved.
