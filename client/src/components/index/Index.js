import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import DataAccess from '../../scripts/DataAccess';

export default class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: null,
      error: false
    }
    this.handleForm = this.handleForm.bind(this);
  }
  handleForm(e){
    e.preventDefault();
    let givenRoomNumber = document.getElementById('roomNumber').value;
    if(givenRoomNumber === "") givenRoomNumber = " ";
    let da = new DataAccess();
    let linkToRedirectTo = `/quiz/${givenRoomNumber}`;
    let redirect = <Redirect to={linkToRedirectTo} />;
    da.getData(`/games/${givenRoomNumber}/rounds/current`, (err, res) => {
    if(err){
       this.setState ({error: true});
     } else {
       this.setState ({redirect: redirect});
     }
    });
  }
  render() {
    return (
      <div className="intro--header">
        <div className="inner--header">
          <h1>Type een kamercode om de Quizzer te spelen</h1>
          <form className="createTeam full-width-form">
            <input id="roomNumber" placeholder="Type hier een kamercode" type="text"></input>
            <input onClick={this.handleForm} type="submit" value="&#9758; Join kamer"></input>
            {this.state.error && <strong className="error block">Deze kamer bestaat niet!</strong>}
            {this.state.redirect}
          </form>
          <Link className="btnLink" to="/master">Of maak een Quiz aan</Link>
        </div>
      </div>
    );
  };
}
