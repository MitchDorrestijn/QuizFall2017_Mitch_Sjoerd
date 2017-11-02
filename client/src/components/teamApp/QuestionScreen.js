import React from 'react';
import DataAccess from '../../scripts/DataAccess';

export default class QuestionScreen extends React.Component {
  constructor(props){
    super(props);
    this.getQuestion = this.getQuestion.bind(this);
    this.typeAnswer = this.typeAnswer.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.answerGiven = this.answerGiven.bind(this);
    this.resetAnswerState = this.resetAnswerState.bind(this);
    this.state = {
      formSubmitted: false,
      errors: false,
      givenAnswer: ""
    }
    this.baseState = this.state;
  }
  getQuestion(){
    return (
      <h1>{this.props.currentQuestion}?</h1>
    );
  }
  typeAnswer(){
    return (
      <div className="createTeam full-width-form">
        <form>
          <input id="answer" placeholder="Type hier je antwoord" type="text"></input>
          <input onClick={this.handleForm} type="submit" value="&#9758; geef antwoord"></input>
        </form>
      </div>
    );
  }
  handleForm(e){
    e.preventDefault();
    const answer = document.getElementById('answer').value
    this.setState({givenAnswer: answer})
    if(answer !== ''){
      console.log('The given answer to this question by this team is: ' + answer);
      let da = new DataAccess();
      da.putData(`/games/${this.props.roomNumber}/rounds/current/answers/current`, {team: this.props.teamName, answer: answer}, (err, res) => {
        if (err) throw new error();
        this.setState({formSubmitted: true, errors: false});
      });
    } else {
      this.setState({errors: true});
    }
  }
  answerGiven(){
    return (
      <div>
        <span>Als u geen ander antwoord opgeeft is uw antwoord op deze vraag: <strong className="success">{this.state.givenAnswer}</strong></span>
        <small className="spacingBelow">De quizzmaster laad de volgende vraag of stopt de quiz. Een moment geduld alstublieft.</small>
        <button className="block" onClick={this.resetAnswerState} type="submit">Wil je een ander antwoord opgeven?</button>
      </div>
    );
  }
  resetAnswerState(){
    this.setState(this.baseState);
  }
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header question--wrapper">
          {this.getQuestion()}
          {this.state.formSubmitted ? this.answerGiven() : this.typeAnswer()}
          {this.state.errors && <strong className="error">Je antwoord mag niet leeg zijn!</strong>}
        </div>
      </div>
    );
  }
}
