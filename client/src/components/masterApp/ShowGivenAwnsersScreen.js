import React from 'react';
import Select from "react-select";
import "react-select/dist/react-select.css";

export default class ShowGivenAwnsersScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      correctAwnsers: []
    }
    this.handleCorrectQuestions = this.handleCorrectQuestions.bind(this);
  }
  handleCorrectQuestions(awnser) {
    this.setState({correctAwnsers: awnser});
  }
  render(){
    // TODO: GET THE AWNSER FROM THE CURRENT QUESTION FROM THE DATABASE.
    return(
      <div className="showAwnser--wrapper">
        <h1>{this.props.valueOfTheSelectedQuestion}</h1>
        <span>Het goede antwoord op deze vraag was: <strong className="success">(getAwnserFromDatabase)</strong></span>
        <Select
          onChange={this.handleCorrectQuestions}
          searchable={false}
          multi={true}
          closeOnSelect={false}
          placeholder="Klik hier om de goede antwoorden te selecteren."
          options={this.props.givenAwnsers.map(i => { return { label: i, value: i }; })}
          value={this.state.correctAwnsers}
          className="selectField"
        />
        <button onClick={this.props.resetStateAndScreens} type="submit">Selecteer een nieuwe vraag</button>
        {
          // TODO: AWARD POINTS TO THE TEAMS THAT HAVE THE AWNSER CORRECT.
          console.log(this.state.correctAwnsers)}
      </div>
    );
  }
}
