class _LobbyConnection {
    
    constructor(server) {
        this.server = server
    }

    async _request(route, init) {
        const response = await fetch(this.server + route, init)
        return response
    }
    
    async _post(route, body, customInit) {
        let init = {
            method: 'post',
            body: JSON.stringify(body || {}),
            headers: { 'Content-Type': 'application/json' },
        }
        return this._request(route, {...init, ...customInit});
    }

    /***********************
     *   LOGIN ENDPOINTS   *
     ***********************/

    async auth() {
        const resp = await this._request('/auth', {credentials: 'include'})
        if (resp.status === 200) {
            const json = await resp.json()
            return json
        } else if (resp.status === 401) {
            return null
        } else {
            throw new Error(`Unexepcted status from '/auth': ${resp.status}`)
        }
    }

    async login(username, password) {
        const resp = await this._post(
            '/login', 
            {username: username, password: password},
            {credentials: 'include'}
        )
        if (resp.status === 200) {
            return true
        } else if (resp.status === 401) {
            return false
        } else {
            throw new Error(`Unexepcted status from '/login': ${resp.status}`)
        }
    }

    async signup(username, password) {
        const resp = await this._post(
            '/signup', 
            {username: username, password: password},
            {credentials: 'include'}
        )
        if (resp.status === 201) {
            this.playerName = username
            return true
        } else if (resp.status === 400) {
            // Existing user
            this.playerName = null
            return false
        } else {
            throw new Error(`Unexepcted status from '/login': ${resp.status}`)
        }
    }

    async logout() {
        const resp = await this._post('/logout', {}, {credentials: 'include'})
        this.playerName = null
        if (resp.status !== 200) {
            throw new Error(`Unexepcted status from '/logout': ${resp.status}`)
        }
    }

    /**********************
     *   MATCH ENDPOINTS  *
     **********************/

    async createMatch(gameName, numPlayers) {
        await this._post(`/games/${gameName}/create`, {numPlayers: numPlayers})
    }

    async listMatches(gameName) {
        const resp = await this._request(`/games/${gameName}`)
        const json = await resp.json()
        return json.matches
    }

    async joinMatch(gameName, matchID, seatNum, playerName) {
        await this._post(
            `/games/${gameName}/${matchID}/join`, 
            {playerID: seatNum, playerName: playerName},
            {credentials: 'include'}
        )
    }
}


export default function getLobbyConnection(server) {
    return new _LobbyConnection(server)
}
