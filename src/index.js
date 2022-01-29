import React from 'react'
import ReactDOM from 'react-dom'

import { WattMatrixTable, WattMatrix } from 'wattmatrix'
import { GembalayaTable, Gembalaya } from 'gembalaya'
import { CubeNations, CubeNationsTable } from 'cubenations'
import LobbyRouter from './lobby/lobbyRouter'

import './index.css'

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
    <LobbyRouter
        gameServer={SERVER}
        gameComponents={[{game: WattMatrix, board: WattMatrixTable}, 
                         {game: Gembalaya, board: GembalayaTable}, 
                         {game: CubeNations, board: CubeNationsTable}]}
    />
    </React.StrictMode>,
    document.getElementById('root')
)