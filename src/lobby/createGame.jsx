import PropTypes from 'prop-types';
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, MenuItem, TextField } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    form: {
      marginTop: theme.spacing(15),
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

export default function CreateGameForm({games, createGame}) {

    const [game, setGame] = useState('')
    const [numPlayers, setNumPlayers] = useState('')
    const [numPlayerOpts, setNumPlayerOpts] = useState([])

    const classes = useStyles()

    const selectGame = (event) => {
        const gameID = event.target.value
        setGame(gameID)
        const game = games[gameID].game
        setNumPlayerOpts([...new Array(game.maxPlayers + 1).keys()].slice(game.minPlayers))
    }

    return (
        <Container maxWidth="sm">
            <form className={classes.form}>
                <TextField
                    id="select-game"
                    select
                    label="Game"
                    onChange={selectGame}
                    value={game}
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
                    disabled={game === ''}
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
                >
                    Create New Game
                </Button>
            </form>
        </Container>
    )
}

CreateGameForm.propTypes = {
    games: PropTypes.array.isRequired,
    createGame: PropTypes.func.isRequired
}