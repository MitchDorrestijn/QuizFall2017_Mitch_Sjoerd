import React from 'react';

const WinnerScreen = (props) => {
  // TODO: GET ALL POINTS FROM THE DATABASE.
  // TODO: PUT THE BOOLEANS IN THE STATE OF THE MASTER APP TO FALSE WHEN THEERE HAVE BEEN 12 QUESTIONS ANSWERED.
  return (
    <div>
      <h1>De quiz is afgelopen</h1>
      <span className="block">De quiz is ten einde, raadpleeg het scorebord voor de winnaar.</span><br/>
      <button onClick={props.anotherRound}>Speel nog een ronde</button>
      <button onClick={props.stopGame}>Sluit de Quizzer</button>
    </div>
  );
}

export default WinnerScreen;
