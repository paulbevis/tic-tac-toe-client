import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

function StartGame({mutate, gameInProgress, onJoined, browserId, playerName, playerId}) {
  return (
    <button disabled={gameInProgress ? 'disabled' : ''} style={{fontSize: '20px', margin: '10px'}} onClick={() => {
      let promise = mutate({variables: {browserId, playerId, playerName}});
      promise.then((data) => onJoined(data.data.joinGame));
    }}>
      Start New Game
    </button>
  )
}

// You can also use `graphql` for GraphQL mutations
export default graphql(gql`
    mutation joinGame($browserId: String, $playerId: String!, $playerName: String!){
        joinGame(browserId: $browserId, playerId: $playerId, playerName: $playerName)
    }
`)(StartGame);
