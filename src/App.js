import React, { Component } from 'react';
import Header from './components/Header';
import Posts from './components/Post';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";
import Pusher from 'pusher-js';

const client = new ApolloClient({
  uri: "http://localhost:4000"
})

class App extends Component{
  constructor(){
    super();
    this.pusher = new Pusher("63ff6cee753f69383227", {
      cluster: 'us2',
      encrypted: true
    });
  }

  render(){
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Header />
          <section className="App-main">
            {/* pass the pusher object and apollo to the posts component */}
            <Posts pusher={this.pusher} apollo_client={client}/>
          </section>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
