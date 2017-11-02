import React from 'react';
import DataAccess from '../../scripts/DataAccess';

export default class BoardApp extends React.Component {
  constructor(props){
    super(props);
    // TODO: GET CURRENT QUESTION, CATEGORY AND ROUNDNUMBER FROM THE DATABASE AND BOOLEANS FROM THE QUIZMASTER.
    this.state = {
      roomNumber: window.location.pathname.replace("/bord/", ""),
      result: []
    }
  }

  //
  // {
  //  roundNumber: Number,
  //  questionNumber: Number,
  //  maxQuestions: Number,
  //  scores: [{
  //   team: String,
  //   correctAnswers: Number,
  //   roundPoints: Number
  //  }],
  //  currentQuestion: {
  //   name: String,
  //   category: String,
  //   closed: Boolean,
  //   teamsAnswered: [{
  //    team: String,
  //    answer: String,
  //    approved: Boolean
  //   }]
  //  }
  // }

  renderTeamInfo(){
    let da = new DataAccess();
    da.getData(`/games/${this.state.roomNumber}/scores`, (err, res) => {
      if (err) {
        console.log (err);
      } else {
        let items = [];
        for (let i = 0; i < res.scores.length; i++) {
          let subItem;
          let item;
          for (let j = 0; j < res.teamAnswers.length; j++) {
            if (res.scores [i].team === res.teamAnswers[j].team) {
              if (res.closed) {
                subItem = (<div><strong className="rightOrWrong">Dit team had deze vraag als volgd beantwoord:</strong><span className={res.teamAnswers[i].approved ? "rightAnswer" : "wrongAnswer"}>{res.teamAnswers[j].answer}</span></div>);
                  } else {
                    subItem = (<div><strong className="rightOrWrong">Zodra de quizmaster de vraag sluit verschijnt hier het antwoord.</strong></div>);
                  }
                }
              }
              item = (<div><h4>{res.scores[i].team}</h4>
              <ul>
                <li>{res.scores[i].correctAnswers}</li>
                <li>{res.scores[i].roundPoints}</li>
              </ul>
              {subItem}</div>);
              items.push (item);
            }
          }
          this.setState ({result: items});
        });
      }

  render(){
    return (
      <div className="scorebord--wrapper intro--header">
        <div className="inner--header">
          {this.renderTeamInfo()}
          {this.state.result}
        </div>
      </div>
    );
  }
}
