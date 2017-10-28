import React from 'react';

export default class selectAQuestionScreen extends React.Component {
  constructor(props){
    super(props);
  }
  renderQuestionList(){
    let questionsFromState = this.props.availableQuestions.map((question) => {
      return (
        <li key={question}>
          <label>
            <input type="radio" value={question} checked={this.props.valueOfTheSelectedQuestion === question} onChange={this.props.getSelectedQuestion} />
            {question}
          </label>
        </li>
      );
    });
    return(
      <ul className="questionList">
        {questionsFromState}
      </ul>
    );
  }
  render(){
    return(
      <div>
        <h1>Welke vraag moet er beantwoord worden?</h1>
        <span>De Quizzer heeft de volgende vragen geselecteerd op basis van de door uw gekozen categorieën:</span>
        <form onSubmit={this.props.sendQuestionToTheTeams}>
          {this.renderQuestionList()}
          {this.props.thereIsAQuestionSelected ? <button type="submit">Stuur vraag naar de teams</button> : <span>Selecteer alstublieft een vraag.</span>}
        </form>
      </div>
    );
  }
}
