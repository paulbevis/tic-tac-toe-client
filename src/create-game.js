import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function CreateGame({mutate, onCreated}) {
  return (
    <button onClick={() => {
      let mutationPromise = mutate({variables: {}})
      mutationPromise.then((data)=> {
        onCreated(data.data.createNewGame)
      });
    }
    }>
      Create New Game
    </button>
  )
}

// You can also use `graphql` for GraphQL mutations
export default graphql(gql`
  mutation {
    createNewGame 
  }
`)(CreateGame);
