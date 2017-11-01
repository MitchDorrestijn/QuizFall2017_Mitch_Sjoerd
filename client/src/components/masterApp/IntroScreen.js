import React from 'react';
import DataAccess from '../../scripts/DataAccess';

export default class IntroScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      quizIsOpen: false,
      joinedTeams: [],
      approvedTeams: [],
      roomNumber: ''
    }
    this.openQuiz = this.openQuiz.bind(this);
    this.handleOpenQuiz = this.handleOpenQuiz.bind(this);
    this.generateRoomNumber = this.generateRoomNumber.bind(this);
    this.manageTeams = this.manageTeams.bind(this);
    this.approveTeam = this.approveTeam.bind(this);
    this.rejectTeam = this.rejectTeam.bind(this);
    this.getjoinedTeams = this.getjoinedTeams.bind(this);
  }
  getjoinedTeams(){
    let da = new DataAccess();
    da.getData(`/games/${this.state.roomNumber}/teams`, (err, res) => {
      if(err) console.log (err.toString ());
      let approvedTeams = [];
      let joinedTeams = [];
      for (let i = 0; i < res.length; i++) {
       if (res[i].approved){
         approvedTeams.push(res[i]);
       } else {
         joinedTeams.push(res[i]);
       }
     }
     this.setState ({approvedTeams: approvedTeams, joinedTeams: joinedTeams});
    });
  }
  handleOpenQuiz(){
    let da = new DataAccess();
    da.postData(`/games`, {}, (err, res) => {
      if (err) throw new error();
      this.setState((prevState) => {return ({quizIsOpen: !prevState.quizIsOpen, roomNumber: res.password})});
      this.props.getRoomNumber(res.password);
      this.props.initWebSocket (res.password, this.getjoinedTeams);
    });
  }
  openQuiz(){
    return (
      <div>
        <h1>Welkom Quizmaster</h1>
        <button onClick={this.handleOpenQuiz} className="block" type="submit">Open een quiz</button>
      </div>
    );
  }
  generateRoomNumber(){
    return (
      <div className="inline">
        <strong className="success">{this.state.roomNumber}</strong>
      </div>
    )
  }
  manageTeams(){
    let teamNames = this.state.joinedTeams.map((teamName, index) => {
      return (
        <li key={teamName.name}>
          <button onClick={this.approveTeam.bind(this, teamName, index)}>{teamName.name} <span>Toelaten</span></button>
        </li>
      );
    });
    let approvedTeamNames = this.state.approvedTeams.map((teamName, index) => {
      return (
        <li key={teamName.name}>
          <button onClick={this.rejectTeam.bind(this, teamName, index)}>{teamName.name} <span>Weigeren</span></button>
        </li>
      );
    });
    return (
      <div>
        <h1>Wie mag er meedoen?</h1>
        <span>Er is een quizzer aangemaakt met kamernummer: {this.generateRoomNumber()}</span>
        <strong className="URL">De URL voor het scorebord is /bord/{this.generateRoomNumber()}</strong>
        <span>Hieronder verschijnen de teams die mee willen doen:</span>
        <ul className="teamList">
          {teamNames}
        </ul>
        {this.state.approvedTeams.length >= 1 && (
          <div className="spacingUp">
            <span>Hieronder staan de teams die mee gaan doen met de Quizzer:</span>
            <ul className="teamList">
              {approvedTeamNames}
            </ul>
          </div>
        )}
      </div>
    );
  }
  approveTeam(teamName, index){
    let da = new DataAccess();
    da.putData(`/games/${this.state.roomNumber}/teams/${teamName._id}`, {approved: true}, (err, res) => {
      if(err) throw error();
      this.getjoinedTeams();
    });
  }
  rejectTeam(teamName, index){
    let da = new DataAccess();
    da.putData(`/games/${this.state.roomNumber}/teams/${teamName._id}`, {approved: false}, (err, res) => {
      if(err) throw error();
      this.getjoinedTeams();
    });
  }
  continue(){
    return (
      <div>
        <button onClick={this.props.goToSelectCategoryScreen} className="block spacingUp" type="submit">Ga naar categorie selecteren</button>
      </div>
    );
  }
  render(){
    return (
      <div>
        {this.state.quizIsOpen ? this.manageTeams() : this.openQuiz()}
        {this.state.approvedTeams.length >= 2 && this.continue()}
      </div>
    );
  }
}
