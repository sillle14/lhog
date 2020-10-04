import PropTypes from 'prop-types';
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Card, CardActions, CardContent, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2, 'auto')
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between'
    },
}))

export default function MatchCard({match, joinMatch, startMatch, playerName}) {


    const classes = useStyles()

    const seats = match.players.map((player, idx) => 
        <Box key={idx} flexBasis="25%" border={2} borderColor="primary.main" borderRadius="borderRadius" display="flex" justifyContent="center" my={0.5} mx={1}>
            <Typography align="center" color="primary">{player.name || 'empty'}</Typography>
        </Box>
    )

    const getNextFreeSeat = () => {
        const freeSeat = match.players.find(player => !player.name)
        if (freeSeat) {
            return freeSeat.id
        } else {
            return false
        }
    }

    const getButton = () => {
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
        } else {
            text = 'Join'
            if (getNextFreeSeat() !== false) {
                disabled = false
            } else {
                disabled = true
            }
            onClick = () => {
                joinMatch(match.gameName, match.matchID, '' + getNextFreeSeat())
            }
        }

        return (
            <Button color="secondary" variant="contained" onClick={onClick} disabled={disabled}>{text}</Button>
        )
    }

    return (
        <Card className={classes.root} variant="outlined"><CardContent className={classes.content}>
            <Box>
                <Typography variant="h4">{match.gameName}</Typography>
                <Typography align="right">{`id: ${match.matchID}`}</Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" alignSelf="center" flexBasis="40%">
                {seats}
            </Box>
            <CardActions>{getButton()}</CardActions>
        </CardContent></Card>
    )
}

MatchCard.propTypes = {
    match: PropTypes.object.isRequired,
    joinMatch: PropTypes.func.isRequired,
    startMatch: PropTypes.func.isRequired,
    playerName: PropTypes.string.isRequired
}