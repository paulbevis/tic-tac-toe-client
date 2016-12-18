import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';
import {find, propEq, reject} from 'ramda'
import Grid from './grid'
import GameStatus from './game-status'

class GameBoard extends Component {

  getHomePlayerName(browserId) {
    if (this.props.specificGameBoard && browserId) {
      let myPlayer = find(propEq('browserId', browserId))(this.props.specificGameBoard.players);
      let value = ' (' + myPlayer.value + ')'
      return myPlayer.name ? myPlayer.name + value : 'Player 1' + value
    } else {
      return 'Waiting for a player...'
    }
  }

  getAwayPlayerName(browserId) {
    if (this.props.specificGameBoard) {
      if (browserId && this.props.specificGameBoard.players.length === 2) {
        let otherPlayer = reject(propEq('browserId', browserId))(this.props.specificGameBoard.players)[0];
        return 'Player 2 (' + otherPlayer.value + ')';
      } else {
        return 'Waiting for a player...'
      }
    }
  }

  displayGrid() {
    if (this.props.specificGameBoard || this.props.specificGameBoard >= 0) {
      return <Grid specificGameBoard={this.props.specificGameBoard} browserId={this.props.browserId} gameBoardId={this.props.gameBoardId} yourPlayerId={this.props.browserId}/>
    }
  }

  render() {
    const playerStyle = {display: 'flex', margin: '10px', fontSize: '30px', justifyContent: 'center', width: '32%'};
    const homePlayerStyle = Object.assign({}, playerStyle);
    const opponentPlayerStyle = Object.assign({}, playerStyle);
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      if (this.props.specificGameBoard.status.code === 'PLAYING') {
        if (this.props.specificGameBoard.nextTurn.browserId === this.props.browserId) {
          homePlayerStyle.color = 'green';
        } else {
          opponentPlayerStyle.color = 'green';
        }
      }
      return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <GameStatus specificGameBoard={this.props.specificGameBoard} gameBoardId={this.props.gameBoardId} browserId={this.props.browserId}/>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={homePlayerStyle}>{this.getHomePlayerName(this.props.browserId)}</div>
            {this.displayGrid()}
            <div style={opponentPlayerStyle}>{this.getAwayPlayerName(this.props.browserId)}</div>
          </div>
        </div>
      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription gameUpdated($gameBoardId: Int!) {
            gameUpdated(gameBoardId: $gameBoardId) {
                id
                status {
                    code
                    description
                }
                players {
                    id
                    endStatus
                    value
                    name
                    browserId
                }
                nextTurn   {
                    id
                    endStatus
                    value
                    name
                    browserId
                }
                cells {
                    id
                    value
                    partOfWinLine
                }
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY,
      variables: {gameBoardId:this.props.gameBoardId},
      operationName: 'gameUpdated'
    }).subscribe({
      next(data) {
        updateCommentsQuery((previousResult) => {
          previousResult.specificGameBoard.players = data.gameUpdated.players;
          previousResult.specificGameBoard.status = data.gameUpdated.status;
          previousResult.specificGameBoard.cells = data.gameUpdated.cells;
          previousResult.specificGameBoard.nextTurn = data.gameUpdated.nextTurn;
          return previousResult
        });
      },
      error(err) {
        console.error('err', err);
      },
    });
  }

  componentDidMount() {
    if (this.props.loading === false) {
      this.subscribe( this.props.updateCommentsQuery);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
    this.subscribe( nextProps.updateCommentsQuery);
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
            status {
                code
                description
            }
            players {
                id
                endStatus
                value
                name
                browserId
            }
            nextTurn   {
                id
                endStatus
                value
                name
                browserId
            }
            cells {
                id
                value
                partOfWinLine
            }
        }
    }`, {
  props({data: {loading, specificGameBoard, updateQuery}}) {
    return {loading, specificGameBoard, updateCommentsQuery: updateQuery};
  }
})(GameBoard));
