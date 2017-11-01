import React from 'react';
import DataAccess from '../../scripts/DataAccess';

class QuestionIsServedScreen extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			teamCount: 0,
			teamsAnswered: 0
		};
		this.getAnswerCount = this.getAnswerCount.bind (this);
	}

	componentWillMount () {
		this.getAnswerCount ();
		this.props.wsRefreshGivenAnswers (this.getAnswerCount)
	}

	getAnswerCount () {
		let da = new DataAccess ();
		let teamCount = 0;
		let teamsAnswered = 0;
		da.getData (`/games/${this.props.roomNumber}/rounds/current/answers/current`, (err, answer) => {
			if (err) {
				throw (err);
			} else {
				teamsAnswered = answer.teamAnswers.length;
				da.getData (`/games/${this.props.roomNumber}/teams`, (err2, teams) => {
					if (err2) {
						throw (err2);
					} else {
						for (let elem of teams) {
							if (elem.approved) {
								teamCount++;
							}
						}
						this.setState ({teamCount: teamCount, teamsAnswered: teamsAnswered});
					}
				});
			}
		});
	}

	render () {
		return (
			<div className="question--wrapper">
				<h1>{this.props.valueOfTheSelectedQuestion}</h1>
				<span>Nu kunnen de teams de bovenstaande vraag beantwoorden.</span>
				<span>Momenteel hebben {this.state.teamsAnswered} van de {this.state.teamCount} teams de vraag beantwoord.</span>
				<button onClick={this.props.closeQuestion}>Sluit vraag en bekijk antwoorden</button>
			</div>
		);
	}
}

export default QuestionIsServedScreen;
