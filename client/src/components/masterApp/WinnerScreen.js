import React from 'react';

const WinnerScreen = (props) => {
  // TODO: GET ALL POINTS FROM THE DATABASE.
  // TODO: PUT THE BOOLEANS IN THE STATE OF THE MASTER APP TO FALSE WHEN THEERE HAVE BEEN 12 QUESTIONS AWNSERED.
  return (
    <div>
      <h1>De quiz is afgelopen</h1>
      <span>De quiz is ten einde, u kunt nu de winnaar uitroepen.</span><br/>
      <strong className="success">Team [getTeamnamFromDatabase] is de winnaar!</strong>
      <ul className="leaderboard">
        <li>Team [getTeamnamFromDatabase] heeft [getTeamPointsFromDatabase] punten behaald.</li>
        <li>Team [getTeamnamFromDatabase] heeft [getTeamPointsFromDatabase] punten behaald.</li>
      </ul>
      <button onClick={props.anotherRound}>Speel nog een ronde</button>
      <button onClick={props.stopGame}>Sluit de Quizzer</button>
    </div>
  );
}

export default WinnerScreen;
