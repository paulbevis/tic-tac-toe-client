import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import {findIndex, propEq} from 'ramda'

class Player extends Component {

  getPlayerValue(id) {
    return find(propEq('id', id))(this.props.gameBoard.players).value
  }

  getPlayerName(isHomePlayer, homePlayerId) {
    if (!isHomePlayer && homePlayerId && this.props.gameBoard.players.length === 2) {
      console.log('Player: ', isHomePlayer, homePlayerId)
      let myPlayerPos = findIndex(propEq('id', homePlayerId))(this.props.gameBoard.players);
      console.log('found: ', myPlayerPos, this.props.gameBoard.players)
      let opponentPos = 0;
      if (myPlayerPos === 0) {
        opponentPos = 1;
      }
      return 'Player 2(' + this.props.gameBoard.players[opponentPos].value + ')';
    }
    return 'Waiting'
  }

  render() {
    console.log('player: props: ', this.props)
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{display: 'flex'}}>
          <div>{this.getPlayerName(this.props.isHome, this.props.homePlayerId)}</div>
        </div>


      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
       subscription OnlyNeededWithPassingVars {
           gameUpdated {
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
        console.log('from subscribe game....: ', data)
        updateCommentsQuery((previousResult) => {
          console.log('previous result', previousResult)
          return previousResult;//updating(updatedPost, previousResult);
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
    query gameBoard($gameBoardId: Int!) {
      gameBoard(gameBoardId: $gameBoardId) {
        players {
          id
          status
          value
        }
     }
  }`, {
  props({data: {loading, gameBoard, updateQuery}}) {
    return {loading, gameBoard, updateCommentsQuery: updateQuery};
  }
})(Player));
