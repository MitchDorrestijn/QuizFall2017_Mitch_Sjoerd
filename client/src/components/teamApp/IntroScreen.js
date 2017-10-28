import React from 'react';
import CreateTeam from './CreateTeam';
import GameRules from './GameRules';

export default class IntroScreen extends React.Component {
  constructor(props){
    super(props);
    this.handleJoinTeamClick = this.handleJoinTeamClick.bind(this);
    this.handleCreateTeamClick = this.handleCreateTeamClick.bind(this);
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
  render(){
    return (
      <div className="intro--header">
        <div className="inner--header">
          {this.state.joinTeamClicked && <GameRules />}
          {this.state.createTeamClicked && <CreateTeam />}

          {this.state.joinTeamClicked || this.state.createTeamClicked || <h1>Welkom in kamer [getRoomNumber]</h1>}
          {this.state.joinTeamClicked || (<button id="joinBtn" onClick={this.handleJoinTeamClick}>{this.state.createTeamClicked ? 'Of bekijk de spelregels' : 'Bekijk spelregels'}</button>)}
          {this.state.createTeamClicked || (<button onClick={this.handleCreateTeamClick}>{this.state.joinTeamClicked ? 'Begrepen, laat we spelen!' : 'Maak een team'}</button>)}
        </div>
      </div>
    );
  }
}
