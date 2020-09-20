import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react'

import CreateGameForm from './createGame'
import getLobbyConnection from './connection'
import Header from './header'
import LoginForm from './form'

export default function Lobby({gameServer, gameComponents}) {

    const [playerName, setPlayerName] = useState(null)
    const [loading, setLoading] = useState(false)
    const [init, setInit] = useState(true)

    const connection = getLobbyConnection(gameServer, gameComponents)

    useEffect(() => {
        const auth = async () => {
            await connection.auth()
            setPlayerName(connection.username)
            setLoading(false)
        }
        // Only need to check auth once.
        if (init){
            setLoading(true)
            auth()
            setInit(false)
        }
    }, [connection, init])

    const login = async (username, password) => {
        const success = await connection.login(username, password)
        setPlayerName(connection.playerName)
        return success
    }

    const signup = async (username, password) => {
        const success = await connection.signup(username, password)
        setPlayerName(connection.playerName)
        return success
    }

    const logout = async () => {
        await connection.logout()
        setPlayerName(connection.playerName)
    }

    let content
    if (loading) {
        content = null
    } else if (playerName) {
        content = <CreateGameForm games={gameComponents} createGame={() => {}}/>
    } else {
        content = <LoginForm login={login} signup={signup}/>
    }

    return (
        <>
            <Header playerName={playerName} logout={logout} loading={loading}></Header>
            {content}
        </>
    )
}

Lobby.propTypes = {
    gameServer: PropTypes.string.isRequired,
    gameComponents: PropTypes.array.isRequired
}