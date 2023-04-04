import { Container, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Copyright from './copyright'

export default function About() {
    return (
        <Container maxWidth="md">
            <Typography variant="h2" sx={{my: 2}}>Welcome to Lewis&lsquo; House of Games</Typography>
            <Typography>
                LHoG is a framework for playing games developed with <Link
                href="https://boardgame.io/"
                rel="noopener"
                target="_blank"
                underline="hover">boardgame.io</Link>.
                It provides the account infrastructure and database backend for saving games and asynchronous play, as well as a basic lobby
                UI and leaderboard. Head to the <Link component={RouterLink} to="/" underline="hover">lobby</Link> to create or join matches, or check it out the project 
                on <Link
                href="https://github.com/sillle14/lhog"
                rel="noopener"
                target="_blank"
                underline="hover">Github</Link>.
            </Typography>
            <Typography>
                You can play any of the following games here, and asynchronous play is supported. Games will be saved if there has been a move made in the last 30 days. Note that
                these were all developed with the idea that the players already know the rules, so check those out ahead of time. Report any issues via Github either in the LHoG repo
                directly or in the individual game repos.
            </Typography>
            <Typography variant="h3" sx={{my: 2}}>The Games</Typography>
            <Typography variant="h4" sx={{my: 2}}>Gembalaya</Typography>            
            <Typography>
                Gembalaya implements the popular card game <Link
                href="https://boardgamegeek.com/boardgame/148228/splendor"
                rel="noopener"
                target="_blank"
                underline="hover">Splendor</Link>. This is a game for 2-4
                players and takes about 30 minutes. Check out the <Link
                href="https://cdn.1j1ju.com/medias/7f/91/ba-splendor-rulebook.pdf"
                rel="noopener noreferrer"
                target="_blank"
                underline="hover">rules</Link> or see the code
                on <Link
                href="https://github.com/sillle14/gembalaya"
                rel="noopener"
                target="_blank"
                underline="hover">Github</Link>. Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" sx={{my: 2}}>WattMatrix</Typography>            
            <Typography>
                WattMatrix implements the auction game <Link
                href="https://boardgamegeek.com/boardgame/2651/power-grid"
                rel="noopener"
                target="_blank"
                underline="hover">Power Grid</Link>. This is a game for 3-6
                players and takes about 2 hours. Check out the <Link
                href="https://www.ultraboardgames.com/power-grid/game-rules.php"
                rel="noopener noreferrer"
                target="_blank"
                underline="hover">rules</Link> (and note that this
                implements the 2004 edition, not the newer edition) or see the code on <Link
                href="https://github.com/sillle14/wattmatrix"
                rel="noopener"
                target="_blank"
                underline="hover">Github</Link>. Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" sx={{my: 2}}>CubeNations</Typography>            
            <Typography>
                CubeNations implements the classic tile-laying game <Link
                href="https://boardgamegeek.com/boardgame/42/tigris-euphrates"
                rel="noopener  noreferrer"
                target="_blank"
                underline="hover">Tigris & Euphrates</Link>. 
                This is a game for 2-4 players and takes about 1.5 hours. Check out
                the <Link
                href="https://images.zmangames.com/filer_public/92/3f/923f8aba-72f1-4aa5-9622-d648ad1a9aa7/kn25_rulebook_web.pdf"
                rel="noopener"
                target="_blank"
                underline="hover">rules</Link> or 
                see the code on <Link
                href="https://github.com/sillle14/cubenations"
                rel="noopener"
                target="_blank"
                underline="hover">Github</Link>.  Developed by Lewis Silletto.
            </Typography>
            <Typography variant="h4" sx={{my: 2}}>Merchants of Deutsche</Typography>            
            <Typography>
                Merchants of Deutsche (in beta) implements the classic Euro game <Link
                href="https://boardgamegeek.com/boardgame/43015/hansa-teutonica"
                rel="noopener  noreferrer"
                target="_blank"
                underline="hover">Hansa Teutonica</Link>. 
                This is a game for 2-5 players and takes about 1.5 hours. Check out
                the <Link
                href="https://www.fgbradleys.com/rules/rules4/Hansa%20Teutonica%20-%20rules.pdf"
                rel="noopener"
                target="_blank"
                underline="hover">rules</Link> or 
                see the code on <Link
                href="https://github.com/mdovwagner/merchantsofdeutsche"
                rel="noopener"
                target="_blank"
                underline="hover">Github</Link>.  Developed by Michael Wagner.
            </Typography>
            <Copyright/>
        </Container>
    );
}