import { Client } from 'boardgame.io/react'
import { Box, Button, ButtonGroup, Container, makeStyles, Typography } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { SocketIO } from 'boardgame.io/multiplayer'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'

import AuthContext from './authContext'
import CreateMatchForm from './createMatchForm'
import MatchCard from './matchCard'
import useInterval from './useInterval'

const useStyles = makeStyles({
   filter: {
       '& button': {transition: 'unset'}
    }
})

export default function Lobby({gameComponents, connection, setRunningMatch}) {

    const [matches, setMatches] = useState([])
    const [init, setInit] = useState(true)
    const [filter, setFilter] = useState('mine')

    const { user } = useContext(AuthContext)

    const classes = useStyles()

    const navigate = useNavigate()

    const refreshMatches = async () => {
        let allMatches = []
        for (const game of gameComponents) {
            allMatches = allMatches.concat(await connection.listMatches(game.game.name))
        }
        setMatches(allMatches)
    }

    useEffect(() => {
        const setUp = async () => {
            let allMatches = []
            for (const game of gameComponents) {
                allMatches = allMatches.concat(await connection.listMatches(game.game.name))
            }
            setMatches(allMatches)
        }
        // Only need to init once.
        if (init) {
            setUp()
            setInit(false)
        }
    }, [connection, init, gameComponents])

    useInterval(refreshMatches, 2000)

    const createMatch = async (gameName, numPlayers) => {
        await connection.createMatch(gameName, numPlayers)
        refreshMatches()
        setFilter('open')
    }

    const joinMatch = async (gameName, matchID, seatNum) => {
        await connection.joinMatch(gameName, matchID, seatNum, user.username)
        refreshMatches()
    }

    const startMatch = async (gameName, matchID, playerID) => {
        const gameComponent = gameComponents.find((comp) => comp.game.name === gameName)
        const app = Client({
            game: gameComponent.game,
            board: gameComponent.board,
            debug: false,
            multiplayer: SocketIO({server: connection.server})
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
        if (playerID) {
            navigate('/play')
        } else {
            navigate('/spectate')
        }
    }

    const deleteMatch = async (matchID) => {
        await connection.deleteMatch(matchID)
        refreshMatches()
    }

    const matchCards = matches.map(
        (match, idx) => {
            const open = match.players.some(p => !p.name)
            const mine = match.players.some(p => p.name === user.username)
            const matchCard = <MatchCard 
                key={idx} 
                match={match} 
                joinMatch={joinMatch} 
                playerName={user.username} 
                startMatch={startMatch}
                isAdmin={user.isAdmin}
                deleteMatch={deleteMatch}
            />
            switch (filter) {
                case 'open':
                    if (open) return matchCard
                    break
                case 'mine':
                    if (mine) return matchCard
                    break
                default:
                    return matchCard
            }
            return null
        }
    )
    return <>
            <CreateMatchForm games={gameComponents} createMatch={createMatch}/>
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center">             
                    <ButtonGroup color="primary" className={classes.filter}>
                        <Button variant={filter === 'mine' ? 'contained' : ''} onClick={() => setFilter('mine')}>My Matches</Button>
                        <Button variant={filter === 'open' ? 'contained' : ''} onClick={() => setFilter('open')}>Open Matches</Button>
                        <Button variant={filter === 'all' ? 'contained' : ''} onClick={() => setFilter('all')}>All Matches</Button>
                    </ButtonGroup>
                </Box>
                <Box minHeight="42vh">
                    {matchCards}
                </Box>
                <Box display="flex" flexDirection="column">
                    <Typography align="center">WARNING: Games with no moves in the last 30 days will be automatically deleted.</Typography>
                    <Typography align="center" gutterBottom={true}>WARNING: Games in beta may be deleted at any time.</Typography>
                </Box>
            </Container>
        </>

}

Lobby.propTypes = {
    gameComponents: PropTypes.array.isRequired,
    connection: PropTypes.any.isRequired,
    setRunningMatch: PropTypes.func.isRequired
}