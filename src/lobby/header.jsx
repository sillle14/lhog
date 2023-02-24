import { 
    AppBar, 
    Box, 
    IconButton, 
    Menu, 
    MenuItem, 
    Toolbar, 
    Tooltip, 
    Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'

import AuthContext from './authContext'

const SVGDefs = styled('svg')({
        display: 'block',
        position: 'absolute',
        height: 0,
        width:0,
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden'
})

export default function Header({logout, loading, runningMatch}) {
    const [menuAnchor, setMenuAnchor] = useState(null)

    const closeMenu = () => {setMenuAnchor(null)}

    const { user } = useContext(AuthContext)

    const navigate = useNavigate()
    const location = useLocation()

    const hog = <SVGDefs xmlns="http://www.w3.org/2000/svg">
        <symbol id="hog">
            <path d="M 20 38 q -12 -8, -10 -20 q 15 -5, 25 10" fill="#f06292"/>
            <path d="M 25 41 q -12 -8, -12 -20 q 13 -5, 23 10" fill="#ec407a"/>
            <path d="M 80 38 q 12 -8, 10 -20 q -15 -5, -25 10" fill="#f06292"/>
            <path d="M 75 41 q 12 -8, 12 -20 q -13 -5, -23 10" fill="#ec407a"/>
            <ellipse cx="50" cy="50" rx="40" ry="35" fill="#f06292" strokeWidth="0"/>
            <ellipse cx="50" cy="60" rx="15" ry="10" fill="transparent" stroke="black"></ellipse>
            <ellipse cx="44" cy="60" rx="3" ry="5"/>
            <ellipse cx="56" cy="60" rx="3" ry="5"/>
            <circle cx="38" cy="40" r="3"/>
            <circle cx="62" cy="40" r="3"/>
        </symbol> 
    </SVGDefs>

    const hideHeaderComponents = loading || !user

    let menuItems = [
        <MenuItem key="about" onClick={() => {closeMenu(); navigate('/about')}}>About</MenuItem>,
        <MenuItem key="lobby" onClick={() => {closeMenu(); navigate('/')}}>Lobby</MenuItem>,
        <MenuItem key="leaderboard" onClick={() => {closeMenu(); navigate('/leaderboard')}}>Leaderboard</MenuItem>,
    ]
    if (/(play|spectate)/.test(location.pathname)) {
        menuItems.push(<MenuItem key="leave" onClick={() => {closeMenu();  navigate('/')}}>Leave Game<Box ml={1} mb={-0.5}><ExitToAppIcon/></Box></MenuItem>)
    } else {
        menuItems.push(<MenuItem key="logout" onClick={() => {closeMenu(); logout()}}>Logout<Box ml={1} mb={-0.5}><ExitToAppIcon/></Box></MenuItem>)
    } 

    return <>
        {hog}
        <AppBar color="primary" position="sticky">
            <Toolbar sx={{justifyContent: 'space-between'}}>
                <Box display="flex" onClick={() => navigate('/')} sx={{cursor: 'pointer'}}>
                    <svg viewBox="0 0 100 100" height="56px"><use xlinkHref="#hog"/></svg> 
                    <Tooltip title="Lewis' House of Games">
                        <Typography variant="h3" sx={{ml: 1}}>LHoG</Typography>
                    </Tooltip>               
                </Box>
                <Typography variant="h4">{/(play|spectate)/.test(location.pathname) && runningMatch}</Typography>
                <Box display="flex">
                    <Typography sx={{mr: 2, alignSelf: 'center'}}>
                        {hideHeaderComponents ? '' : `Welcome ${user.username}`}
                    </Typography>
                    {hideHeaderComponents ? null : <IconButton
                        color="inherit"
                        onClick={(e) => {setMenuAnchor(e.currentTarget)}}
                        size="large"><MenuIcon/></IconButton>}
                    <Menu 
                        anchorEl={menuAnchor} 
                        open={Boolean(menuAnchor)} 
                        onClose={closeMenu}
                        keepMounted
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {menuItems}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    </>;
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    runningMatch: PropTypes.string,
}