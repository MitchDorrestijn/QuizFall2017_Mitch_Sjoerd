import React from 'react';

export default class IntroScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      quizIsOpen: false,
      // TODO: GET JOINED TEAMS FROM THE DATABASE.
      joinedTeams: ['Brogrammers', 'DigiMinds', 'Overdrive'],
      approvedTeams: ['a']
    }
    this.openQuiz = this.openQuiz.bind(this);
    this.handleOpenQuiz = this.handleOpenQuiz.bind(this);
    this.generateRoomNumber = this.generateRoomNumber.bind(this);
    this.manageTeams = this.manageTeams.bind(this);
    this.approveTeam = this.approveTeam.bind(this);
    this.rejectTeam = this.rejectTeam.bind(this);
  }
  handleOpenQuiz(){
    this.setState((prevState) => {return ({quizIsOpen: !prevState.quizIsOpen})});
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
    // TODO: GENARATE A STRONG PASSWORD AND PUT IT IN THE DATABASE.
    return (
      <div className="inline">
        <strong className="success">AroomNumber</strong>
      </div>
    )
  }
  manageTeams(){
    let teamNames = this.state.joinedTeams.map((teamName, index) => {
      return (
        <li key={teamName}>
          <button onClick={this.approveTeam.bind(this, teamName, index)}>{teamName} <span>Toelaten</span></button>
        </li>
      );
    });
    let approvedTeamNames = this.state.approvedTeams.map((teamName, index) => {
      return (
        <li key={teamName}>
          <button onClick={this.rejectTeam.bind(this, teamName, index)}>{teamName} <span>Weigeren</span></button>
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
    // TODO: PUT THE TEAMNAME IN THE DATABASE
    console.log("Team " + teamName + " has an index of " + index + " and is approved.");
  }
  rejectTeam(teamName, index){
    // TODO: REMOVE THE TEAMNAME FROM THE DATABASE (IF IT EXISTS)
    console.log("Team " + teamName + " has an index of " + index + " and is rejected.");
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
        {this.state.approvedTeams.length >= 1 && this.continue()}
      </div>
    );
  }
}
