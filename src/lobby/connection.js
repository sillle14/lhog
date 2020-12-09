class _Connection {
    
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
            throw new Error(`Unexpected status from '/auth': ${resp.status}`)
        }
    }

    async login(username, password) {
        const resp = await this._post(
            '/login', 
            {username: username, password: password},
            {credentials: 'include'}
        )
        if (resp.status === 200) {
            let json = await resp.json()
            json.loggedIn = true
            return json
        } else if (resp.status === 401) {
            return {loggedIn: false}
        } else {
            throw new Error(`Unexpected status from '/login': ${resp.status}`)
        }
    }

    async signup(username, password) {
        const resp = await this._post(
            '/signup', 
            {username: username, password: password},
            {credentials: 'include'}
        )
        if (resp.status === 201) {
            return true
        } else if (resp.status === 400) {
            // Existing user
            return false
        } else {
            throw new Error(`Unexpected status from '/login': ${resp.status}`)
        }
    }

    async logout() {
        const resp = await this._post('/logout', {}, {credentials: 'include'})
        if (resp.status !== 200) {
            throw new Error(`Unexpected status from '/logout': ${resp.status}`)
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

    async deleteMatch(matchID) {
        const resp = await this._post('/delete', {matchID: matchID}, {credentials: 'include'})
        if (resp.status !== 202) {
            throw new Error(`Unexpected status from '/delete': ${resp.status}`)
        }
    }

    /***********************
     *   PLAYER ENDPOINTS  *
     ***********************/

    async getStats() {
        const resp = await this._request('/stats', {credentials: 'include'})
        const json = await resp.json()
        console.log(json)
        return json
    }
}


export default function getConnection(server) {
    return new _Connection(server)
}
