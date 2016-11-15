import React, {Component} from 'react';
import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';

import {find, propEq} from 'ramda'
import Cell from './cell'

class Grid extends Component {

  getPlayerValue(id) {
    if (id) {
      return find(propEq('id', id))(this.props.specificGameBoard.players).value
    }
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div style={{display: 'flex', flex: '1 1 50px'}}>
            <Cell cell={this.props.specificGameBoard.cells[0]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[1]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[2]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
          <div style={{display: 'flex'}}>
            <Cell cell={this.props.specificGameBoard.cells[3]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[4]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[5]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
          <div style={{display: 'flex'}}>
            <Cell cell={this.props.specificGameBoard.cells[6]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[7]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
            <Cell cell={this.props.specificGameBoard.cells[8]} playerValue={this.getPlayerValue(this.props.yourPlayerId)} gameBoardId={this.props.specificGameBoard.id}/>
          </div>
        </div>

      );
    }
  }


  subscribe(updateCommentsQuery) {
    const SUBSCRIPTION_QUERY = gql`
        subscription OnlyNeededWithPassingVars {
            gameUpdated {
                cells{
                    id
                    value
                }
                players {
                    id
                    status
                    value
                }
            }
        }`;

    this.subscriptionObserver = this.props.client.subscribe({
      query: SUBSCRIPTION_QUERY,
      variables: {"gameBoardId": 0}
    }).subscribe({
      next(data) {
        updateCommentsQuery((previousResult, {gameBoardId}) => {
          console.log('board sub data: ', data)
          console.log('board sub previous: ', previousResult)
          // console.log('previous result', previousResult, gameBoardId)
          previousResult.specificGameBoard.cells=data.gameUpdated.cells;
          return previousResult;//updating(updatedPost, previousResult);
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
            id
            cells{
                id
                value
            }
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
})(Grid));
