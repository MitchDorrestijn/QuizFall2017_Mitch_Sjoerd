import React from 'react';
import ShowGivenAwnsersScreen from './ShowGivenAwnsersScreen';
import QuestionIsServedScreen from './QuestionIsServedScreen';
import SelectAQuestionScreen from './SelectAQuestionScreen';
import WinnerScreen from './WinnerScreen';

export default class ManageQuestions extends React.Component {
  constructor(props){
    super(props);
    // TODO: GET 12 RANDOM QUESTIONS FROM THE DATABASE BASED ON THE SELECTED CATEGORY.
    // TODO: SET ALL BOOLEANS BELOW TO FALSE WHEN 12 QUESTIONS HAVE BEEN AWNSERED.
    this.state = {
      selectAQuestionScreen: true,
      thereIsAQuestionSelected: false,
      questionIsSendScreen: false,
      showGivenAwnsersScreen: false,
      valueOfTheSelectedQuestion: "",
      availableQuestions: [
        "Who wrote Twilight series of novels?",
        "In the Adrian Mole Diaries, what is the surname of his girlfriend?",
        "Who wrote the novel Revolutionary Road, which was made into a successful feature film?",
        "What word does the bird constantly repeat in Edgar Allan Poe`s classic poem The Raven?",
        "In Gullivers Travels, what is the name of the flying island?",
        "Who was the author of Whisky Galore?"
      ],
      givenAwnsers: [
        "antwoord 1",
        "antwoord 2",
        "antwoord 3"
      ]
    }
    this.baseState = this.state;
    this.getSelectedQuestion = this.getSelectedQuestion.bind(this);
    this.sendQuestionToTheTeams = this.sendQuestionToTheTeams.bind(this);
    this.getAwnsers = this.getAwnsers.bind(this);
    this.resetStateAndScreens = this.resetStateAndScreens.bind(this);
  }
  getSelectedQuestion(e){
    this.setState({thereIsAQuestionSelected: true, valueOfTheSelectedQuestion: e.target.value});
  }
  sendQuestionToTheTeams(e){
    e.preventDefault();
    this.setState({selectAQuestionScreen: false, questionIsSendScreen: true});
    // TODO: PUT THE SELCTED QUESTION IN THE DATABASE.
    console.log('De geselecteerde vraag: ' + this.state.valueOfTheSelectedQuestion);
  }
  getAwnsers(){
    this.setState({questionIsSendScreen: false, showGivenAwnsersScreen: true});
  }
  resetStateAndScreens(){
    this.setState(this.baseState);
  }
  render(){
    return (
      <div>
        {this.state.availableQuestions.length <= 0 &&
          <WinnerScreen
            anotherRound={this.props.anotherRound}
            stopGame={this.props.stopGame}
          />}
        {this.state.selectAQuestionScreen &&
          <SelectAQuestionScreen
            availableQuestions={this.state.availableQuestions}
            valueOfTheSelectedQuestion={this.state.valueOfTheSelectedQuestion}
            getSelectedQuestion={this.getSelectedQuestion}
            sendQuestionToTheTeams={this.sendQuestionToTheTeams}
            thereIsAQuestionSelected={this.state.thereIsAQuestionSelected}
          />}
        {this.state.questionIsSendScreen &&
          <QuestionIsServedScreen
            getAwnsers={this.getAwnsers}
            valueOfTheSelectedQuestion={this.state.valueOfTheSelectedQuestion}
          />}
        {this.state.showGivenAwnsersScreen &&
          <ShowGivenAwnsersScreen
            valueOfTheSelectedQuestion={this.state.valueOfTheSelectedQuestion}
            givenAwnsers={this.state.givenAwnsers}
            resetStateAndScreens={this.resetStateAndScreens} />}
      </div>
    );
  }
}
