class _LobbyConnection {
    
    constructor(server, gameComponents) {
        this.server = server
        this.gameComponents = gameComponents
        this.playerName = null
        this.playerCredentials = null
    }

    async _request(route, init) {
        const response = await fetch(this.server + route, init)
        return response
    }
    
    async _post(route, body) {
        let init = {
          method: 'post',
          body: JSON.stringify(body || {}),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include' // TODO: Only for login I believe (but auth might need something to send cookies)
        }
        return this._request(route, init);
    }

    async refresh() {
        try {
            this.playerName = await this.getLoggedInUser()
        } catch (error) {
            console.log(`Failed to refresh: ${error}`)
            throw new Error('failed to retrieve list of matches (' + error + ')');
        }
    }

    async getLoggedInUser() {
        const resp = await this._request('/auth')
        if (resp.status === 200) {
            return resp.json().username
        } else if (resp.status === 401) {
            return null
        }
        throw new Error(`Unexepcted status from '/auth': ${resp.status}`)
    }

    async login(username, password) {
        const resp = await this._post('/login', {username: username, password: password})
        if (resp.status === 200) {
            this.playerName = username
            return true
        } else if (resp.status === 401) {
            this.playerName = null
            return false
        } else {
            throw new Error(`Unexepcted status from '/login': ${resp.status}`)
        }
    }

    async signup(username, password) {
        const resp = await this._post('/signup', {username: username, password: password})
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
        const resp = await this._post('/logout')
        this.playerName = null
        if (resp.status !== 200) {
            throw new Error(`Unexepcted status from '/logout': ${resp.status}`)
        }
    }
}


export default function getLobbyConnection(server, gameComponents) {
    return new _LobbyConnection(server, gameComponents)
}
