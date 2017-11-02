import React from 'react';
import DataAccess from '../../scripts/DataAccess';

export default class CreateTeam extends React.Component {
  constructor(props){
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.checkIfQuizmasterHasApprovedTheTeam = this.checkIfQuizmasterHasApprovedTheTeam.bind(this);
    this.state = {
      formSubmitted: false,
      errors: false,
      teamInfo: []
    }
  }
  showForm(){
    return (
      <div className="createTeam">
        <form id="createTeam">
          <input id="teamName" placeholder="Type hier je teamnaam" type="text"></input>
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
        if(err) throw new error();
        document.getElementById("joinBtn").remove();
        this.setState({formSubmitted: true, errors: false, teamInfo: res});
      });
      this.props.passTeamname(teamName);
    } else {
      this.setState({errors: true});
    }
  }
  checkIfQuizmasterHasApprovedTheTeam(){
    let da = new DataAccess();
    da.getData(`/games/${this.props.roomNumber}/teams/${this.state.teamInfo.teamId}`, (err, res) => {
      if(err) throw new error();
      this.props.passApproval(res.approved);
    });
  }
  render(){
    return (
      <div>
        <h1>Een team opgeven</h1>
        <button onClick={this.checkIfQuizmasterHasApprovedTheTeam}>Is het team goedgekeurd?</button>
        {this.state.formSubmitted || this.showForm()}
        {this.checkIfQuizmasterHasApprovedTheTeam}
        {this.state.formSubmitted && <div className="underH1"><p>Bedankt voor het meedoen. <br /> De quizmaster gaat beslissen of je mee mag doen.</p></div>}
        {this.state.errors && <strong className="error">Je teamnaam mag niet leeg zijn!</strong>}
      </div>
    );
  }
}
