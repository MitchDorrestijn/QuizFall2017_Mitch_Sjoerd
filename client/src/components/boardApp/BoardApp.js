import React from 'react';

export default class BoardApp extends React.Component {
  constructor(props){
    super(props);
    // TODO: GET CURRENT QUESTION, CATEGORY AND ROUNDNUMBER FROM THE DATABASE AND BOOLEANS FROM THE QUIZMASTER.
    this.state = {
      questionIsClosed: false,
      showGivenAnswers: false,
      currentQuestion: "Who wrote the novel Revolutionary Road, which was made into a successful feature film?",
      currentCategory: "Algemeen",
      roundNumber: 1,
      teamStatus: [
        ['teamName',          true,                 true,                   1,                  10],
        ['anotherTeamName',   false,                false,                  5,                  10],
        ['yetanother',        true,                 false,                  8,                  10]
        //[teamName, teamHasSubmittedAnAnswer, teamHadAcorrectAnswer, amountOfGoodQuestions, roundPoints]
        //    0                 1                       2                     3                  4
      ]
    }
  }
  renderTeamInfo(){
    let teamStatus = this.state.teamStatus.map((teamStatus, i) => {
      return (
        <li key={teamStatus[0] + i} className="singleTeam">
          <h4>{teamStatus[0]}</h4>
          <ul>
            <li>Aantal vragen goed: {teamStatus[3]}</li>
            <li>Aantal roundpoints: {teamStatus[4]}</li>
          </ul>
          {teamStatus[1] ? <span className="success">Dit team heeft de huidige vraag zojuist beantwoord</span> : <span className="error">Dit team heeft de huidige vraag nog niet beantwoord</span>}
          {this.state.showGivenAnswers ?
            <div>
              <strong className="rightOrWrong">Dit team had deze vraag als volgd beantwoord:</strong>
              <span className="answer">[getTeamAnswer]</span>
              {teamStatus[2] ? <strong className="success">GOED BEANTWOORD!</strong> : <strong className="error">FOUT BEANTWOORD!</strong>}
            </div>
            :
            <div>
              <strong className="rightOrWrong">Zodra de quizmaster de vraag sluit verschijnt hier het antwoord.</strong>
            </div>
          }
        </li>
      );
    });
    return(
      <ul className="teamScores">
        {teamStatus}
      </ul>
    );
  }
  render(){
    return (
      <div className="scorebord--wrapper intro--header">
        <div className="inner--header">
          <h1 className="question">{this.state.currentQuestion}</h1>
          {this.state.questionIsClosed ? <strong className="error questionStatus">De vraag is gesloten. De quizmaster keurt nu uw antwoorden.</strong> : <strong className="success questionStatus">Geef alstublieft nu een antwoord.</strong>}
          {this.renderTeamInfo()}
          <small className="roundInfo">Dit is ronde <i>{this.state.roundNumber}</i>, deze vraag is afkomstig uit de <i>{this.state.currentCategory}</i> cattegorie.</small>
        </div>
      </div>
    );
  }
}
