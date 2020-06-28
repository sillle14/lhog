import { Client } from 'boardgame.io/react';
import { WattMatrixTable } from './components/board'
import {WattMatrix} from './Game'
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { SocketIO } from 'boardgame.io/multiplayer'

// NOTE: Local multiplayer seems to mess up moves (they are taken twice)
const WattMatrixClient = Client({
    game: WattMatrix,
    board: WattMatrixTable, 
    debug: false, 
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    enhancer: applyMiddleware(logger),
});

export default WattMatrixClient;
