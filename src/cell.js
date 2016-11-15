import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

// A mutation is made available on a callback called `mutate`
// Other props of the wrapping component are passed through.
function Cell({mutate, cell, playerValue, gameBoardId}) {
  let styling = {
    background: 'lightGrey',
    display: 'flex',
    margin: '2px',
    width: '50px',
    height: '50px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px'
  };
  return (
    <div style={styling} onClick={() => mutate({variables: {playerValue, cellId: cell.id, gameBoardId: gameBoardId}})}>
      <span style={{display: 'flex'}}>{cell.value}</span>
    </div>
  )
}

export default graphql(gql`
    mutation selectCell($playerValue: String!, $cellId: Int!, $gameBoardId: Int!) {
        selectCell(playerValue: $playerValue, cellId: $cellId, gameBoardId: $gameBoardId) {
            id
            value
        }
    }
`)(Cell);


