import { Container, Link, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link as RouterLink } from 'react-router-dom'
import React from 'react'

import Copyright from './copyright'

const useStyles = makeStyles((theme) => ({
    header: {
        margin: theme.spacing(2, 'auto')
    },
    copyright: {
        margin: theme.spacing(3, 'auto'),
        fontSize: 'smaller',
        opacity: 0.5
    }
}))

export default function About() {

    const classes = useStyles()

    return (
        <Container maxWidth="md">
            <Typography variant="h2" className={classes.header}>Welcome to Lewis' House of Games</Typography>
            <Typography>
                LHoG is a framework for playing games developed with <Link href="https://boardgame.io/" rel="noopener" target="_blank">boardgame.io</Link>.
                It provides the account infrastructure and database backend for saving games and asynchronous play, as well as a basic lobby
                UI and leaderboard. Head to the <Link component={RouterLink} to="/">lobby</Link> to create or join matches, or check it out the project 
                on <Link href="https://github.com/sillle14/lhog" rel="noopener" target="_blank">Github</Link>.
            </Typography>
            <Typography>
                You can play any of the following games here, and asynchronous play is supported. Games will be saved if there has been a move made in the last 30 days. Note that
                these were all developed with the idea that the players already know the rules, so check those out ahead of time. Report any issues via Github either in the LHoG repo
                directly or in the individual game repos.
            </Typography>
            <Typography variant="h3" className={classes.header}>The Games</Typography>
            <Typography variant="h4" className={classes.header}>Gembalaya</Typography>            
            <Typography>
                Gembalaya implements the popular card game <Link href="https://boardgamegeek.com/boardgame/148228/splendor" rel="noopener" target="_blank">Splendor</Link>. This is a game for 2-4
                players and takes about 30 minutes. Check out the <Link href="https://cdn.1j1ju.com/medias/7f/91/ba-splendor-rulebook.pdf" rel="noopener noreferrer" target="_blank">rules</Link> or see the code
                on <Link href="https://github.com/sillle14/gembalaya" rel="noopener" target="_blank">Github</Link>. Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" className={classes.header}>WattMatrix</Typography>            
            <Typography>
                WattMatrix implements the auction game <Link href="https://boardgamegeek.com/boardgame/2651/power-grid" rel="noopener" target="_blank">Power Grid</Link>. This is a game for 3-6
                players and takes about 2 hours. Check out the <Link href="https://www.ultraboardgames.com/power-grid/game-rules.php" rel="noopener noreferrer" target="_blank">rules</Link> (and note that this
                implements the 2004 edition, not the newer edition) or see the code on <Link href="https://github.com/sillle14/wattmatrix" rel="noopener" target="_blank">Github</Link>. Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" className={classes.header}>CubeNations</Typography>            
            <Typography>
                CubeNations implements the classic tile-laying game <Link href="https://boardgamegeek.com/boardgame/42/tigris-euphrates" rel="noopener  noreferrer" target="_blank">Tigris & Euphrates</Link>. 
                This is a game for 2-4 players and takes about 1.5 hours. Check out
                the <Link href="https://images.zmangames.com/filer_public/92/3f/923f8aba-72f1-4aa5-9622-d648ad1a9aa7/kn25_rulebook_web.pdf" rel="noopener" target="_blank">rules</Link> or 
                see the code on <Link href="https://github.com/sillle14/cubenations" rel="noopener" target="_blank">Github</Link>.  Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" className={classes.header}>ThornyUber</Typography>            
            <Typography>
                ThornyUber implements the classic Euro game <Link href="https://boardgamegeek.com/boardgame/21790/thurn-and-taxis" rel="noopener  noreferrer" target="_blank">Thurn & Taxis</Link>. 
                This is a game for 2-4 players and takes about an hour. Check out
                the <Link href="https://www.yucata.de/en/Rules/ThurnTaxis" rel="noopener" target="_blank">rules</Link> or 
                see the code on <Link href="https://github.com/mdovwagner/thornyUber" rel="noopener" target="_blank">Github</Link>.  Developed by Michael Wagner.
            </Typography>
            <Copyright/>
        </Container>
    )
}