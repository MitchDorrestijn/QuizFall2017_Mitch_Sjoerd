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
      for (let i = 0; i < res.length; i++) {
        allGivenAnswers.push(res[i].teamAnswers.answer);
      }
      this.setState({givenAnswers: allGivenAnswers});
      this.props.getAllGivenAnswers(allGivenAnswers);
      console.log("resultaat is"+res);
    });
  }



  handleCorrectQuestions(answer) {
    this.setState({correctGivenAnswers: answer});
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
          options={this.props.correctGivenAnswers.map(i => { return { label: i, value: i }; })}
          value={this.state.correctGivenAnswers}
          noResultsText="Geen antwoorden gevonden"
          className="selectField"
        />
        <button onClick={this.props.resetStateAndScreens} type="submit">Selecteer een nieuwe vraag</button>
        {
          // TODO: AWARD POINTS TO THE TEAMS THAT HAVE THE ANSWER CORRECT.
          console.log(this.state.correctGivenAnswers)}
      </div>
    );
  }
}
