import { LobbyClient } from 'boardgame.io/client';

// TODO subclass this to add login route (and later save route)
class CustomLobbyClient extends LobbyClient {

    async request(route, init) {
        const response = await fetch(this.server + route, init)
        return response
      }

    async login(username, password) {
        return this.post('/login', {body: {username: username, password: password}})
    }

    async logout() {
        return this.post('/logout')
    }

    async register(username, password) {
        return this.post('/register', {body: {username: username, password: password}})
    }

    async authorize() {
        return this.request('/auth')
    }
}