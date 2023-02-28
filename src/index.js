import React from 'react'
import { createRoot } from 'react-dom/client';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';

import { WattMatrixTable, WattMatrix } from 'wattmatrix'
import { GembalayaTable, Gembalaya } from 'gembalaya'
import { MerchantsOfDeutscheTable, MerchantsOfDeutsche } from 'merchantsofdeutsche';
// import { CubeNations, CubeNationsTable } from 'cubenations'
import LobbyRouter from './lobby/lobbyRouter'

import './index.css'

const theme = createTheme();
const container = document.getElementById('root');
const root = createRoot(container);

const ENV = process.env.REACT_APP_ENV

let SERVER
if (ENV === 'dev')    {
    SERVER = `http://${window.location.hostname}:8000`  // Local
} else {
    SERVER = `https://${window.location.hostname}` // Prod
}

// Render the lobby. This relies on a running server.
root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>        
                <LobbyRouter
                    gameServer={SERVER}
                    gameComponents={[
                        {game: Gembalaya, board: GembalayaTable},
                        {game: MerchantsOfDeutsche, board: MerchantsOfDeutscheTable},
                        {game: WattMatrix, board: WattMatrixTable}
                    ]}
                />
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
)