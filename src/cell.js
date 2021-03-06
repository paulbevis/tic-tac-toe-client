import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

function Cell({mutate, cell, clickable, player, gameBoardId, isGameOver}) {
  let styling = {
    background: cell.partOfWinLine ? 'red' : 'lightGrey',
    display: 'flex',
    margin: '2px',
    width: '50px',
    height: '50px',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    cursor: 'pointer'
  };

  return (
    <div style={styling} onClick={() => {
      if (!cell.value && clickable && !isGameOver) {
        mutate({variables: {playerValue: player.value, cellId: cell.id, gameBoardId: gameBoardId}});
      }
    }}>
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


