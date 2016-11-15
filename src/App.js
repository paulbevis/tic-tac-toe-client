import React, {Component} from 'react';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Client} from 'subscriptions-transport-ws';
import './App.css';
import addGraphQLSubscriptions from './subscriptions';
import TicTacToe from './tic-tac-toe';
// import Counter from './counter'
class App extends Component {
  constructor(...args) {
    super(...args);
    const wsClient = new Client('ws://localhost:8090');
    const networkInterface = createNetworkInterface({
      uri: 'http://localhost:8181/graphql',
    });

    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
      networkInterface,
      wsClient
    );

    this.client = new ApolloClient({
      networkInterface: networkInterfaceWithSubscriptions,
    });
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <TicTacToe />
        {/*<Counter />*/}
      </ApolloProvider>
    );
  }
}

export default App;
