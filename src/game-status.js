import React, {Component} from 'react';

class GameStatus extends Component {

  displayWinningMessage() {
    const player = this.props.specificGameBoard.players[0].browserId === this.props.browserId ? this.props.specificGameBoard.players[0] : this.props.specificGameBoard.players[1]
    return player.status ? ' - You ' + player.status : '';
  }

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'center', fontSize: '40px', background: 'lightgray', margin: '15px 0'}}>
        <div style={{display: 'flex'}}>{this.props.specificGameBoard.status} {this.displayWinningMessage()}</div>
      </div>
    );
  }
}

export default GameStatus;
