import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WattMatrixClient from './App';
import * as serviceWorker from './serviceWorker';
import { WattMatrixTable } from './components/board'
import { WattMatrix } from './Game'
import { Lobby } from 'boardgame.io/react';
import './components/styles/lobby.css'

const NO_LOBBY = process.env.REACT_APP_NO_LOBBY

if (NO_LOBBY) {
  // Code for local deployment no lobby both players on one screen, no seperate server.
  ReactDOM.render(
    <React.StrictMode>
      <WattMatrixClient playerID='0'/>
      <WattMatrixClient playerID='1'/>
      <WattMatrixClient playerID='2'/>
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  const ENV = process.env.REACT_APP_ENV

  let SERVER
  // TODO: Should be ENV === 'dev'
  if (true) {
    SERVER = `http://${window.location.hostname}:8000`  // Local
  } else {
    SERVER = `https://${window.location.hostname}` // Prod
  }

  // Render the lobby. This relies on a running server.
  // TODO: Make the lobby way nicer looking!
  ReactDOM.render(
    <React.StrictMode>
      <Lobby
        gameServer={SERVER}
        lobbyServer={SERVER}
        gameComponents={[{game: WattMatrix, board: WattMatrixTable}]}
      />
    </React.StrictMode>,
    document.getElementById('root')
  )
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
