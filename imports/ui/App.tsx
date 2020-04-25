import React, { useCallback, memo } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from 'react-router-dom';

import './App.css';
import Map from './components/Map';
import CreateRoom from './components/CreateRoom';
import Room from './components/Room';
import AuthProvider from './AuthProvider';
import 'css-reset-and-normalize';

const Home = memo(() => {
  const [roomId, setRoomId] = React.useState('');
  const history = useHistory();
  const onInputChange = useCallback((event) => setRoomId(event.target.value), []);
  const onJoinClick = useCallback(() => history.push(`/room/${roomId}`), [history, roomId]);
  return (
    <div>
      <Link to='/create'>Create a game</Link>
      <form>
        <input value={ roomId } onChange={onInputChange} placeholder="Entrez le nom de la room" />
        <button onClick={onJoinClick}>Join</button>
      </form>
    </div>
  );
});

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <Route path='/room/:id'>
              <Room />
            </Route>
            <Route path='/'>
              <header className="App-header">
                <Route exact path='/'>
                  <Home />
                </Route>
                <Route exact path='/create'>
                  <CreateRoom />
                </Route>
              </header>
              <div className="map-container">
                <Map lines={7} cols={6} />
              </div>
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
