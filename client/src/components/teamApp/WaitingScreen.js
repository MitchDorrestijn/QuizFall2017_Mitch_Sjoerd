import React from 'react';

const WaitingScreen = () => {
  return (
    <div className="intro--header">
      <div className="inner--header">
        <h1>Wachten op de quizmaster
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        </h1>
        <p>De quizmaster doet wat administratie. Maak je gereed voor de eventuele volgende vraag :)</p>
      </div>
    </div>
  );
}

export default WaitingScreen;
