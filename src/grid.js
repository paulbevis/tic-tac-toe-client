import React, {Component} from 'react';

import {find, propEq} from 'ramda'
import Cell from './cell'

class Grid extends Component {

  constructor(props) {
    super(props);
    this.state = {'clickable': false};
  }

  getPlayer(browserId) {
    if (browserId) {
      return find(propEq('browserId', browserId))(this.props.specificGameBoard.players)
    }
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', width: '32%', alignItems: 'center'}}>
          <div style={{display: 'flex'}}>
            <Cell cell={this.props.specificGameBoard.cells[0]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[1]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[2]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
          <div style={{display: 'flex'}}>
            <Cell cell={this.props.specificGameBoard.cells[3]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[4]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[5]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
          <div style={{display: 'flex'}}>
            <Cell cell={this.props.specificGameBoard.cells[6]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[7]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[8]} isGameOver={this.state.isGameOver} clickable={this.state.clickable} player={this.state.currentPlayer} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
        </div>

      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.loading) {
      let currentPlayer = this.getPlayer(nextProps.browserId);
      let isClickable = (currentPlayer.browserId === nextProps.specificGameBoard.nextTurn.browserId);
      let isGameOver = nextProps.specificGameBoard.status === 'Game Over';
      var newState = {clickable: isClickable, currentPlayer: nextProps.specificGameBoard.nextTurn, isGameOver};
      this.setState(newState);
    }
  }
}
export default Grid
