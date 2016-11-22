import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import {find, propEq} from 'ramda'
import Cell from './cell'

class Grid extends Component {

  constructor(props) {
    super(props);
    this.state = {'clickable': false};
  }
  getPlayer(id) {
    if (id) {
      return find(propEq('id', id))(this.props.specificGameBoard.players)
    }
  }

  render() {
    console.log('grid: state: ',this.state, this.props) ;
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


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription OnlyNeededWithPassingVars {
            gameUpdated {
                status
                nextTurn   {
                    id
                    status
                    value
                    name
                }
                cells{
                    id
                    value
                    partOfWinLine
                }
                players {
                    id
                    status
                    value
                }
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY,
      variables: {"gameBoardId": 0}
    }).subscribe({
      next(data) {
        updateCommentsQuery((previousResult, {gameBoardId}) => {
          previousResult.specificGameBoard.cells = data.gameUpdated.cells;
          previousResult.specificGameBoard.nextTurn = data.gameUpdated.nextTurn;
          previousResult.specificGameBoard.status = data.gameUpdated.status;
          return previousResult;
        });
      },
      error(err) {
        console.error('err', err);
      },
    });
  }


  componentDidMount() {
    if (this.props.loading === false) {
      this.subscribe(this.props.updateCommentsQuery);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
    if (!this.props.loading) {
      let currentPlayer = this.getPlayer(nextProps.yourPlayerId);
      let isClickable = currentPlayer.id === nextProps.specificGameBoard.nextTurn.id;
      let isGameOver = nextProps.specificGameBoard.status === 'Game Over';
      this.setState({clickable: isClickable, currentPlayer: nextProps.specificGameBoard.nextTurn, isGameOver});
    }
    this.subscribe(nextProps.updateCommentsQuery);
  }

  componentWillUnmount() {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
  }


}


export default withApollo(graphql(gql`
    query specificGameBoard($gameBoardId: Int!) {
        specificGameBoard(gameBoardId: $gameBoardId) {
            id
            status
            nextTurn  {
                id
                status
                value
                name
            }
            cells {
                id
                value
                partOfWinLine
            }
            players {
                id
                status
                value
            }
        }
    }`, {
  props({data: {loading, specificGameBoard, updateQuery}}) {
    return {loading, specificGameBoard, updateCommentsQuery: updateQuery};
  }
})(Grid));
