import React from 'react';
import openSocket from 'socket.io-client';
import DataAccess from '../../scripts/DataAccess';
import {Redirect} from 'react-router-dom';

export default class BoardApp extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			roomNumber: window.location.pathname.replace ("/bord/", ""),
			question: null,
			roundNumber: null,
			category: null,
			closed: false,
			questionNumber: null,
			maxQuestions: null,
			result: [],
			redirect: null
		};
		this.socket = null;
		this.getScoreBoard = this.getScoreBoard.bind (this);
	}

	componentWillMount () {
		this.getScoreBoard ();
		this.socket = openSocket (`/ws/${this.state.roomNumber}/scores`);
		this.socket.on ('updateScore', () => {
			this.getScoreBoard ();
		});
	}

	getScoreBoard () {
		let da = new DataAccess ();
		da.getData (`/games/${this.state.roomNumber}/scores`, (err, res) => {
			if (err) {
				let redirect = <Redirect to="/" />;
				this.setState ({redirect: redirect});
			} else {
				let items = [];
				console.log (res);
				for (let i = 0; i < res.scores.length; i++) {
					let subItem;
					let item;
					for (let j = 0; j < res.currentQuestion.teamAnswers.length; j++) {
						if (res.scores [i].team === res.currentQuestion.teamAnswers [j].team) {
							if (res.currentQuestion.closed) {
								if (res.currentQuestion.teamAnswers [j].answer) {
									subItem = (
										<div>
											<strong className="rightOrWrong">
												Dit team had deze vraag als volgt beantwoord:
											</strong>
											<span
												className={res.currentQuestion.teamAnswers[i].approved ? "rightAnswer" : "wrongAnswer"}>&nbsp;
												{res.currentQuestion.teamAnswers[j].answer}
											</span>
										</div>);
								} else {
									subItem = (
										<div>
											<strong className="rightOrWrong">
												Dit team had deze vraag niet beantwoord
											</strong>
										</div>);
								}
							} else {
								subItem = (
									<div>
										<strong className="rightOrWrong">
											Dit team had deze vraag beantwoord
										</strong>
									</div>);
							}
						}
					}
					item = (<li className="singleTeam">
						<h4>{res.scores[i].team}</h4>
						<ul>
							<li>Aantal vragen goed: {res.scores[i].correctAnswers}</li>
							<li>Aantal Round Points: {res.scores[i].roundPoints}</li>
						</ul>
						{subItem}
					</li>);
					items.push (item);
				}
				this.setState ({
					result: items,
					closed: res.currentQuestion.closed,
					category: res.currentQuestion.category,
					question: res.currentQuestion.name,
					roundNumber: res.roundNumber,
					questionNumber: res.questionNumber,
					maxQuestions: res.maxQuestions
				});
				console.log (items);
			}
		});
	}
	render () {
		let result = this.state.result.map ((elem, iterator) => {
			return <div key={iterator}>{elem}</div>;
		});
		return (
			<div className="scorebord--wrapper intro--header">
					{this.state.redirect}
				<div className="inner--header">
					{
						this.state.questionNumber !== null ?
						<h1 className="question">{this.state.questionNumber}/{this.state.maxQuestions} {this.state.question}</h1> :
						<div>
							<h1 className="question">Welkom!</h1>
						</div>
					}
					{
						this.state.questionNumber !== null &&
						(this.state.closed ?
							<strong className="error questionStatus">
								De vraag is gesloten. De quizmaster keurt nu uw antwoorden
							</strong> :
							<strong className="success questionStatus">
								Geef alstublieft nu een antwoord
							</strong>)
					}
					<ul className="teamScores">
						{result}
					</ul>
					{
						this.state.questionNumber !== null &&
						<small className="roundInfo">
							Dit is ronde <i>
							{this.state.roundNumber}
						</i>, deze vraag is afkomstig uit de <i>{this.state.category}</i> categorie.
						</small>
					}
				</div>
			</div>
		);
	}
}
