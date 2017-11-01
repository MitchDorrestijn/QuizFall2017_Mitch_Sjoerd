import React from 'react';
import Select from "react-select";
import "react-select/dist/react-select.css";
import DataAccess from '../../scripts/DataAccess';

export default class ShowGivenAnswersScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      givenAnswers: [],
      correctGivenAnswers: []
    }
    this.handleCorrectQuestions = this.handleCorrectQuestions.bind(this);
  }

  componentDidMount(){
    let da = new DataAccess();
    da.getData(`/games/${this.props.roomNumber}/rounds/current/answers/current`, (err, res) => {
      if(err) throw new error();
      let allGivenAnswers = [];
      for (let i = 0; i < res.teamAnswers.length; i++) {
        allGivenAnswers.push(res.teamAnswers[i]);
      }
      this.setState({givenAnswers: allGivenAnswers});
      this.props.getAllGivenAnswers(allGivenAnswers);
    });
  }
  handleCorrectQuestions(answer) {
    this.setState({correctGivenAnswers: answer});
    this.props.getAllCorrectAnswers(answer);
  }
  render(){
    return(
      <div className="showAnswer--wrapper">
        <h1>{this.props.valueOfTheSelectedQuestion}</h1>
        <span>Het goede antwoord op deze vraag was: <strong className="success">{this.props.answer}</strong></span>
        <Select
          onChange={this.handleCorrectQuestions}
          searchable={false}
          multi={true}
          closeOnSelect={false}
          placeholder="Klik hier om de goede antwoorden te selecteren."
          options={this.props.correctGivenAnswers.map((answers, i) => { return ({label: answers.team + ": " + answers.answer, value: answers.answer} ); })}
          value={this.state.correctGivenAnswers}
          noResultsText="Geen antwoorden gevonden"
          className="selectField"
        />
        <button onClick={this.props.resetStateAndScreens} type="submit">Selecteer een nieuwe vraag</button>
      </div>
    );
  }
}
