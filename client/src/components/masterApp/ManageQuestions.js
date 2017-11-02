import React from 'react';
import ShowGivenAnswersScreen from './ShowGivenAnswersScreen';
import QuestionIsServedScreen from './QuestionIsServedScreen';
import SelectAQuestionScreen from './SelectAQuestionScreen';
import WinnerScreen from './WinnerScreen';
import DataAccess from '../../scripts/DataAccess';

export default class ManageQuestions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectAQuestionScreen: true,
      thereIsAQuestionSelected: false,
      questionIsSendScreen: false,
      showGivenAnswersScreen: false,
      valueOfTheSelectedQuestion: "",
      valueOfTheSelectedQuestionId: "",
      answerToTheCurrentQuestion: 0,
      roomNumber: this.props.roomNumber,
      availableQuestions: [],
      questionIds: [],
      answers: [],
      givenAnswers: [],
      correctAnswers: []
    }
    this.baseState = this.state;
    this.getSelectedQuestion = this.getSelectedQuestion.bind(this);
    this.sendQuestionToTheTeams = this.sendQuestionToTheTeams.bind(this);
    this.closeQuestion = this.closeQuestion.bind(this);
    this.resetStateAndScreens = this.resetStateAndScreens.bind(this);
    this.getAllGivenAnswers = this.getAllGivenAnswers.bind(this);
    this.getAllCorrectAnswers = this.getAllCorrectAnswers.bind(this);
  }
  componentDidMount(){
    let da = new DataAccess();
    da.getData(`/games/${this.state.roomNumber}/rounds/current/questions`, (err, res) => {
      if(err) throw new error();
      let questions = [];
      let questionObjectIds = [];
      let answersToTheQuestions = [];
      for (let i = 0; i < res.length; i++) {
        questions.push(res[i].question);
        questionObjectIds.push(res[i].questionId);
        answersToTheQuestions.push(res[i].answer);
      }
      this.setState ({availableQuestions: questions, questionIds: questionObjectIds, answers: answersToTheQuestions});
    });
  }
  getSelectedQuestion(e){
    this.setState({thereIsAQuestionSelected: true, valueOfTheSelectedQuestion: e.target.value});
  }
  sendQuestionToTheTeams(e){
    e.preventDefault();
    let objectIdIndex = this.state.availableQuestions.indexOf(this.state.valueOfTheSelectedQuestion);
    let da = new DataAccess();
    da.putData(`/games/${this.state.roomNumber}/rounds/current`, {nextQuestion: this.state.questionIds[objectIdIndex]}, (err, res) => {
      if (err) throw new error();
      this.setState({selectAQuestionScreen: false, questionIsSendScreen: true, answerToTheCurrentQuestion: this.state.answers[objectIdIndex]});
      console.log('The question has been send to the participating teams.');
    });
  }
  closeQuestion(e){
    e.preventDefault();
    let da = new DataAccess();
    da.putData(`/games/${this.state.roomNumber}/rounds/current/questions/current`, {close: true}, (err, res) => {
      if (err) throw new error();
      this.setState({questionIsSendScreen: false, showGivenAnswersScreen: true});
      console.log('The question has been closed successfully');
    });
  }
  resetStateAndScreens(){
    let da = new DataAccess();
    da.getData(`/games/${this.state.roomNumber}/rounds/current/questions`, (err, res) => {
      if(err) throw new error();
        let questions = [];
        let questionObjectIds = [];
        let answersToTheQuestions = [];
        for (let i = 0; i < res.length; i++) {
          questions.push(res[i].question);
          questionObjectIds.push(res[i].questionId);
          answersToTheQuestions.push(res[i].answer);
        }
        this.setState({
          selectAQuestionScreen: true,
          thereIsAQuestionSelected: false,
          questionIsSendScreen: false,
          showGivenAnswersScreen: false,
          valueOfTheSelectedQuestion: "",
          valueOfTheSelectedQuestionId: "",
          answerToTheCurrentQuestion: 0,
          availableQuestions: questions,
          questionIds: questionObjectIds,
          answers: answersToTheQuestions
        });
        if(questions < 1){
          this.setState({selectAQuestionScreen: false});
        }
      });
  }
  getAllGivenAnswers(allGivenAnswers){
    this.setState({ givenAnswers: allGivenAnswers });
	for (let elem of allGivenAnswers) {
      console.log ("givenAnswers: ", elem);
    }
  }
  getAllCorrectAnswers(answer) {
    this.setState({ correctAnswers: answer });
    let givenTeams = this.state.givenAnswers.map ((elem) => {
      return elem.team;
    });
    let rightTeams = answer.map ((elem) => {
      return elem.label.split (": ")[0];
    });
    let wrongTeams = givenTeams.filter ((val) => { return !rightTeams.includes (val) });
	  for (let elem of rightTeams) {
		  console.log ("correctTeam: ", elem);
		  let da = new DataAccess ();
		  da.putData (`/games/${this.state.roomNumber}/rounds/current/answers/current`, {team: elem, correct: true}, (err) => {
			  if (err) {
				  console.log (err.toString ());
			  }
		  });
	  }
	  for (let elem of wrongTeams) {
		  console.log ("wrongTeams: ", elem);
		  let da = new DataAccess ();
		  da.putData (`/games/${this.state.roomNumber}/rounds/current/answers/current`, {team: elem, correct: false}, (err) => {
			  if (err) {
				  console.log (err.toString ());
			  }
		  });
	  }
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
            closeQuestion={this.closeQuestion}
            valueOfTheSelectedQuestion={this.state.valueOfTheSelectedQuestion}
            wsRefreshGivenAnswers={this.props.wsRefreshGivenAnswers}
            roomNumber={this.state.roomNumber}
          />}
        {this.state.showGivenAnswersScreen &&
          <ShowGivenAnswersScreen
            valueOfTheSelectedQuestion={this.state.valueOfTheSelectedQuestion}
            correctGivenAnswers={this.state.givenAnswers}
            resetStateAndScreens={this.resetStateAndScreens}
            answer={this.state.answerToTheCurrentQuestion}
            roomNumber={this.state.roomNumber}
            getAllGivenAnswers={(allGivenAnswers) => this.getAllGivenAnswers(allGivenAnswers)}
            getAllCorrectAnswers={(answer) => this.getAllCorrectAnswers(answer) }
          />}
      </div>
    );
  }
}
