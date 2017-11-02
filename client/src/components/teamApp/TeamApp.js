import React from 'react';
import IntroScreen from './IntroScreen';
import QuestionScreen from './QuestionScreen';
import GameOverScreen from './GameOverScreen';
import WaitingScreen from './WaitingScreen';

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
      roomNumber: window.location.pathname.replace("/quiz/", "")
    }
    this.backToIntroScreen = this.backToIntroScreen.bind(this);
    this.getTeamName = this.getTeamName.bind(this);
    this.getApproval = this.getApproval.bind(this);
    this.print = this.print.bind(this);
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
  print(){
    console.log(this.state.approved);
    if(this.state.approved){
      this.setState({introScreen: false, waiting: true});
    }
  }
  render(){
    return (
      <div>
        <button onClick={this.print}>check in master</button>
        {this.state.waiting && <WaitingScreen />}
        {this.state.introScreen &&
          <IntroScreen
            roomNumber={this.state.roomNumber}
            getTeamName={(teamName) => this.getTeamName(teamName)}
            getApproval={(approved) => this.getApproval(approved)}
            teamName={this.state.teamName}
          />}
        {this.state.questions && <QuestionScreen />}
        {this.state.gameOver && <GameOverScreen backToIntroScreen={this.backToIntroScreen} />}
      </div>
    );
  }
}
