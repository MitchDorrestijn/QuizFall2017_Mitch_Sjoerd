import React from 'react';

const WinnerScreen = (props) => {
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
