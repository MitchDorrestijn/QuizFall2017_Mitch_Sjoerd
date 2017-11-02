import React from 'react';
import CreateTeam from './CreateTeam';
import GameRules from './GameRules';

export default class IntroScreen extends React.Component {
  constructor(props){
    super(props);
    this.handleJoinTeamClick = this.handleJoinTeamClick.bind(this);
    this.handleCreateTeamClick = this.handleCreateTeamClick.bind(this);
    this.passTeamName = this.passTeamName.bind(this);
    this.passApproval = this.passApproval.bind(this);
    this.state = {
      joinTeamClicked: false,
      createTeamClicked: false
    }
  }
  handleJoinTeamClick(){
    this.setState((prevState) => {return ({joinTeamClicked: !prevState.joinTeamClicked, createTeamClicked: !!prevState.joinTeamClicked})});
  }
  handleCreateTeamClick(){
    this.setState((prevState) => {return ({createTeamClicked: !prevState.createTeamClicked, joinTeamClicked: !!prevState.createTeamClicked})});
  }
  passTeamName(teamName){
    this.props.getTeamName(teamName);
  }
  passApproval(approved){
    this.props.getApproval(approved);
  }
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header">
          {this.state.joinTeamClicked && <GameRules />}
          {this.state.createTeamClicked &&
            <CreateTeam
              print={this.props.print}
              socket={this.props.socket}
              openSocket={this.props.openSocket}
              roomNumber={this.props.roomNumber}
              passTeamname={(teamName) => this.passTeamName(teamName)}
              passApproval={(approved) => this.passApproval(approved)}
              teamName={this.props.teamName}
            />}
          {this.state.joinTeamClicked || this.state.createTeamClicked || <h1>Welkom in kamer <span className="success">{this.props.roomNumber}</span></h1>}
          {this.state.joinTeamClicked || (<button id="joinBtn" onClick={this.handleJoinTeamClick}>{this.state.createTeamClicked ? 'Of bekijk de spelregels' : 'Bekijk spelregels'}</button>)}
          {this.state.createTeamClicked || (<button onClick={this.handleCreateTeamClick}>{this.state.joinTeamClicked ? 'Begrepen, laat we spelen!' : 'Maak een team'}</button>)}
        </div>
      </div>
    );
  }
}
