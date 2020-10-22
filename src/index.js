import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Lobby from './lobby/lobby';
import { WattMatrixTable, WattMatrix } from 'wattmatrix'
import { GembalayaTable, Gembalaya } from 'gembalaya'

// TODO:
//  * README
//  * Add Gembalaya

const ENV = process.env.REACT_APP_ENV

let SERVER
if (ENV === 'dev')    {
    SERVER = `http://${window.location.hostname}:8000`  // Local
} else {
    SERVER = `https://${window.location.hostname}` // Prod
}

// Render the lobby. This relies on a running server.
ReactDOM.render(
    <React.StrictMode>
    <Lobby
        gameServer={SERVER}
        gameComponents={[{game: WattMatrix, board: WattMatrixTable}, {game: Gembalaya, board: GembalayaTable}]}
    />
    </React.StrictMode>,
    document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();