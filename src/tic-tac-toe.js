import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import CreateGame from './create-game'
import RegisterPlayer from './register-player'
import GameBoard from './game-board'
/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

class TicTacToe extends Component {

  constructor(props) {
    super(props);
    this.state = {registerUserNow: false, newGameCreated: false};
    this.onCreated = this.onCreated.bind(this);
    this.onPlayerRegistered = this.onPlayerRegistered.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  joinGame() {
    this.setState({registerUserNow: true, gameBoardId: this.props.firstAvailableGameBoard.id})
  }

  showJoinButton() {
    if (this.props.firstAvailableGameBoard && !this.state.newGameCreated) {
      return <button onClick={this.joinGame}>Join Game</button>
    }
  }

  onCreated(gameBoardId) {
    this.setState({gameBoardId: gameBoardId, registerUserNow: true, newGameCreated: true})
  }

  displayGameBoard() {
    if (this.state.playerRegistered) {
      return <GameBoard yourPlayerId={this.state.playerId} gameBoardId={this.state.gameBoardId}/>
    }
  }

  onPlayerRegistered(playerId) {
    this.setState({playerRegistered: true, playerId: playerId});
  }


  registerUserWithGame() {
    if (this.state.registerUserNow && (this.state.gameBoardId || this.state.gameBoardId >= 0)) {
      return <RegisterPlayer gameBoardId={this.state.gameBoardId} onRegistration={this.onPlayerRegistered}/>
    }
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>Lets playe Tic Tac Toe</h1>
          <CreateGame onCreated={this.onCreated}/>
          {this.showJoinButton()}
          {this.registerUserWithGame()}
          {this.displayGameBoard()}
        </div>)
    }
  }
}

