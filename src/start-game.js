import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function StartGame({mutate, onJoined, browserId, playerName, playerId}) {


  return (
    <button style={{fontSize: '20px', margin: '10px'}} onClick={() => {
      let promise = mutate({variables: {browserId, playerId, playerName}});
      promise.then((data)=>onJoined(data.data.joinGame));
    }}>
      Start Game
    </button>
  )
}

// You can also use `graphql` for GraphQL mutations
export default graphql(gql`
    mutation joinGame($browserId: String, $playerId: String!, $playerName: String!){
        joinGame(browserId: $browserId, playerId: $playerId, playerName: $playerName)
    }
`)(StartGame);
