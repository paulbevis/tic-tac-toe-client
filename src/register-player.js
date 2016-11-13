import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';


class RegisterPlayer extends Component {
  constructor(props) {
    super(props);
    // console.log('RegisterPlayer component: ', this.props);
    this.state = {player: null};
    let mutationPromise = props.mutate({variables: {playerId: "" + Date.now(), gameBoardId: this.props.gameBoardId}});
    mutationPromise.then((data)=> {
      this.setState({player: {id: data.data.registerPlayer.id, value: data.data.registerPlayer.value}});
      this.props.onRegistration(data.data.registerPlayer.id);
    });
  }

  displayUser() {
    if (this.state.player) {
      return <div>Welcome Player 1</div>
    }
  }

  render() {
    return (
      <div>
        {this.displayUser()}
      </div>)
  }
}


export default graphql(gql`
  mutation registerPlayer($playerId: String!, $gameBoardId:Int!) {
    registerPlayer(playerId: $playerId, gameBoardId:$gameBoardId) {
      id
      status
      value
    }
  }
`)(RegisterPlayer);
