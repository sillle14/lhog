import { Button, Container, MenuItem, TextField } from '@mui/material'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import { useState } from 'react';

const StyledForm = styled('form')(({ theme }) => ({
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    justifyContent: 'space-between',
}));

const StyledSelect = styled(TextField)(({ theme }) => ({
    flexBasis: '30%',
    margin: theme.spacing('auto', 1)
}));

export default function CreateMatchForm({games, createMatch}) {

    const [gameIdx, setGameIdx] = useState('')
    const [numPlayers, setNumPlayers] = useState('')
    const [numPlayerOpts, setNumPlayerOpts] = useState([])

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
            <StyledForm>
                <StyledSelect
                    variant="standard"
                    id="select-game"
                    select
                    label="Game"
                    onChange={selectGame}
                    value={gameIdx}>
                    {games.map((game, idx) => (
                        <MenuItem key={idx} value={idx}>
                            {game.game.name}
                        </MenuItem>
                    ))}
                </StyledSelect>
                <StyledSelect
                    variant="standard"
                    id="select-players"
                    select
                    label="Player count"
                    onChange={(e) => {setNumPlayers(e.target.value)}}
                    value={numPlayers}
                    disabled={gameIdx === ''}>
                    {numPlayerOpts.map((i) => (
                        <MenuItem key={i} value={i}>
                        {i}
                    </MenuItem>
                    ))}
                </StyledSelect>
                <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    sx={{alignSelf: 'flex-end'}}
                    onClick={onCreateMatch}
                    disabled={(numPlayers === '')}
                >
                    Create New Match
                </Button>
            </StyledForm>
        </Container>
    );
}

CreateMatchForm.propTypes = {
    games: PropTypes.array.isRequired,
    createMatch: PropTypes.func.isRequired
}