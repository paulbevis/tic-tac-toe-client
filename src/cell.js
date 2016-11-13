import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function Cell({mutate, cell, playerValue, gameBoardId}) {
  console.log('cell/playerValue: ', cell)
  return (
    <button onClick={() => mutate({variables: {playerValue, cellId: cell.id, gameBoardId: gameBoardId}})}>
      {cell.value}
    </button>
  )
}

// You can also use `graphql` for GraphQL mutations
export default graphql(gql`
    mutation selectCell($playerValue: String!, $cellId: Int!, $gameBoardId: Int!) {
        selectCell(playerValue: $playerValue, cellId: $cellId, gameBoardId: $gameBoardId) {
            id
            value
        }
    }
`)(Cell);


