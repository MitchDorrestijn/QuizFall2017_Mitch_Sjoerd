import React from 'react';
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
    this.baseState = this.state;
  }
  goToSelectCategoryScreen(e) {
    e.preventDefault();
    this.setState({introScreen: false, selectCategoryScreen: true, selectQuestionScreen: false});
    //Start the quiz
    let da = new DataAccess();
    da.postData(`/games/${this.state.roomNumber}/rounds`, {}, (err, res) => {
      if(err) throw error();
      console.log('The quiz has started!');
    });
  }
  goToSelectQuestionScreen(e) {
    e.preventDefault();
    this.setState({introScreen: false, selectCategoryScreen: false, selectQuestionScreen: true});
    let da = new DataAccess();
    da.postData(`/games/${this.state.roomNumber}/rounds/current/questions`, {catagories: this.state.selectedCategories}, (err, res) => {
      if(err) throw error();
      console.log('Catagories toegevoegd');
    });
  }
  stopGame(e){
    e.preventDefault();
    this.setState(this.baseState);
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
          {console.log(this.state.selectedCategories)}
          {this.state.introScreen && <IntroScreen goToSelectCategoryScreen={this.goToSelectCategoryScreen} getRoomNumber={(roomNumber) => this.passRoomNumber(roomNumber) } />}
          {this.state.selectCategoryScreen && <SelectCategoryScreen goToSelectQuestionScreen={this.goToSelectQuestionScreen} roomNumber={this.state.roomNumber} passSelectedCategories={(arr) => this.getSelectedCategories(arr) } />}
          {this.state.selectQuestionScreen && <ManageQuestions anotherRound={this.goToSelectCategoryScreen} stopGame={this.stopGame} />}
        </div>
      </div>
    );
  }
}
