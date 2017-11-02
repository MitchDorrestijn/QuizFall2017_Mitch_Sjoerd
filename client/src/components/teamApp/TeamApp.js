import React from 'react';
import IntroScreen from './IntroScreen';
import QuestionScreen from './QuestionScreen';
import GameOverScreen from './GameOverScreen';
import WaitingScreen from './WaitingScreen';
import DataAccess from '../../scripts/DataAccess';

export default class TeamApp extends React.Component {
  constructor(props){
    super(props);
    // TODO: MANAGE BOOLEANS BASED ON WHAT THE QUIZMASTER SELECTED.
    this.state = {
      introScreen: true,
      questions: false,
      gameOver: false,
      waiting: false,
      teamName: "",
      approved: false,
      currentQuestion: "",
      roomNumber: window.location.pathname.replace("/quiz/", "")
    }
    this.backToIntroScreen = this.backToIntroScreen.bind(this);
    this.getTeamName = this.getTeamName.bind(this);
    this.getApproval = this.getApproval.bind(this);
    this.printAccept = this.printAccept.bind(this);
    this.isThereAQuestionStarted = this.isThereAQuestionStarted.bind(this);
    this.checkIfQuestionIsClosed = this.checkIfQuestionIsClosed.bind(this);
  }
  backToIntroScreen(e) {
    e.preventDefault();
    this.setState({gameOver: false, questions: false, introScreen: true});
  }
  getTeamName(teamName){
    this.setState({teamName: teamName});
  }
  getApproval(approved){
    this.setState({approved: approved});
  }
  printAccept(){
    console.log(this.state.approved);
    if(this.state.approved){
      this.setState({introScreen: false, waiting: true});
    }
  }
  //This must also be checked with websockets.
  isThereAQuestionStarted(){
    let da = new DataAccess();
    da.getData(`/games/${this.state.roomNumber}/rounds/current/questions/current`, (err, res) => {
      if(err){
        console.log('No question has been started.');
      } else {
        this.setState({questions: true, waiting: false, currentQuestion: res.question});
      }
    });
  }
  //This must also be checked with websockets.
  checkIfQuestionIsClosed(){

  }
  render(){
    return (
      <div>
        <button onClick={this.printAccept}>check if team is accepted</button>
        <button onClick={this.isThereAQuestionStarted}>check if a question has been started</button>
        <button onClick={this.checkIfQuestionIsClosed}>check if a question has been closed</button>

        {this.state.waiting && <WaitingScreen />}
        {this.state.introScreen &&
          <IntroScreen
            roomNumber={this.state.roomNumber}
            getTeamName={(teamName) => this.getTeamName(teamName)}
            getApproval={(approved) => this.getApproval(approved)}
            teamName={this.state.teamName}
          />}
        {this.state.questions &&
          <QuestionScreen
            currentQuestion={this.state.currentQuestion}
            teamName={this.state.teamName}
            roomNumber={this.state.roomNumber}
          />}
        {this.state.gameOver && <GameOverScreen backToIntroScreen={this.backToIntroScreen} />}
      </div>
    );
  }
}
