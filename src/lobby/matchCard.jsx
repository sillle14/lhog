import { Button, Box, Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 'auto')
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    beta: {
        fontSize: '12px'
    },
    fullSeat: {
        opacity: 0.5
    },
    mySeat: {
        color: '#002984',
        fontWeight: 'bold'
    }
}))

export default function MatchCard({match, joinMatch, startMatch, playerName, isAdmin, deleteMatch}) {

    const classes = useStyles()

    const seats = match.players.map((player, idx) => {
        let bgcolor = ''
        let className = ''
        if (player.name === playerName) {
            // Your seat
            bgcolor = 'primary.light'
            className = classes.mySeat
        } else if (!!player.name) {
            // Full seat
            bgcolor = '#e0e0e0'
            className = classes.fullSeat
        }
        return <Box key={idx} flexBasis="25%" bgcolor={bgcolor} border={2} borderColor="primary.main" borderRadius="borderRadius" display="flex" justifyContent="center" my={0.25} mx={1}>
            <Typography align="center" color="primary" className={className}>{player.name || 'empty'}</Typography>
        </Box>
    })

    const getNextFreeSeat = () => {
        const freeSeat = match.players.find(player => !player.name)
        if (freeSeat) {
            return freeSeat.id
        } else {
            return false
        }
    }

    const getButtons = () => {
        let onClick
        let disabled
        let text
        // If the user is at the table:
        const mySeat = match.players.find(player => player.name === playerName)
        if (mySeat) {
            text = 'Play'
            if (getNextFreeSeat() !== false) {
                // Not enough players
                disabled = true
            } else {
                disabled = false
            }
            onClick = () => {
                startMatch(match.gameName, match.matchID, '' + mySeat.id)
            }
        } else if (getNextFreeSeat() === false) {
            text = 'Spectate'
            disabled = false
            onClick = () => {
                startMatch(match.gameName, match.matchID, null)
            }
        } else {
            text = 'Join'
            disabled = false
            onClick = () => {
                joinMatch(match.gameName, match.matchID, '' + getNextFreeSeat())
            }
        }

        const buttons = [
            <Button key="main" color={isAdmin ? 'primary' : 'secondary'} variant="contained" onClick={onClick} disabled={disabled}>{text}</Button>
        ]
        if (isAdmin) {
            buttons.unshift(
                <Button variant="contained" color="secondary" key="delete" onClick={() => deleteMatch(match.matchID)}>Delete</Button>
            )
        }

        return buttons
    }

    return (
        <Card className={classes.root} variant="outlined"><CardContent className={classes.content}>
            <Box flexBasis="30%"><Box width="max-content">
                <Typography variant="h4">{match.gameName}{match.gameName === 'CubeNations' ? <sup className={classes.beta}>BETA</sup> : null}</Typography>
                <Typography align="right">{`id: ${match.matchID}`}</Typography>      
            </Box></Box>
            <Box display="flex" flexWrap="wrap" alignSelf="center" flexBasis="40%">
                {seats}
            </Box>
            <Box flexBasis="30%" display="flex" flexDirection="row-reverse"><CardActions>{getButtons()}</CardActions></Box>
        </CardContent></Card>
    )
}

MatchCard.propTypes = {
    match: PropTypes.object.isRequired,
    joinMatch: PropTypes.func.isRequired,
    startMatch: PropTypes.func.isRequired,
    playerName: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    deleteMatch: PropTypes.func.isRequired
}