import React from 'react';
import openSocket from 'socket.io-client';
import IntroScreen from './IntroScreen';
import SelectCategoryScreen from './SelectCategoryScreen';
import ManageQuestions from './ManageQuestions';
import DataAccess from '../../scripts/DataAccess';

export default class MasterApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      introScreen: true,
      selectCategoryScreen: false,
      selectQuestionScreen: false,
      roomNumber: '',
      selectedCategories: []
    }
    this.goToSelectCategoryScreen = this.goToSelectCategoryScreen.bind(this);
    this.goToSelectQuestionScreen = this.goToSelectQuestionScreen.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.passRoomNumber = this.passRoomNumber.bind(this);
    this.getSelectedCategories = this.getSelectedCategories.bind(this);
    this.initWebSocket = this.initWebSocket.bind (this);
	this.wsRefreshGivenAnswers = this.wsRefreshGivenAnswers.bind (this);
    this.baseState = this.state;
    this.socket = null;
  }
  initWebSocket(room, updateFunction) {
    this.socket = openSocket(`/ws/${room}/master`);
    this.socket.on('connected', (data) => {
      console.log(data);
    });
    this.socket.on ('updateApplications', (data) => {
      console.log(data);
	  updateFunction ();
    });
  };
  wsRefreshGivenAnswers (updateFunction) {
	this.socket.on ('updateAnswers', (data) => {
	 console.log(data);
	 updateFunction ();
	});
  }
  goToSelectCategoryScreen(e) {
    e.preventDefault();
    //Start the quiz
    let da = new DataAccess();
    da.postData(`/games/${this.state.roomNumber}/rounds`, {}, (err, res) => {
      if(err) throw error();
      this.setState({introScreen: false, selectCategoryScreen: true, selectQuestionScreen: false});
      console.log('The quiz has started!');
    });
  }
  goToSelectQuestionScreen(e) {
    e.preventDefault();
    //Add the categories
    let da = new DataAccess();
    da.postData(`/games/${this.state.roomNumber}/rounds/current/questions`, {categories: this.state.selectedCategories}, (err, res) => {
      if(err) throw error();
      this.setState({introScreen: false, selectCategoryScreen: false, selectQuestionScreen: true});
      console.log('Categories toegevoegd');
    });
  }
  stopGame(e){
    e.preventDefault();
    let da = new DataAccess();
    da.putData(`/games/${this.state.roomNumber}`, {closed: true}, (err, res) => {
      this.setState(this.baseState);
    });
  }
  passRoomNumber(roomNumber) {
    this.setState({ roomNumber: roomNumber });
  }
  getSelectedCategories(arr) {
    this.setState({ selectedCategories: arr });
  }
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header">
          {this.state.introScreen && <IntroScreen socket={this.state.socket} initWebSocket={this.initWebSocket} goToSelectCategoryScreen={this.goToSelectCategoryScreen} getRoomNumber={(roomNumber) => this.passRoomNumber(roomNumber) } />}
          {this.state.selectCategoryScreen && <SelectCategoryScreen goToSelectQuestionScreen={this.goToSelectQuestionScreen} roomNumber={this.state.roomNumber} passSelectedCategories={(arr) => this.getSelectedCategories(arr) } />}
          {this.state.selectQuestionScreen && <ManageQuestions wsRefreshGivenAnswers={this.wsRefreshGivenAnswers} anotherRound={this.goToSelectCategoryScreen} stopGame={this.stopGame} roomNumber={this.state.roomNumber} />}
        </div>
      </div>
    );
  }
}
