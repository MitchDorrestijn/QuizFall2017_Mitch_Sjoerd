import React from 'react';

export default class CreateTeam extends React.Component {
  constructor(props){
    super(props);
    this.showForm = this.showForm.bind(this);
    this.handleForm = this.handleForm.bind(this);
    this.state = {
      formSubmitted: false,
      errors: false
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
    const teamName = document.getElementById('teamName').value
    if(teamName !== ''){
      // TODO: PUT THE TEAMNAME IN THE DATABASE
      console.log('The teamname to put in the database is: ' + teamName);
      this.setState({formSubmitted: true, errors: false});
    } else {
      this.setState({errors: true});
    }
  }
  render(){
    return (
      <div>
        <h1>Een team opgeven</h1>
        {this.state.formSubmitted || this.showForm()}
        {this.state.formSubmitted && <div className="underH1"><p>Bedankt voor het meedoen. <br /> De Quizzer start zodra de Quizmaster op start drukt en je team goedkeurd!</p></div>}
        {this.state.errors && <strong className="error">Je teamnaam mag niet leeg zijn!</strong>}
        {this.state.formSubmitted && document.getElementById("joinBtn").remove()}
      </div>
    );
  }
}
