import React, { Component } from 'react';
import Header from './components/Header';
import Post from './components/Post';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <Post nickname="Chris" avatar="https://via.placeholder.com/30" caption="Moving the community!" image="https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg" />
          <Post nickname="OG" avatar="https://via.placeholder.com/30" caption="Holding a mic" image="https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg" />
        </div>
      </div>
    );
  }
}
export default App;
