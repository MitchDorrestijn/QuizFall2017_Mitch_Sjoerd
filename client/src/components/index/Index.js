import React from 'react';
import {Link} from 'react-router-dom';

export default class Index extends React.Component {
  constructor(props){
    super(props);
    this.handleForm = this.handleForm.bind(this);
  }

  handleForm(e) {
    e.preventDefault();
    const givenRoomNumber = document.getElementById('roomNumber').value;
    console.log('Check if roomNumber with number ' + givenRoomNumber + ' exists in the database.');
    // TODO: IF GIVEN ROOMNUMBER EXISTS IN DATABASE, REDIRECT THE USER TO /player/{givenRoomNumber}
  }

  render() {
    return (
      <div className="intro--header">
        <div className="inner--header">
          <h1>Type een kamercode om de Quizzer te spelen</h1>
          <form className="createTeam full-width-form">
            <input id="roomNumber" placeholder="Type hier een kamercode" type="text"></input>
            <input onClick={this.handleForm} type="submit" value="&#9758; Join kamer"></input>
          </form>
          <Link className="btnLink" to="/master">Of maak een Quiz aan</Link>
        </div>
      </div>
    );
  };
}
