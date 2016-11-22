import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import {find, propEq, reject} from 'ramda'

import Grid from './grid'

class GameBoard extends Component {

  getHomePlayerName(id) {
    if (this.props.specificGameBoard) {
      if (id) {
        let myPlayer = find(propEq('id', id))(this.props.specificGameBoard.players);
        let value = ' (' + myPlayer.value + ')'
        return myPlayer.name ? myPlayer.name + value : 'Player 1' + value
      } else {
        return 'Waiting for a player...'
      }
    }
  }

  getAwayPlayerName(id) {
    if (this.props.specificGameBoard) {
      if (id && this.props.specificGameBoard.players.length === 2) {
        let otherPlayer = reject(propEq('id', id))(this.props.specificGameBoard.players)[0];
        return 'Player 2 (' + otherPlayer.value + ')';
      } else {
        return 'Waiting for a player...'
      }
    }
  }

  displayBoard() {
    if (this.props.specificGameBoard || this.props.specificGameBoard >= 0) {
      return <Grid gameBoardId={this.props.gameBoardId} yourPlayerId={this.props.yourPlayerId}/>
    }
  }

  render() {
    // console.log('Gameboard: render props: ', this.props)
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <GameStatus gameBoardId={this.props.gameBoardId} yourPlayerId={this.props.yourPlayerId} />
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex', margin: '10px', fontSize: '30px', justifyContent: 'center', width: '32%'}}>{this.getHomePlayerName(this.props.yourPlayerId)}</div>
            {this.displayBoard()}
            <div style={{display: 'flex', margin: '10px', fontSize: '30px', flexGrow: '1', justifyContent: 'center', width: '32%'}}>{this.getAwayPlayerName(this.props.yourPlayerId)}</div>
          </div>
        </div>
      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription OnlyNeededWithPassingVars {
            gameJoined {
                status
                cells {
                    id
                    value
                }
                players {
                    id
                    status
                    value
                    name
                }
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY
    }).subscribe({
      next(data) {
        updateCommentsQuery((previousResult) => {
          previousResult.specificGameBoard.players = data.gameJoined.players;
          previousResult.specificGameBoard.status = data.gameJoined.status;
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
      this.subscribe(this.props.updateCommentsQuery);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
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
            cells {
                id
                value
            }
            players {
                id
                status
                value
                name
            }
        }
    }`, {
  props({data: {loading, specificGameBoard, updateQuery}}) {
    return {loading, specificGameBoard, updateCommentsQuery: updateQuery};
  }
})(GameBoard));
