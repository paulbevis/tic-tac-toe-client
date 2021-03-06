import React, {Component} from 'react';
import StartGame from './start-game'
import GameBoard from './game-board'
import PlayerName from './player-name'

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
    this.state = {registerUserNow: false, newGameCreated: false, playerName: ''};
    this.onJoined = this.onJoined.bind(this);
    this.onPlayerRegistered = this.onPlayerRegistered.bind(this);
    this.onPlayerNameUpdate = this.onPlayerNameUpdate.bind(this);
    this.onGameEnded = this.onGameEnded.bind(this);
  }

  onGameEnded() {
    console.log('onGameEnded')
    this.setState({
      gameBoardId: this.state.gameBoardId,
      registerUserNow: true,
      newGameCreated: true,
      playerName: this.state.playerName,
      gameInProgress: false
    })
  }

  onJoined(gameBoardId) {
    console.log('onGamestarted')
    this.setState({
      gameBoardId: gameBoardId,
      registerUserNow: true,
      newGameCreated: true,
      playerName: this.state.playerName,
      gameInProgress: true
    })
  }

  displayGameBoard() {
    if (this.state.gameBoardId >= 0) {
      return <GameBoard browserId={this.props.browserId}
                        yourPlayerId={this.state.playerId}
                        gameBoardId={this.state.gameBoardId}
                        onGameEnded={this.onGameEnded}/>
    }
  }

  onPlayerRegistered(playerId) {
    this.setState({playerRegistered: true, playerId: playerId});
  }

  onPlayerNameUpdate(event) {
    this.setState({playerName: event.target.value, playerId: '' + event.target.value.hashCode()});
  }

  displayStartGame() {
    if (this.state.playerName.length !== 0) {
      return <StartGame gameInProgress={this.state.gameInProgress}
                        onJoined={this.onJoined}
                        browserId={this.props.browserId}
                        playerName={this.state.playerName}
                        playerId={this.state.playerId}/>
    }
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>Tic Tac Toe</h1>
          <PlayerName onChange={this.onPlayerNameUpdate}/>
          {this.displayStartGame()}
          {this.displayGameBoard()}
        </div>)
    }
  }
}

export default TicTacToe;