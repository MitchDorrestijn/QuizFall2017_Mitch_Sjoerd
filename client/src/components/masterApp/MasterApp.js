import React from 'react';
import IntroScreen from './IntroScreen';
import SelectCategoryScreen from './SelectCategoryScreen';
import ManageQuestions from './ManageQuestions';

export default class MasterApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      introScreen: true,
      selectCategoryScreen: false,
      selectQuestionScreen: false
    }
    this.goToSelectCategoryScreen = this.goToSelectCategoryScreen.bind(this);
    this.goToSelectQuestionScreen = this.goToSelectQuestionScreen.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.baseState = this.state;
  }
  goToSelectCategoryScreen(e) {
    e.preventDefault();
    this.setState({introScreen: false, selectCategoryScreen: true, selectQuestionScreen: false});
  }
  goToSelectQuestionScreen(e) {
    e.preventDefault();
    this.setState({introScreen: false, selectCategoryScreen: false, selectQuestionScreen: true});
  }
  stopGame(e){
    e.preventDefault();
    this.setState(this.baseState);
  }
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header">
          {this.state.introScreen && <IntroScreen goToSelectCategoryScreen={this.goToSelectCategoryScreen} />}
          {this.state.selectCategoryScreen && <SelectCategoryScreen goToSelectQuestionScreen={this.goToSelectQuestionScreen} />}
          {this.state.selectQuestionScreen && <ManageQuestions anotherRound={this.goToSelectCategoryScreen} stopGame={this.stopGame} />}
        </div>
      </div>
    );
  }
}
