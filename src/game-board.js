import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import {find, propEq} from 'ramda'

import Grid from './grid'

class GameBoard extends Component {

  getPlayerName(id) {
    if (this.props.specificGameBoard) {
      if (id) {
        let myPlayer = find(propEq('id', id))(this.props.specificGameBoard.players);
        return 'Player 1(' + myPlayer.value + ')'
      } else {
        if (this.props.specificGameBoard.players.length === 2) {
          return 'Player 2'
        } else {
          return 'Waiting for a player...'
        }
      }
    }
  }

  displayBoard() {
    if (this.props.specificGameBoard || this.props.specificGameBoard >= 0) {
      return <Grid gameBoardId={this.props.gameBoardId} yourPlayerId={this.props.yourPlayerId}/>
    }
  }

  render() {
    console.log('Gameboard: render props: ', this.props)
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{display: 'flex'}}>
          <div>{this.getPlayerName(this.props.yourPlayerId)}</div>
          {this.displayBoard()}
          <div>{this.getPlayerName()}</div>
        </div>
      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription OnlyNeededWithPassingVars {
            gameUpdated {
                status
                cells {
                    id
                    value
                }
                players {
                    id
                    status
                    value
                }
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY
    }).subscribe({
      next(data) {
        updateCommentsQuery((previousResult) => {
          previousResult.specificGameBoard.players = data.gameUpdated.players;
          previousResult.specificGameBoard.status = data.gameUpdated.status;
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
            }
        }
    }`, {
  props({data: {loading, specificGameBoard, updateQuery}}) {
    return {loading, specificGameBoard, updateCommentsQuery: updateQuery};
  }
})(GameBoard));
