import { Button, Container, MenuItem, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    form: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
      display: 'flex',
      justifyContent: 'space-between',
    },
    select: {
        flexBasis: '30%',
        margin: theme.spacing('auto', 1)
    },
    submit: {
        alignSelf: 'flex-end'
    }
}))

export default function CreateMatchForm({games, createMatch}) {

    const [gameIdx, setGameIdx] = useState('')
    const [numPlayers, setNumPlayers] = useState('')
    const [numPlayerOpts, setNumPlayerOpts] = useState([])

    const classes = useStyles()

    const selectGame = (event) => {
        const gameIdxValue = event.target.value
        setGameIdx(gameIdxValue)
        const game = games[gameIdxValue].game
        setNumPlayerOpts([...new Array(game.maxPlayers + 1).keys()].slice(game.minPlayers))
    }

    const onCreateMatch = async (event) => {
        event.preventDefault()
        createMatch(games[gameIdx].game.name, numPlayers)
    }

    return (
        <Container maxWidth="sm">
            <form className={classes.form}>
                <TextField
                    id="select-game"
                    select
                    label="Game"
                    onChange={selectGame}
                    value={gameIdx}
                    className={classes.select}
                >
                    {games.map((game, idx) => (
                        <MenuItem key={idx} value={idx}>
                            {game.game.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="select-players"
                    select
                    label="Player count"
                    onChange={(e) => {setNumPlayers(e.target.value)}}
                    value={numPlayers}
                    className={classes.select}
                    disabled={gameIdx === ''}
                >
                    {numPlayerOpts.map((i) => (
                        <MenuItem key={i} value={i}>
                        {i}
                    </MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    className={classes.submit}
                    onClick={onCreateMatch}
                    disabled={(numPlayers === '')}
                >
                    Create New Game
                </Button>
            </form>
        </Container>
    )
}

CreateMatchForm.propTypes = {
    games: PropTypes.array.isRequired,
    createMatch: PropTypes.func.isRequired
}