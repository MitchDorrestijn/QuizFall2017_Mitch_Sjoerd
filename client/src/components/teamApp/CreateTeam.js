import React from 'react';
import DataAccess from '../../scripts/DataAccess';

export default class CreateTeam extends React.Component {
  constructor(props){
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.stripColon = this.stripColon.bind (this);
    this.state = {
      formSubmitted: false,
      errors: false,
      teamInfo: [],
      teamExists: false,
      teamName: ""
    }
  }
  stripColon (evt) {
    if (!evt.target.value.includes (":")) {
      this.setState ({teamName: evt.target.value});
    }
  }
  showForm(){
    return (
      <div className="createTeam">
        <form id="createTeam">
          <input id="teamName" placeholder="Type hier je teamnaam" value={this.state.teamName} onChange={this.stripColon} type="text"></input>
          <input onClick={this.handleForm} type="submit" value="&#9758; maak aan"></input>
        </form>
      </div>
    );
  }
  handleForm(e){
    e.preventDefault();
    const teamName = document.getElementById('teamName').value.replace(":", "");
    if(teamName !== ''){
      let da = new DataAccess();
      da.postData(`/games/${this.props.roomNumber}/teams`, {name: teamName}, (err, res) => {
        if(err){
          this.setState({teamExists: true});
        } else {
          document.getElementById("joinBtn").remove();
          this.setState({teamExists: false, formSubmitted: true, errors: false, teamInfo: res});
	      this.props.openSocket (this.props.roomNumber, res.teamId, teamName);
        }
      });
      this.props.passTeamname(teamName);
    } else {
      this.setState({errors: true});
    }
  }
  render(){
    return (
      <div>
        <h1>Een team opgeven</h1>
        {this.state.formSubmitted || this.showForm()}
        {this.state.formSubmitted && <div className="underH1"><p>Bedankt voor het meedoen. <br /> De quizmaster gaat beslissen of je mee mag doen.</p></div>}
        {this.state.errors && <strong className="error">Je teamnaam mag niet leeg zijn!</strong>}
        {this.state.teamExists && <strong className="error">Deze teamnaam is al door een ander opgegeven!</strong>}
      </div>
    );
  }
}
