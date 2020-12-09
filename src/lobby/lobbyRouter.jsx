import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'


import { Router } from '@reach/router'

import getConnection from './connection'
import Board from './board'
import Header from './header'
import Form from './form'
import Lobby from './lobby'
import ProtectedRoute from './protectedRoute'
import AuthContext from './authContext'

export default function LobbyRouter({gameServer, gameComponents}) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [init, setInit] = useState(true)
    const [runningMatch, setRunningMatch] = useState(null)

    const connection = getConnection(gameServer)

    useEffect(() => {
        const setUp = async () => {
            const auth = await connection.auth()
            if (auth) {
                setUser({username: auth.username, isAdmin: auth.isAdmin})
            }
            setLoading(false)
        }
        // Only need to init once.
        if (init) {
            setLoading(true)
            setUp()
            setInit(false)
        }
    }, [connection, init, gameComponents])

    const login = async (username, password) => {
        const resp = await connection.login(username, password)
        if (resp.loggedIn) {
            setUser({username: username, isAdmin: resp.isAdmin})
        } else {
            setUser(null)
        }
        return resp.loggedIn
    }

    const signup = async (username, password) => {
        const success = await connection.signup(username, password)
        if (success) {
            // New users are never Admin.
            setUser({username: username, isAdmin: false})
        } else {
            setUser(null)
        }
        return success
    }

    const logout = async () => {
        await connection.logout()
        setUser(null)
    }

    const showStats = async () => {
        const playerStats = await connection.getStats()
        return playerStats
    }

    return (
        <AuthContext.Provider value={{user, loading, login}}>
            <Header 
                logout={logout} 
                runningMatch={runningMatch && runningMatch.gameName}
                showStats={() => {showStats()}}
                leave={() => {setRunningMatch(null)}}
                loading={loading}
                path='/*'
            />
            <Router>
                <Form path='/signup' signup={signup}/>
                <ProtectedRoute
                    as={Lobby}
                    path='/' 
                    gameComponents={gameComponents} 
                    connection={connection} 
                    setRunningMatch={setRunningMatch}
                />
                <ProtectedRoute
                    as={Board}
                    path='/play'
                    runningMatch={runningMatch}
                />
            </Router>
        </AuthContext.Provider>
    )
}

LobbyRouter.propTypes = {
    gameServer: PropTypes.string.isRequired,
    gameComponents: PropTypes.array.isRequired
}
