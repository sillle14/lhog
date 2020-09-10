import { LobbyClient } from 'boardgame.io/client';

// TODO subclass this to add login route (and later save route)
class CustomLobbyClient extends LobbyClient {

    login = async () => {
        this.request
    }
}