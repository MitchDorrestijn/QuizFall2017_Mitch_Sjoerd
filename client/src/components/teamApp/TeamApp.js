import React from 'react';
import openSocket from 'socket.io-client';
import IntroScreen from './IntroScreen';
import QuestionScreen from './QuestionScreen';
import GameOverScreen from './GameOverScreen';
import DataAccess from '../../scripts/DataAccess';
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
      currentQuestion: "",
      roomNumber: window.location.pathname.replace("/quiz/", "")
    };
    this.backToIntroScreen = this.backToIntroScreen.bind(this);
    this.getTeamName = this.getTeamName.bind(this);
    this.getApproval = this.getApproval.bind(this);
    this.print = this.print.bind(this);
    this.openWebSocket = this.openWebSocket.bind (this);
	this.checkIfQuizmasterHasApprovedTheTeam = this.checkIfQuizmasterHasApprovedTheTeam.bind (this);
	this.isThereAQuestionStarted = this.isThereAQuestionStarted.bind(this);
	this.socket = null;
  }
  openWebSocket (gameId, teamId, teamName) {
  	this.getTeamName(teamName);
	console.log (gameId, teamId);
    this.socket = openSocket (`http://localhost:8081/ws/${gameId}/teams/${teamId}`);
    console.log (this.socket);
	this.socket.on ('joinGame', (data) => {
		if (data.joinGame) {
			this.checkIfQuizmasterHasApprovedTheTeam(gameId, teamId);
		} else {
			this.setState ({waiting: false, introScreen: true, approved: false});
		}
	});
	this.socket.on ('changeQuestion', () => {
		this.isThereAQuestionStarted()
	});
	this.socket.on ('closeQuestion', () => {
		this.setState ({waiting: true, questions: false});
	});
	this.socket.on ('closeGame', () => {
		this.setState ({waiting: false, gameOver: true});
	});
  }
	checkIfQuizmasterHasApprovedTheTeam(gameId, teamId){
		let da = new DataAccess();
		da.getData(`/games/${gameId}/teams/${teamId}`, (err, res) => {
			if(err) throw new error();
			if (res.approved) {
				this.getApproval(res.approved);
				this.print ();
			}
		});
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
  render(){
    return (
      <div>
        {this.state.waiting && <WaitingScreen />}
        {this.state.introScreen &&
          <IntroScreen
            print={this.print}
            socket={this.socket}
            openSocket={this.openWebSocket}
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
