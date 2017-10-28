import React from 'react';

class GameOverScreen extends React.Component {
  render() {
    return (
      <div className="intro--header">
        <div className="inner--header question--wrapper">
          <h1>De quiz is afgelopen</h1>
          <span className="spacingBelow">Alle vragen uit de door de quizmaster geselecteerde cattergorie zijn geweest of de quizmaster heeft de quiz gestopt. Raadpleeg het scorebord voor de punten.</span>
          <button onClick={this.props.backToIntroScreen} className="block" type="submit">Ga terug naar het hoofdmenu</button>
        </div>
      </div>
    );
  }
}

export default GameOverScreen;
