import { Button, Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import React from 'react'

const BetaSup = styled('sup')({ fontSize: 12 })

export default function MatchCard({match, joinMatch, startMatch, playerName, isAdmin, deleteMatch}) {

    const seats = match.players.map((player, idx) => {
        let bgcolor = ''
        let sx = {}
        if (player.name === playerName) {
            // Your seat
            bgcolor = 'primary.light'
        } else if (player.name) {
            // Full seat
            bgcolor = '#e0e0e0'
            sx = {opacity: 0.5}
        }
        return (
            <Box key={idx} flexBasis="25%" bgcolor={bgcolor} border={2} borderColor="primary.main" borderRadius={1} display="flex" justifyContent="center" my={0.25} mx={1}>
                <Typography align="center" color="primary" sx={sx}>{player.name || 'empty'}</Typography>
            </Box>
        );
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

    const beta = ['ThornyUber']

    return (
        <Card sx={{my: 2}} variant="outlined"><CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Box flexBasis="30%"><Box width="max-content">
                <Typography variant="h4">{match.gameName}{beta.includes(match.gameName) ? <BetaSup>BETA</BetaSup> : null}</Typography>
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