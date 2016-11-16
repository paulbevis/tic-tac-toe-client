import React from 'react';

function PlayerName({onChange}) {
  return (
    <div style={{fontSize: '16px', margin: '10px'}}>
      <label>Enter your player name: </label>
      <input onChange={(ev)=>onChange(ev)}/>
    </div>
  )
}

export default PlayerName;
