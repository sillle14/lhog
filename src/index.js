import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

// import { WattMatrixTable, WattMatrix } from 'wattmatrix'
// import { GembalayaTable, Gembalaya } from 'gembalaya'
// import { CubeNations, CubeNationsTable } from 'cubenations'
import LobbyRouter from './lobby/lobbyRouter'

import './index.css'

const theme = createTheme();

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
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>        
                <LobbyRouter
                    gameServer={SERVER}
                    gameComponents={[]}
                />
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>,
    document.getElementById('root')
)