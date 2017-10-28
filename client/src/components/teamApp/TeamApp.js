import React from 'react';
import IntroScreen from './IntroScreen';
import QuestionScreen from './QuestionScreen';
import GameOverScreen from './GameOverScreen';

export default class TeamApp extends React.Component {
  constructor(props){
    super(props);
    // TODO: MANAGE BOOLEANS BASED ON WHAT THE QUIZMASTER SELECTED.
    this.state = {
      introScreen: true,
      questions: false,
      gameOver: false
    }
    this.backToIntroScreen = this.backToIntroScreen.bind(this);
  }
  backToIntroScreen(e) {
    e.preventDefault();
    this.setState({gameOver: false, questions: false, introScreen: true});
  }
  render(){
    return (
      <div>
        {this.state.introScreen && <IntroScreen />}
        {this.state.questions && <QuestionScreen />}
        {this.state.gameOver && <GameOverScreen backToIntroScreen={this.backToIntroScreen} />}
      </div>
    );
  }
}
