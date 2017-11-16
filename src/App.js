import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SnakeContainer from "./SnakeGame/container";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Thank you Stack Overflow
  // Regex on a URL to grab parameters by name
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  render() {
    const boardSize = parseInt(this.getParameterByName("boardSize")) || 20;
    const gameSpeed = parseInt(this.getParameterByName("gameSpeed")) || 300;
    return (
      <div className="item-container">
        <h2>SNEK</h2>
        <div className="row">
          <input type="number" min="5" ref="boardSize" />
          <input type="number" min="200" ref="gameSpeed" step="100" />
          <button onClick={() => {
            window.location = `/?boardSize=${this.refs.boardSize.value || 5}&gameSpeed=${this.refs.gameSpeed.value || 200}`
          }}>
            Set Up Game
          </button>
        </div>
        <div style={{marginBottom: 20}}>
          {
            this.state.over ? (
              <a href="#" onClick={(e) => { e.preventDefault(); this.refs.game.resetGame() }}>Reset</a>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); this.refs.game.startGame() }}>Start</a>
            )
          }

        </div>
        <SnakeContainer ref="game" boardSize={boardSize} gameSpeed={gameSpeed} onDone={() => { this.setState({ over: true }) }} />
      </div>
    );
  }
}

export default App;
