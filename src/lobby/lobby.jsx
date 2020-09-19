import React from 'react'

import getLobbyConnection from './connection'
import LoginForm from './form'
import Header from './header'

export class Lobby extends React.Component {

    state = {
        playerName: null,
    }

    constructor(props) {
        super(props)
        this.connection = getLobbyConnection(props.gameServer, props.gameComponents)
    }

    login = async (username, password) => {
        const success = await this.connection.login(username, password)
        this.setState({playerName: this.connection.playerName})
        return success
    }

    signup = async (username, password) => {
        const success = await this.connection.signup(username, password)
        this.setState({playerName: this.connection.playerName})
        return success
    }

    logout = async () => {
        await this.connection.logout()
        this.setState({playerName: this.connection.playerName})
    }

    render () {
        if (this.state.playerName) {
            return (<Header playerName={this.state.playerName} logout={this.logout}/>)
        } else {
            return <LoginForm login={this.login} signup={this.signup}/>
        }
    }
}