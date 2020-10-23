import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react'
import { Container } from '@material-ui/core'

import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'

import useInterval from './useInterval'
import CreateMatchForm from './createMatchForm'
import getLobbyConnection from './connection'
import Header from './header'
import LoginForm from './form'
import MatchCard from './matchCard'

export default function Lobby({gameServer, gameComponents}) {

    const [playerName, setPlayerName] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [init, setInit] = useState(true)
    const [matches, setMatches] = useState([])
    const [runningMatch, setRunningMatch] = useState(null)

    const connection = getLobbyConnection(gameServer)

    const refreshMatches = async () => {
        if (playerName) {
            const auth = await connection.auth()
            if (auth && auth.username !== playerName) {
                setPlayerName(null)
                return
            }
            let allMatches = []
            for (const game of gameComponents) {
                allMatches = allMatches.concat(await connection.listMatches(game.game.name))
            }
            setMatches(allMatches)
        }
    }

    useEffect(() => {
        const setUp = async () => {
            const auth = await connection.auth()
            setPlayerName(auth ? auth.username : null)
            setIsAdmin(auth ? auth.isAdmin: false)
            let allMatches = []
            for (const game of gameComponents) {
                allMatches = allMatches.concat(await connection.listMatches(game.game.name))
            }
            setMatches(allMatches)
            setLoading(false)
        }
        // Only need to init once.
        if (init) {
            setLoading(true)
            setUp()
            setInit(false)
        }
    }, [connection, init, gameComponents])

    useInterval(refreshMatches, 2000)

    const login = async (username, password) => {
        const resp = await connection.login(username, password)
        if (resp.loggedIn) {
            setPlayerName(username)
            setIsAdmin(resp.isAdmin)
        } else {
            setPlayerName(null)
            setIsAdmin(false)
        }
        return resp.loggedIn
    }

    const signup = async (username, password) => {
        const success = await connection.signup(username, password)
        if (success) {
            setPlayerName(username)
        } else {
            setPlayerName(null)
        }
        return success
    }

    const logout = async () => {
        await connection.logout()
        setPlayerName(null)
    }

    const createMatch = async (gameName, numPlayers) => {
        await connection.createMatch(gameName, numPlayers)
        refreshMatches()
    }

    const joinMatch = async (gameName, matchID, seatNum) => {
        await connection.joinMatch(gameName, matchID, seatNum, playerName)
        refreshMatches()
    }

    const startMatch = async (gameName, matchID, playerID) => {
        const gameComponent = gameComponents.find((comp) => comp.game.name === gameName)
        const app = Client({
            game: gameComponent.game,
            board: gameComponent.board,
            debug: false,
            multiplayer: SocketIO({server: gameServer})
        })
        const auth = await connection.auth()
        const match = {
            app: app,
            matchID: matchID,
            playerID: playerID,
            credentials: auth.id,
            gameName: gameName
        }
        setRunningMatch(match)
    }

    const deleteMatch = async (matchID) => {
        await connection.deleteMatch(matchID)
        refreshMatches()
    }

    let content
    if (loading) {
        content = null
    } else if (playerName) {
        if (runningMatch) {
            content = <runningMatch.app 
                matchID={runningMatch.matchID}
                playerID={runningMatch.playerID}
                credentials={runningMatch.credentials}
            />
        } else {
            const matchCards = matches.map(
                (match, idx) => 
                    <MatchCard 
                        key={idx} 
                        match={match} 
                        joinMatch={joinMatch} 
                        playerName={playerName} 
                        startMatch={startMatch}
                        isAdmin={isAdmin}
                        deleteMatch={deleteMatch}
                    />
            )
            content = <>
                    <CreateMatchForm games={gameComponents} createMatch={createMatch}/>
                    <Container maxWidth="md">{matchCards}</Container>
                </>
        }
    } else {
        content = <LoginForm login={login} signup={signup}/>
    }

    return (
        <>
            <Header 
                playerName={playerName} 
                logout={logout} 
                loading={loading} 
                runningMatch={runningMatch && runningMatch.gameName}
                leave={() => {setRunningMatch(null)}}
            />
            {content}
        </>
    )
}

Lobby.propTypes = {
    gameServer: PropTypes.string.isRequired,
    gameComponents: PropTypes.array.isRequired
}