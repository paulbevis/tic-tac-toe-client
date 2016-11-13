import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import CreateGame from './create-game'
import RegisterPlayer from './register-player'
import GameBoard from './game-board'

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
  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription newGameCreated {
            newGameCreated {
                id
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY
    }).subscribe({
      next(data) {
        updateCommentsQuery(() => {
          return {firstAvailableGameBoard: {id: data.newGameCreated.id}};
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
    query firstAvailableGameBoard {
        firstAvailableGameBoard {
            id
        }
    }`, {
  props({data: {loading, firstAvailableGameBoard, updateQuery}}) {
    return {loading, firstAvailableGameBoard, updateCommentsQuery: updateQuery};
  }
})(TicTacToe));