import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

class GameStatus extends Component {

  displayWinningMessage() {
    const player = this.props.specificGameBoard.players[0].id === this.props.yourPlayerId ? this.props.specificGameBoard.players[0] : this.props.specificGameBoard.players[1]
    const result = player.status ? ' - You ' + this.props.specificGameBoard.players[0].status : '';
    if (this.props.specificGameBoard.status === 'Game Over' && result) {
      return result
    }
  }
  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{display: 'flex', justifyContent: 'center', fontSize: '40px', background: 'lightgray', margin: '15px 0'}}>
          <div style={{display: 'flex'}}>{this.props.specificGameBoard.status} {this.displayWinningMessage()}</div>
        </div>
      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription OnlyNeededWithPassingVars {
            gameStatusUpdated {
                status
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
            status
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
})(GameStatus));
