import React, {Component} from 'react';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Client} from 'subscriptions-transport-ws';
import './App.css';
import addGraphQLSubscriptions from './subscriptions';
import TicTacToe from './tic-tac-toe';

let wsEndPoint = 'ws://localhost:8090';
let graphQlEndPoint = 'http://localhost:8181/graphql';

if (process.env.NODE_ENV === 'production') {
  wsEndPoint = 'ws://128.199.147.231:8090';
  graphQlEndPoint = 'http://128.199.147.231:8181/graphql';
}

class App extends Component {
  constructor(...args) {
    super(...args);
    const wsClient = new Client(wsEndPoint);
    const networkInterface = createNetworkInterface({
      uri: graphQlEndPoint,
    });

    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
      networkInterface,
      wsClient
    );

    this.client = new ApolloClient({
      networkInterface: networkInterfaceWithSubscriptions,
    });

    this.browserId = localStorage.getItem('browserId');
    if (!this.browserId) {
      this.browserId = Date.now();
      localStorage.setItem('browserId', this.browserId);
    }
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <TicTacToe browserId={this.browserId}/>
      </ApolloProvider>
    );
  }
}

export default App;
