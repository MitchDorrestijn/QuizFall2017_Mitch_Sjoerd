import React from 'react';

export default class QuestionScreen extends React.Component {
  constructor(props){
    super(props);
    this.getQuestion = this.getQuestion.bind(this);
    this.typeAwnser = this.typeAwnser.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.awnserGiven = this.awnserGiven.bind(this);
    this.resetAwnserState = this.resetAwnserState.bind(this);
    this.state = {
      formSubmitted: false,
      errors: false,
      givenAwnser: ""
    }
    this.baseState = this.state;
  }
  getQuestion(){
    return (
      // TODO: GET SELECTED QUESTION FROM THE QUIZMASTER.
      //TODO: ADD A QUESTION QOUNTER.
      <h1>1/12: Which letter of the alphabet appears only once in the names of all English and Scottish league football teams and not at all in the names of the elements in the Periodic Table?</h1>
    );
  }
  typeAwnser(){
    return (
      <div className="createTeam full-width-form">
        <form>
          <input id="awnser" placeholder="Type hier je antwoord" type="text"></input>
          <input onClick={this.handleForm} type="submit" value="&#9758; geef antwoord"></input>
        </form>
      </div>
    );
  }
  handleForm(e){
    e.preventDefault();
    const awnser = document.getElementById('awnser').value
    this.setState({givenAwnser: awnser})
    if(awnser !== ''){
      //TODO: CHECK IF THERE WAS AN AWNSER ALLREADY SUBMITTED.
      // TODO: ADD THE AWNSER TO THE DATABASE.
      console.log('The given awnser to this question by this team is: ' + awnser);
      this.setState({formSubmitted: true, errors: false});
    } else {
      this.setState({errors: true});
    }
  }
  awnserGiven(){
    return (
      <div>
        <span>Als u geen ander antwoord opgeeft is uw antwoord op deze vraag: <strong className="success">{this.state.givenAwnser}</strong></span>
        <small className="spacingBelow">De quizzmaster laad de volgende vraag of stopt de quiz. Een moment geduld alstublieft.</small>
        <button className="block" onClick={this.resetAwnserState} type="submit">Wil je een ander antwoord opgeven?</button>
      </div>
    );
  }
  resetAwnserState(){
    this.setState(this.baseState);
  }
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header question--wrapper">
          {this.getQuestion()}
          {this.state.formSubmitted ? this.awnserGiven() : this.typeAwnser()}
          {this.state.errors && <strong className="error">Je antwoord mag niet leeg zijn!</strong>}
        </div>
      </div>
    );
  }
}
