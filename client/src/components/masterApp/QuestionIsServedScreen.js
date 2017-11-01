import React from 'react';

const QuestionIsServedScreen = (props) => {
  return(
    <div className="question--wrapper">
      <h1>{props.valueOfTheSelectedQuestion}</h1>
      <span>Nu kunnen de teams de bovenstaande vraag beantwoorden.</span>
      <span>Momenteel hebben 2 van de 3 teams de vraag beantwoord.</span>
      <button onClick={props.closeQuestion}>Sluit vraag en bekijk antwoorden</button>
    </div>
  );
}

export default QuestionIsServedScreen;
